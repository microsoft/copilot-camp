---
search:
  exclude: true
---
# ラボ MCS6 - MCP サーバーの利用

このラボでは、Microsoft Copilot Studio で作成したエージェントを MCP (Model Context Protocol) サーバーで拡張する方法を学習します。具体的には、求人候補者のリストを管理するツールを提供する既存の MCP サーバーを利用します。MCP サーバーは次の機能を提供します。

- すべての候補者を一覧表示  
- 条件で候補者を検索  
- 新しい候補者を追加  
- 既存候補者の情報を更新  
- 候補者を削除  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Y8KpHmmMqzc" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要をご覧ください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! tip "MCP について学ぶ"
    このラボでは MCP の概念を紹介し、Copilot Studio との統合方法を示します。MCP は AI アシスタントが外部データ ソースやツールへ安全に接続できる新しいプロトコルです。詳細は [Model Context Protocol (MCP) for beginners](https://github.com/microsoft/mcp-for-beginners){target=_blank} のトレーニング コンテンツをご覧ください。

このラボで学習できること

- 既存の MCP サーバーを構成し接続する方法  
- 外部サーバーの MCP ツールとリソースを利用する方法  
- MCP サーバーを Copilot Studio エージェントと統合する方法  

## 演習 1 : MCP サーバーのセットアップ

この演習では、人事候補者管理機能を提供するあらかじめ用意された MCP サーバーをセットアップします。サーバーは Microsoft .NET ベースで、C# 向け MCP SDK を使用しています。ここではサーバーをダウンロードし、ローカルで実行できるように構成します。

### 手順 1: MCP サーバーと前提条件の理解

このラボで使用する HR MCP サーバーは次のツールを提供します。

- **list_candidates**: 候補者の一覧を取得  
- **search_candidates**: 名前、メール、スキル、現在の役職で候補者を検索  
- **add_candidate**: 候補者を追加  
- **update_candidate**: メールで既存候補者を更新  
- **remove_candidate**: メールで候補者を削除  

サーバーが管理する候補者情報

- 個人情報 (firstname, lastname, full name, email)  
- 職務情報 (spoken languages, skills, current role)  

開始前に次を用意してください。

- [.NET 10.0 SDK (preview 6 以上)](https://dotnet.microsoft.com/download/dotnet/10.0){target=_blank}  
- [Visual Studio Code](https://code.visualstudio.com/){target=_blank}  
- [Node.js v.22 以上](https://nodejs.org/en){target=_blank}  
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector){target=_blank}  

<cc-end-step lab="mcs6" exercise="1" step="1" />

### 手順 2: MCP サーバーのダウンロードと実行

このラボでは、用意された HR MCP サーバーを使用します。サーバー ファイルを [こちら](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/path-m-lab-mcs6-mcp/hr-mcp-server&filename=hr-mcp-server){target=_blank} からダウンロードしてください。

zip を展開し、Visual Studio Code でフォルダーを開きます。サーバーは既に実装済みで、すぐに実行できます。

![The outline of the HR MCP Server project in Visual Studio Code showing the server files and candidate data.](../../../assets/images/make/copilot-studio-06/mcp-server-01.png)

プロジェクト構成の主な要素

- `Configuration`: サーバーの設定を定義する `HRMCPServerConfiguration.cs`  
- `Data`: 候補者リストを提供する `candidates.json`  
- `Services`: 候補者リストを読み込み管理する `ICandidateService.cs` と実装 `CandidateService.cs`  
- `Tools`: MCP ツールを定義する `HRTools.cs` とデータ モデルを定義する `Models.cs`  
- `DevTunnel_Instructions.MD`: dev tunnel で MCP サーバーを公開する手順  
- `Progam.cs`: MCP サーバーを初期化するエントリーポイント  

Visual Studio Code 内で新しいターミナルを開くか、通常のターミナルを開き、次のコマンドで依存関係のインストール、ビルド、起動を行います。

```console
dotnet run
```

MCP サーバーが起動していることを確認します。ブラウザーで [http://localhost:47002/](http://localhost:47002/){target=_blank} にアクセスできるはずです。JSON 形式のエラーが表示されても問題ありません。MCP サーバーに到達できていることを示しています。

!!! info
    このラボ提供の HR MCP サーバーは本番運用を想定したものではありません。候補者リストをメモリ上で保持し、複数の会話セッションをまたいでデータを保持しません。本ラボ用にシンプルかつわかりやすいサンプルとして作成されています。プロフェッショナル開発者の方は、HTTP で公開する MCP サーバー構築の基礎を学ぶ出発点としてご利用ください。必要に応じてコンテナー アプリ化や永続ストレージ追加で改良できます。たとえば [こちら](https://github.com/fabianwilliams/hr-mcp-server){target=_blank} では [Fabian Williams (Microsoft)](https://github.com/fabianwilliams/){target=_blank} が実装したより高度なバージョンを参照できます。

<cc-end-step lab="mcs6" exercise="1" step="2" />

### 手順 3: dev tunnel の構成

次に、MCP サーバーをパブリック URL で公開します。ローカル開発マシンでサーバーを実行しているため、`localhost` をパブリック URL にマッピングするリバース プロキシが必要です。ここでは Microsoft 提供の dev tunnel を使用します。

- [こちらの手順](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank} に従って dev tunnel をインストール  
- 次のコマンドで dev tunnel にログイン  

```console
devtunnel user login
```

- 次のコマンドで dev tunnel をホスト  

```console
devtunnel create hr-mcp -a --host-header unchanged
devtunnel port create hr-mcp -p 47002
devtunnel host hr-mcp
```

コマンド ラインに接続情報が表示されます。

![The dev tunnel running in a console window showing the hosting port, the connect via browser URL, and the URL to inspect network activity.](../../../assets/images/make/copilot-studio-06/mcp-server-02.png)

「Connect via browser」URL をコピーしておきます。ブラウザーでその URL にアクセスすると、以下のような確認ページが表示される場合があります。

![The confirmation page to access the MCP server via the dev tunnel. There is a button to "Continue" that you should select.](../../../assets/images/make/copilot-studio-06/mcp-server-03.png)

このラボの演習中は dev tunnel と MCP サーバーを起動したままにしてください。再起動が必要な場合は `devtunnel host hr-mcp` を再実行します。

<cc-end-step lab="mcs6" exercise="1" step="3" />

### 手順 4: MCP サーバーのテスト

ローカル環境で MCP サーバーをテストします。簡単のため [MCP Inspector](https://github.com/modelcontextprotocol/inspector){target=_blank} を使用します。ターミナルを開き、次のコマンドを実行します。

```console
npx @modelcontextprotocol/inspector
```

Node.js が MCP Inspector をダウンロードして実行し、次のような出力が表示されます。

![The output of the MCP inspector when started in a terminal window. You have the proxy port that the MCP Inspector is listening on and the URL of the MCP Inspector.](../../../assets/images/make/copilot-studio-06/mcp-inspector-01.png)

ブラウザーが自動で起動し、次のインターフェースが表示されます。

![The web interface of the MCP Inspector. On the left there are the settings to configure the MCP Server and the "Connect" button to connect to the actual MCP server.](../../../assets/images/make/copilot-studio-06/mcp-inspector-02.png)

MCP Inspector を次の設定で構成します。

- 1️⃣ **Transport type**: Streamable HTTP  
- 2️⃣ **URL**: dev tunnel の「Connect via browser」でコピーした URL  

続いて 3️⃣ **Connect** を選択して MCP サーバーに接続します。緑色のアイコンと **Connected** メッセージが表示されれば成功です。  
画面の Tools セクションで 1️⃣ **List Tools** を選択して MCP サーバーが公開しているツール一覧を取得します。  
次に 2️⃣ **list_candidates** ツールを選択し、3️⃣ **Run tool** でツールを実行します。

![The web interface of the MCP Inspector when listing the tools and invoking the "list_candidates" tool. There are commands to "List Tools", one item for each of the tools offered by the MCP server, and a command "Run tool" to invoke a single tool.](../../../assets/images/make/copilot-studio-06/mcp-inspector-03.png)

成功すると **Success** メッセージとツールの出力が表示されます。  
**History** セクションでは過去の呼び出し履歴を確認できます。

![The web interface of the MCP Inspector when invoking a tool. There is a green successful message and the actual output of the tool invocation.](../../../assets/images/make/copilot-studio-06/mcp-inspector-04.png)

これで Microsoft Copilot Studio のエージェントから MCP サーバーを利用する準備が整いました。

<cc-end-step lab="mcs6" exercise="1" step="4" />

## 演習 2 : Copilot Studio で新しいエージェントを作成

この演習では、演習 1 で構成した MCP サーバーを利用する新しいエージェントを Microsoft Copilot Studio で作成します。

### 手順 1: 新しいエージェントの作成

ブラウザーを開き、対象の Microsoft 365 テナントの作業アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスします。

左ナビゲーション メニューで `Copilot Dev Camp` 環境を選択し、**Create** → **Agent** を選択して新しいエージェントを作成します。

**Skip to configure** を選択し、以下の設定でエージェントを定義します。

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

### 手順 2: エージェントの会話スターターを構成

エージェント作成後、設定ページが表示されます。**Suggested prompts** セクションで次のプロンプトを追加します。

1. Title: `List all candidates` - Prompt: `List all the candidates`  
1. Title: `Search candidates` - Prompt: `Search for candidates with name [NAME_TO_SEARCH]`  
1. Title: `Add new candidate` - Prompt: `Add a candidate with firstname [FIRSTNAME], lastname [LASTNAME],  e-mail [EMAIL], role [ROLE], spoken languages [LANGUAGES], and skills [SKILLS]`  

![The agent configuration page showing the "Suggested prompts" sections filled in with the suggested information.](../../../assets/images/make/copilot-studio-06/configure-agent-01.png)

**Save** を選択して変更を保存します。

<cc-end-step lab="mcs6" exercise="2" step="2" />

## 演習 3 : MCP サーバーと Copilot Studio の統合

この演習では、MCP サーバーと Copilot Studio エージェントの統合を構成します。

### 手順 1: MCP サーバーが公開するツールの追加

エージェントで 1️⃣ **Tools** セクションに移動し、2️⃣ **+ Add a tool** を選択します。

![The "Tools" section of the agent with the "+ Add a tool" command highlighted.](../../../assets/images/make/copilot-studio-06/mcp-integration-01.png)

1️⃣ **Model Context Protocol** グループを選択して利用可能な MCP サーバー一覧を表示します。続いて 2️⃣ **+ New tool** を選択し、HR MCP サーバーを追加します。

![The panel to add new tools, with the "+ New tool" command highlighted.](../../../assets/images/make/copilot-studio-06/mcp-integration-02.png)

表示されるダイアログでツールの種類を選択します。**Model Context Protocol** を選ぶと、公式ドキュメント [Extend your agent with Model Context Protocol](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp){target=_blank} に移動しますが、このラボでは実際に Power Platform のカスタム コネクタを作成します。  
**Custom connector** を選択して進めます。

![The dialog to add a new tool with the "Custom connector" option highlighted.](../../../assets/images/make/copilot-studio-06/mcp-integration-03.png)

新しいブラウザー タブで Power Apps のカスタム コネクタ管理ページが開きます。1️⃣ **+ New custom connector** → 2️⃣ **Import an OpenAPI file** を選択します。

![The dialog to add a new tool with the "Custom connector" option highlighted.](../../../assets/images/make/copilot-studio-06/mcp-integration-04.png)

この作業を保留し、Visual Studio Code に戻って新しいファイルを作成し、次の YAML スキーマを貼り付けます。

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

`host` を dev tunnel のホスト名に置き換えます。  
`https://` や末尾の `/` は含めず、例: `3dcwb74w-47002.euw.devtunnels.ms` のみを設定します。ファイルを保存し、ブラウザーに戻ります。

コネクタ名を `HR MCP Server` など任意で入力し、**Import** を選択して先ほどの OpenAPI ファイルを選択します。ファイルを選択後 **Continue** をクリックします。

![The dialog to create a new "Custom connector" in the current Power Platform environment. There are the name of the connector and the path to the OpenAPI specification YAML file.](../../../assets/images/make/copilot-studio-06/mcp-integration-05.png)

コネクタの設定ページで **Swagger editor** を有効にして OpenAPI のソースを表示し、内容を確認します。

![The "Custom connector" definition page in the current Power Platform environment. There is the "Swagger editor" option selected to see the source code of the OpenAPI specification file.](../../../assets/images/make/copilot-studio-06/mcp-integration-06.png)

**Create connector** を選択して作成が完了するまで待ちます。必要ならコネクタ用アイコンも設定できます。たとえば [こちらのアイコン](https://raw.githubusercontent.com/microsoft/copilot-camp/refs/heads/main/src/make/copilot-studio/path-m-lab-mcs6-mcp/hr-mcp-server-icon.png){target=_blank} をダウンロードして設定し、**Update connector** で保存します。

Copilot Studio に戻り、**Refresh** を選択してツール一覧を更新します。

![The dialog to add a new tool in Copilot Studio with a dialog waiting for you to select the "Refresh" button to reload the list of available tools.](../../../assets/images/make/copilot-studio-06/mcp-integration-07.png)

**Model Context Protocol** リストに `HR MCP Server` が表示されるはずです。

![The list of "Model Context Protocol" tools, including the new "HR MCP Server" connector.](../../../assets/images/make/copilot-studio-06/mcp-integration-08.png)

`HR MCP Server` コネクタを選択し、Copilot Studio の既定の接続 UX でサーバーに接続します。接続後 **Add and configure** を選択します。

![The dialog to add the "HR MCP Server" connector as a tool to the current agent in Copilot Studio. There are buttons to "Add to agent" and to "Add and configure", as well as a button to "Cancel".](../../../assets/images/make/copilot-studio-06/mcp-integration-09.png)

MCP サーバーが公開するすべてのツールがエージェントで利用可能になりました。

![The details about the settings and tools of the MCP server that you just registered. There is the list of tools exposed by the server.](../../../assets/images/make/copilot-studio-06/mcp-integration-10.png)

<cc-end-step lab="mcs6" exercise="3" step="1" />

### 手順 2: MCP サーバー統合のテスト

右上の **Publish** を選択してエージェントを公開します。公開後、統合テスト パネルで次のプロンプトを使用します。

```text
List all candidates
```

エージェントは MCP サーバーの `list_candidates` ツールを使用して候補者一覧を返すはずです。  
ただし一覧を取得するにはコネクタへの接続が必要なため、Copilot Studio から **Open connection manager** が求められます。接続後 **Retry** を選択します。

![The initial dialog with the agent, which prompts the user to open the connection manager to connect to the MCP server and then to retry the request, once the connection is established.](../../../assets/images/make/copilot-studio-06/mcp-test-01.png)

接続が完了すると候補者一覧が取得できます。

![The list of candidates retrieved from the HR MCP Server.](../../../assets/images/make/copilot-studio-06/mcp-test-02.png)

!!! tip "ローカルでの MCP サーバー デバッグ"
    開発者の方は `HRTools.cs` にブレークポイントを設定し、Visual Studio Code でデバッガーをアタッチして MCP サーバーの動作を詳細に確認できます。

エージェントを Microsoft 365 Copilot Chat でも利用可能にできます。1️⃣ **Channels** → 2️⃣ **Teams and Microsoft 365 Copilot** を開き、3️⃣ **Make agent available in Microsoft 365 Copilot** をチェックし、4️⃣ **Add channel** を選択します。チャネルが有効化されたらパネルを閉じ、再度 **Publish** してください。

![The interface to publish an agent in the "Teams and Microsoft 365 Copilot" channel. There is a checkbox to make the agent available in Microsoft 365 Copilot and a command to "Add channel".](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-01.png)

再度 **Teams and Microsoft 365 Copilot** チャネルを開き、**See agent in Microsoft 365** を選択してエージェントを Microsoft 365 Copilot に追加します。

![The interface to publish an agent in the "Teams and Microsoft 365 Copilot" channel with the "See agent in Microsoft 365" command highlighted.](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-02.png)

エージェント追加画面で **Add** → **Open** を選択し、Microsoft 365 Copilot でエージェントを試します。

!!! info "エージェントの詳細"
    **Teams and Microsoft 365 Copilot** チャネル設定パネルで、説明やカスタム アイコンなど追加情報を設定できます。

![The interface to add the agent to Microsoft 365 Copilot. There are information about the agent and a command to "Add" the agent to Microsoft 365 Copilot.](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-03.png)

Microsoft 365 Copilot でエージェントの UI に提案プロンプトが表示されます。たとえば次のプロンプトを試してください。

```text
Search for candidate Alice
```

![The Microsoft 365 Copilot chat interface with the suggested prompts configured for the "HR Agent with MCP" and the prompt "Search for candidate Alice" ready to be processed.](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-01.png)

エージェントは MCP サーバーの `search_candidates` ツールを使用し、該当候補者のみを返します。ただし Microsoft 365 Copilot でもコネクタ接続が必要なため、再度接続マネージャーで接続を行います。

![The Microsoft 365 Copilot chat instructing the user to "Open the connection manager" to verify credentials and connect to the MCP server.](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-02.png)

接続後、再度プロンプトを実行すると期待通りの結果が得られます。

![Microsoft 365 Copilot showing information about the candidate Alice Johnson, who is matching the search criteria defined in the prompt.](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-03.png)

次に `add_candidate` ツールを使い、新しい候補者を追加してみましょう。次のプロンプトを使用します。

```text
Add a new candidate: John Smith, Software Engineer, skills: React, Node.js, 
email: john.smith@email.com, speaks English and Spanish
```

エージェントは意図を理解し、`add_candidate` ツールに必要な入力パラメーターを抽出して実行します。サーバーからは確認メッセージが返されます。

![The agent confirming that a new candidate has been added to the HR system via the MCP Server.](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-04.png)

もう一度候補者一覧を表示すると `John Smith` が追加されていることを確認できます。

![The updated list of candidates retrieved from the HR system via the MCP Server. The newly added candidate with name John Smith is at the end of the list.](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-05.png)

他にも次のようなプロンプトで試してみてください。

```text
Update the candidate with email bob.brown@example.com to speak also French
```

または

```text
Add skill "Project Management" to candidate bob.brown@example.com
```

または

```text
Remove candidate bob.brown@example.com
```

エージェントは適切なツールを呼び出し、プロンプトに従って動作します。

お疲れさまでした！ エージェントは完全に機能し、HR MCP サーバーが公開するすべてのツールを利用できます。

<cc-end-step lab="mcs6" exercise="3" step="2" />

---8<--- "ja/mcs-congratulations.md"

これでラボ MCS6 - MCP サーバーの利用 を完了しました！

<!-- <a href="../07-autonomous">Start here</a> with Lab MCS7, to learn how to create autonomous agents in Copilot Studio.
<cc-next />  -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/06-mcp--ja" />