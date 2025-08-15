---
search:
  exclude: true
---
# ラボ BTA4 - シングル サインオン認証の追加

このラボでは、Career Genie で Entra シングル サインオンを使用して **ユーザー** を認証し、取得したトークンで Microsoft Graph API を呼び出してログイン中の **ユーザー** 情報を取得する方法を学習します。

このラボで学ぶこと:

- Entra ID シングル サインオン (SSO) をアプリに追加し、Microsoft Teams と同じアカウントでシームレスにログインできるようにする  
- Teams AI ライブラリと Bot Framework を使用してシングル サインオンを実装する  
- アプリ **ユーザー** のトークンを取得して利用し、セキュリティと **ユーザー** エクスペリエンスを向上させる  



<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/5oyftU9PRpM" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## はじめに

Entra ID (旧 Azure AD) のシングル サインオン (SSO) を Career Genie に統合して、強化されたエクスペリエンスを実現しましょう。これにより、Microsoft Graph を介して Microsoft 365 データへアクセスするためのトークンをスムーズに取得し、認証と認可を円滑に行えます。ここでは、Teams AI ライブラリと Bot Framework を使用し、マルチテナント構成に焦点を当てた SSO 機能を組み込みます。

## 演習 1: Entra ID シングル サインオン用にプロジェクトを設定する

Entra ID で保護されるアプリは登録と権限付与が必要です。M365 Agents Toolkit がこの作業を自動化しますが、プロジェクトを更新して有効化する必要があります。この演習では、M365 Agents Toolkit のプロジェクト ファイルを変更し、Entra ID にアプリ登録をプロビジョニングします。

この演習では、[Lab B3 のソース コード](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab03-Powered-by-AI/CareerGenie){target=_blank} をベース プロジェクトとして使用し、次の手順を進めてください。

### 手順 1: Entra ID アプリを定義する App manifest ファイルを追加する

この手順では、M365 Agents Toolkit が Entra ID に登録するアプリケーションを定義するファイルを追加します。この manifest ファイルでアプリ登録のさまざまな側面をカスタマイズできます。例えば、ここでは Microsoft Graph API の `User.Read` 権限を設定して、アプリが **ユーザー** のプロファイルを読み取れるようにします。

プロジェクト フォルダーのルートに **aad.manifest.json** ファイルを作成し、次の JSON を貼り付けます。

```JSON
{
    "id": "${{AAD_APP_OBJECT_ID}}",
    "appId": "${{AAD_APP_CLIENT_ID}}",
    "name": "CareerGenieBot-aad",
    "accessTokenAcceptedVersion": 2,
    "signInAudience": "AzureADMultipleOrgs",
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
    "requiredResourceAccess": [
        {
            "resourceAppId": "Microsoft Graph",
            "resourceAccess": [
                {
                    "id": "User.Read",
                    "type": "Scope"
                }
            ]
        }
    ],
    "oauth2Permissions": [
        {
            "adminConsentDescription": "Allows Teams to call the app's web APIs as the current user.",
            "adminConsentDisplayName": "Teams can access app's web APIs",
            "id": "${{AAD_APP_ACCESS_AS_USER_PERMISSION_ID}}",
            "isEnabled": true,
            "type": "User",
            "userConsentDescription": "Enable Teams to call this app's web APIs with the same rights that you have",
            "userConsentDisplayName": "Teams can access app's web APIs and make requests on your behalf",
            "value": "access_as_user"
        }
    ],
    "preAuthorizedApplications": [
        {
            "appId": "1fec8e78-bce4-4aaf-ab1b-5451cc387264",
            "permissionIds": [
                "${{AAD_APP_ACCESS_AS_USER_PERMISSION_ID}}"
            ]
        },
        {
            "appId": "5e3ce6c0-2b1f-4285-8d4b-75ee78787346",
            "permissionIds": [
                "${{AAD_APP_ACCESS_AS_USER_PERMISSION_ID}}"
            ]
        },
        {
            "appId": "d3590ed6-52b3-4102-aeff-aad2292ab01c",
            "permissionIds": [
                "${{AAD_APP_ACCESS_AS_USER_PERMISSION_ID}}"
            ]
        },
        {
            "appId": "00000002-0000-0ff1-ce00-000000000000",
            "permissionIds": [
                "${{AAD_APP_ACCESS_AS_USER_PERMISSION_ID}}"
            ]
        },
        {
            "appId": "bc59ab01-8403-45c6-8796-ac3ef710b3e3",
            "permissionIds": [
                "${{AAD_APP_ACCESS_AS_USER_PERMISSION_ID}}"
            ]
        },
        {
            "appId": "0ec893e0-5785-4de6-99da-4ed124e5296c",
            "permissionIds": [
                "${{AAD_APP_ACCESS_AS_USER_PERMISSION_ID}}"
            ]
        },
        {
            "appId": "4765445b-32c6-49b0-83e6-1d93765276ca",
            "permissionIds": [
                "${{AAD_APP_ACCESS_AS_USER_PERMISSION_ID}}"
            ]
        },
        {
            "appId": "4345a7b9-9a63-4910-a426-35363201d503",
            "permissionIds": [
                "${{AAD_APP_ACCESS_AS_USER_PERMISSION_ID}}"
            ]
        }
    ],
    "identifierUris":[
        "api://botid-${{BOT_ID}}"
    ],
    "replyUrlsWithType":[
        {
          "url": "https://${{BOT_DOMAIN}}/auth-end.html",
          "type": "Web"
        }
    ]
}
```

