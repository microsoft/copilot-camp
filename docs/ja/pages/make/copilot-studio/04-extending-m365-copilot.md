---
search:
  exclude: true
---
# ラボ MCS4 - Microsoft 365 Copilot の拡張

このラボでは、 Microsoft 365 Copilot Chat を Declarative エージェントで拡張する方法を学習します。この Declarative エージェントは Microsoft Copilot Studio で作成します。これまでに Copilot Studio でエージェントを作成し、それらを Microsoft Teams で利用する方法を確認してきました。また、 Microsoft Copilot Studio で作成したエージェントは **Teams and Microsoft 365 Copilot** チャネルを通じて Microsoft Teams と Microsoft 365 Copilot Chat の両方を対象にできることも確認済みです。本ラボでは、 Microsoft 365 Copilot Chat 向けの Declarative エージェントに取り組みます。

このラボで学習する内容:

- Microsoft 365 Copilot Chat 用の Declarative エージェントの作成方法
- エージェント用のカスタムアイコンの設定方法
- エージェント用のナレッジ ソースの設定方法
- Microsoft 365 Copilot Chat へのエージェント公開方法
- Microsoft 365 Copilot Chat 用のツール作成方法

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/JUctt1s5oj0" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を確認しましょう。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

## エクササイズ 1 : Microsoft 365 Copilot Chat 用エージェントの作成

このエクササイズでは、 Microsoft Copilot Studio で Declarative エージェントを作成し、 Microsoft 365 Copilot Chat でホストします。

### ステップ 1: Copilot Chat 用エージェントの作成

Microsoft 365 Copilot Chat 用の Declarative エージェントを作成するには、まず 1️⃣ Copilot Studio でエージェントの一覧を表示し、 2️⃣ **Microsoft 365 Copilot** という名前のエージェントを選択します。

![Microsoft Copilot Studio でエージェント一覧を表示し、 **Microsoft 365 Copilot** エージェントを選択している画面。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-01.png)

Microsoft Copilot Studio の新しいセクションが開きます。そこで **+ Add** コマンドを選択し、 Microsoft 365 Copilot Chat 用の新しいエージェントを作成します。

![Microsoft Copilot Studio で Microsoft 365 Copilot エージェントを編集している画面。 **+ Add** ボタンが強調表示され、事前定義ツールの一覧もある。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-02.png)

Copilot Studio からエージェントの目的を自然言語で説明するように求められます。[ラボ MCS1](../01-first-agent){target=_blank} と同様に、以下のようなプロンプトを用いて自然言語で要件を定義できます。

```txt
You are an agent helping employees to find information about HR policies and procedures,
about how to improve their career, and about how to define learning pathways.
```

Copilot Studio から名前を聞かれたら、カスタム エージェント名として「Agentic HR」と入力します。その後、次の指示を与えて特定のタスクや目標を設定します。

```txt
Emphasize everything that helps team building, inclusion, and the growth mindset
```

さらに、エージェントのトーンをプロフェッショナルに設定するため、次の入力を提供します。

```txt
It should have a professional tone
```

![Microsoft Copilot Studio で自然言語を使ってエージェントを定義している画面。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-03.png)

エージェントの説明が完了したら **Create** を選択してエージェントを実際に作成します。あるいは **Skip to configure** を選択して従来の設定 UI に移動してもかまいません。

エージェントが作成されると設定ページが表示され、以下を定義できます。

- Details: 名前、アイコン、説明、 instructions (システムプロンプト) などの一般情報
- Knowledge: エージェント用の各種ナレッジ ベース
- Tools: エージェント用のカスタムツール
- Additional settings: パブリック Web コンテンツを利用するかどうかの設定
- Starter prompts: 新しいチャット開始時に Copilot Chat で表示されるスターター プロンプト (最大 6 件)
- Publishing details: 公開後のエージェント利用方法に関する情報

![Microsoft Copilot Studio における Microsoft 365 Copilot Chat 用エージェントの設定ページ。一般情報、ナレッジ ベース、ツール、追加設定、スターター プロンプト、公開情報のセクションがある。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-04.png)

