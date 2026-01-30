---
search:
  exclude: true
---
# ラボ MCS4 - Microsoft 365 Copilot の拡張

このラボでは、Microsoft Copilot Studio で作成した 宣言型 エージェントを使用して Microsoft 365 Copilot Chat を拡張する方法を学習します。これまでに、Copilot Studio で エージェント を作成し、それを Microsoft Teams で利用する方法を確認しました。また、Microsoft Copilot Studio で作成した エージェント は、**Teams and Microsoft 365 Copilot** チャネルで利用できるオプションを通じて、Microsoft Teams と Microsoft 365 Copilot Chat の両方を対象にできることもご覧いただきました。今回のラボでは、Microsoft 365 Copilot Chat 向けの 宣言型 エージェント に取り組みます。

このラボで学習する内容:

- Microsoft 365 Copilot Chat 用の 宣言型 エージェント の作成方法
- エージェント のカスタム アイコンの設定方法
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

## 演習 1 : Microsoft 365 Copilot Chat 用エージェントの作成

この演習では、Microsoft Copilot Studio で 宣言型 エージェント を作成し、それを Microsoft 365 Copilot Chat でホストします。

### 手順 1: Copilot Chat 用エージェントの作成

Microsoft 365 Copilot Chat 用の 宣言型 エージェント を作成するには、まず 1️⃣ Copilot Studio でエージェントの一覧を参照し、2️⃣ **Microsoft 365 Copilot** という名前のエージェントを選択します。

![The interface of Microsoft Copilot Studio when browsing the whole list of agents and selecting the **Microsoft 365 Copilot** agent.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-01.png)

Microsoft Copilot Studio の新しいセクションが開きます。そこで **+ Add** コマンドを選択し、Microsoft 365 Copilot Chat 用の新しい エージェント を作成します。

![The interface of Microsoft Copilot Studio editing Microsoft 365 Copilot agents. The **+ Add** button is highlighted. There is also a list of pre-defined tools.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-02.png)

Copilot Studio から、エージェント の目的を自然言語で説明するよう求められます。[Lab MCS1](../01-first-agent){target=_blank} と同様に、以下のようなプロンプトを使って自然言語で要件を定義できます。

```txt
You are an agent helping employees to find information about HR policies and procedures,
about how to improve their career, and about how to define learning pathways.
```

Copilot Studio から名前を尋ねられたら、カスタム エージェント に「Agentic HR」と入力してください。その後、Copilot Studio に具体的なタスクや目標を指示するため、次の指示を与えます。

```txt
Emphasize everything that helps team building, inclusion, and the growth mindset
```

さらに、次の入力を使用してエージェントのトーンを「プロフェッショナル」に設定します。

```txt
It should have a professional tone
```

![The interface of Microsoft Copilot Studio when defining the agent using natural language.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-03.png)

エージェント の説明が完了したら **Create** コマンドを選択して実際に作成します。あるいは **Skip to configure** コマンドを選択して従来の設定画面に進むこともできます。

エージェント が作成されると、設定ページが表示されます。ここでは次の項目を定義できます。

- 詳細: 名前、アイコン、説明、指示 (システムプロンプト) など、エージェント の一般情報
- ナレッジ: エージェント の各種ナレッジ ベース
- ツール: エージェント 用のカスタムツール
- 追加設定: パブリック Web コンテンツを利用するかどうか
- 推奨プロンプト: 新しいチャット開始時に Copilot Chat に表示される最大 6 件の推奨プロンプト
- 公開の詳細: 公開後にエージェント を利用する方法

![The configuration page of an agent for Microsoft 365 Copilot Chat in Microsoft Copilot Studio. There are sections to define general details, knowledge bases, tools, additional settings, starter prompts, and publishing details.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-04.png)

画面右側には、エージェント のプレビューが表示され、動作をテストできます。
これでエージェントの初期セットアップは完了です。次の手順で詳細設定を行いましょう。

<cc-end-step lab="mcs4" exercise="1" step="1" />

### 手順 2: エージェント アイコンの更新

