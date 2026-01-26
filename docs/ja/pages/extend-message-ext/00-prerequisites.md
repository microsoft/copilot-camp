---
search:
  exclude: true
---
# ラボ M0 - 前提条件

このラボでは、 Microsoft 365 Copilot の機能を拡張するプラグインを構築、テスト、デプロイするための開発環境をセットアップします。

???+ "Teams メッセージ拡張ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) (📍あなたはここにいます)
    - [ラボ M1 - Northwind メッセージ拡張を理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - アプリを Microsoft 365 Copilot で実行する](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新しい検索コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証を追加する](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクション コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/05-add-action) 
    

このラボで学ぶこと:

- ラボ全体で使用する開発テナントのセットアップ方法
- Visual Studio Code 用 Agents Toolkit とその他ツールのインストールおよび構成方法
- ベース プロジェクトで開発環境をセットアップする方法

!!! warning   "注意"
    Microsoft 365 Copilot を拡張するには、開発環境が [要件](https://learn.microsoft.com/microsoft-365-copilot/extensibility/prerequisites) を満たしている必要があります。


## エクササイズ 1: Teams アプリのアップロードを有効化する
カスタム Teams アプリをアップロードできる権限を持つ Microsoft の職場または学校アカウントが必要です。 

既定ではエンド ユーザーはアプリを直接アップロードできません。管理者がエンタープライズ アプリ カタログにアップロードする必要があります。この手順では、 Microsoft 365 Agents Toolkit による直接アップロードが可能になるようテナントを設定します。


- 管理者資格情報で [Microsoft Teams 管理センター](https://admin.teams.microsoft.com/dashboard) にサインインします。
- **Teams アプリ** > **セットアップ ポリシー** > **グローバル** に移動します。
- **カスタム アプリのアップロード** を **オン** に切り替えます。
- 「保存」を選択します。これでテスト テナントではカスタム アプリのアップロードが許可されます。

> 変更の反映には最長 24 時間かかる場合がありますが、通常はもっと早く反映されます。

## エクササイズ 2: Agents Toolkit と前提ツールのインストール
Windows、Mac、Linux のいずれのマシンでもラボを実行できますが、前提ツールをインストールする権限が必要です。アプリのインストールが許可されていない場合は、別のマシン（または仮想マシン）を用意してください。

### Step 1: Visual Studio Code のインストール

[Agents Toolkit for Visual Studio Code](){target=_blank} が必要なのは言うまでもありません。こちらからダウンロードしてください: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}。

### Step 2: NodeJS のインストール

Node.js は JavaScript をローカルで実行できるランタイムです。 Google Chrome や Microsoft Edge（Chromium ベース）でも使用されているオープンソースの V8 エンジンを利用しています。本ワークショップで使用する Web サーバー コードを実行するために Node.js が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、バージョン 18 または 16 をインストールしてください。このラボでは NodeJS 18.16.0 で動作確認済みです。既に別のバージョンがインストールされている場合は、[Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank}（Windows の場合は [こちらのバリエーション](https://github.com/coreybutler/nvm-windows){target=_blank}）をセットアップすると、複数バージョンを簡単に切り替えられます。

### Step 3: ツールのインストール

これらのラボは最新の一般提供版 [Agents Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank} を使用しています。以下の手順に従ってください。

1️⃣ Visual Studio Code を開き、拡張機能ツールバー ボタンをクリック  
2️⃣ 「Teams」で検索し、 Agents Toolkit を見つける  
3️⃣ 「Install」をクリック  

![Open the App setup policies](../../assets/images/extend-m365-copilot-00/install-ttk.png)

!!! note "Agents Toolkit をインストール済みだが非表示の場合"
    以前に Agents Toolkit をインストールしてサイドバーで非表示にした場合、見つからないことがあります。左側サイドバーを右クリックし、 Agents Toolkit にチェックを入れると再表示できます。
    

!!! tip "Azure Storage Explorer"
    [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer/)（任意） - サンプルで使用する Northwind データベースを表示・編集したい場合にダウンロードしてください。

## エクササイズ 3 - プロジェクトと開発テナント データのセットアップ

### Step 1 - サンプル コードのダウンロード

ブラウザーで [こちらのリンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/&filename=Northwind){target=_blank} を開きます。 **Northwind.zip** という ZIP ファイルをダウンロードするよう求められます。 

- ZIP ファイルをローカルに保存します。  
- ZIP を展開すると **Northwind** フォルダーが作成されます。  
- **Visual Studio Code** を開きます。  

Visual Studio Code で:  

- 「File」メニューから「Open folder...」を選択  
- **Northwind** フォルダーを開きます。  

ラボではこの **Northwind** フォルダーを「ルート フォルダー」または「作業フォルダー」と呼びます。

### Step 2 - Agents Toolkit でアカウントをセットアップ

左側の Agents Toolkit アイコン 1️⃣ を選択します。新規プロジェクト作成オプションが表示される場合は、フォルダーが間違っている可能性があります。Visual Studio Code の「File」メニューから「Open Folder」を選択し、 **Northwind** フォルダーを直接開いてください。以下のように Accounts、Environment などのセクションが表示されるはずです。

「Accounts」内の「Microsoft 365 にサインイン」2️⃣ をクリックし、 Microsoft 365 アカウントでログインします。

![Logging into Microsoft 365 from within Agents Toolkit](../../assets/images/extend-message-ext-00/01-04-Setup-TTK-01.png)

ブラウザー ウィンドウが開き、 Microsoft 365 へのログインが案内されます。「You are signed in now and close this page」と表示されたらページを閉じます。

続いて 「Custom App Upload Enabled」チェッカーに緑のチェックマークが付いているか確認します。付いていない場合は、ユーザー アカウントに Teams アプリをアップロードする権限がありません。ラボのエクササイズ 1 の手順を実行してください。 

次に 「Copilot Access Enabled」チェッカーに緑のチェックマークが付いているか確認します。付いていない場合は、 Copilot のライセンスがユーザー アカウントに割り当てられていません。ラボを続行するには必須です。

![Checker](../../assets/images/extend-message-ext-00/checker.png)

### Step 3 - サンプル文書をテスト ユーザーの OneDrive にコピー

サンプル アプリには、ラボ中に Copilot が参照する文書が含まれています。この手順でこれらのファイルをユーザーの OneDrive にコピーし、 Copilot が検索できるようにします。テナントの設定によっては、多要素認証の設定を求められる場合があります。

ブラウザーで Microsoft 365（[https://www.office.com/](https://www.office.com/)）を開きます。ラボを通じて使用する Microsoft 365 アカウントでログインしてください。多要素認証を設定するよう求められる場合があります。

ページ左上の「ワッフル」メニュー 1️⃣ から OneDrive アプリ 2️⃣ を開きます。

![Navigating to the OneDrive application in Microsoft 365](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-01.png)

OneDrive 内で 「My Files」1️⃣ に移動します。 documents フォルダーがある場合はクリックして開きます。ない場合はそのまま「My Files」内で作業できます。

![Navigating to your documents in OneDrive](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-02.png)

「新規作成」1️⃣ をクリックし、「フォルダー」2️⃣ を選択して新しいフォルダーを作成します。

![Adding a new folder in OneDrive](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-03.png)

フォルダー名を「Northwind contracts」と入力し、「作成」をクリックします。

![Naming the new folder "Northwind contracts"](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-03b.png)

新しいフォルダー内で再度「新規作成」1️⃣ をクリックし、今度は「ファイルのアップロード」2️⃣ を選択します。

![Adding new files to the new folder](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-04.png)

作業フォルダー内の **sampleDocs** フォルダーを開きます。すべてのファイルを選択 1️⃣ し、「OK」2️⃣ をクリックしてアップロードします。

![Uploading the sample files from this repo into the folder](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-05.png)

この手順を早めに実施しておくことで、 Microsoft 365 の検索エンジンがファイルを検出しやすくなります。


## まとめ

前提条件ラボが完了しました。アプリを実行する準備が整いました。「Next」ボタンを選択して進んでください。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/00-prerequisites--ja" />