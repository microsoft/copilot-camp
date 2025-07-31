---
search:
  exclude: true
---
# ラボ E6c - Entra ID 認証とシングル サインオンの追加

このラボでは、ユーザーが既存の Entra ID 資格情報で認証できるようにする Microsoft Entra ID SSO 認証を追加します。


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/1IhyztqkuJo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要をご覧ください。</div>
            <div class="note-box">
            📘 <strong>注意:</strong>   このラボは前回のラボ E5 を基にしています。ラボ E5 を完了している場合は、同じフォルダーで作業を続けられます。完了していない場合は、<a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a> のソリューション フォルダーをコピーして作業してください。  
    このラボの完成版ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06c-add-sso/trey-research-lab06c-END" target="_blank">/src/extend-m365-copilot/path-e-lab06c-add-sso/trey-research-lab06c-END</a> フォルダーにあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

!!! note
    完成版サンプルでは永続的な developer トンネルを使用しています。永続的な developer トンネルを使用していない場合は調整が必要です。エクササイズ 1 をご確認ください。 


このラボでは API を登録する際、後続の手順で使用するために Entra ID ポータルと Teams Developer Portal からいくつかの値を保存する必要があります。保存する値は次のとおりです。

~~~text
API Base URL: 
API's Entra ID application ID: 
API's Tenant ID: 
SSO Client registration: 
API ID URI: 
~~~

## エクササイズ 1: 永続的な developer トンネルをセットアップする (任意)

既定では、Agents Toolkit はプロジェクトを起動するたびに新しい developer トンネル (つまりローカルで実行中の API にアクセスするための新しい URL) を作成します。通常は Agents Toolkit が自動的に URL を更新するため問題ありませんが、このラボでは手動設定を行うため、デバッガーを開始するたびに Entra ID と Teams Developer Portal の URL を手動で更新する必要があります。そのため、URL が変わらない永続的な developer トンネルをセットアップすると便利です。

??? Note "永続的なトンネルを設定しない場合はこちら ▶▶▶"
    このエクササイズをスキップして、Agents Toolkit が提供する developer トンネルを使用しても構いません。プロジェクトを実行後、ターミナル タブ 1️⃣ で "Start local tunnel" ターミナル 2️⃣ を選択し、Forwarding URL 3️⃣ をコピーできます。この URL はプロジェクトを開始するたびに変わるため、アプリ登録の返信 URL (エクササイズ 2 ステップ 1) と Teams Developer Portal の URL (エクササイズ 5 ステップ 1) を手動で更新する必要があります。  
    ![Developer tunnel URL](../../assets/images/extend-m365-copilot-06/oauth-A0.png)

### ステップ 1: developer トンネル CLI のインストール

