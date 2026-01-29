# Lab BAF7 - Add MCP Tools Integration

In this lab, you'll extend your Zava Insurance Agent with Model Context Protocol (MCP) tools. You'll create an MCP server using Azure Functions that provides claims adjuster management capabilities, then consume those tools from a custom plugin in your Custom Engine Agent.

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

## Exercise 1: Create the MCP Server with Azure Functions

??? important "Pre-defined MCP server"
    If you don't want to create the MCP server from scratch, you can skip Exercise 1, download a pre-defined one from folder /`src/agent-framework/insurance-mcp`, configure the `env/.env.local` and the `env/.env.local.user` files, and run it pressing F5 in Visual Studio Code. If that is the case, you can move straight to Exercise 2.

First, let's create an Azure Function app that serves as your MCP server, exposing claims adjuster management tools.

### Step 1: Understand the MCP Server Architecture

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

<cc-end-step lab="baf7" exercise="1" step="1" />

### Step 2: Create the Azure Function Project

1️⃣ Open a terminal in VSCode and create a new folder for your MCP server under your project:

```bash
mkdir InsuranceMCPServer
cd InsuranceMCPServer
```

2️⃣ Initialize a new Azure Functions project with TypeScript:

```bash
func init --typescript
```

3️⃣ Install the required dependencies:

```bash
npm install @azure/data-tables dotenv
npm install --save-dev @types/node
```

4️⃣ Create the environment configuration file `env/.env.local` under your InsuranceMCPServer and fill in your Azure Table Storage details:

```bash
AZURE_STORAGE_ACCOUNT=your_storage_account
AZURE_TABLE_ENDPOINT=https://your_storage_account.table.core.windows.net
TABLE_NAME=ClaimsAdjusters
ALLOW_INSECURE_CONNECTION=false
```

5️⃣ Create the environment configuration file `env/.env.local.user` under your InsuranceMCPServer and fill in your Azure Storage account key:

```bash
SECRET_AZURE_STORAGE_KEY=your_storage_key
```

<cc-end-step lab="baf7" exercise="1" step="2" />

### Step 3: Create the Claims Adjusters Function

Create a new file `src/functions/ClaimsAdjusters.ts` with the MCP tool implementations:

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load environment variables (.env.local.user takes precedence over .env.local)
const envLocalFile = path.join(__dirname, "../../../env/.env.local");
const envLocalUserFile = path.join(__dirname, "../../../env/.env.local.user");

// Load .env.local first, then .env.local.user (later values override earlier ones)
dotenv.config({ path: envLocalFile });
if (fs.existsSync(envLocalUserFile)) {
    dotenv.config({ path: envLocalUserFile, override: true });
}

interface ClaimAdjuster {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    area: string;
}

// Initialize Table Storage client
function getTableClient(): TableClient {
    const account = process.env.AZURE_STORAGE_ACCOUNT;
    const accountKey = process.env.SECRET_AZURE_STORAGE_KEY;
    const tableEndpoint = process.env.AZURE_TABLE_ENDPOINT;
    const tableName = process.env.TABLE_NAME;
    const allowInsecure = process.env.ALLOW_INSECURE_CONNECTION === "true";

    if (!account || !accountKey || !tableEndpoint || !tableName) {
        throw new Error("Missing required environment variables. Please check your env/.env file.");
    }

    const credential = new AzureNamedKeyCredential(account, accountKey);
    return new TableClient(tableEndpoint, tableName, credential, {
        allowInsecureConnection: allowInsecure
    });
}

// Load claims adjusters data from Table Storage
async function loadClaimsAdjusters(): Promise<ClaimAdjuster[]> {
    const tableClient = getTableClient();
    const adjusters: ClaimAdjuster[] = [];

    const entities = tableClient.listEntities({
        queryOptions: { filter: `PartitionKey eq 'ClaimsAdjusters'` }
    });

    for await (const entity of entities) {
        adjusters.push({
            id: entity.rowKey as string,
            firstName: entity.firstName as string,
            lastName: entity.lastName as string,
            email: entity.email as string,
            phone: entity.phone as string,
            country: entity.country as string,
            area: entity.area as string
        });
    }

    return adjusters;
}

