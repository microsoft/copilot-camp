---
search:
  exclude: true
---
# ラボ E6b - OAuth を使用した Entra ID 認証の追加 (手動セットアップ)

このラボでは、Entra ID を ID プロバイダーとして使用し、OAuth 2.0 で API プラグインに認証を追加します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/1IhyztqkuJo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を確認できます。</div>
            <div class="note-box">
            📘 <strong>注意:</strong>   このラボは前回の Lab E5 を基にしています。すでに Lab E5 を完了している場合は同じフォルダーで作業を続けてください。完了していない場合は、<a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a> のソリューション フォルダーをコピーして作業してください。  
    このラボの完成版ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06b-add-oauth/trey-research-lab06b-END" target="_blank">/src/extend-m365-copilot/path-e-lab06b-add-oauth/trey-research-lab06b-END</a> フォルダーにあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


!!! note
    このラボでは Entra ID の詳細なセットアップ手順が多数あります。  
    新しい Agents Toolkit では多くの手順が自動化されており、近々、よりシンプルなバージョンのラボを提供する予定です。

このラボでは、プラグインと API を保護するために使用する Entra ID アプリケーションを登録します。開始する前に、アプリ情報を安全な場所に保存してください。保存が必要な値は次のとおりです。

~~~text
API Base URL: 
API service Application (client) ID: 
API service Directory (tenant) ID: 
Authorization endpoint: 
Token endpoint: 
API service client secret: 
API scope: 
Plugin service application (client) ID: 
Plugin service client secret: 
~~~

## 演習 1: 永続的な開発トンネルの設定 (任意)

既定では、Agents Toolkit はプロジェクトを起動するたびに新しい開発トンネルを作成するため、ローカルで実行中の API にアクセスする URL も毎回変わります。通常は Agents Toolkit が必要な場所の URL を自動更新するため問題ありませんが、本ラボは手動セットアップのため、デバッガーを開始するたびに Entra ID と Teams Developer Portal の URL を手動で更新する必要があります。そのため、URL が変わらない永続的な開発トンネルを設定すると便利です。

??? Note "永続的トンネルを設定しない場合はこちら ▶▶▶"
    永続的トンネルを設定せず、Agents Toolkit が提供する開発トンネルを使用しても構いません。プロジェクトが実行されたら、ターミナル タブ 1️⃣ で「Start local tunnel」ターミナル 2️⃣ を選択し、Forwarding URL 3️⃣ をコピーしてください。この URL はプロジェクトを起動するたびに変わるため、アプリ登録のリダイレクト URL (演習 2 手順 1) と Teams Developer Portal の URL (演習 5 手順 1) を手動で更新する必要があります。  
    ![Developer tunnel URL](../../assets/images/extend-m365-copilot-06/oauth-A0.png)

### 手順 1: Developer Tunnel CLI のインストール

