---
search:
  exclude: true
---
# ラボ MCS4 - Microsoft 365 Copilot の拡張

本ラボでは、Microsoft Copilot Studio を使用して作成された宣言型エージェントで Microsoft 365 Copilot Chat を拡張する方法を学びます。これまで、Copilot Studio でエージェントを作成し、Microsoft Teams でそれを利用する方法を見てきました。また、Microsoft Copilot Studio で作成されたエージェントは、**Teams and Microsoft 365 Copilot** チャネル内の特定のオプションを通じて、Microsoft Teams と Microsoft 365 Copilot Chat の両方を対象にできることも確認しました。さて、本ラボでは Microsoft 365 Copilot Chat 向けの宣言型エージェントへと進みます。

本ラボで学ぶ内容は以下のとおりです：

- Microsoft 365 Copilot Chat 向けの宣言型エージェントの作成方法
- エージェント用カスタムアイコンの設定方法
- エージェント用ナレッジソースの設定方法
- Microsoft 365 Copilot Chat でのエージェントの公開方法
- Microsoft 365 Copilot Chat 向けツールの作成方法

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/JUctt1s5oj0" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

## Exercise 1 : Microsoft 365 Copilot Chat 向けエージェント作成

本演習では、Microsoft Copilot Studio を使用して宣言型エージェントを作成し、それを Microsoft 365 Copilot Chat でホストします。

### Step 1: Copilot Chat 用エージェントの作成

Microsoft 365 Copilot Chat 向けの宣言型エージェントを作成するには、まず 1️⃣ Copilot Studio でエージェントの一覧を閲覧し、2️⃣ **Microsoft 365 Copilot** という名前のエージェントを選択してください。

![Copilot Studio でエージェント一覧を閲覧し、**Microsoft 365 Copilot** エージェントを選択しているインターフェイス。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-01.png)

Microsoft Copilot Studio の新しいセクションが開きます。そこから **+ Add** コマンドを選択して、Microsoft 365 Copilot Chat 用の新しいエージェントを作成できます。

![Microsoft 365 Copilot エージェントを編集している Copilot Studio のインターフェイス。**+ Add** ボタンが強調表示されています。また、事前定義されたツールの一覧も表示されています。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-02.png)

Copilot Studio では、エージェントの目的を自然言語で記述するよう求められます。[Lab MCS1](../01-first-agent){target=_blank} で行ったように、例えば以下のプロンプトを使用してエージェントの要件を自然言語で定義できます。

```txt
You are an agent helping employees to find information about HR policies and procedures,
about how to improve their career, and about how to define learning pathways.
```

Copilot Studio からの指示に従い、カスタムエージェントに "Agentic HR" という名前を設定してください。そして、以下の指示を使って、Copilot Studio に特定のタスクまたは目的を持たせるように指示します。

```txt
Emphasize everything that helps team building, inclusion, and the growth mindset
```

次に、エージェントにプロフェッショナルな口調を定義し、以下の入力を提供してください。

```txt
It should have a professional tone
```

![自然言語でエージェントを定義している Microsoft Copilot Studio のインターフェイス。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-03.png)

エージェントの記述が完了したら、**Create** コマンドを選択してエージェントを実際に作成します。あるいは、**Skip to configure** コマンドを選択して、従来の設定ユーザーインターフェイスに進むことも可能です。

エージェントが作成されると、その設定ページが表示され、以下の項目を定義できます：

- Details：エージェントの名前、アイコン、説明、および指示（システムプロンプト）など、エージェントに関する一般情報。
- Knowledge：エージェントの各種ナレッジベースの設定。
- Tools：エージェント用のカスタムツールの定義。
- Additional settings：エージェントがパブリックな Web コンテンツに依存するかどうかの設定。
- Starter prompts：新しいチャット開始時に Copilot Chat に表示される最大 6 つのスタータープロンプトの設定。
- Publishing details：エージェント公開後の利用方法に関する情報。

