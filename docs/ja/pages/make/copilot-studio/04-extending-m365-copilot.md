---
search:
  exclude: true
---
# ラボ MCS4 - Microsoft 365 Copilot の拡張

このラボでは、Microsoft Copilot Studio を使用して作成した宣言型 エージェント で Microsoft 365 Copilot Chat を拡張する方法を学習します。これまでに Copilot Studio で エージェント を作成し、それを Microsoft Teams で利用する方法を確認してきました。また、Microsoft Copilot Studio で作成した エージェント は、**Teams and Microsoft 365 Copilot** チャネルのオプションを通じて Microsoft Teams と Microsoft 365 Copilot Chat の両方を対象にできることも学びました。今回のラボでは、Microsoft 365 Copilot Chat 用の宣言型 エージェント に取り組みます。

このラボで学習できる内容:

- Microsoft 365 Copilot Chat 用宣言型 エージェント の作成方法  
- エージェント のカスタムアイコンの設定方法  
- エージェント のナレッジ ソースの設定方法  
- エージェント を Microsoft 365 Copilot Chat で公開する方法  
- Microsoft 365 Copilot Chat 用ツールの作成方法  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/JUctt1s5oj0" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要をご覧ください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

## 演習 1 : Microsoft 365 Copilot Chat 用 エージェント の作成

この演習では、Microsoft Copilot Studio で宣言型 エージェント を作成し、それを Microsoft 365 Copilot Chat でホストします。

### 手順 1: Copilot Chat 用 エージェント の作成

Microsoft 365 Copilot Chat 用の宣言型 エージェント を作成するには、1️⃣ Copilot Studio で エージェント の一覧を開き、2️⃣ **Microsoft 365 Copilot** という名前の エージェント を選択します。

![The interface of Microsoft Copilot Studio when browsing the whole list of agents and selecting the **Microsoft 365 Copilot** agent.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-01.png)

Microsoft Copilot Studio の新しいセクションが開きます。そこから **+ Add** コマンドを選択して、Microsoft 365 Copilot Chat 用の新しい エージェント を作成します。

![The interface of Microsoft Copilot Studio editing Microsoft 365 Copilot agents. The **+ Add** button is highlighted. There is also a list of pre-defined tools.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-02.png)

Copilot Studio では、自然言語で エージェント の目的を説明するよう求められます。[ラボ MCS1](../01-first-agent){target=_blank} と同様に、次のようなプロンプトを使って自然言語で要件を定義できます。

```txt
You are an agent helping employees to find information about HR policies and procedures,
about how to improve their career, and about how to define learning pathways.
```

Copilot Studio から名前を尋ねられたら、カスタム エージェント に「Agentic HR」と入力します。その後、次の指示を与えて特定のタスクやゴールを設定します。

```txt
Emphasize everything that helps team building, inclusion, and the growth mindset
```

続いて、次の入力を提供して エージェント のトーンを「プロフェッショナル」に設定します。

```txt
It should have a professional tone
```

![The interface of Microsoft Copilot Studio when defining the agent using natural language.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-03.png)

エージェント の説明が終わったら **Create** コマンドを選択して実際に エージェント を作成します。あるいは **Skip to configure** コマンドを選択して従来の設定 UI に移動してもかまいません。

エージェント が作成されると、その設定ページが表示され、以下を定義できます。

- 詳細: 名前、アイコン、説明、instructions (システムプロンプト) などの一般情報  
- Knowledge: エージェント のナレッジ ベース  
- Tools: エージェント のカスタムツール  
- 追加設定: 公開 Web コンテンツを利用するかどうか  
- スタータープロンプト: 新しいチャット開始時に Copilot Chat に最大 6 件表示されるプロンプト  
- 公開情報: エージェント を公開した後の利用方法に関する情報  

![The configuration page of an agent for Microsoft 365 Copilot Chat in Microsoft Copilot Studio. There are sections to define general details, knowledge bases, tools, additional settings, starter prompts, and publishing details.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-04.png)

画面右側には、すぐに エージェント をテストできるプレビューも表示されます。  
これでエージェントの初期設定は完了です。次のステップで設定を微調整しましょう。

