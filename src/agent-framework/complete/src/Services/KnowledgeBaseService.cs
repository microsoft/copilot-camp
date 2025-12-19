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

#nullable enable

namespace InsuranceAgent.Services;

/// <summary>
/// Azure AI Search Knowledge Base service for agentic retrieval
/// Uses the new agentic knowledge base APIs for unified data access
/// Replaces TableStorageService, BlobStorageService, and manual indexing
/// </summary>
public class KnowledgeBaseService
{
    private readonly string _searchEndpoint;
    private readonly string _searchApiKey;
    private readonly SearchIndexClient _indexClient;
    private readonly KnowledgeBaseRetrievalClient _retrievalClient;
    private readonly string _aiEndpoint;
    private readonly string _aiApiKey;
    private readonly string _embeddingModel;
    private readonly AzureOpenAIClient _openAIClient;
    private readonly BlobStorageService? _blobStorageService;
    private readonly IConfiguration _configuration;
    
    // Knowledge source names
    private const string ClaimsKnowledgeSource = "claims-knowledge-source";
    private const string PoliciesKnowledgeSource = "policies-knowledge-source";
    private const string DamagePhotosBlobKnowledgeSource = "claim-photos-blob-ks";
    
    // Index names
    private const string ClaimsIndex = "claims-index";
    private const string PoliciesIndex = "policies-index";
    
    // Knowledge base name
    private const string KnowledgeBaseName = "zava-insurance-kb";

    public KnowledgeBaseService(IConfiguration configuration, BlobStorageService? blobStorageService = null)
    {
        _searchEndpoint = configuration["AZURE_AI_SEARCH_ENDPOINT"]
            ?? throw new InvalidOperationException("AZURE_AI_SEARCH_ENDPOINT not configured");
        _searchApiKey = configuration["AZURE_AI_SEARCH_API_KEY"]
            ?? throw new InvalidOperationException("AZURE_AI_SEARCH_API_KEY not configured");
        
        _aiEndpoint = configuration["MODELS_ENDPOINT"]
            ?? throw new InvalidOperationException("MODELS_ENDPOINT not configured");
        _aiApiKey = configuration["AIModels:ApiKey"]
            ?? throw new InvalidOperationException("AIModels:ApiKey not configured");
        _embeddingModel = configuration["EMBEDDING_MODEL_NAME"]
            ?? "text-embedding-ada-002";

        var credential = new AzureKeyCredential(_searchApiKey);
        _indexClient = new SearchIndexClient(new Uri(_searchEndpoint), credential);
        _retrievalClient = new KnowledgeBaseRetrievalClient(new Uri(_searchEndpoint), KnowledgeBaseName, credential);
        
        _openAIClient = new AzureOpenAIClient(new Uri(_aiEndpoint), new AzureKeyCredential(_aiApiKey));
        _blobStorageService = blobStorageService;
        _configuration = configuration;
    }

    #region Index Creation

    /// <summary>
    /// Recreates all indexes with correct schema (deletes KB, sources, and indexes first)
    /// Call this method ONCE when schema changes, then remove the call
    /// </summary>
    public async Task RecreateAllResourcesAsync()
    {
        Console.WriteLine("🔄 Recreating all resources with updated schema...");
        
        // 1. Delete Knowledge Base
        try
        {
            var kbClient = new HttpClient();
            kbClient.DefaultRequestHeaders.Add("api-key", _searchApiKey);
            var deleteKbUrl = $"{_searchEndpoint}/knowledgebases/{KnowledgeBaseName}?api-version=2025-11-01-preview";
            var response = await kbClient.DeleteAsync(deleteKbUrl);
            if (response.IsSuccessStatusCode || response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                Console.WriteLine($"✅ Deleted knowledge base '{KnowledgeBaseName}'");
            }
        }
        catch { }

        // 2. Delete Knowledge Sources
        var sourceNames = new[] { "claims-knowledge-source", "policies-knowledge-source", "claim-photos-blob-ks" };
        foreach (var sourceName in sourceNames)
        {
            try
            {
                var ksClient = new HttpClient();
                ksClient.DefaultRequestHeaders.Add("api-key", _searchApiKey);
                var deleteKsUrl = $"{_searchEndpoint}/knowledgesources/{sourceName}?api-version=2025-11-01-preview";
                await ksClient.DeleteAsync(deleteKsUrl);
                Console.WriteLine($"✅ Deleted knowledge source '{sourceName}'");
            }
            catch { }
        }

        // 3. Delete Indexes
        var indexNames = new[] { ClaimsIndex, PoliciesIndex };
        foreach (var indexName in indexNames)
        {
            try
            {
                await _indexClient.DeleteIndexAsync(indexName);
                Console.WriteLine($"✅ Deleted index '{indexName}'");
            }
            catch { }
        }
        
        Console.WriteLine("✅ All old resources deleted");
        
        // 4. Recreate everything
        await EnsureIndexesExistAsync();
    }

