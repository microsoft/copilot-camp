---
search:
  exclude: true
---
# ラボ M4 - 認証の追加
このラボでは、前のラボで作成した Northwind プラグインに Entra ID の SSO (シングル サインオン) を導入し、Outlook から仕入先情報などの連絡先を検索できるようにアプリを保護します。  

???+ "Extend Teams メッセージ拡張ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [ラボ M1 - Northwind メッセージ拡張を理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - Microsoft 365 Copilot でアプリを実行する](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新しい検索コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証の追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) (📍現在地)
    - [ラボ M5 - アクション コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! warning "注意"
    このラボでは、ボット サービスをプロビジョニングするための Azure サブスクリプションが必要です。

!!! tip "補足"
    すべてのコード変更を含む完成版は [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/) からダウンロードできます。トラブルシューティングの際に役立ちます。  
    変更をリセットする必要がある場合は、リポジトリを再クローンしてやり直してください。

このラボで学習する内容:

- Entra ID SSO をプラグインに追加し、ユーザーが Microsoft Teams と同じアカウントでシームレスにサインインできるようにする方法
- Microsoft Graph API にアクセスして Microsoft 365 内のユーザー データを取得する方法。アプリはログイン中のユーザーとして動作し、このラボでは Outlook の連絡先などユーザー自身のコンテンツに安全にアクセスします。

## はじめに : SSO 実装に関わるタスク (概要)

プラグイン (メッセージ拡張アプリ) に SSO を実装するには、いくつかのステップが必要です。高レベルでの流れを示します。

### Microsoft Entra ID でのアプリ登録 & Azure Bot Service でのボット構成
- Azure ポータルで新しいアプリ登録を作成します。
- 必要な権限とスコープを構成します。
- クライアント シークレットを生成します。
- Azure Bot Service でボットを作成します。
- ボットに Microsoft 365 チャネルを追加します。
- Azure ポータルで OAuth 接続設定を構成します。

### Teams アプリで SSO を有効化
- メッセージ拡張のボット コードを更新し、認証とトークン交換を処理します。
- Bot Framework SDK を使用して SSO 機能を統合します。
- OAuth フローを実装してユーザーのアクセストークンを取得します。

### Teams での認証構成
- Teams アプリの manifest に必要な権限を追加します。

## 演習 1: Entra ID でのアプリ登録 & Azure Bot Service でのボット構成

幸いにも、必要な作業は最小限になるように準備されていますので **F5** を押すだけで動作させられます。ただし、リソースを登録・構成するためにプロジェクトで行う変更点を確認しましょう。 

### 手順 1: ファイルとフォルダーのコピー

ルート フォルダーの **infra** フォルダー内に **entra** という新しいフォルダーを作成します。 

**entra** フォルダーに **entra.bot.manifest.json** と **entra.graph.manifest.json** という 2 つの新しいファイルを作成します。 

[このファイル](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/entra/entra.bot.manifest.json){target=_blank} からコードをコピーして **entra.bot.manifest.json** に貼り付け、同様に **entra.graph.manifest.json** には [こちらのファイル](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/entra/entra.graph.manifest.json){target=_blank} からコピーします。

これらのファイルは、ボット用と Graph 用の Entra ID アプリ登録 (以前の Azure Active Directory アプリ登録) をプロビジョニングするために必要です。 

次に **infra** フォルダーに **azure.local.bicep** を作成し、[このファイル](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/azure.local.bicep){target=_blank} からコピーします。そして同じ **infra** フォルダーに **azure.parameters.local.json** を作成し、[このファイル](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/azure.parameters.local.json){target=_blank} からコピーします。

これらのファイルはボット登録を補助します。ローカル実行時でも Azure にボット サービスをプロビジョニングし、この認証フローに必要な環境を整えます。

!!! note "これらのファイルで何が行われるのか?"
    Agents Toolkit がアプリをローカル実行する際、F0 SKU の Azure AI Bot Service をリソース グループにプロビジョニングします。F0 は標準チャネル (Microsoft Teams と Microsoft 365 チャネル – Outlook と Copilot) へのメッセージ送信が無制限で、料金は発生しません。

### 手順 2: 既存コードの更新

**infra/botRegistration** フォルダー内の **azurebot.bicep** を開き、`param botAppDomain` の宣言後に次のコード スニペットを追加します。

```bicep
param graphAadAppClientId string
@secure()
param graphAadAppClientSecret string

param connectionName string
```

次に、同じファイルの末尾にボット サービスをプロビジョニングするスニペットを追加します。

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

これにより、ボット サービスと Graph の Entra ID アプリ間でトークン交換を行うための新しい OAUTH 接続が作成されます。

!!! tip "プラグイン向けインフラの変更"
    これまで作成した非認証プラグインとは異なるインフラが必要なため、配線し直します。次の手順で設定を行います。 

次に **teamsapp.local.yml** を開き、内容をすべて次のスニペットに置き換えます。これにより Azure にボット サービスをデプロイするなど、インフラの一部が再構成されます。 

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

**env** フォルダー内の **.env.local** を開き、すべての変数を削除して次の内容で新しくします。 

```
APP_INTERNAL_NAME=Northwind
APP_DISPLAY_NAME=Northwind
CONNECTION_NAME=MicrosoftGraph

```

同じく **.env.local.user** もすべての変数を削除し、次の内容で新しくします。 

```
SECRET_BOT_PASSWORD=
SECRET_GRAPH_AAD_APP_CLIENT_SECRET=
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
```


## 演習 2: Contacts 用の新しい検索コマンド 

### 手順 1: 連絡先 (仕入先) を検索するコマンドの追加

まず、連絡先を検索する新しいコマンドを追加します。最終的には Microsoft Graph から連絡先を取得しますが、まずはメッセージ拡張コマンドが正しく機能するか確認するため、モック データを使用します。  
**src/messageExtensions** フォルダーに **supplierContactSearchCommand.ts** ファイルを新規作成します。

次の内容を新しいファイルにコピーします。

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

さらに、`handleTeamsMessagingExtensionQuery` 内で *case customerSearchCommand.COMMAND_ID:* の後に次の case を追加します。

```JavaScript
  case supplierContactSearchCommand.COMMAND_ID: {
        return supplierContactSearchCommand.handleTeamsMessagingExtensionQuery(context, query);
      } 
```

次に **appPackage/manifest.json** を開き、ノード *composeExtensions* 配下の *commands* 配列にコマンドを追加します。

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

これで、モック リストを使用した非認証の連絡先検索コマンドが追加されました。 

### 手順 2: Agents Toolkit で Azure にサインイン

Agents Toolkit では、リソースをプロビジョニングする前に Azure アカウントへサインインし、サブスクリプションを保持している必要があります。これらのリソースを使ってアプリを Azure にデプロイします。

1️⃣ プロジェクト エディターのアクティビティ バーで Microsoft Teams アイコンを選択します。Agents Toolkit のパネルが開きます。

2️⃣ パネルの Accounts で「Sign in to Azure」を選択します。

![Sign into azure](../../assets/images/extend-message-ext-04/03-sign-into-azure.png)

表示されるダイアログで「Sign in」を選択します。

![Sign in dialog](../../assets/images/extend-message-ext-04/03-sign-into-azure-alert.png)


### 手順 3: Teams でアプリを実行して新コマンドをテスト

新しいコマンドをテストするには、アプリをローカルで実行します。

F5 キーを押すか、スタート ボタン 1️⃣ をクリックします。デバッグ プロファイルの選択画面が表示されるので、Debug in Teams (Edge) 2️⃣ などを選択します。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)