// Internal implementation: List claims adjusters with optional filters
async function listClaimsAdjustersImpl(country?: string, area?: string): Promise<ClaimAdjuster[]> {
    let adjusters = await loadClaimsAdjusters();

    // Apply filters
    if (country) {
        adjusters = adjusters.filter(adj => adj.country.toLowerCase() === country.toLowerCase());
    }

    if (area) {
        adjusters = adjusters.filter(adj => adj.area.toLowerCase() === area.toLowerCase());
    }

    return adjusters;
}

// Internal implementation: Get claim adjuster by ID
async function getClaimAdjusterByIdImpl(id: string): Promise<ClaimAdjuster | null> {
    const tableClient = getTableClient();
    
    try {
        const entity = await tableClient.getEntity("ClaimsAdjusters", id);
        const adjuster: ClaimAdjuster = {
            id: entity.rowKey as string,
            firstName: entity.firstName as string,
            lastName: entity.lastName as string,
            email: entity.email as string,
            phone: entity.phone as string,
            country: entity.country as string,
            area: entity.area as string
        };
        return adjuster;
    } catch (entityError: any) {
        if (entityError.statusCode === 404) {
            return null;
        }
        throw entityError;
    }
}

// Internal implementation: Assign a claim adjuster to a claim
async function assignClaimAdjusterImpl(claimId: string, adjusterId: string): Promise<{
    success: boolean;
    assignmentId?: string;
    adjusterName?: string;
    error?: string;
}> {
    if (!claimId || !adjusterId) {
        return {
            success: false,
            error: "Both claimId and adjusterId are required"
        };
    }

    // Verify adjuster exists
    const adjuster = await getClaimAdjusterByIdImpl(adjusterId);
    
    if (!adjuster) {
        return {
            success: false,
            error: `Claim adjuster with ID ${adjusterId} not found`
        };
    }

    // Generate fake assignment ID
    const currentYear = new Date().getFullYear();
    const randomNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const assignmentId = `ASS-${currentYear}-${randomNumber}`;

    return {
        success: true,
        assignmentId: assignmentId,
        adjusterName: `${adjuster.firstName} ${adjuster.lastName}`
    };
}
```

<cc-end-step lab="baf7" exercise="1" step="3" />

### Step 4: Register MCP Tools

Add the MCP tool registrations at the end of `src/functions/ClaimsAdjusters.ts`:

```typescript
// MCP Tool Handler: List claims adjusters with optional filters
async function handleListClaimsAdjusters(input: any, context: InvocationContext): Promise<ClaimAdjuster[] | { error: string }> {
    context.log(`MCP: Listing claims adjusters with filters`);

    try {
        const country = input.arguments["country"] || undefined;
        const area = input.arguments["area"] || undefined;

        const adjusters = await listClaimsAdjustersImpl(country, area);
        return adjusters;
    } catch (error) {
        context.log('Error fetching claim adjusters:', error);
        return { error: (error as Error).message };
    }
}

// MCP Tool Handler: Get claim adjuster by ID
async function handleGetClaimsAdjusterById(input: any, context: InvocationContext): Promise<ClaimAdjuster | { error: string }> {
    context.log(`MCP: Getting claim adjuster by ID`);

    try {
        const id = input.arguments["id"];

        if (!id) {
            return { error: "Claim adjuster ID is required" };
        }

        const adjuster = await getClaimAdjusterByIdImpl(id);

        if (!adjuster) {
            return { error: `Claim adjuster with ID ${id} not found` };
        }

        return adjuster;
    } catch (error) {
        context.log('Error fetching claim adjuster:', error);
        return { error: (error as Error).message };
    }
}

// MCP Tool Handler: Assign a claim adjuster to a claim
async function handleAssignClaimAdjuster(input: any, context: InvocationContext): Promise<{ success: boolean; assignmentId?: string; adjusterName?: string; error?: string }> {
    context.log(`MCP: Assigning claim adjuster to claim`);

    try {
        const claimId = input.arguments["claimId"];
        const adjusterId = input.arguments["adjusterId"];

        const result = await assignClaimAdjusterImpl(claimId, adjusterId);
        return result;
    } catch (error) {
        context.log('Error assigning claim adjuster:', error);
        return { success: false, error: (error as Error).message };
    }
}

