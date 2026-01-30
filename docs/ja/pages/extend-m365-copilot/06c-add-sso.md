---
search:
  exclude: true
---
# ラボ E6c - Entra ID 認証とシングル サインオンの追加

このラボでは Microsoft Entra ID の SSO 認証を追加し、 ユーザー が既存の Entra ID 資格情報で認証できるようにします。


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/1IhyztqkuJo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認できます。</div>
            <div class="note-box">
            📘 <strong>注:</strong>   このラボは前の ラボ E5 を基にしています。ラボ E5 を完了済みの場合は、同じフォルダーで作業を続行できます。未完了の場合は、<a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a> のソリューション フォルダーをコピーして作業してください。  
    このラボの完成版ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06c-add-sso/trey-research-lab06c-END" target="_blank">/src/extend-m365-copilot/path-e-lab06c-add-sso/trey-research-lab06c-END</a> フォルダーにあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

!!! note
    完成サンプルでは永続的な developer トンネルを使用しています。永続的な developer トンネルを利用しない場合は調整が必要です。演習 1 を参照してください。 


このラボでは API を登録する際に、後続の手順で使用するため Entra ID ポータルおよび Teams Developer Portal からいくつかの値を保存する必要があります。保存する値は次のとおりです。

~~~text
API Base URL: 
API's Entra ID application ID: 
API's Tenant ID: 
SSO Client registration: 
API ID URI: 
~~~

## 演習 1: 永続的な developer トンネルを設定する (任意)

既定では Agents Toolkit はプロジェクトを開始するたびに新しい developer トンネル (つまりローカルで実行中の API にアクセスするための新しい URL) を作成します。通常は Agents Toolkit が必要な場所を自動的に更新するため問題ありませんが、このラボでは手動設定を行うため、デバッガーを開始するたびに Entra ID と Teams Developer Portal の URL を手動で更新する必要があります。そのため、URL が変わらない永続的な developer トンネルを設定すると便利です。

??? Note "永続トンネルを設定したくない場合はこちら ▶▶▶"
    Agents Toolkit が提供する developer トンネルをそのまま使用してもかまいません。プロジェクトが実行されたら、ターミナル タブ 1️⃣ の "Start local tunnel" ターミナル 2️⃣ から Forwarding URL 3️⃣ をコピーできます。  
    この URL はプロジェクトを開始するたびに変わるため、アプリ登録の Reply URL (演習 2 手順 1) と Teams Developer Portal の URL (演習 5 手順 1) を毎回手動で更新する必要があります。  
    ![Developer tunnel URL](../../assets/images/extend-m365-copilot-06/oauth-A0.png)

### 手順 1: developer tunnel CLI のインストール

