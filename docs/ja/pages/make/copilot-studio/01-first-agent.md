---
search:
  exclude: true
---
# ラボ MCS1 - 最初のエージェント

このラボでは、Microsoft Copilot Studio で初めてのエージェントを作成します。作成するエージェントは、ユーザーが従業員の採用・解雇に関する HR ポリシーや手続き、キャリア開発、学習パスの策定に関する情報を見つける手助けをします。エージェントのナレッジ ベースは、SharePoint Online に保存された一連のドキュメントと公開されている Web コンテンツです。

このラボで学習すること:

- Copilot Studio でエージェントを作成する方法
- エージェントのカスタム アイコンを設定する方法
- エージェントのナレッジ ソースを構成する方法
- Microsoft Teams でエージェントを公開する方法

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RF9RBhPp6v8" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を素早く確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>


!!! pied-piper "注意事項"
    これらのサンプルおよびラボは、学習とデモンストレーションの目的で提供されています。本番環境での利用を想定していません。本番環境で使用する場合は、必ず本番品質へアップグレードしてください。

## Exercise 1 : Copilot Studio でエージェントを作成する

最初の演習では、Generative AI を利用し、探している内容を説明して新しいエージェントを作成します。また、エージェントにカスタム アイコンを設定し、テストも行います。

### Step 1: 新しいエージェントの作成

ブラウザーを開き、対象 Microsoft 365 テナントの職場アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、Microsoft Copilot Studio を起動します。

次のスクリーン ショットのように、画面左側の **Create** ボタンを選択します。

![Microsoft Copilot Studio のホーム ページ。新しいエージェントを作成するために **Create** ボタンが強調表示されている。](../../../assets/images/make/copilot-studio-01/make-agent-01.png)

新しいエージェントを作成するページにリダイレクトされます。Copilot Studio では、**New agent** を選択して一からエージェントを作成するか、あらかじめ用意されたテンプレートから開始できます。このラボでは簡単のため、一から作成する **New agent** を選択します。

![Microsoft Copilot Studio の **Create agent** ページ。**New agent** オプションが強調表示されている。](../../../assets/images/make/copilot-studio-01/make-agent-02.png)

既定では、Copilot Studio に自然言語でエージェントの概要を入力できます。これは非常に便利で、求めている内容を記述するだけで、Copilot Studio がその入力を処理し、ニーズに合わせてエージェントを生成します。自然言語での説明を行わない場合は **Skip to configure** を選択し、手動で設定することも可能です。

![Copilot Studio の **Create agent** ページ。自然言語でエージェントの動作と機能を説明している。](../../../assets/images/make/copilot-studio-01/make-agent-03.png)

このラボでは次の初期説明を入力してください。

```txt
You are an agent helping employees to find information about HR policies and procedures,
about how to improve their career, and about how to define learning pathways.
```

Copilot Studio から名前を求められたら、エージェントに「HR Agent」と入力します。続いて、Copilot Studio に強調または除外したい情報を次のように指示します。

```txt
Emphasize everything that helps team building, inclusion, and the growth mindset
```

次に、エージェントのトーンを「プロフェッショナル」に設定するため、次の入力を行います。

```txt
It should have a professional tone
```

Copilot Studio から初期データ ソースを尋ねられたら、次のように指定します。

```txt
Let's use this website: https://www.microsoft.com/en-us/human-resources
```

サイトが組織所有であることを確認する必要があります。

![Copilot Studio から、入力した Web サイトが組織所有であり Bing 検索結果を使用できるか確認するメッセージ。](../../../assets/images/make/copilot-studio-01/make-agent-confirm-web-datasource-04.png)

!!! pied-piper "重要"
    このサンプル エージェントでは、データ ソースとして Microsoft の HR サイトの公開コンテンツを使用します。提供したデータ ソースが組織所有であることを確認し、そのサイトでの Microsoft Bing 検索結果を有効にしてください。独自のエージェントを作成する際は、実際に自社が所有する HR サイトの URL を指定してください。


エージェントの作成準備が整いました。画面右側には常に、Copilot Studio に与えた指示を基に構成されたエージェントの機能と能力の概要が表示されます。
右上の **Create** ボタンを選択し、Copilot Studio がエージェントを作成するのを待ちます。

エージェントが完成すると、次のような画面が表示されます。

![Copilot Studio のページ。新しいエージェントが作成され、さらに設定を微調整できる。](../../../assets/images/make/copilot-studio-01/make-agent-05.png)

右側のテスト パネルでエージェントをすぐに試すことも、**Overview** タブの設定オプションで詳細を調整することもできます。

