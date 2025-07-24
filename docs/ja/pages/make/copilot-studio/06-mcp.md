---
search:
  exclude: true
---
# ラボ MCS6 - MCP サーバーの利用

このラボでは、Microsoft Copilot Studio を使って作成されたエージェントを、 MCP (Model Context Protocol) サーバーを利用して拡張する方法を理解していただきます。具体的には、求人候補者リストの管理に関するツールを提供する既存の MCP サーバーを利用します。 MCP サーバーは次の機能を提供します：

- 候補者の全件リスト表示
- 条件による候補者検索
- 新規候補者の追加
- 既存候補者情報の更新
- 候補者の削除

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Y8KpHmmMqzc" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! tip "MCP の概要"
    このラボでは MCP の概念を紹介し、Copilot Studio との統合方法を示します。 MCP は、 AI アシスタントが外部データソースやツールに安全に接続できるようにする新しいプロトコルです。 詳細については、[Model Context Protocol (MCP) for beginners](https://github.com/microsoft/mcp-for-beginners){target=_blank} のトレーニングクラスでご確認ください。

このラボで学ぶ内容：

- 既存の MCP サーバーの構成および接続方法
- 外部サーバーからの MCP ツールとリソースの利用方法
- Copilot Studio エージェントとの MCP サーバー統合方法

## 演習 1 : MCP サーバーのセットアップ

この演習では、 HR 候補者管理機能を提供する事前構築済みの MCP サーバーをセットアップします。サーバーは Microsoft .NET をベースにし、 C# 用 MCP SDK に依存しています。サーバーは、仮想の求人候補者リストの管理ツールを提供します。 この演習では、サーバーをダウンロードし、ローカルで実行できるように構成します。

### ステップ 1 : MCP サーバーおよび前提条件の理解

今回利用する HR MCP サーバーは、以下のツールを提供します：

- **list_candidates** : 候補者の全件リストを提供します
- **search_candidates** : 名前、メール、スキル、または現職による候補者の検索を行います
- **add_candidate** : リストに新しい候補者を追加します
- **update_candidate** : メールをキーとして既存の候補者情報を更新します
- **remove_candidate** : メールをキーとして候補者を削除します

サーバーは、以下を含む候補者情報を管理します：

- 個人詳細（firstname、lastname、フルネーム、email）
- 職業情報（話せる言語、スキル、現職）

開始前に以下を準備してください：

- [.NET 10.0 SDK (preview 6 以上)](https://dotnet.microsoft.com/download/dotnet/10.0){target=_blank}
- [Visual Studio Code](https://code.visualstudio.com/){target=_blank}
- [Node.js v.22 以上](https://nodejs.org/en){target=_blank}
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector){target=_blank}

<cc-end-step lab="mcs6" exercise="1" step="1" />

### ステップ 2 : MCP サーバーのダウンロードと実行

このラボでは、事前構築済みの HR MCP サーバーを利用します。サーバーファイルは、[こちら](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/path-m-lab-mcs6-mcp/hr-mcp-server&filename=hr-mcp-server){target=_blank} からダウンロードしてください。

Zip ファイルを解凍し、対象フォルダーを Visual Studio Code で開きます。 サーバーは既に実装済みで、すぐに実行できます。

![Visual Studio Code 上で HR MCP サーバープロジェクトの概要を示し、サーバーファイルと候補者データが表示されています。](../../../assets/images/make/copilot-studio-06/mcp-server-01.png)

プロジェクトの主な要素は次のとおりです：

- `Configuration` : MCP サーバーの構成設定を定義する `HRMCPServerConfiguration.cs` ファイルが含まれています。
- `Data` : 候補者リストを提供する `candidates.json` ファイルが含まれています。
- `Services` : 候補者リストのロードと管理を行うサービスのインターフェース `ICandidateService.cs` および実装 `CandidateService.cs` が含まれています。
- `Tools` : MCP ツールを定義する `HRTools.cs` ファイルと、ツールで使用するデータモデルを定義する `Models.cs` ファイルが含まれています。
- `DevTunnel_Instructions.MD` : 開発トンネルを利用して MCP サーバーを公開する方法の説明書です。
- `Progam.cs` : プロジェクトのメインエントリーポイントで、ここで MCP サーバーが初期化されます。

Visual Studio Code 内または新たにターミナルウィンドウを起動し、依存関係のインストール、ビルド、 .NET プロジェクトの開始を、次のコマンドで実行してください：

```console
dotnet run
```

MCP サーバーが起動していることを確認してください。 ブラウザーで [http://localhost:47002/](http://localhost:47002/){target=_blank} にアクセスすると、 JSON メッセージ内にエラーが表示されますが、これは MCP サーバーに接続できていることを意味します。

!!! info
    このラボで提供される事前構築済みの HR MCP サーバーは、本番運用向けのソリューションではありません。 メモリ内リストで候補者情報を管理しており、会話セッション間でデータを保持しません。 このラボの目的に合わせたシンプルで利用しやすいソリューションとして開発されています。 プロフェッショナルな開発者の方は、HTTP 経由で公開される MCP サーバー構築の基本を学ぶための出発点と考えていただいても構いません。 必要に応じて、コンテナー アプリを利用し、永続ストレージを追加するなどしてサーバーの改善をご検討ください。 例えば、[こちら](https://github.com/fabianwilliams/hr-mcp-server){target=_blank} では、[Fabian Williams (Microsoft)](https://github.com/fabianwilliams/){target=_blank} によって実装された、より高度なサーバーのバージョンが提供されています。

<cc-end-step lab="mcs6" exercise="1" step="2" />

### ステップ 3 : dev トンネルの構成

次に、 MCP サーバーをパブリック URL で公開する必要があります。 ローカルの開発マシンでサーバーを実行しているため、リバースプロキシーツールを利用して `localhost` をパブリック URL で公開する必要があります。 簡単のため、 Microsoft が提供する dev トンネル ツールを以下の手順に従って利用してください：

- [こちらの手順](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank} に沿って、環境に dev トンネル をインストールしてください。
- 次のコマンドを実行して、 dev トンネル にログインします：

```console
devtunnel user login
```

- 次のコマンドを実行して、 dev トンネル をホストします：

```console
devtunnel create hr-mcp -a --host-header unchanged
devtunnel port create hr-mcp -p 47002
devtunnel host hr-mcp
```

コマンドラインに接続情報が表示されます（ホスティングポート、ブラウザー接続用 URL、ネットワークアクティビティ検査用 URL など）。

「Connect via browser」 の URL をコピーし、安全な場所に保存してください。 ブラウザーを開き、コピーした URL にアクセスします。 dev トンネル経由で MCP サーバーを利用する旨の確認ページが表示される場合がありますので、ご確認の上、進んでください。

![コンソールウィンドウ上で実行中の dev トンネル。ホスティングポート、ブラウザー経由接続の URL、ネットワークアクティビティ検査用の URL が表示されています。](../../../assets/images/make/copilot-studio-06/mcp-server-02.png)

dev トンネル コマンドと MCP サーバーは、演習中はともに実行状態のままにしてください。 再起動が必要な場合は、最後のコマンド `devtunnel host hr-mcp` を再度実行してください。

<cc-end-step lab="mcs6" exercise="1" step="3" />

### ステップ 4 : MCP サーバーのテスト

これで、ローカル環境で MCP サーバーをテストする準備が整いました。 簡単のため、[MCP Inspector](https://github.com/modelcontextprotocol/inspector){target=_blank} をご利用ください。 ターミナルウィンドウを起動し、次のコマンドを実行してください：

```console
npx @modelcontextprotocol/inspector
```

Node.js エンジンが MCP Inspector をダウンロードし実行します。 ターミナルウィンドウには、次のような出力が表示されるはずです。

![ターミナルウィンドウで起動した MCP Inspector の出力。 MCP Inspector がリッスンしているプロキシポートと MCP Inspector の URL が表示されています。](../../../assets/images/make/copilot-studio-06/mcp-inspector-01.png)

ブラウザーが自動的に起動し、以下のインターフェースが表示されます。

![MCP Inspector のウェブインターフェース。左側に MCP サーバーの設定と実際の MCP サーバーへ接続するための「Connect」ボタンがあります。](../../../assets/images/make/copilot-studio-06/mcp-inspector-02.png)

MCP Inspector を以下の設定で構成してください：

- 1️⃣ **Transport type** : Streamable HTTP
- 2️⃣ **URL** : dev トンネルの「Connect via browser」で保存した URL

次に、3️⃣ **Connect** ボタンを選択して MCP サーバーの利用を開始してください。 接続が正常に行われると、接続コマンドの直下に緑色の点と **Connected** というメッセージが表示されます。
次に、画面の Tools セクションから、1️⃣ **List Tools** コマンドを選択して、 MCP サーバーで公開されているツール一覧を取得してください。
さらに、2️⃣ **list_candidates** ツールを選択し、続いて 3️⃣ **Run tool** を選択して、対象ツールを呼び出します。

![ツールの一覧表示と「list_candidates」ツールの呼び出し中の MCP Inspector のウェブインターフェース。 MCP サーバーによって提供される各ツールが表示され、「Run tool」で単一ツールの呼び出しが可能です。](../../../assets/images/make/copilot-studio-06/mcp-inspector-03.png)

正常に応答が返されると、緑色の **Success** メッセージとツール呼び出し結果が表示されます。
**History** セクションで、 MCP サーバーへ送信したすべての呼び出し履歴を確認できます。

![ツールの呼び出し中の MCP Inspector のウェブインターフェース。緑色の成功メッセージと、ツール呼び出し結果が表示されています。](../../../assets/images/make/copilot-studio-06/mcp-inspector-04.png)

これで、 Microsoft Copilot Studio のエージェントから MCP サーバーを利用する準備が整いました。

<cc-end-step lab="mcs6" exercise="1" step="4" />

## 演習 2 : Microsoft Copilot Studio での新規エージェント作成

この演習では、 演習 1 で構成した MCP サーバー を利用する新規エージェントを Microsoft Copilot Studio で作成します。

### ステップ 1 : 新規エージェントの作成

ブラウザーを開き、対象の Microsoft 365 テナントのワーク アカウントを用いて [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、 Microsoft Copilot Studio の利用を開始してください。

[Lab MCS0 - Setup](00-prerequisites.md) の **演習 1** で作成した Copilot Dev Camp 環境を選択し、左側のナビゲーション メニューから **Create** を選択、その後 **Agent** を選んで新しいエージェントを作成してください。

**Skip to configure** を選択し、以下の設定で新規エージェントを定義します：

- **Name** :

```text
HR Agent with MCP
```

- **Description** :

```text
An AI assistant that helps manage HR candidates using MCP server integration 
for comprehensive candidate management
```

- **Instructions** :

```text
You are a helpful HR assistant that specializes in candidate management. You can help users search 
for candidates, check their availability, get detailed candidate information, and add new 
candidates to the system. 
Always provide clear and helpful information about candidates, including their skills, experience, 
contact details, and availability status.
```

![HR Agent with MCP 用の名前、説明、インストラクションが入力された Copilot Studio のエージェント作成ダイアログ。](../../../assets/images/make/copilot-studio-06/create-agent-01.png)

**Create** を選択して、新規エージェントを作成してください。

<cc-end-step lab="mcs6" exercise="2" step="1" />

### ステップ 2 : エージェントの会話スターターの構成

エージェント作成後、エージェント構成ページに移動します。 **Suggested prompts** セクションに、以下の便利なプロンプトを追加してください：

1. タイトル：`List all candidates` - プロンプト：`List all the candidates`
1. タイトル：`Search candidates` - プロンプト：`Search for candidates with name [NAME_TO_SEARCH]`
1. タイトル：`Add new candidate` - プロンプト：`Add a candidate with firstname [FIRSTNAME], lastname [LASTNAME],  e-mail [EMAIL], role [ROLE], spoken languages [LANGUAGES], and skills [SKILLS]`

![提案されたプロンプトが入力されたエージェント構成ページ。](../../../assets/images/make/copilot-studio-06/configure-agent-01.png)

**Save** ボタンを選択して変更内容を保存してください。

<cc-end-step lab="mcs6" exercise="2" step="2" />

## 演習 3 : Copilot Studio との MCP サーバー統合

この演習では、 MCP サーバー と Copilot Studio エージェント間の統合を構成します。

### ステップ 1 : MCP サーバーで公開されているツールの追加

エージェント内で、 1️⃣ **Tools** セクションに移動し、2️⃣ **+ Add a tool** を選択します。

![エージェントの「Tools」セクションで、 "+ Add a tool" コマンドが強調表示されています。](../../../assets/images/make/copilot-studio-06/mcp-integration-01.png)

1️⃣ **Model Context Protocol** グループを選択して、エージェントで利用可能な既存の MCP サーバー一覧を表示します。 次に、2️⃣ **+ New tool** を選択して、実際の HR MCP サーバーを追加します。

![新規ツール追加パネルで、 "+ New tool" コマンドが強調表示されています。](../../../assets/images/make/copilot-studio-06/mcp-integration-02.png)

新規ダイアログが表示され、追加するツールの種類を選択できます。 本稿作成時点では、**Model Context Protocol** オプションを選択すると、公式 Microsoft Copilot Studio ドキュメントページ [Extend your agent with Model Context Protocol](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp){target=_blank} に移動し、 Power Platform カスタム コネクターとして新しい MCP サーバーを追加する方法が説明されます。

本ラボでは、 MCP サーバー用のカスタム コネクターを実際に作成します。 そのため、**Custom connector** を選択し、次の手順に進んでください。 

![「Custom connector」オプションが強調表示された新規ツール追加ダイアログ。](../../../assets/images/make/copilot-studio-06/mcp-integration-03.png)

新しいブラウザー タブが開き、 Power Apps のカスタム コネクターを管理する構成ページが表示されます。 1️⃣ **+ New custom connector** を選択し、次に 2️⃣ **Import an OpenAPI file** を選んでください。

![「Custom connector」オプションが強調表示された新規ツール追加ダイアログ。](../../../assets/images/make/copilot-studio-06/mcp-integration-04.png)

作業を一時中断し、 Visual Studio Code に移動して新規ファイルを作成し、以下の YAML スキーマを貼り付けます。

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

`host` を dev トンネルのパブリック URL の実際のホスト名に置き換えてください。
`host` プロパティの値は、`https://` 接頭辞や末尾の `/` を除いた、例えば `3dcwb74w-47002.euw.devtunnels.ms` のようなものになります。 ファイルを保存し、ブラウザーに戻ってください。 

コネクターの名前を例えば `HR MCP Server` と指定し、**Import** を選択、先ほど作成した OpenAPI ファイルを参照してください。
ファイル選択後、**Continue** をクリックします。

![カスタム コネクター作成時のダイアログ。コネクターの名前と OpenAPI 仕様 YAML ファイルへのパスが表示されています。](../../../assets/images/make/copilot-studio-06/mcp-integration-05.png)

コネクター構成ページで、**Swagger editor** を有効にして、 OpenAPI 仕様のソースコードを表示します。
アップロードした YAML ファイルの内容が表示され、仕様ファイルが正しいことを確認できます。

![現在の Power Platform 環境における「Custom connector」定義ページ。OpenAPI 仕様ファイルのソースコードが表示されています。](../../../assets/images/make/copilot-studio-06/mcp-integration-06.png)

**Create connector** コマンドを選択し、コネクターが準備完了するまでお待ちください。 必要に応じて、コネクター一覧内で識別しやすいようにカスタムアイコンを設定することも可能です。 例えば、[こちら](https://raw.githubusercontent.com/microsoft/copilot-camp/refs/heads/main/src/make/copilot-studio/path-m-lab-mcs6-mcp/hr-mcp-server-icon.png){target=_blank} のアイコンをダウンロードし、カスタム コネクターに設定した後、**Update connector** を選択して変更を反映してください。 

その後、 Copilot Studio に戻り、**Refresh** ボタンを選択して、利用可能なツール一覧を再読み込みしてください。 

![Copilot Studio の新規ツール追加ダイアログで、「Refresh」ボタンを選択するよう促す画面。](../../../assets/images/make/copilot-studio-06/mcp-integration-07.png)

次に、**Model Context Protocol** リスト内に `HR MCP Server` が表示されるはずです。

![新しい「HR MCP Server」コネクターを含む「Model Context Protocol」ツールの一覧。](../../../assets/images/make/copilot-studio-06/mcp-integration-08.png)

`HR MCP Server` コネクターを選択し、 Copilot Studio のデフォルト接続ユーザー エクスペリエンスでサーバーに接続してください。 接続後、**Add and configure** を選択します。

![Copilot Studio のエージェントに「HR MCP Server」コネクターをツールとして追加するためのダイアログ。 "Add to agent" と "Add and configure" のボタン、及び "Cancel" ボタンがあります。](../../../assets/images/make/copilot-studio-06/mcp-integration-09.png)

これで、 MCP サーバーで公開されているすべてのツールがエージェントで利用可能となり、 MCP サーバーの詳細とツールが表示されるウィンドウで確認できます。

![登録した MCP サーバーの設定およびツールの詳細が表示されています。](../../../assets/images/make/copilot-studio-06/mcp-integration-10.png)

<cc-end-step lab="mcs6" exercise="3" step="1" />

### ステップ 2 : 新規 MCP サーバー統合のテスト

右上隅の **Publish** を選択しエージェントを公開してください。 公開後、統合テスト パネルにて、次のプロンプトを利用してエージェントをテストします：

```text
List all candidates
```

エージェントは MCP サーバー の `list_candidates` ツールを利用して、 HR システムに登録されている全候補者のリストを返すはずです。
ただし、候補者リストを利用するためには、対象コネクターへ接続する必要があります。 そのため、 Copilot Studio より **Open connection manager** をクリックして MCP サーバーに接続後、リクエストを再試行するよう促されます。

![エージェントの初期ダイアログ。 MCP サーバーに接続するため、"Open the connection manager" の操作後、接続確立後にリクエスト再試行を促しています。](../../../assets/images/make/copilot-studio-06/mcp-test-01.png)

接続が確立されると、 HR MCP サーバーから実際の候補者リストを取得できます。

![HR MCP サーバーから取得された候補者リスト。](../../../assets/images/make/copilot-studio-06/mcp-test-02.png)

!!! tip "ローカル環境での MCP サーバー デバッグ"
    開発者の方は、 HRTools.cs ファイルにブレークポイントを設定し、 Visual Studio Code からデバッガをアタッチすることで、 MCP サーバーの実装に踏み込んでデバッグすることが可能です。

また、エージェントを Microsoft 365 Copilot Chat 上で利用できるように設定することも可能です。 1️⃣ **Channels** セクションを選択し、次に 2️⃣ **Teams and Microsoft 365 Copilot** チャネルを選択、 3️⃣ **Make agent available in Microsoft 365 Copilot** オプションにチェックを入れ、最後に 4️⃣ **Add channel** コマンドを選択してください。 チャネルが有効になったら、サイドパネルを閉じ、右上隅の **Publish** コマンドを選択してエージェントを再度公開してください。

![Microsoft 365 Copilot チャネル上でエージェントを公開するためのインターフェース。 Microsoft 365 Copilot でエージェントを利用可能にするチェックボックスと "Add channel" コマンドが表示されています。](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-01.png)

その後、再度 **Teams and Microsoft 365 Copilot** チャネルを開き、**See agent in Microsoft 365** コマンドを選択して、エージェントを Microsoft 365 Copilot に追加してください。

![Microsoft 365 Copilot チャネルで "See agent in Microsoft 365" コマンドが強調表示された画面。](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-02.png)

エージェントを Microsoft 365 Copilot に追加するインターフェースが表示されます。 **Add** を選択後、**Open** を選択して、 Microsoft 365 Copilot 上でエージェントをお試しください。

!!! info "エージェント詳細"
    必要に応じて、 **Teams and Microsoft 365 Copilot** チャネルの構成パネルから、エージェントの説明文、カスタムアイコンなどの追加情報も設定可能です。

![Microsoft 365 Copilot にエージェントを追加するためのインターフェース。エージェントの情報と "Add" コマンドが表示されています。](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-03.png)

これで、 Microsoft 365 Copilot 上でエージェントを利用できるようになり、 UI 上に表示される提案プロンプトを確認できます。 例えば、次のプロンプトを試してみてください：

```text
Search for candidate Alice
```

!["HR Agent with MCP" 用に提案されたプロンプトと、"Search for candidate Alice" の問い合わせが処理待ちの Microsoft 365 Copilot チャットインターフェース。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-01.png)

この状態で、エージェントは MCP サーバー の `search_candidates` ツールを利用し、検索条件に一致する候補者を一名だけ返します。 ただし、 Microsoft 365 Copilot のコンテキスト内では、再度 MCP サーバーに接続する必要があり、 Microsoft Copilot Studio の接続管理インターフェースを利用して接続してください。

![MCP サーバーへの接続確認のため、"Open the connection manager" を促す Microsoft 365 Copilot チャット。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-02.png)

接続が確立されると、改めてプロンプトを実行し期待する応答が得られます。

![検索条件に一致する候補者 Alice Johnson の情報が表示された Microsoft 365 Copilot。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-03.png)

次は、より高度なツール、例えば `add_candidate` を利用して HR システムに新規候補者を追加するテストを行います。 次のプロンプトを使用してください：

```text
Add a new candidate: John Smith, Software Engineer, skills: React, Node.js, 
email: john.smith@email.com, speaks English and Spanish
```

エージェントは意図を理解し、 `add_candidate` ツールの入力パラメーターを抽出して呼び出します。 MCP サーバーからの応答は、シンプルな確認メッセージとなります。

![MCP サーバー経由で新規候補者が HR システムに追加されたことを確認するエージェント。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-04.png)

全候補者リストを再度表示して結果を確認することも可能です。 新しく追加された候補者 `John Smith` がリストの末尾に表示されます。

![MCP サーバー経由で取得された HR システムの更新後の候補者一覧。 末尾に John Smith という名前の新規候補者が追加されています。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-05.png)

また、以下のようなプロンプトもお試しください：

```text
Update the candidate with email bob.brown@example.com to speak also French
```

または：

```text
Add skill "Project Management" to candidate bob.brown@example.com
```

または：

```text
Remove candidate bob.brown@example.com
```

エージェントは、プロンプトに応じて適切なツールを呼び出し、動作します。

おめでとうございます！ あなたのエージェントは完全に動作しており、 HR MCP サーバーから公開されるすべてのツールを利用できる状態です。

<cc-end-step lab="mcs6" exercise="3" step="2" />

---8<--- "ja/mcs-congratulations.md"

ラボ MCS6 - MCP サーバーの利用 を完了しました！

<!-- <cc-award path="Make" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/06-mcp" />