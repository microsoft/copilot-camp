---
search:
  exclude: true
---
# ラボ BAF7 - MCP ツール統合の追加

このラボでは、Zava Insurance エージェントに Model Context Protocol ( MCP ) ツールを拡張します。Azure Functions を使用してクレーム アジャスター管理機能を提供する MCP サーバーを作成し、そのツールを Custom Engine エージェントのカスタム プラグインから利用します。

???+ info "MCP 統合の理解"
    **Model Context Protocol ( MCP )** により、エージェントは次のことが可能になります。
    
    - **外部ツールへの接続**: 標準化されたプロトコルを使用して MCP サーバーのツールにアクセス
    - **クレーム アジャスターの管理**: 専門分野や国別にアジャスターを一覧表示
    - **クレームへのアジャスター割り当て**: クレーム種別に基づいて適切なアジャスターを自動的に割り当て
    - **Azure Functions の活用**: MCP ツールをスケーラブルなサーバーレス関数としてホスト
    
    この統合は、MCP エコシステムを使用してエージェントの機能を拡張する方法を示します。

<hr />

## 概要

前回までのラボで、クレーム検索、ビジョン分析、ポリシー検索、コミュニケーション機能を追加しました。今回は、クレーム種別と場所に基づいて専門のアジャスターにルーティングするという保険ワークフローで一般的な要件に対応するため、MCP ツールでクレーム アジャスターを管理する機能を拡張します。

**Model Context Protocol ( MCP )** は、AI アプリケーションが外部データ ソースやツールに接続できるようにするオープン スタンダードです。Azure Functions で MCP サーバーを作成することで、ビジネス ロジックを MCP 互換のエージェントが利用できるツールとして公開できます。

???+ note "構築するもの"
    - **MCP サーバー**: クレーム アジャスター ツールを MCP 経由で公開する Azure Function アプリ
    - **ClaimsAdjustersPlugin**: MCP ツールを利用してアジャスターの一覧表示と割り当てを行うプラグイン
    - **エージェント統合**: 会話内でアジャスター管理を可能にするためプラグインを接続

## Exercise 1: Azure Functions で MCP サーバーを作成する

??? important "事前定義された MCP サーバー"
    MCP サーバーを最初から作成したくない場合は、Exercise 1 をスキップし、フォルダー `/src/agent-framework/insurance-mcp` から事前定義されたサーバーをダウンロードして、`env/.env.local` と `env/.env.local.user` ファイルを設定後、Visual Studio Code で F5 を押して実行できます。その場合は Exercise 2 へ進んでください。

まず、クレーム アジャスター管理ツールを公開する MCP サーバーとして Azure Function アプリを作成します。

### Step 1: MCP サーバー アーキテクチャを理解する

??? note "MCP サーバーの仕組み"
    MCP サーバーは MCP クライアントから呼び出せるツールを公開します。各ツールには以下が含まれます。
    
    - **Tool Name**: 一意の識別子 (例: `get_claims_adjusters`)
    - **Description**: LLM がツールをいつ使用するかを理解するための説明
    - **Properties**: 型と説明を持つ入力パラメーター
    - **Handler**: ツールが呼び出されたときに実行される関数
    
    Azure Functions はネイティブな MCP プロトコル バインディングにより MCP サーバーのホスティング モデルを提供します。

MCP サーバーのアーキテクチャは次の構成です。

1. **データ ストレージ**: Azure Table Storage にクレーム アジャスター レコードを保存  
2. **HTTP ハンドラー**: 直接 API アクセス用の REST エンドポイント  
3. **MCP ツール ハンドラー**: エージェントが利用する MCP ツールとして登録された関数  

<cc-end-step lab="baf7" exercise="1" step="1" />

### Step 2: Azure Function プロジェクトを作成する

1️⃣ MCP サーバー プロジェクト用の新しいフォルダーを作成します。

```bash
mkdir InsuranceMCPServer
cd InsuranceMCPServer
```

2️⃣ TypeScript で新しい Azure Functions プロジェクトを初期化します。

