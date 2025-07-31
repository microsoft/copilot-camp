---
search:
  exclude: true
---
# ラボ BTA4 - シングル サインオン認証の追加

このラボでは、Career Genie に Entra シングル サインオン (SSO) を統合し、取得したトークンを使用して Microsoft Graph API を呼び出し、サインイン中の ユーザー 情報を取得する方法を学習します。

このラボで学ぶ内容:

- アプリに Entra ID シングル サインオン (SSO) を追加し、Microsoft Teams で使用しているのと同じアカウントでシームレスにアプリへサインインできるようにする
- Teams AI ライブラリと Bot Framework を使用して SSO を実装する
- トークンを取得してアプリ ユーザー に適用し、セキュリティとユーザー エクスペリエンスを向上させる


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/5oyftU9PRpM" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を素早く確認しましょう。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## はじめに

Entra ID (旧称 Azure AD) のシングル サインオン (SSO) を統合して Career Genie を強化しましょう。これにより、Microsoft Graph 経由で Microsoft 365 データへアクセスするためのトークンをアプリがシームレスに取得でき、認証と認可がスムーズになります。ここでは、Teams AI ライブラリと Bot Framework を使用し、特にマルチテナント構成に焦点を当てて SSO 機能を組み込みます。

## 演習 1: Entra ID シングル サインオン用のプロジェクト準備

Entra ID で保護されたアプリケーションは登録され、権限が付与されている必要があります。M365 Agents Toolkit がこの処理を行いますが、そのためにはプロジェクトを更新する必要があります。この演習では、M365 Agents Toolkit プロジェクト ファイルを変更して Entra ID にアプリ登録をプロビジョニングします。

この演習では、[Lab B3 のソース コード](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab03-Powered-by-AI/CareerGenie){target=_blank} をベース プロジェクトとして使用し、次の手順を進めてください。

### 手順 1: Entra ID アプリケーションを定義する App manifest ファイルを追加

この手順では、M365 Agents Toolkit が Entra ID にアプリケーションを登録する際に使用するファイルを追加します。この manifest ファイルでアプリ登録のさまざまな設定をカスタマイズできます。たとえば、ここでは Microsoft Graph API の `User.Read` 権限を設定し、アプリがユーザー プロファイルを読み取れるようにしています。

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

### 手順 2: M365 Agents Toolkit 設定ファイルを更新して Entra ID アプリを作成

`teamsapp.local.yml` ファイルを開きます。この YAML ファイルには、M365 Agents Toolkit がプロジェクトを実行する際の手順が定義されています。M365 Agents Toolkit のユーザー インターフェイスには「プロビジョン」「デプロイ」「公開」の 3 つのフェーズがあります。

- Provision – このフェーズでは、アプリに必要なインフラストラクチャが作成されます。ボット登録、Teams アプリ パッケージ、そして今回は Entra ID アプリ登録などが含まれます  

- Deploy – このフェーズでは、コードがローカルでビルド・実行されるか、ローカル以外の環境では Azure にアップロードされます  

- Publish – このフェーズでは、アプリ パッケージが Microsoft Teams に公開されます  

Entra ID アプリをプロビジョニングするには、`provision` の直下に次の行を **teamsapp.local.yml** に追加します。

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

`botFramework/create` の後ろに、既存の AAD アプリを更新するために次を追加します。

```yml
  - uses: aadApp/update # Apply the AAD manifest to an existing AAD app. Will use the object id in manifest file to determine which AAD app to update.
    with:
      manifestPath: ./aad.manifest.json # Relative path to teamsfx folder. Environment variables in manifest will be replaced before apply to AAD app
      outputFilePath: ./build/aad.manifest.${{TEAMSFX_ENV}}.json
```

!!! tip "ヒント: YAML のインデント"
    YAML では正しいインデントが必須です。オブジェクト階層の各レベルをインデントして構造を示します。2 文字のスペース (タブではない) が推奨です。Visual Studio Code は構文エラーを赤線で示してくれるので、赤線が消えれば正しく書けています。

次に、デプロイ フェーズで `file/createOrUpdateEnvironmentFile` ディレクティブを見つけます。前回のラボで追加した項目の直下、envs コレクションに以下の変数を追加します。

```yml
 BOT_DOMAIN: ${{BOT_DOMAIN}}
 AAD_APP_CLIENT_ID: ${{AAD_APP_CLIENT_ID}}
 AAD_APP_CLIENT_SECRET: ${{SECRET_AAD_APP_CLIENT_SECRET}}
 AAD_APP_TENANT_ID: ${{AAD_APP_TENANT_ID}}
 AAD_APP_OAUTH_AUTHORITY_HOST: ${{AAD_APP_OAUTH_AUTHORITY_HOST}}
 AAD_APP_OAUTH_AUTHORITY: ${{AAD_APP_OAUTH_AUTHORITY}}
```

<cc-end-step lab="bta4" exercise="1" step="2" />

## 演習 2: Teams アプリ manifest に SSO を追加

この演習では、Teams アプリ manifest を更新してシングル サインオンを追加します。

### 手順 1: Teams アプリ manifest を SSO 用に更新

