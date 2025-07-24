---
search:
  exclude: true
---
# ラボ E6a - OAuth を使用した Entra ID 認証の追加 (Agents Toolkit)

このラボでは，API プラグインに OAuth 2.0 を用いた認証を追加し，認証プロバイダーとして Entra ID を使用します。また，Agents Toolkit をセットアップして，Entra ID および Teams Developer Portal の登録を自動化する方法を学びます。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/1IhyztqkuJo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を素早く確認できます。</div>
            <div class="note-box">
            📘 <strong>注意事項:</strong>    このラボは前回のラボ、ラボ E5 に基づいています。もしラボ E5 を完了していれば，同じフォルダー内で作業を続けることができます。まだの場合は，<a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a> からラボ E5 のソリューションフォルダーをコピーしてください。
    そこで作業してください。
    このラボの完成したソリューションは，<a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END" target="_blank">src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END</a> フォルダーにあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## 演習 1: ローカル Agents Toolkit 構成の更新

この演習では，Agents Toolkit の構成ファイルを変更し，Entra ID でのアプリ登録と Teams Developer Portal の vault への情報の配置を指示します。

### Step 1: Entra ID アプリ マニフェストの追加

作業フォルダーのルートに **aad.manifest.json** ファイルを新規作成してください。このファイルに以下の行をコピーしてください。

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

このファイルには，登録または更新される Entra ID アプリケーションの詳細が含まれています。`${{AAD_APP_CLIENT_ID}}` などの多数のトークンが含まれていることにご注意ください。これらは Agents Toolkit により実際の値に置き換えられます。

!!! 注意事項
    Entra ID は以前「Azure Active Directory」と呼ばれていました。AAD への言及は旧名称での Entra ID を意味します。

<cc-end-step lab="e6a" exercise="1" step="1" />

### Step 2: **teamsapp.local.yml** のファイルバージョン番号の更新

**teamsapp.local.yml** ファイルには，Agents Toolkit によるローカルでのソリューションの実行およびデバッグに関する指示が含まれています。このファイルをこの演習の残りのステップで更新します。

!!! info "teamsapp.local.yml は現在 m365agents.local.yml です"
    新しい Agents Toolkit では，ツールキット関連のタスクすべてに対してファイル名が `m365agents.local.yml` に変更されました。そのため，新しい Agents Toolkit を使用してエージェントを作成した場合は，このファイル名を変更する必要があります。これらのラボでは既存のエージェントプロジェクトで作業しているため，名前の変更やリファクタリングの必要はありません。指示に従って作業を進めてください。

!!! warning YAML のインデントは非常に重要です
    YAML ファイルの編集はインデントによって階層が示されるため，時に難しい場合があります。変更を行う際は正しくインデントされていることを必ず確認してください。疑問がある場合は，完成済みのソリューションファイル [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END/teamsapp.local.yml){_target=blank} を参照してください。

これらのラボは元々，このファイルのバージョン 1.5 を使用する少し古いバージョンの Agents Toolkit で記述されていました。このステップでは，ファイルをバージョン 1.7 に更新します。

まず，最初の行を以下の新しいスキーマ参照に置き換えます：

```yaml
# yaml-language-server: $schema=https://aka.ms/teams-toolkit/v1.7/yaml.schema.json
```

次に，4 行目のバージョン番号を 1.7 に更新します。

```yaml
version: v1.7
```

<cc-end-step lab="e6a" exercise="1" step="2" />

### Step 3: Entra ID アプリケーションのプロビジョニング

アプリケーションが ユーザー を認証して何らかの操作を承認するためには，まず Entra ID にアプリケーションを登録する必要があります。このステップでは，アプリケーション登録がまだ存在しない場合に追加します。

ファイル内で以下の行を探してください：

```yaml
provision:
  # Creates a Teams app
```

これらの行の間，`provision:` 行の直下に次の YAML を挿入してください。可読性のために空行を入れても構いません。

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

`signInAudience` を `AzureADMyOrg` に設定することで，Agents Toolkit は登録された Entra ID テナント内でのみ使用できるシングルテナントアプリケーションを作成します。もし他のテナント，例えばお客様のテナントでもアプリを利用可能にしたい場合は，これを `AzureADMultipleOrgs` に設定します。すべての 3 つのステップは，前のステップで作成した **aad.manifest.json** ファイルを使用します。