```bash
func init --typescript
```

3️⃣ 必要な依存関係をインストールします。

```bash
npm install @azure/data-tables dotenv
npm install --save-dev @types/node
```

4️⃣ 環境構成ファイル `env/.env.local` を作成します。

```bash
AZURE_STORAGE_ACCOUNT=your_storage_account
AZURE_TABLE_ENDPOINT=https://your_storage_account.table.core.windows.net
TABLE_NAME=ClaimsAdjusters
ALLOW_INSECURE_CONNECTION=false
```

5️⃣ 環境構成ファイル `env/.env.local.user` を作成します。

```bash
SECRET_AZURE_STORAGE_KEY=your_storage_key
```

<cc-end-step lab="baf7" exercise="1" step="2" />

### Step 3: Claims Adjusters Function を作成する

MCP ツール実装を含む `src/functions/ClaimsAdjusters.ts` ファイルを作成します。

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load environment variables (.env.local.user takes precedence over .env.local)
const envLocalFile = path.join(__dirname, "../../../env/.env.local");
const envLocalUserFile = path.join(__dirname, "../../../env/.env.local.user");

// Load .env.local first, then .env.local.user (later values override earlier ones)
dotenv.config({ path: envLocalFile });
if (fs.existsSync(envLocalUserFile)) {
    dotenv.config({ path: envLocalUserFile, override: true });
}

interface ClaimAdjuster {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    area: string;
}

// Initialize Table Storage client
function getTableClient(): TableClient {
    const account = process.env.AZURE_STORAGE_ACCOUNT;
    const accountKey = process.env.SECRET_AZURE_STORAGE_KEY;
    const tableEndpoint = process.env.AZURE_TABLE_ENDPOINT;
    const tableName = process.env.TABLE_NAME;
    const allowInsecure = process.env.ALLOW_INSECURE_CONNECTION === "true";

    if (!account || !accountKey || !tableEndpoint || !tableName) {
        throw new Error("Missing required environment variables. Please check your env/.env file.");
    }

    const credential = new AzureNamedKeyCredential(account, accountKey);
    return new TableClient(tableEndpoint, tableName, credential, {
        allowInsecureConnection: allowInsecure
    });
}

// Load claims adjusters data from Table Storage
async function loadClaimsAdjusters(): Promise<ClaimAdjuster[]> {
    const tableClient = getTableClient();
    const adjusters: ClaimAdjuster[] = [];

    const entities = tableClient.listEntities({
        queryOptions: { filter: `PartitionKey eq 'ClaimsAdjusters'` }
    });

    for await (const entity of entities) {
        adjusters.push({
            id: entity.rowKey as string,
            firstName: entity.firstName as string,
            lastName: entity.lastName as string,
            email: entity.email as string,
            phone: entity.phone as string,
            country: entity.country as string,
            area: entity.area as string
        });
    }

    return adjusters;
}

// Internal implementation: List claims adjusters with optional filters
async function listClaimsAdjustersImpl(country?: string, area?: string): Promise<ClaimAdjuster[]> {
    let adjusters = await loadClaimsAdjusters();

    // Apply filters
    if (country) {
        adjusters = adjusters.filter(adj => adj.country.toLowerCase() === country.toLowerCase());
    }

    if (area) {
        adjusters = adjusters.filter(adj => adj.area.toLowerCase() === area.toLowerCase());
    }

    return adjusters;
}

// Internal implementation: Get claim adjuster by ID
async function getClaimAdjusterByIdImpl(id: string): Promise<ClaimAdjuster | null> {
    const tableClient = getTableClient();
    
    try {
        const entity = await tableClient.getEntity("ClaimsAdjusters", id);
        const adjuster: ClaimAdjuster = {
            id: entity.rowKey as string,
            firstName: entity.firstName as string,
            lastName: entity.lastName as string,
            email: entity.email as string,
            phone: entity.phone as string,
            country: entity.country as string,
            area: entity.area as string
        };
        return adjuster;
    } catch (entityError: any) {
        if (entityError.statusCode === 404) {
            return null;
        }
        throw entityError;
    }
}

