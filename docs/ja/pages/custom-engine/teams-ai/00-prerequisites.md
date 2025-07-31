---
search:
  exclude: true
---
# Lab BTA0 - 前提条件

この ラボ では、コース全体で開発するカスタム エンジン エージェントを構築、テスト、デプロイするための開発環境をセットアップします。

この ラボ で学習する内容は次のとおりです。

- Visual Studio Code 用 ** M365 Agents Toolkit ** をインストールして構成する  
- 必要なリソースを作成できるように Azure 環境を準備する  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Onk04pehtjE" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画で ラボ の概要を簡単に確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

!!! pied-piper "Disclaimer"
    これらのサンプルおよび ラボ は、教育目的およびデモンストレーション目的で提供されています。本番環境での使用を想定していません。本番環境で使用する場合は、必ず本番品質へアップグレードしてください。

!!! note "Note"
    独自のカスタム エンジン エージェントをインストールして実行するには、管理者権限を持つ Microsoft 365 テナントが必要です。カスタム エンジン エージェントのテストには Microsoft 365 Copilot ライセンス は必要ありません。

## Exercise 1 : Microsoft Teams のセットアップ

### Step 1: Teams でカスタム アプリのアップロードを有効化

既定では、エンド ユーザーはアプリを直接アップロードできません。Teams 管理者がエンタープライズ アプリ カタログにアップロードする必要があります。この手順では、 ** M365 Agents Toolkit ** から直接アップロードできるようにテナントが構成されていることを確認します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスします。ここは Microsoft 365 Admin Center です。  

2️⃣ 管理センターの左ペインで ** Show all ** を選択してナビゲーションを展開します。パネルが開いたら ** Teams ** を選択して Microsoft Teams 管理センターを開きます。  

3️⃣ Microsoft Teams 管理センター左側で ** Teams apps ** を展開し、 ** Setup Policies ** を選択します。App setup policy の一覧が表示されるので ** Global (Org-wide default) ** ポリシーを選択します。  

4️⃣ 最初のスイッチ ** Upload custom apps ** が ** On ** になっていることを確認します。  

5️⃣ 画面を下までスクロールし、 ** Save ** ボタンを選択して変更を保存します。  

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="bta0" exercise="1" step="1" />

## Exercise 2: M365 Agents Toolkit と前提条件のインストール

Windows、Mac、Linux のいずれのマシンでも ラボ を実行できますが、前提条件をインストールできる必要があります。アプリケーションのインストールが許可されていない場合は、別のマシン (または仮想マシン) を用意してください。

### Step 1: Visual Studio Code のインストール

** M365 Agents Toolkit for Visual Studio Code ** を使用するには Visual Studio Code が必要です。こちらからダウンロードしてください: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}。

<cc-end-step lab="bta0" exercise="2" step="1" />

### Step 2: NodeJS のインストール

NodeJS は、コンピューター上で JavaScript を実行できるプログラムです。Microsoft Edge や Google Chrome などで使用されているオープンソースの V8 エンジンを利用しています。この ワークショップ で使用する Web サーバー コードを実行するために NodeJS が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、お使いの OS 用のバージョン 18 または 16 をインストールしてください。この ラボ では NodeJS 18.16.0 でテストしています。すでに別の NodeJS バージョンがインストールされている場合は、[Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank} (Windows の場合は [こちらのバリエーション](https://github.com/coreybutler/nvm-windows){target=_blank}) を使用すると簡単にバージョンを切り替えられます。

<cc-end-step lab="bta0" exercise="2" step="2" />

### Step 3: M365 Agents Toolkit のインストール

この ラボ は [M365 Agents Toolkit バージョン 5.0](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank} をベースにしています。以下の手順に従ってインストールしてください。

1️⃣ Visual Studio Code を開き、サイドバーの ** Extensions ** アイコンをクリックします。  

2️⃣ 「Teams」と検索し、 ** M365 Agents Toolkit ** を見つけます。  

3️⃣ ** Install ** をクリックします。  

!!! note "If you have M365 Agents Toolkit installed but hidden"
    以前に ** M365 Agents Toolkit ** をインストールしてサイドバーから非表示にした場合、見つからないことがあります。左サイドバーを右クリックし、 ** M365 Agents Toolkit ** にチェックを入れて再表示してください。

<cc-end-step lab="bta0" exercise="2" step="3" />

## Exercise 3: Azure サブスクリプションの取得

Path B の演習を完了するには、Azure 上にリソースを作成するための Azure サブスクリプションが必要です。まだサブスクリプションをお持ちでない場合は、[Azure 無料アカウント](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} を有効化できます。最初の 30 日間に使用できる 200 米ドル分のクレジットが付与され、多くの Azure サービスで利用できます。

### Step 1: Azure 無料アカウントの作成

Azure 無料アカウントを有効化する手順は次のとおりです。

1️⃣ [Azure 無料アカウント](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} ページに移動し、 ** Activate ** を選択します。  

2️⃣ お好みのアカウントでサインインします。演習で使用する Microsoft 365 テナント アカウントを使用することを推奨します。  

3️⃣ プライバシー ステートメントのチェック ボックスをオンにし、 ** Next ** を選択します。  

4️⃣ 本人確認のために携帯電話番号を入力します。  

5️⃣ 一時的な認証用に支払い情報を入力します。 ** Pay-as-you-go ** に移行しない限り課金されません。最後に ** Sign up ** を選択します。  

!!! tip "Tip: Managing Azure resources after 30 days"
    Azure 無料アカウントは 30 日間のみ有効です。30 日後に無料サブスクリプションでサービスが稼働していないことを確認してください。30 日以降も Azure サービスを利用する場合は、支出上限を解除して ** Pay-as-you-go ** サブスクリプションへアップグレードする必要があります。アップグレードすると、Azure 無料アカウントと対象の無料サービスを期間中継続して利用できます。

<cc-end-step lab="bta0" exercise="3" step="1" />

---8<--- "ja/b-congratulations.md"

Lab BTA0 - Setup を完了しました!  
次は Lab BTA1 - First custom engine agent へ進む準備ができました。 ** Next ** を選択してください。

<cc-next url="../01-custom-engine-agent" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/00-prerequisites--ja" />