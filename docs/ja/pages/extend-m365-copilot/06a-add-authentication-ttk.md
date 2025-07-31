---
search:
  exclude: true
---
# ラボ E6a - Entra ID 認証を OAuth で追加 (Agents Toolkit)

このラボでは、Entra ID を ID プロバイダーとして利用し、OAuth 2.0 を使用して API プラグインに認証を追加します。Agents Toolkit を使用して Entra ID と Teams Developer Portal への登録を自動化する方法を学習します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/1IhyztqkuJo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を短時間で確認できます。</div>
            <div class="note-box">
            📘 <strong>注意:</strong>    本ラボは前のラボ E5 を基にしています。ラボ E5 を完了している場合は、同じフォルダーで作業を続けてください。未完了の場合は、<a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a> のソリューション フォルダーをコピーして作業してください。<br/>
    このラボの完成版ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END" target="_blank">src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END </a> フォルダーにあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## Exercise 1: ローカル Agents Toolkit 設定の更新

このエクササイズでは、Agents Toolkit の構成ファイルを変更し、Entra ID へのアプリ登録および Teams Developer Portal の「Vault」への情報格納を指示します。

### Step 1: Entra ID アプリ マニフェストの追加

作業フォルダーのルートに新しいファイル **aad.manifest.json** を作成し、以下の内容をコピーします。

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

このファイルには、登録または更新される Entra ID アプリケーションの詳細が含まれています。`${{AAD_APP_CLIENT_ID}}` などのトークンは、Agents Toolkit がアプリをプロビジョニングするときに実際の値に置き換えられます。

!!! Note
    Entra ID は以前「Azure Active Directory」と呼ばれていました。「AAD」の表記は旧名である Entra ID を指します。

<cc-end-step lab="e6a" exercise="1" step="1" />

### Step 2: **teamsapp.local.yml** のファイル バージョン番号を更新

**teamsapp.local.yml** ファイルには、ローカルでソリューションを実行およびデバッグするための Agents Toolkit の指示が含まれています。このエクササイズの残りではこのファイルを更新します。

!!! info "teamsapp.local.yml は m365agents.local.yml に変更"
    新しい Agents Toolkit では、ツールキット関連タスク用のファイル名が `m365agents.local.yml` に変更されました。新規のプロジェクトで作業している場合はこちらのファイル名になります。本ラボでは既存のエージェント プロジェクトを使用するため、名前の変更やリファクタリングは不要です。手順どおりに進めてください。

!!! warning "yaml のインデントは重要"
    yaml ファイルはインデントで階層を表すため、編集が難しいことがあります。インデントが正しくないとラボが動作しません。疑わしい場合は、完成版ファイル [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END/teamsapp.local.yml){_target=blank} を確認してください。

これらのラボは、バージョン 1.5 の Agents Toolkit を使用して記述されていました。このステップでは、ファイルをバージョン 1.7 に更新します。

まず最初の行を次のスキーマ参照に置き換えます。

```yaml
# yaml-language-server: $schema=https://aka.ms/teams-toolkit/v1.7/yaml.schema.json
```

次に 4 行目のバージョン番号を 1.7 に更新します。

```yaml
version: v1.7
```

<cc-end-step lab="e6a" exercise="1" step="2" />

### Step 3: Entra ID アプリケーションのプロビジョニング

アプリケーションがユーザーを認証し、承認を行うには、まず Entra ID にアプリ登録が必要です。このステップでは、まだ登録されていない場合にアプリ登録を追加します。

以下の行を探します:

```yaml
provision:
  # Creates a Teams app
```

`provision:` 行の直下に、次の yaml を挿入します（読みやすさのため空行を入れても構いません）。

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

`signInAudience` を `AzureADMyOrg` に設定すると、Agents Toolkit は登録された Entra ID テナント内でのみ利用可能なシングル テナント アプリを作成します。他のテナント（顧客テナントなど）でも利用できるようにする場合は、`AzureADMultipleOrgs` を設定します。3 つのステップすべてで、前ステップで作成した **aad.manifest.json** を使用します。

また、このステップではいくつかの値が環境ファイルに書き込まれ、それらは **aad.manifest.json** およびアプリケーション パッケージにも挿入されます。

<cc-end-step lab="e6a" exercise="1" step="3" />

### Step 4: Entra ID アプリケーションの更新

**teamsapp.local.yml** で次の行を探します  
```yaml
  # Build Teams app package with latest env value
```

この行の前に次の yaml を挿入します:

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

`oauth/register` と `oauth/update` ステップは、Teams Developer Portal の Vault にアプリケーションを登録し、Copilot が OAuth 2.0 Auth Code 認可フローを実装するために必要な詳細を取得できるようにします。`aadApp/update` ステップは Entra ID アプリケーション自体を更新します。これらの詳細は別ファイル **aad.manifest.json** にあります。次のエクササイズで追加します。