// Internal implementation: Assign a claim adjuster to a claim
async function assignClaimAdjusterImpl(claimId: string, adjusterId: string): Promise<{
    success: boolean;
    assignmentId?: string;
    adjusterName?: string;
    error?: string;
}> {
    if (!claimId || !adjusterId) {
        return {
            success: false,
            error: "Both claimId and adjusterId are required"
        };
    }

    // Verify adjuster exists
    const adjuster = await getClaimAdjusterByIdImpl(adjusterId);
    
    if (!adjuster) {
        return {
            success: false,
            error: `Claim adjuster with ID ${adjusterId} not found`
        };
    }

    // Generate fake assignment ID
    const currentYear = new Date().getFullYear();
    const randomNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const assignmentId = `ASS-${currentYear}-${randomNumber}`;

    return {
        success: true,
        assignmentId: assignmentId,
        adjusterName: `${adjuster.firstName} ${adjuster.lastName}`
    };
}
```

<cc-end-step lab="baf7" exercise="1" step="3" />

### Step 4: MCP ツールを登録する

`src/functions/ClaimsAdjusters.ts` の末尾に MCP ツール登録を追加します。

```typescript
// MCP Tool Handler: List claims adjusters with optional filters
async function handleListClaimsAdjusters(input: any, context: InvocationContext): Promise<ClaimAdjuster[] | { error: string }> {
    context.log(`MCP: Listing claims adjusters with filters`);

    try {
        const country = input.arguments["country"] || undefined;
        const area = input.arguments["area"] || undefined;

        const adjusters = await listClaimsAdjustersImpl(country, area);
        return adjusters;
    } catch (error) {
        context.log('Error fetching claim adjusters:', error);
        return { error: (error as Error).message };
    }
}

// MCP Tool Handler: Get claim adjuster by ID
async function handleGetClaimsAdjusterById(input: any, context: InvocationContext): Promise<ClaimAdjuster | { error: string }> {
    context.log(`MCP: Getting claim adjuster by ID`);

    try {
        const id = input.arguments["id"];

        if (!id) {
            return { error: "Claim adjuster ID is required" };
        }

        const adjuster = await getClaimAdjusterByIdImpl(id);

        if (!adjuster) {
            return { error: `Claim adjuster with ID ${id} not found` };
        }

        return adjuster;
    } catch (error) {
        context.log('Error fetching claim adjuster:', error);
        return { error: (error as Error).message };
    }
}

// MCP Tool Handler: Assign a claim adjuster to a claim
async function handleAssignClaimAdjuster(input: any, context: InvocationContext): Promise<{ success: boolean; assignmentId?: string; adjusterName?: string; error?: string }> {
    context.log(`MCP: Assigning claim adjuster to claim`);

    try {
        const claimId = input.arguments["claimId"];
        const adjusterId = input.arguments["adjusterId"];

        const result = await assignClaimAdjusterImpl(claimId, adjusterId);
        return result;
    } catch (error) {
        context.log('Error assigning claim adjuster:', error);
        return { success: false, error: (error as Error).message };
    }
}

// Register MCP tools
app.mcpTool("get_claims_adjusters", {
    toolName: "get_claims_adjusters",
    description: "Retrieve a list of all insurance claims adjusters",
    toolProperties: [
        {
            "propertyName": "country",
            "propertyType": "string",
            "description": "The country of the claim adjuster",
            "isRequired": false
        },
        {
            "propertyName": "area",
            "propertyType": "string",
            "description": "The area of expertise of the claim adjuster",
            "isRequired": false
        }
    ],
    handler: handleListClaimsAdjusters
});

app.mcpTool("get_claims_adjuster", {
    toolName: "get_claims_adjuster",
    description: "Retrieve a specific insurance claims adjuster by ID",
    toolProperties: [
        {
            "propertyName": "id",
            "propertyType": "string",
            "description": "The unique identifier of the claim adjuster",
            "isRequired": true
        }
    ],
    handler: handleGetClaimsAdjusterById
});