<cc-end-step lab="bta4" exercise="1" step="1" />

### 手順 2: M365 Agents Toolkit 設定ファイルを更新して Entra ID アプリを作成する

`teamsapp.local.yml` ファイルを開きます。これは、M365 Agents Toolkit がプロジェクトを実行する際の手順を定義する YAML ファイルです。M365 Agents Toolkit の UI には「LIFECYCLE」セクションに 3 つのステップがあります。

- Provision - インフラを作成するフェーズ。ボット登録、Teams アプリ パッケージ、今回の Entra ID アプリ登録などが含まれます  
- Deploy - コードをビルドしてローカルで実行する、または「local」以外の環境では Azure にアップロードするフェーズ  
- Publish - アプリ パッケージを Microsoft Teams に公開するフェーズ  

Entra ID アプリをプロビジョニングするため、**teamsapp.local.yml** に次の行を `provision` のすぐ下に追加してください。

```yml
  - uses: aadApp/create # Creates a new Entra ID (AAD) app to authenticate users if the environment variable that stores clientId is empty
    with:
      name: CareerGenieBot-aad # Note: when you run aadApp/update, the AAD app name will be updated based on the definition in manifest. If you don't want to change the name, make sure the name in AAD manifest is the same with the name defined here.
      generateClientSecret: true # If the value is false, the action will not generate client secret for you
      signInAudience: "AzureADMultipleOrgs" # Authenticate users with a Microsoft work or school account in your organization's Entra ID tenant (for example, single tenant).
    writeToEnvironmentFile: # Write the information of created resources into environment file for the specified environment variable(s).
      clientId: AAD_APP_CLIENT_ID
      clientSecret: SECRET_AAD_APP_CLIENT_SECRET # Environment variable that starts with `SECRET_` will be stored to the .env.{envName}.user environment file
      objectId: AAD_APP_OBJECT_ID
      tenantId: AAD_APP_TENANT_ID
      authority: AAD_APP_OAUTH_AUTHORITY
      authorityHost: AAD_APP_OAUTH_AUTHORITY_HOST

```

続いて、`botFramework/create` の後に以下を追加して既存 AAD アプリを更新します。

```yml
  - uses: aadApp/update # Apply the AAD manifest to an existing AAD app. Will use the object id in manifest file to determine which AAD app to update.
    with:
      manifestPath: ./aad.manifest.json # Relative path to teamsfx folder. Environment variables in manifest will be replaced before apply to AAD app
      outputFilePath: ./build/aad.manifest.${{TEAMSFX_ENV}}.json
```

!!! tip "ヒント: YAML のインデント"
    YAML では正しいインデントが必須です。各階層はスペース 2 つ (タブは不可) でインデントすると良いでしょう。Visual Studio Code はサポートしており、構文エラーは赤線で示されます。赤線が消えれば OK です!

次に、deploy フェーズ内の `file/createOrUpdateEnvironmentFile` ディレクティブを探し、前回のラボで追加したものの下に次の変数を `envs:` コレクションへ追加します。

