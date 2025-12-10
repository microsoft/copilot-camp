---
search:
  exclude: true
---
# ラボ MCS7 - 自律型エージェントの作成

このラボでは、Microsoft Copilot Studio を使用して自律型エージェントを作成する方法を学習します。作成する自律型エージェントは、SharePoint にアップロードされた PDF ファイルから候補者データを自動的に処理します。エージェントは SharePoint のドキュメント ライブラリを監視し、新しい PDF がアップロードされると AI を使用して候補者情報を抽出し、前のラボ MCS6 で構築した MCP サーバーを通じて候補者レコードを自動的に作成します。このラボでは、ドキュメント処理とデータ入力タスクを自動化することで、自律型エージェントが人事ワークフローをどのように合理化できるかを示します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/TPwJWZjLrDo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を手早く確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    このラボは前回の [ラボ MCS6](../06-mcp){target=_blank} を前提としています。前回設定した同じ MCP サーバーを引き続き利用できます。

このラボで学習する内容:

- Microsoft Copilot Studio で自律型エージェントを作成する方法
- SharePoint ドキュメント ライブラリのトリガーを構成する方法
- AI で PDF ドキュメントを処理し構造化データを抽出する方法
- 自律型エージェントを MCP サーバーと統合する方法

## Exercise 1: SharePoint 環境の準備

この演習では、自律型エージェントのトリガー ポイントとなる SharePoint ドキュメント ライブラリを準備します。エージェントはこのライブラリを監視し、候補者データを含む新しい PDF ファイルを自動的に処理します。

### Step 1: SharePoint ドキュメント ライブラリの作成

自律型エージェントを作成する前に、HR 担当者が候補者の PDF ファイルをアップロードできる SharePoint ドキュメント ライブラリを設定します。

Microsoft 365 テナント内の任意の SharePoint サイト（または新規作成したサイト）に移動し、新しいドキュメント ライブラリを作成します。

1. **サイト コンテンツ** に移動し **新規** → **ドキュメント ライブラリ** を選択  
1. テンプレートとして **空白のライブラリ** を選択  
1. ライブラリ名: `Candidates Data`  
1. 説明: `Document library for candidate PDF data files`  
1. **作成** を選択してライブラリを作成  

![The SharePoint interface showing the creation of a new document library called "Candidate Data" with the appropriate name and description filled in.](../../../assets/images/make/copilot-studio-07/sharepoint-library-01.png)

作成後、エージェントがアクセスできるようにライブラリのアクセス許可を構成します。

1. **設定** (歯車アイコン) → **ライブラリの設定** を選択  
1. **アクセス許可と管理** で **このドキュメント ライブラリのアクセス許可** を選択  
1. Microsoft Copilot Studio 用に使用するアカウントが最低でも **投稿** 権限を持っていることを確認  

<cc-end-step lab="mcs7" exercise="1" step="1" />

### Step 2: サンプル PDF ファイルの準備

テスト用に [resumes.zip](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/autonomous-agent&filename=resumes){target=_blank} をダウンロードし、フォルダーを解凍します。  
ダウンロードしたファイルには以下のような架空の候補者情報が含まれています。

- 氏名  
- メール アドレス  
- 現在の役職 / ポジション  
- スキルと専門分野  
- 使用言語  

任意のワープロを使用して簡単な PDF を作成するか、既存の履歴書 / CV を利用しても構いません。AI が正しく情報を抽出できるよう、テキストが読み取り可能であること（スキャン画像ではないこと）を確認してください。

<cc-end-step lab="mcs7" exercise="1" step="2" />

### Step 3: 前提条件の確認

次を完了していることを確認してください。

- **ラボ MCS6**: HR MCP サーバーが dev tunnel 経由で起動しアクセス可能である  
- **SharePoint アクセス**: ドキュメント ライブラリを作成・管理する権限  
- **Power Platform 環境**: 前回のラボと同じ環境へのアクセス  
- **サンプル PDF**: 候補者データを含む PDF ファイルを 2〜3 つ用意  

また、ラボ MCS6 の HR MCP サーバーが起動していることを確認し、停止している場合は以下で起動します。

```console
dotnet run
```

続いて dev tunnel がアクティブであることを確認します。

```console
devtunnel host hr-mcp
```

本ラボ中はエージェントが MCP サーバーへ通信できるよう、両サービスを起動したままにしてください。