以下のコマンド ラインで developer tunnel をインストールします。[Developer Tunnel の詳細な手順とダウンロード リンクはこちら](https://learn.microsoft.com/azure/developer/dev-tunnels/get-started){target=_blank}。

| OS | コマンド |
| --- | --- |
| Windows | `winget install Microsoft.devtunnel` |
| Mac OS | `brew install --cask devtunnel` |
| Linux | `curl -sL https://aka.ms/DevTunnelCliInstall | bash` |

!!! tip
    `devtunnel` コマンドが動作するよう、コマンド ラインを再起動する必要がある場合があります。

インストールが完了したらログインします。Microsoft 365 アカウントでログインできます。

~~~sh
devtunnel user login
~~~

このラボの演習を行っている間は、`devtunnel` コマンドを実行したままにしておいてください。再起動が必要になった場合は `devtunnel user login` を再実行します。

<cc-end-step lab="e6c" exercise="1" step="1" />

### 手順 2: トンネルの作成とホスト

続いて、Azure Functions のローカル ポート (7071) に対する永続的なトンネルを設定します。以下のコマンドで "mytunnel" 部分を任意の名前に置き換えてください。

~~~sh
devtunnel create mytunnel -a --host-header unchanged
devtunnel port create mytunnel -p 7071
devtunnel host mytunnel
~~~

コマンド ラインには接続情報が表示されます。

![The devtunnel running in a console window showing the hosting port, the connect via browser URL, and the URL to inspect network activity.](../../assets/images/extend-m365-copilot-06/devtunnel-output.png)

「Connect via browser」URL をコピーして、「API Base URL」として保存します。

<cc-end-step lab="e6c" exercise="1" step="2" />

### 手順 3: プロジェクトで動的トンネルを無効化

ローカルでプロジェクトが実行中の場合は停止します。[\.vscode\tasks.json](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab06-add-auth/trey-research-lab06-END/.vscode/tasks.json){target=_blank} を編集し、"Start Teams App Locally" タスクを探します。"Start local tunnel" 依存関係をコメントアウトし、代わりに "Start Azurite emulator" 依存関係を追加します。結果は次のようになります。

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

### 手順 4: サーバー URL を手動で上書き

**env/.env.local** を開き、`OPENAPI_SERVER_URL` の値を永続的トンネルの URL に変更します。これは後続の構成で必要となる `API base URL` です。

<cc-end-step lab="e6c" exercise="1" step="4" />

## 演習 2: API 用の Entra ID アプリケーションを登録する

### 手順 1: 新しい Entra ID アプリ登録を追加

[Microsoft 365 Admin center](https://portal.office.com/AdminPortal/){target=_blank} もしくは直接 [https://entra.microsoft.com/](https://entra.microsoft.com/){target=_blank} から Entra ID 管理センターに移動します。開発テナントでログインしていることを確認してください。

画面で "Identity" 1️⃣、"Applications" 2️⃣、"App registrations" 3️⃣ を順に選択し、"+" 4️⃣ をクリックして新しいアプリ登録を追加します。

![The Microsoft Entra admin center showing the list of applications registered and the button to create a 'New regitration'.](../../assets/images/extend-m365-copilot-06/oauth-A2.png)

アプリケーション名に "Trey API Service" など一意でわかりやすい名前を入力 1️⃣。  
"Supported account types" では "Accounts in this organizational directory only (Microsoft only - single tenant)" を選択 2️⃣。  

最後に "Register" 3️⃣ をクリックしてアプリケーションを登録します。

![The app registration page, where you can provide the application name, supported application types, and redirect URI. There is also the 'Register' button to select.](../../assets/images/extend-m365-copilot-06c/oauth-A4.png)

<cc-end-step lab="e6c" exercise="2" step="1" />

### 手順 2: アプリ情報を安全な場所にコピー

`API's Entra ID application ID` となる Application ID (Client ID) 1️⃣ と、`Directory (tenant) ID` 2️⃣ をコピーして後で使用できるようメモします。

![The app registration page, where you see overview to copy the Application ID](../../assets/images/extend-m365-copilot-06c/oauth-A5.png)

<cc-end-step lab="e6c" exercise="2" step="2" />


## 演習 3: Teams Developer Portal で Microsoft Entra SSO クライアント ID を登録する

これで API は Microsoft Entra ID で設定されましたが、Microsoft 365 側ではまだ何も認識していません。追加の資格情報なしで API を安全に接続できるよう、Teams Developer Portal で登録を行います。

### 手順 1: Teams Developer Portal で SSO クライアントを登録

[https://dev.teams.microsoft.com](https://dev.teams.microsoft.com){target=_blank} にアクセスし、"Tools" 1️⃣、"Microsoft Entra SSO client ID registration." 2️⃣ を選択します。

![The Entra ID SSO config page in Teams developer portal](../../assets/images/extend-m365-copilot-06c/oauth-A6.png)

**Register client ID** を選択し、以下の値を入力します。

| フィールド | 値 |
| --- | --- |
| Name | 後でわかりやすい名前 |
| Base URL| API base URL |
| Restrict usage by org | "My organization only" を選択 |
| Restrict usage by app | "Any Teams app" を選択 |
| Client (application) ID | API's Entra ID application ID |

![The Entra ID SSO config page in Teams developer portal with new registration details filled](../../assets/images/extend-m365-copilot-06c/oauth-A7.png)



**Save** を選択すると、**Microsoft Entra SSO registration ID** と **Application ID URI** が生成されます。これらをメモして、プラグイン マニフェスト ファイルの構成に使用します。

![Teams deveoper portal Entra SSO configuration](../../assets/images/extend-m365-copilot-06c/oauth-A8.png)

!!! Note "永続的 developer トンネル URL を作成しなかった場合..."
    アプリケーションを Agents Toolkit で開始するたびに新しいトンネル URL に更新し、Teams Developer Portal の "Base URL" フィールドを手動で更新する必要があります。

<cc-end-step lab="e6c" exercise="3" step="1" />


## 演習 4: アプリケーション パッケージを更新する

### 手順 1: プラグイン ファイルの更新

Visual Studio Code で作業フォルダーを開き、 **appPackage** フォルダー内の **trey-plugin.json** を開きます。このファイルには Open API Specification (OAS) に含まれない、Copilot が必要とする情報が格納されています。

`Runtimes` の下に `auth` プロパティがあり `type` が `"None"` になっています。これを以下のように変更し、Copilot に **Microsoft Entra SSO registration ID** を使って認証するよう指示します。

~~~json
"auth": {
  "type": "OAuthPluginVault",
  "reference_id": "<Microsoft Entra SSO registration ID>"
},
~~~

<cc-end-step lab="e6c" exercise="4" step="1" />


## 演習 5: API の Microsoft Entra アプリ登録を更新する

### 手順 1: Application ID URI の更新 
- [Microsoft Entra admin center](https://entra.microsoft.com/){target=_blank} に戻り、API の Entra アプリ登録 (**Trey API Service**) を開きます。  
- **Expose an API** を開き、**Application ID URI** を追加/編集します。Teams Developer Portal で生成された **Application ID URI** を貼り付け **Save** を選択します。

<cc-end-step lab="e6c" exercise="5" step="1" />


### 手順 2: API Scope を追加

API への呼び出しを検証するために、API Scope を公開する必要があります。今回はシンプルに "access_as_user" というスコープを作成します。

"Add a scope" でスコープ名に "access_as_user" を入力 1️⃣。残りのフィールドを次のように入力します。

| フィールド | 値 |
| --- | --- |
| Who can consent? | Admins and users |
| Admin consent display name | Access My API as the user |
| Admin consent description | Allows an API to access My API as a user |
| User consent display name | Access My API as you |
| User consent description | Allows an app to access My API as you |
| State | Enabled |

入力後 "Add Scope" 2️⃣ をクリックします。

![Access as user scope](../../assets/images/extend-m365-copilot-06c/oauth-A9.png)

<cc-end-step lab="e6c" exercise="5" step="2" />

### 手順 3: Authorized client apps を追加

同じ **Expose an API** ページで **Add a client application** 1️⃣ を選択し、Microsoft のエンタープライズ トークン ストアのクライアント ID `ab3be6b7-f5df-413d-ac2d-abf1e3fd9c0b` を入力 2️⃣。`access_as_user` スコープを選択して承認 3️⃣ し、**Add application** 4️⃣ を選択します。

![Add authorized client apps](../../assets/images/extend-m365-copilot-06c/oauth-A10.png)

<cc-end-step lab="e6c" exercise="5" step="3" />

### 手順 4: 認証の Redirect URI

左ナビゲーションで **Authentication** 1️⃣ を選択し、**Add a platform** 2️⃣、**Web** 3️⃣ を選択します。 

![Add web platform](../../assets/images/extend-m365-copilot-06c/oauth-A11.png)

**Redirect URIs** に `https://teams.microsoft.com/api/platform/v1.0/oAuthConsentRedirect` を貼り付け 1️⃣、**Configure** 2️⃣ を選択します。

![Add web platform with Redirect URL](../../assets/images/extend-m365-copilot-06c/oauth-A12.png)

<cc-end-step lab="e6c" exercise="5" step="4" />

## 演習 6: アプリケーション コードを更新する

### 手順 1: JWT 検証ライブラリをインストール

作業ディレクトリで以下を実行します。

~~~sh
npm i jwt-validate
~~~

これにより Entra ID 認証トークンを検証するライブラリがインストールされます。

!!! warning
    Microsoft は Node.js 向けの Entra ID トークン検証ライブラリを正式には提供していません。代わりに [詳細なドキュメント](https://learn.microsoft.com/entra/identity-platform/access-tokens#validate-tokens){target=_blank} を参照して自分で実装する必要があります。  
    参考記事として [Andrew Connell 氏による記事](https://www.voitanos.io/blog/validating-entra-id-generated-oauth-tokens/){target=_blank} もあります。  
    本ラボでは [Waldek Mastykarz 氏](https://github.com/waldekmastykarz){target=_blank} が提供する [コミュニティ ライブラリ](https://www.npmjs.com/package/jwt-validate){target=_blank} を使用します。MIT ライセンスで提供され、Microsoft のサポート対象外であるため自己責任でご利用ください。

<cc-end-step lab="e6c" exercise="6" step="1" />

### 手順 2: API 用の環境変数を追加

作業ディレクトリの **env** フォルダーにある **.env.local** を開き、テナント ID と Application ID URI の行を追加します。

~~~text
APP_ID_URI=<Application ID URI>
API_TENANT_ID=<Directory (tenant) ID>
~~~

!!! Note "Application ID URI を手動で生成する場合"
    Application ID URI が表示されない場合は、一時的に以下の手順で作成できます。  
    [Base64 Decode and Encode](https://www.base64decode.org/) にアクセスし、演習 3 手順 1 で生成した auth registration ID を貼り付けてデコードします。  
    デコード結果の後半 (## 以降) を使用して `api://auth-<AuthConfigID_Decoded_SecondPart>` の形式で Application ID URI を構築します。例: `api://auth-16cfcd90-803e-40ba-8106-356aa4927bb9`  
    ![Generating Application ID URI manually](../../assets/images/extend-m365-copilot-06c/oauth-A13.png)
  
これらの値を Agents Toolkit で実行中のコード内で使用できるよう、作業フォルダーのルートにある **teamsapp.local.yml** ファイルも更新します。"Generate runtime environment variables" というコメントを探し、STORAGE_ACCOUNT_CONNECTION_STRING の下に新しい値を追加します。

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

### 手順 3: identity service を更新

現時点で SSO は動作し有効なアクセストークンを提供しますが、トークンが有効かどうかをコード側で検証しなければ安全とは言えません。この手順ではトークンを検証し、ユーザー 名や ID などの情報を抽出するコードを追加します。

**src/services** フォルダーの **IdentityService.ts** を開きます。  
ファイル冒頭の `import` 群に次を追加します。

~~~typescript
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
~~~

次に `class Identity` 宣言の直下に以下を追加します。

~~~typescript
    private validator: TokenValidator;
~~~

そして次のコメントを探します。

~~~typescript
// ** INSERT REQUEST VALIDATION HERE (see Lab E6) **
~~~

このコメントを次のコードで置き換えます。

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
    追加したコードではまず `Authorization` ヘッダーからトークンを取得します。このヘッダーは "Bearer" + 空白 + トークン の形式なので、JavaScript の `split(" ")` を使用してトークンだけを抽出します。  

    認証に失敗した場合は例外をスローし、Azure Function から適切なエラーを返します。  

    続いて `jwt-validate` ライブラリを使うためのバリデーターを生成します。この呼び出しは Entra ID から最新の署名キーを取得するため非同期で時間がかかる場合があります。  

    さらに `ValidateTokenOptions` オブジェクトで以下を検証します。  
    * _audience_ が API サービス アプリ URI と一致すること  
    * _issuer_ が自テナントのセキュリティ トークン サービスであること  
    * _scope_ が `"access_as_user"` と一致すること  

    トークンが有効であれば、ユーザー の一意 ID、名前、メールなどのクレームを取得できます。これらを使用して、架空の "Avery Howard" の代わりに実際の ユーザー 情報を利用します。

!!! Note "アプリがマルチテナントの場合"
    マルチテナント アプリでトークンを検証する方法については、上記コード内のコメントを参照してください。

これで `userId` が取得できるため、コードは該当 ユーザー の Consultant レコードを検索します。元のコードでは Avery Howard の ID がハードコードされていましたが、今後はログイン ユーザー の ID を使用し、見つからない場合は新しい Consultant レコードを作成します。

初回実行時には、デフォルトのスキルやロールを持つ新しい Consultant が作成されるはずです。デモ用に変更したい場合は [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/){target=_blank} で編集できます。

![The Azure Storage Explorer in action while editing the Consultant table. The actual current user is highlighted.](../../assets/images/extend-m365-copilot-06/oauth-azure-storage-explorer.png)

プロジェクト割り当ては `Assignment` テーブルに保存され、プロジェクト ID と Consultant ID を参照します。

<cc-end-step lab="e6c" exercise="6" step="3" />

### 手順 4: ライブラリのバージョン問題を回避

現時点では `jwt-validate` パッケージが `@types/jsonwebtoken` パッケージに対して型エラーを発生させます。回避策としてプロジェクト ルートの **tsconfig.json** を編集し、`"skipLibCheck":true` を追加してください。将来のライブラリ バージョンでは不要になる可能性があります。

<cc-end-step lab="e6c" exercise="6" step="4" />

## 演習 7: アプリケーションをテストする

テストの前に、`appPackage\manifest.json` のマニフェスト バージョンを更新します。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` を開きます。  
2. `version` フィールドを探します。例:  

```json
"version": "1.0.0"
```

3. バージョン番号を小さくインクリメントします。例:  

```json
"version": "1.0.1"
```

4. 変更後、ファイルを保存します。

### 手順 1: アプリケーションを (再) 起動

アプリケーションを再起動し、Copilot アプリで Trey Genie を開きます。

プロンプト: 「自分が担当しているプロジェクトは何？」  
エージェントを許可すると、次のようにサインインを求められます (初回のみ)。

![Sign in button](../../assets/images/extend-m365-copilot-06c/oauth-A14.png)

サインイン ボタンを選択すると、アプリケーションの API が現在の ユーザー としてアクセスする許可を求めます。"Accept" を選択して許可してください。

![Accept permission](../../assets/images/extend-m365-copilot-06c/oauth-A15.png)

これ以降、 ユーザー は毎回サインインせずにエージェントとスムーズにやり取りできます。

![Single sign on](../../assets/images/extend-m365-copilot-06c/oauth-A16.gif)


<cc-end-step lab="e6c" exercise="7" step="1" />

---8<--- "ja/e-congratulations.md"

ラボ E6c、SSO の追加が完了しました!

次に面白いことを試してみませんか? ソリューションに Copilot Connector を追加してみましょう。

<cc-next url="../07-add-graphconnector" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/06c-add-sso" />