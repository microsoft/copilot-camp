# Lab BAF2 - Ground your agent with Foundry IQ

<div data-widget="hero"
     data-badge="Path 2 · Lab BAF2"
     data-badge-color="blue"
     data-icon="🔎"
     data-subtitle="Ground your Zava Insurance agent with a Foundry IQ knowledge base so it answers claims questions with real, cited data instead of guessing."
     data-time="45-60 min"
     data-requires="Lab BAF1 completed"></div>

In Lab BAF1 your agent could chat, but it had no knowledge of Zava Insurance's data. In this lab you give it a **Foundry IQ knowledge base**: Microsoft's reusable, permission-aware retrieval layer that returns grounded, citation-bearing answers. You'll build the knowledge base, wire it into a `KnowledgeBaseService`, and expose it to the agent through a `ClaimsPlugin` so it can search claims and return real details.

!!! note
    If you want to start directly from this lab without completing the previous ones, you can download the agent's complete source code (as it is at the end of the previous lab) [from here](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/agent-framework/BAF1-complete&filename=BAF1-complete){target=_blank}. However, remember to complete the pre-requisites described in lab ["Lab BAF0 - Prerequisites"](../00-prerequisites).

???+ info "What is Foundry IQ?"
    **Foundry IQ** is Microsoft's grounding layer for agents. A **Foundry IQ knowledge base** is a reusable, permission-aware retrieval resource that takes a natural-language query, searches your content, and returns grounded results **with citations** — so answers are traceable back to their source.

    Under the hood in this lab, the knowledge base is implemented with **Azure AI Search**, which provides the index, the semantic and vector search, and the agentic retrieval that synthesizes an answer from the matching documents. You'll create a **claims index**, connect it through a **knowledge source**, and expose it as a **knowledge base** your agent can query with one call.

## Lab objectives

By the end of this lab you will be able to:

- Create a Foundry IQ knowledge base backed by Azure AI Search
- Index the Zava Insurance sample claims data for grounded retrieval
- Build a `KnowledgeBaseService` that performs agentic, citation-bearing retrieval
- Expose retrieval to the agent through a `ClaimsPlugin` with `[Description]`-annotated tools
- Validate that the agent answers claims questions with real, grounded data

---

## Exercise 1: Create the Foundry IQ knowledge base

Before adding any code, provision the Azure AI Search service that backs your Foundry IQ knowledge base and give the project its credentials.

### Step 1: Create the Azure AI Search service

If you haven't created an Azure AI Search service yet (in Lab BAF0), create one now.

