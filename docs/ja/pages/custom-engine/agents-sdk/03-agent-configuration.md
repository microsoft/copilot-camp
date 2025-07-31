---
search:
  exclude: true
---
# ラボ BMA3 - Azure AI Foundry エージェント と M365 Agents SDK の統合

このラボでは、Azure AI Foundry エージェント の生成 AI パワーと Microsoft 365 Agents SDK のマルチチャネル柔軟性という、双方の長所を組み合わせます。Semantic Kernel を構成し、エージェント プロパティを設定し、Foundry でホストされているエージェントへ安全に接続して、エンタープライズに対応した豊かな回答を Microsoft Teams に直接提供できるようにします。

## 演習 1: エージェント プロパティの構成と Teams でのテスト

基本的なボットを作成したので、ここから生成 AI 機能を強化し、AI エージェントへアップグレードします。この演習では、Semantic Kernel などの主要ライブラリをインストールし、Teams や Copilot Chat に対応できるよう、エージェントがよりインテリジェントに推論・応答できるように準備します。

### 手順 1: プロジェクト ファイルを更新して新しいパッケージを追加する

この手順で追加するパッケージは、Azure AI との統合をサポートします。 **ContosoHRAgent** プロジェクトを右クリックして **Edit Project File** を選択し、**PackageReference** を含む ItemGroup を次の内容に置き換えます。

```
  <ItemGroup>
    <PackageReference Include="Microsoft.Agents.Authentication.Msal" Version="1.1.91-beta" />
    <PackageReference Include="Microsoft.Agents.Hosting.AspNetCore" Version="1.1.91-beta" />
    <PackageReference Include="Microsoft.SemanticKernel.Agents.AzureAI" Version="1.52.1-preview" />
  </ItemGroup>
```

<cc-end-step lab="bma3" exercise="1" step="1" />

### 手順 2: Program.cs に Semantic Kernel を追加する

**Program.cs** を開き、`var app = builder.Build()` の直前に次のコード スニペットを追加します。

```
builder.Services.AddKernel();
```

これにより Semantic Kernel が登録されます。これは、エージェントが生成 AI モデルと対話するための中核コンポーネントです。

<cc-end-step lab="bma3" exercise="1" step="2" />

### 手順 3: ドキュメント引用とメッセージ トラッキング用のカスタム クラスを追加する

**ContosoHRAgent** プロジェクトを右クリックし、**Add > Class** を選択してクラス名を `FileReference.cs` と指定します。既存のコードを次の内容に置き換えます。

> このクラスは、アップロードされたファイルから引用した内容をエージェントが返答する際に使用する、ドキュメント参照の構造を定義します。

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

次に **ContosoHRAgent** プロジェクトを右クリックし、**Add > Class** を選択してクラス名を `ConversationStateExtensions.cs` と指定します。既存のコードを次の内容に置き換えます。

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
    }
}
```

<cc-end-step lab="bma3" exercise="1" step="3" />

## 演習 2: Azure AI Foundry エージェント を M365 Agents SDK と統合する

M365 Agents SDK を使ってエージェントを構築し、生成 AI 機能を構成しました。次は、このローカル エージェントを先ほど作成した Azure AI Foundry エージェント に接続します。これにより、Foundry プロジェクトに保存されたエンタープライズ データと指示を利用してエージェントが応答できるようになり、すべてが一つにつながります。

### 手順 1: EchoBot.cs を構成して Azure AI Foundry エージェント と接続する

この手順では、EchoBot.cs 内で Foundry でホストされているモデルを取得・呼び出すクライアントを追加し、Azure AI Foundry エージェント に接続します。

**ContosoHRAgent** プロジェクトで **Bot/EchoBot.cs** を開き、EchoBot パブリック クラス内に次の行を追加します。

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

> **⚠️ 注意:** 以下のコードを貼り付けると、プレビュー機能のために警告 (SKEXP0110) が表示される場合があります。今は安全にこの警告を抑制できます。`AzureAIAgent` を右クリックし、**Quick Actions and Refactorings > Suppress or configure issues > Configure SKEXP0110 Severity > Silent** を選択してください。  
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

???+ info "OnMessageAsync では何が起こるのか？"
    *OnMessageAsync* メソッドは、エージェントの応答ロジックの中心です。デフォルトのエコー動作を置き換えることで、ユーザー メッセージを Azure AI Foundry エージェント に送信し、応答をリアルタイムでストリーミングし、引用とファイル参照を追跡・添付して透明性を確保し、セキュリティと追跡性のために機密ラベルと AI 生成ラベルを追加できるようになりました。

<cc-end-step lab="bma3" exercise="2" step="1" />

### 手順 2: Azure AI Agent Service キーを構成する

Foundry 接続情報を appsettings.json に追加します。これらの値により、M365 エージェント が正しい Foundry プロジェクトとエージェントに接続します。**ContosoHRAgent** プロジェクトで **appsettings.json** を開き、appsettings リストの末尾に次の行を追加します。

```
,
  "AIServices": {
   "AgentID": "<AzureAIFoundryAgentId>",
   "ProjectEndpoint": "<ProjectEndpoint>"
  }
