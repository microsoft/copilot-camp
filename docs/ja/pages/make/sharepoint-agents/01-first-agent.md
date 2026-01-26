---
search:
  exclude: true
---
# ラボ MSA1 - 最初の SharePoint エージェントを構築する

---8<--- "ja/msa-labs-prelude.md"

このラボでは、SharePoint Online に保存されているドキュメントを扱う SharePoint エージェントを作成します。作成するエージェントは、架空の企業の従業員が人事 ( HR ) 部門の情報、ポリシー、規則を取得できるように支援します。エージェントのナレッジ ベースは、SharePoint Online のドキュメント ライブラリに保存された一連のドキュメントになります。

## Exercise 1: サンプル ドキュメントのアップロード

この手順では、SharePoint エージェントがユーザー プロンプトに応答するために使用するサンプル ドキュメントをアップロードします。ここには架空の Word、PowerPoint、PDF ファイルが含まれます。

### Step 1: SharePoint サイトの作成

[Microsoft 365 Portal](https://m365.cloud.microsoft/){target=_blank} などの Microsoft 365 内で **Apps** メニュー 1️⃣ をクリックし、**SharePoint** 2️⃣ を選択します。

![Microsoft 365 Portal の UI で Apps コマンドと SharePoint ワークロードが強調表示されている。](../../../assets/images/make/sharepoint-agents-01/m365-new-portal-01.png)

続いて **Create Site** 1️⃣ を選択し、**Team site** 2️⃣ を選択します。

![新しい SharePoint Online サイトを作成する UI で、「Team Site」テンプレートが提案されている。](../../../assets/images/extend-m365-copilot-05/upload-docs-02.png)

**Standard team** サイト テンプレートを選択すると、サイトのプレビューが表示されます。**Use Template** を選択して進みます。

![対象サイトに「Standard」サイト テンプレートを選択する UI。](../../../assets/images/extend-m365-copilot-05/upload-docs-03.png)

サイト名として「Copilot Dev Camp - HR」など 1️⃣ を入力し、**Next** 2️⃣ を選択します。名前はテナント内で一意である必要があるため、既に使用されている名前は避けてください。

![対象サイトの名前、説明などを入力する UI。](../../../assets/images/make/sharepoint-agents-01/create-site-01.png)

次にプライバシー設定と言語を選択し、**Create Site** を選択します。

![対象サイトのプライバシー設定と言語を選択する UI。](../../../assets/images/make/sharepoint-agents-01/create-site-02.png)

新しいメンバーの追加はスキップし、サイト プロビジョニングが完了したら **Finish** を選択します。数秒後に新しい SharePoint サイトが表示されます。

<cc-end-step lab="msa1" exercise="1" step="1" />

### Step 2: サンプル ドキュメントのアップロード

この [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} を選択して、複数のファイル ( Word、PowerPoint、PDF ) を含む zip ファイルをダウンロードし、ローカル ファイル システムの任意の場所に解凍します。

先ほど作成した SharePoint サイトに戻り、Documents Web パーツで **See all** を選択してドキュメント ライブラリ ページを表示します。

![サイトのホーム ページで Documents Web パーツと 'See all' リンクが強調表示されている。](../../../assets/images/make/sharepoint-agents-01/upload-docs-01.png)

次に、コマンド バーの **Upload** 1️⃣ ボタンを選択し、**Files** 2️⃣ を選択します。

![ドキュメント ライブラリのコマンド バーで 'Upload' メニューが展開され 'Files' オプションが選択されている。](../../../assets/images/make/sharepoint-agents-01/upload-docs-02.png)

作業フォルダー ( 解凍した履歴書ファイルの場所 ) に移動し、すべてのサンプル ドキュメント 1️⃣ を選択して **Open** 2️⃣ を選択します。

![アップロードするファイルを選択するファイル システム ダイアログ。](../../../assets/images/make/sharepoint-agents-01/upload-docs-03.png)

<cc-end-step lab="msa1" exercise="1" step="2" />

## Exercise 2 : 最初の SharePoint エージェントの作成

この演習では、HR ドキュメントを管理する SharePoint エージェントの初期バージョンを作成します。

### Step 1: エージェントの作成

**AI actions** コマンド 1️⃣ を選択し、コマンド バーの **Create an agent** 2️⃣ を選択します。

![ドキュメント ライブラリの SharePoint Online インターフェイスで "Create an agent" コマンドが強調されている。](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-01.png)

!!! important "ファイルまたはフォルダーから SharePoint エージェントを作成する場合"
    ライブラリでファイルを選択せずに **Create an agent** コマンドを選択すると、エージェントは現在のドキュメント ライブラリ全体を対象とします。ライブラリ内でファイルやサブフォルダーを選択してから **Create an agent** を選択した場合、エージェントは選択したコンテンツのみを対象にします。なお、1 つのエージェントで選択できるアイテム数は 20 個までです。20 個を超えて選択すると *"Sources limit exceeded. The maximum number of sources you can add is 20. Remove XX sources to save this copilot."* のエラーメッセージが表示され、エージェントを作成できません。

ダイアログが表示され、選択したコンテンツの概要が示されます。そのままテスト用にエージェントを開くか、作成したエージェントを編集するかを選択できます。

![ドキュメント ライブラリ上で SharePoint エージェントを作成する際の UI。選択したコンテンツの概要と "Open agent"、"Edit" のボタンがある。](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-02.png)

!!! note "SharePoint エージェントを作成する権限"
    SharePoint エージェントを作成するには、対象ライブラリまたはサイトに対する **contribute** 権限が必要です。エージェントの裏では新しい **.agent** ファイルが作成されるため、ユーザーにはその作成権限が求められます。

**Create** コマンドを選択してエージェントを作成し、使用を開始します。

![新しい SharePoint エージェントが作成されたことを示すダイアログ。"Chat with agent" と "Share agent" のコマンドがある。](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-02b.png)

新しいダイアログが表示され、**Chat with agent** を選択すると Microsoft 365 Copilot Chat が新しいブラウザー タブで開き、エージェントと対話できます。ナレッジ ベースのドキュメントに関するプロンプトを入力して試してみてください。たとえば、次のプロンプトを使用できます。

```txt
What are the hiring procedures of our company?
```

Microsoft 365 Copilot Chat でエージェントとのやり取りが終わったら、ブラウザー タブを閉じて、SharePoint Online ドキュメント ライブラリに戻ります。

<cc-end-step lab="msa1" exercise="2" step="1" />

### Step 2: エージェントのテスト

新しい **.agent** 拡張子のファイルがドキュメント ライブラリに作成されていることが確認できます。そのファイルの **...** メニューを開き、**Preview** を選択して SharePoint Online の UI 内でエージェントと対話します。全画面のダイアログが表示され、プロンプトを入力してエージェントと対話できます。

![新しい SharePoint エージェントを表示している UI。上部にスターター プロンプト、下部にプロンプト入力欄がある。](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-03.png)

次のプロンプトを入力して結果を確認してください。

```txt
What is the process to hire new employees?
```

または

```txt
How can I improve my career?
```

提案された回答は、エージェントのナレッジ ベースとして選択したドキュメントの内容を要約します。プロンプトを処理するエンジンは Microsoft 365 Copilot であり、AI 生成コンテンツに関する明確な **注意事項** 1️⃣ が表示されます。回答の末尾には、回答を生成する際に使用されたドキュメント 2️⃣ への参照が示されます。さらに、エージェントはトピックを深掘りするためのフォローアップ プロンプト 3️⃣ も提案します。

![新しい SharePoint エージェントが回答を提示している UI。AI による生成コンテンツの注意事項、ドキュメント参照、提案プロンプトが表示されている。](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-01.png)

**.agent** ファイルは新しい SharePoint エージェントの定義を表します。SharePoint Online の標準的なファイル名変更機能を使用してファイル名を変更すると、エージェントの名前およびダイアログのタイトルも同様に変更されます。たとえば、**HR agent** に名前を変更してみましょう。ドキュメント ライブラリでエージェント ファイルを選択すると、常に新しいタブが開き、Microsoft 365 Copilot Chat のエージェント体験が提供されます。

<cc-end-step lab="msa1" exercise="2" step="2" />

## Exercise 3 : エージェントのチューニング

この演習では、**HR agent** に追加設定を行い、指示を調整してエージェントをチューニングする方法を学びます。

### Step 1: アイコンとタイトルの更新

ドキュメント ライブラリで **HR agent.agent** ファイルの **...** を選択し、SharePoint Online の ECB メニューから **Edit** コマンドを選択します。または、ライブラリのコマンド バーにある **Edit** コマンドを使用してもかまいません。

![.agent ファイル選択時の ECB メニュー。 "Edit" コマンドが強調されている。](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-01.png)

新しいダイアログが表示され、次の設定を管理できます。

- Overview: 名前、アイコン、目的 / 説明  
- Sources: ナレッジ ベースとして使用するデータ ソース ( サイト、ライブラリ、ファイル )  
- Behavior: ウェルカム メッセージ、スターター プロンプト、エージェントの指示  

ダイアログにはエージェントのプレビューが Live 更新され、変更を即時に確認しながらテストできます。

編集ダイアログの最初のタブ **Overview** で、エージェントのアイコンを [この画像ファイル](https://github.com/microsoft/copilot-camp/blob/main/src/make/sharepoint-agents/HR-SP-Agent.png) に更新します。さらに **Purpose** を次のテキストに更新します。

```text
This is an agent supporting users to find information, policies, and rules based on the HR department knowledge base
```

![エージェントの名前、アイコン、目的を更新する編集ダイアログ。](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-02.png)

続いてダイアログの **Sources** タブを選択し、エージェントのナレッジ ベースを構成します。執筆時点では、構成できるデータ ソースは SharePoint Online のサイト、ドキュメント ライブラリ、またはドキュメントのみです。将来的には Microsoft Copilot Studio を使用して追加のナレッジ ソースを構成できるようになる予定です。現時点では SharePoint Online が SharePoint エージェントでサポートされている唯一のデータ ソースです。

![エージェントのデータ ソースを管理するダイアログ。サイト、ライブラリ、ドキュメントを設定するフィールドが表示されている。](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-03.png)

**Add a source** 1️⃣ セクションから、エージェントのデータ ソースとして追加のサイト コレクション、または OneDrive for Business の特定のファイルやフォルダーを追加できます。サイト名で検索するか、追加したいサイトの URL を直接入力することも可能です。**Add contents from this site** 2️⃣ を選択すると、合計データ ソース数が 20 アイテムを超えない限り、サイト内のコンテンツを追加できます。  
最後に **Remove this site and all contents** 3️⃣ コマンドを選択すると、既に追加されているサイトを削除できます。ただし、エージェントを作成した元のサイトを削除すると、最初に構成したドキュメントがすべて削除される点に注意してください。

<cc-end-step lab="msa1" exercise="3" step="1" />

### Step 2: 指示の更新

設定ダイアログの **Behavior** タブでは、エージェントの **Welcome messaging** 1️⃣ を設定できます。  
また、最大 3 つの **Starter prompts** 2️⃣ を設定でき、ユーザーがエージェントとの会話を開始したときに提示されます。

最も重要なのは **Agent instruction** 3️⃣ フィールドで、ここでエージェントのトーン、挙動、制限、ルールなどを詳細に調整できます。実質的に、エージェントの **システムプロンプト** を設定する場所です。ここを詳細に記述するほど、エージェントから得られる結果は向上します。  
デフォルトの指示は非常に一般的で汎用的です。既定値は次のとおりです。

```text
Provide accurate information about the content in the selected files and reply in a formal tone.
```

高品質なエージェントを作成するには、目的に応じて具体的な指示を提供する必要があります。たとえば、HR agent の場合、以下のような指示の例を参照してください。

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

上記の指示はあくまでも例示であり、完全かつ万能なテンプレートを意図したものではありません。指示文は MD のドキュメント構造を活用して各セクションを強調しています。変更が終わったら **Save and close** を選択して SharePoint エージェント定義を更新します。

エージェントの指示は最大 8,000 文字まで記述できます。できる限り詳細に書くことをおすすめします。プロフェッショナルなプロンプト作成方法については、[こちら](../../../beyond-agents/beginner-agent){target=_blank} の **Declarative Agent Instruction Lab - Improve your agent instructions ( Beginner friendly )** ラボや、[Write effective instructions for declarative agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-instructions){target=_blank} を参照してください。

<cc-end-step lab="msa1" exercise="3" step="2" />

### Step 3: エージェントのテスト

エージェントのアイコン、目的、指示を更新したら、再度エージェントを選択して対話します。

例として、次のプロンプトを入力します。

```text
Hello!
```

```text
How can I improve my career? Provide me a list of suggested actions.
```

![改善された指示に基づくエージェントの新しい挙動。絵文字やテーブルなどを用いたより正確な回答。](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-02.png)

「Hello!」メッセージに対して包括的なウェルカム メッセージで応答し、絵文字やテーブルを用いたより正確な回答が得られることが確認できます。

<cc-end-step lab="msa1" exercise="3" step="3" />

## Exercise 4 : サイトの既定エージェントとして構成する

作成したエージェントをサイトの既定エージェントとして昇格させることも可能です。現在、すべての SharePoint Online サイトには既製のエージェントが付属しています。スイート バーの Copilot コマンドを選択すると、その既製エージェントが表示されます。

![SharePoint Online サイトを表示している Microsoft 365 のスイート バー。Copilot アイコンのコマンドでサイト レベル エージェントを起動できる。](../../../assets/images/make/sharepoint-agents-01/sp-ready-made-agent-01.png)

既製エージェントを起動すると、右側にサイド パネルが表示され、エージェントにプロンプトを送信できます。このエージェントは既定の挙動と汎用的な指示を持っています。

ただし、既製エージェントではなく独自のカスタム エージェントを使用したい場合もあります。この演習では、その方法を学びます。

### Step 1: エージェントの承認と昇格

サイトのホーム ページで Copilot コマンドを選択し、サイド パネルを表示します。

Copilot パネルを開くと既定では既製エージェントが表示されますが、エージェント名の横にあるドロップダウンを選択することで、作成済みの他のエージェントを選択できます。

![既製エージェントを表示する Copilot サイド パネル。ドロップダウンで前に作成した "HR agent" を選択できる。](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-03.png)

次に、カスタム エージェントを既定エージェントに変更する方法を確認します。エージェントを作成したドキュメント ライブラリに戻り、エージェントを開きます。エージェント ダイアログの右上にある **...** 1️⃣ を選択し、**Set as approved** 2️⃣ コマンドを選択します。

![エージェント選択時のコマンド パネル。Edit、Set as approved、Delete Copilot history、Conversation history などがある。](../../../assets/images/make/sharepoint-agents-01/approve-agent-01.png)

エージェントを承認するにはサイト所有者である必要があり、明示的な承認 / 確認も求められます。承認されたエージェントは **Site Assets** ライブラリ内の **Copilots** サブフォルダーに移動されるためです。

![エージェントを承認する確認ダイアログ。承認すると Site Assets ライブラリに移動する旨が説明されている。](../../../assets/images/make/sharepoint-agents-01/approve-agent-02.png)

承認プロセスが完了すると確認ダイアログが表示され、.agent ファイルは現在のドキュメント ライブラリからは見えなくなります。

![エージェントが承認されたことを示すダイアログ。新しい場所へのリンクが表示されている。](../../../assets/images/make/sharepoint-agents-01/approve-agent-03.png)

これでエージェントは **Approved for this site** リストに表示されます。

![現在のサイトで承認されたエージェントのリストに、カスタム エージェントが表示されている。](../../../assets/images/make/sharepoint-agents-01/approve-agent-04.png)

エージェントをアクティブにし、エージェント名の横の **...** 1️⃣ を選択して **Set as site default** 2️⃣ をクリックすると、エージェントをサイトの既定エージェントとして設定できます。確認ダイアログで承認すると昇格が完了し、スイート バーの Copilot アイコンを選択した際に、カスタム エージェントが最初に表示されるようになります。

![エージェントを承認後、サイトの既定エージェントに昇格させるコマンド。](../../../assets/images/make/sharepoint-agents-01/site-default-agent-01.png)

<cc-end-step lab="msa1" exercise="4" step="1" />

<a href="../02-sharing-agents">こちらから開始</a>して、Lab MSA2 で SharePoint エージェントを Microsoft Teams で共有しましょう。  
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agents/01-first-agent--ja" />