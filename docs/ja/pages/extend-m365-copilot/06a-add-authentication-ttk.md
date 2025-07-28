---
search:
  exclude: true
---
# ラボ E6a - OAuth を使用した Entra ID 認証の追加 (Agents Toolkit)

このラボでは、Entra ID を ID プロバイダーとして利用し、OAuth 2.0 を使用して API プラグインに認証を追加します。Agents Toolkit を設定し、Entra ID と Teams Developer Portal への登録を自動化する方法を学びます。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/1IhyztqkuJo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認できます。</div>
            <div class="note-box">
            📘 <strong>Note:</strong>    このラボは前回の Lab E5 を基にしています。すでに Lab E5 を完了している場合は、同じフォルダーで作業を続けてください。まだの場合は、<a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a>
    のソリューション フォルダーをコピーして使用してください。  
    このラボの完成版は <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END" target="_blank">src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END</a> フォルダーにあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## 演習 1: ローカル Agents Toolkit 設定の更新

この演習では、Agents Toolkit の構成ファイルを変更し、Entra ID にアプリケーションを登録し、その情報を Teams Developer Portal の「Vault」に配置するよう指示します。

### 手順 1: Entra ID アプリ マニフェストの追加

作業フォルダーのルートに **aad.manifest.json** という新しいファイルを作成し、次の内容をコピーします。

```json
{
    "id": "${{AAD_APP_OBJECT_ID}}",
    "appId": "${{AAD_APP_CLIENT_ID}}",
    "name": "Trey-Research-OAuth-aad",
    "accessTokenAcceptedVersion": 2,
    "signInAudience": "AzureADMyOrg",
    "optionalClaims": {
        "idToken": [],
        "accessToken": [
            {
                "name": "idtyp",
                "source": null,
                "essential": false,
                "additionalProperties": []
            }
        ],
        "saml2Token": []
    },
    "oauth2Permissions": [
        {
            "adminConsentDescription": "Allows Copilot to access the Trey Research API on the user's behalf.",
            "adminConsentDisplayName": "Access Trey Research API",
            "id": "${{AAD_APP_ACCESS_AS_USER_PERMISSION_ID}}",
            "isEnabled": true,
            "type": "User",
            "userConsentDescription": "Allows Copilot to access the Trey Research API on your behalf.",
            "userConsentDisplayName": "Access Trey Research API",
            "value": "access_as_user"
        }
    ],
    "replyUrlsWithType": [
        {
           "url": "https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect",
           "type": "Web"
        }
    ],
    "identifierUris": [
        "api://${{AAD_APP_CLIENT_ID}}"
    ]
}
```

このファイルには、登録または更新する Entra ID アプリケーションの詳細が含まれています。`${{AAD_APP_CLIENT_ID}}` のようなトークンは、Agents Toolkit がアプリケーションをプロビジョニングするときに実際の値に置き換えられます。

!!! Note
    Entra ID は以前「Azure Active Directory」と呼ばれていました。"AAD" という参照は旧名称の Entra ID を指します。

<cc-end-step lab="e6a" exercise="1" step="1" />

### 手順 2: **teamsapp.local.yml** のファイル バージョン番号を更新

**teamsapp.local.yml** ファイルには、ソリューションをローカルで実行・デバッグする際の Agents Toolkit の指示が含まれています。この演習では、このファイルを更新します。

!!! info "teamsapp.local.yml は m365agents.local.yml に変更されました"
    新しい Agents Toolkit では、ツールキット関連タスク用のファイル名が `m365agents.local.yml` に変更されました。新しい Agents Toolkit でエージェントを作成した場合は、こちらのファイル名を変更します。このラボでは既存のエージェント プロジェクトを使用するため、リネームやリファクタリングは不要です。手順通りに進めてください。

!!! warning "yaml ではインデントが重要です"
    yaml ファイルの編集は、階層がインデントで表されるため注意が必要です。インデントが正しくないとラボが動作しません。疑問がある場合は、完成版ファイル [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END/teamsapp.local.yml){_target=blank} を参照してください。

