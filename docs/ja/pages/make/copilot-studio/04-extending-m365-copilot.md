---
search:
  exclude: true
---
# Lab MCS4 - Microsoft 365 Copilot の拡張

このラボでは、Microsoft Copilot Studio で作成した 宣言型 エージェントを使用して Microsoft 365 Copilot Chat を拡張する方法を学習します。これまでに Microsoft Copilot Studio で エージェント を作成し、Microsoft Teams で利用する方法を確認してきました。また、Copilot Studio で作成した エージェント は、**Teams and Microsoft 365 Copilot** チャネルのオプションを通じて Microsoft Teams と Microsoft 365 Copilot Chat の両方を対象にできることも見てきました。本ラボでは、Microsoft 365 Copilot Chat 用の 宣言型 エージェント に進みます。

このラボで学習する内容:

- Microsoft 365 Copilot Chat 用の 宣言型 エージェント の作成方法
- エージェントのカスタム アイコンの設定方法
- エージェントのナレッジ ソースの設定方法
- Microsoft 365 Copilot Chat へのエージェントの公開方法
- Microsoft 365 Copilot Chat 用のツールの作成方法

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/JUctt1s5oj0" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>ビデオでラボの概要を確認してください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

## Exercise 1 : Microsoft 365 Copilot Chat 用エージェントの作成

この演習では、Microsoft Copilot Studio で 宣言型 エージェント を作成し、Microsoft 365 Copilot Chat にホストします。

### Step 1: Copilot Chat 用エージェントの作成

Microsoft 365 Copilot Chat 用の 宣言型 エージェント を作成するには、1️⃣ Copilot Studio で エージェント の一覧を表示し、2️⃣ **Microsoft 365 Copilot** という名前の エージェント を選択します。

![The interface of Microsoft Copilot Studio when browsing the whole list of agents and selecting the **Microsoft 365 Copilot** agent.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-01.png)

Microsoft Copilot Studio の新しいセクションが開きます。ここで **+ Add** コマンドを選択し、Microsoft 365 Copilot Chat 用の新しい エージェント を作成します。

![The interface of Microsoft Copilot Studio editing Microsoft 365 Copilot agents. The **+ Add** button is highlighted. There is also a list of pre-defined tools.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-02.png)

Copilot Studio から、エージェントの目的を自然言語で説明するよう求められます。[Lab MCS1](../01-first-agent){target=_blank} と同様に、以下のプロンプト例のように自然言語で要件を記述できます。

```txt
You are an agent helping employees to find information about HR policies and procedures,
about how to improve their career, and about how to define learning pathways.
```

Copilot Studio に名前を尋ねられたら、カスタム エージェント に「Agentic HR」と入力します。その後、次の指示を入力して、エージェントに特定のタスクやゴールを設定します。

```txt
Emphasize everything that helps team building, inclusion, and the growth mindset
```

次に、次の内容を入力してエージェントのトーンを「プロフェッショナル」に設定します。

```txt
It should have a professional tone
```

![The interface of Microsoft Copilot Studio when defining the agent using natural language.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-03.png)

エージェントの説明が完了したら **Create** コマンドを選択して実際にエージェントを作成します。あるいは **Skip to configure** コマンドを選択して従来の設定 UI に進むこともできます。

エージェントが作成されると、以下を設定できる構成ページが表示されます。

- Details: 名前、アイコン、説明、指示 (system prompt) などの一般情報
- Knowledge: エージェントのナレッジ ベースを定義
- Tools: エージェント用のカスタム ツールを定義
- Additional settings: 公開 Web コンテンツの利用有無を設定
- Starter prompts: 新しいチャット開始時に Copilot Chat に表示されるスターター プロンプト (最大 6 件)
- Publishing details: 公開後の利用方法に関する情報

![The configuration page of an agent for Microsoft 365 Copilot Chat in Microsoft Copilot Studio. There are sections to define general details, knowledge bases, tools, additional settings, starter prompts, and publishing details.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-04.png)

画面右側には、エージェントのプレビューが表示され、動作をテストできます。
初期設定は完了しました。次のステップで詳細を調整しましょう。