![Microsoft Copilot Studio における Microsoft 365 Copilot Chat 用エージェントの設定ページ。一般情報、ナレッジベース、ツール、追加設定、スタータープロンプト、および公開詳細を定義するセクションがあります。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-04.png)

画面右側には、エージェントの挙動をテストするために利用可能なプレビューが既に表示されています。  
エージェントの初期設定は完了です。次のステップに進み、詳細設定を微調整してください。

<cc-end-step lab="mcs4" exercise="1" step="1" />

### Step 2: エージェントのアイコン更新

次に、**Details** セクション右上の **Edit** コマンドを選択して詳細を編集します。  
編集モードに入ったら、**Change icon** コマンドを選択してカスタムアイコンのアップロードと、アイコン自体の背景色の選択を行います。  
必要に応じて、[こちらのリンク](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/HR-agent-color.png?raw=true){target=_blank} で利用可能なアイコンを使用できます。提案されたアイコンを使用する場合、背景色は #B9BAB5 に設定してください。

![エージェントの詳細を編集しており、特にアイコンを更新している設定ページ。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-05.png)

**Save** コマンドを選択して新しいアイコンと背景色を保存し、その後もう一度 **Save** ボタンを選んでエージェントの更新された詳細を保存してください。

<cc-end-step lab="mcs4" exercise="1" step="2" />

### Step 3: エージェントへのナレッジベースの追加

[Lab MCS1](../01-first-agent){target=_blank} で実施したように、こちらの[リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} を選択して、いくつかのファイル（Word、PowerPoint、PDF）からなる ZIP ファイルをダウンロードしてください。

ZIP ファイルを解凍し、解凍したファイルを、Copilot Studio でエージェントを作成しているテナント内の SharePoint Teams サイトの **Documents** ライブラリにアップロードします。これらのドキュメントは、追加のナレッジベースとしてエージェントに情報を提供する目的で Microsoft 365 Copilot により生成されました。

サイトの絶対 URL をコピーしてください。例：`https://xyz.sharepoint.com/sites/contoso`

エージェントにナレッジソースを追加するには、**Knowledge** セクション右上の **+ Add knowledge** コマンドを選択します。ダイアログウィンドウが表示され、データソースの選択が可能になります。現時点では、**SharePoint** データソースを選択できます。**SharePoint** コマンドを選択し、データソースとして使用するサイトを閲覧してください。

![エージェントの追加ナレッジベースを設定するためのダイアログ。現在、**Featured** ナレッジベースの一覧には SharePoint のみが表示されています。また、**Advanced** データソースを閲覧するためのコマンドもあります。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-06.png)

ダイアログに、先ほどドキュメントを保存した SharePoint Online サイトの URL を貼り付けるか、**Browse files** コマンドを選択して SharePoint Online サイト内のデータソースを検索してください。URL を提供またはデータソースを選択した後、新しいナレッジベースに対して名前と意味のある説明を入力する必要があります。この説明は、ユーザーのプロンプトによって定義された意図に基づき、Copilot がデータソースをターゲットする際に使用されます。

![SharePoint Online データソースの設定ダイアログ。**Browse files** コマンドや、データソースへの直接リンクを貼り付けるためのテキストボックスがあります。また、既に選択されたデータソースの URL リンク、名前、説明が表示されています。ダイアログ下部には、データソースを保存するための **Add** コマンド、操作をキャンセルする **Cancel** コマンド、前のステージに戻る **Back** コマンドがあります。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-07.png)

**Add** ボタンを選択して、新しいデータソースをエージェントのナレッジベースに追加してください。

!!! warning "重要"
    Copilot Studio において SharePoint Online サイトをエージェントのナレッジベースとして設定する場合、ユーザーは自分がアクセス可能なドキュメントからのみ回答やコンテンツを取得できます。セキュリティおよびアクセス制御は Microsoft 365 のセキュリティインフラストラクチャによって保証され、Copilot Studio エージェントは現在のユーザーに代わってドキュメントにアクセスします。
    
