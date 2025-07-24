---
search:
  exclude: true
---
# ラボ BTA4 - シングルサインオン認証の追加

本ラボでは、Career Genie において Entra Single Sign-On を用いて ユーザー 認証を行い、Microsoft Graph API をトークンを使用してログイン ユーザー 情報を取得する方法を学習します。

本ラボで学習する内容は次のとおりです：

- アプリに Entra ID シングルサインオン (SSO) を追加し、 ユーザー が Microsoft Teams で使用しているアカウントと同じものでシームレスにログインできるようにする
- Teams AI library と Bot Framework を使用してシングルサインオンを実装する
- アプリ ユーザー のためのトークンを取得して使用し、セキュリティとユーザー エクスペリエンスを向上させる

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/5oyftU9PRpM" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を確認してください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## 概要

CareerGenie を強化するために Entra ID (formerly Azure AD) シングルサインオン (SSO) を統合する準備をしましょう。これにより、アプリは Microsoft 365 のデータへ Microsoft Graph を介してシームレスにトークンを取得し、認証と認可をスムーズに行うことができます。Teams AI library と Bot Framework を使用して、この SSO 機能を組み込みます。特に、マルチテナント構成に焦点を合わせます。

## 演習 1： Entra ID シングルサインオンのためのプロジェクト設定

Entra ID によって保護されたアプリケーションは、登録および パーミッション の付与が必要です。 M365 Agents Toolkit がこの作業を自動的に行ってくれますが、プロジェクトを更新してそれを実現する必要があります。本演習では、 M365 Agents Toolkit のプロジェクトファイルを変更して、Entra ID におけるアプリ登録をプロビジョンします。

本演習では、[Lab B3 のソースコード](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab03-Powered-by-AI/CareerGenie){target=_blank} をベース プロジェクトとして次のステップに進んでください。

### ステップ 1： Entra ID アプリ マニフェスト ファイルの追加

このステップでは、 M365 Agents Toolkit が Entra ID にあなたのアプリケーション用のアプリ登録を行う際に使用するアプリケーションを定義するファイルを追加します。このマニフェスト ファイルによって、アプリ登録のさまざまな側面をカスタマイズすることができます。たとえば、こちらのマニフェストでは Microsoft Graph API に対して `User.Read` パーミッションを設定し、アプリが ユーザー のプロファイルを読み取ることができるようにしています。

プロジェクト フォルダーのルートに **aad.manifest.json** ファイルを作成し、以下の JSON を貼り付けてください：

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

### ステップ 2： M365 Agents Toolkit 構成ファイルの更新による Entra ID アプリ作成

`teamsapp.local.yml` ファイルを開いてください。これは、 M365 Agents Toolkit がプロジェクトを実行する際の手順を定義する YAML ファイルです。 M365 Agents Toolkit ユーザー インターフェイスの「LIFECYCLE」セクションには 3 つのステップがあります。

- Provision  - このフェーズでは、アプリに必要なインフラストラクチャ（ボット登録、Teams アプリ パッケージ、今回の場合は Entra ID アプリ登録など）が作成されます。
- Deploy     - このフェーズでは、コードがビルドされローカルで実行されるか、"local" 以外の環境の場合は Azure にアップロードされます。
- Publish    - このフェーズでは、アプリ パッケージが Microsoft Teams に公開されます。

Entra ID アプリをプロビジョンするため、**teamsapp.local.yml** に以下の行を追加してください。これらは `provision` の直下に配置できます：

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

さらに、`botFramework/create` の後に、既存の AAD アプリを更新するために以下の内容を追加してください：

```yml
  - uses: aadApp/update # Apply the AAD manifest to an existing AAD app. Will use the object id in manifest file to determine which AAD app to update.
    with:
      manifestPath: ./aad.manifest.json # Relative path to teamsfx folder. Environment variables in manifest will be replaced before apply to AAD app
      outputFilePath: ./build/aad.manifest.${{TEAMSFX_ENV}}.json
```

