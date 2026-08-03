# Lab BAF1 - Build and Run Your First Agent

<div data-widget="hero"
     data-badge="Path 2 · Lab BAF1"
     data-badge-color="teal"
     data-icon="🏗️"
     data-subtitle="Clone the Zava Insurance starter solution, understand how an Agent Framework agent is wired together, and run it live in Microsoft 365 Copilot."
     data-time="40-50 min"
     data-requires="Lab BAF0 completed"></div>

In this lab you'll build and run a custom engine agent using the **Microsoft 365 Agents SDK** with **Microsoft Agent Framework**. You'll explore the starter project, understand the core components, and see your agent come to life in Microsoft 365 Copilot.

The **Zava Insurance Agent** helps insurance adjusters streamline claims processing. In this first lab you'll start with a basic conversational agent that greets users and answers with AI-powered responses. In the labs that follow you'll ground it in real enterprise data.

???+ info "What are the Microsoft 365 Agents SDK and Agent Framework?"
    **Microsoft 365 Agents SDK** provides the container and scaffolding to deploy agents across Microsoft 365 channels (Teams, Copilot, and more), handling activities, events, and communication. It's AI-agnostic, so you can use any AI services you choose.

    **Microsoft Agent Framework** is an open-source development kit for building AI agents with LLMs, tool calling, and multi-agent workflows. It's the successor to Semantic Kernel and AutoGen, and provides the AI capabilities and agent logic.

    Together, they let you build intelligent agents with Agent Framework and deliver them to Microsoft 365 using the Agents SDK.

## Lab objectives

By the end of this lab you will be able to:

- Explain how an agent, its instructions, and its tools fit together in Agent Framework
- Configure an agent project with your Microsoft Foundry model credentials
- Run and debug a custom engine agent locally
- Test the agent inside Microsoft 365 Copilot
- Customize the agent's behavior and see the change live

---

## Exercise 1: Clone and explore the project

### Step 1: Clone the repository

1. Open a terminal or command prompt.
1. Clone the repository and move into the starter project:

```bash
git clone https://github.com/microsoft/copilot-camp.git
cd copilot-camp/src/agent-framework/begin
```

1. Open the project in Visual Studio Code:

```bash
code .
```

You should see this structure:

```
begin/
├── src/
│   ├── Agent/
│   │   └── ZavaInsuranceAgent.cs       # Main agent implementation
│   ├── Plugins/                        # Custom plugins (tools) for the agent
│   │   ├── StartConversationPlugin.cs  # Welcome message plugin
│   │   └── DateTimeFunctionTool.cs     # Date/time utility
├── appPackage/                         # Teams app manifest and icons
├── env/                                # Environment configuration files
├── infra/                              # Scripts, data and templates for the agent's infrastructure
├── Program.cs                          # Application entry point
├── InsuranceAgent.csproj               # Project file
└── m365agents.local.yml                # M365 Agents provisioning config
```

<cc-end-step lab="baf1" exercise="1" step="1" />

### Step 2: Understand the agent and its tools

Open `src/Agent/ZavaInsuranceAgent.cs` and locate these three things:

| What to find | Why it matters |
|---|---|
| The `AgentInstructions` property | The system prompt. It defines the agent's role and lists its tools using the `{{PluginName.FunctionName}}` syntax. |
| The **constructor** | Registers `OnConversationUpdate(...)` for the welcome message and `OnActivity(ActivityTypes.Message, ...)` for every user message. |
| The `GetClientAgent` method | Builds a `ChatOptions` with a `Tools` list and registers each plugin with `AIFunctionFactory.Create(...)`. This is how the AI learns what it can call. |

Now open `src/Plugins/StartConversationPlugin.cs`:

```csharp
public class StartConversationPlugin
{
    [Description("Starts a new conversation suggesting a conversation flow.")]
    public async Task<string> StartConversation()
    {
        var welcomeMessage = "👋 Welcome to Zava Insurance Claims Assistant!...";
        return welcomeMessage;
    }
}
```

The `[Description]` attribute is the critical part — it tells the model **when** to use the tool. Open `src/Plugins/DateTimeFunctionTool.cs` and notice it follows the same pattern with a static `getDate()` method.

<cc-end-step lab="baf1" exercise="1" step="2" />

### Step 3: Review the host and the manifest

Open `Program.cs` and find these registrations:

- `AddSingleton<IStorage, MemoryStorage>()` — conversation state storage
- `AddAgentApplicationOptions()` — agent configuration
- `AddAgent<ZavaInsuranceAgent>()` — the agent itself
- The `IChatClient` singleton — creates an `AzureOpenAIClient` from your endpoint, key, and deployment name, which is what powers the agent's reasoning

Then open `appPackage/manifest.json` and review the `conversationStarters` array — these are the suggested prompts users see on first use — and the `copilotAgents` section that declares this app as a custom engine agent.

<cc-end-step lab="baf1" exercise="1" step="3" />

---

