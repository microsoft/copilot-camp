---
search:
  exclude: true
---
# Lab MCS5 - Power Platform カスタム コネクタ

このラボでは、Microsoft Copilot Studio で作成したエージェントを Power Platform のカスタム コネクタで拡張する方法を学習します。具体的には、REST API を使用して仮想的な求人候補者リストを管理します。API では、次の機能を提供しています。

- 候補者の一覧取得
- 特定の候補者の取得
- 新しい候補者の追加
- 候補者の削除

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/f_HrMbg6kOU" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>


Microsoft 365 Copilot の Copilot Studio では、これらの機能を利用して、前の [Lab MCS4](../04-extending-m365-copilot){target=_blank} で作成したカスタム エージェントの可能性を高めることができます。

!!! note
    このラボは前の [Lab MCS4](../04-extending-m365-copilot){target=_blank} を基盤としています。同じエージェントを使用し、その機能を拡張できます。

このラボで学習する内容:

- REST API を Power Platform のカスタム コネクタとして公開する方法
- Power Platform で外部 REST API との通信を保護する方法
- カスタム コネクタをエージェントから利用する方法

## Exercise 1 : REST API の作成

このラボでは簡単にするため、あらかじめ用意された REST API を使用します。このエクササイズでは、ローカルで実行できるように API をダウンロードして構成します。

### Step 1: REST API のダウンロードとテスト

サンプル REST API は TypeScript と Node.js で構築された Azure Function で、`HR Service` という名前です。ソース コードは [こちら](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/path-m-lab-mcs5-connectors/hr-service&filename=hr-service){target=_blank} からダウンロードできます。

ZIP を展開し、対象フォルダーを Visual Studio Code で開きます。以下のスクリーンショットはプロジェクト構成の概要です。

![The outline of the HR Service project in Visual Studio Code. There are an http folder with a couple of .http files to test the API, a src folder with sample data and the actual azure function, two Open API specification files, some JSON configuration files.](../../../assets/images/make/copilot-studio-05/custom-connector-01.png)

プロジェクトの主な要素は次のとおりです。

- `http`: Visual Studio Code で API をテストするための .http ファイルが含まれています。
- `src/data/candidates.json`: サービスの初期データ ソースとして使用される仮想的な候補者リストの JSON ファイル。
- `src/functions/candidatesFunction.ts`: Azure Function の実装。
- `src/openapi.json`: Azure Function の Open API 仕様 (JSON)。
- `src/openapi.yaml`: Azure Function の Open API 仕様 (YAML)。
- `askCandidateData.json`: 新規候補者を登録するためのアダプティブ カードの JSON。
- `dev-tunnel-steps.md`: ローカルで実行中の REST API へリバース プロキシを構築する Dev Tunnel 手順。
- `local.settings.json.sample`: 後で使用するサンプル構成ファイル。

`local.settings.json.sample` を `local.settings.json` にリネームし、F5 キーでプロジェクトを開始します。
Visual Studio Code で `http/ht-service.http` を開き、`http://localhost:7071/api/candidates` に対する GET リクエストの **Send request** を選択して候補者一覧を取得します。
画面右側にレスポンス ヘッダーと JSON 形式の候補者一覧が表示されます。

![The HTTP request in action in Visual Studio Code. On the left side there is the .http file with the list of requests and the one to list the candidates is highlighted. On the right side there is the response for the get list of candidates request, with some HTTP headers and the JSON body of the response. In the lower part of the screen there is the **Terminal** with an highlighted message about OAuth disabled.](../../../assets/images/make/copilot-studio-05/custom-connector-02.png)

画面下部の **Terminal** ウィンドウには、呼び出しのトレースと `OAuth is disabled. Skipping token validation` というメッセージが表示されています。現在 API は匿名アクセスが可能な状態です。

<cc-end-step lab="mcs5" exercise="1" step="1" />

### Step 2: Entra ID での API 登録

