---
search:
  exclude: true
---
# ラボ BMA3 - Microsoft Foundry エージェントを M365 Agents SDK と統合

このラボでは、Microsoft Foundry エージェントによる生成 AI のパワーと Microsoft 365 Agents SDK のマルチチャネル柔軟性を組み合わせ、ベストな両世界を実現します。Semantic Kernel を構成し、エージェントのプロパティを設定し、Foundry でホストされているエージェントへ安全に接続して、エンタープライズ対応の豊富な回答を Microsoft Teams に直接提供できるようにします。

## Exercise 1: エージェント プロパティの構成と Teams でのテスト

基本的なボットを作成したので、生成 AI 機能を追加して AI エージェントへアップグレードしましょう。この演習では、Semantic Kernel などの主要ライブラリをインストールし、Teams や Copilot Chat でより高度に推論・応答できるようにエージェントを準備します。

### Step 1: Semantic Kernel Nuget パッケージを追加

このステップで追加するパッケージは Azure AI 連携をサポートします。**ContosoHRAgent** プロジェクトを右クリックし、**Manage Nuget Packages...** を選択して **Browse** タブを開き、`Microsoft.SemanticKernel.Agents.AzureAI` を検索します。**Include prerelease** チェックボックスにチェックを入れ、パッケージを選択して **Install** をクリックします。