また，このステップでは環境ファイルにいくつかの値を書き込み，これらは **aad.manifest.json** およびアプリケーションパッケージに挿入されます。

<cc-end-step lab="e6a" exercise="1" step="3" />

### Step 4: Entra ID アプリケーションの更新

**teamsapp.local.yml** 内で以下の行を探してください：
```yaml
  # Build Teams app package with latest env value
```

この行の前に次の YAML を挿入してください：

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

`oauth/register` および `oauth/update` ステップは，Teams Developer Portal の vault にアプリケーションを登録し，Copilot が OAuth 2.0 Auth Code 認証フローを実装するために必要な詳細情報を取得できるようにします。`aadApp/update` ステップは，このアプリケーションの詳細情報で Entra ID アプリケーション自体を更新します。これらの詳細は別のファイル **aad.manifest.json** に記載されており，次の演習で追加します。

<cc-end-step lab="e6a" exercise="1" step="4" />

### Step 5: 出力パスの変更

新しい YAML スキーマでは出力パスが少し変更されています。以下の行を探してください：

```yaml
      outputJsonPath: ./appPackage/build/manifest.${{TEAMSFX_ENV}}.json
```

そして以下の行に置き換えてください：

```yaml
      outputFolder: ./appPackage/build
```

<cc-end-step lab="e6a" exercise="1" step="5" />

### Step 6: Entra ID の値をアプリケーションコードで利用可能にする

以下の行を探してください：

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

このコードは，アプリケーションコード内で使用する環境変数を公開します。`STORAGE_ACCOUNT_CONNECTION_STRING` の下に以下の行を追加して利用可能にしてください：

```yaml
        AAD_APP_TENANT_ID: ${{AAD_APP_TENANT_ID}}
        AAD_APP_CLIENT_ID: ${{AAD_APP_CLIENT_ID}}
```

<cc-end-step lab="e6a" exercise="1" step="6" />

## 演習 2: 一般的な Agents Toolkit 構成の更新

ローカルでのデバッグ時には **teamsapp.local.yml** が Agents Toolkit の動作を制御し，Microsoft Azure へのデプロイ時には **teamsapp.yml** がその動作を制御します。この演習では，このファイルを更新します。

!!! warning YAML のインデントは非常に重要です
    YAML ファイルの編集はインデントによって階層が示されるため，時に難しい場合があります。変更を行う際は正しくインデントされていることを必ず確認してください。疑問がある場合は，完成済みのソリューションファイル [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END/teamsapp.yml){_target=blank} を参照してください。

### Step 1: Entra ID アプリケーションのプロビジョニング

アプリケーションが ユーザー を認証して何らかの操作を承認するためには，まず Entra ID にアプリケーションを登録する必要があります。このステップでは，アプリケーション登録がまだ存在しない場合に追加します。

ファイル内で以下の行を探してください：

```yaml
provision:
  # Creates a Teams app
```

これらの行の間，`provision:` 行の直下に次の YAML を挿入してください。可読性のために空行を入れても構いません。

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

`signInAudience` を `AzureADMyOrg` に設定することで，Agents Toolkit は登録された Entra ID テナント内でのみ使用できるシングルテナントアプリケーションを作成します。もし他のテナント，例えばお客様のテナントでもアプリを利用可能にしたい場合は，これを `AzureADMultipleOrgs` に設定します。すべての 3 つのステップは，前のステップで作成した **aad.manifest.json** ファイルを使用します。

また，このステップでは環境ファイルにいくつかの値を書き込み，これらは **aad.manifest.json** およびアプリケーションパッケージに挿入されます。

<cc-end-step lab="e6a" exercise="2" step="1" />

### Step 2: Teams Developer Portal Vault へのアプリ登録

**teamsapp.yml** 内で以下の行を探してください：

```yaml
  # Validate using manifest schema
  # - uses: teamsApp/validateManifest
  #   with:
  #     # Path to manifest template
  #     manifestPath: ./appPackage/manifest.json

  # Build Teams app package with latest env value
```

最後の行の前に以下を挿入してください：

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

## 演習 3: アプリケーションパッケージの更新