!!! tip "ヒント：YAML は適切なインデントが必要です"
    YAML は適切なインデントが必要です。オブジェクト階層の各レベルは構造を示すためにインデントされなければなりません。2 つのスペース（タブではありません）が推奨されます。Visual Studio Code は文法エラーを赤で下線表示してくれますので、赤い下線が消えたら正しく設定されたことが確認できます。

次に、deploy フェーズ内の `file/createOrUpdateEnvironmentFile` ディレクティブを見つけ、前回のラボで追加したもののすぐ下に、envs: コレクションに以下の変数を追加してください：

```yml
 BOT_DOMAIN: ${{BOT_DOMAIN}}
 AAD_APP_CLIENT_ID: ${{AAD_APP_CLIENT_ID}}
 AAD_APP_CLIENT_SECRET: ${{SECRET_AAD_APP_CLIENT_SECRET}}
 AAD_APP_TENANT_ID: ${{AAD_APP_TENANT_ID}}
 AAD_APP_OAUTH_AUTHORITY_HOST: ${{AAD_APP_OAUTH_AUTHORITY_HOST}}
 AAD_APP_OAUTH_AUTHORITY: ${{AAD_APP_OAUTH_AUTHORITY}}
```

<cc-end-step lab="bta4" exercise="1" step="2" />

## 演習 2： Teams アプリ マニフェストへの SSO 追加

### ステップ 1： SSO 対応のための Teams アプリ マニフェストの更新

シングルサインオン プロセスでは、Teams があなたのコードに対して Entra ID アクセストークンを渡します。しかし、Teams はアプリケーションについて知らなければこのアクセストークンを提供することはできません。具体的には、アプリケーション（クライアント） ID と Teams に接続されているボットの ID が必要です。そのため、これらの情報を Teams アプリ マニフェストに追加する必要があります。

**./appPackage/manifest.json** 内の Teams アプリ マニフェスト テンプレートを見つけ、以下の内容を追加してください：

```json
 "webApplicationInfo": {
        "id": "${{BOT_ID}}",
        "resource": "api://botid-${{BOT_ID}}"
    }
```

`validDomains` ノードの下に、カンマを挟んで追加してください。

さらに、Teams にあなたのボットのドメインからウェブページを表示させる必要があります。これにより、Microsoft Graph の呼び出しに必要なユーザー 同意 を取得するために使用される `auth-start.html` および `auth-end.html` ページにアクセスできるようになります。これは、ユーザーが custom engine agent に初めてアクセスしたときのみ発生します。

そのため、ボットのドメインである **${{BOT_DOMAIN}}** を `validDomains` 配列に追加してください。これらの変更後、`manifest.json` ファイルの末尾は以下のようになります：

```JSON
  "validDomains": [
        "${{BOT_DOMAIN}}",
        "*.botframework.com"
    ],
```

<cc-end-step lab="bta4" exercise="2" step="1" />

## 演習 3： SSO 対応のためのアプリケーションコードの更新

### ステップ 1： 同意ダイアログ用の HTML ページの提供

ユーザーが初めてアプリケーションにアクセスする際、アプリに ユーザー のプロファイル情報を読み取る許可を与える同意が必要な場合があります。これは Teams AI library によって実行され、同意用のポップアップウィンドウが表示されます。これらの HTML ページはそのポップアップ内に表示され、実際の同意処理のために Entra ID へリダイレクトされます。

