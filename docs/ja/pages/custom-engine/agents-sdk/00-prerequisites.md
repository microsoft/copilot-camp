---
search:
  exclude: true
---
# ラボ BMA0 - 前提条件

このラボでは、開発環境をセットアップし、パス全体で作成するカスタム エンジン エージェントをビルド、テスト、デプロイできるようにします。

このラボで学習する内容:

- Microsoft 365 環境のセットアップ
- Visual Studio 2022 への Microsoft 365 エージェント Toolkit のインストールと構成
- 必要なリソースを作成するための Azure 環境の準備

!!! pied-piper "注意事項"
    これらのサンプルとラボは、学習用およびデモ用を目的としており、運用環境での使用を目的としていません。運用環境に導入する場合は、必ず運用品質にアップグレードしてください。

!!! note "メモ"
    独自のカスタム エンジン エージェントをインストールして実行するには、管理者権限を持つ Microsoft 365 テナントが必要です。カスタム エンジン エージェントをテストするために Microsoft 365 Copilot ライセンスは不要です。

## Exercise 1 : Microsoft Teams のセットアップ

### Step 1: Teams のカスタムアプリのアップロードを有効化する

既定では、エンド ユーザーはアプリを直接アップロードできません。Teams 管理者がエンタープライズ アプリ カタログにアップロードする必要があります。この手順では、M365 エージェント Toolkit による直接アップロードがテナントで実行できるように設定を確認します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスします (Microsoft 365 管理センター)。

2️⃣ 管理センターの左側パネルで **すべて表示** を選択してナビゲーション全体を開きます。パネルが開いたら **Teams** を選択して Microsoft Teams 管理センターを開きます。

3️⃣ Microsoft Teams 管理センターの左側で **Teams アプリ** を展開し、**セットアップ ポリシー** を選択します。アプリ セットアップ ポリシーの一覧が表示されるので、**グローバル (組織全体の既定値)** ポリシーを選択します。

4️⃣ 最初のスイッチ **カスタム アプリのアップロード** が **オン** になっていることを確認します。

5️⃣ 必ず下へスクロールして **保存** ボタンを選択し、変更を保存します。

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="bma0" exercise="1" step="1" />

## Exercise 2: M365 エージェント Toolkit のセットアップ

これらのラボは Windows マシンで実施できます。前提条件をインストールできる権限が必要です。アプリのインストールが許可されていない場合は、別のマシン (または仮想マシン) を用意してください。

### Step 1: Visual Studio 用 エージェント Toolkit のインストール

1. Visual Studio 2022 は [Visual Studio 2022](https://code.visualstudio.com/download){target=_blank} からダウンロードできます。  
1. **Install** を選択します。既に Visual Studio をインストールしている場合は **Modify** を選択します。  
1. Visual Studio インストーラーにすべてのワークロードが表示されます。  
    ![The Visual Studio installation UI with the list of components available for ASP.NET and web development and the Microsoft 365 Agents Toolkit highlighted.](../../../assets/images/agents-sdk/visual-studio-install.png)  
1. インストール画面で次の手順を実行します:  
    1. **Workloads > ASP.NET and web development** を選択します。  
    1. 右側のペインで **Installation details > Optional** に移動し、**Microsoft 365 Agents toolkit** を選択します。  
    1. **Install** を選択します。Visual Studio のインストールが開始され、ポップアップが表示されます。  
1. **Launch** を選択します。

<cc-end-step lab="bma0" exercise="2" step="1" />

## Exercise 3: Azure サブスクリプションの取得

Path B の演習を完了するには、Azure 上にリソースを作成するための Azure サブスクリプションが必要です。まだサブスクリプションをお持ちでない場合は、[Azure 無料アカウント](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} を有効化できます。30 日間で使用できる 200 ドル分のクレジットが付与され、多くの Azure サービスで利用できます。

### Step 1: Azure 無料アカウントを作成する

Azure 無料アカウントを有効化する手順:

1️⃣ [Azure 無料アカウント](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} ページにアクセスし、**Activate** を選択します。

2️⃣ 任意のアカウントでログインします。演習で使用する Microsoft 365 テナント アカウントを使用することを推奨します。

3️⃣ プライバシー ステートメントのチェックボックスをオンにし、**Next** を選択します。

4️⃣ 本人確認のため、携帯電話番号を入力します。

5️⃣ 支払い情報を入力して一時的な認証を行います。従量課金制へ移行しない限り請求されません。その後、**Sign up** を選択します。

!!! tip "Tip: 30 日後の Azure リソース管理"
    Azure 無料アカウントは 30 日間のみ有効です。30 日終了時点で無料サブスクリプションに実行中のサービスが残っていないことを確認してください。30 日以降も Azure サービスを継続利用する場合は、支出制限を解除して従量課金制サブスクリプションへアップグレードする必要があります。これにより、Azure 無料アカウントと一部の無料サービスを引き続き利用できます。

<cc-end-step lab="bma0" exercise="3" step="1" />

---8<--- "ja/b-congratulations.md"

ラボ BMA0 - セットアップが完了しました。  
次はラボ BMA1 - Azure AI Foundry でエージェントを準備する に進みます。**Next** を選択してください。

<cc-next url="../01-agent-in-foundry" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/00-prerequisites--ja" />