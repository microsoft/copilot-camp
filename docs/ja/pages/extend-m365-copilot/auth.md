---
search:
  exclude: true
---
# 宣言型エージェント認証への近道

すでに宣言型エージェントと API プラグインの作成方法をご存じで、API を安全に保護する方法を学びたい方はこちらへどうぞ！通常のラボ (E1-E5) をスキップして、お好みの DA 認証ラボに進めます。

まずは [Lab E0](../extend-m365-copilot/00-prerequisites.md) を完了して開発環境を準備してください。  
その後、次のいずれかの認証ラボを選択します。

<hr />
### Lab E6a - Agents Toolkit を使用した OAuth 追加

このラボでは、受講者が次を行います。

  - Agents Toolkit のディレクティブを追加して Entra ID アプリケーションを登録
  - アプリ パッケージを更新し、Copilot が API 呼び出し時に OAuth を使用するよう構成
  - コードを更新してアクセス トークンを検証
  - 宣言型エージェントをテスト

テスト手順:
    
  1. [Lab E5 のソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) を自分の PC のフォルダーにコピー
  - VS Code で開き、ソリューションがルート フォルダーにある状態にする (ルート直下に **.vscode**、**appPackage** などが見えるはずです)
  - **/env/.env.local.sample** を **/env/.env.local** にコピーし、SHAREPOINT_DOCS_URL をテナント内の有効な SharePoint サイト URL に変更 (すべての機能を動作させたい場合は **sampleDocs** フォルダーの内容をこの SharePoint 場所にアップロード)
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピー
  - (任意) **/appPackage/trey-declarative-agent.json** を編集し、どのインスタンスをテストしているかわかるようにエージェント名を変更
  - F5 キーを押す。Trey Research 用の宣言型エージェントが得られるはずです。
  - 緑色のボタンをクリックして手順を開く
  <cc-next url="../06a-add-authentication-ttk" label="Lab E6a - Agents Toolkit を使用した OAuth"/>

<hr />
### Lab E6b - 手動セットアップによる OAuth 追加

このラボでは、受講者が次を行います。

  - Entra ID でアプリを登録し、Copilot で動作するよう構成
  - Teams Developer Portal の「vault」にアプリを登録し、Copilot がクライアント シークレットなどの安全な Entra ID 情報にアクセスできるようにする
  - アプリ パッケージを更新し、Copilot が API 呼び出し時に OAuth を使用するよう構成
  - コードを更新してアクセス トークンを検証
  - 宣言型エージェントをテスト

テスト手順:
    
  1. [Lab E5 のソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) を自分の PC のフォルダーにコピー
  - VS Code で開き、ソリューションがルート フォルダーにある状態にする (ルート直下に **.vscode**、**appPackage** などが見えるはずです)
  - **/env/.env.local.sample** を **/env/.env.local** にコピーし、SHAREPOINT_DOCS_URL をテナント内の有効な SharePoint サイト URL に変更 (すべての機能を動作させたい場合は **sampleDocs** フォルダーの内容をこの SharePoint 場所にアップロード)
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピー
  - (任意) **/appPackage/trey-declarative-agent.json** を編集し、どのインスタンスをテストしているかわかるようにエージェント名を変更
  - F5 キーを押す。Trey Research 用の宣言型エージェントが得られるはずです。
  - 緑色のボタンをクリックして手順を開く
  <cc-next url="../06b-add-authentication" label="Lab E6b - 手動セットアップによる OAuth"/>

<hr />
## Lab E6c - シングル サインオン (SSO) 認証の追加

このラボでは、受講者が次を行います。

  - Entra ID でアプリを登録し、Copilot のシングル サインオンで動作するよう構成
  - Teams Developer Portal の「vault」にアプリを登録
  - SSO 用にアプリ パッケージを更新
  - コードを更新してアクセス トークンを検証
  - 宣言型エージェントをテスト

テスト手順:

  1. [Lab E5 のソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) を自分の PC のフォルダーにコピー
  - VS Code で開き、ソリューションがルート フォルダーにある状態にする (ルート直下に **.vscode**、**appPackage** などが見えるはずです)
  - **/env/.env.local** を **/env/.env.local** にコピーし、SHAREPOINT_DOCS_URL をテナント内の有効な SharePoint サイト URL に変更 (すべての機能を動作させたい場合は **sampleDocs** フォルダーの内容をこの SharePoint 場所にアップロード)
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピー
  - (任意) **/appPackage/trey-declarative-agent.json** を編集し、どのインスタンスをテストしているかわかるようにエージェント名を変更
  - F5 キーを押す。Trey Research 用の宣言型エージェントが得られるはずです。
  - 緑色のボタンをクリックして手順を開く 
    <cc-next url="../06c-add-sso" label="Lab E6c - シングル サインオン"/>

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/auth" />