---
search:
  exclude: true
---
# ラボ M4 - 認証の追加
このラボでは、前のラボで作成した Northwind プラグインに Entra ID の SSO (single sign-on) 認証を追加し、Outlook から仕入先などの連絡先を検索できるようにします。  

???+ "Teams メッセージ拡張ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [ラボ M1 - Northwind メッセージ拡張を理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - Microsoft 365 Copilot でアプリを実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新しい検索コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証の追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) (📍現在地)
    - [ラボ M5 - アクション コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! warning   "注意"
    このラボでは、ボット サービスをプロビジョニングするための Azure サブスクリプションが必要です。

!!! tip "NOTE"
    すべての変更済みコードを含む完成版は [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/) からダウンロードできます。トラブルシューティングに便利です。  
    編集をリセットしたい場合は、リポジトリを再度クローンしてやり直してください。

このラボで学ぶこと:

- ユーザーが Microsoft Teams と同じアカウントでシームレスにアプリへログインできるよう、Entra ID SSO をプラグインに追加する方法  
- Microsoft Graph API へアクセスして Microsoft 365 内のユーザー データを取得する方法。本ラボでは Outlook の連絡先を安全に取得します。

## はじめに : SSO 実装に必要なタスク (概要)

メッセージ拡張アプリで SSO を実装するには、いくつかの手順が必要です。高レベルの流れを示します。

### Microsoft Entra ID でのアプリ登録 & Azure Bot Service でのボット構成
- Azure ポータルで新しいアプリ登録を作成
- 必要なアクセス許可とスコープを設定
- クライアント シークレットを生成
- Azure Bot Service でボットを作成
- Microsoft 365 チャネルをボットに追加
- Azure ポータルで OAuth 接続を設定

### Teams アプリでの SSO 有効化
- メッセージ拡張のボット コードを更新し、認証とトークン交換を処理
- Bot Framework SDK で SSO 機能を統合
- OAuth フローを実装してユーザーのアクセストークンを取得

### Teams での認証設定
- Teams アプリ マニフェストに必要なアクセス許可を追加

## Exercise 1: Microsoft Entra ID でのアプリ登録と Azure Bot Service でのボット構成

幸い、必要な設定はすべて用意してあるため **F5** を押すだけで開始できます。ただし、リソース登録・構成のためにプロジェクトへ加える具体的な変更内容を確認しておきましょう。 

### 手順 1: ファイルとフォルダーのコピー

ルート フォルダーの **infra** 内に **entra** という新しいフォルダーを作成します。 

**entra** フォルダーに **entra.bot.manifest.json** と **entra.graph.manifest.json** の 2 つのファイルを作成します。

それぞれに、以下のリンク先からコードをコピーしてください。

- **entra.bot.manifest.json**: [ファイルはこちら](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/entra/entra.bot.manifest.json){target=_blank}  
- **entra.graph.manifest.json**: [ファイルはこちら](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/entra/entra.graph.manifest.json){target=_blank}

これらのファイルは、ボット用およびグラフ用の Entra ID アプリ登録をプロビジョニングするために必要です。 

次に **infra** フォルダー内に **azure.local.bicep** を作成し、[こちらのファイル](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/azure.local.bicep){target=_blank} からコードをコピーします。さらに **infra** フォルダーに **azure.parameters.local.json** を作成し、[こちらのファイル](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/azure.parameters.local.json){target=_blank} からコードをコピーしてください。

これらのファイルはボット登録を支援します。ローカル実行時でも Azure に Bot Service がプロビジョニングされ、この認証フローに必要な環境が整います。

!!! note "これらのファイルで何が行われるのか？"
    Agents Toolkit でアプリをローカル実行すると、F0 SKU の新しい Azure AI Bot Service がリソース グループにプロビジョニングされます。この SKU は Microsoft Teams や Microsoft 365 チャネル (Outlook と Copilot) を含む標準チャネルへのメッセージ送信が無制限で、料金は発生しません。

### 手順 2: 既存コードの更新

**infra/botRegistration** フォルダー配下の **azurebot.bicep** を開き、`param botAppDomain` 宣言の後に以下のコード スニペットを追加します。

```bicep
param graphAadAppClientId string
@secure()
param graphAadAppClientSecret string

param connectionName string
```

続いて、同じファイルの末尾にボット サービスをプロビジョニングするためのスニペットを追加します。

```bicep
resource botServicesMicrosoftGraphConnection 'Microsoft.BotService/botServices/connections@2022-09-15' = {
  parent: botService
  name: connectionName
  location: 'global'
  properties: {
    serviceProviderDisplayName: 'Azure Active Directory v2'
    serviceProviderId: '30dd229c-58e3-4a48-bdfd-91ec48eb906c'
    clientId: graphAadAppClientId
    clientSecret: graphAadAppClientSecret
    scopes: 'email offline_access openid profile Contacts.Read'
    parameters: [
      {
        key: 'tenantID'
        value: 'common'
      }
      {
        key: 'tokenExchangeUrl'
        value: 'api://${botAppDomain}/botid-${botAadAppClientId}'
      }
    ]
  }
}

```

これにより、Bot Service と Graph Entra ID アプリ間のトークン交換用 OAuth 接続が作成されます。

!!! tip "プラグイン用インフラの変更"
    認証なしのプラグインと比べて今回のセットアップでは異なるインフラが必要です。そのため再配線が必要になります。次の手順で進めましょう。

次に **teamsapp.local.yml** を開き、内容を下記スニペットに置き換えます。これにより、インフラの一部を再配線し、Azure にボット サービスをデプロイします。 

```yaml
# yaml-language-server: $schema=https://aka.ms/teams-toolkit/1.0.0/yaml.schema.json
# Visit https://aka.ms/teamsfx-v5.0-guide for details on this file
# Visit https://aka.ms/teamsfx-actions for details on actions
version: 1.0.0

provision:

  - uses: script
    name: Ensure database
    with:
      run: node db-setup.js
      workingDirectory: scripts

  # Creates a Teams app
  - uses: teamsApp/create
    with:
      # Teams app name
      name: NorthwindProducts-${{TEAMSFX_ENV}}
    # Write the information of created resources into environment file for
    # the specified environment variable(s).
    writeToEnvironmentFile:
      teamsAppId: TEAMS_APP_ID

  - uses: aadApp/create
    with:
      name: ${{APP_INTERNAL_NAME}}-bot-${{TEAMSFX_ENV}}
      generateClientSecret: true
      signInAudience: AzureADMultipleOrgs
    writeToEnvironmentFile:
      clientId: BOT_ID
      clientSecret: SECRET_BOT_PASSWORD
      objectId: BOT_AAD_APP_OBJECT_ID
      tenantId: BOT_AAD_APP_TENANT_ID
      authority: BOT_AAD_APP_OAUTH_AUTHORITY
      authorityHost: BOT_AAD_APP_OAUTH_AUTHORITY_HOST

  - uses: aadApp/update
    with:
      manifestPath: "./infra/entra/entra.bot.manifest.json"
      outputFilePath : "./build/entra.bot.manifest.${{TEAMSFX_ENV}}.json"
  - uses: aadApp/create
    with:
      name: ${{APP_INTERNAL_NAME}}-graph-${{TEAMSFX_ENV}}
      generateClientSecret: true
      signInAudience: AzureADMultipleOrgs
    writeToEnvironmentFile:
      clientId: GRAPH_AAD_APP_ID
      clientSecret: SECRET_GRAPH_AAD_APP_CLIENT_SECRET
      objectId: GRAPH_AAD_APP_OBJECT_ID
      tenantId: GRAPH_AAD_APP_TENANT_ID
      authority: GRAPH_AAD_APP_OAUTH_AUTHORITY
      authorityHost: GRAPH_AAD_APP_OAUTH_AUTHORITY_HOST

  - uses: aadApp/update
    with:
      manifestPath: "./infra/entra/entra.graph.manifest.json"
      outputFilePath : "./build/entra.graph.manifest.${{TEAMSFX_ENV}}.json"

  - uses: arm/deploy
    with:
      subscriptionId: ${{AZURE_SUBSCRIPTION_ID}}
      resourceGroupName: ${{AZURE_RESOURCE_GROUP_NAME}}
      templates:
        - path: ./infra/azure.local.bicep
          parameters: ./infra/azure.parameters.local.json
          deploymentName: Create-resources-for-${{APP_INTERNAL_NAME}}-${{TEAMSFX_ENV}}
      bicepCliVersion: v0.9.1

  # Validate using manifest schema
  - uses: teamsApp/validateManifest
    with:
      # Path to manifest template
      manifestPath: ./appPackage/manifest.json

  # Build Teams app package with latest env value
  - uses: teamsApp/zipAppPackage
    with:
      # Path to manifest template
      manifestPath: ./appPackage/manifest.json
      outputZipPath: ./appPackage/build/appPackage.${{TEAMSFX_ENV}}.zip
      outputJsonPath: ./appPackage/build/manifest.${{TEAMSFX_ENV}}.json
  # Validate app package using validation rules
  - uses: teamsApp/validateAppPackage
    with:
      # Relative path to this file. This is the path for built zip file.
      appPackagePath: ./appPackage/build/appPackage.${{TEAMSFX_ENV}}.zip

  # Apply the Teams app manifest to an existing Teams app in
  # Teams Developer Portal.
  # Will use the app id in manifest file to determine which Teams app to update.
  - uses: teamsApp/update
    with:
      # Relative path to this file. This is the path for built zip file.
      appPackagePath: ./appPackage/build/appPackage.${{TEAMSFX_ENV}}.zip

  # Extend your Teams app to Outlook and the Microsoft 365 app
  - uses: teamsApp/extendToM365
    with:
      # Relative path to the build app package.
      appPackagePath: ./appPackage/build/appPackage.${{TEAMSFX_ENV}}.zip
    # Write the information of created resources into environment file for
    # the specified environment variable(s).
    writeToEnvironmentFile:
      titleId: M365_TITLE_ID
      appId: M365_APP_ID

deploy:
# Run npm command
  - uses: cli/runNpmCommand
    name: install dependencies
    with:
      args: install --no-audit

  # Generate runtime environment variables
  - uses: file/createOrUpdateEnvironmentFile
    with:
      target: ./.localConfigs
      envs:
        BOT_ID: ${{BOT_ID}}
        BOT_PASSWORD: ${{SECRET_BOT_PASSWORD}}
        STORAGE_ACCOUNT_CONNECTION_STRING: ${{SECRET_STORAGE_ACCOUNT_CONNECTION_STRING}}
        CONNECTION_NAME: ${{CONNECTION_NAME}}

```

**env** フォルダー内の **.env.local** を開き、すべての変数を削除して以下を追加します。 

```
APP_INTERNAL_NAME=Northwind
APP_DISPLAY_NAME=Northwind
CONNECTION_NAME=MicrosoftGraph

```

同様に **.env.local.user** を開き、すべての変数を削除して以下を追加します。 

```
SECRET_BOT_PASSWORD=
SECRET_GRAPH_AAD_APP_CLIENT_SECRET=
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
```


## Exercise 2: 新しい検索コマンド (Contacts)

### 手順 1: 連絡先 (仕入先) 検索コマンドの追加

まず連絡先を検索する新しいコマンドを追加します。最終的には Microsoft Graph から連絡先を取得しますが、まずはメッセージ拡張コマンドが正しく動作するかを確認するためにモック データを使用します。  
**src/messageExtensions** フォルダーに **supplierContactSearchCommand.ts** を新規作成し、以下の内容をコピーしてください。

```JavaScript
import {
    CardFactory,
    TurnContext
} from "botbuilder";


const COMMAND_ID = "supplierContactSearch";

let queryCount = 0;
async function handleTeamsMessagingExtensionQuery(context: TurnContext, query: any): Promise<any> {

    let name = '';
    if (query.parameters.length === 1 && query.parameters[0]?.name === "name") {
        [name] = (query.parameters[0]?.value.split(','));
    } else {
        name = cleanupParam(query.parameters.find((element) => element.name === "name")?.value);
    }
    console.log(`🍽️ Query #${++queryCount}:\name of contact=${name}`);
    const filteredProfile = [];
    const attachments = [];

    const allContacts = [
    {
        displayName: "John Doe",
        emailAddresses: [
        { address: "john.doe@example.com" }
        ]
    },
    {
        displayName: "Jane Smith",
        emailAddresses: [
        { address: "jane.smith@example.com" }
        ]
    },
    {
        displayName: "Alice Johnson",
        emailAddresses: [
        { address: "alice.johnson@example.com" }
        ]
    }
];

    allContacts.forEach((contact) => {
        if (contact.displayName.toLowerCase().includes(name.toLowerCase()) || contact.emailAddresses[0]?.address.toLowerCase().includes(name.toLowerCase())) {
            filteredProfile.push(contact);
        }
    });

    filteredProfile.forEach((prof) => {
        const preview = CardFactory.heroCard(prof.displayName,
            `with email ${prof.emailAddresses[0]?.address}`);

        const resultCard = CardFactory.heroCard(prof.displayName,
            `with email ${prof.emailAddresses[0]?.address}`);
        const attachment = { ...resultCard, preview };
        attachments.push(attachment);
    });
    return {
        composeExtension: {
            type: "result",
            attachmentLayout: "list",
            attachments: attachments,
        },
    };

}
function cleanupParam(value: string): string {

    if (!value) {
        return "";
    } else {
        let result = value.trim();
        result = result.split(',')[0];          // Remove extra data
        result = result.replace("*", "");       // Remove wildcard characters from Copilot
        return result;
    }
}

