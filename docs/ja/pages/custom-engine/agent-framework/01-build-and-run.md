---
search:
  exclude: true
---
# ラボ BAF1 - 最初のエージェントの構築と実行

このラボでは、 **Microsoft 365 Agents SDK** と **Agent Framework** を使用してカスタム エンジン エージェントを構築し、実行します。スターター プロジェクトを調査し、主要コンポーネントを理解し、Microsoft 365 Copilot 内でエージェントがどのように動作するかを確認します。

Zava Insurance エージェントは、保険査定担当者がクレーム処理を効率化するために設計されています。この最初のラボでは、ユーザーにあいさつし、AI による回答で情報を提供できる基本的な会話エージェントから始めます。

???+ info "Microsoft 365 Agents SDK と Agent Framework とは？"
    **Microsoft 365 Agents SDK** は、アクティビティ、イベント、通信を処理しながら、Microsoft 365 の各チャネル（Teams、Copilot など）にエージェントをデプロイするためのコンテナーとスキャフォールディングを提供します。AI 非依存で、任意の AI サービスを利用できます。  
      
    **Agent Framework** は、LLM、ツール呼び出し、マルチ エージェント ワークフローを用いて AI エージェントを構築するためのオープンソース開発キットです。Semantic Kernel と AutoGen の後継であり、AI 機能とエージェント ロジックを提供します。  
      
    これらを組み合わせることで、Agent Framework で知能エージェントを構築し、Agents SDK を使って Microsoft 365 にデプロイできます。

## Exercise 1: プロジェクトのクローンと調査

この演習では、Copilot Camp リポジトリをクローンし、スターター プロジェクト構造を調査してエージェントの構成を理解します。

### Step 1: リポジトリのクローン

まず Copilot Camp リポジトリをクローンし、Agent Framework スターター プロジェクトに移動しましょう。

1️⃣ ターミナルまたはコマンド プロンプトを開きます。

2️⃣ リポジトリをクローンします:

```bash
git clone https://github.com/microsoft/copilot-camp.git
cd copilot-camp/src/agent-framework/begin
```

3️⃣ Visual Studio Code でプロジェクトを開きます:

```bash
code .
```

<cc-end-step lab="baf1" exercise="1" step="1" />

### Step 2: プロジェクト構造の調査

エージェント プロジェクトの構成を理解しましょう。

1️⃣ Visual Studio Code のエクスプローラー ビューでフォルダーを展開します。次のような構造が表示されます:

```
begin/
├── src/
│   ├── Agent/
│   │   └── ZavaInsuranceAgent.cs       # Main agent implementation
│   ├── Plugins/                        # Custom plugins (tools) for the agent
│   │   ├── StartConversationPlugin.cs  # Welcome message plugin
│   │   └── DateTimeFunctionTool.cs     # Date/time utility
├── appPackage/                         # Teams app manifest and icons
├── env/                                # Environment configuration files (API keys, endpoints)
├── infra/                              # All required scripts, data and templates for the agent's infrastructure
├── Program.cs                          # Application entry point - configures services and starts web app
├── InsuranceAgent.csproj               # Project file
└── m365agents.local.yml                # M365 Agents provisioning config
```

<cc-end-step lab="baf1" exercise="1" step="2" />

### Step 3: エージェント実装の理解

メインのエージェント ファイルを確認して動作を理解しましょう。

1️⃣ `src/Agent/ZavaInsuranceAgent.cs` を Visual Studio Code で開きます。

2️⃣ クラス冒頭付近にある `AgentInstructions` プロパティを見つけます。これらの指示が AI モデルの **システムプロンプト** になっていることに注目してください:

- エージェントの役割を定義: "You are a professional insurance claims assistant for Zava Insurance..."
- `{{PluginName.FunctionName}}` 構文で利用可能なツールを列挙
- `{{StartConversationPlugin.StartConversation}}` と `{{DateTimeFunctionTool.getDate}}` を含む

これらの指示が、AI にどのように振る舞うか、どのツールを使用できるかを伝えます。

3️⃣ 下へスクロールし、 **コンストラクター** メソッド `ZavaInsuranceAgent(...)` を探します。イベント ハンドラーを設定している点に注目してください:

