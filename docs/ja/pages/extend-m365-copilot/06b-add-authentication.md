---
search:
  exclude: true
---
# ラボ E6b - OAuth を使用した Entra ID 認証（手動セットアップ）

このラボでは、Entra ID をアイデンティティ プロバイダーとして利用し、OAuth 2.0 を使った認証を API プラグインに追加します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/1IhyztqkuJo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を確認できます。</div>
            <div class="note-box">
            📘 <strong>注意:</strong>   このラボは前のラボ E5 を基にしています。既にラボ E5 を完了している場合は、同じフォルダーで続けて作業できます。未完了の場合は <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a> からソリューション フォルダーをコピーして作業してください。  
    このラボの完成版ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06b-add-oauth/trey-research-lab06b-END" target="_blank">/src/extend-m365-copilot/path-e-lab06b-add-oauth/trey-research-lab06b-END</a> フォルダーにあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


!!! note
    このラボでは Entra ID に関する詳細なセットアップ手順が多数あります。  
    これらの手順を自動化する新しい Agents Toolkit が公開されていますので、近いうちにより簡素化したラボを提供する予定です。

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

## 演習 1: 永続的な開発者トンネルの設定（任意）

既定では、Agents Toolkit がプロジェクトを開始するたびに新しい開発者トンネルを作成するため、ローカルで実行中の API にアクセスする URL も毎回変わります。通常は Agents Toolkit が必要な場所を自動更新するため問題ありませんが、このラボでは手動設定を行うため、デバッガーを起動するたびに Entra ID と Teams Developer Portal の URL を手動で更新する必要があります。そのため、URL が変わらない永続的な開発者トンネルを設定しておくと便利です。

??? Note "永続トンネルを設定しない場合はこちら ▶▶▶"
    この演習をスキップして、Agents Toolkit が提供する開発者トンネルを使用してもかまいません。プロジェクトが実行中になったら、ターミナル 1️⃣ で “Start local tunnel” ターミナル 2️⃣ を選択し、Forwarding URL 3️⃣ をコピーします。この URL はプロジェクトを起動するたびに変更されるため、アプリ登録の Reply URL（演習 2 手順 1）と Teams Developer Portal の URL（演習 5 手順 1）を手動で更新する必要があります。  
    ![Developer tunnel URL](../../assets/images/extend-m365-copilot-06/oauth-A0.png)

### 手順 1: Developer Tunnel CLI のインストール

