---
search:
  exclude: true
---
# ラボ BTA0 - 前提条件

このラボでは、パス全体を通して開発するカスタムエンジン エージェントをビルド、テスト、デプロイするための開発環境をセットアップします。

このラボで学習できること:

- Visual Studio Code 用 **M365 Agents Toolkit** のインストールと構成
- 必要なリソースを作成するための Azure 環境の準備

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Onk04pehtjE" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を短時間で確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

!!! pied-piper "注意事項"
    これらのサンプルおよびラボは、教育およびデモンストレーション目的で提供されており、本番環境での使用を意図したものではありません。 本番環境で使用する場合は、必ず本番品質にアップグレードしてください。

!!! note "注"
    独自のカスタムエンジン エージェントをインストールして実行するには、管理者権限を持つ Microsoft 365 テナントが必要です。 カスタムエンジン エージェントをテストするだけであれば、Microsoft 365 Copilot  ライセンスは不要です。

## Exercise 1 : Microsoft Teams のセットアップ

### Step 1: Teams のカスタムアプリのアップロードを有効化する

既定では、エンド  ユーザーが直接アプリをアップロードすることはできません。Teams 管理者がエンタープライズ アプリ カタログにアップロードする必要があります。 このステップでは、M365 Agents Toolkit から直接アップロードできるようにテナントを構成します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスします。ここは Microsoft 365 管理センターです。

2️⃣ 左側のナビゲーションで **Show all** を選択してすべてのメニューを表示します。開いたら **Teams** を選択して Microsoft Teams 管理センターを開きます。

3️⃣ Microsoft Teams 管理センターの左側で **Teams apps** を展開し、**Setup Policies** を選択します。App setup policy の一覧が表示されるので **Global (Org-wide default)** ポリシーを選択します。

4️⃣ 最初のスイッチ **Upload custom apps** が **On** になっていることを確認します。

5️⃣ 変更を保存するために、必ず下までスクロールして **Save** ボタンを選択してください。

> 反映には最大 24 時間かかる場合がありますが、通常はもっと早く有効になります。

<cc-end-step lab="bta0" exercise="1" step="1" />

## Exercise 2: M365 Agents Toolkit と前提条件のインストール

Windows、Mac、Linux のいずれのマシンでもラボを実施できますが、前提条件をインストールできる環境が必要です。アプリケーションのインストールが許可されていない場合は、別のマシン（または仮想マシン）を使用してください。

### Step 1: Visual Studio Code のインストール

**M365 Agents Toolkit for Visual Studio Code** を使用するには、Visual Studio Code が必要です。以下からダウンロードしてください: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}。

<cc-end-step lab="bta0" exercise="2" step="1" />

### Step 2: NodeJS のインストール

NodeJS は JavaScript をローカルで実行できるプログラムで、Microsoft Edge や Google Chrome などのブラウザーで使用されているオープンソースの「 V8 」エンジンを採用しています。 このワークショップで使用する Web サーバー コードを実行するために NodeJS が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、お使いの OS に合わせてバージョン 18 または 16 をインストールしてください。 このラボは NodeJS 18.16.0 でテストされています。 すでに別のバージョンがインストールされている場合は、同じマシンで簡単にバージョンを切り替えられる [Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank}（Windows の場合は [こちらの派生版](https://github.com/coreybutler/nvm-windows){target=_blank}）の利用を検討してください。

<cc-end-step lab="bta0" exercise="2" step="2" />

### Step 3: M365 Agents Toolkit のインストール

これらのラボは [M365 Agents Toolkit version 5.0](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank} を基にしています。 以下の手順に従ってインストールしてください。

1️⃣ Visual Studio Code を開き、サイドバーの **Extensions** ボタンをクリック

2️⃣ 「Teams」で検索し、**M365 Agents Toolkit** を見つける

3️⃣ **Install** をクリック

!!! note "M365 Agents Toolkit がインストール済みで非表示の場合"
    以前に M365 Agents Toolkit をインストールして Visual Studio のサイドバーから非表示にした場合、アイコンが見当たらないことがあります。 左側のサイドバーを右クリックし、M365 Agents Toolkit にチェックを入れて再表示してください。

<cc-end-step lab="bta0" exercise="2" step="3" />

## Exercise 3: Azure サブスクリプションの取得

Path B の演習を完了するには、Azure にリソースを作成するための Azure サブスクリプションが必要です。まだサブスクリプションをお持ちでない場合は、[Azure 無料アカウント](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} を有効化できます。最初の 30 日間で使用できる 200 米ドル分のクレジットが付与され、多くの Azure サービスで利用できます。

### Step 1: Azure 無料アカウントの作成

Azure 無料アカウントを有効化する手順:

1️⃣ [Azure free account](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} ページにアクセスし、**Activate** を選択します。

2️⃣ 任意のアカウントでログインします。演習で使用する Microsoft 365 テナント アカウントの利用を推奨します。

3️⃣ プライバシー ステートメントのチェックボックスをオンにし、**Next** を選択します。

4️⃣ 本人確認のための携帯電話番号を入力します。

5️⃣ 支払い情報を入力します（仮認証用）。 従量課金制へ移行しない限り課金されません。入力後、**Sign up** を選択します。

!!! tip "ヒント: 30 日後の Azure リソース管理"
    Azure 無料アカウントは 30 日間のみ有効です。30 日経過時点で無料サブスクリプションに実行中のサービスがないことを確認してください。30 日以降も Azure サービスを継続利用したい場合は、支出上限を解除し、従量課金制サブスクリプションにアップグレードする必要があります。これにより、Azure 無料アカウントと一部の無料サービスを期間内で継続利用できます。

<cc-end-step lab="bta0" exercise="3" step="1" />

---8<--- "ja/b-congratulations.md"

Lab BTA0 - Setup が完了しました！  
次は lab BTA1 - 初めてのカスタムエンジン エージェント に進みます。 **Next** を選択してください。

<cc-next url="../01-custom-engine-agent" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/00-prerequisites" />