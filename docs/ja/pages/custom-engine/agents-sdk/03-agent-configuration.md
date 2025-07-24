---
search:
  exclude: true
---
# ラボ BMA3 - Azure AI Foundry Agent と M365 Agents SDK の統合

このラボでは、 Azure AI Foundry agent と Microsoft 365 Agents SDK のマルチチャネル柔軟性の最高の機能を組み合わせます。 Semantic Kernel を構成し、エージェントのプロパティを設定し、Foundry ホストのエージェントに安全に接続して、 Microsoft Teams 内で企業向けの豊富な回答を直接提供します。

## 演習 1: エージェントのプロパティを構成し Teams でテスト

基本的なボットを作成したので、生成 AI 機能を強化して AI エージェントへアップグレードする時が来ました。この演習では、 Semantic Kernel などの主要ライブラリをインストールし、エージェントがより知的に推論および応答できるよう準備します。 Teams や Copilot Chat に対応可能です。

### ステップ 1: 新しいパッケージでプロジェクトファイルを更新

このステップで追加するパッケージは、 Azure AI 統合のサポートを提供します。 **ContosoHRAgent** プロジェクトを右クリックして **Edit Project File** を選択し、 **PackageReference** を含む ItemGroup を以下の内容に置き換えます:

```
  <ItemGroup>
    <PackageReference Include="Microsoft.Agents.Authentication.Msal" Version="1.1.91-beta" />
    <PackageReference Include="Microsoft.Agents.Hosting.AspNetCore" Version="1.1.91-beta" />
    <PackageReference Include="Microsoft.SemanticKernel.Agents.AzureAI" Version="1.52.1-preview" />
  </ItemGroup>
```

<cc-end-step lab="bma3" exercise="1" step="1" />

### ステップ 2: Program.cs に Semantic Kernel を追加

**Program.cs** を開き、 var app = builder.Build() の直前に次のコードスニペットを追加します:

```
builder.Services.AddKernel();
```

これにより、生成 AI モデルとエージェント間の相互作用を可能にする主要コンポーネントである Semantic Kernel が登録されます。

<cc-end-step lab="bma3" exercise="1" step="2" />

### ステップ 3: ドキュメント引用およびメッセージ追跡用のカスタムクラスを追加

**ContosoHRAgent** プロジェクトを右クリックして **Add > Class** を選択し、クラス名を `FileReference.cs` として定義します。既存のコードを以下に置き換えます:

> このクラスは、回答内で特定のドキュメントを参照する際に使用される構造を定義します—エージェントがアップロードされたファイルの内容を引用する際に役立ちます。

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

**ContosoHRAgent** プロジェクトを右クリックして **Add > Class** を選択し、クラス名を `ConversationStateExtensions.cs` として定義します。既存のコードを以下に置き換えます:

> このクラスは、ユーザーのメッセージ数を管理および追跡するためのヘルパーメソッドを追加します—進行中の会話中に状態がどのように保存・変更されるかを実演しています。

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

## 演習 2: Azure AI Foundry Agent と M365 Agents SDK の統合

M365 Agents SDK を使用してエージェントを構築し、生成 AI 機能を構成済みです。次に、このローカルエージェントを、先に作成した Azure AI Foundry agent に接続します。これにより、エージェントは Foundry プロジェクトに保存された企業データおよび instructions を使用して応答できるようになり、全体が一貫したものになります。

### ステップ 1: EchoBot.cs を構成して Azure AI Foundry Agent に接続

このステップでは、 EchoBot.cs 内にクライアントを追加して、Foundry ホストのモデルを呼び出し、Azure AI Foundry agent に接続します。

**ContosoHRAgent** プロジェクト内の **Bot/EchoBot.cs** を開き、 EchoBot 公開クラス内に次の行を追加します:

```
private readonly PersistentAgentsClient _projectClient;
private readonly string _agentId;
```

既存の EchoBot コンストラクターを以下に置き換えます:

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

