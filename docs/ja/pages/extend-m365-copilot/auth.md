---
search:
  exclude: true
---
# 宣言型 エージェント認証 へのショートカット

すでに宣言型エージェントと API プラグインの作成方法をご存じで、API を保護する方法を学びたい方へ。ここはまさにそのためのページです。通常のラボ (E1–E5) をスキップして、DA 認証ラボから始められます。

まずは開発環境を準備するために [ラボ E0](../extend-m365-copilot/00-prerequisites.md) を完了してください。  
次に、以下から認証ラボを選択します。

<hr />
### ラボ E6a - Agents Toolkit を使用した OAuth 認証の追加

このラボでは、受講者は次を行います。

  -  Agents Toolkit のディレクティブを追加して Entra ID アプリケーションを登録します  
  -  アプリのパッケージを更新し、Copilot が API を呼び出す際に OAuth を使用するようにします  
  -  コードを更新してアクセストークンを検証します  
  -  宣言型エージェントをテストします  

テスト手順:
    
  1.  [ラボ E5 のソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) をコンピューター上のフォルダーにコピーします  
  -  VS Code でフォルダーを開き、ソリューションがルートに来るようにします (ルートに **.vscode**, **appPackage** などが見えるはずです)  
  -  **/env/.env.local.sample** を **/env/.env.local** にコピーし、`SHAREPOINT_DOCS_URL` をテナント内の有効な SharePoint サイト URL に変更します (すべての機能を有効にする場合は **sampleDocs** フォルダーの内容をこの SharePoint 位置にアップロードしてください)  
  -  **/env/.env.local.user.sample** を **/env/.env.local.user** にコピーします  
  -  (任意) **/appPackage/trey-declarative-agent.json** を編集し、どのインスタンスをテストしているか分かるようにエージェント名を変更します  
  -  F5 キーを押します。Trey Research 用の宣言型エージェントが生成されるはずです。  
  -  緑のボタンをクリックして手順を開きます  
  <cc-next url="../06a-add-authentication-ttk" label="ラボ E6a - Agents Toolkit を使用した OAuth"/>

<hr />
### ラボ E6b - 手動セットアップによる OAuth 認証の追加

このラボでは、受講者は次を行います。

  -  Entra ID にアプリを登録し、Copilot で動作するよう設定します  
  -  Teams Developer Portal の “vault” にアプリを登録し、Copilot がクライアント シークレットなどの安全な Entra ID 情報にアクセスできるようにします  
  -  アプリのパッケージを更新し、Copilot が API を呼び出す際に OAuth を使用するようにします  
  -  コードを更新してアクセストークンを検証します  
  -  宣言型エージェントをテストします  

テスト手順:
    
  1.  [ラボ E5 のソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) をコンピューター上のフォルダーにコピーします  
  -  VS Code でフォルダーを開き、ソリューションがルートに来るようにします (ルートに **.vscode**, **appPackage** などが見えるはずです)  
  -  **/env/.env.local.sample** を **/env/.env.local** にコピーし、`SHAREPOINT_DOCS_URL` をテナント内の有効な SharePoint サイト URL に変更します (すべての機能を有効にする場合は **sampleDocs** フォルダーの内容をこの SharePoint 位置にアップロードしてください)  
  -  **/env/.env.local.user.sample** を **/env/.env.local.user** にコピーします  
  -  (任意) **/appPackage/trey-declarative-agent.json** を編集し、どのインスタンスをテストしているか分かるようにエージェント名を変更します  
  -  F5 キーを押します。Trey Research 用の宣言型エージェントが生成されるはずです。  
  -  緑のボタンをクリックして手順を開きます  
  <cc-next url="../06b-add-authentication" label="ラボ E6b - 手動セットアップによる OAuth"/>

<hr />
## ラボ E6c - シングル サインオン 認証の追加

このラボでは、受講者は次を行います。

  -  Entra ID にアプリを登録し、Copilot でのシングル サインオンに対応させます  
  -  Teams Developer Portal の “vault” にアプリを登録します  
  -  アプリのパッケージを SSO 用に更新します  
  -  コードを更新してアクセストークンを検証します  
  -  宣言型エージェントをテストします  

テスト手順:

  1.  [ラボ E5 のソリューション ファイル](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) をコンピューター上のフォルダーにコピーします  
  -  VS Code でフォルダーを開き、ソリューションがルートに来るようにします (ルートに **.vscode**, **appPackage** などが見えるはずです)  
  -  **/env/.env.local** を **/env/.env.local** にコピーし、`SHAREPOINT_DOCS_URL` をテナント内の有効な SharePoint サイト URL に変更します (すべての機能を有効にする場合は **sampleDocs** フォルダーの内容をこの SharePoint 位置にアップロードしてください)  
  -  **/env/.env.local.user.sample** を **/env/.env.local.user** にコピーします  
  -  (任意) **/appPackage/trey-declarative-agent.json** を編集し、どのインスタンスをテストしているか分かるようにエージェント名を変更します  
  -  F5 キーを押します。Trey Research 用の宣言型エージェントが生成されるはずです。  
  -  緑のボタンをクリックして手順を開きます  
    <cc-next url="../06c-add-sso" label="ラボ E6c - シングル サインオン"/>

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/auth" />