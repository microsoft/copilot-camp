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

        // Microsoft Foundry Project ConnectionString
        string projectEndpoint = configuration["AIServices:ProjectEndpoint"];
        if (string.IsNullOrEmpty(projectEndpoint))
        {
            throw new InvalidOperationException("ProjectEndpoint is not configured.");
        }
        _projectClient = new PersistentAgentsClient(projectEndpoint, new AzureCliCredential());

        // Microsoft Foundry Agent Id
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
       // send the initial message to the user
       await turnContext.StreamingResponse.QueueInformativeUpdateAsync("Working on it...", cancellationToken);

       // get the agent definition from the project
       var agentDefinition = await _projectClient.Administration.GetAgentAsync(_agentId, cancellationToken);

       // initialize a new agent instance from the agent definition
       var agent = new AzureAIAgent(agentDefinition, _projectClient);

       // retrieve the threadId from the conversation state
       // this is set if the agent has been invoked before in the same conversation
       var threadId = turnState.Conversation.ThreadId();

       // if the threadId is not set, we create a new thread
       // otherwise, we use the existing thread
       var thread = string.IsNullOrEmpty(threadId)
           ? new AzureAIAgentThread(_projectClient)
           : new AzureAIAgentThread(_projectClient, threadId);

       try
       {
           // increment the message count in state and queue the count to the user
           int count = turnState.Conversation.IncrementMessageCount();
           turnContext.StreamingResponse.QueueTextChunk($"({count}) ");

           // create the user message to send to the agent
           var message = new ChatMessageContent(AuthorRole.User, turnContext.Activity.Text);

           // invoke the agent and stream the responses to the user
           await foreach (AgentResponseItem<StreamingChatMessageContent> agentResponse in agent.InvokeStreamingAsync(message, thread, cancellationToken: cancellationToken))
           {
               // if the threadId is not set, we set it from the agent response
               // and store it in the conversation state for future use
               if (string.IsNullOrEmpty(threadId))
               {
                   threadId = agentResponse.Thread.Id;
                   turnState.Conversation.ThreadId(threadId);
               }

               turnContext.StreamingResponse.QueueTextChunk(agentResponse.Message.Content);
           }
       }
       finally
       {
           // ensure we end the streaming response
           await turnContext.StreamingResponse.EndStreamAsync(cancellationToken);
       }
   }
}

