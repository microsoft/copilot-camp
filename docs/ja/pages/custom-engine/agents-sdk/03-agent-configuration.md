---
search:
  exclude: true
---
# ラボ BMA3 - Azure AI Foundry エージェントと M365 Agents SDK の統合

このラボでは、Azure AI Foundry エージェントの生成 AI パワーと Microsoft 365 Agents SDK のマルチチャネル柔軟性を融合させ、両方の長所を活かします。Semantic Kernel を構成し、エージェントのプロパティを設定し、Foundry でホストされているエージェントへ安全に接続して、エンタープライズに精通したリッチな回答を Microsoft Teams に直接届けます。

## 演習 1: エージェントのプロパティを構成して Teams でテスト

基本的なボットを作成したので、生成 AI 機能を追加して AI エージェントへアップグレードします。この演習では、Semantic Kernel などの主要ライブラリをインストールし、エージェントが Teams や Copilot Chat でより知的に推論・応答できるよう準備します。

### Step 1: 新しいパッケージで Project ファイルを更新

このステップで追加するパッケージは Azure AI との統合をサポートします。**ContosoHRAgent** プロジェクトを右クリックし **Edit Project File** を選択し、**PackageReference** を含む ItemGroup を次の内容に置き換えます。

```
  <ItemGroup>
    <PackageReference Include="Microsoft.Agents.Authentication.Msal" Version="1.1.91-beta" />
    <PackageReference Include="Microsoft.Agents.Hosting.AspNetCore" Version="1.1.91-beta" />
    <PackageReference Include="Microsoft.SemanticKernel.Agents.AzureAI" Version="1.52.1-preview" />
  </ItemGroup>
```

<cc-end-step lab="bma3" exercise="1" step="1" />

### Step 2: Program.cs に Semantic Kernel を追加

**Program.cs** を開き、`var app = builder.Build();` の直前に次のコード スニペットを追加します。

```
builder.Services.AddKernel();
```

これにより Semantic Kernel が登録されます。これは、エージェントが生成 AI モデルと対話するための中核コンポーネントです。

<cc-end-step lab="bma3" exercise="1" step="2" />

### Step 3: ドキュメント引用とメッセージ追跡用のカスタム クラスを追加

**ContosoHRAgent** プロジェクトを右クリックし **Add > Class** を選択し、クラス名を `FileReference.cs` として定義します。既存のコードを次の内容に置き換えます。

> このクラスは、回答内でアップロード済みファイルから引用したコンテンツを参照する際に使用する構造を定義します。

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

再度 **ContosoHRAgent** プロジェクトを右クリックし **Add > Class** を選択し、クラス名を `ConversationStateExtensions.cs` として定義します。既存のコードを次の内容に置き換えます。

> このクラスは、ユーザー メッセージ数を管理・追跡するヘルパー メソッドを追加し、会話中に状態がどのように保存・変更されるかを示します。

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
    }
}
```

<cc-end-step lab="bma3" exercise="1" step="3" />

## 演習 2: Azure AI Foundry エージェントと M365 Agents SDK の統合

M365 Agents SDK を使用してエージェントを構築し、生成 AI 機能を構成しました。次は、前に作成した Azure AI Foundry エージェントへこのローカル エージェントを接続します。これにより、Foundry プロジェクトに保存されたエンタープライズ データと instructions を使用してエージェントが応答できるようになり、すべてが一つにまとまります。

### Step 1: EchoBot.cs を構成して Azure AI Foundry エージェントと接続

このステップでは、EchoBot.cs 内で Foundry にホストされたモデルを取得・呼び出すクライアントを追加し、Azure AI Foundry エージェントへ接続します。

**ContosoHRAgent** プロジェクトで **Bot/EchoBot.cs** を開き、EchoBot public クラスの内部に次の行を追加します。

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
      _projectClient = new PersistentAgentsClient(projectEndpoint, new DefaultAzureCredential());
      
      // Azure AI Foundry Agent Id
      _agentId = configuration["AIServices:AgentID"];
      if (string.IsNullOrEmpty(_agentId))
      {
          throw new InvalidOperationException("AgentID is not configured.");
      }

  }
```

