---
search:
  exclude: true
---
# ラボ BAF4 - ポリシー検索の追加

このラボでは、Zava Insurance エージェントにポリシー検索機能を拡張します。Knowledgebases を使用して Azure AI Search で保険ポリシーを検索できるようにします。

???+ info "ポリシー検索を理解する"
    このラボでは、Azure AI Search を利用したポリシー検索機能を追加します。

    - 保険ポリシー（自動車、住宅、業務用）を種類、ステータス、契約者で検索
    - 補償限度額、免責額、保険料などの構造化されたポリシー詳細を取得
    - ポリシーに紐づく車両・不動産情報にアクセス
    - Knowledgebases を用いた自然言語クエリ
    
    これにより、アジャスターはポリシー情報を迅速に見つけ、クレームの補償範囲を確認できます。

## エクササイズ 1: ポリシーのインデックスと Knowledge Source の追加

KnowledgeBaseService を拡張し、クレームに加えてポリシーもサポートしましょう。

### 手順 1: ポリシー定数とインデックス作成の追加

??? note "この手順で行うこと"
    追加内容は次のとおりです。

    - **ポリシー定数**: ポリシー用インデックスと Knowledge Source の名前を定義
    - **ポリシーインデックス**: ポリシーデータ（種類、ステータス、補償、車両/不動産情報）の検索インデックス
    - **ポリシー Knowledge Source**: ポリシーインデックスを Knowledge Base に接続
    - **ポリシーデータのインデックス化**: JSON ファイルからサンプルポリシーを読み込みインデックス
    
    これらの追加は既存のクレーム機能を変更せずに動作します。

1️⃣ `src/Services/KnowledgeBaseService.cs` を開きます。

2️⃣ `private const string ClaimsKnowledgeSource = "claims-knowledge-source";` を見つけ、**ポリシー用の定数とインデックス**を追加します。

```csharp
// Knowledge source names
private const string PoliciesKnowledgeSource = "policies-knowledge-source";

// Index names
private const string PoliciesIndex = "policies-index";
```

3️⃣ `EnsureClaimsIndexAsync` メソッドを見つけ、その直後に `EnsurePoliciesIndexAsync` メソッドを追加します。

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

<cc-end-step lab="baf4" exercise="1" step="1" />

### 手順 2: Knowledge Source をポリシー対応に更新

`CreateKnowledgeSourcesAsync` メソッドを更新し、クレームとポリシー両方の Knowledge Source を作成します。

1️⃣ `CreateKnowledgeSourcesAsync` メソッドを見つけ、下記の更新版に **丸ごと置き換え** ます。

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

<cc-end-step lab="baf4" exercise="1" step="2" />

### 手順 3: Knowledge Base をポリシー対応に更新

Knowledge Base 定義を更新してポリシー Knowledge Source を含めます。

1️⃣ `new KnowledgeSourceReference(name: ClaimsKnowledgeSource)` の行を見つけ、コンマを追加してその直後に次の行を追加します。これでクレームとポリシーの両方が含まれます。

```csharp
 new KnowledgeSourceReference(name: PoliciesKnowledgeSource)
```

最終的な Knowledge Base 作成コードは次のようになります。

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

<cc-end-step lab="baf4" exercise="1" step="3" />

### 手順 4: ポリシーデータのインデックス化

サンプルポリシーデータをインデックス化するメソッドを追加します。

1️⃣ `IndexSampleDataAsync` メソッドを見つけ、ポリシーを含むように更新します。

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

2️⃣ `IndexClaimsDataAsync` メソッドのすぐ後ろに `IndexPoliciesDataAsync` メソッドを追加します。

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

<cc-end-step lab="baf4" exercise="1" step="4" />

### 手順 5: GetPolicyByNumberAsync ヘルパーメソッドの追加

インデックスからポリシー詳細を直接取得するヘルパーメソッドを追加します。

1️⃣ Retrieval セクションで、`GetClaimByNumberAsync` のすぐ後ろに `GetPolicyByNumberAsync` を追加します。