!!! tip "このラボでの F5"
       F5 を押すと、Exercise 1 で Team Toolkit のアクションを用いて構成した認証フローに必要なリソースもすべてプロビジョニングされます。 

環境変数をクリアしたため、Entra ID アプリとボット サービスが Azure に新規インストールされます。初回実行時に、Agents Toolkit にサインインした Azure サブスクリプション内でリソース グループを選択する必要があります。

![resource group selection](../../assets/images/extend-message-ext-04/new-resource-group.png)

整理のため **+ New resource group** を選択し、提案された既定名をそのまま使用して Enter を押します。

次に Location を選択します。このラボでは **Central US** を選択してください。

![resource group selection](../../assets/images/extend-message-ext-04/new-resource-group2.png)

Agents Toolkit はリソースをプロビジョニングしますが、その前に確認を求めるダイアログが表示されます。

![provision](../../assets/images/extend-message-ext-04/provision.png)

**Provision** を選択します。

リソースのプロビジョニングが完了すると、Northwind アプリのインストール ダイアログがブラウザーに表示されます。**Add** を選択します。

![provision](../../assets/images/extend-message-ext-04/app-install.png)

インストール後、アプリを開くかどうか尋ねるダイアログが表示されます。パーソナル チャットでメッセージ拡張としてアプリを開くので **Open** を選択します。