これらのラボは、バージョン 1.5 を使用する少し古い Agents Toolkit で作成されました。ここではファイルをバージョン 1.7 に更新します。

まず 1 行目を次のスキーマ参照に置き換えます。

```yaml
# yaml-language-server: $schema=https://aka.ms/teams-toolkit/v1.7/yaml.schema.json
```

続いて 4 行目のバージョン番号を 1.7 に更新します。

```yaml
version: v1.7
```

<cc-end-step lab="e6a" exercise="1" step="2" />

### 手順 3: Entra ID アプリケーションをプロビジョニング

アプリケーションがユーザーを認証し、操作を許可するには、まず Entra ID に登録する必要があります。ここでは、まだ登録されていない場合にアプリ登録を追加します。

ファイル内の次の行を探します。

```yaml
provision:
  # Creates a Teams app
```
以下の yaml を `provision:` 行の直下に挿入します。可読性のため空行を入れても構いません。

```yaml
  # Creates a new Microsoft Entra app to authenticate users if
  # the environment variable that stores clientId is empty
  - uses: aadApp/create
    with:
      # Note: when you run aadApp/update, the Microsoft Entra app name will be updated
      # based on the definition in manifest. If you don't want to change the
      # name, make sure the name in Microsoft Entra manifest is the same with the name
      # defined here.
      name: trey-oauth-aad
      # If the value is false, the action will not generate client secret for you
      generateClientSecret: true
      # Authenticate users with a Microsoft work or school account in your
      # organization's Microsoft Entra tenant (for example, single tenant).
      signInAudience: AzureADMyOrg
    # Write the information of created resources into environment file for the
    # specified environment variable(s).
    writeToEnvironmentFile:
      clientId: AAD_APP_CLIENT_ID
      # Environment variable that starts with `SECRET_` will be stored to the
      # .env.{envName}.user environment file
      clientSecret: SECRET_AAD_APP_CLIENT_SECRET
      objectId: AAD_APP_OBJECT_ID
      tenantId: AAD_APP_TENANT_ID
      authority: AAD_APP_OAUTH_AUTHORITY
      authorityHost: AAD_APP_OAUTH_AUTHORITY_HOST
```

`signInAudience` を `AzureADMyOrg` に設定すると、Agents Toolkit は登録先の Entra ID テナント内だけで使用可能なシングル テナント アプリを作成します。他のテナント (顧客テナントなど) でも使用したい場合は `AzureADMultipleOrgs` を設定します。3 つのステップすべてで、前手順で作成した **aad.manifest.json** が使用されます。

また、このステップで複数の値が環境ファイルに書き込まれ、**aad.manifest.json** とアプリケーション パッケージに挿入されます。

<cc-end-step lab="e6a" exercise="1" step="3" />

### 手順 4: Entra ID アプリケーションを更新

**teamsapp.local.yml** 内の次の行を探します  
```yaml
  # Build Teams app package with latest env value
```

この行の前に次の yaml を挿入します。

```yaml
  - uses: oauth/register
    with:
      name: oAuth2AuthCode
      flow: authorizationCode
      appId: ${{TEAMS_APP_ID}}
      clientId: ${{AAD_APP_CLIENT_ID}}
      clientSecret: ${{SECRET_AAD_APP_CLIENT_SECRET}}
      # Path to OpenAPI description document
      apiSpecPath: ./appPackage/trey-definition.json
    writeToEnvironmentFile:
      configurationId: OAUTH2AUTHCODE_CONFIGURATION_ID

  - uses: oauth/update
    with:
      name: oAuth2AuthCode
      appId: ${{TEAMS_APP_ID}}
      clientId: ${{AAD_APP_CLIENT_ID}}
      # Path to OpenAPI description document
      apiSpecPath: ./appPackage/trey-definition.json
      configurationId: ${{OAUTH2AUTHCODE_CONFIGURATION_ID}}

  # Apply the Microsoft Entra manifest to an existing Microsoft Entra app. Will use the object id in
  # manifest file to determine which Microsoft Entra app to update.
  - uses: aadApp/update
    with:
      # Relative path to this file. Environment variables in manifest will
      # be replaced before apply to Microsoft Entra app
      manifestPath: ./aad.manifest.json
      outputFilePath: ./build/aad.manifest.${{TEAMSFX_ENV}}.json
```