Agents Toolkit による Entra ID 登録の設定が完了したので，次は Copilot が認証情報を把握できるようにアプリケーションパッケージを更新する時です。この演習では必要なファイルを更新します。

### Step 1: Open API Specification ファイルの更新

Visual Studio Code で作業フォルダーを開き，**appPackage** フォルダー内の **trey-definition.json** ファイルを開いてください。以下の行を探してください：

```json
    "paths": {
```

そしてその前に以下の JSON を挿入してください：

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

これにより，API 呼び出し時に使用する新しいセキュリティスキームが設定されます。

次に，各 API パスにこのスキームを追加する必要があります。各パスのインスタンスを見つけ，`responses` オブジェクトを探してください：

```json
    "responses": {
      ...
```

各 `responses` の前に以下の JSON を挿入してください（ファイル内に 5 箇所あるので，全ての箇所に挿入することを確認してください）：

```json
    "security": [
        {
            "oAuth2AuthCode": []
        }
    ],
```

編集後は必ず変更を保存してください。

<cc-end-step lab="e6a" exercise="3" step="1" />

### Step 2: プラグインファイルの更新

**appPackage** フォルダー内の **trey-plugin.json** ファイルを開いてください。ここには，Copilot が必要とする情報が格納されていますが，Open API Specification (OAS) ファイルには含まれていません。

`Runtimes` の下に，`type` が `"None"` の `auth` プロパティが見つかります。これは API が現在認証されていないことを示しています。以下のように変更して，Copilot に vault に保存された OAuth 設定を用いて認証するよう指示してください。

~~~json
  "auth": {
    "type": "OAuthPluginVault",
    "reference_id": "${{OAUTH2AUTHCODE_CONFIGURATION_ID}}"
  },
~~~

次のステップでは，実際の Microsoft 365 ユーザーとして API にアクセスするために，アプリケーションコードを更新して有効なログインを確認します（"Avery Howard" は Microsoft の架空の名前生成機による名前です）。

<cc-end-step lab="e6a" exercise="3" step="2" />

## 演習 4: アプリケーションコードの更新

### Step 1: JWT 検証ライブラリのインストール

作業ディレクトリでコマンドラインから以下を入力してください：

~~~sh
npm i jwt-validate
~~~

これにより，受信した Entra ID 認証トークンを検証するためのライブラリがインストールされます。