**Details** セクション右上の **Edit** コマンドを選択して詳細を編集します。
編集モードになったら **Change icon** コマンドを選択し、カスタム アイコンをアップロードして背景色を設定します。
必要に応じて、[こちらのリンク](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/HR-agent-color.png?raw=true){target=_blank} で提供されているアイコンを使用できます。その場合、背景色は #B9BAB5 が適切です。

![The configuration page while editing the details of the agent and specifically updading the icon of the agent.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-05.png)

新しいアイコンと背景色を設定したら **Save** を選択し、その後もう一度 **Save** を選択して詳細を保存します。

<cc-end-step lab="mcs4" exercise="1" step="2" />

### 手順 3: ナレッジ ベースの追加

[Lab MCS1](../01-first-agent){target=_blank} と同様に、(Word、PowerPoint、PDF) が含まれる ZIP ファイルを [こちらのリンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} からダウンロードしてください。

ZIP を解凍し、同じテナント内の SharePoint Teams サイトの **Documents** ライブラリにアップロードします。これらのドキュメントは、エージェント に追加のナレッジ ベースを提供するために Microsoft 365 Copilot で生成されました。

サイトの絶対 URL をコピーします。例: `https://xyz.sharepoint.com/sites/contoso`

ナレッジ ソースを追加するには、**Knowledge** セクション右上の **+ Add knowledge** コマンドを選択します。ダイアログが表示され、データ ソースを選択できます。執筆時点では **SharePoint** のみ利用可能です。**SharePoint** を選択し、データ ソースとするサイトを参照します。

![The dialog to configure additional knowledge base for the agent. There is a list of **Featured** knowledge bases, where right now there is only SharePoint. There is a command to browse **Advanced** data source, too.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-06.png)

SharePoint Online サイトの URL をダイアログに貼り付けるか、**Browse files** コマンドを使用してサイトを参照します。URL またはデータ ソースを指定したら、そのナレッジ ベースの名前とわかりやすい説明を入力します。この説明は、ユーザーのプロンプトに基づいて Copilot がデータ ソースを選択する際に使用されます。

![The dialog to configure a SharePoint Online data source. There is a command to **Browse files** and a textbox to paste a direct link to a data source. There is also an already selected data source with URL Link, Name, and Description. In the lower part of the dialog there are an **Add** command to save the new data source, a **Cancel** command to cancel the operation, and a **Back** command to go back to the previous stage.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-07.png)

**Add** ボタンを選択して、ナレッジ ベースにデータ ソースを追加します。

!!! warning "重要"
    Copilot Studio で エージェント のナレッジ ベースとして SharePoint Online サイトを構成すると、ユーザーは自分にアクセス権があるドキュメントのみ参照できます。セキュリティとアクセス制御は Microsoft 365 のセキュリティ基盤によって保証され、Copilot Studio の エージェント は現在のユーザーの代理としてドキュメントにアクセスします。
    
<cc-end-step lab="mcs4" exercise="1" step="3" />

### 手順 4: エージェント を Microsoft 365 Copilot Chat で公開

エージェント を Microsoft 365 Copilot Chat で公開してテストします。まず 1️⃣ 画面右上の **Publish** コマンドを選択して Copilot Chat で利用できるようにします。次に 2️⃣ エージェント の詳細を入力し、最後に 3️⃣ ダイアログ下部の **Publish** を選択します。

![The agent in Copilot Studio with the **Publish** button highlighted and the publishing dialog where there are fields to define, short description, long description, developer name, developer website URL, privacy statement URL, terms of use URL.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-08.png)

エージェント の詳細は Microsoft 365 アプリ マニフェストで必要とされる項目です。

- Short description: エージェント の短い説明 (30 文字以内)
- Long description: エージェント の長い説明 (100 文字以内)
- Developer name: 開発者名 (32 文字以内)
- Website: 開発者サイトの URL (2048 文字以内)
- Privacy statement: プライバシー ステートメントの URL (2048 文字以内)
- Terms of use: 利用規約の URL (2048 文字以内)

初回の公開には 30〜60 秒ほどかかります。公開が完了すると、利用可能なオプションの概要を示すダイアログが表示されます。

![The dialog confirming the successful publishing and providing a command to copy a direct link to the agent app, two commands to share the agent with selected group of people or with the whole organization, and a command to download a ZIP package to publish the agent in the store.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-09.png)

