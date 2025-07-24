---
search:
  exclude: true
---
# ラボ M0 - 前提条件

このラボでは、 Microsoft 365 Copilot の機能拡張用プラグインを構築、テスト、およびデプロイするための開発環境を設定します。

???+ "Extend Teams Message Extension ラボ (Extend Path) のナビゲーション"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) (📍現在位置)
    - [ラボ M1 - Northwind メッセージエクステンションの理解](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - Microsoft 365 Copilot でアプリを実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新しい検索コマンドによるプラグインの強化](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証の追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクションコマンドによるプラグインの強化](/copilot-camp/pages/extend-message-ext/05-add-action) 
    

このラボで学ぶ内容:

- ラボ全体の演習用に デベロッパーテナント を設定する方法
- Visual Studio Code 用 Agents Toolkit やその他のツールをインストールおよび構成する方法
- ベースプロジェクトで開発環境を整える方法

!!! warning "注意事項"
    Microsoft 365 Copilot を拡張するには、開発環境が [要件](https://learn.microsoft.com/microsoft-365-copilot/extensibility/prerequisites) を満たしていることを確認する必要があります。


## 演習 1: Teams アプリケーションのアップロードの有効化
カスタム Teams アプリケーションをアップロードする権限を持つ Microsoft の職場または学校 アカウントが必要です。 

通常、エンド ユーザーは直接アプリケーションをアップロードできず、代わりに管理者が企業向けアプリ カタログにアップロードします。この手順では、 Microsoft 365 Agents Toolkit による直接アップロードができるように、テナントが設定されているか確認します。


- 管理者資格情報を使用して [Microsoft Teams 管理センター](https://admin.teams.microsoft.com/dashboard) にサインインします。
- **Teams アプリ** > **セットアップ ポリシー** > **グローバル** に移動します。
- **カスタム アプリのアップロード** を「オン」の位置に切り替えます。
- 「保存」を選択します。これにより、テスト テナントでカスタム アプリのアップロードが許可されます。

> 変更が有効になるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

## 演習 2: Agents Toolkit と前提条件のインストール
これらのラボは Windows、Mac、Linux マシンのいずれかで実行できますが、前提条件をインストールできる環境が必要です。コンピューターにアプリケーションをインストールする権限がない場合は、ワークショップ全体で使用する別のマシン (または仮想マシン) を見つける必要があります。

### ステップ 1: Visual Studio Code のインストール

[Agents Toolkit for Visual Studio Code](){target=_blank} が Visual Studio Code を必要とするのは当然です！ こちらからダウンロードできます: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}.

### ステップ 2: NodeJS のインストール

Node.js はコンピューター上で JavaScript を実行できるランタイムです。オープンソースの V8 エンジンを使用しており、これは Google Chrome や Chromium ベースの Microsoft Edge といった一般的な Web ブラウザで使用されています。ワークショップ全体で使用する Web サーバーのコードを実行するために Node.js が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、OS に合わせてバージョン 18 または 16 をインストールしてください。本ラボでは NodeJS バージョン 18.16.0 にてテスト済みです。既に別のバージョンの NodeJS をインストール済みの場合は、同一コンピューター上で簡単に Node のバージョンを切り替えられる [Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank} (または Microsoft Windows 用の [このバリエーション](https://github.com/coreybutler/nvm-windows){target=_blank}) のセットアップをお勧めします。

### ステップ 3: ツールのインストール

これらのラボは最新版の [Agents Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank} をベースにしています。
以下のスクリーンショットに示される手順に従ってください。

1️⃣ Visual Studio Code を開き、拡張機能のツールバー ボタンをクリック

2️⃣ 「Teams」を検索し、Agents Toolkit を見つける

3️⃣ 「インストール」をクリック

![App セットアップ ポリシーの表示](../assets/images/extend-m365-copilot-00/install-ttk.png)

!!! note "Agents Toolkit がインストール済みでも非表示の場合"
    以前に Agents Toolkit をインストールし、その後 Visual Studio サイドバーで非表示にした場合、表示されない理由に驚くかもしれません。左サイドバーを右クリックして、Agents Toolkit のチェックを外して再度表示させてください。
    

!!! tip "Azure Storage Explorer"
    [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer/) (オプション) - このサンプルで使用している Northwind データベースを表示および編集したい場合は、ダウンロードしてください。

## 演習 3 - プロジェクトとデベロッパーテナント データのセットアップ

### ステップ 1 - サンプルコードのダウンロード

Web ブラウザーで [このリンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/&filename=Northwind){target=_blank} にアクセスしてください。 **Northwind.zip** という ZIP ファイルのダウンロードのプロンプトが表示されます。 

- ZIP ファイルをコンピューターに保存します。 

- ZIP ファイルの内容を解凍すると、 **Northwind** というフォルダーが作成されます。 

- **Visual Studio Code** を開きます。 

Visual Studio Code 内で: 

- 「ファイル」メニューから「フォルダーを開く」オプションを選択 

- **Northwind** フォルダーを開きます。

これらのラボでは、この **Northwind** フォルダーを「ルート フォルダー」または「作業フォルダー」として参照します。ここで作業を行います。

### ステップ 2 - Agents Toolkit でアカウントの設定

左側の 1️⃣ にある Agents Toolkit アイコンを選択します。新しいプロジェクトの作成オプションが表示された場合は、誤ったフォルダーにいる可能性があります。Visual Studio Code のファイル メニューから「フォルダーを開く」を選択し、直接 **Northwind** フォルダーを開いてください。すると、下記のように Accounts、Environment などのセクションが表示されます。

「Accounts」の下の「Sign in to Microsoft 365」 2️⃣ をクリックし、ご自身の Microsoft 365 アカウントでサインインしてください。

![Agents Toolkit 内での Microsoft 365 へのサインイン](../assets/images/extend-message-ext-00/01-04-Setup-TTK-01.png)

ブラウザー ウィンドウがポップアップし、 Microsoft 365 へのサインインが促されます。「You are signed in now and close this page」と表示されたら、ウィンドウを閉じてください。

次に、「Custom App Upload Enabled」 チェッカーに緑のチェックマークが表示されていることを確認してください。もし表示されていない場合は、ユーザー アカウントに Teams アプリのアップロード権限がないことを意味します。ラボの演習 1 の手順に従ってください。 

また、「Copilot Access Enabled」 チェッカーに緑のチェックマークが表示されていることも確認してください。表示されていない場合は、ユーザー アカウントの Copilot 用ライセンスが付与されていないことを意味します。これはラボを進めるために必要となります。

![チェッカー](../assets/images/extend-message-ext-00/checker.png)

### ステップ 3 - サンプルドキュメントをテスト ユーザーの OneDrive にコピー

サンプル アプリケーションには、ラボ中に Copilot が参照できるいくつかのドキュメントが含まれています。この手順では、これらのファイルをユーザーの OneDrive にコピーして、Copilot が見つけられるようにします。テナントの設定によっては、このプロセスの一環として多要素認証の設定を求められる場合があります。

ブラウザーを開き、 Microsoft 365 ([https://www.office.com/](https://www.office.com/)) にアクセスします。ラボ中に使用する Microsoft 365 アカウントでサインインしてください。多要素認証の設定を求められる場合があります。

ページの左上にある「ワッフル」メニューを使用して 1️⃣ 、 Microsoft 365 内の OneDrive アプリケーションに移動します 2️⃣ 。

![Microsoft 365 の OneDrive アプリケーションへのナビゲーション](../assets/images/extend-message-ext-00/01-02-CopySampleFiles-01.png)

OneDrive 内で「My Files」 1️⃣ に移動します。既にドキュメント フォルダーがある場合は、それにも入ってください。なければ「My Files」の場所で直接作業できます。

![OneDrive のドキュメントへのナビゲーション](../assets/images/extend-message-ext-00/01-02-CopySampleFiles-02.png)

次に、「新規作成」 1️⃣ をクリックし、「フォルダー」 2️⃣ を選択して新しいフォルダーを作成します。

![OneDrive での新規フォルダーの追加](../assets/images/extend-message-ext-00/01-02-CopySampleFiles-03.png)

フォルダーの名前を "Northwind contracts" として「作成」をクリックします。

![新規フォルダー "Northwind contracts" の命名](../assets/images/extend-message-ext-00/01-02-CopySampleFiles-03b.png)

次に、この新しいフォルダー内から、再度「新規作成」 1️⃣ をクリックし、今回は「ファイルのアップロード」 2️⃣ を選択します。

![新しいフォルダーへのファイル追加](../assets/images/extend-message-ext-00/01-02-CopySampleFiles-04.png)

作業フォルダー内の **sampleDocs** フォルダーに移動します。すべてのファイルを選択し 1️⃣、「OK」 2️⃣ をクリックして一括アップロードします。

![リポジトリ内のサンプルファイルをフォルダーにアップロード](../assets/images/extend-message-ext-00/01-02-CopySampleFiles-05.png)

この手順を早めに行うことで、 Microsoft 365 の検索エンジンがラボで利用するタイミングまでにそれらを発見できる可能性が高まります。


## 完了

前提条件ラボを終了しました。これでアプリを実行する準備が整いました。下の「Next」ボタンを選択してください。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/00-prerequisites" />