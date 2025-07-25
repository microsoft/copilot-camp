---
search:
  exclude: true
---
# ラボ M0 - 前提条件

このラボでは、Microsoft 365 Copilot の機能を拡張するプラグインをビルド、テスト、デプロイするための開発環境をセットアップします。

???+ "Extend Teams Message Extension ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) (📍現在地)
    - [ラボ M1 - Northwind メッセージ拡張機能を理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - アプリを Microsoft 365 Copilot で実行する](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新しい検索コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証を追加する](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクション コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/05-add-action) 
    

このラボで学習する内容:

- ラボ全体の演習に向けて開発者テナントをセットアップする方法
- Visual Studio Code 用  Agents Toolkit とその他ツールのインストールと構成方法
- ベース プロジェクトで開発環境をセットアップする方法

!!! warning   "注意"
    Microsoft 365 Copilot を拡張するには、開発環境が [要件](https://learn.microsoft.com/microsoft-365-copilot/extensibility/prerequisites) を満たしている必要があります。


## エクササイズ 1: Teams アプリのアップロードを有効化
カスタム Teams アプリをアップロードできる権限を持つ Microsoft の職場または学校アカウントが必要です。 

既定では、エンドユーザーはアプリを直接アップロードできません。管理者がエンタープライズ アプリ カタログにアップロードする必要があります。このステップでは、Microsoft 365 Agents Toolkit による直接アップロードができるようにテナントを設定します。

- 管理者資格情報で [Microsoft Teams 管理センター](https://admin.teams.microsoft.com/dashboard) にサインインします。
- **Teams アプリ** > **セットアップ ポリシー** > **グローバル** に移動します。
- **カスタム アプリのアップロード** を “オン” に切り替えます。
- 「保存」を選択します。これでテスト テナントでカスタム アプリのアップロードが許可されます。

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

## エクササイズ 2: Agents Toolkit と前提ツールをインストール
Windows、Mac、Linux いずれのマシンでも演習を行えますが、前提ツールをインストールできる必要があります。コンピューターにアプリをインストールできない場合は、ワークショップ全体で使用できる別のマシン (または仮想マシン) を用意してください。

### Step 1: Visual Studio Code をインストール

[Agents Toolkit for Visual Studio Code](){target=_blank} が動作するには Visual Studio Code が必要です。以下からダウンロードしてください: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}.

### Step 2: NodeJS をインストール

Node.js はコンピューター上で JavaScript を実行できるランタイムです。Google Chrome や Microsoft Edge (Chromium ベース) などのブラウザーで使用されているオープンソースの V8 エンジンを使用しています。本ワークショップで使用する Web サーバー コードを実行するには Node.js が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、OS 向けのバージョン 18 または 16 をインストールしてください。このラボでは NodeJS バージョン 18.16.0 でテストしています。すでに別バージョンを使用している場合は、[Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank} (または Microsoft Windows 向けの [こちらのバリエーション](https://github.com/coreybutler/nvm-windows){target=_blank}) を設定すると、1 台のコンピューターで簡単に Node バージョンを切り替えられます。

### Step 3: ツールをインストール

これらのラボは、[Agents Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank} の最新 GA 版に基づいています。以下の手順を実行してください。

1️⃣ Visual Studio Code を開き、サイドバーの Extensions アイコンをクリック  
2️⃣ 「Teams」で検索し、Agents Toolkit を見つける  
3️⃣ 「Install」をクリック  

![Open the App setup policies](../../assets/images/extend-m365-copilot-00/install-ttk.png)

!!! note "Agents Toolkit をインストール済みだが非表示の場合"
    以前に Agents Toolkit をインストールし、Visual Studio のサイドバーで非表示にした場合、見当たらないことがあります。左側のサイドバーを右クリックし、Agents Toolkit にチェックを入れて再表示してください。
    

!!! tip "Azure Storage Explorer"
    [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer/) (任意) - Northwind データベースを閲覧・編集したい場合はダウンロードしてください。

## エクササイズ 3 - プロジェクトと開発者テナント データのセットアップ

### Step 1 - サンプル コードをダウンロード

ブラウザーで [こちらのリンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/&filename=Northwind){target=_blank} にアクセスします。**Northwind.zip** という ZIP ファイルをダウンロードするよう求められます。 

- ZIP ファイルを任意の場所に保存します。  
- ZIP を解凍すると **Northwind** フォルダーが生成されます。  
- **Visual Studio Code** を開きます。  

Visual Studio Code で: 

- 「ファイル」メニューから「フォルダーを開く...」を選択  
- **Northwind** フォルダーを開きます。  

このラボ内では、この **Northwind** フォルダーを「ルート フォルダー」または「作業フォルダー」と呼びます。

### Step 2 - Agents Toolkit でアカウントを設定

左側の Agents Toolkit アイコン 1️⃣ を選択します。新しいプロジェクトを作成するオプションが表示される場合は、フォルダーが間違っています。Visual Studio Code の「ファイル」メニューから「フォルダーを開く」を選択し、直接 **Northwind** フォルダーを開いてください。下図のように Accounts や Environment などのセクションが表示されます。

「Accounts」下の **Sign in to Microsoft 365** 2️⃣ をクリックし、ご自身の Microsoft 365 アカウントでログインします。

![Logging into Microsoft 365 from within Agents Toolkit](../../assets/images/extend-message-ext-00/01-04-Setup-TTK-01.png)

ブラウザー ウィンドウが開き、Microsoft 365 へのサインインを求められます。「You are signed in now and close this page」と表示されたらページを閉じてください。

次に、「Custom App Upload Enabled」チェッカーに緑のチェックが付いていることを確認します。付いていない場合は、Teams アプリのアップロード権限がありません。このラボのエクササイズ 1 を実施してください。 

同様に「Copilot Access Enabled」チェッカーに緑のチェックが付いていることを確認します。付いていない場合は、Copilot のライセンスがありません。ラボを続行するにはライセンスが必要です。

![Checker](../../assets/images/extend-message-ext-00/checker.png)

### Step 3 - サンプル ドキュメントをテスト ユーザーの OneDrive にコピー

サンプル アプリには、ラボ中に Copilot が参照するドキュメントが含まれています。このステップでは、これらのファイルをユーザーの OneDrive にコピーし、Copilot が検索できるようにします。テナント設定によっては、多要素認証の設定が求められる場合があります。

ブラウザーで Microsoft 365 ([https://www.office.com/](https://www.office.com/)) にアクセスし、ラボで使用する Microsoft 365 アカウントでサインインします。多要素認証を求められる場合があります。

ページ左上の「ワッフル」メニュー 1️⃣ を使って、Microsoft 365 内の OneDrive アプリ 2️⃣ に移動します。

![Navigating to the OneDrive application in Microsoft 365](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-01.png)

OneDrive 内で **My Files** 1️⃣ に移動します。Documents フォルダーがある場合はクリックして開きます。ない場合は **My Files** 直下で作業できます。

![Navigating to your documents in OneDrive](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-02.png)

「**Add new**」1️⃣ をクリックし、「**Folder**」2️⃣ を選択して新しいフォルダーを作成します。

![Adding a new folder in OneDrive](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-03.png)

フォルダー名を **Northwind contracts** と入力し、「Create」をクリックします。

![Naming the new folder "Northwind contracts"](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-03b.png)

新しいフォルダー内で再度「**Add new**」1️⃣ をクリックし、今度は「**Files upload**」2️⃣ を選択します。

![Adding new files to the new folder](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-04.png)

作業フォルダー内の **sampleDocs** フォルダーに移動し、すべてのファイルを選択 1️⃣ して「OK」2️⃣ をクリックし、アップロードします。

![Uploading the sample files from this repo into the folder](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-05.png)

この手順を早めに行うことで、Microsoft 365 の検索エンジンがファイルを発見しやすくなります。


## おめでとうございます

前提条件ラボを完了しました。これでアプリを実行する準備が整いました。下の「Next」ボタンを選択してください。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/00-prerequisites" />