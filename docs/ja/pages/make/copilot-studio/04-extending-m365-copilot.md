---
search:
  exclude: true
---
# ラボ MCS4 - Microsoft 365 Copilot の拡張

このラボでは、Microsoft Copilot Studio で作成した宣言型のエージェントを使用して、Microsoft 365 Copilot Chat を拡張する方法を学習します。これまでに、Copilot Studio でエージェントを作成し、それを Microsoft Teams で利用する方法を確認しました。また、Copilot Studio で作成したエージェントは、**Teams と Microsoft 365 Copilot** チャンネルのオプションを通じて、Microsoft Teams と Microsoft 365 Copilot Chat の両方を対象にできることもご覧いただきました。今回のラボでは、Microsoft 365 Copilot Chat 用の宣言型エージェントを作成します。

本ラボで学習する内容:

- Microsoft 365 Copilot Chat 用の宣言型エージェントの作成方法
- エージェントのカスタムアイコンの設定方法
- エージェントのナレッジソースの設定方法
- エージェントを Microsoft 365 Copilot Chat に発行する方法
- Microsoft 365 Copilot Chat 用ツールの作成方法

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/JUctt1s5oj0" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を素早く確認しましょう。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

## Exercise 1 : Microsoft 365 Copilot Chat 用エージェントの作成

この演習では、Microsoft Copilot Studio で宣言型エージェントを作成し、Microsoft 365 Copilot Chat にホストします。

### Step 1: Copilot Chat 用エージェントの作成

Microsoft 365 Copilot Chat 用の宣言型エージェントを作成するには、まず 1️⃣ Copilot Studio でエージェントの一覧を表示し、2️⃣ **Microsoft 365 Copilot** という名前のエージェントを選択します。

![The interface of Microsoft Copilot Studio when browsing the whole list of agents and selecting the **Microsoft 365 Copilot** agent.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-01.png)

Copilot Studio の新しいセクションが開きます。そこで **+ Add** コマンドを選択し、Microsoft 365 Copilot Chat 用の新しいエージェントを作成します。

![The interface of Microsoft Copilot Studio editing Microsoft 365 Copilot agents. The **+ Add** button is highlighted. There is also a list of pre-defined tools.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-02.png)

Copilot Studio はエージェントの目的を自然言語で説明するよう求めます。[Lab MCS1](../01-first-agent){target=_blank} と同様に、次のようなプロンプトでエージェントの要件を自然言語で定義できます。

```txt
You are an agent helping employees to find information about HR policies and procedures,
about how to improve their career, and about how to define learning pathways.
```

Copilot Studio に名前を尋ねられたら、カスタムエージェントに「Agentic HR」と入力します。その後、次の指示で特定のタスクや目標を設定します。

```txt
Emphasize everything that helps team building, inclusion, and the growth mindset
```

さらに、エージェントのトーンをプロフェッショナルに設定するため、以下を入力します。

```txt
It should have a professional tone
```

![The interface of Microsoft Copilot Studio when defining the agent using natural language.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-03.png)

エージェントの記述が完了したら **Create** コマンドを選択してエージェントを作成します。あるいは **Skip to configure** を選択して従来の設定画面に進むことも可能です。

エージェントが作成されると、設定ページが表示され、次の項目を定義できます。

- Details: エージェントの名前、アイコン、説明、システムプロンプトなどの一般情報  
- Knowledge: エージェント用ナレッジベースの定義  
- Tools: エージェント用カスタムツールの定義  
- Additional settings: 公開 Web コンテンツを利用するかどうかの設定  
- Starter prompts: 新しいチャット開始時に最大 6 件表示されるスタータープロンプトの設定  
- Publishing details: 発行後の利用方法に関する情報  

![The configuration page of an agent for Microsoft 365 Copilot Chat in Microsoft Copilot Studio. There are sections to define general details, knowledge bases, tools, additional settings, starter prompts, and publishing details.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-04.png)

画面右側にはエージェントのプレビューが表示され、動作をテストできます。  
初期設定が整ったので、次の手順で詳細を調整しましょう。

<cc-end-step lab="mcs4" exercise="1" step="1" />