- `OnConversationUpdate(ConversationUpdateEvents.MembersAdded, WelcomeMessageAsync)` - ユーザーが参加したときに歓迎メッセージを送信
- `OnActivity(ActivityTypes.Message, OnMessageAsync)` - 受信メッセージを処理

4️⃣ `GetClientAgent` メソッドを見つけます。`toolOptions` を作成し、プラグインを登録している箇所を確認してください:

- `ChatOptions` オブジェクトを作成し、`Tools` リストを設定
- `startConversationPlugin.StartConversation` を `AIFunctionFactory.Create` で追加
- `DateTimeFunctionTool.getDate` も同様に追加

ここで、会話中に AI が呼び出せる **プラグイン**（ツール）を登録しています。

<cc-end-step lab="baf1" exercise="1" step="3" />

### Step 4: プラグインの調査

次にプラグインの仕組みを確認します。

1️⃣ `src/Plugins/StartConversationPlugin.cs` を開きます。

2️⃣ プラグインの構造を確認します:

```csharp
public class StartConversationPlugin
{
    [Description("Starts a new conversation suggesting a conversation flow.")]
    public async Task<string> StartConversation()
    {
        var welcomeMessage = "👋 Welcome to Zava Insurance Claims Assistant!...";
        return welcomeMessage;
    }
}
```

主なポイント:

- `[Description]` 属性が AI に **いつこのツールを使うか** を伝える
- メソッドがフォーマット済みの歓迎メッセージを返す
- パラメーターを持たないシンプルなプラグイン

3️⃣ `src/Plugins/DateTimeFunctionTool.cs` を開きます。

4️⃣ 現在の日付と時刻を提供する仕組みに注目します:

- `[Description]` で "Gets the current date and time" と説明
- `getDate()` メソッドは static で、`DateTime.Now` をフォーマットして返す

このプラグインにより、エージェントがシステム情報へアクセスしてユーザーの質問に回答できます。

<cc-end-step lab="baf1" exercise="1" step="4" />

### Step 5: アプリ マニフェストと会話スターターの確認

エージェントが Microsoft 365 Copilot にどのように表示されるか、アプリ マニフェストを確認しましょう。

1️⃣ `appPackage/manifest.json` を開きます。

2️⃣ `name` セクションでエージェントの表示名を確認します:

```json
"name": {
    "short": "Zava Insurance Agent",
    "full": "Zava Insurance Claims Assistant"
}
```

3️⃣ `conversationStarters` 配列へスクロールします。これは、ユーザーが最初にエージェントと対話するときに表示される提案プロンプトです:

```json
"conversationStarters": [
    {
        "title": "Instructions",
        "description": "What can you do?"
    },
    {
        "title": "Today's Date",
        "description": "What's today's date?"
    },
    {
        "title": "About Insurance",
        "description": "Tell me about insurance claims"
    },
    {
        "title": "Claims Process",
        "description": "Explain how claims processing works"
    }
]
```

これらの会話スターターは、ユーザーがエージェントとどのように対話すればよいかをガイドします。エージェントの機能に合わせてカスタマイズできます。

4️⃣ `copilotAgents.declarativeAgent` セクションでは、エージェントがカスタム エンジン エージェントとしてどのような機能を持つかを定義しています。

<cc-end-step lab="baf1" exercise="1" step="5" />

### Step 6: アプリケーション エントリ ポイントの確認

Program.cs で全体がどのようにまとめられているかを見てみましょう。

1️⃣ `Program.cs` を開きます。

2️⃣ 理解すべき主なセクション:

**構成の読み込み**: `builder.Configuration` が設定を読み込む箇所を探します。複数のソースから読み込んでいる点に注目:

- `AddEnvFile` で `.env` ファイル（環境別設定）
- `AddUserSecrets` でユーザー シークレット（API キーなど機密情報）
- `AddEnvironmentVariables` で環境変数

**サービス登録**: `builder.Services` でサービスを登録している箇所を確認:

- `AddSingleton<IStorage, MemoryStorage>()` - 会話状態用のメモリ ストレージを登録
- `AddAgentApplicationOptions()` - エージェント設定を登録
- `AddAgent<ZavaInsuranceAgent>()` - エージェント自体をサービスとして登録

**チャット クライアント設定**: `IChatClient` をシングルトンで登録している箇所を探します。次のような処理を行っています:

