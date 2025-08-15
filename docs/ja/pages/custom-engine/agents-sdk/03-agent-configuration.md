---
search:
  exclude: true
---
# ラボ BMA3 - Azure AI Foundry エージェント と M365 Agents SDK の統合

このラボでは、2 つの世界の長所を融合します。Azure AI Foundry エージェントの生成 AI パワーと Microsoft 365 Agents SDK のマルチチャネル柔軟性を組み合わせます。Semantic Kernel を構成し、エージェント プロパティを設定し、Foundry でホストされているエージェントへ安全に接続して、エンタープライズ対応のリッチな回答を Microsoft Teams に直接配信できるようにします。

## Exercise 1 : エージェント プロパティを構成して Teams でテストする

基本的なボットを作成したら、生成 AI 機能で強化し、AI エージェントへアップグレードしましょう。この演習では、Semantic Kernel などの主要ライブラリをインストールし、よりインテリジェントに推論して応答できるようにエージェントを準備し、Teams や Copilot Chat に備えます。

### Step 1 : Semantic Kernel Nuget Package を追加する

このステップで追加するパッケージは Azure AI 連携をサポートします。**ContosoHRAgent** プロジェクトを右クリックし、**Manage Nuget Packages...** を選択します。**Browse** タブで `Microsoft.SemanticKernel.Agents.AzureAI` を検索し、**Include prerelease** チェックボックスをオンにします。パッケージを選択して **Install** をクリックします。