以下は developer トンネルをインストールするためのコマンドです。[Developer Tunnel の詳細な手順とダウンロード リンクはこちら](https://learn.microsoft.com/azure/developer/dev-tunnels/get-started){target=_blank} です。 

| OS | コマンド |
| --- | --- |
| Windows | `winget install Microsoft.devtunnel` |
| Mac OS | `brew install --cask devtunnel` |
| Linux | `curl -sL https://aka.ms/DevTunnelCliInstall | bash` |

!!! tip
    ファイル パスが更新されるよう、コマンド ラインを再起動する必要がある場合があります。

インストール後、ログインが必要です。Microsoft 365 アカウントでログインできます。

~~~sh
devtunnel user login
~~~

このラボを進める間、devtunnel コマンドは実行し続けてください。再起動が必要な場合は `devtunnel user login` コマンドを再実行します。

<cc-end-step lab="e6c" exercise="1" step="1" />

### ステップ 2: トンネルの作成とホスト

次に、Azure Functions のローカル ポート (7071) への永続的トンネルをセットアップします。以下のコマンドを使用し、必要に応じて "mytunnel" を任意の名前に置き換えてください。

~~~sh
devtunnel create mytunnel -a --host-header unchanged
devtunnel port create mytunnel -p 7071
devtunnel host mytunnel
~~~

コマンド ラインに接続情報が表示されます:

![The devtunnel running in a console window showing the hosting port, the connect via browser URL, and the URL to inspect network activity.](../../assets/images/extend-m365-copilot-06/devtunnel-output.png)

「Connect via browser」の URL をコピーし、"API Base URL" として保存します。

<cc-end-step lab="e6c" exercise="1" step="2" />

### ステップ 3: プロジェクトで動的に作成されるトンネルを無効化

ローカルでプロジェクトが実行中の場合は停止します。次に [\.vscode\tasks.json](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab06-add-auth/trey-research-lab06-END/.vscode/tasks.json){target=_blank} を編集し、"Start Teams App Locally" タスクを見つけます。"Start local tunnel" の依存関係をコメントアウトし、代わりに "Start Azurite emulator" の依存関係を追加します。結果は次のようになります。

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
<cc-end-step lab="e6c" exercise="1" step="3" />

### ステップ 4: server URL の手動上書き

**env/.env.local** を開き、`OPENAPI_SERVER_URL` の値を永続的トンネル URL に変更します。これは後続手順の構成で必要となる `API base URL` です。

<cc-end-step lab="e6c" exercise="1" step="4" />

## エクササイズ 2: API 用の Entra ID アプリケーションを登録する

### ステップ 1: 新しい Entra ID アプリ登録を追加

[Microsoft 365 管理センター](https://portal.office.com/AdminPortal/){target=_blank} から、または直接 [https://entra.microsoft.com/](https://entra.microsoft.com/){target=_blank} で Entra ID 管理センターを開きます。開発用テナントでログインしていることを確認してください。

「Identity」 1️⃣ ➡ 「Applications」 2️⃣ ➡ 「App registrations」 3️⃣ の順にクリックし、"+" 4️⃣ をクリックして新しいアプリ登録を追加します。

![The Microsoft Entra admin center showing the list of applications registered and the button to create a 'New regitration'.](../../assets/images/extend-m365-copilot-06/oauth-A2.png)

アプリケーションに "Trey API Service" などわかりやすい一意の名前を付けます 1️⃣。「Supported account types」では「Accounts in this organizational directory only (Microsoft only - single tenant)」を選択します 2️⃣。  

最後に「Register」 3️⃣ をクリックしてアプリケーションを登録します。

![The app registration page, where you can provide the application name, supported application types, and redirect URI. There is also the 'Register' button to select.](../../assets/images/extend-m365-copilot-06c/oauth-A4.png)

<cc-end-step lab="e6c" exercise="2" step="1" />

### ステップ 2: アプリ情報を安全な場所にコピー
`API's Entra ID application ID` となる Application ID (Client ID) 1️⃣ と `Directory (tenant) ID` 2️⃣ をコピーして保存します。これらは後続の構成で使用します。

![The app registration page, where you see overview to copy the Application ID](../../assets/images/extend-m365-copilot-06c/oauth-A5.png)

<cc-end-step lab="e6c" exercise="2" step="2" />


## エクササイズ 3: Teams Developer Portal で Microsoft Entra SSO クライアント ID を登録する

これで API は Microsoft Entra ID と連携しましたが、Microsoft 365 にはまだ認識されていません。追加の資格情報を要求することなく API を安全に接続するため、Teams Developer Portal に登録しましょう。

### ステップ 1: Teams Developer Portal で SSO クライアントを登録

[https://dev.teams.microsoft.com](https://dev.teams.microsoft.com){target=_blank} にアクセスします。「Tools」 1️⃣ ➡ 「Microsoft Entra SSO client ID registration」 2️⃣ を選択します。

![The Entra ID SSO config page in Teams developer portal](../../assets/images/extend-m365-copilot-06c/oauth-A6.png)

**Register client ID** を選択し、次の値を入力します。

| 項目 | 値 |
| --- | --- |
| Name | 後でわかりやすい名前 |
| Base URL| API base URL |
| Restrict usage by org | "My organization only" を選択 |
| Restrict usage by app | "Any Teams app" を選択 |
| Client (application) ID | API's Entra ID application ID |

![The Entra ID SSO config page in Teams developer portal with new registration details filled](../../assets/images/extend-m365-copilot-06c/oauth-A7.png)



**Save** を選択すると、**Microsoft Entra SSO registration ID** と **Application ID URI** が生成されます。  
これらを控えておき、プラグイン マニフェスト ファイルの SSO 有効化に使用します。

![Teams deveoper portal Entra SSO configuration](../../assets/images/extend-m365-copilot-06c/oauth-A8.png)

!!! Note "永続的トンネル URL を作成していない場合..."
    ...アプリケーションを Agents Toolkit で起動するたびに新しいトンネル URL に合わせて「Base URL」フィールドを更新する必要があります。

<cc-end-step lab="e6c" exercise="3" step="1" />


## エクササイズ 4: アプリケーション パッケージを更新する

### ステップ 1: プラグイン ファイルを更新

Visual Studio Code で作業フォルダーを開きます。**appPackage** フォルダー内の **trey-plugin.json** ファイルを開きます。ここには Open API Specification (OAS) ファイルに含まれていない Copilot が必要とする情報が格納されています。

`Runtimes` セクションに `auth` プロパティがあり、`"type"` が `"None"` になっています。これを以下のように変更し、Copilot に **Microsoft Entra SSO registration ID** を使用して認証するよう指示します。

~~~json
"auth": {
  "type": "OAuthPluginVault",
  "reference_id": "<Microsoft Entra SSO registration ID>"
},
~~~

<cc-end-step lab="e6c" exercise="4" step="1" />


## エクササイズ 5: API の Microsoft Entra アプリ登録を更新する

### ステップ 1: Application ID URI の更新 
- [Microsoft Entra 管理センター](https://entra.microsoft.com/){target=_blank} に戻り、API の Entra アプリ登録 (**Trey API Service**) を開きます。  
- **Expose an API** を開き、**Application ID URI** を追加/編集します。Teams Developer Portal で生成された **Application ID URI** を貼り付け、**Save** を選択します。

<cc-end-step lab="e6c" exercise="5" step="1" />


### ステップ 2: API Scope の追加

API への呼び出しを検証するには、API Scope を公開する必要があります。ここでは "access_as_user" というシンプルなスコープを設定します。

「Add a scope」 でスコープ名に "access_as_user" を入力します 1️⃣。残りのフィールドは次のように入力します。

| 項目 | 値 |
| --- | --- |
| Who can consent? | Admins and users |
| Admin consent display name | Access My API as the user |
| Admin consent description | Allows an API to access My API as a user |
| User consent display name | Access My API as you |
| User consent description | Allows an app to access My API as you |
| State | Enabled |

完了したら「Add Scope」 2️⃣ をクリックします。

![Access as user scope](../../assets/images/extend-m365-copilot-06c/oauth-A9.png)

<cc-end-step lab="e6c" exercise="5" step="2" />

### ステップ 3: 承認されたクライアント アプリの追加

同じ **Expose an API** ページで **Add a client application** 1️⃣ を選択し、Microsoft のエンタープライズ トークン ストアのクライアント ID `ab3be6b7-f5df-413d-ac2d-abf1e3fd9c0b` 2️⃣ を追加します。スコープを承認するため 3️⃣ を選択し、**Add application** 4️⃣ をクリックします。

![Add authorized client apps](../../assets/images/extend-m365-copilot-06c/oauth-A10.png)

<cc-end-step lab="e6c" exercise="5" step="3" />

### ステップ 4: 認証用リダイレクト URI

左側のナビゲーションで **Authentication** 1️⃣ ➡ **Add a platform** 2️⃣ ➡ **Web** 3️⃣ を選択します。 

![Add web platform](../../assets/images/extend-m365-copilot-06c/oauth-A11.png)

**Redirect URIs** に `https://teams.microsoft.com/api/platform/v1.0/oAuthConsentRedirect` を貼り付け 1️⃣、**Configure** 2️⃣ を選択します。

![Add web platform with Redirect URL](../../assets/images/extend-m365-copilot-06c/oauth-A12.png)

<cc-end-step lab="e6c" exercise="5" step="4" />

## エクササイズ 6: アプリケーション コードを更新する

### ステップ 1: JWT 検証ライブラリをインストール

作業ディレクトリでコマンド ラインを開き、次を実行します。

~~~sh
npm i jwt-validate
~~~

これで Entra ID 認証トークンを検証するライブラリがインストールされます。

!!! warning
    Microsoft は NodeJS 用の Entra ID トークン検証ライブラリを提供していませんが、代わりに [詳細なドキュメント](https://learn.microsoft.com/entra/identity-platform/access-tokens#validate-tokens){target=_blank} で独自実装方法を案内しています。[参考記事](https://www.voitanos.io/blog/validating-entra-id-generated-oauth-tokens/){target=_blank} も [Microsoft MVP Andrew Connell](https://www.voitanos.io/pages/about/#whos-behind-voitanos){target=_blank} によって提供されています。本ラボでは [Waldek Mastykarz](https://github.com/waldekmastykarz){target=_blank} による [コミュニティ提供ライブラリ](https://www.npmjs.com/package/jwt-validate){target=_blank} を使用します。このライブラリはガイダンスに従って作成されていますが、Microsoft によりサポートされておらず MIT License で提供されています。利用は自己責任でお願いします。

<cc-end-step lab="e6c" exercise="6" step="1" />

### ステップ 2: API 用環境変数を追加

作業ディレクトリの **env** フォルダー内 **.env.local** を開き、テナント ID と Application ID URI を追加します。

~~~text
APP_ID_URI=<Application ID URI>
API_TENANT_ID=<Directory (tenant) ID>
~~~

!!! Note "Application ID URI を手動生成する場合"
    Application ID URI が表示されない場合は、次の手順で一時的に作成してください:  
    1. [Base64 Decode and Encode](https://www.base64decode.org/) にアクセス  
    2. エクササイズ 3, ステップ 1 で生成された auth registration ID を貼り付けてデコード  
    3. デコード結果の 2 つ目の部分 (## 以降) を使用し `api://auth-<AuthConfigID_Decoded_SecondPart>` の形式で組み立てます 例: `api://auth-16cfcd90-803e-40ba-8106-356aa4927bb9`  
    ![Generating Application ID URI manually](../../assets/images/extend-m365-copilot-06c/oauth-A13.png)
  
Agents Toolkit で実行中のコード内でこれらの値を利用できるように、作業フォルダーのルートにある **teamsapp.local.yml** も更新します。"Generate runtime environment variables" のコメントを探し、STORAGE_ACCOUNT_CONNECTION_STRING の下に新しい値を追加します。

~~~yaml
        APP_ID_URI: ${{APP_ID_URI}}
        API_TENANT_ID: ${{API_TENANT_ID}}
~~~

完成した yaml は次のようになります。

~~~yaml
  - uses: file/createOrUpdateEnvironmentFile
    with:
      target: ./.localConfigs
      envs:
        STORAGE_ACCOUNT_CONNECTION_STRING: ${{SECRET_STORAGE_ACCOUNT_CONNECTION_STRING}},
        APP_ID_URI: ${{APP_ID_URI}}
        API_TENANT_ID: ${{API_TENANT_ID}}
~~~

<cc-end-step lab="e6c" exercise="6" step="2" />

### ステップ 3: Identity サービスの更新

この時点で SSO は機能し有効なアクセストークンが提供されますが、コードがトークンを検証しない限りセキュアではありません。このステップでは、トークンを検証しユーザー名や ID などの情報を抽出するコードを追加します。

**src/services** フォルダーの **IdentityService.ts** を開きます。  
ファイル冒頭の `import` 文に次を追加します。

~~~typescript
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
~~~

次に `class Identity` 文の直下に次の行を追加します。

~~~typescript
    private validator: TokenValidator;
~~~

以下のコメントを探します。

~~~typescript
// ** INSERT REQUEST VALIDATION HERE (see Lab E6) **
~~~

コメントを次のコードに置き換えます。

~~~typescript
// Try to validate the token and get user's basic information
try {
    const { APP_ID_URI, API_TENANT_ID } = process.env;
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

 
    const options: ValidateTokenOptions = {
                audience: APP_ID_URI, 
                issuer: `https://sts.windows.net/${API_TENANT_ID}/`,              
                scp: ["access_as_user"],
            
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

!!! Note "コードを読み解く"
    追加したコードを確認してみましょう。まず、`Authorization` ヘッダーからトークンを取得します。このヘッダーは "Bearer <トークン>" の形式なので、JavaScript の `split(" ")` でトークンのみを取り出しています。  

    認証が失敗した場合、例外をスローし Azure Function が適切なエラーを返す点にも注意してください。  

    次に `jwt-validate` ライブラリ用のバリデーターを作成します。この呼び出しは Entra ID から最新の秘密鍵を読み込むため非同期で時間がかかる場合があります。  

    その後 `ValidateTokenOptions` オブジェクトを設定します。このオブジェクトに基づき、ライブラリは以下を検証します:  

    * _audience_ が API サービス アプリ URI と一致すること  
    * _issuer_ がテナントのセキュリティ トークン サービスであること  
    * _scope_ が `"access_as_user"` と一致すること  

    トークンが有効な場合、ライブラリはユーザーの一意の ID、名前、メールなどのクレームを返します。これらを使用して、架空の "Avery Howard" ではなく実際のユーザー情報を利用します。

!!! Note "アプリがマルチテナントの場合"
    マルチテナント アプリでのトークン検証に関するコメントを上記コード内に記載しています。

`userId` を取得した後、コードは Consultant レコードを検索します。元のコードでは Avery Howard の ID がハードコーディングされていましたが、現在はログイン ユーザーの ID を使用し、データベースに存在しない場合は新しい Consultant レコードを作成します。

その結果、アプリを初めて起動すると、デフォルトのスキルやロールを持つ新しい Consultant がログイン ユーザー用に作成されるはずです。独自デモ用に変更したい場合は [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/){target=_blank} を使って編集できます。

![The Azure Storage Explorer in action while editing the Consultant table. The actual current user is highlighted.](../../assets/images/extend-m365-copilot-06/oauth-azure-storage-explorer.png)

プロジェクト割り当ては `Assignment` テーブルに保存され、Project ID と Consultant ID を参照しています。

<cc-end-step lab="e6c" exercise="6" step="3" />

### ステップ 4: ライブラリのバージョン問題の回避策

現時点では `jwt-validate` パッケージが `@types/jsonwebtoken` パッケージに対して型エラーを出します。回避策として、プロジェクト ルートの **tsconfig.json** を編集し `"skipLibCheck":true` を追加してください。この問題は将来のライブラリ バージョンで修正され、不要になる可能性があります。

<cc-end-step lab="e6c" exercise="6" step="4" />

## エクササイズ 7: アプリケーションをテストする

テスト前に `appPackage\manifest.json` ファイルの manifest バージョンを更新してください:

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` を開きます。

2. JSON の `version` フィールドを見つけます。現在は次のようになっています: 

```json
"version": "1.0.0"
```

3. バージョン番号を小さくインクリメントします。例:  

```json
"version": "1.0.1"
```

4. ファイルを保存します。

### ステップ 1: アプリケーションの起動 (または再起動)

アプリケーションを再起動し、Copilot アプリの Trey Genie を開きます。

プロンプト例: "What projects am I assigned to?"  
エージェントを許可すると、次のようにサインインを求められます (初回のみ)。

![Sign in button](../../assets/images/extend-m365-copilot-06c/oauth-A14.png)

サインイン ボタンを選択後、アプリケーションの API が現在のユーザーとしてアクセスすることを許可する必要があります。「Accept」を選択してください。

![Accept permission](../../assets/images/extend-m365-copilot-06c/oauth-A15.png)

これ以降、ユーザーはエージェントとのやり取りで毎回サインインする必要はありません。

![Single sign on](../../assets/images/extend-m365-copilot-06c/oauth-A16.gif)


<cc-end-step lab="e6c" exercise="7" step="1" />

---8<--- "ja/e-congratulations.md"

ラボ E6c、SSO の追加が完了しました!

何か面白いことを試してみませんか? ソリューションに Copilot Connector を追加してみましょう。

<cc-next url="../07-add-graphconnector" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/06c-add-sso" />