export default { COMMAND_ID, handleTeamsMessagingExtensionQuery }
```


**src/searchApp.ts** を開き、新しく作成したコマンドをインポートします。

```JavaScript
import supplierContactSearchCommand from "./messageExtensions/supplierContactSearchCommand";
```

さらに **handleTeamsMessagingExtensionQuery** 内で *case customerSearchCommand.COMMAND_ID:* の後に新しい case を追加します。

```JavaScript
  case supplierContactSearchCommand.COMMAND_ID: {
        return supplierContactSearchCommand.handleTeamsMessagingExtensionQuery(context, query);
      } 
```

**appPackage/manifest.json** を開き、*composeExtensions* 配下の *commands* 配列にコマンドを追加します。

```JSON
 {
                    "id": "supplierContactSearch",
                    "context": [
                        "compose",
                        "commandBox"
                    ],
                    "description": "Search for a contact in the user's Outlook contacts list for Northwind",
                    "title": "Contact search",
                    "type": "query",
                    "parameters": [
                        {
                            "name": "name",
                            "title": "Contact search",
                            "description": "Type name of the contact or company which forms the domain for email address of the contact, to search my Outlook contacts list",
                            "inputType": "text"
                        }
                    ] 
         } 
```

これでモック データを使った非認証の連絡先検索コマンドが追加されました。 

### 手順 2: Agents Toolkit で Azure にサインイン

Agents Toolkit ではアプリをホストする Azure リソースをプロビジョニングするために Azure アカウントとサブスクリプションへのサインインが必要です。

1️⃣ プロジェクト エディターのアクティビティ バーで Microsoft Teams アイコンを選択。Agents Toolkit のパネルが開きます。  
2️⃣ Accounts の下で "Sign in to Azure" を選択します。

![Sign into azure](../../assets/images/extend-message-ext-04/03-sign-into-azure.png)

表示されるダイアログで "Sign in" をクリックします。

![Sign in dialog](../../assets/images/extend-message-ext-04/03-sign-into-azure-alert.png)


### 手順 3: Teams でアプリを実行して新しいコマンドをテスト

アプリをローカルで実行してコマンドをテストします。

F5 を押すか、開始ボタン 1️⃣ をクリックします。デバッグ プロファイルを選択する画面が表示されたら "Debug in Teams (Edge)" 2️⃣ を選択してください。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)


!!! tip "このラボでの F5"
       F5 を押してアプリを実行すると、Exercise 1 で設定したとおり認証フローに必要なすべてのリソースもプロビジョニングされます。 

環境変数をクリアしたため、Entra ID アプリと Bot Service も Azure にインストールされます。初回実行時には、Agents Toolkit でサインインした Azure サブスクリプションのリソース グループを選択する必要があります。

![resource group selection](../../assets/images/extend-message-ext-04/new-resource-group.png)

**+ New resource group** を選択し、提案されたデフォルト名で Enter。

次に Location を選択します。ここでは **Central US** を選択してください。

![resource group selection](../../assets/images/extend-message-ext-04/new-resource-group2.png)

その後、Agents Toolkit がリソースをプロビジョニングする前に確認ダイアログを表示します。

![provision](../../assets/images/extend-message-ext-04/provision.png)

**Provision** を選択します。

プロビジョニングが完了するとブラウザーに Northwind アプリのインストール ダイアログが表示されるので **Add** を選択します。

![provision](../../assets/images/extend-message-ext-04/app-install.png)

インストール後、アプリを開くか確認するダイアログが表示されます。**Open** を選択してください。

![app open](../../assets/images/extend-message-ext-04/app-open.png)

チームズ チャットでアプリをテストします。  
個人チャットで **Contact search** を選択し、*a* と入力します。 

![app open](../../assets/images/extend-message-ext-04/contacts-non-auth.png)

上図のように連絡先が表示されれば、モック データですがコマンドは正常に動作しています。次のエクササイズでこれを改善します。

## Exercise 3 : 新しいコマンドに認証を追加

前のステップで新しいコマンドの基盤を作成しました。ここでは認証を追加し、モックの連絡先リストをログイン ユーザーの Outlook 連絡先へ置き換えます。

まずプラグインに必要な npm パッケージをインストールします。ターミナルを開き、以下を実行してください。

```CLI
npm i @microsoft/microsoft-graph-client @microsoft/microsoft-graph-types
```

**src/config.ts** を開き、`storageAccountConnectionString: process.env.STORAGE_ACCOUNT_CONNECTION_STRING` の行末に "," を追加し、以下のプロパティを追加します。

<pre>
 const config = {
  botId: process.env.BOT_ID,
  botPassword: process.env.BOT_PASSWORD,
  storageAccountConnectionString: process.env.STORAGE_ACCOUNT_CONNECTION_STRING,
  connectionName: process.env.CONNECTION_NAME
};
</pre>

次に **src/services** フォルダーを作成し、その中に **AuthService.ts** と **GraphService.ts** を作成します。  

- **AuthService** : 認証サービスを提供するクラス。**getSignInLink** メソッドでサインイン URL を取得します。  
- **GraphService** : Microsoft Graph API と対話するクラス。トークンを使って Graph クライアントを初期化し **getContacts** でユーザーの連絡先を取得します。

**AuthService.ts** に以下をコピーします。

```JavaScript
import {
  AdaptiveCardInvokeResponse,
  CloudAdapter,
  MessagingExtensionQuery,
  MessagingExtensionResponse,
  TurnContext,
} from 'botbuilder';
import { UserTokenClient } from 'botframework-connector';
import { Activity } from 'botframework-schema';
import config from '../config';