// Register MCP tools
app.mcpTool("get_claims_adjusters", {
    toolName: "get_claims_adjusters",
    description: "Retrieve a list of all insurance claims adjusters",
    toolProperties: [
        {
            "propertyName": "country",
            "propertyType": "string",
            "description": "The country of the claim adjuster",
            "isRequired": false
        },
        {
            "propertyName": "area",
            "propertyType": "string",
            "description": "The area of expertise of the claim adjuster",
            "isRequired": false
        }
    ],
    handler: handleListClaimsAdjusters
});

app.mcpTool("get_claims_adjuster", {
    toolName: "get_claims_adjuster",
    description: "Retrieve a specific insurance claims adjuster by ID",
    toolProperties: [
        {
            "propertyName": "id",
            "propertyType": "string",
            "description": "The unique identifier of the claim adjuster",
            "isRequired": true
        }
    ],
    handler: handleGetClaimsAdjusterById
});

app.mcpTool("assign_claim_adjuster", {
    toolName: "assign_claim_adjuster",
    description: "Assign a claim adjuster to an insurance claim",
    toolProperties: [
        {
            "propertyName": "claimId",
            "propertyType": "string",
            "description": "The unique identifier of the claim",
            "isRequired": true
        },
        {
            "propertyName": "adjusterId",
            "propertyType": "string",
            "description": "The unique identifier of the claim adjuster to assign",
            "isRequired": true
        }
    ],
    handler: handleAssignClaimAdjuster
});
```

??? note "MCP Tool Registration Pattern"
    Each MCP tool is registered using `app.mcpTool()` with:
    
    - **toolName**: The identifier used when calling the tool
    - **description**: Helps the LLM understand when to use this tool
    - **toolProperties**: Array of input parameters with name, type, description, and required flag
    - **handler**: The async function that executes the tool logic

<cc-end-step lab="baf7" exercise="1" step="4" />

### Step 5: Deploy the MCP Server

1️⃣ Replace the placeholders in below script and run it in your terminal to create the Azure Function App in Azure:

```bash
az functionapp create --name your-mcp-server --resource-group your-rg --consumption-plan-location eastus --runtime node --runtime-version 20 --functions-version 4 --storage-account your-storage
```

2️⃣ Deploy the function:

```bash
func azure functionapp publish your-mcp-server
```

3️⃣ Note your MCP server endpoint URL (e.g., `https://your-mcp-server.azurewebsites.net/runtime/webhooks/mcp`)

??? info "MCP server local with devtunnel"
    Instead of publishing the MCP server to Azure, you can keep it running locally and use **Dev Tunnels** to create a public URL:
    
    1️⃣ Start your Azure Function locally:
    ```bash
    func start
    ```
    
    2️⃣ In a new terminal, create and host a dev tunnel:
    ```bash
    devtunnel create --allow-anonymous
    devtunnel port create -p 7071
    devtunnel host
    ```
    
    3️⃣ Copy the tunnel URL (e.g., `https://abc123.devtunnels.ms`) and use it to compose your MCP server endpoint:

    ```text
    https://abc123.devtunnels.ms/runtime/webhooks/mcp
    ```
    
    This is useful for development and testing without deploying to Azure. The tunnel remains active as long as the `devtunnel host` command is running.

<cc-end-step lab="baf7" exercise="1" step="5" />

## Exercise 2: Configure MCP Client in the Agent

Now let's configure the Custom Engine Agent to connect to your MCP server.

### Step 1: Add MCP Client Configuration

1️⃣ Open your `.env.local` file in the agent project.

2️⃣ Add the MCP server configuration:

```bash
# MCP Server Configuration
MCP_SERVER_URL=https://your-mcp-server.azurewebsites.net/runtime/webhooks/mcp
```

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

2️⃣ Add the ClaimsAdjustersPlugin instantiation after other plugins:

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

1️⃣ Make sure your MCP server is running (locally or deployed to Azure).

2️⃣ Press **F5** in VS Code to start debugging your agent.

3️⃣ Select **(Preview) Debug in Copilot (Edge)** if prompted.

4️⃣ The terminal should show normal initialization.

5️⃣ A browser window will open with Microsoft 365 Copilot.

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
