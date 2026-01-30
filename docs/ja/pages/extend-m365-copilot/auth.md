---
search:
  exclude: true
---
# 宣言型エージェント認証へのショートカット

すでに宣言型エージェントと API プラグインの作成方法をご存じで、API をセキュリティ保護する方法を学びたいですか？ それならここが最適です！ 通常のラボ (E1〜E5) はスキップして、お好みの DA 認証ラボに直接進みましょう。

まずは [Lab E0](../extend-m365-copilot/00-prerequisites.md) を完了し、開発環境を準備してください。  
その後、次のいずれかの認証ラボを選択します。

<hr />
### Lab E6a - Agents Toolkit を使用した OAuth 認証の追加

このラボでは、受講者が次の作業を行います。

  - Agents Toolkit のディレクティブを追加して Entra ID アプリケーションを登録する  
  - アプリ パッケージを更新し、Copilot が API 呼び出し時に OAuth を使用するようにする  
  - アクセス トークンを検証するようにコードを更新する  
  - 宣言型エージェントをテストする  

テスト手順:
    
  1. [Lab E5 ソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) を自分のコンピューター上の任意のフォルダーにコピーする  
  - VS Code でフォルダーを開き、ソリューションがルートにあることを確認する (ルートに **.vscode**、**appPackage** などが表示される)  
  - **/env/.env.local.sample** を **/env/.env.local** にコピーし、`SHAREPOINT_DOCS_URL` をテナント内の有効な SharePoint サイト URL に変更する (すべての機能を利用する場合は、**sampleDocs** フォルダーの内容をこの SharePoint 場所にアップロードする)  
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピーする  
  - (任意) **/appPackage/trey-declarative-agent.json** を編集し、テストしているインスタンスが分かるようにエージェント名を変更する  
  - F5 キーを押す。Trey Research 用の宣言型エージェントが起動するはずです。  
  - 緑色のボタンをクリックして手順を開く  
  <cc-next url="../06a-add-authentication-ttk" label="Lab E6a - Agents Toolkit を使用した OAuth"/>

<hr />
### Lab E6b - 手動セットアップによる OAuth 認証の追加

このラボでは、受講者が次の作業を行います。

  - Entra ID でアプリを登録し、Copilot で動作するように構成する  
  - Teams Developer Portal の「ボールト」にアプリを登録し、Copilot がクライアント シークレットなどの機密性の高い Entra ID 情報にアクセスできるようにする  
  - アプリ パッケージを更新し、Copilot が API 呼び出し時に OAuth を使用するようにする  
  - アクセス トークンを検証するようにコードを更新する  
  - 宣言型エージェントをテストする  

テスト手順:
    
  1. [Lab E5 ソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) を自分のコンピューター上の任意のフォルダーにコピーする  
  - VS Code でフォルダーを開き、ソリューションがルートにあることを確認する (ルートに **.vscode**、**appPackage** などが表示される)  
  - **/env/.env.local.sample** を **/env/.env.local** にコピーし、`SHAREPOINT_DOCS_URL` をテナント内の有効な SharePoint サイト URL に変更する (すべての機能を利用する場合は、**sampleDocs** フォルダーの内容をこの SharePoint 場所にアップロードする)  
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピーする  
  - (任意) **/appPackage/trey-declarative-agent.json** を編集し、テストしているインスタンスが分かるようにエージェント名を変更する  
  - F5 キーを押す。Trey Research 用の宣言型エージェントが起動するはずです。  
  - 緑色のボタンをクリックして手順を開く  
  <cc-next url="../06b-add-authentication" label="Lab E6b - 手動セットアップによる OAuth"/>

<hr />
## Lab E6c - Teams Developer Portal での手動手順によるシングル サインオン認証の追加

このラボでは、受講者が次の作業を行います。

  - Entra ID でアプリを登録し、Copilot のシングル サインオンで動作するように構成する  
  - Teams Developer Portal の「ボールト」にアプリを登録する  
  - SSO 用にアプリ パッケージを更新する  
  - アクセス トークンを検証するようにコードを更新する  
  - 宣言型エージェントをテストする  

テスト手順:

  1. [Lab E5 ソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) を自分のコンピューター上の任意のフォルダーにコピーする  
  - VS Code でフォルダーを開き、ソリューションがルートにあることを確認する (ルートに **.vscode**、**appPackage** などが表示される)  
  - **/env/.env.local.sample** を **/env/.env.local** にコピーし、`SHAREPOINT_DOCS_URL` をテナント内の有効な SharePoint サイト URL に変更する (すべての機能を利用する場合は、**sampleDocs** フォルダーの内容をこの SharePoint 場所にアップロードする)  
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピーする  
  - (任意) **/appPackage/trey-declarative-agent.json** を編集し、テストしているインスタンスが分かるようにエージェント名を変更する  
  - F5 キーを押す。Trey Research 用の宣言型エージェントが起動するはずです。  
  - 緑色のボタンをクリックして手順を開く  
    <cc-next url="../06c-add-sso" label="Lab E6c - シングル サインオン"/>

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/auth--ja" />