<cc-end-step lab="mcs4" exercise="1" step="1" />

### 手順 2: エージェント のアイコンを更新

**Details** セクション右上の **Edit** コマンドを選択して詳細を編集します。  
編集モードで **Change icon** コマンドを選択し、カスタムアイコンをアップロードして背景色を設定します。  
次のアイコンを使用する場合は [こちらのリンク](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/HR-agent-color.png?raw=true){target=_blank} を参照してください。推奨アイコンを使う場合、背景色は `#B9BAB5` が適しています。

![The configuration page while editing the details of the agent and specifically updading the icon of the agent.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-05.png)

**Save** を選択して新しいアイコンと背景色を保存し、もう一度 **Save** を選択して エージェント の詳細を更新します。

<cc-end-step lab="mcs4" exercise="1" step="2" />

### 手順 3: ナレッジ ベースを追加

[ラボ MCS1](../01-first-agent){target=_blank} と同様に、次の [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} から複数ファイル (Word、PowerPoint、PDF) の zip をダウンロードします。

zip を展開し、同じテナントの SharePoint Teams サイトの **Documents** ライブラリにアップロードします。これらのドキュメントは、エージェント に追加のナレッジ ベースを提供する目的で Microsoft 365 Copilot によって生成されました。

サイトの絶対 URL をコピーします。例: `https://xyz.sharepoint.com/sites/contoso`

ナレッジ ソースを追加するには、**Knowledge** セクション右上の **+ Add knowledge** コマンドを選択します。ダイアログが表示され、データ ソースを選択できます。執筆時点では **SharePoint** データ ソースを選択可能です。**SharePoint** を選択し、使用するサイトを指定します。

![The dialog to configure additional knowledge base for the agent. There is a list of **Featured** knowledge bases, where right now there is only SharePoint. There is a command to browse **Advanced** data source, too.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-06.png)

SharePoint Online サイトの URL を貼り付けるか、**Browse files** コマンドでサイトを検索します。URL またはデータ ソースを選択したら、ナレッジ ベースの名前とわかりやすい説明を入力します。説明は Copilot がユーザーの意図に応じてデータ ソースを利用する際に参照されます。

![The dialog to configure a SharePoint Online data source. There is a command to **Browse files** and a textbox to paste a direct link to a data source. There is also an already selected data source with URL Link, Name, and Description. In the lower part of the dialog there are an **Add** command to save the new data source, a **Cancel** command to cancel the operation, and a **Back** command to go back to the previous stage.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-07.png)

**Add** を選択して、ナレッジ ベースに新しいデータ ソースを追加します。

!!! warning "重要"
    Copilot Studio で SharePoint Online サイトをナレッジ ベースとして構成する場合、ユーザーはアクセス権を持つドキュメントのみ参照できます。セキュリティとアクセス制御は Microsoft 365 のインフラで保証され、Copilot Studio エージェント は現在のユーザーとしてドキュメントにアクセスします。
    
<cc-end-step lab="mcs4" exercise="1" step="3" />

### 手順 4: エージェント を Microsoft 365 Copilot Chat に公開

エージェント を公開して Microsoft 365 Copilot Chat でテストしましょう。1️⃣ 画面右上の **Publish** コマンドを選択し、2️⃣ エージェント の詳細を入力、3️⃣ ダイアログ下部の **Publish** コマンドを選択します。

![The agent in Copilot Studio with the **Publish** button highlighted and the publishing dialog where there are fields to define, short description, long description, developer name, developer website URL, privacy statement URL, terms of use URL.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-08.png)

エージェント の詳細は Microsoft 365 アプリ マニフェストで必須の項目です。

- Short description: 30 文字以内  
- Long description: 100 文字以内  
- Developer name: 32 文字以内  
- Website: 開発者サイトの URL  
- Privacy statement: プライバシー ステートメントの URL  
- Terms of use: 利用規約の URL  

初回公開には 30 ～ 60 秒程度かかります。公開が完了すると、利用方法をまとめたダイアログが表示されます。

