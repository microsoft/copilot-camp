---
search:
  exclude: true
---
# 宣言型エージェント認証へのショートカット

すでに宣言型エージェントと API プラグインの作成方法をご存じで、API を安全に保護する方法を学びたい方はこちらへどうぞ。通常の ラボ (E1-E5) をスキップし、お好みの DA 認証ラボから始められます。

まず、開発環境を準備するために [ラボ E0](../extend-m365-copilot/00-prerequisites.md) を完了してください。  
その後、以下の認証ラボから選択します。

<hr />
### ラボ E6a - Agents Toolkit を使用した OAuth 認証の追加

このラボでは、受講者は次を行います:

  - Agents Toolkit のディレクティブを追加して Entra ID アプリケーションを登録
  - アプリのパッケージを更新し、Copilot が API 呼び出し時に OAuth を使用するよう設定
  - アクセス トークンを検証するようコードを更新
  - 宣言型エージェントをテスト

テスト手順:
    
  1. [ラボ E5 のソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) を自分の PC 上のフォルダーにコピー
  - VS Code で開き、ソリューションが開いているフォルダーのルートに位置することを確認 (ルートに **.vscode**、**appPackage** などが見える状態)
  - **/env/.env.local.sample** を **/env/.env.local** にコピーし、`SHAREPOINT_DOCS_URL` をテナント内の有効な SharePoint サイト URL に変更 (すべての機能を利用する場合は **sampleDocs** フォルダーの内容をこの SharePoint 場所へアップロード)
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピー
  - (任意) **/appPackage/trey-declarative-agent.json** を編集し、どのインスタンスをテストしているか分かるようエージェント名を変更
  - F5 を押下。Trey Research 用の宣言型エージェントが生成されるはずです。
  - 緑のボタンをクリックして手順を開く
  <cc-next url="../06a-add-authentication-ttk" label="ラボ E6a - Agents Toolkit を使用した OAuth"/>

<hr />
### ラボ E6b - 手動設定による OAuth 認証の追加

このラボでは、受講者は次を行います:

  - Entra ID にアプリを登録し、Copilot で動作するよう構成
  - Teams Developer Portal の「Vault」にアプリを登録し、Copilot がクライアント シークレットなどの安全な Entra ID 情報へアクセスできるようにする
  - アプリのパッケージを更新し、Copilot が API 呼び出し時に OAuth を使用するよう設定
  - アクセス トークンを検証するようコードを更新
  - 宣言型エージェントをテスト

テスト手順:
    
  1. [ラボ E5 のソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) を自分の PC 上のフォルダーにコピー
  - VS Code で開き、ソリューションが開いているフォルダーのルートに位置することを確認 (ルートに **.vscode**、**appPackage** などが見える状態)
  - **/env/.env.local.sample** を **/env/.env.local** にコピーし、`SHAREPOINT_DOCS_URL` をテナント内の有効な SharePoint サイト URL に変更 (すべての機能を利用する場合は **sampleDocs** フォルダーの内容をこの SharePoint 場所へアップロード)
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピー
  - (任意) **/appPackage/trey-declarative-agent.json** を編集し、どのインスタンスをテストしているか分かるようエージェント名を変更
  - F5 を押下。Trey Research 用の宣言型エージェントが生成されるはずです。
  - 緑のボタンをクリックして手順を開く
  <cc-next url="../06b-add-authentication" label="ラボ E6b - 手動設定による OAuth"/>

<hr />
## ラボ E6c - シングル サインオン認証の追加

このラボでは、受講者は次を行います:

  - Entra ID にアプリを登録し、Copilot のシングル サインオンで動作するよう構成
  - Teams Developer Portal の「Vault」にアプリを登録
  - SSO 用にアプリのパッケージを更新
  - アクセス トークンを検証するようコードを更新
  - 宣言型エージェントをテスト

テスト手順:

  1. [ラボ E5 のソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) を自分の PC 上のフォルダーにコピー
  - VS Code で開き、ソリューションが開いているフォルダーのルートに位置することを確認 (ルートに **.vscode**、**appPackage** などが見える状態)
  - **/env/.env.local** を **/env/.env.local** にコピーし、`SHAREPOINT_DOCS_URL` をテナント内の有効な SharePoint サイト URL に変更 (すべての機能を利用する場合は **sampleDocs** フォルダーの内容をこの SharePoint 場所へアップロード)
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピー
  - (任意) **/appPackage/trey-declarative-agent.json** を編集し、どのインスタンスをテストしているか分かるようエージェント名を変更
  - F5 を押下。Trey Research 用の宣言型エージェントが生成されるはずです。
  - 緑のボタンをクリックして手順を開く 
    <cc-next url="../06c-add-sso" label="ラボ E6c - シングル サインオン"/>

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/auth--ja" />