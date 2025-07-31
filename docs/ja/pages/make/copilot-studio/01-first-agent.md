---
search:
  exclude: true
---
# ラボ MCS1 - 最初のエージェント

このラボでは、Microsoft Copilot Studio で最初のエージェントを作成します。ここで作成するエージェントは、ユーザーが人事 (HR) ポリシーや、従業員の採用・解雇プロセス、キャリア開発、学習パスの定義に関する情報を見つけるのを支援します。  
エージェントのナレッジ ベースは、SharePoint Online に保存されているドキュメントと、一部の公開 Web コンテンツになります。

このラボで学習できる内容:

- Copilot Studio でエージェントを作成する方法
- エージェント用のカスタム アイコンを設定する方法
- エージェントのナレッジ ソースを構成する方法
- Microsoft Teams でエージェントを公開する方法

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RF9RBhPp6v8" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>


!!! pied-piper "注意事項"
    これらのサンプルおよびラボは、学習およびデモンストレーションを目的としたものです。運用環境での使用を想定していません。運用に投入する場合は、必ず本番レベルの品質に引き上げてからご利用ください。

## Exercise 1 : Copilot Studio でのエージェント作成

最初の演習では、Generative AI を利用して新しいエージェントを作成し、必要事項を自然言語で説明します。また、エージェント用のカスタム アイコンを設定し、テストも行います。

### Step 1 : 新しいエージェントの作成

ブラウザーを開き、対象 Microsoft 365 テナントの作業アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、Microsoft Copilot Studio を起動します。

次のスクリーンショットのように、画面左側の **Create** ボタンを選択します。

![The home page of Microsoft Copilot Studio with the **Create** button highlighted to create a new agent.](../../../assets/images/make/copilot-studio-01/make-agent-01.png)

新しいエージェントを作成できるページにリダイレクトされます。Copilot Studio では、**New agent** を選択してゼロからエージェントを作成することも、あらかじめ用意されたテンプレートから開始することもできます。このラボでは簡単のため、**New agent** を選択してゼロから作成します。

![The **Create agent** page of Microsoft Copilot Studio with the **New agent** option highlighted to create a new agent from scratch.](../../../assets/images/make/copilot-studio-01/make-agent-02.png)

既定では、Copilot Studio にエージェントの内容を自然言語で記述できます。これは非常に便利な方法で、求める内容を記述するだけで、Copilot Studio が入力を処理し、ニーズに合わせてエージェントを構成してくれます。自然言語での記述を避けたい場合は、**Skip to configure** を選択して手動で設定できます。

![The **Create agent** page of Microsoft Copilot Studio when describing the agent behavior and capabilities with natural language.](../../../assets/images/make/copilot-studio-01/make-agent-03.png)

このラボでは、次の初期説明を入力します。

````txt
You are an agent helping employees to find information about HR policies and procedures,
about how to improve their career, and about how to define learning pathways.
````

Copilot Studio から名前を尋ねられたら、カスタム エージェントに「HR Agent」と入力します。次に、以下の指示を入力して、特定の情報を強調または回避するように指示します。

````txt
Emphasize everything that helps team building, inclusion, and the growth mindset
````

続いて、エージェントのトーンをプロフェッショナルに設定するため、次を入力します。

````txt
It should have a professional tone
````

Copilot Studio から初期データ ソースの設定を求められたら、次を入力します。

````txt
Let's use this website: https://www.microsoft.com/en-us/human-resources
````

指定したサイトが組織所有であることを確認する必要があります。

