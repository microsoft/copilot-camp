---
search:
  exclude: true
---
# ラボ MSA1 - 初めての SharePoint エージェント を構築

---8<--- "ja/msa-labs-prelude.md"

このラボでは、SharePoint Online に保存されているドキュメント を扱う SharePoint エージェント を作成します。これから作成するエージェント は、架空 の企業 の ユーザー が HR 部門 から情報、ポリシー、および規則 を取得するのに役立ちます。エージェント の知識ベース は、SharePoint Online のドキュメント ライブラリ に保存された一連 のドキュメント となります。

## 演習 1 : サンプル ドキュメント のアップロード

このステップでは、SharePoint エージェント が ユーザー からのプロンプト に応答するために使用されるサンプル ドキュメント をアップロードします。これには、架空 の Word 、 PowerPoint 、および PDF ファイル が含まれます。

### ステップ 1 : SharePoint サイト の作成

[Microsoft 365 Portal](https://m365.cloud.microsoft/){target=_blank} または Microsoft 365 の他の場所から、"Apps" メニュー 1️⃣ をクリックし、**SharePoint** 2️⃣ を選択します。

![Microsoft 365 Portal の UI 。"Apps" コマンド と SharePoint の 作業負荷 が強調表示されています。](../../../assets/images/make/sharepoint-agents-01/m365-new-portal-01.png)

次に、**Create Site** 1️⃣ を選択し、**Team site** 2️⃣ を選びます。

![新しい SharePoint Online サイト を作成する UI 。"Team Site" テンプレート が推奨されています。](../../../assets/images/extend-m365-copilot-05/upload-docs-02.png)

**Standard team** サイト テンプレート を選択すると、サイト のプレビュー が表示されます。続行するには、**Use Template** を選択してください。

![対象サイト 用 の "Standard" サイト テンプレート を選択する UI 。](../../../assets/images/extend-m365-copilot-05/upload-docs-03.png)

サイト に "Copilot Dev Camp - HR" などの名前 を付け 1️⃣、**Next** 2️⃣ を選択します。名前 はテナント 内で一意 でなければならないため、既に割り当てられた名前 を使用しないようにしてください。

![対象サイト 作成 のために、名前、説明、およびその他の詳細 を入力する UI 。](../../../assets/images/make/sharepoint-agents-01/create-site-01.png)

次に、プライバシー設定 と 言語 を選択し、**Create Site** を選びます。

![対象サイト のプライバシー設定 と 言語 を選択する UI 。](../../../assets/images/make/sharepoint-agents-01/create-site-02.png)

サイト への新規 ユーザー の追加 は省略し、サイト のプロビジョニング が完了したら **Finish** を選択します。数秒後、新しい SharePoint サイト が表示されます。

<cc-end-step lab="msa1" exercise="1" step="1" />

### ステップ 2 : サンプル ドキュメント のアップロード

この数ファイル（ Word 、 PowerPoint 、 PDF ）を含む zip ファイル を、こちら の [link](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} を選択してダウンロードし、お使いのローカル ファイルシステム の適当 な場所に解凍してください。

先ほど作成した SharePoint サイト に戻り、Documents ウェブパート 内で **See all** を選択し、ドキュメント ライブラリ ページ を表示します。

![サイト のホームページ と Documents ウェブパート 、およびハイライトされた "See all" リンク を表示する UI 。](../../../assets/images/make/sharepoint-agents-01/upload-docs-01.png)

次に、コマンド バー 内 の **Upload** 1️⃣ ボタン を選択し、**Files** 2️⃣ を選びます。

![ドキュメント ライブラリ のコマンド バー において、拡張された "Upload" メニュー と "Files" オプション を選択する UI 。](../../../assets/images/make/sharepoint-agents-01/upload-docs-02.png)

作業フォルダー に移動し、そこで履歴書ファイル を解凍した場所からすべて のサンプル ドキュメント を選択 1️⃣ し、**Open** 2️⃣ を選択します。

![アップロードするファイル を選択するためのファイルシステム ブラウジング ダイアログ 。](../../../assets/images/make/sharepoint-agents-01/upload-docs-03.png)

<cc-end-step lab="msa1" exercise="1" step="2" />

## 演習 2 : 初めての SharePoint エージェント の作成

この演習では、HR ドキュメント を管理するための初期バージョン の SharePoint エージェント を作成します。

### ステップ 1 : エージェント の作成

前の演習で作成したドキュメント ライブラリ 内 のすべて のファイル を、選択ボタン 1️⃣ をクリックして選択し、次にコマンド バー 内 の **Create an agent** 2️⃣ コマンド を選択します。

![すべて のドキュメント が選択され、コマンド バー に **Create an agent** コマンド が強調表示されているドキュメント ライブラリ の SharePoint Online インターフェイス 。](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-01.png)

!!! important "ファイルまたはフォルダー から SharePoint エージェント を作成する場合"
もしライブラリ 内 のファイル を何も選択せずに **Create an agent** コマンド を選択した場合、エージェント は現在のドキュメント ライブラリ 全体 を対象とします。ライブラリ 内 のファイル または サブフォルダー を明示的 に選択してから **Create an agent** コマンド を選択すると、エージェント は選択されたコンテンツ のみ を対象とします。特定 のエージェント に対して 20 アイテム を超えて選択することはできません。20 アイテム を超えた場合、*"Sources limit exceeded. The maximum number of sources you can add is 20. Remove XX sources to save this copilot."* といったエラーメッセージ が表示され、エージェント を作成することができなくなります。

ダイアログ ウィンドウ が表示され、選択したコンテンツ の概要 を確認するか、テスト目的でエージェント を直接起動する、あるいは新しく作成したエージェント を編集するかを選べます。

![ドキュメント ライブラリ 上で SharePoint エージェント を作成する際の SharePoint Online インターフェイス 。選択したコンテンツ の概要 と、エージェント を "Open agent" または "Edit" するためのボタン が表示されています。](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-02.png)

!!! note "SharePoint エージェント を作成するための権限"
SharePoint エージェント を作成するためには、対象 ライブラリ または サイト に対して contribute 権限 が必要です。実際、エージェント の裏側では新しい **.agent** ファイル が作成され、ユーザー はこれを実行するために適切 な権限 を有している必要があります。

<cc-end-step lab="msa1" exercise="2" step="1" />

### ステップ 2 : エージェント のテスト

前のダイアログ ウィンドウ 内 の **Open agent** ボタン を選択して、新しい SharePoint エージェント の操作を開始します。全画面 のダイアログ ウィンドウ が表示され、エージェント と対話するためのプロンプト を入力できるようになります。

![新しい SharePoint エージェント を表示する SharePoint Online インターフェイス 。ページ 上部に提案された starter prompts と、下部にプロンプト を入力するためのテキストエリア が表示されています。](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-03.png)

以下 のプロンプト を入力して、結果 を確認してください：

- 新規従業員 を採用するプロセス は何ですか？
- 自身 のキャリア をどのように向上させることができますか？

提案された回答 は、エージェント の知識ベース として選択されたドキュメント の内容 を要約します。プロンプト を処理しているエンジン は Microsoft 365 Copilot であり、AI により生成されたコンテンツ に関する明確 な注意事項 1️⃣ が表示されています。回答 の下部には、回答 の作成に使用されたドキュメント 2️⃣ への参照 が掲載されています。さらに、エージェント はそのトピック を掘り下げるための follow up prompts 3️⃣ も提案します。

![新しい SharePoint エージェント を表示する SharePoint Online インターフェイス 。エージェント によって提供されたプロンプト と回答 が表示されています。回答 には AI により生成されたコンテンツ に関する注意事項、ライブラリ 内 の実際 のドキュメント への参照、そして提案されたプロンプト の一覧 が含まれています。](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-01.png)

エージェント ダイアログ を閉じると、ライブラリ 内 に **New agent.agent** という名前 の新しいファイル があることに気づくでしょう。これは、新しい SharePoint エージェント 定義 を表すファイル です。SharePoint Online の標準 のファイル名変更機能 を使用してファイル名 を変更すると、エージェント の名前 およびダイアログ 内 のタイトル もそれに応じて変更されます。例えば、これを **HR agent** に変更してみましょう。

<cc-end-step lab="msa1" exercise="2" step="2" />

## 演習 3 : エージェント の微調整

この演習では、追加 の設定 を構成し、指示 を調整することで、**HR agent** を微調整する方法 を学びます。

### ステップ 1 : アイコン と タイトル の更新

ドキュメント ライブラリ 内 の **HR agent.agent** ファイル を選択し、SharePoint Online の ECB メニュー を開くために **...** を選択、さらに **Edit** コマンド を選びます。もしくは、ライブラリ のコマンド バー から **Edit** コマンド を選択してもかまいません。

![.agent ファイル 選択時 の SharePoint Online の ECB メニュー 。"Edit" コマンド が強調表示されています。](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-01.png)

新しいダイアログ ウィンドウ が表示され、以下 の設定 を管理できます：

- Overview: 名前、アイコン、および 目的／説明
- Sources: 知識ベース として使用するデータ ソース（サイト、ライブラリ、またはファイル） を構成できます
- Behavior: Welcome messaging、Starter prompts、および エージェントの指示

ダイアログ ウィンドウ は、エージェント のライブ更新 プレビュー も提供しており、変更 を即時にプレビュー および テストできます。

編集ダイアログ の最初のタブ（**Overview**）で、エージェント のアイコン を [following image file](https://github.com/microsoft/copilot-camp/blob/main/src/make/sharepoint-agents/HR-SP-Agent.png) に更新してください。また、**Purpose** も以下 のテキスト に従って更新してください。

```text
This is an agent supporting users to find information, policies, and rules based on the HR department knowledge base
```

![エージェント の名前、アイコン、および 目的 を更新する際のエージェント設定 編集用ダイアログ ウィンドウ 。](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-02.png)

また、**Add advanced customization in Copilot Studio** ボタン も用意されていますが、これはまだ利用できない機能であり、今後提供される予定です。

次に、ダイアログ ウィンドウ 内 の **Sources** タブ を選択して、エージェント の知識ベース を構成します。この記事作成時点では、構成可能 なデータ ソース は SharePoint Online サイト、ドキュメント ライブラリ、または ドキュメント のみです。将来的には、Microsoft Copilot Studio を利用して追加 の知識 ソース を構成できるようになる予定ですが、現時点では SharePoint Online のみ が SharePoint エージェント 用にサポートされています。

![エージェント のデータ ソース を管理するためのダイアログ ウィンドウ 。追加 のサイト、ライブラリ、またはドキュメント を構成するフィールド が表示されています。](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-03.png)

**Add a SharePoint site** 1️⃣ セクション では、エージェント のデータ ソース に追加 のサイト コレクション を追加できます。タイトル によってサイト を検索するか、または追加したいサイト の実際 の URL を直接指定することが可能です。
また、既存 のサイト を削除するために **Remove** 2️⃣ コマンド を選択することもできます。ただし、エージェント を作成した現在 のサイト を削除した場合、初めに選択したすべて のドキュメント が完全に削除される点 にご注意ください。
最後に、全体 のデータ ソース アイテム の数 が 20 アイテム を超えない限り、**Add document libraries, folders or files** 3️⃣ を使用して追加できます。

<cc-end-step lab="msa1" exercise="3" step="1" />

### ステップ 2 : エージェント の指示 の更新

構成ダイアログ の **Behavior** タブ では、エージェント 用 の初期の **Welcome messaging** 1️⃣ を設定できます。また、ユーザー がエージェント との会話 を開始する際に表示される、最大 3 つ の **Starter prompts** 2️⃣ を設定することも可能です。

さらに重要なことに、**Agent instruction** 3️⃣ フィールド を設定することで、エージェント の口調、動作、制限、ルール など を細かく調整できます。基本的に、ここでエージェント のシステム設定／プロンプト を構成します。このフィールド に正確 な内容 を記述すればするほど、エージェント から返される結果 はより良いもの となります。
デフォルトでは、事前に構成された指示 は非常に一般的かつ汎用的 です。実際、デフォルト値 は以下 の通りです：

```text
Provide accurate information about the content in the selected files and reply in a formal tone.
```

![エージェント の動作 を管理するためのダイアログ ウィンドウ 。ここには "Welcome messaging"、"Starter promptes"、および "Agent instructions" を設定するフィールド が表示されています。](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-04.png)

高品質 なエージェント を作成するには、エージェント の実際 の目的 に応じて、具体的 な指示 を提供する必要があります。例えば、HR agent の場合、ここでは仮想 の指示 テキスト の例 をご覧いただけます。

```text
# System Role
You are the HR agent. Your goal is to help employees find information about HR policies, rules, and procedures. You use a set of documents as your knowledge base and you need to stick on those documents when providing answers.

# Main Instructions

## Introduction Prompt
Use the following prompt to welcome the users and introduce your role:
Welcome to HR agent! I'm here to help you work with HR policies, rules, and procedures. Feel free to ask any question about all of what is HR related in our company.

## Responding to the user
Always use a professional but friendly tone. Always list multiple items in tables. Use emojis to make the communication more effective and clear. Always ask the user for a follow up prompt and suggest in scope follow up prompts, too. 

# General rules
Never write personal or sensitive data while generating the answers.
Do not allow the user to ask you questions about other employees' personal and sensitive data.

# Error Handling
In case of any error or issue, inform the user with the following prompt:
I'm sorry, something wrong happened. Please, try again soon.
```

上記 の指示 はあくまで例 を示すためのものであり、完全 なテンプレート を意図したものではありません。また、指示 は様々なセクション を強調するために MD ドキュメント の構造 に依存している点 にご留意ください。

指示 は最大 8,000 文字 まで記述可能 ですので、できる限り詳細 を記載することをお勧めします。[Here](../../../copilot-instructions/beginner-agent){target=_blank} では、エージェント 用 のプロフェッショナルなプロンプト 指示 の作成方法 に関する詳細情報 を提供する **Declarative Agent Instruction Lab - Improve your agent instructions (Beginner friendly)** ラボ をご覧いただけます。また、[Write effective instructions for declarative agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-instructions){target=_blank} という記事 を参照して、効果的なプロンプト の書き方 についての詳しい情報 を学ぶこともできます。

<cc-end-step lab="msa1" exercise="3" step="2" />

### ステップ 3 : エージェント のテスト

エージェント のアイコン、目的、および指示 を更新したら、**Save and close** ボタン を選択してください。ダイアログ を閉じ、再びエージェント と対話します。

例えば、以下 のプロンプト を入力してください：

```text
Hello!
```

```text
How can I improve my career? Provide me a list of suggested actions.
```

![改善された指示 に基づくエージェント の更新された動作 。絵文字、アイテム 一覧 をレンダリングするためのテーブル、および全体的により正確 な応答 が表示されています。](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-02.png)

エージェント は、"Hello!" メッセージ に対して、指示 で設定されたウェルカム メッセージ で応答することに気づくでしょう。さらに、応答 はより正確 で、箇所箇所に絵文字 が含まれ、アイテム 一覧 をレンダリングするためのテーブル も提供されるようになります。

<cc-end-step lab="msa1" exercise="3" step="3" />

## 演習 4 : サイト の既定 エージェント として エージェント を構成

エージェント に関してもう一つできること は、サイト の既定 エージェント としてエージェント を昇格させること です。実際、今日ではすべて の SharePoint Online サイト にあらかじめ用意されたエージェント が付属しています。スイート バー で Copilot コマンド を選択すると、既定 のエージェント が表示されます。

![SharePoint Online サイト を表示する際の Microsoft 365 のスイート バー 。サイト レベル のエージェント をアクティベートするための Copilot アイコン が表示されています。](../../../assets/images/make/sharepoint-agents-01/sp-ready-made-agent-01.png)

SharePoint Online サイト の既定 エージェント を起動すると、右側にサイド パネル が表示され、エージェント にプロンプト を入力できるようになります。エージェント はあらかじめ定義された動作 と汎用的 な指示 を備えています。

しかし、既定 のエージェント が気に入らず、独自 のカスタム エージェント を使用したい場合もあるかもしれません。
この演習では、その方法 を学びます。

### ステップ 1 : エージェント の承認 と 昇格

サイト のホームページ に移動し、サイド パネル を起動するために Copilot コマンド を選択してください。

Copilot パネル を開くと、デフォルト で対話可能 な既定 のエージェント が表示されます。しかし、エージェント 名 の横にあるドロップダウン を選択して、作成済み の他 のエージェント を選ぶこともできます。

![サイト 用 の既定 のエージェント を表示する Copilot サイド パネル 。以前に作成した "HR agent" を選択できるドロップダウン が表示されています。](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-03.png)

それでは、デフォルト のエージェント の動作 を変更し、カスタム エージェント を既定 にする方法 を見てみましょう。
エージェント を作成したドキュメント ライブラリ に戻り、エージェント ダイアログ の右上隅 の **...** 1️⃣ を選択し、**Set as approved** 2️⃣ コマンド を選択します。

![選択したエージェント のコマンド パネル 。ここからエージェント の編集、承認、Copilot 履歴 の削除、またはエージェント との会話履歴 の閲覧 が可能です。](../../../assets/images/make/sharepoint-agents-01/approve-agent-01.png)

エージェント を承認済み とするには、サイト オーナー である必要があり、さらに明示 的 な承認／確認 が求められます。これは、承認済み のエージェント が専用 サブフォルダー（**Copilots** という名前）内 の **Site Assets** ライブラリ に移動されるためです。

![エージェント を承認するための確認要求ダイアログ 。このダイアログ には、エージェント が承認されるとサイト の Site Assets ライブラリ に移動されること が説明されています。](../../../assets/images/make/sharepoint-agents-01/approve-agent-02.png)

承認プロセス が完了すると、確認ダイアログ が表示され、.agent ファイル が現在のドキュメント ライブラリ から消えます。

![エージェント の承認を確認するダイアログ 。このダイアログ には、承認済み のエージェント の新しい場所 へのリンク が提供されています。](../../../assets/images/make/sharepoint-agents-01/approve-agent-03.png)

これで、エージェント は **Approved for this site** のエージェント 一覧 に表示されるようになります。

![現在のサイト で承認されたエージェント 一覧 。カスタム エージェント が承認済み の一覧 に表示されています。](../../../assets/images/make/sharepoint-agents-01/approve-agent-04.png)

エージェント をアクティベートし、エージェント 名 の横にある **...** 1️⃣ を選択して、コンテキスト メニュー から **Set as site default** 2️⃣ コマンド を選択し、エージェント をサイト の既定 に構成します。エージェント を既定 にするかどうか を確認する必要があり、プロモーション プロセス の最後に確認ダイアログ が表示されます。これが完了すると、サイト のスイート バー で Copilot アイコン を選択した際に、カスタム エージェント が最初に、かつ既定 のエージェント として表示されるようになります。

![承認後、エージェント をサイト の既定 に昇格させるためのコマンド 。](../../../assets/images/make/sharepoint-agents-01/site-default-agent-01.png)

<cc-end-step lab="msa1" exercise="4" step="1" />

<a href="../02-sharing-agents">Start here</a> with Lab MSA2, to share your SharePoint agent on Microsoft Teams.
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agents/01-first-agent" />