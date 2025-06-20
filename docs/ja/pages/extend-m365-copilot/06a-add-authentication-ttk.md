---
search:
  exclude: true
---
# ラボ E6a - OAuth を使用した Entra ID 認証の追加 (Agents Toolkit)

このラボでは、Entra ID を ID プロバイダーとして利用し、OAuth 2.0 で API プラグインに認証を追加します。Agents Toolkit を使用して Entra ID と Teams Developer Portal の登録を自動化する方法を学びます。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/1IhyztqkuJo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を確認できます。</div>
            <div class="note-box">
            📘 <strong>Note:</strong> このラボは前のラボ E5 を基にしています。ラボ E5 を完了している場合は同じフォルダーで続行できます。まだの場合は <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a> のソリューション フォルダーをコピーして作業してください。  
    このラボの完成版ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END" target="_blank">src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END </a> フォルダーにあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## 演習 1: ローカル Agents Toolkit 構成の更新

この演習では、Agents Toolkit の構成ファイルを修正し、Entra ID でアプリケーションを登録し、その情報を Teams Developer Portal の「Vault」に格納するよう指示します。

### Step 1: Entra ID アプリ マニフェストの追加

作業フォルダーのルートに新しいファイル **aad.manifest.json** を作成し、次の行をコピーしてください。

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

このファイルには、登録または更新される Entra ID アプリケーションの詳細が含まれています。`${{AAD_APP_CLIENT_ID}}` などのトークンは、Agents Toolkit がアプリケーションをプロビジョニングする際に実際の値に置き換えられます。

!!! Note
    Entra ID は以前「Azure Active Directory」と呼ばれていました。「AAD」という記載は旧名称である Entra ID を指します。

<cc-end-step lab="e6a" exercise="1" step="1" />

### Step 2: **teamsapp.local.yml** のファイル バージョン番号を更新

**teamsapp.local.yml** ファイルは、ローカルでソリューションを実行・デバッグする際の Agents Toolkit の動作を定義します。この演習の残りではこのファイルを更新します。

!!! info "teamsapp.local.yml は m365agents.local.yml に変更されました"
    新しい Agents Toolkit では、ツールキット関連タスクのファイル名が `m365agents.local.yml` に変更されました。新規プロジェクトで エージェント を作成した場合はそちらのファイル名を変更してください。本ラボでは既存の エージェント プロジェクトを使用するため、リネームやリファクタリングは不要です。手順どおり進めてください。

!!! warning "yaml のインデントは重要です"
    yaml ファイルではインデントで階層を示すため編集が難しい場合があります。インデントが正しくないとラボが動作しません。不安な場合は完成版ファイルを参照してください [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END/teamsapp.local.yml){_target=blank}。

これらのラボは、バージョン 1.5 を使用するやや古い Agents Toolkit で書かれていました。このステップではファイルをバージョン 1.7 に更新します。

まず、最初の行を次の新しいスキーマ参照に置き換えます。

```yaml
# yaml-language-server: $schema=https://aka.ms/teams-toolkit/v1.7/yaml.schema.json
```

続いて 4 行目のバージョン番号を 1.7 に更新します。

```yaml
version: v1.7
```

<cc-end-step lab="e6a" exercise="1" step="2" />

### Step 3: Entra ID アプリケーションのプロビジョニング

アプリケーションが ユーザー を認証し何らかの操作を許可できるようにするには、まず Entra ID にアプリを登録する必要があります。この手順では、まだ登録がない場合に追加します。

ファイル内で次の行を探します:

```yaml
provision:
  # Creates a Teams app
```  
`provision:` 行の直下に次の yaml を挿入します。可読性のため空行を入れてもかまいません。

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

`signInAudience` を `AzureADMyOrg` に設定することで、Agents Toolkit は登録したテナント内でのみ使用できるシングル テナント アプリケーションを作成します。顧客テナントなど他のテナントでも使用したい場合は `AzureADMultipleOrgs` に変更してください。3 つのステップはいずれも前の手順で作成した **aad.manifest.json** を利用します。

また、このステップでは複数の値が環境ファイルに書き込まれ、**aad.manifest.json** とアプリケーション パッケージに挿入されます。

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

`oauth/register` と `oauth/update` ステップは、Teams Developer Portal の Vault にアプリを登録し、Copilot が OAuth 2.0 の Auth Code フローを実装するために必要な詳細を取得できるようにします。`aadApp/update` ステップは **aad.manifest.json** にある詳細を使って Entra ID アプリ自体を更新します。

<cc-end-step lab="e6a" exercise="1" step="4" />

### Step 5: 出力パスの変更

新しい yaml スキーマでは出力パスが少し変更されています。次の行を探してください:

```yaml
      outputJsonPath: ./appPackage/build/manifest.${{TEAMSFX_ENV}}.json
```

これを次の行に置き換えます:

```yaml
      outputFolder: ./appPackage/build
```

<cc-end-step lab="e6a" exercise="1" step="5" />

### Step 6: アプリケーション コードで Entra ID の値を利用可能にする

次の行を探してください:

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

これはアプリケーション コード内で使用する環境変数を公開しています。`STORAGE_ACCOUNT_CONNECTION_STRING` の下に次の行を追加して利用可能にします:

```yaml
        AAD_APP_TENANT_ID: ${{AAD_APP_TENANT_ID}}
        AAD_APP_CLIENT_ID: ${{AAD_APP_CLIENT_ID}}
```

<cc-end-step lab="e6a" exercise="1" step="6" />

## 演習 2: 一般的な Agents Toolkit 構成の更新

**teamsapp-local.yml** がローカル デバッグ時の Agents Toolkit の動作を制御する一方で、**teamsapp.yml** は Microsoft Azure へのデプロイ時の動作を制御します。この演習ではこのファイルを更新します。

!!! warning "yaml のインデントは重要です"
    yaml ファイルではインデントで階層を示すため編集が難しい場合があります。インデントが正しくないとラボが動作しません。不安な場合は完成版ファイルを参照してください [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END/teamsapp.yml){_target=blank}。

### Step 1: Entra ID アプリケーションのプロビジョニング

アプリケーションが ユーザー を認証し何らかの操作を許可できるようにするには、まず Entra ID にアプリを登録する必要があります。この手順では、まだ登録がない場合に追加します。

ファイル内で次の行を探します:

```yaml
provision:
  # Creates a Teams app
```  
`provision:` 行の直下に次の yaml を挿入します。可読性のため空行を入れてもかまいません。

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

`signInAudience` が `AzureADMyOrg` に設定されているため、Agents Toolkit は登録したテナント内でのみ使用できるシングル テナント アプリケーションを作成します。他のテナントでも使用したい場合は `AzureADMultipleOrgs` に変更してください。3 つのステップはいずれも前の手順で作成した **aad.manifest.json** を利用します。

また、このステップでは複数の値が環境ファイルに書き込まれ、**aad.manifest.json** とアプリケーション パッケージに挿入されます。

<cc-end-step lab="e6a" exercise="2" step="1" />

### Step 2: Teams Developer Portal Vault へのアプリ登録

**teamsapp.yml** で次の行を探します

```yaml
  # Validate using manifest schema
  # - uses: teamsApp/validateManifest
  #   with:
  #     # Path to manifest template
  #     manifestPath: ./appPackage/manifest.json

  # Build Teams app package with latest env value
```

最後の行の前に次を挿入します:

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

Agents Toolkit で Entra ID の登録が設定できたので、次はアプリケーション パッケージを更新し、Copilot が認証情報を認識できるようにします。この演習では必要なファイルを更新します。

### Step 1: Open API Specification ファイルの更新

Visual Studio Code で作業フォルダーを開き、**appPackage** フォルダーの **trey-definition.json** ファイルを開きます。次の行を探します:

```json
    "paths": {
```

その前に次の JSON を挿入します:

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

これにより、API 呼び出し時に使用される新しいセキュリティ スキームが設定されます。

次に、このスキームを各 API パスに追加します。各パスの `responses` オブジェクトを探します:

```json
    "responses": {
      ...
```

各 `responses` の前に次の JSON を挿入します（ファイル内に 5 か所あります。すべての前に挿入してください）:

```json
    "security": [
        {
            "oAuth2AuthCode": []
        }
    ],
```

編集後は必ず保存してください。

<cc-end-step lab="e6a" exercise="3" step="1" />

### Step 2: プラグイン ファイルの更新

**appPackage** フォルダーの **trey-plugin.json** ファイルを開きます。ここには、Open API Specification (OAS) ファイルに存在しない Copilot が必要とする情報が保存されています。

`Runtimes` の下に `auth` プロパティがあり、`"None"` と設定されているため、現在 API は認証されていません。以下のように変更し、Vault に保存した OAuth 設定を使用して Copilot に認証させます。

~~~json
  "auth": {
    "type": "OAuthPluginVault",
    "reference_id": "${{OAUTH2AUTHCODE_CONFIGURATION_ID}}"
  },
~~~

次のステップでは、アプリケーション コードを更新して有効なログインをチェックし、"Avery Howard"（Microsoft の架空名ジェネレーターの名前）ではなく実際の Microsoft 365 ユーザーとして API にアクセスします。