画面右側にはエージェントのプレビューが表示され、動作をすぐにテストできます。
初期セットアップは完了です。次のステップで詳細設定を行います。

<cc-end-step lab="mcs4" exercise="1" step="1" />

### ステップ 2: エージェント アイコンの更新

**Details** セクション右上の **Edit** コマンドを選択し、詳細情報を編集します。
編集モードになったら **Change icon** を選択し、カスタムアイコンをアップロードしてアイコンの背景色を設定します。
必要であれば、[こちらのリンク](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/HR-agent-color.png?raw=true){target=_blank} のアイコンを使用できます。その場合、背景色は #B9BAB5 が適しています。

![エージェント詳細を編集し、アイコンを更新している設定ページ。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-05.png)

**Save** を選択して新しいアイコンと背景色を保存し、再度 **Save** を選択して詳細情報を確定します。

<cc-end-step lab="mcs4" exercise="1" step="2" />

### ステップ 3: ナレッジ ベースの追加

[ラボ MCS1](../01-first-agent){target=_blank} と同様に、 Word、PowerPoint、PDF など数ファイルが入った ZIP を [こちらのリンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} からダウンロードしてください。

ZIP を展開し、同一テナントの SharePoint Teams サイトの **Documents** ライブラリへアップロードします。これらのドキュメントは、エージェントに追加のナレッジ ベースを提供するために Microsoft 365 Copilot で生成されたものです。

サイトの絶対 URL をコピーします。例: `https://xyz.sharepoint.com/sites/contoso`

ナレッジ ソースを追加するには、 **Knowledge** セクション右上の **+ Add knowledge** コマンドを選択します。ダイアログが表示され、データ ソースを選択できます。執筆時点では **SharePoint** を選択可能です。 **SharePoint** を選択し、使用したいサイトを参照します。

![ナレッジ ベース追加のダイアログ。 **Featured** に SharePoint が表示され、 **Advanced** データ ソースを参照するコマンドもある。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-06.png)

先ほどコピーした SharePoint Online サイトの URL を貼り付けるか、 **Browse files** を選択し SharePoint Online サイトからデータ ソースを検索します。URL を入力またはデータ ソースを選択したら、新しいナレッジ ベースの名前と説明を入力します。説明はユーザーのプロンプトによる意図に基づき、 Copilot がデータ ソースを選択する際に使用されます。

![SharePoint Online データ ソースを設定するダイアログ。 **Browse files** コマンドと直接リンク用テキスト ボックスがあり、既に選択済みのデータ ソースが表示されている。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-07.png)

**Add** ボタンを選択し、ナレッジ ベースにデータ ソースを追加します。

!!! warning "重要"
    Copilot Studio でエージェントのナレッジ ベースとして SharePoint Online サイトを設定した場合、ユーザーは自分がアクセス権を持つドキュメントのみ参照できます。 Microsoft 365 のセキュリティ基盤によりアクセス制御が保証され、 Copilot Studio エージェントは現在のユーザーの権限でドキュメントにアクセスします。
    
<cc-end-step lab="mcs4" exercise="1" step="3" />

### ステップ 4: Microsoft 365 Copilot Chat への公開

エージェントを Microsoft 365 Copilot Chat でテストするため公開します。1️⃣ 画面右上の **Publish** コマンドを選択し、エージェントを Copilot Chat で利用可能にします。続いて 2️⃣ 必要事項を入力し、最後に 3️⃣ ダイアログ下部の **Publish** を選択します。

![Copilot Studio のエージェント画面で **Publish** ボタンと公開ダイアログが表示されている。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-08.png)

公開に必要な情報は Microsoft 365 アプリ マニフェストで求められる項目です。

- Short description: エージェントの短い説明 (30 文字以内)
- Long description: エージェントの長い説明 (100 文字以内)
- Developer name: 開発者名 (32 文字以内)
- Website: 開発者 Web サイトの URL (2048 文字以内)
- Privacy statement: プライバシー ポリシーの URL (2048 文字以内)
- Terms of use: 利用規約の URL (2048 文字以内)

初回の公開には 30〜60 秒程度かかります。公開が完了すると、利用オプションの概要ダイアログが表示されます。