export class AuthService {
  private client: UserTokenClient;
  private activity: Activity;
  private connectionName: string;

  constructor(context: TurnContext) {
    const adapter = context.adapter as CloudAdapter;
    this.client = context.turnState.get<UserTokenClient>(
      adapter.UserTokenClientKey
    );
    this.activity = context.activity;
    this.connectionName = config.connectionName;
  }

  async getUserToken(
    query?: MessagingExtensionQuery
  ): Promise<string | undefined> {
    const magicCode =
      query?.state && Number.isInteger(Number(query.state)) ? query.state : '';

    const tokenResponse = await this.client.getUserToken(
      this.activity.from.id,
      this.connectionName,
      this.activity.channelId,
      magicCode
    );

    return tokenResponse?.token;
  }

  async getSignInComposeExtension(): Promise<MessagingExtensionResponse> {
    const signInLink = await this.getSignInLink();

    return {
      composeExtension: {
        type: 'auth',
        suggestedActions: {
          actions: [
            {
              type: 'openUrl',
              value: signInLink,
              title: 'SignIn',
            },
          ],
        },
      },
    };
  }

  async getSignInAdaptiveCardInvokeResponse(): Promise<AdaptiveCardInvokeResponse> {
    const signInLink = await this.getSignInLink();

    return {
      statusCode: 401,
      type: 'application/vnd.microsoft.card.signin',

      value: {
        signinurl: signInLink,
      },
    };
  }

