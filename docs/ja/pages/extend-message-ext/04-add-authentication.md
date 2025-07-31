---
search:
  exclude: true
---
# ラボ M4 - 認証の追加
このラボでは、前のラボで作成した Northwind プラグインを Entra ID の SSO (single sign-on) 認証で保護し、Outlook から仕入先などの自身の連絡先を検索できるようにします。  

???+ "Extend Teams メッセージ拡張ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [ラボ M1 - Northwind メッセージ拡張を理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - Microsoft 365 Copilot でアプリを実行する](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新しい検索コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証の追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) (📍現在地)
    - [ラボ M5 - アクション コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! warning   "注意"
    このラボでは、ボット サービスをプロビジョニングするための Azure サブスクリプションが必要です。

!!! tip "ヒント"
    すべてのコード変更を含む完成済みの演習は [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/) からダウンロードできます。トラブルシューティング時に役立ちます。  
    編集内容をリセットしたい場合は、リポジトリを再度クローンしてやり直してください。

このラボで学習すること:

- Entra ID の  SSO  をプラグインに追加し、ユーザーが Microsoft Teams と同じアカウントでシームレスにアプリへサインインできるようにする方法  
- Microsoft Graph API にアクセスして Microsoft 365 内のユーザー データを取得する方法。本ラボでは、ログインしているユーザー本人の Outlook 連絡先を安全に取得できるようにします。

## はじめに : SSO 実装のタスク (概要)

プラグイン (メッセージ拡張アプリ) に  SSO  を実装するには、いくつかの手順が必要です。以下は高レベルの流れです。

### Microsoft Entra ID でアプリを登録し、Azure Bot Service でボットを構成する
- Azure ポータルで新しいアプリ登録を作成  
- 必要なアクセス許可とスコープを設定  
- クライアント シークレットを生成  
- Azure Bot Service でボットを作成  
- ボットに Microsoft 365 チャネルを追加  
- Azure ポータルで OAuth 接続設定を構成  

### Teams アプリで  SSO  を有効化
- メッセージ拡張のボット コードを更新し、認証とトークン交換を処理  
- Bot Framework SDK を使用して  SSO  機能を統合  
- OAuth フローを実装し、ユーザーのアクセストークンを取得  

### Teams で認証を構成
- Teams アプリ マニフェストに必要なアクセス許可を追加  

## 演習 1: Microsoft Entra ID でアプリを登録し、Azure Bot Service を構成する

幸い、すべては **F5** を押すとすぐに動作するように簡略化されています。ただし、リソースを登録・構成するためにプロジェクトで行う具体的な変更を確認しておきましょう。 

### 手順 1: ファイルとフォルダーをコピー

ルート フォルダーの **infra** 内に **entra** という新しいフォルダーを作成します。  

**entra** フォルダーに **entra.bot.manifest.json** と **entra.graph.manifest.json** という 2 つのファイルを作成します。  

以下の [ファイル](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/entra/entra.bot.manifest.json){target=_blank} からコードをコピーして **entra.bot.manifest.json** に貼り付け、同様に [こちら](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/entra/entra.graph.manifest.json){target=_blank} から **entra.graph.manifest.json** にコピーします。  

これらのファイルは、ボット用と Graph 用の Entra ID アプリ登録 (旧称 Azure Active Directory アプリ登録) をプロビジョニングするために必要です。  

続いて **infra** フォルダーに **azure.local.bicep** を作成し、[このファイル](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/azure.local.bicep){target=_blank} からコードをコピーします。同じ **infra** フォルダーに **azure.parameters.local.json** を作成し、[こちら](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/azure.parameters.local.json){target=_blank} からコードをコピーしてください。  

これらのファイルはボット登録を支援します。この設定により、ローカル実行時でも Azure 上にボット サービスがプロビジョニングされます。これは本認証フローに必須です。

!!! note "これらのファイルで何が行われるのか"
    Agents Toolkit がアプリをローカルで実行するとき、F0 SKU を使用する新しい Azure AI Bot Service がリソース グループにプロビジョニングされます。F0 SKU は標準チャネル (Microsoft Teams や Microsoft 365 チャネル (Outlook と Copilot) を含む) に対して無制限のメッセージ送信が可能で、課金は発生しません。

### 手順 2: 既存コードの更新

次に **infra** フォルダー配下の **botRegistration** フォルダーにある **azurebot.bicep** ファイルを開き、"param botAppDomain" の宣言後に以下のコード スニペットを追加します。

```bicep
param graphAadAppClientId string
@secure()
param graphAadAppClientSecret string

param connectionName string
```

続いて、同ファイルの末尾に以下のスニペットを追加し、ボット サービスをプロビジョニングします。

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

これにより、ボット サービスと Graph の Entra ID アプリ間でトークン交換を行う新しい OAuth 接続が作成されます。

!!! tip "プラグインのインフラ変更"
    これまで構築した認証なしプラグインとは異なるインフラが必要なため、配線を変更します。次の手順で対応します。 

次に **teamsapp.local.yml** を開き、内容を以下のコード スニペットに置き換えます。これにより、インフラの一部が再配線され、ラボ用に Azure にボット サービスがデプロイされます。

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

**env** フォルダー配下の **.env.local** を開き、変数をすべて削除して以下に置き換えます。 

```
APP_INTERNAL_NAME=Northwind
APP_DISPLAY_NAME=Northwind
CONNECTION_NAME=MicrosoftGraph

```

同じフォルダーの **.env.local.user** も変数をすべて削除し、以下に置き換えます。 

```
SECRET_BOT_PASSWORD=
SECRET_GRAPH_AAD_APP_CLIENT_SECRET=
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
```


## 演習 2: 連絡先検索用の新しい検索コマンド 

### 手順 1: 連絡先 (仕入先) 検索コマンドを追加

まず連絡先検索用の新しいコマンドを追加します。最終的には Microsoft Graph から連絡先を取得しますが、まずはモック データを使ってメッセージ拡張コマンドが正しく動作することを確認します。  
**src** フォルダー > **messageExtensions** へ移動し、**supplierContactSearchCommand.ts** という新しいファイルを追加します。

以下の内容を新しいファイルにコピーします。

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


**src** フォルダー > **searchApp.ts** を開き、作成したコマンドをインポートします。

```JavaScript
import supplierContactSearchCommand from "./messageExtensions/supplierContactSearchCommand";
```

さらに、**handleTeamsMessagingExtensionQuery** の *case customerSearchCommand.COMMAND_ID:* の後に新しいコマンド用の case を追加します。

```JavaScript
  case supplierContactSearchCommand.COMMAND_ID: {
        return supplierContactSearchCommand.handleTeamsMessagingExtensionQuery(context, query);
      } 
```

次に **appPackage** > **manifest.json** を開き、*composeExtensions* ノードの *commands* 配列にコマンドを追加します。

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

これでモック リストを使用する認証なしの連絡先検索コマンドが追加されました。 

### 手順 2: Agents Toolkit で Azure にサインイン

Agents Toolkit では、リソース インスタンスをプロビジョニングする前に Azure アカウントにサインインし、サブスクリプションを持っている必要があります。その後、これらのリソースにアプリをデプロイして Azure でホストします。

1️⃣ プロジェクト エディターのアクティビティ バーで Microsoft Teams アイコンを選択します。Agents Toolkit の拡張パネルが開きます。

2️⃣ Agents Toolkit パネルの Accounts 配下で "Sign in to Azure" を選択します。

![Sign into azure](../../assets/images/extend-message-ext-04/03-sign-into-azure.png)

表示されるダイアログで "Sign in" を選択します。

![Sign in dialog](../../assets/images/extend-message-ext-04/03-sign-into-azure-alert.png)


### 手順 3: Teams でアプリを実行して新しいコマンドをテスト


新しいコマンドをテストするため、アプリをローカルで実行します。

F5 キーを押すか、開始ボタン 1️⃣ をクリックしてデバッグを開始します。デバッグ プロファイルを選択する画面が表示されたら、Debug in Teams (Edge) 2️⃣ などを選択します。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)