```yml
 BOT_DOMAIN: ${{BOT_DOMAIN}}
 AAD_APP_CLIENT_ID: ${{AAD_APP_CLIENT_ID}}
 AAD_APP_CLIENT_SECRET: ${{SECRET_AAD_APP_CLIENT_SECRET}}
 AAD_APP_TENANT_ID: ${{AAD_APP_TENANT_ID}}
 AAD_APP_OAUTH_AUTHORITY_HOST: ${{AAD_APP_OAUTH_AUTHORITY_HOST}}
 AAD_APP_OAUTH_AUTHORITY: ${{AAD_APP_OAUTH_AUTHORITY}}
```

<cc-end-step lab="bta4" exercise="1" step="2" />

## 演習 2: Teams アプリ manifest に SSO を追加する

この演習では、Teams アプリ manifest を更新してシングル サインオンを追加します。

### 手順 1: Teams アプリ manifest の SSO 対応を更新する

シングル サインオンでは、Teams がアプリの Entra ID アクセス トークンをコードに渡します。ただし Teams は、アプリの (クライアント) ID と Teams に接続されているボットの ID を知っていなければトークンを提供できません。そのため、Teams アプリ manifest にこの情報を追加する必要があります。

**./appPackage/manifest.json** にある Teams アプリの manifest テンプレートを開き、以下を追加します。

```json
 "webApplicationInfo": {
        "id": "${{BOT_ID}}",
        "resource": "api://botid-${{BOT_ID}}"
    }
```

`validDomains` ノードの下にコンマ区切りで追加してください。

ついでに、ボットのドメインから Web ページを表示できるよう Teams に知らせる必要があります。これにより `auth-start.html` と `auth-end.html` へアクセスでき、Microsoft Graph 呼び出しの **ユーザー** 同意が行われます。これは **ユーザー** がカスタム エンジン エージェントへ初めてアクセスする際にのみ発生します。

したがって、ボット ドメイン **${{BOT_DOMAIN}}** を `validDomains` 配列に追加します。変更後、`manifest.json` の末尾は次のようになります。

```JSON
  "validDomains": [
        "${{BOT_DOMAIN}}",
        "*.botframework.com"
    ],
```

<cc-end-step lab="bta4" exercise="2" step="1" />

## 演習 3: アプリケーション コードを SSO 対応に更新する

この演習では、SSO プロセスに対応するようコードを変更します。

### 手順 1: 同意ダイアログ用の HTML ページを用意する

**ユーザー** がアプリを初めて利用する際、プロファイル情報の読み取り許可を与えるために同意が必要となる場合があります。これは Teams AI ライブラリによって行われ、ポップアップ ウィンドウが表示されます。この HTML ページはポップアップで表示され、実際の同意は Entra ID で行われます。