> ポップアップによる権限付与のコード スニペットは、公式 [teams-ai library sample for Teams SSO](https://github.com/microsoft/teams-ai/tree/main/js/samples/05.authentication/d.teamsSSO-bot/src/public){target=_blank} からのものです。

プロジェクトの **src** フォルダー内に **public** という新しいフォルダーを作成してください。

**auth-start.html** ファイルを作成し、以下の内容を貼り付けてください：

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

**auth-end.html** ファイルを作成し、以下の内容を貼り付けてください：

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

### ステップ 2： SSO 対応のコード更新

- **index.ts** ファイルの変更は以下の通りです：

  public フォルダーから静的ファイルを提供するため、以下の `path` のインポートを追加してください：

  ```TypeScript
import * as path from 'path';
```

  その後、`expressApp.listen` メソッドの結果で `server` オブジェクトを初期化する行の後に、以下のコードを追加してください：

  ```TypeScript
const authFilePattern = /^\/auth-(start|end)\.html$/;
expressApp.get(
  authFilePattern, (req, res) => {
    const fileName = req.path;
    const filePath = path.join(__dirname, 'public', fileName);
    res.sendFile(filePath);
});
```

- **adapter.ts** ファイルの変更は以下の通りです：
  - teams-ai library から `TeamsAdapter` をインポートします。

    ```TypeScript
import { TeamsAdapter } from '@microsoft/teams-ai';
```

  - Teams SSO のため、アダプターの定義を `CloudAdapter` ではなく `TeamsAdapter` に置き換えます。

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

  - もはや不要な `botFrameworkAuthentication` の定義をコメントアウトします。

- **config.ts** ファイルの変更は以下の通りです：
  - 定数 `config` に以下のプロパティを追加します。`process.env.INDEX_NAME` の後ろにカンマを追加し、以下のスニペットを付け加えてください：

    ```TypeScript
aadAppClientId: process.env.AAD_APP_CLIENT_ID,
aadAppClientSecret: process.env.AAD_APP_CLIENT_SECRET,
aadAppOauthAuthorityHost: process.env.AAD_APP_OAUTH_AUTHORITY_HOST,
aadAppTenantId: process.env.AAD_APP_TENANT_ID,
botDomain: process.env.BOT_DOMAIN,
aadAppOauthAuthority: process.env.AAD_APP_OAUTH_AUTHORITY,
```

- **app.ts** ファイルの変更は以下の通りです：
  - ` TurnState ` と ` AuthError ` モジュールを使用するので、以下のように `@microsoft/teams-ai` ライブラリからインポート文に含めてください：

    ```TypeScript
import { Application, ActionPlanner, OpenAIModel, PromptManager, AI, PredictedSayCommand, AuthError, TurnState } from "@microsoft/teams-ai";
```

  - アプリケーション定義に認証設定を渡すため、`const app` の定義を以下のコードスニペットに置き換えてください：

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

Teams AI library が custom engine agent と Microsoft Teams 間のトークン交換を処理するため、トークン受領後すぐに Microsoft Graph を呼び出すことが可能です。  
次に、Teams AI library を使用してさまざまな認証およびメッセージング イベントを定義・処理するコードを追加しましょう。  
アプリ定義メソッドの後に、以下のコードを貼り付けてください：

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

上記のコードでは、トークン受領後に `getUserDisplayName()` 関数が呼び出されています。この関数を用いて Microsoft Graph を呼び出し ユーザー 情報を取得します。では、関数定義を追加しましょう。まず [Graph SDK](https://github.com/microsoftgraph/msgraph-sdk-javascript){target=_blank} をインストールしてください。

端末で以下のスクリプトを実行して npm パッケージをインストールしてください：

```PowerShell
npm install @microsoft/microsoft-graph-client @microsoft/microsoft-graph-types
```

次に、**app.ts** ファイル内でパッケージから必要なモジュールをインポートしてください：

```TypeScript
import { Client } from "@microsoft/microsoft-graph-client";
```

`app.message` メソッドの後に、以下のコードスニペットを貼り付けてください：

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

???+ "このアプリをシングルテナント専用にするには、以下の変更を行ってください"         
    - `aad.manifest.json` に移動し、signInAudience ノードを `  "signInAudience": "AzureADMyOrg"` に更新してください
    - `teamsapp.local.yml` に移動し、aadApp\create の signInAudience ノードを ` "signInAudience": "AzureADMyOrg"` に更新してください
    - `src\app\app.ts` に移動し、アプリケーション定義の認証設定の authority を ` authority: config.aadAppOauthAuthority` に更新してください
    - `src\public\auth-start.html` に移動し、変数 `authorizeEndpoint` を `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${toQueryString(queryParams)}` に設定してください        
    - `src\adapter.ts` に移動し、アダプター定義の ` MicrosoftAppType: 'SingleTenant'` を更新してください

<cc-end-step lab="bta4" exercise="3" step="2" />

## 演習 4： アプリケーションの実行

これで、Career Genie における Teams SSO のコード実装は完了です。実際に動作を確認してみましょう。

### ステップ 1： Teams へのアプリ インストール

Visual Studio Code の **Run and Debug** タブを選択し、**Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を実行して、アプリのデバッグを開始してください。これにより、ブラウザで Microsoft Teams が自動的に開きます。Teams にアプリの詳細が表示されたら、**Add** を選択してアプリとのチャットを開始してください。

!!! tip "ヒント：この演習をローカルでテストする"
    これまでに実装した一部の Teams AI library 機能は Teams App Test Tool ではスムーズに動作しない可能性があるため、Teams でローカル環境でテストおよびデバッグすることを必ず確認してください。

<cc-end-step lab="bta4" exercise="4" step="1" />

### ステップ 2： 同意の付与

Career Genie との会話を開始するには、単にメッセージを入力してください。たとえば、'Hi' と入力して送信することで開始できます。

!!! tip "ヒント：ブラウザのポップアップ設定の確認"
    以下の手順をスムーズに実行するため、ブラウザで `Pop up` がブロックされていないことを確認してください。

追加の権限確認のため、小さなダイアログボックスが表示され、‘Cancel’ および ‘Continue’ ボタンが含まれています。このダイアログはログインおよび要求される権限に対する同意のためのものです。**Continue** を選択してください。

![The chat in Microsoft Teams shows a message asking the user to consent permissions to the app associated with the custom engine agent. There are a message, a 'Continue' button, and a 'Cancel' button.](../../../assets/images/custom-engine-04/consent-teams.png)

!!! warning "既知の問題"
    - Teams チャットに同意ダイアログが表示されるのに遅延が発生することがあります。これはプラットフォームの問題として確認されており、監視中です。2～3 回程度繰り返しリクエストしてください。

Developer Tunnels を使用してローカルで実行している場合、警告画面が表示されますので、**Continue** を選択してください。アプリがデプロイされた際にはユーザーに表示されません。

![A warning screen informing the user that the connection is going through Developer Tunnels with a button to 'Continue'.](../../../assets/images/custom-engine-04/consent-devtunnel.png)

Entra ID にリダイレクトされ、アプリの権限に対する同意が求められます。（同意が確認できなかった場合、public/auth-start.html によりそこに誘導されます。）

![The consent dialog provided by Microsoft Entra ID when asking the user to consent the app to access the current user's information. There are an 'Accept' and a 'Cancel' buttons.](../../../assets/images/custom-engine-04/consent-graph.png)

!!! tip "ヒント：組織全体の同意"
    Microsoft 365 管理者であれば、テナント内のすべての ユーザー に対して一括で同意できる "Consent on behalf of your organization" オプションが提供されます。

権限に同意し、Career Genie を実行するために **Accept** を選択してください。

認証に成功したことを示す、ログインした名前と共に custom engine agent からこのメッセージが表示されます。

![Animation showing the whole authentication flow. The initial request to 'Continue' to the consent page, the alert from Developer Tunnels (happening only in dev mode when running the agent locally), the consent dialog from Microsoft Entra ID, and the final secured output in the custom engine agent.](../../../assets/images/custom-engine-04/auth.gif)

custom engine agent とチャットを開始することができます。

<cc-end-step lab="bta4" exercise="4" step="2" />

---8<--- "ja/b-congratulations.md"

Lab BTA4 - シングルサインオン認証の追加 により custom engine agent のセキュリティが向上しました。さらに探求したい場合は、このラボのソースコードが [Copilot Developer Camp repo](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab04-Authentication-SSO/CareerGenie){target=_blank} で利用可能です。

次は Lab BTA5 - 複雑なタスクを処理するためのアクションの追加 に進んでください。Next を選択してください。

<cc-next url="../05-actions" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/04-authentication" />