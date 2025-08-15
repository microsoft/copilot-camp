---
search:
  exclude: true
---
# ラボ E6a - OAuth で Entra ID 認証を追加 (Agents Toolkit)

このラボでは、OAuth 2.0 を使用して Entra ID を ID プロバイダーとする API プラグインに認証を追加します。Agents Toolkit を設定し、Entra ID および Teams Developer Portal への登録を自動化する方法を学びます。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/1IhyztqkuJo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認しましょう。</div>
            <div class="note-box">
            📘 <strong>注意:</strong> 本ラボは前回の Lab E5 を基にしています。Lab E5 を完了している場合は、同じフォルダーで作業を続けてください。完了していない場合は、<a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a> から Lab E5 のソリューションフォルダーをコピーし、そこで作業してください。  
    本ラボの完成版ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END" target="_blank">src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END</a> フォルダーにあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## Exercise 1: ローカル Agents Toolkit 設定の更新

この演習では、Agents Toolkit の構成ファイルを変更し、Entra ID へのアプリ登録と Teams Developer Portal の「Vault」に情報を配置するよう指示します。

### Step 1: Entra ID アプリ マニフェストを追加する

作業フォルダーのルートに **aad.manifest.json** という新しいファイルを作成し、次の行をコピーします。

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

このファイルには、登録または更新する Entra ID アプリケーションの詳細が含まれています。`${{AAD_APP_CLIENT_ID}}` などのトークンは、Agents Toolkit がアプリをプロビジョニングするときに実際の値に置き換えられます。

!!! Note
    Entra ID は以前「Azure Active Directory」と呼ばれていました。`"AAD"` の記載は旧名称である Entra ID を指します。

<cc-end-step lab="e6a" exercise="1" step="1" />

### Step 2: **teamsapp.local.yml** のバージョン番号を更新する

**teamsapp.local.yml** ファイルには、ローカルでソリューションを実行・デバッグする際の Agents Toolkit の指示が記載されています。残りの手順ではこのファイルを更新します。

!!! info "`teamsapp.local.yml` は `m365agents.local.yml` に変更されています"
    新しい Agents Toolkit では Toolkit 関連のタスク用ファイル名が `m365agents.local.yml` に変更されました。新しいプロジェクトでエージェントを作成した場合は、このファイル名を変更します。本ラボでは既存のエージェント プロジェクトを使用しているため、リネームやリファクタリングは不要です。手順通りに進めてください。

!!! warning "yaml ではインデントが重要"
    yaml ファイルはインデントで階層を示すため、編集時に正しくインデントしないとラボが動作しません。迷った場合は完成版ファイル [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END/teamsapp.local.yml){_target=blank} を参照してください。

これらのラボは、バージョン 1.5 を使用していた少し古い Agents Toolkit で作成されています。この手順ではファイルをバージョン 1.7 に更新します。

まず、最初の行を次の新しいスキーマ参照に置き換えます。

```yaml
# yaml-language-server: $schema=https://aka.ms/teams-toolkit/v1.7/yaml.schema.json
```

続いて 4 行目のバージョン番号を 1.7 に更新します。

```yaml
version: v1.7
```

<cc-end-step lab="e6a" exercise="1" step="2" />

### Step 3: Entra ID アプリケーションをプロビジョニングする

アプリがユーザーを認証し、権限を与えるには、あらかじめ Entra ID でアプリを登録しておく必要があります。この手順では、まだ登録されていない場合にアプリ登録を追加します。

次の行をファイル内で見つけます。

```yaml
provision:
  # Creates a Teams app
```  
その直下、`provision:` 行のすぐ下に、以下の yaml を挿入します。読みやすさのために空行を入れてもかまいません。

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

`signInAudience` を `AzureADMyOrg` に設定すると、登録されたテナント内でのみ使用できるシングル テナント アプリになります。他テナント（例: 顧客テナント）でも使用したい場合は `AzureADMultipleOrgs` を設定します。3 つのステップすべてで、前手順で作成した **aad.manifest.json** ファイルを使用します。

また、このステップは複数の値を環境ファイルに書き込み、**aad.manifest.json** とアプリ パッケージに反映させます。

<cc-end-step lab="e6a" exercise="1" step="3" />

### Step 4: Entra ID アプリケーションを更新する

**teamsapp.local.yml** で次の行を探します  
```yaml
  # Build Teams app package with latest env value
```

この行の前に以下の yaml を挿入します。

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

`oauth/register` と `oauth/update` ステップは、Teams Developer Portal の Vault にアプリ情報を登録し、Copilot が OAuth 2.0 の Auth Code 認可フローに必要な詳細を取得できるようにします。`aadApp/update` ステップは Entra ID アプリ自体を更新します。詳細は別ファイル **aad.manifest.json** に記載しますが、これは次の演習で追加します。

