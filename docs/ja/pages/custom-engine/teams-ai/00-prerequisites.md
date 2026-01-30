---
search:
  exclude: true
---
# ラボ BTA0 - 前提条件

このラボでは、コースを通じて開発するカスタムエンジン エージェントをビルド、テスト、デプロイするための開発環境をセットアップします。

このラボで学習する内容:

-  Visual Studio Code 用  M365 Agents Toolkit  のインストールと構成  
-  必要なリソースを作成するための  Azure  環境の準備

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Onk04pehtjE" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要をご覧ください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

!!! pied-piper "注意事項"
    これらのサンプルおよびラボは、学習とデモンストレーションを目的としており、運用環境での使用を想定していません。運用環境に導入する場合は、必ず運用レベルへアップグレードしてください。

!!! note "注"
    独自のカスタムエンジン エージェントをインストールして実行するには、管理者権限を持つ  Microsoft 365  テナントが必要です。カスタムエンジン エージェントをテストするだけであれば、 Microsoft 365 Copilot  ライセンスは不要です。

## Exercise 1 :  Microsoft Teams のセットアップ

### Step 1: Teams カスタムアプリのアップロードを有効化する

既定では、エンド  ユーザー  はアプリを直接アップロードできず、 Teams 管理者がエンタープライズ アプリカタログにアップロードする必要があります。この手順では、  M365 Agents Toolkit  が直接アップロードできるようにテナントを設定します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスします。これは  Microsoft 365  管理センターです。

2️⃣ 管理センターの左ペインで **Show all** を選択し、ナビゲーション全体を展開します。パネルが開いたら **Teams** を選択して  Microsoft Teams  管理センターを開きます。

3️⃣  Microsoft Teams  管理センター左側の **Teams apps** アコーディオンを開きます。**Setup Policies** を選択すると、アプリ設定ポリシーの一覧が表示されます。**Global (Org-wide default) policy** を選択します。

4️⃣ 最初のスイッチ **Upload custom apps** が **On** になっていることを確認します。

5️⃣ 必ずページを下にスクロールし、**Save** ボタンを選択して変更を保存します。

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="bta0" exercise="1" step="1" />

## Exercise 2:  M365 Agents Toolkit と前提条件のインストール

これらのラボは  Windows、Mac、Linux  のいずれのマシンでも実施できますが、前提条件をインストールできる必要があります。アプリケーションのインストールが許可されていない場合は、別のマシン（または仮想マシン）を使用してください。

### Step 1:  Visual Studio Code のインストール

** M365 Agents Toolkit for Visual Studio Code ** を利用するには、当然ながら  Visual Studio Code  が必要です。以下からダウンロードしてください: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}。

<cc-end-step lab="bta0" exercise="2" step="1" />

### Step 2:  NodeJS のインストール

NodeJS は、コンピューター上で JavaScript を実行できるプログラムです。これは  Microsoft Edge  や  Google Chrome  といった人気ブラウザーで使用されているオープンソースの「 V8 」エンジンを利用しています。本ワークショップで使用する Web サーバーコードを実行するには、 NodeJS が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、バージョン 18 または 16 をお使いの OS 向けにインストールしてください。このラボは  NodeJS バージョン 18.16.0 でテストされています。すでに別のバージョンの  NodeJS をインストールしている場合は、[Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank}（または  Windows 向けの [こちらのバリエーション](https://github.com/coreybutler/nvm-windows){target=_blank}）を設定すると、同じマシンで簡単に  Node  バージョンを切り替えられます。

<cc-end-step lab="bta0" exercise="2" step="2" />

### Step 3:  M365 Agents Toolkit のインストール

これらのラボは [M365 Agents Toolkit version 5.0](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank} を基にしています。以下のスクリーンショットの手順に従ってください。

1️⃣  Visual Studio Code  を開き、左のツールバーで **Extensions** ボタンをクリックします。  

2️⃣ 「Teams」と検索し、  M365 Agents Toolkit  を探します。  

3️⃣ **Install** をクリックします。  

!!! note " M365 Agents Toolkit がインストール済みだが非表示の場合"
    以前に  M365 Agents Toolkit  をインストールしてサイドバーから非表示にしていた場合、アイコンが見当たらないことがあります。その場合は左サイドバーを右クリックし、  M365 Agents Toolkit  にチェックを入れて再表示してください。

<cc-end-step lab="bta0" exercise="2" step="3" />

## Exercise 3:  Azure サブスクリプションの取得

パス B の演習を完了するには、 Azure 上にリソースを作成するための  Azure  サブスクリプションが必要です。まだサブスクリプションをお持ちでない場合は、[Azure free account](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} を有効化することで、最初の 30 日間に利用可能な 200 ドル相当のクレジットを獲得できます。

### Step 1:  Azure 無料アカウントの作成

Azure 無料アカウントを有効化する手順:

1️⃣ [Azure free account](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} ページにアクセスし、**Activate** を選択します。  

2️⃣ 任意のアカウントでサインインします。演習で使用する  Microsoft 365  テナント アカウントでのサインインを推奨します。  

3️⃣ プライバシーステートメントのチェックボックスをオンにし、**Next** を選択します。  

4️⃣ 本人確認のため、携帯電話番号を入力します。  

5️⃣ 一時的な認証用として支払い情報を入力します。従量課金制へ移行しない限り請求は発生しません。最後に **Sign up** を選択します。  

!!! tip "ヒント: 30 日後の Azure リソース管理"
    Azure 無料アカウントは 30 日間のみ有効です。30 日経過時点で無料サブスクリプションに稼働中のサービスがないことを確認してください。30 日以降も Azure サービスを継続利用したい場合は、支出制限を解除して従量課金サブスクリプションへアップグレードする必要があります。これにより、 Azure 無料アカウントおよび対象の無料サービスを期間中引き続き利用できます。

<cc-end-step lab="bta0" exercise="3" step="1" />

---8<--- "ja/b-congratulations.md"

ラボ BTA0 - セットアップが完了しました!  
次はラボ BTA1 - 最初のカスタムエンジン エージェント へ進みます。**Next** を選択してください。

<cc-next url="../01-custom-engine-agent" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/00-prerequisites--ja" />