> 許可付与のポップアップのコード スニペットは公式の [teams-ai library sample for Teams SSO](https://github.com/microsoft/teams-ai/tree/main/js/samples/05.authentication/d.teamsSSO-bot/src/public){target=_blank} から引用しています。

プロジェクトの **src** フォルダー内に **public** フォルダーを作成します。

**auth-start.html** ファイルを作成し、次の内容を貼り付けます。

```html
<!--This file is used during the Teams Bot authentication flow to assist with retrieval of the access token.-->
<!--If you're not familiar with this, do not alter or remove this file from your project.-->
<html lang="en">

<head>
    <title>Login Start Page</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>

<body>
    <script type="text/javascript">
        popUpSignInWindow();

        async function popUpSignInWindow() {
            // Generate random state string and store it, so we can verify it in the callback
            let state = _guid();
            localStorage.setItem('state', state);
            localStorage.removeItem('codeVerifier');
            var currentURL = new URL(window.location);
            var clientId = currentURL.searchParams.get('clientId');
            var tenantId = currentURL.searchParams.get('tenantId');
            var loginHint = currentURL.searchParams.get('loginHint');
            var scope = currentURL.searchParams.get('scope');
            if (!loginHint) {
                loginHint = '';
            }
            var originalCode = _guid();
            var codeChallenge = await pkceChallengeFromVerifier(originalCode);
            localStorage.setItem('codeVerifier', originalCode);
            let queryParams = {
                client_id: clientId,
                response_type: 'code',
                response_mode: 'fragment',
                scope: scope,
                redirect_uri: window.location.origin + '/auth-end.html',
                nonce: _guid(),
                login_hint: loginHint,
                state: state,
                code_challenge: codeChallenge,
                code_challenge_method: 'S256'
            };
            let authorizeEndpoint = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${toQueryString(queryParams)}`;     
            window.location.assign(authorizeEndpoint);
        }

        // Build query string from map of query parameter
        function toQueryString(queryParams) {
            let encodedQueryParams = [];
            for (let key in queryParams) {
                encodedQueryParams.push(key + '=' + encodeURIComponent(queryParams[key]));
            }
            return encodedQueryParams.join('&');
        }

        // Converts decimal to hex equivalent      
        function _decimalToHex(number) {
            var hex = number.toString(16);
            while (hex.length < 2) {
                hex = '0' + hex;
            }
            return hex;
        }

        // Generates RFC4122 version 4 guid (128 bits)
        function _guid() {
            // RFC4122: The version 4 UUID is meant for generating UUIDs from truly-random or
            // pseudo-random numbers.
            // The algorithm is as follows:
            //     Set the two most significant bits (bits 6 and 7) of the
            //        clock_seq_hi_and_reserved to zero and one, respectively.
            //     Set the four most significant bits (bits 12 through 15) of the
            //        time_hi_and_version field to the 4-bit version number from
            //        Section 4.1.3. Version4
            //     Set all the other bits to randomly (or pseudo-randomly) chosen
            //     values.
            // UUID                   = time-low "-" time-mid "-"time-high-and-version "-"clock-seq-reserved and low(2hexOctet)"-" node
            // time-low               = 4hexOctet
            // time-mid               = 2hexOctet
            // time-high-and-version  = 2hexOctet
            // clock-seq-and-reserved = hexOctet:
            // clock-seq-low          = hexOctet
            // node                   = 6hexOctet
            // Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
            // y could be 1000, 1001, 1010, 1011 since most significant two bits needs to be 10
            // y values are 8, 9, A, B
            var cryptoObj = window.crypto || window.msCrypto; // for IE 11
            if (cryptoObj && cryptoObj.getRandomValues) {
                var buffer = new Uint8Array(16);
                cryptoObj.getRandomValues(buffer);
                //buffer[6] and buffer[7] represents the time_hi_and_version field. We will set the four most significant bits (4 through 7) of buffer[6] to represent decimal number 4 (UUID version number).
                buffer[6] |= 0x40; //buffer[6] | 01000000 will set the 6 bit to 1.
                buffer[6] &= 0x4f; //buffer[6] & 01001111 will set the 4, 5, and 7 bit to 0 such that bits 4-7 == 0100 = "4".
                //buffer[8] represents the clock_seq_hi_and_reserved field. We will set the two most significant bits (6 and 7) of the clock_seq_hi_and_reserved to zero and one, respectively.
                buffer[8] |= 0x80; //buffer[8] | 10000000 will set the 7 bit to 1.
                buffer[8] &= 0xbf; //buffer[8] & 10111111 will set the 6 bit to 0.
                return (
                    _decimalToHex(buffer[0]) +
                    _decimalToHex(buffer[1]) +
                    _decimalToHex(buffer[2]) +
                    _decimalToHex(buffer[3]) +
                    '-' +
                    _decimalToHex(buffer[4]) +
                    _decimalToHex(buffer[5]) +
                    '-' +
                    _decimalToHex(buffer[6]) +
                    _decimalToHex(buffer[7]) +
                    '-' +
                    _decimalToHex(buffer[8]) +
                    _decimalToHex(buffer[9]) +
                    '-' +
                    _decimalToHex(buffer[10]) +
                    _decimalToHex(buffer[11]) +
                    _decimalToHex(buffer[12]) +
                    _decimalToHex(buffer[13]) +
                    _decimalToHex(buffer[14]) +
                    _decimalToHex(buffer[15])
                );
            } else {
                var guidHolder = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
                var hex = '0123456789abcdef';
                var r = 0;
                var guidResponse = '';
                for (var i = 0; i < 36; i++) {
                    if (guidHolder[i] !== '-' && guidHolder[i] !== '4') {
                        // each x and y needs to be random
                        r = (Math.random() * 16) | 0;
                    }
                    if (guidHolder[i] === 'x') {
                        guidResponse += hex[r];
                    } else if (guidHolder[i] === 'y') {
                        // clock-seq-and-reserved first hex is filtered and remaining hex values are random
                        r &= 0x3; // bit and with 0011 to set pos 2 to zero ?0??
                        r |= 0x8; // set pos 3 to 1 as 1???
                        guidResponse += hex[r];
                    } else {
                        guidResponse += guidHolder[i];
                    }
                }
                return guidResponse;
            }
        }

        // Calculate the SHA256 hash of the input text.
        // Returns a promise that resolves to an ArrayBuffer
        function sha256(plain) {
            const encoder = new TextEncoder();
            const data = encoder.encode(plain);
            return window.crypto.subtle.digest('SHA-256', data);
        }

        // Base64-urlencodes the input string
        function base64urlencode(str) {
            // Convert the ArrayBuffer to string using Uint8 array to convert to what btoa accepts.
            // btoa accepts chars only within ascii 0-255 and base64 encodes them.
            // Then convert the base64 encoded to base64url encoded
            //   (replace + with -, replace / with _, trim trailing =)
            return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        }

        // Return the base64-urlencoded sha256 hash for the PKCE challenge
        async function pkceChallengeFromVerifier(v) {
            hashed = await sha256(v);
            return base64urlencode(hashed);
        }
    </script>
