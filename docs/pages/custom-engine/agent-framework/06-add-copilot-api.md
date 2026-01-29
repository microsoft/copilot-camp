# Lab BAF6 - Add Microsoft 365 Work IQ API Integration

In this lab, you'll enhance the Zava Insurance Agent with Microsoft 365 Work IQ API. You'll add the ability to analyze claim compliance using policy documents from SharePoint via the **Copilot Retrieval API** and leverage the power of Microsoft 365 Copilot's enterprise search grounding.

???+ info "Understanding Microsoft 365 Work IQ API"
    The **Microsoft 365 Work IQ API** enable your agent to:
    
    - **Copilot Retrieval API**: Retrieve relevant text chunks from SharePoint, OneDrive, and Copilot connectors while respecting permissions and compliance settings
    - **Secure Data Access**: Access Microsoft 365 data within the trust boundary without data egress
    - **Enterprise Search Grounding**: Ground LLM responses on organization-specific information the same way Microsoft 365 Copilot does
    - **Compliance & Security**: Maintain strict security standards with built-in permission models
    
    This enables the agent to analyze claim compliance against policy documents stored in SharePoint.

<hr />

## Overview

In Lab BAF5, you added communication capabilities with email and report generation. Now you'll enhance your agent with Microsoft 365 Work IQ API to retrieve policy documents from SharePoint and analyze claim compliance using AI-powered analysis.

The **Copilot Retrieval API** offers a streamlined solution for Retrieval Augmented Generation (RAG) without the need to replicate, index, chunk, and secure your data in a separate index. The API understands the user's context and intent and performs query transformations to yield the most relevant results.

???+ warning "Licensing Requirements"
    The Copilot Retrieval API is available at no extra cost to users with a **Microsoft 365 Copilot add-on license**. Support for users without a Microsoft 365 Copilot add-on license isn't currently available.

## Exercise 1: Set Up SharePoint Site with Policy Documents

Before using the Copilot Retrieval API, you need to set up a SharePoint site with policy documents.

### Step 1: Create SharePoint Site

??? note "About SharePoint and Copilot Retrieval API"
    The **Microsoft Graph Copilot Retrieval API** allows your agent to search content in SharePoint using the same powerful semantic search that powers Microsoft 365 Copilot. It provides:
    
    - **Semantic Search**: Natural language queries across SharePoint documents
    - **Real-time Access**: Always searches the latest document versions
    - **Security**: Respects SharePoint permissions (requires user authentication)
    - **Citations**: Returns document snippets with links to sources
    
    This is perfect for searching policy terms, coverage guides, and FAQ documents.