!!! tip "本ラボでの F5"
       F5 を押してアプリを実行すると、Exercise 1 で設定した Team Toolkit のアクションにより、認証フローに必要なリソースも同時にプロビジョニングされます。 

環境変数をクリアしたため、Entra ID アプリやボット サービスが Azure にインストールされます。初回実行時には、Agents Toolkit 経由でログインした Azure サブスクリプション内のリソース グループを選択する必要があります。

![resource group selection](../../assets/images/extend-message-ext-04/new-resource-group.png)

整理のため **+ New resource group** を選択し、Agents Toolkit が提案する既定の名前を使用して Enter を押します。

次に Location を選択します。このラボでは **Central US** を選択してください。

![resource group selection](../../assets/images/extend-message-ext-04/new-resource-group2.png)

続いて Agents Toolkit がリソースをプロビジョニングしますが、その前に確認ダイアログが表示されます。

![provision](../../assets/images/extend-message-ext-04/provision.png)

**Provision** を選択します。

リソースのプロビジョニングが完了すると、ブラウザーに Northwind アプリのインストール ダイアログが表示されます。**Add** を選択します。


![provision](../../assets/images/extend-message-ext-04/app-install.png)

インストール後、アプリを開くダイアログが表示されます。これにより、パーソナル チャットでメッセージ拡張としてアプリが開きます。**Open** を選択します。