### Step 2: エージェントのアイコンを更新する

**Details** セクション右上の **Edit** コマンドを選択して詳細を編集します。編集モードで **Change icon** を選択し、カスタムアイコンをアップロードして背景色を設定します。必要に応じて、[こちらのリンク](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/HR-agent-color.png?raw=true){target=_blank} からアイコンを取得できます。推奨アイコンを使用する場合、背景色は #B9BAB5 がおすすめです。

![The configuration page while editing the details of the agent and specifically updading the icon of the agent.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-05.png)

**Save** を選択してアイコンと背景色を保存し、もう一度 **Save** をクリックしてエージェントの詳細を更新します。

<cc-end-step lab="mcs4" exercise="1" step="2" />

### Step 3: ナレッジベースの追加

[Lab MCS1](../01-first-agent){target=_blank} と同様に、[このリンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} から複数ファイル（Word、PowerPoint、PDF）が入った zip をダウンロードしてください。

zip を展開し、同じテナントの SharePoint Teams サイトの **Documents** ライブラリにアップロードします。これらのドキュメントは Microsoft 365 Copilot で生成されたもので、エージェントの追加ナレッジベースとして使用します。

サイトの絶対 URL をコピーします。例: `https://xyz.sharepoint.com/sites/contoso`

ナレッジソースを追加するには、**Knowledge** セクション右上の **+ Add knowledge** を選択します。ダイアログが表示され、データソースを選択できます。執筆時点では **SharePoint** を選択可能です。**SharePoint** を選択し、データソースにしたいサイトを指定します。

![The dialog to configure additional knowledge base for the agent. There is a list of **Featured** knowledge bases, where right now there is only SharePoint. There is a command to browse **Advanced** data source, too.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-06.png)

SharePoint Online サイトの URL を貼り付けるか、**Browse files** でデータソースを検索します。URL またはデータソースを指定したら、ナレッジベースの名前と説明を入力します。説明はユーザーの意図に基づき Copilot がデータソースを利用する際に使用されます。

![The dialog to configure a SharePoint Online data source. There is a command to **Browse files** and a textbox to paste a direct link to a data source. There is also an already selected data source with URL Link, Name, and Description. In the lower part of the dialog there are an **Add** command to save the new data source, a **Cancel** command to cancel the operation, and a **Back** command to go back to the previous stage.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-07.png)

**Add** ボタンを選択し、ナレッジベースにデータソースを追加します。

!!! warning "重要"
    Copilot Studio でエージェントのナレッジベースとして SharePoint Online サイトを構成する場合、ユーザーは自分がアクセス権を持つドキュメントのみ参照できます。セキュリティとアクセス制御は Microsoft 365 のセキュリティ基盤で保証され、Copilot Studio のエージェントは現在のユーザーとしてドキュメントにアクセスします。
    
<cc-end-step lab="mcs4" exercise="1" step="3" />

### Step 4: エージェントを Microsoft 365 Copilot Chat に発行する

エージェントを公開して Microsoft 365 Copilot Chat でテストしましょう。1️⃣ 画面右上の **Publish** を選択し、エージェントを Copilot Chat で利用可能にします。次に 2️⃣ 発行ダイアログで詳細を入力し、最後に 3️⃣ ダイアログ下部の **Publish** をクリックします。

![The agent in Copilot Studio with the **Publish** button highlighted and the publishing dialog where there are fields to define, short description, long description, developer name, developer website URL, privacy statement URL, terms of use URL.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-08.png)

入力する内容は Microsoft 365 アプリ マニフェストに必要な情報です。

- Short description: 短い説明（30 文字以内）
- Long description: 詳細説明（100 文字以内）
- Developer name: 開発者名（32 文字以内）
- Website: 開発者サイト URL（2048 文字以内）
- Privacy statement: プライバシーに関する声明 URL（2048 文字以内）
- Terms of use: 利用規約 URL（2048 文字以内）

初回の公開には 30～60 秒ほどかかります。公開が完了すると、利用方法の概要を示すダイアログが表示されます。