```csharp
/// <summary>
/// Gets policy details directly from the policies index using filter query
/// This bypasses the Knowledgebases for structured data retrieval
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

<cc-end-step lab="baf4" exercise="1" step="5" />

## エクササイズ 2: PolicyPlugin の作成

ポリシー検索とポリシー詳細機能を備えた PolicyPlugin を作成します。

### 手順 1: 完全な PolicyPlugin の作成

??? note "このプラグインの機能"
    `PolicyPlugin` は次の 2 つの主要機能を提供します。
    
    - **SearchPolicies**: Azure AI Search Knowledge Base を用いた自然言語によるポリシー検索（ClaimsPlugin と同様）
    - **GetPolicyDetails**: 指定されたポリシー番号の構造化されたポリシー情報を取得

1️⃣ `src/Plugins/PolicyPlugin.cs` という新しいファイルを作成し、以下の実装を追加します。

```csharp
using Microsoft.Agents.Builder;
using Microsoft.Agents.Core.Models;
using System.ComponentModel;
using System.Text;
using Azure.Search.Documents.Models;
using InsuranceAgent.Services;

namespace ZavaInsurance.Plugins
{
    /// <summary>
    /// Policy Plugin for Zava Insurance
    /// Provides policy search and retrieval using Azure AI Search Knowledge Base
    /// Supports filtering by policy type, status, and policyholder name
    /// </summary>
    public class PolicyPlugin
    {
        private readonly ITurnContext _turnContext;
        private readonly KnowledgeBaseService _knowledgeBaseService;

