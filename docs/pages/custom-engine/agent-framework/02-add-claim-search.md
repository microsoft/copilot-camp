# Lab BAF2 - Add Document Search with Azure AI Search

In this lab, you'll enhance your Zava Insurance Agent by adding document search capabilities using Azure AI Search. You'll create a ClaimsPlugin that uses AI-powered retrieval to search through insurance claims, retrieve claim details, and identify claims with missing documentation.

???+ info "Understanding Azure AI Search Concepts"
    **Azure AI Search** is a cloud search service that provides infrastructure, APIs, and tools for building rich search experiences over your content.
    
    **Key Concepts:**
    
    - **Search Index**: A searchable collection of documents, similar to a database table. Each index contains documents with fields that can be searched, filtered, and sorted.
    - **Knowledge Source**: A logical grouping that connects your data to an index. It defines where your data comes from and how it should be indexed.
    - **Knowledge Base**: A unified interface that brings together multiple knowledge sources, allowing you to search across different data sources with a single query.
    
    In this lab, you'll create a **claims index** to store insurance claims data, configure a **knowledge source** to connect your data, and set up a **knowledge base** for unified retrieval. Your ClaimsPlugin will use these components to perform AI-powered searches.

## Exercise 1: Set Up Azure AI Search

Before we add the plugin, let's set up Azure AI Search with sample claims data.

### Step 1: Create Azure AI Search Service

If you haven't created an Azure AI Search service yet (from Lab BAF0), create one now.

