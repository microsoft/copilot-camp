---
search:
  exclude: true
---
# Lab MCS7 - 自律型エージェントの作成

このラボでは、Microsoft Copilot Studio を使用して自律型エージェントを作成する方法を理解します。ここで作成する自律型エージェントは、SharePoint にアップロードされた PDF ファイルから候補者データを自動的に処理します。エージェントは SharePoint のドキュメント ライブラリを監視し、新しい PDF がアップロードされると AI を使って候補者情報を抽出し、Lab MCS6 で構築した MCP サーバーを使用して候補者レコードを自動的に作成します。このラボは、ドキュメント処理とデータ入力タスクを自動化することで、HR ワークフローを合理化できることを示しています。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/TPwJWZjLrDo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>ビデオでラボの概要を確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    このラボは前回の [Lab MCS6](../06-mcp){target=_blank} を基にしています。前回設定した MCP サーバーをそのまま使用できます。

このラボで学習する内容:

- Microsoft Copilot Studio で自律型エージェントを作成する方法
- SharePoint ドキュメント ライブラリのトリガーを構成する方法
- AI で PDF ドキュメントを処理して構造化データを抽出する方法
- 自律型エージェントを MCP サーバーと統合する方法

## 演習 1: SharePoint 環境のセットアップ

この演習では、自律型エージェントのトリガー ポイントとなる SharePoint ドキュメント ライブラリを準備します。エージェントはこのライブラリを監視し、候補者データを含む新しい PDF ファイルを自動的に処理します。

### 手順 1: SharePoint ドキュメント ライブラリの作成

自律型エージェントを作成する前に、HR 担当者が候補者の PDF ファイルをアップロードできるように SharePoint ドキュメント ライブラリを設定します。

Microsoft 365 テナント内の任意の SharePoint サイト (または新規に作成したサイト) に移動し、新しいドキュメント ライブラリを作成します。

1. **サイト コンテンツ** に移動し、**新規** → **ドキュメント ライブラリ** を選択  
1. テンプレートとして **空白のライブラリ** を選択  
1. ライブラリ名: `Candidates Data`  
1. 説明: `Document library for candidate PDF data files`  
1. **作成** を選択してライブラリを作成  

![「Candidate Data」という名前で新しいドキュメント ライブラリを作成している SharePoint インターフェイス。](../../../assets/images/make/copilot-studio-07/sharepoint-library-01.png)

作成後、エージェントがアクセスできるようにライブラリの権限を構成します。

1. **設定** (歯車アイコン) → **ライブラリの設定** を選択  
1. **権限と管理** の下で **このドキュメント ライブラリの権限** を選択  
1. Microsoft Copilot Studio で使用するアカウントに **投稿** 以上の権限があることを確認  

<cc-end-step lab="mcs7" exercise="1" step="1" />

### 手順 2: サンプル PDF ファイルの準備

テスト用に、[resumes.zip](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/autonomous-agent&filename=resumes){target=_blank} をダウンロードして解凍します。  
ダウンロードしたファイルには、次のような仮想候補者の情報が含まれています。

- 氏名
- メール アドレス  
- 現在の役職
- スキルと専門分野
- 使用言語

任意のワープロで簡単な PDF を作成して保存するか、既存の履歴書/CV ファイルを使用しても構いません。AI が正しく情報を抽出できるよう、テキストが読み取り可能 (スキャン画像ではない) であることを確認してください。

<cc-end-step lab="mcs7" exercise="1" step="2" />

### 手順 3: 前提条件の確認

次の項目を完了していることを確認してください。

- **Lab MCS6**: HR MCP サーバーが dev tunnel からアクセス可能な状態で稼働している  
- **SharePoint アクセス**: ドキュメント ライブラリを作成・管理できる権限  
- **Power Platform 環境**: 前回のラボと同じ環境にアクセス可能  
- **サンプル PDF ファイル**: 候補者データを含むテスト用 PDF ファイルを 2～3 つ以上  