<cc-end-step lab="mcs4" exercise="1" step="3" />

### Step 4: Microsoft 365 Copilot Chat でのエージェント公開

ここで、エージェントを公開して Microsoft 365 Copilot Chat でテストできます。まず 1️⃣ ページ右上の **Publish** コマンドを選択して、Copilot Chat で利用可能な状態にエージェントを設定します。次に、2️⃣ エージェントの詳細を入力し、最後に 3️⃣ 公開ダイアログ下部の **Publish** コマンドを選択してください。

![**Publish** ボタンが強調表示された Copilot Studio 内のエージェントと、短い説明、長い説明、デベロッパー名、デベロッパーのウェブサイト URL、プライバシーステートメント URL、利用規約 URL を定義するフィールドがある公開ダイアログ。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-08.png)

エージェントの詳細は、Microsoft 365 アプリケーションマニフェストで要求される項目です：

- Short description：エージェントの短い説明（最大 30 文字）。
- Long description：エージェントの長い説明（最大 100 文字）。
- Developer name：デベロッパーの名前（最大 32 文字）。
- Website：デベロッパーのウェブサイトの URL（最大 2048 文字）。
- Privacy statement：プライバシーステートメントの URL（最大 2048 文字）。
- Terms of use：利用規約の URL（最大 2048 文字）。

初回の公開には 30 ～ 60 秒ほどかかります。エージェントが公開されると、すべての利用可能オプションのまとめが表示されたダイアログが表示されます。

![公開に成功したことを確認するダイアログ。エージェントアプリへの直接リンクをコピーするための **Copy** コマンド、特定のグループのユーザーとエージェントを共有するための 2 つのコマンド、そしてエージェントをストアに公開するための ZIP パッケージをダウンロードするコマンドが表示されています。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-09.png)

具体的には、以下の選択が可能です：

- **Copy** コマンド：新しいエージェント用に登録されたアプリへの直接リンクの URL をコピーします。
- **Show to my teammates and shared users**：組織内の選択されたグループや個人とエージェントを共有します。
- **Show to everyone in my org**：エージェントを組織全体と共有します。
- **Download .zip file**：後で Microsoft 365 ストアにアップロードできるアプリの ZIP パッケージをダウンロードします。