次に、API へのアクセスを保護します。まずブラウザーで [https://entra.microsoft.com](https://entra.microsoft.com){target=_blank} を開き、対象 Microsoft 365 テナントの職場アカウントで Microsoft Entra 管理センターにサインインします。左メニューから 1️⃣ **App registrations** を選択し、2️⃣ **+ New registration** をクリックして新しいアプリケーションを登録します。

![The Microsoft Entra admin center user interface with highlighting of the **App registration** menu and of the **+ New registration** command.](../../../assets/images/make/copilot-studio-05/custom-connector-03.png)

`Register an application` ページで、アプリケーション名に `HR-Service-API` などを入力し、対象テナントのみをサポートするように設定して **Register** を選択します。

![The page to register a new application with the application name "HR-Service-API", the selection of single tenant authentication, and the button to register the application highlighted.](../../../assets/images/make/copilot-studio-05/custom-connector-04.png)

登録後に表示される **Overview** ページから、Client ID と Tenant ID を控えておきます。

左メニューの 1️⃣ **Expose an API** を選択し、2️⃣ **+ Add a scope** をクリックします。最初のスコープ追加時には **Application ID URI** を設定する必要があります。既定値 `api://<Client-Id>` をそのまま使用し **Save and continue** を選択します。右側のパネルでスコープを 3️⃣ 設定し、4️⃣ **Add scope** を選択します。

![The page to configure a new permission scope for the application. On the right side there is a panel to configure bunch of settings for the new permission scope.](../../../assets/images/make/copilot-studio-05/custom-connector-05.png)

以下はスコープ設定例です。

- Scope name: `HR.Consume`
- Who can consent?: `Admins and users`
- Admin consent display name: `HR.Consume`
- Admin consent description: `Allows consuming the HR Service`
- User consent display name: `HR.Consume`
- User consent description: `Allows consuming the HR Service`
- State: **Enabled**

スコープを追加すると、一覧に表示されます。

![The permission scope configured for the current application. There is the scope name, who can consent, the admin consent display name, the user consent display name, and the state as enabled.](../../../assets/images/make/copilot-studio-05/custom-connector-06.png)

次に 1️⃣ **Manifest** を選択し、2️⃣ **Microsoft Graph App Manifest (new)** で開き、3️⃣ `requestedAccessTokenVersion` を `2` に変更します。これにより v2.0 の JWT トークンを要求することを示します。

!!! note
    Microsoft Graph App Manifest とトークン v2.0 については [こちら](https://learn.microsoft.com/en-us/entra/identity-platform/reference-microsoft-graph-app-manifest){target=_blank} を参照してください。

![The page to edit the manifest of the Entra application. There is the editor with highlighted the property `requestedAccessTokenVersion` and value of "2".](../../../assets/images/make/copilot-studio-05/custom-connector-07.png)

Visual Studio Code に戻り、`local.settings.json` を更新します。`<Client-ID>` と `<Tenant-ID>` を実際の値に置き換え、`UseOAuth` を `true` に設定します。

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

API プロジェクトを再起動すると、API は保護され、Authorization ヘッダーに OAuth 2.0 トークンを要求するようになります。トークンがない、または無効な場合、HTTP 401 (Unauthorized) が返されます。

<cc-end-step lab="mcs5" exercise="1" step="2" />

### Step 3: Dev Tunnel の構成

次に、REST API を公開 URL でアクセスできるようにします。ローカルで実行しているため、reverse proxy ツールが必要です。ここでは Microsoft 提供の dev tunnel を使用します。

- [こちらの手順](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank} に従って dev tunnel をインストールします。
- 次のコマンドでサインインします。

```console
devtunnel user login
```

- 次のコマンドでトンネルをホストします。

```console
devtunnel create hr-service -a --host-header unchanged
devtunnel port create hr-service -p 7071
devtunnel host hr-service
```

コンソールに接続情報が表示されます。

![The devtunnel running in a console window showing the hosting port, the connect via browser URL, and the URL to inspect network activity.](../../../assets/images/extend-m365-copilot-06/devtunnel-output.png)

「Connect via browser」の URL をコピーして保管してください。

ラボの作業中は devtunnel コマンドを実行したままにします。再起動が必要な場合は `devtunnel host hr-service` を再実行してください。

<cc-end-step lab="mcs5" exercise="1" step="3" />

### Step 4: Entra ID でのコンシューマー登録

Power Platform のカスタム コネクタから API を利用するには、コンシューマー アプリも Microsoft Entra ID に登録する必要があります。[Microsoft Entra admin center](https://entra.microsoft.com){target=_blank} に戻り、**App registrations** → **+ New registration** を選択します。今回は `HR-Service-Consumer` と名付け、同様にシングル テナントで登録します。

登録後の **Overview** で Client ID と Tenant ID を控えます。

![The page to create a new client secret for the consumer application in Microsoft Entra ID. There are fields to configure description and duration of the secret, and a command to add the secret.](../../../assets/images/make/copilot-studio-05/custom-connector-08.png)

1️⃣ **Certificates & Secrets** → 2️⃣ **+ New secret** を選択し、3️⃣ 説明と有効期間を設定、4️⃣ **Add** をクリックします。生成されたシークレットの値を安全な場所に保存します。

次に 1️⃣ **API permissions** → 2️⃣ **+ Add a permission** を選択し、3️⃣ **APIs my organization uses** で検索して 4️⃣ `HR-Service-API` を選択します。

![The page of Microsoft Entra admin center to grant a new permission to the consumer application. There is a panel on the right side with the list of APIs registered in the tenant and the "HR-Service-API" highlighted.](../../../assets/images/make/copilot-studio-05/custom-connector-09.png)

側面パネルで `HR.Consume` の委任済みアクセス許可を選択し、**Add permission** をクリックします。
追加後、**Grand admin consent for ...** を選択して管理者同意を与えます。

![The panel of Microsoft Entra admin center to grant a permission to an application. The group of **Delegated permissions** is selected and the permission of type **HR.Consume** is selected. The **Add permission** command is highlighted.](../../../assets/images/make/copilot-studio-05/custom-connector-10.png)

完了すると、下図のように `User.Read` と `HR.Consume` の委任許可が並びます。

![The permissions for the consumer applicaiton. There is the permission **User.Read** and there is the permission **HR.Consume**. Both permissions are of type Delegated.](../../../assets/images/make/copilot-studio-05/custom-connector-11.png)

このタブは後の手順で再度使用するため開いたままにしておいてください。

<cc-end-step lab="mcs5" exercise="1" step="4" />

## Exercise 2 : カスタム コネクタの作成

このエクササイズでは、HR Service API を利用する Power Platform カスタム コネクタを作成します。

### Step 1: カスタム コネクタの作成

ブラウザーで [https://make.powerautomate.com](https://make.powerautomate.com){target=_blank} にアクセスし、左メニューで **More** → **Discover all** と進み、**Custom connectors** を探します。頻繁に使用する場合はピン留めしてください。カスタム コネクタ一覧ページで **+ New custom connector** → **Import an OpenAPI file** を選択します。

![The menu to create a new Power Platform custom connector, highlighting the **Import an OpenAPI file** option.](../../../assets/images/make/copilot-studio-05/custom-connector-12.png)

コネクタ名を入力し、`HR-Service` の OpenAPI JSON ファイルを参照します。ファイルは [こちら](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/path-m-lab-mcs5-connectors/hr-service/src/openapi.json?raw=true){target=_blank} からも取得できます。入力後、**Continue** をクリックします。

![The dialog to create a new custom connector starting from an OpenAPI JSON file. There is the name of the connector and the path of the OpenAPI specification file. The **Continue** command is highlighted.](../../../assets/images/make/copilot-studio-05/custom-connector-13.png)

マルチステップの設定画面が表示されます。最初の **General** タブではアイコン、色、説明を設定できます。また、**Host** には Exercise 1 - Step 3 でコピーした dev tunnel のホスト名を入力し、**Base URL** は `/` のままで構いません。

![The tab to configure **General** settings for the Power Platform custom connector. There are fields to configure icon, background color, description, protocol (HTTP or HTTPS), hostname, and base URL. There is a **Security** command at the bottom of the page.](../../../assets/images/make/copilot-studio-05/custom-connector-14.png)

画面下部の **Security** をクリックし、認証タイプに `OAuth 2.0` を、フレーバーに `Azure Active Directory` を選択します。

![The authentication type settings for the **Security** tab of the custom connector. The selected value is `OAuth 2.0`.](../../../assets/images/make/copilot-studio-05/custom-connector-15.png)

設定項目:

- Client ID: Exercise 1 - Step 4 で登録したコンシューマー アプリの `<Client-Id>`
- Client secret: 同じく `<Client-Secret>`
- Authorization URL: 既定の Entra ID 認証 URL
- Tenant ID: `<Tenant-Id>`
- Resource URL: Exercise 1 - Step 2 で設定した `<Application-ID-URI>` (`api://<Client-Id>`)
- Enable on-behalf-of login: `False`
- Scope: `HR.Consume`
- Redirect URL: 読み取り専用

![The settings for `OAuth 2.0` when `Azure Active Directory` is selected. There are settings for Client ID, Client secret, Authorization URL, Tenant ID, Resource URL, Enabled on-behalf-of login, Scope, Redirect URL.](../../../assets/images/make/copilot-studio-05/custom-connector-16.png)

右上の **Create connector** をクリックして保存します。保存後に **Security** タブが更新され、**Redirect URL** の値が表示されます。これをコピーし、Microsoft Entra 管理センターでコンシューマー アプリに戻ります。1️⃣ **Authentication** → 2️⃣ **+ Add a platform** → 3️⃣ **Web** を選択し、4️⃣ コピーした **Redirect URL** を貼り付けて 5️⃣ **Configure** をクリックします。

![The page to configure **Web** authentication for the consumer application.](../../../assets/images/make/copilot-studio-05/custom-connector-17.png)

これで Power Platform からのリダイレクト URL が登録されました。

![The panel to configure the consumer application with **Redirect URL** for **Web** authentication.](../../../assets/images/make/copilot-studio-05/custom-connector-18.png)

カスタム コネクタ定義に戻り、**Definition** タブで API の各操作を確認できます。OpenAPI 仕様から取り込まれているため変更は不要です。**Test** タブに切り替えて動作確認も行えます。

<cc-end-step lab="mcs5" exercise="2" step="1" />

### Step 2: カスタム コネクタのテスト

**Test** タブで左側の操作一覧から **getCandidates** などを選択し、**+ New connection** で認証を行います。接続後 **Test operation** をクリックすると、下部にレスポンスが表示されます。

![The test page of the Power Platform custom connector, where you can invoke the target API providing credentials through a connection. In the upper part of the screen there is the configured connection. In the middle of the screen there is the operation to test. In the bottom part of the screen there is the output of the test HTTP request.](../../../assets/images/make/copilot-studio-05/custom-connector-19.png)

<cc-end-step lab="mcs5" exercise="2" step="2" />

## Exercise 3 : カスタム コネクタの利用

このエクササイズでは、Exercise 2 で作成したカスタム コネクタを使用します。

### Step 1: エージェントからカスタム コネクタを利用する

[Lab MCS4](../04-extending-m365-copilot){target=_blank} で作成した Microsoft 365 Copilot Chat エージェントからカスタム コネクタを呼び出します。

ブラウザーで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、1️⃣ エージェント一覧から 2️⃣ **Microsoft 365 Copilot** を選択します。

![The interface of Microsoft Copilot Studio when browsing the whole list of agents and selecting the **Microsoft 365 Copilot** agent.](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-01.png)

`Agentic HR` エージェントを編集し、**Actions** セクションで **+ Add action** を選択します。Lab MCS4 - Exercise 2 - Step 1 と同様に進めますが、今回は **Custom connector** を選択し `HR-Services` を検索します。Exercise 2 - Step 1 で作成した `HR-Services` コネクタのアクションが表示されます。

`Get all candidates` を選び、接続を確認します。
設定:

- Name: `Get all candidates`
- Description: `Lists all the HR candidates from an external system`
- Authentication: `User authentication`

**Add action** で追加し、Lab MCS4 で作成した旧アクションは無効化します。無効化するには、アクション横の (...) をクリックし **Status** を `Off` にします。

![The status menu item do enable/disable an action in an agent for Microsoft 365 Copilot Chat.](../../../assets/images/make/copilot-studio-05/custom-connector-20.png)

エージェントを公開し、更新が完了したら Microsoft 365 Copilot Chat で次のプロンプトを入力してテストします。

```text
Lists all the HR candidates from an external system
```

Microsoft 365 Copilot Chat は外部 REST API の利用許可を求めます。**Always allow** または **Allow once** を選択します。

![Microsoft 365 Copilot Chat prompting the user to consent consumption of the HR Service external REST API. There are commands to **Always allow**, **Allow once**, or **Cancel**.](../../../assets/images/make/copilot-studio-05/custom-connector-21.png)

続いてサインインを求められるので **Sign in to Agentic HR** をクリックし、認証を完了します。その後、同じプロンプトを再実行すると HR Service から取得した候補者一覧が表示され、回答下部に外部サービスからの応答であることを示すアイコンが表示されます。

![Microsoft 365 Copilot Chat providing the list of candidates retrieved from the external API.](../../../assets/images/make/copilot-studio-05/custom-connector-23.png)

Visual Studio Code の **Terminal** でも REST リクエストのトレースを確認できます。`Token is valid for user <username>` と表示され、認証が成功していることがわかります。

![The **Terminal** window of Visual Studio Code with tracing information.](../../../assets/images/make/copilot-studio-05/custom-connector-24.png)

これでカスタム コネクタを構成し、Microsoft 365 Copilot Chat から利用できました!

<cc-end-step lab="mcs5" exercise="3" step="1" />

---8<--- "ja/mcs-congratulations.md"

Lab MCS5 - Power Platform カスタム コネクタ を完了しました!

<a href="../06-mcp">こちらから</a> Lab MCS6 を開始して、Copilot Studio で MCP サーバーを利用する方法を学びましょう。
<cc-next /> 

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/05-connectors--ja" />