  async getSignInLink(): Promise<string> {
    const { signInLink } = await this.client.getSignInResource(
      this.connectionName,
      this.activity,
      ''
    );

    return signInLink;
  }
}

```

**GraphService.ts** に以下をコピーします。

```JavaScript
import { Client } from '@microsoft/microsoft-graph-client';


export class GraphService {
  private _token: string;
  private graphClient: Client;

  constructor(token: string) {
    if (!token || !token.trim()) {
      throw new Error('SimpleGraphClient: Invalid token received.');
    }
    this._token = token;

    this.graphClient = Client.init({
      authProvider: done => {
        done(null, this._token);
      },
    });
  }
  async getContacts(): Promise<any> {
    const response = await this.graphClient
      .api(`me/contacts`)
      .select('displayName,emailAddresses')
      .get();

    return response.value;
  }
}

```



次に **supplierContactSearchCommand.ts** を開き、先ほど追加したサービスをインポートします。

```JavaScript
import { AuthService } from "../services/AuthService";
import { GraphService } from "../services/GraphService";
```

続いて、認証を初期化し、ユーザー トークンを取得・検証して Microsoft Graph API と連携するコードを *handleTeamsMessagingExtensionQuery* 関数内、**allContacts** 定義の上に追加します。

```JavaScript
  const credentials = new AuthService(context);
  const token = await credentials.getUserToken(query);
  if (!token) {
    return credentials.getSignInComposeExtension();
  }
  const graphService = new GraphService(token);