1️⃣ Go to the [Azure Portal](https://portal.azure.com){target=_blank}.

2️⃣ Click **+ Create a resource** → Search for **Azure AI Search** → Click **Create**.

3️⃣ Configure:

- **Resource Group**: Use the same as your Microsoft Foundry project
- **Service Name**: Choose a unique name (e.g., `zava-insurance-search`)
- **Region**: Any supported location (Central US, East US, West Europe, etc.)
- **Pricing Tier**: Basic

4️⃣ Click **Review + Create** → **Create** (takes 2-3 minutes).

5️⃣ Once deployed, go to the resource **Overview** page and copy the **URL**.

6️⃣ Then, go to **Settings** > **Keys** and copy **Primary Admin Key**

<cc-end-step lab="baf2" exercise="1" step="1" />

### Step 2: Add Sample Claims Data

Your project includes sample claims data that will be automatically indexed.

1️⃣ In VS Code, navigate to `infra/data/sample-data/claims.json`.

2️⃣ Notice the structure - each claim has:

- `claimNumber`: Unique identifier (e.g., "CLM-2025-001001")
- `policyholderName`: Customer name
- `claimType`: Auto, Homeowners, or Commercial
- `status`: Open, In Progress, Approved, Closed
- `severity`: Low, Medium, High, Critical
- `estimatedCost`: Claim amount
- `fraudRiskScore`: Risk indicator (0-100)
- `region`: Northeast, South, Midwest, West

3️⃣ This data will be indexed into Azure AI Search when you run the agent.

<cc-end-step lab="baf2" exercise="1" step="2" />

### Step 3: Configure Azure AI Search Credentials

Now let's add your Azure AI Search credentials to the project.

1️⃣ Open `env/.env.local` in VS Code.

2️⃣ Find the Azure AI Search section and update:

```bash
# Azure AI Search
AZURE_AI_SEARCH_ENDPOINT=https://your-search.search.windows.net
```

3️⃣ Open `env/.env.local.user` in VS Code.

4️⃣ Find the Azure AI Search section and update:

```bash
# Azure AI Search
SECRET_AZURE_AI_SEARCH_API_KEY=your-primary-admin-key
```

!!! tip "Finding Your Credentials"
    - **Endpoint**: Azure Portal → Your Search Service → Overview → URL
    - **API Key**: Azure Portal → Your Search Service → Keys → Primary Admin Key

<cc-end-step lab="baf2" exercise="1" step="3" />

## Exercise 2: Create the KnowledgeBaseService

The KnowledgeBaseService handles all interactions with Azure AI Search, including creating indexes, knowledge sources, knowledge bases, indexing data, and performing AI-powered retrieval.

### Step 1: Create Complete KnowledgeBaseService

??? note "What this code does"
    The `KnowledgeBaseService` is the core service for Azure AI Search integration:
    
    - **Constructor**: Initializes connections to Azure AI Search and Azure OpenAI using configuration
    - **EnsureClaimsIndexAsync**: Creates the search index with semantic and vector search (required by Knowledgebases)
    - **CreateKnowledgeSourcesAsync**: Sets up knowledge source that defines data fields for indexing
    - **CreateKnowledgeBaseAsync**: Creates knowledge base with LLM model for answer synthesis
    - **RetrieveAsync**: Main agentic retrieval method - uses LLM to search and synthesize answers with optional instructions for formatting
    - **IndexClaimsDataAsync**: Loads and indexes sample claims data from JSON file
    
    This service provides complete Azure AI Search functionality with agentic retrieval capabilities.

1️⃣ In VS Code, create a new folder `src/Services`.

2️⃣ Create a new file `src/Services/KnowledgeBaseService.cs` and add the complete implementation:

```csharp
using Azure;
using Azure.AI.OpenAI;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;
using Azure.Search.Documents.Models;
using Azure.Search.Documents.KnowledgeBases;
using Azure.Search.Documents.KnowledgeBases.Models;
using Microsoft.Extensions.Configuration;
using System.Text;
using OpenAI.Chat;

namespace InsuranceAgent.Services;

public class KnowledgeBaseService
{
    private readonly IConfiguration _configuration;
    private readonly string _searchEndpoint;
    private readonly string _searchApiKey;
    private readonly SearchIndexClient _indexClient;
    private readonly KnowledgeBaseRetrievalClient _retrievalClient;
    private readonly string _aiEndpoint;
    private readonly string _aiApiKey;
    private readonly string _embeddingModel;
    private readonly AzureOpenAIClient _openAIClient;
    
    private const string ClaimsKnowledgeSource = "claims-knowledge-source";
    private const string ClaimsIndex = "claims-index";
    private const string KnowledgeBaseName = "zava-insurance-kb";

    public KnowledgeBaseService(IConfiguration configuration)
    {
        _configuration = configuration;

        // Load Azure AI Search configuration
        _searchEndpoint = configuration["AZURE_AI_SEARCH_ENDPOINT"]
            ?? throw new InvalidOperationException("AZURE_AI_SEARCH_ENDPOINT not configured");
        _searchApiKey = configuration["SECRET_AZURE_AI_SEARCH_API_KEY"]
            ?? throw new InvalidOperationException("SECRET_AZURE_AI_SEARCH_API_KEY not configured");
        
        // Load Azure OpenAI configuration for embeddings and LLM
        _aiEndpoint = configuration["MODELS_ENDPOINT"]
            ?? throw new InvalidOperationException("MODELS_ENDPOINT not configured");
        _aiApiKey = configuration["AIModels:ApiKey"]
            ?? throw new InvalidOperationException("AIModels:ApiKey not configured");
        _embeddingModel = configuration["EMBEDDING_MODEL_NAME"] ?? "text-embedding-ada-002";

        // Initialize Azure AI Search clients
        var credential = new AzureKeyCredential(_searchApiKey);
        _indexClient = new SearchIndexClient(new Uri(_searchEndpoint), credential);
        _retrievalClient = new KnowledgeBaseRetrievalClient(
            new Uri(_searchEndpoint), 
            KnowledgeBaseName, 
            credential
        );
        
        // Initialize Azure OpenAI client
        _openAIClient = new AzureOpenAIClient(
            new Uri(_aiEndpoint), 
            new AzureKeyCredential(_aiApiKey)
        );
    }

    /// <summary>
    /// Creates the claims search index if it doesn't exist
    /// Includes semantic search (required by Knowledgebases) and vector search
    /// </summary>
    public async Task EnsureClaimsIndexAsync()
    {
        try
        {
            var existingIndex = await _indexClient.GetIndexAsync(ClaimsIndex);
            Console.WriteLine($"✅ Claims index '{ClaimsIndex}' already exists");
            return;
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            Console.WriteLine($"📝 Creating claims index '{ClaimsIndex}'...");
            
            // Define index schema with all claim fields
            var index = new SearchIndex(ClaimsIndex)
            {
                Fields =
                {
                    new SimpleField("id", SearchFieldDataType.String) { IsKey = true, IsFilterable = true },
                    new SearchableField("claimNumber") { IsFilterable = true, IsSortable = true },
                    new SearchableField("policyholderName") { IsFilterable = true },
                    new SearchableField("policyNumber") { IsFilterable = true },
                    new SearchableField("status") { IsFilterable = true, IsFacetable = true },
                    new SearchableField("claimType") { IsFilterable = true, IsFacetable = true },
                    new SearchableField("region") { IsFilterable = true, IsFacetable = true },
                    new SearchableField("assignedAdjuster") { IsFilterable = true },
                    new SimpleField("dateFiled", SearchFieldDataType.DateTimeOffset) { IsFilterable = true, IsSortable = true },
                    new SimpleField("dateResolved", SearchFieldDataType.DateTimeOffset) { IsFilterable = true, IsSortable = true },
                    new SearchableField("description"),
                    new SearchableField("location") { IsFilterable = true },
                    new SearchableField("severity") { IsFilterable = true, IsFacetable = true },
                    new SimpleField("claimAmount", SearchFieldDataType.Double) { IsFilterable = true, IsSortable = true },
                    new SimpleField("fraudScore", SearchFieldDataType.Int32) { IsFilterable = true, IsSortable = true },
                    new SearchableField("fraudIndicators"),
                    new SearchableField("adjusterNotes"),
                    new SimpleField("imageUrl", SearchFieldDataType.String) { IsFilterable = false },
                    new SimpleField("thumbnailUrl", SearchFieldDataType.String) { IsFilterable = false },
                    new SearchField("contentVector", SearchFieldDataType.Collection(SearchFieldDataType.Single))
                    {
                        IsSearchable = true,
                        VectorSearchDimensions = 1536,
                        VectorSearchProfileName = "vector-profile"
                    },
                    new SearchableField("searchableContent")
                },
                VectorSearch = CreateVectorSearchConfig(),
                SemanticSearch = CreateSemanticConfig("Claims semantic search", "claimNumber", "description", "assignedAdjuster")
            };
            
            await _indexClient.CreateIndexAsync(index);
            Console.WriteLine($"✅ Claims index created successfully");
        }
    }

    /// <summary>
    /// Creates knowledge sources that connect the indexes to the knowledge base
    /// </summary>
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
                    new SearchIndexFieldReference(name: "dateFiled"),
                    new SearchIndexFieldReference(name: "dateResolved"),
                    new SearchIndexFieldReference(name: "claimAmount"),
                    new SearchIndexFieldReference(name: "region"),
                    new SearchIndexFieldReference(name: "assignedAdjuster"),
                    new SearchIndexFieldReference(name: "description"),
                    new SearchIndexFieldReference(name: "location"),
                    new SearchIndexFieldReference(name: "severity"),
                    new SearchIndexFieldReference(name: "fraudScore"),
                    new SearchIndexFieldReference(name: "fraudIndicators"),
                    new SearchIndexFieldReference(name: "adjusterNotes")
                }
            }
        );

        await _indexClient.CreateOrUpdateKnowledgeSourceAsync(claimsKnowledgeSource);
        Console.WriteLine($"✅ Knowledge source '{ClaimsKnowledgeSource}' created");
    }

    /// <summary>
    /// Creates knowledge base with LLM model configuration for answer synthesis
    /// Uses gpt-4.1 to generate natural language answers from retrieved documents
    /// </summary>
    public async Task CreateKnowledgeBaseAsync()
    {
        // Get the language model deployment name from configuration
        var config = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.local.json", optional: true)
            .Build();
        
        var modelName = config["AIModels:LanguageModel:Name"] ?? "gpt-4.1";
        
        // Configure Azure OpenAI model parameters for the knowledge base
        var aoaiParams = new AzureOpenAIVectorizerParameters
        {
            ResourceUri = new Uri(_aiEndpoint),
            ApiKey = _aiApiKey,
            DeploymentName = modelName,
            ModelName = modelName
        };

        var knowledgeBase = new KnowledgeBase(
            name: KnowledgeBaseName,
            knowledgeSources: new[]
            {
                new KnowledgeSourceReference(name: ClaimsKnowledgeSource)
            }
        )
        {
            Description = "Zava Insurance knowledge base for claims",
            RetrievalReasoningEffort = new KnowledgeRetrievalLowReasoningEffort(), // Faster for straightforward queries
            OutputMode = KnowledgeRetrievalOutputMode.AnswerSynthesis, // LLM generates natural answers
            Models = { new KnowledgeBaseAzureOpenAIModel(azureOpenAIParameters: aoaiParams) }
        };

        await _indexClient.CreateOrUpdateKnowledgeBaseAsync(knowledgeBase);
        Console.WriteLine($"✅ Knowledge base '{KnowledgeBaseName}' created with model '{modelName}'");
    }

    /// <summary>
    /// Performs agentic retrieval using Knowledgebases with optional instructions
    /// The LLM searches, ranks, and synthesizes a natural language response
    /// </summary>
    /// <param name="query">Natural language query</param>
    /// <param name="instructions">Optional formatting instructions for LLM output (sent as assistant role message)</param>
    /// <param name="topResults">Number of top results to retrieve</param>
    public async Task<string> RetrieveAsync(string query, string? instructions = null, int topResults = 5)
    {
        // Use Knowledge Base retrieval API for LLM-powered search
        var retrievalRequest = new KnowledgeBaseRetrievalRequest
        {
            RetrievalReasoningEffort = new KnowledgeRetrievalLowReasoningEffort(),
            OutputMode = KnowledgeRetrievalOutputMode.AnswerSynthesis // Enable answer synthesis for better responses
        };
        
        // Add instructions as assistant role message if provided
        if (!string.IsNullOrEmpty(instructions))
        {
            retrievalRequest.Messages.Add(new KnowledgeBaseMessage(
                content: new[] { new KnowledgeBaseMessageTextContent(instructions) }
            ) 
            { 
                Role = "assistant" 
            });
        }
        
        // Add user message with the query
        retrievalRequest.Messages.Add(new KnowledgeBaseMessage(
            content: new[] { new KnowledgeBaseMessageTextContent(query) }
        ) 
        { 
            Role = "user" 
        });
        
        var retrievalResult = await _retrievalClient.RetrieveAsync(retrievalRequest);
        
        // Extract the LLM-synthesized answer
        var result = new StringBuilder();
        
        if (retrievalResult.Value.Response != null && retrievalResult.Value.Response.Count > 0)
        {
            foreach (var response in retrievalResult.Value.Response)
            {
                foreach (var content in response.Content)
                {
                    if (content is KnowledgeBaseMessageTextContent textContent)
                    {
                        result.AppendLine(textContent.Text);
                    }
                }
            }
        }
        
        return result.ToString();
    }

    /// <summary>
    /// Gets claim details directly from the claims index using filter query
    /// This bypasses the Knowledgebases for structured data retrieval
    /// </summary>
    /// <param name="claimNumber">The claim number to retrieve</param>
    /// <returns>SearchDocument with all claim fields or null if not found</returns>
    public async Task<SearchDocument?> GetClaimByNumberAsync(string claimNumber)
    {
        var claimsClient = _indexClient.GetSearchClient(ClaimsIndex);
        
        var searchOptions = new SearchOptions
        {
            Filter = $"claimNumber eq '{claimNumber}'",
            Size = 1
        };
        
        var searchResults = await claimsClient.SearchAsync<SearchDocument>("*", searchOptions);
        
        await foreach (var searchResult in searchResults.Value.GetResultsAsync())
        {
            return searchResult.Document;
        }
        
        return null;
    }

    /// <summary>
    /// Calls Azure OpenAI directly for structured JSON responses without answer synthesis
    /// Use this for fraud analysis or other tasks requiring strict JSON schema adherence
    /// </summary>
    /// <param name="systemPrompt">System instructions for the AI</param>
    /// <param name="userPrompt">User query/data to analyze</param>
    /// <param name="modelName">Model deployment name (default: gpt-4)</param>
    /// <returns>Raw AI response without Knowledge Base processing</returns>
    public async Task<string> GetDirectChatCompletionAsync(string systemPrompt, string userPrompt, string? modelName = null)
    {
        var model = modelName ?? _configuration["AIModels:LanguageModel:Name"] ?? "gpt-4.1";
        var chatClient = _openAIClient.GetChatClient(model);

        var messages = new List<OpenAI.Chat.ChatMessage>
        {
            new OpenAI.Chat.SystemChatMessage(systemPrompt),
            new OpenAI.Chat.UserChatMessage(userPrompt)
        };

        var chatOptions = new OpenAI.Chat.ChatCompletionOptions
        {
            Temperature = 0.1f, // Low temperature for consistent JSON output
            MaxOutputTokenCount = 2000
        };

        Console.WriteLine($"🤖 Calling Azure OpenAI directly (model: {model})...");
        var response = await chatClient.CompleteChatAsync(messages, chatOptions);
        
        var content = response.Value.Content[0].Text;
        Console.WriteLine($"✅ Direct OpenAI response: {content.Substring(0, Math.Min(100, content.Length))}...");
        
        return content;
    }

    /// <summary>
    /// Indexes sample claims data
    /// </summary>
    public async Task IndexSampleDataAsync()
    {
        await IndexClaimsDataAsync();
        Console.WriteLine("✅ Sample data indexed successfully");
    }

    /// <summary>
    /// Loads and indexes sample claims data from JSON file
    /// </summary>
    private async Task IndexClaimsDataAsync()
    {
        Console.WriteLine("📝 Indexing sample claims...");
        
        var claimsFile = Path.Combine(AppContext.BaseDirectory, "infra", "data", "sample-data", "claims.json");
        
        if (!File.Exists(claimsFile))
        {
            Console.WriteLine($"⚠️ Claims file not found: {claimsFile}");
            return;
        }

        var claimsJson = await File.ReadAllTextAsync(claimsFile);
        var claims = System.Text.Json.JsonSerializer.Deserialize<List<System.Text.Json.JsonElement>>(claimsJson);

        if (claims == null || claims.Count == 0)
        {
            Console.WriteLine("⚠️ No claims data to index");
            return;
        }

        var searchClient = _indexClient.GetSearchClient(ClaimsIndex);
        var batch = new List<SearchDocument>();

        // Create search documents from claims JSON with enhanced fields
        foreach (var claim in claims)
        {
            var claimNumber = claim.GetProperty("claimNumber").GetString();
            var status = claim.GetProperty("status").GetString() ?? "";
            var claimId = claim.GetProperty("id").GetInt32();
            var random = new Random(claimId);
            
            // Generate DateFiled based on claim status (same logic as complete solution)
            DateTime dateFiled;
            DateTime? dateResolved = null;
            
            if (status == "Open" || status == "Under Review")
            {
                dateFiled = DateTime.UtcNow.AddDays(-random.Next(0, 4));
            }
            else if (status == "In Progress")
            {
                dateFiled = DateTime.UtcNow.AddDays(-random.Next(4, 11));
            }
            else if (status == "Approved" || status == "Closed")
            {
                dateFiled = DateTime.UtcNow.AddDays(-random.Next(10, 31));
                dateResolved = DateTime.UtcNow.AddDays(-random.Next(2, 6));
            }
            else
            {
                dateFiled = DateTime.UtcNow.AddDays(-random.Next(5, 21));
            }
            
            // Build searchable content for embedding
            var searchableContent = $"Claim {claimNumber} - {claim.GetProperty("claimType").GetString()} for {claim.GetProperty("policyholderName").GetString()}. " +
                                  $"Status: {status}. Location: {claim.GetProperty("location").GetString()}. Description: {claim.GetProperty("description").GetString()}. " +
                                  $"Severity: {claim.GetProperty("severity").GetString()}. Estimated Cost: ${claim.GetProperty("estimatedCost").GetDouble():N2}.";
            
            // Generate embedding for vector search
            var embedding = await CreateEmbeddingAsync(searchableContent);
            
            var doc = new SearchDocument
            {
                ["id"] = claimNumber,
                ["claimNumber"] = claimNumber,
                ["policyholderName"] = claim.GetProperty("policyholderName").GetString(),
                ["policyNumber"] = claim.GetProperty("policyNumber").GetString(),
                ["claimType"] = claim.GetProperty("claimType").GetString(),
                ["status"] = status,
                ["severity"] = claim.GetProperty("severity").GetString(),
                ["region"] = claim.GetProperty("region").GetString(),
                ["assignedAdjuster"] = claim.GetProperty("assignedAdjuster").GetString(),
                ["dateFiled"] = dateFiled,
                ["dateResolved"] = dateResolved,
                ["description"] = claim.GetProperty("description").GetString(),
                ["location"] = claim.GetProperty("location").GetString(),
                ["claimAmount"] = claim.GetProperty("estimatedCost").GetDouble(),
                ["fraudScore"] = claim.GetProperty("fraudRiskScore").GetInt32(),
                ["fraudIndicators"] = claim.GetProperty("fraudIndicators").GetString(),
                ["adjusterNotes"] = $"Assigned to {claim.GetProperty("assignedAdjuster").GetString()}",
                ["searchableContent"] = searchableContent,
                ["contentVector"] = embedding
            };
            
            batch.Add(doc);
        }

        // Upload all documents in a single batch
        await searchClient.IndexDocumentsAsync(IndexDocumentsBatch.Upload(batch));
        Console.WriteLine($"✅ Indexed {batch.Count} claims");
    }

    /// <summary>
    /// Generates embeddings for text content using Azure OpenAI
    /// </summary>
    private async Task<float[]> CreateEmbeddingAsync(string text)
    {
        var embeddingClient = _openAIClient.GetEmbeddingClient(_embeddingModel);
        var response = await embeddingClient.GenerateEmbeddingAsync(text);
        return response.Value.ToFloats().ToArray();
    }

    #region Helper Methods

    /// <summary>
    /// Creates vector search configuration for embeddings-based similarity search
    /// </summary>
    private VectorSearch CreateVectorSearchConfig()
    {
        return new VectorSearch
        {
            Profiles =
            {
                new VectorSearchProfile("vector-profile", "hnsw-config")
            },
            Algorithms =
            {
                new HnswAlgorithmConfiguration("hnsw-config")
            }
        };
    }

    /// <summary>
    /// Creates semantic search configuration (required by Knowledgebases)
    /// </summary>
    private SemanticSearch CreateSemanticConfig(string configName, string titleField, string contentField, string keywordsField)
    {
        return new SemanticSearch
        {
            Configurations =
            {
                new SemanticConfiguration(configName, new SemanticPrioritizedFields
                {
                    TitleField = new SemanticField(titleField),
                    ContentFields = { new SemanticField(contentField) },
                    KeywordsFields = { new SemanticField(keywordsField) }
                })
            }
        };
    }

    #endregion
}
```

<cc-end-step lab="baf2" exercise="2" step="6" />

## Exercise 3: Create the ClaimsPlugin

Now let's create the ClaimsPlugin that uses the KnowledgeBaseService to provide claim search capabilities to your agent.

### Step 1: Create Complete ClaimsPlugin

??? note "What this code does"
    The `ClaimsPlugin` provides claim search capabilities to your agent:
    
    - **SearchClaims**: Searches for claims by region, type, severity, or status - builds natural language query and uses agentic retrieval with structured output instructions
    - **GetClaimDetails**: Retrieves comprehensive information for a specific claim ID with detailed formatting instructions for the LLM
    - **NotifyUserAsync**: Helper method to send real-time status updates to users ("Searching...", "Retrieved data...") using StreamingResponse
    
    Each method has a `[Description]` attribute that tells the AI agent when and how to use the tool. The AI automatically decides which tool to call based on user intent.

1️⃣ Create a new file `src/Plugins/ClaimsPlugin.cs` and add the complete implementation:

```csharp
using Microsoft.Agents.Builder;
using Microsoft.Agents.Core;
using Microsoft.Agents.Core.Models;
using Microsoft.Extensions.Configuration;
using System.ComponentModel;
using System.Text;
using InsuranceAgent.Services;
using Azure.Search.Documents.Models;

namespace ZavaInsurance.Plugins
{
    /// <summary>
    /// Plugin that provides claim search and retrieval capabilities using Azure AI Search
    /// </summary>
    public class ClaimsPlugin
    {
        private readonly ITurnContext _turnContext;
        private readonly KnowledgeBaseService _knowledgeBaseService;
        private readonly IConfiguration _configuration;

        public ClaimsPlugin(
            ITurnContext turnContext, 
            KnowledgeBaseService knowledgeBaseService,
            IConfiguration configuration)
        {
            _turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
            _knowledgeBaseService = knowledgeBaseService ?? throw new ArgumentNullException(nameof(knowledgeBaseService));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Searches for claims based on multiple criteria (region, type, severity, status)
        /// Returns up to 10 matching claims with structured summaries
        /// </summary>
        [Description("Searches for insurance claims based on region, type, severity, and status. Returns a summary of matching claims.")]
        public async Task<string> SearchClaims(
            string region = null,
            string claimType = null,
            string severity = null,
            string status = null)
        {
            await NotifyUserAsync($"Searching claims database using AI Search...");

            // Build natural language query from parameters
            var queryParts = new List<string> { "insurance claims" };
            
            if (!string.IsNullOrEmpty(region))
                queryParts.Add($"in {region} region");
            if (!string.IsNullOrEmpty(claimType))
                queryParts.Add($"of type {claimType}");
            if (!string.IsNullOrEmpty(severity))
                queryParts.Add($"with {severity} severity");
            if (!string.IsNullOrEmpty(status))
                queryParts.Add($"with status {status}");

            var query = string.Join(" ", queryParts);

            // Use agentic retrieval with instructions for structured output
            var instructions = @"You are an insurance claims specialist. Provide a clear, structured summary of matching claims.
                Format your response as follows:
                - Total number of claims found
                - For each claim, include: Claim Number, Policyholder, Claim Type, Amount, Status, Date Filed, Severity, Region
                - Use bullet points for readability
                - Include relevant details like adjuster notes or special circumstances
                - Cite sources using [ref_id:X] format";
            
            // Retrieve up to 10 matching claims
            var response = await _knowledgeBaseService.RetrieveAsync(query, instructions, topResults: 10);

            await NotifyUserAsync($"Retrieved claims information");

            return response;
        }

        /// <summary>
        /// Retrieves comprehensive details for a specific claim by claim number
        /// Uses direct document access for structured data retrieval
        /// </summary>
        [Description("Retrieves detailed information for a specific claim by claim ID, including policyholder info, documentation, and history.")]
        public async Task<string> GetClaimDetails(string claimId)
        {
            await NotifyUserAsync($"Retrieving details for claim {claimId}...");

            // Use direct search to get structured data (more reliable than Knowledge Base answer synthesis)
            var claimDoc = await _knowledgeBaseService.GetClaimByNumberAsync(claimId);

            if (claimDoc == null)
            {
                return $"❌ Claim {claimId} not found in the system.";
            }

            // Extract fields from the search document
            var result = new StringBuilder();
            result.AppendLine("**Claim Information:**");
            result.AppendLine($"- Claim Number: {GetFieldValue(claimDoc, "claimNumber")}");
            result.AppendLine($"- Status: {GetFieldValue(claimDoc, "status")}");
            result.AppendLine($"- Claim Type: {GetFieldValue(claimDoc, "claimType")}");
            result.AppendLine();

            result.AppendLine("**Policyholder & Policy:**");
            result.AppendLine($"- Policyholder Name: {GetFieldValue(claimDoc, "policyholderName")}");
            result.AppendLine($"- Policy Number: {GetFieldValue(claimDoc, "policyNumber")}");
            result.AppendLine();

            result.AppendLine("**Financial Details:**");
            var estimatedCost = GetFieldValue(claimDoc, "estimatedCost");
            result.AppendLine($"- Estimated Cost: ${estimatedCost}");
            result.AppendLine($"- Severity: {GetFieldValue(claimDoc, "severity")}");
            result.AppendLine();

            result.AppendLine("**Assignment & Location:**");
            result.AppendLine($"- Assigned Adjuster: {GetFieldValue(claimDoc, "assignedAdjuster")}");
            result.AppendLine($"- Region: {GetFieldValue(claimDoc, "region")}");
            result.AppendLine($"- Location: {GetFieldValue(claimDoc, "location")}");
            result.AppendLine();

            result.AppendLine("**Incident Details:**");
            result.AppendLine($"- Description: {GetFieldValue(claimDoc, "description")}");
            result.AppendLine();

            result.AppendLine("**Fraud Assessment:**");
            var fraudScore = GetFieldValue(claimDoc, "fraudRiskScore");
            result.AppendLine($"- Fraud Risk Score: {fraudScore}/100");
            var fraudIndicators = GetFieldValue(claimDoc, "fraudIndicators");
            result.AppendLine($"- Fraud Indicators: {(string.IsNullOrWhiteSpace(fraudIndicators) ? "None identified" : fraudIndicators)}");
            result.AppendLine();

            result.AppendLine("**Documentation Status:**");
            var isComplete = GetFieldValue(claimDoc, "isDocumentationComplete");
            result.AppendLine($"- Documentation Complete: {(isComplete == "True" || isComplete == "true" ? "Yes" : "No")}");
            var missingDocs = GetFieldValue(claimDoc, "missingDocumentation");
            result.AppendLine($"- Missing Documentation: {(string.IsNullOrWhiteSpace(missingDocs) ? "None" : missingDocs)}");

            await NotifyUserAsync($"Retrieved details for claim {claimId}");

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

        /// <summary>
        /// Helper method to send real-time status updates to users
        /// Uses StreamingResponse for immediate feedback during long operations
        /// </summary>
        private async Task NotifyUserAsync(string message)
        {
            // Send streaming updates (shows as typing indicators with message)
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

<cc-end-step lab="baf2" exercise="3" step="1" />

## Exercise 4: Register Services and Configure Agent

Now let's wire everything together by registering services in Program.cs and adding the ClaimsPlugin to your agent.

### Step 1: Register KnowledgeBaseService and Initialize Data

??? note "What this code does"

    The `Program.cs` takes care of registering the services:

    - **Service Registration**: Registers KnowledgeBaseService as a singleton so it's available throughout the app
    - **Initialization**: Creates index → knowledge source → knowledge base → indexes sample data (must be done in this order)
    - **Error Handling**: Catches initialization errors without stopping the app (useful for development)

1️⃣ Open `src/Program.cs`.

2️⃣ At the top with other using statements, add:

```csharp
using InsuranceAgent.Services;
```

3️⃣ Find `builder.Services.AddSingleton<IStorage, MemoryStorage>();` and add right after:

```csharp
// Register Knowledge Base Service for Azure AI Search
builder.Services.AddSingleton<KnowledgeBaseService>();
```

4️⃣ Find the line `var app = builder.Build();` and add this initialization code right after:

```csharp
// Initialize Azure AI Search Knowledge Base
using (var scope = app.Services.CreateScope())
{
    try
    {
        var kbService = scope.ServiceProvider.GetRequiredService<KnowledgeBaseService>();
        
        Console.WriteLine("🔍 Initializing Azure AI Search Knowledge Base...");
        
        // IMPORTANT: Must follow this order - indexes → knowledge sources → knowledge base → data
        await kbService.EnsureClaimsIndexAsync();          // 1. Create claims index
        await kbService.CreateKnowledgeSourcesAsync();     // 2. Create claims knowledge source
        await kbService.CreateKnowledgeBaseAsync();        // 3. Create knowledge base
        await kbService.IndexSampleDataAsync();            // 4. Index sample claims data
        
        Console.WriteLine("✅ Knowledge Base initialized successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️ Knowledge Base initialization warning: {ex.Message}");
    }
}
```

<cc-end-step lab="baf2" exercise="4" step="1" />

### Step 2: Configure Agent with ClaimsPlugin

??? note "What this code does"

    In the `ZavaInsuranceAgent.cs` file you need to instruct the agent to use the new ClaimsPlugin:

    - **Agent Instructions**: Updates the agent's system prompt to include ClaimsPlugin tools (tells AI when to use them)
    - **Plugin Creation**: Instantiates ClaimsPlugin with required dependencies (context, knowledge base service, configuration)
    - **Tool Registration**: Registers SearchClaims and GetClaimDetails as callable tools for the AI agent

1️⃣ Open `src/Agent/ZavaInsuranceAgent.cs`.

2️⃣ Add the following using statements at the top:

```csharp
using InsuranceAgent.Services;
```

3️⃣ Find the `AgentInstructions` property and replace it with the following snippet:

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

4️⃣ Find the `GetClientAgent` method in `src/Agent/ZavaInsuranceAgent.cs`, locate where `StartConversationPlugin` is created and add the following snippet right after:

```csharp
var scope = _serviceProvider.CreateScope();

// Get KnowledgeBaseService and IConfiguration from DI
var knowledgeBaseService = scope.ServiceProvider.GetRequiredService<KnowledgeBaseService>();
var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

// Create ClaimsPlugin with required dependencies
ClaimsPlugin claimsPlugin = new(context, knowledgeBaseService, configuration);
```

5️⃣ Find where tools are registered and add the following snippet to register the ClaimsPlugin, right after `toolOptions.Tools.Add(AIFunctionFactory.Create(startConversationPlugin.StartConversation))`:

```csharp
// Register ClaimsPlugin tools
toolOptions.Tools.Add(AIFunctionFactory.Create(claimsPlugin.SearchClaims));
toolOptions.Tools.Add(AIFunctionFactory.Create(claimsPlugin.GetClaimDetails));
```

<cc-end-step lab="baf2" exercise="4" step="2" />

### Step 3: Update StartConversationPlugin Welcome Message

Now that we've added claims search capabilities, let's update the welcome message to reflect the new features.

1️⃣ Open `src/Plugins/StartConversationPlugin.cs`.

2️⃣ Find the `welcomeMessage` variable in the `StartConversation` method and replace it with:

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

??? note "Progressive feature updates"
    Each lab progressively enhances the welcome message to reflect new capabilities. This ensures users always see an accurate description of what the agent can do at each stage of development.

<cc-end-step lab="baf2" exercise="4" step="3" />

## Exercise 5: Test the Document Search

Now let's test the new claims search capabilities!

### Step 1: Run the Agent

1️⃣ Press **F5** in VS Code to start debugging.

2️⃣ Select **(Preview) Debug in Copilot (Edge)** if prompted.

3️⃣ Watch the terminal output - you should see:

```
🔍 Initializing Azure AI Search Knowledge Base...
📝 Creating claims index 'claims-index'...
✅ Claims index 'claims-index' created successfully
✅ Knowledge source 'claims-knowledge-source' created
✅ Knowledge base 'zava-insurance-kb' created with model 'gpt-4.1'
📝 Indexing sample claims...
✅ Indexed 35 claims
✅ Sample data indexed successfully
✅ Knowledge Base initialized successfully
```

!!! note "About Policies"
    You may see additional output related to policies if your KnowledgeBaseService includes policy functionality from the complete implementation. This is expected - we'll use policies in a future lab. For now, focus on the claims functionality.

4️⃣ A browser window will open with Microsoft 365 Copilot. Your agent should already be installed from the previous lab.

5️⃣ **Verify in Azure Portal** (optional but recommended):

- Go to [Azure Portal](https://portal.azure.com){target=_blank} and search the name of your Azure AI Search service
- Click **Indexes** in the left menu and you should see `claims-index` listed. Click on the index name and select **Search** to view details and see the 35 indexed documents
- Go back to your search service and click **Agentic retrieval** > **Knowledge Bases** to see `zava-insurance-kb` listed
- You can also use the **Search Explorer** to test queries directly against your index

<cc-end-step lab="baf2" exercise="5" step="1" />

### Step 2: Test Claim Search

1️⃣ In Microsoft 365 Copilot, try a more specific search: 

```text
Find claims in the South region
```

2️⃣ Try: 

```text
Show me auto claims with medium severity
```

<cc-end-step lab="baf2" exercise="5" step="2" />

### Step 3: Test Claim Details

1️⃣ Try: 

```text
Get details for claim CLM-2025-001007
```

The agent should use `GetClaimDetails` and return detailed information. Note that we'll continue adding more data in future labs that will enhance the responses such as showing policy or claim history in claim details.

2️⃣ Try another claim: 

```text
Show me information about claim CLM-2025-001003
```

<cc-end-step lab="baf2" exercise="5" step="3" />

---8<--- "b-congratulations.md"

You have completed Lab BAF2 - Add Document Search with Azure AI Search!

You've learned how to:

- ✅ Set up Azure AI Search with sample data
- ✅ Create a KnowledgeBaseService for AI-powered retrieval
- ✅ Build a ClaimsPlugin with multiple search capabilities
- ✅ Register services and initialize knowledge base on startup
- ✅ Test document search with natural language queries

In the next lab, you'll enhance your agent further by adding vision analysis capabilities to process images related to claims.

<cc-next url="../03-add-vision-analysis" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/02-add-claim-search" />