app.mcpTool("assign_claim_adjuster", {
    toolName: "assign_claim_adjuster",
    description: "Assign a claim adjuster to an insurance claim",
    toolProperties: [
        {
            "propertyName": "claimId",
            "propertyType": "string",
            "description": "The unique identifier of the claim",
            "isRequired": true
        },
        {
            "propertyName": "adjusterId",
            "propertyType": "string",
            "description": "The unique identifier of the claim adjuster to assign",
            "isRequired": true
        }
    ],
    handler: handleAssignClaimAdjuster
});
```

??? note "MCP ツール登録パターン"
    各 MCP ツールは `app.mcpTool()` を使用して登録します。
    
    - **toolName**: ツールを呼び出す際の識別子  
    - **description**: LLM がこのツールをいつ使用すべきかを理解するための説明  
    - **toolProperties**: 名前、型、説明、必須フラグを含む入力パラメーターの配列  
    - **handler**: ツール ロジックを実行する async 関数  

<cc-end-step lab="baf7" exercise="1" step="4" />

### Step 5: MCP サーバーをデプロイする

1️⃣ Azure で Azure Function App を作成します。

```bash
az functionapp create --name your-mcp-server --resource-group your-rg --consumption-plan-location eastus --runtime node --runtime-version 20 --functions-version 4 --storage-account your-storage
```

2️⃣ 関数をデプロイします。

```bash
func azure functionapp publish your-mcp-server
```

3️⃣ MCP サーバー エンドポイント URL を控えます (例: `https://your-mcp-server.azurewebsites.net/runtime/webhooks/mcp`)

??? info "開発トンネルでローカル MCP サーバーを公開"
    MCP サーバーを Azure へ発行せずローカルで実行したまま **Dev Tunnels** で公開 URL を作成できます。
    
    1️⃣ Azure Function をローカルで起動します。  
    ```bash
    func start
    ```
    
    2️⃣ 新しいターミナルで dev tunnel を作成・ホストします。  
    ```bash
    devtunnel create --allow-anonymous
    devtunnel port create -p 7071
    devtunnel host
    ```
    
    3️⃣ トンネル URL (例: `https://abc123.devtunnels.ms`) をコピーし、MCP サーバー エンドポイントを構成します。  
    ```text
    https://abc123.devtunnels.ms/runtime/webhooks/mcp
    ```
    
    デバッグとテストに便利です。`devtunnel host` コマンドを実行している限りトンネルは有効です。

<cc-end-step lab="baf7" exercise="1" step="5" />

## Exercise 2: エージェントで MCP クライアントを構成する

次に、Custom Engine エージェントを MCP サーバーへ接続できるよう設定します。

### Step 1: MCP クライアント構成を追加する

1️⃣ エージェント プロジェクトの `.env.local` ファイルを開きます。

2️⃣ MCP サーバー構成を追加します。

```bash
# MCP Server Configuration
MCP_SERVER_URL=https://your-mcp-server-url/runtime/webhooks/mcp
```

<cc-end-step lab="baf7" exercise="2" step="1" />

### Step 2: 依存性注入に MCP クライアントを登録する

1️⃣ ModelContextProtocol NuGet パッケージをインストールします。エージェント プロジェクト フォルダーでターミナルを開き、次を実行します。

```bash
dotnet add package ModelContextProtocol --version 0.4.1-preview.1
```

2️⃣ `src/Program.cs` を開きます。

3️⃣ ファイルの先頭に必要な using ステートメントを追加します。

```csharp
using ModelContextProtocol.Client;
using ModelContextProtocol.Protocol;
```

4️⃣ サービスが登録されている箇所を探し、MCP クライアント登録を追加します。

```csharp
// Register MCP Client for claims adjusters
builder.Services.AddSingleton<McpClient>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var mcpServerUrl = configuration["MCP_SERVER_URL"] 
        ?? throw new InvalidOperationException("MCP_SERVER_URL is not configured");

    var clientTransport = new HttpClientTransport(new HttpClientTransportOptions {
        Endpoint = new Uri(mcpServerUrl)});

    return McpClient.CreateAsync(clientTransport).GetAwaiter().GetResult();
});
```

