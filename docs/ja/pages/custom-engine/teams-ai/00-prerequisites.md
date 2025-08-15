---
search:
  exclude: true
---
# ラボ BTA0 - 前提条件

このラボでは、今後のコースで開発するカスタムエンジン **エージェント** をビルド、テスト、デプロイできるよう、開発環境をセットアップします。

このラボで学習する内容:

- Visual Studio Code 用 **M365 Agents Toolkit** をインストールして構成する  
- 必要なリソースを作成できるように Azure 環境を準備する

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Onk04pehtjE" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を短時間で確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

!!! pied-piper "注意事項"
    これらのサンプルとラボは、学習およびデモ目的で提供されています。実運用を想定していません。実運用環境で使用する場合は、必ず運用レベルにアップグレードしてください。

!!! note "メモ"
    独自のカスタムエンジン **エージェント** をインストールして実行するには、管理者権限を持つ Microsoft 365 テナントが必要です。カスタムエンジン **エージェント** をテストするだけであれば、Microsoft 365 Copilot ライセンスは不要です。

## 演習 1 : Microsoft Teams のセットアップ

### 手順 1: Teams でカスタムアプリのアップロードを有効にする

既定では、エンド **ユーザー** はアプリを直接アップロードできず、Teams 管理者がエンタープライズアプリ カタログにアップロードする必要があります。この手順では、**M365 Agents Toolkit** から直接アップロードできるようにテナントを構成します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスし、Microsoft 365 管理センターを開きます。  

2️⃣ 左側のパネルで **Show all** を選択してナビゲーションを展開し、**Teams** を選択して Microsoft Teams 管理センターを開きます。  

3️⃣ 左側のメニューで **Teams apps** を展開し、**Setup Policies** を選択します。表示された App setup policy の一覧から **Global (Org-wide default)** ポリシーを選択します。  

4️⃣ 最初のスイッチ **Upload custom apps** が **On** になっていることを確認します。  

5️⃣ 画面をスクロールして **Save** ボタンを選択し、変更を保存します。  

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="bta0" exercise="1" step="1" />

## 演習 2: M365 Agents Toolkit と前提条件のインストール

このラボは Windows、Mac、Linux のいずれのマシンでも実施できますが、前提条件をインストールできる権限が必要です。インストールが許可されていない場合は、別のマシン（または仮想マシン）を用意してください。

### 手順 1: Visual Studio Code をインストールする

**M365 Agents Toolkit for Visual Studio Code** を使用するには Visual Studio Code が必要です。以下からダウンロードしてください: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}。

<cc-end-step lab="bta0" exercise="2" step="1" />

### 手順 2: NodeJS をインストールする

NodeJS は、オープンソースの V8 エンジンを利用してコンピューター上で JavaScript を実行できるプログラムです。ワークショップ全体で使用する Web **サーバー** コードを実行するために必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、バージョン 18 または 16 をインストールしてください。このラボは NodeJS 18.16.0 でテスト済みです。別のバージョンがすでにインストールされている場合は、同じマシンで簡単にバージョンを切り替えられる [Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank}（Windows の場合は [こちら](https://github.com/coreybutler/nvm-windows){target=_blank}）の利用を検討してください。

<cc-end-step lab="bta0" exercise="2" step="2" />

### 手順 3: M365 Agents Toolkit をインストールする

これらのラボは [M365 Agents Toolkit バージョン 5.0](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank} を基にしています。以下の手順に従ってインストールしてください。

1️⃣ Visual Studio Code を開き、左側の **Extensions** アイコンをクリックします。  

2️⃣ 「Teams」で検索し、**M365 Agents Toolkit** を見つけます。  

3️⃣ **Install** をクリックします。  

!!! note "以前に M365 Agents Toolkit をインストールして非表示にした場合"
    以前に **M365 Agents Toolkit** をインストール後、Visual Studio のサイドバーから非表示にした場合は、サイドバーを右クリックして **M365 Agents Toolkit** をチェックし、再表示してください。

<cc-end-step lab="bta0" exercise="2" step="3" />

## 演習 3: Azure サブスクリプションを取得する

Path B の演習を完了するには、Azure にリソースを作成するための Azure サブスクリプションが必要です。まだお持ちでない場合は、[Azure 無料アカウント](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} を有効化できます。最初の 30 日間で使用できる $200 分のクレジットが付与され、多くの Azure サービスを試用できます。

### 手順 1: Azure 無料アカウントを作成する

Azure 無料アカウントを有効化する手順:

1️⃣ [Azure 無料アカウント](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} ページにアクセスし、**Activate** を選択します。  

2️⃣ 任意のアカウントでサインインします。演習で利用する Microsoft 365 テナント アカウントの使用を推奨します。  

3️⃣ プライバシー ステートメントのチェックボックスをオンにし、**Next** を選択します。  

4️⃣ 本人確認のための携帯電話番号を入力します。  

5️⃣ 一時的な認証用に支払い情報を入力します。従量課金制に移行しない限り請求は発生しません。入力後、**Sign up** を選択します。  

!!! tip "ヒント: 30 日経過後の Azure リソース管理"
    Azure 無料アカウントは 30 日間のみ有効です。30 日終了時に無料サブスクリプションでサービスが稼働していないことを確認してください。30 日後も Azure サービスを継続利用する場合は、支出制限を解除して従量課金制サブスクリプションへアップグレードする必要があります。これにより、Azure 無料アカウントと選択した無料サービスを引き続き利用できます。

<cc-end-step lab="bta0" exercise="3" step="1" />

---8<--- "ja/b-congratulations.md"

ラボ BTA0 - セットアップが完了しました!  
次はラボ BTA1 - 最初のカスタムエンジン **エージェント** へ進みましょう。**Next** を選択してください。

<cc-next url="../01-custom-engine-agent" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/00-prerequisites--ja" />