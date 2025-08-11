# Lab BMA3 - Integrate Azure AI Foundry Agent with M365 Agents SDK

In this lab, you’ll bring together the best of both worlds—combining the generative AI power of your Azure AI Foundry agent with the multi-channel flexibility of the Microsoft 365 Agents SDK. You’ll configure Semantic Kernel, set up agent properties, and securely connect to your Foundry-hosted agent to deliver rich, enterprise-aware answers directly in Microsoft Teams.

## Exercise 1: Configure agent properties and test on Teams

Now that you’ve created a basic bot, it’s time to enhance it with generative AI capabilities and upgrade it to an AI agent. In this exercise, you’ll install key libraries such as Semantic Kernel and prepare your agent to reason and respond more intelligently, ready for Teams or Copilot Chat.

### Step 1: Add Semantic Kernel Nuget Package

The package you'll add in this step will provide support for Azure AI integration. Right-click to **ContosoHRAgent** project and select **Manage Nuget Packages...**, select **Browse** tab and search for `Microsoft.SemanticKernel.Agents.AzureAI`. Select the package and select **Install**.

<cc-end-step lab="bma3" exercise="1" step="1" />

### Step 2: Add Semantic Kernel in Program.cs

Open **Program.cs** and add the following code snippet right before var app = builder.Build():

```
builder.Services.AddKernel();
```

This registers the Semantic Kernel, a core component that allows your agent to interact with generative AI models.

<cc-end-step lab="bma3" exercise="1" step="2" />

### Step 3: Add custom classes for document citations and message tracking

Right-click to **ContosoHRAgent** project and select **Add > Class** and define your class name as `FileReference.cs`. Replace the existing code with the following:

> This class defines the structure used when referencing specific documents in responses—useful when your agent cites content from uploaded files.

```
using Microsoft.Agents.Core.Models;
  
namespace ContosoHRAgent
{
    public class FileReference(string fileId, string fileName, string quote, Citation citation)
    {
        public string FileId { get; set; } = fileId;
        public string FileName { get; set; } = fileName;
        public string Quote { get; set; } = quote;
        public Citation Citation { get; set; } = citation;
    }
}
```

Right-click to **ContosoHRAgent** project and select **Add > Class** and define your class name as `ConversationStateExtensions.cs`. Replace existing the code with following:

> This class adds helper methods to manage and track the number of user messages—demonstrating how state is stored and modified during an ongoing conversation.

```
using Microsoft.Agents.Builder.State;
  
namespace ContosoHRAgent
{
 public static class ConversationStateExtensions
 {
     public static int MessageCount(this ConversationState state) => state.GetValue<int>("countKey");

     public static void MessageCount(this ConversationState state, int value) => state.SetValue("countKey", value);

     public static int IncrementMessageCount(this ConversationState state)
     {
         int count = state.GetValue<int>("countKey");
         state.SetValue("countKey", ++count);
         return count;
     }

     public static string ThreadId(this ConversationState state) => state.GetValue<string>("threadId");

     public static void ThreadId(this ConversationState state, string value) => state.SetValue("threadId", value);
 }
}
```

<cc-end-step lab="bma3" exercise="1" step="3" />

## Exercise 2: Integrate Azure AI Foundry Agent with M365 Agents SDK

You’ve built an agent using the M365 Agents SDK and configured it with generative AI capabilities. Now, you’ll connect this local agent to the Azure AI Foundry agent you created earlier. This enables your agent to respond using enterprise data and instructions stored in the Foundry project, bringing everything full circle.

### Step 1: Configure EchoBot.cs to Connect with Azure AI Foundry Agent

In this step, you’ll connect to the Azure AI Foundry agent by adding a client to fetch and invoke your Foundry-hosted model inside the EchoBot.cs.

In **ContosoHRAgent** project, open **Bot/EchoBot.cs** and add the following lines inside the EchoBot public class:

```
private readonly PersistentAgentsClient _projectClient;
private readonly string _agentId;
```

Replace the existing EchoBot constructor with the following: 

```
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
    _projectClient = new PersistentAgentsClient(projectEndpoint, new AzureCliCredential());

    // Azure AI Foundry Agent Id
    _agentId = configuration["AIServices:AgentID"];
    if (string.IsNullOrEmpty(_agentId))
    {
        throw new InvalidOperationException("AgentID is not configured.");
    }

}
```

Replace **OnMessageAsync** method with the following:

```
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

```