</body>

</html>
```

**auth-end.html** ファイルを作成し、次の内容を貼り付けます。

```html
<html lang="en">
    <head>
        <title>Login End Page</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>

    <body>
        <script
            src="https://statics.teams.cdn.office.net/sdk/v1.6.0/js/MicrosoftTeams.min.js"
            integrity="sha384-mhp2E+BLMiZLe7rDIzj19WjgXJeI32NkPvrvvZBrMi5IvWup/1NUfS5xuYN5S3VT"
            crossorigin="anonymous"
        ></script>
        <div id="divError"></div>
        <script type="text/javascript">
            microsoftTeams.initialize();
            let hashParams = getHashParameters();

            if (hashParams['error']) {
                // Authentication failed
                handleAuthError(hashParams['error'], hashParams);
            } else if (hashParams['code']) {
                // Get the stored state parameter and compare with incoming state
                let expectedState = localStorage.getItem('state');
                if (expectedState !== hashParams['state']) {
                    // State does not match, report error
                    handleAuthError('StateDoesNotMatch', hashParams);
                } else {
                    microsoftTeams.authentication.notifySuccess();
                }
            } else {
                // Unexpected condition: hash does not contain error or access_token parameter
                handleAuthError('UnexpectedFailure', hashParams);
            }

            // Parse hash parameters into key-value pairs
            function getHashParameters() {
                let hashParams = {};
                location.hash
                    .substr(1)
                    .split('&')
                    .forEach(function (item) {
                        let s = item.split('='),
                            k = s[0],
                            v = s[1] && decodeURIComponent(s[1]);
                        hashParams[k] = v;
                    });
                return hashParams;
            }

            // Show error information
            function handleAuthError(errorType, errorMessage) {
                const err = JSON.stringify({
                    error: errorType,
                    message: JSON.stringify(errorMessage)
                });
                let para = document.createElement('p');
                let node = document.createTextNode(err);
                para.appendChild(node);

                let element = document.getElementById('divError');
                element.appendChild(para);
            }
        </script>
    </body>
</html>

```

<cc-end-step lab="bta4" exercise="3" step="1" />

### 手順 2: SSO を処理するコードを更新する

- **index.ts** ファイルの変更:

静的ファイルを public フォルダーから提供するため、`path` の import を追加します。

```TypeScript
import * as path from 'path';
```

次に、`expressApp.listen` メソッドで `server` オブジェクトを初期化する行の直後に次のコードを追加します。

```TypeScript
const authFilePattern = /^\/auth-(start|end)\.html$/;
expressApp.get(
  authFilePattern, (req, res) => {
    const fileName = req.path;
    const filePath = path.join(__dirname, 'public', fileName);
    res.sendFile(filePath);
});
```

**adapter.ts** ファイルの変更:

- teams-ai ライブラリから `TeamsAdapter` をインポートします。

```TypeScript
import { TeamsAdapter } from '@microsoft/teams-ai';
```

- アダプター定義を `CloudAdapter` から `TeamsAdapter` に置き換えます。

```JavaScript
const adapter = new TeamsAdapter(
  {},
  new ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: config.MicrosoftAppId,
    MicrosoftAppPassword: config.MicrosoftAppPassword,
    MicrosoftAppType: 'MultiTenant',
  })
);

