# Lab BAF4 - Add Policy Search and SharePoint Integration

In this lab, you'll extend your Zava Insurance Agent with policy search capabilities. You'll add the ability to search insurance policies in Azure AI Search and search policy documents in SharePoint using Microsoft Graph Copilot Retrieval API.

???+ info "Understanding Policy Search and SharePoint Integration"
    This lab adds two powerful capabilities:

    **Policy Search with Azure AI Search**:

    - Search insurance policies (Auto, Homeowners, Commercial) by type, status, or policyholder
    - Retrieve structured policy details including coverage limits, deductibles, and premiums
    - Access vehicle and property information associated with policies
    
    **Policy Document Search with Copilot Retrieval API**:

    - Search policy terms, coverage guides, and FAQs stored in SharePoint
    - Leverage Microsoft 365 Copilot's semantic search capabilities
    - Get real-time access to the latest policy documentation
    - Respect SharePoint permissions with user authentication
    
    Together, these features allow adjusters to quickly find policy information and understand coverage terms.

## Exercise 1: Set Up SharePoint Site with Policy Documents

Before we can search policy documents, we need to set them up in SharePoint.

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

4️⃣ When the site is ready, select **Finish** to browse to the site.

<cc-end-step lab="baf4" exercise="1" step="1" />

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

<cc-end-step lab="baf4" exercise="1" step="2" />

## Exercise 2: Add Policies Index and Knowledge Source

Now let's extend the KnowledgeBaseService to support policies alongside claims.

### Step 1: Add Policy Constants and Index Creation

??? note "What this step does"
    You'll add:

    - **Policies Constants**: Define the policies index and knowledge source names
    - **Policies Index**: Search index for policy data (type, status, coverage, vehicle/property info)
    - **Policies Knowledge Source**: Connects the policies index to the knowledge base
    - **Policies Data Indexing**: Loads and indexes sample policies from JSON file
    
    These additions work alongside the existing claims functionality without modifying it.

1️⃣ Open `src/Services/KnowledgeBaseService.cs`.

2️⃣ Find `private const string ClaimsKnowledgeSource = "claims-knowledge-source";` and and **add** the policies constant and index:

```csharp
// Knowledge source names
private const string PoliciesKnowledgeSource = "policies-knowledge-source";

// Index names
private const string PoliciesIndex = "policies-index";
```

3️⃣ Find the `EnsureClaimsIndexAsync` method and add the `EnsurePoliciesIndexAsync` method right after it:

```csharp
public async Task EnsurePoliciesIndexAsync()
{
    try
    {
        await _indexClient.GetIndexAsync(PoliciesIndex);
        Console.WriteLine($"✅ Policies index '{PoliciesIndex}' already exists");
    }
    catch (RequestFailedException ex) when (ex.Status == 404)
    {
        Console.WriteLine($"📝 Creating policies index '{PoliciesIndex}'...");
        
        var index = new SearchIndex(PoliciesIndex)
        {
            Fields =
            {
                new SimpleField("id", SearchFieldDataType.String) { IsKey = true, IsFilterable = true },
                new SearchableField("policyNumber") { IsFilterable = true, IsSortable = true },
                new SearchableField("policyholderName") { IsFilterable = true },
                new SearchableField("policyType") { IsFilterable = true, IsFacetable = true },
                new SearchableField("status") { IsFilterable = true, IsFacetable = true },
                new SimpleField("effectiveDate", SearchFieldDataType.DateTimeOffset) { IsFilterable = true, IsSortable = true },
                new SimpleField("expirationDate", SearchFieldDataType.DateTimeOffset) { IsFilterable = true, IsSortable = true },
                new SimpleField("coverageLimit", SearchFieldDataType.Double) { IsFilterable = true, IsSortable = true },
                new SimpleField("deductible", SearchFieldDataType.Double) { IsFilterable = true, IsSortable = true },
                new SimpleField("annualPremium", SearchFieldDataType.Double) { IsFilterable = true, IsSortable = true },
                new SearchableField("vehicleMake") { IsFilterable = true },
                new SearchableField("vehicleModel") { IsFilterable = true },
                new SimpleField("vehicleYear", SearchFieldDataType.Int32) { IsFilterable = true },
                new SearchableField("vehicleVin") { IsFilterable = true },
                new SearchableField("propertyAddress") { IsFilterable = true },
                new SearchableField("propertyType") { IsFilterable = true },
                new SearchableField("notes"),
                new SearchableField("searchableContent"),
                new SearchField("contentVector", SearchFieldDataType.Collection(SearchFieldDataType.Single))
                {
                    IsSearchable = true,
                    VectorSearchDimensions = 1536,
                    VectorSearchProfileName = "vector-profile"
                }
            },
            VectorSearch = CreateVectorSearchConfig(),
            SemanticSearch = CreateSemanticConfig("Policies semantic search", "policyNumber", "policyholderName", "notes")
        };
        
        await _indexClient.CreateIndexAsync(index);
        Console.WriteLine($"✅ Policies index created successfully");
    }
}
```