> **⚠️ Note:** When pasting the following code excerpt, you might see a warning (SKEXP0110) because this feature is still in preview. You can safely suppress this warning for now by right-clicking on AzureAIAgent, selecting **Quick Actions and Refactorings > Suppress or configure issues > Configure SKEXP0110 Severity > Silent**.
> 
> ![The Warning provided by Visual Studio when pasting code about a preview feature. There is the SKEXP0110 warning highlighted and the commands to silent related notifications.](https://github.com/user-attachments/assets/3dc267c0-c3b6-4436-9dc6-09157f9a8b5b)

???+ info "What happens in OnMessageAsync?"
    The *OnMessageAsync* method is the heart of your agent’s response logic. By replacing the default echo behavior, you’ve enabled your agent to send the user’s message to your Azure AI Foundry agent, stream the response back to the user in real time, track and attach citations and file references for transparency and add sensitivity and AI-generated labels for security and traceability.

<cc-end-step lab="bma3" exercise="2" step="1" />

### Step 2: Configure Azure AI Agent Service Keys

Add your Foundry connection details to appsettings.json, these values connect your M365 agent to the correct Foundry project and agent. In **ContosoHRAgent** project, open **appsettings.json** and add the following lines at the bottom of the appsettings list:

```
,
  "AIServices": {
   "AgentID": "<AzureAIFoundryAgentId>",
   "ProjectEndpoint": "<ProjectEndpoint>"
  }
```

> You can find these values in the **Overview** and **Agents Playground** sections of Azure AI Foundry.

Replace the **<AzureAIFoundryAgentId>** with your **Agent id** which can be found in **Agents Playground**.

![The Agents Playground of Azure AI Foundry with the Agent id field highlighted.](https://github.com/user-attachments/assets/13421287-d476-41c4-88df-bed1bff2f2f8)

Replace **<ProjectEndpoint>** with your AI Foundry project connection string which can be found in the **Overview** page of the AI Foundry, under Endpoints and keys.

Final version of the **appsettings.json** will look like below:

```
{
  "AgentApplicationOptions": {
    "StartTypingTimer": false,
    "RemoveRecipientMention": false,
    "NormalizeMentions": false
  },
  
  "TokenValidation": {
    "Audiences": [
      "{{ClientId}}" // this is the Client ID used for the Azure Bot
    ]
  },
  
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.Agents": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*",
  "Connections": {
    "BotServiceConnection": {
      "Settings": {
        "AuthType": "UserManagedIdentity", // this is the AuthType for the connection, valid values can be found in Microsoft.Agents.Authentication.Msal.Model.AuthTypes.
        "ClientId": "{{BOT_ID}}", // this is the Client ID used for the connection.
        "TenantId": "{{BOT_TENANT_ID}}",
        "Scopes": [
          "https://api.botframework.com/.default"
        ]
      }
    }
  },
  "ConnectionsMap": [
    {
      "ServiceUrl": "*",
      "Connection": "BotServiceConnection"
    }
  ],
  "AIServices": {
   "AgentID": "<AzureAIFoundryAgentId>",
   "ProjectEndpoint": "<ProjectEndpoint>"
  }
}
```

<cc-end-step lab="bma3" exercise="2" step="2" />

### Step 3: Test your agent on Teams

Open **Tools > Command Line > Developer Command Prompt** and run:

```
az login
```

A window will pop up on your browser and you'll need to sign into your Microsoft account to successfully complete az login.

Expand **Start** and select **Dev Tunnels > Create a Tunnel**:
 
* Select **Sign in** and **Work or school account**. Login with the same credentials mentioned above.
* Provide a name for your tunnel such as `DevTunnel`.
* Keep the Tunnel Type **Temporary**.
* Select Access as **Public** and then **Create**.

![The UI of Visual Studio to create a Dev Tunnel for the agent. There is a "Create a Tunnel" command highlighted.](https://github.com/user-attachments/assets/146fb3d4-256d-48b3-95a1-9e285f6bbc08)

Right click to **M365Agent** project, select **Microsoft 365 Agents Toolkit > Select Microsoft 365 Account**.

![The context menu of the the M365 Agents Toolkit when selecting the Microsoft 365 Account to use, highlighted in the screenshot.](https://github.com/user-attachments/assets/6981343d-8668-4b33-b36f-63b12739fc9d)

Select the same account as before and select **Continue** to use it. If your account doesn't show up automatically, select **Sign in** and **Work or school account**.
  
Expand the startup item on top of Visual Studio, where there is by default **<Multiple Startup Projects>**, and Select **Microsoft Teams (browser)**.

![The UI of Visual Studio when configuring Microsoft Teams (browser) for testing the agent in debug mode.](https://github.com/user-attachments/assets/0f564f0a-0394-49de-a679-6be59761b4fb)

You're now ready to run your integrated agent and test it live in Microsoft Teams. Make sure your dev tunnel is created and your account is authenticated.

Once Dev Tunnel is created, hit **Start** or **F5** to start debugging. Microsoft Teams will launch automatically, and your agent app will pop up on the window. Select **Add** and **Open** to start chatting with your agent.  

You can ask one of the following questions to interact with the agent:

* What’s the difference between Northwind Standard and Health Plus when it comes to emergency and mental health coverage?
* Can I use PerksPlus to pay for both a rock climbing class and a virtual fitness program?
* What values guide behavior and decision-making at Contoso Electronics?

You should observe that you are getting similar responses with the agent you've created on Azure AI Foundry.

![The Agent running in Microsoft Teams with evidence of the counter to count the number of interactions with the user.](https://github.com/user-attachments/assets/73ef491f-eaff-4743-bb2d-79a52a9ae301)

<cc-end-step lab="bma3" exercise="2" step="3" />

---8<--- "b-congratulations.md"

You have completed Lab BMA3 - Integrate Azure AI Foundry Agent with M365 Agents SDK!

You are now ready to proceed to Lab BMA4 - Bring your agent to Copilot Chat. Select Next.

<cc-next url="../04-bring-agent-to-copilot" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/03-agent-configuration" />