`oauth/register` と `oauth/update` ステップはアプリケーションを Teams Developer Portal の Vault に登録し、Copilot が OAuth 2.0 Auth Code 認可フローに必要な詳細を取得できるようにします。`aadApp/update` ステップは **aad.manifest.json** にある詳細で Entra ID アプリケーション自体を更新します。

<cc-end-step lab="e6a" exercise="1" step="4" />

### 手順 5: 出力パスの変更

新しい yaml スキーマでは出力パスが少し変更されています。次の行を探します。

```yaml
      outputJsonPath: ./appPackage/build/manifest.${{TEAMSFX_ENV}}.json
```

これを次の行に置き換えます。

```yaml
      outputFolder: ./appPackage/build
```

<cc-end-step lab="e6a" exercise="1" step="5" />

### 手順 6: Entra ID の値をアプリケーション コードで利用可能にする

次の行を探します。

```yaml
deploy:
  # Install development tool(s)
  - uses: devTool/install
    with:
      func:
        version: ~4.0.5530
        symlinkDir: ./devTools/func
    # Write the information of installed development tool(s) into environment
    # file for the specified environment variable(s).
    writeToEnvironmentFile:
      funcPath: FUNC_PATH
          # Generate runtime environment variables
  - uses: file/createOrUpdateEnvironmentFile
    with:
      target: ./.localConfigs
      envs:
        STORAGE_ACCOUNT_CONNECTION_STRING: ${{SECRET_STORAGE_ACCOUNT_CONNECTION_STRING}}
```

このコードはアプリ内で使用する環境変数を公開します。`STORAGE_ACCOUNT_CONNECTION_STRING` の下に次の行を追加してください。

```yaml
        AAD_APP_TENANT_ID: ${{AAD_APP_TENANT_ID}}
        AAD_APP_CLIENT_ID: ${{AAD_APP_CLIENT_ID}}
```

<cc-end-step lab="e6a" exercise="1" step="6" />

## 演習 2: 一般的な Agents Toolkit 設定の更新

**teamsapp-local.yml** がローカル デバッグ時の Agents Toolkit の動作を制御する一方、**teamsapp.yml**
は Microsoft Azure へのデプロイ時の動作を制御します。この演習では、このファイルを更新します。

!!! warning "yaml ではインデントが重要です"
    yaml ファイルの編集は、階層がインデントで表されるため注意が必要です。インデントが正しくないとラボが動作しません。疑問がある場合は、完成版ファイル [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END/teamsapp.yml){_target=blank} を参照してください。

### 手順 1: Entra ID アプリケーションをプロビジョニング

アプリケーションがユーザーを認証し、操作を許可するには、まず Entra ID に登録する必要があります。ここでは、まだ登録されていない場合にアプリ登録を追加します。

ファイル内の次の行を探します。

```yaml
provision:
  # Creates a Teams app
```
以下の yaml を `provision:` 行の直下に挿入します。可読性のため空行を入れても構いません。