## Exercise 2: Configure the agent

### Step 1: Create your environment files

The agent reads configuration from environment files. Copy both samples:

**Windows PowerShell:**
```powershell
Copy-Item env/.env.local.sample env/.env.local
Copy-Item env/.env.local.user.sample env/.env.local.user
```

**macOS/Linux:**
```bash
cp env/.env.local.sample env/.env.local
cp env/.env.local.user.sample env/.env.local.user
```

<cc-end-step lab="baf1" exercise="2" step="1" />

### Step 2: Add your Microsoft Foundry credentials

1. Open `env/.env.local` and set `MODELS_ENDPOINT` to the endpoint from Lab BAF0:

```bash
MODELS_ENDPOINT=https://your-resource.services.ai.azure.com/
```

1. Open `env/.env.local.user` and set your API key:

```bash
SECRET_MODELS_API_KEY=your-api-key-here
```

!!! tip "Finding your endpoint"
    Go to [Microsoft Foundry](https://ai.azure.com){target=_blank}, select your project, then **Settings → Properties**, and copy the **Endpoint** URL.

!!! warning "Keep your API key secret"
    `.env.local.user` contains sensitive information and is already listed in `.gitignore`. Never commit it.

<cc-end-step lab="baf1" exercise="2" step="2" />

### Step 3: Sign in to Microsoft 365 and Azure

1. In Visual Studio Code, select the **Microsoft 365 Agents Toolkit** icon in the Activity Bar.
1. In the **ACCOUNTS** section, select **Sign in to Microsoft 365** and complete the flow.
1. Select **Sign in to Azure** and complete the flow.

**Expected result:** both accounts show as signed in in the ACCOUNTS section.

!!! note "First time sign-in"
    You may be asked to grant permissions to the Microsoft 365 Agents Toolkit extension.

<cc-end-step lab="baf1" exercise="2" step="3" />

---

## Exercise 3: Run, test, and customize

### Step 1: Start the agent

1. Set the debug configuration to **(Preview) Debug in Copilot (Edge)**, then press **F5**.
1. On first run, the Agents Toolkit provisions Azure resources — it will ask you to pick an **Azure subscription**, a **resource group**, and a **region** (choose one close to your Microsoft Foundry project). This takes 2-3 minutes and creates an **Azure Bot Service**, an **App Registration**, and a **Dev Tunnel**.
1. Watch the **Terminal** output.

**Expected result:** the terminal shows:

```
🌍 Environment: local
🏢 Starting Zava Insurance Agent...
🤖 Main agent using model: gpt-4.1
✅ Agent initialized successfully!
```

A browser opens with Microsoft 365 Copilot and an install dialog. Select **Add**, then **Open in Copilot**.

<cc-end-step lab="baf1" exercise="3" step="1" />

### Step 2: Test the agent

Your agent appears with its conversation starters.

Try each of these and observe which tool the agent chooses:

| Prompt | Expected behavior |
|---|---|
| *What can you do?* | Calls `StartConversationPlugin` and returns the welcome message |
| *What's today's date?* | Calls `DateTimeFunctionTool` and returns the current date and time |
| *Tell me about insurance claims* | Answers from the model's own knowledge — no tool call |
| *What's the weather today?* | Politely declines as out of scope |

Check the **Debug Console** in Visual Studio Code to see the plugin calls and message processing in real time.

!!! warning "Issue processing the user's prompt"
    If the agent replies with raw text such as `{{StartConversationPlugin.StartConversation}}`, slightly reword the agent instructions in `src/Agent/ZavaInsuranceAgent.cs`, stop all running processes, and press F5 again. If it persists you can safely continue — later exercises address it.

<cc-end-step lab="baf1" exercise="3" step="2" />

### Step 3: Customize the welcome message

1. Stop the debugger with **Shift+F5**.
1. Open `src/Plugins/StartConversationPlugin.cs` and find the `welcomeMessage` variable.
1. Change the first line to `"👋 Welcome! I'm [Your Name]'s Agent!\n\n"`.
1. Save, press **F5**, and type **"start over"** in Microsoft 365 Copilot.

**Expected result:** your customized greeting appears, confirming that changing a plugin changes what the agent says.

<cc-end-step lab="baf1" exercise="3" step="3" />

---8<--- "b-congratulations.md"

You have completed Lab BAF1 - Build and Run Your First Agent!

You've learned how to:

- ✅ Explore an Agent Framework project and its plugin model
- ✅ Configure the agent with Microsoft Foundry credentials
- ✅ Run and debug the agent locally
- ✅ Test the agent in Microsoft 365 Copilot
- ✅ Customize the agent's behavior

Your agent can hold a conversation — but it doesn't know anything about Zava's actual claims yet. In the next lab you'll ground it with a **Foundry IQ** knowledge base.

<cc-next url="../02-add-claim-search" />

<cc-award badgeId="CustomEngineRanger" badgeName="Custom Engine Ranger" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/01-build-and-run" />
