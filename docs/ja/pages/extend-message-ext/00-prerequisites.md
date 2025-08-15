---
search:
  exclude: true
---
# ラボ M0 - 前提条件

このラボでは、Microsoft 365 Copilot の機能を拡張するプラグインを構築、テスト、デプロイするための開発環境をセットアップします。


???+ "Teams メッセージ拡張ラボ (Extend Path) のナビゲーション"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) (📍現在位置)
    - [ラボ M1 - Northwind メッセージ拡張を理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - Microsoft 365 Copilot でアプリを実行する](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新しい検索コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証を追加する](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクションコマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/05-add-action) 
    

このラボで学ぶこと:

- すべてのラボ演習に向けて開発者テナントを設定する方法
- Visual Studio Code 用 Agents Toolkit とその他のツールをインストールして構成する方法
- ベースプロジェクトで開発環境をセットアップする方法

!!! warning   "注意"
    Microsoft 365 Copilot を拡張するには、開発環境が [要件](https://learn.microsoft.com/microsoft-365-copilot/extensibility/prerequisites) を満たしていることを確認してください。


## 演習 1: Teams アプリのアップロードを有効化する
カスタム Teams アプリをアップロードする権限を持つ Microsoft の職場または学校アカウントが必要です。 

既定では、エンドユーザーは直接アプリをアップロードできず、管理者がエンタープライズ アプリ カタログにアップロードする必要があります。この手順では、Microsoft 365 Agents Toolkit による直接アップロードができるようにテナントを設定します。


- 管理者資格情報で [Microsoft Teams 管理センター](https://admin.teams.microsoft.com/dashboard) にサインインします。
- **Teams アプリ** > **セットアップ ポリシー** > **グローバル** に移動します。
- **カスタム アプリのアップロード** を「オン」に切り替えます。
- 「保存」を選択します。これでテスト テナントでカスタム アプリのアップロードが許可されます。

> 変更が反映されるまで最長 24 時間かかることがありますが、通常はもっと早く反映されます。

## 演習 2: Agents Toolkit と前提条件をインストールする
Windows、Mac、Linux いずれのマシンでもラボを実行できますが、前提条件をインストールできる必要があります。もしアプリのインストールが許可されていない場合は、別のマシン（または仮想マシン）を用意してください。

### 手順 1: Visual Studio Code をインストールする

[Agents Toolkit for Visual Studio Code](){target=_blank} には Visual Studio Code が必要です。ここからダウンロードできます: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}.

### 手順 2: NodeJS をインストールする

Node.js は JavaScript をローカルで実行できるランタイムです。Google Chrome や Chromium ベースの Microsoft Edge などで使用されているオープンソースの V8 エンジンを利用しています。このワークショップで使用する Web サーバーコードを実行するために Node.js が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、バージョン 18 または 16 をインストールしてください。このラボは NodeJS 18.16.0 で動作確認しています。すでに別バージョンの NodeJS がインストールされている場合は、[Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank}（Windows の場合は [こちらの派生版](https://github.com/coreybutler/nvm-windows){target=_blank}）を利用すると、同一マシンで簡単にバージョンを切り替えられます。

### 手順 3: ツールをインストールする

これらのラボは最新の一般提供版 [Agents Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank} を使用します。以下の手順に従ってください。

1️⃣ Visual Studio Code を開き、拡張機能ツールバーをクリックします。  

2️⃣ 「Teams」で検索し、Agents Toolkit を見つけます。  

3️⃣ 「Install」をクリックします。  

![Open the App setup policies](../../assets/images/extend-m365-copilot-00/install-ttk.png)

!!! note "Agents Toolkit がインストール済みで非表示の場合"
    以前に Agents Toolkit をインストールしてサイドバーから非表示にした場合、アイコンが見当たらないことがあります。左サイドバーを右クリックし、Agents Toolkit にチェックを入れると再表示されます。
    

!!! tip "Azure Storage Explorer"
    [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer/) （任意） - サンプルで使用する Northwind データベースを閲覧・編集したい場合にダウンロードしてください。

## 演習 3 - プロジェクトと開発者テナントのデータをセットアップする

### 手順 1 - サンプルコードをダウンロードする

ブラウザーで [このリンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/&filename=Northwind){target=_blank} にアクセスします。**Northwind.zip** という ZIP ファイルのダウンロードを促されます。 

- ZIP ファイルをコンピューターに保存します。  
- ZIP を展開すると **Northwind** フォルダーが作成されます。  
- **Visual Studio Code** を開きます。  

Visual Studio Code で:  

- 「ファイル」メニューから「フォルダーを開く...」を選択  
- **Northwind** フォルダーを開きます。  

このラボでは **Northwind** フォルダーを「ルートフォルダー」または「作業フォルダー」と呼びます。

### 手順 2 - Agents Toolkit でアカウントを設定する

左側の Agents Toolkit アイコン 1️⃣ を選択します。新規プロジェクトの作成オプションが表示された場合は、異なるフォルダーを開いている可能性があります。Visual Studio Code の「ファイル」メニューで「フォルダーを開く」を選択し、直接 **Northwind** フォルダーを開いてください。Accounts、Environment などのセクションが表示されるはずです。

「Accounts」内の「Sign in to Microsoft 365」2️⃣ をクリックし、ご自身の Microsoft 365 アカウントでログインします。

![Logging into Microsoft 365 from within Agents Toolkit](../../assets/images/extend-message-ext-00/01-04-Setup-TTK-01.png)

ブラウザーが開き、Microsoft 365 へのログイン画面が表示されます。「You are signed in now and close this page」と表示されたら、ページを閉じてください。

次に「Custom App Upload Enabled」チェッカーが緑のチェックマークになっていることを確認します。なっていない場合、ユーザーアカウントに Teams アプリをアップロードする権限がありません。演習 1 を参照してください。 

また「Copilot Access Enabled」チェッカーも緑のチェックマークであることを確認します。なっていない場合、Copilot のライセンスが付与されていません。ラボを続行するには必須です。

![Checker](../../assets/images/extend-message-ext-00/checker.png)

### 手順 3 - サンプルドキュメントをテストユーザーの OneDrive にコピーする

サンプルアプリには、Copilot が参照するドキュメントが含まれています。この手順では、これらのファイルをユーザーの OneDrive にコピーし、Copilot が見つけやすいようにします。テナントの設定によっては、多要素認証の設定を求められる場合があります。

ブラウザーで Microsoft 365 ([https://www.office.com/](https://www.office.com/)) にアクセスし、このラボで使用する Microsoft 365 アカウントでログインします。多要素認証の設定を求められる場合があります。

ページ左上の「ワッフル」メニュー 1️⃣ から OneDrive アプリ 2️⃣ を開きます。

![Navigating to the OneDrive application in Microsoft 365](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-01.png)

OneDrive 内で「My Files」1️⃣ に移動します。Documents フォルダーがある場合はそこに入り、ない場合は「My Files」直下で作業します。

![Navigating to your documents in OneDrive](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-02.png)

「Add new」1️⃣ をクリックし、「Folder」2️⃣ を選択して新しいフォルダーを作成します。

![Adding a new folder in OneDrive](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-03.png)

フォルダー名を「Northwind contracts」と入力し、「Create」をクリックします。

![Naming the new folder "Northwind contracts"](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-03b.png)

新しいフォルダー内で再び「Add new」1️⃣ をクリックし、今回は「Files upload」2️⃣ を選択します。

![Adding new files to the new folder](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-04.png)

作業フォルダー内の **sampleDocs** フォルダーに移動し、すべてのファイルを選択 1️⃣ して「OK」2️⃣ をクリックし、アップロードします。

![Uploading the sample files from this repo into the folder](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-05.png)

この手順を早めに行うことで、Microsoft 365 の検索エンジンがファイルを検出する時間を確保できます。


## おめでとうございます

前提条件ラボが完了しました。次はアプリを実行します。下の「Next」ボタンを選択してください。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/00-prerequisites--ja" />