- エンドポイント、API キー、デプロイ名を構成から取得
- `AzureOpenAIClient` をエンドポイントと資格情報で作成
- 指定したデプロイ（gpt-4.1）のチャット クライアントを返却

これにより、エージェントの AI 機能を支える Azure OpenAI への接続が確立されます。

<cc-end-step lab="baf1" exercise="1" step="6" />

## Exercise 2: エージェントの構成

エージェントを実行する前に、Azure AI の資格情報を設定する必要があります。

### Step 1: 環境ファイルの設定

エージェントは環境ファイルで構成を保持します。設定しましょう。

1️⃣ Visual Studio Code で `env/` フォルダーに移動します。

2️⃣ 2 つのサンプル ファイルがあることを確認します:

- `.env.local.sample`
- `.env.local.user.sample`

3️⃣ `.env.local.sample` を `.env.local` にコピーします:

**Windows PowerShell:**
```powershell
Copy-Item env/.env.local.sample env/.env.local
```

**macOS/Linux:**
```bash
cp env/.env.local.sample env/.env.local
```

4️⃣ `.env.local.user.sample` を `.env.local.user` にコピーします:

**Windows PowerShell:**
```powershell
Copy-Item env/.env.local.user.sample env/.env.local.user
```

**macOS/Linux:**
```bash
cp env/.env.local.user.sample env/.env.local.user
```

<cc-end-step lab="baf1" exercise="2" step="1" />

### Step 2: Azure AI 資格情報の追加

次に、Microsoft Foundry デプロイメントを使用するようエージェントを構成します。

1️⃣ `env/.env.local` を Visual Studio Code で開きます。

2️⃣ `MODELS_ENDPOINT` 変数を見つけ、Lab BAF0 で取得した Azure AI エンドポイントに更新します:

```bash
MODELS_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
```

