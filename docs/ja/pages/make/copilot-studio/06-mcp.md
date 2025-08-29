---
search:
  exclude: true
---
# ラボ MCS6 - MCP サーバーの利用

このラボでは、Microsoft Copilot Studio で作成したエージェントを MCP（Model Context Protocol）サーバーで拡張する方法を学習します。具体的には、架空の求人候補者リストを管理するためのツールを提供する既存の MCP サーバーを利用します。MCP サーバーは以下の機能を提供します。

- すべての候補者を一覧表示  
- 条件で候補者を検索  
- 新しい候補者を追加  
- 既存候補者情報を更新  
- 候補者を削除  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Y8KpHmmMqzc" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要をご確認ください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! tip "MCP について学ぶ"
    このラボでは MCP の概念を紹介し、Copilot Studio との統合方法を示します。MCP は AI アシスタントが外部データソースやツールに安全に接続できるようにする新しいプロトコルです。詳しくは [Model Context Protocol (MCP) for beginners](https://github.com/microsoft/mcp-for-beginners){target=_blank} の資料をご覧ください。

このラボで学ぶこと

- 既存の MCP サーバーを構成して接続する方法  
- 外部サーバーの MCP ツールとリソースを利用する方法  
- MCP サーバーを Copilot Studio エージェントと統合する方法  

## 演習 1 : MCP サーバーのセットアップ

この演習では、人事候補者管理機能を提供する事前構築済み MCP サーバーをセットアップします。サーバーは Microsoft .NET をベースに MCP SDK for C# を使用しています。ここではサーバーをダウンロードして構成し、ローカルで実行できるようにします。

### 手順 1: MCP サーバーと前提条件の理解

このラボで使用する HR MCP サーバーは次のツールを提供します。

- **list_candidates**: 候補者一覧を取得  
- **search_candidates**: 名前、メール、スキル、現在の職務で候補者を検索  
- **add_candidate**: 新しい候補者を追加  
- **update_candidate**: メールアドレスで既存候補者を更新  
- **remove_candidate**: メールアドレスで候補者を削除  

サーバーは次の候補者情報を管理します。

- 個人情報（名、姓、氏名、メール）  
- 職務情報（使用言語、スキル、現在の職務）  

開始前に以下を用意してください。

- [.NET 10.0 SDK (preview 6 以上)](https://dotnet.microsoft.com/download/dotnet/10.0){target=_blank}  
- [Visual Studio Code](https://code.visualstudio.com/){target=_blank}  
- [Node.js v.22 以上](https://nodejs.org/en){target=_blank}  
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector){target=_blank}  

<cc-end-step lab="mcs6" exercise="1" step="1" />

### 手順 2: MCP サーバーのダウンロードと実行

このラボでは、事前構築済み HR MCP サーバーを使用します。サーバーファイルを [こちら](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/path-m-lab-mcs6-mcp/hr-mcp-server&filename=hr-mcp-server){target=_blank} からダウンロードしてください。

zip を展開し、対象フォルダーを Visual Studio Code で開きます。サーバーはすでに実装済みで、すぐに実行できます。

![Visual Studio Code で HR MCP サーバープロジェクトのアウトラインを表示。サーバーファイルと候補者データが見える。](../../../assets/images/make/copilot-studio-06/mcp-server-01.png)

プロジェクトの主な構成要素は次のとおりです。

- `Configuration`: MCP サーバーの構成設定を定義する `HRMCPServerConfiguration.cs`  
- `Data`: 候補者一覧を保持する `candidates.json`  
- `Services`: 候補者一覧を読み込み管理するサービス `ICandidateService.cs` と `CandidateService.cs`  
- `Tools`: MCP ツールを定義する `HRTools.cs` とツールが使用するデータモデルを定義する `Models.cs`  
- `DevTunnel_Instructions.MD`: MCP サーバーを dev tunnel で公開する方法  
- `Progam.cs`: MCP サーバーを初期化するメインエントリーポイント  

Visual Studio Code から新しいターミナルを開くか、別のターミナルを起動し、次のコマンドで依存関係をインストール、ビルド、起動します。

```console
dotnet run
```

MCP サーバーが起動していることを確認します。ブラウザーで [http://localhost:47002/](http://localhost:47002/){target=_blank} にアクセスできれば OK です。JSON のエラーメッセージが表示されますが、これは MCP サーバーに到達していることを示しています。

!!! info
    このラボ付属の HR MCP サーバーは製品環境向けではありません。メモリ上の候補者リストを使用し、複数の会話セッション間でデータを保持しません。HTTP で公開された MCP サーバーの基本を学ぶための単純でわかりやすいサンプルとして提供されています。プロフェッショナル開発者の方は、これを出発点としてコンテナーアプリ化や永続ストレージ追加による改良を検討できます。たとえば [こちら](https://github.com/fabianwilliams/hr-mcp-server){target=_blank} に [Fabian Williams (Microsoft)](https://github.com/fabianwilliams/){target=_blank} が実装したより高度なサーバーがあります。

<cc-end-step lab="mcs6" exercise="1" step="2" />

### 手順 3: dev tunnel の構成

次に、MCP サーバーをパブリック URL で公開する必要があります。ローカル開発マシンでサーバーを実行しているため、リバースプロキシツールを使用して `localhost` を公開 URL にマッピングします。ここでは、Microsoft が提供する dev tunnel ツールを使います。

- [こちらの手順](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank} に従い dev tunnel をインストール  
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

コマンドラインに接続情報が表示されます。

![コンソールで dev tunnel を実行した例。ホスティングポートや「Connect via browser」URL、ネットワークアクティビティを検査する URL が表示。](../../../assets/images/make/copilot-studio-06/mcp-server-02.png)

「Connect via browser」の URL をコピーして保存します。ブラウザーでその URL にアクセスすると、次のような確認ページが表示される場合があります。

![dev tunnel 経由で MCP サーバーにアクセスする際の確認ページ。「Continue」を選択。](../../../assets/images/make/copilot-studio-06/mcp-server-03.png)

このラボの作業中は、dev tunnel のコマンドと MCP サーバーの両方を起動したままにしてください。再起動が必要な場合は `devtunnel host hr-mcp` を再度実行します。

<cc-end-step lab="mcs6" exercise="1" step="3" />

### 手順 4: MCP サーバーのテスト

ローカル環境で MCP サーバーをテストできるようになりました。簡単のために [MCP Inspector](https://github.com/modelcontextprotocol/inspector){target=_blank} を使用します。ターミナルを開き、次のコマンドを実行します。

```console
npx @modelcontextprotocol/inspector
```

Node.js エンジンが MCP Inspector をダウンロードして起動し、ターミナルには次のような出力が表示されます。

![ターミナルで MCP Inspector を起動した時の出力。Inspector がリッスンしているプロキシポートと URL が表示。](../../../assets/images/make/copilot-studio-06/mcp-inspector-01.png)

ブラウザーが自動で起動し、次のインターフェイスが表示されます。

![MCP Inspector の Web インターフェイス。左側に MCP サーバー設定と「Connect」ボタンがある。](../../../assets/images/make/copilot-studio-06/mcp-inspector-02.png)

MCP Inspector を次の設定で構成します。

- 1️⃣ **Transport type**: Streamable HTTP  
- 2️⃣ **URL**: dev tunnel の「Connect via browser」で保存した URL  

次に 3️⃣ **Connect** ボタンを選択して MCP サーバーへの接続を開始します。接続に成功すると、緑の丸と **Connected** メッセージが表示されます。  
画面の Tools セクションで 1️⃣ **List Tools** を選択して MCP サーバーが公開しているツール一覧を取得します。  
続いて 2️⃣ **list_candidates** ツールを選択し、3️⃣ **Run tool** を選択してツールを実行します。

![MCP Inspector でツール一覧を取得し、「list_candidates」ツールを実行している様子。](../../../assets/images/make/copilot-studio-06/mcp-inspector-03.png)

成功すると **Success** と緑で表示され、ツール実行結果が表示されます。**History** セクションでは、MCP サーバーへのすべての呼び出し履歴を確認できます。

![ツール呼び出しが成功し、実行結果が表示されている MCP Inspector の画面。](../../../assets/images/make/copilot-studio-06/mcp-inspector-04.png)

これで Microsoft Copilot Studio のエージェントから MCP サーバーを利用する準備が整いました。

<cc-end-step lab="mcs6" exercise="1" step="4" />

## 演習 2 : Copilot Studio で新しいエージェントを作成

この演習では、演習 1 で構成した MCP サーバーを利用する新しいエージェントを Microsoft Copilot Studio で作成します。

### 手順 1: 新しいエージェントの作成

ブラウザーで、対象 Microsoft 365 テナントの作業アカウントを使用し [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスします。

左ナビゲーションで **Copilot Dev Camp** 環境（[ラボ MCS0 - Setup](00-prerequisites.md) の **演習 1** で作成）を選択し、**Create** → **Agent** の順に選択します。

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

![Copilot Studio のエージェント作成ダイアログ。名前、説明、指示が入力された HR Agent with MCP の例。](../../../assets/images/make/copilot-studio-06/create-agent-01.png)

**Create** を選択してエージェントを作成します。

<cc-end-step lab="mcs6" exercise="2" step="1" />

### 手順 2: 会話スターターの構成

エージェント作成後、エージェント構成ページが開きます。**Suggested prompts** セクションに次のプロンプトを追加します。

1. Title: `List all candidates` - Prompt: `List all the candidates`  
1. Title: `Search candidates` - Prompt: `Search for candidates with name [NAME_TO_SEARCH]`  
1. Title: `Add new candidate` - Prompt: `Add a candidate with firstname [FIRSTNAME], lastname [LASTNAME],  e-mail [EMAIL], role [ROLE], spoken languages [LANGUAGES], and skills [SKILLS]`  

![エージェント構成ページの「Suggested prompts」セクションに情報を入力した例。](../../../assets/images/make/copilot-studio-06/configure-agent-01.png)

**Save** ボタンを選択して変更を保存します。

<cc-end-step lab="mcs6" exercise="2" step="2" />

## 演習 3 : MCP サーバーと Copilot Studio の統合

この演習では、MCP サーバーと Copilot Studio エージェントの統合を構成します。

### 手順 1: MCP サーバーで公開されているツールの追加

エージェントの 1️⃣ **Tools** セクションに移動し、2️⃣ **+ Add a tool** を選択します。

![エージェントの「Tools」セクションで「+ Add a tool」を選択。](../../../assets/images/make/copilot-studio-06/mcp-integration-01.png)

1️⃣ **Model Context Protocol** グループを選択して、エージェントで利用可能な MCP サーバー一覧を表示します。続いて 2️⃣ **+ New tool** を選択して HR MCP サーバーを追加します。

![新しいツール追加パネルで「+ New tool」を選択。](../../../assets/images/make/copilot-studio-06/mcp-integration-02.png)

どの種類のツールを追加するか選択するダイアログが表示されます。執筆時点で **Model Context Protocol** を選択すると、公式ドキュメント [Extend your agent with Model Context Protocol](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp){target=_blank} が開き、Power Platform のカスタムコネクターとして MCP サーバーを追加する方法が案内されます。

このラボでは実際に MCP サーバー用のカスタムコネクターを作成します。**Custom connector** を選択し、以下の手順を進めてください。 

![新しいツール追加ダイアログで「Custom connector」を選択。](../../../assets/images/make/copilot-studio-06/mcp-integration-03.png)

新しいブラウザータブで Power Apps のカスタムコネクター管理ページが開きます。1️⃣ **+ New custom connector** → 2️⃣ **Import an OpenAPI file** を選択します。

![カスタムコネクター作成ダイアログ。「Import an OpenAPI file」を選択。](../../../assets/images/make/copilot-studio-06/mcp-integration-04.png)

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

`host` を dev tunnel のパブリック URL のホスト名に置き換えます。`https://` や末尾の `/` は含めず、例 `3dcwb74w-47002.euw.devtunnels.ms` の形式で指定してください。ファイルを保存し、ブラウザーに戻ります。 

コネクター名に `HR MCP Server` などを入力し、**Import** で先ほど作成した OpenAPI ファイルを選択、**Continue** をクリックします。

![カスタムコネクター作成ダイアログ。コネクター名と OpenAPI 仕様ファイルのパスが入力済み。](../../../assets/images/make/copilot-studio-06/mcp-integration-05.png)

コネクター設定ページで **Swagger editor** を有効にし、OpenAPI 仕様のソースを確認します。

![カスタムコネクター定義ページ。「Swagger editor」で YAML を確認。](../../../assets/images/make/copilot-studio-06/mcp-integration-06.png)

**Create connector** を選択して作成が完了するのを待ちます。必要に応じてカスタムアイコンを設定し、**Update connector** で保存できます。  
Copilot Studio に戻り **Refresh** ボタンを選択してツール一覧を更新します。 

![Copilot Studio でツール一覧更新のため「Refresh」ボタンを選択。](../../../assets/images/make/copilot-studio-06/mcp-integration-07.png)

**Model Context Protocol** 一覧に `HR MCP Server` が表示されます。

![「Model Context Protocol」ツール一覧に新しい「HR MCP Server」コネクターが表示。](../../../assets/images/make/copilot-studio-06/mcp-integration-08.png)

`HR MCP Server` を選択し、Copilot Studio の標準 UI でサーバーへ接続後、**Add and configure** を選択します。

![「HR MCP Server」コネクターをエージェントに追加するダイアログ。「Add and configure」を選択。](../../../assets/images/make/copilot-studio-06/mcp-integration-09.png)

MCP サーバーが公開しているすべてのツールがエージェントで利用可能になりました。詳細ウィンドウで確認できます。

![登録した MCP サーバーの設定とツール一覧。](../../../assets/images/make/copilot-studio-06/mcp-integration-10.png)

<cc-end-step lab="mcs6" exercise="3" step="1" />

### 手順 2: MCP サーバー統合のテスト

右上の **Publish** を選択してエージェントを公開します。公開後、統合テストパネルで次のプロンプトを使用してテストします。

```text
List all candidates
```

エージェントは MCP サーバーの `list_candidates` ツールを使用し、HR システム内の候補者一覧を返すはずです。ただし、候補者一覧を取得するにはコネクターへの接続が必要なため、Copilot Studio から **Open connection manager** が促されます。接続後 **Retry** を選択してください。

![接続マネージャーを開き、MCP サーバーへ接続後にリトライするよう求めるダイアログ。](../../../assets/images/make/copilot-studio-06/mcp-test-01.png)

接続が確立すると、HR MCP サーバーから実際の候補者一覧が返されます。

![HR MCP サーバーから取得した候補者一覧。](../../../assets/images/make/copilot-studio-06/mcp-test-02.png)

!!! tip "ローカルでの MCP サーバーのデバッグ"
    開発者の方は、`HRTools.cs` にブレークポイントを設定し、Visual Studio Code からデバッガーをアタッチして MCP サーバーをデバッグできます。

エージェントを Microsoft 365 Copilot Chat でも利用できるようにするには、1️⃣ **Channels** → 2️⃣ **Teams and Microsoft 365 Copilot** → 3️⃣ **Make agent available in Microsoft 365 Copilot** にチェック → 4️⃣ **Add channel** を選択します。チャンネルが有効になるのを待ち、サイドパネルを閉じて再度 **Publish** してください。

![「Teams and Microsoft 365 Copilot」チャンネルでエージェントを公開する画面。](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-01.png)

再度 **Teams and Microsoft 365 Copilot** チャンネルを開き、**See agent in Microsoft 365** を選択してエージェントを Microsoft 365 Copilot に追加します。

![「See agent in Microsoft 365」を選択してエージェントを追加。](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-02.png)

エージェント追加画面が表示されたら **Add** → **Open** を選択し、Microsoft 365 Copilot でエージェントを試します。

!!! info "エージェントの詳細"
    **Teams and Microsoft 365 Copilot** チャンネル設定パネルでは、説明やカスタムアイコンなど追加情報も設定できます。

![Microsoft 365 Copilot にエージェントを追加する画面。](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-03.png)

エージェントの UI に提案プロンプトが表示されます。たとえば次のプロンプトを試してください。

```text
Search for candidate Alice
```

![Microsoft 365 Copilot チャットで提案プロンプトが表示された HR Agent with MCP。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-01.png)

エージェントは `search_candidates` ツールを使用し、検索条件に一致する候補者を 1 名だけ返すはずです。ただし、Microsoft 365 Copilot では再度 MCP サーバーへの接続が必要になるため、接続マネージャーを開くよう案内されます。

![Microsoft 365 Copilot で接続マネージャーを開くよう指示。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-02.png)

接続後、再度プロンプトを実行すると期待どおりの結果が得られます。

![検索条件に一致した候補者 Alice Johnson の情報を表示。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-03.png)

次は `add_candidate` ツールのような高度なツールを試してみましょう。以下のプロンプトを使用します。

```text
Add a new candidate: John Smith, Software Engineer, skills: React, Node.js, 
email: john.smith@email.com, speaks English and Spanish
```

エージェントは意図を理解し、`add_candidate` ツール用の入力パラメーターを抽出して新しい候補者を追加します。MCP サーバーからは簡単な確認応答が返されます。

![新しい候補者が HR システムに追加されたことを確認するエージェント。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-04.png)

候補者一覧を再度取得して結果を確認すると、末尾に `John Smith` が追加されています。

![更新後の候補者一覧。John Smith がリストの末尾に表示。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-05.png)

以下のようなプロンプトでも試してみてください。

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

エージェントは適切なツールを呼び出し、プロンプトに応じて動作します。

素晴らしい! エージェントは完全に機能し、HR MCP サーバーが公開するすべてのツールを利用できます。

<cc-end-step lab="mcs6" exercise="3" step="2" />

---8<--- "ja/mcs-congratulations.md"

ラボ MCS6 - MCP サーバーの利用 を完了しました!

<!-- <a href="../07-autonomous">Start here</a> with Lab MCS7, to learn how to create autonomous agents in Copilot Studio.
<cc-next />  -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/06-mcp--ja" />