> **⚠️ 注意:** 以下のコードを貼り付けると、プレビュー機能のため警告 (SKEXP0110) が表示される場合があります。今は右クリックで AzureAIAgent を選択し、**Quick Actions and Refactorings > Suppress or configure issues > Configure SKEXP0110 Severity > Silent** を選択して警告を抑制しても問題ありません。  
> 
> ![The Warning provided by Visual Studio when pasting code about a preview feature. There is the SKEXP0110 warning highlighted and the commands to silent related notifications.](https://github.com/user-attachments/assets/3dc267c0-c3b6-4436-9dc6-09157f9a8b5b)

**OnMessageAsync** メソッドを次の内容に置き換えます。

```
 protected async Task OnMessageAsync(ITurnContext turnContext, ITurnState turnState, CancellationToken cancellationToken)
    {
        // get the Azure AI Agent
        var agentModel = await _projectClient.Administration.GetAgentAsync(_agentId, cancellationToken);
        var agent = new AzureAIAgent(agentModel, _projectClient);
        
        try
        {
            // send the initial message
            await turnContext.StreamingResponse.QueueInformativeUpdateAsync("Working on it...", cancellationToken);
  
            // increment the message count in state
            int count = turnState.Conversation.IncrementMessageCount();
            turnContext.StreamingResponse.QueueTextChunk($"({count}) ");
  
            var fileReferences = new List<FileReference>();
            var citations = new List<Citation>();
            var quote = string.Empty;
  
            // create the chat message to send to the agent
            var message = new ChatMessageContent(AuthorRole.User, turnContext.Activity.Text);
  
            // stream the response from the agent to the user
            await foreach (StreamingChatMessageContent chunk in agent.InvokeStreamingAsync(message, cancellationToken: cancellationToken))
            {
                // get the annotation content from the message chunk items, if there are any
                var annotations = chunk.Items.OfType<StreamingAnnotationContent>();
                foreach (StreamingAnnotationContent annotation in annotations)
                {
                    // check if the file reference already exists in the list and skip it if it does
                    if (fileReferences.Any(fr => fr.Quote == annotation.Label)) { continue; }
  
                    var agentFile = await agent.Client.Files.GetFileAsync(annotation.ReferenceId, cancellationToken);
                    var citation = new Citation(string.Empty, agentFile.Value.Filename, "https://m365.cloud.microsoft/chat");
  
                    var fileReference = new FileReference(agentFile.Value.Id, agentFile.Value.Filename, annotation.Label, citation);
                    fileReferences.Add(fileReference);
                }
  
                // if the message chunk content is empty, we can skip it
                // this happens when the chunk contains StreamingAnnotationContent items
                if (chunk.Content == null) { continue; }
  
                // if the previous message chunk contained the citation quote, we can process it now
                if (quote != string.Empty)
                {
                    var fileReferenceIndex = fileReferences.FindIndex(fr => fr.Quote == quote);
                    turnContext.StreamingResponse.QueueTextChunk($" [{fileReferenceIndex + 1}] ");
  
                    // reset the quote to empty string to avoid processing it again
                    quote = string.Empty;
                    continue;
                }
  
                // if the message chunk contains an annotation quote 【4:0†source】
                // store the value for the next message chunk so we can process it
                // we don't want to send it to the user yet
                if (chunk.Content.Contains('【'))
                {
                    quote = chunk.Content;
                    continue;
                }
                else
                {
                    // just a regular message chunk, we can send it to the user
                    turnContext.StreamingResponse.QueueTextChunk(chunk.Content);
                }
            }
  
            // enable generated by AI label
            turnContext.StreamingResponse.EnableGeneratedByAILabel = true;
  
            // add sensitivity label
            turnContext.StreamingResponse.SensitivityLabel = new SensitivityUsageInfo()
            {
                Name = "General",
                Description = "Business data which is NOT meant for public consumption. This can be shared with internal employees, business guests and external partners as needed."
            };
  
            // add citations
            foreach (var fileReference in fileReferences)
            {
                citations.Add(fileReference.Citation);
            }
            turnContext.StreamingResponse.AddCitations(citations);
        }
        finally
        {
            await turnContext.StreamingResponse.EndStreamAsync(cancellationToken);
        }
    }
```

???+ info "OnMessageAsync で何が起こるのか?"
    *OnMessageAsync* メソッドはエージェントの応答ロジックの要です。既定のエコー動作を置き換えることで、ユーザーのメッセージを Azure AI Foundry エージェントへ送信し、リアルタイムでレスポンスをストリーミングし、透明性のために引用とファイル参照を追跡・添付し、さらにセキュリティとトレーサビリティのために感度ラベルと AI 生成ラベルを追加できるようになりました。

<cc-end-step lab="bma3" exercise="2" step="1" />

### Step 2: Azure AI エージェント サービス キーを構成

Foundry への接続情報を appsettings.json に追加します。これらの値により、M365 エージェントは正しい Foundry プロジェクトとエージェントへ接続します。**ContosoHRAgent** プロジェクトで **appsettings.json** を開き、appsettings リストの末尾に次の行を追加します。

```
,
  "AIServices": {
   "AgentID": "<AzureAIFoundryAgentId>",
   "ProjectEndpoint": "<ProjectEndpoint>"
  }
```

> これらの値は Azure AI Foundry の **Overview** と **Agents Playground** セクションで確認できます。

**<AzureAIFoundryAgentId>** を **Agent id**（**Agents Playground** で確認可能）に置き換えます。

![The Agents Playground of Azure AI Foundry with the Agent id field highlighted.](https://github.com/user-attachments/assets/13421287-d476-41c4-88df-bed1bff2f2f8)

**<ProjectEndpoint>** を AI Foundry の **Overview** ページの Endpoints and keys にあるプロジェクト接続文字列に置き換えます。

最終的な **appsettings.json** は以下のようになります。

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
azd auth login --scope https://ai.azure.com/.default
```

ブラウザー ウィンドウがポップアップし、Microsoft アカウントでサインインして `az login` を完了する必要があります。

**Start** を展開し **Dev Tunnels > Create a Tunnel** を選択します。
 
* **Sign in** と **Work or school account** を選択し、上記と同じ資格情報でログインします。  
* トンネル名を `DevTunnel` などに設定します。  
* Tunnel Type は **Temporary** のままにします。  
* Access は **Public** を選択し、**Create** をクリックします。

![The UI of Visual Studio to create a Dev Tunnel for the agent. There is a "Create a Tunnel" command highlighted.](https://github.com/user-attachments/assets/146fb3d4-256d-48b3-95a1-9e285f6bbc08)

**M365Agent** プロジェクトを右クリックし、**Microsoft 365 Agents Toolkit > Select Microsoft 365 Account** を選択します。

![The context menu of the the M365 Agents Toolkit when selecting the Microsoft 365 Account to use, highlighted in the screenshot.](https://github.com/user-attachments/assets/6981343d-8668-4b33-b36f-63b12739fc9d)

同じアカウントを選択し **Continue** をクリックします。アカウントが自動表示されない場合は **Sign in** と **Work or school account** を選択します。
  
Visual Studio 上部のスタートアップ項目を展開し（既定では **<Multiple Startup Projects>**）、**Microsoft Teams (browser)** を選択します。

![The UI of Visual Studio when configuring Microsoft Teams (browser) for testing the agent in debug mode.](https://github.com/user-attachments/assets/0f564f0a-0394-49de-a679-6be59761b4fb)

これで、統合されたエージェントを実行し、Microsoft Teams でライブ テストする準備が整いました。Dev トンネルが作成され、アカウントが認証されていることを確認してください。

Dev Tunnel が作成されたら **Start** あるいは **F5** を押してデバッグを開始します。Microsoft Teams が自動で起動し、エージェント アプリがウィンドウに表示されます。**Add** と **Open** を選択してエージェントとのチャットを開始します。  

次の質問例を使ってエージェントと対話してみてください。

* Northwind Standard と Health Plus の緊急・メンタルヘルス補償の違いは何ですか?
* PerksPlus でロッククライミング クラスとバーチャル フィットネス プログラムの両方を支払えますか?
* Contoso Electronics では、どのようなバリューが行動と意思決定を導きますか?

Azure AI Foundry で作成したエージェントと同様の回答が得られるはずです。

![The Agent running in Microsoft Teams with evidence of the counter to count the number of interactions with the user.](https://github.com/user-attachments/assets/73ef491f-eaff-4743-bb2d-79a52a9ae301)

<cc-end-step lab="bma3" exercise="2" step="3" />

---8<--- "ja/b-congratulations.md"

ラボ BMA3 - Azure AI Foundry エージェントと M365 Agents SDK の統合を完了しました!

次はラボ BMA4 - エージェントを Copilot Chat へ展開 に進みましょう。Next を選択してください。

<cc-next url="../04-bring-agent-to-copilot" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/03-agent-configuration" />