<cc-end-step lab="e6a" exercise="1" step="4" />

### Step 5: 出力パスの変更

新しい yaml スキーマでは出力パスが少し変更されています。次の行を探します:

```yaml
      outputJsonPath: ./appPackage/build/manifest.${{TEAMSFX_ENV}}.json
```

これを次の行に置き換えます:

```yaml
      outputFolder: ./appPackage/build
```

<cc-end-step lab="e6a" exercise="1" step="5" />

### Step 6: アプリケーション コードで Entra ID の値を利用可能にする

次の行を探します:

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

これはアプリケーション コード内で利用するために環境変数を公開しています。`STORAGE_ACCOUNT_CONNECTION_STRING` の下に以下を追加して利用可能にします:

```yaml
        AAD_APP_TENANT_ID: ${{AAD_APP_TENANT_ID}}
        AAD_APP_CLIENT_ID: ${{AAD_APP_CLIENT_ID}}
```

<cc-end-step lab="e6a" exercise="1" step="6" />

## Exercise 2: 一般的な Agents Toolkit 設定の更新

**teamsapp-local.yml** がローカル デバッグ時の Agents Toolkit の動作を制御するのに対し、**teamsapp.yml** は Microsoft Azure へのデプロイ時の動作を制御します。このエクササイズではこのファイルを更新します。

!!! warning "yaml のインデントは重要"
    yaml ファイルはインデントで階層を表すため、編集が難しいことがあります。インデントが正しくないとラボが動作しません。疑わしい場合は、完成版ファイル [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END/teamsapp.yml){_target=blank} を確認してください。

### Step 1: Entra ID アプリケーションのプロビジョニング

アプリケーションがユーザーを認証し、承認を行うには、まず Entra ID にアプリ登録が必要です。このステップでは、まだ登録されていない場合にアプリ登録を追加します。

以下の行を探します:

```yaml
provision:
  # Creates a Teams app
```

`provision:` 行の直下に、次の yaml を挿入します（読みやすさのため空行を入れても構いません）。

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

`signInAudience` を `AzureADMyOrg` に設定すると、Agents Toolkit は登録された Entra ID テナント内でのみ利用可能なシングル テナント アプリを作成します。他のテナント（顧客テナントなど）でも利用できるようにする場合は、`AzureADMultipleOrgs` を設定します。3 つのステップすべてで、前ステップで作成した **aad.manifest.json** を使用します。

また、このステップではいくつかの値が環境ファイルに書き込まれ、それらは **aad.manifest.json** およびアプリケーション パッケージにも挿入されます。

<cc-end-step lab="e6a" exercise="2" step="1" />

### Step 2: Teams Developer Portal Vault にアプリを登録

**teamsapp.yml** で次の行を探します

```yaml
  # Validate using manifest schema
  # - uses: teamsApp/validateManifest
  #   with:
  #     # Path to manifest template
  #     manifestPath: ./appPackage/manifest.json

  # Build Teams app package with latest env value
```

最後の行の前に以下を挿入します:

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

## Exercise 3: アプリケーション パッケージの更新

Agents Toolkit が Entra ID 登録を設定したので、次は Copilot が認証を把握できるようにアプリケーション パッケージを更新します。このエクササイズでは必要なファイルを更新します。

### Step 1: Open API Specification ファイルの更新

Visual Studio Code で作業フォルダーを開き、**appPackage** フォルダーの **trey-definition.json** を開きます。次の行を探します:

```json
    "paths": {
```

この行の前に次の JSON を挿入します:

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

次に各 API パスにこのスキームを追加します。各パスの `responses` オブジェクトを探してください:

```json
    "responses": {
      ...
```

それぞれの `responses` の前に次の JSON を挿入します（ファイル内に 5 箇所あります。すべてに追加してください）。

```json
    "security": [
        {
            "oAuth2AuthCode": []
        }
    ],
```

編集後は忘れずに保存してください。

<cc-end-step lab="e6a" exercise="3" step="1" />

### Step 2: プラグイン ファイルの更新

**appPackage** フォルダーの **trey-plugin.json** を開きます。このファイルには、Open API Specification (OAS) ファイルに含まれていない Copilot が必要とする情報が保存されています。

`Runtimes` の下に `auth` プロパティがあり、`"None"` と設定されているため、API が未認証であることを示しています。Copilot に Vault の OAuth 設定を利用して認証するよう、次のように変更します。

~~~json
  "auth": {
    "type": "OAuthPluginVault",
    "reference_id": "${{OAUTH2AUTHCODE_CONFIGURATION_ID}}"
  },
