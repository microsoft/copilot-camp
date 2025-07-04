---
search:
  exclude: true
---
# ラボ MCS1 - 最初のエージェント

このラボでは、 Microsoft Copilot Studio を使用して最初のエージェントを作成します。作成するエージェントは、 HR ポリシーや従業員の採用・解雇プロセス、キャリアアップ、学習パスの設定に関する情報を ユーザー が探しやすくするものです。エージェントのナレッジ ベースとして、 SharePoint Online に保管されているドキュメントと公開 Web コンテンツを利用します。

このラボで学習する内容:

- Copilot Studio でのエージェントの作成方法  
- エージェントにカスタム アイコンを設定する方法  
- エージェントのナレッジ ソースを構成する方法  
- エージェントを Microsoft Teams に発行する方法  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RF9RBhPp6v8" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要をご覧ください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! pied-piper "注意事項"
    これらのサンプルおよびラボは学習およびデモ目的で提供されています。運用環境で使用することを前提としていません。運用環境で使用する場合は、必ず本番品質にアップグレードしてください。

## 演習 1 : Copilot Studio でのエージェント作成

最初の演習では、 Generative AI を利用して新しいエージェントを作成し、カスタム アイコンを設定し、テストを行います。

### 手順 1: 新しいエージェントの作成

ブラウザーを開き、対象の Microsoft 365 テナントの職場アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、 Microsoft Copilot Studio を起動します。

画面左側の **Create** ボタンを選択します。以下のスクリーンショットを参照してください。

![The home page of Microsoft Copilot Studio with the **Create** button highlighted to create a new agent.](../../../assets/images/make/copilot-studio-01/make-agent-01.png)

新しいエージェントを作成できるページにリダイレクトされます。 Copilot Studio では **New agent** を選択してゼロからエージェントを作成するか、あらかじめ用意されたテンプレートから開始できます。このラボではシンプルに **New agent** を選択します。

![The **Create agent** page of Microsoft Copilot Studio with the **New agent** option highlighted to create a new agent from scratch.](../../../assets/images/make/copilot-studio-01/make-agent-02.png)

デフォルトでは、 Copilot Studio に自然言語でエージェントの内容を説明できます。これは非常に便利で、求めている内容を記述するだけで Copilot Studio が入力を解析し、要件に合わせてエージェントを作成します。自然言語で説明したくない場合は **Skip to configure** を選択して手動設定も可能です。

![The **Create agent** page of Microsoft Copilot Studio when describing the agent behavior and capabilities with natural language.](../../../assets/images/make/copilot-studio-01/make-agent-03.png)

このラボでは次の初期説明を入力してください。

```txt
You are an agent helping employees to find information about HR policies and procedures,
about how to improve their career, and about how to define learning pathways.
```

Copilot Studio に名前を尋ねられたら、エージェントの名前として「 HR Agent」と入力します。その後、次の指示を与えて特定の情報を強調または除外させます。

```txt
Emphasize everything that helps team building, inclusion, and the growth mindset
```

さらに、エージェントのトーンをプロフェッショナルに設定するため、次の入力を行います。

```txt
It should have a professional tone
```

Copilot Studio からデータ ソースを求められたら、次の指示を入力してください。

```txt
Let's use this website: https://www.microsoft.com/en-us/human-resources
```

サイトの所有者確認が必要です。

