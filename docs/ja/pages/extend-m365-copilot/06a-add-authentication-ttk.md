---
search:
  exclude: true
---
# ラボ E6a - OAuth で Entra ID 認証を追加 (Agents Toolkit)

このラボでは、OAuth 2.0 を使用して Entra ID を ID プロバイダーとする API プラグインに認証を追加します。Agents Toolkit を設定して、Entra ID と Teams Developer Portal の登録を自動化する方法を学びます。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/1IhyztqkuJo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認できます。</div>
            <div class="note-box">
            📘 <strong>注意:</strong> このラボは前回の Lab E5 を基盤としています。Lab E5 を完了している場合は、同じフォルダーで作業を続行できます。まだの場合は、<a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a>
    から Lab E5 のソリューション フォルダーをコピーして作業してください。
    このラボの完成版ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END" target="_blank">src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END </a> フォルダーにあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## 演習 1: ローカル Agents Toolkit 構成の更新

この演習では、Agents Toolkit の構成ファイルを変更し、Entra ID へのアプリ登録および Teams Developer Portal の「Vault」への情報配置を自動化します。

### 手順 1: Entra ID アプリ マニフェストを追加

作業フォルダーのルートに **aad.manifest.json** という新しいファイルを作成し、次の行をコピーします。

```json
{
  "id": "${{AAD_APP_OBJECT_ID}}",
  "appId": "${{AAD_APP_CLIENT_ID}}",
  "displayName": "Trey-Research-OAuth-aad",
  "identifierUris": [
    "api://${{AAD_APP_CLIENT_ID}}"
  ],
  "signInAudience": "AzureADMyOrg",
  "api": {
    "requestedAccessTokenVersion": 2,
    "oauth2PermissionScopes": [
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
    ]
  },
  "info": {},
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
  "publicClient": {
    "redirectUris": []
  },
  "web": {
    "redirectUris": [
      "https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect"
    ],
    "implicitGrantSettings": {}
  },
  "spa": {
    "redirectUris": []
  }
}

```

このファイルには、登録または更新される Entra ID アプリケーションの詳細が含まれています。`${{AAD_APP_CLIENT_ID}}` のようなトークンは、Agents Toolkit がアプリケーションをプロビジョニングする際に実際の値に置き換えられます。

!!! note
    Entra ID は以前「Azure Active Directory」と呼ばれていました。「AAD」という表記は旧名称である Entra ID を指します。

<cc-end-step lab="e6a" exercise="1" step="1" />

### 手順 2: **teamsapp.local.yml** のファイル バージョン番号を更新

**m365agents.local.yml** ファイルには、ローカルでソリューションを実行・デバッグするための Agents Toolkit への指示が含まれています。この演習の残りではこのファイルを更新します。


!!! warning yaml ではインデントが重要
    yaml ファイルの編集は、階層をインデントで表すため少し難しい場合があります。各変更時に正しくインデントしないとラボが動作しません。不明な場合は、完成版ソリューション ファイル [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END/m365agents.local.yml){_target=blank} を参照してください。

<cc-end-step lab="e6a" exercise="1" step="2" />

### 手順 3: Entra ID アプリケーションをプロビジョニング

アプリケーションがユーザーを認証し、何らかの操作を許可するには、まず Entra ID にアプリを登録する必要があります。この手順では、アプリ登録がまだ存在しない場合に追加します。

ファイル内で次の行を探します。

```yaml
provision:
  # Creates a Teams app
```
`provision:` 行の直下に、以下の yaml を挿入します。読みやすさのために空行を入れても構いません。

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

`signInAudience` を `AzureADMyOrg` に設定すると、Agents Toolkit は登録した Entra ID テナント内でのみ使用できるシングル テナント アプリを作成します。お客様のテナントなど他のテナントでも使用できるようにしたい場合は、`AzureADMultipleOrgs` に設定します。3 つのステップすべてで、前の手順で作成した **aad.manifest.json** ファイルを使用します。

また、このステップでは複数の値が環境ファイルに書き込まれ、それらは **aad.manifest.json** およびアプリ パッケージにも挿入されます。