1️⃣ Go to [SharePoint](https://www.office.com/launch/sharepoint){target=_blank} and sign in with your Microsoft 365 account.

2️⃣ Click **+ Create site** → Choose **Team site**.

3️⃣ Select the **Standard team** site template and select **Use template**

4️⃣ Configure your site:

- **Site name**: "Zava Insurance Policy Documents"
- **Description**: "Insurance policy terms, coverage guides, and FAQs"

5️⃣ Select **Next**

- **Privacy settings**: Private (only members can access)
- **Select language**: English

6️⃣ Select the **Create site** command and wait for site creation

7️⃣ When the site is ready, select **Finish** to browse to the site.

<cc-end-step lab="baf6" exercise="1" step="1" />

### Step 2: Upload Policy Documents

Now let's upload the sample policy documents from your project.

1️⃣ In your VS Code workspace, navigate to `src/agent-framework/complete/infra/data/sample-documents/`

2️⃣ You should see these documents:

   - `Auto Insurance Claims Policies.docx`
   - `Homeowners Insurance Claims Policies.docx`
   - `Step-by-Step Guide - Creating an Insurance Quote.docx`
   - `Zava Claims Insurance Policies.docx`

3️⃣ In SharePoint, go to your new site → Click **Documents** in the left menu.

4️⃣ Click **Upload** → **Files** and upload all 4 documents from the sample-documents folder.

5️⃣ **Wait 10-15 minutes** for SharePoint to index the documents. The Copilot Retrieval API needs time to process and make documents searchable.

!!! tip "Verify Indexing"
    You can verify documents are indexed by:

    - Opening Microsoft 365 Copilot (copilot.microsoft.com)
    - Asking: "What policy documents are in my SharePoint?"
    - If documents appear, they're ready to use with your agent

6️⃣ Copy your SharePoint site URL - you'll need it for testing later.

<cc-end-step lab="baf6" exercise="1" step="2" />

## Exercise 2: Create the LanguageModelService

Before creating the ClaimsPoliciesPlugin, we need a service to interact with the language model for AI-powered compliance analysis.

### Step 1: Create LanguageModelService

??? note "What this service does"
    The `LanguageModelService` provides centralized access to language model capabilities:
    
    - **Chat Completions**: Send prompts to the language model and receive responses
    - **Configurable Model**: Uses the language model deployment configured in your settings
    - **Shared Endpoint**: Uses the same Azure OpenAI endpoint as other AI services
    
    This service will be used by the ClaimsPoliciesPlugin to analyze claim compliance against retrieved policy documents.

1️⃣ Create a new file `src/Services/LanguageModelService.cs` with the following implementation:

```csharp
using Azure;
using Azure.AI.OpenAI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OpenAI.Chat;

namespace InsuranceAgent.Services;

/// <summary>
/// Service for language model operations using gpt-4o-mini
/// Provides centralized access to language understanding and text generation capabilities
/// </summary>
public class LanguageModelService
{
    private readonly ChatClient _chatClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<LanguageModelService> _logger;

    public LanguageModelService(
        IConfiguration configuration,
        ILogger<LanguageModelService> logger)
    {
        _configuration = configuration;
        _logger = logger;

        // Use shared endpoint and API key with language model for general understanding
        var endpoint = configuration["AIModels:Endpoint"]
            ?? throw new InvalidOperationException("AIModels:Endpoint not configured");
        var apiKey = configuration["AIModels:ApiKey"]
            ?? throw new InvalidOperationException("AIModels:ApiKey not configured");
        var deployment = configuration["LANGUAGE_MODEL_NAME"] 
            ?? throw new InvalidOperationException("LANGUAGE_MODEL_NAME not configured");

        _logger.LogInformation("🔍 LanguageModelService Configuration:");
        _logger.LogInformation("   Endpoint: {Endpoint}", endpoint);
        _logger.LogInformation("   Deployment: {DeploymentName}", deployment);

        var azureClient = new AzureOpenAIClient(new Uri(endpoint), new AzureKeyCredential(apiKey));
        _chatClient = azureClient.GetChatClient(deployment);
    }

    /// <summary>
    /// Completes a chat request with the language model
    /// </summary>
    /// <param name="messages">The chat messages</param>
    /// <param name="options">Optional chat completion options</param>
    /// <returns>Chat completion response</returns>
    public async Task<ChatCompletion> CompleteChatAsync(
        IEnumerable<ChatMessage> messages, 
        ChatCompletionOptions? options = null)
    {
        try
        {
            _logger.LogDebug("Sending chat completion request with {MessageCount} messages", messages.Count());
            
            var response = await _chatClient.CompleteChatAsync(messages, options);
            
            _logger.LogDebug("Received chat completion response");
            
            return response.Value;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error completing chat request");
            throw;
        }
    }

    /// <summary>
    /// Gets the underlying ChatClient for advanced scenarios
    /// </summary>
    public ChatClient ChatClient => _chatClient;
}
```

<cc-end-step lab="baf6" exercise="2" step="1" />

### Step 2: Register LanguageModelService in Dependency Injection

Now register the service in your application's dependency injection container.

1️⃣ Open `src/Program.cs`.

2️⃣ Find where other services are registered (look for `builder.Services.AddScoped<VisionService>();` or similar) and add the following right after that:

```csharp
// Register LanguageModelService for AI-powered analysis
builder.Services.AddSingleton<LanguageModelService>();
```

<cc-end-step lab="baf6" exercise="2" step="2" />

### Step 3: Update Configuration

Ensure your configuration includes the language model settings.

1️⃣ Open your `.env.local` file.

2️⃣ Verify you have the language model configuration (add if missing):

```bash
# Language Model (for compliance analysis)
LANGUAGE_MODEL_NAME=gpt-4.1
```

??? note "Configuration Notes"
    - **LANGUAGE_MODEL_NAME**: The deployment name for your language model in Azure OpenAI
    - The service uses the same endpoint and API key as your other AI models
    - You can use `gpt-4o-mini` for cost-effective analysis instead of `gpt-4.1`, which you can use for more complex reasoning

<cc-end-step lab="baf6" exercise="2" step="3" />

## Exercise 3: Create the ClaimsPoliciesPlugin

Now let's create the ClaimsPoliciesPlugin that uses the Copilot Retrieval API to analyze claim compliance against SharePoint policy documents.

### Step 1: Understand the Copilot Retrieval API

??? note "How the Copilot Retrieval API Works"
    The **Microsoft 365 Copilot Retrieval API** allows you to:
    
    - **Query SharePoint content**: Send natural language queries to retrieve relevant text chunks from SharePoint documents
    - **Respect permissions**: Results are filtered based on the user's access permissions
    - **Get structured responses**: Receive text extracts with metadata like titles and authors
    - **Use KQL filters**: Optionally filter by URLs, date ranges, file types, and more
    
    **API Endpoint**: `POST https://graph.microsoft.com/v1.0/copilot/retrieval`
    
    **Request Payload**:

    ```json
    {
        "queryString": "Your natural language query",
        "dataSource": "SharePoint",
        "resourceMetadata": ["title", "author"]
    }
    ```
    
    **Best Practices**:

    - Provide as much context in the query as possible
    - Your `queryString` should be a single sentence
    - Avoid generic queries that might apply to a wide variety of content
    - Send all extracts returned to your LLM for answer generation

<cc-end-step lab="baf6" exercise="3" step="1" />

### Step 2: Create the ClaimsPoliciesPlugin

??? note "What this plugin does"
    The `ClaimsPoliciesPlugin` provides claim compliance analysis capabilities.
    
    **AnalyzeClaimCompliance**:

    - Retrieves claim details from KnowledgeBaseService
    - Queries SharePoint policy documents using Copilot Retrieval API
    - Uses AI to analyze claim compliance against retrieved policies
    - Returns structured compliance analysis with citations
    - Adds SharePoint document citations to the streaming response
    
    The plugin uses the **On-Behalf-Of (OBO) token** to call Microsoft Graph, ensuring user permissions are respected.

1️⃣ Create a new file `src/Plugins/ClaimsPoliciesPlugin.cs` with the following implementation:

```csharp
using Microsoft.Agents.Builder;
using Microsoft.Agents.Core.Models;
using System.ComponentModel;
using System.Text.Json;
using InsuranceAgent;
using Microsoft.Agents.Builder.State;
using InsuranceAgent.Services;
using Azure.Search.Documents.Models;
using OpenAI.Chat;

namespace ZavaInsurance.Plugins
{
    /// <summary>
    /// Claims Policies Plugin for Zava Insurance
    /// Provides tools for analyzing claim compliance using Copilot Retrieval API
    /// Retrieves policy documents from SharePoint and uses AI for compliance analysis
    /// </summary>
    public class ClaimsPoliciesPlugin
    {
        private readonly ITurnContext _turnContext;
        private readonly ITurnState _turnState;
        private readonly HttpClient _httpClient;
        private readonly KnowledgeBaseService _knowledgeBaseService;
        private readonly LanguageModelService _languageModelService;
        private readonly IConfiguration _configuration;

        public ClaimsPoliciesPlugin(ITurnContext turnContext, 
            ITurnState turnState,
            KnowledgeBaseService knowledgeBaseService,
            LanguageModelService languageModelService,
            IConfiguration configuration, 
            HttpClient httpClient)
        {
            _turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
            _turnState = turnState ?? throw new ArgumentNullException(nameof(turnState));
            _knowledgeBaseService = knowledgeBaseService ?? throw new ArgumentNullException(nameof(knowledgeBaseService));
            _languageModelService = languageModelService ?? throw new ArgumentNullException(nameof(languageModelService));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        }

        /// <summary>
        /// Retrieves claims policies from SharePoint Online using Copilot Retrieval APIs and analyzes claim compliance
        /// </summary>
        /// <param name="claimId">The unique claim identifier</param>
        /// <returns>The claim compliance with policies</returns>
        [Description("Retrieves claims policies from SharePoint Online using Copilot Retrieval APIs and analyzes claim compliance")]
        public async Task<string> AnalyzeClaimCompliance(string claimId)
        {
            await NotifyUserAsync($"Retrieving policies for claim {claimId}...");

            // Read the user profile and OBO token from conversation state
            var userProfile = _turnState.Conversation.GetCachedUserProfile();
            var accessToken = _turnState.Conversation.GetCachedOBOAccessToken();

            // Use direct search to get structured data (more reliable than Knowledge Base answer synthesis)
            var claimDoc = await _knowledgeBaseService.GetClaimByNumberAsync(claimId);

            if (claimDoc == null)
            {
                return $"❌ Claim {claimId} not found in the system.";
            }

            try
            {
                // Build the Copilot Retrieval API request payload
                var retrievalPayload = new
                {
                    queryString = $"Retrieve the claims policies for claims of type '{GetFieldValue(claimDoc, "claimType")}' in region '{GetFieldValue(claimDoc, "region")}'",
                    dataSource = "SharePoint",
                    resourceMetadata = new[] { "title", "author" }
                };

                var jsonContent = JsonSerializer.Serialize(retrievalPayload);
                var httpContent = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");

                // Configure HTTP client with OBO token
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
                _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

                await NotifyUserAsync($"Using Copilot Retrieval APIs to fetch policies from SharePoint...");

                // Call the Microsoft 365 Copilot Retrieval API
                var response = await _httpClient.PostAsync("https://graph.microsoft.com/v1.0/copilot/retrieval", httpContent);

                if (response.IsSuccessStatusCode)
                {
                    await NotifyUserAsync($"✅ Policies successfully retrieved from SharePoint!");
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    await NotifyUserAsync($"❌ Failed to retrieve policies: {response.StatusCode}");
                    return $"❌ Error retrieving policies from SharePoint: {response.StatusCode} - {errorContent}";
                }

                var policiesContent = await response.Content.ReadAsStringAsync();
                var estimatedCost = GetFieldValue(claimDoc, "estimatedCost");
                var isComplete = GetFieldValue(claimDoc, "isDocumentationComplete");
                var missingDocs = GetFieldValue(claimDoc, "missingDocumentation");

                // Build AI prompt for compliance analysis
                var prompt = $@"You are an insurance claims expert and you need to analyze the claim policies for a specific claim.

                    **CLAIM DETAILS:**
                    - Claim Number: {GetFieldValue(claimDoc, "claimNumber")}
                    - Claim Type: {GetFieldValue(claimDoc, "claimType")}
                    - Region: {GetFieldValue(claimDoc, "region")}
                    - Amount: ${estimatedCost:N2}
                    - Status: {GetFieldValue(claimDoc, "status")}
                    - Severity: {GetFieldValue(claimDoc, "severity")}
                    - Description: {GetFieldValue(claimDoc, "description")}
                    - Policy Number: {GetFieldValue(claimDoc, "policyNumber")}
                    - Policyholder: {GetFieldValue(claimDoc, "policyholderName")}
                    - Assigned Adjuster: {GetFieldValue(claimDoc, "assignedAdjuster")}
                    - Documentation Complete: {(isComplete == "True" || isComplete == "true" ? "Yes" : "No")}
                    - Missing Documentation: {(string.IsNullOrWhiteSpace(missingDocs) ? "None" : missingDocs)}

                    Here are the claim policies retrieved from SharePoint in JSON format:
                    {policiesContent}

                    Provide analysis in this JSON format:
                    {{
                    ""complianceScore"": <0-100>,
                    ""complianceLevel"": ""<Low/Medium/High/Critical>"",
                    ""analysis"": ""<detailed explanation of claim compliance with policies>"",
                    ""keyIndicators"": [""<list of specific compliance indicators with references citations to policies using the [1], [2], ... [n] format>""],
                    ""recommendations"": [""<recommended actions>""],
                    ""citationsTitles"": [""<list of titles corresponding to the citations>""],
                    ""citationsLinks"": [""<list of URLs corresponding to the citations>""]
                    }}

                    ";

                await NotifyUserAsync($"🤖 Running AI compliance analysis...");

                Console.WriteLine($"🔍 ClaimsPoliciesPlugin.AnalyzeClaimCompliance calling LanguageModelService with Temperature=0.2");

                // Use AI to analyze compliance
                var messages = new List<ChatMessage>
                {
                    new UserChatMessage(prompt)
                };

                var chatOptions = new ChatCompletionOptions
                {
                    Temperature = 0.2f,
                    ResponseFormat = ChatResponseFormat.CreateJsonObjectFormat()
                };

                var chatResponse = await _languageModelService.CompleteChatAsync(messages, chatOptions);
                var analysisJson = chatResponse.Content[0].Text ?? "{}";

                var complianceResult = JsonSerializer.Deserialize<ComplianceAnalysisResult>(analysisJson, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (complianceResult == null)
                {
                    return $"❌ Error: Unable to parse compliance analysis for claim {claimId}.";
                }

                await NotifyUserAsync($"✅ Compliance analysis complete. Compliance Score: {complianceResult.ComplianceScore}/100");

                // Add citations to streaming response
                for (int i = 0; i < complianceResult.CitationsTitles.Count; i++)
                {
                    var citationTitle = complianceResult.CitationsTitles.Count > i ? complianceResult.CitationsTitles[i] : $"Policy Document {i + 1}";
                    var citationLink = complianceResult.CitationsLinks.Count > i ? complianceResult.CitationsLinks[i] : null;
                    citationLink = citationLink != null ? GetCitationUrl(citationLink) : citationLink;

                    _turnContext.StreamingResponse.AddCitation(
                        new ClientCitation(
                            position: i + 1,
                            title: citationTitle,
                            abstractText: "Claims Policy",
                            text: "Claims Policy",
                            keywords: null,
                            citationLink: citationLink,
                            imageName: ClientCitationsIconNameEnum.MicrosoftWord,
                            useDefaultAdaptiveCard: true));

                    Console.WriteLine($"🔗 Added citation for \"{citationTitle}\" with link {citationLink ?? "[no link]"}");
                }

                // Format the response
                return $"🚨 **Compliance Analysis for {claimId}**\n\n" +
                       $"**Compliance Score:** {complianceResult.ComplianceScore}/100\n" +
                       $"**Compliance Level:** {complianceResult.ComplianceLevel}\n\n" +
                       $"**Analysis:**\n{complianceResult.Analysis}\n\n" +
                       (complianceResult.KeyIndicators != null && complianceResult.KeyIndicators.Count > 0
                           ? $"**Key Compliance Indicators:**\n{string.Join("\n", complianceResult.KeyIndicators.Select(i => $"• {i}"))}\n\n"
                           : "") +
                       (complianceResult.Recommendations != null && complianceResult.Recommendations.Count > 0
                           ? $"**Recommendations:**\n{string.Join("\n", complianceResult.Recommendations.Select(r => $"• {r}"))}\n\n"
                           : "");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error analyzing claim compliance: {ex.Message}");
                return $"❌ Error analyzing claim compliance: {ex.Message}";
            }
        }

        /// <summary>
        /// Helper method to safely extract field values from SearchDocument
        /// </summary>
        private string GetFieldValue(SearchDocument doc, string fieldName)
        {
            if (doc.ContainsKey(fieldName) && doc[fieldName] != null)
            {
                return doc[fieldName].ToString() ?? "Not available";
            }
            return "Not available";
        }

        // Helper method to construct citation URL through the bot's proxy endpoint
        private string GetCitationUrl(string targetUrl)
        {
            var botEndpoint = _configuration["BOT_ENDPOINT"];

            Console.WriteLine($"🔍 BOT_ENDPOINT from config: {botEndpoint ?? "NULL"}");

            if (string.IsNullOrEmpty(botEndpoint))
            {
                var botDomain = _configuration["BOT_DOMAIN"];
                if (!string.IsNullOrEmpty(botDomain))
                {
                    botEndpoint = $"https://{botDomain}";
                    Console.WriteLine($"🔍 Using BOT_DOMAIN: {botEndpoint}");
                }
                else
                {
                    botEndpoint = "http://localhost:3978";
                    Console.WriteLine($"⚠️ Falling back to localhost");
                }
            }

            botEndpoint = botEndpoint.TrimEnd('/');
            var citationUrl = $"{botEndpoint}/api/citation?targetUrl={Uri.EscapeDataString(targetUrl)}";
            Console.WriteLine($"⚙️ Generated citation URL: {citationUrl}");

            return citationUrl;
        }

        // Helper method to notify user via streaming
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

    /// <summary>
    /// Result of AI-powered compliance analysis
    /// </summary>
    public class ComplianceAnalysisResult
    {
        public int ComplianceScore { get; set; }
        public string ComplianceLevel { get; set; } = "";
        public string Analysis { get; set; } = "";
        public List<string> KeyIndicators { get; set; } = new();
        public List<string> Recommendations { get; set; } = new();
        public List<string> CitationsTitles { get; set; } = new();
        public List<string> CitationsLinks { get; set; } = new();
    }
}
```

???+ info "How Citations Work with StreamingResponse"
    The `ClaimsPoliciesPlugin` adds citations to the response using the `StreamingResponse.AddCitation()` method on the `ITurnContext`. Here's how it works:
    
    1. **AI generates citation references**: The language model returns references like `[1]`, `[2]` in its analysis text, along with `CitationsTitles` and `CitationsLinks` arrays.
    
    2. **Create ClientCitation objects**: For each citation, create a `ClientCitation` with:
        - `position`: The citation number (1-based, matching `[1]`, `[2]` in text)
        - `title`: Display title for the citation
        - `citationLink`: URL to the source document (routed through the bot's proxy endpoint)
        - `imageName`: Icon to display (e.g., `ClientCitationsIconNameEnum.MicrosoftWord`)
    
    3. **Add to StreamingResponse**: Call `_turnContext.StreamingResponse.AddCitation(citation)` to queue the citation.
    
    4. **M365 Copilot renders citations**: Microsoft 365 Copilot automatically renders clickable citation links that users can follow to view the source documents.
    
    **Why use a proxy endpoint?** SharePoint URLs require authentication. The `GetCitationUrl()` method routes links through your bot's `/api/citation` endpoint, which handles authentication and redirects users to the actual document.


<cc-end-step lab="baf6" exercise="3" step="2" />

## Exercise 4: Register ClaimsPoliciesPlugin in Agent

Now let's wire up the ClaimsPoliciesPlugin in your ZavaInsuranceAgent.

### Step 1: Instantiate ClaimsPoliciesPlugin

1️⃣ Open `src/Agent/ZavaInsuranceAgent.cs`.

2️⃣ Find the `GetClientAgent` method (around line 169).

3️⃣ Locate where the service instances are retrieved and right after the `var visionService = scope.ServiceProvider.GetRequiredService<VisionService>();` line add the following:

```csharp
var languageModelService = scope.ServiceProvider.GetRequiredService<LanguageModelService>();
```

4️⃣ Locate where plugins are instantiated (after `CommunicationPlugin communicationPlugin = ...`).

5️⃣ Add the ClaimsPoliciesPlugin instantiation:

```csharp
// Create ClaimsPoliciesPlugin with required dependencies
ClaimsPoliciesPlugin claimsPoliciesPlugin = new(context, turnState, knowledgeBaseService, languageModelService, configuration, httpClient);
```

<cc-end-step lab="baf6" exercise="4" step="1" />

### Step 2: Register ClaimsPoliciesPlugin Tools

In the same `GetClientAgent` method, scroll down to where tools are added to `toolOptions.Tools`.

Find the Communication tools section and add ClaimsPoliciesPlugin tools right after:

```csharp
// Register ClaimsPolicies tools (Copilot Retrieval API)
toolOptions.Tools.Add(AIFunctionFactory.Create(claimsPoliciesPlugin.AnalyzeClaimCompliance));
```

??? note "Tool Registration Pattern"
    The agent uses **AIFunctionFactory** to register plugin methods as AI tools. The `[Description]` attribute on the plugin method becomes the tool description that helps the LLM decide when to call it.

<cc-end-step lab="baf6" exercise="4" step="2" />

### Step 3: Update Agent Instructions

Update the agent instructions to include the claims compliance analysis tool.

1️⃣ In `src/Agent/ZavaInsuranceAgent.cs`, find the `AgentInstructions` field.

2️⃣ Add the claims compliance tool to the instructions. Find the existing tool list and add:

```csharp
For claims compliance analysis, use {{ClaimsPoliciesPlugin.AnalyzeClaimCompliance}}.
```

Your complete `AgentInstructions` should now include all tools:

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

**IMPORTANT**: When user asks to "check policy for this claim", first use GetClaimDetails to get the claim's policy number, then use GetPolicyDetails with that policy number.

**IMPORTANT**: If in the response there are references to citations like [1], [2], etc., make sure to include those citations in the response so that M365 Copilot can render them properly.

Stick to the scenario above and use only the information from the tools when answering questions.
Be concise and professional in your responses.
""";
```

<cc-end-step lab="baf6" exercise="4" step="3" />

### Step 4: Update Welcome Message

Update the StartConversationPlugin to include the compliance analysis in the suggested workflow.

1️⃣ Open `src/Plugins/StartConversationPlugin.cs`.

2️⃣ Find the `welcomeMessage` variable in the `StartConversation` method.

3️⃣ Add the compliance check prompt to the workflow list. After the "Analyze this damage photo" step, add:

```csharp
"8. \"Check compliance for this claim\"\n" +
```

4️⃣ Update the numbering for the remaining steps (Generate investigation report becomes 9, Update claim status becomes 10).

Your updated workflow section should look like:

```csharp
"🎯 Try this complete investigation workflow:\n" +
"1. \"Get details for claim CLM-2025-001007\"\n" +
"2. \"Check policy for this claim\"\n" +
"3. \"What coverage does auto insurance include?\"\n" +
"4. \"Analyze fraud risk for this claim\"\n" +
"5. \"Show damage photo for this claim\"\n" +
"6. \"Analyze this damage photo\"\n" +
"7. \"What's the claims filing procedure?\"\n" +
"8. \"Check compliance for this claim\"\n" +
"9. \"Generate investigation report for claim CLM-2025-001007\"\n" +
"10. \"Update claim status to 'Approved for Payment'\"\n\n" +
```

<cc-end-step lab="baf6" exercise="4" step="4" />

## Exercise 5: Test Copilot API Integration

Now let's test the complete Copilot API integration!

### Step 1: Run and Verify

1️⃣ Press **F5** in VS Code to start debugging.

2️⃣ Select **(Preview) Debug in Copilot (Edge)** if prompted.

3️⃣ The terminal should show normal initialization.

4️⃣ A browser window will open with Microsoft 365 Copilot.

<cc-end-step lab="baf6" exercise="5" step="1" />

### Step 2: Test Claim Compliance Analysis

1️⃣ In Microsoft 365 Copilot, say:

```text
Check compliance for claim CLM-2025-001007
```

The agent should:

- Use `ClaimsPoliciesPlugin.AnalyzeClaimCompliance`
- Retrieve the claim details from Table Storage
- Call the Copilot Retrieval API to fetch policies from SharePoint
- Use AI to analyze compliance
- Return a structured compliance report with citations

**Expected Response:**

```
Retrieving policies for claim CLM-2025-001007...
Using Copilot Retrieval APIs to fetch policies from SharePoint...
✅ Policies successfully retrieved from SharePoint!
🤖 Running AI compliance analysis...
✅ Compliance analysis complete. Compliance Score: 85/100

## 📋 Compliance Analysis for Claim CLM-2025-001007

**Compliance Score**: 40/100 (High)
**Compliance Level**: Low

### Analysis
The claim is currently open and has a high severity rating due to a multi-vehicle...

### Key Compliance Indicators
- Incomplete documentation [1]
- High severity claim requires thorough investigation [2]
- ...

### Recommendations
- Contact the policyholder, Arnel Cruz, to gather missing documentation related to the accident.
- ...
```

2️⃣ Notice the **citations** in the response (like `[1]`, `[2]`). These link back to the SharePoint policy documents that were used for the analysis.

<cc-end-step lab="baf6" exercise="5" step="2" />

### Step 3: Test with Different Claims

1️⃣ Try a different prompt with another claim:

```text
Check if claim CLM-2025-001001 follows our policies
```

2️⃣ The agent should use the Copilot Retrieval API to fetch the appropriate policies based on the claim type (Auto, Homeowners, etc.) and region.

<cc-end-step lab="baf6" exercise="5" step="3" />

### Step 4: Test Complete Workflow with Compliance

Test the complete workflow including compliance analysis:

```text
1. Get details for claim CLM-2025-001007
2. Check policy for this claim
3. Analyze fraud risk for this claim
4. Check compliance for this claim
5. Generate investigation report for this claim
6. Send the report by email
```

The agent should seamlessly integrate the Copilot Retrieval API alongside all other capabilities!

<cc-end-step lab="baf6" exercise="5" step="4" />

---8<--- "b-congratulations.md"

You have completed Lab BAF6 - Add Microsoft 365 Work IQ API Integration!

You've learned how to:

- ✅ Set up SharePoint site with policy documents for the Copilot Retrieval API
- ✅ Create a centralized LanguageModelService for AI operations
- ✅ Understand the Microsoft 365 Copilot Retrieval API and its capabilities
- ✅ Create a ClaimsPoliciesPlugin that uses Copilot Retrieval API
- ✅ Integrate SharePoint policy document search via Microsoft Graph
- ✅ Combine AI analysis with retrieved policy documents
- ✅ Add citations from SharePoint documents to agent responses

Your Zava Insurance Agent now includes:

- **Search**: Claims and policies via Azure AI Search
- **Analysis**: AI vision with Mistral for damage assessment
- **Compliance**: Copilot Retrieval API for policy compliance analysis from SharePoint
- **Communication**: Email reports and investigation summaries

???+ info "About Microsoft 365 Work IQ API"
    The Microsoft 365 Work IQ API provide access to components that power Copilot experiences:
    
    - **Retrieval API**: Ground your AI solutions with Microsoft 365 data without data egress
    - **Chat API** (preview): Engage in multi-turn conversations with enterprise search grounding
    
    These APIs maintain strict security and compliance by keeping data in place and respecting permissions.

🎉 **Congratulations!** You've built a production-ready AI agent with Microsoft 365 Copilot API integration! 🎊

<cc-next url="../07-add-mcp-tools" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/06-add-copilot-api" />