![app open](../../assets/images/extend-message-ext-04/app-open.png)

今回はコマンドの動作確認だけなので、Teams チャットでテストします。  
アプリとのパーソナル チャットで **Contact search** を選択し、*a* と入力します。 

![app open](../../assets/images/extend-message-ext-04/contacts-non-auth.png)

上記のように連絡先が一覧表示されれば、モック データでコマンドが機能しています。次の演習で実データに置き換えます。

## 演習 3 : 新コマンドに認証を有効化

前のステップで新しいコマンドの基盤を作成しました。次に、これに認証を追加し、モックの連絡先リストをログインユーザーの Outlook 連絡先の実データに置き換えます。

まずプラグインに必要な npm パッケージをインストールします。プロジェクトで新しいターミナル ウィンドウを開きます。

ターミナルで次のスクリプトを実行します。

```CLI
npm i @microsoft/microsoft-graph-client @microsoft/microsoft-graph-types
```
**src/config.ts** を開き、`storageAccountConnectionString: process.env.STORAGE_ACCOUNT_CONNECTION_STRING` の後に"," を追加し、`connectionName` のプロパティを以下のように追加します。

<pre>
 const config = {
  botId: process.env.BOT_ID,
  botPassword: process.env.BOT_PASSWORD,
  storageAccountConnectionString: process.env.STORAGE_ACCOUNT_CONNECTION_STRING<b>,
  connectionName: process.env.CONNECTION_NAME</b>
};
</pre>

次に **src** フォルダーに **services** フォルダーを作成し、その中に **AuthService.ts** と **GraphService.ts** の 2 つのファイルを作成します。 

- **AuthService** : 認証サービスを提供するクラスです。**getSignInLink** メソッドで、接続情報を使用してクライアントからサインイン URL を非同期で取得し返します。
- **GraphService** : Microsoft Graph API と対話するクラスです。認証トークンを使用して Graph クライアントを初期化し、`getContacts` メソッドでユーザーの連絡先 (displayName と emailAddresses) を取得します。

**AuthService.ts** に次のコードを貼り付けます。

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

**GraphService.ts** に次のコードを貼り付けます。

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



次に **supplierContactSearchCommand.ts** に戻り、先ほど追加した 2 つのサービスをインポートします。

```JavaScript
import { AuthService } from "../services/AuthService";
import { GraphService } from "../services/GraphService";
```
続いて、認証を初期化し、ユーザー トークンを取得して有効性を確認し、有効であれば Microsoft Graph API と連携するサービスを設定するコードを追加します。トークンが無効な場合はユーザーにサインインを促します。

`handleTeamsMessagingExtensionQuery` 関数内で **allContacts** 定義のモックの上に次のコードをコピーします。

```JavaScript
  const credentials = new AuthService(context);
  const token = await credentials.getUserToken(query);
  if (!token) {
    return credentials.getSignInComposeExtension();
  }
  const graphService = new GraphService(token);
```

