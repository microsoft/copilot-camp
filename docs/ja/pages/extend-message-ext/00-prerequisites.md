---
search:
  exclude: true
---
# ラボ M0 - 事前準備

このラボでは、 Microsoft 365 Copilot の機能を拡張するプラグインをビルド、テスト、デプロイするための開発環境をセットアップします。


???+ "Teams メッセージ拡張ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 事前準備](/copilot-camp/pages/extend-message-ext/00-prerequisites) (📍現在のページ)
    - [ラボ M1 - Northwind メッセージ拡張を理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - アプリを Microsoft 365 Copilot で実行する](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新しい検索コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証を追加する](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクション コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/05-add-action) 
    

このラボで学習する内容:

- ラボ全体で使用する開発テナントのセットアップ方法
- Visual Studio Code 向け Agents Toolkit とその他ツールのインストールおよび構成方法
- ベース プロジェクトで開発環境をセットアップする方法

!!! warning   "注意"
    Microsoft 365 Copilot を拡張するには、開発環境が [要件](https://learn.microsoft.com/microsoft-365-copilot/extensibility/prerequisites) を満たしていることを確認してください。


## Exercise 1: Teams アプリのアップロードを有効化する
カスタム Teams アプリをアップロードする権限を持つ Microsoft の職場または学校アカウントが必要です。 

既定では、エンドユーザーはアプリを直接アップロードできません。管理者がエンタープライズ アプリ カタログにアップロードする必要があります。この手順では、 Microsoft 365 Agents Toolkit からの直接アップロードが許可されるようにテナントを設定します。


- 管理者資格情報で [Microsoft Teams 管理センター](https://admin.teams.microsoft.com/dashboard) にサインインします。
- **Teams アプリ** > **セットアップ ポリシー** > **Global** に移動します。
- **カスタム アプリのアップロード** を「オン」に切り替えます。
- 「保存」を選択します。これでテスト テナントでカスタム アプリのアップロードが許可されます。

> 変更が反映されるまで最大 24 時間かかることがありますが、通常はもっと早く反映されます。

## Exercise 2: Agents Toolkit と前提ツールのインストール
Windows、Mac、Linux のいずれのマシンでもラボを実行できますが、前提ツールをインストールできる必要があります。アプリケーションのインストールが許可されていない場合は、別のマシン (または仮想マシン) を使用してください。

### Step 1: Visual Studio Code をインストールする

[Agents Toolkit for Visual Studio Code](){target=_blank} は Visual Studio Code が必須です。こちらからダウンロードできます: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}。

### Step 2: NodeJS をインストールする

Node.js は JavaScript をローカルで実行するためのランタイムです。Google Chrome や Chromium ベースの Microsoft Edge などで使われている V8 エンジンを利用しています。本ワークショップで使用する Web サーバーのコードを実行するために Node.js が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、バージョン 18 または 16 をインストールしてください。このラボは NodeJS 18.16.0 でテストされています。すでに別バージョンがインストールされている場合は、 [Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank} (Windows の場合は [こちらのバリエーション](https://github.com/coreybutler/nvm-windows){target=_blank}) を設定すると、同一マシンで簡単に Node バージョンを切り替えられます。

### Step 3: ツールをインストールする

これらのラボは最新の一般提供版 [Agents Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank} を基にしています。以下の手順に従ってください。

1️⃣ Visual Studio Code を開き、拡張機能ツール バー ボタンをクリックします

2️⃣ 「Teams」で検索し、 Agents Toolkit を見つけます

3️⃣ 「Install」をクリックします

![Open the App setup policies](../../assets/images/extend-m365-copilot-00/install-ttk.png)

!!! note "Agents Toolkit をインストール済みだが非表示の場合"
    以前に Agents Toolkit をインストールし、Visual Studio のサイドバーで非表示にした場合、アイコンが見当たらないことがあります。左サイドバーを右クリックし、 Agents Toolkit にチェックを入れて再表示してください。
    

!!! tip "Azure Storage Explorer"
    [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer/) (任意) - サンプルで使用する Northwind データベースを表示・編集したい場合にダウンロードしてください

## Exercise 3 - プロジェクトと開発テナント データのセットアップ

### Step 1 - サンプル コードをダウンロードする

ブラウザーで [このリンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/&filename=Northwind){target=_blank} にアクセスします。 **Northwind.zip** という ZIP ファイルのダウンロードが促されます。 

- ZIP ファイルをローカルに保存します。 

- ZIP を展開すると **Northwind** フォルダーが作成されます。 

- **Visual Studio Code** を開きます。 

Visual Studio Code で: 

- 「ファイル」メニューから「フォルダーを開く...」を選択します 

- **Northwind** フォルダーを開きます。

これ以降、ラボではこの **Northwind** フォルダーを「ルート フォルダー」または「作業フォルダー」と呼びます。

### Step 2 - Agents Toolkit でアカウントを設定する

左側の Agents Toolkit アイコン 1️⃣ を選択します。新しいプロジェクトを作成するオプションが表示される場合は、フォルダーが間違っている可能性があります。 Visual Studio Code のファイル メニューから「フォルダーを開く」を選択し、 **Northwind** フォルダーを直接開いてください。下図のように Accounts、Environment などのセクションが表示されるはずです。

「Accounts」セクションで「Sign in to Microsoft 365」2️⃣ をクリックし、ご自身の Microsoft 365 アカウントでログインします。

![Logging into Microsoft 365 from within Agents Toolkit](../../assets/images/extend-message-ext-00/01-04-Setup-TTK-01.png)

ブラウザー ウィンドウが開き、 Microsoft 365 へのログインが促されます。「You are signed in now and close this page」と表示されたら、そのページを閉じてください。

次に、「Custom App Upload Enabled」チェッカーに緑のチェックマークが付いていることを確認します。付いていない場合は、 Teams アプリのアップロード権限がユーザー アカウントにありません。ラボの Exercise 1 の手順を参照してください。 

さらに、「Copilot Access Enabled」チェッカーにも緑のチェックマークが付いていることを確認します。付いていない場合は、 Copilot のライセンスがユーザー アカウントに割り当てられていません。これはラボを続行するために必須です。

![Checker](../../assets/images/extend-message-ext-00/checker.png)

### Step 3 - サンプル ドキュメントをテスト ユーザーの OneDrive へコピーする

サンプル アプリには、ラボ中に Copilot が参照するドキュメントが含まれています。この手順では、これらのファイルをユーザーの OneDrive にコピーし、 Copilot が検索できるようにします。テナントの設定によっては、多要素認証の設定を求められる場合があります。

ブラウザーで Microsoft 365 ([https://www.office.com/](https://www.office.com/)) にアクセスし、このラボで使用する Microsoft 365 アカウントでサインインします。多要素認証の設定を求められる場合があります。

ページ左上の「ワッフル」メニュー 1️⃣ を使って、 Microsoft 365 内の OneDrive アプリに移動します 2️⃣ 。

![Navigating to the OneDrive application in Microsoft 365](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-01.png)

OneDrive 内で「My Files」1️⃣ に移動します。Documents フォルダーがあれば、その中に入ります。無い場合は「My Files」直下で作業しても構いません。

![Navigating to your documents in OneDrive](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-02.png)

次に「Add new」1️⃣ をクリックし、「Folder」2️⃣ を選択して新しいフォルダーを作成します。

![Adding a new folder in OneDrive](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-03.png)

フォルダー名を「Northwind contracts」とし、「Create」をクリックします。

![Naming the new folder "Northwind contracts"](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-03b.png)

新しいフォルダー内で再度「Add new」1️⃣ をクリックし、今度は「Files upload」2️⃣ を選択します。

![Adding new files to the new folder](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-04.png)

作業フォルダー内の **sampleDocs** フォルダーを開き、すべてのファイルを選択 1️⃣ してから「OK」2️⃣ をクリックし、アップロードします。

![Uploading the sample files from this repo into the folder](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-05.png)

この手順を早めに行うことで、 Microsoft 365 の検索エンジンがファイルを認識し、使用するタイミングまでにインデックスされる可能性が高くなります。


## お疲れさまでした

事前準備ラボが完了しました。次へ進んでアプリを実行する準備が整いました。下の「Next」ボタンを選択してください。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/00-prerequisites" />