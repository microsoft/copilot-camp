---
search:
  exclude: true
---
# Lab MCS1 - First エージェント

このラボでは、Microsoft Copilot Studio を使用して最初のエージェントを作成します。これから作成するエージェントは、ユーザーが採用またはレイオフの手続き、キャリア向上、学習パスの定義に関する人事ポリシーおよびプロセスの情報を見つけるのを支援します。  
エージェントの知識ベースは、SharePoint Online に保存された一連のドキュメントと一部の公開 Web コンテンツとなります。

このラボで学習する内容:

- Microsoft Copilot Studio を使用してエージェントを作成する方法
- エージェント用のカスタムアイコンを設定する方法
- エージェントの知識ソースを構成する方法
- Microsoft Teams でエージェントを公開する方法

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RF9RBhPp6v8" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を手早くご確認いただけます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>


!!! pied-piper "注意事項"
    これらのコード例およびラボは、指導およびデモンストレーションの目的で提供されており、本番環境での使用を意図していません。本番品質にアップグレードせずに本番環境へ投入しないでください。

## エクササイズ 1 : Microsoft Copilot Studio でのエージェント作成

最初のエクササイズでは、 Generative AI を使用し、求めるものを記述することで新しいエージェントを作成します。また、エージェントのカスタムアイコンを設定し、エージェントをテストします。

### 手順 1: 新しいエージェントの作成