        public PolicyPlugin(ITurnContext turnContext, KnowledgeBaseService knowledgeBaseService)
        {
            _turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
            _knowledgeBaseService = knowledgeBaseService ?? throw new ArgumentNullException(nameof(knowledgeBaseService));
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

<cc-end-step lab="baf4" exercise="2" step="1" />

## エクササイズ 3: エージェントに PolicyPlugin を登録

PolicyPlugin を ZavaInsuranceAgent に組み込みます。

### 手順 1: Program.cs の初期化を更新

Program.cs の初期化コードを更新し、ポリシーインデックスを作成するようにします。

1️⃣ `src/Program.cs` を開きます。

2️⃣ Azure AI Search の初期化セクションを見つけ、ポリシーを含むように更新します。

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

<cc-end-step lab="baf4" exercise="3" step="1" />

### 手順 2: エージェントインストラクションを更新

エージェントのインストラクションをポリシーツールを含むように更新します。

1️⃣ `src/Agent/ZavaInsuranceAgent.cs` を開きます。

2️⃣ `AgentInstructions` プロパティを更新します。

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

**IMPORTANT**: When user asks to "check policy for this claim", first use GetClaimDetails to get the claim's policy number, then use GetPolicyDetails with that policy number.

Stick to the scenario above and use only the information from the tools when answering questions.
Be concise and professional in your responses.
""";
```

<cc-end-step lab="baf4" exercise="3" step="2" />

### 手順 3: PolicyPlugin の登録

エージェントのツールに PolicyPlugin を追加します。

1️⃣ `GetClientAgent` メソッドで、`ClaimsPlugin claimsPlugin = new(context, knowledgeBaseService, configuration);` の直後に PolicyPlugin を追加します。

```csharp
// Create PolicyPlugin with required dependencies
PolicyPlugin policyPlugin = new(context, knowledgeBaseService);
```

2️⃣ ClaimsPlugin のツールが登録されている箇所を見つけ、PolicyPlugin のツールも追加します。

```csharp
// Register PolicyPlugin tools
toolOptions.Tools.Add(AIFunctionFactory.Create(policyPlugin.SearchPolicies));
toolOptions.Tools.Add(AIFunctionFactory.Create(policyPlugin.GetPolicyDetails));
```

<cc-end-step lab="baf4" exercise="3" step="3" />

### 手順 4: StartConversationPlugin のウェルカムメッセージを更新

ポリシー検索と SharePoint 連携を追加したので、ウェルカムメッセージをすべての機能を反映したものに更新します。

1️⃣ `src/Plugins/StartConversationPlugin.cs` を開きます。

2️⃣ `StartConversation` メソッド内の `welcomeMessage` 変数を次の内容に置き換えます。

```csharp
            var welcomeMessage = "👋 Welcome to Zava Insurance Claims Assistant!\n\n" +
                                "I'm your AI-powered insurance claims specialist. I help adjusters and investigators streamline the entire claims process - from initial assessment to final approval.\n\n" +
                                "**What I can do:**\n\n" +
                                "- Search and retrieve detailed claim information\n" +
                                "- Validate policy coverage and check expiration dates\n" +
                                "- Use Mistral AI to analyze damage photos instantly\n" +
                                "- Provide damage assessments with cost estimates\n" +
                                "- Track claim timelines and identify processing bottlenecks\n\n" +
                                "🎯 Try this complete workflow:\n" +
                                "1. \"Get details for claim CLM-2025-001007\"\n" +
                                "2. \"Check policy for this claim\"\n" +
                                "3. \"Show damage photo for this claim\"\n" +
                                "4. \"Analyze this damage photo\"\n" +
                                "5. \"Approve the analysis\" or \"Reject the analysis\"\n\n" +
                                "Ready to complete a full claims investigation? What would you like to start with?";
```

??? note "完全な機能セット"
    ウェルカムメッセージには、クレーム検索、ポリシー検証、ビジョン分析を含むすべての機能が反映されています。これで完成したエージェントのフル機能に合致します。

<cc-end-step lab="baf4" exercise="3" step="4" />

## エクササイズ 4: ポリシー検索のテスト

すべてのポリシー機能をテストしましょう！

### 手順 1: 起動と初期化の確認

1️⃣ VS Code で **F5** を押してデバッグを開始します。

2️⃣ プロンプトが表示されたら **(Preview) Debug in Copilot (Edge)** を選択します。

3️⃣ ターミナル出力を確認します。次のような表示が出るはずです。

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

4️⃣ ブラウザーウィンドウが開き、Microsoft 365 Copilot が表示されます。

5️⃣ **Azure Portal で確認**:

- [Azure Portal](https://portal.azure.com){target=_blank} にアクセス
- Azure AI Search サービスに移動
- **Indexes** をクリック → `claims-index` と `policies-index` の両方が表示されることを確認
- **Agentic retrieval** > **Knowledge Bases** をクリック → `zava-insurance-kb` に Knowledge Source が 2 つあることを確認

<cc-end-step lab="baf4" exercise="4" step="1" />

### 手順 2: ポリシー検索のテスト

1️⃣ Microsoft 365 Copilot で次を入力します。 

```text
Find all active auto insurance policies
```

エージェントは `SearchPolicies` を使用し、一致するポリシーと詳細を返すはずです。

2️⃣ 次を試します。 

```text
Show me policies for Sarah Martinez
```

3️⃣ 次を試します。 

```text
Find homeowners insurance policies with Active status
```

<cc-end-step lab="baf4" exercise="4" step="2" />

### 手順 3: ポリシー詳細のテスト

1️⃣ 次を試します。 

```text
Get details for policy POL-AUTO-001
```

エージェントは `GetPolicyDetails` を使用し、補償、車両情報などの構造化情報を返すはずです。

2️⃣ 次を試します。 

```text
Show me policy POL-HOME-001
```

3️⃣ クレームからポリシーへのワークフローを試します。 

```text
Get details for claim CLM-2025-001001, then show me the policy for that claim
```

エージェントはまずクレーム詳細（ポリシー番号を含む）を取得し、その後ポリシー詳細を取得するはずです。

<cc-end-step lab="baf4" exercise="4" step="3" />

---8<--- "ja/b-congratulations.md"

ラボ BAF4 - ポリシー検索の追加を完了しました！

次のことを学習しました。

- ✅ Azure AI Search にポリシーインデックスと Knowledge Source を追加
- ✅ ポリシー検索とポリシー詳細機能を持つ PolicyPlugin を作成
- ✅ エージェントに PolicyPlugin を登録
- ✅ ポリシー検索と取得をテスト

これで Zava Insurance エージェントは、Azure AI Search を使用してクレームとポリシーの両方を検索できるようになりました！

<cc-next url="../05-add-communication" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/04-add-policy-search--ja" />