<cc-end-step lab="baf4" exercise="2" step="1" />

### Step 2: Update Knowledge Sources to Include Policies

Now let's update the `CreateKnowledgeSourcesAsync` method to create both claims and policies knowledge sources.

1️⃣ Find the `CreateKnowledgeSourcesAsync` method and replace the entire method with this updated version that includes both policies and claims:

```csharp
public async Task CreateKnowledgeSourcesAsync()
{
    // Create claims knowledge source
    var claimsKnowledgeSource = new SearchIndexKnowledgeSource(
        name: ClaimsKnowledgeSource,
        searchIndexParameters: new SearchIndexKnowledgeSourceParameters(searchIndexName: ClaimsIndex)
        {
            SourceDataFields = 
            {
                new SearchIndexFieldReference(name: "id"),
                new SearchIndexFieldReference(name: "claimNumber"),
                new SearchIndexFieldReference(name: "policyholderName"),
                new SearchIndexFieldReference(name: "policyNumber"),
                new SearchIndexFieldReference(name: "status"),
                new SearchIndexFieldReference(name: "claimType"),
                new SearchIndexFieldReference(name: "region"),
                new SearchIndexFieldReference(name: "assignedAdjuster"),
                new SearchIndexFieldReference(name: "dateFiled"),
                new SearchIndexFieldReference(name: "dateResolved"),
                new SearchIndexFieldReference(name: "description"),
                new SearchIndexFieldReference(name: "location"),
                new SearchIndexFieldReference(name: "severity"),
                new SearchIndexFieldReference(name: "claimAmount"),
                new SearchIndexFieldReference(name: "fraudScore"),
                new SearchIndexFieldReference(name: "fraudIndicators"),
                new SearchIndexFieldReference(name: "adjusterNotes")
            }
        }
    );

    await _indexClient.CreateOrUpdateKnowledgeSourceAsync(claimsKnowledgeSource);
    Console.WriteLine($"✅ Knowledge source '{ClaimsKnowledgeSource}' created");
    
    // Create policies knowledge source
    var policiesKnowledgeSource = new SearchIndexKnowledgeSource(
        name: PoliciesKnowledgeSource,
        searchIndexParameters: new SearchIndexKnowledgeSourceParameters(searchIndexName: PoliciesIndex)
        {
            SourceDataFields = 
            {
                new SearchIndexFieldReference(name: "id"),
                new SearchIndexFieldReference(name: "policyNumber"),
                new SearchIndexFieldReference(name: "policyholderName"),
                new SearchIndexFieldReference(name: "policyType"),
                new SearchIndexFieldReference(name: "status"),
                new SearchIndexFieldReference(name: "effectiveDate"),
                new SearchIndexFieldReference(name: "expirationDate"),
                new SearchIndexFieldReference(name: "coverageLimit"),
                new SearchIndexFieldReference(name: "deductible"),
                new SearchIndexFieldReference(name: "annualPremium")
            }
        }
    );

    await _indexClient.CreateOrUpdateKnowledgeSourceAsync(policiesKnowledgeSource);
    Console.WriteLine($"✅ Knowledge source '{PoliciesKnowledgeSource}' created");
}
```

<cc-end-step lab="baf4" exercise="2" step="2" />

### Step 3: Update Knowledge Base to Include Policies

Now update the knowledge base definition to include the policies knowledge source.

1️⃣ Find the `new KnowledgeSourceReference(name: ClaimsKnowledgeSource)` syntax, add a comma and add the following line right after it, so it includes both claims and policies:

```csharp
 new KnowledgeSourceReference(name: PoliciesKnowledgeSource)
```

Final version of the knowledge base creation should look like this:

```csharp
var knowledgeBase = new KnowledgeBase(
    name: KnowledgeBaseName,
    knowledgeSources: new[]
    {
        new KnowledgeSourceReference(name: ClaimsKnowledgeSource),
        new KnowledgeSourceReference(name: PoliciesKnowledgeSource)
    }
)
{
    Description = "Zava Insurance knowledge base for claims",
    RetrievalReasoningEffort = new KnowledgeRetrievalLowReasoningEffort(), // Faster for straightforward queries
    OutputMode = KnowledgeRetrievalOutputMode.AnswerSynthesis, // LLM generates natural answers
    Models = { new KnowledgeBaseAzureOpenAIModel(azureOpenAIParameters: aoaiParams) }
};
```

<cc-end-step lab="baf4" exercise="2" step="3" />

### Step 4: Add Policy Data Indexing

Now let's add the method to index sample policies data.

1️⃣ Find the `IndexSampleDataAsync` method and update it to include policies:

```csharp
public async Task IndexSampleDataAsync()
{
    await IndexClaimsDataAsync();
    await IndexPoliciesDataAsync();

    // Upload damage photos to blob storage if BlobStorageService is available
    if (_blobStorageService != null)
    {
        await UploadSampleDamagePhotosAsync();
    }
    Console.WriteLine("✅ Sample data indexed successfully");
}
```

2️⃣ Add the `IndexPoliciesDataAsync` method right after the `IndexClaimsDataAsync` method:

```csharp
/// <summary>
/// Loads and indexes sample policies data from JSON file
/// </summary>
private async Task IndexPoliciesDataAsync()
{
    Console.WriteLine("📝 Indexing sample policies...");
    
    var policiesFile = Path.Combine(AppContext.BaseDirectory, "infra", "data", "sample-data", "policies.json");
    
    if (!File.Exists(policiesFile))
    {
        Console.WriteLine($"⚠️ Policies file not found: {policiesFile}");
        return;
    }

    var policiesJson = await File.ReadAllTextAsync(policiesFile);
    var policies = System.Text.Json.JsonSerializer.Deserialize<List<System.Text.Json.JsonElement>>(policiesJson);

    if (policies == null || policies.Count == 0)
    {
        Console.WriteLine("⚠️ No policies data to index");
        return;
    }

    var searchClient = _indexClient.GetSearchClient(PoliciesIndex);
    var batch = new List<SearchDocument>();

    foreach (var policy in policies)
    {
        var policyNumber = policy.GetProperty("policyNumber").GetString();
        var status = policy.GetProperty("status").GetString() ?? "";
        var random = new Random(policyNumber.GetHashCode());
        
        // Generate policy dates based on status
        DateTime effectiveDate;
        DateTime expirationDate;
        
        if (status == "Active")
        {
            effectiveDate = DateTime.UtcNow.Date.AddDays(-random.Next(180, 730));
            expirationDate = DateTime.UtcNow.Date.AddDays(random.Next(365, 730));
        }
        else if (status == "Expired")
        {
            effectiveDate = DateTime.UtcNow.Date.AddDays(-random.Next(365, 1095));
            expirationDate = DateTime.UtcNow.Date.AddDays(-random.Next(1, 60));
        }
        else
        {
            effectiveDate = DateTime.UtcNow.Date.AddDays(-random.Next(30, 365));
            expirationDate = DateTime.UtcNow.Date.AddDays(random.Next(365, 730));
        }
        
        // Build searchable content
        var searchableContent = $"Policy {policyNumber} for {policy.GetProperty("policyholderName").GetString()}. " +
                              $"Type: {policy.GetProperty("policyType").GetString()}. Status: {status}. " +
                              $"Coverage: ${policy.GetProperty("coverageLimit").GetDouble():N2}.";
        
        // Generate embedding
        var embedding = await CreateEmbeddingAsync(searchableContent);
        
        var doc = new SearchDocument
        {
            ["id"] = policyNumber,
            ["policyNumber"] = policyNumber,
            ["policyholderName"] = policy.GetProperty("policyholderName").GetString(),
            ["policyType"] = policy.GetProperty("policyType").GetString(),
            ["status"] = status,
            ["effectiveDate"] = effectiveDate,
            ["expirationDate"] = expirationDate,
            ["coverageLimit"] = policy.GetProperty("coverageLimit").GetDouble(),
            ["deductible"] = policy.GetProperty("deductible").GetDouble(),
            ["annualPremium"] = policy.GetProperty("annualPremium").GetDouble(),
            ["searchableContent"] = searchableContent,
            ["contentVector"] = embedding
        };
        
        // Add vehicle info for Auto policies
        if (policy.TryGetProperty("vehicleInfo", out var vehicleInfo))
        {
            doc["vehicleMake"] = vehicleInfo.GetProperty("make").GetString();
            doc["vehicleModel"] = vehicleInfo.GetProperty("model").GetString();
            doc["vehicleYear"] = vehicleInfo.GetProperty("year").GetInt32();
            doc["vehicleVin"] = vehicleInfo.GetProperty("vin").GetString();
        }
        
        // Add property info for Homeowners policies
        if (policy.TryGetProperty("propertyInfo", out var propertyInfo))
        {
            doc["propertyAddress"] = propertyInfo.GetProperty("address").GetString();
            doc["propertyType"] = propertyInfo.GetProperty("propertyType").GetString();
        }
        
        batch.Add(doc);
    }

    await searchClient.IndexDocumentsAsync(IndexDocumentsBatch.Upload(batch));
    Console.WriteLine($"✅ Indexed {batch.Count} policies");
}
```

