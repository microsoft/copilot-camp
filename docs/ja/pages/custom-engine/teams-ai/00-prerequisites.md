---
search:
  exclude: true
---
# ラボ BTA0 - 前提条件

このラボでは、今後のコースで開発するカスタム エンジン エージェントをビルド、テスト、デプロイするための開発環境をセットアップします。

このラボで学習する内容:

- Visual Studio Code 用 **M365 Agents Toolkit** のインストールと構成  
- 必要なリソースを作成するための Azure 環境の準備

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
    これらのサンプルおよびラボは、教育およびデモンストレーション目的で提供されています。運用環境で使用することを想定していません。運用環境で利用する場合は、必ず本番レベルにアップグレードしてください。

!!! note "Note"
    独自のカスタム エンジン エージェントをインストールして実行するには、管理者権限を持つ Microsoft 365 テナントが必要です。カスタム エンジン エージェントをテストする際に Microsoft 365 Copilot License は不要です。

## 演習 1 : Microsoft Teams のセットアップ

### Step 1: Teams カスタム アプリのアップロードを有効化

既定では、エンド ユーザーはアプリを直接アップロードできません。Teams 管理者がエンタープライズ アプリ カタログにアップロードする必要があります。このステップでは、**M365 Agents Toolkit** による直接アップロードを許可するようにテナントを設定します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスします。これは Microsoft 365 管理センターです。  

2️⃣ 管理センター左側のパネルで **Show all** を選択し、ナビゲーションを全展開します。パネルが開いたら **Teams** を選択して Microsoft Teams 管理センターを開きます。  

3️⃣ Teams 管理センター左側で **Teams apps** を展開し、**Setup Policies** を選択します。App setup ポリシーの一覧が表示されるので、**Global (Org-wide default)** ポリシーを選択します。  

4️⃣ 最初のスイッチ **Upload custom apps** が **On** になっていることを確認します。  

5️⃣ 画面を下にスクロールし、**Save** ボタンを選択して変更を保存します。  

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="bta0" exercise="1" step="1" />

## 演習 2: M365 Agents Toolkit と前提条件のインストール

Windows、Mac、Linux のいずれのマシンでもラボを実行できますが、前提条件をインストールできる権限が必要です。アプリのインストールが許可されていない場合は、別のマシン（または仮想マシン）を使用してください。

### Step 1: Visual Studio Code のインストール

**M365 Agents Toolkit for Visual Studio Code** を使用するには、当然ながら Visual Studio Code が必要です。以下からダウンロードしてください: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}。

<cc-end-step lab="bta0" exercise="2" step="1" />

### Step 2: NodeJS のインストール

NodeJS は、コンピューター上で JavaScript を実行できるプログラムで、Microsoft Edge や Google Chrome などのブラウザーで使用されているオープンソースの「V8」エンジンを利用しています。本ワークショップで使用する Web サーバー コードを実行するために NodeJS が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、OS 用のバージョン 18 または 16 をインストールしてください。このラボは NodeJS バージョン 18.16.0 でテストされています。すでに別のバージョンの NodeJS がインストールされている場合は、[Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank}（Windows の場合は [こちらのバリエーション](https://github.com/coreybutler/nvm-windows){target=_blank}）を設定すると、同じマシンで簡単にバージョンを切り替えられます。

<cc-end-step lab="bta0" exercise="2" step="2" />

### Step 3: M365 Agents Toolkit のインストール

これらのラボは [M365 Agents Toolkit バージョン 5.0](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank} をベースにしています。以下の手順に従ってインストールしてください。

1️⃣ Visual Studio Code を開き、左側の **Extensions** ツールバー ボタンをクリックします。  

2️⃣ 「Teams」と検索し、**M365 Agents Toolkit** を見つけます。  

3️⃣ **Install** をクリックします。  

!!! note "If you have M365 Agents Toolkit installed but hidden"
    以前に **M365 Agents Toolkit** をインストール後、Visual Studio のサイドバーから非表示にしていた場合、アイコンが見当たらないことがあります。左サイドバーを右クリックし、**M365 Agents Toolkit** を再チェックして表示させてください。

<cc-end-step lab="bta0" exercise="2" step="3" />

## 演習 3: Azure サブスクリプションの取得

Path B の演習を完了するには、Azure 上にリソースを作成するための Azure サブスクリプションが必要です。まだサブスクリプションをお持ちでない場合は、30 日間使用できる 200 米ドル分のクレジットが付与される [Azure 無料アカウント](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} を有効化できます。

### Step 1: Azure 無料アカウントの作成

Azure 無料アカウントを有効化する手順:

1️⃣ [Azure free account](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} ページへアクセスし、**Activate** を選択します。  

2️⃣ 任意のアカウントでサインインします。演習で使用する Microsoft 365 テナント アカウントを利用することを推奨します。  

3️⃣ 「Privacy Statement」にチェックを入れ、**Next** を選択します。  

4️⃣ 本人確認のために携帯電話番号を入力します。  

5️⃣ 一時的な承認のために支払い情報を入力します。課金が発生するのは、従量課金制に移行した場合のみです。入力後、**Sign up** を選択します。  

!!! tip "Tip: Managing Azure resources after 30 days"
    Azure 無料アカウントは 30 日間のみ有効です。30 日後に無料サブスクリプションでサービスが稼働したままになっていないか確認してください。30 日以降も Azure サービスを利用する場合は、支出上限を解除して従量課金制サブスクリプションへアップグレードする必要があります。これにより、Azure 無料アカウントおよび一部の無料サービスを引き続き利用できます。

<cc-end-step lab="bta0" exercise="3" step="1" />

---8<--- "ja/b-congratulations.md"

ラボ BTA0 - セットアップを完了しました！  
次はラボ BTA1 - 最初のカスタム エンジン エージェントへ進みましょう。**Next** を選択してください。

<cc-next url="../01-custom-engine-agent" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/00-prerequisites--ja" />