以下のコマンドで Developer Tunnel をインストールします。[Developer Tunnel の完全な手順とダウンロード リンクはこちら](https://learn.microsoft.com/azure/developer/dev-tunnels/get-started){target=_blank}。

| OS | コマンド |
| --- | --- |
| Windows | `winget install Microsoft.devtunnel` |
| Mac OS | `brew install --cask devtunnel` |
| Linux | `curl -sL https://aka.ms/DevTunnelCliInstall | bash` |

!!! tip
    `devtunnel` コマンドを有効にするには、コマンドラインを再起動する必要がある場合があります。

インストール後、ログインします。Microsoft 365 アカウントでログインできます。

~~~sh
devtunnel user login
~~~

このラボの演習中は `devtunnel` コマンドを実行したままにしてください。再起動が必要な場合は `devtunnel user login` を再度実行します。

<cc-end-step lab="e6b" exercise="1" step="1" />

### 手順 2: トンネルの作成とホスト

次に、Azure Functions のローカル ポート (7071) への永続的トンネルを設定します。以下のコマンドを使用し、必要に応じて `mytunnel` を別の名前に変更してください。

~~~sh
devtunnel create mytunnel -a --host-header unchanged
devtunnel port create mytunnel -p 7071
devtunnel host mytunnel
~~~

コマンドラインには接続情報が表示されます。

![The devtunnel running in a console window showing the hosting port, the connect via browser URL, and the URL to inspect network activity.](../../assets/images/extend-m365-copilot-06/devtunnel-output.png)

「Connect via browser」URL をコピーし、"API Base URL" として保存してください。

<cc-end-step lab="e6b" exercise="1" step="2" />

### 手順 3: プロジェクトで動的トンネルを無効化

ローカルでプロジェクトが実行中の場合は停止します。[\.vscode\tasks.json](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab06-add-auth/trey-research-lab06-END/.vscode/tasks.json){target=_blank} を編集し、`"Start Teams App Locally"` タスクを探します。"Start local tunnel" 依存関係をコメント アウトし、代わりに `"Start Azurite emulator"` を追加します。

~~~json
{
    "label": "Start Teams App Locally",
    "dependsOn": [
        "Validate prerequisites",
        //"Start local tunnel",
        "Start Azurite emulator",
        "Create resources",
        "Build project",
        "Start application"
    ],
    "dependsOrder": "sequence"
},
~~~
<cc-end-step lab="e6b" exercise="1" step="3" />

### 手順 4: サーバー URL の手動上書き

**env/.env.local** を開き、`OPENAPI_SERVER_URL` の値を永続トンネル URL に変更します。

<cc-end-step lab="e6b" exercise="1" step="4" />

## 演習 2: API 用 Entra ID アプリケーションの登録

### 手順 1: 新しい Entra ID アプリ登録の追加

[Microsoft 365 Admin center](https://portal.office.com/AdminPortal/){target=_blank} から、または直接 [https://entra.microsoft.com/](https://entra.microsoft.com/){target=_blank} で Entra ID 管理センターを開きます。開発テナントにログインしていることを確認してください。

「Identity」1️⃣ → 「Applications」2️⃣ → 「App registrations」3️⃣ の順に選択し、「+」4️⃣ をクリックして新しいアプリ登録を追加します。

![The Microsoft Entra admin center showing the list of applications registered and the button to create a 'New regitration'.](../../assets/images/extend-m365-copilot-06/oauth-A2.png)

アプリケーション名に「My API Service」など一意でわかりやすい名前を入力 1️⃣ します。「Supported account types」は「Accounts in this organizational directory only (Microsoft only - single tenant)」2️⃣ を選択します。「Redirect URI (optional)」では「Web」を選択し、開発トンネルの URL を入力 3️⃣ します。 

!!! Note "永続トンネル URL を作成しなかった場合..."
    ...Agents Toolkit でアプリを起動するたびにトンネル URL が変わるため、そのたびに「Redirect URI」を更新する必要があります。

最後に「Register」4️⃣ をクリックします。

![The app registration page, where you can provide the application name, supported application types, and redirect URI. There is also the 'Register' button to select.](../../assets/images/extend-m365-copilot-06/oauth-A4.png)

<cc-end-step lab="e6b" exercise="2" step="1" />

### 手順 2: アプリ情報の安全な保存

「Application (client) ID」1️⃣ と「Directory (tenant) ID」2️⃣ をコピーして安全な場所に保存します。次に「Endpoints」ボタン 3️⃣ をクリックしてエンドポイントを開きます。

![The overview page of the application registered. There you can copy the Application ID and the Directory ID, as well as you can find the 'Endpoints' command.](../../assets/images/extend-m365-copilot-06/oauth-A5.png)

「OAuth 2.0 authorization endpoint (v2)」1️⃣ と「OAuth 2.0 token endpoint (v2)」2️⃣ の URL をコピーし、同じ場所に保存します。

![The panel with the Endpoints of the application. The buttons to copy 'OAuth 2.0 authorization endpoint (v2)' and 'OAuth 2.0 token endpoint (v2)' are highlighted.](../../assets/images/extend-m365-copilot-06/oauth-A7.png)

<cc-end-step lab="e6b" exercise="2" step="2" />

### 手順 3: クライアント シークレットの作成

「Certificates & secrets」1️⃣ に移動し、「+ New client secret」2️⃣ をクリックします。シークレットに名前と有効期間を設定し、*Add* を選択します。シークレットはこのタイミングでのみ表示されるため、3️⃣ をコピーして安全な場所に保存します。

![The 'Certificates &amp; secrets' page from which you can select to create a 'New client secret'.](../../assets/images/extend-m365-copilot-06/oauth-A11.png)

<cc-end-step lab="e6b" exercise="2" step="3" />

### 手順 4: API Scope の公開

API への呼び出しを検証するには、API Scope を公開する必要があります。ここではシンプルに `access_as_user` というスコープを作成します。

「Expose an API」1️⃣ に移動し、「Application ID URI」横の「Add」2️⃣ をクリックします。デフォルトの `api://<application (client) ID>` のままで構いません。「Save and continue」3️⃣ をクリックします。

![The 'Expose an API' page of the application registered, with the side panel to set the application unique URI.](../../assets/images/extend-m365-copilot-06/oauth-A15.png)

「Add a scope」で Scope name を `access_as_user` と入力 1️⃣ し、以下の値を入力します。

| フィールド | 値 |
| --- | --- |
| Who can consent? | Admins and users |
| Admin consent display name | Access My API as the user |
| Admin consent description | Allows an API to access My API as a user |
| User consent display name | Access My API as you |
| User consent description | Allows an app to access My API as you |
| State | Enabled |

「Add Scope」2️⃣ をクリックします。

![The 'Add a scope' side panel in the 'Expose an API' page of the application registered, with settings for scope name, who can consent the scope, the admin and user display name and description, and the state flag to enable or disable the scope.](../../assets/images/extend-m365-copilot-06/oauth-A17.png)

<cc-end-step lab="e6b" exercise="2" step="4" />

### 手順 5: API Scope の保存

スコープをコピーし、「API Scope」として保存します。

![The 'Expose an API' page of the application registered, once the custom scope has been created with the button to copy the scope name highlighted.](../../assets/images/extend-m365-copilot-06/oauth-A17b.png)

<cc-end-step lab="e6b" exercise="2" step="5" />

## 演習 3: プラグイン用 Entra ID アプリケーションの登録

API を登録したので、次にプラグイン自体を登録します。

!!! Note "2 つの Entra ID アプリ登録について"
    本ラボは、すでに API 用アプリ登録がある前提でエージェントのプラグインとして統合する方法を示すため、2 つのアプリ登録を使用します。  
    新規 API を最初から作成する場合は、1 つのアプリ登録で OAuth を安全に実装できる場合もあります。1 つのアプリ登録で行う方法は [この学習モジュール](https://learn.microsoft.com/en-us/training/modules/copilot-declarative-agent-api-plugin-auth/5-exercise-integrate-api-plugin-oauth){target=_blank} を参照してください。

### 手順 1: プラグインの登録

「App registrations」セクションに戻り、2 つ目のアプリケーションを登録します。名前は「My API Plugin」1️⃣ とし、「Supported account types」は再び「Accounts in this organizational directory only」2️⃣ を選択します。

「Redirect URL」で「Web」を選択し、`https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect` を入力 3️⃣ します。これは Teams が API プラグイン アプリのログイン完了を処理する場所です。

「Register」4️⃣ をクリックします。

![The app registration page, where you can provide the application name, supported application types, and redirect URI. There is also the 'Register' button to select.](../../assets/images/extend-m365-copilot-06/oauth-B5.png)

前と同様に「Overview」ページでプラグイン アプリの Application (client) ID を保存します。

<cc-end-step lab="e6b" exercise="3" step="1" />

### 手順 2: クライアント シークレットの作成

前と同様にクライアント シークレットを作成し、「Plugin service client secret」として保存します。

<cc-end-step lab="e6b" exercise="3" step="2" />

### 手順 3: 権限の付与

プラグインは API サービスを呼び出す必要があるため、権限を付与します。「API permissions」に移動し、「APIs my organization uses」タブ 1️⃣ を選択して API サービスを検索 2️⃣、結果から選択 3️⃣ します。

![The 'API permissions' page of the application registered, with the side panel to grant new permissions. The 'APIs my organization uses' tab is selected and the list of applications shows 'My API Service' in the results.](../../assets/images/extend-m365-copilot-06/oauth-B11.png)

API サービス アプリが表示されたら `access_as_user` 権限を選択し、「Add permission」をクリックします。

![The side panel to select and add a permission to the application registered. The 'access_as_user' permission is selected and highlighted, together with the 'Add permission' button.](../../assets/images/extend-m365-copilot-06/oauth-B12.png)

<cc-end-step lab="e6b" exercise="3" step="3" />

## 演習 4: API アプリ登録をプラグイン アプリケーション ID で更新

### 手順 1: API サービス アプリにプラグイン アプリ ID を追加

API サービス アプリが API プラグイン アプリからトークンを発行できるようにします。API サービス アプリ登録に戻り、「Manifest」を選択し、`knownClientApplications` 1️⃣ を探します。以下のようにプラグインの client ID を追加します。

~~~json
"knownClientApplications": [
    "<your-plugin-client-id>"
]
~~~

入力後、「Save」2️⃣ をクリックします。

![The page to edit the manifest of the application with the 'knownClientApplications' entry and the 'Save' button highlighted.](../../assets/images/extend-m365-copilot-06/oauth-C4.png)

<cc-end-step lab="e6b" exercise="4" step="1" />

## 演習 5: Teams Developer Portal で OAuth 情報を登録

アプリは準備できましたが、Microsoft 365 はまだ情報を認識していません。シークレットをアプリ マニフェストに保存するのは安全ではないため、Teams Developer Portal には安全に保存する場所があります。ここでは Copilot がユーザーを認証できるように OAuth クライアント アプリを登録します。

### 手順 1: 新しい OAuth クライアント登録の作成

[https://dev.teams.microsoft.com](https://dev.teams.microsoft.com){target=_blank} を開き、「Tools」1️⃣ → 「OAuth client registration」2️⃣ を選択します。

![The UI of the Teams Developer Portal with 'Tools' and 'OAuth client registration' highlighted.](../../assets/images/extend-m365-copilot-06/oauth-C2.png)

まだ登録がない場合は「Register client」、既に登録がある場合は「+ New OAuth client registration」をクリックし、フォームを入力します。多くのフィールドは前演習で保存した値です。

| フィールド | 値 |
| --- | --- |
| Name | 覚えやすい名前 |
| Base URL | API service Base URL |
| Restrict usage by org | My organization only |
| Restrict usage by app | Any Teams app |
| Client ID | **Plugin Application** (client) ID |
| Client secret | **Plugin Application** client secret |
| Authorization endpoint | Authorization endpoint |
| Token endpoint | Token endpoint |
| Refresh endpoint | Token endpoint |
| API scope | API Service アプリケーションの scope |

![the page to register a new OAuth client in the Teams Developer Portal. There is a list of fields to configure the client registration settings.](../../assets/images/extend-m365-copilot-06/oauth-C3ab.png)

!!! Note "永続トンネル URL を作成しなかった場合..."
    ...Agents Toolkit でアプリを起動するたびに「Base URL」を更新する必要があります。

<cc-end-step lab="e6b" exercise="5" step="1" />

### 手順 2: OAuth 登録 ID の保存

![The result of registering an OAuth client in the Teams Developer Portal. There is a box confirming the registration and providing a 'Registration ID' for reference.](../../assets/images/extend-m365-copilot-06/oauth-E1.png)

ポータルに OAuth クライアント登録 ID が表示されます。次の手順で使用するため保存してください。

<cc-end-step lab="e6b" exercise="5" step="2" />

## 演習 6: アプリ パッケージの更新

### 手順 1: プラグイン ファイルの更新

Visual Studio Code で作業フォルダーを開き、**appPackage** フォルダー内の **trey-plugin.json** を開きます。ここには OAS ファイルに含まれていない Copilot が必要とする情報が保存されています。

`Runtimes` の `auth` プロパティが `"None"` になっているので、次のように変更します。

~~~json
"auth": {
  "type": "OAuthPluginVault",
  "reference_id":  "${{OAUTH_CLIENT_REGISTRATION_ID}}"
},
~~~

次に **env/.env.local** に次の行を追加します。

~~~text
OAUTH_CLIENT_REGISTRATION_ID=<registration id you saved in the previous exercise>
~~~

次回 API プラグインを起動してプロンプトすると、サインインが求められるはずです。ただし、この時点ではアプリケーションは保護されていないため、誰でも呼び出せます。次の手順でコードを更新し、有効なログインを確認して実際の Microsoft 365 ユーザーとして API にアクセスします (「Avery Howard」ではなく)。

<cc-end-step lab="e6b" exercise="6" step="1" />

## 演習 7: アプリケーション コードの更新

### 手順 1: JWT 検証ライブラリのインストール

作業ディレクトリのコマンドラインで次を実行します。

~~~sh
npm i jwt-validate
~~~

これで Entra ID 認可トークンを検証するライブラリがインストールされます。

!!! warning
    Microsoft は NodeJS で Entra ID トークンを検証する公式ライブラリを提供していませんが、[詳細ドキュメント](https://learn.microsoft.com/entra/identity-platform/access-tokens#validate-tokens){target=_blank} で独自実装方法を説明しています。  
    [もう 1 つの参考記事](https://www.voitanos.io/blog/validating-entra-id-generated-oauth-tokens/){target=_blank} も [Microsoft MVP Andrew Connell](https://www.voitanos.io/pages/about/#whos-behind-voitanos){target=_blank} から提供されています。

    **このラボでは [Waldek Mastykarz](https://github.com/waldekmastykarz){target=_blank} 氏が提供する [community ライブラリ](https://www.npmjs.com/package/jwt-validate){target=_blank} を使用します。MIT ライセンスで提供され、Microsoft の公式サポートはありません。**

    サポート付きライブラリの進捗を追跡したい場合は [この GitHub issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/6113){target=_blank} をご覧ください。

<cc-end-step lab="e6b" exercise="7" step="1" />

### 手順 2: API 用環境変数の追加

作業フォルダーの **env** フォルダーで **env.local** を開き、API サービス アプリの client ID と tenant ID を追加します。

~~~text
API_APPLICATION_ID=<your-api-service-client-id>
API_TENANT_ID=<your-tenant-id>
~~~

Agents Toolkit 内でコードがこれらを使用できるよう、ルートの **teamsapp.local.yml** も更新します。`Generate runtime environment variables` コメントを探し、`STORAGE_ACCOUNT_CONNECTION_STRING` の下に追加します。

~~~yaml
  - uses: file/createOrUpdateEnvironmentFile
    with:
      target: ./.localConfigs
      envs:
        STORAGE_ACCOUNT_CONNECTION_STRING: ${{SECRET_STORAGE_ACCOUNT_CONNECTION_STRING}},
        API_APPLICATION_ID: ${{API_APPLICATION_ID}}
        API_TENANT_ID: ${{API_TENANT_ID}}
~~~

<cc-end-step lab="e6b" exercise="7" step="2" />

### 手順 3: Identity サービスの更新

この時点で OAuth ログインは有効でトークンも取得できますが、トークンを検証しなければ安全ではありません。この手順ではトークンを検証し、ユーザー情報を抽出するコードを追加します。

**src/services** フォルダーで **IdentityService.ts** を開きます。  
ファイル先頭の `import` 群に次を追加します。

~~~typescript
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
~~~

次に `class Identity` の直下に次の行を追加します。

~~~typescript
    private validator: TokenValidator;
~~~

`// ** INSERT REQUEST VALIDATION HERE (see Lab E6) **` というコメントを探し、その部分を以下のコードで置き換えます。

~~~typescript
// Try to validate the token and get user's basic information
try {
    const { API_APPLICATION_ID, API_TENANT_ID } = process.env;
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        throw new HttpError(401, "Authorization token not found");
    }

    // create a new token validator for the Microsoft Entra common tenant
    if (!this.validator) {
        // We need a new validator object which we will continue to use on subsequent
        // requests so it can cache the Entra ID signing keys
        // For multitenant, use:
        // const entraJwksUri = await getEntraJwksUri();
        const entraJwksUri = await getEntraJwksUri(API_TENANT_ID);
        this.validator = new TokenValidator({
            jwksUri: entraJwksUri
        });
        console.log ("Token validator created");
    }

    // Use these options for single-tenant applications
    const options: ValidateTokenOptions = {
        audience: `api://${API_APPLICATION_ID}`,
        issuer: `https://sts.windows.net/${API_TENANT_ID}/`,
        // NOTE: If this is a multi-tenant app, look for 
        // issuer: "https://sts.windows.net/common/",
        // Also you may wish to manage a list of allowed tenants
        // and test them as well
        //   allowedTenants: [process.env["AAD_APP_TENANT_ID"]],
        scp: ["access_as_user"]
    };

    // validate the token
    const validToken = await this.validator.validateToken(token, options);

    userId = validToken.oid;
    userName = validToken.name;
    userEmail = validToken.upn;
    console.log(`Request ${this.requestNumber++}: Token is valid for user ${userName} (${userId})`);
}
catch (ex) {
    // Token is missing or invalid - return a 401 error
    console.error(ex);
    throw new HttpError(401, "Unauthorized");
}
~~~

!!! Note "コードから学ぶポイント"
    まず `Authorization` ヘッダーからトークンを取得します。このヘッダーは `"Bearer "` とトークン本体で構成されるため、`split(" ")` でトークンのみを抜き出します。  

    トークンの検証に使用する `TokenValidator` は Entra ID の署名鍵をキャッシュできるよう、最初のリクエストで作成し、その後も再利用します。  

    `ValidateTokenOptions` により次の検証が行われます。  
    * _audience_ が API サービス アプリ URI と一致  
    * _issuer_ が自テナントの STS である  
    * _scope_ が `"access_as_user"` と一致  

    トークンが有効な場合、ユーザー ID、名前、メールなどのクレームが取得できます。これらを使用して、架空の "Avery Howard" ではなく実際のユーザーとして動作します。

!!! Note "アプリがマルチテナントの場合"
    マルチテナント アプリでのトークン検証については、上記コードのコメントを参照してください。

`userId` が取得できたら、データベースで Consultant レコードを検索します。見つからない場合は新規に作成します。

初回実行時には、ログイン ユーザー用の Consultant レコードが作成され、既定のスキルやロールが設定されます。デモ用に変更したい場合は [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/){target=_blank} で編集できます。

![The Azure Storage Explorer in action while editing the Consultant table. The actual current user is highlighted.](../../assets/images/extend-m365-copilot-06/oauth-azure-storage-explorer.png)

プロジェクト割り当ては `Assignment` テーブルに保存され、プロジェクト ID と Consultant ID を参照します。

<cc-end-step lab="e6b" exercise="7" step="3" />

## 演習 8: アプリケーションのテスト

テストの前に、`appPackage\manifest.json` の manifest バージョンを更新します。

1. `appPackage` フォルダーの `manifest.json` を開きます。  
2. `version` フィールドを探し、例えば  
   ```json
   "version": "1.0.0"
   ```  
   を  
   ```json
   "version": "1.0.1"
   ```  
   のように小刻みに増やします。  
3. ファイルを保存します。

### 手順 1: アプリケーションの (再) 起動

以前のラボでアプリが実行中の場合は停止し、アプリ パッケージを再生成させます。  
F5 キーでアプリを再度実行し、前と同様にインストールします。

プラグインに「What Trey projects am I assigned to?」と問いかけてください。API を呼び出すか確認するカードが表示されたら、「Allow Once」をクリックします。

![Microsoft 365 Copilot showing a confirmation card asking if it is ok to call your API. There are buttons to 'Always allow', 'Allow once', or 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-01small.png)

確認カードがログイン カードに置き換わります。「Sign in to Trey」をクリックし、サインインします。初回はポップアップでログインと同意が求められますが、以降はキャッシュされることがあります。

![Microsoft 365 Copilot showing a login card with a button to 'Sign in to Trey' and another one to 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-02small.png)

管理者がユーザー同意を許可していない場合、次のような画面が表示されます。  
![The Microsoft Entra popup dialog asking for an admin approval to consume the API.](../../assets/images/extend-m365-copilot-06/need-admin-approval.png)

この場合、管理者にプラグイン API 登録に対してグローバル同意を付与してもらう必要があります。

![The 'API permissions' page of the 'API Plugin' application registered in Microsoft Entra with the 'Grant admin consent ...' command highlighted.](../../assets/images/extend-m365-copilot-06/approval-admin.png)

ログイン カードが Copilot の応答に置き換わります。データベースに追加されたばかりなので、まだプロジェクトには割り当てられていないはずです。

![The response from the 'Trey Genie' agent when the actual user doesn't have any assigned project.](../../assets/images/extend-m365-copilot-06/oauth-run-03bsmall.png)

Copilot に Woodgrove プロジェクトへ追加するよう依頼します。必須項目を忘れると Copilot が詳細を尋ねてきます。

![The response from the 'Trey Genie' agent when adding the current user to a project. If some information are missing, Copilot asks to provide them. Once all the information are provided, the agent provides a confirmation of the action.](../../assets/images/extend-m365-copilot-06/oauth-run-05.png)

続いて「What are my skills and what projects am I assigned to?」と尋ね、スキルと割り当てを確認します。

![](../../assets/images/extend-m365-copilot-06/oauth-run-07.png)

<cc-end-step lab="e6b" exercise="8" step="1" />

---8<--- "ja/e-congratulations.md"

Lab E6b「Entra ID 認証の追加 (手動セットアップ)」が完了しました！

次に何か面白いことを試してみませんか? Copilot Connector をソリューションに追加してみましょう。

<cc-next url="../07-add-graphconnector" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/06b-add-authentication--ja" />