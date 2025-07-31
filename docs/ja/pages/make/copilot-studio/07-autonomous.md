---
search:
  exclude: true
---
# Lab MCS7 - 自律型エージェントの作成

このラボでは、 Microsoft Copilot Studio を使用して自律型エージェントを作成する方法を学びます。作成する自律型エージェントは、 SharePoint にアップロードされた PDF ファイルから候補者データを自動的に処理します。エージェントは SharePoint のドキュメント ライブラリを監視し、新しい PDF がアップロードされると AI を使って候補者情報を抽出し、前のラボ MCS6 で構築した MCP サーバーを通じて候補者レコードを自動生成します。このラボは、自律型エージェントがドキュメント処理とデータ入力を自動化し、 HR ワークフローを効率化できることを示しています。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/TPwJWZjLrDo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を短時間でご確認ください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    このラボは前回の [Lab MCS6](../06-mcp){target=_blank} を前提としています。前のラボで構成した同じ MCP サーバーをそのまま利用できます。

このラボで学習する内容:

- Microsoft Copilot Studio で自律型エージェントを作成する方法
- SharePoint ドキュメント ライブラリのトリガーを構成する方法
- AI で PDF ドキュメントを処理し構造化データを抽出する方法
- 自律型エージェントを MCP サーバーと統合する方法

## Exercise 1: SharePoint 環境のセットアップ

この演習では、自律型エージェントのトリガー ポイントとなる SharePoint ドキュメント ライブラリを準備します。エージェントはこのライブラリに新しい PDF ファイルが追加されるのを監視し、自動的に処理します。

### Step 1: SharePoint ドキュメント ライブラリの作成

自律型エージェントを作成する前に、 HR 担当者が候補者の PDF ファイルをアップロードできる SharePoint ドキュメント ライブラリを設定します。

Microsoft 365 テナント内の任意の SharePoint サイト (または新規作成したサイト) に移動し、新しいドキュメント ライブラリを作成します。

1. **サイト コンテンツ** に移動し、 **新規** → **ドキュメント ライブラリ** を選択します  
1. テンプレートとして **空のライブラリ** を選択します  
1. ライブラリ名に `Candidates Data` と入力します  
1. 説明に `Document library for candidate PDF data files` と入力します  
1. **作成** を選択してライブラリを作成します  

![SharePoint インターフェイスで新しいドキュメント ライブラリ「Candidate Data」を作成している画面。](../../../assets/images/make/copilot-studio-07/sharepoint-library-01.png)

作成後、エージェントがアクセスできるようにライブラリの権限を設定します。

1. **設定** (歯車アイコン) → **ライブラリの設定** を選択  
1. **権限と管理** セクションで **このドキュメント ライブラリの権限** を選択  
1. Microsoft Copilot Studio で使用するアカウントに **投稿** 以上の権限があることを確認  

<cc-end-step lab="mcs7" exercise="1" step="1" />

### Step 2: サンプル PDF ファイルの準備

テスト用に、[resumes.zip](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/autonomous-agent&filename=resumes){target=_blank} をダウンロードして解凍します。  
ダウンロードしたファイルには、以下のような架空の候補者情報が含まれています。

- 氏名  
- メール アドレス  
- 現在の職務 / 役職  
- スキルと専門分野  
- 使用言語  

または、任意のワード プロセッサーで簡単な PDF を作成して保存したり、既存の履歴書 / CV ファイルを使用してもかまいません。 AI が情報を正しく抽出できるよう、テキストが読み取り可能 (スキャン画像ではない) であることを確認してください。

<cc-end-step lab="mcs7" exercise="1" step="2" />

### Step 3: 前提条件の確認

続行する前に、次の項目を完了していることを確認してください。

- **Lab MCS6**: HR MCP サーバーが起動しており dev tunnel 経由でアクセス可能  
- **SharePoint アクセス**: ドキュメント ライブラリを作成・管理できる権限  
- **Power Platform 環境**: 前のラボと同じ環境へのアクセス  
- **サンプル PDF ファイル**: 候補者データ入りのテスト用 PDF が 2～3 件以上  

