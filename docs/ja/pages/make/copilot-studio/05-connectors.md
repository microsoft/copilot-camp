---
search:
  exclude: true
---
# ラボ MCS5 - Power Platform カスタム コネクタ

このラボでは、Microsoft Copilot Studio で作成したエージェントを Power Platform のカスタム コネクタを使って拡張する方法を学びます。具体的には、架空の求人候補者リストを管理するカスタム REST API を利用します。この API では次の機能を提供します。

- 候補者一覧の取得  
- 特定候補者の取得  
- 新規候補者の追加  
- 候補者の削除  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/f_HrMbg6kOU" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要をご覧ください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

Microsoft 365 Copilot では、Copilot Studio 内でこれらの機能を活用し、前の [Lab MCS4](../04-extending-m365-copilot){target=_blank} で作成したカスタム エージェントの可能性をさらに高めることができます。

!!! note
    このラボは前回の [Lab MCS4](../04-extending-m365-copilot){target=_blank} を基にしています。同じエージェントを引き続き使用し、機能を拡張してください。

このラボでは次のことを学びます。

- REST API を Power Platform カスタム コネクタとして公開する方法  
- Power Platform で外部 REST API との通信を保護する方法  
- エージェントからカスタム コネクタを利用する方法  

## 演習 1 : REST API の作成

本ラボでは簡単のため、あらかじめ用意された REST API を使用します。この演習では API をダウンロードして構成し、ローカルで実行できるようにします。

### 手順 1: REST API のダウンロードとテスト

サンプル REST API は TypeScript と Node.js で作成された Azure Function で、名前は `HR Service` です。ソース コードは [こちら](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/path-m-lab-mcs5-connectors/hr-service&filename=hr-service){target=_blank} からダウンロードできます。

ZIP を展開し、Visual Studio Code で対象フォルダーを開きます。以下のスクリーンショットはプロジェクト構成の概要です。

![The outline of the HR Service project in Visual Studio Code. There are an http folder with a couple of .http files to test the API, a src folder with sample data and the actual azure function, two Open API specification files, some JSON configuration files.](../../../assets/images/make/copilot-studio-05/custom-connector-01.png)

プロジェクトの主な構成要素は次のとおりです。

- `http`: Visual Studio Code で REST API をテストするための .http ファイルが入っています。  
- `src/data/candidates.json`: サービスの初期データソースとして使用される架空の候補者リスト。  
- `src/functions/candidatesFunction.ts`: Azure Function の実装。  
- `src/openapi.json`: Azure Function の Open API 仕様ファイル (JSON)。  
- `src/openapi.yaml`: Azure Function の Open API 仕様ファイル (YAML)。  
- `askCandidateData.json`: 新規候補者のデータを収集するアダプティブ カードの JSON。  
- `dev-tunnel-steps.md`: ローカルで実行している REST API 用にリバース プロキシ (Dev Tunnel) を構築する簡易手順。  
- `local.settings.json.sample`: 後ほど使用するサンプル構成ファイル。  

`local.settings.json.sample` を `local.settings.json` にリネームし、F5 を押してプロジェクトを起動します。Visual Studio Code で `http/ht-service.http` を開き、`http://localhost:7071/api/candidates` への GET リクエスト横にある **Send request** コマンドを選択して候補者一覧を取得します。画面右側にレスポンス ヘッダーと候補者の JSON リストが表示されます。

![The HTTP request in action in Visual Studio Code. On the left side there is the .http file with the list of requests and the one to list the candidates is highlighted. On the right side there is the response for the get list of candidates request, with some HTTP headers and the JSON body of the response. In the lower part of the screen there is the **Terminal** with an highlighted message about OAuth disabled.](../../../assets/images/make/copilot-studio-05/custom-connector-02.png)

画面下部の **Terminal** ウィンドウには、実行した API 呼び出しのトレースと `OAuth is disabled. Skipping token validation` というメッセージが表示されます。現時点では API が匿名アクセス可能であることを示しています。