<cc-end-step lab="baf4" exercise="2" step="4" />

### Step 5: Add GetPolicyByNumberAsync Helper Method

Add a helper method to retrieve policy details directly from the index.

1️⃣ In the Retrieval section, add `GetPolicyByNumberAsync` right after `GetClaimByNumberAsync`:

```csharp
/// <summary>
/// Gets policy details directly from the policies index using filter query
/// This bypasses the Knowledge Base API for structured data retrieval
/// </summary>
/// <param name="policyNumber">The policy number to retrieve</param>
/// <returns>SearchDocument with all policy fields or null if not found</returns>
public async Task<SearchDocument?> GetPolicyByNumberAsync(string policyNumber)
{
    var policiesClient = _indexClient.GetSearchClient(PoliciesIndex);
    
    var searchOptions = new SearchOptions
    {
        Filter = $"policyNumber eq '{policyNumber}'",
        Size = 1
    };
    
    var searchResults = await policiesClient.SearchAsync<SearchDocument>("*", searchOptions);
    
    await foreach (var searchResult in searchResults.Value.GetResultsAsync())
    {
        return searchResult.Document;
    }
    
    return null;
}
```

<cc-end-step lab="baf4" exercise="2" step="5" />

## Exercise 3: Create the PolicyPlugin

Now let's create the PolicyPlugin with policy search, policy details, and SharePoint document search capabilities.

### Step 1: Create Complete PolicyPlugin

??? note "What this plugin does"
    The `PolicyPlugin` provides three main capabilities:
    
    - **SearchPolicies**: Searches policies using Azure AI Search Knowledge Base with natural language (similar to ClaimsPlugin)
    - **GetPolicyDetails**: Retrieves structured policy information for a specific policy number
    - **SearchPolicyDocuments**: Uses Microsoft Graph Copilot Retrieval API to search SharePoint policy documents (terms, coverage guides, FAQs)
    
    The SharePoint integration requires user authentication (OBO token) to respect document permissions.

1️⃣ Create a new file `src/Plugins/PolicyPlugin.cs` with the complete implementation:

```csharp
using Microsoft.Agents.Builder;
using Microsoft.Agents.Builder.State;
using Microsoft.Agents.Core.Models;
using System.ComponentModel;
using System.Text;
using System.Text.Json;
using Azure.Search.Documents.Models;
using InsuranceAgent;
using InsuranceAgent.Services;

namespace ZavaInsurance.Plugins
{
    /// <summary>
    /// Policy Plugin for Zava Insurance
    /// Provides policy search and retrieval using Azure AI Search Knowledge Base
    /// Provides policy document search using Copilot Retrieval API for real-time SharePoint access
    /// Supports filtering by policy type, status, and policyholder name
    /// </summary>
    public class PolicyPlugin
    {
        private readonly ITurnContext _turnContext;
        private readonly Microsoft.Agents.Builder.State.ITurnState _turnState;
        private readonly KnowledgeBaseService _knowledgeBaseService;
        private readonly HttpClient _httpClient;

        public PolicyPlugin(ITurnContext turnContext, Microsoft.Agents.Builder.State.ITurnState turnState, KnowledgeBaseService knowledgeBaseService, HttpClient httpClient)
        {
            _turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
            _turnState = turnState ?? throw new ArgumentNullException(nameof(turnState));
            _knowledgeBaseService = knowledgeBaseService ?? throw new ArgumentNullException(nameof(knowledgeBaseService));
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        }

        /// <summary>
        /// Searches for insurance policies using filters
        /// </summary>
        /// <param name="policyType">Filter by policy type (Auto, Homeowners, Commercial) - optional</param>
        /// <param name="status">Filter by status (Active, Expired, Cancelled) - optional</param>
        /// <param name="policyholderName">Filter by policyholder name - optional</param>
        /// <returns>Matching policy information</returns>
        [Description("Searches insurance policies with optional filters for policy type, status, or policyholder name. Returns relevant policies with details.")]
        public async Task<string> SearchPolicies(string policyType = null, string status = null, string policyholderName = null)
        {
            await NotifyUserAsync($"🔍 Searching policies...");

            try
            {
                // Build natural language query for agentic retrieval
                var queryParts = new List<string> { "insurance policies" };
                
                if (!string.IsNullOrWhiteSpace(policyType))
                    queryParts.Add($"type {policyType}");
                if (!string.IsNullOrWhiteSpace(status))
                    queryParts.Add($"status {status}");
                if (!string.IsNullOrWhiteSpace(policyholderName))
                    queryParts.Add($"for {policyholderName}");

                var query = string.Join(" ", queryParts);

                // Use agentic retrieval with instructions for structured policy listing
                var instructions = @"You are an insurance policy specialist. Provide a comprehensive list of matching policies.
                    For each policy, include:
                    - Policy Number and Type
                    - Policyholder Name
                    - Status and Effective Dates
                    - Coverage Limit and Deductible
                    - Premium Amount
                    - Property/Vehicle details if applicable
                    Format with clear sections and bullet points. Cite sources with [ref_id:X].";
                
                var response = await _knowledgeBaseService.RetrieveAsync(query, instructions, topResults: 10);

                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SearchPolicies: {ex.Message}");
                return $"❌ Error searching policies: {ex.Message}";
            }
        }

        /// <summary>
        /// Searches policy documents (terms, coverage guides, handbooks, FAQs) using Copilot Retrieval API
        /// </summary>
        /// <param name="query">Natural language query about policy terms, coverage, or claims procedures</param>
        /// <returns>Relevant policy documentation with citations from SharePoint</returns>
        [Description("Searches policy documentation (coverage guides, policy terms, handbooks, FAQs) in SharePoint using Copilot API. Perfect for finding coverage details, claims procedures, and policy questions.")]
        public async Task<string> SearchPolicyDocuments(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return "❌ Error: Search query cannot be empty.";

            await NotifyUserAsync($"🔍 Searching policy documents in SharePoint for: {query}");

            try
            {
                // Get OBO access token from turn state
                var accessToken = _turnState.Conversation.GetCachedOBOAccessToken();
                if (string.IsNullOrEmpty(accessToken))
                {
                    Console.WriteLine("No OBO token available, authentication may be required");
                    return "❌ Error: Unable to access SharePoint. Please sign in to continue.";
                }

                // Call Copilot Retrieval API (using beta endpoint)
                var payload = new
                {
                    queryString = query,
                    dataSource = "SharePoint",
                    resourceMetadata = new[] { "title", "author" }
                };

                var httpContent = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");

                var response = await _httpClient.PostAsync("https://graph.microsoft.com/beta/copilot/retrieval", httpContent);
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Copilot Retrieval API error: {response.StatusCode}");
                    Console.WriteLine($"Error details: {errorContent}");
                    return $"❌ Error: Unable to retrieve policy documents from SharePoint (Status: {response.StatusCode}). The Copilot Retrieval API may not be available in your tenant.";
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Copilot API Response: {responseContent}");
                
                var jsonResponse = JsonDocument.Parse(responseContent);
                
                // Parse results and format response
                var results = new StringBuilder();
                results.AppendLine("📄 **Policy Documentation from SharePoint:**\n");

                // Copilot Retrieval API returns "retrievalHits" array
                if (jsonResponse.RootElement.TryGetProperty("retrievalHits", out var retrievalHits) && retrievalHits.GetArrayLength() > 0)
                {
                    foreach (var hit in retrievalHits.EnumerateArray())
                    {
                        // Get document title from resourceMetadata
                        string title = "Policy Document";
                        if (hit.TryGetProperty("resourceMetadata", out var metadata) &&
                            metadata.TryGetProperty("title", out var titleProp))
                        {
                            title = titleProp.GetString() ?? title;
                        }

                        // Get extracts (text snippets)
                        if (hit.TryGetProperty("extracts", out var extracts) && extracts.GetArrayLength() > 0)
                        {
                            results.AppendLine($"**{title}**");
                            
                            foreach (var extract in extracts.EnumerateArray())
                            {
                                if (extract.TryGetProperty("text", out var textProp))
                                {
                                    var text = textProp.GetString();
                                    if (!string.IsNullOrWhiteSpace(text))
                                    {
                                        // Clean up and limit text length
                                        text = text.Trim().Replace("\r\n", " ").Replace("\n", " ");
                                        if (text.Length > 500)
                                        {
                                            text = text.Substring(0, 500) + "...";
                                        }
                                        results.AppendLine($"- {text}");
                                    }
                                }
                            }
                            
                            results.AppendLine();
                        }
                    }
                }
                else
                {
                    results.AppendLine("ℹ️ No policy documents found matching your query. Try rephrasing your question or check if the documents exist in SharePoint.");
                }

                return results.ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SearchPolicyDocuments: {ex.Message}");
                Console.WriteLine($"Error type: {ex.GetType().Name}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                return $"❌ Error searching policy documents: {ex.Message}";
            }
        }

        /// <summary>
        /// Gets detailed information about a specific insurance policy
        /// </summary>
        /// <param name="policyNumber">The policy number to retrieve</param>
        /// <returns>Detailed policy information</returns>
        [Description("Retrieves comprehensive details for a specific insurance policy by policy number.")]
        public async Task<string> GetPolicyDetails(string policyNumber)
        {
            if (string.IsNullOrWhiteSpace(policyNumber))
                return "❌ Error: Policy number cannot be empty.";

            await NotifyUserAsync($"Retrieving policy {policyNumber}...");

            // Use direct search for structured data (more reliable than Knowledge Base answer synthesis)
            var policyDoc = await _knowledgeBaseService.GetPolicyByNumberAsync(policyNumber);
            
            if (policyDoc == null)
            {
                return $"❌ Policy {policyNumber} not found in the system.";
            }

            // Extract fields from the search document
            var result = new StringBuilder();
            result.AppendLine("**Policy Information:**");
            result.AppendLine($"- Policy Number: {GetFieldValue(policyDoc, "policyNumber")}");
            result.AppendLine($"- Policy Type: {GetFieldValue(policyDoc, "policyType")}");
            result.AppendLine($"- Status: {GetFieldValue(policyDoc, "status")}");
            result.AppendLine($"- Policyholder Name: {GetFieldValue(policyDoc, "policyholderName")}");
            result.AppendLine();
            
            result.AppendLine("**Coverage & Financial:**");
            result.AppendLine($"- Coverage Limit: ${GetFieldValue(policyDoc, "coverageLimit")}");
            result.AppendLine($"- Deductible: ${GetFieldValue(policyDoc, "deductible")}");
            result.AppendLine($"- Annual Premium: ${GetFieldValue(policyDoc, "annualPremium")}");
            result.AppendLine();

            // Display vehicle or property info based on policy type
            var policyType = GetFieldValue(policyDoc, "policyType");
            if (policyType.Contains("Auto", StringComparison.OrdinalIgnoreCase))
            {
                var vehicleMake = GetFieldValue(policyDoc, "vehicleMake");
                var vehicleModel = GetFieldValue(policyDoc, "vehicleModel");
                var vehicleYear = GetFieldValue(policyDoc, "vehicleYear");
                
                if (vehicleMake != "Not available")
                {
                    result.AppendLine("**Vehicle Information:**");
                    result.AppendLine($"- Vehicle: {vehicleYear} {vehicleMake} {vehicleModel}");
                    result.AppendLine($"- VIN: {GetFieldValue(policyDoc, "vehicleVin")}");
                }
            }
            else if (policyType.Contains("Home", StringComparison.OrdinalIgnoreCase))
            {
                var propertyAddress = GetFieldValue(policyDoc, "propertyAddress");
                if (propertyAddress != "Not available")
                {
                    result.AppendLine("**Property Information:**");
                    result.AppendLine($"- Address: {propertyAddress}");
                    result.AppendLine($"- Property Type: {GetFieldValue(policyDoc, "propertyType")}");
                }
            }

            return result.ToString();
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

        // Helper methods
        private async Task NotifyUserAsync(string message)
        {
            if (!_turnContext.Activity.ChannelId.Channel!.Contains(Channels.Webchat))
            {
                await _turnContext.StreamingResponse.QueueInformativeUpdateAsync(message);
            }
            else
            {
                Console.WriteLine(message);
            }
        }
    }
}
```