![Semantic Kernel Nuget Package](https://github.com/user-attachments/assets/37a290f4-e825-4140-a294-b1a8d9e1f10a)

<cc-end-step lab="bma3" exercise="1" step="1" />

### Step 2: Program.cs に Semantic Kernel を追加

**Program.cs** を開き、次のコード スニペットを `var app = builder.Build();` の直前に追加します。

```
builder.Services.AddKernel();
```

これにより、生成 AI モデルと連携するためのコア コンポーネントである Semantic Kernel が登録されます。

<cc-end-step lab="bma3" exercise="1" step="2" />

### Step 3: ドキュメント引用とメッセージ トラッキング用のカスタム クラスを追加

**ContosoHRAgent** プロジェクトを右クリックし、**Add > Class** を選択してクラス名を `FileReference.cs` に設定します。既存コードを以下に置き換えてください。

> このクラスは、応答内で特定ドキュメントを参照する際の構造を定義します。アップロードされたファイルの内容を引用するときに役立ちます。

```
using Microsoft.Agents.Core.Models;
  
namespace ContosoHRAgent
{
    public class FileReference(string fileId, string fileName, string quote, Citation citation)
    {
        public string FileId { get; set; } = fileId;
        public string FileName { get; set; } = fileName;
        public string Quote { get; set; } = quote;
        public Citation Citation { get; set; } = citation;
    }
}
```

再度 **ContosoHRAgent** プロジェクトを右クリックし、**Add > Class** を選択してクラス名を `ConversationStateExtensions.cs` に設定します。既存コードを以下に置き換えてください。

> このクラスは、ユーザー メッセージ数を管理・追跡するヘルパー メソッドを追加し、進行中の会話で状態がどのように保存・変更されるかを示します。

```
using Microsoft.Agents.Builder.State;
  
namespace ContosoHRAgent
{
 public static class ConversationStateExtensions
 {
     public static int MessageCount(this ConversationState state) => state.GetValue<int>("countKey");

     public static void MessageCount(this ConversationState state, int value) => state.SetValue("countKey", value);

     public static int IncrementMessageCount(this ConversationState state)
     {
         int count = state.GetValue<int>("countKey");
         state.SetValue("countKey", ++count);
         return count;
     }

     public static string ThreadId(this ConversationState state) => state.GetValue<string>("threadId");

     public static void ThreadId(this ConversationState state, string value) => state.SetValue("threadId", value);
 }
}
```

<cc-end-step lab="bma3" exercise="1" step="3" />

## Exercise 2: Microsoft Foundry エージェントを M365 Agents SDK と統合

M365 Agents SDK を使ってエージェントを構築し、生成 AI 機能を設定しました。ここでは、このローカル エージェントを先ほど作成した Microsoft Foundry エージェントに接続します。これにより、Foundry プロジェクトに保存されたエンタープライズ データや指示を用いて応答できるようになり、すべてが一つにまとまります。

### Step 1: EchoBot.cs を構成して Microsoft Foundry エージェントに接続

このステップでは、Foundry でホストされているモデルを取得・呼び出すクライアントを追加し、EchoBot.cs 内で Microsoft Foundry エージェントに接続します。

**ContosoHRAgent** プロジェクトの **Bot/EchoBot.cs** を開き、EchoBot パブリック クラス内に以下を追加します。

```
private readonly PersistentAgentsClient _projectClient;
private readonly string _agentId;
```

既存の EchoBot コンストラクターを次のコードに置き換えます。

```
public EchoBot(AgentApplicationOptions options, IConfiguration configuration) : base(options)
{

    OnConversationUpdate(ConversationUpdateEvents.MembersAdded, WelcomeMessageAsync);

    // Listen for ANY message to be received. MUST BE AFTER ANY OTHER MESSAGE HANDLERS 
    OnActivity(ActivityTypes.Message, OnMessageAsync);

    // Microsoft Foundry Project ConnectionString
    string projectEndpoint = configuration["AIServices:ProjectEndpoint"];
    if (string.IsNullOrEmpty(projectEndpoint))
    {
        throw new InvalidOperationException("ProjectEndpoint is not configured.");
    }
    _projectClient = new PersistentAgentsClient(projectEndpoint, new AzureCliCredential());

    // Microsoft Foundry Agent Id
    _agentId = configuration["AIServices:AgentID"];
    if (string.IsNullOrEmpty(_agentId))
    {
        throw new InvalidOperationException("AgentID is not configured.");
    }

}
```

**OnMessageAsync** メソッドを次のコードに置き換えます。

```
protected async Task OnMessageAsync(ITurnContext turnContext, ITurnState turnState, CancellationToken cancellationToken)
{
    // send the initial message to the user
    await turnContext.StreamingResponse.QueueInformativeUpdateAsync("Working on it...", cancellationToken);

    // get the agent definition from the project
    var agentDefinition = await _projectClient.Administration.GetAgentAsync(_agentId, cancellationToken);

    // initialize a new agent instance from the agent definition
    var agent = new AzureAIAgent(agentDefinition, _projectClient);

    // retrieve the threadId from the conversation state
    // this is set if the agent has been invoked before in the same conversation
    var threadId = turnState.Conversation.ThreadId();

    // if the threadId is not set, we create a new thread
    // otherwise, we use the existing thread
    var thread = string.IsNullOrEmpty(threadId)
        ? new AzureAIAgentThread(_projectClient)
        : new AzureAIAgentThread(_projectClient, threadId);

    try
    {
        // increment the message count in state and queue the count to the user
        int count = turnState.Conversation.IncrementMessageCount();
        turnContext.StreamingResponse.QueueTextChunk($"({count}) ");

        // create the user message to send to the agent
        var message = new ChatMessageContent(AuthorRole.User, turnContext.Activity.Text);

        // invoke the agent and stream the responses to the user
        await foreach (AgentResponseItem<StreamingChatMessageContent> agentResponse in agent.InvokeStreamingAsync(message, thread, cancellationToken: cancellationToken))
        {
            // if the threadId is not set, we set it from the agent response
            // and store it in the conversation state for future use
            if (string.IsNullOrEmpty(threadId))
            {
                threadId = agentResponse.Thread.Id;
                turnState.Conversation.ThreadId(threadId);
            }

            turnContext.StreamingResponse.QueueTextChunk(agentResponse.Message.Content);
        }
    }
    finally
    {
        // ensure we end the streaming response
        await turnContext.StreamingResponse.EndStreamAsync(cancellationToken);
    }
}

```

> **⚠️ 注意:** 次のコードを貼り付けると、機能がプレビュー段階のため警告 (SKEXP0110) が表示される場合があります。今は安全に無視できるので、AzureAIAgent を右クリックし **Quick Actions and Refactorings > Suppress or configure issues > Configure SKEXP0110 Severity > Silent** で警告を抑制してください。  
> 
> ![The Warning provided by Visual Studio when pasting code about a preview feature. There is the SKEXP0110 warning highlighted and the commands to silent related notifications.](https://github.com/user-attachments/assets/ac33b725-ede5-4b70-8186-72d393f1e169)


???+ info "OnMessageAsync で何が起こるか?"
    *OnMessageAsync* メソッドはエージェント応答ロジックの中心です。既定のエコー動作を置き換えることで、ユーザー メッセージを Microsoft Foundry エージェントへ送信し、リアルタイムでストリーミング応答を返し、引用やファイル参照を添付して透明性を確保し、機密度や AI 生成ラベルを追加してセキュリティと追跡性を向上させます。

<cc-end-step lab="bma3" exercise="2" step="1" />

### Step 2: Azure AI Agent Service キーを構成

Foundry 接続情報を appsettings.json に追加します。これらの値により、M365 エージェントが正しい Foundry プロジェクトとエージェントへ接続します。**ContosoHRAgent** プロジェクトの **appsettings.json** を開き、appsettings リストの最後に以下を追加します。

```
,
  "AIServices": {
   "AgentID": "<AzureAIFoundryAgentId>",
   "ProjectEndpoint": "<ProjectEndpoint>"
  }
```

> これらの値は Microsoft Foundry の **Overview** と **Agents Playground** セクションで確認できます。

**<AzureAIFoundryAgentId>** を **Agents Playground** に表示される **Agent id** に置き換えます。

![The Agents Playground of Microsoft Foundry with the Agent id field highlighted.](https://github.com/user-attachments/assets/13421287-d476-41c4-88df-bed1bff2f2f8)

**<ProjectEndpoint>** を AI Foundry の **Overview** ページの Endpoints and keys に表示されるプロジェクト エンドポイントに置き換えます。

最終的な **appsettings.json** は次のようになります。

```
{
  "AgentApplicationOptions": {
    "StartTypingTimer": false,
    "RemoveRecipientMention": false,
    "NormalizeMentions": false
  },
  
  "TokenValidation": {
    "Audiences": [
      "{{ClientId}}" // this is the Client ID used for the Azure Bot
    ]
  },
  
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.Agents": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*",
  "Connections": {
    "BotServiceConnection": {
      "Settings": {
        "AuthType": "UserManagedIdentity", // this is the AuthType for the connection, valid values can be found in Microsoft.Agents.Authentication.Msal.Model.AuthTypes.
        "ClientId": "{{BOT_ID}}", // this is the Client ID used for the connection.
        "TenantId": "{{BOT_TENANT_ID}}",
        "Scopes": [
          "https://api.botframework.com/.default"
        ]
      }
    }
  },
  "ConnectionsMap": [
    {
      "ServiceUrl": "*",
      "Connection": "BotServiceConnection"
    }
  ],
  "AIServices": {
   "AgentID": "<AzureAIFoundryAgentId>",
   "ProjectEndpoint": "<ProjectEndpoint>"
  }
}
```

<cc-end-step lab="bma3" exercise="2" step="2" />

### Step 3: Teams でエージェントをテスト

**Tools > Command Line > Developer Command Prompt** を開き、次を実行します。

```
az login
```

ブラウザー ウィンドウが開いたら、Microsoft アカウントでサインインし、`az login` を完了します。

**Start** を展開し **Dev Tunnels > Create a Tunnel** を選択します。
 
* **Sign in** を選び、**Work or school account** を選択します。上記と同じ資格情報でログインしてください。
* トンネル名に `DevTunnel` などを入力します。
* Tunnel Type は **Temporary** のままにします。
* Access を **Public** にして **Create** を選択します。

![The UI of Visual Studio to create a Dev Tunnel for the agent. There is a "Create a Tunnel" command highlighted.](https://github.com/user-attachments/assets/146fb3d4-256d-48b3-95a1-9e285f6bbc08)

**M365Agent** プロジェクトを右クリックし、**Microsoft 365 Agents Toolkit > Select Microsoft 365 Account** を選択します。

![The context menu of the the M365 Agents Toolkit when selecting the Microsoft 365 Account to use, highlighted in the screenshot.](https://github.com/user-attachments/assets/6981343d-8668-4b33-b36f-63b12739fc9d)

同じアカウントを選択して **Continue** をクリックします。アカウントが自動表示されない場合は **Sign in > Work or school account** を選択してください。
  
Visual Studio 上部のスタートアップ項目を展開し、既定では **<Multiple Startup Projects>** になっている部分を **Microsoft Teams (browser)** に変更します。

![The UI of Visual Studio when configuring Microsoft Teams (browser) for testing the agent in debug mode.](https://github.com/user-attachments/assets/0f564f0a-0394-49de-a679-6be59761b4fb)

これで統合エージェントを実行し、Microsoft Teams でライブ テストする準備が整いました。Dev Tunnel が作成され、アカウントが認証されていることを確認してください。

Dev Tunnel が作成できたら **Start** または **F5** を押してデバッグを開始します。Microsoft Teams が自動起動し、エージェント アプリが表示されます。**Add** と **Open** を選択してエージェントとのチャットを開始します。  

次の質問例を使ってエージェントと対話できます。

* Northwind Standard と Health Plus の緊急およびメンタルヘルス補償の違いは何ですか?
* PerksPlus を使ってロッククライミング クラスとオンライン フィットネス プログラムの両方を支払えますか?
* Contoso Electronics の行動と意思決定を導く価値観は何ですか?

Microsoft Foundry で作成したエージェントと同様の応答が得られるはずです。

![The Agent running in Microsoft Teams with evidence of the counter to count the number of interactions with the user.](https://github.com/user-attachments/assets/73ef491f-eaff-4743-bb2d-79a52a9ae301)

<cc-end-step lab="bma3" exercise="2" step="3" />

---8<--- "ja/b-congratulations.md"

これで ラボ BMA3 - Microsoft Foundry エージェントを M365 Agents SDK と統合 を完了しました!

次は ラボ BMA4 - エージェントを Copilot Chat へ展開 へ進みましょう。Next を選択してください。

<cc-next url="../04-bring-agent-to-copilot" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/03-agent-configuration--ja" />