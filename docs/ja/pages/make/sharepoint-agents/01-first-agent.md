---
search:
  exclude: true
---
# ラボ MSA1 - 最初の SharePoint エージェントの構築

---8<--- "ja/msa-labs-prelude.md"

このラボでは、 SharePoint Online に保存されているドキュメントを扱う SharePoint エージェントを作成します。これから作成するエージェントは、架空の会社の従業員が HR 部門の情報、ポリシー、規則を取得するのに役立ちます。エージェントのナレッジ ベースは、SharePoint Online のドキュメント ライブラリに格納されたドキュメント群です。

## Exercise 1: サンプル ドキュメントのアップロード

この手順では、SharePoint エージェントが ユーザー プロンプトに応答するために使用するサンプル ドキュメントをアップロードします。ここには架空の Word、PowerPoint、PDF ファイルが含まれます。

### Step 1: SharePoint サイトの作成

[ Microsoft 365 Portal ](https://m365.cloud.microsoft/){target=_blank} など、Microsoft 365 の任意の場所で、「Apps」メニュー 1️⃣ をクリックし、**SharePoint** 2️⃣ を選択します。

![The UI of Microsoft 365 Portal with the Apps command and the SharePoint workload highlighted.](../../../assets/images/make/sharepoint-agents-01/m365-new-portal-01.png)

続いて **Create Site** 1️⃣ を選択し、**Team site** 2️⃣ を選びます。

![The UI to create a new SharePoint Online site, with 'Team Site' template suggested.](../../../assets/images/extend-m365-copilot-05/upload-docs-02.png)

**Standard team** サイト テンプレートを選択すると、サイトのプレビューが表示されます。**Use Template** を選択して続行します。

![The UI to select the 'Standard' site template for the target site.](../../../assets/images/extend-m365-copilot-05/upload-docs-03.png)

サイト名に「Copilot Dev Camp - HR」などを入力し 1️⃣、**Next** 2️⃣ を選択します。テナント内で一意の名前である必要があるため、既に使用されている名前は避けてください。

![The UI to provide name, description, and other details for the target site to create.](../../../assets/images/make/sharepoint-agents-01/create-site-01.png)

プライバシー設定と言語を選択し、**Create Site** を選びます。

![The UI to select the privacy settings and the language for the target site.](../../../assets/images/make/sharepoint-agents-01/create-site-02.png)

メンバーの追加はスキップし、サイトのプロビジョニングが完了したら **Finish** を選択します。数秒後、新しい SharePoint サイトが表示されます。

<cc-end-step lab="msa1" exercise="1" step="1" />

### Step 2: サンプル ドキュメントのアップロード

この [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} を選択して、いくつかのファイル (Word、PowerPoint、PDF) を含む zip ファイルをダウンロードし、ローカル ファイル システムの任意の場所に解凍します。

先ほど作成した SharePoint サイトに戻り、Documents Web パーツで **See all** を選択してドキュメント ライブラリ ページを表示します。

![The home page of the site with the Documents web part and the 'See all' link highlighted.](../../../assets/images/make/sharepoint-agents-01/upload-docs-01.png)

次に、コマンド バーの **Upload** 1️⃣ ボタンを選択し、**Files** 2️⃣ を選択します。

![The command bar of the document library with the 'Upload' menu expanded and the 'Files' option selected.](../../../assets/images/make/sharepoint-agents-01/upload-docs-02.png)

作業フォルダーに移動し、展開した履歴書ファイルをすべて選択 1️⃣ して **Open** 2️⃣ を選択します。

![The file system browsing dialog to select the files to upload.](../../../assets/images/make/sharepoint-agents-01/upload-docs-03.png)

<cc-end-step lab="msa1" exercise="1" step="2" />

## Exercise 2 : 最初の SharePoint エージェントの作成

この演習では、HR ドキュメントを管理する SharePoint エージェントの初期バージョンを作成します。

### Step 1: エージェントの作成

前の演習で作成したドキュメント ライブラリ内のすべてのファイルを、選択ボタン 1️⃣ をクリックして選択し、コマンド バーの **Create an agent** 2️⃣ コマンドを選びます。

![The SharePoint Online interface of a document library with all the documents selected and the "Create an agent" command highlighted in the command bar.](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-01.png)

!!! important "Creating SharePoint agents from files or folders"
    ライブラリでファイルを選択せずに **Create an agent** を選ぶと、エージェントは現在のドキュメント ライブラリの全コンテンツを対象とします。ファイルやサブフォルダーを選択してから **Create an agent** を選ぶと、エージェントは選択したコンテンツのみを対象とします。1 つのエージェントにつき 20 アイテムを超えて選択することはできません。20 アイテムを超えて選択した場合、「Sources limit exceeded. The maximum number of sources you can add is 20. Remove XX sources to save this copilot.」というエラーメッセージが表示され、エージェントを作成できません。

ダイアログ ウィンドウが表示され、選択したコンテンツの概要を確認し、テスト目的でエージェントを開くか、作成したばかりのエージェントを編集できます。

![The SharePoint Online interface when creating a SharePoint agent on topo of a document library. There is a recap of the selected content and a couple of buttons to "Open agent" or to "Edit" the agent.](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-02.png)

!!! note "Permissions to create a SharePoint agent"
    SharePoint エージェントを作成するには、対象のライブラリまたはサイトに対する Contribute 権限が必要です。エージェントの背後では新しい **.agent** ファイルが作成されるため、ユーザーには適切な権限が必要です。

<cc-end-step lab="msa1" exercise="2" step="1" />

### Step 2: エージェントのテスト

前のダイアログで **Open agent** ボタンを選び、新しい SharePoint エージェントを試してみましょう。全画面のダイアログが表示され、プロンプトを入力してエージェントと対話できます。

![The SharePoint Online interface showing the new SharePoint agent. There are suggested starter prompts at the top of the page and a textarea to write a prompt in the lower part of the screen.](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-03.png)

次のプロンプトを入力して結果を確認してください。

- 新入社員を採用するプロセスは何ですか？
- キャリアを向上させるにはどうすればよいですか？

提案された回答は、エージェントのナレッジ ベースとして選択したドキュメントの内容を要約します。プロンプト処理エンジンは Microsoft 365 Copilot であり、AI 生成コンテンツに関する明確な注意事項 1️⃣ が表示されます。回答の下部には、回答を生成する際に使用されたドキュメントへの参照 2️⃣ があります。また、エージェントはトピックを深掘りするためのフォローアップ プロンプト 3️⃣ も提案します。

![The SharePoint Online interface showing the new SharePoint agent. There is a prompt and the answer provided by the agent. The answer includes a disclaimer about the content generated by AI, a reference to an actual document in the library, and a list of suggested prompts.](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-01.png)

エージェント ダイアログを閉じると、ライブラリに **New agent.agent** という名前の新しいファイルがあることに気付きます。これが SharePoint エージェント定義を表すファイルです。SharePoint Online の標準的なファイル名変更機能を使用してファイル名を変更すると、エージェント名とダイアログのタイトルも同様に変更されます。たとえば **HR agent** に変更してみましょう。

<cc-end-step lab="msa1" exercise="2" step="2" />

## Exercise 3 : エージェントの微調整

この演習では、追加設定の構成や instructions の調整など、**HR agent** を細かくチューニングする方法を学びます。

### Step 1: アイコンとタイトルの更新

ドキュメント ライブラリで **HR agent.agent** ファイルを選択し、SharePoint Online の ECB メニューを開く **...** を選んで **Edit** コマンドを選択します。あるいは、ライブラリ コマンド バーの **Edit** コマンドを使用してもかまいません。

![The ECB menu of SharePoint Online when the .agent file is selected. The "Edit" command is highlighted.](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-01.png)

新しいダイアログ ウィンドウが表示され、次の設定を管理できます。

- Overview: 名前、アイコン、目的/説明
- Sources: ナレッジ ベースとして使用するデータ ソース (サイト、ライブラリ、ファイル) の構成
- Behavior: ウェルカム メッセージ、スターター プロンプト、エージェント instructions

ダイアログにはエージェントのプレビューもリアルタイムで更新され、変更をその場でテストできます。

編集ダイアログの最初のタブ **Overview** で、エージェントのアイコンを [この画像ファイル](https://github.com/microsoft/copilot-camp/blob/main/src/make/sharepoint-agents/HR-SP-Agent.png) に更新します。また、**Purpose** を次のテキストに変更します。

```text
This is an agent supporting users to find information, policies, and rules based on the HR department knowledge base
```

![The dialog window to edit the agent settings when it comes to update the agent name, icon, and purpose.](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-02.png)

**Add advanced customization in Copilot Studio** ボタンもありますが、これはまだ使用できず、将来利用可能になる予定です。

続いてダイアログの **Sources** タブを選択し、エージェントのナレッジ ベースを構成します。執筆時点では、設定できるデータ ソースは SharePoint Online のサイト、ドキュメント ライブラリ、ドキュメントのみです。将来的には Microsoft Copilot Studio を利用して追加のナレッジ ソースを構成できるようになる予定ですが、現時点では SharePoint Online のみがサポートされています。

![The dialog window to manage the data sources for the agent. There are fields to configure additional sites, libraries, or documents.](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-03.png)

**Add a SharePoint site** 1️⃣ セクションでは、追加のサイト コレクションをエージェントのデータ ソースに追加できます。タイトルでサイトを検索するか、追加したいサイトの URL を入力することも可能です。既存のサイトを削除する場合は **Remove** 2️⃣ コマンドを選択します。現在のサイト (エージェントを作成したサイト) を削除すると、最初にエージェントを構成した際に選択したドキュメントがすべて削除される点に注意してください。最後に、**Add document libraries, folders or files** 3️⃣ を使用して、合計 20 アイテムの制限を超えない範囲でライブラリ、フォルダー、ファイルを追加できます。

<cc-end-step lab="msa1" exercise="3" step="1" />

### Step 2: instructions の更新

構成ダイアログの **Behavior** タブでは、エージェントの初期 **Welcome messaging** 1️⃣ を設定できます。また、最大 3 つの **Starter prompts** 2️⃣ を設定し、 ユーザー がエージェントとの会話を開始する際に表示できます。

さらに重要なのが **Agent instruction** 3️⃣ フィールドで、ここでエージェントのトーン、動作、制限、ルールなどを詳細に調整できます。基本的に、ここがエージェントの system prompt を設定する場所です。詳細に記述するほど、エージェントから得られる結果は向上します。既定では、汎用的で一般的な instructions が設定されています。既定値は次のとおりです。

```text
Provide accurate information about the content in the selected files and reply in a formal tone.
```

![The dialog window to manage the behavior of the agent. There are fields to configure "Welcome messaging", "Starter promptes", and "Agent instructions".](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-04.png)

高品質なエージェントを作成するには、その目的に応じて具体的な instructions を提供することが重要です。たとえば HR agent の場合、以下は架空の instructions 例です。

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

上記の instructions はあくまで例示であり、完全性や完璧さを保証するものではありません。instructions では MD の文書構造を利用してセクションを強調表示しています。

instructions は最大 8,000 文字まで記述できるので、できるだけ詳細に記述することをお勧めします。詳細なプロンプト instructions の書き方については、[こちら](../../../copilot-instructions/beginner-agent){target=_blank} の **Declarative Agent Instruction Lab - Improve your agent instructions (Beginner friendly)** ラボや、[Write effective instructions for declarative agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-instructions){target=_blank} を参照してください。

<cc-end-step lab="msa1" exercise="3" step="2" />

### Step 3: エージェントのテスト

エージェントのアイコン、目的、instructions を更新したら **Save and close** ボタンを選択します。ダイアログを閉じ、再度エージェントと対話します。

たとえば、次のプロンプトを入力します。

```text
Hello!
```

```text
How can I improve my career? Provide me a list of suggested actions.
```

![The updated behavior of the agent, based on the improved instructions. There are emojis, tables to render lists of items and generally speaking a more accurate respose.](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-02.png)

「Hello!」メッセージに対し、エージェントが instructions で設定したウェルカム メッセージで応答することが確認できます。また、絵文字や表を用いたより正確な回答が得られます。

<cc-end-step lab="msa1" exercise="3" step="3" />

## Exercise 4 : エージェントをサイトの既定エージェントに設定

エージェントでできるもう 1 つのことは、サイトの既定エージェントとして昇格させることです。現在、すべての SharePoint Online サイトには既製のエージェントが用意されています。スイート バーの Copilot コマンドを選択するだけで、サイト レベルのエージェントが表示されます。

![The suite bar of Microsoft 365 when rendering a SharePoint Online site. There is the Copilot icon in a command to activate the site level agent.](../../../assets/images/make/sharepoint-agents-01/sp-ready-made-agent-01.png)

SharePoint Online サイトの既製エージェントを起動すると、右側にサイド パネルが表示され、プロンプトを入力してエージェントと対話できます。このエージェントにはあらかじめ定義された動作と汎用的な instructions が設定されています。

しかし、既製エージェントではなく独自のカスタム エージェントを使用したい場合もあります。この演習では、その方法を学びます。

### Step 1: エージェントの承認と昇格

サイトのホーム ページに移動し、Copilot コマンドを選択してサイド パネルを開きます。

Copilot パネルを開くと、既定では既製のエージェントが表示されますが、エージェント名の横にあるドロップダウンを選択し、他の作成済みエージェントを選ぶことができます。

![The Copilot side panel rendering the ready made agent for a site. There is the dropdown to select the agent to use, which allows to select the "HR agent" created before.](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-03.png)

続いて既定エージェントを変更し、カスタム エージェントを既定に設定する方法を見ていきましょう。エージェントを作成したドキュメント ライブラリに戻り、エージェントを開きます。エージェント ダイアログ右上の **...** 1️⃣ を選択し、**Set as approved** 2️⃣ コマンドを選びます。

![The command panel of an agent when select, allows to edit the agent, set the agent as approved, delete the Copilot history, or read the conversation history with the agent.](../../../assets/images/make/sharepoint-agents-01/approve-agent-01.png)

エージェントを承認するにはサイト所有者である必要があり、明示的な承認/確認も求められます。承認されたエージェントは **Site Assets** ライブラリ内の **Copilots** というサブフォルダーに移動されるためです。

![The confirmation request dialog to approve an agent. The dialog explains that the agent, once approved, will be moved to the Site Assets library of the site.](../../../assets/images/make/sharepoint-agents-01/approve-agent-02.png)

承認プロセスが完了すると確認ダイアログが表示され、.agent ファイルは現在のドキュメント ライブラリから消えます。

![The dialog confirming that the agent was approved. The dialog provides a link to the new location of the approved agent.](../../../assets/images/make/sharepoint-agents-01/approve-agent-03.png)

これでエージェントは **Approved for this site** の一覧に表示されます。

![The list of agents approved for the current site, showing the custom agent in the list of approved ones.](../../../assets/images/make/sharepoint-agents-01/approve-agent-04.png)

エージェントをアクティブにし、エージェント名の横にある **...** 1️⃣ を選択してコンテキスト メニューの **Set as site default** 2️⃣ コマンドを使用すると、エージェントをサイトの既定エージェントとして構成できます。確認ダイアログで同意すると昇格プロセスが完了し、スイート バーの Copilot アイコンを選択した際に自動的にカスタム エージェントが最初に表示されるようになります。

![The commands to promote an agent to be the site default one, once it has been approved.](../../../assets/images/make/sharepoint-agents-01/site-default-agent-01.png)

<cc-end-step lab="msa1" exercise="4" step="1" />

<a href="../02-sharing-agents">こちらから Lab MSA2 を開始し、SharePoint エージェントを Microsoft Teams で共有しましょう。</a>
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agents/01-first-agent" />