具体的には、次の操作が可能です。

- **Copy**: 新しいエージェント アプリへの直接リンクをコピー
- **Show to my teammates and shared users**: 組織内の特定のグループまたは個人と共有
- **Show to everyone in my org**: 組織全体と共有
- **Download .zip file**: アプリの ZIP パッケージをダウンロードし、Microsoft 365 ストアにアップロード

!!! note "Show to everyone in my org"
    エージェント を組織全体に公開する場合、リリース準備が整い、社内基準・ルール・ポリシーに準拠していることを確認してください。チームメイトと連携し、エージェント を提出した後は管理者が承認または拒否するまで再提出できません。詳細は [Show to the organization](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams#show-to-the-organization){target=_blank} を参照してください。

**Copy** を選択し、新しいブラウザー タブを開いて URL を貼り付けます。
ブラウザーには会社のアプリ ストアが表示され、**Add** ボタンを選択してエージェント を Microsoft 365 Copilot に追加できます。

![The company store with the agent dialog allowing to add the agent to Microsoft 365 Copilot.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-10.png)

エージェント を追加すると、Microsoft 365 Copilot Chat の右側にある エージェント 一覧に表示されます。

![The "Agentic HR" agent in Microsoft 365 Copilot Chat.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-11.png)

エージェント を選択して対話を開始します。たとえば、次のプロンプトを入力できます。

```txt
How can we hire new people in our company?
```

エージェント はナレッジ ベースのドキュメントを基に採用手続きに関する詳細を提供します。たとえば、主な情報源は SharePoint Online にアップロードした `Hiring Procedures.docx` になります。

![The "Agentic HR" agent in action in Microsoft 365 Copilot Chat, answering a prompt about the hiring procedures and providing a reference to a Word document stored in the SharePoint Online knowledge base of the agent.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-12.png)

<cc-end-step lab="mcs4" exercise="1" step="4" />

## 演習 2 : エージェント にツールを追加する

この演習では、前の演習で作成した エージェント にカスタム ツールを追加します。Microsoft Copilot Studio で Microsoft 365 Copilot Chat (宣言型 エージェント) 用の エージェント を作成する際、次の 4 種類のツールを追加できます。

- Prompt: 自然言語で記述したプロンプトを用いて AI ツールを呼び出す
- Custom connector: Power Platform のカスタム コネクタを呼び出す
- REST API: 外部 REST API を呼び出す。詳細は [こちら](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api){target=_blank}

!!! information "エージェント 用ツール"
    Copilot Studio で エージェント にツールを追加する方法の詳細は、[Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-plugin-actions){target=_blank} を参照してください。

このラボでは、SharePoint Online に保存した Excel スプレッドシートから候補者一覧を取得するための `Custom connector` 型ツールを追加します。

### 手順 1: Microsoft 365 Copilot 用エージェントにツールを追加

新しいツールを追加するには、エージェント の設定パネルの **Tools** セクションで **+ Add tool** コマンドを選択します。

![The **Tools** section of an agent with the **+ Add tool** command highlighted.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-01.png)

ダイアログが表示され、作成するツールの種類を選択できます。既定では Excel Online などと連携する **Featured** ツールが表示されます。**+ New tool** を選択して独自に作成することもできます。

目的のツールが Featured にない場合は **All** グループに切り替え、テキスト検索してください。

ここでは **Excel Online (Business)** の **List rows present in a table** を選択します。最初に **Connection** で **Create new connection** を選択し、接続を作成します。

![The dialog to connect to the target Power Platform connector with details about the connection, if any, or a button to create a new connection. There is also a back button to start over.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03.png)

アカウントでサインインし、Excel Online (Business) へのアクセスを許可します。接続が構成されると **Add and configure** コマンドが表示されます。

![The dialog to add the actual tool to the agent. There are commands to **Add and configure** the tool. There is also a back button to start over.](../../../assets/images/make/copilot-studio-04/create-action-excel-connector-03c.png)

ツールを追加すると、Copilot Studio にツール一覧が表示されます。作成したツールをクリックして設定を編集します。設定パネルでは以下を指定します。

- Name: ツールの表示名
- Description: ジェネレーティブ オーケストレーションがツールを使用するタイミングを判断するための自然言語の説明
- Inputs and outputs: アクションの入力・出力パラメーター
- Additional details: リクエストとレスポンスの処理方法
- Completion: ツール使用後に エージェント が実行する内容

ツールを設定する前に候補者一覧の Excel ファイルを準備します。
[こちらのリンク](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/Candidates/Sample-list-of-candidates.xlsx?raw=true){target=_blank} からサンプル Excel をダウンロードしてください。

同じテナントの SharePoint Teams サイト **Documents** ライブラリにアップロードします。このドキュメントは、架空の候補者一覧として Microsoft 365 Copilot で生成されました。

- サイト コレクションの絶対 URL をコピー (例: `https://xyz.sharepoint.com/sites/contoso/`)
- ドキュメント ライブラリ名をコピー (例: `Shared documents`)
- ファイル名をコピー (例: `Sample-list-of-candidates.xlsx`)

Copilot Studio に戻り、ツール設定を完了します。
編集ダイアログで **Name** と **Description** を次のように更新します。

- Name:

```txt
List HR candidates
```

- Description:

```txt
List candidates for an HR role
```

次に **Inputs** セクションで入力パラメーターを設定します。既定では必須入力がすべて `Dynamically fill with AI` に設定されています。

![The section to configure the input arguments of the tool. There is a list of arguments with specific settings for each of them.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-02.png)

各入力パラメーターに明示的な値を設定します。**Location** の **Fill using** を `Custom value` に変更し、ドロップダウンから Excel ファイルを保存したサイト コレクションを選択します。

![The field "Location" configured with a custom value and the dropdown to select the target site collection.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-02b.png)

続けて **Document Library** を `Custom value` に設定し、ライブラリを選択します。**File** を `Custom value` に設定し、Excel ファイルを参照します。最後に **Table** を `Custom value` に設定し、`Candidates_Table` を選択します。設定後の入力パラメーターは次のようになります。

![The list of input arguments configured accordingly to the suggested settings. Every input argument is configured with a manually provided value.](../../../assets/images/make/copilot-studio-04/create-action-excel-connector-08.png)

画面右上の **Save** ボタンを選択してツールを保存します。

<cc-end-step lab="mcs4" exercise="2" step="1" />

### 手順 2: 新しいツールのテスト

これでエージェント を更新してテストする準備ができました。再度 **Publish** ボタンを選択し、公開を更新します。完了したらエージェント アプリへの直接リンクを開きます。演習 1 - 手順 4 で表示された **Add** の代わりに **Update now** が表示されるので選択してください。処理が終わったら Microsoft 365 Copilot Chat を更新し、エージェント と対話を開始します。

作成したツールは、以下のようなプロンプトで簡単に呼び出せます。

```txt
Show me the list of candidates for HR with role "HR Director" or "HR Manager"
```

Microsoft 365 Copilot Chat は外部 API (Excel Online) の使用許可を求めてくるので、**Always allow** または **Allow once** を選択します。テスト目的では **Allow once** を選択すると、再度許可プロセスを確認できます。

![Microsoft 365 Copilot Chat asking consent to consume the external API for Excel Online. There are three command buttons to **Always allow**, **Allow once**, and **Cancel**.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-03.png)

Power Platform コネクタでは有効な接続が必要なため、エージェント から **Sign in to Agentic HR** を求められる場合があります。
外部コネクタへ接続すると、エージェント は Excel スプレッドシートから条件に一致する候補者の一覧を返します。

![Microsoft 365 Copilot Chat asking to sign in to consume the external Excel Online API.](../../../assets/images/make/copilot-studio-04/action-agent-m365-copilot-chat-05.png)

お疲れさまでした! Copilot Studio で作成した Microsoft 365 Copilot 用 エージェント から外部コネクタを呼び出すことができました。

<cc-end-step lab="mcs4" exercise="2" step="2" />

---8<--- "ja/mcs-congratulations.md"

<a href="../05-connectors">こちらから</a> Lab MCS5 を開始し、Copilot Studio でカスタム コネクタを使用する方法を学びましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/04-extending-m365-copilot--ja" />