    /// <summary>
    /// Ensures all search indexes exist with proper schemas and semantic configurations
    /// </summary>
    public async Task EnsureIndexesExistAsync()
    {
        await EnsureClaimsIndexAsync();
        await EnsurePoliciesIndexAsync();
    }

    /// <summary>
    /// Deletes and recreates the claims index, then re-indexes all data
    /// Use this when the index schema or data has changed
    /// </summary>
    public async Task ReindexClaimsAsync()
    {
        try
        {
            Console.WriteLine($"🔄 Re-indexing claims...");
            
            // Delete existing index
            try
            {
                await _indexClient.DeleteIndexAsync(ClaimsIndex);
                Console.WriteLine($"🗑️  Deleted existing claims index");
            }
            catch (RequestFailedException ex) when (ex.Status == 404)
            {
                Console.WriteLine($"ℹ️  Claims index doesn't exist, will create new one");
            }
            
            // Recreate index with proper schema
            await EnsureClaimsIndexAsync();
            
            // Re-index all claims data
            await IndexSampleClaimsAsync();
            
            Console.WriteLine($"✅ Claims re-indexed successfully with image URLs");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error re-indexing claims: {ex.Message}");
            throw;
        }
    }

    private async Task EnsureClaimsIndexAsync()
    {
        try
        {
            var existingIndex = await _indexClient.GetIndexAsync(ClaimsIndex);
            Console.WriteLine($"✅ Claims index '{ClaimsIndex}' already exists");
            return; // Index exists, skip creation
        }
        catch (RequestFailedException ex) when (ex.Status == 404)
        {
            Console.WriteLine($"📝 Creating claims index '{ClaimsIndex}'...");
            
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
                    new SimpleField("dateFiled", SearchFieldDataType.DateTimeOffset) { IsFilterable = true, IsSortable = true },
                    new SimpleField("dateResolved", SearchFieldDataType.DateTimeOffset) { IsFilterable = true, IsSortable = true },
                    new SimpleField("claimAmount", SearchFieldDataType.Double) { IsFilterable = true, IsSortable = true },
                    new SearchableField("region") { IsFilterable = true, IsFacetable = true },
                    new SearchableField("assignedAdjuster") { IsFilterable = true },
                    new SearchableField("description"),
                    new SearchableField("location") { IsFilterable = true },
                    new SearchableField("severity") { IsFilterable = true, IsFacetable = true },
                    new SimpleField("fraudScore", SearchFieldDataType.Int32) { IsFilterable = true, IsSortable = true },
                    new SearchableField("fraudIndicators"),
                    new SearchableField("adjusterNotes"),
                    new SearchableField("imageUrl"),
                    new SearchableField("thumbnailUrl"),
                    new SearchableField("searchableContent"),
                    new SearchField("contentVector", SearchFieldDataType.Collection(SearchFieldDataType.Single))
                    {
                        IsSearchable = true,
                        VectorSearchDimensions = 1536,
                        VectorSearchProfileName = "vector-profile"
                    }
                },
                VectorSearch = CreateVectorSearchConfig(),
                SemanticSearch = CreateSemanticConfig("Claims semantic search", "claimNumber", "description", "adjusterNotes")
            };
            
