# Lab BAF7 - Add MCP Tools Integration

In this lab, you'll extend your Zava Insurance Agent with Model Context Protocol (MCP) tools. You'll create an MCP server using Azure Functions that provides claims adjuster management capabilities, then consume those tools from a custom plugin in your Custom Engine Agent.

!!! note
    If you want to start directly from this lab without completing the previous ones, you can download the agent’s complete source code (as it is at the end of the previous lab) [from here](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/agent-framework/BAF6-complete&filename=BAF6-complete){target=_blank}. However, remember to complete the pre-requisites described in lab ["Lab BAF0 - Prerequisites"](../00-prerequisites), in lab ["Lab BAF3 - Add Vision Analysis"](../03-add-vision-analysis/#exercise-1-update-prerequisites), and in lab ["Lab BAF6 - Add Microsoft 365 Work IQ API Integration"](../06-add-copilot-api/#exercise-1-set-up-sharepoint-site-with-policy-documents).

???+ info "Understanding MCP Integration"
    The **Model Context Protocol (MCP)** enables your agent to:
    
    - **Connect to External Tools**: Use standardized protocol to access tools from MCP servers
    - **Manage Claims Adjusters**: List adjusters by area of expertise and country
    - **Assign Adjusters to Claims**: Automatically assign the right adjuster based on claim type
    - **Leverage Azure Functions**: Host MCP tools as serverless functions for scalability
    
    This integration demonstrates how to extend your agent's capabilities using the MCP ecosystem.

<hr />

## Overview

In previous labs, you added claims search, vision analysis, policy search, and communication capabilities. Now you'll extend your agent with MCP tools to manage claims adjusters - a common requirement in insurance workflows where claims need to be routed to specialized adjusters based on claim type and location.

The **Model Context Protocol (MCP)** is an open standard that enables AI applications to connect to external data sources and tools. By creating an MCP server with Azure Functions, you can expose business logic as tools that any MCP-compatible agent can consume.

???+ note "What You'll Build"
    - **MCP Server**: An Azure Function app that exposes claims adjuster tools via MCP
    - **ClaimsAdjustersPlugin**: A plugin that consumes MCP tools to list and assign adjusters
    - **Agent Integration**: Wire up the plugin to enable adjuster management in conversations

## Exercise 1: Setting up the MCP Server

In this exercise you are going to setup a pre-built MCP server that provides claims adjuster management functionality. The server is based on Azure Functions with TypeScript and uses Azure Table Storage to store claims adjuster records.

### Step 1: Understanding the MCP Server and Prerequisites

The Insurance MCP server is a ready-to-use Azure Functions application that exposes claims adjuster management tools via the Model Context Protocol. It provides the following tools:

- **get_claims_adjusters**: Retrieves a list of all claims adjusters with optional filters by country and area of expertise
- **get_claims_adjuster**: Retrieves a specific claims adjuster by ID
- **assign_claim_adjuster**: Assigns a claims adjuster to an insurance claim

??? note "How MCP Server Works"
    The MCP server exposes tools that can be called by MCP clients. Each tool has:
    
    - **Tool Name**: Unique identifier (e.g., `get_claims_adjusters`)
    - **Description**: Helps the LLM understand when to use the tool
    - **Properties**: Input parameters with types and descriptions
    - **Handler**: Function that executes when the tool is called
    
    Azure Functions provides a convenient hosting model for MCP servers, with built-in support for the MCP protocol via the native MCP protocol binding.

The MCP server architecture consists of:

1. **Data Storage**: Azure Table Storage for claims adjuster records
2. **HTTP Handlers**: REST endpoints for direct API access
3. **MCP Tool Handlers**: Functions registered as MCP tools for agent consumption

Before starting, make sure you have:

- [Node.js v22 or higher](https://nodejs.org/en){target=_blank}
- [Azure Functions Core Tools v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local){target=_blank}
- [Visual Studio Code](https://code.visualstudio.com/){target=_blank}
- [Dev tunnel](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank}
- [Azurite](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite){target=_blank} - Azure Storage emulator (install via `npm install -g azurite`)

<cc-end-step lab="baf7" exercise="1" step="1" />

### Step 2: Downloading and Reviewing the MCP Server

For this lab, you will use a pre-built Insurance MCP server. Download the server files [from here](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/agent-framework/insurance-mcp&filename=insurance-mcp){target=_blank}.

1️⃣ Extract the files from the zip to a local folder on your machine.

2️⃣ Open the extracted folder in Visual Studio Code:

```bash
cd insurance-mcp
code .
```

3️⃣ Review the project structure in Visual Studio Code. The main elements of the project outline are:

- `src/functions`: Folder containing the Azure Functions with MCP tool implementations
- `data`: Folder with sample claims adjuster data for initialization
- `env`: Folder for environment configuration files
- `package.json`: Project dependencies and npm scripts
- `host.json`: Azure Functions host configuration

!!! info
    The MCP server includes pre-configured VS Code tasks that automate the build process, start a dev tunnel, and run the Azure Functions locally. This simplifies the development experience by allowing you to start everything with a single **F5** press.

<cc-end-step lab="baf7" exercise="1" step="2" />

### Step 3: Configuring the Environment

Before running the MCP server, you need to configure your Azure Table Storage connection.

1️⃣ In the `env` folder, copy the `.env.local.sample` file to a new file named `.env.local`:

**Windows PowerShell:**
```powershell
Copy-Item env/.env.local.sample env/.env.local
```

**macOS/Linux:**
```bash
cp env/.env.local.sample env/.env.local
```

2️⃣ Edit the `env/.env.local` file and fill in your Azure Table Storage details, targeting the local emulator via Azurite:

```bash
# Azure Table Storage Configuration
AZURE_STORAGE_ACCOUNT=devstoreaccount1
AZURE_TABLE_ENDPOINT=http://127.0.0.1:10012/devstoreaccount1
TABLE_NAME=ClaimAdjusters
ALLOW_INSECURE_CONNECTION=true

# DevTunnel Configuration
TUNNEL_ID=
```

3️⃣ Copy the `.env.local.user.sample` file to a new file named `.env.local.user`:

**Windows PowerShell:**
```powershell
Copy-Item env/.env.local.user.sample env/.env.local.user
```

**macOS/Linux:**
```bash
cp env/.env.local.user.sample env/.env.local.user
```

4️⃣ Edit the `env/.env.local.user` file and fill in your Azure Storage account key:

```bash
# Azure Table Storage Configuration
SECRET_AZURE_STORAGE_KEY=your_storage_account_key
```

Since in this lab we are using the Azurite local storage emulator, the storage key is always the same as per the [official documentation](https://learn.microsoft.com/en-us/azure/storage/common/storage-configure-connection-string#configure-a-connection-string-for-azurite){target=_blank} and the value should be like the following:

```bash
# Azure Table Storage Configuration
SECRET_AZURE_STORAGE_KEY=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==
```

!!! warning "Keep Secrets Secure"
    The `.env.local.user` file contains sensitive credentials and should never be committed to source control. It is already included in `.gitignore` to prevent accidental commits.

<cc-end-step lab="baf7" exercise="1" step="3" />

### Step 4: Running the MCP Server with Dev Tunnel

The project includes pre-configured VS Code tasks that automate starting Azurite, the dev tunnel, installing npm dependencies, and running the Azure Functions locally.

1️⃣ If you haven't already installed dev tunnel, follow [these instructions](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank}.

2️⃣ Press **F5** in Visual Studio Code to start the MCP server.

The pre-configured VS Code tasks will automatically:

- Start Azurite (Azure Storage emulator) for local development
- Install npm dependencies
- Build the TypeScript project
- Create and start the dev tunnel
- Launch the Azure Functions runtime
- Install, run, and open the MCP Inspector in your browser for testing and debugging MCP tools

!!! warning "Permission denied error on MacOS"
    If you receive the following error message while creating the devtunnel in the **Ensure DevTunnel** task, you need to grant execution rights to the scripts needed by the Visual Studio Code tasks executing the following commands in the terminal window integrated in Visual Studio Code:
    
    ```
    cd infra/scripts
    ```

    and then:

    ```
    chmod +x devtunnel.sh
    ```
    

3️⃣ Once the server is running, select the terminal window with name `Ensure DevTunnel` note the dev tunnel URL displayed in the terminal just beside the **Connect via browser**: https://devtunnel-host.devtunnels.ms
 (e.g., `https://devtunnel-host.devtunnels.ms`). Your MCP server endpoint URL will be:

```text
https://devtunnel-host.devtunnels.ms/runtime/webhooks/mcp
```

!!! tip "Keep the Server Running"
    Keep both the MCP server and dev tunnel running throughout this lab. The tunnel remains active as long as VS Code is running the debug session. If you need to restart, simply press **F5** again.

<cc-end-step lab="baf7" exercise="1" step="4" />

## Exercise 2: Configure MCP Client in the Agent

Now let's configure the Custom Engine Agent to connect to your MCP server.

### Step 1: Add MCP Client Configuration

1️⃣ Open your `.env.local` file in the agent project.

2️⃣ Add the MCP server configuration using your dev tunnel URL from Exercise 1:

```bash
# MCP Server Configuration
MCP_SERVER_URL=https://devtunnel-host.devtunnels.ms/runtime/webhooks/mcp
```

!!! note
    Replace `devtunnel-host` with the actual tunnel URL copied from the terminal when you started the MCP server in Exercise 1.

<cc-end-step lab="baf7" exercise="2" step="1" />

### Step 2: Register MCP Client in Dependency Injection

1️⃣ Open a new Terminal under your agent project root and install the ModelContextProtocol NuGet package by running the following script:

```bash
dotnet add package ModelContextProtocol --version 0.4.1-preview.1
```

2️⃣ Open `src/Program.cs` in your agent project.

3️⃣ Add the required using statements at the top of the file:

```csharp
using ModelContextProtocol.Client;
using ModelContextProtocol.Protocol;
```

4️⃣ Find where other services (VisionService, LanguageModelService etc.) are registered and add the MCP client registration:

```csharp
// Register MCP Client for claims adjusters
builder.Services.AddSingleton<McpClient>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var mcpServerUrl = configuration["MCP_SERVER_URL"] 
        ?? throw new InvalidOperationException("MCP_SERVER_URL is not configured");

    var clientTransport = new HttpClientTransport(new HttpClientTransportOptions {
        Endpoint = new Uri(mcpServerUrl)});

    return McpClient.CreateAsync(clientTransport).GetAwaiter().GetResult();
});
```

<cc-end-step lab="baf7" exercise="2" step="2" />

## Exercise 3: Create the ClaimsAdjustersPlugin

Now let's create the plugin that consumes MCP tools to manage claims adjusters.

### Step 1: Create ClaimsAdjustersPlugin

??? note "What this plugin does"
    The `ClaimsAdjustersPlugin` provides two main capabilities:
    
    **ListClaimsAdjustersAsync**:
    
    - Retrieves claims adjusters filtered by claim type and country
    - Validates claim types (only "Auto" and "Homeowners" supported)
    - Calls the MCP server's `get_claims_adjusters` tool
    
    **AssignClaimAdjusterAsync**:
    
    - Assigns a specific adjuster to a claim
    - Returns assignment confirmation with assignment ID
    - Calls the MCP server's `assign_claim_adjuster` tool

1️⃣ Create a new file `src/Plugins/ClaimsAdjustersPlugin.cs` with the following implementation:

```csharp
using Microsoft.Agents.Builder;
using Microsoft.Agents.Core.Models;
using System.ComponentModel;
using System.Text.Json;
using InsuranceAgent;
using Microsoft.Agents.Builder.State;
using ModelContextProtocol.Client;

namespace ZavaInsurance.Plugins
{
    /// <summary>
    /// Claims Adjusters Plugin for Zava Insurance
    /// Provides tools for managing and retrieving claims adjuster information via MCP.
    /// </summary>
    public class ClaimsAdjustersPlugin
    {
        private readonly ITurnContext _turnContext;
        private readonly McpClient _mcpClient;
        private readonly IConfiguration _configuration;

        public ClaimsAdjustersPlugin(ITurnContext turnContext,
            McpClient mcpClient, 
            IConfiguration configuration)
        {
            _turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
            _mcpClient = mcpClient ?? throw new ArgumentNullException(nameof(mcpClient));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Retrieves claims adjusters based on claim type and country.
        /// </summary>
        /// <param name="claimType">The claim type to filter claims adjusters (Auto or Homeowners)</param>
        /// <param name="country">The country to filter claims adjusters</param>
        /// <returns>A list of claims adjusters matching the criteria</returns>
        [Description("Retrieves claims adjusters based on area and country")]
        public async Task<string> ListClaimsAdjustersAsync(string claimType, string country)
        {
            await NotifyUserAsync($"Retrieving claims adjusters for area {claimType} and country {country}...");

            // Validate claim type - only "Auto" and "Homeowners" are supported
            if (claimType != "Auto" && claimType != "Homeowners")
            {
                claimType = null;
            }

            // Validate country
            if (country == "All")
            {
                country = null;
            }

            var result = await _mcpClient.CallToolAsync("get_claims_adjusters", 
                new Dictionary<string, object?> {                 
                    ["area"] = claimType, 
                    ["country"] = country
                }
            );

            if (!result.IsError.HasValue || result.IsError.HasValue && !result.IsError.Value)
            {
                var adjusters = result.Content;
                return JsonSerializer.Serialize(adjusters, new JsonSerializerOptions { WriteIndented = true });
            }
            else
            {
                return $"Error retrieving claims adjusters!";
            }
        }

        /// <summary>
        /// Assigns a claims adjuster to a specific claim.
        /// </summary>
        /// <param name="claimId">The ID of the claim</param>
        /// <param name="adjusterId">The ID of the claims adjuster</param>
        /// <returns>Confirmation message of assignment</returns>
        [Description("Assigns a claims adjuster to a specific claim")]
        public async Task<string> AssignClaimAdjusterAsync(string claimId, string adjusterId)
        {
            await NotifyUserAsync($"Assigning claims adjuster {adjusterId} to claim {claimId}...");

            var result = await _mcpClient.CallToolAsync("assign_claim_adjuster", 
                new Dictionary<string, object?> {                 
                    ["claimId"] = claimId, 
                    ["adjusterId"] = adjusterId
                }
            );

            if (!result.IsError.HasValue || result.IsError.HasValue && !result.IsError.Value)
            {
                var adjusters = result.Content;
                return JsonSerializer.Serialize(adjusters, new JsonSerializerOptions { WriteIndented = true });
            }
            else
            {
                return $"Error assigning claims adjuster!";
            }
        }

        private async Task NotifyUserAsync(string message)
        {
            if (!_turnContext.Activity.ChannelId.Channel!.Contains(Channels.Webchat))
            {
                await _turnContext.StreamingResponse.QueueInformativeUpdateAsync(message);
            }
            else
            {
                await _turnContext.StreamingResponse.QueueInformativeUpdateAsync(message).ConfigureAwait(false);
            }
        }
    }
}
```

<cc-end-step lab="baf7" exercise="3" step="1" />

## Exercise 4: Register ClaimsAdjustersPlugin in Agent

Now let's wire up the ClaimsAdjustersPlugin in your ZavaInsuranceAgent.

### Step 1: Update Agent Constructor

1️⃣ Open `src/Agent/ZavaInsuranceAgent.cs`.

2️⃣ Add the required using statement at the top of the file:

```csharp
using ModelContextProtocol.Client;
```

3️⃣ Find the class fields section and add the MCP client field:

```csharp
private readonly McpClient _mcpClient = null;
```

4️⃣ Update the constructor to accept and store the MCP client:

```csharp
public ZavaInsuranceAgent(AgentApplicationOptions options, IChatClient chatClient, IConfiguration configuration, IServiceProvider serviceProvider, IHttpClientFactory httpClientFactory, McpClient mcpClient) : base(options)
{
    _chatClient = chatClient;
    _configuration = configuration;
    _serviceProvider = serviceProvider;
    _httpClient = httpClientFactory.CreateClient() ?? throw new ArgumentNullException(nameof(httpClientFactory));
    _mcpClient = mcpClient;

    // Greet when members are added to the conversation
    OnConversationUpdate(ConversationUpdateEvents.MembersAdded, WelcomeMessageAsync);

    // Listen for ANY message to be received
    OnActivity(ActivityTypes.Message, OnMessageAsync, autoSignInHandlers: [UserAuthorization.DefaultHandlerName]);
}
```

<cc-end-step lab="baf7" exercise="4" step="1" />

### Step 2: Instantiate ClaimsAdjustersPlugin

1️⃣ Find the `GetClientAgent` method (where other plugins are instantiated).

2️⃣ Add the `ClaimsAdjustersPlugin` instantiation after other plugins:

```csharp
// Create ClaimsAdjustersPlugin with MCP client
ClaimsAdjustersPlugin claimsAdjustersPlugin = new(context, _mcpClient, _configuration);
```

<cc-end-step lab="baf7" exercise="4" step="2" />

### Step 3: Register ClaimsAdjusters Tools

In the same `GetClientAgent` method, find where tools are added to `toolOptions.Tools` and add the claims adjusters tools:

```csharp
// Register Claims Adjusters MCP tools
toolOptions.Tools.Add(AIFunctionFactory.Create(claimsAdjustersPlugin.ListClaimsAdjustersAsync));
toolOptions.Tools.Add(AIFunctionFactory.Create(claimsAdjustersPlugin.AssignClaimAdjusterAsync));
```

<cc-end-step lab="baf7" exercise="4" step="3" />

### Step 4: Update Agent Instructions

Update the agent instructions to include claims adjuster capabilities.

1️⃣ Find the `AgentInstructions` field in `ZavaInsuranceAgent.cs`.

2️⃣ Add the claims adjuster tools to the instructions:

```csharp
private readonly string AgentInstructions = """
        You are a professional insurance claims assistant for Zava Insurance.

        Whenever the user starts a new conversation or provides a prompt to start a new conversation like "start over", "restart", 
        "new conversation", "what can you do?", "how can you help me?", etc. use {{StartConversationPlugin.StartConversation}} and 
        provide to the user exactly the message you get back from the plugin.

        **Available Tools:**
        Use {{DateTimeFunctionTool.getDate}} to get the current date and time.
        For claims search, use {{ClaimsPlugin.SearchClaims}} and {{ClaimsPlugin.GetClaimDetails}}.
        For damage photo viewing, use {{VisionPlugin.ShowDamagePhoto}}.
        For AI vision damage analysis, use {{VisionPlugin.AnalyzeAndShowDamagePhoto}} and require approval via {{VisionPlugin.ApproveAnalysis}}.
        For policy search, use {{PolicyPlugin.SearchPolicies}} and {{PolicyPlugin.GetPolicyDetails}}.
        For sending investigation reports and claim details via email, use {{CommunicationPlugin.GenerateInvestigationReport}} and {{CommunicationPlugin.SendClaimDetailsByEmail}}.
        For claims compliance analysis, use {{ClaimsPoliciesPlugin.AnalyzeClaimCompliance}}.

        To list claim adjusters use {{ClaimsAdjustersPlugin.ListClaimsAdjusters}}. When listing claim adjusters:
        - Always try to use the country of the current claim, if any. Otherwise, if no country is specified by the user, set country value to 'All'.
        - Always try to use the claim type of the current claim, if any.
        - Always retrieve id, firstName, lastName, email, country, phone, and area for each claim adjuster.
        - Only "Auto" and "Homeowners" are valid claim types. If the user provides any other claim type, set area value to null.

        To assign a claim adjuster to a claim use {{ClaimsAdjustersPlugin.AssignClaimAdjuster}}.

        **IMPORTANT**: When user asks to "check policy for this claim", first use GetClaimDetails to get the claim's policy number, then use GetPolicyDetails with that policy number.

        **IMPORTANT**: If in the response there are references to citations like [1], [2], etc., make sure to include those citations in the response so that M365 Copilot can render them properly.

        Stick to the scenario above and use only the information from the tools when answering questions.
        Be concise and professional in your responses.
        """;
```

??? note "Why These Instructions Matter"
    The instructions guide the LLM on how to use the claims adjuster tools effectively:
    
    - **Country inference**: Uses the claim's country when available
    - **Claim type validation**: Only "Auto" and "Homeowners" are valid areas of expertise
    - **Contextual awareness**: Leverages existing claim context to provide relevant adjusters

<cc-end-step lab="baf7" exercise="4" step="4" />

## Exercise 5: Test MCP Tools Integration

Now let's test the complete MCP tools integration!

### Step 1: Run and Verify

1️⃣ Make sure your MCP server is running with the dev tunnel active. If not, open the MCP server project in VS Code and press **F5** to start it.

2️⃣ In a separate VS Code window, open your agent project and press **F5** to start debugging your agent.

3️⃣ Select **(Preview) Debug in Copilot (Edge)** if prompted.

4️⃣ The terminal should show normal initialization.

5️⃣ A browser window will open with Microsoft 365 Copilot.

!!! tip "Running Both Projects"
    You'll need two VS Code windows open simultaneously - one for the MCP server and one for your agent. Make sure both are running before testing.

<cc-end-step lab="baf7" exercise="5" step="1" />

### Step 2: Test Listing Claims Adjusters

1️⃣ In Microsoft 365 Copilot, first get a claim to establish context:

```text
Get details for claim CLM-2025-001007
```

2️⃣ Then ask for adjusters:

```text
List available claims adjusters for this claim
```

The agent should:

- Use the claim's type (Auto) and country from the claim details
- Call the `get_claims_adjusters` MCP tool
- Return a list of adjusters matching the criteria

<cc-end-step lab="baf7" exercise="5" step="2" />

### Step 3: Test Assigning an Adjuster

1️⃣ After getting the list of adjusters, assign one:

```text
Assign adjuster ADJ-EE-0001 to this claim
```

The agent should:

- Call the `assign_claim_adjuster` MCP tool
- Return confirmation with an assignment ID
- Confirm the adjuster's name

<cc-end-step lab="baf7" exercise="5" step="3" />

### Step 4: Test with Filters

1️⃣ Test direct filtering:

```text
Show me all Auto adjusters in the United States
```

The agent should filter adjusters by both area and country.

2️⃣ Test with "All" countries:

```text
List all Homeowners adjusters
```

The agent should return all Homeowners adjusters regardless of country.

<cc-end-step lab="baf7" exercise="5" step="4" />

!!! success "Congratulations!"
    You've successfully integrated MCP tools into your Custom Engine Agent! Your agent can now:
    
    ✅ Connect to external MCP servers  
    ✅ List claims adjusters with filtering by area and country  
    ✅ Assign adjusters to claims with confirmation  
    ✅ Use claim context to provide relevant adjuster suggestions
    
    This pattern can be extended to integrate with any MCP-compatible service, enabling your agent to leverage a rich ecosystem of tools and capabilities.

<cc-award badgeId="CustomEngineRanger" badgeName="Custom Engine Ranger" />
<cc-award badgeId="MCPIntegrator" badgeName="MCP Integrator" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/07-add-mcp-tools" />