<cc-end-step lab="mcs7" exercise="1" step="3" />

## Exercise 2: 自律型エージェントの作成

この演習では、SharePoint ドキュメント ライブラリを監視し、新しい PDF を自動処理する自律型エージェントを Microsoft Copilot Studio で作成します。

### Step 1: 自律型エージェントの作成

ブラウザーを開き、対象 Microsoft 365 テナントの作業アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスします。

前回のラボで作成した `Copilot Dev Camp` 環境を選択し、左ナビゲーションの **作成** を選択して **エージェント** を選びます。

**構成** を選択し、次の設定で自律型エージェントを定義します。

- **名前**:  

```text
Autonomous HR Docs Processor
```

- **説明**:  

```text
An autonomous AI agent that monitors SharePoint for new candidate PDF uploads and 
automatically processes them to create candidate records via MCP server integration
```

- **手順**:  

```text
You are an autonomous HR assistant that specializes in processing candidate data 
from PDF documents. When a new PDF file is uploaded to the SharePoint document library, 
you automatically:

1. Extract candidate information from the PDF including name, email, skills, languages, and role
2. Validate and structure the extracted data
3. Create a new candidate record using the 'add_candidate' tool of the HR MCP server
4. Provide confirmation of successful processing

Always ensure data accuracy and provide clear feedback about the processing results. 
Handle errors gracefully and provide informative messages when processing fails.
DO NOT invent or assume fake data about candidates. AVOID allucinations.
You MUST ONLY process real and existing data.
```

**作成** を選択して自律型エージェントを生成します。

<cc-end-step lab="mcs7" exercise="2" step="1" />

### Step 2: エージェント知能の強化

エージェント作成後、生成 AI の推論とナレッジ統合を有効化して能力を強化します。

**オーケストレーション** セクションで **生成 AI を使用してユーザーやイベントに最適な応答を決定する** を有効にします。これによりエージェントはイベントに応じた適切なアクションを自律的に選択できます。

![The agent configuration page showing the orchestration settings with generative AI enabled for autonomous processing.](../../../assets/images/make/copilot-studio-07/autonomous-agent-01.png)

**ナレッジ** セクションでは、HR ドキュメントや候補者処理ガイドラインなど特定のナレッジ ソースを追加することもできますが、本ラボではエージェントの組み込み AI 機能と MCP サーバー統合に依存します。

設定を変更した場合は **保存** を選択して確定します。

<cc-end-step lab="mcs7" exercise="2" step="2" />

### Step 3: MCP サーバー統合の追加

エージェントが候補者レコードを作成できるよう、HR MCP サーバー ツールへアクセスを設定します。**ツール** セクションに移動し **+ ツールを追加** を選択します。

1. **Model Context Protocol** グループを選択  
2. ラボ MCS6 で設定した **HR MCP Server** を選択  
3. **追加して構成** を選択し MCP サーバー ツールを統合  

![The tools section showing the HR MCP Server being added to the autonomous agent with all the available candidate management tools.](../../../assets/images/make/copilot-studio-07/autonomous-agent-02.png)

これでエージェントは HR MCP サーバーの全ツールにアクセスできます。

- `list_candidates`
- `search_candidates`
- `add_candidate`
- `update_candidate`
- `remove_candidate`

エージェントは主に `add_candidate` ツールを用いて新しい PDF の処理を行います。

<cc-end-step lab="mcs7" exercise="2" step="3" />

## Exercise 3: SharePoint トリガーの構成

この演習では、新しい PDF ファイルが SharePoint ドキュメント ライブラリにアップロードされた際に自律型エージェントが自動的に起動するよう設定します。

### Step 1: SharePoint トリガーの追加

自律型エージェントで 1️⃣ **概要** セクションに移動し、2️⃣ **トリガー** パネルで 3️⃣ **+ トリガーを追加** を選択します。

![The triggers section of the autonomous agent with the "+ Add trigger" command highlighted.](../../../assets/images/make/copilot-studio-07/autonomous-agent-03.png)

**トリガーを追加** ダイアログから SharePoint コネクターの **ファイルが作成されたとき (プロパティのみ)** を選択し、**次へ** を選択します。

