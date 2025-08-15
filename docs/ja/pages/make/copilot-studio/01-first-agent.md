---
search:
  exclude: true
---
# ラボ MCS1 - 最初のエージェント

このラボでは、Microsoft Copilot Studio を使用して最初のエージェントを作成します。作成するエージェントは、ユーザーが人事 (HR) ポリシーや、従業員の採用・解雇プロセス、キャリア開発、学習プランの策定に関する情報を見つけるのを支援します。エージェントのナレッジベースは、SharePoint Online に保存されているドキュメントと一部の公開 Web コンテンツです。

このラボで学習する内容:

- Copilot Studio でエージェントを作成する方法
- エージェントにカスタム アイコンを設定する方法
- エージェントのナレッジ ソースを設定する方法
- Microsoft Teams でエージェントを発行する方法

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RF9RBhPp6v8" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を簡単にご覧いただけます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! pied-piper "注意事項"
    これらのサンプルおよびラボは学習およびデモ目的で提供されています。実運用環境での使用を意図したものではありません。運用環境に導入する場合は、必ず運用レベルの品質にアップグレードしてください。

## 演習 1 : Copilot Studio でのエージェントの作成

この最初の演習では、Generative AI を使用して新しいエージェントを作成します。エージェントのアイコンをカスタマイズし、テストも行います。

### Step 1: 新しいエージェントの作成

ブラウザーを開き、対象 Microsoft 365 テナントの作業アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、Microsoft Copilot Studio を起動します。

画面左側の **Create** ボタンを選択します。次のスクリーンショットを参照してください。

![The home page of Microsoft Copilot Studio with the **Create** button highlighted to create a new agent.](../../../assets/images/make/copilot-studio-01/make-agent-01.png)

新しいエージェントを作成できるページにリダイレクトされます。Copilot Studio では **New agent** を選択して一から作成するか、あらかじめ用意されたテンプレートから開始するかを選べます。このラボでは簡単のため **New agent** を選択します。

![The **Create agent** page of Microsoft Copilot Studio with the **New agent** option highlighted to create a new agent from scratch.](../../../assets/images/make/copilot-studio-01/make-agent-02.png)

デフォルトでは、Copilot Studio に自然言語でエージェントの内容を説明できます。必要事項を説明するだけで Copilot Studio が解析し、要件に沿ったエージェントを作成してくれます。自然言語で説明したくない場合は **Skip to configure** を選択して手動で設定できます。

![The **Create agent** page of Microsoft Copilot Studio when describing the agent behavior and capabilities with natural language.](../../../assets/images/make/copilot-studio-01/make-agent-03.png)

このラボでは、以下の初期説明を入力します。

```txt
You are an agent helping employees to find information about HR policies and procedures,
about how to improve their career, and about how to define learning pathways.
```

Copilot Studio から名前を尋ねられたら、カスタム エージェントに「HR Agent」と入力します。その後、特定の情報を強調または除外するように以下の指示を追加します。

```txt
Emphasize everything that helps team building, inclusion, and the growth mindset
```

続いて、エージェントのトーンをプロフェッショナルに設定するため、以下を入力します。

```txt
It should have a professional tone
```

Copilot Studio に初期データ ソースの入力を求められたら、次を入力します。

```txt
Let's use this website: https://www.microsoft.com/en-us/human-resources
```

提供したサイトが自組織のものであることを確認する必要があります。

