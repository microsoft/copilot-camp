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