![The trigger selection dialog showing SharePoint file triggers available for the autonomous agent, together with other out of the box triggers. The trigger "When a file is created (properties only)" is highlighted. There is a "Next" button in the lower right side of the dialog, to proceed with the configuration.](../../../assets/images/make/copilot-studio-07/autonomous-agent-04.png)

次にトリガー名を付け、対象アプリへの接続/アクセス許可を構成します。今回のアプリは以下です。

- Microsoft Copilot Studio  
- SharePoint  

次のように構成します。

- **トリガー名**: `When PDF uploaded to Candidate Data library`

![The SharePoint trigger configuration showing the name and the required apps permissions.](../../../assets/images/make/copilot-studio-07/autonomous-agent-05.png)

**次へ** を選択し、さらに以下を設定します。

- **サイト アドレス**: 対象 SharePoint サイトを選択または URL を入力  
- **ライブラリ名**: `Candidate Data`  
- **フォルダー**: 空欄 (ライブラリ全体を監視)  
- **ビューで列を制限 (省略可)**: All Documents  
- **このトリガーによって呼び出されたときにエージェントへ追加する手順**: `Body` の内容を使用  

![The SharePoint trigger configuration showing the site address, library name, folder, view, and additional instructions to the agent.](../../../assets/images/make/copilot-studio-07/autonomous-agent-06.png)

**トリガーを作成** を選択して監視トリガーを追加します。処理には少し時間がかかります。完了するとテストを促すダイアログが表示されます。

![The dialog with trigger creation confirmation and a message inviting you to test the just created trigger.](../../../assets/images/make/copilot-studio-07/autonomous-agent-07.png)

**閉じる** を選択してエージェントの **概要** に戻ります。

<cc-end-step lab="mcs7" exercise="3" step="1" />

### Step 2: トリガーのテスト

**トリガー** 一覧に新しいトリガーが表示され、トリガー名の横にあるフラスコアイコンを選択してテストできます。

![The trigger in the list of triggers with the little flask highligthed to start testing.](../../../assets/images/make/copilot-studio-07/autonomous-agent-08.png)

フラスコを選択すると、SharePoint ライブラリへのファイルアップロードを待機するダイアログが表示されます。

![The dialog to test the trigger with files uploaded to the target SharePoint Online library. There is a command to start testing that is greyed out, waiting for an actual file to be uploaded in the target library.](../../../assets/images/make/copilot-studio-07/trigger-test-01.png)

対象ライブラリにファイルがアップロードされるとダイアログが更新され、**テストを開始** コマンドが有効になります。複数ファイルがアップロードされた場合はテストに使用するファイルを選択できます。

事前にダウンロードした履歴書の PDF をアップロードし、エージェントが処理するのを待ちます。

!!! note
    新しいファイルを検出するまで最大 1 分ほどかかる場合があります。ダイアログが準備完了になるまでお待ちください。

![The dialog to test the trigger with files uploaded to the target SharePoint Online library. The "Start testing" command is now enabled, because there is a new file to process.](../../../assets/images/make/copilot-studio-07/trigger-test-02.png)

テストが開始されると、**エージェントをテスト** サイド パネルでエージェントが対話を行います。まずエージェント インスタンスを HR MCP Server に接続する必要があります。自動メッセージの **接続マネージャーを開く** を選択し、HR MCP Server に **接続** してから **エージェントをテスト** パネルに戻り **再試行** を選択します。

アップロードした PDF 履歴書の候補者が HR MCP サーバーに追加された旨の確認メッセージが表示されるはずです。

![The test panel of Copilot Studio while testing the trigger. There is the request to connect to the target HR MCP Server, as well as the confirmation that a new candidate was added to the list of candidates.](../../../assets/images/make/copilot-studio-07/trigger-test-03.png)

`List all the candidates` とプロンプトを送信して、新しい候補者が一覧に含まれていることを確認できます。自律型エージェントの準備は完了です。**発行** して自動処理を開始しましょう。

エージェントを発行する際、次のような警告が表示される場合があります。

