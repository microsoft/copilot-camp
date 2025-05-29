using Azure.AI.Agents.Persistent;
using Azure.Identity;
using Microsoft.Agents.Builder;
using Microsoft.Agents.Builder.App;
using Microsoft.Agents.Builder.State;
using Microsoft.Agents.Core.Models;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents;
using Microsoft.SemanticKernel.Agents.AzureAI;
using Microsoft.SemanticKernel.ChatCompletion;
  
namespace ContosoHRAgent.Bot;
  
public class EchoBot : AgentApplication
{
    private readonly PersistentAgentsClient _projectClient;
    private readonly string _agentId;
    public EchoBot(AgentApplicationOptions options, IConfiguration configuration) : base(options)
    {
  
        OnConversationUpdate(ConversationUpdateEvents.MembersAdded, WelcomeMessageAsync);
  
        // Listen for ANY message to be received. MUST BE AFTER ANY OTHER MESSAGE HANDLERS 
        OnActivity(ActivityTypes.Message, OnMessageAsync);
  
        // Azure AI Foundry Project ConnectionString
        string projectEndpoint = configuration["AIServices:ProjectEndpoint"];
        if (string.IsNullOrEmpty(projectEndpoint))
        {
            throw new InvalidOperationException("ProjectEndpoint is not configured.");
        }
        _projectClient = new PersistentAgentsClient(projectEndpoint, new DefaultAzureCredential());
        
        // Azure AI Foundry Agent Id
        _agentId = configuration["AIServices:AgentID"];
        if (string.IsNullOrEmpty(_agentId))
        {
            throw new InvalidOperationException("AgentID is not configured.");
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
        // get the Azure AI Agent
        var agentModel = await _projectClient.Administration.GetAgentAsync(_agentId, cancellationToken);
        var agent = new AzureAIAgent(agentModel, _projectClient);
        
        try
        {
            // send the initial message
            await turnContext.StreamingResponse.QueueInformativeUpdateAsync("Working on it...", cancellationToken);
  
            // increment the message count in state
            int count = turnState.Conversation.IncrementMessageCount();
            turnContext.StreamingResponse.QueueTextChunk($"({count}) ");
  
            var fileReferences = new List<FileReference>();
            var citations = new List<Citation>();
            var quote = string.Empty;
  
            // create the chat message to send to the agent
            var message = new ChatMessageContent(AuthorRole.User, turnContext.Activity.Text);
  
            // stream the response from the agent to the user
            await foreach (StreamingChatMessageContent chunk in agent.InvokeStreamingAsync(message, cancellationToken: cancellationToken))
            {
                // get the annotation content from the message chunk items, if there are any
                var annotations = chunk.Items.OfType<StreamingAnnotationContent>();
                foreach (StreamingAnnotationContent annotation in annotations)
                {
                    // check if the file reference already exists in the list and skip it if it does
                    if (fileReferences.Any(fr => fr.Quote == annotation.Label)) { continue; }
  
                    var agentFile = await agent.Client.Files.GetFileAsync(annotation.ReferenceId, cancellationToken);
                    var citation = new Citation(string.Empty, agentFile.Value.Filename, "https://m365.cloud.microsoft/chat");
  
                    var fileReference = new FileReference(agentFile.Value.Id, agentFile.Value.Filename, annotation.Label, citation);
                    fileReferences.Add(fileReference);
                }
  
                // if the message chunk content is empty, we can skip it
                // this happens when the chunk contains StreamingAnnotationContent items
                if (chunk.Content == null) { continue; }
  
                // if the previous message chunk contained the citation quote, we can process it now
                if (quote != string.Empty)
                {
                    var fileReferenceIndex = fileReferences.FindIndex(fr => fr.Quote == quote);
                    turnContext.StreamingResponse.QueueTextChunk($" [{fileReferenceIndex + 1}] ");
  
                    // reset the quote to empty string to avoid processing it again
                    quote = string.Empty;
                    continue;
                }
  
                // if the message chunk contains an annotation quote 【4:0†source】
                // store the value for the next message chunk so we can process it
                // we don't want to send it to the user yet
                if (chunk.Content.Contains('【'))
                {
                    quote = chunk.Content;
                    continue;
                }
                else
                {
                    // just a regular message chunk, we can send it to the user
                    turnContext.StreamingResponse.QueueTextChunk(chunk.Content);
                }
            }
  
            // enable generated by AI label
            turnContext.StreamingResponse.EnableGeneratedByAILabel = true;
  
            // add sensitivity label
            turnContext.StreamingResponse.SensitivityLabel = new SensitivityUsageInfo()
            {
                Name = "General",
                Description = "Business data which is NOT meant for public consumption. This can be shared with internal employees, business guests and external partners as needed."
            };
  
            // add citations
            foreach (var fileReference in fileReferences)
            {
                citations.Add(fileReference.Citation);
            }
            turnContext.StreamingResponse.AddCitations(citations);
        }
        finally
        {
            await turnContext.StreamingResponse.EndStreamAsync(cancellationToken);
        }
    }
}