新しいエージェントを作成するには、ブラウザーを開き、対象の Microsoft 365 テナントの作業用アカウントを使用して、[https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、 Microsoft Copilot Studio の使用を開始してください。

画面左側の **Create** ボタンを選択します。以下のスクリーンショットに示されています。

![Microsoft Copilot Studio のホームページ。新しいエージェントを作成するために **Create** ボタンがハイライトされています。](../assets/images/make/copilot-studio-01/make-agent-01.png)

新しいエージェントを作成するページにリダイレクトされます。 Copilot Studio では、 **New agent** オプションを選択してゼロから新しいエージェントを作成するか、事前定義済みで有用なエージェントテンプレートのセットからテンプレートを選択して作成するかが可能です。ここでは簡略化のため、このラボではゼロから作成するために **New agent** を選択します。

![Microsoft Copilot Studio の **Create agent** ページ。ゼロから新しいエージェントを作成するために **New agent** オプションがハイライトされています。](../assets/images/make/copilot-studio-01/make-agent-02.png)

デフォルトでは、 Copilot Studio はエージェントがどのようなものであるかを自然言語で記述する方法をサポートします。これは、新しいエージェントを簡単に作成する非常に便利な方法です。なぜなら、求めるものを記述するだけで、 Copilot Studio が入力を処理し、ニーズに合わせたエージェントを作成してくれるからです。もし、自然言語でエージェントを記述する方法が好みでない場合は、常に **Skip to configure** を選択して、エージェントを手動で構成することもできます。

![自然言語でエージェントの動作および能力を記述している Microsoft Copilot Studio の **Create agent** ページ。](../assets/images/make/copilot-studio-01/make-agent-03.png)

このラボでは以下の初期記述を提供できます:

```txt
You are an agent helping employees to find information about HR policies and procedures,
about how to improve their career, and about how to define learning pathways.
```

Copilot Studio からの要求があった場合は、カスタムエージェントに「HR Agent」という名前を付けてください。次に、 Copilot Studio に対し、以下の指示を提供し、特定の情報を強調または省略するように指示します:

```txt
Emphasize everything that helps team building, inclusion, and the growth mindset
```

その後、以下の入力を提供してエージェントに専門的なトーンを定義します:

```txt
It should have a professional tone
```

Copilot Studio から要求があった際には、以下の指示を提供してエージェントの初期データソースを構成してください:

```txt
Let's use this website: https://www.microsoft.com/en-us/human-resources
```

組織が提供したサイトの所有権を有していることを確認する必要があります。

![現在のユーザーの組織が提供された Web サイトの所有権を持っており、 Bing 検索結果を使用できるか確認するように求める Copilot Studio からのメッセージ。](../assets/images/make/copilot-studio-01/make-agent-confirm-web-datasource-04.png)

!!! pied-piper "重要"
    このサンプルエージェントでは、データソースとして Microsoft の HR Web サイト上の一部の公開コンテンツを使用します。また、エージェントのデータソースとして提供するサイトの所有権を組織が有していることを確認する必要があります。

これで、エージェントの作成の準備は完了です。画面右側には、 Copilot Studio に提供した指示に基づいて構成されたエージェントの機能および能力の概要が常に表示されます。  
画面右上の **Create** ボタンを選択し、 Copilot Studio がエージェントを作成するのを待ってください。

エージェントが準備完了になると、以下のような新しい画面が表示されます。

![新しいエージェントが作成され、今後さらに詳細な設定が可能な Copilot Studio のページ。](../assets/images/make/copilot-studio-01/make-agent-05.png)

これで、右側のテストパネルを使用してエージェントのテストを開始するか、または **Overview** タブ内の構成オプションを使用してエージェントの設定を微調整することができます。

<cc-end-step lab="mcs1" exercise="1" step="1" />

### 手順 2: エージェントのアイコンの変更

エージェントのアイコンを変更するために、まず **Overview** タブの右上にある **Edit** ボタンを選択してください。  
以下の画面のように、 **Details** セクションが編集モードに切り替わります。

![エージェントの **Details** パネル（編集モード）。ここでは、エージェントの名前、アイコン、説明、および指示を更新できます。](../assets/images/make/copilot-studio-01/make-agent-edit-06.png)

手順 1 で提供した入力文が、エージェントの **Description** および **Instructions** フィールドに含まれているのがわかります。

**Change icon** ボタンを選択して、カスタムアイコンをアップロードするダイアログを表示してください。希望する場合は、[こちらのアイコン](https://raw.githubusercontent.com/microsoft/copilot-camp/refs/heads/main/src/make/copilot-studio/HR-agent-color.png){target=_blank} を利用できます。

![エージェントの **Details** パネル（編集モード）。ここでは、エージェントの名前、アイコン、説明、および指示を更新できます。](../assets/images/make/copilot-studio-01/make-agent-change-icon-07.png)

新しいアイコンのアップロードが完了したら、**Save** ボタンを選択してください。

<cc-end-step lab="mcs1" exercise="1" step="2" />

### 手順 3: エージェントのテスト

エージェントをテストするには、右側のパネルに依存してプロンプトの入力を開始してください。たとえば、以下のプロンプトを提供してみます:

```txt
What is our mission?
```

以下のスクリーンショットでは、エージェントがデータソースとして提供された Web サイトの内容に基づいて回答を提供している様子が表示されています。

![ユーザーが「What is our mission?」と尋ね、エージェントがデータソースのページへの直接参照を含む内容で応答した **Test** パネル。](../assets/images/make/copilot-studio-01/make-agent-test-08.png)

また、エージェントはデータソースとして提供された Web サイトのページへの参照を示し、回答が Azure OpenAI から生成されたものであることを強調しています。

<cc-end-step lab="mcs1" exercise="1" step="3" />

## エクササイズ 2 : 知識ベースの拡張

このエクササイズでは、エージェントの追加の知識ベースとして、 Microsoft SharePoint Online に保存されたいくつかのドキュメント（Word および PDF）を追加します。

### 手順 1: SharePoint Online の知識ベースドキュメントの追加

この [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} を選択して、いくつかのファイル（Word、PowerPoint、PDF）からなる zip ファイルをダウンロードしてください。

zip ファイルを解凍し、ファイルを Copilot Studio を使用してエージェントを作成している同じテナント内の SharePoint Teams サイトの **Documents** ライブラリにアップロードします。これらのドキュメントは、エージェントに追加の知識ベースを提供するために Microsoft 365 Copilot によって生成されたものです。

サイトの絶対 URL をコピーしてください。たとえば: `https://xyz.sharepoint.com/sites/contoso`

![エージェントの **Overview** タブ内で **+ Add knowledge** ボタンがハイライトされている様子。](../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-01.png)

以前作成したエージェントの **Overview** タブから、**Knowledge** セクションまでスクロールします。手順 1 のエクササイズで構成した Web サイトが表示されます。**+ Add knowledge** を選択して、SharePoint サイトとそのドキュメントを追加の知識ソースとして追加してください。

![エージェント用に追加知識を構成するためのダイアログウィンドウ。オプションとして、公開 Web サイト、SharePoint、Dataverse、またはその他の高度なデータソースがあります。](../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-02.png)

ポップアップするダイアログウィンドウから、以下のような追加の知識ソースを追加できます:

- Files: 知識ベースの一部となるファイルを手動でアップロードするため
- Public websites: 追加の Web サイトを追加するため
- SharePoint: SharePoint Online のサイトまたはライブラリを構成するため
- Dataverse: Dataverse のテーブルを追加するため
- Advanced: Azure AI Search、Azure SQL、Microsoft Copilot Connectors、またはサードパーティのデータ接続などのエンタープライズデータ接続を使用するため

**SharePoint** を選択し、ポップアップするダイアログでファイルをアップロードしたサイトの URL を提供し、**Add** を選択してください。

![SharePoint データソースを追加するためのダイアログ。特定のファイルを検索するための **Browse files** ボタン、サイトの URL を入力するテキストボックス、そして **Add** ボタンがあります。](../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-03.png)

SharePoint データソースを構成する際には、 **Name** と **Description** を指定する必要があります。意味のある名前と説明を提供することは非常に重要です。実際、 Copilot Studio はデータソース内の内容をよりよく理解でき、今後のラボで生成型オーケストレーションを有効化する際に、ユーザーの入力に応じた適切なデータソースを識別できるようになります。

![適切な名前と説明が付与されたデータソースが選択されている SharePoint データソース追加用のダイアログ。](../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-04.png)

画面下部の **Add** ボタンを選択し、Copilot Studio が追加した新しい知識ベースを処理するのを待ちます。

知識ベースの更新が完了すると、**Overview** タブには公開 Web サイトと SharePoint Online サイトの両方が表示されます。

![**Overview** ページの **Knowledge** セクション。ウェブサイトと SharePoint Online サイトの 2 つのデータソースが表示されています。](../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-05.png)

!!! warning "重要"
    Copilot Studio のエージェントに知識ベースとして SharePoint Online サイトを構成する場合、ユーザーは自分がアクセス権を持つドキュメントからのみ回答およびコンテンツを取得できるようになります。セキュリティおよびアクセス制御は Microsoft 365 のセキュリティインフラストラクチャによって保証され、Copilot Studio エージェントは現在のユーザーの代理としてドキュメントにアクセスします。

<cc-end-step lab="mcs1" exercise="2" step="1" />

### 手順 2: 更新されたエージェントのテスト

右側のパネルを使用してエージェントを再度テストできます。たとえば、以下のプロンプトを提供してみます:

```txt
How can we hire new people in our company?
```

エージェントは、採用手続きに関する情報と、提供された SharePoint Online の知識ベースに保存されているドキュメントへの参照を含む情報で応答します。

![SharePoint Online の知識ベースから取得されたドキュメントへの参照を含む対話が行われているテストパネル。](../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-06.png)

次に、完全性のため、以下のプロンプトもエージェントに提供してみてください:

```txt
How can I cook spaghetti alla carbonara?
```

HR 関連のトピックに関係のないリクエストであっても、エージェントから回答が返されることにお気づきになるでしょう。もちろん、パスタがお好きな方は、スパゲッティ アッラ カルボナーラの調理法を尋ねることも可能です！🍝 しかし、ここで見受けられる挙動は、エージェントの本来の意図された動作とは必ずしも言えません。実際、エージェントは特定のトピックまたは分野に特化したアシスタントであるべきです。

<cc-end-step lab="mcs1" exercise="2" step="2" />

### 手順 3: 一般知識の無効化

エージェントを独自の知識ベースに完全に専念させたい場合は、 **General knowledge** を無効にする必要があります。  
右上の **Settings** コマンドを選択し、（デフォルトで有効になっている） **Generative AI** タブを有効にした後、**Knowledge** セクションまでスクロールし、以下のスクリーンショットに示されているように "Use general knowledge" オプションを無効にしてください。

![エージェントの **Settings** における **Knowledge** 設定中の "AI general knowledge" 無効化オプション。](../assets/images/make/copilot-studio-01/make-agent-general-knowledge-01.png)

一般知識が無効になった状態で、文脈とは全く関係のない内容をエージェントに再度尋ねてみてください。

![エージェントがその構成された知識ベースに関連しない内容を尋ねられた際の応答。](../assets/images/make/copilot-studio-01/make-agent-general-knowledge-04.png)

!!! note "一般知識に関する追加情報"
    Microsoft Copilot Studio で作成したエージェントの知識ソースに関する追加情報は、[こちらの記事](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio){target=_blank} をご覧ください。

<cc-end-step lab="mcs1" exercise="2" step="3" />

## エクササイズ 3 : エージェントの公開

このラボの最終エクササイズでは、Microsoft Teams でカスタムエージェントを公開します。

### 手順 1: Microsoft Teams でのエージェントの公開

Copilot Studio で作成したエージェントを公開するには、エージェントエディターの右上にある **Publish** ボタンを選択する必要があります。

![エージェントエディターのユーザーインターフェース上で公開用のボタンがハイライトされています。](../assets/images/make/copilot-studio-01/make-agent-publish-01.png)

このコマンドを選択すると確認のプロンプトが表示されます。確認すると、公開プロセスにしばらく時間がかかり、その間 "Publishing ..." のメッセージが表示されます。エージェントの公開は、対象の Power Platform 環境に登録されますが、特定の対象プラットフォームで利用可能になるわけではありません。

エージェントを実際に特定の対象プラットフォーム（チャネル）で利用可能にするには、まず 1️⃣ エージェントエディターの **Channels** タブを選択し、次に 2️⃣ 対象チャネルとして**Teams + Microsoft 365** を選択する必要があります。たとえば、エージェントを bot として Microsoft Teams で公開するためには、**Teams + Microsoft 365** を対象チャネルとして選択してください。

![エージェントを 1 つ以上のチャネルで利用可能にするための **Channels** タブ。 "Telephony"、"Teams + Microsoft 365"、"Demo website"、"Custom website" などの利用可能なチャネルがリストされています。](../assets/images/make/copilot-studio-01/make-agent-publish-02.png)

デフォルトでは、エージェントを作成し、デフォルトの設定で公開すると、エージェントは Microsoft 認証用に構成されます。つまり、エージェントは Teams、Power Apps、または Microsoft 365 Copilot で Microsoft Entra ID 認証に依存します。  
デフォルトの認証設定では、警告メッセージが前述の **Channels** タブの上部に表示されていることからもわかるように、エージェントは Microsoft Teams にのみ公開できます。

!!! note "Copilot Studio 認証モデル"
    Copilot Studio のエージェント認証に関する詳細は、[Configure user authentication in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication){target=_blank} のドキュメントをご覧ください。

!!! note "Microsoft Copilot Studio の Premium ライセンス"
    上記のスクリーンショットには、ライセンスモデルおよび Premium ライセンスの潜在的な要件に関する情報バーも表示されています。実際、Copilot Studio のプレミアムコネクターなどのプレミアム機能を使用する場合は、ライセンスを適切にアップグレードする必要があります。幸いなことに、Microsoft Copilot Studio の学習およびテストを行うだけの場合、Premium ライセンスの 60 日間の無料トライアル期間を有効化することができます。

**Teams + Microsoft 365** チャネルを選択すると、サイドパネルが表示され、**Add channel** ボタンを選択することができます。

![Microsoft Teams チャネルを有効にするためのサイドパネル。現在の状態の説明と **Add channel** ボタンが表示されています。](../assets/images/make/copilot-studio-01/make-agent-publish-03.png)

エージェントが Microsoft Teams チャネルで有効になると、サイドパネルが更新され、確認メッセージとともに、エージェントの詳細を編集するためのコマンドや、Microsoft Teams クライアントでエージェントを開くためのコマンドが表示されます。さらに、Microsoft Teams でエージェントへアクセスするためのさまざまなオプションを確認できる **Availability options** ボタンも表示されます。

Microsoft 365 Copilot をサポートするチャネルを登録している場合は、Microsoft 365 Copilot チャットユーザーエクスペリエンスで直接エージェントにアクセスできる **See agent in Microsoft 365** リンクも選択できます。

![Microsoft Teams チャネル有効化用のサイドパネル。現在の状態の説明と、**Turn on Teams** および **Cancel** の 2 つのボタンが表示されています。](../assets/images/make/copilot-studio-01/make-agent-publish-04.png)

**Availability options** ボタンを選択すると、以下の操作が可能です:

- Microsoft Teams でエージェントを使用するためのリンクのコピー
- Teams のアプリストアにアップロード可能なパッケージが含まれた ZIP ファイルのダウンロード
- エージェントを Teams のアプリストアで利用可能にし、組織全体または選択されたユーザー向けに公開するオプションの選択

![Microsoft Teams でのエージェントの利用オプションを表示するサイドパネル。Teams でのエージェントへのリンクコピー、Teams アプリストアでのエージェントの公開、および他テナントでエージェントを共有するためのエージェントパッケージの zip ファイルのダウンロードボタンが表示されています。](../assets/images/make/copilot-studio-01/make-agent-publish-05.png)

Microsoft Teams でのエージェントの公開はこれで完了です。

<cc-end-step lab="mcs1" exercise="3" step="1" />

### 手順 2: Microsoft Teams でのエージェントのテスト

これで、Microsoft Teams でエージェントのテストを行う準備が整いました。  
**Availability options** パネルで **Copy link** ボタンを選択し、エージェントへのリンクをコピーしてください。次に、新しいブラウザータブを開き、コピーしたリンクを貼り付け、ENTER キーを押してその URL にアクセスします。

![Microsoft Teams の新しいアプリとしてエージェントが表示されたダイアログウィンドウ。エージェントおよびアプリの詳細な説明が表示され、Microsoft Teams へアプリを追加するための **Add** ボタンもあります。](../assets/images/make/copilot-studio-01/make-agent-test-teams-01.png)

最初は、Microsoft Teams クライアントにエージェントを表す新しいアプリが表示されます。  
**Add** ボタンを選択してアプリをクライアントに追加し、次のダイアログで **Open** を選択してください。

![Microsoft Teams の新しいアプリとしてエージェントが表示されたダイアログウィンドウ。エージェントおよびアプリの詳細な説明が表示され、Microsoft Teams へアプリを追加するための **Add** ボタンもあります。](../assets/images/make/copilot-studio-01/make-agent-test-teams-02.png)

しばらくすると、Microsoft Teams クライアントにはボットとのチャットが表示されます。これは実際にはあなたのエージェントです。たとえば、これまでに使用したプロンプト:

```txt
How can we hire new people in our company?
```

を入力してください。

回答を待つと、エージェントは HR の文脈および知識ベースのドキュメントへの参照を含む内容で応答します。

![Microsoft Teams の新しいアプリとしてエージェントが表示されたダイアログウィンドウ。エージェントおよびアプリの詳細な説明が表示され、Microsoft Teams へアプリを追加するための **Add** ボタンもあります。](../assets/images/make/copilot-studio-01/make-agent-test-teams-03.png)

また、回答の冒頭に「AI generated」という注意事項が表示され、ユーザーに AI プラットフォームを利用していることが明示されています。

<cc-end-step lab="mcs1" exercise="3" step="2" />

---8<--- "ja/mcs-congratulations.md"

これで、エージェントは完全に機能し、Microsoft Teams で使用できる状態になりました。次のラボでは、エージェントの動作をカスタマイズおよび微調整することができます。

<a href="/ja/pages/02-topics">Lab MCS2</a> から開始し、Microsoft Copilot Studio でエージェントのトピックを定義してください。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/01-first-agent" />