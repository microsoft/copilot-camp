using Azure.AI.Projects;
using Azure.Identity;
using Microsoft.Agents.AI;
using Microsoft.Agents.AI.Foundry;
using Microsoft.Agents.Builder;
using Microsoft.Agents.Builder.App;
using Microsoft.Agents.Builder.State;
using Microsoft.Agents.Core.Models;
using Microsoft.Extensions.AI;

namespace ContosoHRAgent.Bot;

public class EchoBot : AgentApplication
{
    private readonly AIProjectClient _projectClient;
    private readonly string _agentName;

    public EchoBot(AgentApplicationOptions options, IConfiguration configuration) : base(options)
    {
        OnConversationUpdate(ConversationUpdateEvents.MembersAdded, WelcomeMessageAsync);

        // Listen for ANY message to be received. MUST BE AFTER ANY OTHER MESSAGE HANDLERS
        OnActivity(ActivityTypes.Message, OnMessageAsync);

        // Microsoft Foundry project endpoint
        string projectEndpoint = configuration["AIServices:ProjectEndpoint"];
        if (string.IsNullOrEmpty(projectEndpoint))
        {
            throw new InvalidOperationException("ProjectEndpoint is not configured.");
        }
        _projectClient = new AIProjectClient(new Uri(projectEndpoint), new AzureCliCredential());

        // Name of the agent you published in Microsoft Foundry
        _agentName = configuration["AIServices:AgentName"];
        if (string.IsNullOrEmpty(_agentName))
        {
            throw new InvalidOperationException("AgentName is not configured.");
        }
    }

    protected async Task WelcomeMessageAsync(ITurnContext turnContext, ITurnState turnState, CancellationToken cancellationToken)
    {
        foreach (ChannelAccount member in turnContext.Activity.MembersAdded)
        {
            if (member.Id != turnContext.Activity.Recipient.Id)
            {
                await turnContext.SendActivityAsync(MessageFactory.Text("Hello and Welcome!"), cancellationToken);
            }
        }
    }

    protected async Task OnMessageAsync(ITurnContext turnContext, ITurnState turnState, CancellationToken cancellationToken)
    {
        // send the initial message to the user
        await turnContext.StreamingResponse.QueueInformativeUpdateAsync("Working on it...", cancellationToken);

        // resolve the agent version published in Microsoft Foundry and wrap it as an AIAgent
        var agentRecord = await _projectClient.AgentAdministrationClient.GetAgentAsync(_agentName, cancellationToken);
        FoundryAgent agent = _projectClient.AsAIAgent(agentRecord);

        // retrieve the conversation id from the conversation state
        // this is set if the agent has been invoked before in the same conversation
        var conversationId = turnState.Conversation.ConversationId();

        // if there is no conversation id yet, start a new Foundry conversation
        // otherwise resume the existing one so the agent keeps its memory
        AgentSession session = string.IsNullOrEmpty(conversationId)
            ? await agent.CreateConversationSessionAsync(cancellationToken)
            : await agent.CreateSessionAsync(conversationId, cancellationToken);

        try
        {
            // increment the message count in state and queue the count to the user
            int count = turnState.Conversation.IncrementMessageCount();
            turnContext.StreamingResponse.QueueTextChunk($"({count}) ");

            // run the agent and stream the responses to the user
            await foreach (AgentResponseUpdate update in agent.RunStreamingAsync(
                turnContext.Activity.Text, session, cancellationToken: cancellationToken))
            {
                if (!string.IsNullOrEmpty(update.Text))
                {
                    turnContext.StreamingResponse.QueueTextChunk(update.Text);
                }

                // surface any document citations returned by the File Search tool
                foreach (AIContent content in update.Contents)
                {
                    var citations = content.Annotations?.OfType<CitationAnnotation>()
                        ?? Enumerable.Empty<CitationAnnotation>();

                    foreach (CitationAnnotation citation in citations)
                    {
                        var label = citation.Title ?? citation.FileId;
                        if (!string.IsNullOrEmpty(label))
                        {
                            turnContext.StreamingResponse.QueueTextChunk($" [{label}]");
                        }
                    }
                }
            }

            // persist the conversation id so the next turn resumes the same session
            if (session is ChatClientAgentSession chatSession && !string.IsNullOrEmpty(chatSession.ConversationId))
            {
                turnState.Conversation.ConversationId(chatSession.ConversationId);
            }
        }
        finally
        {
            // ensure we end the streaming response
            await turnContext.StreamingResponse.EndStreamAsync(cancellationToken);
        }
    }
}
