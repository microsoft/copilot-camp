---
search:
  exclude: true
---
# ラボ MCS7 - 自律型エージェントの作成

このラボでは、Microsoft Copilot Studio を使用して自律型エージェントを作成する方法を理解します。ここで作成する自律型エージェントは、SharePoint にアップロードされた PDF ファイルから候補者データを自動的に処理します。このエージェントは SharePoint のドキュメント ライブラリを監視し、新しい PDF がアップロードされると AI を用いて候補者情報を抽出し、前のラボ MCS6 で構築した MCP サーバーを使用して候補者レコードを自動的に作成します。本ラボは、ドキュメント処理とデータ入力タスクを自動化することで、人事ワークフローを効率化する自律型エージェントの活用方法を示します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/TPwJWZjLrDo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を素早く確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    このラボは前回の [ラボ MCS6](../06-mcp){target=_blank} を前提としています。前回構成した MCP サーバーをそのまま使用できます。

このラボで学ぶこと:

- Microsoft Copilot Studio で自律型エージェントを作成する方法
- SharePoint ドキュメント ライブラリのトリガーを構成する方法
- AI で PDF ドキュメントを処理し構造化データを抽出する方法
- 自律型エージェントを MCP サーバーと統合する方法

## Exercise 1: SharePoint 環境のセットアップ

この演習では、自律型エージェントのトリガー ポイントとなる SharePoint ドキュメント ライブラリを準備します。エージェントはこのライブラリを監視し、候補者データを含む新しい PDF ファイルを自動的に処理します。

### Step 1: SharePoint ドキュメント ライブラリの作成

自律型エージェントを作成する前に、HR 担当者が候補者の PDF ファイルをアップロードできる SharePoint ドキュメント ライブラリをセットアップする必要があります。

Microsoft 365 テナント内の任意の SharePoint サイト (または新規作成したサイト) に移動し、新しいドキュメント ライブラリを作成します。

1. **サイト コンテンツ** に移動し、**新規** → **ドキュメント ライブラリ** を選択します  
1. **空白のライブラリ** をテンプレートとして選択します  
1. ライブラリ名: `Candidates Data`  
1. 説明: `Document library for candidate PDF data files`  
1. **作成** を選択してライブラリを作成します  

![The SharePoint interface showing the creation of a new document library called "Candidate Data" with the appropriate name and description filled in.](../../../assets/images/make/copilot-studio-07/sharepoint-library-01.png)

作成後、エージェントがアクセスできるようにライブラリの権限を構成します。

1. **設定** (歯車アイコン) → **ライブラリの設定** を選択  
1. **権限と管理** の下で **このドキュメント ライブラリの権限** を選択  
1. Microsoft Copilot Studio で使用するアカウントが **投稿 (Contribute)** 以上の権限を持つことを確認  

<cc-end-step lab="mcs7" exercise="1" step="1" />

### Step 2: サンプル PDF ファイルの準備

テスト用に、[resumes.zip](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/autonomous-agent&filename=resumes){target=_blank} をダウンロードして展開してください。  
ダウンロードしたファイルには次のような仮想候補者情報が含まれます。

- 氏名  
- メール アドレス  
- 現在の役職  
- スキルと専門分野  
- 使用言語  

任意のワープロを使用して独自に PDF ファイルを作成してもかまいません。既存の履歴書/CV ファイルを使用することもできます。AI が情報を正確に抽出できるよう、テキストが読み取り可能 (スキャン画像ではない) であることを確認してください。

<cc-end-step lab="mcs7" exercise="1" step="2" />

### Step 3: 前提条件の確認

次の項目を完了していることを確認してください。

- **ラボ MCS6**: HR MCP サーバーが dev tunnel 経由で実行中であること  
- **SharePoint アクセス**: ドキュメント ライブラリを作成・管理できる権限  
- **Power Platform 環境**: 前回のラボと同じ環境へのアクセス権  
- **サンプル PDF**: 候補者データを含むテスト PDF が 2～3 件以上  

また、ラボ MCS6 の HR MCP サーバーがまだ実行中であることを確認し、停止している場合は次のコマンドで起動します。

```console
dotnet run
```

そして dev tunnel が有効であることを確認します。

```console
devtunnel host hr-mcp
```

