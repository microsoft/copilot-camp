---
search:
  exclude: true
---
# ラボ MCS6 - MCP サーバーの利用

このラボでは、Microsoft Copilot Studio で作成したエージェントを MCP (Model Context Protocol) サーバーで拡張する方法を理解します。具体的には、求人候補者のリストを管理するためのツールを提供する既存の MCP サーバーを利用します。MCP サーバーは次の機能を提供します。

- 候補者の一覧取得  
- 条件での候補者検索  
- 新規候補者の追加  
- 既存候補者情報の更新  
- 候補者の削除  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/???" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を短時間でご覧いただけます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! tip "MCP について学ぶ"
    このラボでは MCP の概念を紹介し、Copilot Studio と統合する方法を示します。MCP は AI アシスタントが外部のデータ ソースやツールに安全に接続できる新しいプロトコルです。詳細は [Model Context Protocol (MCP) for beginners](https://github.com/microsoft/mcp-for-beginners){target=_blank} のトレーニング クラスをご参照ください。

このラボで学ぶこと

- 既存の MCP サーバーを設定して接続する方法  
- 外部サーバーの MCP ツールとリソースを利用する方法  
- MCP サーバーを Copilot Studio エージェントと統合する方法  

## Exercise 1 : MCP サーバーのセットアップ

この演習では、求人候補者管理機能を提供するあらかじめ構築された MCP サーバーをセットアップします。サーバーは Microsoft .NET を基盤とし、C# 向け MCP SDK を使用しています。候補者リストを管理するツールを提供しており、ここではサーバーをダウンロードして構成し、ローカルで実行できるようにします。

### Step 1: MCP サーバーと前提条件の理解

このラボで利用する HR MCP サーバーは、次のツールを提供します。

- **list_candidates**: 候補者の全リストを取得  
- **search_candidates**: 名前、メール、スキル、現在の職種で候補者を検索  
- **add_candidate**: 新しい候補者を追加  
- **update_candidate**: メール アドレスで既存候補者を更新  
- **remove_candidate**: メール アドレスで候補者を削除  

サーバーは次の候補者情報を管理します。

- 個人情報 (firstname, lastname, full name, email)  
- 職務情報 (spoken languages, skills, current role)  

開始する前に次を準備してください。

- [.NET 10.0 SDK (preview 6 以降)](https://dotnet.microsoft.com/download/dotnet/10.0){target=_blank}  
- [Visual Studio Code](https://code.visualstudio.com/){target=_blank}  
- [Node.js v.22 以降](https://nodejs.org/en){target=_blank}  
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector){target=_blank}  

<cc-end-step lab="mcs6" exercise="1" step="1" />

### Step 2: MCP サーバーのダウンロードと実行

このラボでは、事前構築済みの HR MCP サーバーを使用します。サーバー ファイルを [こちら](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/path-m-lab-mcs6-mcp/hr-mcp-server&filename=hr-mcp-server){target=_blank} からダウンロードしてください。

ZIP を展開し、対象フォルダーを Visual Studio Code で開きます。サーバーはすでに実装されており、すぐに実行できます。

![Visual Studio Code に表示された HR MCP サーバー プロジェクトのアウトライン。サーバー ファイルと候補者データが示されています。](../../../assets/images/make/copilot-studio-06/mcp-server-01.png)

プロジェクトの主な構成要素:

- `Configuration`: MCP サーバーの構成設定を定義する `HRMCPServerConfiguration.cs`  
- `Data`: 候補者リストを提供する `candidates.json`  
- `Services`: 候補者リストを読み込み・管理するサービスのインターフェイス `ICandidateService.cs` と実装 `CandidateService.cs`  
- `Tools`: MCP ツールを定義する `HRTools.cs` とツールが使用するデータ モデルを定義する `Models.cs`  
- `DevTunnel_Instructions.MD`: MCP サーバーを dev tunnel で公開する手順  
- `Progam.cs`: MCP サーバーを初期化するメイン エントリ ポイント  

Visual Studio Code 内から新しいターミナル ウィンドウを開くか、新規ターミナルを起動し、次のコマンドで依存関係のインストール、ビルド、起動を行います。

```console
dotnet run
```

MCP サーバーが起動していることを確認します。ブラウザーで [http://localhost:47002/](http://localhost:47002/){target=_blank} にアクセスできるはずです。JSON メッセージでエラーが表示されれば正常です。MCP サーバーに到達していることを意味します。

<cc-end-step lab="mcs6" exercise="1" step="2" />

### Step 3: dev tunnel の構成

次に MCP サーバーをパブリック URL で公開する必要があります。ローカル マシンでサーバーを実行しているため、`localhost` を公開 URL に変換するリバース プロキシ ツールが必要です。ここでは Microsoft 提供の dev tunnel ツールを利用します。

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

![コンソールに表示された dev tunnel の情報。ホスト ポート、ブラウザーで接続する URL、ネットワーク アクティビティを検査する URL が示されています。](../../../assets/images/make/copilot-studio-06/mcp-server-02.png)

「Connect via browser」URL をコピーして保存しておきます。ブラウザーでその URL にアクセスすると、以下のような確認ページが表示される場合があります。

![dev tunnel 経由で MCP サーバーにアクセスする際の確認ページ。「Continue」ボタンを選択します。](../../../assets/images/make/copilot-studio-06/mcp-server-03.png)

ラボを進める間、dev tunnel コマンドと MCP サーバーの両方を実行したままにしてください。再起動が必要な場合は `devtunnel host hr-mcp` を再度実行します。

<cc-end-step lab="mcs6" exercise="1" step="3" />

### Step 4: MCP サーバーのテスト

ローカル環境で MCP サーバーをテストしてみましょう。[MCP Inspector](https://github.com/modelcontextprotocol/inspector){target=_blank} を使用すると簡単です。ターミナルを開いて次のコマンドを実行します。

```console
npx @modelcontextprotocol/inspector
```

Node.js エンジンが MCP Inspector をダウンロードして実行し、ターミナルには次のような出力が表示されます。

![ターミナルで MCP Inspector を起動した際の出力。リッスンしているプロキシ ポートと MCP Inspector の URL が示されています。](../../../assets/images/make/copilot-studio-06/mcp-inspector-01.png)

ブラウザーが自動的に開き、以下のインターフェイスが表示されます。

![MCP Inspector の Web インターフェイス。左側に MCP サーバー設定と「Connect」ボタンがあります。](../../../assets/images/make/copilot-studio-06/mcp-inspector-02.png)

MCP Inspector を次のように設定します。  

- 1️⃣ **Transport type**: Streamable HTTP  
- 2️⃣ **URL**: dev tunnel の「Connect via browser」で保存した URL  

その後、3️⃣ **Connect** を選択して MCP サーバーへの接続を開始します。接続が成功すると緑のアイコンと **Connected** のメッセージが表示されます。  
次に画面の Tools セクションで 1️⃣ **List Tools** を選択して MCP サーバーが公開するツール一覧を取得します。  
続いて 2️⃣ **list_candidates** ツールを選択し、3️⃣ **Run tool** を選択してツールを実行します。

![MCP Inspector でツールを一覧・実行している画面。「list_candidates」ツールを選択して「Run tool」をクリックしています。](../../../assets/images/make/copilot-studio-06/mcp-inspector-03.png)

正常に応答が返ると、緑色の **Success** メッセージとツール呼び出しの出力が表示されます。  
**History** セクションでは、MCP サーバーへのすべての呼び出し履歴を確認できます。

![MCP Inspector でツール実行後の画面。緑色の成功メッセージとツール出力が表示されています。](../../../assets/images/make/copilot-studio-06/mcp-inspector-04.png)

これで Microsoft Copilot Studio のエージェントから MCP サーバーを利用する準備が整いました。

<cc-end-step lab="mcs6" exercise="1" step="4" />

## Exercise 2 : Copilot Studio で新しいエージェントを作成

この演習では、Exercise 1 で構成した MCP サーバーを利用する新しいエージェントを Microsoft Copilot Studio で作成します。

### Step 1: 新しいエージェントの作成

ブラウザーで対象 Microsoft 365 テナントの作業アカウントを使い、[https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスします。

左ナビゲーション メニューから `Copilot Dev Camp` 環境 ( [Lab MCS0 - Setup](00-prerequisites.md) **Exercise 1** で作成 ) を選択し、**Create** を選択して **Agent** を選びます。

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

![Copilot Studio のエージェント作成ダイアログ。名前、説明、Instructions が入力済みです。](../../../assets/images/make/copilot-studio-06/create-agent-01.png)

**Create** を選択してエージェントを作成します。

<cc-end-step lab="mcs6" exercise="2" step="1" />

### Step 2: エージェントの会話スターターを設定

エージェントを作成すると、構成ページが表示されます。**Suggested prompts** セクションで次のプロンプトを追加します。

1. Title: `List all candidates` - Prompt: `List all the candidates`  
1. Title: `Search candidates` - Prompt: `Search for candidates with name [NAME_TO_SEARCH]`  
1. Title: `Add new candidate` - Prompt: `Add a candidate with firstname [FIRSTNAME], lastname [LASTNAME],  e-mail [EMAIL], role [ROLE], spoken languages [LANGUAGES], and skills [SKILLS]`  

![エージェント構成ページ。Suggested prompts に情報が入力されています。](../../../assets/images/make/copilot-studio-06/configure-agent-01.png)

**Save** ボタンを選択して変更を保存します。

<cc-end-step lab="mcs6" exercise="2" step="2" />

## Exercise 3 : MCP サーバーと Copilot Studio の統合

この演習では、MCP サーバーと Copilot Studio エージェントの統合を構成します。

### Step 1: MCP サーバーが公開するツールを追加

エージェント画面で 1️⃣ **Tools** セクションに移動し、2️⃣ **+ Add a tool** を選択します。

![エージェントの「Tools」セクション。「+ Add a tool」が強調表示されています。](../../../assets/images/make/copilot-studio-06/mcp-integration-01.png)

1️⃣ **Model Context Protocol** グループを選択し、2️⃣ **+ New tool** を選択して HR MCP サーバーを追加します。

![新しいツールを追加するパネル。「+ New tool」が強調表示されています。](../../../assets/images/make/copilot-studio-06/mcp-integration-02.png)

ツールの種類を選択するダイアログが表示されます。現時点で **Model Context Protocol** を選択すると、公式ドキュメント [Extend your agent with Model Context Protocol](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp){target=_blank} に遷移します。  
このラボでは実際に MCP サーバー用の Power Platform カスタム コネクタを作成するため、**Custom connector** を選択します。

![新しいツールを追加するダイアログ。「Custom connector」が強調表示されています。](../../../assets/images/make/copilot-studio-06/mcp-integration-03.png)

新しいブラウザー タブで Power Apps のカスタム コネクタ管理ページが開きます。1️⃣ **+ New custom connector** → 2️⃣ **Import an OpenAPI file** を選択します。

![カスタム コネクタ作成ダイアログ。](../../../assets/images/make/copilot-studio-06/mcp-integration-04.png)

このプロセスはいったん保留し、Visual Studio Code に戻って新しいファイルを作成し、次の YAML スキーマを貼り付けます。

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

`host` を dev tunnel のパブリック URL のホスト名に置き換えます。  
`https://` や末尾の `/` は含めず、`3dcwb74w-47002.euw.devtunnels.ms` のようにホスト名のみ設定してください。保存したらブラウザーに戻ります。

コネクタ名として `HR MCP Server` などを入力します。  
**Import** を選択し、先ほど保存した OpenAPI ファイルを選択して **Continue**。

![カスタム コネクタ作成ダイアログ。名前と YAML ファイルパスが入力されています。](../../../assets/images/make/copilot-studio-06/mcp-integration-05.png)

コネクタ設定ページで **Swagger editor** を有効にし、OpenAPI 仕様のソースを確認します。

![カスタム コネクタ定義ページ。「Swagger editor」が選択され、YAML が表示されています。](../../../assets/images/make/copilot-studio-06/mcp-integration-06.png)

**Create connector** を選択し、完了まで待ちます。必要に応じてアイコンを設定し、[こちらのアイコン](https://raw.githubusercontent.com/microsoft/copilot-camp/refs/heads/main/src/make/copilot-studio/path-m-lab-mcs6-mcp/hr-mcp-server-icon.png){target=_blank} を使って **Update connector** で保存しても構いません。

次に Copilot Studio に戻り、**Refresh** を選択してツール一覧を再読み込みします。

![Copilot Studio でツール追加ダイアログ。「Refresh」ボタン待ち状態。](../../../assets/images/make/copilot-studio-06/mcp-integration-07.png)

**Model Context Protocol** リストに `HR MCP Server` が表示されるはずです。

![「Model Context Protocol」ツール一覧に新しい「HR MCP Server」コネクタが表示されています。](../../../assets/images/make/copilot-studio-06/mcp-integration-08.png)

`HR MCP Server` コネクタを選択し、Copilot Studio の既定 UI で接続を作成します。接続後 **Add and configure** を選択します。

![「HR MCP Server」コネクタをエージェントに追加するダイアログ。](../../../assets/images/make/copilot-studio-06/mcp-integration-09.png)

MCP サーバーが公開するすべてのツールがエージェントで利用可能になりました。詳細ウィンドウで確認できます。

![登録した MCP サーバーの設定とツール一覧が表示されています。](../../../assets/images/make/copilot-studio-06/mcp-integration-10.png)

<cc-end-step lab="mcs6" exercise="3" step="1" />

### Step 2: 新しい MCP サーバーをテスト

画面右上の **Publish** を選択してエージェントを公開します。公開後、テスト パネルで次のプロンプトを試します。

```text
List all candidates
```

エージェントは MCP サーバーの `list_candidates` ツールを使用して候補者のリストを返すはずです。  
ただし、リストを取得するにはコネクタへの接続が必要なため、Copilot Studio から **Open connection manager** を開いて MCP サーバーに接続し、その後 **Retry** を求められます。

![エージェント初回ダイアログ。コネクション マネージャーを開いて再試行するようユーザーに求めています。](../../../assets/images/make/copilot-studio-06/mcp-test-01.png)

接続が確立すると、HR MCP サーバーから実際の候補者リストが取得できます。

![HR MCP サーバーから取得した候補者リスト。](../../../assets/images/make/copilot-studio-06/mcp-test-02.png)

続いて次のプロンプトを試してみましょう。

```text
Search for candidate Alice
```

エージェントは `search_candidates` ツールを使い、検索条件に一致する候補者のみを返すはずです。

![HR MCP サーバーから取得した候補者検索結果。](../../../assets/images/make/copilot-studio-06/mcp-test-03.png)

さらに `add_candidate` ツールを用いて新しい候補者を追加する高度な操作を試します。

```text
Add a new candidate: John Smith, Software Engineer, skills: React, Node.js, 
email: john.smith@email.com, speaks English and Spanish
```

エージェントは意図を理解し、`add_candidate` の入力パラメーターを抽出し、ツールを呼び出して候補者を追加します。MCP サーバーからは確認メッセージが返ります。

![MCP サーバー経由で新しい候補者が追加されたことをエージェントが確認。](../../../assets/images/make/copilot-studio-06/mcp-test-04.png)

再度候補者一覧を取得すると、`John Smith` がリストの末尾に追加されていることを確認できます。

![更新された候補者リスト。新しく追加された John Smith が末尾に表示されています。](../../../assets/images/make/copilot-studio-06/mcp-test-05.png)

他にも次のようなプロンプトで試すことができます。

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

エージェントは適切なツールを呼び出し、プロンプトに応じて動作します。

お疲れさまでした! エージェントは完全に機能し、HR MCP サーバーが公開するすべてのツールを利用できます。

<cc-end-step lab="mcs6" exercise="3" step="2" />

---8<--- "ja/mcs-congratulations.md"

Lab MCS6 - MCP サーバーの利用 を完了しました!

<!-- <cc-award path="Make" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/06-mcp" />