次に **allContacts** 定数のモック定義を次のコードに置き換えます。

```JavaScript
const allContacts = await graphService.getContacts();
```

**appPackage/manifest.json** を開き、*validDomains* ノードを次のように更新します。

```JSON
"validDomains": [
        "token.botframework.com",
        "${{BOT_DOMAIN}}"
    ]
```

さらに `validDomains` 配列の後ろに "," を追加し、*webApplicationInfo* ノードを追加して次の値を設定します。

```JSON
    "webApplicationInfo": {
        "id": "${{BOT_ID}}",
        "resource": "api://${{BOT_DOMAIN}}/botid-${{BOT_ID}}"
    },
```

manifest のバージョンも "1.0.10" から "1.0.11" に更新して変更を反映させます。 

これらの manifest の変更により、サインイン URL が正しく生成され、ユーザーに同意を求めるメッセージが送信されます。

## 演習 4: 認証のテスト

### 手順 1: アプリをローカル実行 
デバッガーが起動したままの場合は停止してください。manifest に新しいコマンドを追加したため、アプリ パッケージを再インストールする必要があります。 

F5 キーを押すか、スタート ボタン 1️⃣ をクリックしてデバッガーを再起動します。デバッグ プロファイル選択画面で Debug in Teams (Edge) 2️⃣ などを選択します。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

!!! pied-piper "Provision"
    再びリソースをプロビジョニングするか確認するダイアログが表示されます。**Provision** を選択してください。実際には新規リソースではなく既存リソースの上書きです。 

デバッグを開始すると、Teams がブラウザーで開きます。Agents Toolkit にサインインしたものと同じ資格情報でログインしてください。  
Teams が開いたら、アプリを開くかどうか尋ねるダイアログが表示されます。 

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開くとすぐに、アプリをどこで開くか尋ねられます。既定はパーソナル チャットです。チャンネルやグループ チャットも選択できます。**Open** を選択します。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

現在はアプリとのパーソナル チャットにいますが、Copilot でテストするため次の手順に進みます。 

Teams で **Chat** をクリックし、**Copilot** を選択します (通常は最上部にあります)。  
**Plugin アイコン** をクリックし、**Northwind Inventory** を選択してプラグインを有効にします。


### 手順 2 : テスト データの入力
実際の連絡先を取得する前に、Microsoft 365 に連絡先情報を追加する必要があります。

1️⃣ Microsoft Teams から "ワッフル" メニューをクリックします。

2️⃣ Microsoft Outlook を選択します。

![outlook](../../assets/images/extend-message-ext-04/Lab05-002-EnterTestData1.png)

1️⃣ Outlook 内で "Contacts" ボタンをクリックします。

2️⃣ 新しい連絡先を入力します。

アプリは名前とメール アドレスのみを表示します。ビジネス シナリオに合わせたい場合は、仕入先らしい名前にしてもかまいません。

![outlook](../../assets/images/extend-message-ext-04/Lab05-003-EnterTestData2.png)

### 手順 2: Copilot でテスト

Copilot に次のプロンプトを入力します: **Find my conacts with name {first name} in Northwind**  
({first name} は演習 4 手順 1 で登録した連絡先の名前に置き換えてください)

サインイン ボタンが表示され、(初回のみ) 認証を求められます。 

![prompt](../../assets/images/extend-message-ext-04/prompt.png)

これは、このプラグイン機能を呼び出すために認証が必要であることを示しています。**Sign in to Northwind Inventory** を選択します。

次の GIF のように同意ダイアログが表示されます。同意すると Microsoft 365 Copilot から結果が返ってくるはずです。
![working gif](../../assets/images/extend-message-ext-04/working.gif)

## おめでとうございます
難易度の高いラボでしたが、見事に完了しました!  
Message Extension エージェント トラック、お疲れさまでした。

<cc-next url="/" label="Home" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/04-add-authentication" />