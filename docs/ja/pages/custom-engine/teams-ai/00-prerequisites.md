---
search:
  exclude: true
---
# ラボ BTA0 - 前提条件

本ラボでは、パス全体で開発するカスタムエンジンエージェントを開発、テスト、デプロイするための開発環境を設定します。

本ラボでは、以下の内容について学びます:

- Visual Studio Code 用 M365 Agents Toolkit のインストールと設定
- 必要なリソースを作成するための Azure 環境の準備

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Onk04pehtjE" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要をご確認ください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

!!! pied-piper "注意事項"
    これらのサンプルとラボは、教育およびデモンストレーション目的で提供されており、本番環境での利用を想定していません。本番環境で使用する場合は、本番品質にアップグレードすることなく利用しないでください。

!!! note "注意"
    独自のカスタムエンジンエージェントをインストールして実行するには、管理者権限を持つ Microsoft 365 テナントが必要です。カスタムエンジンエージェントのテストには Microsoft 365 Copilot License は必要ありません。

## エクササイズ 1 : Microsoft Teams のセットアップ

### ステップ 1: Teams カスタムアプリケーションのアップロードの有効化

デフォルトでは、エンド ユーザーはアプリケーションを直接アップロードできず、Teams 管理者がエンタープライズ アプリ カタログにアップロードする必要があります。このステップでは、 M365 Agents Toolkit による直接アップロードが利用できるよう、テナントの設定を確認します。

1️⃣ Microsoft 365 管理センターである [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスします。

2️⃣ 管理センターの左側パネルで **Show all** を選択して、全てのナビゲーションを表示します。パネルが開いたら、Teams を選択して Microsoft Teams 管理センターを開きます。

3️⃣ Microsoft Teams 管理センターの左側で、Teams アプリのアコーディオンを開きます。**Setup Policies** を選択すると、アプリのセットアップポリシーの一覧が表示されます。その後、**Global (Org-wide default) policy** を選択します。

4️⃣ 最初のスイッチ **Upload custom apps** が **On** に設定されていることを確認します。

5️⃣ 下までスクロールして **Save** ボタンを選択し、変更を保存します。

> 変更が反映されるまでに最長 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="bta0" exercise="1" step="1" />

## エクササイズ 2: M365 Agents Toolkit と必要な前提条件のインストール

これらのラボは Windows、Mac、または Linux マシンで実施できますが、必要な前提条件をインストールする権限が必要です。コンピューターにアプリケーションをインストールする許可がない場合は、ワークショップ全体で使用する他のマシン（または仮想マシン）を用意する必要があります。

### ステップ 1: Visual Studio Code のインストール

**M365 Agents Toolkit for Visual Studio Code** が Visual Studio Code を必要とするのは当然です！こちらからダウンロードできます： [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}.

<cc-end-step lab="bta0" exercise="2" step="1" />

### ステップ 2: NodeJS のインストール

NodeJS は、コンピューター上で JavaScript を実行できるプログラムであり、Microsoft Edge や Google Chrome などの一般的な Web ブラウザで使用されているオープンソースの "V8" エンジンを利用しています。本ワークショップで使用する Web サーバーコードの実行には NodeJS が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、お使いのオペレーティングシステム用にバージョン 18 または 16 をインストールしてください。本ラボは NodeJS バージョン 18.16.0 でテストされています。既に別のバージョンの NodeJS をインストールしている場合は、同一のコンピューター上で簡単に Node のバージョンを切り替えられる [Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank}（または Microsoft Windows 向けの [this variation](https://github.com/coreybutler/nvm-windows){target=_blank}）の設定を検討してください.

<cc-end-step lab="bta0" exercise="2" step="2" />

### ステップ 3: M365 Agents Toolkit のインストール

本ラボは [M365 Agents Toolkit version 5.0](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank} を使用しており、以下のスクリーンショットに示す手順に従います。

1️⃣ Visual Studio Code を開き、拡張機能ツールバーボタンをクリックします。

2️⃣ 「Teams」と検索し、 M365 Agents Toolkit を探します。

3️⃣ **Install** をクリックします。

!!! note "M365 Agents Toolkit を既にインストール済みで非表示の場合"
    以前に M365 Agents Toolkit をインストールし、Visual Studio のサイドバーで非表示にした場合、表示されない理由が疑問に思われるかもしれません。サイドバーを右クリックして、 M365 Agents Toolkit のチェックを入れることで再び表示させることができます.

<cc-end-step lab="bta0" exercise="2" step="3" />

## エクササイズ 3: Azure サブスクリプションの取得

パス B のエクササイズを完了するには、Azure 上にリソースを作成するための Azure サブスクリプションが必要です。まだ Azure サブスクリプションをお持ちでない場合は、ほとんどの Azure サービスで最初の 30 日間に使用できる 200ドル分のクレジットがある [Azure free account](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} を有効化できます.

### ステップ 1: Azure free account の作成

Azure free account を有効化するための手順は以下の通りです:

1️⃣ [Azure free account](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} ページにアクセスし、**Activate** を選択します.

2️⃣ 任意のアカウントでログインします。エクササイズで使用する Microsoft 365 テナント アカウントの利用を推奨します.

3️⃣ Privacy Statement のチェックボックスにチェックを入れた後、**Next** を選択します.

4️⃣ 本人確認のために携帯電話番号を入力します.

5️⃣ 一時的な認証のための支払い情報を入力します。従量課金制に移行しない限り課金されることはありません。その後、**Sign up** を選択します.

!!! tip "ヒント：30日後の Azure リソースの管理"
    Azure free account は 30 日間のみ有効です。30 日後に無料サブスクリプションでサービスが稼働していないことを確認してください。30 日以降も Azure サービスを継続して利用する場合は、支出制限を解除して従量課金制サブスクリプションにアップグレードする必要があります。これにより、Azure free account および特定の無料サービスをその期間中利用し続けることが可能になります.

<cc-end-step lab="bta0" exercise="3" step="1" />

---8<--- "ja/b-congratulations.md"

Lab BTA0 - セットアップ を完了しました！
次は Lab BTA1 - First custom engine agent （最初のカスタムエンジンエージェント）に進む準備ができました。Next を選択してください.

<cc-next url="../01-custom-engine-agent" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/00-prerequisites" />