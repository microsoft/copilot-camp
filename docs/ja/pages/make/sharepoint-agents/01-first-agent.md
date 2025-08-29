---
search:
  exclude: true
---
# ラボ MSA1 - 最初の SharePoint エージェントを作成する

---8<--- "ja/msa-labs-prelude.md"

このラボでは、SharePoint Online に保存されているドキュメントを扱う SharePoint エージェントを作成します。作成するエージェントは、架空の会社の従業員が人事部 (HR) の情報、ポリシー、規則を取得できるように支援します。エージェントのナレッジ ベースは、SharePoint Online のドキュメント ライブラリに保存されている一連のドキュメントです。

## Exercise 1: サンプル ドキュメントのアップロード

この手順では、SharePoint エージェントがユーザーからのプロンプトに回答する際に使用するサンプル ドキュメントをアップロードします。これには、架空の Word、PowerPoint、PDF ファイルが含まれます。

### Step 1: SharePoint サイトの作成

[Microsoft 365 Portal](https://m365.cloud.microsoft/){target=_blank} などの Microsoft 365 内で、「Apps」メニュー 1️⃣ をクリックし、**SharePoint** 2️⃣ を選択します。

![The UI of Microsoft 365 Portal with the Apps command and the SharePoint workload highlighted.](../../../assets/images/make/sharepoint-agents-01/m365-new-portal-01.png)

続いて **Create Site** 1️⃣ を選択し、**Team site** 2️⃣ を選択します。

![The UI to create a new SharePoint Online site, with 'Team Site' template suggested.](../../../assets/images/extend-m365-copilot-05/upload-docs-02.png)

**Standard team** サイト テンプレートを選択すると、サイトのプレビューが表示されます。**Use Template** を選択して続行します。

![The UI to select the 'Standard' site template for the target site.](../../../assets/images/extend-m365-copilot-05/upload-docs-03.png)

サイト名に「Copilot Dev Camp - HR」などを入力 1️⃣ し、**Next** 2️⃣ を選択します。名前はテナント内で一意である必要があるため、既に使われている名前は使用しないでください。

![The UI to provide name, description, and other details for the target site to create.](../../../assets/images/make/sharepoint-agents-01/create-site-01.png)

次にプライバシー設定と言語を選択し、**Create Site** を選択します。

![The UI to select the privacy settings and the language for the target site.](../../../assets/images/make/sharepoint-agents-01/create-site-02.png)

サイト プロビジョニングが完了したら、メンバー追加をスキップし、**Finish** を選択します。数秒後、新しい SharePoint サイトが表示されます。 

<cc-end-step lab="msa1" exercise="1" step="1" />

### Step 2: サンプル ドキュメントのアップロード

この [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} を選択して、複数のファイル (Word、PowerPoint、PDF) が入った zip ファイルをダウンロードし、ローカル ファイル システムの任意の場所に解凍します。

先ほど作成した SharePoint サイトに戻り、Documents Web パーツで **See all** を選択してドキュメント ライブラリ ページを表示します。

![The home page of the site with the Documents web part and the 'See all' link highlighted.](../../../assets/images/make/sharepoint-agents-01/upload-docs-01.png)

次に、コマンド バーの **Upload** 1️⃣ ボタンを選択し、**Files** 2️⃣ を選択します。

![The command bar of the document library with the 'Upload' menu expanded and the 'Files' option selected.](../../../assets/images/make/sharepoint-agents-01/upload-docs-02.png)

解凍したフォルダーに移動し、すべてのサンプル ドキュメントを選択 1️⃣ して **Open** 2️⃣ を選択します。

![The file system browsing dialog to select the files to upload.](../../../assets/images/make/sharepoint-agents-01/upload-docs-03.png)

<cc-end-step lab="msa1" exercise="1" step="2" />

## Exercise 2 : 最初の SharePoint エージェントの作成

この演習では、HR ドキュメントを管理する SharePoint エージェントの初期バージョンを作成します。

### Step 1: エージェントの作成

前の演習で作成したドキュメント ライブラリ内のすべてのファイルを選択ボタン 1️⃣ で選択し、コマンド バーの **Create an agent** 2️⃣ コマンドを選択します。

![The SharePoint Online interface of a document library with all the documents selected and the "Create an agent" command highlighted in the command bar.](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-01.png)

!!! important "ファイルまたはフォルダーからの SharePoint エージェントの作成"
    ライブラリで何も選択せずに **Create an agent** コマンドを選択すると、エージェントは現在のドキュメント ライブラリ全体を対象とします。ライブラリ内でファイルやサブフォルダーを明示的に選択してから **Create an agent** を選択すると、エージェントは選択されたコンテンツのみを対象とします。1 つのエージェントで選択できるアイテムは 20 個までです。20 個を超えて選択した場合、*"Sources limit exceeded. The maximum number of sources you can add is 20. Remove XX sources to save this copilot."* というエラー メッセージが表示され、エージェントを作成できません。

選択したコンテンツの概要を確認し、テスト用にエージェントを開くか、作成されたばかりのエージェントを編集できるダイアログ ウィンドウが表示されます。

![The SharePoint Online interface when creating a SharePoint agent on topo of a document library. There is a recap of the selected content and a couple of buttons to "Open agent" or to "Edit" the agent.](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-02.png)

!!! note "SharePoint エージェントを作成するための権限"
    SharePoint エージェントを作成するには、対象のライブラリまたはサイトで **Contribute** 権限が必要です。エージェントの裏側では新しい **.agent** ファイルが作成されるため、ユーザーには適切な権限が必要です。

<cc-end-step lab="msa1" exercise="2" step="1" />

### Step 2: エージェントのテスト

先ほどのダイアログ ウィンドウで **Open agent** ボタンを選択し、新しい SharePoint エージェントを試してみましょう。フルスクリーン ダイアログが表示され、プロンプトを入力してエージェントと対話できます。

![The SharePoint Online interface showing the new SharePoint agent. There are suggested starter prompts at the top of the page and a textarea to write a prompt in the lower part of the screen.](../../../assets/images/make/sharepoint-agents-01/create-sp-agent-03.png)

次のプロンプトを入力し、結果を確認してみてください。

- What is the process to hire new employees?
- How can I improve my career?

提案された回答は、エージェントのナレッジ ベースとして選択したドキュメントの内容を要約したものになります。プロンプトを処理するエンジンは Microsoft 365 Copilot であり、AI によって生成されたコンテンツであることを示す明確な **注意事項** 1️⃣ が表示されています。回答の下部には、回答の生成に使用されたドキュメントへの参照 2️⃣ が示されます。また、エージェントは関連トピックを深掘りするためのフォローアップ プロンプト 3️⃣ も提案します。

![The SharePoint Online interface showing the new SharePoint agent. There is a prompt and the answer provided by the agent. The answer includes a disclaimer about the content generated by AI, a reference to an actual document in the library, and a list of suggested prompts.](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-01.png)

エージェントのダイアログを閉じると、ライブラリに **New agent.agent** という新しいファイルがあることに気付くはずです。これが新しい SharePoint エージェント定義を表すファイルです。SharePoint Online の標準的なファイル名変更機能を使用してファイル名を変更すると、エージェント名およびエージェント ダイアログのタイトルもそれに応じて変更されます。例として、**HR agent** に名前を変更してみましょう。

<cc-end-step lab="msa1" exercise="2" step="2" />

## Exercise 3 : エージェントの微調整

この演習では、**HR agent** の追加設定や指示の調整など、エージェントを微調整する方法を学びます。 

### Step 1: アイコンとタイトルの更新

ドキュメント ライブラリで **HR agent.agent** ファイルを選択し、**...** をクリックして SharePoint Online の ECB メニューを開き、**Edit** コマンドを選択します。あるいは、ライブラリのコマンド バーにある **Edit** コマンドを選択してもかまいません。

![The ECB menu of SharePoint Online when the .agent file is selected. The "Edit" command is highlighted.](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-01.png)

新しいダイアログ ウィンドウが表示され、次の設定を管理できます。

- Overview: 名前、アイコン、目的/説明  
- Sources: ナレッジ ベースとして使用するデータ ソース (サイト、ライブラリ、ファイル) の設定  
- Behavior: ウェルカム メッセージ、スターター プロンプト、エージェントの指示  

ダイアログでは、エージェントのプレビューがリアルタイムで更新され、その場で変更内容をテストすることもできます。

編集ダイアログの最初のタブ **Overview** で、[こちらの画像ファイル](https://github.com/microsoft/copilot-camp/blob/main/src/make/sharepoint-agents/HR-SP-Agent.png) を使ってエージェントのアイコンを更新します。また、**Purpose** を次のテキストに更新してください。

```text
This is an agent supporting users to find information, policies, and rules based on the HR department knowledge base
```

![The dialog window to edit the agent settings when it comes to update the agent name, icon, and purpose.](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-02.png)

**Add advanced customization in Copilot Studio** ボタンもありますが、これは将来提供される予定の機能で、現時点では利用できません。

次に、ダイアログ ウィンドウの **Sources** タブを選択し、エージェントのナレッジ ベースを構成します。執筆時点では、構成できるデータ ソースは SharePoint Online のサイト、ドキュメント ライブラリ、ドキュメントのみです。将来的には Microsoft Copilot Studio を使用して追加のナレッジ ソースを構成できるようになる予定です。現時点で SharePoint エージェントがサポートするデータ ソースは SharePoint Online のみです。

![The dialog window to manage the data sources for the agent. There are fields to configure additional sites, libraries, or documents.](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-03.png)

**Add a SharePoint site** 1️⃣ セクションでは、追加のサイト コレクションをエージェントのデータ ソースとして追加できます。タイトルでサイトを検索するか、追加したいサイトの URL を入力します。  
既存のサイトを削除する場合は **Remove** 2️⃣ コマンドを選択します。エージェントを作成した元のサイトを削除すると、最初に構成したすべてのドキュメントが完全に削除されるので注意してください。  
最後に、ドキュメント ライブラリ、フォルダー、ファイルを **Add document libraries, folders or files** 3️⃣ で追加できますが、データ ソース アイテムの合計が 20 個を超えないようにしてください。

<cc-end-step lab="msa1" exercise="3" step="1" />

### Step 2: 指示の更新

構成ダイアログの **Behavior** タブでは、エージェントの **Welcome messaging** 1️⃣ を設定できます。  
さらに、ユーザーが会話を開始するときに表示される最大 3 つの **Starter prompts** 2️⃣ を設定できます。

最も重要なのは、**Agent instruction** 3️⃣ フィールドで、エージェントのトーン、動作、制限、規則などを詳細に設定できる点です。基本的には、ここでエージェントの **システムプロンプト** を構成します。このフィールドを詳細に記述するほど、エージェントから得られる結果は向上します。  
デフォルトでは、あらかじめ設定されている指示は非常に一般的で汎用的です。デフォルト値は次のとおりです。

```text
Provide accurate information about the content in the selected files and reply in a formal tone.
```

![The dialog window to manage the behavior of the agent. There are fields to configure "Welcome messaging", "Starter promptes", and "Agent instructions".](../../../assets/images/make/sharepoint-agents-01/edit-sp-agent-04.png)

高品質なエージェントを作成するには、エージェントの実際の目的に応じた具体的な指示を提供する必要があります。例えば HR エージェントの場合、以下のような指示を設定できます。

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

上記の指示は例示目的であり、完全ではなく、万能なテンプレートを目指すものではありません。指示では MD ドキュメント構造を利用して、テキスト内のさまざまなセクションを強調しています。

指示は最大 8,000 文字まで記述できますので、できる限り詳細に記載することをおすすめします。[こちら](../../../copilot-instructions/beginner-agent){target=_blank} の **Declarative Agent Instruction Lab - Improve your agent instructions (Beginner friendly)** ラボでは、エージェント向けのプロフェッショナルなプロンプト指示を書く方法を詳しく学べます。また、[Write effective instructions for declarative agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-instructions){target=_blank} の記事も参照してください。

<cc-end-step lab="msa1" exercise="3" step="2" />

### Step 3: エージェントのテスト

エージェントのアイコン、目的、指示を更新したら **Save and close** ボタンを選択します。ダイアログを閉じ、再度エージェントと対話します。

例として、次のプロンプトを入力します。

```text
Hello!
```

```text
How can I improve my career? Provide me a list of suggested actions.
```

![The updated behavior of the agent, based on the improved instructions. There are emojis, tables to render lists of items and generally speaking a more accurate respose.](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-02.png)

「Hello!」メッセージに対し、エージェントが指示で設定したウェルカム メッセージで応答することが確認できます。また、指示に従い、絵文字を使用したり、リストをテーブルで表示したりと、より正確な回答が得られます。

<cc-end-step lab="msa1" exercise="3" step="3" />

## Exercise 4 : サイトの既定エージェントとしての設定

エージェントでできるもう 1 つの操作は、サイトの既定エージェントとして昇格させることです。現在、すべての SharePoint Online サイトには既定でエージェントが用意されています。スイート バーで Copilot コマンドを選択すると、この既成エージェントが表示されます。

![The suite bar of Microsoft 365 when rendering a SharePoint Online site. There is the Copilot icon in a command to activate the site level agent.](../../../assets/images/make/sharepoint-agents-01/sp-ready-made-agent-01.png)

SharePoint Online サイトの既成エージェントを起動すると、右側にサイド パネルが表示され、プロンプトを入力してエージェントと対話できます。エージェントにはあらかじめ定義された動作と汎用的な指示が設定されています。

しかし、既成エージェントではなく独自のカスタム エージェントを使用したい場合もあります。この演習では、その方法を学びます。

### Step 1: エージェントの承認と昇格

サイトのホーム ページに移動し、Copilot コマンドを選択してサイド パネルを起動します。

Copilot パネルを開くと、デフォルトで既成エージェントが表示されますが、エージェント名の横にあるドロップダウンを選択すると、作成済みの他のエージェントを選択できます。

![The Copilot side panel rendering the ready made agent for a site. There is the dropdown to select the agent to use, which allows to select the "HR agent" created before.](../../../assets/images/make/sharepoint-agents-01/sp-agent-in-action-03.png)

次に、カスタム エージェントを既定エージェントに設定する手順を見ていきます。エージェントを作成したドキュメント ライブラリに戻り、エージェントを開きます。エージェント ダイアログの右上にある **...** 1️⃣ を選択し、**Set as approved** 2️⃣ コマンドを選択します。

![The command panel of an agent when select, allows to edit the agent, set the agent as approved, delete the Copilot history, or read the conversation history with the agent.](../../../assets/images/make/sharepoint-agents-01/approve-agent-01.png)

エージェントを承認するには、サイト所有者である必要があり、明示的な承認/確認も求められます。承認されたエージェントは **Site Assets** ライブラリ内の **Copilots** というサブフォルダーに移動されるためです。

![The confirmation request dialog to approve an agent. The dialog explains that the agent, once approved, will be moved to the Site Assets library of the site.](../../../assets/images/make/sharepoint-agents-01/approve-agent-02.png)

承認プロセスが完了すると、確認ダイアログが表示され、.agent ファイルは現在のドキュメント ライブラリから消えます。

![The dialog confirming that the agent was approved. The dialog provides a link to the new location of the approved agent.](../../../assets/images/make/sharepoint-agents-01/approve-agent-03.png)

これで、エージェントは **Approved for this site** の一覧に表示されます。

![The list of agents approved for the current site, showing the custom agent in the list of approved ones.](../../../assets/images/make/sharepoint-agents-01/approve-agent-04.png)

エージェントをアクティブにし、エージェント名の横にある **...** 1️⃣ を選択して、コンテキスト メニューから **Set as site default** 2️⃣ コマンドを選択し、エージェントをサイトの既定エージェントとして構成します。設定を確認すると、昇格プロセスが完了したことを示すダイアログが表示されます。これで、サイトのスイート バーで Copilot アイコンを選択したときに、カスタム エージェントが最初に表示され既定エージェントとなります。

![The commands to promote an agent to be the site default one, once it has been approved.](../../../assets/images/make/sharepoint-agents-01/site-default-agent-01.png)

<cc-end-step lab="msa1" exercise="4" step="1" />

<a href="../02-sharing-agents">こちらから</a> ラボ MSA2 を開始し、SharePoint エージェントを Microsoft Teams で共有しましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agents/01-first-agent--ja" />