---
search:
  exclude: true
---
# ラボ BAF6 - Microsoft 365 Work IQ API 統合を追加する

このラボでは、Zava Insurance エージェントに Microsoft 365 Work IQ API を組み込みます。SharePoint のポリシー ドキュメントを **Copilot Retrieval API** 経由で取得し、Microsoft 365 Copilot のエンタープライズ検索のグラウンディング機能を活用して、保険金請求のコンプライアンスを分析できるようにします。

???+ info "Microsoft 365 Work IQ API の概要"
    **Microsoft 365 Work IQ API** を使用すると、エージェントは次のことが可能になります:
    
    - **Copilot Retrieval API**: SharePoint、OneDrive、Copilot コネクタから、権限とコンプライアンス設定を尊重しながら関連するテキスト チャンクを取得
    - **Secure Data Access**: 信頼境界内で Microsoft 365 データへアクセスし、データの持ち出しを防止
    - **Enterprise Search Grounding**: Microsoft 365 Copilot と同じ方法で、組織固有情報に基づいて LLM の回答をグラウンディング
    - **Compliance & Security**: 組み込みの権限モデルで厳格なセキュリティ基準を維持
    
    これにより、SharePoint に保存されたポリシー ドキュメントと照合して保険金請求のコンプライアンスを分析できます。

<hr />

## 概要

ラボ BAF5 では、メール送信とレポート生成の機能を追加しました。今回は Microsoft 365 Work IQ API を用いて SharePoint からポリシー ドキュメントを取得し、AI を活用して保険金請求のコンプライアンスを分析できるようにエージェントを拡張します。

**Copilot Retrieval API** は、データを別途複製・インデックス化・チャンク化・保護することなく Retrieval Augmented Generation (RAG) を実現するシンプルなソリューションを提供します。ユーザーのコンテキストと意図を理解し、クエリを変換して最適な結果を返します。

???+ warning "ライセンス要件"
    Copilot Retrieval API は **Microsoft 365 Copilot アドオン ライセンス** を持つユーザーであれば追加費用なしで利用できます。現在、Microsoft 365 Copilot アドオン ライセンスを持たないユーザーはサポートされていません。

## エクササイズ 1: ポリシー ドキュメント用の SharePoint サイトを準備する

Copilot Retrieval API を使用する前に、ポリシー ドキュメントを格納する SharePoint サイトを作成します。

### 手順 1: SharePoint サイトを作成する

??? note "SharePoint と Copilot Retrieval API について"
    **Microsoft Graph Copilot Retrieval API** を使用すると、Microsoft 365 Copilot を支える強力なセマンティック検索を使って SharePoint のコンテンツを検索できます。
    
    - **Semantic Search**: SharePoint ドキュメントを対象に自然言語で検索
    - **Real-time Access**: 常に最新バージョンのドキュメントを検索
    - **Security**: SharePoint の権限を尊重 (ユーザー認証が必須)
    - **Citations**: 出典リンク付きでドキュメント スニペットを返却
    
    ポリシー条項、補償ガイド、FAQ ドキュメントの検索に最適です。

