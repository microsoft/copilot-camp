---
search:
  exclude: true
---
# ラボ BAF2 - Azure AI Search を使用したドキュメント検索の追加

このラボでは、Azure AI Search を用いて文書検索機能を追加し、Zava Insurance Agent を強化します。保険金請求を検索し、請求の詳細を取得し、書類が不足している請求を識別するための AI 搭載検索を行う **ClaimsPlugin** を作成します。

???+ info "Azure AI Search の基本概念"
    **Azure AI Search** は、コンテンツに対して高度な検索体験を構築するためのインフラストラクチャ、API、およびツールを提供するクラウド検索サービスです。
    
    **主要概念:**
    
    - **Search Index**: 検索可能なドキュメントのコレクションで、データベース テーブルに似ています。各インデックスには、検索・フィルター・並べ替えが可能なフィールドを持つドキュメントが含まれます。
    - **Knowledge Source**: データをインデックスに接続する論理的なグループ。データの取得元とインデックス化方法を定義します。
    - **Knowledge Base**: 複数の Knowledge Source をまとめ、単一のクエリで異なるデータソースを横断的に検索できる統合インターフェース。
    
    このラボでは、保険請求データを格納する **claims index** を作成し、データを接続する **knowledge source** を構成し、統合検索用に **knowledge base** をセットアップします。ClaimsPlugin はこれらのコンポーネントを利用して AI 搭載検索を実行します。

## Exercise 1: Azure AI Search のセットアップ

プラグインを追加する前に、サンプルの請求データで Azure AI Search をセットアップします。

### 手順 1: Azure AI Search サービスの作成

まだ Azure AI Search サービス（Lab BAF0 で作成済み）を作成していない場合は、今作成します。