<cc-end-step lab="e6a" exercise="1" step="3" />

### 手順 4: Entra ID アプリケーションを更新

**m365agents.local.yml** で次の行を探します  
```yaml
  # Build app package with latest env value
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
      apiSpecPath: ./appPackage/apiSpecificationFile/trey-definition.json
    writeToEnvironmentFile:
      configurationId: OAUTH2AUTHCODE_CONFIGURATION_ID

  - uses: oauth/update
    with:
      name: oAuth2AuthCode
      appId: ${{TEAMS_APP_ID}}
      clientId: ${{AAD_APP_CLIENT_ID}}
      # Path to OpenAPI description document
      apiSpecPath: ./appPackage/apiSpecificationFile/trey-definition.json
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

`oauth/register` と `oauth/update` ステップは、Teams Developer Portal の Vault にアプリケーションを登録し、Copilot が OAuth 2.0 Auth Code 認可フローを実装するために必要な詳細を取得できるようにします。`aadApp/update` ステップは Entra ID アプリケーション自体を更新します。これらの詳細は別ファイル **aad.manifest.json** にありますが、次の演習で追加します。

<cc-end-step lab="e6a" exercise="1" step="4" />


### 手順 5: Entra ID の値をアプリケーション コードで使用可能にする

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

このコードはアプリケーション コード内で使用する環境変数を公開しています。`STORAGE_ACCOUNT_CONNECTION_STRING` の下に次の行を追加して、これらを利用できるようにします。

```yaml
        AAD_APP_TENANT_ID: ${{AAD_APP_TENANT_ID}}
        AAD_APP_CLIENT_ID: ${{AAD_APP_CLIENT_ID}}
