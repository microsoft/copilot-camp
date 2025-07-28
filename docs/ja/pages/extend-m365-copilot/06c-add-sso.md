---
search:
  exclude: true
---
# ラボ E6c - Entra ID 認証とシングル サインオンの追加

このラボでは、Microsoft Entra ID SSO 認証を追加し、ユーザーが既存の Entra ID 資格情報で認証できるようにします。


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/1IhyztqkuJo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認できます。</div>
            <div class="note-box">
            📘 <strong>注意:</strong>   このラボは前のラボ E5 を前提としています。ラボ E5 を完了している場合は、同じフォルダーで作業を続けてください。未完了の場合は、<a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a> のソリューション フォルダーをコピーして作業してください。
    このラボの完成版ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06c-add-sso/trey-research-lab06c-END" target="_blank">/src/extend-m365-copilot/path-e-lab06c-add-sso/trey-research-lab06c-END</a> フォルダーにあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

!!! note
    完成版サンプルでは永続的デベロッパー トンネルを使用しています。永続的トンネルを使用しない場合は調整が必要です。Exercise 1 を確認してください。


このラボでは API を登録する際に、後の手順で使用するために Entra ID ポータルと Teams Developer Portal からいくつかの値を保存する必要があります。保存する項目は次のとおりです。

~~~text
API Base URL: 
API's Entra ID application ID: 
API's Tenant ID: 
SSO Client registration: 
API ID URI: 
~~~

## Exercise 1: 永続的デベロッパー トンネルのセットアップ (任意)

既定では、Agents Toolkit はプロジェクトを起動するたびに新しいデベロッパー トンネル (つまりローカル API にアクセスするための新しい URL) を作成します。通常は問題ありませんが、このラボでは手動設定を行うため、デバッガーを開始するたびに Entra ID と Teams Developer Portal で URL を手動更新する必要があります。そのため、URL が変わらない永続的デベロッパー トンネルを設定すると便利です。

??? Note "永続的トンネルを設定したくない場合はこちら ▶▶▶"
    Agents Toolkit が提供するデベロッパー トンネルを使用しても構いません。プロジェクトを実行したら、ターミナル タブ 1️⃣ で "Start local tunnel" ターミナル 2️⃣ を選択し、Forwarding URL 3️⃣ をコピーします。この URL はプロジェクトを起動するたびに変わるため、アプリ登録のリダイレクト URL (Exercise 2 Step 1) と Teams Developer Portal の URL (Exercise 5 Step 1) を手動更新する必要があります。  
    ![Developer tunnel URL](../../assets/images/extend-m365-copilot-06/oauth-A0.png)

### Step 1: デベロッパー トンネル CLI のインストール