SSO プロセスでは、Teams がアプリケーション用の Entra ID アクセス トークンをコードに渡します。ただし、Teams がこのトークンを提供できるのは、アプリケーションを認識している場合のみです。具体的には、アプリケーション (クライアント) ID と Teams に接続したボットの ID を把握する必要があります。そのため、この情報を Teams アプリ manifest に追加します。

**./appPackage/manifest.json** にある Teams アプリ manifest テンプレートを開き、以下を追加します。

```json
 "webApplicationInfo": {
        "id": "${{BOT_ID}}",
        "resource": "api://botid-${{BOT_ID}}"
    }
```

`validDomains` ノードの下にカンマを付けて追加してください。

ここで、ボットのドメインからの Web ページ (ユーザー が Microsoft Graph の呼び出しを許可する際に使用する `auth-start.html` と `auth-end.html` ページ) を Teams が表示できるようにする必要があります。これは ユーザー が初めてカスタム エンジン エージェントにアクセスした際にのみ発生します。

そのため、ボットのドメイン **${{BOT_DOMAIN}}** を `validDomains` 配列に追加します。変更後、`manifest.json` ファイルの末尾は次のようになるはずです。

```JSON
  "validDomains": [
        "${{BOT_DOMAIN}}",
        "*.botframework.com"
    ],
```

<cc-end-step lab="bta4" exercise="2" step="1" />

## 演習 3: アプリケーション コードを SSO 対応に更新

この演習では、SSO プロセスに対応するようにコードを変更します。

### 手順 1: 同意ダイアログ用の HTML ページを用意

ユーザー がアプリを初めて利用する際、プロファイル情報の読み取り権限をアプリに付与するための同意が必要になる場合があります。これは Teams AI ライブラリによって処理され、ポップアップ ウィンドウが表示されます。ここで作成する HTML ページは、そのポップアップで表示され、実際の同意処理のために Entra ID へリダイレクトします。

