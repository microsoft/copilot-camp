---
search:
  exclude: true
---
# ラボ MCS6 - MCP サーバーの利用

このラボでは、Microsoft Copilot Studio で作成したエージェントを MCP（Model Context Protocol） サーバーで拡張する方法を学びます。具体的には、仮想的な求人候補者リストを管理するツールを提供する既存の MCP サーバーを利用します。MCP サーバーは次の機能を提供します:

- すべての候補者を一覧表示  
- 条件で候補者を検索  
- 新しい候補者を追加  
- 既存の候補者情報を更新  
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
    本ラボでは MCP の概念を紹介し、Copilot Studio と統合する方法を説明します。MCP は AI アシスタントが外部データ ソースやツールに安全に接続できる新しいプロトコルです。詳細は [Model Context Protocol (MCP) for beginners](https://github.com/microsoft/mcp-for-beginners){target=_blank} のトレーニング クラスをご覧ください。

このラボで学ぶこと:

- 既存の MCP サーバーの設定と接続方法  
- 外部サーバーの MCP ツールとリソースの利用方法  
- MCP サーバーを Copilot Studio エージェントに統合する方法  

## 演習 1 : MCP サーバーのセットアップ

この演習では、人事（HR）候補者管理機能を提供する事前構築済み MCP サーバーをセットアップします。サーバーは Microsoft .NET をベースに MCP SDK for C# を使用しています。まずサーバーをローカルで実行できるようにダウンロードして構成します。

### 手順 1: MCP サーバーと前提条件の理解

このラボで利用する HR MCP サーバーは次のツールを提供します:

- **list_candidates**: 候補者の一覧を返す  
- **search_candidates**: 名前、メール、スキル、現在の役割で候補者を検索  
- **add_candidate**: 新しい候補者を追加  
- **update_candidate**: メール指定で既存候補者を更新  
- **remove_candidate**: メール指定で候補者を削除  

サーバーが管理する候補者情報:

- 個人情報（firstname、lastname、full name、email）  
- 職務情報（spoken languages、skills、current role）  

開始前に以下を用意してください:

- [.NET 10.0 SDK (preview 6 以降)](https://dotnet.microsoft.com/download/dotnet/10.0){target=_blank}  
- [Visual Studio Code](https://code.visualstudio.com/){target=_blank}  
- [Node.js v.22 以降](https://nodejs.org/en){target=_blank}  
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector){target=_blank}  

<cc-end-step lab="mcs6" exercise="1" step="1" />

### 手順 2: MCP サーバーのダウンロードと実行

本ラボでは事前構築済みの HR MCP サーバーを使用します。サーバー ファイルを [こちら](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/path-m-lab-mcs6-mcp/hr-mcp-server&filename=hr-mcp-server){target=_blank} からダウンロードしてください。

ZIP を展開し、対象フォルダーを Visual Studio Code で開きます。サーバーはすでに実装済みで、すぐに実行できます。

![Visual Studio Code で表示された HR MCP サーバー プロジェクトのアウトライン。サーバー ファイルと候補者データが表示されている。](../../../assets/images/make/copilot-studio-06/mcp-server-01.png)

プロジェクト アウトラインの主な要素:

- `Configuration`: MCP サーバーの設定を定義する `HRMCPServerConfiguration.cs`  
- `Data`: 候補者リストを提供する `candidates.json`  
- `Services`: 候補者リストを読み込み管理する `ICandidateService.cs` インターフェースと `CandidateService.cs` 実装  
- `Tools`: MCP ツールを定義する `HRTools.cs` とツールが使用するデータ モデルを定義する `Models.cs`  
- `DevTunnel_Instructions.MD`: MCP サーバーを dev tunnel で公開する手順  
- `Progam.cs`: MCP サーバーを初期化するメイン エントリ ポイント  

Visual Studio Code 内で新しいターミナルを開くか通常のターミナルを起動し、次のコマンドで依存関係のインストール、ビルド、実行を行います:

```console
dotnet run
```

MCP サーバーが起動していることを確認します。ブラウザーで [http://localhost:47002/](http://localhost:47002/){target=_blank} にアクセスすると、JSON 形式のエラーメッセージが表示されますが正常です。これは MCP サーバーに接続できていることを示します。

!!! info
    本ラボ付属の HR MCP サーバーは本番環境向けではありません。メモリ内リストを使用しており、複数の会話セッション間でデータを保持しません。HTTP で公開された MCP サーバー構築の基本を学ぶ出発点としてご利用ください。コンテナー アプリ化や永続ストレージ追加などで改善することも可能です。例えば、[こちら](https://github.com/fabianwilliams/hr-mcp-server){target=_blank} には [Fabian Williams (Microsoft)](https://github.com/fabianwilliams/){target=_blank} によるより高度なサーバー実装があります。

<cc-end-step lab="mcs6" exercise="1" step="2" />

### 手順 3: dev tunnel の構成

次に MCP サーバーをパブリック URL で公開します。ローカル開発マシン上の `localhost` を公開するにはリバース プロキシ ツールが必要です。簡易的には Microsoft 提供の dev tunnel ツールを使用します:

- [こちらの手順](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank} に従い dev tunnel をインストール  
- 次のコマンドで dev tunnel にログイン:

```console
devtunnel user login
```

- 次のコマンドで dev tunnel をホスト:

```console
devtunnel create hr-mcp -a --host-header unchanged
devtunnel port create hr-mcp -p 47002
devtunnel host hr-mcp
```

コマンドラインに接続情報が表示されます。

![dev tunnel がコンソールで実行中。ホスティング ポート、ブラウザー経由接続 URL、ネットワーク アクティビティ確認用 URL が表示されている。](../../../assets/images/make/copilot-studio-06/mcp-server-02.png)

「Connect via browser」 の URL をコピーして保存してください。ブラウザーでその URL にアクセスすると、次のような確認ページが表示され、MCP サーバーへのアクセスを許可する必要があります。

![dev tunnel 経由で MCP サーバーにアクセスする際の確認ページ。「Continue」 ボタンを選択する必要がある。](../../../assets/images/make/copilot-studio-06/mcp-server-03.png)

ラボ中は dev tunnel コマンドと MCP サーバーの両方を実行したままにしてください。再起動が必要な場合は `devtunnel host hr-mcp` を再度実行します。

<cc-end-step lab="mcs6" exercise="1" step="3" />

### 手順 4: MCP サーバーのテスト

ローカル環境で MCP サーバーをテストします。簡単のため [MCP Inspector](https://github.com/modelcontextprotocol/inspector){target=_blank} を使います。ターミナルを開き、次のコマンドを実行:

```console
npx @modelcontextprotocol/inspector
```

Node.js が MCP Inspector をダウンロードして実行し、以下のような出力が表示されます。

![ターミナルで MCP Inspector を起動した際の出力。プロキシ ポートと MCP Inspector の URL が表示されている。](../../../assets/images/make/copilot-studio-06/mcp-inspector-01.png)

ブラウザーが自動で開き、次のインターフェイスが表示されます。

![MCP Inspector の Web インターフェイス。左側に MCP サーバー接続設定と「Connect」ボタンがある。](../../../assets/images/make/copilot-studio-06/mcp-inspector-02.png)

MCP Inspector を次の設定で構成します:

- 1️⃣ **Transport type**: Streamable HTTP  
- 2️⃣ **URL**: dev tunnel の「Connect via browser」でコピーした URL  

続いて 3️⃣ **Connect** ボタンを選択して MCP サーバーに接続します。成功すると緑色の丸と **Connected** メッセージが表示されます。  
画面の Tools セクションで 1️⃣ **List Tools** を選択して MCP サーバーが公開するツール一覧を取得します。  
次に 2️⃣ **list_candidates** ツールを選択し、3️⃣ **Run tool** を選択して実行します。

![MCP Inspector でツール一覧を取得し「list_candidates」ツールを実行する様子。](../../../assets/images/make/copilot-studio-06/mcp-inspector-03.png)

成功すると **Success** メッセージとツールの出力が表示されます。  
**History** セクションでは送信したすべての呼び出しを確認できます。

![MCP Inspector でツール呼び出し成功時の画面。緑色の成功メッセージと出力が表示されている。](../../../assets/images/make/copilot-studio-06/mcp-inspector-04.png)

これで Microsoft Copilot Studio のエージェントから MCP サーバーを利用する準備が整いました。

<cc-end-step lab="mcs6" exercise="1" step="4" />

## 演習 2 : Copilot Studio で新しいエージェントを作成

この演習では、演習 1 で構成した MCP サーバーを利用する新しい Copilot Studio エージェントを作成します。

### 手順 1: 新しいエージェントの作成

ブラウザーで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、対象 Microsoft 365 テナントのワーク アカウントでサインインします。

左メニューで `Copilot Dev Camp` 環境（[ラボ MCS0 - Setup](00-prerequisites.md) の **Exercise 1** で作成）を選択し、**Create** を選択後 **Agent** を選択して新しいエージェントを作成します。

**Skip to configure** を選択し、次の設定でエージェントを定義します:

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

![Copilot Studio のエージェント作成ダイアログ。名前、説明、instructions が入力されている。](../../../assets/images/make/copilot-studio-06/create-agent-01.png)

**Create** を選択してエージェントを作成します。

<cc-end-step lab="mcs6" exercise="2" step="1" />

### 手順 2: エージェントの会話スターターの設定

エージェント作成後、設定ページが表示されます。**Suggested prompts** セクションに以下を追加します:

1. Title: `List all candidates` - Prompt: `List all the candidates`  
1. Title: `Search candidates` - Prompt: `Search for candidates with name [NAME_TO_SEARCH]`  
1. Title: `Add new candidate` - Prompt: `Add a candidate with firstname [FIRSTNAME], lastname [LASTNAME],  e-mail [EMAIL], role [ROLE], spoken languages [LANGUAGES], and skills [SKILLS]`  

![エージェント設定ページの「Suggested prompts」セクションに情報が入力されている。](../../../assets/images/make/copilot-studio-06/configure-agent-01.png)

**Save** ボタンを選択して変更を保存します。

<cc-end-step lab="mcs6" exercise="2" step="2" />

## 演習 3 : MCP サーバーと Copilot Studio の統合

この演習では MCP サーバーと Copilot Studio エージェントの統合を構成します。

### 手順 1: MCP サーバーが公開するツールの追加

エージェントで 1️⃣ **Tools** セクションに移動し、2️⃣ **+ Add a tool** を選択します。

![エージェントの「Tools」セクションで「+ Add a tool」を選択する様子。](../../../assets/images/make/copilot-studio-06/mcp-integration-01.png)

1️⃣ **Model Context Protocol** グループを選び、既存 MCP サーバーの一覧を確認します。続いて 2️⃣ **+ New tool** を選択して HR MCP サーバーを追加します。

![新しいツール追加パネルで「+ New tool」を選択する様子。](../../../assets/images/make/copilot-studio-06/mcp-integration-02.png)

ツールの種類を選択するダイアログが表示されます。現時点で **Model Context Protocol** を選ぶと Microsoft Copilot Studio の公式ドキュメント [Extend your agent with Model Context Protocol](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp){target=_blank} に遷移します。

本ラボでは MCP サーバー用の Power Platform カスタム コネクタを実際に作成します。**Custom connector** を選択して進めます。

![新しいツール追加ダイアログで「Custom connector」を選択。](../../../assets/images/make/copilot-studio-06/mcp-integration-03.png)

新しいブラウザー タブで Power Apps のカスタム コネクタ設定ページが開きます。1️⃣ **+ New custom connector**、次に 2️⃣ **Import an OpenAPI file** を選択します。

![カスタム コネクタ作成ページで「Import an OpenAPI file」を選択。](../../../assets/images/make/copilot-studio-06/mcp-integration-04.png)

このまま保留し、Visual Studio Code に移動して新しいファイルを作成し、次の YAML スキーマを貼り付けます。

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
`https://` プレフィックスや末尾の `/` は含めず、例: `3dcwb74w-47002.euw.devtunnels.ms` のみを入力します。ファイルを保存してブラウザーに戻ります。

コネクタ名に `HR MCP Server` などを入力し、**Import** を選択して先ほどの OpenAPI ファイルを指定します。ファイル選択後 **Continue** をクリックします。

![カスタム コネクタ作成ダイアログ。コネクタ名と OpenAPI ファイル パスが入力されている。](../../../assets/images/make/copilot-studio-06/mcp-integration-05.png)

コネクタ設定ページで **Swagger editor** を有効にして OpenAPI ソースを確認し、ファイルが正しいことを検証します。

![カスタム コネクタ定義ページ。Swagger editor で OpenAPI ソースを表示。](../../../assets/images/make/copilot-studio-06/mcp-integration-06.png)

**Create connector** を選択して作成が完了するまで待ちます。必要に応じてアイコンを設定し **Update connector** で保存します。アイコンは [こちら](https://raw.githubusercontent.com/microsoft/copilot-camp/refs/heads/main/src/make/copilot-studio/path-m-lab-mcs6-mcp/hr-mcp-server-icon.png){target=_blank} からダウンロードできます。

Copilot Studio に戻り **Refresh** を選択して利用可能なツール一覧を更新します。

![ツール追加ダイアログで「Refresh」を選択し一覧を更新。](../../../assets/images/make/copilot-studio-06/mcp-integration-07.png)

**Model Context Protocol** リストに `HR MCP Server` が表示されるはずです。

![「Model Context Protocol」ツール一覧に新しい「HR MCP Server」コネクタが表示。](../../../assets/images/make/copilot-studio-06/mcp-integration-08.png)

`HR MCP Server` を選択し、Copilot Studio の既定の接続 UX でサーバーに接続します。接続後 **Add and configure** を選択します。

![「HR MCP Server」コネクタをエージェントに追加するダイアログ。](../../../assets/images/make/copilot-studio-06/mcp-integration-09.png)

MCP サーバーが公開するすべてのツールがエージェントで利用可能になったことを確認できます。

![登録した MCP サーバーの設定とツール一覧を表示。](../../../assets/images/make/copilot-studio-06/mcp-integration-10.png)

<cc-end-step lab="mcs6" exercise="3" step="1" />

### 手順 2: MCP サーバー統合のテスト

右上の **Publish** を選択してエージェントを公開します。公開後、統合 Test パネルで次のプロンプトを試します:

```text
List all candidates
```

エージェントは MCP サーバーの `list_candidates` ツールを使用して候補者一覧を返します。ただし候補者リストを取得するにはコネクタへの接続が必要なため、Copilot Studio から **Open connection manager** が求められます。接続後 **Retry** してください。

![接続マネージャーを開き MCP サーバーに接続してから再試行するよう促すダイアログ。](../../../assets/images/make/copilot-studio-06/mcp-test-01.png)

接続が完了すると HR MCP サーバーから候補者リストを取得できます。

![HR MCP サーバーから取得した候補者リスト。](../../../assets/images/make/copilot-studio-06/mcp-test-02.png)

!!! tip "ローカルでの MCP サーバー デバッグ"
    開発者の方は Visual Studio Code で HRTools.cs にブレークポイントを設定し、デバッガーをアタッチして MCP サーバーの動作を確認できます。

エージェントを Microsoft 365 Copilot Chat にも公開できます。1️⃣ **Channels** セクションで 2️⃣ **Teams and Microsoft 365 Copilot** チャンネルを選択し、3️⃣ **Make agent available in Microsoft 365 Copilot** をチェック、4️⃣ **Add channel** を選択します。チャンネルが有効になったら閉じ、再度 **Publish** してください。

![「Teams and Microsoft 365 Copilot」チャネルへの公開インターフェイス。](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-01.png)

再度 **Teams and Microsoft 365 Copilot** チャンネルを開き **See agent in Microsoft 365** を選択してエージェントを追加します。

![「See agent in Microsoft 365」コマンドが強調表示されたインターフェイス。](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-02.png)

エージェントを追加する画面が表示されるので **Add** → **Open** を選択して Microsoft 365 Copilot でエージェントを試します。

!!! info "エージェント詳細"
    **Teams and Microsoft 365 Copilot** チャネル設定パネルで説明やカスタム アイコンなどの詳細を設定できます。

![エージェントを Microsoft 365 Copilot に追加する画面。](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-03.png)

Microsoft 365 Copilot でエージェントを起動すると、設定した Suggested prompts が表示されます。例えば次のプロンプトを試します:

```text
Search for candidate Alice
```

![Microsoft 365 Copilot のチャット UI。Suggested prompts と「Search for candidate Alice」のプロンプトが表示されている。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-01.png)

エージェントは `search_candidates` ツールを使用し、検索条件に一致する候補者のみ返します。ただし Microsoft 365 Copilot では再度 MCP サーバーへの接続が必要なため、接続マネージャーを開くよう求められます。

![Microsoft 365 Copilot が接続マネージャーを開くよう指示。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-02.png)

接続後に再実行すると期待どおりの結果が得られます。

![検索条件に一致する Alice Johnson の情報が表示。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-03.png)

次に `add_candidate` ツールを使って新しい候補者を追加してみましょう。次のプロンプトを使用します:

```text
Add a new candidate: John Smith, Software Engineer, skills: React, Node.js, 
email: john.smith@email.com, speaks English and Spanish
```

エージェントは意図を理解し、`add_candidate` ツールを呼び出して候補者を追加します。MCP サーバーからは確認メッセージが返ります。

![新しい候補者が HR システムに追加されたことを確認するエージェントの応答。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-04.png)

候補者一覧を再取得して `John Smith` が追加されていることを確認できます。

![更新された候補者リスト。John Smith が末尾に追加されている。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-05.png)

他にも次のようなプロンプトで試してみましょう:

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

エージェントは適切なツールを呼び出してプロンプトに応じた処理を行います。

お疲れさまでした! エージェントは HR MCP サーバーが公開するすべてのツールを利用できるようになりました。

<cc-end-step lab="mcs6" exercise="3" step="2" />

---8<--- "ja/mcs-congratulations.md"

ラボ MCS6 - MCP サーバーの利用 を完了しました!

<!-- <cc-award path="Make" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/06-mcp" />