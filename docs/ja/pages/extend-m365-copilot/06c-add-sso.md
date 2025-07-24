---
search:
  exclude: true
---
# ラボ E6c ― Entra ID 認証（シングルサインオン）の追加

このラボでは、Microsoft Entra ID SSO 認証を追加し、ユーザーが既存の Entra ID 資格情報で認証できるようにします。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/1IhyztqkuJo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を簡単に確認できます。</div>
            <div class="note-box">
            📘 <strong>注意事項:</strong>   このラボは前のラボ、ラボ E5 を基にして作成されています。もしラボ E5 を完了している場合は、同じフォルダーで作業を続けることができます。完了していない場合は、 <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a> からラボ E5 のソリューションフォルダーをコピーし、そちらで作業してください。
    このラボの完成したソリューションは、 <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06c-add-sso/trey-research-lab06c-END" target="_blank">/src/extend-m365-copilot/path-e-lab06c-add-sso/trey-research-lab06c-END</a> フォルダーにあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

!!! note
    完成したサンプルでは永続的な developer tunnel を使用しておりますので、永続的な developer tunnel を使用していない場合は調整が必要となります。Exercise 1 をご確認ください。


このラボでは、API を登録する際に、後の手順で使用するため Microsoft Entra ID ポータルおよび Teams Developer Portal からいくつかの値を保存する必要があります。保存する必要がある値は以下の通りです:

~~~text
API Base URL: 
API の Entra ID アプリケーション ID: 
API のテナント ID: 
SSO クライアント登録: 
API ID URI: 
~~~

## Exercise 1: 永続的な developer tunnel の設定（オプション）

デフォルトでは、Agents Toolkit はプロジェクトを開始するたびに新しい developer tunnel ― すなわちローカルで実行している API にアクセスするための新しい URL ― を作成します。通常、Agents Toolkit は必要な場所で自動的に URL を更新するため問題ありませんが、このラボは手動設定となるため、デバッガーを開始するたびに Entra ID および Teams Developer Portal 内の URL を手動で更新する必要があります。そこで、変化しない URL を持つ永続的な developer tunnel を設定することをお勧めします。

??? Note "永続的な tunnel を設定したくない場合はこちら ▶▶▶"
    Agents Toolkit が提供する developer tunnel をそのまま使用することも可能です。プロジェクトが実行されると、ターミナルタブ 1️⃣ から「Start local tunnel」ターミナル 2️⃣ を選択して Forwarding URL 3️⃣ をコピーすることで、この URL を取得できます。ただし、この URL はプロジェクト開始時に毎回変更されるため、アプリ登録の返信 URL（Exercise 2 ステップ 1）および Teams Developer Portal の URL（Exercise 5 ステップ 1）を手動で更新する必要があります。
    ![Developer tunnel URL](../assets/images/extend-m365-copilot-06/oauth-A0.png)

### Step 1: developer tunnel CLI のインストール