```

> これらの値は Azure AI Foundry の **Overview** と **Agents Playground** セクションで確認できます。

**<AzureAIFoundryAgentId>** を **Agents Playground** で確認できる **Agent id** に置き換えます。

![The Agents Playground of Azure AI Foundry with the Agent id field highlighted.](https://github.com/user-attachments/assets/13421287-d476-41c4-88df-bed1bff2f2f8)

**<ProjectEndpoint>** を AI Foundry の **Overview** ページの Endpoints and keys で確認できるプロジェクト接続文字列に置き換えます。

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

### 手順 3: Teams でエージェントをテストする

**Tools > Command Line > Developer Command Prompt** を開き、次を実行します。

```
azd auth login --scope https://ai.azure.com/.default
```

ブラウザー ウィンドウが開くので、az login を完了するために Microsoft アカウントでサインインします。

**Start** を展開し、**Dev Tunnels > Create a Tunnel** を選択します:
 
* **Sign in** と **Work or school account** を選択し、前述と同じ資格情報でログインします。
* トンネル名を `DevTunnel` などに設定します。
* Tunnel Type は **Temporary** のままにします。
* Access を **Public** に設定し、**Create** を選択します。

![The UI of Visual Studio to create a Dev Tunnel for the agent. There is a "Create a Tunnel" command highlighted.](https://github.com/user-attachments/assets/146fb3d4-256d-48b3-95a1-9e285f6bbc08)

**M365Agent** プロジェクトを右クリックし、**Microsoft 365 Agents Toolkit > Select Microsoft 365 Account** を選択します。

![The context menu of the the M365 Agents Toolkit when selecting the Microsoft 365 Account to use, highlighted in the screenshot.](https://github.com/user-attachments/assets/6981343d-8668-4b33-b36f-63b12739fc9d)

同じアカウントを選択して **Continue** をクリックします。アカウントが自動で表示されない場合は、**Sign in** と **Work or school account** を選択してください。
  
Visual Studio 上部のスタートアップ項目を展開し、デフォルトで **<Multiple Startup Projects>** となっている場所を **Microsoft Teams (browser)** に変更します。

![The UI of Visual Studio when configuring Microsoft Teams (browser) for testing the agent in debug mode.](https://github.com/user-attachments/assets/0f564f0a-0394-49de-a679-6be59761b4fb)

これで、統合済みエージェントを実行し、Microsoft Teams でライブ テストする準備が整いました。Dev Tunnel が作成され、アカウントが認証済みであることを確認してください。

Dev Tunnel が作成されたら、**Start** あるいは **F5** を押してデバッグを開始します。Microsoft Teams が自動で起動し、エージェント アプリがウィンドウに表示されます。**Add** と **Open** を選択してエージェントとのチャットを開始します。  

次のような質問をして、エージェントと対話してみてください。

* Northwind Standard と Health Plus の救急およびメンタルヘルス補償の違いは何ですか？
* PerksPlus を使ってロッククライミング教室とバーチャル フィットネス プログラムの両方を支払えますか？
* Contoso Electronics が行動と意思決定を導く価値観は何ですか？

Azure AI Foundry で作成したエージェントと同様の応答が得られるはずです。

![The Agent running in Microsoft Teams with evidence of the counter to count the number of interactions with the user.](https://github.com/user-attachments/assets/73ef491f-eaff-4743-bb2d-79a52a9ae301)

<cc-end-step lab="bma3" exercise="2" step="3" />

---8<--- "ja/b-congratulations.md"

Lab BMA3 - Azure AI Foundry エージェント と M365 Agents SDK の統合 を完了しました！

次の Lab BMA4 - エージェントを Copilot Chat に展開 に進む準備ができました。Next を選択してください。

<cc-next url="../04-bring-agent-to-copilot" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/03-agent-configuration--ja" />