```yaml
  # Creates a new Microsoft Entra app to authenticate users if
  # the environment variable that stores clientId is empty
  - uses: aadApp/create
    with:
      # Note: when you run aadApp/update, the Microsoft Entra app name will be updated
      # based on the definition in manifest. If you don't want to change the
      # name, make sure the name in Microsoft Entra manifest is the same with the name
      # defined here.
      name: Repairs-OAuth-aad
      # If the value is false, the action will not generate client secret for you
      generateClientSecret: true
      # Authenticate users with a Microsoft work or school account in your
      # organization's Microsoft Entra tenant (for example, single tenant).
      signInAudience: AzureADMyOrg
    # Write the information of created resources into environment file for the
    # specified environment variable(s).
    writeToEnvironmentFile:
      clientId: AAD_APP_CLIENT_ID
      # Environment variable that starts with `SECRET_` will be stored to the
      # .env.{envName}.user environment file
      clientSecret: SECRET_AAD_APP_CLIENT_SECRET
      objectId: AAD_APP_OBJECT_ID
      tenantId: AAD_APP_TENANT_ID
      authority: AAD_APP_OAUTH_AUTHORITY
      authorityHost: AAD_APP_OAUTH_AUTHORITY_HOST
```

`signInAudience` を `AzureADMyOrg` に設定すると、Agents Toolkit は登録先の Entra ID テナント内だけで使用可能なシングル テナント アプリを作成します。他のテナント (顧客テナントなど) でも使用したい場合は `AzureADMultipleOrgs` を設定します。3 つのステップすべてで、前手順で作成した **aad.manifest.json** が使用されます。

また、このステップで複数の値が環境ファイルに書き込まれ、**aad.manifest.json** とアプリケーション パッケージに挿入されます。

<cc-end-step lab="e6a" exercise="2" step="1" />

### 手順 2: Teams Developer Portal Vault へのアプリ登録

**teamsapp.yml** 内の次の行を探します

```yaml
  # Validate using manifest schema
  # - uses: teamsApp/validateManifest
  #   with:
  #     # Path to manifest template
  #     manifestPath: ./appPackage/manifest.json

  # Build Teams app package with latest env value
```

最後の行の前に次を挿入します。

```yaml
  # Apply the Microsoft Entra manifest to an existing Microsoft Entra app. Will use the object id in
  # manifest file to determine which Microsoft Entra app to update.
  - uses: aadApp/update
    with:
      # Relative path to this file. Environment variables in manifest will
      # be replaced before apply to Microsoft Entra app
      manifestPath: ./aad.manifest.json
      outputFilePath: ./build/aad.manifest.${{TEAMSFX_ENV}}.json

  - uses: oauth/register
    with:
      name: oAuth2AuthCode
      flow: authorizationCode
      appId: ${{TEAMS_APP_ID}}
      clientId: ${{AAD_APP_CLIENT_ID}}
      clientSecret: ${{SECRET_AAD_APP_CLIENT_SECRET}}
      # Path to OpenAPI description document
      apiSpecPath: ./appPackage/trey-definition.json
    writeToEnvironmentFile:
      configurationId: OAUTH2AUTHCODE_CONFIGURATION_ID
```

<cc-end-step lab="e6a" exercise="2" step="2" />

## 演習 3: アプリケーション パッケージの更新

Agents Toolkit が Entra ID への登録を行ったので、次はアプリケーション パッケージを更新し、Copilot が認証を認識できるようにします。この演習では必要なファイルを更新します。

### 手順 1: Open API Specification ファイルの更新

Visual Studio Code で作業フォルダーを開き、**appPackage** フォルダー内の **trey-definition.json** を開きます。次の行を探します。

```json
    "paths": {
```

この行の前に次の JSON を挿入します。

```json
    "components": {
        "securitySchemes": {
            "oAuth2AuthCode": {
                "type": "oauth2",
                "description": "OAuth configuration for the Trey Research service",
                "flows": {
                    "authorizationCode": {
                        "authorizationUrl": "https://login.microsoftonline.com/${{AAD_APP_TENANT_ID}}/oauth2/v2.0/authorize",
                        "tokenUrl": "https://login.microsoftonline.com/${{AAD_APP_TENANT_ID}}/oauth2/v2.0/token",
                        "scopes": {
                            "api://${{AAD_APP_CLIENT_ID}}/access_as_user": "Access Trey Research API as the user"
                        }
                    }
                }
            }
        }
    },
```

これで API 呼び出し時に使用する新しいセキュリティ スキームが設定されます。

