---
search:
  exclude: true
---
# 宣言型エージェント認証へのショートカット

すでに宣言型エージェントと API プラグインの作成方法をご存じで、API を安全に保護する方法を学びたいですか？それなら、ここが最適な場所です！通常のラボ  E1-E5  をスキップして、お好みの  DA 認証ラボに直接進みましょう。

まずは開発環境を整えるために [ラボ E0](../extend-m365-copilot/00-prerequisites.md) を完了してください。  
その後、次のいずれかの認証ラボを選択します。

<hr />
### ラボ E6a - Agents Toolkit で OAuth 認証を追加

このラボでは、受講者が次を行います。

  - Agents Toolkit ディレクティブを追加して Entra ID アプリケーションを登録
  - アプリパッケージを更新し、Copilot が API 呼び出し時に OAuth を使用するように設定
  - コードを更新してアクセス トークンを検証
  - 宣言型エージェントをテスト

テスト手順:
    
  1. [ラボ E5 のソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) を PC のフォルダーにコピー
  - VS Code で開き、ソリューションがフォルダーのルートにある状態にする（ルートに **.vscode**、**appPackage** などが見える）
  - **/env/.env.local.sample** を **/env/.env.local** にコピーし、SHAREPOINT_DOCS_URL をテナント内の有効な SharePoint サイト URL に変更（すべての機能を動かす場合は **sampleDocs** フォルダーの内容をこの SharePoint 場所にアップロード）
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピー
  - （任意）**/appPackage/trey-declarative-agent.json** を編集し、テスト中のインスタンスがわかるようにエージェント名を変更
  - F5 キーを押下。Trey Research 用の宣言型エージェントが作成されるはず
  - 緑のボタンをクリックして手順を開く  
  <cc-next url="../06a-add-authentication-ttk" label="ラボ E6a - Agents Toolkit で OAuth"/>

<hr />
### ラボ E6b - 手動セットアップで OAuth 認証を追加

このラボでは、受講者が次を行います。

  - Entra ID にアプリを登録し、Copilot で動作するよう構成
  - Teams Developer Portal の「ボールト」にアプリを登録し、Copilot がクライアント シークレットなどの安全な Entra ID 情報にアクセスできるようにする
  - アプリパッケージを更新し、Copilot が API 呼び出し時に OAuth を使用するように設定
  - コードを更新してアクセス トークンを検証
  - 宣言型エージェントをテスト

テスト手順:
    
  1. [ラボ E5 のソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) を PC のフォルダーにコピー
  - VS Code で開き、ソリューションがフォルダーのルートにある状態にする（ルートに **.vscode**、**appPackage** などが見える）
  - **/env/.env.local.sample** を **/env/.env.local** にコピーし、SHAREPOINT_DOCS_URL をテナント内の有効な SharePoint サイト URL に変更（すべての機能を動かす場合は **sampleDocs** フォルダーの内容をこの SharePoint 場所にアップロード）
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピー
  - （任意）**/appPackage/trey-declarative-agent.json** を編集し、テスト中のインスタンスがわかるようにエージェント名を変更
  - F5 キーを押下。Trey Research 用の宣言型エージェントが作成されるはず
  - 緑のボタンをクリックして手順を開く  
  <cc-next url="../06b-add-authentication" label="ラボ E6b - 手動セットアップで OAuth"/>

<hr />
## ラボ E6c - Teams Developer Portal で手動設定する Single Sign-on 認証を追加

このラボでは、受講者が次を行います。

  - Entra ID にアプリを登録し、Copilot での Single Sign-on が動作するよう構成
  - Teams Developer Portal の「ボールト」にアプリを登録
  - SSO 用にアプリパッケージを更新
  - コードを更新してアクセス トークンを検証
  - 宣言型エージェントをテスト

テスト手順:

  1. [ラボ E5 のソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) を PC のフォルダーにコピー
  - VS Code で開き、ソリューションがフォルダーのルートにある状態にする（ルートに **.vscode**、**appPackage** などが見える）
  - **/env/.env.local** を **/env/.env.local** にコピーし、SHAREPOINT_DOCS_URL をテナント内の有効な SharePoint サイト URL に変更（すべての機能を動かす場合は **sampleDocs** フォルダーの内容をこの SharePoint 場所にアップロード）
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピー
  - （任意）**/appPackage/trey-declarative-agent.json** を編集し、テスト中のインスタンスがわかるようにエージェント名を変更
  - F5 キーを押下。Trey Research 用の宣言型エージェントが作成されるはず
  - 緑のボタンをクリックして手順を開く  
    <cc-next url="../06c-add-sso" label="ラボ E6c - Single Sign-on"/>

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/auth--ja" />