<cc-end-step lab="mcs1" exercise="1" step="1" />

### Step 2: エージェントのアイコンを変更する

まず、**Overview** タブ右上の **Edit** ボタンを選択し、エージェントのアイコンを変更します。
**Details** セクションが編集モードに切り替わります。

![エージェントの **Details** パネル（編集モード）。名前、アイコン、説明、指示を更新可能。](../../../assets/images/make/copilot-studio-01/make-agent-edit-06.png)

演習 1 の Step 1 で入力した内容が **Description** と **Instructions** に反映されていることが分かります。

**Change icon** ボタンを選択すると、カスタム アイコンをアップロードするダイアログが表示されます。必要であれば、[こちらのアイコン](https://raw.githubusercontent.com/microsoft/copilot-camp/refs/heads/main/src/make/copilot-studio/HR-agent-color.png){target=_blank} を使用できます。

![エージェントの **Details** パネル（編集モード）。名前、アイコン、説明、指示を更新可能。](../../../assets/images/make/copilot-studio-01/make-agent-change-icon-07.png)

新しいアイコンをアップロードしたら **Save** を選択します。

<cc-end-step lab="mcs1" exercise="1" step="2" />

### Step 3: エージェントのテスト

右側のパネルを使用して、プロンプトを入力するだけでエージェントをテストできます。例えば、次のプロンプトを入力します。

```txt
What is our mission?
```

次のスクリーン ショットは、エージェントがデータ ソースとして指定した Web サイトの内容を基に返答した例です。

![**Test** パネル。ユーザーが「What is our mission?」と質問し、エージェントがデータ ソース Web ページを引用して回答している。](../../../assets/images/make/copilot-studio-01/make-agent-test-08.png)

エージェントが回答にデータ ソースのページへの参照を含み、Azure OpenAI からの回答であることを示している点にも注目してください。

<cc-end-step lab="mcs1" exercise="1" step="3" />

## Exercise 2 : ナレッジ ベースの拡張

この演習では、Microsoft SharePoint Online に保存されているドキュメント (Word・PDF) をエージェントの追加ナレッジ ベースとして追加します。 

### Step 1: SharePoint Online のナレッジ ベース ドキュメントの追加

[こちらのリンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank} から、複数のファイル (Word、PowerPoint、PDF) を含む zip ファイルをダウンロードします。

zip を解凍し、Copilot Studio でエージェントを作成しているのと同じテナント内の SharePoint Teams サイトの **Documents** ライブラリにアップロードします。これらのドキュメントは、Microsoft 365 Copilot で生成され、エージェントに提供する追加のナレッジ ベースとして用意されたものです。

サイトの絶対 URL をコピーします。例: `https://xyz.sharepoint.com/sites/contoso`

![エージェントの **Overview** タブ。**+ Add knowledge** ボタンが強調表示されている。](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-01.png)

先ほど作成したエージェントの **Overview** タブで **Knowledge** セクションまでスクロールします。Exercise 1 の Step 1 で構成した Web サイトが表示されているはずです。**+ Add knowledge** を選択し、SharePoint サイトとそのドキュメントを追加ナレッジ ソースとして設定します。

![エージェントに追加ナレッジを設定するダイアログ。Public websites、SharePoint、Dataverse、Advanced などのオプションがある。](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-02.png)

ポップアップするダイアログから次のようなナレッジ ソースを追加できます。

- Files: ファイルを手動でアップロードしてナレッジ ベースに追加
- Public websites: 追加の Web サイトを指定
- SharePoint: SharePoint Online のサイトやライブラリを構成
- Dataverse: Dataverse のテーブルを追加
- Advanced: Azure AI Search、Azure SQL、Microsoft Copilot Connectors、サードパーティ データ接続などのエンタープライズ データ接続を利用

**SharePoint** を選択し、表示されたダイアログでアップロードしたファイルのサイト URL を入力して **Add** を選択します。

![SharePoint データ ソースを追加するダイアログ。特定ファイルを検索する **Browse files** ボタン、サイト URL を入力するテキストボックス、**Add** ボタンがある。](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-03.png)

SharePoint データ ソースを設定するときは **Name** と **Description** も指定する必要があります。意味のある名前と説明を付けることが重要です。Copilot Studio がデータ ソースの内容を理解しやすくなり、今後のラボでジェネレーティブ オーケストレーションを有効化する際に、生成 AI がユーザーのプロンプトに応じて適切なデータ ソースを特定できるようになります。

![SharePoint データ ソースを追加するダイアログ。名前と説明が適切に入力されている。](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-04.png)

画面下部の **Add** ボタンを選択し、Copilot Studio が新しいナレッジ ベースを処理するまで待ちます。

ナレッジ ベースが更新されると、**Overview** タブに公開 Web サイトと SharePoint Online サイトの両方が表示されます。

![**Overview** ページの **Knowledge** セクション。Web サイトと SharePoint Online サイトの 2 つのデータ ソースが表示されている。](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-05.png)

!!! warning "重要"
    Copilot Studio でエージェントのナレッジ ベースとして SharePoint Online のサイトを構成する場合、ユーザーは自分がアクセス権を持つドキュメントのみから回答や内容を取得できます。セキュリティとアクセス制御は Microsoft 365 のセキュリティ基盤によって保証され、Copilot Studio のエージェントは現在のユーザーを代表してドキュメントにアクセスします。

<cc-end-step lab="mcs1" exercise="2" step="1" />

### Step 2: 更新されたエージェントのテスト

右側のパネルで再度エージェントをテストできます。例えば、次のプロンプトを入力します。

```txt
How can we hire new people in our company?
```

エージェントは採用手続きに関する情報を回答し、SharePoint Online のナレッジ ベース ドキュメントへの参照を示します。

![テスト パネル。エージェントとの会話と、SharePoint Online ナレッジ ベースから取得したドキュメントの参照が表示されている。](../../../assets/images/make/copilot-studio-01/make-agent-spo-knowledge-06.png)

次に、参考までに次のプロンプトを入力してみてください。

```txt
How can I cook spaghetti alla carbonara?
```

HR と無関係な質問であっても、エージェントから回答が返ってくることに気付くでしょう。もちろん、スパゲッティ アラ カルボナーラを作っても良いですが 🍝、これは必ずしもエージェントの意図した動作ではありません。エージェントは特定のトピックや領域に特化したアシスタントであるべきだからです。

<cc-end-step lab="mcs1" exercise="2" step="2" />

### Step 3: 一般知識の無効化

エージェントをカスタム ナレッジ ベースのみに完全に集中させたい場合は、**General knowledge** を無効にする必要があります。
右上の **Settings** コマンドを選択し、既定でアクティブな **Generative AI** タブを開き、**Knowledge** セクションまでスクロールして「Use general knowledge」を無効化します。

![エージェント **Settings** で **Knowledge** を構成する際、「AI general knowledge」を無効化するオプション。](../../../assets/images/make/copilot-studio-01/make-agent-general-knowledge-01.png)

一般知識を無効にしたら、再度まったく無関係な質問をエージェントに投げてみてください。 

![設定したナレッジ ベースと無関係な質問をした際のエージェントの回答。](../../../assets/images/make/copilot-studio-01/make-agent-general-knowledge-04.png)

今度は、エージェントが求めている内容を手伝えない旨を適切に通知します。

!!! note "一般知識に関する追加情報"
    Microsoft Copilot Studio で作成したエージェントのナレッジ ソースについては、[こちらの記事](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio){target=_blank} を参照してください。

<cc-end-step lab="mcs1" exercise="2" step="3" />

## Exercise 3 : エージェントの公開

このラボ最後の演習では、作成したカスタム エージェントを Microsoft Teams に公開します。

### Step 1: Microsoft Teams へのエージェント公開

Copilot Studio で作成したエージェントを公開するには、エージェント エディター右上の **Publish** ボタンを選択します。

![エージェント エディターの UI。公開ボタンが強調表示されている。](../../../assets/images/make/copilot-studio-01/make-agent-publish-01.png)

コマンドを選択すると確認ダイアログが表示されます。確認後、公開プロセスが始まり「Publishing ...」というメッセージが表示されます。公開すると、エージェントが対象の Power Platform 環境に登録されますが、まだどのプラットフォームにも配置されていません。

実際にエージェントを特定のプラットフォーム (チャネル) で利用可能にするには、1️⃣ エージェント エディターの **Channels** タブを選択し、エージェントを提供したいチャネルを選びます。たとえば Microsoft Teams に bot として公開するには、2️⃣ **Teams + Microsoft 365** を選択します。

![**Channels** タブ。エージェントを複数チャネルで利用可能にできる。](../../../assets/images/make/copilot-studio-01/make-agent-publish-02.png)

既定の設定でエージェントを作成・公開すると、Microsoft 認証が構成されます。つまり Teams、Power Apps、Microsoft 365 Copilot では Microsoft Entra ID 認証が使用されます。
既定の認証設定では、エージェントは Microsoft Teams にのみ公開できます。これは前のスクリーン ショットの **Channels** タブ上部の警告メッセージに示されています。

!!! note "Copilot Studio の認証モデル"
    Copilot Studio におけるエージェントの認証については、[Configure user authentication in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication){target=_blank} を参照してください。

!!! note "Microsoft Copilot Studio の Premium ライセンス"
    上記スクリーン ショットに、ライセンス モデルと Premium ライセンスの必要性に関する情報バーも表示されています。Copilot Studio で Premium コネクターなどのプレミアム機能を利用する場合は、ライセンスをアップグレードする必要があります。学習やテストで利用する場合は、60 日間の Premium ライセンス無料試用期間を有効化できます。

**Teams + Microsoft 365** チャネルを選択するとサイド パネルが表示され、**Add channel** ボタンを選択できます。

![Microsoft Teams チャネルを有効化するサイド パネル。現在の状態の説明と **Add channel** ボタン。](../../../assets/images/make/copilot-studio-01/make-agent-publish-03.png)

Microsoft Teams チャネルが有効になると、サイド パネルが更新され、確認メッセージとエージェント詳細編集、Microsoft Teams クライアントで開くコマンドが表示されます。また **Availability options** ボタンがあり、Microsoft Teams でエージェントにアクセスするさまざまな方法を確認できます。

Microsoft 365 Copilot をサポートするようチャネルを登録した場合は、**See agent in Microsoft 365** のリンクを選択すると、Microsoft 365 Copilot チャットのユーザー エクスペリエンスで直接エージェントを利用できます。

![Microsoft Teams チャネルを有効化するサイド パネル。**Turn on Teams** と **Cancel** ボタンが表示されている。](../../../assets/images/make/copilot-studio-01/make-agent-publish-04.png)

**Availability options** ボタンを選択すると、次のことが可能です。

- Microsoft Teams でエージェントを使用するリンクをコピー
- エージェント パッケージの ZIP ファイルをダウンロードし、Teams アプリ ストアにアップロード
- Teams アプリ ストアでエージェントを利用可能にし、組織全体または選択したユーザーに公開

![Microsoft Teams でのエージェント利用オプションを表示するサイド パネル。リンクコピー、Teams アプリ ストア公開、ZIP ダウンロードなどのボタンがある。](../../../assets/images/make/copilot-studio-01/make-agent-publish-05.png)

これで Microsoft Teams へのエージェント公開が完了しました。

<cc-end-step lab="mcs1" exercise="3" step="1" />

### Step 2: Microsoft Teams でエージェントをテストする

Microsoft Teams でエージェントをテストできる準備が整いました。**Availability options** パネルで **Copy link** ボタンを選択し、リンクをコピーします。新しいブラウザー タブを開き、コピーしたリンクを貼り付けて ENTER キーを押します。

![Microsoft Teams に新しいアプリとして表示されたエージェント。アプリとエージェントの詳細説明があり、**Add** ボタンがある。](../../../assets/images/make/copilot-studio-01/make-agent-test-teams-01.png)

最初に、エージェントを表す新しいアプリが Microsoft Teams クライアントに表示されます。**Add** ボタンを選択し、続くダイアログで **Open** を選択します。

![Microsoft Teams に新しいアプリとして表示されたエージェント。アプリとエージェントの詳細説明があり、**Add** ボタンがある。](../../../assets/images/make/copilot-studio-01/make-agent-test-teams-02.png)

しばらくすると、Microsoft Teams クライアントに bot とのチャットが表示されます。これがあなたのエージェントです。以前も使用した次のプロンプトを入力してみましょう。

```txt
How can we hire new people in our company?
```

回答を待つと、エージェントが HR のコンテキストで、ナレッジ ベースとなるドキュメントの参照を含めて返信します。

![Microsoft Teams に新しいアプリとして表示されたエージェント。アプリとエージェントの詳細説明があり、**Add** ボタンがある。](../../../assets/images/make/copilot-studio-01/make-agent-test-teams-03.png)

回答の冒頭には「AI generated」という免責事項が表示され、ユーザーが AI プラットフォームを利用していることを知らせています。

<cc-end-step lab="mcs1" exercise="3" step="2" />

---8<--- "ja/mcs-congratulations.md"

これでエージェントは完全に機能し、Microsoft Teams で利用できるようになりました。次のラボでは、エージェントの動作をさらにカスタマイズ・微調整していきます。

<a href="../02-topics">ここから</a> Lab MCS2 を開始し、Copilot Studio でトピックを定義しましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/01-first-agent" />