!!! tip "エンドポイントの確認方法"
    エンドポイントを忘れた場合:

    1. [Microsoft Foundry](https://ai.azure.com) にアクセス  
    2. プロジェクトを選択  
    3. **Settings** → **Properties** を選択  
    4. **Endpoint** URL をコピー

3️⃣ `env/.env.local.user` を Visual Studio Code で開きます。

4️⃣ `SECRET_MODELS_API_KEY` 変数を見つけ、API キーに更新します:

```bash
SECRET_MODELS_API_KEY=your-api-key-here
```

!!! warning "API キーを秘密に保つ"
    `.env.local.user` は機密情報を含み、すでに `.gitignore` に含まれています。このファイルをソース管理にコミットしないでください。

<cc-end-step lab="baf1" exercise="2" step="2" />

### Step 3: Microsoft 365 と Azure へのサインイン

Microsoft 365 Agents Toolkit は、Microsoft 365 と Azure の両方への認証が必要です。

1️⃣ Visual Studio Code のアクティビティ バー（左側）で **Microsoft 365 Agents Toolkit** アイコンをクリックします。

2️⃣ ツールキット パネルの **ACCOUNTS** セクションを確認します。

3️⃣ **Sign in to Microsoft 365** をクリックし、サインイン フローを完了します。

4️⃣ **Sign in to Azure** をクリックし、サインイン フローを完了します。

!!! note "初回サインイン"
    初めてサインインする場合、Microsoft 365 Agents Toolkit 拡張機能に権限を付与する必要があります。

<cc-end-step lab="baf1" exercise="2" step="3" />

## Exercise 3: エージェントの実行とテスト

それでは、エージェントを実行して動作を確認しましょう！

### Step 1: エージェントの起動

F5 デバッグ体験を使ってエージェントを実行します。

1️⃣ Visual Studio Code で **F5** を押すか、メニューから **Run → Start Debugging** を選択します。

2️⃣ デバッグ ターゲットの選択を求められたら **(Preview) Debug in Copilot (Edge)** を選択します。

!!! tip "デバッグ ターゲットのオプション"
    "Debug in Teams (Edge)" や "Debug in Teams (Chrome)" など複数のオプションが表示される場合があります。Microsoft 365 Copilot でテストするには **(Preview) Debug in Copilot (Edge)** を選択してください。

3️⃣ 初回実行時、Microsoft 365 Agents Toolkit は次の操作を行います:

- **Azure subscription** の選択
- 新しい **resource group** の作成または既存グループの選択
- リソースの **region** の選択（Microsoft Foundry プロジェクトに近いリージョン）
- Azure リソースのプロビジョニング（Azure Bot Service、App Registration）

このプロビジョニングは通常 2～3 分で完了します。

!!! tip "Azure リソースのプロビジョニング"
    初回実行時にツールキットが作成するもの:

    - **Azure Bot Service** ‑ メッセージ ルーティングを処理
    - **App Registration** ‑ 認証を管理
    - **Dev Tunnel** ‑ ローカル マシンへの安全なトンネルを作成

4️⃣ Visual Studio Code の **Terminal** 出力を確認します。次のような表示が出るはずです:

```
🌍 Environment: local
🏢 Starting Zava Insurance Agent...
🤖 Main agent using model: gpt-4.1
✅ Agent initialized successfully!
```

5️⃣ ブラウザー ウィンドウで Microsoft 365 Copilot が開きます。

6️⃣ Zava Insurance エージェントの **インストール ダイアログ** が表示されるので **Add** をクリックします。

7️⃣ インストール後、 **Open in Copilot** または **Chat** をクリックします。

<cc-end-step lab="baf1" exercise="3" step="1" />

### Step 2: 基本的な会話のテスト

エージェントと対話してみましょう！

1️⃣ Microsoft 365 Copilot で、チャット ウィンドウに会話スターターが表示されます。

![Conversation starters in Microsoft 365 Copilot](../../../assets/images/agent-framework/BAF1-test1.png)

2️⃣ "What can you do?" を選択して歓迎メッセージを確認します:

![Conversation starters in Microsoft 365 Copilot](../../../assets/images/agent-framework/BAF1-test2.png)

3️⃣ **"What's today's date?"** と質問してみてください。

エージェントは `DateTimeFunctionTool` を呼び出し、現在の日付と時刻を返します。

4️⃣ **"What can you do?"** または **"Start over"** と入力します。

エージェントは `StartConversationPlugin` を呼び出し、再度歓迎メッセージを表示します。

5️⃣ 一般的な質問: **"Tell me about insurance claims"** を試してください。

エージェントは AI の知識を活用して、保険クレームについて説明します。

6️⃣ 範囲外の質問: **"What's the weather today?"** を試してください。

エージェントは保険アシスタントの範囲外であることを丁寧に伝えるはずです。

<cc-end-step lab="baf1" exercise="3" step="2" />

### Step 3: デバッグ出力の確認

1️⃣ Visual Studio Code に戻り、 **Debug Console** を確認します。

2️⃣ プラグイン呼び出し、AI 応答、メッセージ処理がリアルタイムで表示されることを確認します。

<cc-end-step lab="baf1" exercise="3" step="3" />

## Exercise 4: エージェントのカスタマイズ

簡単な変更を行い、エージェントをパーソナライズしてみましょう。

### Step 1: 歓迎メッセージの更新

1️⃣ デバッガーを停止します（Shift+F5）。

2️⃣ `src/Plugins/StartConversationPlugin.cs` を開き、`welcomeMessage` 変数を探します。

3️⃣ 最初の行にあなたの名前を追加します: `"👋 Welcome! I'm [Your Name]'s Agent!\n\n"`

4️⃣ 保存し、 **F5** を押して再起動し、Copilot で **"start over"** と入力して変更を確認します。

<cc-end-step lab="baf1" exercise="4" step="1" />

---8<--- "ja/b-congratulations.md"

ラボ BAF1 - 最初のエージェントの構築と実行を完了しました！

次のことを学習しました:

- ✅ Agent Framework プロジェクトのクローンと調査  
- ✅ Azure AI 資格情報でエージェントを構成  
- ✅ エージェントをローカルで実行・デバッグ  
- ✅ Microsoft 365 Copilot でエージェントをテスト  
- ✅ 主要コンポーネント（エージェント、プラグイン、インストラクション）の理解  
- ✅ 動作をカスタマイズする簡単な変更

次のラボでは、Azure AI Search と gpt-4.1 を統合し、ドキュメント検索によるより強力な機能を追加します！

<cc-next url="../02-add-claim-search" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/01-build-and-run--ja" />