![app open](../../assets/images/extend-message-ext-04/app-open.png)

今回はコマンドが動作するかだけを確認するため、Teams チャットでのみテストします。  
アプリとのパーソナル チャットで **Contacrt search** を選択し、*a* と入力します。 

![app open](../../assets/images/extend-message-ext-04/contacts-non-auth.png)

上図のように連絡先が一覧表示されれば、コマンドはモック データで動作しています。次の演習で実データに置き換えます。

## 演習 3 : 新しいコマンドに認証を有効化

前の手順で新しいコマンドの基礎を作成しました。次はそのコマンドに認証を追加し、モックの連絡先リストをログイン ユーザーの Outlook 連絡先に置き換えます。

まずプラグインに必要な npm パッケージをインストールします。プロジェクトで新しいターミナル ウィンドウを開きます。

ターミナルで以下のスクリプトを実行します。

```CLI
npm i @microsoft/microsoft-graph-client @microsoft/microsoft-graph-types
```

**src** フォルダーの **config.ts** を開き、`storageAccountConnectionString: process.env.STORAGE_ACCOUNT_CONNECTION_STRING` の行の後ろに **,** を付け、`connectionName` プロパティを追加します。

<pre>
 const config = {
  botId: process.env.BOT_ID,
  botPassword: process.env.BOT_PASSWORD,
  storageAccountConnectionString: process.env.STORAGE_ACCOUNT_CONNECTION_STRING<b>,
  connectionName: process.env.CONNECTION_NAME</b>
};
</pre>

次にプロジェクトの **src** フォルダーに **services** フォルダーを作成します。  
このフォルダーに **AuthService.ts** と **GraphService.ts** の 2 ファイルを作成します。 

- **AuthService** : 認証サービス クラスを提供します。**getSignInLink** メソッドがあり、接続情報を使用してサインイン URL を取得し、返します。  
- **GraphService** : Microsoft Graph API と対話するクラスです。認証トークンを使用して Graph クライアントを初期化し、`getContacts` メソッドでユーザーの連絡先 (displayName と emailAddresses) を取得します。  

以下のコードを **AuthService.ts** に貼り付けます。

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

続いて **GraphService.ts** に以下を貼り付けます。

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



次に **supplierContactSearchCommand.ts** に戻り、追加した 2 つのサービスをインポートします。

```JavaScript
import { AuthService } from "../services/AuthService";
import { GraphService } from "../services/GraphService";
```

続いて、認証を初期化し、ユーザー トークンを取得・検証し、トークンが有効なら Microsoft Graph API と対話するサービスを設定するコードを追加します。トークンが無効な場合はユーザーにサインインを促します。

*handleTeamsMessagingExtensionQuery* 関数内、**allContacts** 定義のモックより上に以下のコードをコピーします。

