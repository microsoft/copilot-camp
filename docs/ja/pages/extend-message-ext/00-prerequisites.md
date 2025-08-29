---
search:
  exclude: true
---
# ラボ M0 - 前提条件

このラボでは、Microsoft 365 Copilot の機能を拡張するプラグインを構築、テスト、デプロイするための開発環境をセットアップします。

???+ "Teams メッセージ拡張ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) (📍現在のラボ)
    - [ラボ M1 - Northwind メッセージ拡張の概要](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - アプリを Microsoft 365 Copilot で実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新しい検索コマンドでプラグインを拡張](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証を追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクション コマンドでプラグインを拡張](/copilot-camp/pages/extend-message-ext/05-add-action) 
    

このラボで学ぶこと:

- ラボ全体で使用する開発者テナントのセットアップ方法
- Visual Studio Code 用 Agents Toolkit とその他ツールのインストールおよび構成方法
- ベースプロジェクトを使用した開発環境のセットアップ方法

!!! warning   "注意"
    Microsoft 365 Copilot を拡張するには、開発環境が [要件](https://learn.microsoft.com/microsoft-365-copilot/extensibility/prerequisites) を満たしている必要があります。


## 演習 1: Teams アプリのアップロードを有効化する
カスタム Teams アプリをアップロードできる権限を持つ Microsoft の職場または学校アカウントが必要です。 

既定では、エンドユーザーはアプリを直接アップロードできません。管理者がエンタープライズ アプリ カタログにアップロードする必要があります。この手順では、Microsoft 365 Agents Toolkit による直接アップロードが可能になるようテナントを設定します。

- 管理者資格情報で [Microsoft Teams 管理センター](https://admin.teams.microsoft.com/dashboard) にサインインします。
- **Teams アプリ** > **セットアップ ポリシー** > **グローバル** に移動します。
- **カスタム アプリのアップロード** を「オン」に切り替えます。
- 「保存」を選択します。これでテスト テナントでカスタム アプリのアップロードが許可されます。

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと速く反映されます。

## 演習 2: Agents Toolkit と前提ツールをインストールする
これらのラボは Windows、Mac、Linux いずれのマシンでも実施できますが、前提条件をインストールできる権限が必要です。アプリのインストールが許可されていない場合は、別のマシン (または仮想マシン) を使用してください。

### 手順 1: Visual Studio Code をインストールする

[Agents Toolkit for Visual Studio Code](){target=_blank} は Visual Studio Code が必須です。以下からダウンロードしてください: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}。

### 手順 2: NodeJS をインストールする

Node.js は コンピューター上で JavaScript を実行できるランタイムです。Google Chrome や Chromium ベースの Microsoft Edge といった一般的なブラウザーで使用されているオープンソースの V8 エンジンを利用しています。本ワークショップ全体で使用する Web サーバー コードを実行するために Node.js が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、OS に合わせてバージョン 18 または 16 をインストールしてください。本ラボは NodeJS バージョン 18.16.0 でテスト済みです。すでに別バージョンの NodeJS がインストールされている場合は、同じコンピューターで Node のバージョンを簡単に切り替えられる [Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank} (または Microsoft Windows 向け [こちらのバリエーション](https://github.com/coreybutler/nvm-windows){target=_blank}) の設定を検討してください。

### 手順 3: ツールをインストールする

これらのラボは、最新の一般提供版 [Agents Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank} を基盤としています。以下のスクリーンショットの手順に従ってください。

1️⃣ Visual Studio Code を開き、拡張機能ツールバー ボタンをクリック

2️⃣ 「Teams」で検索し、Agents Toolkit を探します

3️⃣ 「Install」をクリック

![Open the App setup policies](../../assets/images/extend-m365-copilot-00/install-ttk.png)

!!! note "Agents Toolkit をインストール済みで非表示にしている場合"
    以前に Agents Toolkit をインストールした後、Visual Studio のサイドバーで非表示にした場合、アイコンが見当たらないかもしれません。左サイドバーを右クリックし、Agents Toolkit にチェックを入れて再表示してください。
    

!!! tip "Azure Storage Explorer"
    [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer/) (任意) - Northwind データベースを閲覧・編集したい場合はダウンロードしてください

## 演習 3 - プロジェクトと開発者テナント データをセットアップする

### 手順 1 - サンプル コードをダウンロードする

ブラウザーで [こちらのリンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/&filename=Northwind){target=_blank} を開きます。**Northwind.zip** という ZIP ファイルのダウンロードを促されます。 

- ZIP ファイルをコンピューターに保存します。 

- ZIP を展開すると **Northwind** フォルダーが作成されます。 

- **Visual Studio Code** を開きます。 

Visual Studio Code で: 

- 「ファイル」メニューから「フォルダーを開く...」を選択 

- **Northwind** フォルダーを開きます。

以降のラボでは、この **Northwind** フォルダーを「ルート フォルダー」または「作業フォルダー」と呼びます。

### 手順 2 - Agents Toolkit でアカウントを設定する

左側の Agents Toolkit アイコン 1️⃣ を選択します。新規プロジェクト作成オプションが表示される場合は、フォルダーが間違っています。Visual Studio Code のファイル メニューで「フォルダーを開く」を選び、**Northwind** フォルダーを直接開いてください。下図のように Accounts、Environment などのセクションが見えるはずです。

「Accounts」内の「Sign in to Microsoft 365」2️⃣ をクリックし、自身の Microsoft 365 アカウントでサインインします。

![Logging into Microsoft 365 from within Agents Toolkit](../../assets/images/extend-message-ext-00/01-04-Setup-TTK-01.png)

ブラウザーが開き、Microsoft 365 へのサインインを促します。「You are signed in now and close this page」と表示されたら、そのページを閉じてください。

次に、「Custom App Upload Enabled」チェッカーに緑のチェックマークが付いていることを確認します。付いていない場合は、Teams アプリのアップロード権限がないことを意味します。演習 1 の手順を再確認してください。

続いて、「Copilot Access Enabled」チェッカーに緑のチェックマークが付いていることを確認します。付いていない場合は、Copilot のライセンスがアカウントに付与されていないことを示します。これはラボを続行するために必須です。

![Checker](../../assets/images/extend-message-ext-00/checker.png)

### 手順 3 - サンプル ドキュメントをテスト ユーザーの OneDrive にコピーする

サンプル アプリには、ラボ中に Copilot が参照するドキュメントが含まれています。この手順では、これらのファイルをユーザーの OneDrive にコピーして Copilot が検索できるようにします。テナントの設定によっては、多要素認証の設定を求められる場合があります。

ブラウザーで Microsoft 365 ([https://www.office.com/](https://www.office.com/)) にアクセスし、このラボで使用する Microsoft 365 アカウントでサインインします。多要素認証の設定が求められる場合があります。

ページ左上の「ワッフル」メニュー 1️⃣ から Microsoft 365 の OneDrive アプリ 2️⃣ に移動します。

![Navigating to the OneDrive application in Microsoft 365](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-01.png)

OneDrive で「マイ ファイル」1️⃣ に移動します。**documents** フォルダーがある場合はそこに入ります。ない場合は、そのまま「マイ ファイル」で作業してかまいません。

![Navigating to your documents in OneDrive](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-02.png)

次に「新規作成」1️⃣ →「フォルダー」2️⃣ をクリックして、新しいフォルダーを作成します。

![Adding a new folder in OneDrive](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-03.png)

フォルダー名を「Northwind contracts」と入力し、「作成」をクリックします。

![Naming the new folder "Northwind contracts"](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-03b.png)

新しいフォルダー内で、再び「新規作成」1️⃣ →「ファイルのアップロード」2️⃣ をクリックします。

![Adding new files to the new folder](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-04.png)

作業フォルダー内の **sampleDocs** フォルダーを開き、すべてのファイルを選択 1️⃣ し、「OK」2️⃣ をクリックしてアップロードします。

![Uploading the sample files from this repo into the folder](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-05.png)

この手順を早めに行うことで、Microsoft 365 検索エンジンがファイルをインデックスする時間を確保できます。


## おめでとうございます

前提条件ラボが完了しました。次はアプリを実行する準備が整いました。下の「Next」ボタンを選択してください。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/00-prerequisites--ja" />