<cc-end-step lab="mcs4" exercise="1" step="1" />

### Step 2: エージェントのアイコンを更新する

**Details** セクション右上の **Edit** コマンドを選択して詳細を編集します。
編集モードで **Change icon** コマンドを選択し、カスタム アイコンをアップロードして背景色を設定します。
必要に応じて [こちらのアイコン](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/HR-agent-color.png?raw=true){target=_blank} を使用できます。その場合、背景色は #B9BAB5 が適しています。

![The configuration page while editing the details of the agent and specifically updading the icon of the agent.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-05.png)

**Save** コマンドを選択して新しいアイコンと背景色を保存し、さらに **Save** ボタンを選択してエージェントの詳細を更新します。

<cc-end-step lab="mcs4" exercise="1" step="2" />

### Step 3: ナレッジ ベースを追加する

[Lab MCS1](../01-first-agent){target=_blank} と同様に、[このリンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} から Word、PowerPoint、PDF ファイルを含む zip をダウンロードします。

zip を解凍したら、同じテナントの SharePoint Teams サイトの **Documents** ライブラリにアップロードします。これらのドキュメントは本ラボ用に Microsoft 365 Copilot で生成されたものです。

サイトの絶対 URL をコピーします。例: `https://xyz.sharepoint.com/sites/contoso`

ナレッジ ソースを追加するには、**Knowledge** セクション右上の **+ Add knowledge** コマンドを選択します。ポップアップ ダイアログでデータ ソースを選択します。現時点では **SharePoint** データ ソースを選択できます。**SharePoint** を選択し、データ ソースにするサイトを指定します。

![The dialog to configure additional knowledge base for the agent. There is a list of **Featured** knowledge bases, where right now there is only SharePoint. There is a command to browse **Advanced** data source, too.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-06.png)

ダイアログに SharePoint Online サイトの URL を貼り付けるか、**Browse files** コマンドでサイトを参照します。URL またはデータ ソースを選択したら、ナレッジ ベースの名前と説明を入力します。説明は Copilot がユーザーの意図を判断するときに使用されます。

![The dialog to configure a SharePoint Online data source. There is a command to **Browse files** and a textbox to paste a direct link to a data source. There is also an already selected data source with URL Link, Name, and Description. In the lower part of the dialog there are an **Add** command to save the new data source, a **Cancel** command to cancel the operation, and a **Back** command to go back to the previous stage.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-07.png)

**Add** ボタンを選択してナレッジ ベースにデータ ソースを追加します。

!!! warning "重要"
    Copilot Studio で SharePoint Online サイトをナレッジ ベースとして構成すると、ユーザーは自分がアクセス権を持つドキュメントからのみ回答やコンテンツを取得できます。Microsoft 365 のセキュリティ インフラストラクチャによってアクセス制御が保証され、Copilot Studio エージェントは現在の ユーザー の権限でドキュメントにアクセスします。
    
<cc-end-step lab="mcs4" exercise="1" step="3" />

### Step 4: エージェントを Microsoft 365 Copilot Chat に公開する

エージェントを Microsoft 365 Copilot Chat に公開してテストします。1️⃣ 画面右上の **Publish** コマンドを選択してエージェントを Copilot Chat で利用可能にします。次に 2️⃣ 必要事項を入力し、最後に 3️⃣ ダイアログ下部の **Publish** コマンドを選択します。

![The agent in Copilot Studio with the **Publish** button highlighted and the publishing dialog where there are fields to define, short description, long description, developer name, developer website URL, privacy statement URL, terms of use URL.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-08.png)

入力する詳細は Microsoft 365 アプリ マニフェストで要求される項目です。

- Short description: エージェントの短い説明 (最大 30 文字)
- Long description: エージェントの詳細説明 (最大 100 文字)
- Developer name: 開発者名 (最大 32 文字)
- Website: 開発者サイトの URL (最大 2048 文字)
- Privacy statement: プライバシー ステートメントの URL (最大 2048 文字)
- Terms of use: 利用規約の URL (最大 2048 文字)