<cc-end-step lab="e6a" exercise="1" step="4" />

### Step 5: 出力パスを変更する

新しい yaml スキーマでは出力パスが若干変更されます。次の行を探します。

```yaml
      outputJsonPath: ./appPackage/build/manifest.${{TEAMSFX_ENV}}.json
```

これを次の行に置き換えます。

```yaml
      outputFolder: ./appPackage/build
```

<cc-end-step lab="e6a" exercise="1" step="5" />

### Step 6: アプリケーション コードで Entra ID 値を利用可能にする

次の行を見つけます。

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

これはアプリ内で使用する環境変数を公開しています。`STORAGE_ACCOUNT_CONNECTION_STRING` の下に次の行を追加し、変数を利用可能にします。

```yaml
        AAD_APP_TENANT_ID: ${{AAD_APP_TENANT_ID}}
        AAD_APP_CLIENT_ID: ${{AAD_APP_CLIENT_ID}}
```

<cc-end-step lab="e6a" exercise="1" step="6" />

## Exercise 2: 一般的な Agents Toolkit 設定の更新

**teamsapp-local.yml** がローカルデバッグ時の Agents Toolkit 挙動を制御するのに対し、**teamsapp.yml** は Microsoft Azure へのデプロイ時の挙動を制御します。この演習ではこのファイルを更新します。

!!! warning "yaml ではインデントが重要"
    yaml ファイルはインデントで階層を示すため、編集時に正しくインデントしないとラボが動作しません。迷った場合は完成版ファイル [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END/teamsapp.yml){_target=blank} を参照してください。

### Step 1: Entra ID アプリケーションをプロビジョニングする

アプリがユーザーを認証し、権限を与えるには、あらかじめ Entra ID でアプリを登録しておく必要があります。この手順では、まだ登録されていない場合にアプリ登録を追加します。

次の行をファイル内で見つけます。

```yaml
provision:
  # Creates a Teams app
```  
その直下、`provision:` 行のすぐ下に、以下の yaml を挿入します。読みやすさのために空行を入れてもかまいません。

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

`signInAudience` を `AzureADMyOrg` に設定すると、登録されたテナント内でのみ使用できるシングル テナント アプリになります。他テナント（例: 顧客テナント）でも使用したい場合は `AzureADMultipleOrgs` を設定します。3 つのステップすべてで、前手順で作成した **aad.manifest.json** ファイルを使用します。

また、このステップは複数の値を環境ファイルに書き込み、**aad.manifest.json** とアプリ パッケージに反映させます。

<cc-end-step lab="e6a" exercise="2" step="1" />

### Step 2: Teams Developer Portal Vault にアプリを登録する

**teamsapp.yml** 内で次の行を探します

```yaml
  # Validate using manifest schema
  # - uses: teamsApp/validateManifest
  #   with:
  #     # Path to manifest template
  #     manifestPath: ./appPackage/manifest.json

  # Build Teams app package with latest env value
```

最後の行の前に以下を挿入します。

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

Agents Toolkit が Entra ID 登録を設定したので、次は Copilot が認証を認識できるようアプリケーション パッケージを更新します。この演習では必要なファイルを編集します。

### Step 1: Open API Specification ファイルを更新する

Visual Studio Code で作業フォルダーを開き、**appPackage** フォルダーにある **trey-definition.json** ファイルを開きます。次の行を探します。

```json
    "paths": {
```

その前に以下の JSON を挿入します。

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

これにより、API を呼び出す際に使用される新しいセキュリティ スキームが設定されます。

次に、このスキームを各 API パスに追加します。各パスの `responses` オブジェクトを探します。

```json
    "responses": {
      ...
```

`responses` の前に次の JSON を挿入します（ファイル内に 5 ヶ所ありますので、すべてに挿入してください）。

```json
    "security": [
        {
            "oAuth2AuthCode": []
        }
    ],
```

編集後は必ず保存してください。

<cc-end-step lab="e6a" exercise="3" step="1" />

### Step 2: プラグイン ファイルを更新する

**appPackage** フォルダーの **trey-plugin.json** ファイルを開きます。ここには Open API Specification (OAS) ファイルに含まれていない、Copilot が必要とする情報が格納されています。

`Runtimes` の下に、`"type": "None"` として `auth` プロパティがあり、現在 API が認証されていないことを示しています。これを次のように変更し、Vault に保存した OAuth 設定を使用して Copilot が認証するようにします。

~~~json
  "auth": {
    "type": "OAuthPluginVault",
    "reference_id": "${{OAUTH2AUTHCODE_CONFIGURATION_ID}}"
  },
