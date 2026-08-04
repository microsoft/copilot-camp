# Lab BAF3 - Ground your agent in Microsoft 365 content with Work IQ

<div data-widget="hero"
     data-badge="Path 2 · Lab BAF3"
     data-badge-color="purple"
     data-icon="🏢"
     data-subtitle="Ground your agent in real organizational knowledge with Work IQ, using the Microsoft 365 Copilot Retrieval API to analyze claim compliance against SharePoint policy documents — with permissions respected and no index to build."
     data-time="45-60 min"
     data-requires="Lab BAF2 completed"></div>

In Lab BAF2 you grounded the agent in structured claims data with Foundry IQ. But an insurance adjuster also needs to know whether a claim actually **complies with company policy** — and those policies live as documents in Microsoft 365. In this lab you add **Work IQ** grounding: you connect the agent to your organization's real SharePoint content with the **Microsoft 365 Copilot Retrieval API**, so it can analyze a claim against the relevant policy documents while respecting each user's permissions.

!!! note
    If you want to start directly from this lab without completing the previous ones, you can download the agent's complete source code (as it is at the end of the previous lab) [from here](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/agent-framework/BAF2-complete&filename=BAF2-complete){target=_blank}. However, remember to complete the pre-requisites described in lab ["Lab BAF0 - Prerequisites"](../00-prerequisites).

???+ info "What is Work IQ?"
    **Work IQ** is grounding in your organization's actual work: the emails, chats, meetings, and documents that live across Microsoft 365. Instead of copying that content into a separate search index, you query it in place with the **Microsoft 365 Copilot Retrieval API** (part of Microsoft Graph).

    The **Microsoft 365 Copilot Retrieval API** performs Retrieval Augmented Generation (RAG) over Microsoft 365 content — SharePoint, OneDrive, and Copilot connectors — with **no index to build, chunk, or secure yourself**. It understands the user's intent, transforms the query, and returns the most relevant extracts **while respecting the signed-in user's permissions**.

???+ warning "Licensing requirements"
    The Microsoft 365 Copilot Retrieval API is available at no extra cost to users with a **Microsoft 365 Copilot add-on license**. Support for users without a Microsoft 365 Copilot add-on license isn't currently available.

## Lab objectives

By the end of this lab you will be able to:

- Stand up a SharePoint site holding Zava Insurance policy documents
- Add user authentication with the On-Behalf-Of (OBO) flow so the agent acts as the signed-in user
- Call the Microsoft 365 Copilot Retrieval API to ground answers in SharePoint content
- Analyze a claim's compliance against retrieved policies and return cited results
- Validate that the agent respects permissions and cites its sources

---

## Exercise 1: Set up the SharePoint policy library

The Microsoft 365 Copilot Retrieval API grounds answers in Microsoft 365 content, so first you need policy documents in SharePoint for it to find.

### Step 1: Create the SharePoint site

