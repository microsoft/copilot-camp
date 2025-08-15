---
search:
  exclude: true
---
# 宣言型エージェント認証のショートカット

すでに宣言型エージェントと API プラグインの作成方法をご存じで、API を安全に保護する方法を学びたい場合は、こちらが最適です。通常のラボ **E1–E5** をスキップして、お好きな DA 認証ラボから始められます。

まずは開発環境を整えるために [Lab E0](../extend-m365-copilot/00-prerequisites.md) を完了してください。  
その後、以下から認証ラボを選択します。

<hr />
### Lab E6a - Agents Toolkit で OAuth 認証を追加

このラボでは、受講者が次を行います。

  - Agents Toolkit のディレクティブを追加し、Entra ID アプリケーションを登録
  - アプリ パッケージを更新し、Copilot が API 呼び出し時に OAuth を使用できるように設定
  - コードを更新してアクセストークンを検証
  - 宣言型エージェントをテスト

テスト手順:
    
  1. [Lab E5 のソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) をローカル フォルダーにコピー  
  - VS Code で開き、ソリューションがルートにあることを確認します（ルート レベルに **.vscode**、**appPackage** などが見える状態）  
  - **/env/.env.local.sample** を **/env/.env.local** にコピーし、`SHAREPOINT_DOCS_URL` をテナント内の有効な SharePoint サイト URL に変更します（すべての機能を試す場合は **sampleDocs** フォルダーの内容をこの SharePoint にアップロードしてください）  
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピー  
  - （任意）**/appPackage/trey-declarative-agent.json** を編集し、エージェント名を変更してテストするインスタンスを識別  
  - F5 キーを押下すると、Trey Research 用の宣言型エージェントが起動します  
  - 緑色のボタンをクリックして手順を開きます  
  <cc-next url="../06a-add-authentication-ttk" label="Lab E6a - OAuth と Agents Toolkit"/>

<hr />
### Lab E6b - 手動セットアップで OAuth 認証を追加

このラボでは、受講者が次を行います。

  - Entra ID にアプリを登録し、Copilot で動作するよう構成
  - Teams Developer Portal の「Vault」にアプリを登録し、Copilot がクライアント シークレットなどの安全な Entra ID 情報へアクセスできるように設定
  - アプリ パッケージを更新し、Copilot が API 呼び出し時に OAuth を使用できるように設定
  - コードを更新してアクセストークンを検証
  - 宣言型エージェントをテスト

テスト手順:
    
  1. [Lab E5 のソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) をローカル フォルダーにコピー  
  - VS Code で開き、ソリューションがルートにあることを確認します（ルート レベルに **.vscode**、**appPackage** などが見える状態）  
  - **/env/.env.local.sample** を **/env/.env.local** にコピーし、`SHAREPOINT_DOCS_URL` をテナント内の有効な SharePoint サイト URL に変更します（すべての機能を試す場合は **sampleDocs** フォルダーの内容をこの SharePoint にアップロードしてください）  
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピー  
  - （任意）**/appPackage/trey-declarative-agent.json** を編集し、エージェント名を変更してテストするインスタンスを識別  
  - F5 キーを押下すると、Trey Research 用の宣言型エージェントが起動します  
  - 緑色のボタンをクリックして手順を開きます  
  <cc-next url="../06b-add-authentication" label="Lab E6b - 手動セットアップで OAuth"/>

<hr />
## Lab E6c - Teams Developer Portal で手動設定する シングル サインオン認証

このラボでは、受講者が次を行います。

  - Entra ID にアプリを登録し、Copilot でのシングル サインオンに対応
  - Teams Developer Portal の「Vault」にアプリを登録
  - アプリ パッケージを SSO 用に更新
  - コードを更新してアクセストークンを検証
  - 宣言型エージェントをテスト

テスト手順:

  1. [Lab E5 のソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) をローカル フォルダーにコピー  
  - VS Code で開き、ソリューションがルートにあることを確認します（ルート レベルに **.vscode**、**appPackage** などが見える状態）  
  - **/env/.env.local** を **/env/.env.local** にコピーし、`SHAREPOINT_DOCS_URL` をテナント内の有効な SharePoint サイト URL に変更します（すべての機能を試す場合は **sampleDocs** フォルダーの内容をこの SharePoint にアップロードしてください）  
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピー  
  - （任意）**/appPackage/trey-declarative-agent.json** を編集し、エージェント名を変更してテストするインスタンスを識別  
  - F5 キーを押下すると、Trey Research 用の宣言型エージェントが起動します  
  - 緑色のボタンをクリックして手順を開きます  
    <cc-next url="../06c-add-sso" label="Lab E6c - シングル サインオン"/>

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/auth--ja" />