---
search:
  exclude: true
---
# ラボ BMA0 - 前提条件

このラボでは、パスを通して開発するカスタム エンジン エージェントをビルド、テスト、デプロイするための開発環境を構築します。

このラボで学習する内容:

- Microsoft 365 環境のセットアップ
- Visual Studio 2022 と Microsoft 365 Agents Toolkit のインストールと構成
- 必要なリソースを作成するための Azure 環境の準備

!!! pied-piper "注意事項"
    これらのサンプルとラボは教育およびデモ目的であり、本番環境での利用を想定していません。本番環境に導入する場合は、運用レベルにアップグレードしてください。

!!! note "注"
    独自のカスタム エンジン エージェントをインストールして実行するには、管理者権限を持つ Microsoft 365 テナントが必要です。カスタム エンジン エージェントをテストするために Microsoft 365 Copilot License は必要ありません。

## 演習 1: Microsoft Teams のセットアップ

### Step 1: Teams でのカスタム アプリのアップロードの有効化

既定では、エンド ユーザーはアプリを直接アップロードできず、Teams 管理者がエンタープライズ アプリ カタログにアップロードする必要があります。このステップでは、M365 Agents Toolkit による直接アップロードをテナントで許可するよう設定します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} に移動します (Microsoft 365 Admin Center)。

2️⃣ 管理センターの左側パネルで **Show all** を選択してナビゲーションを展開します。パネルが開いたら **Teams** を選択して Microsoft Teams 管理センターを開きます。

3️⃣ Microsoft Teams 管理センターの左側で **Teams apps** を展開し、**Setup Policies** を選択します。App setup policy の一覧が表示されるので **Global (Org-wide default) policy** を選択します。

4️⃣ 最初のスイッチ **Upload custom apps** が **On** になっていることを確認します。

5️⃣ 画面をスクロールして **Save** ボタンを選択し、変更を保存します。

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="bma0" exercise="1" step="1" />

## 演習 2: M365 Agents Toolkit のセットアップ

これらのラボは Windows マシンで実施できます。前提条件をインストールできる権限が必要です。アプリケーションをインストールできない場合は、別のマシン (または仮想マシン) をご用意ください。

### Step 1: Visual Studio 用 Agents Toolkit のインストール

1. こちらから Visual Studio 2022 をダウンロードします: [Visual Studio 2022](https://code.visualstudio.com/download){target=_blank}  
1. **Install** を選択します。すでに Visual Studio をインストール済みの場合は **Modify** を選択します。  
1. Visual Studio インストーラーにワークロードが表示されます。  
    ![The Visual Studio installation UI with the list of components available for ASP.NET and web development and the Microsoft 365 Agents Toolkit highlighted.](../../../assets/images/agents-sdk/visual-studio-install.png)  
1. インストール画面で次の操作を行います:  
    1. **Workloads > ASP.NET and web development** を選択します。  
    1. 右側の **Installation details > Optional** で **Microsoft 365 Agents toolkit** を選択します。  
    1. **Install** を選択します。Visual Studio のインストールが始まり、ポップアップが表示されます。  
1. **Launch** を選択します。

<cc-end-step lab="bma0" exercise="2" step="1" />

## 演習 3: Azure サブスクリプションの取得

Path B の演習を完了するには、Azure でリソースを作成するための Azure サブスクリプションが必要です。まだサブスクリプションをお持ちでない場合は、[Azure 無料アカウント](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} を有効化できます。最初の 30 日間に使用できる \$200 分のクレジットが付与され、多くの Azure サービスで利用できます。

### Step 1: Azure 無料アカウントの作成

Azure 無料アカウントを有効化する手順:

1️⃣ [Azure free account](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} ページにアクセスし、**Activate** を選択します。

2️⃣ 任意のアカウントでサインインします。演習で使用したい Microsoft 365 テナント アカウントを使用することを推奨します。

3️⃣ Privacy Statement のチェックボックスをオンにして **Next** を選択します。

4️⃣ 本人確認のための携帯電話番号を入力します。

5️⃣ 一時的な承認用に支払い情報を入力します。従量課金制に移行しない限り請求は発生しません。その後、**Sign up** を選択します。

!!! tip "Tip: 30 日後の Azure リソース管理"
    Azure 無料アカウントは 30 日間のみ有効です。30 日経過時点で無料サブスクリプションにサービスが稼働していないことを確認してください。30 日以降も Azure サービスを継続利用したい場合は、支出制限を解除して従量課金サブスクリプションにアップグレードする必要があります。これにより、Azure 無料アカウントと一部の無料サービスを引き続き利用できます。

<cc-end-step lab="bma0" exercise="3" step="1" />

---8<--- "ja/b-congratulations.md"

ラボ BMA0 - セットアップが完了しました！  
次はラボ BMA1 - Azure AI Foundry でエージェントを準備 に進みます。**Next** を選択してください。

<cc-next url="../01-agent-in-foundry" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/00-prerequisites" />