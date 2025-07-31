---
search:
  exclude: true
---
# ラボ E6b - Entra ID 認証を OAuth で追加 (手動セットアップ)

このラボでは、エージェント API プラグインに対して OAuth 2.0 を使い、Entra ID を認証プロバイダーとして設定します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/1IhyztqkuJo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を短時間で確認できます。</div>
            <div class="note-box">
            📘 <strong>注:</strong>   本ラボは前回の Lab E5 を基に進めます。Lab E5 を完了済みの場合は同じフォルダーで続行できます。未実施の場合は、<a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a> のソリューション フォルダーをコピーして作業してください。  
    本ラボの完成版ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06b-add-oauth/trey-research-lab06b-END" target="_blank">/src/extend-m365-copilot/path-e-lab06b-add-oauth/trey-research-lab06b-END</a> フォルダーにあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


!!! note
    本ラボでは Entra ID の詳細なセットアップ手順が多数あります。  
    多くの手順を自動化する新しい Agents Toolkit が利用可能になっています。近日中に、より簡略化したラボを提供する予定です。

このラボでは、プラグインと API を保護するための Entra ID アプリケーションを登録します。開始前に、アプリ情報を安全に保存できる場所を決めてください。次の値を保存する必要があります。

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

## Exercise 1: 永続的な開発トンネルを設定する (任意)

デフォルトでは、Agents Toolkit はプロジェクト起動のたびに新しい開発トンネルを作成し、その結果ローカル API への URL も毎回変わります。通常は Toolkit が URL を自動更新するため問題ありませんが、本ラボでは手動セットアップのため、デバッガーを起動するたびに Entra ID と Teams Developer Portal の URL を手動で更新する必要があります。変更されない URL を持つ永続的な開発トンネルを設定すると便利です。

??? Note "永続トンネルを設定しない場合 ▶▶▶"
    Agents Toolkit が提供する開発トンネルをそのまま使用しても構いません。プロジェクト起動後、ターミナル タブ 1️⃣ で「Start local tunnel」ターミナル 2️⃣ を選択し、Forwarding URL 3️⃣ をコピーします。この URL は起動のたびに変わるため、アプリ登録の Reply URL (Exercise 2 Step 1) と Teams Developer Portal の URL (Exercise 5 Step 1) を毎回手動で更新する必要があります。  
    ![Developer tunnel URL](../../assets/images/extend-m365-copilot-06/oauth-A0.png)

### Step 1: Developer Tunnel CLI をインストールする