<cc-end-step lab="baf7" exercise="2" step="2" />

## Exercise 3: ClaimsAdjustersPlugin を作成する

次に、MCP ツールを利用してクレーム アジャスターを管理するプラグインを作成します。

### Step 1: ClaimsAdjustersPlugin を作成する

??? note "このプラグインが行うこと"
    `ClaimsAdjustersPlugin` は主に 2 つの機能を提供します。
    
    **ListClaimsAdjustersAsync**:
    
    - クレーム種別と国でフィルターしたクレーム アジャスターを取得  
    - クレーム種別を検証 (「Auto」と「Homeowners」のみサポート)  
    - MCP サーバーの `get_claims_adjusters` ツールを呼び出す  
    
    **AssignClaimAdjusterAsync**:
    
    - 特定のアジャスターをクレームに割り当て  
    - 割り当て ID を含む確認結果を返す  
    - MCP サーバーの `assign_claim_adjuster` ツールを呼び出す  

1️⃣ `src/Plugins/ClaimsAdjustersPlugin.cs` ファイルを作成し、次の実装を追加します。

```csharp
using Microsoft.Agents.Builder;
using Microsoft.Agents.Core.Models;
using System.ComponentModel;
using System.Text.Json;
using InsuranceAgent;
using Microsoft.Agents.Builder.State;
using ModelContextProtocol.Client;

namespace ZavaInsurance.Plugins
{
    /// <summary>
    /// Claims Adjusters Plugin for Zava Insurance
    /// Provides tools for managing and retrieving claims adjuster information via MCP.
    /// </summary>
    public class ClaimsAdjustersPlugin
    {
        private readonly ITurnContext _turnContext;
        private readonly McpClient _mcpClient;
        private readonly IConfiguration _configuration;

        public ClaimsAdjustersPlugin(ITurnContext turnContext,
            McpClient mcpClient, 
            IConfiguration configuration)
        {
            _turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
            _mcpClient = mcpClient ?? throw new ArgumentNullException(nameof(mcpClient));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Retrieves claims adjusters based on claim type and country.
        /// </summary>
        /// <param name="claimType">The claim type to filter claims adjusters (Auto or Homeowners)</param>
        /// <param name="country">The country to filter claims adjusters</param>
        /// <returns>A list of claims adjusters matching the criteria</returns>
        [Description("Retrieves claims adjusters based on area and country")]
        public async Task<string> ListClaimsAdjustersAsync(string claimType, string country)
        {
            await NotifyUserAsync($"Retrieving claims adjusters for area {claimType} and country {country}...");

            // Validate claim type - only "Auto" and "Homeowners" are supported
            if (claimType != "Auto" && claimType != "Homeowners")
            {
                claimType = null;
            }

            // Validate country
            if (country == "All")
            {
                country = null;
            }

            var result = await _mcpClient.CallToolAsync("get_claims_adjusters", 
                new Dictionary<string, object?> {                 
                    ["area"] = claimType, 
                    ["country"] = country
                }
            );

            if (!result.IsError.HasValue || result.IsError.HasValue && !result.IsError.Value)
            {
                var adjusters = result.Content;
                return JsonSerializer.Serialize(adjusters, new JsonSerializerOptions { WriteIndented = true });
            }
            else
            {
                return $"Error retrieving claims adjusters!";
            }
        }

        /// <summary>
        /// Assigns a claims adjuster to a specific claim.
        /// </summary>
        /// <param name="claimId">The ID of the claim</param>
        /// <param name="adjusterId">The ID of the claims adjuster</param>
        /// <returns>Confirmation message of assignment</returns>
        [Description("Assigns a claims adjuster to a specific claim")]
        public async Task<string> AssignClaimAdjusterAsync(string claimId, string adjusterId)
        {
            await NotifyUserAsync($"Assigning claims adjuster {adjusterId} to claim {claimId}...");

            var result = await _mcpClient.CallToolAsync("assign_claim_adjuster", 
                new Dictionary<string, object?> {                 
                    ["claimId"] = claimId, 
                    ["adjusterId"] = adjusterId
                }
            );

            if (!result.IsError.HasValue || result.IsError.HasValue && !result.IsError.Value)
            {
                var adjusters = result.Content;
                return JsonSerializer.Serialize(adjusters, new JsonSerializerOptions { WriteIndented = true });
            }
            else
            {
                return $"Error assigning claims adjuster!";
            }
        }

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
}
```