![The dialog confirming the successful publishing and providing a command to copy a direct link to the agent app, two commands to share the agent with selected group of people or with the whole organization, and a command to download a ZIP package to publish the agent in the store.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-09.png)

具体的には次の操作が可能です。

- **Copy**: 新しいアプリへの直接リンク URL をコピー  
- **Show to my teammates and shared users**: 特定のグループや個人と共有  
- **Show to everyone in my org**: 組織全体と共有  
- **Download .zip file**: アプリの zip パッケージをダウンロードし Microsoft 365 ストアへアップロード  

!!! note "Show to everyone in my org"
    組織全体に公開する場合、エージェント がリリース準備完了であり、社内の基準やポリシーに準拠していることを確認してください。チームメイトと調整のうえ提出してください。一度提出すると、管理者が承認または却下するまで他の人は再提出できません。詳細は [Show to the organization](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams#show-to-the-organization){target=_blank} を参照してください。

**Copy** を選択して URL をコピーし、新しいブラウザー タブに貼り付けます。  
企業アプリ ストアが表示され、**Add** ボタンを選択して エージェント を Microsoft 365 Copilot に追加できます。

![The company store with the agent dialog allowing to add the agent to Microsoft 365 Copilot.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-10.png)

エージェント を追加すると、Copilot Chat 右側の エージェント 一覧に表示されます。

![The "Agentic HR" agent in Microsoft 365 Copilot Chat.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-11.png)

エージェント を選択して対話を開始します。たとえば、次のプロンプトを入力してください。

```txt
How can we hire new people in our company?
```

エージェント はナレッジ ベースのドキュメント `Hiring Procedures.docx` から取得した情報に基づき、採用手順に関する詳細を提供します。

![The "Agentic HR" agent in action in Microsoft 365 Copilot Chat, answering a prompt about the hiring procedures and providing a reference to a Word document stored in the SharePoint Online knowledge base of the agent.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-12.png)

<cc-end-step lab="mcs4" exercise="1" step="4" />

## 演習 2 : エージェント にツールを追加

この演習では、前の演習で作成した エージェント にカスタムツールを追加します。Microsoft Copilot Studio で Microsoft 365 Copilot Chat 用 エージェント を作成する際、以下 4 種類のツールを追加できます。

- Prompt: 自然言語のプロンプトで作成した AI ツールを利用  
- Custom connector: Power Platform のカスタム コネクタを利用  
- REST API: 外部 REST API を利用。詳細は [こちら](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api){target=_blank}  
- Model Context Protocol: MCP サーバーとそのツールを利用  

!!! information "Tools for agents"
    Copilot Studio でのツール追加については [Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-plugin-actions){target=_blank} をご覧ください。

このラボでは `Custom connector` タイプのツールを追加し、SharePoint Online に保存された Excel スプレッドシートから候補者リストを取得します。

### 手順 1: Microsoft 365 Copilot 用 エージェント にツールを追加

**Tools** セクションの **+ Add tool** コマンドを選択します。

![The **Tools** section of an agent with the **+ Add tool** command highlighted.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-01.png)

ダイアログが表示され、ツールの種類を選択できます。デフォルトでは **Featured** ツールとして Excel Online などが表示されます。**+ New tool** を選択すれば、前述のオプションから新しいツールを作成することも可能です。

目的のツールが見つからない場合は **All** グループに切り替え、検索してください。

今回は **Excel Online (Business)** の **List rows present in a table** を選択します。まず **Connection** で **Create new connection** を選択し、接続を作成します。

![The dialog to connect to the target Power Platform connector with details about the connection, if any, or a button to create a new connection. There is also a back button to start over.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03.png)

自分のアカウントでログインし、Excel Online (Business) へのアクセスを許可します。接続が完了すると **Add to agent** または **Add and configure** の選択肢が表示されます。

![The dialog to add the actual tool to the agent. There are commands to **Add to agent** or **Add and configure** the tool. There is also a back button to start over.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03b.png)

ツールを追加するとツールの一覧が表示されます。作成したツールをクリックして設定を編集します。設定パネルでは以下を入力します。

- Name: ツールの説明的な名前  
- Display name: 表示名  
- Description: 自然言語による説明 (ツールを使用するかどうかを判断する際に生成オーケストレーションが参照)  
- Inputs と outputs: 入出力パラメーター  
- Response settings: リクエストとユーザーへの応答の扱い  

設定前に候補者一覧の Excel ファイルを準備します。以下の [リンク](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/Candidates/Sample-list-of-candidates.xlsx?raw=true){target=_blank} からサンプル Excel をダウンロードしてください。

同じテナントの SharePoint Teams サイトの **Documents** ライブラリにアップロードします。  
- サイト コレクションの絶対 URL (例: `https://xyz.sharepoint.com/sites/contoso/`)  
- ドキュメント ライブラリ名 (例: `Shared documents`)  
- ファイル名 (例: `Sample-list-of-candidates.xlsx`)  
を控えておきます。

Copilot Studio に戻り、ツール設定を完了します。以下の設定を使用してください。

- Name: List HR candidates  
- Description: List candidates for an HR role  

ツール編集ダイアログで **Tool name** をわかりやすい名前に変更し、Inputs タブで入力引数を設定します。デフォルトでは必須入力が **Identify as** によりユーザーの応答全体から抽出されるよう設定されています。

![The tab to configure the input arguments of the action. There is a list of arguments with specific settings for each of them.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-02.png)

各入力引数の **How will the agent fill this input?** を `Set as a value` に切り替え、すべての入力引数に静的値を設定します。確認メッセージに同意し、各引数を設定してください。

![The configuration of the **Location** input argument where the source for the value is a static value manually configured.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-07.png)

設定する静的値:

- Location: Excel スプレッドシートを置いた SharePoint Online サイトの URL (例: `https://xyz.sharepoint.com/sites/contoso/`)  
- Document Library: ドキュメント ライブラリ名 (例: `Shared Documents`)  
- File: Excel ファイル名 (例: `Sample-list-of-candidates.xlsx`)  
- Table: `Candidates_Table`  

![The list of input arguments configured accordingly to the suggested settings. Every input argument is configured with a manually provided value.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-08.png)

画面右上の **Save** を選択してツールを保存します。

<cc-end-step lab="mcs4" exercise="2" step="1" />

### 手順 2: 新しいツールのテスト

更新した エージェント を公開し、統合テスト パネルまたは Microsoft Teams で試します。  
再度 **Publish** ボタンを押して公開を更新し、完了を待ちます。  
エージェント の直接リンクを開くと **Add** の代わりに **Update now** が表示されるので選択し、完了後に Microsoft 365 Copilot Chat を再読み込みして エージェント と対話します。

次のプロンプトで作成したツールを簡単に呼び出せます。

```txt
Show me the list of candidates for HR with role "HR Director" or "HR Manager"
```

Microsoft 365 Copilot Chat は外部 API (Excel Online) の使用許可を求めるので、**Allow once** を選択してください (テスト用)。

![Microsoft 365 Copilot Chat asking consent to consume the external API for Excel Online. There are three command buttons to **Always allow**, **Allow once**, and **Cancel**.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-03.png)

Power Platform コネクタは有効な接続が必要なため、エージェント はユーザーに **Sign in to Agentic HR** を求めます。

![Microsoft 365 Copilot Chat asking to sign in to consume the external Excel Online API.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-04.png)

外部コネクタに接続し、再度プロンプトを実行すると、エージェント が Excel スプレッドシートから取得した候補者リストを返してくれます。

![Microsoft 365 Copilot Chat asking to sign in to consume the external Excel Online API.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-05.png)

お疲れさまでした! Copilot Studio で作成した Microsoft 365 Copilot 用 エージェント から外部コネクタを利用できました。

<cc-end-step lab="mcs4" exercise="2" step="2" />

---8<--- "ja/mcs-congratulations.md"

<a href="../05-connectors">こちらから</a> ラボ MCS5 を開始し、Copilot Studio でカスタム コネクタを使用する方法を学びましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/04-extending-m365-copilot" />