![The message from Copilot Studio asking for confirmation that the current user's organization owns the provided website and that Bing search results can be used.](../../../assets/images/make/copilot-studio-01/make-agent-confirm-web-datasource-04.png)

!!! pied-piper "重要"
    このサンプル エージェントでは、データ ソースとして Microsoft の HR Web サイトの公開コンテンツを使用します。 Bing 検索結果を有効にするため、組織がこのデータ ソースを所有していることを確認する必要があります。ご自身のエージェントを作成する際は、実際に自社が所有する HR サイトの URL を指定してください。

画面右側には、 Copilot Studio に指示した内容に基づいて構成されたエージェントの機能と能力が常に表示されます。設定が完了したら、右上の **Create** ボタンを選択し、 Copilot Studio がエージェントを作成するまで待ちます。

エージェントが完成すると、次のような画面が表示されます。

![The page of Copilot Studio with the new agent just created and all the settings available for further refinement.](../../../assets/images/make/copilot-studio-01/make-agent-05.png)

右側のテスト パネルでエージェントを試すか、 **Overview** タブの設定オプションでさらに微調整できます。

<cc-end-step lab="mcs1" exercise="1" step="1" />

### 手順 2: エージェント アイコンの変更

**Overview** タブ右上の **Edit** ボタンを選択し、エージェントのアイコンを変更します。 **Details** セクションが編集モードに切り替わります。

![The **Details** panel of the agent in edit mode, where it is possible to update the Name, the icon, the description, and the instructions for the agent.](../../../assets/images/make/copilot-studio-01/make-agent-edit-06.png)

演習 1 の入力内容が **Description** と **Instructions** に反映されていることが確認できます。

**Change icon** ボタンを選択してダイアログを開き、カスタム アイコンをアップロードします。必要であれば [こちらのアイコン](https://raw.githubusercontent.com/microsoft/copilot-camp/refs/heads/main/src/make/copilot-studio/HR-agent-color.png){target=_blank} を使用できます。

![The **Details** panel of the agent in edit mode, where it is possible to update the Name, the icon, the description, and the instructions for the agent.](../../../assets/images/make/copilot-studio-01/make-agent-change-icon-07.png)

アップロードが完了したら **Save** を選択します。

<cc-end-step lab="mcs1" exercise="1" step="2" />

### 手順 3: エージェントのテスト

右側のテスト パネルでプロンプトを入力してエージェントをテストします。例として次のプロンプトを入力してください。

```txt
What is our mission?
```

次のスクリーンショットは、指定した Web サイトのコンテンツを基にエージェントが返した回答例です。

![The **Test** panel with the interaction between the user, asking for 'What is our mission?', and the agent providing a response based on the actua content available on the data source, with direct references to the pages on the data source website.](../../../assets/images/make/copilot-studio-01/make-agent-test-08.png)

エージェントはデータ ソースのページへの参照を示し、回答が Azure OpenAI によるものであることをハイライトしています。

<cc-end-step lab="mcs1" exercise="1" step="3" />

## 演習 2 : ナレッジ ベースの拡張

この演習では、 Microsoft SharePoint Online に保存されている Word と PDF のドキュメントを追加し、エージェントのナレッジ ベースを拡張します。

### 手順 1: SharePoint Online ドキュメントの追加

[こちらのリンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} から複数ファイル（ Word、 PowerPoint、 PDF）を含む zip ファイルをダウンロードします。

zip を展開し、同じテナントの SharePoint Teams サイトの **Documents** ライブラリにアップロードします。これらのドキュメントは Microsoft 365 Copilot により生成されたもので、エージェントに追加ナレッジを提供するためのものです。

サイトの絶対 URL（例: `https://xyz.sharepoint.com/sites/contoso`）をコピーします。

![The **Overview** tab of the agent with the **+ Add knowledge** button highlighted.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-01.png)

先ほど作成したエージェントの **Overview** タブを開き、 **Knowledge** セクションまでスクロールします。演習 1 の手順 1 で設定した Web サイトが表示されているはずです。 **+ Add knowledge** を選択し、 SharePoint サイトとそのドキュメントを追加のナレッジ ソースとして登録します。

![The dialog to configure additional knowledge for the agent. Options are public websites, SharePoint, Dataverse, or other advanced data sources.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-02.png)

ポップアップ ダイアログから以下のナレッジ ソースを追加できます。

- Files: ファイルを手動でアップロードし、ナレッジ ベースに追加  
- Public websites: 追加の Web サイトを登録  
- SharePoint: SharePoint Online のサイトまたはライブラリを構成  
- Dataverse: Dataverse のテーブルを追加  
- Advanced: Azure AI Search、 Azure SQL、 Microsoft Copilot Connectors、サードパーティ データ接続など  

**SharePoint** を選択し、ファイルをアップロードしたサイトの URL を入力して **Add** を選択します。

![The dialog to add a SharePoint data source. There is a **Browse files** button to search for specific files, a textbox to provide the URL of a site, and an **Add** button.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-03.png)

SharePoint データ ソースを構成する際は **Name** と **Description** を指定する必要があります。意味のある名前と説明を付けることが重要です。これは Copilot Studio がデータ ソースの内容を理解しやすくし、今後のラボでジェネレーティブ オーケストレーションを有効にした際に、適切なデータ ソースを選択できるようにするためです。

![The dialog to add a SharePoint data source. There is a datasource selected with proper name and description.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-04.png)

画面下部の **Add** ボタンを選択し、 Copilot Studio が新しいナレッジ ベースを処理するまで待ちます。

処理が完了すると、 **Overview** タブに公開 Web サイトと SharePoint Online サイトの両方が表示されます。

![The **Knowledge** section of the **Overview** page with two data sources: the website and the SharePoint Online site.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-05.png)

!!! warning "重要"
    Copilot Studio で SharePoint Online サイトをナレッジ ベースとして構成した場合、 ユーザー はアクセス権を持つドキュメントの内容のみ取得できます。セキュリティとアクセス制御は Microsoft 365 のセキュリティ基盤により保証され、 Copilot Studio エージェントは現在の ユーザー の権限でドキュメントにアクセスします。

<cc-end-step lab="mcs1" exercise="2" step="1" />

### 手順 2: 更新したエージェントのテスト

右側のパネルで再度エージェントをテストします。例として次のプロンプトを入力してください。

```txt
How can we hire new people in our company?
```

エージェントは採用手続きに関する情報を SharePoint Online のドキュメントから参照して返答します。

![The test panel with a conversation with the agent and a set of references to documents retrieved from the SharePoint Online knowledge base.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-06.png)

次に、参考までに以下のプロンプトを試してください。

```txt
How can I cook spaghetti alla carbonara?
```

HR とは無関係な質問でもエージェントが回答を返すことに気付くでしょう。もちろんスパゲッティ・アラ・カルボナーラを作ることもできますが 🍝 、これは本来の目的ではありません。エージェントは特定のトピックや領域に特化したアシスタントであるべきです。

<cc-end-step lab="mcs1" exercise="2" step="2" />

### 手順 3: 一般知識の無効化

エージェントをカスタム ナレッジ ベースのみに集中させたい場合は、 **General knowledge** を無効にします。右上の **Settings** を選択し、既定でアクティブな **Generative AI** タブを開き、 **Knowledge** セクションまでスクロールして「Use general knowledge」をオフにします。

![The option to disable "AI general knowledge" when configuring the **Knowledge** of an agent in the agent **Settings**.](../../../assets/images/make/copilot-studio-01/make-agent-general-knowledge-01.png)

一般知識を無効にしたら、再度コンテキスト外の質問をしてみてください。

![The answer from the agent when asking something that is not related to its configured knowledge base.](../../../assets/images/make/copilot-studio-01/make-agent-general-knowledge-04.png)

エージェントは該当する情報がない旨を適切に案内します。

!!! note "一般知識に関する追加情報"
    Microsoft Copilot Studio のエージェントが使用するナレッジ ソースの詳細は、 [こちらの記事](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio){target=_blank} を参照してください。

<cc-end-step lab="mcs1" exercise="2" step="3" />

## 演習 3 : エージェントの発行

最後の演習では、作成したエージェントを Microsoft Teams に発行します。

### 手順 1: Microsoft Teams への発行

Copilot Studio でエージェントを発行するには、エージェント エディター右上の **Publish** ボタンを選択します。

![The button to publish an agent highlighted in the user interface of the agent editor.](../../../assets/images/make/copilot-studio-01/make-agent-publish-01.png)

確認ダイアログが表示されます。確定すると発行処理が始まり、「Publishing ...」メッセージが表示されます。発行により、エージェントはターゲットの Power Platform 環境に登録されますが、まだどのプラットフォームにも公開されていません。

特定プラットフォーム（チャネル）で利用可能にするには、1️⃣ エージェント エディターの **Channels** タブを選択し、エージェントを公開するチャネルを選びます。たとえば、 Microsoft Teams にボットとして公開する場合は 2️⃣ **Teams + Microsoft 365** を選択します。

![The **Channels** tab where you can make an agent available in one or more channels. There is a list of available channels like "Telephony", "Teams + Microsoft 365", "Demo website", "Custom website", etc.](../../../assets/images/make/copilot-studio-01/make-agent-publish-02.png)

既定では、エージェントは Microsoft 認証（ Microsoft Entra ID）を使用するよう設定されています。そのため Teams、 Power Apps、 Microsoft 365 Copilot で利用できます。既定の認証設定では、警告メッセージが示すとおり Microsoft Teams のみ公開可能です。

!!! note "Copilot Studio の認証モデル"
    Copilot Studio エージェントの認証については [Configure user authentication in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication){target=_blank} を参照してください。

!!! note "Microsoft Copilot Studio の Premium ライセンス"
    上記スクリーンショットにある情報バーはライセンス モデルと Premium ライセンス要件を示しています。 Premium コネクタなどを使用する場合はライセンスのアップグレードが必要です。学習目的であれば 60 日間の Premium 無料試用版を有効化できます。

**Teams + Microsoft 365** チャネルを選択するとサイド パネルが開き、 **Add channel** ボタンを押せます。

![The side panel to enable the Microsoft Teams channel. There is a description of the current state and a button to **Add channel**.](../../../assets/images/make/copilot-studio-01/make-agent-publish-03.png)

Teams チャネルを有効化すると、サイド パネルに確認メッセージとエージェント詳細の編集、 Microsoft Teams クライアントでのエージェント起動などのコマンドが表示されます。 **Availability options** ボタンから Teams での公開方法を確認できます。

Microsoft 365 Copilot チャネルを登録した場合は **See agent in Microsoft 365** リンクから Microsoft 365 Copilot チャットでエージェントを利用できます。

![The side panel to enable the Microsoft Teams channel. There is a description of the current state and a couple of buttons to **Turn on Teams** and to **Cancel**.](../../../assets/images/make/copilot-studio-01/make-agent-publish-04.png)

**Availability options** では次の操作が可能です。

- Microsoft Teams でエージェントを開くリンクをコピー  
- Teams アプリ ストア用の ZIP パッケージをダウンロード  
- エージェントを Teams アプリ ストアに公開（組織全体または選択した ユーザー のみ）  

![The side panel to see the availability options for the agent in Microsoft Teams. There are buttons to copy a link to the agent in Teams, to make the agent available in the Teams app store, and to download a zip with the agent package for sharing the agent on other tenants.](../../../assets/images/make/copilot-studio-01/make-agent-publish-05.png)

これで Microsoft Teams へのエージェント発行が完了しました。

<cc-end-step lab="mcs1" exercise="3" step="1" />

### 手順 2: Microsoft Teams でのエージェント テスト

**Availability options** パネルの **Copy link** を選択し、リンクをコピーします。ブラウザーの新しいタブを開き、リンクを貼り付けて ENTER を押します。

![The dialog window showing the agent as a new app in Microsoft Teams. There is an extended description of the app and of the agent. There is also a button to **Add** the app to Microsoft Teams.](../../../assets/images/make/copilot-studio-01/make-agent-test-teams-01.png)

Microsoft Teams クライアントが新しいアプリ（エージェント）を表示します。 **Add** を選択し、続くダイアログで **Open** をクリックします。

![The dialog window showing the agent as a new app in Microsoft Teams. There is an extended description of the app and of the agent. There is also a button to **Add** the app to Microsoft Teams.](../../../assets/images/make/copilot-studio-01/make-agent-test-teams-02.png)

しばらくすると Teams クライアントにボットとのチャットが表示されます。次のようなプロンプトを入力してください。

```txt
How can we hire new people in our company?
```

エージェントは HR コンテキストの情報とナレッジ ベース内ドキュメントの参照を含めて回答します。

![The dialog window showing the agent as a new app in Microsoft Teams. There is an extended description of the app and of the agent. There is also a button to **Add** the app to Microsoft Teams.](../../../assets/images/make/copilot-studio-01/make-agent-test-teams-03.png)

回答の上部には「AI generated」である旨のディスクレーマーが表示され、 ユーザー に AI コンテンツであることを明示しています。

<cc-end-step lab="mcs1" exercise="3" step="2" />

---8<--- "ja/mcs-congratulations.md"

これでエージェントは完全に機能し、 Microsoft Teams で使用できるようになりました。次のラボでは、動作をさらにカスタマイズし、微調整していきます。

<a href="../02-topics">ここから開始</a>して、 Lab MCS2 で Copilot Studio のトピックを定義しましょう。  
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/01-first-agent" />