~~~

次のステップでは、実際の Microsoft 365 ユーザーとして API にアクセスするために、アプリケーション コードを更新して有効なログインをチェックします。これにより "Avery Howard"（Microsoft の架空名ジェネレーターの名前）ではなく実ユーザーとして動作します。

<cc-end-step lab="e6a" exercise="3" step="2" />

## Exercise 4: アプリケーション コードの更新

### Step 1: JWT 検証ライブラリのインストール

作業ディレクトリのコマンド ラインで以下を実行します:

~~~sh
npm i jwt-validate
~~~

これにより、受信した Entra ID 認証トークンを検証するライブラリがインストールされます。

!!! warning
    Microsoft は NodeJS 用の Entra ID トークン検証ライブラリを提供していません。その代わり、[詳細ドキュメント](https://learn.microsoft.com/entra/identity-platform/access-tokens#validate-tokens){target=_blank} で自作方法を案内しています。[参考記事](https://www.voitanos.io/blog/validating-entra-id-generated-oauth-tokens/){target=_blank}（著: [Microsoft MVP Andrew Connell](https://www.voitanos.io/pages/about/#whos-behind-voitanos){target=_blank}）もあります。  

    **本ラボでは、[コミュニティ提供ライブラリ](https://www.npmjs.com/package/jwt-validate){target=_blank}（作成者: [Waldek Mastykarz](https://github.com/waldekmastykarz){target=_blank}）を使用します。本ライブラリは Microsoft によりサポートされておらず、MIT License で提供されています。使用は自己責任でお願いします。**  

    サポート ライブラリの進捗を追跡したい場合は、[この Github issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/6113){target=_blank} をフォローしてください。

<cc-end-step lab="e6a" exercise="4" step="1" />

### Step 2: Identity サービスの更新

現時点で OAuth ログインは機能し、有効なアクセストークンが取得できますが、コードがトークンの検証を行わなければソリューションは安全ではありません。このステップでは、トークンが有効かどうかを検証し、ユーザー名や ID などの情報を抽出するコードを追加します。

**src/services** フォルダーの **IdentityService.ts** を開きます。  
他の `import` 文と一緒に次の行を追加します:

~~~typescript
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
~~~

次に、`class Identity` 宣言の直下に次の行を追加します:

~~~typescript
    private validator: TokenValidator;
~~~

次に、以下のコメントを探します

~~~typescript
// ** INSERT REQUEST VALIDATION HERE (see Lab E6) **
~~~

このコメントを次のコードで置き換えます:

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
    まず、HTTP リクエストの `Authorization` ヘッダーからトークンを取得します。このヘッダーは "Bearer"、半角スペース、トークンで構成されるため、JavaScript の `split(" ")` でトークン部分のみを抽出しています。

    認証が失敗した場合は例外をスローし、Azure 関数が適切なエラーを返します。

    その後、`jwks-validate` ライブラリ用のバリデーターを作成します。この呼び出しは Entra ID から最新の署名キーを取得するため、非同期で時間がかかる可能性があります。

    続いて `ValidateTokenOptions` オブジェクトを設定します。ライブラリは以下も検証します:

    * _audience_ が API サービス アプリ URI と一致するか (トークンがこの Web サービス用であることを確認)  
    * _issuer_ が自テナントのセキュリティ トークン サービスであるか  
    * _scope_ がアプリ登録で定義した `"access_as_user"` と一致するか  

    トークンが有効な場合、ユーザーの一意 ID、名前、メールなどの「クレーム」を含むオブジェクトが返されます。これらを使用し、架空の "Avery Howard" ではなく実ユーザーに置き換えます。

<cc-end-step lab="e6a" exercise="4" step="2" />

## Exercise 5: アプリケーションのテスト

### Step 1: アプリ マニフェストのバージョン番号を更新

テスト前に `appPackage\manifest.json` のマニフェスト バージョンを更新します。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` を開きます。  
2. `version` フィールドを探します。例:  
      ```json
   "version": "1.0.0"
   ```  
3. バージョン番号を少し上げます。例:  
      ```json
   "version": "1.0.1"
   ```  
4. 保存します。

!!! warning "jwt-validate パッケージのコンパイル問題"
    現時点で `jwt-validate` パッケージは `@types/jsonwebtoken` パッケージの型エラーを投げます。回避するには、プロジェクト ルートの tsconfig.json に `"skipLibCheck": true` を追加してください。将来のライブラリ バージョンでは不要になる可能性があります。

<cc-end-step lab="e6a" exercise="5" step="1" />

### Step 2: アプリケーションの (再) 起動

前のラボからアプリが実行中の場合は停止し、アプリケーション パッケージを再作成させます。

その後 F5 キーを押して再度アプリを実行し、前と同じ手順でインストールします。

<cc-end-step lab="e6a" exercise="5" step="2" />

### Step 3: 宣言型エージェントの実行

Microsoft 365 Copilot に戻り、Trey Research エージェントを選択します。  
「What Trey projects am I assigned to?」と入力します。API 呼び出しの確認カードが表示されたら、ここでは認証は行われていないため「Allow Once」をクリックします。

![Microsoft 365 Copilot showing a confirmation card asking if it is ok to call your API. There are buttons to 'Always allow', 'Allow once', or 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-01small.png)

確認カードがログイン カードに置き換わります。  
「Sign in to Trey」をクリックしてサインインします。最初はポップアップ ウィンドウでログインと権限付与が求められます。以降はブラウザーにキャッシュされるため省略される場合があります。

![Microsoft 365 Copilot showing a login card with a button to 'Sign in to Trey' and another one to 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-02small.png)

!!! tip "管理者承認が必要な場合"
    管理者がユーザーによる同意を許可していない場合、次のようなメッセージが表示されることがあります。

    ![The Microsoft Entra popup dialog asking for an admin approval to consume the API.](../../assets/images/extend-m365-copilot-06/need-admin-approval.png)

    これは、管理者がユーザーによるアプリ許可の同意を制限しているためです。その場合、管理者に依頼して全ユーザー向けにグローバル同意を実施してもらう必要があります。Microsoft 365 管理センター / Identity / Applications / App Registrations でアプリ登録を開き、「Grant admin consent ...」を実行します。

    ![The 'API permissions' page of the 'API Plugin' application registered in Microsoft Entra with the 'Grant admin consent ...' command highlighted.](../../assets/images/extend-m365-copilot-06/approval-admin.png)

ログイン カードが Copilot の応答に置き換わります。あなたはデータベースに追加されたばかりなので、まだプロジェクトには割り当てられていません。

ユーザーは以前架空の "Avery Howard" に固定されていました。新しいコードが初めて実行されると、現在のユーザー ID が見つからないため、新規コンサルタント レコードが作成され、まだどのプロジェクトにも割り当てられていません。

!!! note "ユーザー情報の更新"
    本ラボでは、スキルや所在地などをハードコードしています。変更したい場合は [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/){target=_blank} を使用して編集できます。

    ![The Azure Storage Explorer in action while editing the Consultant table. The actual current user is highlighted.](../../assets/images/extend-m365-copilot-06/oauth-azure-storage-explorer.png)
    
<cc-end-step lab="e6a" exercise="5" step="3" />

### Step 4: 自分をプロジェクトに追加

データベースに追加されたばかりなので、まだプロジェクトに割り当てられていません。プロジェクト割り当ては `Assignment` テーブルに保存され、プロジェクト ID とコンサルタント ID を参照します。  
「What are my skills and what projects am I assigned to?」と尋ねると、エージェントは割り当てられたプロジェクトがないことを知らせ、スキルと役割を確認して支援を提案します。

![The response from the 'Trey Genie' agent when the actual user doesn't have any assigned project.](../../assets/images/extend-m365-copilot-06/oauth-run-03bsmall.png)

エージェントに「Woodgrove プロジェクトに自分を追加して」と依頼します。必須値が不足している場合、エージェントは詳細を確認します。

![The response from the 'Trey Genie' agent when adding the current user to a project. If some information are missing, Copilot asks to confirm them. Once all the information are provided, the agent provides a confirmation of the action.](../../assets/images/extend-m365-copilot-06/oauth-run-05.png)

不足している情報を提供すると、エージェントは再確認後に続行します。

![The response from the 'Trey Genie' agent when adding the current user to a project. If some information are missing, Copilot asks to confirm them. Once all the information are provided, the agent provides a confirmation of the action.](../../assets/images/extend-m365-copilot-06/oauth-run-06.png)

最終確認後、エージェントは役割と工数を設定してあなたをプロジェクトに追加します。

![The response from the 'Trey Genie' agent after adding user to project](../../assets/images/extend-m365-copilot-06/oauth-run-07.png)

最後に「What are my skills and what projects am I assigned to?」と尋ねて、既定のスキルとプロジェクト割り当てを確認しましょう。

<cc-end-step lab="e6a" exercise="5" step="4" />

---8<--- "ja/e-congratulations.md"

ラボ Ea6「Entra ID 認証を Agents Toolkit で追加」を完了しました！

次に何か面白いことを試してみませんか？Copilot Connector をソリューションに追加してみましょう。

<cc-next url="../07-add-graphconnector" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/06a-add-authentication--ja" />