続いて各 API パスにこのスキームを追加します。各パスにある `responses` オブジェクトを探してください。

```json
    "responses": {
      ...
```

`responses` の前に次の JSON を挿入します (ファイル内に 5 箇所あります。すべて忘れずに追加してください)。

```json
    "security": [
        {
            "oAuth2AuthCode": []
        }
    ],
```

編集後は必ず保存してください。

<cc-end-step lab="e6a" exercise="3" step="1" />

### 手順 2: プラグイン ファイルの更新

**appPackage** フォルダーの **trey-plugin.json** を開きます。このファイルには、Open API Specification (OAS) ファイルに含まれていない Copilot が必要とする情報が保存されています。

`Runtimes` の下に `auth` プロパティがあり、`"None"` となっています。これは API が現在認証されていないことを示します。次のように変更し、Vault に保存した OAuth 設定を使用して Copilot が認証するようにします。

~~~json
  "auth": {
    "type": "OAuthPluginVault",
    "reference_id": "${{OAUTH2AUTHCODE_CONFIGURATION_ID}}"
  },
~~~

次のステップでは、アプリケーション コードを更新し、実際の Microsoft 365 ユーザーとして API にアクセスするようにします (現在は Microsoft の架空名ジェネレーターの名前 "Avery Howard" を使用しています)。

<cc-end-step lab="e6a" exercise="3" step="2" />

## 演習 4: アプリケーション コードの更新

### 手順 1: JWT 検証ライブラリのインストール

作業ディレクトリのコマンド ラインで次を実行します。

~~~sh
npm i jwt-validate
~~~

これにより、受信した Entra ID 承認トークンを検証するライブラリがインストールされます。