~~~

次のステップでは、実際の Microsoft 365 ユーザーとして API にアクセスできるよう、アプリケーション コードを更新します。これにより「Avery Howard」という仮名ではなく、実ユーザーで処理します。

<cc-end-step lab="e6a" exercise="3" step="2" />

## Exercise 4: アプリケーション コードの更新

### Step 1: JWT 検証ライブラリをインストールする

作業ディレクトリのコマンドラインで次を実行します。

~~~sh
npm i jwt-validate
~~~

これにより、受信した Entra ID 認可トークンを検証するライブラリがインストールされます。

!!! warning
    Microsoft では NodeJS 向けに Entra ID トークンを検証する公式ライブラリを提供していません。その代わり、[詳細なドキュメント](https://learn.microsoft.com/entra/identity-platform/access-tokens#validate-tokens){target=_blank} で独自実装方法を説明しています。[Microsoft MVP の Andrew Connell](https://www.voitanos.io/pages/about/#whos-behind-voitanos){target=_blank} が執筆した [参考記事](https://www.voitanos.io/blog/validating-entra-id-generated-oauth-tokens/){target=_blank} も有用です。  

    **本ラボでは、[Waldek Mastykarz](https://github.com/waldekmastykarz){target=_blank} 氏が提供する [コミュニティ ライブラリ](https://www.npmjs.com/package/jwt-validate){target=_blank} を使用します。このライブラリは上記ガイダンスに従うことを意図していますが、Microsoft によるサポートはなく MIT License で提供されています。利用は自己責任でお願いします。**  

    サポートされるライブラリの進捗を追跡したい場合は [この GitHub issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/6113){target=_blank} を参照してください。

<cc-end-step lab="e6a" exercise="4" step="1" />

### Step 2: Identity サービスを更新する

現時点で OAuth ログインは機能し、有効なアクセストークンが取得できますが、コードでトークンが有効かどうかを確認しなければソリューションは安全ではありません。この手順では、トークンを検証し、ユーザー名や ID などの情報を抽出するコードを追加します。

**src/services** フォルダー内の **IdentityService.ts** を開きます。  
ファイル冒頭の `import` 群に次の行を追加します。

~~~typescript
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
~~~

続いて `class Identity` 宣言の直下に次の行を追加します。

~~~typescript
    private validator: TokenValidator;
~~~

次に、以下のコメントを探します。

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

!!! Note "コードを読み解く"
    新しいコードを確認してください。まず `Authorization` ヘッダーからトークンを取得します。このヘッダーは `"Bearer " + トークン` という形式なので、JavaScript の `split(" ")` でトークン部分だけを抽出しています。

    認証が失敗した場合は例外をスローし、Azure Function が適切なエラーを返します。

    次に `jwt-validate` ライブラリ用のバリデーターを作成します。この呼び出しでは Entra ID から署名鍵を取得するため、非同期で時間がかかる場合があります。

    続いて `ValidateTokenOptions` を設定します。ライブラリは、Entra ID の署名鍵で署名されていることに加え、次を検証します。  

    * _audience_ が API サービス アプリ URI と一致する  
    * _issuer_ が対象テナントのセキュリティ トークン サービスである  
    * _scope_ がアプリ登録で定義した `"access_as_user"` と一致する  

    トークンが有効な場合、ユーザーの一意 ID、名前、メールなどの「クレーム」を含むオブジェクトが返されます。これらを使うことで、架空の「Avery Howard」に頼らず実ユーザーで処理します。

<cc-end-step lab="e6a" exercise="4" step="2" />

## Exercise 5: アプリケーションのテスト

### Step 1: アプリ マニフェストのバージョン番号を更新する

アプリをテストする前に、`appPackage\manifest.json` のマニフェスト バージョンを更新します。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` を開きます。  
2. JSON 内の `version` フィールドを探します。例:  
      ```json
   "version": "1.0.0"
   ```  
3. バージョン番号を小さくインクリメントします。例:  
      ```json
   "version": "1.0.1"
   ```  
4. 変更後、ファイルを保存します。

!!! warning "`jwt-validate` パッケージのコンパイル問題"
    現在 `jwt-validate` パッケージは `@types/jsonwebtoken` の型エラーを投げる場合があります。回避策としてプロジェクト ルートの `tsconfig.json` に `"skipLibCheck": true` を追加してください。将来のライブラリ バージョンで修正される予定で、実施時点では不要になっている可能性もあります。

<cc-end-step lab="e6a" exercise="5" step="1" />

### Step 2: アプリケーションを再起動する

前のラボからアプリがまだ実行中の場合は停止し、アプリ パッケージを再生成させます。

その後 F5 を押してアプリを再度実行し、以前と同様にインストールします。

<cc-end-step lab="e6a" exercise="5" step="2" />

### Step 3: 宣言型エージェントを実行する

Microsoft 365 Copilot に戻り、Trey Research エージェントを選択します。  
プロンプトに「私が担当している Trey のプロジェクトは？」と入力します。API を呼び出してよいかを確認するカードが表示される場合があります。ここでは認証は行われていませんので、「Allow Once」をクリックしてください。

![Microsoft 365 Copilot showing a confirmation card asking if it is ok to call your API. There are buttons to 'Always allow', 'Allow once', or 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-01small.png)

確認カードはログイン カードに置き換わります。  
「Sign in to Trey」をクリックしてサインインします。最初はログインと権限付与を求めるポップアップが表示されます。以後はブラウザーに資格情報がキャッシュされるため、表示されないことがあります。

![Microsoft 365 Copilot showing a login card with a button to 'Sign in to Trey' and another one to 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-02small.png)

!!! tip "管理者承認が必要な場合"
    管理者がユーザーによる同意を許可していない場合、以下のような画面が表示されることがあります。  

    ![The Microsoft Entra popup dialog asking for an admin approval to consume the API.](../../assets/images/extend-m365-copilot-06/need-admin-approval.png)

    これは、管理者がアプリケーションへの権限付与を制限しているためです。この場合は管理者に依頼して、プラグイン API の登録に対しグローバル同意を手動で付与してもらう必要があります。Microsoft 365 管理センター / Identity / Applications / App Registrations で該当アプリを開き、以下のように同意を実行します。

    ![The 'API permissions' page of the 'API Plugin' application registered in Microsoft Entra with the 'Grant admin consent ...' command highlighted.](../../assets/images/extend-m365-copilot-06/approval-admin.png)

ログイン カードは Copilot の応答に置き換わります。データベースに追加されたばかりのため、まだプロジェクトに割り当てられていません。

ユーザーは架空の「Avery Howard」ではなくなりました。初回実行時にユーザー ID が見つからないため、新しいコンサルタント レコードが作成され、まだプロジェクトに割り当てられていません。

!!! note "ユーザー情報の更新"
    本ラボでは便宜上、スキルや所在地などの詳細をハードコードしています。変更したい場合は [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/){target=_blank} を使用して編集できます。  

    ![The Azure Storage Explorer in action while editing the Consultant table. The actual current user is highlighted.](../../assets/images/extend-m365-copilot-06/oauth-azure-storage-explorer.png)
    
<cc-end-step lab="e6a" exercise="5" step="3" />

### Step 4: 自分をプロジェクトに追加する

データベースに追加されたばかりなので、まだプロジェクトに割り当てられていません。プロジェクトの割り当ては `Assignment` テーブルに保存され、プロジェクト ID と割り当てられたコンサルタントの ID を参照します。  
「担当スキルと割り当てプロジェクトは？」と問い合わせると、プロジェクトが見つからないがスキルとロールを提示し支援を申し出ます。

![The response from the 'Trey Genie' agent when the actual user doesn't have any assigned project.](../../assets/images/extend-m365-copilot-06/oauth-run-03bsmall.png)

Agent に「Woodgrove プロジェクトに参加させて」と依頼します。必要な情報が抜けている場合、Agent は詳細を確認します。

![The response from the 'Trey Genie' agent when adding the current user to a project. If some information are missing, Copilot asks to confirm them. Once all the information are provided, the agent provides a confirmation of the action.](../../assets/images/extend-m365-copilot-06/oauth-run-05.png)

不足情報を提供すると、Agent は再確認したうえで処理を続行します。

![The response from the 'Trey Genie' agent when adding the current user to a project. If some information are missing, Copilot asks to confirm them. Once all the information are provided, the agent provides a confirmation of the action.](../../assets/images/extend-m365-copilot-06/oauth-run-06.png)

最終確認後、Agent は適切なロールと予測でプロジェクトに追加します。

![The response from the 'Trey Genie' agent after adding user to project](../../assets/images/extend-m365-copilot-06/oauth-run-07.png)

続いて「私のスキルと割り当てられているプロジェクトは？」と尋ねて、デフォルトのスキルとプロジェクト割り当てを確認しましょう。

<cc-end-step lab="e6a" exercise="5" step="4" />

---8<--- "ja/e-congratulations.md"

ラボ Ea6「Agents Toolkit で Entra ID 認証を追加」を完了しました。  

何か面白いことを試したいですか？ソリューションに Copilot Connector を追加してみましょう。

<cc-next url="../07-add-graphconnector" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/06a-add-authentication" />