1. Go to [SharePoint](https://www.office.com/launch/sharepoint){target=_blank} and sign in with your Microsoft 365 account.
2. Select **+ Create site** → **Team site**, choose the **Standard team** template, and select **Use template**.
3. Configure the site:
    - **Site name**: `Zava Insurance Policy Documents`
    - **Description**: `Insurance policy terms, coverage guides, and FAQs`
4. Select **Next**, set **Privacy settings** to **Private** and **Language** to **English**, then select **Create site**.
5. When the site is ready, select **Finish** to open it, and copy the **site URL** for later.

**Expected result:** You have a private SharePoint team site ready to hold Zava Insurance's policy documents.

<cc-end-step lab="baf3" exercise="1" step="1" />

### Step 2: Upload the policy documents

1. In your VS Code workspace, open `src/agent-framework/BAF3-complete/infra/data/sample-documents/`. You should see:
    - `Auto Insurance Claims Policies.docx`
    - `Homeowners Insurance Claims Policies.docx`
    - `Step-by-Step Guide - Creating an Insurance Quote.docx`
    - `Zava Claims Insurance Policies.docx`
2. In your SharePoint site, select **Documents** in the left menu.
3. Select **+ Create or upload** → **Files upload**, and upload all 4 documents.
4. **Wait 10-15 minutes** for SharePoint to index the documents — the Microsoft 365 Copilot Retrieval API needs them indexed before it can return them.

!!! tip "Verify indexing"
    Open Microsoft 365 Copilot (copilot.microsoft.com) and ask *"What policy documents are in my SharePoint?"*. If the documents appear, they're ready to use with your agent.

**Expected result:** All four policy documents are uploaded to the SharePoint library and (after indexing) discoverable by Microsoft 365 Copilot.

<cc-end-step lab="baf3" exercise="1" step="2" />

---

## Exercise 2: Authenticate the user and add compliance analysis

The Microsoft 365 Copilot Retrieval API runs **on behalf of the signed-in user**, so it only returns content that user can see. You'll first enable the On-Behalf-Of (OBO) flow, then add the service and plugin that call the API.

### Step 1: Configure OBO settings

1. In `m365agents.local.yml`, find the `file/createOrUpdateJsonFile` action (around line 47).
2. Uncomment the `me` handler settings in the `UserAuthorization` group so `OBOConnectionName`, `OBOScopes`, `Title`, and `Text` are enabled. The block should look like this:

    ```yaml
              UserAuthorization:
                DefaultHandlerName: me
                AutoSignin: true
                Handlers:
                  me:
                    Settings:
                      AzureBotOAuthConnectionName: "Microsoft Graph"
                      OBOConnectionName: "BotServiceConnection"
                      OBOScopes:
                        - "https://graph.microsoft.com/.default"
                      Title: "Sign in"
                      Text: "Sign in to Microsoft Graph"
    ```

??? note "What this does"
    These settings enable the On-Behalf-Of (OBO) flow for the Azure Bot backing the agent, so the agent can exchange the user's token for a Microsoft Graph token and call the Microsoft 365 Copilot Retrieval API as that user.

**Expected result:** The OBO configuration is active, so the agent can obtain a Microsoft Graph token for the signed-in user.

<cc-end-step lab="baf3" exercise="2" step="1" />

### Step 2: Implement user authentication and OBO

1. In `src/Agent/ZavaInsuranceAgent.cs`, find the `OnMessageAsync` method.
2. Right after the first line of the method (`await turnContext.StreamingResponse.QueueInformativeUpdateAsync("Processing your request...", ...)`) add:

    ```csharp
    // Check if user profile is already cached, if not fetch and cache it
    var userProfile = turnState.Conversation.GetCachedUserProfile();
    if (userProfile == null)
    {
        try
        {
            // Get the access token and store it in the conversation state
            var accessToken = await UserAuthorization.ExchangeTurnTokenAsync(turnContext, UserAuthorization.DefaultHandlerName, exchangeScopes: new[] { "https://graph.microsoft.com/.default" }, cancellationToken: cancellationToken);
            turnState.Conversation.SetCachedOBOAccessToken(accessToken);

            // Get the user profile and store it in the conversation state
            userProfile = await GetUserProfile(accessToken, cancellationToken);
            turnState.Conversation.SetCachedUserProfile(userProfile);

            // Show current user profile information to let clients that support streaming know that we are processing the request for the current user.
            await turnContext.StreamingResponse.QueueInformativeUpdateAsync($"⚒️ Working on your request {userProfile.DisplayName} ...", cancellationToken).ConfigureAwait(false);
        }
        catch (InvalidOperationException ex)
        {
            System.Diagnostics.Trace.WriteLine($"Exception occurred: {ex.Message}");
            // User is not signed in, proceed as anonymous and inform the user
            await turnContext.StreamingResponse.QueueInformativeUpdateAsync("⚠️ Please sign in if you want to use authenticated features.", cancellationToken).ConfigureAwait(false);
        }
    }
    ```

??? note "What this code does"
    - Tries to read the cached user profile from the conversation.
    - If it's missing, it exchanges the turn token for an OBO Microsoft Graph token, caches it, retrieves the user's profile via Microsoft Graph, and caches that too.
    - If the exchange fails, the agent asks the user to sign in and continues anonymously.

    The `GetCachedOBOAccessToken` / `SetCachedOBOAccessToken` helpers and the `GetUserProfile` method are already part of your project from Lab BAF2.

**Expected result:** On the first authenticated request the agent obtains and caches an OBO Microsoft Graph token and the user's profile — the token the Microsoft 365 Copilot Retrieval API will use.

<cc-end-step lab="baf3" exercise="2" step="2" />

### Step 3: Add the LanguageModelService

The compliance analysis sends the retrieved policies and the claim to a language model. Add a small service that centralizes those chat completions.

1. Create a file `src/Services/LanguageModelService.cs`. Its core is a `ChatClient` built from your configured Azure OpenAI endpoint:

    ```csharp
    var endpoint = configuration["AIModels:Endpoint"]
        ?? throw new InvalidOperationException("AIModels:Endpoint not configured");
    var apiKey = configuration["AIModels:ApiKey"]
        ?? throw new InvalidOperationException("AIModels:ApiKey not configured");
    var deployment = configuration["LANGUAGE_MODEL_NAME"]
        ?? throw new InvalidOperationException("LANGUAGE_MODEL_NAME not configured");

    var azureClient = new AzureOpenAIClient(new Uri(endpoint), new AzureKeyCredential(apiKey));
    _chatClient = azureClient.GetChatClient(deployment);
    ```

    It exposes a single `CompleteChatAsync(messages, options)` method. Copy the **complete implementation** from the reference solution: [LanguageModelService.cs in BAF3-complete](https://github.com/microsoft/copilot-camp/tree/main/src/agent-framework/BAF3-complete/src/Services){target=_blank}.

2. Register the service in `src/Program.cs`, right after `builder.Services.AddSingleton<KnowledgeBaseService>();`:

    ```csharp
    // Register LanguageModelService for AI-powered compliance analysis
    builder.Services.AddSingleton<LanguageModelService>();
    ```

3. In `env/.env.local`, make sure the language model deployment name is set:

    ```bash
    # Language Model (for compliance analysis)
    LANGUAGE_MODEL_NAME=gpt-4.1
    ```

**Expected result:** `LanguageModelService` compiles, is registered in dependency injection, and the language model deployment is configured.

<cc-end-step lab="baf3" exercise="2" step="3" />

### Step 4: Create the ClaimsPoliciesPlugin

This plugin retrieves the claim from your knowledge base, calls the Microsoft 365 Copilot Retrieval API for the matching SharePoint policies, and asks the model to score the claim's compliance.

1. Create a file `src/Plugins/ClaimsPoliciesPlugin.cs`. The single tool `AnalyzeClaimCompliance` first reads the cached OBO token, then calls the Microsoft 365 Copilot Retrieval API with it:

    ```csharp
    [Description("Retrieves claims policies from SharePoint Online using Copilot Retrieval APIs and analyzes claim compliance")]
    public async Task<string> AnalyzeClaimCompliance(string claimId)
    {
        await NotifyUserAsync($"Retrieving policies for claim {claimId}...");

        // Read the user profile and OBO token from conversation state
        var userProfile = _turnState.Conversation.GetCachedUserProfile();
        var accessToken = _turnState.Conversation.GetCachedOBOAccessToken();

        var claimDoc = await _knowledgeBaseService.GetClaimByNumberAsync(claimId);
        if (claimDoc == null) return $"❌ Claim {claimId} not found in the system.";

        // Build the Microsoft 365 Copilot Retrieval API request payload
        var retrievalPayload = new
        {
            queryString = $"Retrieve the claims policies for claims of type '{GetFieldValue(claimDoc, "claimType")}' in region '{GetFieldValue(claimDoc, "region")}'",
            dataSource = "SharePoint",
            resourceMetadata = new[] { "title", "author" }
        };

        var httpContent = new StringContent(JsonSerializer.Serialize(retrievalPayload), System.Text.Encoding.UTF8, "application/json");

        // Configure HTTP client with the OBO token so results respect the user's permissions
        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
        _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

        // Call the Microsoft 365 Copilot Retrieval API
        var response = await _httpClient.PostAsync("https://graph.microsoft.com/v1.0/copilot/retrieval", httpContent);
        var policiesContent = await response.Content.ReadAsStringAsync();
        // ... send the claim + policiesContent to the model and return a cited compliance report ...
    }
    ```

2. The rest of the method builds a prompt combining the claim details and the retrieved `policiesContent`, calls `_languageModelService.CompleteChatAsync(...)` for a JSON compliance result, and adds each source as a citation via `_turnContext.StreamingResponse.AddCitation(...)`. Copy the **complete plugin** (and the `ComplianceAnalysisResult` class, plus the `GetFieldValue`, `GetCitationUrl`, and `NotifyUserAsync` helpers) from the reference solution: [ClaimsPoliciesPlugin.cs in BAF3-complete](https://github.com/microsoft/copilot-camp/tree/main/src/agent-framework/BAF3-complete/src/Plugins){target=_blank}.

??? info "How the API grounds the answer"
    The `queryString` should be a single, specific sentence. The API returns policy extracts from SharePoint that the signed-in user is allowed to see, and those extracts are sent to the model as grounding — so the compliance analysis is based on your organization's real policies, not the model's assumptions.

**Expected result:** `src/Plugins/ClaimsPoliciesPlugin.cs` compiles and exposes the `AnalyzeClaimCompliance` tool that calls the Microsoft 365 Copilot Retrieval API with the user's OBO token.

<cc-end-step lab="baf3" exercise="2" step="4" />

### Step 5: Register the plugin and update instructions

Wire the plugin into the agent, update its instructions, and refresh the welcome message.

1. In `src/Agent/ZavaInsuranceAgent.cs`, in the `GetClientAgent` method, find where `KnowledgeBaseService` is retrieved from the scope and get the language model service right after:

    ```csharp
    var languageModelService = scope.ServiceProvider.GetRequiredService<LanguageModelService>();
    ```

2. Find where `ClaimsPlugin claimsPlugin = ...` is instantiated and add the new plugin right after:

    ```csharp
    // Create ClaimsPoliciesPlugin with required dependencies
    ClaimsPoliciesPlugin claimsPoliciesPlugin = new(context, turnState, knowledgeBaseService, languageModelService, configuration, _httpClient);
    ```

3. Find where the `ClaimsPlugin` tools are registered and add the compliance tool right after:

    ```csharp
    // Register ClaimsPolicies tools (Microsoft 365 Copilot Retrieval API)
    toolOptions.Tools.Add(AIFunctionFactory.Create(claimsPoliciesPlugin.AnalyzeClaimCompliance));
    ```

4. Replace the `AgentInstructions` field so it advertises **only** the tools that exist after this lab:

    ```csharp
    private readonly string AgentInstructions = """
    You are a professional insurance claims assistant for Zava Insurance.

    Whenever the user starts a new conversation or provides a prompt to start a new conversation like "start over", "restart", "new conversation", "what can you do?", "how can you help me?", etc. use {{StartConversationPlugin.StartConversation}} and provide to the user exactly the message you get back from the plugin.

    **Available Tools:**
    Use {{DateTimeFunctionTool.getDate}} to get the current date and time.
    For claims search, use {{ClaimsPlugin.SearchClaims}} and {{ClaimsPlugin.GetClaimDetails}}.
    For claims compliance analysis, use {{ClaimsPoliciesPlugin.AnalyzeClaimCompliance}}.

    **IMPORTANT**: If in the response there are references to citations like [1], [2], etc., make sure to include those citations in the response so that M365 Copilot can render them properly.

    Stick to the scenario above and use only the information from the tools when answering questions.
    Be concise and professional in your responses.
    """;
    ```

5. In `src/Plugins/StartConversationPlugin.cs`, replace the `welcomeMessage` so it advertises only claims lookup/search and policy-compliance analysis:

    ```csharp
    var welcomeMessage = "👋 Welcome to Zava Insurance Claims Assistant!\n\n" +
                        "I'm your AI-powered insurance claims specialist. I help adjusters and investigators streamline the claims process.\n\n" +
                        "**What I can do:**\n\n" +
                        "- Search and retrieve detailed claim information\n" +
                        "- Analyze a claim's compliance against company policies\n" +
                        "- Provide current date and time\n\n" +
                        "🎯 Try these commands:\n" +
                        "1. \"Get details for claim CLM-2025-001007\"\n" +
                        "2. \"Search for claims with high severity\"\n" +
                        "3. \"Check compliance for claim CLM-2025-001007\"\n\n" +
                        "Ready to help with your claims investigation. What would you like to start with?";
    ```

**Expected result:** The agent knows about the compliance tool, registers it, and greets users advertising claim search and policy-compliance analysis — with no references to vision, policy plugins, or email.

<cc-end-step lab="baf3" exercise="2" step="5" />

---

## Exercise 3: Run and validate compliance analysis

Now test grounding against your real SharePoint policies.

### Step 1: Run and sign in

1. Press **F5** in VS Code to start debugging.
2. Select **(Preview) Debug in Copilot (Edge)** if prompted.
3. When Microsoft 365 Copilot opens, send any message. On the first authenticated request the agent prompts you to **sign in** — complete the sign-in with your Microsoft 365 account.

**Expected result:** The agent signs you in, obtains an OBO Microsoft Graph token, and greets you by name (`⚒️ Working on your request <name> ...`).

<cc-end-step lab="baf3" exercise="3" step="1" />

### Step 2: Test claim compliance analysis

1. In Microsoft 365 Copilot, say:

    ```text
    Check compliance for claim CLM-2025-001007
    ```

    The agent should retrieve the claim, call the Microsoft 365 Copilot Retrieval API to fetch the matching policies from SharePoint, run the AI analysis, and return a structured compliance report.

2. Notice the numbered **citations** (like `[1]`, `[2]`) — they link back to the SharePoint policy documents used for the analysis.

**Expected result:** You get a compliance report with a score, level, analysis, recommendations, and clickable citations pointing to your SharePoint policy documents.

<cc-end-step lab="baf3" exercise="3" step="2" />

### Step 3: Test with another claim

1. Try a different claim and phrasing:

    ```text
    Check if claim CLM-2025-001001 follows our policies
    ```

2. The agent should fetch the appropriate policies based on that claim's type (Auto, Homeowners, …) and region, and produce a fresh, cited analysis.

**Expected result:** The compliance analysis reflects the second claim's own type and region, grounded in the relevant SharePoint policies and respecting your permissions.

<cc-end-step lab="baf3" exercise="3" step="3" />

---8<--- "b-congratulations.md"

You have completed Lab BAF3 - Ground your agent in Microsoft 365 content with Work IQ!

🎉 **Congratulations — you've finished the Agent Framework track!** Across these labs you have:

- **BAF0** — set up the prerequisites and tooling for building a custom engine agent
- **BAF1** — built and ran the Zava Insurance agent on the Microsoft 365 Agents SDK with Microsoft Agent Framework
- **BAF2** — grounded the agent in structured claims data with a **Foundry IQ** knowledge base backed by Azure AI Search
- **BAF3** — grounded the agent in real Microsoft 365 content with **Work IQ**, using the Microsoft 365 Copilot Retrieval API to analyze claim compliance against SharePoint policies while respecting user permissions

Your Zava Insurance agent now combines Foundry IQ and Work IQ grounding to answer with real, cited data from both your indexed claims and your organization's live policy documents. 🎊

## Where to go next

**Microsoft IQ** is Microsoft's unified intelligence layer, made up of **Foundry IQ**, **Work IQ**, and **Fabric IQ**. You've now used two of the three in a real agent — here's how to go further:

- 📺 [**The Microsoft IQ Series**](https://aka.ms/iq-series){target=_blank} — expert-led episodes with hands-on cookbooks and labs for Foundry IQ and Work IQ, plus community badges for completing them
- 🧪 [Work IQ labs in Copilot Developer Camp](../../../work-iq/) — go deeper on Work IQ with the A2A, MCP, and REST protocols
- 🔬 [Microsoft IQ Deep Dive](https://aka.ms/iqdeepdive){target=_blank} — a three-day workshop spanning Foundry IQ, Work IQ, Fabric IQ, and Web IQ
- 📡 [Microsoft IQ Live](https://aka.ms/MicrosoftIQLive){target=_blank} — ongoing product updates, demos, and architecture guidance

<cc-next label="Home" url="/" />

<cc-award badgeId="CustomEngineRanger" badgeName="Custom Engine Ranger" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/03-add-copilot-retrieval" />
