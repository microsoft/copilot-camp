---
search:
  exclude: true
---
# ラボ M0 - 前提条件

このラボでは、Microsoft 365 Copilot の機能を拡張するプラグインをビルド、テスト、デプロイするための開発環境をセットアップします。


???+ "Extend Teams メッセージ拡張ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) (📍ここです)
    - [ラボ M1 - Northwind メッセージ拡張を理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - アプリを Microsoft 365 Copilot で実行する](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新しい検索コマンドでプラグインを拡張する](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証を追加する](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクション コマンドでプラグインを拡張する](/copilot-camp/pages/extend-message-ext/05-add-action) 
    

このラボで学ぶ内容:

- すべてのラボ演習に向けて開発者テナントをセットアップする方法  
- Visual Studio Code 用 Agents Toolkit とその他のツールをインストールおよび構成する方法  
- ベース プロジェクトで開発環境をセットアップする方法  

!!! warning   "注意"
    Microsoft 365 Copilot を拡張するには、開発環境が [要件](https://learn.microsoft.com/microsoft-365-copilot/extensibility/prerequisites) を満たしている必要があります。


## エクササイズ 1: Teams アプリのアップロードを有効化する
カスタム Teams アプリをアップロードできる Microsoft の職場または学校アカウントが必要です。  

既定ではエンドユーザーは直接アプリをアップロードできません。管理者がエンタープライズ アプリ カタログにアップロードする必要があります。この手順では、Microsoft 365 Agents Toolkit による直接アップロードができるようテナントを設定します。


- 管理者資格情報で [Microsoft Teams 管理センター](https://admin.teams.microsoft.com/dashboard) にサインインします。  
- **Teams アプリ** > **セットアップ ポリシー** > **Global** へ移動します。  
- **カスタム アプリのアップロード** を「オン」に切り替えます。  
- 「保存」を選択します。これでテスト テナントでカスタム アプリのアップロードが許可されます。

> 反映には最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

## エクササイズ 2: Agents Toolkit と前提ツールのインストール
Windows、Mac、Linux のいずれでもラボを実施できますが、前提ツールをインストールする権限が必要です。コンピューターにアプリをインストールできない場合は、別のマシン（または仮想マシン）をご用意ください。

### Step 1: Visual Studio Code をインストールする

[Agents Toolkit for Visual Studio Code](){target=_blank} を利用するには Visual Studio Code が必要です。こちらからダウンロードできます: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}。

### Step 2: NodeJS をインストールする

Node.js は JavaScript をコンピューター上で実行できるランタイムです。Google Chrome や Chromium ベースの Microsoft Edge などのブラウザーで使用されているオープンソースの V8 エンジンを利用しています。本ワークショップで使用する Web サーバー コードを実行するために Node.js が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、OS 向けのバージョン 18 または 16 をインストールしてください。このラボは NodeJS 18.16.0 でテストされています。すでに別の NodeJS バージョンが入っている場合は、[Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank}（Windows の場合は [こちらのバリエーション](https://github.com/coreybutler/nvm-windows){target=_blank}）を設定すると、同じコンピューターで簡単にバージョンを切り替えられます。

### Step 3: ツールをインストールする

これらのラボは、一般提供されている最新版の [Agents Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank} を使用しています。以下の画面ショットの手順に従ってください。

1️⃣ Visual Studio Code を開き、サイドバーの拡張機能ボタンをクリックします。  

2️⃣ 「Teams」で検索し、Agents Toolkit を見つけます。  

3️⃣ 「Install」をクリックします。  

![アプリ セットアップ ポリシーを開く](../../assets/images/extend-m365-copilot-00/install-ttk.png)

!!! note "Agents Toolkit をインストール済みだが非表示の場合"
    以前に Agents Toolkit をインストールしてサイドバーから非表示にした場合、見当たらないことがあります。左側のサイドバーを右クリックし、Agents Toolkit にチェックを入れて再表示してください。
    

!!! tip "Azure Storage Explorer"
    [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer/)（任意） - サンプルで使用する Northwind データベースを表示・編集したい場合はダウンロードしてください。

## エクササイズ 3 - プロジェクトと開発者テナント データのセットアップ

### Step 1 - サンプル コードをダウンロードする

ブラウザーで [このリンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/&filename=Northwind){target=_blank} にアクセスします。**Northwind.zip** という ZIP ファイルのダウンロードを促されます。  

- ZIP ファイルをコンピューターに保存します。  

- ZIP ファイルを展開すると **Northwind** フォルダーが作成されます。  

- **Visual Studio Code** を開きます。  

Visual Studio Code で:  

- 「File」メニューから「Open folder...」を選択します。  

- **Northwind** フォルダーを開きます。  

以降のラボでは、この **Northwind** フォルダーを「ルート フォルダー」または「作業フォルダー」と呼びます。

### Step 2 - Agents Toolkit でアカウントを設定する

左側の Agents Toolkit アイコン 1️⃣ を選択します。新規プロジェクト作成などのオプションが表示された場合、フォルダーが誤っている可能性があります。Visual Studio Code の「File」メニューで「Open Folder」を選択し、直接 **Northwind** フォルダーを開いてください。下図のように Accounts、Environment などのセクションが表示されるはずです。

「Accounts」の下で「Sign in to Microsoft 365」2️⃣ をクリックし、ご自身の Microsoft 365 アカウントでログインします。

![Agents Toolkit 内から Microsoft 365 にログイン](../../assets/images/extend-message-ext-00/01-04-Setup-TTK-01.png)

ブラウザーが開き、Microsoft 365 へのログインが求められます。「You are signed in now and close this page」と表示されたらページを閉じます。

続いて「Custom App Upload Enabled」チェッカーに緑のチェックが付いているか確認します。付いていない場合、そのユーザー アカウントには Teams アプリをアップロードする権限がありません。ラボのエクササイズ 1 の手順を行ってください。  

次に「Copilot Access Enabled」チェッカーに緑のチェックが付いているか確認します。付いていない場合、そのユーザー アカウントに Copilot のライセンスがありません。ラボを継続するには必須です。

![Checker](../../assets/images/extend-message-ext-00/checker.png)

### Step 3 - サンプル ドキュメントをテスト ユーザーの OneDrive にコピーする

サンプル アプリには、ラボ中に Copilot が参照するドキュメントが含まれています。この手順では、これらのファイルをユーザーの OneDrive にコピーし、Copilot が検索できるようにします。テナント設定によっては、多要素認証の設定を求められる場合があります。

ブラウザーで Microsoft 365 ([https://www.office.com/](https://www.office.com/)) にアクセスし、ラボで使用する Microsoft 365 アカウントでログインします。多要素認証の設定が求められることがあります。

ページ左上の「ワッフル」メニュー 1️⃣ から Microsoft 365 内の OneDrive アプリ 2️⃣ に移動します。

![Microsoft 365 で OneDrive アプリに移動](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-01.png)

OneDrive で「My Files」1️⃣ に移動します。Documents フォルダーがあればそこに入ります。なければ「My Files」直下で作業してかまいません。

![OneDrive でドキュメントに移動](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-02.png)

「Add new」1️⃣ をクリックし、「Folder」2️⃣ を選択して新しいフォルダーを作成します。

![OneDrive で新しいフォルダーを追加](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-03.png)

フォルダー名を「Northwind contracts」とし、「Create」をクリックします。

![新しいフォルダー名を "Northwind contracts" に設定](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-03b.png)

この新しいフォルダー内から再度「Add new」1️⃣ をクリックし、今度は「Files upload」2️⃣ を選択します。

![新しいフォルダーにファイルを追加](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-04.png)

作業フォルダー内の **sampleDocs** フォルダーを開き、すべてのファイル 1️⃣ を選択して「OK」2️⃣ をクリックし、アップロードします。

![リポジトリーのサンプル ファイルをフォルダーにアップロード](../../assets/images/extend-message-ext-00/01-02-CopySampleFiles-05.png)

この手順を早めに行うことで、Microsoft 365 の検索エンジンが使用する時点までにファイルをインデックスする確率が高くなります。


## おめでとうございます

前提条件ラボを完了しました。次はアプリの実行に進みましょう。以下の「Next」ボタンを選択してください。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/00-prerequisites--ja" />