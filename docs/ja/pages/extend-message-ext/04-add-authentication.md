---
search:
  exclude: true
---
# ラボ M4 - 認証の追加
このラボでは、前回のラボで作成した Northwind プラグインを Entra ID SSO (single sign-on) で保護し、Outlook のサプライヤー情報など、ご自身の連絡先を検索できるようにします。  

???+ "メッセージ拡張機能ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [ラボ M1 - Northwind メッセージ拡張機能を理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - Microsoft 365 Copilot でアプリを実行する](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新しい検索コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証の追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) (📍現在位置)
    - [ラボ M5 - アクション コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! warning "注意"
    このラボを完了するには、ボット サービスをプロビジョニングするための Azure サブスクリプションが必要です。

!!! tip "ヒント"
    すべてのコード変更を含む完成版は [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/) からダウンロードできます。トラブルシューティングに便利です。  
    変更をリセットしたい場合は、リポジトリを再度クローンしてやり直してください。

このラボで学ぶこと:

- Entra ID SSO をプラグインに追加し、ユーザーが Microsoft Teams と同じアカウントでシームレスにアプリへサインインできるようにする方法  
- Microsoft Graph API へアクセスし、Microsoft 365 内のユーザー データを取得する方法。本ラボでは Outlook の連絡先を安全に取得します。  

## はじめに : SSO 実装に必要なタスク (概要)

プラグイン (メッセージ拡張アプリ) に SSO を実装するには、いくつかの手順があります。以下は高レベルの流れです。

### Microsoft Entra ID でのアプリ登録 & Azure Bot Service でのボット構成
- Azure ポータルで新しいアプリ登録を作成  
- 必要な permission と scope を構成  
- クライアント シークレットを生成  
- Azure Bot Service でボットを作成  
- ボットに Microsoft 365 チャネルを追加  
- Azure ポータルで OAuth 接続設定を構成  

### Teams アプリでの SSO 有効化
- メッセージ拡張機能のボット コードを更新し、認証とトークン交換を処理  
- Bot Framework SDK で SSO 機能を統合  
- OAuth フローを実装し、ユーザーのアクセストークンを取得  

### Teams での認証構成
- Teams アプリ マニフェストに必要な permission を追加  

## 演習 1: Microsoft Entra ID でのアプリ登録と Azure Bot Service でのボット構成

幸い、必要な設定はすべて整えてあるので **F5** を押すだけで動作します。ただし、リソースの登録と構成のためにプロジェクトで変更する箇所を確認していきましょう。 

### 手順 1: ファイルとフォルダーのコピー

ルート フォルダーの **infra** 内に **entra** フォルダーを作成します。  

**entra** フォルダーに **entra.bot.manifest.json** と **entra.graph.manifest.json** の 2 つのファイルを作成します。  

以下のリンクからコードをコピーしてそれぞれのファイルに貼り付けてください。  
- **entra.bot.manifest.json** : [こちら](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/entra/entra.bot.manifest.json){target=_blank}  
- **entra.graph.manifest.json** : [こちら](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/entra/entra.graph.manifest.json){target=_blank}  

これらのファイルは、ボット用と Graph 用の Entra ID アプリ登録をプロビジョニングするために必要です。  

次に **infra** フォルダー内に **azure.local.bicep** を作成し、[こちら](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/azure.local.bicep){target=_blank} からコードをコピーします。同じフォルダーに **azure.parameters.local.json** を作成し、[こちら](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/azure.parameters.local.json){target=_blank} からコードをコピーします。  

これらのファイルはボット登録を支援します。ローカル実行時にも Azure にボット サービスをプロビジョニングする必要があるためです。

!!! note "これらのファイルで何が行われているか?"
    Agents Toolkit がアプリをローカル実行するとき、F0 SKU の Azure AI Bot Service がリソース グループにプロビジョニングされます。F0 SKU は標準チャネル (Microsoft Teams、Microsoft 365 チャネルなど) へのメッセージ送信が無制限で、コストは発生しません。

### 手順 2: 既存コードの更新

**infra/botRegistration/azurebot.bicep** を開き、`param botAppDomain` の宣言後に以下のコード スニペットを追加します。

```bicep
param graphAadAppClientId string
@secure()
param graphAadAppClientSecret string

param connectionName string
```

次に、同じファイルの末尾付近に以下のスニペットを追加し、ボット サービスをプロビジョニングします。

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

これにより、ボット サービスと Graph Entra ID アプリ間でトークンを交換するための新しい OAUTH 接続が作成されます。

!!! tip "プラグインのインフラ変更"
    これまで作成した非認証プラグインとは異なるインフラが必要なため、再構成します。次の手順で進めましょう。 

**teamsapp.local.yml** を開き、内容を下記スニペットで完全に置き換えます。これにより、ラボ用に Azure へボット サービスをデプロイするなど、インフラが再構成されます。 

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

**env** フォルダーの **.env.local** を開き、全変数を削除して下記に置き換えます。 

```
APP_INTERNAL_NAME=Northwind
APP_DISPLAY_NAME=Northwind
CONNECTION_NAME=MicrosoftGraph

```

同じく **.env.local.user** も全変数を削除し、下記に置き換えます。 

```
SECRET_BOT_PASSWORD=
SECRET_GRAPH_AAD_APP_CLIENT_SECRET=
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
```



## 演習 2: 連絡先検索用の新しい検索コマンド

### 手順 1: 連絡先 (サプライヤー) を検索するコマンドを追加

まず、連絡先を検索する新しいコマンドを追加します。最終的には Microsoft Graph から連絡先を取得しますが、まずはモック データでコマンドが正しく動くか確認します。  
**src/messageExtensions** フォルダーに **supplierContactSearchCommand.ts** を作成します。  

以下の内容を新規ファイルにコピーします。

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

そして **handleTeamsMessagingExtensionQuery** 内で *case customerSearchCommand.COMMAND_ID:* の後に新しい case を追加します。

```JavaScript
  case supplierContactSearchCommand.COMMAND_ID: {
        return supplierContactSearchCommand.handleTeamsMessagingExtensionQuery(context, query);
      } 
```

次に **appPackage/manifest.json** を開き、*composeExtensions* ノードの *commands* 配列にコマンドを追加します。

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

Agents Toolkit でリソースをプロビジョニングするには Azure アカウントへのサインインとサブスクリプションが必要です。

1️⃣ プロジェクト エディターのアクティビティ バーで Microsoft Teams アイコンを選択。  

2️⃣ Agents Toolkit パネルの Accounts で "Sign in to Azure" を選択。  

![Sign into azure](../../assets/images/extend-message-ext-04/03-sign-into-azure.png)

表示されたダイアログで "Sign in" を選択します。

![Sign in dialog](../../assets/images/extend-message-ext-04/03-sign-into-azure-alert.png)


### 手順 3: Teams でアプリを実行して新コマンドをテスト

ローカルでアプリを実行します。

F5 を押すか、スタート ボタン 1️⃣ をクリックします。デバッグ プロファイル選択画面が表示されるので Debug in Teams (Edge) 2️⃣ などを選択します。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)