!!! warning
    Microsoft は NodeJS で Entra ID トークンを検証する正式なライブラリを提供していませんが、[こちらの詳細ドキュメント](https://learn.microsoft.com/entra/identity-platform/access-tokens#validate-tokens){target=_blank} に独自実装方法が示されています。また、[Microsoft MVP Andrew Connell](https://www.voitanos.io/pages/about/#whos-behind-voitanos){target=_blank} による [参考記事](https://www.voitanos.io/blog/validating-entra-id-generated-oauth-tokens/){target=_blank} もあります。

    **このラボでは、[Waldek Mastykarz](https://github.com/waldekmastykarz){target=_blank} 氏が作成した [コミュニティ提供ライブラリ](https://www.npmjs.com/package/jwt-validate){target=_blank} を使用します。このライブラリはガイダンスに従って作られていますが、Microsoft のサポート対象外で MIT ライセンスのため、自己責任でご使用ください。**
    
    サポート対象ライブラリの進捗を追跡する場合は、[この Github issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/6113){target=_blank} を参照してください。

<cc-end-step lab="e6a" exercise="4" step="1" />

### 手順 2: Identity サービスの更新

現時点で OAuth ログインは機能し、アクセス トークンは取得できますが、トークンを検証しない限りソリューションは安全ではありません。この手順では、トークンを検証し、ユーザー名や ID などの情報を抽出するコードを追加します。

**src/services** フォルダーの **IdentityService.ts** を開きます。  
ファイル冒頭の他の `import` 文と並べて次を追加します。

~~~typescript
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
~~~

次に、`class Identity` 宣言の直下に次の行を追加します。

~~~typescript
    private validator: TokenValidator;
~~~

以下のコメントを探します。

~~~typescript
// ** INSERT REQUEST VALIDATION HERE (see Lab E6) **
~~~

このコメントを次のコードに置き換えます。

~~~typescript
  // Try to validate the token and get user's basic information
  try {
      const { AAD_APP_CLIENT_ID, AAD_APP_TENANT_ID } = process.env;
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
        const entraJwksUri = await getEntraJwksUri(AAD_APP_TENANT_ID);
        this.validator = new TokenValidator({
            jwksUri: entraJwksUri
        });
        console.log ("Token validator created");
      }

      const options: ValidateTokenOptions = {
          allowedTenants: [AAD_APP_TENANT_ID],
          audience: `${AAD_APP_CLIENT_ID}`,
          issuer: `https://login.microsoftonline.com/${AAD_APP_TENANT_ID}/v2.0`,
          scp: ["access_as_user"]
      };

      // validate the token
      const validToken = await this.validator.validateToken(token, options);

      userId = validToken.oid;
      userName = validToken.name;
      userEmail = validToken.preferred_username;
      console.log(`Request ${this.requestNumber++}: Token is valid for user ${userName} (${userId})`);
  }
  catch (ex) {
      // Token is missing or invalid - return a 401 error
      console.error(ex);
      throw new HttpError(401, "Unauthorized");
  }
~~~

!!! Note "コードから学ぶ"
    新しいコードを確認してください。まず、HTTP リクエストの `Authorization` ヘッダーからトークンを取得します。このヘッダーには「Bearer」と半角スペース、そしてトークンが含まれるため、JavaScript の `split(" ")` でトークン部分のみを取得しています。

    また、認証が何らかの理由で失敗した場合は例外をスローし、Azure Function が適切なエラーを返します。

    その後、`jwks-validate` ライブラリ用のバリデーターを作成します。この呼び出しは Entra ID から最新の公開鍵を読み込むため、時間がかかる非同期処理です。

    続いて `ValidateTokenOptions` オブジェクトを設定します。このオブジェクトに基づき、トークンが Entra ID の署名鍵で署名されているだけでなく、以下も検証されます。

    * _audience_ が API サービスの app URI と一致すること (トークンがこの Web サービス用であることを保証)
    * _issuer_ が自テナントのセキュリティ トークン サービスであること
    * _scope_ がアプリ登録で定義された `"access_as_user"` と一致すること

    トークンが有効な場合、ライブラリはユーザーの一意 ID、名前、メールなどの「クレーム」を含むオブジェクトを返します。これにより、架空の "Avery Howard" を使用せずに実ユーザー情報を使用できます。

<cc-end-step lab="e6a" exercise="4" step="2" />

## 演習 5: アプリケーションのテスト

### 手順 1: アプリ マニフェストのバージョン番号を更新

テストの前に、`appPackage\manifest.json` でアプリ パッケージのマニフェスト バージョンを更新します。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` を開きます。  
2. JSON 内の `version` フィールドを探します。  
   ```json
   "version": "1.0.0"
   ```  
3. バージョン番号を小さくインクリメントします。例:  
   ```json
   "version": "1.0.1"
   ```  
4. ファイルを保存します。

!!! warning "jwt-validate パッケージのコンパイル問題"
    現在、jwt-validate パッケージは @types/jsonwebtoken パッケージで型エラーを出します。回避策として、プロジェクト ルートの tsconfig.json に `"skipLibCheck": true` を追加してください。この問題は将来のバージョンで修正される可能性がありますので、その際には不要になる場合があります。

<cc-end-step lab="e6a" exercise="5" step="1" />

### 手順 2: アプリケーションの (再) 起動

以前のラボからアプリがまだ実行中の場合は停止し、アプリケーション パッケージを再作成します。

その後、F5 キーを押して再度アプリを実行し、以前と同様にインストールします。

<cc-end-step lab="e6a" exercise="5" step="2" />

### 手順 3: 宣言型エージェントの実行

Microsoft 365 Copilot に戻り、Trey Research エージェントを選択します。  
「自分が担当している Trey のプロジェクトは何ですか？」と入力します。API を呼び出してよいか確認するカードが表示される場合があります。ここでは認証は行われていませんので、「Allow Once」をクリックして続行します。

![Microsoft 365 Copilot showing a confirmation card asking if it is ok to call your API. There are buttons to 'Always allow', 'Allow once', or 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-01small.png)

確認カードがログイン カードに置き換わります。  
「Sign in to Trey」をクリックしてサインインします。最初はログインと権限付与を求めるポップアップ ウィンドウが表示されます。以降はブラウザーが資格情報をキャッシュするため、表示されない可能性があります。

![Microsoft 365 Copilot showing a login card with a button to 'Sign in to Trey' and another one to 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-02small.png)

!!! tip "管理者承認が必要な場合"
    管理者がユーザーによる同意を許可していない場合、次のような画面が出ることがあります。

    ![The Microsoft Entra popup dialog asking for an admin approval to consume the API.](../../assets/images/extend-m365-copilot-06/need-admin-approval.png)

    これは、管理者がアプリへの権限付与を制限しているためです。この場合、管理者に依頼して、プラグイン API のアプリ登録に対して全ユーザーへのグローバル同意を手動で付与してもらいます。  
    Microsoft 365 管理センター / Identity / Applications / App Registrations でアプリを見つけ、「Grant admin consent ...」を実行します。

    ![The 'API permissions' page of the 'API Plugin' application registered in Microsoft Entra with the 'Grant admin consent ...' command highlighted.](../../assets/images/extend-m365-copilot-06/approval-admin.png)

ログイン カードが Copilot の応答に置き換わります。データベースに追加されたばかりなので、まだプロジェクトには割り当てられていません。

以前はユーザーが架空の "Avery Howard" にハードコーディングされていました。新しいコードが初めて実行されると、現在のユーザー ID が見つからないため、新しいコンサルタント レコードが作成されますが、まだどのプロジェクトにも割り当てられていません。

!!! note "ユーザー情報の更新"
    これはラボ用のため、新しいユーザー アカウントのスキルや所在地などはハードコードされています。変更したい場合は [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/){target=_blank} を使用して編集できます。

    ![The Azure Storage Explorer in action while editing the Consultant table. The actual current user is highlighted.](../../assets/images/extend-m365-copilot-06/oauth-azure-storage-explorer.png)
    
<cc-end-step lab="e6a" exercise="5" step="3" />

### 手順 4: プロジェクトに自分を追加

データベースに追加されたばかりなので、まだプロジェクトに割り当てられていません。プロジェクトの割り当ては `Assignment` テーブルに保存され、プロジェクト ID とアサインされたコンサルタント ID を参照します。  
「自分のスキルと担当しているプロジェクトは？」と聞くと、エージェントはプロジェクトが見つからないがスキルと役割を特定し、支援を申し出ます。

![The response from the 'Trey Genie' agent when the actual user doesn't have any assigned project.](../../assets/images/extend-m365-copilot-06/oauth-run-03bsmall.png)

「Woodgrove プロジェクトに自分を追加して」とエージェントに依頼します。必要な情報を忘れると、エージェントが確認のため質問します。

![The response from the 'Trey Genie' agent when adding the current user to a project. If some information are missing, Copilot asks to confirm them. Once all the information are provided, the agent provides a confirmation of the action.](../../assets/images/extend-m365-copilot-06/oauth-run-05.png)

不足している情報を提供すると、エージェントが再度確認し、処理を進めます。

![The response from the 'Trey Genie' agent when adding the current user to a project. If some information are missing, Copilot asks to confirm them. Once all the information are provided, the agent provides a confirmation of the action.](../../assets/images/extend-m365-copilot-06/oauth-run-06.png)

最後に確認すると、エージェントは適切な役割と工数であなたをプロジェクトに追加します。

![The response from the 'Trey Genie' agent after adding user to project](../../assets/images/extend-m365-copilot-06/oauth-run-07.png)

続いて、「自分のスキルと割り当てられているプロジェクトは何ですか？」と聞いて、スキルとプロジェクト割り当てを確認してみましょう。

<cc-end-step lab="e6a" exercise="5" step="4" />

---8<--- "ja/e-congratulations.md"

ラボ Ea6「Entra ID 認証を Agents Toolkit で追加」が完了しました！

何か面白いことに挑戦したいですか？ソリューションに Copilot Connector を追加してみましょう。

<cc-next url="../07-add-graphconnector" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/06a-add-authentication" />