1️⃣ [SharePoint](https://www.office.com/launch/sharepoint){target=_blank} にアクセスし、Microsoft 365 アカウントでサインインします。

2️⃣ **+ Create site** をクリック → **Team site** を選択します。

3️⃣ **Standard team** サイト テンプレートを選択し、**Use template** をクリックします。

4️⃣ サイトを設定します:

- **Site name**: "Zava Insurance Policy Documents"
- **Description**: "Insurance policy terms, coverage guides, and FAQs"

5️⃣ **Next** を選択します

- **Privacy settings**: Private (メンバーのみアクセス可)
- **Select language**: English

6️⃣ **Create site** コマンドを選択し、サイトが作成されるまで待機します。

7️⃣ サイトが準備できたら **Finish** を選択してサイトに移動します。

<cc-end-step lab="baf6" exercise="1" step="1" />

### 手順 2: ポリシー ドキュメントをアップロードする

次に、プロジェクトのサンプル ポリシー ドキュメントをアップロードします。

1️⃣ VS Code ワークスペースで `src/agent-framework/complete/infra/data/sample-documents/` フォルダーを開きます。

2️⃣ 以下のドキュメントがあることを確認します:

   - `Auto Insurance Claims Policies.docx`
   - `Homeowners Insurance Claims Policies.docx`
   - `Step-by-Step Guide - Creating an Insurance Quote.docx`
   - `Zava Claims Insurance Policies.docx`

3️⃣ SharePoint で新しいサイトを開き、左メニューの **Documents** をクリックします。

4️⃣ **Upload** → **Files** をクリックし、sample-documents フォルダーの 4 つのドキュメントをすべてアップロードします。

5️⃣ SharePoint がドキュメントをインデックス化するまで **10〜15 分** 待ちます。Copilot Retrieval API がドキュメントを検索可能にするための処理時間です。

!!! tip "インデックス化の確認"
    ドキュメントがインデックス化されたか確認するには:
    
    - Microsoft 365 Copilot (copilot.microsoft.com) を開く
    - 「私の SharePoint にはどのようなポリシー ドキュメントがありますか?」と質問する
    - ドキュメントが表示されれば、エージェントで使用可能です

6️⃣ SharePoint サイトの URL をコピーします。後ほどテストで使用します。

<cc-end-step lab="baf6" exercise="1" step="2" />

## エクササイズ 2: LanguageModelService を作成する

ClaimsPoliciesPlugin を作成する前に、AI でコンプライアンス分析を行うための LanguageModelService を実装します。

### 手順 1: LanguageModelService を作成する

??? note "このサービスが行うこと"
    `LanguageModelService` は言語モデル機能への集中アクセスポイントです:
    
    - **Chat Completions**: プロンプトを言語モデルに送り、レスポンスを取得
    - **Configurable Model**: 設定で指定したモデル デプロイメントを使用
    - **Shared Endpoint**: 他の AI サービスと同じ Azure OpenAI エンドポイントを使用
    
    このサービスは ClaimsPoliciesPlugin が取得したポリシー ドキュメントと保険金請求を照合し、コンプライアンスを分析する際に使用します。

1️⃣ `src/Services/LanguageModelService.cs` に新しいファイルを作成し、次の実装を追加します:

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

### 手順 2: 依存関係注入に LanguageModelService を登録する

アプリケーションの DI コンテナーにサービスを登録します。

1️⃣ `src/Program.cs` を開きます。

2️⃣ 他のサービスを登録している箇所 (例: `builder.Services.AddScoped<VisionService>();`) を見つけ、その直後に以下を追加します:

```csharp
// Register LanguageModelService for AI-powered analysis
builder.Services.AddSingleton<LanguageModelService>();
```

<cc-end-step lab="baf6" exercise="2" step="2" />

### 手順 3: 設定を更新する

言語モデルの設定が含まれていることを確認します。

1️⃣ `.env.local` ファイルを開きます。

2️⃣ 次の言語モデル設定があるか確認し、無ければ追加します:

```bash
# Language Model (for compliance analysis)
LANGUAGE_MODEL_NAME=gpt-4o
```

??? note "設定に関する補足"
    - **LANGUAGE_MODEL_NAME**: Azure OpenAI での言語モデルのデプロイ名
    - サービスは他の AI モデルと同じエンドポイントと API キーを使用します
    - コスト重視の場合は `gpt-4o-mini`、高度な推論が必要な場合は `gpt-4o` を利用できます

<cc-end-step lab="baf6" exercise="2" step="3" />

## エクササイズ 3: ClaimsPoliciesPlugin を作成する

Copilot Retrieval API を使用して、SharePoint のポリシー ドキュメントと照合し保険金請求のコンプライアンスを分析する ClaimsPoliciesPlugin を作成します。

### 手順 1: Copilot Retrieval API を理解する

??? note "Copilot Retrieval API の仕組み"
    **Microsoft 365 Copilot Retrieval API** では次のことが可能です:
    
    - **Query SharePoint content**: 自然言語クエリで SharePoint ドキュメントから関連テキストを取得
    - **Respect permissions**: ユーザーのアクセス権に基づいて結果をフィルタリング
    - **Get structured responses**: タイトルや著者などのメタデータ付きテキスト抽出結果を受信
    - **Use KQL filters**: URL、日付範囲、ファイル タイプなどでフィルタリング可能
    
    **API エンドポイント**: `POST https://graph.microsoft.com/v1.0/copilot/retrieval`
    
    **リクエスト ペイロード**:

    ```json
    {
        "queryString": "Your natural language query",
        "dataSource": "SharePoint",
        "resourceMetadata": ["title", "author"]
    }
    ```
    
    **ベスト プラクティス**:

    - クエリには可能な限り多くのコンテキストを含める
    - `queryString` は 1 文にまとめる
    - 幅広い内容に当てはまる一般的すぎるクエリは避ける
    - 返されたすべての抽出テキストを LLM へ渡して回答を生成する

<cc-end-step lab="baf6" exercise="3" step="1" />

### 手順 2: ClaimsPoliciesPlugin を作成する

??? note "このプラグインが行うこと"
    `ClaimsPoliciesPlugin` は保険金請求のコンプライアンス分析機能を提供します。
    
    **AnalyzeClaimCompliance**:

    - KnowledgeBaseService から請求詳細を取得
    - Copilot Retrieval API で SharePoint のポリシー ドキュメントを検索
    - AI を使って請求内容とポリシーを照合しコンプライアンスを分析
    - 出典付きの構造化された分析結果を返却
    - ストリーミング レスポンスに SharePoint ドキュメントの引用を追加
    
    プラグインは **On-Behalf-Of (OBO) トークン** を使用して Microsoft Graph を呼び出し、ユーザー権限を尊重します。

1️⃣ `src/Plugins/ClaimsPoliciesPlugin.cs` に次の実装を持つ新しいファイルを作成します:

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

???+ info "StreamingResponse での引用の仕組み"
    `ClaimsPoliciesPlugin` は `ITurnContext` 上の `StreamingResponse.AddCitation()` メソッドを使用して引用をレスポンスに追加します。手順は以下のとおりです:
    
    1. **AI が引用参照を生成**: 言語モデルが分析テキスト内に `[1]`, `[2]` などの参照と `CitationsTitles`, `CitationsLinks` 配列を返します。
    
    2. **ClientCitation オブジェクトを作成**: 各引用について `ClientCitation` を作成します:
        - `position`: 引用番号 (1 から始まり、テキスト内の `[1]`, `[2]` と一致)
        - `title`: 表示用タイトル
        - `citationLink`: ソース ドキュメントへの URL (ボットのプロキシ エンドポイント経由)
        - `imageName`: アイコン (例: `ClientCitationsIconNameEnum.MicrosoftWord`)
    
    3. **StreamingResponse に追加**: `_turnContext.StreamingResponse.AddCitation(citation)` を呼び出して引用をキューに追加します。
    
    4. **M365 Copilot が引用を表示**: Microsoft 365 Copilot がクリック可能な引用リンクを自動でレンダリングします。
    
    **プロキシ エンドポイントを使う理由**: SharePoint の URL は認証が必要なため、`GetCitationUrl()` でボットの `/api/citation` エンドポイントを経由させ、認証後に実際のドキュメントへリダイレクトします。

<cc-end-step lab="baf6" exercise="3" step="2" />

## エクササイズ 4: ClaimsPoliciesPlugin をエージェントに登録する

ZavaInsuranceAgent に ClaimsPoliciesPlugin を組み込みます。

### 手順 1: ClaimsPoliciesPlugin をインスタンス化する

1️⃣ `src/Agent/ZavaInsuranceAgent.cs` を開きます。

2️⃣ `GetClientAgent` メソッド (約 169 行目) を探します。

3️⃣ サービス インスタンスを取得している箇所で、`var visionService = scope.ServiceProvider.GetRequiredService<VisionService>();` の直後に次を追加します:

```csharp
var languageModelService = scope.ServiceProvider.GetRequiredService<LanguageModelService>();
```

4️⃣ プラグインをインスタンス化している場所 (`CommunicationPlugin communicationPlugin = ...` の後) を探します。

5️⃣ ClaimsPoliciesPlugin のインスタンス化を追加します:

```csharp
// Create ClaimsPoliciesPlugin with required dependencies
ClaimsPoliciesPlugin claimsPoliciesPlugin = new(context, turnState, knowledgeBaseService, languageModelService, configuration, httpClient);
```

<cc-end-step lab="baf6" exercise="4" step="1" />

### 手順 2: ClaimsPoliciesPlugin のツールを登録する

同じ `GetClientAgent` メソッドで、`toolOptions.Tools` にツールを追加している箇所までスクロールします。

Communication ツール セクションを見つけ、その直後に ClaimsPoliciesPlugin ツールを追加します:

```csharp
// Register ClaimsPolicies tools (Copilot Retrieval API)
toolOptions.Tools.Add(AIFunctionFactory.Create(claimsPoliciesPlugin.AnalyzeClaimCompliance));
```

??? note "ツール登録パターン"
    エージェントは **AIFunctionFactory** を使用してプラグイン メソッドを AI ツールとして登録します。プラグイン メソッドの `[Description]` 属性がツールの説明となり、LLM が呼び出し判断を行います。

<cc-end-step lab="baf6" exercise="4" step="2" />

### 手順 3: エージェントの命令文を更新する

コンプライアンス分析ツールを命令文に追加します。

1️⃣ `src/Agent/ZavaInsuranceAgent.cs` で `AgentInstructions` フィールドを探します。

2️⃣ 既存のツール一覧を見つけ、次を追加します:

```csharp
For claims compliance analysis, use {{ClaimsPoliciesPlugin.AnalyzeClaimCompliance}}.
```

`AgentInstructions` 全体は以下のようにすべてのツールを含む必要があります:

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

### 手順 4: ウェルカム メッセージを更新する

StartConversationPlugin にコンプライアンス分析を提案フローとして追加します。

1️⃣ `src/Plugins/StartConversationPlugin.cs` を開きます。

2️⃣ `StartConversation` メソッド内の `welcomeMessage` 変数を探します。

3️⃣ ワークフロー一覧で "Analyze this damage photo" の後に次を追加します:

```csharp
"8. \"Check compliance for this claim\"\n" +
```

4️⃣ 以降の手順番号を更新します (Generate investigation report → 9、Update claim status → 10)。

更新後のワークフロー セクションは次のようになります:

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

## エクササイズ 5: Copilot API 統合をテストする

統合が完了したら、実際に動作を確認します。

### 手順 1: 実行して確認する

1️⃣ VS Code で **F5** を押してデバッグを開始します。

2️⃣ プロンプトが表示されたら **(Preview) Debug in Copilot (Edge)** を選択します。

3️⃣ ターミナルに通常の初期化メッセージが表示されます。

4️⃣ ブラウザーで Microsoft 365 Copilot が開きます。

<cc-end-step lab="baf6" exercise="5" step="1" />

### 手順 2: 保険金請求のコンプライアンス分析をテストする

1️⃣ Microsoft 365 Copilot で次を入力します:

```text
Check compliance for claim CLM-2025-001007
```

エージェントは以下を行うはずです:

- `ClaimsPoliciesPlugin.AnalyzeClaimCompliance` を使用
- Table Storage から請求詳細を取得
- Copilot Retrieval API で SharePoint からポリシーを取得
- AI でコンプライアンスを分析
- 出典付きの構造化レポートを返却

**期待される応答**:

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

2️⃣ レスポンス内の **引用** (例: `[1]`, `[2]`) に注目してください。これらは分析に使用された SharePoint のポリシー ドキュメントへリンクしています。

<cc-end-step lab="baf6" exercise="5" step="2" />

### 手順 3: 別の請求でテストする

1️⃣ 別の請求で次のプロンプトを試します:

```text
Check if claim CLM-2025-001001 follows our policies
```

2️⃣ エージェントは請求の種別 (Auto、Homeowners など) と地域に基づき、適切なポリシーを取得して分析します。

<cc-end-step lab="baf6" exercise="5" step="3" />

### 手順 4: コンプライアンスを含む完全なワークフローをテストする

次のプロンプトでワークフロー全体をテストします:

```text
1. Get details for claim CLM-2025-001007
2. Check policy for this claim
3. Analyze fraud risk for this claim
4. Check compliance for this claim
5. Generate investigation report for this claim
6. Send the report by email
```

エージェントは Copilot Retrieval API を含むすべての機能をシームレスに統合して実行するはずです。

<cc-end-step lab="baf6" exercise="5" step="4" />

---8<--- "ja/b-congratulations.md"

Microsoft 365 Work IQ API 統合を追加するラボ BAF6 を完了しました!

このラボで学んだこと:

- ✅ Copilot Retrieval API 用にポリシー ドキュメントを格納する SharePoint サイトを構築
- ✅ AI 処理用に集中管理された LanguageModelService を作成
- ✅ Microsoft 365 Copilot Retrieval API とその機能を理解
- ✅ Copilot Retrieval API を利用する ClaimsPoliciesPlugin を作成
- ✅ Microsoft Graph 経由で SharePoint ポリシー ドキュメント検索を統合
- ✅ 取得したポリシー ドキュメントを用いた AI 分析を実装
- ✅ SharePoint ドキュメントの引用をエージェント回答に追加

あなたの Zava Insurance エージェントには、次の機能が含まれました:

- **Search**: Azure AI Search による請求とポリシーの検索
- **Analysis**: Mistral を用いた AI ビジョンでの損害評価
- **Compliance**: SharePoint のポリシーを用いた Copilot Retrieval API によるコンプライアンス分析
- **Communication**: メール レポートと調査サマリー

???+ info "Microsoft 365 Work IQ API について"
    Microsoft 365 Work IQ API は、Copilot の体験を支えるコンポーネントへのアクセスを提供します:
    
    - **Retrieval API**: Microsoft 365 データを持ち出さずに AI ソリューションをグラウンディング
    - **Chat API** (プレビュー): エンタープライズ検索のグラウンディング付きでマルチターン会話を実現
    
    これらの API は、データをその場に保持し、権限を尊重することで厳格なセキュリティとコンプライアンスを維持します。

🎉 **おめでとうございます!** Microsoft 365 Copilot API を統合した本番レベルの AI エージェントが完成しました! 🎊

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/06-add-copilot-api--ja" />