以下はデベロッパー トンネルをインストールするコマンドです。[Developer Tunnel の詳細な手順とダウンロード リンクはこちら](https://learn.microsoft.com/azure/developer/dev-tunnels/get-started){target=_blank}。

| OS | コマンド |
| --- | --- |
| Windows | `winget install Microsoft.devtunnel` |
| Mac OS | `brew install --cask devtunnel` |
| Linux | `curl -sL https://aka.ms/DevTunnelCliInstall | bash` |

!!! tip
    devtunnel コマンドを使用する前に、コマンド ラインを再起動してパスを更新する必要がある場合があります。

インストール後、ログインが必要です。Microsoft 365 アカウントでログインできます。

~~~sh
devtunnel user login
~~~

このラボを通して devtunnel コマンドを実行し続けてください。再起動が必要な場合は `devtunnel user login` を再度実行します。

<cc-end-step lab="e6c" exercise="1" step="1" />

### Step 2: トンネルの作成とホスト

次に、Azure Functions のローカル ポート (7071) への永続的トンネルを設定します。以下のコマンドで "mytunnel" を任意の名前に置き換えてください。

~~~sh
devtunnel create mytunnel -a --host-header unchanged
devtunnel port create mytunnel -p 7071
devtunnel host mytunnel
~~~

コマンド ラインに接続情報が表示されます。

![The devtunnel running in a console window showing the hosting port, the connect via browser URL, and the URL to inspect network activity.](../../assets/images/extend-m365-copilot-06/devtunnel-output.png)

"Connect via browser" の URL をコピーし、「API Base URL」として保存します。

<cc-end-step lab="e6c" exercise="1" step="2" />

### Step 3: プロジェクトで動的に作成されるトンネルを無効化

プロジェクトがローカルで実行中の場合は停止します。次に [.vscode\tasks.json](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab06-add-auth/trey-research-lab06-END/.vscode/tasks.json){target=_blank} を編集し、"Start Teams App Locally" タスクを探します。"Start local tunnel" の依存関係をコメントアウトし、代わりに "Start Azurite emulator" の依存関係を追加します。結果は以下のようになります。

```json
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
```
<cc-end-step lab="e6c" exercise="1" step="3" />

### Step 4: サーバー URL を手動で上書き

**env/.env.local** を開き、`OPENAPI_SERVER_URL` の値を永続的トンネル URL に変更します。これは後続手順の構成で必要な `API base URL` です。

<cc-end-step lab="e6c" exercise="1" step="4" />

## Exercise 2: API 用の Entra ID アプリ登録

### Step 1: Entra ID アプリ登録の追加

[Microsoft 365 Admin center](https://portal.office.com/AdminPortal/){target=_blank} から、または直接 [https://entra.microsoft.com/](https://entra.microsoft.com/){target=_blank} で Entra ID 管理センターを開きます。開発用テナントにサインインしていることを確認してください。

「Identity」1️⃣、「Applications」2️⃣、「App registrations」3️⃣ の順にクリックし、"+" 4️⃣ で新しいアプリ登録を追加します。

![The Microsoft Entra admin center showing the list of applications registered and the button to create a 'New regitration'.](../../assets/images/extend-m365-copilot-06/oauth-A2.png)

アプリケーションの名前に「Trey API Service」などの一意でわかりやすい名前を入力します 1️⃣。「Supported account types」では「Accounts in this organizational directory only (Microsoft only - single tenant)」を選択します 2️⃣。

「Register」3️⃣ をクリックします。

![The app registration page, where you can provide the application name, supported application types, and redirect URI. There is also the 'Register' button to select.](../../assets/images/extend-m365-copilot-06c/oauth-A4.png)

<cc-end-step lab="e6c" exercise="2" step="1" />

### Step 2: アプリ情報のコピー

`API's Entra ID application ID` となる Application ID (Client ID) 1️⃣ と `Directory (tenant) ID` 2️⃣ をコピーして保存します。

![The app registration page, where you see overview to copy the Application ID](../../assets/images/extend-m365-copilot-06c/oauth-A5.png)

<cc-end-step lab="e6c" exercise="2" step="2" />


## Exercise 3: Teams Developer Portal で Microsoft Entra SSO クライアント ID を登録

これで API は Entra ID に登録されましたが、Microsoft 365 側ではまだ認識されていません。追加資格情報なしで安全に API に接続できるように、Teams Developer Portal に登録しましょう。

### Step 1: Teams Developer Portal で SSO クライアントを登録

Teams Developer Portal ([https://dev.teams.microsoft.com](https://dev.teams.microsoft.com){target=_blank}) を開きます。「Tools」1️⃣、「Microsoft Entra SSO client ID registration」2️⃣ を選択します。

![The Entra ID SSO config page in Teams developer portal](../../assets/images/extend-m365-copilot-06c/oauth-A6.png)

**Register client ID** を選択し、次の値を入力します。

| 項目 | 値 |
| --- | --- |
| Name | 覚えやすい名前 |
| Base URL | API base URL |
| Restrict usage by org | "My organization only" を選択 |
| Restrict usage by app | "Any Teams app" を選択 |
| Client (application) ID | API's Entra ID application ID |

![The Entra ID SSO config page in Teams developer portal with new registration details filled](../../assets/images/extend-m365-copilot-06c/oauth-A7.png)



**Save** を選択すると、**Microsoft Entra SSO registration ID** と **Application ID URI** が生成されます。これらをメモしておき、プラグイン manifest ファイルを構成して SSO を有効にします。

![Teams deveoper portal Entra SSO configuration](../../assets/images/extend-m365-copilot-06c/oauth-A8.png)

!!! Note "永続的デベロッパー トンネル URL を使用していない場合..."
    ...アプリケーションを Agents Toolkit で起動するたびに、「Base URL」フィールドを新しいトンネル URL に更新する必要があります。

<cc-end-step lab="e6c" exercise="3" step="1" />


## Exercise 4: アプリケーション パッケージの更新

### Step 1: プラグイン ファイルを更新

Visual Studio Code で作業フォルダーを開きます。**appPackage** フォルダーの **trey-plugin.json** を開いてください。ここには Open API Specification (OAS) ファイルに含まれない、Copilot が必要とする情報が保存されています。

`Runtimes` の下に `auth` プロパティがあり、`"type"` が `"None"` になっています。これを次のように変更し、Copilot に **Microsoft Entra SSO registration ID** を使用して認証するよう伝えます。

```json
"auth": {
  "type": "OAuthPluginVault",
  "reference_id": "<Microsoft Entra SSO registration ID>"
},
```

<cc-end-step lab="e6c" exercise="4" step="1" />


## Exercise 5: API の Microsoft Entra アプリ登録を更新

### Step 1: Application ID URI の更新 
- [Microsoft Entra admin center](https://entra.microsoft.com/){target=_blank} に戻り、API の Entra アプリ登録 (**Trey API Service** として作成) を開きます。
- **Expose an API** を開き、**Application ID URI** を追加/編集します。Teams Developer Portal で生成された **Application ID URI** を貼り付け、**Save** を選択します。

<cc-end-step lab="e6c" exercise="5" step="1" />


### Step 2: API Scope の追加

API を呼び出す権限を表す Scope を公開する必要があります。ここでは "access_as_user" というシンプルな Scope を設定します。

「Add a scope」で Scope 名に "access_as_user" を入力し 1️⃣、以下の値を設定します。

| 項目 | 値 |
| --- | --- |
| Who can consent? | Admins and users |
| Admin consent display name | Access My API as the user |
| Admin consent description | Allows an API to access My API as a user |
| User consent display name | Access My API as you |
| User consent description | Allows an app to access My API as you |
| State | Enabled |

完了したら「Add Scope」2️⃣ をクリックします。

![Access as user scope](../../assets/images/extend-m365-copilot-06c/oauth-A9.png)

<cc-end-step lab="e6c" exercise="5" step="2" />

### Step 3: 承認済みクライアント アプリの追加

同じ **Expose an API** ページで **Add a client application** 1️⃣ を選択し、Microsoft のエンタープライズ トークン ストアのクライアント ID `ab3be6b7-f5df-413d-ac2d-abf1e3fd9c0b` 2️⃣ を入力します。Scope の承認に 3️⃣ をチェックし、**Add application** 4️⃣ を選択します。

![Add authorized client apps](../../assets/images/extend-m365-copilot-06c/oauth-A10.png)

<cc-end-step lab="e6c" exercise="5" step="3" />

### Step 4: 認証用リダイレクト URI

左ナビゲーションで **Authentication** 1️⃣ を開き、**Add a platform** 2️⃣、**Web** 3️⃣ を選択します。

![Add web platform](../../assets/images/extend-m365-copilot-06c/oauth-A11.png)

**Redirect URIs** に `https://teams.microsoft.com/api/platform/v1.0/oAuthConsentRedirect` を貼り付け 1️⃣、**Configure** 2️⃣ を選択します。

![Add web platform with Redirect URL](../../assets/images/extend-m365-copilot-06c/oauth-A12.png)

<cc-end-step lab="e6c" exercise="5" step="4" />

## Exercise 6: アプリケーション コードの更新

### Step 1: JWT 検証ライブラリのインストール

作業ディレクトリで次のコマンドを実行します。

~~~sh
npm i jwt-validate
~~~

これにより Entra ID 認証トークンを検証するライブラリがインストールされます。

!!! warning
    Microsoft は NodeJS 用の Entra ID トークン検証ライブラリを提供していません。代わりに [この詳細ドキュメント](https://learn.microsoft.com/entra/identity-platform/access-tokens#validate-tokens){target=_blank} で独自実装方法を案内しています。[参考記事](https://www.voitanos.io/blog/validating-entra-id-generated-oauth-tokens/){target=_blank} も Microsoft MVP の [Andrew Connell](https://www.voitanos.io/pages/about/#whos-behind-voitanos){target=_blank} から提供されています。このラボでは [Waldek Mastykarz](https://github.com/waldekmastykarz){target=_blank} 氏が作成した [コミュニティライブラリ](https://www.npmjs.com/package/jwt-validate){target=_blank} を使用します。このライブラリは MIT ライセンスであり、Microsoft のサポート対象外ですので自己責任でご利用ください。

<cc-end-step lab="e6c" exercise="6" step="1" />

### Step 2: API 用環境変数の追加

作業ディレクトリの **env** フォルダーにある **.env.local** を開き、以下を追加します。

~~~text
APP_ID_URI=<Application ID URI>
API_TENANT_ID=<Directory (tenant) ID>
~~~

!!! Note "Application ID URI を手動生成する場合"
    Application ID URI が表示されない場合は一時的に以下の手順で生成してください。  
    1. [Base64 Decode and Encode](https://www.base64decode.org/) にアクセス  
    2. Exercise 3 Step 1 で生成した auth registration ID を貼り付けてデコード  
    3. デコード結果の 2 つ目の部分 (## 以降) を使用して `api://auth-<AuthConfigID_Decoded_SecondPart>` 形式で Application ID URI を作成 (例: `api://auth-16cfcd90-803e-40ba-8106-356aa4927bb9`)  
    ![Generating Application ID URI manually](../../assets/images/extend-m365-copilot-06c/oauth-A13.png)
  
Agents Toolkit で実行されるコード内でこれらの値を使用できるよう、作業フォルダー直下の **teamsapp.local.yml** も更新します。"Generate runtime environment variables" コメントを探し、STORAGE_ACCOUNT_CONNECTION_STRING の下に次を追加します。

```yaml
        APP_ID_URI: ${{APP_ID_URI}}
        API_TENANT_ID: ${{API_TENANT_ID}}
```

完成形は次のようになります。

```yaml
  - uses: file/createOrUpdateEnvironmentFile
    with:
      target: ./.localConfigs
      envs:
        STORAGE_ACCOUNT_CONNECTION_STRING: ${{SECRET_STORAGE_ACCOUNT_CONNECTION_STRING}},
        APP_ID_URI: ${{APP_ID_URI}}
        API_TENANT_ID: ${{API_TENANT_ID}}
```

<cc-end-step lab="e6c" exercise="6" step="2" />

### Step 3: identity service の更新

この時点で SSO は動作し有効なアクセス トークンを提供しますが、コード側でトークンを検証しない限りセキュアではありません。ここではトークンを検証し、ユーザー名や ID を取得するコードを追加します。

**src/services** フォルダーの **IdentityService.ts** を開き、他の `import` 文と並んで次を追加します。

```typescript
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
```

`class Identity` 宣言直下に次を追加します。

```typescript
    private validator: TokenValidator;
```

次に、以下のコメントを探します。

```typescript
// ** INSERT REQUEST VALIDATION HERE (see Lab E6) **
```

コメントを次のコードに置き換えます。

```typescript
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
```

!!! Note "コードを読み解く"
    まず `Authorization` ヘッダーからトークンを取得します。このヘッダーは "Bearer" + 半角スペース + トークン という形式のため、`split(" ")` でトークン部分のみを抜き出しています。

    続いて `jwks-validate` ライブラリで使用する validator を作成します。Entra ID から最新の署名鍵を取得するため非同期処理となっています。

    `ValidateTokenOptions` では以下を検証します。  
    • audience: トークンが自分の Web サービス向けであること  
    • issuer: 自テナントのセキュリティ トークン サービスであること  
    • scope: `"access_as_user"` であること  

    トークンが有効であればユーザー ID・名前・メールなどのクレームを取得できます。

!!! Note "アプリをマルチテナント化する場合"
    上記コード内のコメントを参照してください。

`userId` を取得したら、該当ユーザーの Consultant レコードを検索します。見つからない場合は新規作成します。初回実行時、ログイン ユーザー用にスキルやロールがデフォルト設定で作成されます。独自のデモ用に変更したい場合は [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/){target=_blank} を使って編集できます。

![The Azure Storage Explorer in action while editing the Consultant table. The actual current user is highlighted.](../../assets/images/extend-m365-copilot-06/oauth-azure-storage-explorer.png)

プロジェクト割り当ては `Assignment` テーブルに保存され、Project ID と Consultant ID を参照します。

<cc-end-step lab="e6c" exercise="6" step="3" />

### Step 4: ライブラリ バージョン問題の回避策

現時点では `jwt-validate` パッケージが `@types/jsonwebtoken` に対して型エラーを出力します。回避策として **tsconfig.json** を開き `"skipLibCheck":true` を追加してください。ライブラリが更新された場合は不要になる可能性があります。

<cc-end-step lab="e6c" exercise="6" step="4" />

## Exercise 7: アプリケーションのテスト

テスト前に `appPackage\manifest.json` の manifest バージョンを更新します。

1. `appPackage` フォルダーの `manifest.json` を開きます。  
2. `version` フィールドを探します。  

```json
"version": "1.0.0"
```  

3. 少しインクリメントします。例:  

```json
"version": "1.0.1"
```  

4. 保存します。

### Step 1: アプリケーションの再起動

アプリケーションを再起動し、Copilot アプリで Trey Genie を開きます。

プロンプト: 「私が割り当てられているプロジェクトは何ですか？」

エージェントを許可すると、次のようにサインインを求められます (初回のみ)。

![Sign in button](../../assets/images/extend-m365-copilot-06c/oauth-A14.png)

サインイン ボタンを選択すると、API が現在のユーザーとしてアクセスする許可を求められるので **Accept** を選択します。

![Accept permission](../../assets/images/extend-m365-copilot-06c/oauth-A15.png)

これ以降、ユーザーは毎回サインインすることなくエージェントとスムーズに対話できます。

![Single sign on](../../assets/images/extend-m365-copilot-06c/oauth-A16.gif)


<cc-end-step lab="e6c" exercise="7" step="1" />

---8<--- "ja/e-congratulations.md"

このラボ E6c、SSO の追加を完了しました！

何か面白いことを試してみませんか? Copilot Connector をソリューションに追加してみましょう。

<cc-next url="../07-add-graphconnector" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/06c-add-sso" />