以下は developer tunnel をインストールするためのコマンドです。 [Developer Tunnel の詳細な手順およびダウンロードリンクはこちら](https://learn.microsoft.com/azure/developer/dev-tunnels/get-started){target=_blank} 

| OS | Command |
| --- | --- |
| Windows | `winget install Microsoft.devtunnel` |
| Mac OS | `brew install --cask devtunnel` |
| Linux | `curl -sL https://aka.ms/DevTunnelCliInstall | bash` |

!!! tip
    devtunnel コマンドが機能する前に、ファイルパスを更新するためにコマンドラインを再起動する必要がある場合があります。

インストールが完了したら、ログインする必要があります。Microsoft 365 アカウントを使用してログインできます。

~~~sh
devtunnel user login
~~~

ラボのエクササイズ中は devtunnel コマンドを実行し続けるようにしてください。再起動が必要な場合は、最後のコマンド `devtunnel user login` を再度実行してください。

<cc-end-step lab="e6c" exercise="1" step="1" />

### Step 2: tunnel の作成とホスト

次に、Azure Functions のローカルポート（7071）へ永続的な tunnel を設定する必要があります。
以下のコマンドを使用し、必要に応じて "mytunnel" の部分を自身の名前に置き換えてください。

~~~sh
devtunnel create mytunnel -a --host-header unchanged
devtunnel port create mytunnel -p 7071
devtunnel host mytunnel
~~~

コマンドラインには、以下のような接続情報が表示されます:

![コンソールウィンドウ上で稼働している devtunnel がホスティングポート、ブラウザでの接続用 URL、およびネットワークアクティビティを確認するための URL を表示している様子](../assets/images/extend-m365-copilot-06/devtunnel-output.png)

「Connect via browser」URL をコピーして、「API Base URL」として保存してください。

<cc-end-step lab="e6c" exercise="1" step="2" />

### Step 3: プロジェクト内で動的に作成される tunnel の無効化

ローカルでプロジェクトが実行中の場合は、停止してください。その後、 [\.vscode\tasks.json](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab06-add-auth/trey-research-lab06-END/.vscode/tasks.json){target=_blank} を編集し、「Start Teams App Locally」タスクを探します。そこで「Start local tunnel」の依存関係をコメントアウトし、代わりに「Start Azurite emulator」の依存関係を追加してください。変更後は以下のようになります:

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

### Step 4: サーバー URL の手動上書き

**env/.env.local** を開き、OPENAPI_SERVER_URL の値を永続的な tunnel URL に変更してください。これは後の手順で必要となる `API Base URL` です。

<cc-end-step lab="e6c" exercise="1" step="4" />

## Exercise 2: API 用の Microsoft Entra ID アプリケーションの登録

### Step 1: 新しい Entra ID アプリ登録の追加

[Microsoft 365 Admin center](https://portal.office.com/AdminPortal/){target=_blank} または直接 [https://entra.microsoft.com/](https://entra.microsoft.com/){target=_blank} から Entra ID 管理センターにアクセスしてください。開発用テナントにログインしていることをご確認ください。

管理センターに入ったら、まず「Identity」 1️⃣ をクリックし、次に「Applications」 2️⃣、さらに「App registrations」 3️⃣ をクリックしてください。その後、右上の「+」 4️⃣ をクリックして新しいアプリ登録を追加します。

![登録されているアプリケーション一覧と「New registration」を作成するボタンが表示される Microsoft Entra 管理センター](../assets/images/extend-m365-copilot-06/oauth-A2.png)

アプリケーションには「Trey API Service」 1️⃣ のような一意でわかりやすい名前を付けてください。「Supported account types」 の項目では、「Accounts in this organizational directory only (Microsoft only - single tenant)」 2️⃣ を選択します。 

その後、「Register」 3️⃣ をクリックしてアプリケーションを登録してください。

![アプリケーション名、サポートされるアプリケーションの種類、リダイレクト URI を入力するアプリ登録ページ。右下には「Register」ボタンがあります](../assets/images/extend-m365-copilot-06c/oauth-A4.png)

<cc-end-step lab="e6c" exercise="2" step="1" />

### Step 2: アプリケーション情報の安全な保存
アプリケーション ID（クライアント ID とも呼ばれる） 1️⃣ と、後の手順で必要となる `API の Entra ID アプリケーション ID` および `Directory (tenant) ID` 2️⃣ をコピーして安全な場所に保存してください。

![アプリ登録ページの概要が表示され、アプリケーション ID のコピー方法が示されています](../assets/images/extend-m365-copilot-06c/oauth-A5.png)

<cc-end-step lab="e6c" exercise="2" step="2" />


## Exercise 3: Teams Developer Portal に Microsoft Entra SSO クライアント ID を登録

これで API は Microsoft Entra ID を用いて設定されましたが、Microsoft 365 側には何も登録されていません。追加の資格情報を必要とせずに API との安全な接続を確保するため、Teams Developer Portal に登録しましょう。

### Step 1: Teams Developer Portal での SSO クライアント登録

[https://dev.teams.microsoft.com](https://dev.teams.microsoft.com){target=_blank} の Teams Developer Portal にアクセスしてください。「Tools」 1️⃣ を選択し、次に「Microsoft Entra SSO client ID registration」 2️⃣ を選んでください。

![Teams Developer Portal 内の Entra ID SSO 設定ページ](../assets/images/extend-m365-copilot-06c/oauth-A6.png)

**Register client ID** を選択し、各項目に値を入力してください。

| Field | Value |
| --- | --- |
| Name | 覚えやすい名前を選んでください |
| Base URL| API base URL|
| Restrict usage by org | 「My organization only」を選択 |
| Restrict usage by app | 「Any Teams app」を選択 |
| Client (application) ID | API の Entra ID アプリケーション ID |

![新規登録情報が入力された状態の Teams Developer Portal 内の Entra ID SSO 設定ページ](../assets/images/extend-m365-copilot-06c/oauth-A7.png)



**Save** を選択すると、**Microsoft Entra SSO registration ID** と **Application ID URI** が生成されます。
今後、SSO を有効にするためにプラグインのマニフェストファイルを設定する際にこれらを控えておいてください。

![Teams Developer Portal の Entra SSO 設定画面](../assets/images/extend-m365-copilot-06c/oauth-A8.png)

!!! Note "永続的な developer tunnel URL を作成していない場合..."
    ...アプリを Agents Toolkit で起動するたびに、「Base URL」フィールドを新しい tunnel URL に更新する必要があります。

<cc-end-step lab="e6c" exercise="3" step="1" />


## Exercise 4: アプリケーションパッケージの更新

### Step 1: Plugin ファイルの更新

Visual Studio Code で作業フォルダーを開いてください。**appPackage** フォルダー内の **trey-plugin.json** ファイルを開いてください。ここには Open API Specification (OAS) ファイルに含まれていない Copilot が必要とする情報が保存されています。

`Runtimes` の下に、現在 API が認証されていないことを示す `type` が `"None"` の `auth` プロパティがあります。これを、Vault に保存した **Microsoft Entra SSO registration ID** を用いて Copilot に認証させるため、以下のように変更してください。

~~~json
"auth": {
  "type": "OAuthPluginVault",
  "reference_id": "<Microsoft Entra SSO registration ID>"
},
~~~

<cc-end-step lab="e6c" exercise="4" step="1" />


## Exercise 5: API の Microsoft Entra アプリ登録の更新

### Step 1: Application ID URI の更新 
- 再度 [Microsoft Entra 管理センター](https://entra.microsoft.com/){target=_blank} に戻り、ここでは **Trey API Service** と呼んでいる API の Microsoft Entra アプリ登録を見つけてください。 
- 「Expose an API」を開き、**Application ID URI** を追加／編集してください。Teams Developer Portal で生成された全体の **Application ID URI** をこちらに貼り付け、**Save** を選んでください。

<cc-end-step lab="e6c" exercise="5" step="1" />


### Step 2: API Scope の追加

API への呼び出しを検証するためには、API Scope を公開する必要があります。これは API を呼び出す許可を表します。特定の操作ごとに非常に詳細な許可を設定することも可能ですが、ここでは "access_as_user" というシンプルなスコープを設定します。

「Add a scope」の下に、スコープ名として "access_as_user" を入力 1️⃣ してください。残りの項目は以下のように入力します:

| Field | Value |
| --- | --- |
| Who can consent? | Admins and users |
| Admin consent display name | Access My API as the user |
| Admin consent description | Allows an API to access My API as a user |
| User consent display name | Access My API as you |
| User consent description | Allows an app to access My API as you |
| State | Enabled |

入力が完了したら、"Add Scope" をクリック 2️⃣ してください。

![Access as user scope](../assets/images/extend-m365-copilot-06c/oauth-A9.png)

<cc-end-step lab="e6c" exercise="5" step="2" />

### Step 3: 認可済みクライアントアプリの追加

同じ「Expose an API」ページで **Add a client application** 1️⃣ を選び、Microsoft のエンタープライズトークンストアのクライアント ID `ab3be6b7-f5df-413d-ac2d-abf1e3fd9c0b` 2️⃣ を追加してください。許可するためにアクセススコープを 3️⃣ で選択し、最後に **Add application** 4️⃣ を選んでください。

![認可済みクライアントアプリの追加](../assets/images/extend-m365-copilot-06c/oauth-A10.png)

<cc-end-step lab="e6c" exercise="5" step="3" />

### Step 4: 認証用リダイレクト URI

左側のナビゲーションから **Authentication** 1️⃣ を選び、**Add a platform** 2️⃣、次に **Web** 3️⃣ を選択してください。 

![Web プラットフォームの追加](../assets/images/extend-m365-copilot-06c/oauth-A11.png)

**Redirect URIs** には `https://teams.microsoft.com/api/platform/v1.0/oAuthConsentRedirect` を 1️⃣ として貼り付け、**Configure** 2️⃣ を選択してください。

![リダイレクト URL を指定した Web プラットフォームの追加](../assets/images/extend-m365-copilot-06c/oauth-A12.png)

<cc-end-step lab="e6c" exercise="5" step="4" />

## Exercise 6: アプリケーションコードの更新

### Step 1: JWT 検証ライブラリのインストール

作業ディレクトリのコマンドラインから、以下のコマンドを入力してください:

~~~sh
npm i jwt-validate
~~~

これにより、受信した Microsoft Entra ID の認証トークンを検証するためのライブラリがインストールされます。

!!! warning
    Microsoft は NodeJS 用に Entra ID トークンを検証するサポートライブラリを提供しておらず、代わりに [こちらの詳細なドキュメント](https://learn.microsoft.com/entra/identity-platform/access-tokens#validate-tokens){target=_blank} で独自実装の方法が説明されています。[Microsoft MVP Andrew Connell](https://www.voitanos.io/pages/about/#whos-behind-voitanos){target=_blank} による [別の有用な記事](https://www.voitanos.io/blog/validating-entra-id-generated-oauth-tokens/){target=_blank} も参照可能です。このラボでは、[community によって提供されたライブラリ](https://www.npmjs.com/package/jwt-validate){target=_blank}（[Waldek Mastykarz](https://github.com/waldekmastykarz){target=_blank} 作成）を使用しています。このライブラリは上記ガイダンスに沿って作成されています。なお、このライブラリは Microsoft によるサポート対象ではなく、MIT ライセンスの下で提供されていますので、自己責任でご利用ください。

<cc-end-step lab="e6c" exercise="6" step="1" />

### Step 2: API 用の環境変数の追加

作業ディレクトリ内の **env** フォルダーにある **.env.local** を開き、API Service アプリのテナント ID およびアプリケーション ID URL のために以下の行を追加してください。

~~~text
APP_ID_URI=<Application ID URI>
API_TENANT_ID=<Directory (tenant) ID>
~~~

!!! Note "Application ID URI を手動生成する場合"
    もし Application ID URI が利用できない場合は、以下の手順に従って一時的に構築してください:
    [Base64 Decode and Encode](https://www.base64decode.org/) にアクセスし、
    Exercise 3, Step 1 で生成された auth registration ID をコピー＆ペーストしてデコードしてください。
    デコード後の値の 2 番目の部分（## の後）を使用して、アプリケーション ID URI を、たとえば api://auth-<AuthConfigID_Decoded_SecondPart> の形式で構築してください。例: api://auth-16cfcd90-803e-40ba-8106-356aa4927bb9
    ![Application ID URI を手動生成する様子](../assets/images/extend-m365-copilot-06c/oauth-A13.png)
  
Agents Toolkit 内でコードがこれらの値を利用できるように、作業ディレクトリのルートにある **teamsapp.local.yml** ファイルも更新してください。コメント "Generate runtime environment variables" を探し、STORAGE_ACCOUNT_CONNECTION_STRING の下に以下の新規値を追加してください:

~~~yaml
        APP_ID_URI: ${{APP_ID_URI}}
        API_TENANT_ID: ${{API_TENANT_ID}}
~~~

更新後の yaml ファイルは以下のようになります:

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

### Step 3: identity service の更新

この段階で、シングルサインオンは有効になり、正しいアクセストークンが発行されるはずですが、コードがトークンの有効性を検証していなければ安全とは言えません。このステップでは、トークンの検証およびユーザー名や ID などの情報抽出のためのコードを追加します。

作業ディレクトリ内の **src/services** フォルダーにある **IdentityService.ts** を開いてください。 
ファイル上部の他の `import` 文と合わせて、以下を追加してください:

~~~typescript
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
~~~

次に、`class Identity` 宣言直下に以下の行を追加してください:

~~~typescript
    private validator: TokenValidator;
~~~

その後、以下のコメントを探してください:

~~~typescript
// ** INSERT REQUEST VALIDATION HERE (see Lab E6) **
~~~

このコメントを以下のコードに置き換えてください:

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

!!! Note "コードの学習"
    新しく追加されたソースコードを確認してください。まず、HTTPs リクエスト内の `Authorization` ヘッダーからトークンを取得しています。このヘッダーには "Bearer" ワード、スペース、そしてトークンが含まれているため、JavaScript の `split(" ")` を使用してトークンのみを抽出しています。

    また、認証が何らかの理由で失敗した場合、コードは例外をスローし、Azure Functions が適切なエラーを返すようになっています。

    次に、`jwks-validate` ライブラリを用いて検証に使用する validator を作成しています。この呼び出しでは、Entra ID から最新の署名キーを非同期的に取得するため、時間がかかる可能性があります。

    さらに、`ValidateTokenOptions` オブジェクトを設定しています。このオブジェクトに基づき、ライブラリはトークンが Entra ID の署名キーで署名されているかどうかの検証に加え、以下を検証します:

    * _audience_ が API サービスアプリの URI と同一であること ― これにより、トークンが当該 web サービス用であることが確認されます

    * _issuer_ が当テナントのセキュリティートークンサービスから発行されていること

    * _scope_ がアプリ登録で定義されたスコープ `"access_as_user"` と一致すること

    トークンが有効であれば、ライブラリは内部にあった全ての "claims" を含むオブジェクトを返します。ここにはユーザーの一意な ID、名前、およびメールアドレスなどが含まれています。これらの値を使用して、架空の "Avery Howard" に依存しない形にしています。

!!! Note "マルチテナントアプリとして実装する場合"
    上記コード内のコメントをご確認の上、マルチテナントアプリ用のトークン検証方法についてもご参考ください。

コードが `userId` を取得した後は、そのユーザーに対して Consultant レコードを検索します。元のコードでは Avery Howard の ID がハードコーディングされていましたが、現在はログインしたユーザーの ID を使用し、データベースに見つからなかった場合は新たに Consultant レコードを作成します。

その結果、アプリを初回起動すると、ログインしたユーザー用にデフォルトのスキルやロール等を持った新規 Consultant が作成されるはずです。独自のデモに変更したい場合は、[Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/){target=_blank} を使用して変更することが可能です。

![Consultant テーブルの編集中に実際の現在のユーザーがハイライト表示されている Azure Storage Explorer の様子](../assets/images/extend-m365-copilot-06/oauth-azure-storage-explorer.png)

プロジェクトのアサインメントは `Assignment` テーブルに保存され、プロジェクト ID と担当 Consultant のコンサルタント ID で紐付けられています。

<cc-end-step lab="e6c" exercise="6" step="3" />

### Step 4: ライブラリのバージョンの問題への対処

現時点では、`jwt-validate` パッケージが `@types/jsonwebtoken` パッケージの型定義エラーを発生させます。
この問題を回避するため、プロジェクトのルートにある **tsconfig.json** ファイルを編集し、 `"skipLibCheck": true` を追加してください。この問題は将来のバージョンで修正される見込みであり、ラボ実施時には不要となっている可能性があります。

<cc-end-step lab="e6c" exercise="6" step="4" />

## Exercise 7: アプリケーションのテスト

アプリケーションのテスト前に、`appPackage/manifest.json` ファイル内のアプリパッケージの manifest version を更新してください。以下の手順に従ってください:

1. プロジェクト内の `appPackage` フォルダーにある `manifest.json` ファイルを開きます。

2. JSON ファイル内の `version` フィールドを探してください。以下のようになっているはずです: 

```json
"version": "1.0.0"
```

3. バージョン番号を小さい数値にインクリメントしてください。例えば、以下のように変更します:  

```json
"version": "1.0.1"
```

4. 変更後、ファイルを保存してください。

### Step 1: アプリケーションの (再)起動

既にアプリケーションが実行中の場合は再起動し、Copilot アプリ内の Trey Genie を開いてください。

プロンプト - "What projects am I assigned to?" 
エージェントの許可後、以下のサインイン画面が一度だけ表示されます。

![サインインボタン](../assets/images/extend-m365-copilot-06c/oauth-A14.png)

サインインボタンを選択すると、アプリケーションの API が現在のユーザーとしてアクセスすることを許可するよう求められますので、「Accept」を選択して権限を与えてください。

![権限の許可](../assets/images/extend-m365-copilot-06c/oauth-A15.png)

これ以降、エージェントと対話する際に毎回サインインする必要がなくなります。

![シングルサインオン](../assets/images/extend-m365-copilot-06c/oauth-A16.gif)


<cc-end-step lab="e6c" exercise="7" step="1" />

---8<--- "ja/e-congratulations.md"

ラボ E6c ― SSO の追加 を完了されました！

何か面白いことに挑戦してみませんか？ 例えば、ソリューションに Copilot Connector を追加してみるのはいかがでしょうか？

<cc-next url="../07-add-graphconnector" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/06c-add-sso" />