<cc-end-step lab="baf7" exercise="3" step="1" />

## Exercise 4: エージェントに ClaimsAdjustersPlugin を登録する

ZavaInsuranceAgent に ClaimsAdjustersPlugin を組み込みます。

### Step 1: エージェント コンストラクターを更新する

1️⃣ `src/Agent/ZavaInsuranceAgent.cs` を開きます。

2️⃣ ファイル先頭に必要な using ステートメントを追加します。

```csharp
using ModelContextProtocol.Client;
```

3️⃣ クラス フィールド セクションを見つけ、MCP クライアント フィールドを追加します。

```csharp
private readonly McpClient _mcpClient = null;
```

4️⃣ コンストラクターを更新し、MCP クライアントを受け取って保持します。

```csharp
public ZavaInsuranceAgent(AgentApplicationOptions options, IChatClient chatClient, IConfiguration configuration, IServiceProvider serviceProvider, IHttpClientFactory httpClientFactory, McpClient mcpClient) : base(options)
{
    _chatClient = chatClient;
    _configuration = configuration;
    _serviceProvider = serviceProvider;
    _httpClient = httpClientFactory.CreateClient() ?? throw new ArgumentNullException(nameof(httpClientFactory));
    _mcpClient = mcpClient;

    // Greet when members are added to the conversation
    OnConversationUpdate(ConversationUpdateEvents.MembersAdded, WelcomeMessageAsync);

    // Listen for ANY message to be received
    OnActivity(ActivityTypes.Message, OnMessageAsync, autoSignInHandlers: [UserAuthorization.DefaultHandlerName]);
}
```

<cc-end-step lab="baf7" exercise="4" step="1" />

### Step 2: ClaimsAdjustersPlugin をインスタンス化する

1️⃣ `GetClientAgent` メソッド (他のプラグインをインスタンス化している箇所) を探します。

2️⃣ 他のプラグインの後に ClaimsAdjustersPlugin のインスタンス化を追加します。

```csharp
// Create ClaimsAdjustersPlugin with MCP client
ClaimsAdjustersPlugin claimsAdjustersPlugin = new(context, _mcpClient, _configuration);
```

<cc-end-step lab="baf7" exercise="4" step="2" />

### Step 3: ClaimsAdjusters ツールを登録する

同じ `GetClientAgent` メソッドで `toolOptions.Tools` にツールを追加している箇所を探し、クレーム アジャスター ツールを登録します。

```csharp
// Register Claims Adjusters MCP tools
toolOptions.Tools.Add(AIFunctionFactory.Create(claimsAdjustersPlugin.ListClaimsAdjustersAsync));
toolOptions.Tools.Add(AIFunctionFactory.Create(claimsAdjustersPlugin.AssignClaimAdjusterAsync));
```

<cc-end-step lab="baf7" exercise="4" step="3" />

### Step 4: エージェント インストラクションを更新する

エージェント インストラクションにクレーム アジャスターの機能を追加します。

1️⃣ `ZavaInsuranceAgent.cs` 内の `AgentInstructions` フィールドを探します。