1️⃣ [Azure Portal](https://portal.azure.com){target=_blank} にアクセスします。

2️⃣ **+ Create a resource** → **Azure AI Search** を検索 → **Create** をクリックします。

3️⃣ 以下を設定します:

- **Resource Group**: Microsoft Foundry プロジェクトと同じリソースグループ
- **Service Name**: 一意の名前（例: `zava-insurance-search`）
- **Region**: 任意のサポート対象リージョン (Central US, East US, West Europe など)
- **Pricing Tier**: Basic

4️⃣ **Review + Create** → **Create** をクリックします（2-3 分）。

5️⃣ デプロイ完了後、リソースの **Overview** ページで **URL** をコピーします。

6️⃣ **Settings** > **Keys** に移動し、**Primary Admin Key** をコピーします。

<cc-end-step lab="baf2" exercise="1" step="1" />

### 手順 2: サンプル請求データの追加

プロジェクトにはサンプル請求データが含まれており、自動的にインデックス化されます。

1️⃣ VS Code で `infra/data/sample-data/claims.json` を開きます。

2️⃣ 構造を確認します。各請求には以下があります:

- `claimNumber`: 一意の識別子 (例: "CLM-2025-001001")
- `policyholderName`: 顧客名
- `claimType`: Auto, Homeowners, Commercial
- `status`: Open, In Progress, Approved, Closed
- `severity`: Low, Medium, High, Critical
- `estimatedCost`: 請求金額
- `fraudRiskScore`: リスク指標 (0-100)
- `region`: Northeast, South, Midwest, West

3️⃣ このデータはエージェントを実行すると Azure AI Search にインデックス化されます。

<cc-end-step lab="baf2" exercise="1" step="2" />

### 手順 3: Azure AI Search 資格情報の設定

Azure AI Search の資格情報をプロジェクトに追加します。

1️⃣ VS Code で `env/.env.local` を開きます。

2️⃣ Azure AI Search セクションを探し、以下を更新します:

```bash
# Azure AI Search
AZURE_AI_SEARCH_ENDPOINT=https://your-search.search.windows.net
```

3️⃣ VS Code で `env/.env.local.user` を開きます。

4️⃣ Azure AI Search セクションを探し、以下を更新します:

```bash
# Azure AI Search
SECRET_AZURE_AI_SEARCH_API_KEY=your-primary-admin-key
```

!!! tip "資格情報の確認方法"
    - **Endpoint**: Azure Portal → 対象 Search Service → Overview → URL
    - **API Key**: Azure Portal → 対象 Search Service → Keys → Primary Admin Key

<cc-end-step lab="baf2" exercise="1" step="3" />

## Exercise 2: KnowledgeBaseService の作成

KnowledgeBaseService は Azure AI Search とのすべてのやり取りを担当し、インデックス・Knowledge Source・Knowledge Base の作成、データのインデックス化、AI 搭載の検索を行います。

### 手順 1: 完全版 KnowledgeBaseService の作成

??? note "このコードが行うこと"
    `KnowledgeBaseService` は Azure AI Search 連携の中核サービスです:
    
    - **Constructor**: 設定を使用して Azure AI Search と Azure OpenAI への接続を初期化
    - **EnsureClaimsIndexAsync**: Semantic とベクトル検索を備えた検索インデックスを作成（Knowledge Base に必須）
    - **CreateKnowledgeSourcesAsync**: データフィールドを定義する Knowledge Source を設定
    - **CreateKnowledgeBaseAsync**: 回答生成用 LLM モデルを使用する Knowledge Base を作成
    - **RetrieveAsync**: 主要なエージェントリトリーバルメソッド—LLM を使い検索し、フォーマット指示付きで回答を生成
    - **IndexClaimsDataAsync**: JSON ファイルからサンプル請求データを読み込みインデックス化
    
    このサービスは、エージェントリトリーバル機能を備えた完全な Azure AI Search 機能を提供します。

1️⃣ VS Code で新しいフォルダー `src/Services` を作成します。

2️⃣ `src/Services/KnowledgeBaseService.cs` という新しいファイルを作成し、以下の完全実装を追加します:

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

## Exercise 3: ClaimsPlugin の作成

KnowledgeBaseService を利用して請求検索機能を提供する ClaimsPlugin を作成します。

### 手順 1: 完全版 ClaimsPlugin の作成

??? note "このコードが行うこと"
    `ClaimsPlugin` はエージェントに請求検索機能を提供します:
    
    - **SearchClaims**: 地域、タイプ、重大度、ステータスで請求を検索—自然言語クエリを生成し、構造化出力指示付きでエージェントリトリーバルを実行
    - **GetClaimDetails**: 特定の請求 ID の詳細情報を取得し、LLM 用の詳細フォーマット指示を提供
    - **NotifyUserAsync**: StreamingResponse を用いてリアルタイムのステータス更新 ("Searching...", "Retrieved data...") をユーザーに送信するヘルパーメソッド
    
    各メソッドには `[Description]` 属性があり、AI エージェントにツールを使用するタイミングと方法を伝えます。AI はユーザーの意図から自動的に呼び出すツールを決定します。

1️⃣ `src/Plugins/ClaimsPlugin.cs` を新規作成し、以下の完全実装を追加します:

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

## Exercise 4: サービス登録とエージェント設定

Program.cs にサービスを登録し、ClaimsPlugin をエージェントに追加してすべてを連携させます。

### 手順 1: KnowledgeBaseService の登録とデータ初期化

??? note "このコードが行うこと"

    `Program.cs` ではサービス登録を行います:
    
    - **Service Registration**: KnowledgeBaseService をシングルトンとして登録し、アプリ全体で利用可能に
    - **Initialization**: インデックス → Knowledge Source → Knowledge Base → サンプルデータのインデックス化（この順序が必須）
    - **Error Handling**: 初期化エラーを捕捉し、アプリを停止させずに開発を継続

1️⃣ `src/Program.cs` を開きます。

2️⃣ 先頭の using 文のセクションに以下を追加します:

```csharp
using InsuranceAgent.Services;
```

3️⃣ `builder.Services.AddSingleton<IStorage, MemoryStorage>();` を見つけ、その直後に以下を追加します:

```csharp
// Register Knowledge Base Service for Azure AI Search
builder.Services.AddSingleton<KnowledgeBaseService>();
```

4️⃣ `var app = builder.Build();` の直後に以下の初期化コードを追加します:

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

### 手順 2: ClaimsPlugin を使用したエージェント設定

??? note "このコードが行うこと"

    `ZavaInsuranceAgent.cs` ファイルでエージェントに新しい ClaimsPlugin を使うよう指示します:
    
    - **Agent Instructions**: システムプロンプトを更新し、ClaimsPlugin ツールを含める（AI に使用タイミングを伝える）
    - **Plugin Creation**: 必要な依存関係 (context, KnowledgeBaseService, configuration) で ClaimsPlugin をインスタンス化
    - **Tool Registration**: SearchClaims と GetClaimDetails を AI エージェントの呼び出し可能ツールとして登録

1️⃣ `src/Agent/ZavaInsuranceAgent.cs` を開きます。

2️⃣ 先頭に以下の using 文を追加します:

```csharp
using InsuranceAgent.Services;
```

3️⃣ `AgentInstructions` プロパティを見つけ、以下のスニペットに置き換えます:

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

4️⃣ `src/Agent/ZavaInsuranceAgent.cs` 内の `GetClientAgent` メソッドで `StartConversationPlugin` が作成されている箇所を見つけ、その直後に以下を追加します:

```csharp
var scope = _serviceProvider.CreateScope();

// Get KnowledgeBaseService and IConfiguration from DI
var knowledgeBaseService = scope.ServiceProvider.GetRequiredService<KnowledgeBaseService>();
var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

// Create ClaimsPlugin with required dependencies
ClaimsPlugin claimsPlugin = new(context, knowledgeBaseService, configuration);
```

5️⃣ ツールを登録している箇所を見つけ、`toolOptions.Tools.Add(AIFunctionFactory.Create(startConversationPlugin.StartConversation))` の直後に以下を追加します:

```csharp
// Register ClaimsPlugin tools
toolOptions.Tools.Add(AIFunctionFactory.Create(claimsPlugin.SearchClaims));
toolOptions.Tools.Add(AIFunctionFactory.Create(claimsPlugin.GetClaimDetails));
```

<cc-end-step lab="baf2" exercise="4" step="2" />

### 手順 3: StartConversationPlugin のウェルカムメッセージを更新

請求検索機能を追加したので、ウェルカムメッセージを更新して新機能を反映させましょう。

1️⃣ `src/Plugins/StartConversationPlugin.cs` を開きます。

2️⃣ `StartConversation` メソッド内の `welcomeMessage` 変数を以下に置き換えます:

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

??? note "段階的な機能更新"
    各ラボでウェルカムメッセージを順次更新し、新しい機能を反映させます。これにより、ユーザーは開発段階ごとにエージェントの最新機能を確認できます。

<cc-end-step lab="baf2" exercise="4" step="3" />

## Exercise 5: ドキュメント検索のテスト

新しい請求検索機能をテストしてみましょう！

### 手順 1: エージェントの実行

1️⃣ VS Code で **F5** を押してデバッグを開始します。

2️⃣ プロンプトが表示されたら **(Preview) Debug in Copilot (Edge)** を選択します。

3️⃣ ターミナル出力を確認します。次のように表示されるはずです:

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

!!! note "Policies について"
    KnowledgeBaseService の完全実装にポリシー機能が含まれている場合、ポリシー関連の追加出力が表示されることがあります。これは想定内で、今後のラボでポリシーを使用します。今回は請求機能に注目してください。

4️⃣ ブラウザーが開き、Microsoft 365 Copilot が表示されます。前回のラボでエージェントはすでにインストールされています。

5️⃣ **Azure Portal で確認**（任意ですが推奨）:

- [Azure Portal](https://portal.azure.com){target=_blank} で Azure AI Search サービス名を検索
- 左メニューの **Indexes** をクリックし、`claims-index` があることを確認。インデックス名をクリックし **Search** で 35 件のドキュメントを確認
- 検索サービスに戻り **Agentic retrieval** > **Knowledge Bases** をクリックし、`zava-insurance-kb` が表示されていることを確認
- **Search Explorer** を使用してインデックスに直接クエリを実行することもできます

<cc-end-step lab="baf2" exercise="5" step="1" />

### 手順 2: 請求検索のテスト

1️⃣ Microsoft 365 Copilot で、より具体的な検索を試します:

```text
Find claims in the South region
```

2️⃣ 次を試します:

```text
Show me auto claims with medium severity
```

<cc-end-step lab="baf2" exercise="5" step="2" />

### 手順 3: 請求詳細のテスト

1️⃣ 次を試します:

```text
Get details for claim CLM-2025-001007
```

エージェントは `GetClaimDetails` を使用して詳細情報を返すはずです。今後のラボでデータを追加し、ポリシーや請求履歴を表示するなど、レスポンスをさらに強化していきます。

2️⃣ 別の請求を試します:

```text
Show me information about claim CLM-2025-001003
```

<cc-end-step lab="baf2" exercise="5" step="3" />

---8<--- "ja/b-congratulations.md"

ラボ BAF2 - Azure AI Search を使用したドキュメント検索の追加を完了しました！

次のことを学習しました:

- ✅ サンプルデータで Azure AI Search をセットアップ
- ✅ AI 搭載検索用の KnowledgeBaseService を作成
- ✅ 多彩な検索機能を持つ ClaimsPlugin を構築
- ✅ 起動時にサービス登録と Knowledge Base の初期化を実施
- ✅ 自然言語クエリでドキュメント検索をテスト

次のラボでは、画像を処理するビジョン解析機能を追加し、エージェントをさらに強化します。

<cc-next url="../03-add-vision-analysis" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/02-add-claim-search--ja" />