<cc-end-step lab="mcs5" exercise="1" step="1" />

### 手順 2: Entra ID での API 登録

次に API へのアクセスを保護します。まずブラウザーを開き、対象 Microsoft 365 テナントの職場アカウントで [https://entra.microsoft.com](https://entra.microsoft.com){target=_blank} にアクセスし、Microsoft Entra 管理センターにサインインします。左側メニューの 1️⃣ **App registrations** を選択し、つづいて 2️⃣ **+ New registration** を選択して新しいアプリケーションを登録します。

![The Microsoft Entra admin center user interface with highlighting of the **App registration** menu and of the **+ New registration** command.](../../../assets/images/make/copilot-studio-05/custom-connector-03.png)

`Register an application` ページでアプリケーション名を `HR-Service-API` などに設定し、対象テナントのみでの認証を選択して **Register** を選択します。

![The page to register a new application with the application name "HR-Service-API", the selection of single tenant authentication, and the button to register the application highlighted.](../../../assets/images/make/copilot-studio-05/custom-connector-04.png)

登録が完了すると **Overview** ページが表示されます。Client ID と Tenant ID を控えておきます。

左側メニューの 1️⃣ **Expose an API** を選択し、2️⃣ **+ Add a scope** で新しいスコープを追加します。最初にスコープを追加する際は **Application ID URI** を設定する必要があります。既定値は `api://<Client-Id>` です。**Save and continue** を選択して保存し、続いて右側パネルで 3️⃣ スコープ設定を行い、4️⃣ **Add scope** で確定します。

![The page to configure a new permission scope for the application. On the right side there is a panel to configure bunch of settings for the new permission scope.](../../../assets/images/make/copilot-studio-05/custom-connector-05.png)

例として以下の値を使用します。

- Scope name: `HR.Consume`  
- Who can consent?: `Admins and users`  
- Admin consent display name: `HR.Consume`  
- Admin consent description: `Allows consuming the HR Service`  
- User consent display name: `HR.Consume`  
- User consent description: `Allows consuming the HR Service`  
- State: `Enabled`  

設定が完了すると、スコープが一覧に表示されます。

![The permission scope configured for the current application. There is the scope name, who can consent, the admin consent display name, the user consent display name, and the state as enabled.](../../../assets/images/make/copilot-studio-05/custom-connector-06.png)

次に 1️⃣ **Manifest** を選択し、2️⃣ **Microsoft Graph App Manifest (new)** で manifest を編集して `requestedAccessTokenVersion` を `2` に更新します。これにより v2.0 の JWT トークンを期待することを指定します。

!!! note
    Microsoft Graph App Manifest と v2.0 トークンについては [Understand the app manifest (Microsoft Graph format)](https://learn.microsoft.com/en-us/entra/identity-platform/reference-microsoft-graph-app-manifest){target=_blank} を参照してください。

![The page to edit the manifest of the Entra application. There is the editor with highlighted the property `requestedAccessTokenVersion` and value of "2".](../../../assets/images/make/copilot-studio-05/custom-connector-07.png)

Visual Studio Code に戻り、`local.settings.json` を編集して先ほど登録したアプリケーションの値に合わせます。`<Client-ID>` と `<Tenant-ID>` を実際の値に置き換え、`UseOAuth` を `true` に設定します。

```JSON
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AAD_APP_CLIENT_ID": "<Client-ID>",
    "AAD_APP_TENANT_ID": "<Tenant-ID>",
    "AAD_APP_OAUTH_AUTHORITY": "https://login.microsoftonline.com/<Tenant-ID>",
    "UseOAuth": false
  }
}
```

REST API プロジェクトを再起動すると、API は保護され、Authorization ヘッダーに OAuth 2.0 トークンを要求するようになります。トークンがない場合や無効な場合は HTTP 401 (Unauthorized) が返されます。

<cc-end-step lab="mcs5" exercise="1" step="2" />

### 手順 3: Dev Tunnel の構成

ローカルで実行している REST API を公開 URL として提供する必要があります。簡単のため、Microsoft 提供の Dev Tunnel を使用します。

- [こちらの手順](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank} に従って Dev Tunnel をインストールします。  
- 次のコマンドでログインします。  

```console
devtunnel user login
```

- 次のコマンドでトンネルをホストします。  

```console
devtunnel create hr-service -a --host-header unchanged
devtunnel port create hr-service -p 7071
devtunnel host hr-service
```

実行後、接続情報が表示されます。

![The devtunnel running in a console window showing the hosting port, the connect via browser URL, and the URL to inspect network activity.](../../../assets/images/extend-m365-copilot-06/devtunnel-output.png)

「Connect via browser」の URL をコピーして保存してください。

ラボ中は devtunnel コマンドを実行したままにしておきます。再起動が必要な場合は `devtunnel host hr-service` を再実行してください。

<cc-end-step lab="mcs5" exercise="1" step="3" />

### 手順 4: Entra ID でのコンシューマー登録

Power Platform のカスタム コネクタから API を利用するには、コンシューマー アプリケーションも Microsoft Entra ID に登録する必要があります。[Microsoft Entra admin center](https://entra.microsoft.com){target=_blank} に戻り、再度 **App registrations** → **+ New registration** を選択します。今回はアプリケーション名を `HR-Service-Consumer` とし、同様にシングル テナントで登録します。

登録後、**Overview** ページで Client ID と Tenant ID を控えます。

![The page to create a new client secret for the consumer application in Microsoft Entra ID. There are fields to configure description and duration of the secret, and a command to add the secret.](../../../assets/images/make/copilot-studio-05/custom-connector-08.png)

1️⃣ **Certificates & Secrets** → 2️⃣ **+ New secret** を選択し、3️⃣ 名前と有効期限を設定して 4️⃣ **Add** をクリックします。生成されたシークレット値も安全な場所に保存してください。

次に 1️⃣ **API permissions** → 2️⃣ **+ Add a permission** を選択し、右側パネルで 3️⃣ **APIs my organization uses** を選択、`HR-Service-API` を検索して 4️⃣ 選択します。

![The page of Microsoft Entra admin center to grant a new permission to the consumer application. There is a panel on the right side with the list of APIs registered in the tenant and the "HR-Service-API" highlighted.](../../../assets/images/make/copilot-studio-05/custom-connector-09.png)

続いて `HR.Consume` の Delegated Permission を選択し **Add permission** をクリックします。追加後、**Grand admin consent for ...** を実行して権限を付与します。

![The panel of Microsoft Entra admin center to grant a permission to an application. The group of **Delegated permissions** is selected and the permission of type **HR.Consume** is selected. The **Add permission** command is highlighted.](../../../assets/images/make/copilot-studio-05/custom-connector-10.png)

最終的に下図のように `User.Read` と `HR.Consume` が Delegated として設定されていれば完了です。

![The permissions for the consumer applicaiton. There is the permission **User.Read** and there is the permission **HR.Consume**. Both permissions are of type Delegated.](../../../assets/images/make/copilot-studio-05/custom-connector-11.png)

このブラウザー タブは後の手順で再度使用しますので開いたままにしてください。

<cc-end-step lab="mcs5" exercise="1" step="4" />

## 演習 2 : カスタム コネクタの作成

この演習では HR Service API を利用する Power Platform カスタム コネクタを作成します。

### 手順 1: カスタム コネクタの作成

ブラウザーで [https://make.powerautomate.com](https://make.powerautomate.com){target=_blank} にアクセスし、職場アカウントでサインインします。左メニューで **More** → **Discover all** → **Custom connectors** を選択します。頻繁に使用する場合はピン留めも可能です。カスタム コネクタの一覧ページで **+ New custom connector** → **Import an OpenAPI file** を選択します。

![The menu to create a new Power Platform custom connector, highlighting the **Import an OpenAPI file** option.](../../../assets/images/make/copilot-studio-05/custom-connector-12.png)

コネクタ名を入力し、`HR-Service` の OpenAPI JSON ファイルを指定します。ファイルは [こちら](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/path-m-lab-mcs5-connectors/hr-service/src/openapi.json?raw=true){target=_blank} でも取得できます。設定後 **Continue** をクリックします。

![The dialog to create a new custom connector starting from an OpenAPI JSON file. There is the name of the connector and the path of the OpenAPI specification file. The **Continue** command is highlighted.](../../../assets/images/make/copilot-studio-05/custom-connector-13.png)

登録ウィザードが表示され、最初の **General** タブでアイコン、色、説明などを設定できます。ここでは **Host** に演習 1 - 手順 3 で取得した Dev Tunnel のホスト名を入力し、**Base URL** は `/` のままにします。

![The tab to configure **General** settings for the Power Platform custom connector. There are fields to configure icon, background color, description, protocol (HTTP or HTTPS), hostname, and base URL. There is a **Security** command at the bottom of the page.](../../../assets/images/make/copilot-studio-05/custom-connector-14.png)

ページ下部の **Security** をクリックし、認証タイプを `OAuth 2.0`、フレーバーを `Azure Active Directory` に設定します。

![The authentication type settings for the **Security** tab of the custom connector. The selected value is `OAuth 2.0`.](../../../assets/images/make/copilot-studio-05/custom-connector-15.png)

必要な設定を入力します。

- Client ID: 演習 1 - 手順 4 で登録したコンシューマー アプリの `<Client-Id>`  
- Client secret: 同じく `<Client-Secret>`  
- Authorization URL: 既定値  
- Tenant ID: `<Tenant-Id>`  
- Resource URL: 演習 1 - 手順 2 で設定した `<Application-ID-URI>` (`api://<Client-Id>`)  
- Enable on-behalf-of login: `False`  
- Scope: `HR.Consume`  
- Redirect URL: 読み取り専用 (後ほど使用)  

![The settings for `OAuth 2.0` when `Azure Active Directory` is selected. There are settings for Client ID, Client secret, Authorization URL, Tenant ID, Resource URL, Enabled on-behalf-of login, Scope, Redirect URL.](../../../assets/images/make/copilot-studio-05/custom-connector-16.png)

右上の **Create connector** で保存します。保存後 **Security** タブが再読み込みされ、**Redirect URL** に実際の値が表示されます。コピーして Entra ID のコンシューマー アプリに戻り、1️⃣ **Authentication** → 2️⃣ **+ Add a platform** → 3️⃣ **Web** を選択し、4️⃣ コピーした Redirect URL を貼り付け、5️⃣ **Configure** をクリックします。

![The page to configure **Web** authentication for the consumer application.](../../../assets/images/make/copilot-studio-05/custom-connector-17.png)

これで Power Platform からのリダイレクト URL が許可されました。

![The panel to configure the consumer application with **Redirect URL** for **Web** authentication.](../../../assets/images/make/copilot-studio-05/custom-connector-18.png)

カスタム コネクタ定義に戻り **Definition** タブへ移動すると、OpenAPI 仕様から取得した操作が確認できます。変更は不要です。**Test** タブに切り替えて動作確認を行うことも可能です。

<cc-end-step lab="mcs5" exercise="2" step="1" />

### 手順 2: カスタム コネクタのテスト

**Test** タブの左側に操作一覧が表示されます。例として **getCandidates** を選択し、**+ New connection** で接続を作成して認証します。接続後 **Test operation** を実行し、画面下部の出力を確認します。

![The test page of the Power Platform custom connector, where you can invoke the target API providing credentials through a connection. In the upper part of the screen there is the configured connection. In the middle of the screen there is the operation to test. In the bottom part of the screen there is the output of the test HTTP request.](../../../assets/images/make/copilot-studio-05/custom-connector-19.png)

<cc-end-step lab="mcs5" exercise="2" step="2" />

## 演習 3 : カスタム コネクタの利用

この演習では、演習 2 で作成したカスタム コネクタを利用します。

### 手順 1: エージェントからカスタム コネクタを利用

[Lab MCS4](../04-extending-m365-copilot){target=_blank} で作成した Microsoft 365 Copilot Chat 用エージェントからカスタム コネクタを呼び出します。

ブラウザーで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} を開き、1️⃣ Copilot Studio のエージェント一覧から 2️⃣ **Microsoft 365 Copilot** エージェントを選択します。

![The interface of Microsoft Copilot Studio when browsing the whole list of agents and selecting the **Microsoft 365 Copilot** agent.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-01.png)

`Agentic HR` エージェントを編集し、**Actions** セクションで **+ Add action** を選択します。Lab MCS4 - 演習 2 - 手順 1 と同様の手順で、今回は **Custom connector** グループから `HR-Services` を検索します。`HR-Services` コネクタに定義されているアクションが表示されます。

`Get all candidates` アクションを選択しカスタム コネクタへの接続を確定します。設定は次のとおりです。

- Name: `Get all candidates`  
- Description: `Lists all the HR candidates from an external system`  
- Authentication: `User authentication`  

**Add action** で追加したら、Lab MCS4 で作成した旧アクションを無効化します。無効化するにはアクション横の (…) をクリックし、**Status** を `Off` に切り替えます。

![The status menu item do enable/disable an action in an agent for Microsoft 365 Copilot Chat.](../../../assets/images/make/copilot-studio-05/custom-connector-20.png)

エージェントを公開し、更新が完了したら Microsoft 365 Copilot Chat で次のプロンプトを入力してテストします。

```text
Lists all the HR candidates from an external system
```

Microsoft 365 Copilot Chat から外部 REST API 利用の許可を求められます。テストを複数回行う場合は **Allow once**、常時許可する場合は **Always allow** を選択します。

![Microsoft 365 Copilot Chat prompting the user to consent consumption of the HR Service external REST API. There are commands to **Always allow**, **Allow once**, or **Cancel**.](../../../assets/images/make/copilot-studio-05/custom-connector-21.png)

続いて安全にアクセスするためのサインインを求められます。

![Microsoft 365 Copilot Chat prompting the user to sign-in to consume the external REST API. There is a command **Sign in to Agentic HR** to trigger authentication.](../../../assets/images/make/copilot-studio-05/custom-connector-22.png)

**Sign in to Agentic HR** をクリックして認証を完了し、再度同じプロンプトを実行すると候補者一覧が表示されます。レスポンス下部のアイコンは外部サービスからの応答であることを示しています。

![Microsoft 365 Copilot Chat providing the list of candidates retrieved from the external API.](../../../assets/images/make/copilot-studio-05/custom-connector-23.png)

最後に Visual Studio Code の **Terminal** に戻り、REST リクエストのトレースと `Token is valid for user <username>` のメッセージを確認できます。これは Microsoft 365 Copilot からのリクエストが認証されたことを示します。

![The **Terminal** window of Visual Studio Code with tracing information.](../../../assets/images/make/copilot-studio-05/custom-connector-24.png)

素晴らしいです！カスタム コネクタを構成し、Microsoft 365 Copilot Chat から呼び出すことができました。

<cc-end-step lab="mcs5" exercise="3" step="1" />

---8<--- "ja/mcs-congratulations.md"

Lab MCS5 - Power Platform カスタム コネクタを完了しました!

<!-- 
<a href="../06-mcp">Start here</a> with Lab MCS6, to learn how to consume an MCP server in Copilot Studio.
<cc-next /> 
-->

<!-- <cc-award path="Make" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/05-connectors" />