> **⚠️ 注意事項:** 以下のコード抜粋を貼り付けると、プレビュー機能であるために警告 (SKEXP0110) が表示される場合があります。現在は AzureAIAgent を右クリックし、 **Quick Actions and Refactorings > Suppress or configure issues > Configure SKEXP0110 Severity > Silent** を選択して、この警告を安全に抑制できます。
> 
> ![Visual Studio がプレビュー機能に関するコード貼り付け時に提供する警告です。SKEXP0110 警告が強調表示され、関連する通知を抑制するコマンドが示されています。](https://github.com/user-attachments/assets/3dc267c0-c3b6-4436-9dc6-09157f9a8b5b)

既存の **OnMessageAsync** メソッドを以下に置き換えます:

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

???+ info "OnMessageAsync の動作概要"
    *OnMessageAsync* メソッドは、エージェントの応答ロジックの中心です。デフォルトのエコー動作を置き換えることで、エージェントはユーザーのメッセージを Azure AI Foundry agent に送信し、リアルタイムで応答のストリーミングを行い、透明性のために引用やファイル参照を追跡および添付し、セキュリティおよびトレーサビリティのために感度および AI 生成ラベルを追加できるようになります。

<cc-end-step lab="bma3" exercise="2" step="1" />

### ステップ 2: Azure AI Agent サービス キーの構成

Foundry への接続詳細を appsettings.json に追加します。これらの値は、 M365 エージェントを正しい Foundry プロジェクトおよびエージェントに接続するためのものです。**ContosoHRAgent** プロジェクト内の **appsettings.json** を開き、設定リストの末尾に次の行を追加します:

```
,
  "AIServices": {
   "AgentID": "<AzureAIFoundryAgentId>",
   "ProjectEndpoint": "<ProjectEndpoint>"
  }
```

> これらの値は、 Azure AI Foundry の **Overview** および **Agents Playground** セクションで確認できます。

**<AzureAIFoundryAgentId>** を **Agents Playground** で確認できる **Agent id** に置き換えます。

![Agent id 領域が強調表示されている Azure AI Foundry の Agents Playground。](https://github.com/user-attachments/assets/13421287-d476-41c4-88df-bed1bff2f2f8)

**<ProjectEndpoint>** を AI Foundry の **Overview** ページにある Endpoints and keys の下に記載されている AI Foundry プロジェクト接続文字列に置き換えます。

最終的な **appsettings.json** は以下のようになります:

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

### ステップ 3: Teams でエージェントをテスト

**Tools > Command Line > Developer Command Prompt** を開き、次のコマンドを実行します:

```
azd auth login --scope https://ai.azure.com/.default
```

ブラウザーにウィンドウが表示され、正しく az login を完了するために Microsoft アカウントにサインインする必要があります。

**Start** を展開し、 **Dev Tunnels > Create a Tunnel** を選択します：
 
* **Sign in** および **Work or school account** を選択します。上記と同じ資格情報でログインしてください。
* `DevTunnel` のようなトンネル名を指定します。
* トンネル タイプは **Temporary** のままにします。
* アクセスは **Public** を選択し、 **Create** をクリックします。

![エージェント用の Dev Tunnel を作成するための Visual Studio の UI。「Create a Tunnel」コマンドが強調表示されています。](https://github.com/user-attachments/assets/146fb3d4-256d-48b3-95a1-9e285f6bbc08)

**M365Agent** プロジェクトを右クリックし、 **Microsoft 365 Agents Toolkit > Select Microsoft 365 Account** を選択します。

![使用する Microsoft 365 アカウントを選択する際の M365 Agents Toolkit のコンテキスト メニューが、スクリーンショットで強調表示されています。](https://github.com/user-attachments/assets/6981343d-8668-4b33-b36f-63b12739fc9d)

前述と同じアカウントを選択し、 **Continue** をクリックして使用を確定します。もしアカウントが自動で表示されない場合は、 **Sign in** および **Work or school account** を選択してください。
  
Visual Studio 上部のスタートアップ項目を展開し、デフォルトで設定されている **<Multiple Startup Projects>** の項目から、 **Microsoft Teams (browser)** を選択します.

![デバッグ モードでエージェントをテストするために Microsoft Teams (browser) を構成する際の Visual Studio の UI。](https://github.com/user-attachments/assets/0f564f0a-0394-49de-a679-6be59761b4fb)

これで統合エージェントの実行および Microsoft Teams でのライブテストの準備が完了しました。 dev tunnel が作成され、アカウントが認証されていることを確認してください。

dev tunnel 作成後、 **Start** または **F5** を押してデバッグを開始します。 Microsoft Teams が自動的に起動し、エージェント アプリがウィンドウに表示されます。 **Add** を選択し、 **Open** をクリックしてエージェントとのチャットを開始してください。  

以下のいずれかの質問をして、エージェントと対話することができます:

* 緊急事態およびメンタルヘルス カバレッジに関して、 Northwind Standard と Health Plus の違いは何ですか?
* PerksPlus を使って、ロッククライミング クラスとバーチャル フィットネス プログラムの両方を支払うことはできますか?
* Contoso Electronics における行動および意思決定を導く価値観は何ですか?

Azure AI Foundry で作成したエージェントと同様の応答が得られることを確認できるはずです。

![ユーザーとの対話回数をカウントするカウンターが示されている、 Microsoft Teams で実行中のエージェント。](https://github.com/user-attachments/assets/73ef491f-eaff-4743-bb2d-79a52a9ae301)

<cc-end-step lab="bma3" exercise="2" step="3" />

---8<--- "ja/b-congratulations.md"

Lab BMA3 - Azure AI Foundry Agent と M365 Agents SDK の統合を完了しました!

これで、ラボ BMA4 - エージェントを Copilot Chat に展開 へ進む準備が整いました。 Next を選択してください。

<cc-next url="../04-bring-agent-to-copilot" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/03-agent-configuration" />