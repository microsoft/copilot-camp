---
search:
  exclude: true
---
# ラボ MCS1 - 初めてのエージェント

このラボでは、Microsoft Copilot Studio で最初の エージェント を作成します。作成する エージェント は、 ユーザー が従業員の採用・解雇に関する HR ポリシーや手順、キャリア開発、学習パスの策定について情報を見つけるのを支援します。  
エージェント のナレッジベースには SharePoint Online に保存された一連のドキュメントと、公開 Web コンテンツを利用します。

このラボで学習する内容:

- Copilot Studio で エージェント を作成する方法
- エージェント にカスタム アイコンを設定する方法
- エージェント のナレッジソースを構成する方法
- エージェント を Microsoft Teams に発行する方法

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
    これらのサンプルとラボは学習およびデモ用として提供されており、運用環境での使用を意図したものではありません。運用環境で使用する場合は、必ず品質を向上させてからご利用ください。

## Exercise 1 : Copilot Studio でエージェントを作成する

最初の演習では、Generative AI を利用して新しい エージェント を作成し、エージェント に望む内容を説明します。また、カスタム アイコンを設定し、エージェント をテストします。

### Step 1: 新しいエージェントの作成

新しい エージェント を作成するには、ブラウザーを開き、対象の Microsoft 365 テナントの職場アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、Microsoft Copilot Studio を起動します。

左側の **Create** ボタンを選択します。以下のスクリーンショットを参照してください。

![Microsoft Copilot Studio のホーム ページ。新しいエージェントを作成するため **Create** ボタンが強調表示されています。](../../../assets/images/make/copilot-studio-01/make-agent-01.png)

新しい エージェント を作成できるページにリダイレクトされます。Copilot Studio では **New agent** を選択してゼロから作成するか、あらかじめ用意されたテンプレートから開始できます。このラボではシンプルに **New agent** を選択します。

![Microsoft Copilot Studio の **Create agent** ページ。新しいエージェントをゼロから作成する **New agent** オプションが強調表示されています。](../../../assets/images/make/copilot-studio-01/make-agent-02.png)

デフォルトでは、Copilot Studio に自然言語でエージェントの内容を説明できます。これは非常に便利で、必要な内容を記述するだけで Copilot Studio が処理し、設定に合った エージェント を作成してくれます。自然言語での説明を行わない場合は **Skip to configure** を選択し、手動で構成できます。

![自然言語でエージェントの動作と機能を説明している **Create agent** ページ。](../../../assets/images/make/copilot-studio-01/make-agent-03.png)

このラボでは以下の初期説明を入力します。

```txt
You are an agent helping employees to find information about HR policies and procedures,
about how to improve their career, and about how to define learning pathways.
```

Copilot Studio から求められたら、エージェント に「HR Agent」という名前を付けます。その後、以下の指示を入力して、Copilot Studio に特定情報を強調または除外するよう指示します。

```txt
Emphasize everything that helps team building, inclusion, and the growth mindset
```

次に、エージェント のトーンをプロフェッショナルに設定するため、以下を入力します。

```txt
It should have a professional tone
```

Copilot Studio からデータ ソースの指定を求められたら、次の指示を入力します。

```txt
Let's use this website: https://www.microsoft.com/en-us/human-resources
```

組織が指定したサイトを所有していることを確認する必要があります。

![Copilot Studio から、提供した Web サイトをユーザーの組織が所有しているか、Bing 検索結果を使用してよいか確認を求めるメッセージ。](../../../assets/images/make/copilot-studio-01/make-agent-confirm-web-datasource-04.png)

!!! pied-piper "Important"
    このサンプル エージェント では、データソースとして Microsoft の HR Web サイトに公開されているコンテンツを使用します。組織が該当サイトを所有していることを確認し、Microsoft Bing 検索結果の利用を許可してください。自身の エージェント を作成する際は、実際に所属企業が所有する HR サイトの URL を指定してください。

これでエージェント作成の準備が整いました。画面右側には、Copilot Studio に提供した指示に基づいて エージェント の機能と設定の概要が常に表示されます。右上の **Create** ボタンを選択し、Copilot Studio が エージェント を作成するのを待ちます。

エージェント が完成すると、次のような画面が表示されます。

![Copilot Studio のページ。新しく作成したエージェントと、さらなる調整を行うための設定項目が表示されています。](../../../assets/images/make/copilot-studio-01/make-agent-05.png)