            await _indexClient.CreateIndexAsync(index);
            Console.WriteLine($"✅ Claims index created successfully");
        }
    }

    private async Task EnsurePoliciesIndexAsync()
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

    #region Knowledge Source Creation

    /// <summary>
    /// Creates all knowledge sources pointing to the indexes and blob containers
    /// </summary>
    public async Task CreateKnowledgeSourcesAsync()
    {
        await CreateClaimsKnowledgeSourceAsync();
        await CreatePoliciesKnowledgeSourceAsync();
        await CreateDamagePhotosBlobKnowledgeSourceAsync();
    }

    private async Task CreateClaimsKnowledgeSourceAsync()
    {
        var knowledgeSource = new SearchIndexKnowledgeSource(
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
                    new SearchIndexFieldReference(name: "adjusterNotes"),
                    new SearchIndexFieldReference(name: "imageUrl"),
                    new SearchIndexFieldReference(name: "thumbnailUrl")
                }
            }
        );

        await _indexClient.CreateOrUpdateKnowledgeSourceAsync(knowledgeSource);
        Console.WriteLine($"✅ Knowledge source '{ClaimsKnowledgeSource}' created with all fields");
    }

    private async Task CreatePoliciesKnowledgeSourceAsync()
    {
        var knowledgeSource = new SearchIndexKnowledgeSource(
            name: PoliciesKnowledgeSource,
            searchIndexParameters: new SearchIndexKnowledgeSourceParameters(searchIndexName: PoliciesIndex)
            {
                SourceDataFields = 
                {
                    new SearchIndexFieldReference(name: "id"),
                    new SearchIndexFieldReference(name: "policyNumber"),
                    new SearchIndexFieldReference(name: "policyholderName"),
                    new SearchIndexFieldReference(name: "policyType"),
                    new SearchIndexFieldReference(name: "status")
                }
            }
        );

        await _indexClient.CreateOrUpdateKnowledgeSourceAsync(knowledgeSource);
        Console.WriteLine($"✅ Knowledge source '{PoliciesKnowledgeSource}' created");
    }



    private async Task CreateDamagePhotosBlobKnowledgeSourceAsync()
    {
        if (_blobStorageService == null)
        {
            Console.WriteLine("⚠️  BlobStorageService not configured, skipping damage photos blob knowledge source");
            return;
        }

        var blobConnectionString = _blobStorageService.GetConnectionString();
        var blobContainerName = "claim-photos";
        
        // Configure image verbalization with GPT-4o model
        var aoaiParamsChat = new AzureOpenAIVectorizerParameters
        {
            ResourceUri = new Uri(_aiEndpoint),
            ApiKey = _aiApiKey,
            DeploymentName = "gpt-4.1", // Use gpt-4o or gpt-4.1 for image verbalization
            ModelName = "gpt-4.1"
        };
        
        var chatCompletionModel = new KnowledgeBaseAzureOpenAIModel(azureOpenAIParameters: aoaiParamsChat);

        // Configure ingestion with image verbalization enabled
        // Note: Blob knowledge source will use default embedding model from Azure AI Search
        var ingestionParams = new KnowledgeSourceIngestionParameters
        {
            DisableImageVerbalization = false, // Enable AI image description with GPT-4o
            ChatCompletionModel = chatCompletionModel
        };

        var knowledgeSource = new AzureBlobKnowledgeSource(
            name: DamagePhotosBlobKnowledgeSource,
            azureBlobParameters: new AzureBlobKnowledgeSourceParameters(
                connectionString: blobConnectionString,
                containerName: blobContainerName
            )
            {
                IngestionParameters = ingestionParams
            }
        );

        await _indexClient.CreateOrUpdateKnowledgeSourceAsync(knowledgeSource);
        Console.WriteLine($"✅ Blob knowledge source '{DamagePhotosBlobKnowledgeSource}' created with image verbalization");
        Console.WriteLine($"   Auto-generates: {DamagePhotosBlobKnowledgeSource}-datasource, -indexer, -skillset, -index");
    }

    #endregion

    #region Knowledge Base Creation

    /// <summary>
    /// Creates the unified knowledge base combining all knowledge sources with LLM model
    /// </summary>
    public async Task CreateKnowledgeBaseAsync()
    {
        // Get the language model deployment name from configuration
        var languageModelName = _openAIClient.GetChatClient(_embeddingModel).ToString(); // Fallback approach
        
        // Try to read from configuration
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
            DeploymentName = modelName,  // Required: deployment/model name
            ModelName = modelName         // Optional: underlying model name
        };

        var knowledgeBase = new KnowledgeBase(
            name: KnowledgeBaseName,
            knowledgeSources: new[]
            {
                new KnowledgeSourceReference(name: ClaimsKnowledgeSource),
                new KnowledgeSourceReference(name: PoliciesKnowledgeSource),
                new KnowledgeSourceReference(name: DamagePhotosBlobKnowledgeSource)
            }
        )
        {
            Description = "Zava Insurance knowledge base with claims, policies, and documents",
            RetrievalReasoningEffort = new KnowledgeRetrievalLowReasoningEffort(),
            OutputMode = KnowledgeRetrievalOutputMode.AnswerSynthesis,
            Models = { new KnowledgeBaseAzureOpenAIModel(azureOpenAIParameters: aoaiParams) }
        };

        await _indexClient.CreateOrUpdateKnowledgeBaseAsync(knowledgeBase);
        Console.WriteLine($"✅ Knowledge base '{KnowledgeBaseName}' created with model '{modelName}'");
    }

    #endregion

    #region Retrieval

    /// <summary>
    /// Performs agentic retrieval across all knowledge sources using the Knowledge Base API
    /// </summary>
    /// <param name="query">Natural language query</param>
    /// <param name="topResults">Not used - Knowledge Base API handles result ranking</param>
    /// <returns>LLM-synthesized answer with citations from all knowledge sources</returns>
    public async Task<string> RetrieveAsync(string query, int topResults = 5)
    {
        return await RetrieveAsync(query, instructions: null, topResults);
    }

    /// <summary>
    /// Performs agentic retrieval with custom instructions for formatted responses
    /// </summary>
    /// <param name="query">Natural language query</param>
    /// <param name="instructions">Custom instructions for the LLM (e.g., formatting, structure, tone)</param>
    /// <param name="topResults">Not used - Knowledge Base API handles result ranking</param>
    /// <returns>LLM-synthesized answer following the provided instructions</returns>
    public async Task<string> RetrieveAsync(string query, string? instructions = null, int topResults = 5)
    {
        Console.WriteLine($"🔍 KB Query: {query}");
        if (!string.IsNullOrEmpty(instructions))
        {
            Console.WriteLine($"📋 With instructions: {instructions.Substring(0, Math.Min(80, instructions.Length))}...");
        }
        
        // Use Knowledge Base retrieval API with proper message format
        var retrievalRequest = new KnowledgeBaseRetrievalRequest
        {
            RetrievalReasoningEffort = new KnowledgeRetrievalLowReasoningEffort(),
            OutputMode = KnowledgeRetrievalOutputMode.AnswerSynthesis // Enable answer synthesis for better responses
        };
        
        // Add assistant message with instructions if provided
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
        
        // Debug: Check what we got back
        Console.WriteLine($"📊 KB Response count: {retrievalResult.Value.Response?.Count ?? 0}");
        if (retrievalResult.Value.Activity != null)
        {
            Console.WriteLine($"📋 KB Activity: {retrievalResult.Value.Activity}");
        }
        
        // Extract the response text from the LLM-formulated answer
        var result = new StringBuilder();
        
        if (retrievalResult.Value.Response != null && retrievalResult.Value.Response.Count > 0)
        {
            foreach (var response in retrievalResult.Value.Response)
            {
                foreach (var content in response.Content)
                {
                    if (content is KnowledgeBaseMessageTextContent textContent)
                    {
                        Console.WriteLine($"✅ KB returned: {textContent.Text.Substring(0, Math.Min(100, textContent.Text.Length))}...");
                        result.AppendLine(textContent.Text);
                    }
                }
            }
        }
        else
        {
            Console.WriteLine("⚠️  KB returned no results");
        }
        
        return result.ToString();
    }

    /// <summary>
    /// Gets the damage photo URL for a specific claim
    /// Checks claims index
    /// </summary>
    /// <param name="claimNumber">The claim number to retrieve the image for</param>
    /// <returns>The image URL or null if not found</returns>
    public async Task<string?> GetClaimImageUrlAsync(string claimNumber)
    {
        // Check claims index for imageUrl (still stored there for direct access)
        var claimsClient = _indexClient.GetSearchClient(ClaimsIndex);
        
        var searchOptions = new SearchOptions
        {
            Filter = $"claimNumber eq '{claimNumber}'",
            Size = 1,
            Select = { "imageUrl" }
        };
        
        var searchResults = await claimsClient.SearchAsync<SearchDocument>("*", searchOptions);
        
        await foreach (var searchResult in searchResults.Value.GetResultsAsync())
        {
            var doc = searchResult.Document;
            if (doc.ContainsKey("imageUrl") && doc["imageUrl"] != null)
            {
                return doc["imageUrl"].ToString();
            }
        }
        
        return null;
    }

    /// <summary>
    /// Gets claim details directly from the claims index using filter query
    /// This bypasses the Knowledge Base API for structured data retrieval
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

    #endregion

    #region Data Indexing

    /// <summary>
    /// Generates embeddings for text content
    /// </summary>
    private async Task<float[]> CreateEmbeddingAsync(string text)
    {
        var embeddingClient = _openAIClient.GetEmbeddingClient(_embeddingModel);
        var response = await embeddingClient.GenerateEmbeddingAsync(text);
        return response.Value.ToFloats().ToArray();
    }

    /// <summary>
    /// Indexes sample data into all indexes
    /// This replaces the table storage seeding logic
    /// </summary>
    public async Task IndexSampleDataAsync()
    {
        await IndexSampleClaimsAsync();
        await IndexSamplePoliciesAsync();
        
        // Upload damage photos to blob storage if BlobStorageService is available
        if (_blobStorageService != null)
        {
            await UploadSampleDamagePhotosAsync();
        }
        
        Console.WriteLine("✅ Sample data indexed successfully");
    }

    private async Task IndexSampleClaimsAsync()
    {
        Console.WriteLine("📝 Indexing sample claims...");

        var claimsClient = _indexClient.GetSearchClient(ClaimsIndex);
        
        // Check if existing claims have imageUrl - if not, clear and re-index
        try
        {
            var testSearch = await claimsClient.SearchAsync<SearchDocument>("CLM-2025-001001", new SearchOptions 
            { 
                Filter = "claimNumber eq 'CLM-2025-001001'",
                Select = { "imageUrl" },
                Size = 1 
            });
            
            await foreach (var result in testSearch.Value.GetResultsAsync())
            {
                if (!result.Document.ContainsKey("imageUrl") || result.Document["imageUrl"] == null)
                {
                    Console.WriteLine("⚠️  Existing claims missing imageUrl - clearing index for re-indexing...");
                    // Delete all documents by uploading empty batch with delete action
                    var deleteOptions = new SearchOptions { Size = 1000, Select = { "id" } };
                    var allDocs = await claimsClient.SearchAsync<SearchDocument>("*", deleteOptions);
                    var docsToDelete = new List<SearchDocument>();
                    await foreach (var doc in allDocs.Value.GetResultsAsync())
                    {
                        docsToDelete.Add(new SearchDocument { ["id"] = doc.Document["id"] });
                    }
                    if (docsToDelete.Any())
                    {
                        var deleteBatch = IndexDocumentsBatch.Delete(docsToDelete);
                        await claimsClient.IndexDocumentsAsync(deleteBatch);
                        Console.WriteLine($"🗑️  Deleted {docsToDelete.Count} existing claims for re-indexing");
                    }
                }
                break; // Only check first document
            }
        }
        catch { /* Ignore errors, proceed with indexing */ }
        
        // Read claims data from JSON file (same source as TableStorageSeeder)
        var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
        var dataPath = Path.Combine(baseDirectory, "infra", "data", "sample-data");
        var filePath = Path.Combine(dataPath, "claims.json");
        
        if (!File.Exists(filePath))
        {
            Console.WriteLine($"⚠️  Claims data file not found: {filePath}");
            return;
        }

        var json = await File.ReadAllTextAsync(filePath);
        var claimsData = System.Text.Json.JsonSerializer.Deserialize<List<System.Text.Json.JsonElement>>(json);

        if (claimsData == null || !claimsData.Any())
        {
            Console.WriteLine("⚠️  No claims data to index");
            return;
        }

        var documents = new List<SearchDocument>();
        
        foreach (var claimData in claimsData)
        {
            var claimId = claimData.GetProperty("id").GetInt32();
            var random = new Random(claimId);
            var status = claimData.GetProperty("status").GetString() ?? "";
            
            // Generate DateFiled based on claim status and ID (same logic as TableStorageSeeder)
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

            var claimNumber = claimData.GetProperty("claimNumber").GetString() ?? "";
            var policyholderName = claimData.GetProperty("policyholderName").GetString() ?? "";
            var policyNumber = claimData.GetProperty("policyNumber").GetString() ?? "";
            var claimType = claimData.GetProperty("claimType").GetString() ?? "";
            var estimatedCost = claimData.GetProperty("estimatedCost").GetDouble();
            var severity = claimData.GetProperty("severity").GetString() ?? "";
            var region = claimData.GetProperty("region").GetString() ?? "";
            var assignedAdjuster = claimData.GetProperty("assignedAdjuster").GetString() ?? "";
            var description = claimData.GetProperty("description").GetString() ?? "";
            var location = claimData.GetProperty("location").GetString() ?? "";
            var fraudRiskScore = claimData.GetProperty("fraudRiskScore").GetInt32();
            var fraudIndicators = claimData.GetProperty("fraudIndicators").GetString() ?? "";
            
            // Get image URLs if they exist
            string? imageUrl = null;
            string? thumbnailUrl = null;
            if (claimData.TryGetProperty("imageUrl", out var imageUrlProp))
            {
                imageUrl = imageUrlProp.GetString();
            }
            if (claimData.TryGetProperty("thumbnailUrl", out var thumbnailUrlProp))
            {
                thumbnailUrl = thumbnailUrlProp.GetString();
            }

            // Build searchable content for embedding
            var searchableContent = $"Claim {claimNumber} - {claimType} for {policyholderName} (Policy: {policyNumber}). " +
                                  $"Status: {status}. Location: {location}. Description: {description}. " +
                                  $"Adjuster: {assignedAdjuster}. Severity: {severity}. Estimated Cost: ${estimatedCost:N2}. " +
                                  $"Fraud Risk: {fraudRiskScore}/100.";

            // Generate embedding
            var embedding = await CreateEmbeddingAsync(searchableContent);

            var document = new SearchDocument
            {
                ["id"] = claimNumber,
                ["claimNumber"] = claimNumber,
                ["policyholderName"] = policyholderName,
                ["policyNumber"] = policyNumber,
                ["claimType"] = claimType,
                ["status"] = status,
                ["claimAmount"] = estimatedCost,
                ["region"] = region,
                ["assignedAdjuster"] = assignedAdjuster,
                ["dateFiled"] = dateFiled,
                ["dateResolved"] = dateResolved,
                ["description"] = description,
                ["location"] = location,
                ["severity"] = severity,
                ["fraudScore"] = fraudRiskScore,
                ["fraudIndicators"] = fraudIndicators,
                ["adjusterNotes"] = $"Assigned to {assignedAdjuster}. {(fraudRiskScore > 50 ? "Requires fraud review." : "")}",
                ["searchableContent"] = searchableContent,
                ["contentVector"] = embedding
            };
            
            // Add image URLs if they exist
            if (!string.IsNullOrEmpty(imageUrl))
            {
                document["imageUrl"] = imageUrl;
            }
            if (!string.IsNullOrEmpty(thumbnailUrl))
            {
                document["thumbnailUrl"] = thumbnailUrl;
            }

            documents.Add(document);
        }

        if (documents.Any())
        {
            var batch = IndexDocumentsBatch.Upload(documents);
            var result = await claimsClient.IndexDocumentsAsync(batch);
            Console.WriteLine($"✅ Indexed {result.Value.Results.Count} claims");
        }
    }

    private async Task IndexSamplePoliciesAsync()
    {
        Console.WriteLine("📝 Indexing sample policies...");

        var policiesClient = _indexClient.GetSearchClient(PoliciesIndex);
        
        // Read policies data from JSON file (same source as TableStorageSeeder)
        var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
        var dataPath = Path.Combine(baseDirectory, "infra", "data", "sample-data");
        var filePath = Path.Combine(dataPath, "policies.json");
        
        if (!File.Exists(filePath))
        {
            Console.WriteLine($"⚠️  Policies data file not found: {filePath}");
            return;
        }

        var json = await File.ReadAllTextAsync(filePath);
        var policiesData = System.Text.Json.JsonSerializer.Deserialize<List<System.Text.Json.JsonElement>>(json);

        if (policiesData == null || !policiesData.Any())
        {
            Console.WriteLine("⚠️  No policies data to index");
            return;
        }

        var documents = new List<SearchDocument>();
        
        foreach (var policyData in policiesData)
        {
            var policyNumber = policyData.GetProperty("policyNumber").GetString() ?? "";
            var random = new Random(policyNumber.GetHashCode());
            var status = policyData.GetProperty("status").GetString() ?? "";
            
            // Generate policy dates based on status (same logic as TableStorageSeeder)
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
            else if (status == "Suspended" || status == "Cancelled")
            {
                effectiveDate = DateTime.UtcNow.Date.AddDays(-random.Next(180, 730));
                expirationDate = DateTime.UtcNow.Date.AddDays(random.Next(-30, 180));
            }
            else
            {
                effectiveDate = DateTime.UtcNow.Date.AddDays(-random.Next(30, 365));
                expirationDate = DateTime.UtcNow.Date.AddDays(random.Next(365, 730));
            }

            var policyholderName = policyData.GetProperty("policyholderName").GetString() ?? "";
            var policyType = policyData.GetProperty("policyType").GetString() ?? "";
            var coverageLimit = policyData.GetProperty("coverageLimit").GetDouble();
            var deductible = policyData.GetProperty("deductible").GetDouble();
            var annualPremium = policyData.GetProperty("annualPremium").GetDouble();

            // Build searchable content
            var searchableContent = $"Policy {policyNumber} for {policyholderName}. Type: {policyType}. Status: {status}. " +
                                  $"Coverage: ${coverageLimit:N2}, Deductible: ${deductible:N2}, Premium: ${annualPremium:N2}/year. " +
                                  $"Effective: {effectiveDate:yyyy-MM-dd}, Expires: {expirationDate:yyyy-MM-dd}.";

            // Add vehicle info for Auto policies
            string? vehicleMake = null, vehicleModel = null, vehicleVin = null;
            int? vehicleYear = null;
            if (policyData.TryGetProperty("vehicleInfo", out var vehicleInfo))
            {
                vehicleMake = vehicleInfo.TryGetProperty("make", out var make) ? make.GetString() : null;
                vehicleModel = vehicleInfo.TryGetProperty("model", out var model) ? model.GetString() : null;
                vehicleYear = vehicleInfo.TryGetProperty("year", out var year) ? year.GetInt32() : null;
                vehicleVin = vehicleInfo.TryGetProperty("vin", out var vin) ? vin.GetString() : null;
                
                if (vehicleMake != null && vehicleModel != null)
                {
                    searchableContent += $" Vehicle: {vehicleYear} {vehicleMake} {vehicleModel}.";
                }
            }

            // Add property info for Homeowners policies
            string? propertyAddress = null, propertyType = null;
            if (policyData.TryGetProperty("propertyInfo", out var propertyInfo))
            {
                propertyAddress = propertyInfo.TryGetProperty("address", out var address) ? address.GetString() : null;
                propertyType = propertyInfo.TryGetProperty("propertyType", out var propType) ? propType.GetString() : null;
                
                if (propertyAddress != null)
                {
                    searchableContent += $" Property: {propertyAddress}.";
                }
            }

            // Generate embedding
            var embedding = await CreateEmbeddingAsync(searchableContent);

            var document = new SearchDocument
            {
                ["id"] = policyNumber,
                ["policyNumber"] = policyNumber,
                ["policyholderName"] = policyholderName,
                ["policyType"] = policyType,
                ["status"] = status,
                ["effectiveDate"] = effectiveDate,
                ["expirationDate"] = expirationDate,
                ["coverageLimit"] = coverageLimit,
                ["deductible"] = deductible,
                ["annualPremium"] = annualPremium,
                ["vehicleMake"] = vehicleMake,
                ["vehicleModel"] = vehicleModel,
                ["vehicleYear"] = vehicleYear,
                ["vehicleVin"] = vehicleVin,
                ["propertyAddress"] = propertyAddress,
                ["propertyType"] = propertyType,
                ["searchableContent"] = searchableContent,
                ["contentVector"] = embedding
            };

            documents.Add(document);
        }

        if (documents.Any())
        {
            var batch = IndexDocumentsBatch.Upload(documents);
            var result = await policiesClient.IndexDocumentsAsync(batch);
            Console.WriteLine($"✅ Indexed {result.Value.Results.Count} policies");
        }
    }



    /// <summary>
    /// Uploads sample damage photos to blob storage for claims that have imageUrl fields
    /// </summary>
    private async Task UploadSampleDamagePhotosAsync()
    {
        if (_blobStorageService == null) return;

        Console.WriteLine("📸 Uploading sample damage photos to blob storage and indexing...");

        var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
        var dataPath = Path.Combine(baseDirectory, "infra", "data", "sample-data");
        var filePath = Path.Combine(dataPath, "claims.json");
        var imagesPath = Path.Combine(baseDirectory, "infra", "img", "sample-images");

        if (!File.Exists(filePath))
        {
            Console.WriteLine($"⚠️  Claims data file not found: {filePath}");
            return;
        }

        if (!Directory.Exists(imagesPath))
        {
            Console.WriteLine($"⚠️  Sample images directory not found: {imagesPath}");
            return;
        }

        var json = await File.ReadAllTextAsync(filePath);
        var claimsData = System.Text.Json.JsonSerializer.Deserialize<List<System.Text.Json.JsonElement>>(json);

        if (claimsData == null || !claimsData.Any())
        {
            Console.WriteLine("⚠️  No claims data to process");
            return;
        }

        var uploadCount = 0;
        var claimsClient = _indexClient.GetSearchClient(ClaimsIndex);
        var claimsToUpdate = new List<SearchDocument>();
        
        Console.WriteLine($"📋 Processing {claimsData.Count} total claims for damage photos...");
        Console.WriteLine($"📸 Uploading to blob storage - indexer will auto-index with image verbalization");

        foreach (var claimData in claimsData)
        {
            var claimNumber = claimData.GetProperty("claimNumber").GetString() ?? "";
            var policyholderName = claimData.GetProperty("policyholderName").GetString() ?? "";
            
            // Build the expected image filename based on policyholder name
            // Format: firstname-lastname-description.jpg (e.g., "ajlal-nueimat-deer-collision.jpg")
            var nameKey = policyholderName.ToLower().Replace(" ", "-");
            
            // Find matching image file in sample-images directory
            var imageFiles = Directory.GetFiles(imagesPath, $"{nameKey}*.jpg");
            
            if (imageFiles.Length == 0)
            {
                Console.WriteLine($"⏭️  No image found for {claimNumber} ({policyholderName})");
                continue;
            }
            
            var imageFile = imageFiles[0];
            var fileName = Path.GetFileName(imageFile);
            
            Console.WriteLine($"📸 Processing damage photo for claim {claimNumber}: {fileName}");
            
            try
            {
                // Read image from local file
                var imageBytes = await File.ReadAllBytesAsync(imageFile);
                
                // Upload to blob storage with claim number in metadata
                // Blob knowledge source indexer will automatically:
                // 1. Discover the blob
                // 2. Generate image verbalization using GPT-4o
                // 3. Create searchable index entry
                var blobUrl = await _blobStorageService.UploadDamagePhotoAsync(claimNumber, imageBytes, fileName);
                
                // Update the claim record with the image URL for direct access
                claimsToUpdate.Add(new SearchDocument
                {
                    ["id"] = claimNumber,
                    ["imageUrl"] = blobUrl
                });
                
                uploadCount++;
                Console.WriteLine($"✅ Uploaded photo for {claimNumber}: {blobUrl}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️  Failed to upload photo for {claimNumber}: {ex.Message}");
            }
        }
        
        // Update claims with image URLs
        if (claimsToUpdate.Any())
        {
            Console.WriteLine($"📝 Updating {claimsToUpdate.Count} claims with image URLs...");
            var claimsBatch = IndexDocumentsBatch.MergeOrUpload(claimsToUpdate);
            await claimsClient.IndexDocumentsAsync(claimsBatch);
            Console.WriteLine($"✅ Updated {claimsToUpdate.Count} claims with image URLs");
        }
        
        if (uploadCount > 0)
        {
            Console.WriteLine($"📸 Total: Uploaded {uploadCount} damage photos to blob storage");
        }
        else
        {
            Console.WriteLine("⚠️  No damage photos found to upload");
        }
    }

    #endregion
}