![公開成功を示すダイアログ。エージェントへの直接リンクコピー、共有設定、 ZIP パッケージのダウンロードなどのコマンドがある。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-09.png)

具体的には次の操作が可能です。

- **Copy** : エージェント アプリへの直接リンク URL をコピー
- **Show to my teammates and shared users** : 組織内の特定のグループやユーザーと共有
- **Show to everyone in my org** : 組織全体と共有
- **Download .zip file** : ストア公開用の ZIP パッケージをダウンロード

!!! note "Show to everyone in my org"
    組織全体と共有する場合、エージェントがリリース準備完了かつ社内標準・ポリシーに準拠していることを確認してください。チームメイトと調整し、提出後は管理者が承認または拒否するまで再提出できません。詳細は [Show to the organization](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams#show-to-the-organization){target=_blank} をご覧ください。

**Copy** を選択し、新しいブラウザー タブを開いて URL を貼り付けます。
会社のアプリ ストアが表示され、 **Add** ボタンを選択してエージェントを Microsoft 365 Copilot に追加できます。

![会社ストアでエージェントを Microsoft 365 Copilot に追加するダイアログ。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-10.png)

エージェントを Microsoft 365 Copilot Chat に追加すると、 Copilot チャット右側のエージェント一覧に表示されます。

![Microsoft 365 Copilot Chat に表示された "Agentic HR" エージェント。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-11.png)

エージェントを選択して対話を開始します。たとえば次のプロンプトを送信できます。

```txt
How can we hire new people in our company?
```

エージェントはナレッジ ベースのドキュメントを参照し、採用手順に関する詳細情報を提供します。主な情報源は SharePoint Online にアップロードした `Hiring Procedures.docx` です。

![Microsoft 365 Copilot Chat で "Agentic HR" エージェントが採用手順について回答し、 SharePoint Online の Word ドキュメントを参照している。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-12.png)

<cc-end-step lab="mcs4" exercise="1" step="4" />

## エクササイズ 2 : エージェントへのツール追加

このエクササイズでは、前のエクササイズで作成したエージェントにカスタム ツールを追加します。 Microsoft Copilot Studio で Microsoft 365 Copilot Chat 用エージェントを作成する際、追加できるツールの種類は 4 つあります。

- Prompt: 自然言語で記述したプロンプトを使用する AI ツール
- Custom connector: Power Platform のカスタム コネクターを使用
- REST API: 外部 REST API を使用。詳細は [こちら](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api){target=_blank}
- Model Context Protocol: MCP サーバーとそのツールを使用

!!! information "エージェント用ツール"
    Copilot Studio でエージェントにツールを追加する方法の詳細は [Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-plugin-actions){target=_blank} を参照してください。

本ラボでは `Custom connector` タイプのツールを追加し、 SharePoint Online に保存された Excel スプレッドシートから候補者一覧を取得します。

### ステップ 1: Microsoft 365 Copilot 用エージェントにツールを追加

新しいツールを追加するには、エージェント設定パネルの **Tools** セクションで **+ Add tool** を選択します。

![エージェントの **Tools** セクションで **+ Add tool** コマンドが強調表示されている。](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-01.png)

ダイアログが表示され、作成するツールの種類を選択できます。既定では Excel Online などと連携する **Featured** ツールがいくつか示されています。 **+ New tool** を選択すると前述のオプションから新しいツールを作成可能です。

目的の項目が Featured にない場合は **All** グループに切り替え、テキスト検索します。

今回は Featured ツールの **Excel Online (Business)** を選択し、 **List rows present in a table** を選びます。まず **Connection** を選択し **Create new connection** をクリックして外部コネクターへ接続します。

![対象 Power Platform コネクターへの接続ダイアログ。接続情報や新規接続ボタンがある。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03.png)

自分のアカウントでサインインし、 Excel Online (Business) へのアクセスを許可します。接続が設定されると、 **Add to agent** または **Add and configure** を選択できるダイアログが表示されます。

![ツールをエージェントに追加するダイアログ。 **Add to agent** と **Add and configure** のコマンドがある。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03b.png)

ツールを追加すると Copilot Studio のツール一覧に表示されます。作成したツールをクリックして設定を編集します。設定パネルでは次を指定します。

- Name: ツールの説明的な名前
- Display name: 表示名
- Description: 自然言語の説明。ジェネレーティブ オーケストレーションがツールをいつ使うかを判断する際に使用
- Inputs and outputs: 入出力引数
- Response settings: リクエストと応答の処理方法

設定前に候補者一覧用 Excel スプレッドシートを準備します。
サンプル Excel ファイルは [こちら](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/Candidates/Sample-list-of-candidates.xlsx?raw=true){target=_blank} からダウンロードできます。

同一テナントの SharePoint Teams サイトの **Documents** ライブラリへアップロードします。このドキュメントは想定上の候補者一覧として Microsoft 365 Copilot で生成されました。

- サイト コレクション URL をコピー: 例 `https://xyz.sharepoint.com/sites/contoso/`
- ドキュメント ライブラリ名をコピー: 例 `Shared documents`
- ファイル名をコピー: 例 `Sample-list-of-candidates.xlsx`

では Copilot Studio に戻りツール設定を完了します。以下の設定を使用してください。

- Name: List HR candidates
- Description: List candidates for an HR role

ツール編集ダイアログで **Tool name** をわかりやすい名前に変更し、 **Inputs** タブで入力引数を設定します。既定では必須引数がすべてユーザーの応答から抽出されるよう **Identify as** に設定されています。

![アクションの入力引数を設定するタブ。各引数に固有の設定がある。](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-02.png)

各入力引数の **How will the agent fill this input?** を `Set as a value` に変更し、すべての引数を固定値にします。設定変更を確認し、各引数に静的値を設定してください。

![**Location** 引数を静的値で設定している画面。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-07.png)

静的値は次のとおりです。

- Location: Excel ファイルを保存した SharePoint Online サイト コレクションの URL  
  例 `https://xyz.sharepoint.com/sites/contoso/`
- Document Library: スプレッドシートを保存したドキュメント ライブラリ名  
  例 `Shared Documents`
- File: Excel ファイル名  
  例 `Sample-list-of-candidates.xlsx`
- Table: `Candidates_Table`

![設定例に従い入力引数を構成した一覧。すべて手動値で設定済み。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-08.png)

画面右上の **Save** を選択しアクションを保存します。

<cc-end-step lab="mcs4" exercise="2" step="1" />

### ステップ 2: 新しいツールのテスト

更新したエージェントを公開し、統合テスト パネルまたは Microsoft Teams で試します。
再度 **Publish** を選択し、公開を更新します。完了したらエージェント アプリへの直接リンクを開きます。今回は **Add** の代わりに **Update now** が表示されますので選択し、完了後 Microsoft 365 Copilot Chat を更新してエージェントと対話します。

作成したツールを呼び出すのは簡単で、以下のようなプロンプトをエージェントに送るだけです。

```txt
Show me the list of candidates for HR with role "HR Director" or "HR Manager"
```

Microsoft 365 Copilot Chat は外部 API (Excel Online) の利用許可を求めるので **Always allow** か **Allow once** を選択します。テスト目的で **Allow once** を選択してください。

![Microsoft 365 Copilot Chat が Excel Online API へのアクセス許可を求めるダイアログ。](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-03.png)

Power Platform コネクターは有効な接続が必要なため、エージェントはユーザーに **Sign in to Agentic HR** を求めます。 

![Microsoft 365 Copilot Chat が外部 Excel Online API へのサインインを要求している。](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-04.png)

外部コネクターに接続し、再度プロンプトを実行すると、エージェントは Excel スプレッドシートから取得した条件に合致する候補者一覧を返します。

![Microsoft 365 Copilot Chat が外部 Excel Online API へのサインインを要求している。](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-05.png)

お疲れさまでした! Copilot Studio で作成した Microsoft 365 Copilot エージェントから外部コネクターを利用できました。

<cc-end-step lab="mcs4" exercise="2" step="2" />

---8<--- "ja/mcs-congratulations.md"

<a href="../05-connectors">こちらから開始</a> してラボ MCS5 で Copilot Studio のカスタム コネクター利用方法を学びましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/04-extending-m365-copilot" />