エージェントが MCP サーバーと通信できるよう、本ラボの間は両方のサービスを稼働させたままにしてください。

<cc-end-step lab="mcs7" exercise="1" step="3" />

## Exercise 2: 自律型エージェントの作成

この演習では、SharePoint ドキュメント ライブラリを監視し、新しい PDF を自動的に処理する自律型エージェントを Microsoft Copilot Studio で作成します。

### Step 1: 自律型エージェントの作成

ブラウザーを開き、対象の Microsoft 365 テナントの職場アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、Microsoft Copilot Studio を起動します。

前のラボで作成した `Copilot Dev Camp` 環境を選択し、左ナビゲーションの **Create** を選択して **Agent** を選択します。

**Skip to configure** を選択し、以下の設定で自律型エージェントを定義します。

- **Name**: 

```text
Autonomous HR Document Processor
```

- **Description**: 

```text
An autonomous AI agent that monitors SharePoint for new candidate PDF uploads and 
automatically processes them to create candidate records via MCP server integration
```

- **Instructions**: 

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
DO NOT invent or assume fake data about candidates. AVOID hallucinations.
You MUST ONLY process real and existing data.
```

**Create** を選択してエージェントを作成します。

<cc-end-step lab="mcs7" exercise="2" step="1" />

### Step 2: エージェントの知能を強化する

エージェント作成後、生成 AI の推論とナレッジ統合を有効にして能力を高めます。

**Orchestration** セクションで **Use generative AI to determine how best to respond to users and events** が有効になっていることを確認します。これにより、エージェントはさまざまなイベントを知的に処理し、適切なアクションを判断できます。

![The agent configuration page showing the orchestration settings with generative AI enabled for autonomous processing.](../../../assets/images/make/copilot-studio-07/autonomous-agent-01.png)

**Knowledge** セクションでは、特定の HR ドキュメントや候補者処理ガイドラインがある場合にナレッジ ソースを追加できます。本ラボでは、エージェントの組み込み AI 機能と MCP サーバー統合に依存します。

設定を変更した場合は **Save** を選択して保存します。

<cc-end-step lab="mcs7" exercise="2" step="2" />

### Step 3: MCP サーバー統合の追加

自律型エージェントが候補者レコードを作成できるよう、HR MCP サーバーのツールにアクセスする必要があります。**Tools** セクションで **+ Add a tool** を選択します。

1. **Model Context Protocol** グループを選択  
2. ラボ MCS6 で構成した **HR MCP Server** を見つけて選択  
3. **Add and configure** を選択し MCP サーバー ツールを統合  

![The tools section showing the HR MCP Server being added to the autonomous agent with all the available candidate management tools.](../../../assets/images/make/copilot-studio-07/autonomous-agent-02.png)

これにより、自律型エージェントは次の HR MCP サーバー ツールにアクセスできます。

- `list_candidates`
- `search_candidates`
- `add_candidate`
- `update_candidate`
- `remove_candidate`

エージェントは主に `add_candidate` ツールを使用して新しい PDF の処理を行います。

<cc-end-step lab="mcs7" exercise="2" step="3" />

## Exercise 3: SharePoint トリガーの構成

この演習では、自律型エージェントが SharePoint ドキュメント ライブラリに新しい PDF がアップロードされたときに自動的にトリガーされるよう構成します。

### Step 1: SharePoint トリガーの追加

自律型エージェントで 1️⃣ **Overview** セクションに移動し、2️⃣ **Triggers** パネルまでスクロールして 3️⃣ **+ Add trigger** を選択します。

![The triggers section of the autonomous agent with the "+ Add trigger" command highlighted.](../../../assets/images/make/copilot-studio-07/autonomous-agent-03.png)

**Add trigger** ダイアログで SharePoint コネクターの **When a file is created (properties only)** を選択し、**Next** を選択してトリガーを構成します。

![The trigger selection dialog showing SharePoint file triggers available for the autonomous agent, together with other out of the box triggers. The trigger "When a file is created (properties only)" is highlighted. There is a "Next" button in the lower right side of the dialog, to proceed with the configuration.](../../../assets/images/make/copilot-studio-07/autonomous-agent-04.png)

次にトリガーに名前を付け、対象アプリへのアクセス権限を接続/構成します。今回の対象アプリは以下です。

- Microsoft Copilot Studio
- SharePoint

以下のようにトリガーを構成します。

- **Trigger name**: `When PDF uploaded to Candidate Data library`

![The SharePoint trigger configuration showing the name and the required apps permissions.](../../../assets/images/make/copilot-studio-07/autonomous-agent-05.png)

**Next** を選択し、以下の追加設定を行います。

- **Site Address**: 目的の SharePoint サイトを選択または URL を入力  
- **Library Name**: `Candidate Data`  
- **Folder**: 空欄 (ライブラリ全体を監視)  
- **Limit columns by View (Optional)**: All Documents  
- **Additional instructions to the agent when it's invoked by this trigger**: Use content from `Body`

![The SharePoint trigger configuration showing the site address, library name, folder, view, and additional instructions to the agent.](../../../assets/images/make/copilot-studio-07/autonomous-agent-06.png)

**Create trigger** を選択して SharePoint 監視トリガーをエージェントに追加します。処理が完了すると、トリガーをテストするよう促すダイアログが表示されます。

![The dialog with trigger creation confirmation and a message inviting you to test the just created trigger.](../../../assets/images/make/copilot-studio-07/autonomous-agent-07.png)

**Close** を選択してエージェントの **Overview** セクションに戻ります。

<cc-end-step lab="mcs7" exercise="3" step="1" />

### Step 2: トリガーのテスト

**Triggers** の一覧に新しいトリガーが追加されているので、トリガー名横のフラスコアイコンを選択してテストします。

![The trigger in the list of triggers with the little flask highligthed to start testing.](../../../assets/images/make/copilot-studio-07/autonomous-agent-08.png)

フラスコを選択すると、SharePoint Online の対象ライブラリにファイルがアップロードされるのを待機するダイアログが表示されます。

![The dialog to test the trigger with files uploaded to the target SharePoint Online library. There is a command to start testing that is greyed out, waiting for an actual file to be uploaded in the target library.](../../../assets/images/make/copilot-studio-07/trigger-test-01.png)

対象ライブラリに少なくとも 1 つのファイルをアップロードするとダイアログが更新され、**Start testing** コマンドが選択可能になります。複数ファイルをアップロードした場合は、テストに使用するファイルを選択できます。

事前にダウンロードした履歴書のいずれかを SharePoint Online ライブラリにアップロードし、エージェントが処理するのを待ちます。

!!! note
    エージェントが新しいファイルを検知するまで最大 1 分かかる場合があります。テスト ダイアログが準備完了になるまでお待ちください。

![The dialog to test the trigger with files uploaded to the target SharePoint Online library. The "Start testing" command is now enabled, because there is a new file to process.](../../../assets/images/make/copilot-studio-07/trigger-test-02.png)

テストが開始されると、**Test your agent** サイド パネルを通じてエージェントと対話できます。最初に行う必要があるのは、エージェント インスタンスを HR MCP Server に接続することです。エージェントからの自動メッセージで **Open connection manager** を選択し、**Connect** で HR MCP Server に接続した後、**Retry** を選択してください。

アップロードした PDF 履歴書に記載された候補者が HR MCP サーバーに追加されたという確認メッセージが表示されるはずです。

![The test panel of Copilot Studio while testing the trigger. There is the request to connect to the target HR MCP Server, as well as the confirmation that a new candidate was added to the list of candidates.](../../../assets/images/make/copilot-studio-07/trigger-test-03.png)

必要に応じて `List all the candidates` というプロンプトを送信し、新しい候補者が一覧に含まれていることを確認できます。エージェントは準備完了です。**Publish** すると自律的にファイルを処理し始めます！

エージェントを公開すると、次のような警告が表示される場合があります。

![The publishing dialog showing a couple of warnings to the user. One is about editors having full access to embedded connections used by Flows or Triggers added to the agent. Another one is about triggers using author's credentials.](../../../assets/images/make/copilot-studio-07/autonomous-agent-09.png)

1. **Full access for editors**: 編集者権限を持つユーザーは、フローやトリガーで使用される埋め込み接続にフル アクセスできます。  
1. **Your agent includes triggers that use the author's credentials**: これらのトリガーの指示が他のユーザーとデータを共有する場合、そのユーザーは元の編集者の資格情報を使用して情報にアクセスまたはタスクを実行できます。  

エージェントを公開したら、新しい PDF 履歴書をアップロードして挙動を確認してみてください。SharePoint Online ライブラリにファイルをアップロードした後、エージェントの **Activity** セクションを開くと `Automated` 呼び出しが表示されます。

![The "Activity" of the agent. There is an autonomous agent invocation, because of the upload of a file in the target library.](../../../assets/images/make/copilot-studio-07/autonomous-agent-10.png)

<cc-end-step lab="mcs7" exercise="3" step="2" />

## Exercise 4: 自律型エージェントの内部

この演習では、自律型エージェントがどのように動作し、裏側で何が起こっているのかを理解します。

### Step 1: トリガーの裏側

トリガーを作成・テストした後、自律型エージェントの動作を詳しく確認したい場合があります。トリガー横の ellipsis (**...**) を選択し、**Edit in Power Automate** を選択します。

![The trigger management interface showing the option to edit the SharePoint trigger in Power Automate for advanced configuration.](../../../assets/images/make/copilot-studio-07/edit-trigger-01.png)

Power Automate では、自律型エージェントのトリガーの裏側にあるフローを確認できます。

![The trigger flow in Power Automate. There is a trigger action of type "When a file is created (properties only)" and another action "Sends a prompt to the specified copilot for processing".](../../../assets/images/make/copilot-studio-07/edit-trigger-02.png)

フローは非常にシンプルで、SharePoint コネクタの **When a file is created (properties only)** トリガー アクションと、対象エージェントを呼び出す **Sends a prompt to the specified copilot for processing** アクションのみで構成されています。実質的に、自律型エージェントのトリガーはエージェントへプロンプトを送信する Power Automate フローです。そのため、Power Automate フローのほぼすべてのトリガーを Copilot Studio 自律型エージェントのトリガーとして利用できます。

必要に応じて、エージェントを呼び出す前にフロー内で追加の処理や機能を実装することも可能です。ただし、その場合は次のステップで説明するポイントを考慮してください。

<cc-end-step lab="mcs7" exercise="4" step="1" />

### Step 2: 複数ファイルのアップロード処理

自律型エージェントのトリガーについて知っておくべきもう 1 つの重要な点は、SharePoint に複数ファイルをアップロードする場合や、複数のトリガー イベントが発生する場合でも、ファイル/イベントごとに必ず Power Automate フローやエージェント インスタンスが 1 つずつ起動されるわけではないということです。たとえば SharePoint Online ドキュメント ライブラリにファイルをアップロードする場合、単位時間内にアップロードされた複数ファイルを 1 つのフロー インスタンスで処理する場合があります。フローは 1 つのエージェント インスタンスを呼び出し、そのインスタンスがファイルを 1 件ずつ処理します。

この挙動は、複数ファイルを同時にアップロードし、Power Automate のフロー実行状況と Copilot Studio の自律型エージェント呼び出しを確認することで検証できます。アップロードされたファイルの集合に対して 1 つのフローが実行され、それに対応するエージェント インスタンスも 1 つになります。

エージェントの **Activity** セクションを開き、`Automated` インスタンスのうち `Completed steps` が複数あるものを確認すると、この挙動を視覚的に確認できます。

![The "Activity" section of the autonomous agent with an instance that has 2 "Completed steps".](../../../assets/images/make/copilot-studio-07/inspect-autonomous-agent-01.png)

インスタンスを選択すると、エージェントが 2 件 (またはそれ以上) のファイルを自律的に処理し、それぞれに対して `add_candidate` ツールを呼び出したことがわかります。エージェントに複雑なロジックを定義する必要はありません。エージェントの指示で

```text
... When a new PDF file is uploaded to the SharePoint document library: ...
```

と記述しただけで、エージェントの自律的な知能がアップロードされたすべてのファイルをループ処理し、同じロジックを適用してくれます。これは非常に強力で、今日の AI の能力を実感できます！

![The details about the execution of an agent with two files processed, invoking the "add_candidate" tool for each of them.".](../../../assets/images/make/copilot-studio-07/inspect-autonomous-agent-02.png)

<cc-end-step lab="mcs7" exercise="4" step="2" />

---8<--- "ja/mcs-congratulations.md"

これで ラボ MCS7 - 自律型エージェントの作成 が完了しました!

<!-- <cc-award path="Make" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/07-autonomous--ja" />