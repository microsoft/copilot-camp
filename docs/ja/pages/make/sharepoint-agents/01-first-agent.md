---
search:
  exclude: true
---
# ラボ MSA1 - 最初の SharePoint エージェントを構築する

---8<--- "ja/msa-labs-prelude.md"

このラボでは、SharePoint Online に保存されたドキュメントを扱う SharePoint エージェントを作成します。作成するエージェントは、架空の企業の従業員が HR 部門の情報、ポリシー、ルールを取得できるように支援します。エージェントのナレッジ ベースは SharePoint Online のドキュメント ライブラリに保存されているドキュメント セットです。

## 演習 1: サンプル ドキュメントのアップロード

この手順では、SharePoint エージェントがユーザー プロンプトに応答するために使用するサンプル ドキュメントをアップロードします。これには、架空の Word、PowerPoint、PDF ファイルが含まれます。

### 手順 1: SharePoint サイトの作成

[Microsoft 365 Portal](https://m365.cloud.microsoft/){target=_blank} などで「Apps」メニュー 1️⃣ をクリックし、 **SharePoint** 2️⃣ を選択します。

![The UI of Microsoft 365 Portal with the Apps command and the SharePoint workload highlighted.](../../../assets/images/make/sharepoint-agents-01/m365-new-portal-01.png)

続いて **Create Site** 1️⃣ を選択し、 **Team site** 2️⃣ を選択します。

![The UI to create a new SharePoint Online site, with 'Team Site' template suggested.](../../../assets/images/extend-m365-copilot-05/upload-docs-02.png)

**Standard team** サイト テンプレートを選択すると、サイトのプレビューが表示されます。 **Use Template** を選択して続行します。

![The UI to select the 'Standard' site template for the target site.](../../../assets/images/extend-m365-copilot-05/upload-docs-03.png)

サイト名に「Copilot Dev Camp - HR」などの名前を入力 1️⃣ し、 **Next** 2️⃣ を選択します。名前はテナント内で一意である必要があるため、既に使用されている名前は避けてください。

![The UI to provide name, description, and other details for the target site to create.](../../../assets/images/make/sharepoint-agents-01/create-site-01.png)

プライバシー設定と言語を選択し、 **Create Site** を選択します。

![The UI to select the privacy settings and the language for the target site.](../../../assets/images/make/sharepoint-agents-01/create-site-02.png)

メンバーの追加はスキップし、サイトのプロビジョニングが完了したら **Finish** を選択します。数秒後、新しい SharePoint サイトが表示されます。

<cc-end-step lab="msa1" exercise="1" step="1" />

### 手順 2: サンプル ドキュメントのアップロード

この [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} を選択して、いくつかのファイル (Word、PowerPoint、PDF) を含む Zip ファイルをダウンロードし、ローカル ファイル システムの任意の場所に解凍します。

先ほど作成した SharePoint サイトに戻り、Documents Web パーツで **See all** を選択してドキュメント ライブラリのページを表示します。

![The home page of the site with the Documents web part and the 'See all' link highlighted.](../../../assets/images/make/sharepoint-agents-01/upload-docs-01.png)

次に、コマンド バーの **Upload** 1️⃣ ボタンを選択し、 **Files** 2️⃣ を選択します。

![The command bar of the document library with the 'Upload' menu expanded and the 'Files' option selected.](../../../assets/images/make/sharepoint-agents-01/upload-docs-02.png)

解凍したフォルダーに移動し、すべてのサンプル ドキュメントを選択 1️⃣ して **Open** 2️⃣ を選択します。

![The file system browsing dialog to select the files to upload.](../../../assets/images/make/sharepoint-agents-01/upload-docs-03.png)

<cc-end-step lab="msa1" exercise="1" step="2" />

## 演習 2: 初めての SharePoint エージェントの作成

この演習では、HR ドキュメントを管理する SharePoint エージェントの初期バージョンを作成します。

### 手順 1: エージェントの作成

前の演習で作成したドキュメント ライブラリ内のすべてのファイルを選択ボタン 1️⃣ で選択し、コマンド バーの **Create an agent** 2️⃣ コマンドを選択します。

![The SharePoint Online interface of a document library with all the documents selected and the "Create an agent" command highlighted in the command bar.](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-01.png)

!!! important "Creating SharePoint agents from files or folders"
    ライブラリで何も選択せずに **Create an agent** を選択すると、エージェントは現在のドキュメント ライブラリ全体を対象とします。ライブラリ内でファイルまたはサブフォルダーを明示的に選択してから **Create an agent** を選択すると、エージェントは選択したコンテンツのみを対象とします。1 つのエージェントで選択できるアイテム数は 20 個までです。20 個を超えて選択した場合、 *"Sources limit exceeded. The maximum number of sources you can add is 20. Remove XX sources to save this copilot."* のようなエラー メッセージが表示され、エージェントを作成できません。

ダイアログ ウィンドウが表示され、選択したコンテンツの概要を確認し、テスト目的でエージェントをすぐに開くか、作成済みのエージェントを編集するかを選択できます。

![The SharePoint Online interface when creating a SharePoint agent on topo of a document library. There is a recap of the selected content and a couple of buttons to "Open agent" or to "Edit" the agent.](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-02.png)

!!! note "Permissions to create a SharePoint agent"
    SharePoint エージェントを作成するには、対象ライブラリまたはサイトに対する contribute 権限が必要です。エージェントの裏側では新しい **.agent** ファイルが作成されるため、適切な権限が必要です。

<cc-end-step lab="msa1" exercise="2" step="1" />

### 手順 2: エージェントのテスト

前のダイアログ ウィンドウで **Open agent** ボタンを選択し、新しい SharePoint エージェントを試します。全画面のダイアログが表示され、プロンプトを入力してエージェントと対話できます。

![The SharePoint Online interface showing the new SharePoint agent. There are suggested starter prompts at the top of the page and a textarea to write a prompt in the lower part of the screen.](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-03.png)

次のプロンプトを入力して結果を確認してください:

- What is the process to hire new employees?
- How can I improve my career?

提案される回答は、エージェントのナレッジ ベースとして選択したドキュメントの内容を要約したものです。プロンプトを処理するエンジンは Microsoft 365 Copilot であり、AI 生成コンテンツに関する明確な注意事項 1️⃣ が表示されます。回答の下部には、回答生成に使用されたドキュメント 2️⃣ への参照があります。また、トピックを深堀りするためのフォローアップ プロンプト 3️⃣ も提案されます。

![The SharePoint Online interface showing the new SharePoint agent. There is a prompt and the answer provided by the agent. The answer includes a disclaimer about the content generated by AI, a reference to an actual document in the library, and a list of suggested prompts.](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-01.png)

エージェントのダイアログを閉じると、ライブラリに **New agent.agent** という新しいファイルがあることに気付きます。これが新しい SharePoint エージェント定義を表すファイルです。SharePoint Online の通常のファイル名変更機能を使用してファイル名を変更すると、エージェント名とエージェント ダイアログのタイトルも同様に変更されます。たとえば、 **HR agent** に名前を変更しましょう。

<cc-end-step lab="msa1" exercise="2" step="2" />

## 演習 3: エージェントの微調整

この演習では、 **HR agent** のアイコンや説明の設定、instructions の調整など、追加設定の方法を学びます。

### 手順 1: アイコンとタイトルの更新

ドキュメント ライブラリで **HR agent.agent** ファイルを選択し、 **...** を選択して SharePoint Online の ECB メニューを開き、 **Edit** コマンドを選択します。あるいは、ライブラリのコマンド バーにある **Edit** コマンドを使用してもかまいません。

![The ECB menu of SharePoint Online when the .agent file is selected. The "Edit" command is highlighted.](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-01.png)

新しいダイアログ ウィンドウが表示され、次の設定を管理できます:

- Overview: 名前、アイコン、目的/説明  
- Sources: ナレッジ ベースとして使用するデータ ソース (サイト、ライブラリ、ファイル) の設定  
- Behavior: ウェルカム メッセージ、スターター プロンプト、エージェント instructions  

ダイアログにはライブ プレビューもあり、変更をリアルタイムでテストできます。

編集ダイアログの最初のタブ **Overview** で、 [この画像ファイル](https://github.com/microsoft/copilot-camp/blob/main/src/make/sharepoint-agents/HR-SP-Agent.png) を使用してエージェントのアイコンを更新します。また、 **Purpose** を以下のテキストに変更します。

```text
This is an agent supporting users to find information, policies, and rules based on the HR department knowledge base
```

![The dialog window to edit the agent settings when it comes to update the agent name, icon, and purpose.](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-02.png)

**Add advanced customization in Copilot Studio** ボタンもありますが、この機能は現時点では利用できず、将来的に追加される予定です。

次にダイアログ ウィンドウの **Sources** タブを選択して、エージェントのナレッジ ベースを構成します。執筆時点では、構成できるデータ ソースは SharePoint Online のサイト、ドキュメント ライブラリ、ドキュメントのみです。将来的には Microsoft Copilot Studio を利用して追加のナレッジ ソースを構成できるようになる予定ですが、現時点で SharePoint エージェントがサポートするデータ ソースは SharePoint Online のみです。

![The dialog window to manage the data sources for the agent. There are fields to configure additional sites, libraries, or documents.](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-03.png)

**Add a SharePoint site** 1️⃣ セクションでは、エージェントのデータ ソースに追加するサイト コレクションを追加できます。サイトをタイトルで検索するか、追加したいサイトの URL を直接入力することもできます。  
既存のサイトを削除する場合は **Remove** 2️⃣ コマンドを選択します。現在のサイト (エージェントを構築したサイト) を削除すると、最初に構成したドキュメントも完全に削除される点に注意してください。  
最後に、 **Add document libraries, folders or files** 3️⃣ により、データ ソース アイテムの総数が 20 を超えない範囲でドキュメント ライブラリ、フォルダー、ファイルを追加できます。

<cc-end-step lab="msa1" exercise="3" step="1" />

### 手順 2: instructions の更新

構成ダイアログの **Behavior** タブでは、エージェントの初期 **Welcome messaging** 1️⃣ を設定できます。  
また、最大 3 つまでの **Starter prompts** 2️⃣ を設定でき、ユーザーがエージェントとの会話を開始するときに提示されます。

最も重要なのは **Agent instruction** 3️⃣ フィールドで、ここでエージェントの口調、動作、制限、ルールなどを詳細に調整できます。基本的に、エージェントの system prompt を設定する場所です。ここを詳細に設定するほど、エージェントから得られる結果の品質が向上します。デフォルトでは、汎用的な instructions が設定されています。デフォルト値は次のとおりです:

```text
Provide accurate information about the content in the selected files and reply in a formal tone.
```

![The dialog window to manage the behavior of the agent. There are fields to configure "Welcome messaging", "Starter promptes", and "Agent instructions".](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-04.png)

高品質なエージェントを作成するには、エージェントの目的に応じて具体的な instructions を提供すべきです。たとえば HR agent の場合、次のような架空の instructions を設定できます。

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

上記の instructions はあくまで例示であり、完全で万能なテンプレートを意図したものではありません。instructions では Markdown 構造を利用して各セクションを強調しています。

instructions は最大 8,000 文字まで入力できます。できる限り詳細に記述してください。[こちら](../../../copilot-instructions/beginner-agent){target=_blank} の **Declarative Agent Instruction Lab - Improve your agent instructions (Beginner friendly)** ラボでは、エージェント用のプロフェッショナルなプロンプト instructions の書き方を詳しく説明しています。また、[Write effective instructions for declarative agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-instructions){target=_blank} も参考になります。

<cc-end-step lab="msa1" exercise="3" step="2" />

### 手順 3: エージェントのテスト

エージェントのアイコン、目的、instructions を更新したら **Save and close** ボタンを選択します。ダイアログを閉じ、再度エージェントと対話します。

例として、次のプロンプトを入力します:

```text
Hello!
```

```text
How can I improve my career? Provide me a list of suggested actions.
```

![The updated behavior of the agent, based on the improved instructions. There are emojis, tables to render lists of items and generally speaking a more accurate respose.](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-02.png)

「Hello!」メッセージに対しては、instructions で設定したウェルカム メッセージが返されます。さらに、応答には絵文字や表が含まれ、指示どおりにリストがテーブル形式で表示されるなど、より精度の高い回答が得られます。

<cc-end-step lab="msa1" exercise="3" step="3" />

## 演習 4: サイトの既定エージェントとしてエージェントを構成する

エージェントをサイトの既定エージェントとして昇格させることもできます。現在、すべての SharePoint Online サイトには既製のエージェントが付属しています。スイート バーの Copilot コマンドを選択すると、既製エージェントが表示されます。

![The suite bar of Microsoft 365 when rendering a SharePoint Online site. There is the Copilot icon in a command to activate the site level agent.](../../../assets/images/make/sharepoint-agents-01/sp-ready-made-agent-01.png)

既製エージェントを有効化すると、右側にサイド パネルが表示され、プロンプトを入力して対話できます。エージェントにはあらかじめ定義された動作と汎用的な instructions が設定されています。

しかし、既製エージェントが合わない場合や独自のカスタム エージェントを使用したい場合があります。この演習では、その方法を学習します。

### 手順 1: エージェントの承認と昇格

サイトのホーム ページで Copilot コマンドを選択し、サイド パネルを開きます。

Copilot パネルを開くと、デフォルトでは既製エージェントが選択されていますが、エージェント名の横にあるドロップダウンを選択することで、作成済みの他のエージェントを選択できます。

![The Copilot side panel rendering the ready made agent for a site. There is the dropdown to select the agent to use, which allows to select the "HR agent" created before.](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-03.png)

次に既定エージェントを変更し、カスタム エージェントを既定エージェントに設定する方法を見ていきます。エージェントを作成したドキュメント ライブラリに戻り、エージェントを開きます。エージェント ダイアログの右上隅の **...** 1️⃣ を選択し、 **Set as approved** 2️⃣ コマンドを選択します。

![The command panel of an agent when select, allows to edit the agent, set the agent as approved, delete the Copilot history, or read the conversation history with the agent.](../../../assets/images/make/sharepoint-agents-01/approve-agent-01.png)

エージェントを承認するには、サイト所有者である必要があり、明示的な承認/確認が求められます。承認されたエージェントは **Site Assets** ライブラリの **Copilots** サブフォルダーに移動されるためです。

![The confirmation request dialog to approve an agent. The dialog explains that the agent, once approved, will be moved to the Site Assets library of the site.](../../../assets/images/make/sharepoint-agents-01/approve-agent-02.png)

承認プロセスが完了すると確認ダイアログが表示され、.agent ファイルは現在のドキュメント ライブラリから削除されます。

![The dialog confirming that the agent was approved. The dialog provides a link to the new location of the approved agent.](../../../assets/images/make/sharepoint-agents-01/approve-agent-03.png)

これでエージェントは **Approved for this site** の一覧に表示されます。

![The list of agents approved for the current site, showing the custom agent in the list of approved ones.](../../../assets/images/make/sharepoint-agents-01/approve-agent-04.png)

エージェントをアクティブにし、エージェント名の横にある **...** 1️⃣ を選択してコンテキスト メニューから **Set as site default** 2️⃣ コマンドを選択すると、そのエージェントをサイトの既定エージェントに設定できます。確認ダイアログで同意し、昇格プロセスが完了すると確認メッセージが表示されます。これでカスタム エージェントがスイート バーの Copilot アイコンを選択した際の既定エージェントとして最初に表示されます。

![The commands to promote an agent to be the site default one, once it has been approved.](../../../assets/images/make/sharepoint-agents-01/site-default-agent-01.png)

<cc-end-step lab="msa1" exercise="4" step="1" />

<a href="../02-sharing-agents">ここから開始</a> して Lab MSA2 を進め、Microsoft Teams で SharePoint エージェントを共有しましょう。  
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agents/01-first-agent" />