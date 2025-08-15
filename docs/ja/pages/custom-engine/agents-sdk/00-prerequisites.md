---
search:
  exclude: true
---
# ラボ BMA0 - 前提条件

このラボでは、パス全体で開発するカスタム エンジン エージェントをビルド、テスト、デプロイするための開発環境を構築します。

このラボで学習する内容:

- Microsoft 365 環境のセットアップ
- Visual Studio 2022 と Microsoft 365 エージェント Toolkit のインストールと構成
- 必要なリソースを作成するための Azure 環境の準備

!!! pied-piper "注意事項"
    これらのサンプルとラボは、教育およびデモンストレーションを目的としており、本番環境での使用を意図したものではありません。本番環境で使用する場合は、必ず本番品質にアップグレードしてください。

!!! note "注"
    カスタム エンジン エージェントをインストールして実行するには、管理者権限を持つ Microsoft 365 テナントが必要です。カスタム エンジン エージェントのテストには Microsoft 365 Copilot ライセンスは必要ありません。

## 演習 1 : Microsoft Teams のセットアップ

### 手順 1: Teams のカスタム アプリのアップロードを有効化する

既定では、エンド ユーザーはアプリを直接アップロードできず、Teams 管理者がエンタープライズ アプリ カタログにアップロードする必要があります。この手順では、M365 エージェント Toolkit からの直接アップロードが可能になるようにテナントを設定します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスして、Microsoft 365 Admin Center を開きます。

2️⃣ 管理センターの左ペインで **すべて表示** を選択し、ナビゲーション全体を表示します。パネルが開いたら **Teams** を選択して Microsoft Teams 管理センターを開きます。

3️⃣ Microsoft Teams 管理センターの左側で **Teams アプリ** のアコーディオンを開き、**セットアップ ポリシー** を選択します。App セットアップ ポリシーの一覧が表示されるので、**グローバル (組織全体の既定値)** ポリシーを選択します。

4️⃣ **カスタム アプリのアップロード** のスイッチが **オン** になっていることを確認します。

5️⃣ 画面を下までスクロールし、**保存** ボタンを選択して変更を保存します。

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="bma0" exercise="1" step="1" />

## 演習 2: M365 エージェント Toolkit のセットアップ

これらのラボは Windows マシンで実施できます。前提条件をインストールできる権限が必要です。アプリケーションのインストールが許可されていない場合は、別のマシン (または仮想マシン) を使用してください。

### 手順 1: Visual Studio 用 Agents Toolkit をインストールする

1. Visual Studio 2022 は [Visual Studio 2022](https://code.visualstudio.com/download){target=_blank} からダウンロードできます。  
1. **Install** を選択します。既に Visual Studio をインストールしている場合は **Modify** を選択します。  
1. Visual Studio インストーラーにすべてのワークロードが表示されます。  
    ![The Visual Studio installation UI with the list of components available for ASP.NET and web development and the Microsoft 365 Agents Toolkit highlighted.](../../../assets/images/agents-sdk/visual-studio-install.png)  
1. インストール画面で次の操作を行います:  
    1. **Workloads > ASP.NET and web development** を選択します。  
    1. 右側のペインで **Installation details > Optional** に移動し、**Microsoft 365 Agents toolkit** を選択します。  
    1. **Install** を選択します。Visual Studio がインストールされ、ポップアップが表示されます。  
1. **Launch** を選択します。

<cc-end-step lab="bma0" exercise="2" step="1" />

## 演習 3: Azure サブスクリプションの取得

Path B の演習を完了するには、Azure にリソースを作成するための Azure サブスクリプションが必要です。まだサブスクリプションをお持ちでない場合は、[Azure 無料アカウント](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} を有効化できます。30 日間で使用できる $200 分のクレジットが付与され、多くの Azure サービスで利用できます。

### 手順 1: Azure 無料アカウントの作成

Azure 無料アカウントを有効化する手順:

1️⃣ [Azure free account](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} ページにアクセスし、**Activate** を選択します。

2️⃣ 任意のアカウントでログインします。演習で使用する Microsoft 365 テナント アカウントの使用を推奨します。

3️⃣ プライバシー ステートメントのチェック ボックスをオンにし、**Next** を選択します。

4️⃣ 本人確認のための携帯電話番号を入力します。

5️⃣ 一時的な承認用に支払い情報を入力します。従量課金制へ移行しない限り請求は発生しません。その後、**Sign up** を選択します。

!!! tip "ヒント: 30 日後の Azure リソース管理"
    Azure 無料アカウントは 30 日間のみ有効です。30 日後に無料サブスクリプションでサービスが稼働していないことを確認してください。30 日以降も Azure サービスを利用する場合は、支出上限を解除して従量課金制サブスクリプションにアップグレードする必要があります。これにより、Azure 無料アカウントと対象の無料サービスを継続して利用できます。

<cc-end-step lab="bma0" exercise="3" step="1" />

---8<--- "ja/b-congratulations.md"

これでラボ BMA0 - セットアップが完了しました。  
次はラボ BMA1 - Azure AI Foundry でエージェントを準備する に進みます。**Next** を選択してください。

<cc-next url="../01-agent-in-foundry" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/00-prerequisites--ja" />