![The message from Copilot Studio asking for confirmation that the current user's organization owns the provided website and that Bing search results can be used.](../../../assets/images/make/copilot-studio-01/make-agent-confirm-web-datasource-04.png)

!!! pied-piper "重要"
    このサンプル エージェントでは、データ ソースとして Microsoft の HR Web サイトに公開されている一部のコンテンツを使用します。提供したデータ ソースで Microsoft Bing の検索結果を利用するため、組織がそのデータ ソースを所有していることを確認する必要があります。ご自身でエージェントを作成する際は、自社が所有する HR サイトの URL を入力してください。

エージェント作成の準備が整いました。画面右側には、Copilot Studio に提供した指示に基づき、エージェントに設定された機能と能力の概要が常に表示されます。右上の **Create** ボタンを選択し、Copilot Studio がエージェントを作成するのを待ちます。

エージェントが準備できると、次のような画面が表示されます。

![The page of Copilot Studio with the new agent just created and all the settings available for further refinement.](../../../assets/images/make/copilot-studio-01/make-agent-05.png)

右側のテスト パネルでエージェントを試すか、**Overview** タブの設定オプションでエージェントを調整できます。

<cc-end-step lab="mcs1" exercise="1" step="1" />

### Step 2 : エージェント アイコンの変更

まず **Overview** タブ右上の **Edit** ボタンを選択し、エージェントのアイコンを変更します。**Details** セクションが編集モードになります。

![The **Details** panel of the agent in edit mode, where it is possible to update the Name, the icon, the description, and the instructions for the agent.](../../../assets/images/make/copilot-studio-01/make-agent-edit-06.png)

演習 Step 1 で入力した内容が **Description** と **Instructions** フィールドに反映されていることがわかります。

**Change icon** ボタンを選択するとダイアログが表示され、カスタム アイコンをアップロードできます。必要に応じて、[こちらのアイコン](https://raw.githubusercontent.com/microsoft/copilot-camp/refs/heads/main/src/make/copilot-studio/HR-agent-color.png){target=_blank} を使用できます。

![The **Details** panel of the agent in edit mode, where it is possible to update the Name, the icon, the description, and the instructions for the agent.](../../../assets/images/make/copilot-studio-01/make-agent-change-icon-07.png)

新しいアイコンのアップロードが完了したら **Save** を選択します。

<cc-end-step lab="mcs1" exercise="1" step="2" />

### Step 3 : エージェントのテスト

右側のパネルでプロンプトを入力するだけでエージェントをテストできます。たとえば、次のプロンプトを入力してみましょう。

````txt
What is our mission?
````

次のスクリーンショットは、データ ソースとして提供した Web サイトの内容に基づき、エージェントが回答した例です。

![The **Test** panel with the interaction between the user, asking for 'What is our mission?', and the agent providing a response based on the actua content available on the data source, with direct references to the pages on the data source website.](../../../assets/images/make/copilot-studio-01/make-agent-test-08.png)

エージェントはデータ ソース Web サイトのページを参照し、回答が Azure OpenAI から生成されたことを示しています。

<cc-end-step lab="mcs1" exercise="1" step="3" />

## Exercise 2 : ナレッジ ベースの拡張

この演習では、Microsoft SharePoint Online に保存されているドキュメント (Word と PDF) をエージェントの追加ナレッジ ベースとして追加します。

### Step 1 : SharePoint Online のナレッジ ベース ドキュメントの追加

この [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} を選択し、いくつかのファイル (Word、PowerPoint、PDF) を含む zip ファイルをダウンロードします。

zip を解凍し、Copilot Studio でエージェントを作成しているのと同じテナントの SharePoint チーム サイトの **Documents** ライブラリにアップロードします。これらのドキュメントは、エージェントに追加のナレッジ ベースを提供する目的で Microsoft 365 Copilot により生成されました。

サイトの絶対 URL をコピーします。例: `https://xyz.sharepoint.com/sites/contoso`

![The **Overview** tab of the agent with the **+ Add knowledge** button highlighted.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-01.png)

先ほど作成したエージェントの **Overview** タブで **Knowledge** セクションまでスクロールします。Exercise 1 の Step 1 で設定した Web サイトが表示されているはずです。**+ Add knowledge** を選択し、SharePoint サイトとそのドキュメントを追加のナレッジ ソースとして設定します。

![The dialog to configure additional knowledge for the agent. Options are public websites, SharePoint, Dataverse, or other advanced data sources.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-02.png)

表示されたダイアログでは、次のような追加ナレッジ ソースを設定できます。

- Files: ファイルを手動でアップロードし、ナレッジ ベースに含める
- Public websites: 追加の Web サイトを指定
- SharePoint: SharePoint Online のサイトやライブラリを指定
- Dataverse: Dataverse のテーブルを追加
- Advanced: Azure AI Search、Azure SQL、Microsoft Copilot Connectors、サードパーティ データ コネクターなど企業データ接続を利用

**SharePoint** を選択し、表示されるダイアログにファイルをアップロードしたサイトの URL を入力して **Add** を選択します。

![The dialog to add a SharePoint data source. There is a **Browse files** button to search for specific files, a textbox to provide the URL of a site, and an **Add** button.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-03.png)

SharePoint データ ソースを構成する際は、**Name** と **Description** も指定する必要があります。意味のある名前と説明を提供することが重要です。Copilot Studio がデータ ソースの内容をより正確に理解でき、今後のラボで生成オーケストレーションを有効にした際に、生成 AI がユーザーのプロンプトに応答する際に適切なデータ ソースを特定しやすくなります。

![The dialog to add a SharePoint data source. There is a datasource selected with proper name and description.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-04.png)

画面下部の **Add** を選択し、Copilot Studio が追加したナレッジ ベースを処理するまで待ちます。

更新が完了すると、**Overview** タブの **Knowledge** セクションに公開 Web サイトと SharePoint Online サイトの両方が表示されます。

![The **Knowledge** section of the **Overview** page with two data sources: the website and the SharePoint Online site.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-05.png)

!!! warning "重要"
    Copilot Studio でエージェントのナレッジ ベースとして SharePoint Online サイトを構成する場合、ユーザーは自分がアクセス権を持つドキュメントからのみ回答やコンテンツを取得できます。セキュリティとアクセス制御は Microsoft 365 のセキュリティ基盤によって保証され、Copilot Studio のエージェントは現在のユーザーの代わりにドキュメントへアクセスします。

<cc-end-step lab="mcs1" exercise="2" step="1" />

### Step 2 : 更新したエージェントのテスト

右側のパネルでエージェントを再度テストできます。たとえば、次のプロンプトを入力します。

````txt
How can we hire new people in our company?
````

エージェントは採用手順に関する情報を返し、SharePoint Online のナレッジ ベースに保存されているドキュメントへの参照を提供します。

![The test panel with a conversation with the agent and a set of references to documents retrieved from the SharePoint Online knowledge base.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-06.png)

次に、確認のため、以下のプロンプトを入力してみましょう。

````txt
How can I cook spaghetti alla carbonara?
````

HR 関連のトピックでなくても、エージェントから回答が返ってくることに気付くはずです。もちろん、パスタが好きならスパゲッティ・アラ・カルボナーラの作り方を尋ねても構いません 🍝。しかし、この挙動は必ずしも意図したものではありません。エージェントは特定のトピックや分野に特化したアシスタントであるべきだからです。

<cc-end-step lab="mcs1" exercise="2" step="2" />

### Step 3 : 一般知識の無効化

エージェントをカスタム ナレッジ ベースのみに完全に集中させたい場合は、**General knowledge** を無効にします。右上の **Settings** を選択し、既定でアクティブな **Generative AI** タブを開き、**Knowledge** セクションまでスクロールして「Use general knowledge」のオプションを無効にします。

![The option to disable "AI general knowledge" when configuring the **Knowledge** of an agent in the agent **Settings**.](../../../assets/images/make/copilot-studio-01/make-agent-general-knowledge-01.png)

一般知識を無効にしたら、再度コンテキスト外の質問をしてみましょう。 

![The answer from the agent when asking something that is not related to its configured knowledge base.](../../../assets/images/make/copilot-studio-01/make-agent-general-knowledge-04.png)

今度は、エージェントが求めている情報を提供できない旨を正しく回答します。

!!! note "一般知識に関する追加情報"
    Microsoft Copilot Studio で作成したエージェントのナレッジ ソースの詳細については、[こちらの記事](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio){target=_blank} をご覧ください。

<cc-end-step lab="mcs1" exercise="2" step="3" />

## Exercise 3 : エージェントの公開

このラボの最後の演習では、作成したカスタム エージェントを Microsoft Teams に公開します。

### Step 1 : Microsoft Teams でのエージェント公開

Copilot Studio でエージェントを公開するには、エージェント エディター右上の **Publish** ボタンを選択します。

![The button to publish an agent highlighted in the user interface of the agent editor.](../../../assets/images/make/copilot-studio-01/make-agent-publish-01.png)

コマンドを選択すると確認メッセージが表示されます。確認後、公開プロセスが開始され、「Publishing …」というメッセージが表示されます。公開はエージェントを対象の Power Platform 環境に登録しますが、どのプラットフォームでもまだ利用可能にはなりません。

エージェントを特定のプラットフォーム (チャネル) で利用可能にするには、まず 1️⃣ エージェント エディターで **Channels** タブを選択し、表示されたチャネル一覧から 2️⃣ **Teams + Microsoft 365** を選択します。

![The **Channels** tab where you can make an agent available in one or more channels. There is a list of available channels like "Telephony", "Teams + Microsoft 365", "Demo website", "Custom website", etc.](../../../assets/images/make/copilot-studio-01/make-agent-publish-02.png)

既定では、エージェントを作成して公開すると Microsoft 認証が構成され、Teams や Power Apps、Microsoft 365 Copilot で Microsoft Entra ID 認証が使用されます。既定の認証設定では、上記のスクリーンショットの警告メッセージにあるとおり、エージェントは Microsoft Teams にのみ公開できます。 

!!! note "Copilot Studio の認証モデル"
    Copilot Studio におけるエージェントのユーザー認証については、[Configure user authentication in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication){target=_blank} を参照してください。

!!! note "Microsoft Copilot Studio の Premium ライセンス"
    上のスクリーンショットにはライセンス モデルと Premium ライセンスの必要性に関する情報バーも表示されています。Copilot Studio で Premium コネクタなどの Premium 機能を利用する場合は、ライセンスをアップグレードする必要があります。学習やテスト目的の場合、Premium ライセンスを 60 日間無料で試用できます。

**Teams + Microsoft 365** チャネルを選択するとサイド パネルが表示され、**Add channel** ボタンを選択できます。

![The side panel to enable the Microsoft Teams channel. There is a description of the current state and a button to **Add channel**.](../../../assets/images/make/copilot-studio-01/make-agent-publish-03.png)

Microsoft Teams チャネルが有効になると、サイド パネルが更新され、確認メッセージとエージェントの詳細を編集するコマンド、Microsoft Teams クライアントでエージェントを開くコマンドが表示されます。**Availability options** ボタンを選択すると、Microsoft Teams でエージェントにアクセスする方法を確認できます。

Microsoft 365 Copilot をサポートするようチャネルを登録した場合は、**See agent in Microsoft 365** リンクを選択し、Microsoft 365 Copilot のチャット エクスペリエンスでエージェントに直接アクセスできます。

![The side panel to enable the Microsoft Teams channel. There is a description of the current state and a couple of buttons to **Turn on Teams** and to **Cancel**.](../../../assets/images/make/copilot-studio-01/make-agent-publish-04.png)

**Availability options** ボタンでは次の操作が可能です。

- Microsoft Teams で使用するエージェントへのリンクをコピー
- Teams アプリ ストアにアップロードできるパッケージを ZIP ファイルでダウンロード
- エージェントを Teams アプリ ストアで公開し、組織全体または特定のユーザーに提供

![The side panel to see the availability options for the agent in Microsoft Teams. There are buttons to copy a link to the agent in Teams, to make the agent available in the Teams app store, and to download a zip with the agent package for sharing the agent on other tenants.](../../../assets/images/make/copilot-studio-01/make-agent-publish-05.png)

これで Microsoft Teams でのエージェント公開が完了しました。

<cc-end-step lab="mcs1" exercise="3" step="1" />

### Step 2 : Microsoft Teams でのエージェント テスト

エージェントを Microsoft Teams でテストできるようになりました。**Availability options** パネルで **Copy link** を選択し、リンクをコピーします。新しいブラウザー タブを開き、コピーしたリンクを貼り付けて ENTER キーを押します。

![The dialog window showing the agent as a new app in Microsoft Teams. There is an extended description of the app and of the agent. There is also a button to **Add** the app to Microsoft Teams.](../../../assets/images/make/copilot-studio-01/make-agent-test-teams-01.png)

最初に Microsoft Teams クライアントで、新しいアプリとしてエージェントが表示されます。**Add** ボタンを選択してアプリをクライアントに追加し、続くダイアログで **Open** を選択します。

![The dialog window showing the agent as a new app in Microsoft Teams. There is an extended description of the app and of the agent. There is also a button to **Add** the app to Microsoft Teams.](../../../assets/images/make/copilot-studio-01/make-agent-test-teams-02.png)

しばらくすると、Microsoft Teams クライアントにボットとのチャットが表示されます。これはあなたのエージェントです。たとえば以前使用したプロンプトを入力します。

````txt
How can we hire new people in our company?
````

回答を待つと、HR のコンテキストに沿ったコンテンツと、ナレッジ ベースに含まれるドキュメントへの参照が表示されます。

![The dialog window showing the agent as a new app in Microsoft Teams. There is an extended description of the app and of the agent. There is also a button to **Add** the app to Microsoft Teams.](../../../assets/images/make/copilot-studio-01/make-agent-test-teams-03.png)

回答の先頭には「AI generated」である旨の注意事項が表示され、ユーザーが AI プラットフォームを利用していることを認識できます。

<cc-end-step lab="mcs1" exercise="3" step="2" />

---8<--- "ja/mcs-congratulations.md"

これでエージェントは完全に機能し、Microsoft Teams で利用できるようになりました。次のラボでは、エージェントの動作をさらにカスタマイズし、微調整します。

<a href="../02-topics">こちら</a> から Lab MCS2 を開始し、Copilot Studio でトピックを定義しましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/01-first-agent--ja" />