また、 Lab MCS6 の HR MCP サーバーがまだ起動しているか確認し、停止している場合は次のコマンドで起動します。

```console
dotnet run
```

dev tunnel がアクティブであることも確認します。

```console
devtunnel host hr-mcp
```

このラボの間、エージェントが MCP サーバーへ通信できるように、両方のサービスを起動したままにしてください。

<cc-end-step lab="mcs7" exercise="1" step="3" />

## Exercise 2: 自律型エージェントの作成

この演習では、 SharePoint ドキュメント ライブラリを監視し、新しい PDF アップロードを自動処理する自律型エージェントを Microsoft Copilot Studio で作成します。

### Step 1: 自律型エージェントの作成

ブラウザーで対象の Microsoft 365 テナントの職場アカウントを使用して [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、 Microsoft Copilot Studio を開きます。

前のラボで作成した `Copilot Dev Camp` 環境を選択し、左ナビゲーション メニューの **作成** を選択してから **エージェント** を選択します。

**スキップして構成** を選び、次の設定で自律型エージェントを定義します。

- **名前**:  

```text
Autonomous HR Document Processor
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

**作成** を選択して自律型エージェントを作成します。

<cc-end-step lab="mcs7" exercise="2" step="1" />

### Step 2: エージェントの知能を強化

エージェントを作成したら、生成 AI 推論とナレッジ統合で機能を強化します。

**オーケストレーション** セクションで **生成 AI を使用してユーザーやイベントへの最適な応答方法を判断する** を有効にしていることを確認します。これにより、エージェントはさまざまなイベントをインテリジェントに処理し、適切なアクションを判断できます。

![エージェント構成ページで生成 AI を有効にしたオーケストレーション設定。](../../../assets/images/make/copilot-studio-07/autonomous-agent-01.png)

**ナレッジ** セクションでは、 HR 文書や候補者処理ガイドラインなど特定のナレッジ ソースを追加することもできます。このラボでは、エージェントの組み込み AI 機能と MCP サーバー統合を利用します。

設定を変更した場合は **保存** を選択して確定します。

<cc-end-step lab="mcs7" exercise="2" step="2" />

### Step 3: MCP サーバー統合の追加

エージェントが候補者レコードを作成できるよう、 HR MCP サーバー ツールへアクセスを追加します。 **ツール** セクションに移動し、 **+ ツールを追加** を選択します。

1. **Model Context Protocol** グループを選択  
2. Lab MCS6 で構成した **HR MCP Server** を選択  
3. **追加して構成** を選択して MCP サーバー ツールを統合  

![HR MCP Server を自律型エージェントに追加しているツール セクション。](../../../assets/images/make/copilot-studio-07/autonomous-agent-02.png)

これによりエージェントは次の HR MCP サーバー ツールへアクセスできます。

- `list_candidates`
- `search_candidates` 
- `add_candidate`
- `update_candidate`
- `remove_candidate`

エージェントは主に `add_candidate` ツールを使用して新しい PDF アップロードを処理します。

<cc-end-step lab="mcs7" exercise="2" step="3" />

## Exercise 3: SharePoint トリガーの構成

この演習では、新しい PDF ファイルが SharePoint ドキュメント ライブラリにアップロードされたときに自律型エージェントが自動的に起動するようトリガーを構成します。

### Step 1: SharePoint トリガーの追加

エージェントで 1️⃣ **概要** セクションに移動し、 2️⃣ **トリガー** パネルをスクロールして 3️⃣ **+ トリガーを追加** を選択します。

![自律型エージェントのトリガー セクションで「+ Add trigger」が強調表示されている。](../../../assets/images/make/copilot-studio-07/autonomous-agent-03.png)

**トリガーを追加** ダイアログで SharePoint コネクタ オプションの **ファイルが作成されたとき (プロパティのみ)** を選択し、 **次へ** を選択します。

![トリガー選択ダイアログで SharePoint の「ファイルが作成されたとき (プロパティのみ)」が強調表示されている。](../../../assets/images/make/copilot-studio-07/autonomous-agent-04.png)

次の手順ではトリガーに名前を付け、対象アプリへのアクセス許可を構成 / 接続します。今回は以下のアプリが対象です。

- Microsoft Copilot Studio  
- SharePoint  

次のようにトリガーを構成します。

- **トリガー名**: `When PDF uploaded to Candidate Data library`

![SharePoint トリガーの構成画面。](../../../assets/images/make/copilot-studio-07/autonomous-agent-05.png)

**次へ** を選択し、以下の追加設定を行います。

- **Site Address**: 対象 SharePoint サイトを選択または URL を入力  
- **Library Name**: `Candidate Data` を選択  
- **Folder**: 空欄 (ライブラリ全体を監視)  
- **Limit columns by View (Optional)**: All Documents  
- **Additional instructions to the agent when it's invoked by this trigger**: `Body` の内容を使用  

![SharePoint トリガーの詳細設定画面。](../../../assets/images/make/copilot-studio-07/autonomous-agent-06.png)

**トリガーを作成** を選択して SharePoint 監視トリガーを追加します。処理には少し時間がかかります。完了するとテストを促すダイアログが表示されます。

![トリガー作成完了の確認ダイアログ。](../../../assets/images/make/copilot-studio-07/autonomous-agent-07.png)

**閉じる** を選択してエージェントの **概要** セクションに戻ります。

<cc-end-step lab="mcs7" exercise="3" step="1" />

### Step 2: トリガーのテスト

**トリガー** の一覧に新しいトリガーが表示され、トリガー名の右側にあるフラスコ アイコンを選択してテストできます。

![トリガー一覧でテスト用フラスコ アイコンが強調表示されている。](../../../assets/images/make/copilot-studio-07/autonomous-agent-08.png)

フラスコを選択するとダイアログ ウィンドウが表示され、対象ライブラリへのファイル アップロードを待機します。

![トリガー テスト ダイアログ。](../../../assets/images/make/copilot-studio-07/trigger-test-01.png)

対象ライブラリにファイルが 1 件以上アップロードされるとダイアログが更新され、 **テストを開始** コマンドが有効になります。複数ファイルがある場合はテストに使用するファイルを選択できます。

事前にダウンロードした履歴書の PDF のいずれかをライブラリにアップロードし、エージェントが処理を開始するまで待ちます。

!!! note
    エージェントが新しいファイルを検知するまで最大 1 分ほどかかる場合があります。トリガー テスト ダイアログが準備完了となるまでお待ちください。

![テスト開始が有効になったダイアログ。](../../../assets/images/make/copilot-studio-07/trigger-test-02.png)

テストが開始すると、 **エージェントのテスト** サイド パネルでエージェントと対話できます。最初に HR MCP Server への接続を求められるので、エージェントからの自動メッセージの **接続マネージャーを開く** を選択し、 HR MCP Server に **接続** してから **リトライ** を選択します。

PDF の内容が正しく抽出され、 MCP サーバーに新しい候補者が追加されたことを示す確認メッセージが表示されます。

![トリガー テスト中の Copilot Studio テスト パネル。](../../../assets/images/make/copilot-studio-07/trigger-test-03.png)

必要に応じて `List all the candidates` とプロンプトを送信し、新しい候補者が一覧に含まれていることを確認できます。これで自律型エージェントは準備完了です。 **発行** するとエージェントは自動でファイルを処理し始めます。

発行時に次のような警告が表示される場合があります。

![発行ダイアログの警告。](../../../assets/images/make/copilot-studio-07/autonomous-agent-09.png)

1. **エディターの完全アクセス**: Editor 権限を持つユーザーは、フローやトリガーで使用される埋め込み接続にフル アクセスできます。  
1. **トリガーが著者の資格情報を使用**: これらのトリガーの手順が他のユーザーとデータを共有する場合、そのユーザーは元のエディターの資格情報で情報へアクセスまたはタスクを実行できます。  

エージェントを発行したら、追加の PDF 履歴書ファイルをアップロードして動作を確認してみてください。 SharePoint ライブラリにファイルをアップロード後、エージェントの **アクティビティ** セクションで `Automated` 呼び出しが表示されます。

![エージェントの「Activity」ビューに自動呼び出しが表示されている。](../../../assets/images/make/copilot-studio-07/autonomous-agent-10.png)

<cc-end-step lab="mcs7" exercise="3" step="2" />

## Exercise 4: 自律型エージェントの内部

この演習では、自律型エージェントの動作と内部処理を理解します。

### Step 1: トリガーの裏側

トリガーを作成・テストした後、エージェントの内部を確認したい場合は、トリガー横の省略記号 (**...**) を選び **Power Automate で編集** を選択します。

![SharePoint トリガーを Power Automate で編集するオプション。](../../../assets/images/make/copilot-studio-07/edit-trigger-01.png)

Power Automate では、自律型エージェントのトリガーを裏で支えるフローが表示されます。

![Power Automate 上のトリガー フロー。](../../../assets/images/make/copilot-studio-07/edit-trigger-02.png)

フローは非常にシンプルで、 SharePoint コネクタの **ファイルが作成されたとき (プロパティのみ)** トリガーと **指定された Copilot にプロンプトを送信して処理する** アクションのみで構成されています。つまり、自律型エージェントのトリガーは Copilot Studio へプロンプトを送信する Power Automate フローに他なりません。そのため、ほぼすべての Power Automate フロー トリガーを Copilot Studio の自律型エージェント トリガーとして使用できます。

必要に応じて、エージェントを呼び出す前にフロー内で追加処理を行うようカスタマイズできます。ただし、その場合は次のステップで説明する注意点を考慮してください。

<cc-end-step lab="mcs7" exercise="4" step="1" />

### Step 2: 複数ファイルのアップロード処理

自律型エージェントのトリガーについてもう一つ重要なポイントは、 SharePoint へ複数ファイルをアップロードした場合、または複数のトリガー イベントが発生した場合でも、必ずしもファイル / イベントごとに Power Automate フローが 1 件ずつ実行されるわけではないことです。例えば SharePoint ドキュメント ライブラリに複数ファイルを同時にアップロードすると、 1 つのフロー インスタンスが一定時間内にアップロードされた複数ファイルをまとめて処理する可能性があります。  
Power Automate フローは 1 つのエージェント インスタンスを呼び出し、そのエージェントがファイルを 1 件ずつ順に処理します。

この動作は、ファイルを 2 件以上まとめてアップロードし、 Power Automate フローと Copilot Studio の自律型エージェントの実行を確認すると分かります。アップロードされたファイルのセットに対してフローは 1 つだけ実行され、エージェント インスタンスも 1 つだけ生成されます。

エージェントの **アクティビティ** セクションで `Automated` インスタンスを選択すると、 `Completed steps` が複数あることを確認できます。

![複数ファイルを処理したエージェント インスタンスの「Activity」。](../../../assets/images/make/copilot-studio-07/inspect-autonomous-agent-01.png)

インスタンスを開くと、エージェントが `add_candidate` ツールをファイルごとに呼び出して 2 件 (またはそれ以上) のファイルを処理したことが分かります。エージェントで複雑なロジックを定義する必要はありません。エージェントの手順に次のように記述しているだけで十分です。

```text
... When a new PDF file is uploaded to the SharePoint document library: ...
```

これだけでエージェントの自律的な知能がすべてのアップロード ファイルをループ処理し、同じロジックを適用します。 AI の強力さが実感できるはずです。

![2 件のファイルを処理し、各ファイルで "add_candidate" ツールを呼び出した実行詳細。](../../../assets/images/make/copilot-studio-07/inspect-autonomous-agent-02.png)

<cc-end-step lab="mcs7" exercise="4" step="2" />

---8<--- "ja/mcs-congratulations.md"

Lab MCS7 - 自律型エージェントの作成 を完了しました!

<!-- <cc-award path="Make" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/07-autonomous--ja" />