<cc-end-step lab="baf4" exercise="3" step="1" />

## Exercise 4: Register PolicyPlugin in Agent

Now let's wire up the PolicyPlugin in your ZavaInsuranceAgent.

### Step 1: Update Program.cs Initialization

Update the initialization code in Program.cs to create the policies index.

1️⃣ Open `src/Program.cs`.

2️⃣ Find the Azure AI Search initialization section and update it to include policies:

```csharp
Console.WriteLine("🔍 Initializing Azure AI Search Knowledge Base...");

// IMPORTANT: Must follow this order - indexes → knowledge sources → knowledge base → data
await kbService.EnsureClaimsIndexAsync();          // 1. Create claims index
await kbService.EnsurePoliciesIndexAsync();        // 2. Create policies index
await kbService.CreateKnowledgeSourcesAsync();     // 3. Create knowledge sources (now includes policies)
await kbService.CreateKnowledgeBaseAsync();        // 4. Create knowledge base
await kbService.IndexSampleDataAsync();            // 5. Index sample data (claims + policies)

Console.WriteLine("✅ Knowledge Base initialized successfully");
```

<cc-end-step lab="baf4" exercise="4" step="1" />

### Step 2: Update Agent Instructions

Update the agent instructions to include policy tools.

1️⃣ Open `src/Agent/ZavaInsuranceAgent.cs`.