以下は Developer Tunnel をインストールするコマンドです。[Developer Tunnel の詳細手順とダウンロード リンクはこちら](https://learn.microsoft.com/azure/developer/dev-tunnels/get-started){target=_blank}。

| OS | コマンド |
| --- | --- |
| Windows | `winget install Microsoft.devtunnel` |
| Mac OS | `brew install --cask devtunnel` |
| Linux | `curl -sL https://aka.ms/DevTunnelCliInstall | bash` |

!!! tip
    `devtunnel` コマンドを使用する前に、パスを更新するためにコマンドラインを再起動する必要がある場合があります。

インストール後、ログインが必要です。Microsoft 365 アカウントでログインできます。

~~~sh
devtunnel user login
~~~

このラボを進める間は `devtunnel` コマンドを実行したままにしてください。再起動が必要な場合は、`devtunnel user login` を再度実行します。

<cc-end-step lab="e6b" exercise="1" step="1" />

### 手順 2: トンネルの作成とホスト

Azure Functions のローカル ポート（7071）への永続的なトンネルをセットアップします。下記コマンドは例として "mytunnel" を使用していますが、任意の名前に置き換えてください。

~~~sh
devtunnel create mytunnel -a --host-header unchanged
devtunnel port create mytunnel -p 7071
devtunnel host mytunnel
~~~

コマンド ラインに接続情報が表示されます。

![The devtunnel running in a console window showing the hosting port, the connect via browser URL, and the URL to inspect network activity.](../../assets/images/extend-m365-copilot-06/devtunnel-output.png)

“Connect via browser” の URL をコピーし、「API Base URL」として保存します。

<cc-end-step lab="e6b" exercise="1" step="2" />

### 手順 3: プロジェクトで動的トンネルを無効化

ローカルでプロジェクトが実行中の場合は停止します。その後 [\.vscode\tasks.json](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab06-add-auth/trey-research-lab06-END/.vscode/tasks.json){target=_blank} を編集し、"Start Teams App Locally" タスクを探します。依存関係 `"Start local tunnel"` をコメントアウトし、その代わり `"Start Azurite emulator"` を追加します。結果は次のようになります。

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

### 手順 4: サーバー URL の手動オーバーライド

**env/.env.local** を開き、`OPENAPI_SERVER_URL` の値を永続トンネルの URL に変更します。

<cc-end-step lab="e6b" exercise="1" step="4" />

## 演習 2: API 用の Entra ID アプリ登録

### 手順 1: 新しい Entra ID アプリ登録の追加

[Microsoft 365 Admin Center](https://portal.office.com/AdminPortal/){target=_blank} から、または直接 [https://entra.microsoft.com/](https://entra.microsoft.com/){target=_blank} で Entra ID 管理センターを開きます。開発テナントにログインしていることを確認してください。

「Identity」 1️⃣ → 「Applications」 2️⃣ → 「App registrations」 3️⃣ の順にクリックし、"+" 4️⃣ を選択して新しいアプリを登録します。

![The Microsoft Entra admin center showing the list of applications registered and the button to create a 'New regitration'.](../../assets/images/extend-m365-copilot-06/oauth-A2.png)

アプリケーション名に「My API Service」など一意でわかりやすい名前を入力 1️⃣。  
「Supported account types」は「Accounts in this organizational directory only (Microsoft only - single tenant)」を選択 2️⃣。  
「Redirect URI (optional)」で「Web」を選択し、開発者トンネルの URL を入力 3️⃣。

!!! Note "永続トンネル URL を作成していない場合..."
    プロジェクトを起動するたびに新しいトンネル URL に置き換える必要があります。

「Register」 4️⃣ をクリックします。

![The app registration page, where you can provide the application name, supported application types, and redirect URI. There is also the 'Register' button to select.](../../assets/images/extend-m365-copilot-06/oauth-A4.png)

<cc-end-step lab="e6b" exercise="2" step="1" />

### 手順 2: アプリ情報を安全な場所にコピー

「Application (client) ID」 1️⃣ と 「Directory (tenant) ID」 2️⃣ をコピーして保存します。次に 「Endpoints」 ボタン 3️⃣ をクリックしてフライアウトを開きます。

![The overview page of the application registered. There you can copy the Application ID and the Directory ID, as well as you can find the 'Endpoints' command.](../../assets/images/extend-m365-copilot-06/oauth-A5.png)

「OAuth 2.0 authorization endpoint (v2)」 1️⃣ と 「OAuth 2.0 token endpoint (v2)」 2️⃣ の URL をコピーし、同じ場所に保存します。

![The panel with the Endpoints of the application. The buttons to copy 'OAuth 2.0 authorization endpoint (v2)' and 'OAuth 2.0 token endpoint (v2)' are highlighted.](../../assets/images/extend-m365-copilot-06/oauth-A7.png)

<cc-end-step lab="e6b" exercise="2" step="2" />

### 手順 3: クライアント シークレットの作成

「Certificates & secrets」 1️⃣ → 「+ New client secret」 2️⃣ を選択します。シークレットに名前と有効期限を設定し *Add* をクリックします。シークレットはこのときのみ表示されるため、表示された値 3️⃣ を必ず保存してください。

![The 'Certificates &amp; secrets' page from which you can select to create a 'New client secret'.](../../assets/images/extend-m365-copilot-06/oauth-A11.png)

<cc-end-step lab="e6b" exercise="2" step="3" />

### 手順 4: API Scope の公開

API への呼び出しを検証するために、アクセス許可を表す API Scope が必要です。今回はシンプルに `access_as_user` というスコープを作成します。

「Expose an API」 1️⃣ へ移動し、「Application ID URI」 の横にある 「Add」 2️⃣ をクリックします。フライアウトで既定値 `api://<your application (client) ID>` のまま 「Save and continue」 3️⃣ をクリックします。

![The 'Expose an API' page of the application registered, with the side panel to set the application unique URI.](../../assets/images/extend-m365-copilot-06/oauth-A15.png)

「Add a scope」で Scope 名に `access_as_user` 1️⃣ を入力し、以下の値を設定します。

| フィールド | 値 |
| --- | --- |
| Who can consent? | Admins and users |
| Admin consent display name | Access My API as the user |
| Admin consent description | Allows an API to access My API as a user |
| User consent display name | Access My API as you |
| User consent description | Allows an app to access My API as you |
| State | Enabled |

完了したら 「Add Scope」 2️⃣ をクリックします。

![The 'Add a scope' side panel in the 'Expose an API' page of the application registered, with settings for scope name, who can consent the scope, the admin and user display name and description, and the state flag to enable or disable the scope.](../../assets/images/extend-m365-copilot-06/oauth-A17.png)

<cc-end-step lab="e6b" exercise="2" step="4" />

### 手順 5: API Scope の保存

作成したスコープをコピーし、「API Scope」として保存します。

![The 'Expose an API' page of the application registered, once the custom scope has been created with the button to copy the scope name highlighted.](../../assets/images/extend-m365-copilot-06/oauth-A17b.png)

<cc-end-step lab="e6b" exercise="2" step="5" />

## 演習 3: プラグイン用の Entra ID アプリ登録

API を登録したので、次はプラグイン自体を登録します。

!!! Note "2 つの Entra ID アプリ登録について"
    このラボは、既に API 用に登録されているアプリを持ち、それをエージェントにプラグインとして統合するケースを想定しています。そのため 2 つのアプリ登録を使用します。最初から API を作成する場合は、必ずしも 2 つのアプリ登録が必要とは限りません。単一のアプリ登録で実装する方法は [こちらの Learn モジュール](https://learn.microsoft.com/en-us/training/modules/copilot-declarative-agent-api-plugin-auth/5-exercise-integrate-api-plugin-oauth){target=_blank} を参照してください。

### 手順 1: プラグインの登録

「App registrations」に戻り、2 つ目のアプリを登録します。名前は「My API Plugin」 1️⃣、Supported account types は再度「Accounts in this organizational directory only」 2️⃣ を選択します。

「Redirect URL」 に `https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect` 3️⃣ を入力します。これは Teams が API Plugin アプリへのログイン完了を処理する場所です。

「Register」 4️⃣ をクリックします。

![The app registration page, where you can provide the application name, supported application types, and redirect URI. There is also the 'Register' button to select.](../../assets/images/extend-m365-copilot-06/oauth-B5.png)

先ほどと同様に「Overview」 ページでプラグイン アプリの Application (client) ID を保存します。

<cc-end-step lab="e6b" exercise="3" step="1" />

### 手順 2: クライアント シークレットの作成

同様にクライアント シークレットを作成し、「Plugin service client secret」として保存します。

<cc-end-step lab="e6b" exercise="3" step="2" />

### 手順 3: 権限の付与

プラグインが API Service を呼び出すための権限を付与します。「API permissions」 に移動し、「APIs my organization uses」 タブ 1️⃣ を選択して API Service を検索 2️⃣、検索結果から選択 3️⃣ します。

![The 'API permissions' page of the application registered, with the side panel to grant new permissions. The 'APIs my organization uses' tab is selected and the list of applications shows 'My API Service' in the results.](../../assets/images/extend-m365-copilot-06/oauth-B11.png)

API Service が表示されたら、`access_as_user` パーミッションを選択し「Add permission」をクリックします。

![The side panel to select and add a permission to the application registered. The 'access_as_user' permission is selected and highlighted, together with the 'Add permission' button.](../../assets/images/extend-m365-copilot-06/oauth-B12.png)

<cc-end-step lab="e6b" exercise="3" step="3" />

## 演習 4: API アプリ登録にプラグイン アプリ ID を追加

### 手順 1: API Service アプリにプラグイン アプリの ID を追加

API Service アプリが Plugin アプリからのトークン発行を許可する必要があります。API Service の App Registration に戻り、「Manifest」 を開き `knownClientApplications` 1️⃣ を探します。次のように Plugin アプリの Client ID を追加します。

~~~json
"knownClientApplications": [
    "<your-plugin-client-id>"
]
~~~

完了後、「Save」 2️⃣ をクリックします。

![The page to edit the manifest of the application with the 'knownClientApplications' entry and the 'Save' button highlighted.](../../assets/images/extend-m365-copilot-06/oauth-C4.png)

<cc-end-step lab="e6b" exercise="4" step="1" />

## 演習 5: Teams Developer Portal で OAuth 情報を登録

アプリは準備できましたが、Microsoft 365 側にはまだ情報がありません。シークレットをアプリ マニフェストに保存するのは安全ではないため、Teams では Teams Developer Portal に安全に保存する場所を用意しています。この演習では、Copilot がユーザーを認証できるように OAuth クライアント アプリケーションを登録します。

### 手順 1: 新しい OAuth クライアント登録の作成

[https://dev.teams.microsoft.com](https://dev.teams.microsoft.com){target=_blank} にアクセスし、「Tools」 1️⃣ → 「OAuth client registration」 2️⃣ を選択します。

![The UI of the Teams Developer Portal with 'Tools' and 'OAuth client registration' highlighted.](../../assets/images/extend-m365-copilot-06/oauth-C2.png)

「Register client」をクリック（既存がある場合は "+ New OAuth client registration"）し、フォームに入力します。いくつかのフィールドは前の演習で安全な場所に保存した値を使用します。

| フィールド | 値 |
| --- | --- |
| Name | 任意のわかりやすい名前 |
| Base URL | API service の Base URL |
| Restrict usage by org | "My organization only" を選択 |
| Restrict usage by app | "Any Teams app" を選択 |
| Client ID | **Plugin Application** の client ID |
| Client secret | **Plugin Application** の client secret |
| Authorization endpoint | Authorization endpoint |
| Token endpoint | Token endpoint |
| Refresh endpoint | Token endpoint |
| API scope | API Service アプリケーションの scope |

![the page to register a new OAuth client in the Teams Developer Portal. There is a list of fields to configure the client registration settings.](../../assets/images/extend-m365-copilot-06/oauth-C3ab.png)

!!! Note "永続トンネル URL を作成していない場合..."
    プロジェクトを起動するたびに「Base URL」を新しいトンネル URL に更新する必要があります。

<cc-end-step lab="e6b" exercise="5" step="1" />

### 手順 2: OAuth 登録 ID の保存

![The result of registering an OAuth client in the Teams Developer Portal. There is a box confirming the registration and providing a 'Registration ID' for reference.](../../assets/images/extend-m365-copilot-06/oauth-E1.png)

ポータルに OAuth クライアント登録 ID が表示されます。次の手順で使用するため保存します。

<cc-end-step lab="e6b" exercise="5" step="2" />

## 演習 6: アプリ パッケージの更新

### 手順 1: プラグイン ファイルの更新

Visual Studio Code で作業フォルダーを開きます。**appPackage** フォルダーの **trey-plugin.json** を開きます。ここには Open API Specification (OAS) ファイルに含まれていない Copilot 用の情報が格納されています。

`Runtimes` の下に `auth` プロパティがあり `type` が `"None"` となっています。以下のように書き換え、Copilot に Vault に保存した OAuth 設定を使うよう指示します。

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

次回 API プラグインを起動してプロンプトすると、サインインが求められるはずです。しかし現在はアプリが保護されていないため、インターネット上の誰でも呼び出せてしまいます。次のステップでコードを更新し、実際の Microsoft 365 ユーザーとして API にアクセスできるようにします。

<cc-end-step lab="e6b" exercise="6" step="1" />

## 演習 7: アプリケーション コードの更新

### 手順 1: JWT 検証ライブラリのインストール

作業ディレクトリで次のコマンドを実行します。

~~~sh
npm i jwt-validate
~~~

これにより Entra ID からの認可トークンを検証するライブラリがインストールされます。

!!! warning
    Microsoft は Node.js 用の公式 Entra ID トークン検証ライブラリを提供していません。代わりに [詳細ドキュメント](https://learn.microsoft.com/entra/identity-platform/access-tokens#validate-tokens){target=_blank} で独自実装方法を案内しています。Microsoft MVP の [Andrew Connell](https://www.voitanos.io/pages/about/#whos-behind-voitanos){target=_blank} による [記事](https://www.voitanos.io/blog/validating-entra-id-generated-oauth-tokens/){target=_blank} も参考になります。  

    **本ラボでは、[Waldek Mastykarz](https://github.com/waldekmastykarz){target=_blank} 氏が提供する [コミュニティ ライブラリ](https://www.npmjs.com/package/jwt-validate){target=_blank} を使用します。MIT License のため自己責任でご利用ください。**  

    公式ライブラリの進捗を追いたい場合は [この GitHub issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/6113){target=_blank} をご覧ください。

<cc-end-step lab="e6b" exercise="7" step="1" />

### 手順 2: API 用環境変数の追加

作業フォルダーの **env** の **env.local** に次の行を追加します。

~~~text
API_APPLICATION_ID=<your-api-service-client-id>
API_TENANT_ID=<your-tenant-id>
~~~

Agents Toolkit で実行されるコード内でこれらを使用できるよう、作業フォルダー直下の **teamsapp.local.yml** も更新します。「Generate runtime environment variables」というコメントを探し、`STORAGE_ACCOUNT_CONNECTION_STRING` の下に追加します。

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

### 手順 3: Identity Service の更新

この時点で OAuth ログインは動作し、有効なアクセストークンが取得できますが、トークンを検証しなければ安全ではありません。ここではトークンを検証し、ユーザー名や ID といった情報を抽出するコードを追加します。

**src/services** フォルダーの **IdentityService.ts** を開き、`import` 文の中に次を追加します。

~~~typescript
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
~~~

`class Identity` の直下に次の行を追加します。

~~~typescript
    private validator: TokenValidator;
~~~

次に

~~~typescript
// ** INSERT REQUEST VALIDATION HERE (see Lab E6) **
~~~

というコメントを下記コードに置き換えます。

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
    まず `Authorization` ヘッダーからトークンを取得します。このヘッダーは `"Bearer <トークン>"` 形式のため `split(" ")` でトークンのみを抽出しています。  
    認証に失敗した場合は例外をスローし、Azure Function が 401 エラーを返します。  

    その後、`jwt-validate` ライブラリ用のトークン バリデーターを作成します。この呼び出しは Entra ID の公開鍵を取得するため非同期で時間が掛かる場合があります。  

    `ValidateTokenOptions` では以下を検証します。  
    * audience が API Service アプリ URI と一致すること  
    * issuer がテナントの STS であること  
    * scope が `access_as_user` であること  

    トークンが有効であれば、ユーザーの ID・名前・メールなどのクレーム情報を取得できます。

!!! Note "アプリをマルチテナント化する場合"
    上記コード内のコメントを参照してください。

`userId` が取得できたら、それに対応する Consultant レコードを検索します。存在しなければ新しく作成します。

初回実行時にはデフォルトのスキルやロールを持つ Consultant が作成されます。デモ用に変更したい場合は [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/){target=_blank} で編集できます。

![The Azure Storage Explorer in action while editing the Consultant table. The actual current user is highlighted.](../../assets/images/extend-m365-copilot-06/oauth-azure-storage-explorer.png)

プロジェクト割り当ては `Assignment` テーブルに保存され、プロジェクト ID と Consultant ID を参照します。

<cc-end-step lab="e6b" exercise="7" step="3" />

## 演習 8: アプリケーションのテスト

アプリケーションをテストする前に、`appPackage\manifest.json` の manifest バージョンを更新します。

1. `appPackage` フォルダーにある `manifest.json` を開きます。  
2. `version` フィールドを見つけます。  
      ```json
   "version": "1.0.0"
   ```  
3. バージョン番号を小さくインクリメントします。例:  
      ```json
   "version": "1.0.1"
   ```  
4. 保存します。

### 手順 1: アプリケーションの再起動

前のラボからアプリが起動している場合は停止し、アプリ パッケージを再生成させます。その後 F5 を押して再度実行し、以前と同じようにインストールします。

プラグインに「What Trey projects am I assigned to?」と尋ねてみましょう。API 呼び出しの確認カードが表示される場合があります。ここでは認証は行われず、「Allow Once」をクリックして続行します。

![Microsoft 365 Copilot showing a confirmation card asking if it is ok to call your API. There are buttons to 'Always allow', 'Allow once', or 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-01small.png)

続いてログイン カードが表示されます。`Sign in to Trey` をクリックしてサインインします。最初はポップアップが表示されログインと権限付与を行います。以降はキャッシュにより表示されない場合があります。

![Microsoft 365 Copilot showing a login card with a button to 'Sign in to Trey' and another one to 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-02small.png)

管理者がユーザーによる同意を許可していない場合、以下のような画面が表示されることがあります。  
![The Microsoft Entra popup dialog asking for an admin approval to consume the API.](../../assets/images/extend-m365-copilot-06/need-admin-approval.png)

この場合、管理者に依頼して Plugin API 登録に対しグローバル同意を付与してもらう必要があります。  
![The 'API permissions' page of the 'API Plugin' application registered in Microsoft Entra with the 'Grant admin consent ...' command highlighted.](../../assets/images/extend-m365-copilot-06/approval-admin.png)

ログイン カードが Copilot の応答に置き換わります。データベースに追加されたばかりなので、まだプロジェクトには割り当てられていません。

![The response from the 'Trey Genie' agent when the actual user doesn't have any assigned project.](../../assets/images/extend-m365-copilot-06/oauth-run-03bsmall.png)

次に「Woodgrove プロジェクトに自分を追加して」と依頼してください。必須情報が不足している場合は Copilot が質問してきます。

![The response from the 'Trey Genie' agent when adding the current user to a project. If some information are missing, Copilot asks to provide them. Once all the information are provided, the agent provides a confirmation of the action.](../../assets/images/extend-m365-copilot-06/oauth-run-05.png)

続けて「What are my skills and what projects am I assigned to?」と尋ね、スキルとプロジェクト割り当てを確認します。

![](../../assets/images/extend-m365-copilot-06/oauth-run-07.png)

<cc-end-step lab="e6b" exercise="8" step="1" />

---8<--- "ja/e-congratulations.md"

ラボ E6b「OAuth を使用した Entra ID 認証（手動セットアップ）」が完了しました!

もっと挑戦してみませんか? Copilot コネクタをソリューションに追加してみましょう。

<cc-next url="../07-add-graphconnector" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/06b-add-authentication" />