!!! note "組織全体への公開について"
    エージェントを組織全体と共有する場合、エージェントがリリース準備完了であり、社内の基準、規則、ポリシーに準拠していることを確認してください。チームメンバーと連携してください。一度エージェントが提出されると、管理者によって承認または却下されるまで他者による再提出はできません。組織全体向けアプリ公開の詳細については、[Show to the organization](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams#show-to-the-organization){target=_blank} をご参照ください。

**Copy** コマンドを選択し、新しいブラウザー タブを開いてエージェントの直接リンク URL を貼り付けます。  
会社のアプリストアがブラウザーに表示され、ダイアログからエージェントを Microsoft 365 Copilot に追加するための **Add** ボタンが選択可能になります。

![Microsoft 365 Copilot にエージェントを追加するためのダイアログが表示されている会社ストア。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-10.png)

エージェントを Microsoft 365 Copilot Chat に追加すると、Copilot Chat 右側のエージェント一覧に表示されます（以下のスクリーンショット参照）。

![Microsoft 365 Copilot Chat に表示されている "Agentic HR" エージェント。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-11.png)

エージェントを選択して対話を開始してください。たとえば、以下のプロンプトを入力できます：

```txt
How can we hire new people in our company?
```

エージェントは、ナレッジベースに定義されたドキュメントから取得されたコンテンツに基づき、採用手続きに関する詳細情報を提供します。たとえば、回答の主要なデータソースは、SharePoint Online にアップロードされた `Hiring Procedures.docx` というドキュメントとなります。

![採用手続きについてのプロンプトに回答し、エージェントのナレッジベースである SharePoint Online の Word ドキュメントへの参照を提供している Microsoft 365 Copilot Chat 内の "Agentic HR" エージェント。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-12.png)

<cc-end-step lab="mcs4" exercise="1" step="4" />

## Exercise 2 : エージェントへのツール追加

本演習では、前の演習で作成したエージェントにカスタムツールを追加します。Microsoft Copilot Studio では、Microsoft 365 Copilot Chat 向けエージェント作成時に、以下の 4 種類のツールを追加できます：

- Prompt：自然言語で記述されたプロンプトを利用して AI ツールを利用可能にします。
- Custom connector：Power Platform のカスタムコネクタを利用可能にします。
- REST API：外部 REST API を利用可能にします。詳細は[こちら](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api){target=_blank}を参照してください。
- Model Context Protocol：MCP サーバーとそのツールを利用可能にします。

!!! information "エージェント用ツール"
    Copilot Studio におけるエージェントへのツール追加に関する詳細情報は、[Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-plugin-actions){target=_blank} の記事をご参照ください。

本ラボでは、SharePoint Online に保存された Excel スプレッドシートから候補者のリストを取得するため、`Custom connector` 型のツールを追加します。

### Step 1: Microsoft 365 Copilot 用エージェントへのツール追加

新しいツールを追加するには、エージェントの設定パネル内の **Tools** セクションで **+ Add tool** コマンドを選択してください。

![**+ Add tool** コマンドが強調表示されているエージェントの **Tools** セクション。](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-01.png)

ダイアログウィンドウが表示され、どの種類のツールを作成するかを選択できます。デフォルトでは、Excel Online のコンテンツやその他一般的なサービスと連携するための **Featured** ツールがいくつか用意されています。また、**+ New tool** コマンドを選択して、前述のオプションから新規ツールをゼロから作成することもできます。

探しているオプションが Featured の一覧に見当たらない場合は、単に **All** グループに切り替えて、検索テキストで探してください。

本ステップを完了するため、Featured ツールの **Excel Online (Business)** を選択し、次に **List rows present in a table** を選択してください。まず、**Connection** を選択し、**Create new connection** を選択して外部コネクタへの接続プロセスを進める必要があります。

![接続の詳細情報や、新規接続作成ボタン、またはやり直し用のバックボタンが表示された、対象の Power Platform コネクタへの接続ダイアログ。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03.png)

自分のアカウントでログインし、Excel Online (Business) へのアクセス許可を与えてください。接続が設定されると、**Add to agent** または **Add and configure** のコマンドが表示されたダイアログが表示されます。

![エージェントへツールを追加するためのダイアログ。**Add to agent** または **Add and configure** のコマンドがあり、やり直し用のバックボタンもあります。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03b.png)

ツールを追加した後、Copilot Studio でツール一覧が表示されます。作成したツールをクリックして設定を編集してください。設定パネルでは以下を入力する必要があります：

- Name：ツールの説明的な名前。
- Display name：ツールの表示名。
- Description：生成的オーケストレーションがツール使用のタイミングを判断するために利用する、自然言語で記述された説明。
- Inputs and outpus：アクションの入力および出力パラメーター（存在する場合）の定義。
- Response settings：アクションがユーザーへのリクエストとレスポンスをどのように処理するかの定義。

ツールの設定を行う前に、候補者リストが記載された Excel スプレッドシートを準備する必要があります。こちらの[リンク](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/Candidates/Sample-list-of-candidates.xlsx?raw=true){target=_blank} を選択してサンプル Excel ファイルをダウンロードしてください。

ダウンロードしたファイルを、Copilot Studio でエージェントを作成しているテナント内の SharePoint Teams サイトの **Documents** ライブラリにアップロードします。このドキュメントは、架空の候補者リストとして Microsoft 365 Copilot により生成されました。

- サイトの絶対 URL をコピーしてください。例：`https://xyz.sharepoint.com/sites/contoso/`
- ドキュメントライブラリの名前をコピーしてください。例：`Shared documents`
- さらに、ファイル名もコピーしてください。例：`Sample-list-of-candidates.xlsx`

Microsoft Copilot Studio に戻り、ツールの設定を完了してください。以下の設定を使用します：

- Name：List HR candidates
- Description：List candidates for an HR role

ツール編集のダイアログで、**Tool name** を更新して、より説明的で情報量の多い名前に変更してください。次に Inputs タブを選択し、入力パラメーターの設定を開始します。デフォルトでは、全ての必須入力パラメーターは、各入力パラメーターの **Identify as** プロパティにあるように、ユーザーの全体的なレスポンスからその値を抽出するように設定されています。

![各入力パラメーターの設定が表示されているアクションの入力引数設定タブ。](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-02.png)

各入力パラメーターについて、**How will the agent fill this input?** の設定を選択し、`Set as a value` に切り替えて、全ての入力パラメーターに対して静的な値を提供するように設定してください。設定変更の確認後、各入力パラメーターに対して静的値の設定を進めます。

![手動で設定された静的値がソースとして設定されている **Location** 入力パラメーターの構成例。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-07.png)

以下の静的な値を使用してください：

- Location：Excel スプレッドシートを保存した SharePoint Online サイト コレクションの URL を使用します。例：`https://xyz.sharepoint.com/sites/contoso/`
- Document Library：Excel スプレッドシートを保存したドキュメントライブラリの名称を使用します。例：`Shared Documents`
- File：Excel ファイルの名前を入力します。例：`Sample-list-of-candidates.xlsx`
- Table：`Candidates_Table`

![各入力パラメーターに対して手動で提供された値が設定されている一覧。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-08.png)

画面右上の **Save** ボタンをクリックして、更新されたアクションを保存してください。

<cc-end-step lab="mcs4" exercise="2" step="1" />

### Step 2: 新しいツールのテスト

更新されたエージェントを公開し、統合テストパネルまたは Microsoft Teams で動作を確認する準備が整いました。再度 **Publish** ボタンを選択して、エージェントの公開情報を更新してください。公開が完了したら、エージェントのアプリへの直接リンクを再び開いてください。演習 1 - Step 4 で表示された **Add** の代わりに **Update now** コマンドが表示されます。**Update now** コマンドを選択して待機してください。準備完了後、Microsoft 365 Copilot Chat に移動し、ページを更新して、更新されたエージェントとの対話を開始してください。

作成したツールを呼び出すのは非常に簡単です。エージェントに対して以下のようなプロンプトを入力してください：

```txt
Show me the list of candidates for HR with role "HR Director" or "HR Manager"
```

Microsoft 365 Copilot Chat は、外部 API（Excel Online）の利用許可を求めるダイアログを表示し、**Always allow** または **Allow once** のオプションを選択するよう促します。テスト目的のため、将来的に再度認証プロセスを試せるよう **Allow once** を選択してください。

![Excel Online 用の外部 API 利用に対する同意を求める Microsoft 365 Copilot Chat のダイアログ。**Always allow**、**Allow once** 、および **Cancel** の 3 つのボタンが存在します。](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-03.png)

Power Platform コネクタには有効な接続が必要なため、エージェントは外部データソースを利用する前にユーザーに **Sign in to Agentic HR** を促します。

![Excel Online の外部 API 利用のためサインインを促す Microsoft 365 Copilot Chat の画面。](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-04.png)

外部コネクタに接続し、再度プロンプトを実行してください。エージェントは、入力された条件に一致する Excel スプレッドシートから取得した候補者一覧を含む回答を返します。

![外部 Excel Online API の利用のためサインインを促す Microsoft 365 Copilot Chat の画面。](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-05.png)

お疲れ様でした！ Microsoft 365 Copilot 用の Copilot Studio エージェントから外部コネクタを利用することに成功しました。

<cc-end-step lab="mcs4" exercise="2" step="2" />

---8<--- "ja/mcs-congratulations.md"

<a href="../05-connectors">Lab MCS5 はこちらから開始してください</a>。Copilot Studio におけるカスタムコネクタの利用方法を学びます。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/04-extending-m365-copilot" />