!!! tip "このラボでの F5"
       F5 を押すと、Exercise 1 で設定した Team Toolkit のアクションにより、認証フローに必要なリソースが自動でプロビジョニングされます。 

環境変数をクリアしたため、すべての Entra ID アプリとボット サービスが Azure にインストールされます。初回実行では、Agents Toolkit でサインインした Azure サブスクリプションのリソース グループを選択するよう求められます。

![resource group selection](../../assets/images/extend-message-ext-04/new-resource-group.png)

**+ New resource group** を選択し、提案された名前をそのまま使って Enter。  

次に Location を選択します。ここでは **Central US** を選択。  

![resource group selection](../../assets/images/extend-message-ext-04/new-resource-group2.png)

Agents Toolkit がリソースをプロビジョニングする前に確認ダイアログが表示されます。

![provision](../../assets/images/extend-message-ext-04/provision.png)

**Provision** を選択します。

リソースがすべてプロビジョニングされると、Northwind アプリのインストール ダイアログがブラウザーに表示されます。**Add** を選択。  

![provision](../../assets/images/extend-message-ext-04/app-install.png)

インストール後、アプリを開くためのダイアログが表示されます。**Open** を選択。  

![app open](../../assets/images/extend-message-ext-04/app-open.png)

今回はコマンド動作のみ確認するので Teams チャットでテストします。  
個人チャットで **Contact search** を選択し `a` と入力します。  

![app open](../../assets/images/extend-message-ext-04/contacts-non-auth.png)

上図のように連絡先が一覧表示されれば、モック データを用いたコマンドは機能しています。次の演習で修正します。

## 演習 3 : 新コマンドに認証を付与

前のステップでコマンドの基盤を作成しました。次は認証を追加し、モックの連絡先リストを実際にログイン ユーザーの Outlook 連絡先に置き換えます。

まずプラグインに必要な npm パッケージをインストールします。新しいターミナルを開き、以下を実行します。

```CLI
npm i @microsoft/microsoft-graph-client @microsoft/microsoft-graph-types
```

