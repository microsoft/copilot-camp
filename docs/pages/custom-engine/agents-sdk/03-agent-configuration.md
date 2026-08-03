# Lab BMA3 - Connect your Foundry agent with Microsoft Agent Framework

<div data-widget="hero"
     data-badge="Path 1 · Lab BMA3"
     data-badge-color="purple"
     data-icon="🔗"
     data-subtitle="Wire your Microsoft Foundry agent into the Agents SDK host using Microsoft Agent Framework, and stream grounded, cited answers into Microsoft Teams."
     data-time="40-50 min"
     data-requires="Labs BMA1 and BMA2 completed"></div>

This is where the two halves come together. Your Foundry agent has the persona and the knowledge; your Agents SDK project has the host and the channel. **Microsoft Agent Framework** is the layer that connects them.

!!! note
    If you want to start directly from this lab without completing the previous ones, you can download the agent's complete source code (as it is at the end of the previous lab) [from here](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/agents-sdk/BMA2-complete&filename=BMA2-complete){target=_blank}. You still need the Microsoft Foundry agent you created in ["Lab BMA1"](../01-agent-in-foundry), and the prerequisites from ["Lab BMA0"](../00-prerequisites).

## Lab objectives

By the end of this lab you will be able to:

- Add Microsoft Agent Framework to a Microsoft 365 Agents SDK project
- Resolve a published Foundry agent as an `AIAgent` from .NET
- Stream responses and citations back to the user in real time
- Persist an `AgentSession` so the agent remembers the conversation
- Run the agent in Microsoft Teams

???+ info "Agent Framework replaces Semantic Kernel here"
    Microsoft Agent Framework is the successor to Semantic Kernel for agent development. If you followed an earlier version of this lab, the mapping is:

    | Semantic Kernel | Agent Framework |
    |---|---|
    | `AzureAIAgent` | `AIAgent` / `FoundryAgent` |
    | `InvokeStreamingAsync` | `RunStreamingAsync` |
    | `AgentResponseItem<StreamingChatMessageContent>` | `AgentResponseUpdate` |
    | `AzureAIAgentThread` | `AgentSession` |
    | `builder.Services.AddKernel()` | not required |

    There is no `Kernel` to configure, and the preview `SKEXP0110` warning no longer applies.

---

## Exercise 1: Add Agent Framework to the project

### Step 1: Install the NuGet packages

Right-click the **ContosoHRAgent** project and select **Manage NuGet Packages...**, then open the **Browse** tab and check **Include prerelease**.

Install these two packages:

| Package | Purpose |
|---|---|
| `Microsoft.Agents.AI.Foundry` | Agent Framework integration for Microsoft Foundry agents |
| `Azure.Identity` | Credentials used to authenticate to your Foundry project |

Your `ContosoHRAgent.csproj` should now contain:

```xml
<ItemGroup>
  <PackageReference Include="Azure.Identity" Version="1.21.0" />
  <PackageReference Include="Microsoft.Agents.AI.Foundry" Version="1.16.0-preview.260730.1" />
  <PackageReference Include="Microsoft.Agents.Authentication.Msal" Version="1.*" />
  <PackageReference Include="Microsoft.Agents.Hosting.AspNetCore" Version="1.*" />
</ItemGroup>
```

> `Microsoft.Agents.AI.Foundry` is published as a prerelease package because it depends on preview Foundry project APIs. Leave **Include prerelease** checked or the package won't appear.

<cc-end-step lab="bma3" exercise="1" step="1" />

### Step 2: Clean up Program.cs

Agent Framework doesn't need a `Kernel`. Open **Program.cs** and make sure the agent registration looks like this:

```csharp
// Add the bot (which is transient)
builder.AddAgent<EchoBot>();

var app = builder.Build();
```

If you're upgrading an existing project, **delete** these lines — they are Semantic Kernel leftovers and a duplicate storage registration:

```csharp
builder.Services.AddSingleton<IStorage, MemoryStorage>();
// Add the Semantic Kernel services 
builder.Services.AddKernel();
```

<cc-end-step lab="bma3" exercise="1" step="2" />

### Step 3: Track the conversation in state

Each Teams conversation maps to one Foundry conversation. Store its id in conversation state so the agent keeps its memory across turns.

Right-click the **ContosoHRAgent** project, select **Add > Class**, name it `ConversationStateExtensions.cs`, and replace the contents with:

```csharp
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

        public static string ConversationId(this ConversationState state) => state.GetValue<string>("conversationIdKey");

        public static void ConversationId(this ConversationState state, string value) => state.SetValue("conversationIdKey", value);
    }
}
```

<cc-end-step lab="bma3" exercise="1" step="3" />

---

## Exercise 2: Connect to your Foundry agent

### Step 1: Create the project client

Open **Bot/EchoBot.cs** and replace the `using` block at the top of the file with:

```csharp
using Azure.AI.Projects;
using Azure.Identity;
using Microsoft.Agents.AI;
using Microsoft.Agents.AI.Foundry;
using Microsoft.Agents.Builder;
using Microsoft.Agents.Builder.App;
using Microsoft.Agents.Builder.State;
using Microsoft.Agents.Core.Models;
using Microsoft.Extensions.AI;
```

Then replace the class fields and constructor with:

```csharp
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
```

> `AzureCliCredential` uses the identity from your `az login` session — ideal for local development. In production you'd switch to a managed identity.

<cc-end-step lab="bma3" exercise="2" step="1" />

### Step 2: Run the agent and stream the response

Replace the entire `OnMessageAsync` method with:

```csharp
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
```

???+ info "What happens in OnMessageAsync?"
    - **`GetAgentAsync(_agentName)`** looks up the agent version you published in Foundry — the instructions and knowledge stay server-side.
    - **`AsAIAgent(...)`** wraps that definition as an `AIAgent` you can run from .NET.
    - **`CreateConversationSessionAsync` / `CreateSessionAsync`** start or resume a Foundry conversation, which is what gives the agent memory across turns.
    - **`RunStreamingAsync`** yields `AgentResponseUpdate` objects as the model produces them, so text appears progressively instead of all at once.
    - **`CitationAnnotation`** exposes the documents the File Search tool used, so users can see where an answer came from.

<cc-end-step lab="bma3" exercise="2" step="2" />

### Step 3: Configure your Foundry connection

Open **appsettings.json** and add an `AIServices` section at the end of the configuration object:

```json
,
  "AIServices": {
    "AgentName": "<YourFoundryAgentName>",
    "ProjectEndpoint": "<YourProjectEndpoint>"
  }
```

Fill in the two values you recorded at the end of Lab BMA1:

| Setting | Value | Where to find it |
|---|---|---|
| `AgentName` | `Contoso HR Agent` | The **Name** field in the agent's **Setup** panel in Foundry |
| `ProjectEndpoint` | `https://<your-resource>.services.ai.azure.com/api/projects/<your-project>` | The project **Overview** page, under **Endpoints and keys** |

!!! warning "The agent name must match exactly"
    Agent Framework resolves the agent by name. A typo or a trailing space produces a "resource not found" error at runtime.

<cc-end-step lab="bma3" exercise="2" step="3" />

---

## Exercise 3: Run your agent in Microsoft Teams

### Step 1: Sign in to Azure

Open **Tools > Command Line > Developer Command Prompt** and run:

```
az login
```

Complete the sign-in in the browser window that opens. This is the identity `AzureCliCredential` will use to reach your Foundry project.

> Your account needs at least the **Foundry User** role on the Foundry project to invoke the agent.

<cc-end-step lab="bma3" exercise="3" step="1" />

### Step 2: Create a dev tunnel and select your account

Expand **Start** and select **Dev Tunnels > Create a Tunnel**:

- Select **Sign in** and **Work or school account**, using the same account as above.
- Name the tunnel `DevTunnel`.
- Keep the tunnel type **Temporary**.
- Set access to **Public**, then select **Create**.

Right-click the **M365Agent** project and select **Microsoft 365 Agents Toolkit > Select Microsoft 365 Account**, then choose the same account and select **Continue**.

Finally, change the startup item from **&lt;Multiple Startup Projects&gt;** to **Microsoft Teams (browser)**.

<cc-end-step lab="bma3" exercise="3" step="2" />

### Step 3: Test the grounded agent

Select **Start** or press **F5**. Microsoft Teams launches and your agent appears — select **Add**, then **Open**.

Ask the same questions you tested in the Foundry playground:

- What's the difference between Northwind Standard and Northwind Health Plus for emergency and mental health coverage?
- Can I use PerksPlus to pay for both a rock climbing class and a virtual fitness program?
- What values guide behavior and decision-making at Contoso Electronics?

**Expected result:**

- Answers match what you saw in the Foundry playground, because the instructions and knowledge live in Foundry.
- Text streams in progressively rather than appearing all at once.
- Each response is prefixed with the running message count.
- Follow-up questions like *"and what about dental?"* work, proving the `AgentSession` is being resumed.

!!! tip "Troubleshooting"
    - **"AgentName is not configured"** — the `AIServices` section is missing from `appsettings.json`.
    - **Resource not found** — the agent name doesn't match the name in Foundry exactly.
    - **Unauthorized** — re-run `az login`, or check your role assignment on the Foundry project.

<cc-end-step lab="bma3" exercise="3" step="3" />

---8<--- "b-congratulations.md"

You have completed Lab BMA3 - Connect your Foundry agent with Microsoft Agent Framework!

Your custom engine agent now runs in Microsoft Teams. In the final lab, you'll bring it into Microsoft 365 Copilot.

<cc-next url="../04-bring-agent-to-copilot" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/03-agent-configuration" />
