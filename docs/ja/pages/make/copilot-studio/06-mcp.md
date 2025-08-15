---
search:
  exclude: true
---
# ラボ MCS6 - MCP サーバーの利用

このラボでは、Microsoft Copilot Studio で作成したエージェントを MCP (Model Context Protocol) サーバーで拡張する方法を学びます。具体的には、採用候補者の一覧を管理するツールを提供する既存の MCP サーバーを利用します。MCP サーバーは次の機能を提供します。

- 候補者をすべて一覧表示  
- 条件で候補者を検索  
- 新しい候補者を追加  
- 既存の候補者情報を更新  
- 候補者を削除  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Y8KpHmmMqzc" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を短時間でご確認いただけます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! tip "MCP について学ぶ"
    このラボでは MCP の概念を紹介し、Copilot Studio との統合方法を示します。MCP は、AI アシスタントが外部データ ソースやツールに安全に接続できる新しいプロトコルです。詳細は [Model Context Protocol (MCP) for beginners](https://github.com/microsoft/mcp-for-beginners){target=_blank} のトレーニング クラスをご覧ください。

このラボで学ぶ内容:

- 既存の MCP サーバーの構成と接続方法  
- 外部サーバーの MCP ツールとリソースの利用方法  
- MCP サーバーと Copilot Studio エージェントの統合方法  

## Exercise 1 : MCP サーバーのセットアップ

この演習では、HR 候補者管理機能を提供する事前構築済み MCP サーバーをセットアップします。サーバーは Microsoft .NET をベースに MCP SDK for C# を使用しています。ここでは、サーバーをダウンロードしてローカルで実行できるように構成します。

### Step 1: MCP サーバーと前提条件の理解

本ラボで利用する HR MCP サーバーは以下のツールを提供します。

- **list_candidates**: 候補者の一覧を取得  
- **search_candidates**: 名前、メール、スキル、現在の職種で候補者を検索  
- **add_candidate**: 候補者を追加  
- **update_candidate**: メールアドレスで既存候補者を更新  
- **remove_candidate**: メールアドレスで候補者を削除  

サーバーは以下の候補者情報を管理します。

- 個人情報 (firstname, lastname, full name, email)  
- 職務関連情報 (spoken languages, skills, current role)  

開始前に次を準備してください。

- [.NET 10.0 SDK (preview 6 以降)](https://dotnet.microsoft.com/download/dotnet/10.0){target=_blank}  
- [Visual Studio Code](https://code.visualstudio.com/){target=_blank}  
- [Node.js v.22 以降](https://nodejs.org/en){target=_blank}  
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector){target=_blank}  

<cc-end-step lab="mcs6" exercise="1" step="1" />

### Step 2: MCP サーバーのダウンロードと実行

本ラボでは事前構築済みの HR MCP サーバーを使用します。[こちら](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/path-m-lab-mcs6-mcp/hr-mcp-server&filename=hr-mcp-server){target=_blank} からサーバー ファイルをダウンロードしてください。

ZIP を展開し、Visual Studio Code でフォルダーを開きます。サーバーは実装済みで、そのまま実行できます。

![The outline of the HR MCP Server project in Visual Studio Code showing the server files and candidate data.](../../../assets/images/make/copilot-studio-06/mcp-server-01.png)

プロジェクト構成の主な要素:

- `Configuration`: MCP サーバーの設定を定義する `HRMCPServerConfiguration.cs`  
- `Data`: 候補者一覧を持つ `candidates.json`  
- `Services`: 一覧を読み込み管理する `ICandidateService.cs` インターフェースと `CandidateService.cs` 実装  
- `Tools`: MCP ツールを定義する `HRTools.cs` とデータ モデルを定義する `Models.cs`  
- `DevTunnel_Instructions.MD`: dev tunnel で MCP サーバーを公開する手順  
- `Progam.cs`: MCP サーバーを初期化するエントリ ポイント  

Visual Studio Code 内、または新しいターミナルで依存関係のインストールからビルド、起動まで次のコマンドを実行します。

```console
dotnet run
```

MCP サーバーが起動していることを確認します。[http://localhost:47002/](http://localhost:47002/){target=_blank} にブラウザーでアクセスすると、JSON 形式のエラーメッセージが表示されますが、これは MCP サーバーに到達している証拠なので問題ありません。

!!! info
    本ラボ付属の HR MCP サーバーは学習用で、本番運用を想定していません。候補者一覧をメモリ上で管理し、複数の会話セッション間でデータを保持しません。HTTP で公開される MCP サーバーの基本を理解する出発点としてご利用ください。たとえば [Fabian Williams (Microsoft)](https://github.com/fabianwilliams/){target=_blank} 氏が実装した [より高度なサーバー](https://github.com/fabianwilliams/hr-mcp-server){target=_blank} を参考に、コンテナー アプリ化や永続ストレージ追加などの改善も可能です。

<cc-end-step lab="mcs6" exercise="1" step="2" />

### Step 3: dev tunnel の構成

次に、MCP サーバーを公開 URL で外部に公開します。ローカル開発マシン上の `localhost` を公開するにはリバース プロキシ ツールが必要です。ここでは Microsoft 提供の dev tunnel を使用します。

- [こちらの手順](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank} に従い dev tunnel をインストール  
- 次のコマンドで dev tunnel にサインイン  

```console
devtunnel user login
```

- 次のコマンドで dev tunnel をホスト  

```console
devtunnel create hr-mcp -a --host-header unchanged
devtunnel port create hr-mcp -p 47002
devtunnel host hr-mcp
```

実行すると接続情報が表示されます。

![The dev tunnel running in a console window showing the hosting port, the connect via browser URL, and the URL to inspect network activity.](../../../assets/images/make/copilot-studio-06/mcp-server-02.png)

「Connect via browser」の URL をコピーして安全な場所に保存し、ブラウザーで開きます。以下のような確認ページが表示されたら **Continue** を選択してください。

![The confirmation page to access the MCP server via the dev tunnel. There is a button to "Continue" that you should select.](../../../assets/images/make/copilot-studio-06/mcp-server-03.png)

ラボ作業中は dev tunnel と MCP サーバーを両方とも起動したままにしてください。再起動が必要になった場合は `devtunnel host hr-mcp` を再度実行します。

<cc-end-step lab="mcs6" exercise="1" step="3" />

### Step 4: MCP サーバーのテスト

ローカル環境で MCP サーバーをテストします。簡単のため [MCP Inspector](https://github.com/modelcontextprotocol/inspector){target=_blank} を使用します。ターミナルで次を実行します。

```console
npx @modelcontextprotocol/inspector
```

Node.js が MCP Inspector をダウンロード・起動し、次のような出力が表示されます。

![The output of the MCP inspector when started in a terminal window. You have the proxy port that the MCP Inspector is listening on and the URL of the MCP Inspector.](../../../assets/images/make/copilot-studio-06/mcp-inspector-01.png)

ブラウザーが自動で起動し、次のような UI が表示されます。

![The web interface of the MCP Inspector. On the left there are the settings to configure the MCP Server and the "Connect" button to connect to the actual MCP server.](../../../assets/images/make/copilot-studio-06/mcp-inspector-02.png)

MCP Inspector を次の設定で構成します。

- 1️⃣ **Transport type**: Streamable HTTP  
- 2️⃣ **URL**: dev tunnel の「Connect via browser」で保存した URL  

続いて 3️⃣ **Connect** を選択して MCP サーバーに接続します。接続が成功すると緑色の表示で **Connected** と表示されます。  
画面の Tools セクションで 1️⃣ **List Tools** を選択し、MCP サーバーが公開するツール一覧を取得します。  
次に 2️⃣ **list_candidates** を選択し、3️⃣ **Run tool** を実行してツールを呼び出します。

![The web interface of the MCP Inspector when listing the tools and invoking the "list_candidates" tool. There are commands to "List Tools", one item for each of the tools offered by the MCP server, and a command "Run tool" to invoke a single tool.](../../../assets/images/make/copilot-studio-06/mcp-inspector-03.png)

成功すると **Success** の緑メッセージとツールの実行結果が表示されます。  
**History** セクションで過去の呼び出しを確認可能です。

![The web interface of the MCP Inspector when invoking a tool. There is a green successful message and the actual output of the tool invocation.](../../../assets/images/make/copilot-studio-06/mcp-inspector-04.png)

これで Microsoft Copilot Studio のエージェントから MCP サーバーを利用する準備が整いました。

<cc-end-step lab="mcs6" exercise="1" step="4" />

## Exercise 2 : Copilot Studio で新しいエージェントを作成

この演習では、Exercise 1 で構成した MCP サーバーを利用する新しい Copilot Studio エージェントを作成します。

### Step 1: 新規エージェントの作成

ブラウザーで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} を開き、対象 Microsoft 365 テナントの作業アカウントでサインインします。

左ナビゲーションで **Copilot Dev Camp** 環境 ( [Lab MCS0 - Setup](00-prerequisites.md) の **Exercise 1** で作成 ) を選択し、**Create** → **Agent** を選択します。

**Skip to configure** を選択し、以下の設定で新しいエージェントを定義します。

- **Name**: 

```text
HR Agent with MCP
```

- **Description**: 

```text
An AI assistant that helps manage HR candidates using MCP server integration 
for comprehensive candidate management
```

- **Instructions**: 

```text
You are a helpful HR assistant that specializes in candidate management. You can help users search 
for candidates, check their availability, get detailed candidate information, and add new 
candidates to the system. 
Always provide clear and helpful information about candidates, including their skills, experience, 
contact details, and availability status.
```

![The agent creation dialog in Copilot Studio with the name, description, and instructions filled in for the HR Agent with MCP.](../../../assets/images/make/copilot-studio-06/create-agent-01.png)

**Create** を選択してエージェントを作成します。

<cc-end-step lab="mcs6" exercise="2" step="1" />

### Step 2: エージェントの会話スターター設定

エージェント作成後、設定ページに移動します。**Suggested prompts** セクションに次のプロンプトを追加します。

1. Title: `List all candidates` - Prompt: `List all the candidates`  
1. Title: `Search candidates` - Prompt: `Search for candidates with name [NAME_TO_SEARCH]`  
1. Title: `Add new candidate` - Prompt: `Add a candidate with firstname [FIRSTNAME], lastname [LASTNAME],  e-mail [EMAIL], role [ROLE], spoken languages [LANGUAGES], and skills [SKILLS]`  

![The agent configuration page showing the "Suggested prompts" sections filled in with the suggested information.](../../../assets/images/make/copilot-studio-06/configure-agent-01.png)

**Save** を選択して変更を保存します。

<cc-end-step lab="mcs6" exercise="2" step="2" />

## Exercise 3 : MCP サーバーと Copilot Studio の統合

この演習では、MCP サーバーと Copilot Studio エージェントの統合を構成します。

### Step 1: MCP サーバーが公開するツールの追加

エージェント画面で 1️⃣ **Tools** セクションに移動し、2️⃣ **+ Add a tool** を選択します。

![The "Tools" section of the agent with the "+ Add a tool" command highlighted.](../../../assets/images/make/copilot-studio-06/mcp-integration-01.png)

1️⃣ **Model Context Protocol** グループを選択すると、エージェントが利用可能な MCP サーバーの一覧が表示されます。2️⃣ **+ New tool** を選択し、HR MCP サーバーを追加します。

![The panel to add new tools, with the "+ New tool" command highlighted.](../../../assets/images/make/copilot-studio-06/mcp-integration-02.png)

ツール種別を選択するダイアログが表示されます。現時点で **Model Context Protocol** を選ぶと、公式ドキュメント [Extend your agent with Model Context Protocol](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp){target=_blank} に移動します。

このラボでは実際に MCP サーバー用カスタム コネクタを作成しますので、**Custom connector** を選択して続行します。 

![The dialog to add a new tool with the "Custom connector" option highlighted.](../../../assets/images/make/copilot-studio-06/mcp-integration-03.png)

新しいブラウザー タブで Power Apps のカスタム コネクタ管理ページが開きます。1️⃣ **+ New custom connector** → 2️⃣ **Import an OpenAPI file** を選択します。

![The dialog to add a new tool with the "Custom connector" option highlighted.](../../../assets/images/make/copilot-studio-06/mcp-integration-04.png)

このまま保留し、Visual Studio Code に戻って新しいファイルを作成し、次の YAML スキーマを貼り付けます。

```yaml
swagger: '2.0'
info:
  title: HR MCP Server
  description: Allows to manage candidates for specific job roles providing tools to list, search, add, update, and remove candidates from a reference list
  version: 1.0.0
host: [Connect via browser host name of your dev tunnel]
basePath: /
schemes:
  - https
paths:
  /:
    post:
      summary: HR MCP Server
      x-ms-agentic-protocol: mcp-streamable-1.0
      operationId: InvokeMCP
      responses:
        '200':
          description: Success
```

`host` を dev tunnel 公開 URL のホスト名に置き換えます。  
`https://` や末尾の `/` を含めず、`3dcwb74w-47002.euw.devtunnels.ms` のようにホスト名のみを指定してください。保存後、ブラウザーに戻ります。

コネクタ名に `HR MCP Server` などを入力し、**Import** で先ほどの OpenAPI ファイルを選択して **Continue** します。

![The dialog to create a new "Custom connector" in the current Power Platform environment. There are the name of the connector and the path to the OpenAPI specification YAML file.](../../../assets/images/make/copilot-studio-06/mcp-integration-05.png)

コネクタ設定ページで **Swagger editor** を有効にすると OpenAPI ソースを確認できます。

![The "Custom connector" definition page in the current Power Platform environment. There is the "Swagger editor" option selected to see the source code of the OpenAPI specification file.](../../../assets/images/make/copilot-studio-06/mcp-integration-06.png)

**Create connector** を選択し、コネクタが準備完了するまで待ちます。必要に応じてアイコンを設定し **Update connector** で保存してください。  

Copilot Studio に戻り **Refresh** を選択してツール一覧を更新します。

![The dialog to add a new tool in Copilot Studio with a dialog waiting for you to select the "Refresh" button to reload the list of available tools.](../../../assets/images/make/copilot-studio-06/mcp-integration-07.png)

**Model Context Protocol** 一覧に `HR MCP Server` が表示されるはずです。

![The list of "Model Context Protocol" tools, including the new "HR MCP Server" connector.](../../../assets/images/make/copilot-studio-06/mcp-integration-08.png)

`HR MCP Server` コネクタを選択し、Copilot Studio のデフォルト UX で接続を作成後 **Add and configure** を選択します。

![The dialog to add the "HR MCP Server" connector as a tool to the current agent in Copilot Studio. There are buttons to "Add to agent" and to "Add and configure", as well as a button to "Cancel".](../../../assets/images/make/copilot-studio-06/mcp-integration-09.png)

これで MCP サーバーが公開するすべてのツールがエージェントで利用可能になりました。

![The details about the settings and tools of the MCP server that you just registered. There is the list of tools exposed by the server.](../../../assets/images/make/copilot-studio-06/mcp-integration-10.png)

<cc-end-step lab="mcs6" exercise="3" step="1" />

### Step 2: MCP サーバー統合のテスト

右上の **Publish** を選択してエージェントを公開します。公開後、統合テスト パネルで次のプロンプトを試します。

```text
List all candidates
```

エージェントは MCP サーバーの `list_candidates` ツールを呼び出し、候補者一覧を返すはずです。  
最初はコネクタ接続が必要なため、Copilot Studio が **Open connection manager** を促します。接続後 **Retry** してください。

![The initial dialog with the agent, which prompts the user to open the connection manager to connect to the MCP server and then to retry the request, once the connection is established.](../../../assets/images/make/copilot-studio-06/mcp-test-01.png)

接続が完了すると、候補者一覧が取得できます。

![The list of candidates retrieved from the HR MCP Server.](../../../assets/images/make/copilot-studio-06/mcp-test-02.png)

!!! tip "ローカルでの MCP サーバー デバッグ"
    開発者の方は `HRTools.cs` にブレークポイントを設定し、Visual Studio Code からデバッガーをアタッチして MCP サーバーの挙動を解析できます。

エージェントを Microsoft 365 Copilot Chat でも使用可能にするには、1️⃣ **Channels** → 2️⃣ **Teams and Microsoft 365 Copilot** → 3️⃣ **Make agent available in Microsoft 365 Copilot** にチェック → 4️⃣ **Add channel** を選択します。チャネルが有効になったらパネルを閉じ、右上の **Publish** を再実行します。

![The interface to publish an agent in the "Teams and Microsoft 365 Copilot" channel. There is a checkbox to make the agent available in Microsoft 365 Copilot and a command to "Add channel".](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-01.png)

再度 **Teams and Microsoft 365 Copilot** チャンネルを開き、**See agent in Microsoft 365** を選択してエージェントを Microsoft 365 Copilot に追加します。

![The interface to publish an agent in the "Teams and Microsoft 365 Copilot" channel with the "See agent in Microsoft 365" command highlighted.](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-02.png)

エージェント追加画面で **Add** → **Open** を選択し、Microsoft 365 Copilot でエージェントを試します。

!!! info "エージェント詳細"
    **Teams and Microsoft 365 Copilot** チャンネルの設定パネルから、エージェントの説明やアイコンなど追加情報を設定できます。

![The interface to add the agent to Microsoft 365 Copilot. There are information about the agent and a command to "Add" the agent to Microsoft 365 Copilot.](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-03.png)

エージェント UI には先ほど設定した Suggested prompts が表示されます。  
たとえば次のプロンプトを試します。

```text
Search for candidate Alice
```

![The Microsoft 365 Copilot chat interface with the suggested prompts configured for the "HR Agent with MCP" and the prompt "Search for candidate Alice" ready to be processed.](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-01.png)

エージェントは MCP サーバーの `search_candidates` ツールを使い、該当候補者を 1 名返すはずです。ただし Microsoft 365 Copilot でも再度コネクタ接続が必要です。**Open the connection manager** を選択して接続してください。

![The Microsoft 365 Copilot chat instructing the user to "Open the connection manager" to verify credentials and connect to the MCP server.](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-02.png)

接続後、プロンプトを再実行すると期待通りの応答が得られます。

![Microsoft 365 Copilot showing information about the candidate Alice Johnson, who is matching the search criteria defined in the prompt.](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-03.png)

次は `add_candidate` ツールを使い、HR システムに新しい候補者を追加しましょう。以下のプロンプトを使用します。

```text
Add a new candidate: John Smith, Software Engineer, skills: React, Node.js, 
email: john.smith@email.com, speaks English and Spanish
```

エージェントは入力を解析し、`add_candidate` ツールを呼び出し、新しい候補者を追加します。MCP サーバーからは確認応答が返ります。

![The agent confirming that a new candidate has been added to the HR system via the MCP Server.](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-04.png)

`list_candidates` で確認すると `John Smith` が一覧の末尾に追加されています。

![The updated list of candidates retrieved from the HR system via the MCP Server. The newly added candidate with name John Smith is at the end of the list.](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-05.png)

他にも次のようなプロンプトで遊んでみてください。

```text
Update the candidate with email bob.brown@example.com to speak also French
```

または:

```text
Add skill "Project Management" to candidate bob.brown@example.com
```

または:

```text
Remove candidate bob.brown@example.com
```

エージェントは適切なツールを呼び出し、指示通りに動作します。

お疲れさまでした! エージェントは完全に機能し、HR MCP サーバーのすべてのツールを利用できるようになりました。

<cc-end-step lab="mcs6" exercise="3" step="2" />

---8<--- "ja/mcs-congratulations.md"

ラボ MCS6 - MCP サーバーの利用 が完了しました!

<!-- <a href="../07-autonomous">Start here</a> with Lab MCS7, to learn how to create autonomous agents in Copilot Studio.
<cc-next />  -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/06-mcp--ja" />