2️⃣ クレーム アジャスター ツールをインストラクションに追加します。

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

        To list claim adjusters use {{ClaimsAdjustersPlugin.ListClaimsAdjusters}}. When listing claim adjusters:
        - Always try to use the country of the current claim, if any. Otherwise, if no country is specified by the user, set country value to 'All'.
        - Always try to use the claim type of the current claim, if any.
        - Always retrieve id, firstName, lastName, email, country, phone, and area for each claim adjuster.
        - Only "Auto" and "Homeowners" are valid claim types. If the user provides any other claim type, set area value to null.

        To assign a claim adjuster to a claim use {{ClaimsAdjustersPlugin.AssignClaimAdjuster}}.

        **IMPORTANT**: When user asks to "check policy for this claim", first use GetClaimDetails to get the claim's policy number, then use GetPolicyDetails with that policy number.

        **IMPORTANT**: If in the response there are references to citations like [1], [2], etc., make sure to include those citations in the response so that M365 Copilot can render them properly.

        Stick to the scenario above and use only the information from the tools when answering questions.
        Be concise and professional in your responses.
        """;
```

??? note "これらのインストラクションが重要な理由"
    インストラクションは LLM にクレーム アジャスター ツールの効果的な使用方法を伝えます。
    
    - **国の推定**: クレームの国情報がある場合はそれを使用  
    - **クレーム種別の検証**: 「Auto」と「Homeowners」のみ有効な専門分野  
    - **コンテキスト認識**: 既存のクレーム コンテキストを活用して関連するアジャスターを提供  

<cc-end-step lab="baf7" exercise="4" step="4" />

## Exercise 5: MCP ツール統合をテストする

いよいよ MCP ツール統合全体をテストします！

### Step 1: 実行と確認

1️⃣ MCP サーバーが実行中であることを確認します (ローカルまたは Azure にデプロイ)。

2️⃣ VS Code で **F5** を押してエージェントをデバッグ起動します。

3️⃣ プロンプトが表示されたら **(Preview) Debug in Copilot (Edge)** を選択します。

4️⃣ ターミナルに通常の初期化メッセージが表示されます。

5️⃣ ブラウザー ウィンドウが開き、Microsoft 365 Copilot が表示されます。

<cc-end-step lab="baf7" exercise="5" step="1" />

### Step 2: クレーム アジャスター一覧のテスト

1️⃣ Microsoft 365 Copilot で、まずクレームを取得してコンテキストを確立します。

```text
Get details for claim CLM-2025-001007
```

2️⃣ 次にアジャスターを問い合わせます。

```text
List available claims adjusters for this claim
```

エージェントは以下を行うはずです。

- クレームの種別 (Auto) と国を使用  
- `get_claims_adjusters` MCP ツールを呼び出す  
- 条件に一致するアジャスターの一覧を返す  

<cc-end-step lab="baf7" exercise="5" step="2" />

### Step 3: アジャスター割り当てのテスト

1️⃣ アジャスターの一覧を取得した後、次のように割り当てます。

```text
Assign adjuster ADJ-EE-0001 to this claim
```

エージェントは以下を行うはずです。

- `assign_claim_adjuster` MCP ツールを呼び出す  
- 割り当て ID を含む確認結果を返す  
- アジャスター名を確認する  

<cc-end-step lab="baf7" exercise="5" step="3" />

### Step 4: フィルター付きテスト

1️⃣ 直接フィルターを指定してテストします。

```text
Show me all Auto adjusters in the United States
```

エージェントは専門分野と国の両方でアジャスターをフィルターするはずです。

2️⃣ 「All」国を指定してテストします。

```text
List all Homeowners adjusters
```

エージェントは国に関係なく Homeowners アジャスターをすべて返すはずです。

<cc-end-step lab="baf7" exercise="5" step="4" />

!!! success "おめでとうございます！"
    MCP ツールを Custom Engine エージェントに統合できました。エージェントは次のことが可能になりました。
    
    ✅ 外部 MCP サーバーへの接続  
    ✅ 専門分野と国でフィルターしたクレーム アジャスターの一覧表示  
    ✅ アジャスターをクレームに割り当て、確認を取得  
    ✅ クレーム コンテキストを使用して関連するアジャスターを提案  
    
    このパターンは、任意の MCP 互換サービスと統合するために拡張できます。豊富なツール エコシステムを活用し、エージェントの機能をさらに向上させましょう。