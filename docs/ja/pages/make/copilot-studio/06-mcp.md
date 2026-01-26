---
search:
  exclude: true
---
# ラボ MCS6 - MCP サーバーの利用

このラボでは、Microsoft Copilot Studio で作成したエージェントを MCP (Model Context Protocol) サーバーで拡張する方法を学びます。具体的には、架空の求人候補者リストを管理するツールを提供する既存の MCP サーバーを利用します。MCP サーバーは次の機能を提供します。

- 候補者の一覧取得  
- 条件で候補者を検索  
- 新しい候補者の追加  
- 既存候補者情報の更新  
- 候補者の削除  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Y8KpHmmMqzc" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を短時間で確認しましょう。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! tip "MCP について学ぶ"
    このラボでは MCP の概念を紹介し、Copilot Studio と統合する方法を示します。MCP は AI アシスタントが外部データ ソースやツールに安全に接続できる新しいプロトコルです。詳細は [Model Context Protocol (MCP) for beginners](https://github.com/microsoft/mcp-for-beginners){target=_blank} のトレーニング教材をご覧ください。

このラボで学ぶ内容:

- 既存の MCP サーバーを構成して接続する方法  
- 外部サーバーの MCP ツールとリソースを利用する方法  
- Copilot Studio エージェントと MCP サーバーを統合する方法  

## Exercise 1 : MCP サーバーのセットアップ

この演習では、求人候補者管理機能を提供する事前構築済み MCP サーバーをセットアップします。サーバーは Microsoft .NET ベースで、C# 用の MCP SDK を使用しています。ここではサーバーをローカルで実行できるようにダウンロードして構成します。

### Step 1: MCP サーバーと前提条件の理解

このラボで利用する HR MCP サーバーは、次のツールを提供します。

- **list_candidates**: 候補者の全リストを取得  
- **search_candidates**: 名前、メール、スキル、現在の役職で候補者を検索  
- **add_candidate**: 新しい候補者を追加  
- **update_candidate**: メールで既存候補者を更新  
- **remove_candidate**: メールで候補者を削除  

サーバーは次の候補者情報を管理します。

- 個人情報 (firstname、lastname、full name、email)  
- 職務関連情報 (spoken languages、skills、current role)  

開始前に以下を準備してください。

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0){target=_blank}  
- [Visual Studio Code](https://code.visualstudio.com/){target=_blank}  
- [Node.js v.22 以上](https://nodejs.org/en){target=_blank}  
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector){target=_blank}  
- [Dev tunnel](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank}  

<cc-end-step lab="mcs6" exercise="1" step="1" />

### Step 2: MCP サーバーのダウンロードと実行

このラボでは、事前構築済みの HR MCP サーバーを使用します。[こちら](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/path-m-lab-mcs6-mcp/hr-mcp-server&filename=hr-mcp-server){target=_blank} からサーバーファイルをダウンロードしてください。

ZIP を展開し、Visual Studio Code でフォルダーを開きます。サーバーは実装済みで、すぐに実行できます。

![Visual Studio Code で HR MCP サーバー プロジェクトのアウトラインを表示している。サーバーファイルと候補者データが見える。](../../../assets/images/make/copilot-studio-06/mcp-server-01.png)

プロジェクトの主な要素は次のとおりです。

- `Configuration`: MCP サーバーの構成を定義する `HRMCPServerConfiguration.cs`  
- `Data`: 候補者リストを提供する `candidates.json`  
- `Services`: 候補者リストを読み込み管理する `ICandidateService.cs` と `CandidateService.cs`  
- `Tools`: MCP ツールを定義する `HRTools.cs` とツールで使用するデータモデルを定義する `Models.cs`  
- `DevTunnel_Instructions.MD`: MCP サーバーを dev tunnel で公開する手順  
- `Progam.cs`: MCP サーバーを初期化するメイン エントリポイント  

Visual Studio Code から新しいターミナルを開くか、通常のターミナルで MCP サーバープロジェクトのルートフォルダーへ移動し、次のコマンドで依存関係のインストール、ビルド、および実行を行います。

```console
dotnet run
```

MCP サーバーが起動していることを確認します。ブラウザーで [http://localhost:47002/](http://localhost:47002/){target=_blank} にアクセスすると、JSON 形式のエラーメッセージが表示されます。これは MCP サーバーに到達できていることを意味します。

!!! info
    このラボ付属の HR MCP サーバーは本番環境向けではありません。メモリ内リストで動作し、複数の会話セッション間でデータを保持しません。HTTP で公開する MCP サーバー構築の基礎を理解する出発点として提供しています。たとえば、[こちら](https://github.com/fabianwilliams/hr-mcp-server){target=_blank} には [Fabian Williams (Microsoft)](https://github.com/fabianwilliams/){target=_blank} が実装した、コンテナーアプリと永続ストレージを備えたより高度なサーバーがあります。

<cc-end-step lab="mcs6" exercise="1" step="2" />

### Step 3: Dev tunnel の構成

次に、MCP サーバーを公開 URL でアクセスできるようにします。ローカル環境でサーバーを実行しているため、`localhost` を公開 URL へ変換するリバース プロキシ ツールが必要です。ここでは Microsoft 提供の dev tunnel を使用します。

1. [手順](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank} に従って dev tunnel をインストール  
2. 次のコマンドで dev tunnel にサインイン  

```console
devtunnel user login
```

3. 次のコマンドで dev tunnel をホスト  

!!! important
    下記の `hr-mcp` 名は一意にする必要があります。例えば Rose さんなら `hr-mcp-rose` のように変更してください。`Request not permitted. Unauthorized tunnel creation access ...` といったエラーが出た場合は既に使用されている名前ですので、別名を指定してください。

```console
devtunnel create hr-mcp -a --host-header unchanged
devtunnel port create hr-mcp -p 47002
devtunnel host hr-mcp
```

実行後、接続情報が表示されます。

![コンソールで dev tunnel を実行している。ホストポート、ブラウザーでの接続 URL、ネットワークアクティビティ確認用 URL が表示される。](../../../assets/images/make/copilot-studio-06/mcp-server-02.png)

「Connect via browser」の URL をコピーして保存します。ブラウザーでその URL にアクセスすると、次のような確認ページが表示される場合があります。

![dev tunnel で MCP サーバーにアクセスする確認ページ。「Continue」ボタンを選択する。](../../../assets/images/make/copilot-studio-06/mcp-server-03.png)

ラボ中は dev tunnel コマンドと MCP サーバーの両方を起動したままにしてください。再起動が必要な場合は `devtunnel host hr-mcp` を再実行します。

<cc-end-step lab="mcs6" exercise="1" step="3" />

### Step 4: MCP サーバーのテスト

ローカル環境で MCP サーバーをテストします。シンプルに [MCP Inspector](https://github.com/modelcontextprotocol/inspector){target=_blank} を利用しましょう。ターミナルで次のコマンドを実行します。

```console
npx @modelcontextprotocol/inspector
```

Node.js が MCP Inspector をダウンロード・実行し、ターミナルには次のような出力が表示されます。

![ターミナルで MCP Inspector を起動した際の出力。プロキシ ポートと MCP Inspector の URL が示される。](../../../assets/images/make/copilot-studio-06/mcp-inspector-01.png)

ブラウザーが自動起動し、以下の画面が表示されます。

![MCP Inspector の Web インターフェース。左側に MCP サーバー設定と "Connect" ボタンがある。](../../../assets/images/make/copilot-studio-06/mcp-inspector-02.png)

次のように設定します。

- 1️⃣ **Transport type**: Streamable HTTP  
- 2️⃣ **URL**: dev tunnel の「Connect via browser」URL  

3️⃣ **Connect** を選択して MCP サーバーへ接続します。緑色の丸と **Connected** メッセージが表示されれば成功です。  
続いて画面の Tools セクションで 1️⃣ **List Tools** を選択し、サーバーが公開するツール一覧を取得します。  
2️⃣ **list_candidates** ツールを選択し、3️⃣ **Run tool** を押してツールを呼び出します。

![MCP Inspector でツール一覧を取得し "list_candidates" ツールを実行する様子。](../../../assets/images/make/copilot-studio-06/mcp-inspector-03.png)

成功すると緑色で **Success** と表示され、ツールの出力が確認できます。  
**History** セクションでは送信履歴を確認できます。

![MCP Inspector でツール呼び出し成功後の画面。緑色の成功メッセージと出力が表示。](../../../assets/images/make/copilot-studio-06/mcp-inspector-04.png)

これで Microsoft Copilot Studio のエージェントから MCP サーバーを利用する準備が整いました。

<cc-end-step lab="mcs6" exercise="1" step="4" />

## Exercise 2 : Copilot Studio で新しいエージェントを作成

この演習では、Exercise 1 で構成した MCP サーバーを利用する Copilot Studio エージェントを作成します。

### Step 1: 新しいエージェントの作成

ブラウザーで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、対象 Microsoft 365 テナントの作業アカウントでサインインします。

**Lab MCS0 - Setup** (00-prerequisites.md) の **Exercise 1** で作成した `Copilot Dev Camp` 環境を選択し、画面中央の **Create an agent** を選択してエージェントを作成します。

次の設定でエージェントを構成します。

- **Name**:

```text
HR Candidate Management
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

- **Agent's Model**: GTP-5 Chat を選択

![Copilot Studio のエージェント「Overview」ページ。名前、説明、モデル、指示が入力された "HR Candidate Management" エージェントが表示。](../../../assets/images/make/copilot-studio-06/create-agent-01.png)

**Publish** を選択してエージェントを公開します。

<cc-end-step lab="mcs6" exercise="2" step="1" />

### Step 2: エージェントの会話スターター設定

**Overview** ページで **Suggested prompts** セクションを次のように追加します。

1. Title: `List all candidates` - Prompt: `List all the candidates`  
2. Title: `Search candidates` - Prompt: `Search for candidates with name [NAME_TO_SEARCH]`  
3. Title: `Add new candidate` - Prompt: `Add a candidate with firstname [FIRSTNAME], lastname [LASTNAME],  e-mail [EMAIL], role [ROLE], spoken languages [LANGUAGES], and skills [SKILLS]`  

![エージェント設定ページで "Suggested prompts" セクションが入力されている。](../../../assets/images/make/copilot-studio-06/configure-agent-01.png)

**Save** を選択して変更を保存します。

<cc-end-step lab="mcs6" exercise="2" step="2" />

## Exercise 3 : MCP サーバーと Copilot Studio の統合

この演習では、MCP サーバーと Copilot Studio エージェントの統合を構成します。

### Step 1: MCP サーバーが公開するツールの追加

エージェントで 1️⃣ **Tools** セクションへ移動し、2️⃣ **+ Add a tool** を選択します。

![エージェントの "Tools" セクションで "+ Add a tool" コマンドが強調表示。](../../../assets/images/make/copilot-studio-06/mcp-integration-01.png)

1️⃣ **Model Context Protocol** グループを選択して、既に利用可能な MCP サーバーを確認します。次に 2️⃣ **+ New tool** を選択して HR MCP サーバーを追加します。

![新しいツールを追加するパネルで "+ New tool" コマンドが強調表示。](../../../assets/images/make/copilot-studio-06/mcp-integration-02.png)

ツールの種類を選択するダイアログで **Model Context Protocol** を選択します。

![新しいツール追加ダイアログで "Model Context Protocol" オプションが強調表示。](../../../assets/images/make/copilot-studio-06/mcp-integration-03.png)

新しい MCP サーバーの名前、説明、URL、認証方法を入力するダイアログが開きます。

- Name: `HR MCP Server`  
- Description: `Allows managing a list of candidates for the HR department`  
- URL: dev tunnel の `[Connect via browser of your dev tunnel]`  
- Authentication: **None**  

入力後 **Create** を選択します。

![MCP サーバー追加ダイアログ。サーバー名、説明、URL、認証方法を設定し "Create" を押す。](../../../assets/images/make/copilot-studio-06/mcp-integration-04.png)

ツールが作成されると、MCP サーバーへの接続を求めるダイアログが表示されます。

![MCP サーバー接続ダイアログ。"Connection" ステータスが "Not connected"。](../../../assets/images/make/copilot-studio-06/mcp-integration-05.png)

`Not connected` を選択し **Create a new connection** をクリックして接続設定を行います。

![MCP サーバーへの "Create a new connection" オプション。](../../../assets/images/make/copilot-studio-06/mcp-integration-06.png)

接続が完了したら **Add and configure** を選択し、MCP サーバーとツールが正しく登録されたことを確認します。

![Copilot Studio で "HR MCP Server" コネクタをエージェントに追加するダイアログ。](../../../assets/images/make/copilot-studio-06/mcp-integration-09.png)

MCP サーバーが公開するすべてのツールがエージェントで利用可能になっていることを確認できます。

![登録した MCP サーバーの設定とツール一覧が表示。](../../../assets/images/make/copilot-studio-06/mcp-integration-10.png)

<cc-end-step lab="mcs6" exercise="3" step="1" />

### Step 2: MCP サーバー統合のテスト

右上の **Publish** をクリックしてエージェントを公開します。公開後、組み込みの Test パネルで次のプロンプトを試します。

```text
List all candidates
```

エージェントは MCP サーバーの `list_candidates` ツールを使用し、HR システムに登録された全候補者を返すはずです。  
ただし、候補者リストを取得するにはコネクタへ接続する必要があります。Copilot Studio が **Open connection manager** を求めてきたら MCP サーバーに接続し、**Retry** してください。

![エージェントとの初回ダイアログ。接続マネージャーを開き MCP サーバーへ接続した後で再試行するよう促される。](../../../assets/images/make/copilot-studio-06/mcp-test-01.png)

接続後、HR MCP サーバーから候補者リストが取得できます。

![HR MCP Server から取得した候補者リスト。](../../../assets/images/make/copilot-studio-06/mcp-test-02.png)

!!! tip "ローカルで MCP サーバーをデバッグ"
    開発者の方は `HRTools.cs` にブレークポイントを設定し、Visual Studio Code でデバッガーをアタッチすることで、MCP サーバーの動作を詳細に追跡できます。

エージェントを Microsoft 365 Copilot Chat でも利用可能にしましょう。1️⃣ **Channels** セクションを開き、2️⃣ **Teams and Microsoft 365 Copilot** チャンネルを選択、3️⃣ **Make agent available in Microsoft 365 Copilot** をチェックし、4️⃣ **Add channel** をクリックします。チャンネルが有効になるまで待ってパネルを閉じ、再度 **Publish** でエージェントを公開します。

!["Teams and Microsoft 365 Copilot" チャンネルでの公開インターフェース。"Make agent available in Microsoft 365 Copilot" のチェックボックスと "Add channel"。](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-01.png)

再び **Teams and Microsoft 365 Copilot** チャンネルを開き、**See agent in Microsoft 365** を選択してエージェントを Microsoft 365 Copilot に追加します。

!["See agent in Microsoft 365" コマンドが強調表示。](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-02.png)

表示されるウィンドウで **Add** → **Open** を選択し、Microsoft 365 Copilot 上でエージェントを試します。

!!! info "エージェントの詳細"
    **Teams and Microsoft 365 Copilot** チャンネルの設定パネルから、説明やカスタム アイコンなど追加情報を設定できます。

![Microsoft 365 Copilot へのエージェント追加インターフェース。"Add" ボタンがある。](../../../assets/images/make/copilot-studio-06/agent-publish-m365-chat-03.png)

Microsoft 365 Copilot でエージェントを試してみましょう。UI には先ほど設定した Suggested prompts が表示されます。たとえば次のプロンプトを入力します。

```text
Search for candidate Alice
```

![Microsoft 365 Copilot チャット画面。「HR Candidate Management」の提案プロンプトと "Search for candidate Alice" の入力例。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-01.png)

エージェントは MCP サーバーの `search_candidates` ツールを使用し、検索条件に一致する候補者を 1 名返すはずです。ただし Microsoft 365 Copilot でもコネクタへの再接続が必要なため、Copilot Studio の接続マネージャーで MCP サーバーに接続してください。

![Microsoft 365 Copilot チャットが MCP サーバー接続のため "Open the connection manager" を指示。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-02.png)

接続後、再度プロンプトを実行すると期待どおりの結果が得られます。

![検索条件に一致した候補者 Alice Johnson の情報が表示。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-03.png)

次に、より高度な `add_candidate` ツールを試して新しい候補者を追加します。以下のプロンプトを使用します。

```text
Add a new candidate: John Smith, Software Engineer, skills: React, Node.js, 
email: john.smith@email.com, speaks English and Spanish
```

エージェントは意図を理解し、`add_candidate` ツールに必要な引数を抽出してツールを実行し、新しい候補者を追加します。MCP サーバーからは追加完了の確認が返ります。

![MCP サーバー経由で新しい候補者が追加されたことをエージェントが確認。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-04.png)

再度候補者リストを取得すると、`John Smith` が追加されていることを確認できます。

![更新後の候補者リスト。最後に John Smith が追加されている。](../../../assets/images/make/copilot-studio-06/mcp-test-copilot-05.png)

他にも次のようなプロンプトで遊んでみましょう。

```text
Update the candidate with email bob.brown@example.com to speak also French
```

または

```text
Add skill "Project Management" to candidate bob.brown@example.com
```

あるいは

```text
Remove candidate bob.brown@example.com
```

エージェントは適切なツールを自動で呼び出し、プロンプトに応じて動作します。

これで完了です！エージェントは完全に機能し、HR MCP サーバーが提供するすべてのツールを利用できるようになりました。

<cc-end-step lab="mcs6" exercise="3" step="2" />

---8<--- "ja/mcs-congratulations.md"

ラボ MCS6 - MCP サーバーの利用 を完了しました！

<a href="../07-autonomous">こちら</a> から Lab MCS7 に進み、Copilot Studio で自律型エージェントの作成方法を学びましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/06-mcp--ja" />