```

次に **allContacts** のモック定義を以下に置き換えます。

```JavaScript
const allContacts = await graphService.getContacts();
```

**appPackage/manifest.json** を開き、*validDomains* ノードを以下に更新します。

```JSON
"validDomains": [
        "token.botframework.com",
        "${{BOT_DOMAIN}}"
    ]
```

さらに "," を追加し、*webApplicationInfo* ノードを次の値で追加します。

```JSON
    "webApplicationInfo": {
        "id": "${{BOT_ID}}",
        "resource": "api://${{BOT_DOMAIN}}/botid-${{BOT_ID}}"
    },
```

最後にマニフェストのバージョンを "1.0.10" から "1.0.11" に更新してください。これによりサインイン URL が正しく生成されます。

## Exercise 4: 認証をテスト

### 手順 1: アプリをローカル実行
デバッガーが実行中の場合は停止します。マニフェストを更新したため、アプリを再インストールする必要があります。  

F5 を押すか開始ボタン 1️⃣ をクリックし、"Debug in Teams (Edge)" 2️⃣ を選択して再度デバッグを開始します。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

!!! pied-piper "Provision"
    再びリソースをプロビジョニングするか確認するダイアログが表示されますが、実際には既存リソースを上書きするだけです。"Provision" を選択してください。

ブラウザーで Teams が開いたら、Agents Toolkit へサインインしたものと同じ資格情報でログインします。  
Teams がアプリを開くか確認するダイアログを表示したら **Open** を選択します。

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

続いて、どのサーフェスでアプリを開くかの選択肢が表示されます。既定では個人チャットです。"Open" を選択してください。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

現在は個人チャットにいますが、Copilot でテストするため次の手順に進みます。 

Teams で **Chat** → **Copilot** の順にクリックします。Copilot が最上部に表示されます。  
**Plugin アイコン** をクリックし **Northwind Inventory** を有効にします。


### 手順 2 : テスト データの入力
実際の連絡先を取得できるよう、まず Microsoft 365 に連絡先を追加します。

1️⃣ Teams から "ワッフル" メニューをクリック  
2️⃣ Microsoft Outlook を選択

![outlook](../../assets/images/extend-message-ext-04/Lab05-002-EnterTestData1.png)

1️⃣ Outlook で "Contacts" ボタンをクリック  
2️⃣ 新しい連絡先を登録します

このアプリは名前とメール アドレスのみ表示します。仕入先らしい名前にしてみてもよいでしょう。

![outlook](../../assets/images/extend-message-ext-04/Lab05-003-EnterTestData2.png)

### 手順 3: Copilot でテスト

Copilot に以下のプロンプトを入力します。  
**Find my contacts with name {first name} in Northwind**  
({first name} は Exercise 4 手順 1 で追加した連絡先の名前に置き換えます)

サインイン ボタンが表示されます (初回のみ)。

![prompt](../../assets/images/extend-message-ext-04/prompt.png)

これはこの機能に認証が必要であることを示しています。**Sign in to Northwind Inventory** を選択します。

次のダイアログで同意を与えると、Microsoft 365 Copilot から結果が返されます。  
![working gif](../../assets/images/extend-message-ext-04/working.gif)

## おめでとうございます
難易度の高いラボでしたが、見事に完了しました！  
Message Extension エージェント トラックのご受講ありがとうございました。

<cc-next url="/" label="Home" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/04-add-authentication" />