> ポップアップでの権限付与に関するコード スニペットは公式の [teams-ai ライブラリ Teams SSO サンプル](https://github.com/microsoft/teams-ai/tree/main/js/samples/05.authentication/d.teamsSSO-bot/src/public){target=_blank} から引用しています。

プロジェクトの **src** フォルダー内に **public** という新しいフォルダーを作成します。

**auth-start.html** ファイルを作成し、以下の内容を貼り付けます。

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

**auth-end.html** ファイルを作成し、以下の内容を貼り付けます。

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

### 手順 2: SSO を処理するコードを更新

- **index.ts** ファイルの変更点:

`public` フォルダーから静的ファイルを提供するために、`path` をインポートします。

```TypeScript
import * as path from 'path';
```

次に、`server` オブジェクトを `expressApp.listen` メソッドで初期化した行の後に、以下のコードを追加します。

```TypeScript
const authFilePattern = /^\/auth-(start|end)\.html$/;
expressApp.get(
  authFilePattern, (req, res) => {
    const fileName = req.path;
    const filePath = path.join(__dirname, 'public', fileName);
    res.sendFile(filePath);
});
```

**adapter.ts** ファイルの変更点:

- teams-ai ライブラリから `TeamsAdapter` をインポートします。

```TypeScript
import { TeamsAdapter } from '@microsoft/teams-ai';
```

- アダプター定義を `CloudAdapter` ではなく `TeamsAdapter` に置き換えます。

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

- もう不要となる `botFrameworkAuthentication` の定義はコメントアウトします。

**config.ts** ファイルの変更点:

- 定数 `config` に以下のプロパティを追加します。`process.env.INDEX_NAME` の後にカンマを付け、次のスニペットを追加してください。

```TypeScript
aadAppClientId: process.env.AAD_APP_CLIENT_ID,
aadAppClientSecret: process.env.AAD_APP_CLIENT_SECRET,
aadAppOauthAuthorityHost: process.env.AAD_APP_OAUTH_AUTHORITY_HOST,
aadAppTenantId: process.env.AAD_APP_TENANT_ID,
botDomain: process.env.BOT_DOMAIN,
aadAppOauthAuthority: process.env.AAD_APP_OAUTH_AUTHORITY,
```

**app.ts** ファイルの変更点:

- `TurnState` と `AuthError` モジュールを使用するため、下記のように `@microsoft/teams-ai` からインポートします。

```TypeScript
import { Application, ActionPlanner, OpenAIModel, PromptManager, AI, PredictedSayCommand, AuthError, TurnState } from "@microsoft/teams-ai";
```

- 認証設定を Application 定義に渡すため、`const app` の定義を次のコード スニペットに置き換えます。

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

Teams AI ライブラリは、カスタム エンジン エージェントと Microsoft Teams 間のトークン交換を処理するため、トークン受領後すぐに Microsoft Graph を呼び出せます。
次に、Teams AI ライブラリを使用して各種認証およびメッセージング イベントを定義・処理するコードを追加します。
アプリ定義メソッドの後に、以下のコードを貼り付けます。

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

上記コードでは、トークンを正常に受け取った後に `getUserDisplayName()` 関数を呼び出し、Microsoft Graph を使って ユーザー 情報を取得しています。まず [Graph SDK](https://github.com/microsoftgraph/msgraph-sdk-javascript){target=_blank} をインストールしましょう。  

ターミナルで次のスクリプトを実行して npm パッケージをインストールします。

```PowerShell
npm install @microsoft/microsoft-graph-client @microsoft/microsoft-graph-types
```

次に、**app.ts** ファイルで必要なモジュールをインポートします。

```TypeScript
import { Client } from "@microsoft/microsoft-graph-client";
```

`app.message` メソッドの後に、次のコード スニペットを貼り付けます。

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

???+ "シングル テナント専用にする場合は以下を変更"         
    - `aad.manifest.json` で `signInAudience` ノードを `"AzureADMyOrg"` に更新  
    - `teamsapp.local.yml` の aadApp\create の `signInAudience` ノードを `"AzureADMyOrg"` に更新  
    - `src\app\app.ts` の Application 定義の auth 設定で `authority` を `config.aadAppOauthAuthority` に更新  
    - `src\public\auth-start.html` の `authorizeEndpoint` 変数を `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${toQueryString(queryParams)}` に設定  
    - `src\adapter.ts` のアダプター定義で `MicrosoftAppType: 'SingleTenant'` に更新   

<cc-end-step lab="bta4" exercise="3" step="2" />

## 演習 4: アプリケーションを実行

これで Career Genie の Teams SSO 対応コードが完了しました。実際に動かしてみましょう。

### 手順 1: Teams へのアプリ インストール

Visual Studio Code の **Run and Debug** タブから **Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を選択してデバッグを開始します。ブラウザーで Microsoft Teams が開き、アプリ詳細が表示されたら **Add** を選択してチャットを開始してください。

!!! tip "ヒント: この演習をローカルでテストする"
    これまでに実装した Teams AI ライブラリの機能の一部は Teams App Test Tool では円滑に動作しません。必ずローカルで Teams を使用してテストおよびデバッグしてください。

<cc-end-step lab="bta4" exercise="4" step="1" />

### 手順 2: 同意の付与

Career Genie と会話を始めるには、メッセージを入力するだけです。たとえば「Hi」と送信してみましょう。

!!! tip "ヒント: ブラウザーのポップアップ設定"
    以下の手順を円滑に行うため、ブラウザーでポップアップがブロックされていないことを確認してください。

追加の権限を要求する小さなダイアログ ボックスが表示され、「Cancel」と「Continue」ボタンがあります。これはサインインと必要な権限への同意を求めるダイアログです。**Continue** を選択します。

![Microsoft Teams のチャットで、カスタム エンジン エージェントに関連付けられたアプリに対して ユーザー に権限の同意を求めるメッセージと『Continue』『Cancel』ボタンが表示されている。](../../../assets/images/custom-engine-04/consent-teams.png)

!!! warning "既知の問題"
    - Teams チャットで同意ダイアログが表示されるまでに遅延が発生することがあります。これはプラットフォームの問題として認識されており、監視中です。2～3 回メッセージを送ってみてください。

Developer Tunnels でローカル実行している場合は警告画面が表示されます。**Continue** を選択してください。アプリをデプロイした際には ユーザー には表示されません。

![Developer Tunnels を通じて接続していることを知らせ、『Continue』ボタンがある警告画面。](../../../assets/images/custom-engine-04/consent-devtunnel.png)

Entra ID にリダイレクトされ、アプリの権限に同意するよう求められます。(同意していないときに表示される public/auth-start.html がリダイレクトしています)

![Microsoft Entra ID による同意ダイアログ。現在の ユーザー 情報へのアクセスをアプリに許可するかを尋ね、『Accept』と『Cancel』ボタンがある。](../../../assets/images/custom-engine-04/consent-graph.png)

!!! tip "ヒント: 組織全体への同意"
    Microsoft 365 管理者の場合、「Consent on behalf of your organization」を選択してテナント内のすべての ユーザー に対して同意を与えることもできます。

**Accept** を選択して権限に同意し、Career Genie を実行します。

カスタム エンジン エージェントから、認証が成功したことを示す、サインインしている名前入りのメッセージが届きます。

![全認証フローを示すアニメーション。最初の『Continue』要求、Developer Tunnels の警告 (ローカル実行時のみ)、Microsoft Entra ID の同意ダイアログ、そして最終的に保護されたカスタム エンジン エージェントの出力。](../../../assets/images/custom-engine-04/auth.gif)

これでカスタム エンジン エージェントとチャットを開始できます。

<cc-end-step lab="bta4" exercise="4" step="2" />

---8<--- "ja/b-congratulations.md"

ラボ BTA4 - シングル サインオン認証の追加を完了し、カスタム エンジン エージェントを保護できました! さらに学習したい場合は、このラボのソース コードが [Copilot Developer Camp リポジトリ](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab04-Authentication-SSO/CareerGenie){target=_blank} にあります。

次のラボ BTA5 - 複雑なタスクを処理するアクションの追加 に進みましょう。Next を選択してください。

<cc-next url="../05-actions" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/04-authentication--ja" />