初回公開には 30〜60 秒ほどかかります。公開が完了すると、利用オプションの概要がダイアログに表示されます。

![The dialog confirming the successful publishing and providing a command to copy a direct link to the agent app, two commands to share the agent with selected group of people or with the whole organization, and a command to download a ZIP package to publish the agent in the store.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-09.png)

特に次の操作が可能です。

- **Copy**: エージェント アプリへの直接リンク URL をコピー
- **Show to my teammates and shared users**: 特定のグループや個人と共有
- **Show to everyone in my org**: 組織全体と共有
- **Download .zip file**: ストア公開用の zip パッケージをダウンロード

!!! note "Show to everyone in my org"
    組織全体に公開する場合は、エージェントがリリース準備完了であり、社内の基準・規定・ポリシーに準拠していることを確認し、チームメイトと調整してください。提出後、管理者が承認または拒否するまで他の人が再提出できません。詳細は [Show to the organization](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams#show-to-the-organization){target=_blank} を参照してください。

**Copy** コマンドを選択し、新しいブラウザー タブで URL を開きます。
ブラウザーに会社のアプリ ストアが表示され、**Add** ボタンを押してエージェントを Microsoft 365 Copilot に追加できます。

![The company store with the agent dialog allowing to add the agent to Microsoft 365 Copilot.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-10.png)

エージェントを Microsoft 365 Copilot Chat に追加すると、Copilot Chat 右側のエージェント一覧に表示されます。

![The "Agentic HR" agent in Microsoft 365 Copilot Chat.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-11.png)

エージェントを選択し、次のプロンプト例のように対話してみましょう。

```txt
How can we hire new people in our company?
```

エージェントは、ナレッジ ベースに設定したドキュメント `Hiring Procedures.docx` などを参照しながら、人材採用手順について詳細な情報を提供します。

![The "Agentic HR" agent in action in Microsoft 365 Copilot Chat, answering a prompt about the hiring procedures and providing a reference to a Word document stored in the SharePoint Online knowledge base of the agent.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-12.png)

<cc-end-step lab="mcs4" exercise="1" step="4" />

## Exercise 2 : エージェントにツールを追加する

この演習では、前の演習で作成したエージェントにカスタム ツールを追加します。Microsoft Copilot Studio で Microsoft 365 Copilot Chat 用のエージェントを作成する際、次の 4 種類のツールを追加できます。

- Prompt: 自然言語のプロンプトで作成した AI ツールを利用
- Custom connector: Power Platform のカスタム コネクタを利用
- REST API: 外部 REST API を利用。詳細は [こちら](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api){target=_blank}
- Model Context Protocol: MCP サーバーとそのツールを利用

!!! information "エージェント用ツール"
    Copilot Studio で エージェント にツールを追加する方法の詳細は、[Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-plugin-actions){target=_blank} を参照してください。

このラボでは `Custom connector` タイプのツールを追加し、SharePoint Online に保存した Excel スプレッドシートから候補者リストを取得します。

### Step 1: Microsoft 365 Copilot 用エージェントにツールを追加する

ツールを追加するには、エージェントの構成パネルの **Tools** セクションで **+ Add tool** コマンドを選択します。

![The **Tools** section of an agent with the **+ Add tool** command highlighted.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-01.png)

ダイアログが表示され、作成するツールの種類を選択します。既定では **Featured** ツールがいくつか表示され、Excel Online と連携するものなどが含まれています。**+ New tool** コマンドを選択し、前述のオプションから新規作成することもできます。

目的のツールが表示されない場合は **All** グループに切り替え、テキスト検索してください。

ここでは **Excel Online (Business)** の **List rows present in a table** を選択します。まず **Connection** で **Create new connection** を選び、コネクタへの接続を設定します。

![The dialog to connect to the target Power Platform connector with details about the connection, if any, or a button to create a new connection. There is also a back button to start over.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03.png)

アカウントでサインインし、Excel Online (Business) へのアクセスを許可します。接続が完了すると **Add to agent** または **Add and configure** のコマンドが表示されます。

![The dialog to add the actual tool to the agent. There are commands to **Add to agent** or **Add and configure** the tool. There is also a back button to start over.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03b.png)

ツールを追加すると Copilot Studio にツールの一覧が表示されます。作成したツールをクリックして設定を編集します。構成パネルでは以下を指定します。

- Name: ツールの説明的な名前
- Display name: ツールの表示名
- Description: ジェネレーティブ オーケストレーションがツール使用タイミングを判断するための自然言語説明
- Inputs and outputs: 入力・出力引数
- Response settings: リクエストと ユーザー への応答の扱い

設定前に候補者リストの Excel ファイルを準備します。
[こちらのリンク](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/Candidates/Sample-list-of-candidates.xlsx?raw=true){target=_blank} からサンプル Excel をダウンロードし、同じテナントの SharePoint Teams サイトの **Documents** ライブラリにアップロードします。

- サイト コレクションの URL 例: `https://xyz.sharepoint.com/sites/contoso/`
- ドキュメント ライブラリ名 例: `Shared documents`
- ファイル名 例: `Sample-list-of-candidates.xlsx`

Copilot Studio に戻りツールを設定します。
以下を使用します:

- Name: List HR candidates
- Description: List candidates for an HR role

ツール編集ダイアログで **Tool name** をわかりやすい名前に変更し、Inputs タブで入力引数を設定します。既定では必須の入力引数は **Identify as** が `User's entire response` になっています。

![The tab to configure the input arguments of the action. There is a list of arguments with specific settings for each of them.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-02.png)

各入力引数の **How will the agent fill this input?** を `Set as a value` に変更し、静的値を設定します。設定変更を確認後、すべての入力引数に静的値を入力します。

![The configuration of the **Location** input argument where the source for the value is a static value manually configured.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-07.png)

静的値は次のとおりです。

- Location: Excel を保存した SharePoint Online サイトの URL 例: `https://xyz.sharepoint.com/sites/contoso/`
- Document Library: ドキュメント ライブラリ名 例: `Shared Documents`
- File: Excel ファイル名 例: `Sample-list-of-candidates.xlsx`
- Table: `Candidates_Table`

![The list of input arguments configured accordingly to the suggested settings. Every input argument is configured with a manually provided value.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-08.png)

画面右上の **Save** ボタンを選択してツールを保存します。

<cc-end-step lab="mcs4" exercise="2" step="1" />

### Step 2: 新しいツールのテスト

更新したエージェントを公開し、統合テスト パネルまたは Microsoft Teams で試してみましょう。
再度 **Publish** ボタンを選択し、公開が完了するまで待ちます。その後、エージェントの直接リンクを再度開くと **Add** の代わりに **Update now** が表示されます。**Update now** を選択して更新し、Microsoft 365 Copilot Chat をリフレッシュしてエージェントと対話します。

次のプロンプト例で作成したツールを簡単に呼び出せます。

```txt
Show me the list of candidates for HR with role "HR Director" or "HR Manager"
```

Microsoft 365 Copilot Chat は外部 API (Excel Online) へのアクセス許可を求めてきますので、**Allow once** を選択してテストします。

![Microsoft 365 Copilot Chat asking consent to consume the external API for Excel Online. There are three command buttons to **Always allow**, **Allow once**, and **Cancel**.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-03.png)

Power Platform コネクタには接続が必要なため、エージェントは **Sign in to Agentic HR** でサインインを促します。 

![Microsoft 365 Copilot Chat asking to sign in to consume the external Excel Online API.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-04.png)

コネクタに接続し、再度プロンプトを実行すると、エージェントが Excel スプレッドシートから取得した条件に一致する候補者一覧を返します。

![Microsoft 365 Copilot Chat asking to sign in to consume the external Excel Online API.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-05.png)

お疲れさまでした! Copilot Studio で作成した Microsoft 365 Copilot エージェントから外部コネクタを利用できました。

<cc-end-step lab="mcs4" exercise="2" step="2" />

---8<--- "ja/mcs-congratulations.md"

<a href="../05-connectors">ここから開始</a>して Lab MCS5 で Copilot Studio のカスタム コネクタ利用方法を学習しましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/04-extending-m365-copilot--ja" />