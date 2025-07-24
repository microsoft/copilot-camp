---
search:
  exclude: true
---
# 宣言的エージェント認証 ショートカット

既に宣言的エージェントおよび API プラグインの作成方法をご存知で、API の保護方法を学びたいですか？ それなら、まさにここが目的の場所です！ 通常のラボ (E1-E5) はスキップして、お好きな DA Authentication ラボに直接進むことができます！

まず [Lab E0](../extend-m365-copilot/00-prerequisites.md) を完了し、開発環境を整えてください。  
その後、以下の選択肢から認証ラボを選んでください：

<hr />
### Lab E6a - Agents Toolkit を使用した OAuth 認証の追加

このラボでは、受講生は次の作業を行います：

  - Agents Toolkit ディレクティブを追加して Entra ID アプリケーションを登録します  
  - アプリのパッケージングを更新し、Copilot が API 呼び出し時に OAuth を使用するようにします  
  - アクセストークンを検証するためにコードを更新します  
  - 宣言的エージェントをテストします  

テスト手順:
    
  1. [Lab E5 solution files](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) をコンピューター上のフォルダーにコピーします  
  - VS Code でフォルダーを開き、ソリューションが開いたフォルダーのルートにあることを確認します（ルートレベルに **.vscode** 、 **appPackage** などが見えるはずです）  
  - **/env/.env.local.sample** を **/env/.env.local** にコピーし、SHAREPOINT_DOCS_URL をテナント内の有効な SharePoint サイト URL に変更します（すべての機能を動作させたい場合は、**sampleDocs** フォルダーの内容をこの SharePoint の場所にアップロードしてください）  
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピーします  
  - （オプション） **/appPackage/trey-declarative-agent.json** を編集し、テストするインスタンスが分かるようにエージェントの名前を変更します  
  - F5 を押します。 Trey Research 用の宣言的エージェントが表示されるはずです。  
  - 緑のボタンをクリックして instructions を開いてください  
  <cc-next url="../06a-add-authentication-ttk" label="Lab E6a - OAuth with Agents Toolkit"/>
 
<hr />
### Lab E6b - Manual Setup を使用した OAuth 認証の追加

このラボでは、受講生は次の作業を行います：

  - Entra ID にアプリを登録し、Copilot で動作するように設定します  
  - Teams Developer Portal の "vault" 内にアプリを登録し、Copilot がクライアントシークレットなどの安全な Entra ID 情報にアクセスできるようにします  
  - アプリのパッケージングを更新し、Copilot が API 呼び出し時に OAuth を使用するようにします  
  - アクセストークンを検証するためにコードを更新します  
  - 宣言的エージェントをテストします  

テスト手順:
    
  1. [Lab E5 solution files](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) をコンピューター上のフォルダーにコピーします  
  - VS Code でフォルダーを開き、ソリューションが開いたフォルダーのルートにあることを確認します（ルートレベルに **.vscode** 、 **appPackage** などが見えるはずです）  
  - **/env/.env.local.sample** を **/env/.env.local** にコピーし、SHAREPOINT_DOCS_URL をテナント内の有効な SharePoint サイト URL に変更します（すべての機能を動作させたい場合は、**sampleDocs** フォルダーの内容をこの SharePoint の場所にアップロードしてください）  
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピーします  
  - （オプション） **/appPackage/trey-declarative-agent.json** を編集し、テストするインスタンスが分かるようにエージェントの名前を変更します  
  - F5 を押します。 Trey Research 用の宣言的エージェントが表示されるはずです。  
  - 緑のボタンをクリックして instructions を開いてください  
  <cc-next url="../06b-add-authentication" label="Lab E6b - OAuth with Manual Setup"/>

<hr />
## Lab E6c - シングルサインオン認証の追加

このラボでは、受講生は次の作業を行います：

  - Entra ID にアプリを登録し、Copilot でのシングルサインオンが動作するように設定します  
  - Teams Developer Portal の "vault" 内にアプリを登録します  
  - SSO 用にアプリのパッケージングを更新します  
  - アクセストークンを検証するためにコードを更新します  
  - 宣言的エージェントをテストします  

テスト手順:

  1. [Lab E5 solution files](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) をコンピューター上のフォルダーにコピーします  
  - VS Code でフォルダーを開き、ソリューションが開いたフォルダーのルートにあることを確認します（ルートレベルに **.vscode** 、 **appPackage** などが見えるはずです）  
  - **/env/.env.local** を **/env/.env.local** にコピーし、SHAREPOINT_DOCS_URL をテナント内の有効な SharePoint サイト URL に変更します（すべての機能を動作させたい場合は、**sampleDocs** フォルダーの内容をこの SharePoint の場所にアップロードしてください）  
  - **/env/.env.local.user.sample** を **/env/.env.local.user** にコピーします  
  - （オプション） **/appPackage/trey-declarative-agent.json** を編集し、テストするインスタンスが分かるようにエージェントの名前を変更します  
  - F5 を押します。 Trey Research 用の宣言的エージェントが表示されるはずです。  
  - 緑のボタンをクリックして instructions を開いてください  
    <cc-next url="../06c-add-sso" label="Lab E6c - Single Sign-on"/>

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/auth" />