2️⃣ Find the `AgentInstructions` property and update it:

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
For policy coverage questions and terms, use {{PolicyPlugin.SearchPolicyDocuments}}.

**IMPORTANT**: When user asks to "check policy for this claim", first use GetClaimDetails to get the claim's policy number, then use GetPolicyDetails with that policy number.

Stick to the scenario above and use only the information from the tools when answering questions.
Be concise and professional in your responses.
""";
```

<cc-end-step lab="baf4" exercise="4" step="2" />

### Step 3: Register PolicyPlugin

Add the PolicyPlugin to your agent's tools.

1️⃣ In the `GetClientAgent` method, find where `ClaimsPlugin claimsPlugin = new(context, knowledgeBaseService, configuration);` is and add PolicyPlugin right after:

```csharp

// Get HttpClient for API calls
var httpClientFactory = scope.ServiceProvider.GetRequiredService<IHttpClientFactory>();
var httpClient = httpClientFactory.CreateClient();

// Create PolicyPlugin with required dependencies
PolicyPlugin policyPlugin = new(context, turnState, knowledgeBaseService, httpClient);
```

2️⃣ Find where ClaimsPlugin tools are registered and add PolicyPlugin tools:

```csharp

// Register PolicyPlugin tools
toolOptions.Tools.Add(AIFunctionFactory.Create(policyPlugin.SearchPolicies));
toolOptions.Tools.Add(AIFunctionFactory.Create(policyPlugin.GetPolicyDetails));
toolOptions.Tools.Add(AIFunctionFactory.Create(policyPlugin.SearchPolicyDocuments));
```

<cc-end-step lab="baf4" exercise="4" step="3" />

### Step 4: Update StartConversationPlugin Welcome Message

Now that we've added policy search and SharePoint integration, let's update the welcome message to reflect all features.

1️⃣ Open `src/Plugins/StartConversationPlugin.cs`.

2️⃣ Find the `welcomeMessage` variable in the `StartConversation` method and replace it with:

```csharp
            var welcomeMessage = "👋 Welcome to Zava Insurance Claims Assistant!\n\n" +
                                "I'm your AI-powered insurance claims specialist. I help adjusters and investigators streamline the entire claims process - from initial assessment to final approval.\n\n" +
                                "**What I can do:**\n\n" +
                                "- Search and retrieve detailed claim information\n" +
                                "- Validate policy coverage and check expiration dates\n" +
                                "- Search policy documentation from SharePoint\n" +
                                "- Use Mistral AI to analyze damage photos instantly\n" +
                                "- Provide damage assessments with cost estimates\n" +
                                "- Track claim timelines and identify processing bottlenecks\n\n" +
                                "🎯 Try this complete workflow:\n" +
                                "1. \"Get details for claim CLM-2025-001007\"\n" +
                                "2. \"Check policy for this claim\"\n" +
                                "3. \"What coverage does auto insurance include?\"\n" +
                                "4. \"Show damage photo for this claim\"\n" +
                                "5. \"Analyze this damage photo\"\n" +
                                "6. \"Approve the analysis\" or \"Reject the analysis\"\n" +
                                "7. \"What's the claims filing procedure?\"\n\n" +
                                "Ready to complete a full claims investigation? What would you like to start with?";
```

??? note "Complete feature set"
    The welcome message now includes all capabilities: claims search, policy validation, SharePoint document search, and vision analysis. This matches the full feature set of the completed agent.

<cc-end-step lab="baf4" exercise="4" step="4" />

## Exercise 5: Test Policy Search and SharePoint Integration

Now let's test all policy capabilities!

### Step 1: Run and Verify Initialization

1️⃣ Press **F5** in VS Code to start debugging.

2️⃣ Select **(Preview) Debug in Copilot (Edge)** if prompted.

3️⃣ Watch the terminal output - you should see:

```
🔍 Initializing Azure AI Search Knowledge Base...
📝 Creating claims index 'claims-index'...
✅ Claims index created successfully
📝 Creating policies index 'policies-index'...
✅ Policies index created successfully
✅ Knowledge source 'claims-knowledge-source' created
✅ Knowledge source 'policies-knowledge-source' created
✅ Knowledge base 'zava-insurance-kb' created with model 'gpt-4.1'
📝 Indexing sample claims...
✅ Indexed 35 claims
📝 Indexing sample policies...
✅ Indexed 30 policies
✅ Sample data indexed successfully
✅ Knowledge Base initialized successfully
```

4️⃣ A browser window will open with Microsoft 365 Copilot.

5️⃣ **Verify in Azure Portal**:

- Go to [Azure Portal](https://portal.azure.com){target=_blank}
- Navigate to your Azure AI Search service
- Click **Indexes** → You should see both `claims-index` and `policies-index`
- Click **Agentic retrieval** > **Knowledge Bases** → `zava-insurance-kb` should show 2 knowledge sources

<cc-end-step lab="baf4" exercise="5" step="1" />

### Step 2: Test Policy Search

1️⃣ In Microsoft 365 Copilot, try: 

```text
Find all active auto insurance policies
```

The agent should use `SearchPolicies` and return matching policies with details.

2️⃣ Try: 

```text
Show me policies for Sarah Martinez
```

3️⃣ Try: 

```text
Find homeowners insurance policies with Active status
```

<cc-end-step lab="baf4" exercise="5" step="2" />

### Step 3: Test Policy Details

1️⃣ Try: 

```text
Get details for policy POL-AUTO-001
```

The agent should use `GetPolicyDetails` and return structured information including coverage, vehicle info, etc.

2️⃣ Try: 

```text
Show me policy POL-HOME-001
```

3️⃣ Try the claim-to-policy workflow: 

```text
Get details for claim CLM-2025-001001, then show me the policy for that claim
```

The agent should first get the claim details (which includes policy number), then retrieve the policy details.

<cc-end-step lab="baf4" exercise="5" step="3" />

### Step 4: Test SharePoint Document Search

!!! warning "Prerequisite"
    Ensure you completed Exercise 1 and waited 10-15 minutes for SharePoint to index your documents before testing this.

1️⃣ Try: 

```text
What does the policy say about water damage coverage
```

The agent should use `SearchPolicyDocuments` to search SharePoint and return relevant excerpts.

2️⃣ Try: 

```text
Search policy documents for deductible information
```

3️⃣ Try: 

```text
Find information about filing an auto insurance claim in the policy documents
```

4️⃣ **Troubleshooting**:

   - If you get authentication errors, ensure you're signed in to Microsoft 365 Copilot
   - If no results are returned, wait longer for SharePoint indexing (can take up to 30 minutes)
   - Check that documents were uploaded to your SharePoint site successfully

<cc-end-step lab="baf4" exercise="5" step="4" />

---8<--- "b-congratulations.md"

You have completed Lab BAF4 - Add Policy Search and SharePoint Integration!

You've learned how to:

- ✅ Set up SharePoint site with policy documents
- ✅ Add policies index and knowledge source to Azure AI Search
- ✅ Create a PolicyPlugin with search, details, and document capabilities
- ✅ Integrate Microsoft Graph Copilot Retrieval API for SharePoint search
- ✅ Test policy search and SharePoint document retrieval

Your Zava Insurance Agent can now search both claims and policies, and access policy documentation from SharePoint in real-time!

<cc-next url="../05-add-communication" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/04-add-policy-search" />