![The message from Copilot Studio asking for confirmation that the current user's organization owns the provided website and that Bing search results can be used.](../../../assets/images/make/copilot-studio-01/make-agent-confirm-web-datasource-04.png)

!!! pied-piper "重要"
    このサンプル エージェントでは、データ ソースとして Microsoft の公開 HR サイトの一部コンテンツを使用します。Bing 検索結果を有効化するため、組織がデータ ソースを所有していることを確認する必要があります。ご自身のエージェントを作成する際は、実際に自社が所有する HR サイトの URL を指定してください。

エージェントの作成準備が整いました。画面右側には、Copilot Studio に入力した指示に基づき構成された機能と設定の概要が常に表示されます。
右上の **Create** ボタンを選択し、Copilot Studio がエージェントを作成するまで待ちます。

エージェントが準備できると、次のような画面が表示されます。

![The page of Copilot Studio with the new agent just created and all the settings available for further refinement.](../../../assets/images/make/copilot-studio-01/make-agent-05.png)

右側のテスト パネルでエージェントをすぐに試すことも、**Overview** タブの設定オプションで細かく調整することもできます。

<cc-end-step lab="mcs1" exercise="1" step="1" />

### Step 2: エージェント アイコンの変更

**Overview** タブ右上の **Edit** ボタンを選択し、エージェントのアイコンを変更します。
**Details** セクションが編集モードに切り替わります。

![The **Details** panel of the agent in edit mode, where it is possible to update the Name, the icon, the description, and the instructions for the agent.](../../../assets/images/make/copilot-studio-01/make-agent-edit-06.png)

演習 1 で入力した内容が **Description** と **Instructions** に反映されていることが分かります。

**Change icon** ボタンを選択し、ダイアログからカスタム アイコンをアップロードします。必要に応じて [こちらのアイコン](https://raw.githubusercontent.com/microsoft/copilot-camp/refs/heads/main/src/make/copilot-studio/HR-agent-color.png){target=_blank} を使用できます。

![The **Details** panel of the agent in edit mode, where it is possible to update the Name, the icon, the description, and the instructions for the agent.](../../../assets/images/make/copilot-studio-01/make-agent-change-icon-07.png)

新しいアイコンをアップロードしたら **Save** を選択します。

<cc-end-step lab="mcs1" exercise="1" step="2" />

### Step 3: エージェントのテスト

右側のテスト パネルでプロンプトを入力するだけでエージェントをテストできます。例として、次のプロンプトを入力してみましょう。

```txt
What is our mission?
```

以下のスクリーンショットは、データ ソースとして提供した Web サイトの内容を基にエージェントが返答した結果です。

![The **Test** panel with the interaction between the user, asking for 'What is our mission?', and the agent providing a response based on the actua content available on the data source, with direct references to the pages on the data source website.](../../../assets/images/make/copilot-studio-01/make-agent-test-08.png)

エージェントは回答の出典として Web サイトのページを参照し、Azure OpenAI を使用していることも示します。

<cc-end-step lab="mcs1" exercise="1" step="3" />

## 演習 2 : ナレッジベースの拡張

この演習では、Microsoft SharePoint Online に保存されている Word や PDF のドキュメントをエージェントの追加ナレッジベースとして追加します。

### Step 1: SharePoint Online のドキュメントを追加

以下の [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} から、いくつかのファイル (Word、PowerPoint、PDF) を含む ZIP ファイルをダウンロードします。

ZIP を展開し、Copilot Studio でエージェントを作成しているのと同じテナント内の SharePoint Teams サイトの **Documents** ライブラリにアップロードします。これらのドキュメントは Microsoft 365 Copilot で生成されたもので、エージェントに追加でナレッジを提供するためのものです。

サイトの絶対 URL をコピーします。例: `https://xyz.sharepoint.com/sites/contoso`

![The **Overview** tab of the agent with the **+ Add knowledge** button highlighted.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-01.png)

エージェントの **Overview** タブで **Knowledge** セクションまでスクロールします。演習 1 の Step 1 で設定した Web サイトが表示されているはずです。**+ Add knowledge** を選択し、SharePoint サイトとそのドキュメントを追加のナレッジ ソースとして設定します。

![The dialog to configure additional knowledge for the agent. Options are public websites, SharePoint, Dataverse, or other advanced data sources.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-02.png)

表示されるダイアログから追加できるナレッジ ソース:

- Files: ファイルを手動でアップロード
- Public websites: 追加の Web サイト
- SharePoint: SharePoint Online のサイトまたはライブラリ
- Dataverse: Dataverse のテーブル
- Advanced: Azure AI Search、Azure SQL、Microsoft Copilot Connectors、サード パーティ データ接続など

**SharePoint** を選択し、表示されたダイアログにサイトの URL を入力して **Add** を選択します。

![The dialog to add a SharePoint data source. There is a **Browse files** button to search for specific files, a textbox to provide the URL of a site, and an **Add** button.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-03.png)

SharePoint データ ソースを設定する際は、**Name** と **Description** も指定する必要があります。意味のある名前と説明を設定することが重要です。Copilot Studio がデータ ソースの内容をより理解し、今後のラボでジェネレーティブ オーケストレーションを有効化した際に、AI がユーザーのプロンプトに応じて適切なデータ ソースを選択しやすくなるためです。

![The dialog to add a SharePoint data source. There is a datasource selected with proper name and description.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-04.png)

画面下部の **Add** ボタンを選択し、Copilot Studio が新しいナレッジベースを処理するまで待ちます。

ナレッジベースが更新されると、**Overview** タブに公開 Web サイトと SharePoint Online サイトの両方が表示されます。

![The **Knowledge** section of the **Overview** page with two data sources: the website and the SharePoint Online site.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-05.png)

!!! warning "重要"
    Copilot Studio でエージェントのナレッジベースとして SharePoint Online サイトを設定した場合、ユーザーは自分がアクセス権を持つドキュメントのみを参照できます。セキュリティとアクセス制御は Microsoft 365 のセキュリティ インフラストラクチャによって保証され、Copilot Studio のエージェントは現在のユーザーの権限でドキュメントにアクセスします。

<cc-end-step lab="mcs1" exercise="2" step="1" />

### Step 2: 更新したエージェントのテスト

右側のパネルで再度エージェントをテストします。例として、次のプロンプトを入力します。

```txt
How can we hire new people in our company?
```

エージェントは採用手続きに関する情報を SharePoint Online のドキュメントから引用して返答します。

![The test panel with a conversation with the agent and a set of references to documents retrieved from the SharePoint Online knowledge base.](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-06.png)

次に、エージェントに次のプロンプトを入力してみてください。

```txt
How can I cook spaghetti alla carbonara?
```

HR とは無関係な質問でもエージェントが返答することに気づくでしょう。カルボナーラを作ってもいいですが 🍝、これは本来の目的ではありません。エージェントは特定のトピックや分野に特化したアシスタントであるべきです。

<cc-end-step lab="mcs1" exercise="2" step="2" />

### Step 3: 一般ナレッジの無効化

エージェントをカスタム ナレッジベースに完全に集中させるには、**General knowledge** を無効化します。
右上の **Settings** を選択し、既定でアクティブな **Generative AI** タブで **Knowledge** セクションまでスクロールし、「Use general knowledge」を無効化します。

![The option to disable "AI general knowledge" when configuring the **Knowledge** of an agent in the agent **Settings**.](../../../assets/images/make/copilot-studio-01/make-agent-general-knowledge-01.png)

一般ナレッジを無効化した後、再度まったく関係のない質問をしてみましょう。

![The answer from the agent when asking something that is not related to its configured knowledge base.](../../../assets/images/make/copilot-studio-01/make-agent-general-knowledge-04.png)

今度は、エージェントが対応できない旨を適切に伝えてくれます。

!!! note "一般ナレッジに関する追加情報"
    Microsoft Copilot Studio で作成したエージェントのナレッジ ソースに関する詳細は、[こちらの記事](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio){target=_blank} をご覧ください。

<cc-end-step lab="mcs1" exercise="2" step="3" />

## 演習 3 : エージェントの発行

このラボ最後の演習では、カスタム エージェントを Microsoft Teams に発行します。

### Step 1: Microsoft Teams への発行

Copilot Studio で作成したエージェントを発行するには、エージェント エディター右上の **Publish** ボタンを選択します。

![The button to publish an agent highlighted in the user interface of the agent editor.](../../../assets/images/make/copilot-studio-01/make-agent-publish-01.png)

確認メッセージが表示されるので承認します。発行処理には少し時間がかかり、「Publishing ...」と表示されます。発行すると、エージェントは対象の Power Platform 環境に登録されますが、まだチャネルには公開されません。

特定のプラットフォーム (チャネル) でエージェントを利用可能にするには、1️⃣ エージェント エディターの **Channels** タブを開き、2️⃣ **Teams + Microsoft 365** を選択して Microsoft Teams にボットとして公開します。

![The **Channels** tab where you can make an agent available in one or more channels. There is a list of available channels like "Telephony", "Teams + Microsoft 365", "Demo website", "Custom website", etc.](../../../assets/images/make/copilot-studio-01/make-agent-publish-02.png)

デフォルト設定で発行すると、エージェントは Microsoft 認証 (Microsoft Entra ID) を使用します。Teams、Power Apps、Microsoft 365 Copilot で動作し、Teams にのみ公開できます。これは前述のスクリーンショット最上部の警告メッセージで確認できます。

!!! note "Copilot Studio の認証モデル"
    Copilot Studio のエージェント認証については、[Configure user authentication in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication){target=_blank} を参照してください。

!!! note "Microsoft Copilot Studio の Premium ライセンス"
    上記スクリーンショットにはライセンスに関する情報バーも表示されています。Premium コネクタなどを使用する場合は Premium ライセンスが必要です。学習やテスト中は 60 日間の Premium トライアルを有効化できます。

**Teams + Microsoft 365** チャネルを選択すると、サイド パネルが表示され **Add channel** ボタンが使用可能になります。

![The side panel to enable the Microsoft Teams channel. There is a description of the current state and a button to **Add channel**.](../../../assets/images/make/copilot-studio-01/make-agent-publish-03.png)

Microsoft Teams チャネルが有効化されると、サイド パネルが更新され、確認メッセージとエージェント詳細の編集、Microsoft Teams クライアントで開くためのコマンドが表示されます。**Availability options** ボタンもあり、Teams でエージェントにアクセスする方法を確認できます。

Microsoft 365 Copilot をサポートするチャネルを登録した場合は、**See agent in Microsoft 365** を選択して Microsoft 365 Copilot チャット UI で直接エージェントを開くことも可能です。

![The side panel to enable the Microsoft Teams channel. There is a description of the current state and a couple of buttons to **Turn on Teams** and to **Cancel**.](../../../assets/images/make/copilot-studio-01/make-agent-publish-04.png)

**Availability options** では次のことができます:

- Microsoft Teams でエージェントを使用するリンクをコピー
- Teams アプリ パッケージ (ZIP) をダウンロード
- Teams アプリ ストアにエージェントを公開 (組織全体または選択したユーザー向け)

![The side panel to see the availability options for the agent in Microsoft Teams. There are buttons to copy a link to the agent in Teams, to make the agent available in the Teams app store, and to download a zip with the agent package for sharing the agent on other tenants.](../../../assets/images/make/copilot-studio-01/make-agent-publish-05.png)

これで Microsoft Teams へのエージェントの発行は完了です。

<cc-end-step lab="mcs1" exercise="3" step="1" />

### Step 2: Microsoft Teams でのエージェント テスト

**Availability options** パネルで **Copy link** を選択してリンクをコピーし、新しいブラウザー タブに貼り付けて ENTER キーを押します。

![The dialog window showing the agent as a new app in Microsoft Teams. There is an extended description of the app and of the agent. There is also a button to **Add** the app to Microsoft Teams.](../../../assets/images/make/copilot-studio-01/make-agent-test-teams-01.png)

Microsoft Teams クライアントにエージェントの新しいアプリが表示されます。**Add** を選択してアプリを追加し、続くダイアログで **Open** を選択します。

![The dialog window showing the agent as a new app in Microsoft Teams. There is an extended description of the app and of the agent. There is also a button to **Add** the app to Microsoft Teams.](../../../assets/images/make/copilot-studio-01/make-agent-test-teams-02.png)

しばらくすると Teams クライアントにボットとのチャットが表示されます。次のプロンプトを入力してみましょう。

```txt
How can we hire new people in our company?
```

エージェントは HR のコンテキストに沿った回答を返し、ナレッジベースに含まれるドキュメントを参照します。

![The dialog window showing the agent as a new app in Microsoft Teams. There is an extended description of the app and of the agent. There is also a button to **Add** the app to Microsoft Teams.](../../../assets/images/make/copilot-studio-01/make-agent-test-teams-03.png)

回答の冒頭には「AI generated」という注意書きが表示され、ユーザーに AI プラットフォーム利用であることを知らせます。

<cc-end-step lab="mcs1" exercise="3" step="2" />

---8<--- "ja/mcs-congratulations.md"

これでエージェントは完全に機能し、Microsoft Teams で利用できるようになりました。次のラボでは、エージェントの動作をカスタマイズし、さらに細かく調整します。

<a href="../02-topics">こちらから</a> Lab MCS2 に進み、Copilot Studio でトピックを定義しましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/01-first-agent--ja" />