以下は Developer Tunnel のインストール コマンドです。[Developer Tunnel の詳細手順とダウンロード リンクはこちら](https://learn.microsoft.com/azure/developer/dev-tunnels/get-started){target=_blank}。  

| OS | コマンド |
| --- | --- |
| Windows | `winget install Microsoft.devtunnel` |
| Mac OS | `brew install --cask devtunnel` |
| Linux | `curl -sL https://aka.ms/DevTunnelCliInstall | bash` |

!!! tip
    `devtunnel` コマンドが動作しない場合は、パスを更新するためにコマンドラインを再起動してください。

インストール後、次のコマンドでログインします。Microsoft 365 アカウントを使用できます。

~~~sh
devtunnel user login
~~~

ラボ作業中は devtunnel コマンドを起動したままにしてください。再起動が必要な場合は `devtunnel user login` を再度実行します。

<cc-end-step lab="e6b" exercise="1" step="1" />

### Step 2: トンネルを作成してホストする

続いて、Azure Functions のローカル ポート (7071) に永続的トンネルを設定します。以下のコマンドで "mytunnel" の部分は任意の名前に変更できます。

~~~sh
devtunnel create mytunnel -a --host-header unchanged
devtunnel port create mytunnel -p 7071
devtunnel host mytunnel
~~~

コマンド ラインに接続情報が表示されます。

![The devtunnel running in a console window showing the hosting port, the connect via browser URL, and the URL to inspect network activity.](../../assets/images/extend-m365-copilot-06/devtunnel-output.png)

「Connect via browser」の URL をコピーし、「API Base URL」として保存します。

<cc-end-step lab="e6b" exercise="1" step="2" />

### Step 3: プロジェクトで自動生成トンネルを無効化

ローカルでプロジェクトが稼働中の場合は停止します。その後 [\.vscode\tasks.json](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab06-add-auth/trey-research-lab06-END/.vscode/tasks.json){target=_blank} を編集し、「Start Teams App」タスクを探します。"Start local tunnel" の依存関係をコメントアウトし、代わりに "Start Azurite emulator" を追加します。変更後は次のようになります。

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

### Step 4: サーバー URL を手動で上書き

**env/.env.local** を開き、OPENAPI_SERVER_URL の値を永続トンネル URL に変更します。

<cc-end-step lab="e6b" exercise="1" step="4" />

## Exercise 2: API 用の Entra ID アプリケーションを登録する

### Step 1: 新しい Entra ID アプリ登録を追加

[Microsoft 365 Admin Center](https://portal.office.com/AdminPortal/){target=_blank} から、または直接 [https://entra.microsoft.com/](https://entra.microsoft.com/){target=_blank} へアクセスし、開発テナントでログインしていることを確認します。

「Identity」1️⃣ → 「Applications」2️⃣ → 「App registrations」3️⃣ の順に選択し、「+」4️⃣ をクリックして新規登録します。

![The Microsoft Entra admin center showing the list of applications registered and the button to create a 'New regitration'.](../../assets/images/extend-m365-copilot-06/oauth-A2.png)

アプリケーション名に「My API Service」など分かりやすい名前を入力 1️⃣。「Supported account types」は「Accounts in this organizational directory only (Microsoft only - single tenant)」を選択 2️⃣。  
「Redirect URI (optional)」で「Web」を選択し、開発トンネルの URL を入力 3️⃣。

!!! Note "永続トンネル URL を作成しなかった場合..."
    ...Agents Toolkit でアプリを起動するたびにトンネル URL が変わるので、その都度この「Redirect URI」を更新する必要があります。

最後に「Register」4️⃣ をクリックします。

![The app registration page, where you can provide the application name, supported application types, and redirect URI. There is also the 'Register' button to select.](../../assets/images/extend-m365-copilot-06/oauth-A4.png)

<cc-end-step lab="e6b" exercise="2" step="1" />

### Step 2: アプリ情報を保存

「Overview」ページで Application ID (Client ID) 1️⃣ と Directory ID (Tenant ID) 2️⃣ をコピーして安全な場所に保存します。続いて「Endpoints」ボタン 3️⃣ をクリックします。

![The overview page of the application registered. There you can copy the Application ID and the Directory ID, as well as you can find the 'Endpoints' command.](../../assets/images/extend-m365-copilot-06/oauth-A5.png)

「OAuth 2.0 authorization endpoint (v2)」1️⃣ と「OAuth 2.0 token endpoint (v2)」2️⃣ の URL をコピーして同じ場所に保存します。

![The panel with the Endpoints of the application. The buttons to copy 'OAuth 2.0 authorization endpoint (v2)' and 'OAuth 2.0 token endpoint (v2)' are highlighted.](../../assets/images/extend-m365-copilot-06/oauth-A7.png)

<cc-end-step lab="e6b" exercise="2" step="2" />

### Step 3: クライアント シークレットを作成

「Certificates & secrets」1️⃣ → 「+ New client secret」2️⃣ を選択し、名前と有効期限を設定して *Add* をクリックします。シークレットは作成直後のみ表示されるため、このタイミングで 3️⃣ コピーして安全な場所に保存してください。

![The 'Certificates &amp; secrets' page from which you can select to create a 'New client secret'.](../../assets/images/extend-m365-copilot-06/oauth-A11.png)

<cc-end-step lab="e6b" exercise="2" step="3" />

### Step 4: API Scope を公開

API への呼び出しを検証するために Scope を公開します。ここでは "access_as_user" というシンプルな Scope を作成します。

「Expose an API」1️⃣ → 「Application ID URI」横の「Add」2️⃣ をクリック。右側のフライアウトで既定値 `api://<your application (client) ID>` のまま「Save and continue」3️⃣ を選択します。

![The 'Expose an API' page of the application registered, with the side panel to set the application unique URI.](../../assets/images/extend-m365-copilot-06/oauth-A15.png)

「Add a scope」では Scope 名に "access_as_user" 1️⃣ を入力し、以下のように設定します。

| 項目 | 値 |
| --- | --- |
| Who can consent? | Admins and users |
| Admin consent display name | Access My API as the user |
| Admin consent description | Allows an API to access My API as a user |
| User consent display name | Access My API as you |
| User consent description | Allows an app to access My API as you |
| State | Enabled |

設定後「Add Scope」2️⃣ をクリック。

![The 'Add a scope' side panel in the 'Expose an API' page of the application registered, with settings for scope name, who can consent the scope, the admin and user display name and description, and the state flag to enable or disable the scope.](../../assets/images/extend-m365-copilot-06/oauth-A17.png)

<cc-end-step lab="e6b" exercise="2" step="4" />

### Step 5: API Scope を保存

Scope 名をコピーし、安全な場所に「API Scope」として保存します。

![The 'Expose an API' page of the application registered, once the custom scope has been created with the button to copy the scope name highlighted.](../../assets/images/extend-m365-copilot-06/oauth-A17b.png)

<cc-end-step lab="e6b" exercise="2" step="5" />

## Exercise 3: プラグイン用の Entra ID アプリケーションを登録する

API を登録したので、次はプラグイン自体を登録します。

!!! Note "2 つの Entra ID アプリ登録について"
    本ラボは、既存の API アプリ登録がある前提でエージェント プラグインに統合する手順を説明します。そのため 2 つのアプリ登録が必要です。  
    新規 API をゼロから作成する場合は、1 つのアプリ登録で OAuth を安全に実装できる場合もあります。詳細は [この学習モジュール](https://learn.microsoft.com/en-us/training/modules/copilot-declarative-agent-api-plugin-auth/5-exercise-integrate-api-plugin-oauth){target=_blank} を参照してください。

### Step 1: プラグインを登録

「App registrations」に戻り、2 つ目のアプリケーションを登録します。名前は「My API Plugin」1️⃣ とし、「Supported account types」は再度「Accounts in this organizational directory only」2️⃣ を選択します。

「Redirect URL」で「Web」を選び、`https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect` を入力 3️⃣ します。これは Teams が API プラグイン アプリのログイン完了を処理する場所です。

「Register」4️⃣ をクリックして登録します。

![The app registration page, where you can provide the application name, supported application types, and redirect URI. There is also the 'Register' button to select.](../../assets/images/extend-m365-copilot-06/oauth-B5.png)

「Overview」ページで Plugin アプリの Application (client) ID を保存します。

<cc-end-step lab="e6b" exercise="3" step="1" />

### Step 2: クライアント シークレットを作成

同様にクライアント シークレットを作成し、「Plugin service client secret」として保存します。

<cc-end-step lab="e6b" exercise="3" step="2" />

### Step 3: 権限を付与

プラグインは API サービスを呼び出すため、その権限が必要です。「API permissions」を開き、「APIs my organization uses」タブ 1️⃣ で API サービスを検索 2️⃣、結果から選択 3️⃣ します。

![The 'API permissions' page of the application registered, with the side panel to grant new permissions. The 'APIs my organization uses' tab is selected and the list of applications shows 'My API Service' in the results.](../../assets/images/extend-m365-copilot-06/oauth-B11.png)

API サービス アプリが表示されたら "access_as_user" 権限を選択し、「Add permission」をクリックします。

![The side panel to select and add a permission to the application registered. The 'access_as_user' permission is selected and highlighted, together with the 'Add permission' button.](../../assets/images/extend-m365-copilot-06/oauth-B12.png)

<cc-end-step lab="e6b" exercise="3" step="3" />

## Exercise 4: API アプリ登録にプラグイン アプリ ID を追加

### Step 1: API サービス アプリにプラグイン アプリ ID を追加

API Service アプリが API Plugin アプリからのトークンを受け入れられるようにします。API Service のアプリ登録に戻り「Manifest」を開き、`knownClientApplications` 1️⃣ を探します。次のように Plugin アプリの Client ID を追加します。

~~~json
"knownClientApplications": [
    "<your-plugin-client-id>"
]
~~~

完了したら「Save」2️⃣ をクリックします。

![The page to edit the manifest of the application with the 'knownClientApplications' entry and the 'Save' button highlighted.](../../assets/images/extend-m365-copilot-06/oauth-C4.png)

<cc-end-step lab="e6b" exercise="4" step="1" />

## Exercise 5: Teams Developer Portal に OAuth 情報を登録

アプリは準備できましたが、Microsoft 365 側にはまだ情報がありません。シークレットをアプリ マニフェストに保存するのは安全ではないため、Teams Developer Portal で安全に管理します。ここでは OAuth クライアント アプリを登録し、Copilot がユーザー認証を行えるようにします。

### Step 1: 新しい OAuth クライアント登録を作成

[https://dev.teams.microsoft.com](https://dev.teams.microsoft.com){target=_blank} にアクセスし、「Tools」1️⃣ → 「OAuth client registration」2️⃣ を選択します。

![The UI of the Teams Developer Portal with 'Tools' and 'OAuth client registration' highlighted.](../../assets/images/extend-m365-copilot-06/oauth-C2.png)

「Register client」(まだ登録がない場合) または "+ New OAuth client registration" をクリックし、フォームに入力します。多くの項目はこれまで安全に保存してきた値です。

| フィールド | 値 |
| --- | --- |
| Name | 覚えやすい名前 |
| Base URL | API service Base URL |
| Restrict usage by org | "My organization only" を選択 |
| Restrict usage by app | "Any Teams app" を選択 |
| Client ID | **Plugin アプリ** の Client ID |
| Client secret | **Plugin アプリ** の client secret |
| Authorization endpoint | Authorization endpoint |
| Token endpoint | Token endpoint |
| Refresh endpoint | Token endpoint と同じ |
| API scope | API Service アプリの Scope |

![the page to register a new OAuth client in the Teams Developer Portal. There is a list of fields to configure the client registration settings.](../../assets/images/extend-m365-copilot-06/oauth-C3ab.png)

!!! Note "永続トンネル URL を作成しなかった場合..."
    ...Agents Toolkit でアプリを起動するたびに「Base URL」を新しいトンネル URL に更新する必要があります。

<cc-end-step lab="e6b" exercise="5" step="1" />

### Step 2: OAuth 登録 ID を保存

![The result of registering an OAuth client in the Teams Developer Portal. There is a box confirming the registration and providing a 'Registration ID' for reference.](../../assets/images/extend-m365-copilot-06/oauth-E1.png)

ポータルに OAuth クライアント登録 ID が表示されます。次のステップのために保存してください。

<cc-end-step lab="e6b" exercise="5" step="2" />

## Exercise 6: アプリケーション パッケージを更新

### Step 1: プラグイン ファイルを更新

Visual Studio Code で作業フォルダーを開き、**appPackage** フォルダー内の **trey-plugin.json** を開きます。ここには Copilot が必要とする OAS 外の情報が格納されています。

`Runtimes` 内の `auth` プロパティは `"None"` になっています。以下のように変更し、Copilot が Vault に保存された OAuth 設定を使用して認証するようにします。

~~~json
"auth": {
  "type": "OAuthPluginVault",
  "reference_id":  "${{OAUTH_CLIENT_REGISTRATION_ID}}"
},
~~~

続いて **env/.env.local** に次の行を追加します。

~~~text
OAUTH_CLIENT_REGISTRATION_ID=<registration id you saved in the previous exercise>
~~~

次回 API プラグインを起動してプロンプトを送ると、サインインを求められるはずです。ただし、まだアプリケーションを保護していないため、誰でもアクセス可能です。次のステップで、コードを更新してログイン トークンを検証し、"Avery Howard" ではなく実際の Microsoft 365 ユーザーとして API を呼び出すようにします。

<cc-end-step lab="e6b" exercise="6" step="1" />

## Exercise 7: アプリケーション コードを更新

### Step 1: JWT 検証ライブラリをインストール

作業ディレクトリで次のコマンドを実行します。

~~~sh
npm i jwt-validate
~~~

これで Entra ID トークンの検証に使用するライブラリがインストールされます。

!!! warning
    Microsoft は NodeJS 用の公式 Entra ID トークン検証ライブラリを提供していません。その代わりに [詳細ドキュメント](https://learn.microsoft.com/entra/identity-platform/access-tokens#validate-tokens){target=_blank} が公開されています。  
    [こちらの記事](https://www.voitanos.io/blog/validating-entra-id-generated-oauth-tokens/){target=_blank} も参考になります (著者: Microsoft MVP Andrew Connell)。  

    **本ラボでは [Waldek Mastykarz](https://github.com/waldekmastykarz){target=_blank} が開発した [コミュニティ提供ライブラリ](https://www.npmjs.com/package/jwt-validate){target=_blank} を使用します。MIT ライセンスのため自己責任で利用してください。**  

    公式ライブラリの進捗は [この GitHub Issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/6113){target=_blank} を追跡してください。

<cc-end-step lab="e6b" exercise="7" step="1" />

### Step 2: API 用の環境変数を追加

作業ディレクトリの **env** フォルダーで **env.local** を開き、次の行を追加します。

~~~text
API_APPLICATION_ID=<your-api-service-client-id>
API_TENANT_ID=<your-tenant-id>
~~~

Agents Toolkit 内でコードがこれらの値を使用できるように、ルートの **teamsapp.local.yml** も更新します。「Generate runtime environment variables」のコメントを探し、STORAGE_ACCOUNT_CONNECTION_STRING の下に追加します。

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

### Step 3: Identity サービスを更新

OAuth ログインでトークンは取得できるようになりましたが、コードでトークンを検証しないと安全ではありません。このステップでは、トークンを検証しユーザー情報を取得するコードを追加します。

**src/services** フォルダーの **IdentityService.ts** を開き、他の `import` 文と並べて次を追加します。

~~~typescript
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
~~~

`class Identity` の直後に次の行を追加します。

~~~typescript
    private validator: TokenValidator;
~~~

次に、以下のコメントを探します。

~~~typescript
// ** INSERT REQUEST VALIDATION HERE (see Lab E6) **
~~~

このコメントを次のコードで置き換えます。

```typescript
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
```

!!! Note "コードを読み解く"
    まず `Authorization` ヘッダーからトークンを取得しています。このヘッダーには "Bearer" と半角スペース、トークン本体が含まれるため `split(" ")` でトークンのみを抽出しています。  

    トークン検証に必要な Entra ID の署名キーを取得するため、最初のリクエストで `TokenValidator` を生成し、以降はキャッシュを利用します。  

    `ValidateTokenOptions` では以下を検証します。  
    * _audience_ が API Service アプリ URI と一致する  
    * _issuer_ が自テナントのセキュリティ トークン サービスである  
    * _scope_ が `"access_as_user"` である  

    トークンが有効であれば、ユーザー ID、氏名、メール アドレスが取得できます。これを用いて固定ユーザー "Avery Howard" の代わりに実際のユーザーとして処理します。

!!! Note "マルチテナント アプリの場合"
    上記コード内のコメントを参照し、マルチテナント用の設定を行ってください。

`userId` を取得した後、Consultant レコードを検索します。元のコードでは Avery Howard の ID がハードコードされていましたが、ここではログイン ユーザーの ID を使用し、存在しなければ新規 Consultant レコードを作成します。

初回実行時には既定のスキル、ロールなどを持つ新しい Consultant が作成されます。デモ用に変更したい場合は [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/){target=_blank} を使用してください。

![The Azure Storage Explorer in action while editing the Consultant table. The actual current user is highlighted.](../../assets/images/extend-m365-copilot-06/oauth-azure-storage-explorer.png)

プロジェクト割り当ては `Assignment` テーブルに保存され、プロジェクト ID と Consultant ID を参照します。

<cc-end-step lab="e6b" exercise="7" step="3" />

## Exercise 8: アプリケーションをテスト

テスト前に `appPackage\manifest.json` の manifest version を更新します。

1. `appPackage` フォルダーの `manifest.json` を開きます。  
2. `version` フィールドを見つけます。  
      ```json
   "version": "1.0.0"
   ```  
3. バージョン番号を小さい増分で上げます。例:  
      ```json
   "version": "1.0.1"
   ```  
4. ファイルを保存します。

### Step 1: アプリケーションを再起動

以前のラボからアプリが起動したままの場合は停止し、アプリケーション パッケージを再生成させます。

F5 でアプリを起動し、これまでと同様にインストールします。

プラグインに「What Trey projects am I assigned to?」と尋ねます。API 呼び出し許可の確認カードが表示されたら「Allow Once」をクリックします。

![Microsoft 365 Copilot showing a confirmation card asking if it is ok to call your API. There are buttons to 'Always allow', 'Allow once', or 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-01small.png)

次にログイン カードが表示されます。「Sign in to Trey」をクリックしてサインインします。初回はポップアップでログインと権限付与が必要ですが、以降はブラウザーにキャッシュされるため表示されない場合があります。

![Microsoft 365 Copilot showing a login card with a button to 'Sign in to Trey' and another one to 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-02small.png)

管理者がユーザーの同意を許可していない場合は次のように表示されます。  
![The Microsoft Entra popup dialog asking for an admin approval to consume the API.](../../assets/images/extend-m365-copilot-06/need-admin-approval.png)

この場合、管理者にプラグイン API 登録のグローバル同意を手動で付与してもらう必要があります。  
![The 'API permissions' page of the 'API Plugin' application registered in Microsoft Entra with the 'Grant admin consent ...' command highlighted.](../../assets/images/extend-m365-copilot-06/approval-admin.png)

ログイン カードが閉じると Copilot がプロンプトに応答します。データベースに追加されたばかりなので、まだプロジェクトには割り当てられていません。

![The response from the 'Trey Genie' agent when the actual user doesn't have any assigned project.](../../assets/images/extend-m365-copilot-06/oauth-run-03bsmall.png)

「Add me to the Woodgrove project」と依頼してみましょう。必須情報が不足している場合、Copilot が確認を求めます。

![The response from the 'Trey Genie' agent when adding the current user to a project. If some information are missing, Copilot asks to provide them. Once all the information are provided, the agent provides a confirmation of the action.](../../assets/images/extend-m365-copilot-06/oauth-run-05.png)

続いて「What are my skills and what projects am I assigned to?」と尋ね、スキルと割り当てを確認します。

![](../../assets/images/extend-m365-copilot-06/oauth-run-07.png)

<cc-end-step lab="e6b" exercise="8" step="1" />

---8<--- "ja/e-congratulations.md"

ラボ E6b「手動セットアップで Entra ID 認証を追加」が完了しました!

次のステップとして、Copilot Connector をソリューションに追加してみませんか?

<cc-next url="../07-add-graphconnector" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/06b-add-authentication--ja" />