<cc-end-step lab="e6a" exercise="3" step="2" />

## 演習 4: アプリケーション コードの更新

### Step 1: JWT 検証ライブラリのインストール

作業ディレクトリのコマンド ラインで次を実行します:

~~~sh
npm i jwt-validate
~~~

これにより、受信した Entra ID 認可トークンを検証するライブラリがインストールされます。

!!! warning
    Microsoft は NodeJS で Entra ID トークンを検証するサポート付きライブラリを提供していません。その代わり、[詳細なドキュメント](https://learn.microsoft.com/entra/identity-platform/access-tokens#validate-tokens){target=_blank} で独自に記述する方法を案内しています。[参考記事](https://www.voitanos.io/blog/validating-entra-id-generated-oauth-tokens/){target=_blank} も [Microsoft MVP Andrew Connell](https://www.voitanos.io/pages/about/#whos-behind-voitanos){target=_blank} から提供されています。

    **このラボでは、[Waldek Mastykarz](https://github.com/waldekmastykarz){target=_blank} 氏が作成した [コミュニティ提供ライブラリ](https://www.npmjs.com/package/jwt-validate){target=_blank} を使用します。このライブラリはガイダンスに従うことを意図していますが、Microsoft によるサポートはなく MIT ライセンスの下で提供されています。使用は自己責任でお願いします。**
    
    サポート付きライブラリの進捗を追跡したい場合は [この GitHub issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/6113){target=_blank} をフォローしてください。

<cc-end-step lab="e6a" exercise="4" step="1" />

### Step 2: Identity サービスの更新

この時点で OAuth ログインは機能し、有効なアクセス トークンが提供されますが、トークンが有効かどうかをコードで確認しなければソリューションは安全ではありません。この手順ではトークンを検証し、ユーザー 名や ID などの情報を抽出するコードを追加します。

**src/services** フォルダーの **IdentityService.ts** を開きます。  
ファイル上部の他の `import` 行と共に次を追加します:

~~~typescript
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
~~~

次に、`class Identity` 宣言の直下に次の行を追加します:

~~~typescript
    private validator: TokenValidator;
~~~

次に、次のコメントを探します

~~~typescript
// ** INSERT REQUEST VALIDATION HERE (see Lab E6) **
~~~

コメントを次のコードに置き換えます:

```typescript
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
```

!!! Note "コードから学ぶ"
    追加したコードを見てみましょう。まず、HTTP リクエストの `Authorization` ヘッダーからトークンを取得します。このヘッダーには「Bearer トークン」という形式で値が格納されているため、JavaScript の `split(" ")` を利用してトークン部分のみを取得しています。

    認証に失敗した場合は例外をスローし、Azure Function が適切なエラーを返します。

    続いて `jwt-validate` ライブラリ用のバリデーターを作成します。この呼び出しは Entra ID から最新の公開鍵を取得するため非同期で時間がかかる可能性があります。

    次に `ValidateTokenOptions` オブジェクトを設定します。ライブラリは、トークンが Entra ID の公開鍵で署名されていることに加え、以下を検証します:

    * _audience_ が API サービスの app URI と一致すること（トークンがこの Web サービス専用であることを保証）  
    * _issuer_ が自テナントのセキュリティ トークン サービスであること  
    * _scope_ がアプリ登録で定義した `"access_as_user"` と一致すること  

    トークンが有効であれば、ライブラリは内部の "claims" を含むオブジェクトを返します。これには ユーザー の一意 ID、名前、メールが含まれます。これらの値を使用し、架空の "Avery Howard" ではなく実際の ユーザー を処理します。

<cc-end-step lab="e6a" exercise="4" step="2" />

## 演習 5: アプリケーションのテスト

### Step 1: アプリ マニフェストのバージョン番号を更新

アプリケーションをテストする前に `appPackage\manifest.json` 内のマニフェスト バージョンを更新します:

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` を開きます。  
2. JSON 内の `version` フィールドを見つけます:  
   ```json
   "version": "1.0.0"
   ```  
3. バージョン番号を小さくインクリメントします。例:  
   ```json
   "version": "1.0.1"
   ```  
4. 保存します。

!!! warning "jwt-validate パッケージのコンパイル問題"
    現在 `jwt-validate` パッケージは `@types/jsonwebtoken` の型定義でエラーを投げる場合があります。回避策として、プロジェクト ルートの tsconfig.json に `"skipLibCheck": true` を追加してください。将来のライブラリ バージョンで修正される可能性があります。

<cc-end-step lab="e6a" exercise="5" step="1" />

### Step 2: アプリケーションの (再) 起動

前のラボからアプリが実行中の場合は停止し、アプリ パッケージを再作成させます。

その後 F5 を押してアプリを再実行し、以前と同様にインストールします。

<cc-end-step lab="e6a" exercise="5" step="2" />

### Step 3: 宣言型 エージェント の実行

Microsoft 365 Copilot に戻り、Trey Research エージェント を選択します。  
「自分が担当している Trey プロジェクトは何ですか？」と入力してください。API を呼び出してよいか確認するカードが表示される場合があります。ここでは認証は行われていませんので、「Allow Once」をクリックして続行します。

![Microsoft 365 Copilot showing a confirmation card asking if it is ok to call your API. There are buttons to 'Always allow', 'Allow once', or 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-01small.png)

確認カードがログイン カードに置き換わります。  
「Sign in to Trey」をクリックしてサインインします。初回はポップアップ ウィンドウが表示され、ログインと権限付与を求められます。次回以降はブラウザーにキャッシュされ、表示されない場合があります。

![Microsoft 365 Copilot showing a login card with a button to 'Sign in to Trey' and another one to 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-02small.png)

!!! tip "管理者承認が必要な場合があります"
    管理者が ユーザー による同意を許可していない場合、次のような画面が表示されることがあります。

    ![The Microsoft Entra popup dialog asking for an admin approval to consume the API.](../../assets/images/extend-m365-copilot-06/need-admin-approval.png)

    これは管理者がアプリへの権限付与を ユーザー に許可していないためです。管理者に依頼し、Microsoft 365 Admin / Identity / Applications / App Registrations でプラグイン API 登録に対してグローバル同意を付与してもらう必要があります。

    ![The 'API permissions' page of the 'API Plugin' application registered in Microsoft Entra with the 'Grant admin consent ...' command highlighted.](../../assets/images/extend-m365-copilot-06/approval-admin.png)

ログイン カードはあなたのプロンプトに対する Copilot の応答に置き換わります。データベースに追加されたばかりなので、まだプロジェクトには割り当てられていません。

以前は架空の "Avery Howard" がハードコードされていましたが、新しいコードが初めて実行されるとあなたのユーザー ID を見つけられないため、新しいコンサルタント レコードが作成され、まだプロジェクトに割り当てられていません。

!!! note "ユーザー情報の更新"
    これはラボ用のため、スキルや所在地などの詳細はハードコードされています。変更したい場合は [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/){target=_blank} を使ってください。

    ![The Azure Storage Explorer in action while editing the Consultant table. The actual current user is highlighted.](../../assets/images/extend-m365-copilot-06/oauth-azure-storage-explorer.png)

<cc-end-step lab="e6a" exercise="5" step="3" />

### Step 4: 自分をプロジェクトに追加する

データベースに追加されたばかりなので、まだプロジェクトに割り当てられていません。プロジェクトの割り当ては `Assignment` テーブルに保存され、プロジェクト ID と割り当てられたコンサルタントの consultant ID を参照します。  
「自分の担当プロジェクトを教えて」と エージェント に聞くと、プロジェクトが見つからない旨が返り、スキルと役割を特定して手伝う提案をします。

![The response from the 'Trey Genie' agent when the actual user doesn't have any assigned project.](../../assets/images/extend-m365-copilot-06/oauth-run-03bsmall.png)

「自分を Woodgrove プロジェクトに追加して」と エージェント に依頼してください。必須値を忘れた場合、エージェント は詳細を求めます。

![The response from the 'Trey Genie' agent when adding the current user to a project. If some information are missing, Copilot asks to confirm them. Once all the information are provided, the agent provides a confirmation of the action.](../../assets/images/extend-m365-copilot-06/oauth-run-05.png)

不足情報を提供すると、エージェント が再度確認します。

![The response from the 'Trey Genie' agent when adding the current user to a project. If some information are missing, Copilot asks to confirm them. Once all the information are provided, the agent provides a confirmation of the action.](../../assets/images/extend-m365-copilot-06/oauth-run-06.png)

最終的に確認すると、エージェント はあなたを適切な役割と予測でプロジェクトに追加します。

![The response from the 'Trey Genie' agent after adding user to project](../../assets/images/extend-m365-copilot-06/oauth-run-07.png)

続けて「自分のスキルと担当プロジェクトを教えて」と尋ね、デフォルトのスキルとプロジェクト割り当てを確認してください。

<cc-end-step lab="e6a" exercise="5" step="4" />

---8<--- "ja/e-congratulations.md"

Entra ID 認証を追加するラボ Ea6 を完了しました。お疲れさまでした!

もっと試してみませんか? ソリューションに Copilot Connector を追加してみましょう。

<cc-next url="../07-add-graphconnector" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/06a-add-authentication" />