!!! warning
    Microsoft は NodeJS 用の Entra ID トークン検証のサポートライブラリを提供しておらず，代わりに独自実装の手順を記載した [この詳細なドキュメント](https://learn.microsoft.com/entra/identity-platform/access-tokens#validate-tokens){target=_blank} を提供しています。また，[Microsoft MVP Andrew Connell](https://www.voitanos.io/pages/about/#whos-behind-voitanos){target=_blank} による [別の有用な記事](https://www.voitanos.io/blog/validating-entra-id-generated-oauth-tokens/){target=_blank} もご参照ください。

    **本ラボでは，このガイダンスに従うことを目的とした [コミュニティ提供のライブラリ](https://www.npmjs.com/package/jwt-validate){target=_blank} を，[Waldek Mastykarz](https://github.com/waldekmastykarz){target=_blank} によって作成されたものを使用します。このライブラリは Microsoft によるサポートを受けず，MIT ライセンスの下で提供されているため，自己責任でご利用ください。**
    
    サポートされているライブラリの進捗状況を追跡したい場合は，[こちらの Github issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/6113){target=_blank} をご参照ください。

<cc-end-step lab="e6a" exercise="4" step="1" />

### Step 2: アイデンティティサービスの更新

この時点で，OAuth ログインは動作し有効なアクセストークンが提供されるはずですが，コードがトークンの有効性を確認しない限り，ソリューションは安全とは言えません。このステップでは，そのトークンの有効性を検証し，ユーザーの名前や ID などの情報を抽出するコードを追加します。

**src/services** フォルダー内の **IdentityService.ts** ファイルを開いてください。  
ファイルの先頭にある他の `import` 文と共に，以下を追加してください：

~~~typescript
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
~~~

次に，`class Identity` の直下に以下の行を追加してください：

~~~typescript
    private validator: TokenValidator;
~~~

次に，以下のコメントを探してください

~~~typescript
// ** INSERT REQUEST VALIDATION HERE (see Lab E6) **
~~~

このコメントを以下のコードに置き換えてください：

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

!!! 注意 「コードから学ぶ」
    新しいソースコードを見てください。まず，HTTPS リクエストの `Authorization` ヘッダーからトークンを取得します。このヘッダーには "Bearer" という単語と空白，続いてトークンが含まれているため，JavaScript の `split(" ")` を使用してトークンのみを取得します。

    さらに，認証に失敗する理由がある場合，コードは例外をスローして適切なエラーを返します。

    その後，コードは `jwks-validate` ライブラリで使用するためのバリデーターを作成します。この呼び出しは Entra ID から最新の署名キーを取得するための非同期呼び出しであり，実行に時間がかかる場合があります。

    次に，`ValidateTokenOptions` オブジェクトを設定します。このオブジェクトに基づき，ライブラリはトークンが Entra ID のプライベートキーで署名されていることに加え，以下を検証します：

    * _audience_ は API サービスアプリの URI と同じでなければならず，これによりトークンが当該 Web サービス専用であることが保証されます。

    * _issuer_ は当該テナントのセキュリティトークンサービスから発行されなければなりません。

    * _scope_ はアプリ登録に定義されたスコープ `"access_as_user"` と一致している必要があります。

    トークンが有効であれば，ライブラリは内部に含まれていたユーザーの一意の ID，名前，及びメールなど，全ての「クレーム」を持つオブジェクトを返します。これらの値は，架空の "Avery Howard" に依存する代わりに使用されます。

<cc-end-step lab="e6a" exercise="4" step="2" />

## 演習 5: アプリケーションのテスト

### Step 1: アプリマニフェスト内のアプリケーションバージョン番号の更新

アプリケーションをテストする前に，`appPackage\manifest.json` ファイル内のアプリケーションパッケージの manifest バージョンを更新してください。以下の手順に従います：

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` ファイルを開いてください。

2. JSON ファイル内の `version` フィールドを探してください。次のようになっているはずです：  
   ```json
   "version": "1.0.0"
   ```

3. バージョン番号を少しだけ上げてください。例えば，次のように変更します：  
   ```json
   "version": "1.0.1"
   ```

4. 変更を保存してください。

!!! warning 「jwt-validate パッケージのコンパイルエラー」
    現時点では，jwt-validate パッケージは @types/jsonwebtoken パッケージに対して型エラーを発生させています。この問題を回避するには，プロジェクトのルートにある tsconfig.json ファイルを編集し，"skipLibCheck":true を追加してください。将来的なライブラリのバージョンアップにより修正される可能性がありますので，ラボ実施時には不要になっているかもしれません。

<cc-end-step lab="e6a" exercise="5" step="1" />

### Step 2: アプリケーションの (再)起動

もし前のラボからアプリが既に起動している場合は，停止してアプリケーションパッケージを再作成させてください。

次に F5 キーを押して，アプリケーションを再度実行し，以前と同様にインストールしてください。

<cc-end-step lab="e6a" exercise="5" step="2" />

### Step 3: デクララティブエージェントの実行

Microsoft 365 Copilot に戻り， Trey Research エージェントを選択してください。  
プロンプトに 「What Trey projects am I assigned to?」 と入力してください。API 呼び出しの許可を求める確認カードが表示される場合があります。ここでは認証は行われていません；「Allow Once」をクリックして進んでください。

![Microsoft 365 Copilot が API 呼び出しの許可確認カードを表示しています。'Always allow'，'Allow once'，または 'Cancel' のボタンが用意されています。](../../assets/images/extend-m365-copilot-06/oauth-run-01small.png)

確認カードはログインカードに置き換えられます。  
「Sign in to Trey」をクリックしてサインインしてください。最初は，ログインと権限への同意を求めるポップアップウィンドウが表示されるはずです。以降のアクセスでは，ローカルブラウザーに Entra ID により資格情報がキャッシュされているため，表示されない場合があります。

![Microsoft 365 Copilot が「Sign in to Trey」及び「Cancel」のボタン付きのログインカードを表示しています。](../../assets/images/extend-m365-copilot-06/oauth-run-02small.png)

!!! tip 「管理者の承認が必要な場合があります」
    管理者がユーザーとしての同意を許可していない場合，以下のような表示が出ることがあります：

    ![Microsoft Entra のポップアップダイアログが，API の利用に対する管理者の承認を求めています。](../../assets/images/extend-m365-copilot-06/need-admin-approval.png)

    これは，管理者がユーザーに対しアプリケーションへの権限付与の同意を制限しているためです。この場合，Microsoft 365 Admin / Identity / Applications / App Registrations でアプリ登録を見つけ，そこで管理者に全ユーザー向けのプラグイン API 登録に対するグローバル同意を手動で付与してもらう必要があります。

    ![Microsoft Entra に登録された 'API Plugin' アプリケーションの 'API permissions' ページで，'Grant admin consent ...' コマンドがハイライトされています。](../../assets/images/extend-m365-copilot-06/approval-admin.png)

ログインカードは，あなたのプロンプトに対する Copilot の応答に置き換えられるはずです。あなたはデータベースに新規追加されたため，まだプロジェクトへの割り当てはありません。

ユーザーがハードコーディングされていた架空のユーザー "Avery Howard" であったことを思い出してください。新しいコードが初めて実行される際，あなたのユーザー ID が見つからないため，まだどのプロジェクトにも割り当てられていない新しいコンサルタントレコードが作成されます。

!!! note 「ユーザー情報の更新」
    これはラボであるため，新規ユーザーアカウントのスキルや所在地などの詳細はハードコーディングされています。変更したい場合は，[Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/){target=_blank} を使用して変更できます。

    ![Azure Storage Explorer を使って Consultant テーブルを編集している様子。実際の現在のユーザーがハイライトされています。](../../assets/images/extend-m365-copilot-06/oauth-azure-storage-explorer.png)
    
<cc-end-step lab="e6a" exercise="5" step="3" />

### Step 4: プロジェクトへの割り当ての追加

データベースに新規追加されたため，まだどのプロジェクトにも割り当てられていません。プロジェクトの割り当て情報は `Assignment` テーブルに保管され，プロジェクト ID と割り当てられたコンサルタントのコンサルタント ID を参照しています。  
エージェントに自分が割り当てられているプロジェクトを尋ねると，割り当てられたプロジェクトが見つからないと回答されますが，あなたのスキルや役割を識別し，サポートを申し出ます。

![実際のユーザーにプロジェクトの割り当てがない場合の 'Trey Genie' エージェントからの応答。](../../assets/images/extend-m365-copilot-06/oauth-run-03bsmall.png)

エージェントに Woodgrove プロジェクトへの割り当てを依頼してください。必要な情報が不足している場合，エージェントは詳細を確認します。

![現在のユーザーをプロジェクトに追加する際の 'Trey Genie' エージェントの応答。いくつかの情報が不足している場合，Copilot はそれらの確認を求め，必要な情報がすべて提供されるとエージェントは操作の確認を行います。](../../assets/images/extend-m365-copilot-06/oauth-run-05.png)

必要な情報を提供することで，エージェントが内容を再確認してから処理を進めることができます。

![現在のユーザーをプロジェクトに追加する際の 'Trey Genie' エージェントの応答。いくつかの情報が不足している場合，Copilot はそれらの確認を求め，必要な情報がすべて提供されるとエージェントは操作の確認を行います。](../../assets/images/extend-m365-copilot-06/oauth-run-06.png)

最終的に確認すると，エージェントは正しい役割と予測をもってあなたをプロジェクトに追加し，タスクを完了します。

![ユーザーをプロジェクトに追加した後の 'Trey Genie' エージェントの応答](../../assets/images/extend-m365-copilot-06/oauth-run-07.png)

次に，自分のデフォルトのスキルを確認し，「What are my skills and what projects am I assigned to?」と尋ねてプロジェクトの割り当てを確認してください。

<cc-end-step lab="e6a" exercise="5" step="4" />

---8<--- "ja/e-congratulations.md"

ラボ Ea6，Agents Toolkit を用いた Entra ID 認証の追加を完了しました！

何か面白いことに挑戦してみませんか？ソリューションに Copilot Connector を追加してみてはいかがでしょうか？

<cc-next url="../07-add-graphconnector" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/06a-add-authentication" />