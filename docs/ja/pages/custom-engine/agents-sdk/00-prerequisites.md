---
search:
  exclude: true
---
# ラボ BMA0 - 前提条件

このラボでは、今後のコースを通じて開発するカスタム エンジン エージェントをビルド、テスト、デプロイするための開発環境をセットアップします。

このラボで学習する内容:

- Microsoft 365 環境のセットアップ
- Visual Studio 2022 と Microsoft 365 Agents Toolkit のインストールと構成
- 必要なリソースを作成するための Azure 環境の準備

!!! pied-piper "Disclaimer"
    これらのサンプルとラボは、学習およびデモンストレーション目的で提供されています。プロダクション環境での使用を想定していません。プロダクションで使用する場合は、必ず品質を向上させてからご利用ください。

!!! note "Note"
    カスタム エンジン エージェントをインストールして実行するには、管理者権限を持つ Microsoft 365 テナントが必要です。カスタム エンジン エージェントのテストには Microsoft 365 Copilot ライセンスは不要です。

## 演習 1 : Microsoft Teams の設定

### 手順 1: Teams のカスタム アプリのアップロードを有効化

既定では、エンド ユーザーはアプリを直接アップロードできません。Teams 管理者がエンタープライズ アプリ カタログにアップロードする必要があります。この手順では、M365 Agents Toolkit による直接アップロードが行えるようにテナントを設定します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスします。ここは Microsoft 365 管理センターです。  

2️⃣ 管理センターの左ペインで **Show all** を選択してナビゲーションを展開します。パネルが開いたら **Teams** を選択して Microsoft Teams 管理センターを開きます。  

3️⃣ Microsoft Teams 管理センターの左側で **Teams apps** のアコーディオンを開き、**Setup Policies** を選択します。App setup ポリシーの一覧が表示されるので、**Global (Org-wide default)** ポリシーを選択します。  

4️⃣ 最初のスイッチ **Upload custom apps** が **On** になっていることを確認します。  

5️⃣ ページを下までスクロールし、**Save** を選択して変更を保存します。  

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く完了します。

<cc-end-step lab="bma0" exercise="1" step="1" />

## 演習 2: M365 Agents Toolkit のセットアップ

これらのラボは Windows マシンで実施できます。前提条件をインストールできる権限が必要です。インストールが許可されていない場合は、別のマシン（または仮想マシン）を使用してください。

### 手順 1: Visual Studio 用 Agents Toolkit をインストール

1. [Visual Studio 2022](https://code.visualstudio.com/download){target=_blank} をダウンロードします。  
1. **Install** を選択します。すでに Visual Studio がインストールされている場合は **Modify** を選択します。  
1. Visual Studio インストーラーにすべてのワークロードが表示されます。  
   ![The Visual Studio installation UI with the list of components available for ASP.NET and web development and the Microsoft 365 Agents Toolkit highlighted.](../../../assets/images/agents-sdk/visual-studio-install.png)  
1. インストール画面で次の操作を行います:  
   1. **Workloads > ASP.NET and web development** を選択します。  
   1. 右ペインの **Installation details > Optional** で **Microsoft 365 Agents toolkit** を選択します。  
   1. **Install** を選択します。Visual Studio のインストールが開始され、ポップアップが表示されます。  
1. **Launch** を選択します。  

<cc-end-step lab="bma0" exercise="2" step="1" />

## 演習 3: Azure サブスクリプションの取得

Path B の演習を完了するには、Azure 上にリソースを作成するための Azure サブスクリプションが必要です。まだお持ちでない場合は、[Azure 無料アカウント](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} を有効化できます。最初の 30 日間で使用できる 200 ドル分のクレジットが付与され、多くの Azure サービスで利用できます。

### 手順 1: Azure 無料アカウントの作成

Azure 無料アカウントを有効化する手順:

1️⃣ [Azure free account](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} ページにアクセスし、**Activate** を選択します。  

2️⃣ 好みのアカウントでサインインします。演習で使用する Microsoft 365 テナント アカウントを使用することを推奨します。  

3️⃣ プライバシー ステートメントのチェック ボックスをオンにし、**Next** を選択します。  

4️⃣ 本人確認のための携帯電話番号を入力します。  

5️⃣ 一時的な認証のための支払い情報を入力します。課金は発生しません。**Sign up** を選択します。  

!!! tip "Tip: Managing Azure resources after 30 days"
    Azure 無料アカウントは 30 日間のみ有効です。30 日後に無料サブスクリプションでサービスを実行していないことを確認してください。30 日以降も Azure サービスを利用する場合は、支出上限を解除して従量課金制サブスクリプションへアップグレードする必要があります。これにより、Azure 無料アカウントと一部の無料サービスを引き続き利用できます。

<cc-end-step lab="bma0" exercise="3" step="1" />

---8<--- "ja/b-congratulations.md"

ラボ BMA0 - セットアップが完了しました!  
次はラボ BMA1 - Microsoft Foundry でエージェントを準備 に進みます。**Next** を選択してください。

<cc-next url="../01-agent-in-foundry" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/00-prerequisites--ja" />