```

- もう不要となる `botFrameworkAuthentication` の定義をコメントアウトします。

**config.ts** ファイルの変更:

- 定数 `config` に次のプロパティを追加します。`process.env.INDEX_NAME` の後にコンマを追加して次のスニペットを挿入してください。

```TypeScript
aadAppClientId: process.env.AAD_APP_CLIENT_ID,
aadAppClientSecret: process.env.AAD_APP_CLIENT_SECRET,
aadAppOauthAuthorityHost: process.env.AAD_APP_OAUTH_AUTHORITY_HOST,
aadAppTenantId: process.env.AAD_APP_TENANT_ID,
botDomain: process.env.BOT_DOMAIN,
aadAppOauthAuthority: process.env.AAD_APP_OAUTH_AUTHORITY,
```

**app.ts** ファイルの変更:

- `TurnState` と `AuthError` モジュールを使用するため、以下のように `@microsoft/teams-ai` からインポートします。

```TypeScript
import { Application, ActionPlanner, OpenAIModel, PromptManager, AI, PredictedSayCommand, AuthError, TurnState } from "@microsoft/teams-ai";
```

- 認証設定を Application 定義へ渡すため、`const app` の定義を次のコードに置き換えます。

```TypeScript
const app = new Application({
  storage,
  authentication: {settings: {
    graph: {
      scopes: ['User.Read'],
      msalConfig: {
        auth: {
          clientId: config.aadAppClientId!,
          clientSecret: config.aadAppClientSecret!,
          authority: `${config.aadAppOauthAuthorityHost}/common`
        }
      },
      signInLink: `https://${config.botDomain}/auth-start.html`,
      endOnInvalidMessage: true
    }
  }},
  ai: {
    planner,
    //feedback loop is enabled
    enable_feedback_loop: true
  },
});
```

Teams AI ライブラリはカスタム エンジン エージェントと Microsoft Teams 間のトークン交換を処理するため、トークンを受け取ったらすぐに Microsoft Graph を呼び出せます。  
次に、Teams AI ライブラリを使用して各種認証およびメッセージング イベントを定義・処理するコードを追加します。アプリ定義の後に以下を貼り付けてください。

```TypeScript
interface ConversationState {
  count: number;
}
type ApplicationTurnState = TurnState<ConversationState>;
app.authentication.get('graph').onUserSignInSuccess(async (context: TurnContext, state: ApplicationTurnState) => {
  const token = state.temp.authTokens['graph'];
  await context.sendActivity(`Hello ${await getUserDisplayName(token)}. You have successfully logged in to CareerGenie!`);     
});
app.authentication
    .get('graph')
    .onUserSignInFailure(async (context: TurnContext, _state: ApplicationTurnState, error: AuthError) => {
        await context.sendActivity('Failed to login');
        await context.sendActivity(`Error message: ${error.message}`);
    });

    // Listen for user to say '/reset' and then delete conversation state
app.message('/reset', async (context: TurnContext, state: ApplicationTurnState) => {
  state.deleteConversationState();
  await context.sendActivity(`Ok I've deleted the current conversation state.`);
});

app.message('/signout', async (context: TurnContext, state: ApplicationTurnState) => {
  await app.authentication.signOutUser(context, state);

  // Echo back users request
  await context.sendActivity(`You have signed out`);
});

```

上記コードでは、トークンを正常に受け取った後に Microsoft Graph を呼び出して **ユーザー** 情報を取得する `getUserDisplayName()` 関数を呼び出しています。その関数を追加しましょう。まず [Graph SDK](https://github.com/microsoftgraph/msgraph-sdk-javascript){target=_blank} をインストールします。

ターミナルで次のコマンドを実行してください。

```PowerShell
npm install @microsoft/microsoft-graph-client @microsoft/microsoft-graph-types
```

続いて **app.ts** にパッケージから必要なモジュールをインポートします。

```TypeScript
import { Client } from "@microsoft/microsoft-graph-client";
```

`app.message` メソッドの後に次のコード スニペットを貼り付けます。

```TypeScript
async function getUserDisplayName(token: string): Promise<string | undefined> {
  let displayName: string | undefined;

  const client = Client.init({
    authProvider: (done) => {
      done(null, token);
    }
  });

  try {
    const user = await client.api('/me').get();
    displayName = user.displayName;
  } catch (error) {
    console.log(`Error calling Graph SDK in getUserDisplayName: ${error}`);
  }

  return displayName;
}
```

???+ "シングル テナントでのみ動作させる場合は以下を変更"
    - `aad.manifest.json` の `signInAudience` を `  "signInAudience": "AzureADMyOrg"` に更新  
    - `teamsapp.local.yml` の `aadApp\create` の `signInAudience` を `"signInAudience: "AzureADMyOrg"` に更新  
    - `src\app\app.ts` の Application 定義内認証設定 `authority` を `config.aadAppOauthAuthority` に更新  
    - `src\public\auth-start.html` の変数 `authorizeEndpoint` を `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${toQueryString(queryParams)}` に設定  
    - `src\adapter.ts` のアダプター定義を ` MicrosoftAppType: 'SingleTenant'` に更新  