右側のテスト パネルを使って エージェント を試したり、**Overview** タブの設定オプションから エージェント を微調整したりできます。

<cc-end-step lab="mcs1" exercise="1" step="1" />

### Step 2: エージェントのアイコンを変更する

まず **Overview** タブ右上の **Edit** ボタンを選択し、エージェント のアイコンを変更します。**Details** セクションが編集モードに切り替わります。

![エージェントの **Details** パネル（編集モード）。名前、アイコン、説明、指示を更新可能です。](../../../assets/images/make/copilot-studio-01/make-agent-edit-06.png)

演習 Step 1 で入力した内容が **Description** と **Instructions** のフィールドに反映されているのが確認できます。

**Change icon** ボタンを選択するとダイアログが表示され、カスタム アイコンをアップロードできます。必要であれば、この [アイコン](https://raw.githubusercontent.com/microsoft/copilot-camp/refs/heads/main/src/make/copilot-studio/HR-agent-color.png){target=_blank} を使用できます。

![エージェントの **Details** パネル（編集モード）。アイコン変更を行う画面。](../../../assets/images/make/copilot-studio-01/make-agent-change-icon-07.png)

新しいアイコンをアップロードしたら **Save** ボタンを選択します。

<cc-end-step lab="mcs1" exercise="1" step="2" />

### Step 3: エージェントをテストする

エージェント のテストは、右側のパネルでプロンプトを入力するだけです。例として次のプロンプトを入力してみましょう。

```txt
What is our mission?
```

以下のスクリーンショットは、データソースとして指定した Web サイトの内容に基づいて エージェント が回答している様子です。

![**Test** パネルでのユーザーとエージェントの対話。ユーザーが 'What is our mission?' と尋ね、エージェントがデータソース Web サイトの内容に基づき回答し、該当ページへの参照を提示。](../../../assets/images/make/copilot-studio-01/make-agent-test-08.png)

エージェント は回答にデータソースのページ参照を追加し、回答が Azure OpenAI から生成されたことを明示しています。

<cc-end-step lab="mcs1" exercise="1" step="3" />

## Exercise 2 : ナレッジベースの拡張

この演習では、Microsoft SharePoint Online に保存されている Word と PDF ドキュメントを、エージェント の追加ナレッジベースとして登録します。

### Step 1: SharePoint Online のナレッジベース ドキュメントを追加する

この [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} から、Word、PowerPoint、PDF のファイルを含む ZIP ファイルをダウンロードします。

ZIP を解凍し、同じテナント内の任意の SharePoint Teams サイトの **Documents** ライブラリにアップロードします。これらのドキュメントは、エージェント に追加ナレッジベースを提供するため、Microsoft 365 Copilot で生成されたものです。

サイトの絶対 URL をコピーします。例: `https://xyz.sharepoint.com/sites/contoso`

![エージェントの **Overview** タブ。**+ Add knowledge** ボタンが強調表示されています。](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-01.png)

先ほど作成したエージェント の **Overview** タブを開き、**Knowledge** セクションまでスクロールします。Exercise 1 の Step 1 で構成した Web サイトが表示されています。**+ Add knowledge** を選択し、SharePoint サイトとそのドキュメントを追加ナレッジソースとして設定します。

![追加ナレッジを構成するダイアログ。Public websites、SharePoint、Dataverse、その他の高度なデータソース が選択可能。](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-02.png)

表示されたダイアログでは、以下のような追加ナレッジソースを登録できます。

- Files: 手動でアップロードしたファイルをナレッジベースに追加  
- Public websites: 追加の Web サイト  
- SharePoint: SharePoint Online のサイトまたはライブラリ  
- Dataverse: Dataverse のテーブル  
- Advanced: Azure AI Search、Azure SQL、Microsoft Copilot Connectors、サードパーティー データ接続などのエンタープライズ データ接続

**SharePoint** を選択し、表示されるダイアログでファイルをアップロードしたサイト URL を入力し **Add** を選択します。

![SharePoint データソース追加ダイアログ。特定のファイルを検索する **Browse files** ボタン、サイト URL 入力欄、**Add** ボタン。](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-03.png)

SharePoint データソースを構成する際は、**Name** と **Description** の入力も必要です。意味のある名前と説明を設定することが重要です。Copilot Studio はデータソースの内容を理解しやすくなり、今後のラボで生成 AI オーケストレーションを有効にした際、ユーザーのプロンプトに対して適切なデータソースを特定できます。

![データソース名と説明が入力された SharePoint データソース追加ダイアログ。](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-04.png)

画面下部の **Add** ボタンを選択し、Copilot Studio が新しいナレッジベースを処理するのを待ちます。

ナレッジベースが更新されると、**Overview** タブに公開 Web サイトと SharePoint Online サイトの両方が表示されます。

![**Overview** ページの **Knowledge** セクション。Web サイトと SharePoint Online サイトの 2 つのデータソースが表示。](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-05.png)

!!! warning "Important"
    Copilot Studio で SharePoint Online サイトをナレッジベースとして構成すると、 ユーザー はアクセス権を持つドキュメントのみ参照できます。セキュリティとアクセス制御は Microsoft 365 のセキュリティ基盤によって保証され、Copilot Studio のエージェント は現在のユーザーとしてドキュメントにアクセスします。

<cc-end-step lab="mcs1" exercise="2" step="1" />

### Step 2: 更新したエージェントをテストする

右側のパネルで再度 エージェント をテストします。次のプロンプトを入力してみましょう。

```txt
How can we hire new people in our company?
```

エージェント は採用手続きに関する情報を返し、SharePoint Online ナレッジベース内のドキュメントへの参照を提示します。

![テスト パネルでの会話と、SharePoint Online ナレッジベースから取得したドキュメントの参照が表示。](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-06.png)

次に、確認のため以下のプロンプトを入力してください。

```txt
How can I cook spaghetti alla carbonara?
```

HR とは無関係なリクエストにもエージェントが回答することがわかります。もちろん、スパゲッティ・アラ・カルボナーラの作り方も教えてくれるでしょう！🍝 しかし、この挙動は本来の目的からは外れています。エージェント は特定のトピックや領域に特化したアシスタントであるべきだからです。

<cc-end-step lab="mcs1" exercise="2" step="2" />

### Step 3: 一般知識を無効化する

エージェント をカスタム ナレッジベースにのみ集中させたい場合は、**General knowledge** を無効にします。**Overview** タブに戻り、**Knowledge** セクションへスクロールして "Allow the AI to use its own general knowledge" オプションをオフにします。

![**Overview** タブで **Knowledge** を構成する際の "AI general knowledge" 無効化オプション。](../../../assets/images/make/copilot-studio-01/make-agent-general-knowledge-01.png)

このオプションをオフにすると確認ダイアログが表示され、何が起こるか説明されます。つまり、明示的に構成した情報以外は エージェント が使用しなくなります。

![一般知識を無効にするか確認するダイアログ。**Continue** ボタンと **Cancel** ボタン。](../../../assets/images/make/copilot-studio-01/make-agent-general-knowledge-02.png)

**Confirm** を選択すると、処理中であることを示すダイアログが表示されます。

![エージェントの一般知識無効化処理が進行中であることを示すダイアログ。](../../../assets/images/make/copilot-studio-01/make-agent-general-knowledge-03.png)

一般知識が無効になったら、再度まったく無関係な質問を行ってみてください。 

![設定したナレッジベースと無関係な質問に対して、エージェント が支援できない旨を回答。](../../../assets/images/make/copilot-studio-01/make-agent-general-knowledge-04.png)

エージェント から適切に「お手伝いできません」という回答が返ってくるはずです。

!!! note "General knowledge についての追加情報"
    Microsoft Copilot Studio のエージェントで使用するナレッジソースについては、[こちらの記事](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio){target=_blank} を参照してください。

<cc-end-step lab="mcs1" exercise="2" step="3" />

## Exercise 3 : エージェントの発行

このラボの最後の演習では、作成した エージェント を Microsoft Teams に発行します。

### Step 1: エージェントを Microsoft Teams に発行する

Copilot Studio で エージェント を発行するには、エージェント エディター右上の **Publish** ボタンを選択します。

![エージェント エディターで発行ボタンが強調表示。](../../../assets/images/make/copilot-studio-01/make-agent-publish-01.png)

コマンドを選択すると確認が表示されます。確認後、発行処理が開始され「Publishing ...」と表示されます。発行は対象の Power Platform 環境に エージェント を登録しますが、まだ任意のプラットフォームには配置されません。

実際に特定プラットフォーム（チャネル）で利用可能にするには、1️⃣ エージェント エディターの **Channels** タブを選択し、2️⃣ **Teams + Microsoft 365** チャネルを選択して Microsoft Teams に公開します。

![**Channels** タブ。Telephony、Teams + Microsoft 365、Demo website、Custom website などのチャネル一覧。](../../../assets/images/make/copilot-studio-01/make-agent-publish-02.png)

デフォルトでは Microsoft 認証が構成されており、Teams、Power Apps、Microsoft 365 Copilot で Microsoft Entra ID を利用します。この認証設定では Microsoft Teams にのみ発行可能である旨が、前述のスクリーンショット上部の警告メッセージに表示されています。 

!!! note "Copilot Studio の認証モデル"
    Copilot Studio の エージェント 認証については [Configure user authentication in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication){target=_blank} を参照してください。

!!! note "Microsoft Copilot Studio の Premium license"
    上記スクリーンショットにはライセンスモデルと Premium license の要件に関する情報バーも表示されています。Copilot Studio で Premium コネクターなどのプレミアム機能を利用する場合はライセンスをアップグレードする必要があります。学習やテスト目的であれば 60 日間の Premium license 無料トライアルを開始できます。

**Teams + Microsoft 365** チャネルを選択するとサイドパネルが表示され、**Add channel** ボタンを選択できます。

![Microsoft Teams チャネルを有効化するサイドパネル。現在の状態説明と **Add channel** ボタン。](../../../assets/images/make/copilot-studio-01/make-agent-publish-03.png)

Microsoft Teams チャネルが有効になると、サイドパネルが更新され確認メッセージと詳細編集や Teams クライアントで開くコマンドが表示されます。**Availability options** ボタンもあり、Microsoft Teams で エージェント にアクセスする方法を確認できます。

![Microsoft Teams チャネル有効化後のサイドパネル。**Turn on Teams** と **Cancel** のボタンが表示。](../../../assets/images/make/copilot-studio-01/make-agent-publish-04.png)

**Availability options** では次の操作が可能です。

- Microsoft Teams で エージェント を開くリンクをコピー  
- Teams アプリ ストアにアップロードできる ZIP パッケージをダウンロード  
- 組織全体または選択した ユーザー 向けに Teams アプリ ストアで公開  

![Microsoft Teams でのエージェント利用オプションを表示するサイドパネル。リンクコピー、Teams アプリ ストア公開、ZIP ダウンロードのボタンあり。](../../../assets/images/make/copilot-studio-01/make-agent-publish-05.png)

これで Microsoft Teams への エージェント 発行が完了しました。

<cc-end-step lab="mcs1" exercise="3" step="1" />

### Step 2: Microsoft Teams でエージェントをテストする

**Availability options** パネルで **Copy link** ボタンを選択し、リンクをコピーします。新しいブラウザー タブを開き、コピーしたリンクを貼り付けて ENTER キーを押します。

![Microsoft Teams に新しいアプリとして表示されたエージェント。アプリの詳細説明と **Add** ボタン。](../../../assets/images/make/copilot-studio-01/make-agent-test-teams-01.png)

最初に Microsoft Teams クライアントがエージェントを示す新しいアプリを表示します。**Add** ボタンを選択し、次のダイアログで **Open** を選択します。

![Microsoft Teams に新しいアプリとして表示されたエージェント。アプリの詳細説明と **Add** ボタン。](../../../assets/images/make/copilot-studio-01/make-agent-test-teams-02.png)

しばらくすると Microsoft Teams クライアントにボットとのチャットが表示されます。次のプロンプトを入力してみましょう（以前使用したものと同じです）。

```txt
How can we hire new people in our company?
```

回答を待つと、HR に関連するコンテンツとナレッジベースのドキュメント参照を含む回答が返ります。

![Microsoft Teams に新しいアプリとして表示されたエージェント。アプリの詳細説明と **Add** ボタン。](../../../assets/images/make/copilot-studio-01/make-agent-test-teams-03.png)

回答の先頭には「AI generated」である旨の注意書きがあり、ユーザー に AI プラットフォームの利用を知らせています。

<cc-end-step lab="mcs1" exercise="3" step="2" />

---8<--- "ja/mcs-congratulations.md"

これでエージェントは完全に機能し、Microsoft Teams で利用可能になりました。次のラボでは、動作をさらにカスタマイズし細部を調整します。

<a href="../02-topics">こちらから</a> Lab MCS2 を開始し、Copilot Studio で エージェント のトピックを定義しましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/01-first-agent" />