```

<cc-end-step lab="e6a" exercise="1" step="5" />


## 演習 2: アプリケーション パッケージの更新

Agents Toolkit が Entra ID の登録を設定したので、今度は Copilot が認証を認識できるようにアプリケーション パッケージを更新します。この演習では必要なファイルを編集します。

### 手順 1: Open API Specification ファイルを更新

Visual Studio Code で作業フォルダーを開きます。**appPackag/apiSpecificationFile** フォルダーの **trey-definition.json** を開き、次の行を探します。

```json
    "paths": {
```

その前に次の JSON を挿入します。

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

これにより、API 呼び出し時に使用する新しいセキュリティ スキームが設定されます。

次に、このスキームを各 API パスに追加します。各パスの `responses` オブジェクトを探してください。

```json
    "responses": {
      ...
```

ファイル内に 5 箇所ある `responses` の前に、以下の JSON を挿入します。（すべての箇所で挿入することを忘れないでください。）

```json
    "security": [
        {
            "oAuth2AuthCode": []
        }
    ],
```

編集後は必ず保存してください。

<cc-end-step lab="e6a" exercise="2" step="1" />

### 手順 2: プラグイン ファイルを更新

**appPackage/** フォルダーの **trey-plugin.json** を開きます。ここには、Open API Specification (OAS) ファイルにはないが Copilot が必要とする情報が格納されています。

`Runtimes` の下に `auth` プロパティがあり、`"None"` として API が未認証であることを示しています。Vault に保存した OAuth 設定を使用して認証するように以下のように変更します。

~~~json
  "auth": {
    "type": "OAuthPluginVault",
    "reference_id": "${{OAUTH2AUTHCODE_CONFIGURATION_ID}}"
  },
~~~

次の演習では、実際の Microsoft 365 ユーザーとして API にアクセスし、有効なログインを確認するようにアプリケーション コードを更新します。これにより、Microsoft の架空名「Avery Howard」ではなく実ユーザーが使用されます。

<cc-end-step lab="e6a" exercise="3" step="2" />

## 演習 3: アプリケーション コードの更新

### 手順 1: JWT 検証ライブラリをインストール

作業ディレクトリのコマンド ラインで次を実行します。

~~~sh
npm i jwt-validate
~~~

これにより Entra ID 認可トークンを検証するライブラリがインストールされます。

!!! warning
    Microsoft は NodeJS 用の Entra ID トークン検証ライブラリをサポートしていませんが、代わりに [詳細なドキュメント](https://learn.microsoft.com/entra/identity-platform/access-tokens#validate-tokens){target=_blank} を提供し、独自実装方法を説明しています。[別の参考記事](https://www.andrewconnell.com/articles/entra-id-validating-generated-oauth-tokens/){target=_blank} も [Microsoft MVP Andrew Connell](https://www.andrewconnell.com/pages/voitanos/){target=_blank} から利用できます。

    **このラボでは [Waldek Mastykarz](https://github.com/waldekmastykarz){target=_blank} が提供する [コミュニティ ライブラリ](https://www.npmjs.com/package/jwt-validate){target=_blank} を使用しています。本ライブラリは MIT License で、Microsoft のサポート対象外です。利用は自己責任でお願いします。**
    
    サポート ライブラリの進捗を追跡したい場合は、[この Github issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/6113){target=_blank} をフォローしてください。

<cc-end-step lab="e6a" exercise="3" step="1" />

### 手順 2: Identity サービスを更新

現時点で OAuth ログインは機能し、有効なアクセストークンが取得できますが、トークンが有効かどうかコードで確認しなければソリューションは安全ではありません。この手順ではトークンの検証と、ユーザー名・ID などの情報抽出を行うコードを追加します。

**src/services** フォルダーの **IdentityService.ts** を開きます。  
ファイル上部の他の `import` 文と並べて、次を追加します。

~~~typescript
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
~~~

次に、`class Identity` 宣言の直下に次の行を追加します。

~~~typescript
    private validator: TokenValidator;
~~~

次に、コメント

~~~typescript
// ** INSERT REQUEST VALIDATION HERE (see Lab E6) **
~~~

を探し、次のコードに置き換えます。

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

!!! note "コードから学ぶ"
    新しいコードを確認してみましょう。まず、HTTPS リクエストの `Authorization` ヘッダーからトークンを取得します。このヘッダーには「Bearer」と半角スペース、その後にトークンが入っているため、JavaScript の `split(" ")` を使ってトークンだけを取り出します。

    また、認証に失敗すると例外がスローされ、Azure Function は適切なエラーを返します。

    次に `jwks-validate` ライブラリ用のバリデーターを作成します。この呼び出しは Entra ID から最新の署名キーを取得するため、非同期で時間がかかる場合があります。

    その後 `ValidateTokenOptions` オブジェクトを設定します。このオブジェクトに基づき、Entra ID の秘密鍵で署名されているかに加え、以下が検証されます。

    * _audience_ が API サービス アプリ URI と一致していること（トークンが本 Web サービス向けであることを保証）
    * _issuer_ が自テナントのセキュリティ トークン サービスであること
    * _scope_ がアプリ登録で定義した `"access_as_user"` と一致していること

    トークンが有効な場合、ライブラリはユーザー固有 ID、名前、メールなどの「クレーム」を含むオブジェクトを返します。これらを使用し、架空名「Avery Howard」に依存しません。

<cc-end-step lab="e6a" exercise="3" step="2" />

## 演習 4: アプリケーションをテスト

### 手順 1: アプリ マニフェストのバージョン番号を更新

テスト前に `appPackage\manifest.json` のマニフェスト バージョンを更新します。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` を開きます。

2. JSON 内の `version` フィールドを探します。以下のようになっています。  
   ```json
   "version": "1.0.0"
   ```

3. バージョン番号を小さくインクリメントします。例:  
   ```json
   "version": "1.0.1"
   ```

4. 変更後、ファイルを保存します。

!!! warning "jwt-validate パッケージのコンパイル問題"
    現在、jwt-validate パッケージは @types/jsonwebtoken の型エラーを投げます。回避策として、プロジェクト ルートの tsconfig.json に `"skipLibCheck": true` を追加してください。将来のライブラリ更新で修正される可能性があります。

<cc-end-step lab="e6a" exercise="4" step="1" />

### 手順 2: アプリケーションを再起動

前のラボからアプリがまだ実行中の場合は停止し、アプリ パッケージを再生成させます。

その後 F5 を押して再度アプリを実行し、これまでと同様にインストールします。

<cc-end-step lab="e6a" exercise="4" step="2" />

### 手順 3: 宣言型エージェントを実行

Microsoft 365 Copilot に戻り、Trey Research エージェントを選択します。  
次のプロンプトを入力します。

*What Trey projects am I assigned to?*

「Sign in」を求められます。これはエージェントが認証メカニズムを使用していることを示しています。

「Sign in to Trey-Researchlocal」をクリックしてサインインします。最初はログインと権限付与のポップアップが表示されます。次回以降はブラウザーにキャッシュされた認証情報により表示されない場合があります。


![Microsoft 365 Copilot showing a login card with a button to 'Sign in to Trey' and another one to 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-02small.png)

!!! tip "管理者承認が必要な場合"
    管理者がユーザー自身の同意を許可していない場合、次のような画面が表示されることがあります。

    ![The Microsoft Entra popup dialog asking for an admin approval to consume the API.](../../assets/images/extend-m365-copilot-06/need-admin-approval.png)

    これは管理者がアプリケーションへの権限付与を制限しているためです。この場合、管理者に依頼してプラグイン API 登録に対してグローバル同意を手動で与えてもらう必要があります。Microsoft 365 管理センター / Identity / Applications / App Registrations でアプリ登録を見つけ、そこで同意を行います。

    ![The 'API permissions' page of the 'API Plugin' application registered in Microsoft Entra with the 'Grant admin consent ...' command highlighted.](../../assets/images/extend-m365-copilot-06/approval-admin.png)

ログイン カードは、プロンプトへのエージェント応答に置き換わります。データベースに追加されたばかりなので、担当プロジェクトはまだありません。

ユーザーは架空の「Avery Howard」にハードコードされていました。新しいコードが最初に実行されると、あなたのユーザー ID が見つからないため新しい Consultant レコードが作成されますが、まだプロジェクトには割り当てられていません。

!!! note "ユーザー情報の更新"
    これはラボ用なので、新しいユーザー アカウントのスキルや所在地などをハードコードしています。変更したい場合は [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/){target=_blank} を使用して編集できます。

    ![The Azure Storage Explorer in action while editing the Consultant table. The actual current user is highlighted.](../../assets/images/extend-m365-copilot-06/oauth-azure-storage-explorer.png)
    
<cc-end-step lab="e6a" exercise="4" step="3" />

### 手順 4: 自分をプロジェクトに追加

データベースに追加されたばかりなので、まだプロジェクトに割り当てられていません。プロジェクトの割り当ては `Assignment` テーブルに保存され、プロジェクト ID と割り当てられた Consultant の consultant ID を参照します。  
エージェントに自分の担当プロジェクトを尋ねると、担当プロジェクトが見つからないものの、スキルとロールを認識して手助けを提案します。

![The response from the 'Trey Genie' agent when the actual user doesn't have any assigned project.](../../assets/images/extend-m365-copilot-06/oauth-run-03bsmall.png)

エージェントに Woodgrove プロジェクトへあなたを追加するよう依頼してください。必要な値を忘れた場合、エージェントは詳細を確認します。

![The response from the 'Trey Genie' agent when adding the current user to a project. If some information are missing, Copilot asks to confirm them. Once all the information are provided, the agent provides a confirmation of the action.](../../assets/images/extend-m365-copilot-06/oauth-run-05.png)


最後に確認すると、エージェントは適切なロールと予測を設定してあなたをプロジェクトに追加します。

![The response from the 'Trey Genie' agent after adding user to project](../../assets/images/extend-m365-copilot-06/oauth-run-07.png)

次のプロンプトで既定のスキルとプロジェクト割り当てを確認しましょう。

*What are my skills and what projects am I assigned to?*

<cc-end-step lab="e6a" exercise="4" step="4" />

---8<--- "ja/e-congratulations.md"

これでラボ Ea6、Agents Toolkit での Entra ID 認証追加が完了しました!

何か面白いことに挑戦したいですか? Copilot Connector をソリューションに追加してみましょう。

<cc-next url="../07-add-graphconnector" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/06a-add-authentication--ja" />