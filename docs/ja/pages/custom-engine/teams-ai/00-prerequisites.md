---
search:
  exclude: true
---
# ラボ BTA0 - 前提条件

このラボでは、このコースを通じて開発するカスタム エンジン エージェントをビルド、テスト、デプロイするための開発環境を構築します。

このラボでは次の内容を学習します。

- **M365 Agents Toolkit for Visual Studio Code** をインストールして構成する方法  
- 必要なリソースを作成するために Azure 環境を準備する方法

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Onk04pehtjE" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

!!! pied-piper "Disclaimer"
    これらのサンプルとラボは学習およびデモンストレーションを目的としており、本番環境での使用を想定していません。本番環境で使用する場合は、必ず本番品質へアップグレードしてください。

!!! note "Note"
    独自のカスタム エンジン エージェントをインストールして実行するには、管理者権限を持つ Microsoft 365 テナントが必要です。カスタム エンジン エージェントをテストするだけであれば Microsoft 365 Copilot ライセンスは不要です。

## エクササイズ 1 : Microsoft Teams のセットアップ

### 手順 1: Teams でカスタム アプリのアップロードを有効化する

既定では、エンド ユーザーはアプリを直接アップロードできず、Teams 管理者がエンタープライズ アプリ カタログにアップロードする必要があります。この手順では、M365 Agents Toolkit から直接アップロードできるようにテナントを設定します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスします。ここは Microsoft 365 管理センターです。  

2️⃣ 管理センター左側のパネルで **Show all** を選択してナビゲーションをすべて展開します。パネルが開いたら **Teams** を選択し、Microsoft Teams 管理センターを開きます。  

3️⃣ Microsoft Teams 管理センター左側で **Teams apps** セクションを展開し、**Setup Policies** を選択します。アプリのセットアップ ポリシーの一覧が表示されるので、**Global (Org-wide default)** ポリシーを選択します。  

4️⃣ 最初のスイッチ **Upload custom apps** が **On** になっていることを確認します。  

5️⃣ 画面を下へスクロールし、**Save** ボタンを選択して変更を保存します。  

> 変更が反映されるまでに最大 24 時間 かかる場合がありますが、通常はもっと早く完了します。

<cc-end-step lab="bta0" exercise="1" step="1" />

## エクササイズ 2: M365 Agents Toolkit と前提条件のインストール

これらのラボは Windows、Mac、Linux のいずれのマシンでも実施できますが、前提ソフトウェアをインストールできる必要があります。もしご使用のコンピューターにアプリをインストールできない場合は、別のマシン（または仮想マシン）をご利用ください。

### 手順 1: Visual Studio Code のインストール

当然ですが、**Visual Studio Code 用 M365 Agents Toolkit** を使用するには Visual Studio Code 本体が必要です。こちらからダウンロードしてください: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}。

<cc-end-step lab="bta0" exercise="2" step="1" />

### 手順 2: NodeJS のインストール

NodeJS はコンピューター上で JavaScript を実行できるプログラムで、Microsoft Edge や Google Chrome などのブラウザーでも使用されているオープン ソースの V8 エンジンを利用しています。本ワークショップで使用する Web サーバー コードを実行するために NodeJS が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、お使いの OS 向けにバージョン 18 または 16 をインストールしてください。このラボは NodeJS バージョン 18.16.0 でテスト済みです。すでに別バージョンの NodeJS がインストールされている場合は、同一マシンで簡単にバージョンを切り替えられる [Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank}（Windows の場合は [こちらのバリエーション](https://github.com/coreybutler/nvm-windows){target=_blank}）の利用を検討してください。

<cc-end-step lab="bta0" exercise="2" step="2" />

### 手順 3: M365 Agents Toolkit のインストール

これらのラボは [M365 Agents Toolkit バージョン 5.0](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank} を基にしています。以下の手順に従ってインストールしてください。

1️⃣ Visual Studio Code を開き、左側の **Extensions** アイコンをクリックします。  

2️⃣ 「Teams」で検索し、**M365 Agents Toolkit** を見つけます。  

3️⃣ **Install** をクリックします。  

!!! note "If you have M365 Agents Toolkit installed but hidden"
    以前に M365 Agents Toolkit をインストールしたあと、Visual Studio のサイドバーで非表示にしていた場合は、左サイドバーを右クリックして **M365 Agents Toolkit** にチェックを入れると再表示できます。

<cc-end-step lab="bta0" exercise="2" step="3" />

## エクササイズ 3: Azure サブスクリプションの取得

パス B の演習を完了するには、Azure 上にリソースを作成するための Azure サブスクリプションが必要です。まだお持ちでない場合は、[Azure 無料アカウント](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} を有効化すると、最初の 30 日間 に使用できる 200 米ドル分のクレジットが付与されます。

### 手順 1: Azure 無料アカウントの作成

Azure 無料アカウントを有効化するには、次の手順に従ってください。

1️⃣ [Azure free account](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} ページに移動し、**Activate** を選択します。  

2️⃣ 任意のアカウントでサインインします。演習で使用する予定の Microsoft 365 テナント アカウントを利用することを推奨します。  

3️⃣ プライバシー ステートメントのチェック ボックスをオンにして **Next** を選択します。  

4️⃣ 本人確認のため、携帯電話番号を入力します。  

5️⃣ 一時的な認証用として支払い情報を入力し、**Sign up** を選択します。課金は、従量課金制へ移行しない限り発生しません。  

!!! tip "Tip: Managing Azure resources after 30 days"
    Azure 無料アカウントは 30 日間 のみ有効です。30 日を過ぎても無料サブスクリプションでサービスが稼働していないかを確認してください。30 日経過後も Azure サービスを継続利用したい場合は、支出制限を解除して従量課金制サブスクリプションへアップグレードする必要があります。これにより、Azure 無料アカウントおよび一部の無料サービスを継続利用できます。

<cc-end-step lab="bta0" exercise="3" step="1" />

---8<--- "ja/b-congratulations.md"

ラボ BTA0 - セットアップ が完了しました!  
次はラボ BTA1 - 最初のカスタム エンジン エージェント に進みましょう。**Next** を選択してください。

<cc-next url="../01-custom-engine-agent" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/00-prerequisites" />