<cc-end-step lab="bta4" exercise="3" step="2" />

## 演習 4: アプリケーションを実行する

これで Career Genie の Teams SSO 対応コードが完成しました。動作を確認しましょう。

### 手順 1: Teams でのアプリ インストール

Visual Studio Code の **Run and Debug** タブを選択し、**Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を選んでデバッグを開始します。ブラウザーで Microsoft Teams が開き、アプリ情報が表示されたら **Add** を選択してチャットを開始します。

!!! tip "ヒント: ローカルでのテスト"
    これまで実装した Teams AI ライブラリの機能の一部は Teams App Test Tool では正常に動作しない場合があります。必ず Teams 上でローカル テストとデバッグを行ってください。

<cc-end-step lab="bta4" exercise="4" step="1" />

### 手順 2: 同意の付与

Career Genie と対話を始めるには、メッセージを入力します。たとえば「Hi」と入力して送信してください。

!!! tip "ヒント: ブラウザーのポップアップ設定"
    以下の手順で快適に進めるため、ブラウザーで `Pop up` がブロックされていないことを確認してください。

追加の権限を求める小さなダイアログが表示され、「Cancel」と「Continue」ボタンがあります。これはログインと権限同意のダイアログです。**Continue** を選択します。

![The chat in Microsoft Teams shows a message asking the user to consent permissions to the app associated with the custom engine agent. There are a message, a 'Continue' button, and a 'Cancel' button.](../../../assets/images/custom-engine-04/consent-teams.png)

!!! warning "既知の問題"
    - Teams チャットで同意ダイアログが表示されるまで遅延が発生することがあります。プラットフォームの問題として認識しており、監視中です。2～3 回メッセージを送信してみてください。

ローカル実行で Developer Tunnels を使用している場合は警告画面が表示されます。**Continue** を選択します。アプリがデプロイされると、**ユーザー** には表示されません。

![A warning screen informing the user that the connection is going through Developer Tunnels with a button to 'Continue'.](../../../assets/images/custom-engine-04/consent-devtunnel.png)

Entra ID にリダイレクトされ、アプリの権限に同意するよう求められます。(`public/auth-start.html` が同意が必要であることを検出し、ここへ誘導しました。)

![The consent dialog provided by Microsoft Entra ID when asking the user to consent the app to access the current user's information. There are an 'Accept' and a 'Cancel' buttons.](../../../assets/images/custom-engine-04/consent-graph.png)

!!! tip "ヒント: 組織全体での同意"
    Microsoft 365 管理者であれば、「Consent on behalf of your organization」を選択してテナント内の全 **ユーザー** に対して同意を与えることもできます。

**Accept** を選択して権限に同意し、Career Genie を実行します。

認証が成功すると、ログインした名前を含むメッセージがカスタム エンジン エージェントから届きます。

![Animation showing the whole authentication flow. The initial request to 'Continue' to the consent page, the alert from Developer Tunnels (happening only in dev mode when running the agent locally), the consent dialog from Microsoft Entra ID, and the final secured output in the custom engine agent.](../../../assets/images/custom-engine-04/auth.gif)

これでカスタム エンジン エージェントとのチャットを開始できます。

<cc-end-step lab="bta4" exercise="4" step="2" />

---8<--- "ja/b-congratulations.md"

ラボ BTA4 - シングル サインオン認証を追加してカスタム エンジン エージェントを保護する手順が完了しました! さらに探求したい場合、このラボのソース コードは [Copilot Developer Camp リポジトリ](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab04-Authentication-SSO/CareerGenie){target=_blank} で確認できます。

次のラボ BTA5 - 複雑なタスクを処理するアクションの追加 に進むことができます。**Next** を選択してください。

<cc-next url="../05-actions" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/04-authentication--ja" />