1. Go to the [Azure Portal](https://portal.azure.com){target=_blank}.
2. Select **+ Create a resource**, search for **Azure AI Search**, and select **Create**.
3. Configure the service:
    - **Resource Group**: use the same one as your Microsoft Foundry project
    - **Service Name**: a unique name (e.g. `zava-insurance-search`)
    - **Region**: any supported location (Central US, East US, West Europe, …)
    - **Pricing Tier**: Basic
4. Select **Review + Create**, then **Create** (takes 2-3 minutes).
5. When the deployment finishes, open the resource **Overview** page and copy the **URL**, then go to **Settings > Keys** and copy the **Primary admin key**.

**Expected result:** You have a running Azure AI Search service, and you've recorded its **URL** and **Primary admin key** — the two values that let your agent reach the Foundry IQ knowledge base.

<cc-end-step lab="baf2" exercise="1" step="1" />

### Step 2: Review the sample claims data

Your project ships with the sample claims that will be indexed into the knowledge base.

1. In VS Code, open `infra/data/sample-data/claims.json`.
2. Notice that each claim has fields such as `claimNumber` (e.g. `CLM-2025-001007`), `policyholderName`, `claimType` (Auto, Homeowners, Commercial), `status`, `severity`, `estimatedCost`, `fraudRiskScore`, and `region`.
3. This data is indexed automatically into Azure AI Search the first time you run the agent — you don't need to upload anything manually.

**Expected result:** You understand the shape of the claims data that will ground your agent's answers.

<cc-end-step lab="baf2" exercise="1" step="2" />

### Step 3: Configure the knowledge base credentials

Give the project the Azure AI Search endpoint and key you copied in Step 1.

1. Open `env/.env.local` and set the endpoint:

    ```bash
    # Azure AI Search
    AZURE_AI_SEARCH_ENDPOINT=https://your-search.search.windows.net
    ```

2. Open `env/.env.local.user` and set the admin key:

    ```bash
    # Azure AI Search
    SECRET_AZURE_AI_SEARCH_API_KEY=your-primary-admin-key
    ```

!!! tip "Finding your credentials"
    - **Endpoint**: Azure Portal → your Search service → **Overview** → URL
    - **API Key**: Azure Portal → your Search service → **Keys** → Primary admin key

**Expected result:** The project is configured with the endpoint and key, so the `KnowledgeBaseService` you add next can connect to the knowledge base.

<cc-end-step lab="baf2" exercise="1" step="3" />

---

## Exercise 2: Add retrieval to the agent

Now add the service that talks to the knowledge base, the plugin that exposes it as agent tools, and the registration that wires it all together.

### Step 1: Create the KnowledgeBaseService

The `KnowledgeBaseService` connects to Azure AI Search, creates the index / knowledge source / knowledge base, indexes the sample claims, and performs **agentic retrieval** — where the LLM searches, ranks, and synthesizes a grounded answer.

1. In VS Code, create a folder `src/Services` and add a file `src/Services/KnowledgeBaseService.cs`.
2. The heart of the service is the connection to Azure AI Search set up in the constructor:

    ```csharp
    // Initialize Azure AI Search clients
    var credential = new AzureKeyCredential(_searchApiKey);
    _indexClient = new SearchIndexClient(new Uri(_searchEndpoint), credential);
    _retrievalClient = new KnowledgeBaseRetrievalClient(
        new Uri(_searchEndpoint),
        KnowledgeBaseName,
        credential
    );
    ```

3. The grounded, citation-bearing answer comes from `RetrieveAsync`, which sends the query to the knowledge base and asks it to **synthesize** an answer from the matching claims:

    ```csharp
    public async Task<string> RetrieveAsync(string query, string? instructions = null, int topResults = 5)
    {
        var retrievalRequest = new KnowledgeBaseRetrievalRequest
        {
            RetrievalReasoningEffort = new KnowledgeRetrievalLowReasoningEffort(),
            OutputMode = KnowledgeRetrievalOutputMode.AnswerSynthesis // LLM generates a grounded answer
        };

        // Optional formatting/grounding instructions, sent as an assistant message
        if (!string.IsNullOrEmpty(instructions))
        {
            retrievalRequest.Messages.Add(new KnowledgeBaseMessage(
                content: new[] { new KnowledgeBaseMessageTextContent(instructions) }) { Role = "assistant" });
        }

        // The user's natural-language query
        retrievalRequest.Messages.Add(new KnowledgeBaseMessage(
            content: new[] { new KnowledgeBaseMessageTextContent(query) }) { Role = "user" });

        var retrievalResult = await _retrievalClient.RetrieveAsync(retrievalRequest);
        // ... collect the synthesized text from retrievalResult.Value.Response ...
    }
    ```

4. The service also creates the index (`EnsureClaimsIndexAsync`, with semantic + vector search), the knowledge source and knowledge base, indexes the claims (`IndexSampleDataAsync`), and offers a direct `GetClaimByNumberAsync` lookup for structured detail. Copy the **complete implementation** into your file from the reference solution: [KnowledgeBaseService.cs in BAF2-complete](https://github.com/microsoft/copilot-camp/tree/main/src/agent-framework/BAF2-complete){target=_blank}.

**Expected result:** `src/Services/KnowledgeBaseService.cs` compiles and exposes `EnsureClaimsIndexAsync`, `CreateKnowledgeSourcesAsync`, `CreateKnowledgeBaseAsync`, `IndexSampleDataAsync`, `RetrieveAsync`, and `GetClaimByNumberAsync`.

<cc-end-step lab="baf2" exercise="2" step="1" />

### Step 2: Create the ClaimsPlugin

The `ClaimsPlugin` turns the service into agent **tools**. Each method carries a `[Description]` attribute, which is how the agent decides when to call it.

1. Create a file `src/Plugins/ClaimsPlugin.cs`.
2. `SearchClaims` builds a natural-language query from the user's filters and asks the knowledge base to return a grounded, cited summary:

    ```csharp
    [Description("Searches for insurance claims based on region, type, severity, and status. Returns a summary of matching claims.")]
    public async Task<string> SearchClaims(
        string region = null, string claimType = null, string severity = null, string status = null)
    {
        await NotifyUserAsync("Searching claims database using AI Search...");

        var queryParts = new List<string> { "insurance claims" };
        if (!string.IsNullOrEmpty(region))    queryParts.Add($"in {region} region");
        if (!string.IsNullOrEmpty(claimType)) queryParts.Add($"of type {claimType}");
        if (!string.IsNullOrEmpty(severity))  queryParts.Add($"with {severity} severity");
        if (!string.IsNullOrEmpty(status))    queryParts.Add($"with status {status}");

        var query = string.Join(" ", queryParts);

        // Agentic retrieval with instructions for a structured, cited summary
        var instructions = @"You are an insurance claims specialist. Provide a clear, structured summary of matching claims.
            - Total number of claims found
            - For each claim: Claim Number, Policyholder, Claim Type, Amount, Status, Date Filed, Severity, Region
            - Cite sources using [ref_id:X] format";

        return await _knowledgeBaseService.RetrieveAsync(query, instructions, topResults: 10);
    }
    ```

3. `GetClaimDetails` retrieves one claim directly for structured, reliable detail:

    ```csharp
    [Description("Retrieves detailed information for a specific claim by claim ID, including policyholder info, documentation, and history.")]
    public async Task<string> GetClaimDetails(string claimId)
    {
        await NotifyUserAsync($"Retrieving details for claim {claimId}...");
        var claimDoc = await _knowledgeBaseService.GetClaimByNumberAsync(claimId);
        if (claimDoc == null) return $"❌ Claim {claimId} not found in the system.";
        // ... format the claim fields into a readable summary ...
    }
    ```

4. Copy the **complete plugin** (constructor, both tool methods, and the `NotifyUserAsync` / `GetFieldValue` helpers) from the reference solution: [ClaimsPlugin.cs in BAF2-complete](https://github.com/microsoft/copilot-camp/tree/main/src/agent-framework/BAF2-complete){target=_blank}.

**Expected result:** `src/Plugins/ClaimsPlugin.cs` compiles and exposes two `[Description]`-annotated tools — `SearchClaims` and `GetClaimDetails`.

<cc-end-step lab="baf2" exercise="2" step="2" />

### Step 3: Register the service and initialize the knowledge base

Wire the service into dependency injection and build the knowledge base on startup.

1. Open `src/Program.cs` and add the using statement:

    ```csharp
    using InsuranceAgent.Services;
    ```

2. Find `builder.Services.AddSingleton<IStorage, MemoryStorage>();` and register the service right after:

    ```csharp
    // Register Knowledge Base Service for Foundry IQ (Azure AI Search)
    builder.Services.AddSingleton<KnowledgeBaseService>();
    ```

3. Find `var app = builder.Build();` and initialize the knowledge base right after — the order matters:

    ```csharp
    // Initialize the Foundry IQ knowledge base (Azure AI Search)
    using (var scope = app.Services.CreateScope())
    {
        try
        {
            var kbService = scope.ServiceProvider.GetRequiredService<KnowledgeBaseService>();
            Console.WriteLine("🔍 Initializing Foundry IQ knowledge base...");
            await kbService.EnsureClaimsIndexAsync();      // 1. Create claims index
            await kbService.CreateKnowledgeSourcesAsync(); // 2. Create claims knowledge source
            await kbService.CreateKnowledgeBaseAsync();     // 3. Create knowledge base
            await kbService.IndexSampleDataAsync();         // 4. Index sample claims data
            Console.WriteLine("✅ Knowledge base initialized successfully");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️ Knowledge base initialization warning: {ex.Message}");
        }
    }
    ```

**Expected result:** The service is registered, and on startup the app creates the index, knowledge source, and knowledge base, then indexes the sample claims.

<cc-end-step lab="baf2" exercise="2" step="3" />

### Step 4: Give the agent the ClaimsPlugin tools

Now tell the agent about the new tools and register them.

1. Open `src/Agent/ZavaInsuranceAgent.cs` and add the using statement:

    ```csharp
    using InsuranceAgent.Services;
    ```

2. Find the `AgentInstructions` property and replace it so the agent knows about the claims tools:

    ```csharp
    private readonly string AgentInstructions = """
    You are a professional insurance claims assistant for Zava Insurance.

    Whenever the user starts a new conversation or provides a prompt to start a new conversation like "start over", "restart", "new conversation", "what can you do?", "how can you help me?", etc. use {{StartConversationPlugin.StartConversation}} and provide to the user exactly the message you get back from the plugin.

    **Available Tools:**
    Use {{DateTimeFunctionTool.getDate}} to get the current date and time.
    For claims search, use {{ClaimsPlugin.SearchClaims}} and {{ClaimsPlugin.GetClaimDetails}}.

    Stick to the scenario above and use only the information from the tools when answering questions.
    Be concise and professional in your responses.
    """;
    ```

3. In the `GetClientAgent` method, find where `StartConversationPlugin` is created and instantiate the plugin right after:

    ```csharp
    var scope = _serviceProvider.CreateScope();

    // Get KnowledgeBaseService and IConfiguration from DI
    var knowledgeBaseService = scope.ServiceProvider.GetRequiredService<KnowledgeBaseService>();
    var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

    // Create ClaimsPlugin with required dependencies
    ClaimsPlugin claimsPlugin = new(context, knowledgeBaseService, configuration);
    ```

4. Find where tools are registered and add the claims tools right after `toolOptions.Tools.Add(AIFunctionFactory.Create(startConversationPlugin.StartConversation))`:

    ```csharp
    // Register ClaimsPlugin tools
    toolOptions.Tools.Add(AIFunctionFactory.Create(claimsPlugin.SearchClaims));
    toolOptions.Tools.Add(AIFunctionFactory.Create(claimsPlugin.GetClaimDetails));
    ```

**Expected result:** The agent's instructions reference the claims tools, and both `SearchClaims` and `GetClaimDetails` are registered as callable tools.

<cc-end-step lab="baf2" exercise="2" step="4" />

### Step 5: Update the welcome message

Update the welcome message so it advertises the new claims capabilities.

1. Open `src/Plugins/StartConversationPlugin.cs`.
2. Find the `welcomeMessage` variable in the `StartConversation` method and replace it with:

    ```csharp
    var welcomeMessage = "👋 Welcome to Zava Insurance Claims Assistant!\n\n" +
                        "I'm your AI-powered insurance claims specialist. I help adjusters and investigators streamline the claims process.\n\n" +
                        "**What I can do:**\n\n" +
                        "- Search and retrieve detailed claim information\n" +
                        "- Provide current date and time\n" +
                        "- Answer questions about claims\n\n" +
                        "🎯 Try these commands:\n" +
                        "1. \"Search for claims with high severity\"\n" +
                        "2. \"Get details for claim CLM-2025-001007\"\n" +
                        "3. \"Show me recent claims in the Northeast region\"\n\n" +
                        "Ready to help with your claims investigation. What would you like to start with?";
    ```

**Expected result:** When the conversation starts, the agent greets the user and advertises claim search and claim details as its capabilities.

<cc-end-step lab="baf2" exercise="2" step="5" />

---

## Exercise 3: Run and validate grounded answers

Time to see Foundry IQ grounding in action.

### Step 1: Run the agent

1. Press **F5** in VS Code to start debugging.
2. Select **(Preview) Debug in Copilot (Edge)** if prompted.
3. Watch the terminal — you should see the knowledge base build itself:

    ```
    🔍 Initializing Foundry IQ knowledge base...
    📝 Creating claims index 'claims-index'...
    ✅ Claims index 'claims-index' created successfully
    ✅ Knowledge source 'claims-knowledge-source' created
    ✅ Knowledge base 'zava-insurance-kb' created with model 'gpt-4.1'
    📝 Indexing sample claims...
    ✅ Indexed 35 claims
    ✅ Knowledge base initialized successfully
    ```

4. (Optional) In the [Azure Portal](https://portal.azure.com){target=_blank}, open your Search service → **Indexes** to see `claims-index`, and **Agentic retrieval > Knowledge Bases** to see `zava-insurance-kb`.

**Expected result:** The agent starts, the knowledge base is created and populated with the indexed claims, and Microsoft 365 Copilot opens in the browser with your agent installed.

<cc-end-step lab="baf2" exercise="3" step="1" />

### Step 2: Test claim search

1. In Microsoft 365 Copilot, ask:

    ```text
    Find claims in the South region
    ```

2. Try a more specific search:

    ```text
    Show me auto claims with medium severity
    ```

**Expected result:** The agent calls `SearchClaims`, and the answer is grounded in the indexed data — it lists real matching claims (claim number, policyholder, type, amount, status, severity, region) rather than inventing them.

<cc-end-step lab="baf2" exercise="3" step="2" />

### Step 3: Test claim details

1. Ask for a specific claim:

    ```text
    Get details for claim CLM-2025-001007
    ```

2. Try another claim:

    ```text
    Show me information about claim CLM-2025-001003
    ```

**Expected result:** The agent calls `GetClaimDetails` and returns the real, structured details for that exact claim — proving the answer comes from the Foundry IQ knowledge base and not from the model's imagination.

<cc-end-step lab="baf2" exercise="3" step="3" />

---8<--- "b-congratulations.md"

You have completed Lab BAF2 - Ground your agent with Foundry IQ!

Your Zava Insurance agent is now grounded: it answers claims questions with real, cited data from a Foundry IQ knowledge base backed by Azure AI Search. In the next lab, you'll ground it in your organization's Microsoft 365 content with Work IQ.

!!! tip "Go deeper on Foundry IQ"
    Want the full picture of how Foundry IQ builds knowledge bases from multiple sources? Watch the three Foundry IQ episodes of [**The Microsoft IQ Series**](https://aka.ms/iq-series){target=_blank} — each pairs a ~15 minute tech talk with a hands-on cookbook, and completing all three earns you the Foundry IQ community badge.

<cc-next url="../03-add-copilot-retrieval" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/02-add-claim-search" />