![The dialog confirming the successful publishing and providing a command to copy a direct link to the agent app, two commands to share the agent with selected group of people or with the whole organization, and a command to download a ZIP package to publish the agent in the store.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-09.png)

具体的には次の操作が可能です。

- **Copy**: エージェント アプリへの直接リンクをコピー  
- **Show to my teammates and shared users**: 選択したユーザーやグループと共有  
- **Show to everyone in my org**: 組織全体と共有  
- **Download .zip file**: ストア公開用の zip パッケージをダウンロード  

!!! note "Show to everyone in my org"
    組織全体への公開を選択する場合、エージェントがリリース準備完了かつ社内の基準、規則、ポリシーに準拠していることを確認してください。チームメイトと調整しましょう。一度提出すると、管理者が承認または拒否するまで他の人は再提出できません。詳細は [Show to the organization](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams#show-to-the-organization){target=_blank} を参照してください。

**Copy** を選択し、新しいブラウザー タブを開いて URL を貼り付けます。  
ブラウザーに社内アプリ ストアが表示され、**Add** ボタンでエージェントを Microsoft 365 Copilot に追加できます。

![The company store with the agent dialog allowing to add the agent to Microsoft 365 Copilot.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-10.png)

エージェントを追加すると、Copilot チャット右側のエージェント一覧に表示されます。

![The "Agentic HR" agent in Microsoft 365 Copilot Chat.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-11.png)

エージェントを選択して対話を開始します。たとえば次のプロンプトを入力してみましょう。

```txt
How can we hire new people in our company?
```

エージェントはナレッジベースのドキュメント `Hiring Procedures.docx` などを参照し、採用手順を詳しく説明します。

![The "Agentic HR" agent in action in Microsoft 365 Copilot Chat, answering a prompt about the hiring procedures and providing a reference to a Word document stored in the SharePoint Online knowledge base of the agent.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-12.png)

<cc-end-step lab="mcs4" exercise="1" step="4" />

## Exercise 2 : エージェントへのツール追加

この演習では、前の演習で作成したエージェントにカスタムツールを追加します。Copilot Studio で Microsoft 365 Copilot Chat 用エージェントを作成する場合、追加できるツールの種類は 4 つあります。

- Prompt: 自然言語プロンプトで作成した AI ツールを利用  
- Custom connector: Power Platform のカスタムコネクタを利用  
- REST API: 外部 REST API を利用。詳細は [こちら](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api){target=_blank}  
- Model Context Protocol: MCP サーバーとそのツールを利用  

!!! information "エージェント用ツール"
    Copilot Studio でエージェントにツールを追加する方法は [Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-plugin-actions){target=_blank} を参照してください。

本ラボでは、SharePoint Online に保存された Excel スプレッドシートから候補者の一覧を取得するため、`Custom connector` タイプのツールを追加します。

### Step 1: Microsoft 365 Copilot 用エージェントにツールを追加する

ツールを追加するには、エージェント設定パネルの **Tools** セクションで **+ Add tool** を選択します。

![The **Tools** section of an agent with the **+ Add tool** command highlighted.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-01.png)

ダイアログが開き、作成するツールの種類を選択できます。デフォルトで **Featured** ツールが表示され、Excel Online など一般的なサービスと連携できます。**+ New tool** を選択すると、前述のオプションから新しいツールを作成できます。

目的の項目が見つからない場合は **All** グループに切り替え、テキスト検索してください。

今回は **Excel Online (Business)** の **List rows present in a table** を選択します。まず **Connection** を選択し **Create new connection** でコネクションを作成します。

![The dialog to connect to the target Power Platform connector with details about the connection, if any, or a button to create a new connection. There is also a back button to start over.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03.png)

アカウントでサインインし、Excel Online (Business) へのアクセスを許可します。コネクションが構成されると **Add to agent** または **Add and configure** のコマンドが表示されます。

![The dialog to add the actual tool to the agent. There are commands to **Add to agent** or **Add and configure** the tool. There is also a back button to start over.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03b.png)

ツールを追加すると、Copilot Studio のツール一覧に表示されます。作成したツールをクリックして設定を編集します。設定パネルで入力する項目は以下のとおりです。

- Name: ツールの説明的な名前  
- Display name: 表示名  
- Description: 自然言語での説明。生成オーケストレーションがツールを使用する際に参照  
- Inputs and outputs: 入出力パラメーターの定義  
- Response settings: ツールのリクエストとレスポンス処理方法  

ツールを構成する前に候補者一覧の Excel ファイルを準備します。サンプルファイルを [こちら](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/Candidates/Sample-list-of-candidates.xlsx?raw=true){target=_blank} からダウンロードしてください。

同じテナントの SharePoint Teams サイト **Documents** ライブラリにアップロードします。これは仮想の候補者一覧です。

- サイト コレクションの絶対 URL をコピー例: `https://xyz.sharepoint.com/sites/contoso/`
- ドキュメント ライブラリ名をコピー例: `Shared documents`
- ファイル名もコピー例: `Sample-list-of-candidates.xlsx`

Copilot Studio に戻り、ツール設定を完了します。設定例:

- Name: List HR candidates  
- Description: List candidates for an HR role  

ツール編集ダイアログで **Tool name** をよりわかりやすい名前に変更します。その後 Inputs タブで入力引数を設定します。既定では必須入力が **Identify as** プロパティで User's entire response から抽出されるよう設定されています。

![The tab to configure the input arguments of the action. There is a list of arguments with specific settings for each of them.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-02.png)

各入力引数の **How will the agent fill this input?** を `Set as a value` に変更し、静的値を設定します。変更確認後、それぞれの入力引数に静的値を入力します。

![The configuration of the **Location** input argument where the source for the value is a static value manually configured.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-07.png)

静的値は以下を使用してください。

- Location: Excel ファイルを保存した SharePoint Online サイトの URL 例: `https://xyz.sharepoint.com/sites/contoso/`
- Document Library: ライブラリ名 例: `Shared Documents`
- File: Excel ファイル名 例: `Sample-list-of-candidates.xlsx`
- Table: `Candidates_Table`

![The list of input arguments configured accordingly to the suggested settings. Every input argument is configured with a manually provided value.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-08.png)

画面右上の **Save** を選択し、ツール設定を保存します。

<cc-end-step lab="mcs4" exercise="2" step="1" />

### Step 2: 新しいツールのテスト

更新したエージェントを発行し、統合テストパネルまたは Microsoft Teams で試しましょう。再度 **Publish** を選択し、発行が完了するまで待ちます。直接リンクを開くと **Add** の代わりに **Update now** が表示されるので選択します。準備ができたら Microsoft 365 Copilot Chat を更新し、エージェントと対話を開始します。

次のようなプロンプトで先ほど作成したツールを簡単に呼び出せます。

```txt
Show me the list of candidates for HR with role "HR Director" or "HR Manager"
```

Microsoft 365 Copilot Chat は外部 API (Excel Online) の使用許可を求めるので、**Always allow** または **Allow once** を選択します。テスト目的で **Allow once** を推奨します。

![Microsoft 365 Copilot Chat asking consent to consume the external API for Excel Online. There are three command buttons to **Always allow**, **Allow once**, and **Cancel**.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-03.png)

Power Platform コネクタは有効な接続が必要なため、エージェントはユーザーに **Sign in to Agentic HR** を促します。

![Microsoft 365 Copilot Chat asking to sign in to consume the external Excel Online API.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-04.png)

外部コネクタへ接続し、再度プロンプトを実行すると、エージェントは Excel スプレッドシートから基準に合致する候補者リストを返します。

![Microsoft 365 Copilot Chat asking to sign in to consume the external Excel Online API.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-05.png)

お疲れさまでした! Copilot Studio で作成した Microsoft 365 Copilot 用エージェントから外部コネクタを利用できました。

<cc-end-step lab="mcs4" exercise="2" step="2" />

---8<--- "ja/mcs-congratulations.md"

<a href="../05-connectors">こちらから開始</a>して Lab MCS5 に進み、Copilot Studio でカスタムコネクタを利用する方法を学びましょう。  
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/04-extending-m365-copilot--ja" />