**src/config.ts** を開き、`storageAccountConnectionString: process.env.STORAGE_ACCOUNT_CONNECTION_STRING` の行末に `,` を追加して次のプロパティを追加します。

```
  connectionName: process.env.CONNECTION_NAME
```

次に **src** フォルダー直下に **services** フォルダーを作成し、**AuthService.ts** と **GraphService.ts** の 2 ファイルを作成します。  

- **AuthService** : サインイン URL を取得するメソッド **getSignInLink** を持つ認証サービス クラス。  
- **GraphService** : Microsoft Graph API と対話するクラス。アクセストークンで Graph クライアントを初期化し、`getContacts` で連絡先を取得。  

**AuthService.ts** に以下を貼り付けます。

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

**GraphService.ts** に以下を貼り付けます。

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



**supplierContactSearchCommand.ts** を開き、追加した 2 つのサービスをインポートします。

```JavaScript
import { AuthService } from "../services/AuthService";
import { GraphService } from "../services/GraphService";
```

次に *handleTeamsMessagingExtensionQuery* 関数内のモック **allContacts** 定義の上に、認証を初期化しユーザートークンを取得するコードを追加します。

```JavaScript
  const credentials = new AuthService(context);
  const token = await credentials.getUserToken(query);
  if (!token) {
    return credentials.getSignInComposeExtension();
  }
  const graphService = new GraphService(token);
```

続いて **allContacts** のモック定義を以下に置き換えます。

```JavaScript
const allContacts = await graphService.getContacts();
```

**appPackage/manifest.json** を開き、*validDomains* ノードを以下のように更新します。

```JSON
"validDomains": [
        "token.botframework.com",
        "${{BOT_DOMAIN}}"
    ]
```

さらに `validDomains` 配列の後に `,` を追加し、*webApplicationInfo* ノードを以下の値で追加します。

```JSON
    "webApplicationInfo": {
        "id": "${{BOT_ID}}",
        "resource": "api://${{BOT_DOMAIN}}/botid-${{BOT_ID}}"
    },
```

最後にマニフェストのバージョンを "1.0.10" から "1.0.11" に更新します。  

これらの変更により、サインイン URL が正しく形成され、ユーザーに同意を求めることができます。

## 演習 4: 認証のテスト

### 手順 1: アプリをローカルで実行
デバッガーが起動したままなら停止します。マニフェストが更新されたのでアプリを再インストールする必要があります。  

F5 を押すかスタート ボタン 1️⃣ をクリックし、Debug in Teams (Edge) 2️⃣ を選択します。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

!!! pied-piper "プロビジョニング"
    再度プロビジョニング確認ダイアログが表示されるので "Provision" を選択します。これは新規リソースを作成するのではなく既存を上書きします。 

ブラウザーで Teams が開きます。Agents Toolkit にサインインしたものと同じ資格情報でログインしてください。  
Teams が起動するとアプリを開くダイアログが表示されます。  

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開く場所を聞かれます。既定は個人チャットです。"Open" を選択。  

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

今回は Copilot でテストするので次へ進みます。  

Teams で **Chat** → **Copilot** をクリックし、**Plugin アイコン** を選択して **Northwind Inventory** を有効化します。


### 手順 2 : テスト データを入力
実際の連絡先を取得できるように Microsoft 365 に連絡先を追加します。

1️⃣ Teams で "ワッフル" メニューをクリック  

2️⃣ Microsoft Outlook を選択  

![outlook](../../assets/images/extend-message-ext-04/Lab05-002-EnterTestData1.png)

1️⃣ Outlook で "Contacts" ボタンをクリック  

2️⃣ 新しい連絡先を追加  

アプリは名前とメールアドレスのみ表示します。サプライヤーらしい名前にするとシナリオに合います。

![outlook](../../assets/images/extend-message-ext-04/Lab05-003-EnterTestData2.png)

### 手順 2: Copilot でテスト

Copilot に次のプロンプトを入力します。  
**Find my contacts with name {first name} in Northwind**  
({first name} は先ほど追加した連絡先の名前に置き換えてください)

サインイン ボタンが表示されます (初回のみ)。  

![prompt](../../assets/images/extend-message-ext-04/prompt.png)

これはプラグイン機能呼び出しに認証が必要であることを示しています。**Sign in to Northwind Inventory** を選択。  

次に同意ダイアログが表示されます。承認すると Microsoft 365 Copilot から結果が返ってきます。  
![working gif](../../assets/images/extend-message-ext-04/working.gif)

## おめでとうございます
難易度の高いラボでしたが、見事に完了しました!  
メッセージ拡張エージェント トラックのご参加ありがとうございました!

<cc-next url="/" label="Home" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/04-add-authentication--ja" />