![The publishing dialog showing a couple of warnings to the user. One is about editors having full access to embedded connections used by Flows or Triggers added to the agent. Another one is about triggers using author's credentials.](../../../assets/images/make/copilot-studio-07/autonomous-agent-09.png)

1. **編集者のフル アクセス**: Editor 権限を持つユーザーはフローやトリガーで使用される埋め込み接続にアクセスできます。  
1. **トリガーが作成者の資格情報を使用**: これらのトリガーの手順が他のユーザーとデータを共有する場合、そのユーザーは作成者の資格情報を用いて情報へアクセスできます。

エージェントを発行したら、新しい PDF 履歴書をアップロードして動作を確認しましょう。SharePoint ライブラリへファイルをアップロード後、エージェントの **アクティビティ** セクションに `自動` 呼び出しが表示されます。

![The "Activity" of the agent. There is an autonomous agent invocation, because of the upload of a file in the target library.](../../../assets/images/make/copilot-studio-07/autonomous-agent-10.png)

<cc-end-step lab="mcs7" exercise="3" step="2" />

## Exercise 4: 自律型エージェントの内部

この演習では、自律型エージェントがどのように動作するか、内部処理を理解します。

### Step 1: トリガーの裏側

トリガーを作成・テストした後、その仕組みを確認したい場合は、トリガー横の省略記号 (**...**) を選択し **Power Automate で編集** を選びます。

![The trigger management interface showing the option to edit the SharePoint trigger in Power Automate for advanced configuration.](../../../assets/images/make/copilot-studio-07/edit-trigger-01.png)

Power Automate では、自律型エージェントのトリガーの背後で動作するフローを確認できます。

![The trigger flow in Power Automate. There is a trigger action of type "When a file is created (properties only)" and another action "Sends a prompt to the specified copilot for processing".](../../../assets/images/make/copilot-studio-07/edit-trigger-02.png)

フローは非常にシンプルで、SharePoint コネクターの **ファイルが作成されたとき (プロパティのみ)** トリガーと **指定した copilot へプロンプトを送信して処理** アクションだけです。つまり、自律型エージェントのトリガーは、エージェントへプロンプトを送信する Power Automate フローに他なりません。そのため、Power Automate フローのほぼすべてのトリガーを Copilot Studio 自律型エージェントのトリガーとして利用できます。

必要に応じて、フローをカスタマイズしてエージェント呼び出し前に追加の処理や機能を持たせることも可能ですが、その場合は次のステップで説明する点を考慮してください。

<cc-end-step lab="mcs7" exercise="4" step="1" />

### Step 2: 複数ファイルのアップロード処理

自律型エージェントのトリガーについてもう一つ重要なのは、SharePoint へ複数ファイルをアップロードした場合、必ずしもファイルごとに Power Automate フローが実行されるわけではない点です。同様に、ファイル / イベントごとにエージェント インスタンスが作成されるとも限りません。例えば、一定時間内にアップロードされた複数ファイルを 1 つのフロー インスタンスがまとめて処理することがあります。  
フローは 1 つのエージェント インスタンスを呼び出し、そのインスタンスが各ファイルを順に処理します。

試しに 2 ファイル以上を同時にアップロードし、Power Automate のフロー実行と Copilot Studio のエージェント呼び出しを確認してみてください。アップロードされたファイル セットに対し 1 つのフローと 1 つのエージェント インスタンスのみが生成されるはずです。

エージェントの **アクティビティ** で `自動` インスタンスを選択し、`完了した手順` が複数あることを確認できます。

![The "Activity" section of the autonomous agent with an instance that has 2 "Completed steps".](../../../assets/images/make/copilot-studio-07/inspect-autonomous-agent-01.png)

インスタンスを開くと、エージェントが複数ファイルを自律的に処理し、ファイルごとに `add_candidate` ツールを呼び出していることがわかります。これは、エージェントの手順で

```text
... When a new PDF file is uploaded to the SharePoint document library: ...
```

と記述しただけで、ループ処理を AI が自律的に行っているためです。AI の高い能力を実感できるでしょう。

![The details about the execution of an agent with two files processed, invoking the "add_candidate" tool for each of them.".](../../../assets/images/make/copilot-studio-07/inspect-autonomous-agent-02.png)

<cc-end-step lab="mcs7" exercise="4" step="2" />

---8<--- "ja/mcs-congratulations.md"

ラボ MCS7 - 自律型エージェントの作成 を完了しました!

<a href="../08-rag">こちら</a> からラボ MCS8 に進み、Copilot Studio で Microsoft Azure AI Search を使用した RAG を学びましょう。
<cc-next /> 

<!-- <cc-award path="Make" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/07-autonomous--ja" />