![Semantic Kernel Nuget Package](https://github.com/user-attachments/assets/37a290f4-e825-4140-a294-b1a8d9e1f10a)

<cc-end-step lab="bma3" exercise="1" step="1" />

### Step 2 : Program.cs に Semantic Kernel を追加する

**Program.cs** を開き、次のコード スニペットを `var app = builder.Build();` の直前に追加します。

```
builder.Services.AddKernel();
```

これにより、生成 AI モデルと対話するための中核コンポーネントである Semantic Kernel が登録されます。

<cc-end-step lab="bma3" exercise="1" step="2" />

### Step 3 : ドキュメント引用とメッセージ追跡用のカスタム クラスを追加する

**ContosoHRAgent** プロジェクトを右クリックし、**Add > Class** を選択してクラス名を `FileReference.cs` に指定します。既存のコードを次の内容に置き換えます。

> このクラスは、アップロードしたファイルから引用した内容を応答で示すときに使用されるドキュメント参照の構造を定義します。

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

同様に **ContosoHRAgent** プロジェクトを右クリックし、**Add > Class** を選択してクラス名を `ConversationStateExtensions.cs` に指定します。既存のコードを次の内容に置き換えます。

> このクラスは、進行中の会話で状態を保存・変更しながらユーザー メッセージ数を管理・追跡するためのヘルパー メソッドを追加します。

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

## Exercise 2 : Azure AI Foundry エージェント を M365 Agents SDK と統合する

M365 Agents SDK を使用してエージェントを構築し、生成 AI 機能を構成しました。次に、このローカル エージェントを先ほど作成した Azure AI Foundry エージェントへ接続します。これにより、Foundry プロジェクトに保存されているエンタープライズ データと指示を用いて応答できるようになり、すべてが一つにつながります。

### Step 1 : EchoBot.cs を構成して Azure AI Foundry エージェント に接続する

このステップでは、EchoBot.cs 内で Foundry ホストのモデルを取得して呼び出すクライアントを追加し、Azure AI Foundry エージェントへ接続します。

**ContosoHRAgent** プロジェクトで **Bot/EchoBot.cs** を開き、EchoBot 公開クラス内に次の行を追加します。

```
private readonly PersistentAgentsClient _projectClient;
private readonly string _agentId;
```

既存の EchoBot コンストラクターを次の内容に置き換えます。

```
public EchoBot(AgentApplicationOptions options, IConfiguration configuration) : base(options)
{

    OnConversationUpdate(ConversationUpdateEvents.MembersAdded, WelcomeMessageAsync);

    // Listen for ANY message to be received. MUST BE AFTER ANY OTHER MESSAGE HANDLERS 
    OnActivity(ActivityTypes.Message, OnMessageAsync);

    // Azure AI Foundry Project ConnectionString
    string projectEndpoint = configuration["AIServices:ProjectEndpoint"];
    if (string.IsNullOrEmpty(projectEndpoint))
    {
        throw new InvalidOperationException("ProjectEndpoint is not configured.");
    }
    _projectClient = new PersistentAgentsClient(projectEndpoint, new AzureCliCredential());

    // Azure AI Foundry Agent Id
    _agentId = configuration["AIServices:AgentID"];
    if (string.IsNullOrEmpty(_agentId))
    {
        throw new InvalidOperationException("AgentID is not configured.");
    }

}
```

**OnMessageAsync** メソッドを次の内容に置き換えます。

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

> **⚠️ 注意:** 次のコードを貼り付けると、この機能がプレビュー段階のため警告 (SKEXP0110) が表示される場合があります。**AzureAIAgent** を右クリックし、**Quick Actions and Refactorings > Suppress or configure issues > Configure SKEXP0110 Severity > Silent** を選択して、一時的に警告を抑制できます。
> 
> ![The Warning provided by Visual Studio when pasting code about a preview feature. There is the SKEXP0110 warning highlighted and the commands to silent related notifications.](https://github.com/user-attachments/assets/ac33b725-ede5-4b70-8186-72d393f1e169)

???+ info "OnMessageAsync で何が起こるのか?"
    *OnMessageAsync* メソッドはエージェント応答ロジックの心臓部です。既定のエコー動作を置き換えることで、ユーザーのメッセージを Azure AI Foundry エージェントへ送信し、応答をリアルタイムにストリーミング返却し、透明性のために引用とファイル参照を追跡・添付し、セキュリティと追跡性のために感度ラベルと AI 生成ラベルを追加できるようになりました。

<cc-end-step lab="bma3" exercise="2" step="1" />

### Step 2 : Azure AI Agent サービス キーを構成する

Foundry 接続情報を appsettings.json に追加します。これらの値によって、M365 エージェントが正しい Foundry プロジェクトとエージェントへ接続します。**ContosoHRAgent** プロジェクトで **appsettings.json** を開き、appsettings リストの末尾に次の行を追加します。

```
,
  "AIServices": {
   "AgentID": "<AzureAIFoundryAgentId>",
   "ProjectEndpoint": "<ProjectEndpoint>"
  }
```

> これらの値は Azure AI Foundry の **Overview** セクションと **Agents Playground** セクションで確認できます。

**<AzureAIFoundryAgentId>** を **Agents Playground** で確認できる **Agent id** に置き換えます。

![The Agents Playground of Azure AI Foundry with the Agent id field highlighted.](https://github.com/user-attachments/assets/13421287-d476-41c4-88df-bed1bff2f2f8)

**<ProjectEndpoint>** を AI Foundry の **Overview** ページ (Endpoints and keys) で確認できるプロジェクト エンドポイントに置き換えます。

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

### Step 3 : Teams でエージェントをテストする

**Tools > Command Line > Developer Command Prompt** を開き、次を実行します。

```
az login
```

ブラウザー ウィンドウが開き、Microsoft アカウントでサインインして `az login` を完了する必要があります。

**Start** を展開し、**Dev Tunnels > Create a Tunnel** を選択します。
 
* **Sign in** と **Work or school account** を選択します。上記と同じ資格情報でログインしてください。
* トンネル名に `DevTunnel` などを指定します。
* Tunnel Type は **Temporary** のままにします。
* Access は **Public** を選択し、**Create** をクリックします。

![The UI of Visual Studio to create a Dev Tunnel for the agent. There is a "Create a Tunnel" command highlighted.](https://github.com/user-attachments/assets/146fb3d4-256d-48b3-95a1-9e285f6bbc08)

**M365Agent** プロジェクトを右クリックし、**Microsoft 365 Agents Toolkit > Select Microsoft 365 Account** を選択します。

![The context menu of the the M365 Agents Toolkit when selecting the Microsoft 365 Account to use, highlighted in the screenshot.](https://github.com/user-attachments/assets/6981343d-8668-4b33-b36f-63b12739fc9d)

同じアカウントを選択して **Continue** をクリックします。自動表示されない場合は **Sign in** と **Work or school account** を選択してください。
  
Visual Studio 上部のスタートアップ項目を展開し、既定の **<Multiple Startup Projects>** から **Microsoft Teams (browser)** を選択します。

![The UI of Visual Studio when configuring Microsoft Teams (browser) for testing the agent in debug mode.](https://github.com/user-attachments/assets/0f564f0a-0394-49de-a679-6be59761b4fb)

これで、統合エージェントを起動し Microsoft Teams でライブ テストする準備が整いました。Dev Tunnel が作成され、アカウントが認証されていることを確認してください。

Dev Tunnel が作成されたら **Start** もしくは **F5** を押してデバッグを開始します。Microsoft Teams が自動的に起動し、エージェント アプリがウィンドウに表示されます。**Add** と **Open** を選択してエージェントとのチャットを開始します。  

次のような質問をしてエージェントと対話してみてください。

* Northwind Standard と Health Plus の緊急時およびメンタルヘルス補償の違いは何ですか?
* PerksPlus でロッククライミング クラスとバーチャル フィットネス プログラムの両方を支払えますか?
* Contoso Electronics で行動と意思決定を導く価値観は何ですか?

Azure AI Foundry で作成したエージェントと同様の応答が得られるはずです。

![The Agent running in Microsoft Teams with evidence of the counter to count the number of interactions with the user.](https://github.com/user-attachments/assets/73ef491f-eaff-4743-bb2d-79a52a9ae301)

<cc-end-step lab="bma3" exercise="2" step="3" />

---8<--- "ja/b-congratulations.md"

ラボ BMA3 - Azure AI Foundry エージェント と M365 Agents SDK の統合 を完了しました!

次のラボ BMA4 - エージェントを Copilot Chat へ展開 に進む準備ができました。[Next] を選択してください。

<cc-next url="../04-bring-agent-to-copilot" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/03-agent-configuration--ja" />