```JavaScript
  const credentials = new AuthService(context);
  const token = await credentials.getUserToken(query);
  if (!token) {
    return credentials.getSignInComposeExtension();
  }
  const graphService = new GraphService(token);
```

次に、**allContacts** 定義のモックを以下のコードに置き換えます。

```JavaScript
const allContacts = await graphService.getContacts();
```

続いて **appPackage/manifest.json** を開き、*validDomains* ノードを以下のように更新します。

```JSON
"validDomains": [
        "token.botframework.com",
        "${{BOT_DOMAIN}}"
    ]
```

さらに `validDomains` 配列の後ろに **,** を追加し、*webApplicationInfo* ノードを以下の値で追加します。

```JSON
    "webApplicationInfo": {
        "id": "${{BOT_ID}}",
        "resource": "api://${{BOT_DOMAIN}}/botid-${{BOT_ID}}"
    },
```

最後にマニフェストのバージョンを "1.0.10" から "1.0.11" に更新し、変更を反映させます。  

これらのマニフェスト変更により、サインイン URL が正しく形成され、ユーザーに同意を求めるリンクが送信されます。

## 演習 4:  認証をテストする

### 手順 1: アプリをローカルで実行 
マニフェストに新しいコマンドを追加したため、アプリを再インストールする必要があります。ローカル デバッガーが起動している場合は停止してください。 

F5 キーを押すか開始ボタン 1️⃣ をクリックしてデバッガーを再起動します。デバッグ プロファイル選択画面では Debug in Teams (Edge) 2️⃣ などを選択します。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

!!! pied-piper "Provision"
    再度リソースをプロビジョニングするかどうかの確認ダイアログが表示されます。"Provision" を選択してください。これは新規リソースの作成ではなく既存リソースの上書きです。 

デバッグによりブラウザーで Teams が開きます。Agents Toolkit にサインインしたのと同じ資格情報でログインしてください。  
Teams が開くとアプリを開くダイアログが表示されます。 

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開く場所を尋ねられます。既定ではパーソナル チャットです。チャンネルやグループ チャットも選択できます。"Open" を選択します。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

現在はアプリとのパーソナル チャットですが、Copilot でテストするので次の手順に従います。 


Teams で **Chat** をクリックし、その後 **Copilot** を選択します。Copilot は最上位に表示されます。  
**Plugin アイコン** をクリックし、**Northwind Inventory** を選択してプラグインを有効化します。


### 手順 2 : テスト データを入力
プラグインで実際の連絡先を取得する前に、連絡先情報を追加する必要があります。
まず Microsoft 365 に連絡先があることを確認しましょう。

1️⃣ Microsoft Teams の "ワッフル" メニューをクリック  

2️⃣ Microsoft Outlook を選択  

![outlook](../../assets/images/extend-message-ext-04/Lab05-002-EnterTestData1.png)

1️⃣ Outlook 内で "Contacts" ボタンをクリック  

2️⃣ 新しい連絡先を入力  

アプリは氏名または会社名とメール アドレスのみを表示します。ビジネス シナリオに合わせたい場合は仕入先らしい名前にしてみてください。

![outlook](../../assets/images/extend-message-ext-04/Lab05-003-EnterTestData2.png)

### 手順 2: Copilot でテスト

Copilot に次のプロンプトを入力します: **Find my conacts with name {first name} in Northwind**  
( {first name} は演習 4 手順 1 で作成した連絡先の名前に置き換えてください)

サインイン ボタンが表示され、一度だけ認証を求められます。 

![prompt](../../assets/images/extend-message-ext-04/prompt.png)

これが、この機能に認証が設定されていることを示しています。**Sign in to Northwind Inventory** を選択してください。

以下の GIF のように同意ダイアログが表示されます。承諾すると Microsoft 365 Copilot から結果が返されるはずです。  
![working gif](../../assets/images/extend-message-ext-04/working.gif)

## おめでとうございます
難易度の高いラボでしたが、見事に達成しました!  
メッセージ拡張エージェント トラックの完了、お疲れさまでした。

<cc-next url="/" label="Home" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/04-add-authentication--ja" />