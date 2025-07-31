---
search:
  exclude: true
---
# ラボ MSA1 - 最初の SharePoint エージェントを構築する

---8<--- "ja/msa-labs-prelude.md"

このラボでは、SharePoint Online に保存されているドキュメントを操作する SharePoint エージェントを作成します。今回作成するエージェントは、架空の企業の従業員が人事部 (HR) の情報、ポリシー、規則を取得できるように支援します。エージェントのナレッジ ベースは、SharePoint Online のドキュメント ライブラリに保存されたドキュメントのセットです。

## Exercise 1: サンプル ドキュメントのアップロード

この手順では、SharePoint エージェントがユーザーのプロンプトに応答するために使用するサンプル ドキュメントをアップロードします。サンプルには架空の Word、PowerPoint、PDF ファイルが含まれます。

### Step 1: SharePoint サイトの作成

[Microsoft 365 Portal](https://m365.cloud.microsoft/){target=_blank} など Microsoft 365 内で **Apps** メニュー 1️⃣ をクリックし、**SharePoint** 2️⃣ を選択します。

![The UI of Microsoft 365 Portal with the Apps command and the SharePoint workload highlighted.](../../../assets/images/make/sharepoint-agents-01/m365-new-portal-01.png)

続いて **Create Site** 1️⃣ を選択し、**Team site** 2️⃣ を選択します。

![The UI to create a new SharePoint Online site, with 'Team Site' template suggested.](../../../assets/images/extend-m365-copilot-05/upload-docs-02.png)

**Standard team** サイト テンプレートを選択すると、サイトのプレビューが表示されます。**Use Template** を選択して続行します。

![The UI to select the 'Standard' site template for the target site.](../../../assets/images/extend-m365-copilot-05/upload-docs-03.png)

サイト名に「Copilot Dev Camp - HR」など 1️⃣ を入力し、**Next** 2️⃣ を選択します。名前はテナント内で一意である必要があるため、既に使用されている名前は避けてください。

![The UI to provide name, description, and other details for the target site to create.](../../../assets/images/make/sharepoint-agents-01/create-site-01.png)

プライバシー設定と言語を選択し、**Create Site** を選択します。

![The UI to select the privacy settings and the language for the target site.](../../../assets/images/make/sharepoint-agents-01/create-site-02.png)

新しいメンバーの追加をスキップし、サイトのプロビジョニングが完了したら **Finish** を選択します。数秒後、新しい SharePoint サイトが表示されます。 

<cc-end-step lab="msa1" exercise="1" step="1" />

### Step 2: サンプル ドキュメントのアップロード

この [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} を選択して、複数のファイル (Word、PowerPoint、PDF) が入った zip ファイルをダウンロードし、ローカル ファイル システム上の任意の場所に解凍します。

作成した SharePoint サイトに戻り、Documents Web パーツで **See all** を選択してドキュメント ライブラリのページを表示します。

![The home page of the site with the Documents web part and the 'See all' link highlighted.](../../../assets/images/make/sharepoint-agents-01/upload-docs-01.png)

次に、コマンド バーの **Upload** 1️⃣ ボタンを選択し、**Files** 2️⃣ を選択します。

![The command bar of the document library with the 'Upload' menu expanded and the 'Files' option selected.](../../../assets/images/make/sharepoint-agents-01/upload-docs-02.png)

解凍した作業フォルダーに移動し、すべてのサンプル ドキュメント 1️⃣ を選択して **Open** 2️⃣ をクリックします。

![The file system browsing dialog to select the files to upload.](../../../assets/images/make/sharepoint-agents-01/upload-docs-03.png)

<cc-end-step lab="msa1" exercise="1" step="2" />

## Exercise 2 : 最初の SharePoint エージェントの作成

この演習では、HR ドキュメントを管理するための初期バージョンの SharePoint エージェントを作成します。

### Step 1: エージェントの作成

前の演習で作成したドキュメント ライブラリで、選択ボタン 1️⃣ をクリックしてすべてのファイルを選択し、コマンド バーで **Create an agent** 2️⃣ コマンドを選択します。

![The SharePoint Online interface of a document library with all the documents selected and the "Create an agent" command highlighted in the command bar.](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-01.png)

!!! important "ファイルまたはフォルダーから SharePoint エージェントを作成する場合"
    ライブラリでファイルを選択せずに **Create an agent** コマンドを選択すると、エージェントは現在のドキュメント ライブラリ全体を対象とします。ライブラリでファイルまたはサブフォルダーを明示的に選択してから **Create an agent** を選択すると、エージェントは選択したコンテンツのみに限定されます。1 つのエージェントで選択できる項目は 20 個までです。20 個を超える項目を選択した場合、*"Sources limit exceeded. The maximum number of sources you can add is 20. Remove XX sources to save this copilot."* というエラー メッセージが表示され、エージェントを作成できません。

ダイアログ ウィンドウが表示され、選択したコンテンツの概要を確認し、テスト用にエージェントをすぐに開くか、作成したエージェントを編集できます。

![The SharePoint Online interface when creating a SharePoint agent on topo of a document library. There is a recap of the selected content and a couple of buttons to "Open agent" or to "Edit" the agent.](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-02.png)

!!! note "SharePoint エージェント作成の権限"
    SharePoint エージェントを作成するには、対象ライブラリまたはサイトで **Contribute** 以上の権限が必要です。エージェントの背後では新しい **.agent** ファイルが作成されるため、適切な権限が必要となります。

<cc-end-step lab="msa1" exercise="2" step="1" />

### Step 2: エージェントのテスト

前のダイアログ ウィンドウで **Open agent** ボタンを選択し、新しい SharePoint エージェントを試してみます。全画面のダイアログが表示され、プロンプトを入力してエージェントと対話できます。

![The SharePoint Online interface showing the new SharePoint agent. There are suggested starter prompts at the top of the page and a textarea to write a prompt in the lower part of the screen.](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-03.png)

次のプロンプトを入力して結果を確認してください。

- 従業員を採用するプロセスは？
- キャリアを向上させる方法は？

提示される回答は、エージェントのナレッジ ベースとして選択したドキュメントの内容を要約したものです。プロンプトを処理するエンジンは Microsoft 365 Copilot であり、AI 生成コンテンツに関する明確な **注意事項** 1️⃣ が表示されます。回答の末尾には、回答を生成する際に参照されたドキュメント 2️⃣ が示されます。また、エージェントがトピックを深掘りするためのフォローアップ プロンプト 3️⃣ も提案します。

![The SharePoint Online interface showing the new SharePoint agent. There is a prompt and the answer provided by the agent. The answer includes a disclaimer about the content generated by AI, a reference to an actual document in the library, and a list of suggested prompts.](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-01.png)

エージェント ダイアログを閉じると、ライブラリに **New agent.agent** という新しいファイルがあるのがわかります。これが新しい SharePoint エージェント定義を表すファイルです。SharePoint Online の標準的なファイル名変更機能を使用してファイル名を変更すると、エージェントの名前とダイアログのタイトルもそれに応じて変更されます。たとえば **HR agent** に変更してみましょう。

<cc-end-step lab="msa1" exercise="2" step="2" />

## Exercise 3 : エージェントの微調整

この演習では、追加設定の構成、指示の調整などを行い **HR agent** を微調整する方法を学びます。 

### Step 1: アイコンとタイトルの更新

ドキュメント ライブラリで **HR agent.agent** ファイルを選択し、SharePoint Online の ECB メニュー (**...**) を開いて **Edit** コマンドを選択します。あるいはライブラリのコマンド バーで **Edit** を選択しても構いません。

![The ECB menu of SharePoint Online when the .agent file is selected. The "Edit" command is highlighted.](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-01.png)

新しいダイアログ ウィンドウが表示され、以下の設定を管理できます。

- Overview: 名前、アイコン、目的/説明
- Sources: ナレッジ ベースとして使用するデータ ソース (サイト、ライブラリ、ファイル) の構成
- Behavior: ウェルカム メッセージ、スターター プロンプト、エージェントの指示

ダイアログにはライブ プレビューもあり、変更を即座にテストできます。

編集ダイアログの最初のタブ **Overview** で、[こちらの画像ファイル](https://github.com/microsoft/copilot-camp/blob/main/src/make/sharepoint-agents/HR-SP-Agent.png) を使ってエージェントのアイコンを更新します。さらに **Purpose** を以下のテキストに更新してください。

```text
This is an agent supporting users to find information, policies, and rules based on the HR department knowledge base
```

![The dialog window to edit the agent settings when it comes to update the agent name, icon, and purpose.](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-02.png)

**Add advanced customization in Copilot Studio** ボタンもありますが、これは将来提供予定の機能です。

次に **Sources** タブを選択してエージェントのナレッジ ベースを構成します。執筆時点では、構成できるデータ ソースは SharePoint Online のサイト、ドキュメント ライブラリ、ドキュメントのみです。将来的には Microsoft Copilot Studio を通じて追加のナレッジ ソースを利用できるようになる予定です。現時点では SharePoint Online が唯一サポートされるデータ ソースです。

![The dialog window to manage the data sources for the agent. There are fields to configure additional sites, libraries, or documents.](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-03.png)

**Add a SharePoint site** 1️⃣ セクションでは、エージェントのデータ ソースに追加のサイト コレクションを追加できます。タイトルでサイトを検索するか、追加したいサイトの URL を直接入力できます。  
**Remove** 2️⃣ コマンドを選択すると既存のサイトを削除できます。現在のサイト (エージェントを作成したサイト) を削除すると、初期設定時に選択したドキュメントがすべて削除されるので注意してください。  
最後に、**Add document libraries, folders or files** 3️⃣ でデータ ソースを追加できますが、全体で 20 項目を超えないようにしてください。

<cc-end-step lab="msa1" exercise="3" step="1" />

### Step 2: 指示の更新

設定ダイアログの **Behavior** タブでは、エージェントの **Welcome messaging** 1️⃣ を設定できます。  
さらに、ユーザーがエージェントとの会話を始めるときに表示される最大 3 つの **Starter prompts** 2️⃣ を設定できます。

最も重要なのは **Agent instruction** 3️⃣ フィールドで、ここでエージェントのトーン、動作、制限、ルールなどを詳細に設定できます。実質的に、エージェントのシステムプロンプトを設定する場所です。このフィールドを詳細に記述するほど、エージェントから得られる結果は向上します。  
デフォルトでは、あらかじめ設定されている指示は非常に一般的です。デフォルト値は次のとおりです。

```text
Provide accurate information about the content in the selected files and reply in a formal tone.
```

![The dialog window to manage the behavior of the agent. There are fields to configure "Welcome messaging", "Starter promptes", and "Agent instructions".](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-04.png)

高品質なエージェントを作成するには、エージェントの目的に応じて具体的な指示を提供することが重要です。たとえば HR エージェントの場合、指示の例を以下に示します。

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

上記の指示は例示目的であり、完全かつ万能なテンプレートではありません。指示文では Markdown の構造を使ってセクションを明確にしています。

指示文は最大 8,000 文字まで記述できます。詳細を多く含めるほど効果的です。詳細なプロンプト作成方法については [こちら](../../../copilot-instructions/beginner-agent){target=_blank} の **Declarative Agent Instruction Lab - Improve your agent instructions (Beginner friendly)** を参照してください。さらに詳しくは [Write effective instructions for declarative agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-instructions){target=_blank} をご覧ください。

<cc-end-step lab="msa1" exercise="3" step="2" />

### Step 3: エージェントのテスト

エージェントのアイコン、目的、指示を更新したら **Save and close** ボタンを選択します。ダイアログを閉じて再びエージェントと対話します。

たとえば、次のプロンプトを入力します。

```text
Hello!
```

```text
How can I improve my career? Provide me a list of suggested actions.
```

![The updated behavior of the agent, based on the improved instructions. There are emojis, tables to render lists of items and generally speaking a more accurate respose.](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-02.png)

「Hello!」メッセージに対して、エージェントが指示で設定したウェルカム メッセージで応答することがわかります。さらに、回答には絵文字やリストを表形式で表示するなど、提供した指示に従ったより正確な内容が反映されます。

<cc-end-step lab="msa1" exercise="3" step="3" />

## Exercise 4 : サイトの既定エージェントとして設定する

最後に、エージェントをサイトの既定エージェントとして昇格させる方法を紹介します。現在、すべての SharePoint Online サイトには既成のエージェントが用意されています。スイート バーの Copilot コマンドを選択すると、そのサイト レベルのエージェントが表示されます。

![The suite bar of Microsoft 365 when rendering a SharePoint Online site. There is the Copilot icon in a command to activate the site level agent.](../../../assets/images/make/sharepoint-agents-01/sp-ready-made-agent-01.png)

既成エージェントを有効にすると、右側にサイド パネルが表示され、プロンプトを入力してエージェントと対話できます。このエージェントはあらかじめ定義された動作と汎用的な指示を持っています。

しかし、既成エージェントではなく独自のカスタム エージェントを使用したい場合もあります。この演習では、その方法を学びます。

### Step 1: エージェントの承認と昇格

サイトのホーム ページで Copilot コマンドを選択し、サイド パネルを開きます。

Copilot パネルを開くと、既定で既成エージェントが表示されますが、エージェント名の横にあるドロップダウンを選択することで、作成した他のエージェントを選択できます。

![The Copilot side panel rendering the ready made agent for a site. There is the dropdown to select the agent to use, which allows to select the "HR agent" created before.](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-03.png)

既定エージェントを変更し、カスタム エージェントを既定として設定する手順を説明します。エージェントを作成したドキュメント ライブラリに戻り、エージェントを開きます。エージェント ダイアログの右上の **...** 1️⃣ を選択し、**Set as approved** 2️⃣ コマンドを選択します。

![The command panel of an agent when select, allows to edit the agent, set the agent as approved, delete the Copilot history, or read the conversation history with the agent.](../../../assets/images/make/sharepoint-agents-01/approve-agent-01.png)

エージェントを承認するにはサイト所有者である必要があり、明示的な確認も求められます。承認されたエージェントは **Site Assets** ライブラリの **Copilots** サブフォルダーに移動されるためです。

![The confirmation request dialog to approve an agent. The dialog explains that the agent, once approved, will be moved to the Site Assets library of the site.](../../../assets/images/make/sharepoint-agents-01/approve-agent-02.png)

承認プロセスが完了すると確認ダイアログが表示され、.agent ファイルは現在のドキュメント ライブラリから削除されます。

![The dialog confirming that the agent was approved. The dialog provides a link to the new location of the approved agent.](../../../assets/images/make/sharepoint-agents-01/approve-agent-03.png)

これで、エージェントが **Approved for this site** の一覧に表示されます。

![The list of agents approved for the current site, showing the custom agent in the list of approved ones.](../../../assets/images/make/sharepoint-agents-01/approve-agent-04.png)

エージェントを選択し、名前の横の **...** 1️⃣ を選択してコンテキスト メニューから **Set as site default** 2️⃣ を選択すると、そのエージェントをサイトの既定エージェントとして設定できます。確認を求めるダイアログが表示され、昇格プロセスが完了すると通知されます。設定後は、スイート バーの Copilot アイコンを選択した際に、カスタム エージェントが最初に表示され既定として機能します。

![The commands to promote an agent to be the site default one, once it has been approved.](../../../assets/images/make/sharepoint-agents-01/site-default-agent-01.png)

<cc-end-step lab="msa1" exercise="4" step="1" />

<a href="../02-sharing-agents">こちらから開始</a>して Lab MSA2 で SharePoint エージェントを Microsoft Teams で共有しましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agents/01-first-agent--ja" />