また、Lab MCS6 の HR MCP サーバーが稼働しているか確認し、停止している場合は次のコマンドで起動します。

```console
dotnet run
```

さらに dev tunnel がアクティブであることを確認します。

```console
devtunnel host hr-mcp
```

このラボの間、エージェントが MCP サーバーと通信できるよう、両サービスを稼働したままにしてください。

<cc-end-step lab="mcs7" exercise="1" step="3" />

## 演習 2: 自律型エージェントの作成

この演習では、SharePoint ドキュメント ライブラリを監視し、新しい PDF を自動処理する自律型エージェントを Microsoft Copilot Studio で作成します。

### 手順 1: 自律型エージェントの作成

ブラウザーを開き、対象 Microsoft 365 テナントの業務アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスします。

前回のラボで作成した `Copilot Dev Camp` 環境を選択し、左ナビゲーション メニューの **Create** を選択して **Agent** を選びます。

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
DO NOT invent or assume fake data about candidates. AVOID allucinations.
You MUST ONLY process real and existing data.
```

**Create** を選択して自律型エージェントを作成します。

<cc-end-step lab="mcs7" exercise="2" step="1" />

### 手順 2: エージェントの知能強化

エージェント作成後、生成 AI 推論とナレッジ統合で機能を強化します。

**Orchestration** セクションで **Use generative AI to determine how best to respond to users and events** が有効になっていることを確認します。これにより、エージェントはさまざまなイベントをインテリジェントに処理し、適切なアクションを決定できます。

![自律型処理のために生成 AI が有効になっているオーケストレーション設定画面。](../../../assets/images/make/copilot-studio-07/autonomous-agent-01.png)

**Knowledge** セクションでは、特定の HR ドキュメントや候補者処理ガイドラインがある場合にナレッジ ソースを追加できます。このラボでは、エージェントの組み込み AI 機能と MCP サーバー統合のみを使用します。

設定を変更した場合は **Save** を選択して保存します。

<cc-end-step lab="mcs7" exercise="2" step="2" />

### 手順 3: MCP サーバー統合の追加

エージェントが候補者レコードを作成できるよう、HR MCP サーバーのツールへアクセスさせます。**Tools** セクションに移動し、**+ Add a tool** を選択します。

1. **Model Context Protocol** グループを選択  
2. Lab MCS6 で構成した **HR MCP Server** を探して選択  
3. **Add and configure** を選択して MCP サーバー ツールを統合  

![HR MCP Server が追加され、候補者管理ツールが表示されているツール セクション。](../../../assets/images/make/copilot-studio-07/autonomous-agent-02.png)

これでエージェントは次の HR MCP サーバー ツールにアクセスできます。

- `list_candidates`
- `search_candidates`
- `add_candidate`
- `update_candidate`
- `remove_candidate`

エージェントは主に `add_candidate` ツールを使用して新しい PDF を処理します。

<cc-end-step lab="mcs7" exercise="2" step="3" />

## 演習 3: SharePoint トリガーの構成

この演習では、新しい PDF が SharePoint ドキュメント ライブラリにアップロードされた際にエージェントが自動的に起動するようトリガーを構成します。

### 手順 1: SharePoint トリガーの追加

エージェントで 1️⃣ **Overview** セクションに移動し、2️⃣ **Triggers** パネルをスクロールして 3️⃣ **+ Add trigger** を選択します。

![「+ Add trigger」コマンドが強調表示されたトリガー セクション。](../../../assets/images/make/copilot-studio-07/autonomous-agent-03.png)

**Add trigger** ダイアログで SharePoint コネクタの **When a file is created (properties only)** を選択し、**Next** を選択して構成を続行します。

![SharePoint ファイル トリガー選択ダイアログ。「When a file is created (properties only)」が強調表示されている。](../../../assets/images/make/copilot-studio-07/autonomous-agent-04.png)

次に、トリガー名を指定し、対象アプリへのアクセス権限を構成します。今回対象となるアプリは次のとおりです。

- Microsoft Copilot Studio
- SharePoint

以下のようにトリガーを構成します。

- **Trigger name**: `When PDF uploaded to Candidate Data library`

![トリガー名と必要なアプリ権限が表示された SharePoint トリガー設定画面。](../../../assets/images/make/copilot-studio-07/autonomous-agent-05.png)

**Next** を選択し、以下の追加設定を行います。

- **Site Address**: 対象 SharePoint サイトを選択または URL を入力  
- **Library Name**: `Candidate Data`  
- **Folder**: 空欄 (ライブラリ全体を監視)  
- **Limit columns by View (Optional)**: All Documents  
- **Additional instructions to the agent when it's invoked by this trigger**: Use content from `Body`

![サイト アドレスやライブラリ名などの設定が表示された SharePoint トリガー設定画面。](../../../assets/images/make/copilot-studio-07/autonomous-agent-06.png)

**Create trigger** を選択してトリガーを追加します。処理が完了すると、テストを促すダイアログが表示されます。

![トリガー作成完了とテストを促すダイアログ。](../../../assets/images/make/copilot-studio-07/autonomous-agent-07.png)

**Close** を選択して **Overview** セクションに戻ります。

<cc-end-step lab="mcs7" exercise="3" step="1" />

### 手順 2: トリガーのテスト

**Triggers** の一覧に新しいトリガーが表示され、エリプシス (**...**) の横にあるフラスコを選択してテストできます。

![テスト用のフラスコが強調表示されたトリガー一覧。](../../../assets/images/make/copilot-studio-07/autonomous-agent-08.png)

フラスコを選択すると、SharePoint Online の対象ライブラリにファイルがアップロードされるのを待機するダイアログが開きます。

![アップロード待機中で「Start testing」コマンドがグレーアウトされたテスト ダイアログ。](../../../assets/images/make/copilot-studio-07/trigger-test-01.png)

対象ライブラリにファイルがアップロードされるとダイアログが更新され、**Start testing** が有効になります。複数ファイルがある場合は使用するファイルを選択できます。

事前にダウンロードした履歴書のいずれかをアップロードし、エージェントが処理するのを待ちます。

!!! note
    新しいファイルを検知するまで最大 1 分かかる場合があります。ダイアログがテスト可能になるまでお待ちください。

![「Start testing」コマンドが有効になったテスト ダイアログ。](../../../assets/images/make/copilot-studio-07/trigger-test-02.png)

テストが開始すると、**Test your agent** パネルでエージェントと対話できます。最初に HR MCP Server へ接続する必要があります。エージェントのメッセージにある **Open connection manager** を選択し、**Connect** で接続を確立した後、**Retry** を選択します。

アップロードした PDF に記載された候補者が HR MCP サーバーに追加されたことを示す確認メッセージが表示されるはずです。

![HR MCP Server 接続要求と候補者追加確認が表示されたテスト パネル。](../../../assets/images/make/copilot-studio-07/trigger-test-03.png)

必要に応じて `List all the candidates` と入力し、新しい候補者が一覧に含まれていることを確認できます。エージェントが準備できました。**Publish** すればファイルを自律的に処理し始めます。

公開時には、次のような警告が表示される場合があります。

![公開ダイアログに表示される 2 つの警告。](../../../assets/images/make/copilot-studio-07/autonomous-agent-09.png)

1. **Full access for editors**: Editor 権限を持つユーザーは、フローやトリガーで使用される組み込み接続へフル アクセスできます。  
1. **Your agent includes triggers that use the author's credentials**: これらのトリガーの指示で他ユーザーとデータを共有すると、そのユーザーは元の編集者の資格情報を使用して情報にアクセスまたはタスクを実行できます。

エージェントを公開したら、新しい PDF 履歴書をアップロードして動作を確認してください。SharePoint Online の対象ライブラリにファイルをアップロードすると、エージェントの **Activity** セクションに `Automated` 呼び出しが表示されます。

![ファイルアップロードにより自律型エージェントが呼び出されたことを示す「Activity」。](../../../assets/images/make/copilot-studio-07/autonomous-agent-10.png)

<cc-end-step lab="mcs7" exercise="3" step="2" />

## 演習 4: 自律型エージェントの内部

この演習では、自律型エージェントがどのように動作するのか、背後で何が起こっているのかを理解します。

### 手順 1: トリガーの裏側

トリガーの作成とテスト後、自律型エージェントの仕組みを確認したくなるかもしれません。トリガー横のエリプシス (**...**) を選択し、**Edit in Power Automate** を選びます。

![SharePoint トリガーを Power Automate で編集するオプションが表示されたインターフェイス。](../../../assets/images/make/copilot-studio-07/edit-trigger-01.png)

Power Automate では、自律型エージェントのトリガーを裏で支えるフローが確認できます。 

![SharePoint トリガーと Copilot へのプロンプト送信アクションから成る Power Automate フロー。](../../../assets/images/make/copilot-studio-07/edit-trigger-02.png)

フローは非常にシンプルで、SharePoint コネクタの **When a file is created (properties only)** トリガー アクションと、**Sends a prompt to the specified copilot for processing** アクションのみで構成されています。つまり、自律型エージェントのトリガーは、エージェントへプロンプトを送信する Power Automate フローです。そのため、Power Automate のほぼすべてのトリガーを Copilot Studio 自律型エージェントのトリガーとして利用できます。

必要に応じて、フローをカスタマイズしてトリガー実行前に追加処理を行うことも可能ですが、その場合は次の手順で説明するポイントを考慮してください。

<cc-end-step lab="mcs7" exercise="4" step="1" />

### 手順 2: 複数ファイルのアップロード処理

自律型エージェントのトリガーに関して興味深い点として、SharePoint に複数ファイルをアップロードするなど複数のトリガー イベントが発生した場合でも、必ずしもファイル/イベントごとに Power Automate フローが実行されるわけではありません。同様に、エージェント インスタンスもイベントごとに生成されるとは限りません。例えば SharePoint Online ドキュメント ライブラリでファイルを処理する際、一定時間内にアップロードされた複数ファイルを 1 つのフロー インスタンスがまとめて処理する場合があります。
そのフローは 1 つのエージェント インスタンスを呼び出し、エージェントがファイルを 1 つずつ処理します。

この挙動は、複数ファイルを同時にアップロードし、Power Automate でフロー実行と Copilot Studio でエージェント呼び出しを確認すると明確です。アップロードされたファイルの集合を 1 つのフローが処理し、そのフローに対して 1 つのエージェント インスタンスが実行されます。

**Activity** セクションで `Automated` インスタンスを選択し、`Completed steps` が複数あることを確認することで検証できます。

![「Completed steps」が 2 つある自律型エージェントの「Activity」。](../../../assets/images/make/copilot-studio-07/inspect-autonomous-agent-01.png)

インスタンスを選択すると、エージェントが `add_candidate` ツールを各ファイルに対して呼び出し、複数ファイルを自律的に処理したことがわかります。エージェントに複雑なロジックを定義する必要はありません。エージェントの指示に

```text
... When a new PDF file is uploaded to the SharePoint document library: ...
```

と記載しただけで、エージェントの自律型知能がすべてのアップロード ファイルをループ処理し、同じロジックを適用します。これは AI の強力さを示す素晴らしい例です。

![「add_candidate」ツールが 2 回実行されたことを示すエージェント実行詳細。](../../../assets/images/make/copilot-studio-07/inspect-autonomous-agent-02.png)

<cc-end-step lab="mcs7" exercise="4" step="2" />

---8<--- "ja/mcs-congratulations.md"

Lab MCS7 - 自律型エージェントの作成 を完了しました!

<!-- <cc-award path="Make" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/07-autonomous--ja" />