---
search:
  exclude: true
---
# Lab M4 － 認証の追加
このラボでは、前のラボで作成した Northwind プラグインに Entra ID SSO  ( シングル サインオン ) を使用した認証を追加し、Outlook から自分自身の連絡先、例えばサプライヤー情報を検索して取得できるようにします。

???+ "Extend Teams Message Extension ラボ (Extend Path) のナビゲーション"
    - [Lab M0 － 必要条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [Lab M1 － Northwind メッセージ拡張の概要](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [Lab M2 － Microsoft 365 Copilot でアプリを実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [Lab M3 － 新しい検索コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [Lab M4 － 認証の追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) (📍 現在ここにいます)
    - [Lab M5 － アクション コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! warning   "注意事項"
    このラボでは、ボット サービスをプロビジョニングするために Azure Subscripton が必要です。

!!! tip "NOTE"
    コードの変更をすべて含む完成済みの演習は、[こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/) からダウンロードできます。トラブルシューティングの際に役立つ場合があります。
    もし編集内容をリセットする必要がある場合は、リポジトリを再度クローンし、最初から始めることができます。

このラボでは、以下の内容を学習します:

- Entra ID シングル サインオン ( SSO ) をプラグインに追加し、ユーザーが Microsoft Teams で使用しているアカウントでシームレスにアプリにログインできるようにする方法

- Microsoft Graph API にアクセスして Microsoft 365 内のユーザー データにアクセスする方法。アプリはログイン中のユーザーに代わって動作し、このラボでは Outlook の連絡先など、ユーザー自身のコンテンツに安全にアクセスできるようにします。

## イントロダクション : SSO 実装に関するタスク概要

プラグイン (メッセージ拡張アプリ) の SSO を実装するには、いくつかのステップが必要です。以下はそのプロセスの概要です:

### Microsoft Entra ID でのアプリ登録 ＆ Azure Bot Service でのボット構成
- Azure ポータルで新しいアプリ登録を作成します。
- 必要な権限とスコープを設定してアプリを構成します。
- アプリ用のクライアント シークレットを生成します。
- Azure Bot Service でボットを作成します。
- ボットに Microsoft 365 チャネルを追加します。
- Azure ポータルで OAuth 接続の設定を行います。

### Teams アプリでの SSO 有効化
- メッセージ拡張のボット コードを更新し、認証およびトークン交換を処理させます。
- Bot Framework SDK を使用して SSO 機能を統合します。
- ユーザーのアクセストークンを取得するための OAuth フローを実装します。

### Teams での認証設定
- Teams アプリ マニフェストに必要な権限を追加します。

## 演習 1: Microsoft Entra ID でのアプリ登録と Azure Bot Service でのボット構成

幸いなことに、すべてが簡略化され、 **F5** を押すだけで実行できるようになっています。しかし、これらのリソースの登録と構成のためにプロジェクト内で行う具体的な変更点について確認していきましょう。

### ステップ 1: ファイルとフォルダーのコピー

ルート フォルダー内の **infra** フォルダーに **entra** という新しいフォルダーを作成します。

**entra** フォルダー内に **entra.bot.manifest.json** と **entra.graph.manifest.json** という 2 つの新しいファイルを作成します。

この [ファイル](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/entra/entra.bot.manifest.json){target=_blank} のコードを **entra.bot.manifest.json** にコピーし、同様にこの [ファイル](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/entra/entra.graph.manifest.json){target=_blank} のコードを **entra.graph.manifest.json** にコピーしてください。

これらのファイルは、ボット用に必要な Entra ID アプリ登録 (以前は Azure Active Directory アプリ登録として知られていた) と、トークン交換用の Graph アプリのプロビジョニングに必要です。

次に、**infra** フォルダー内に **azure.local.bicep** ファイルを作成し、この [ファイル](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/azure.local.bicep){target=_blank} のコードをコピーします。同じ **infra** フォルダー内に **azure.parameters.local.json** ファイルを作成し、この [ファイル](https://raw.githubusercontent.com/microsoft/copilot-camp/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/azure.parameters.local.json){target=_blank} のコードをコピーしてください。

これらのファイルは、ボット登録のために使用されます。これにより、ローカルでアプリを実行している場合でも、Azure にボット サービスがプロビジョニングされることが保証されます。この認証フローにはこれが必要となります。

!!! note "これらのファイルの役割"
    Agents Toolkit がアプリをローカルで実行する際、標準チャネル（Microsoft Teams および Microsoft 365 チャネル ( Outlook および Copilot を含む )）に無制限にメッセージを送信できる F0 SKU を使用する新しい Azure AI Bot Service を対象のリソース グループにプロビジョニングします。このプロビジョニングは費用が発生しません。

### ステップ 2: 既存コードの更新

次に、**infra** フォルダー内の **botRegistration** フォルダーにある **azurebot.bicep** ファイルを開き、"param botAppDomain" の宣言の後に以下のコード スニペットを追加します。

```bicep
param graphAadAppClientId string
@secure()
param graphAadAppClientSecret string

param connectionName string
```

次に、同じファイルの末尾に、以下のコード スニペットを追加してボット サービスをプロビジョニングします。

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

これにより、ボット サービスと Graph Entra ID アプリ間のトークン交換用の新しい OAUTH 接続が作成されます。

!!! Tip "プラグインのインフラ変更"
    これまで構築してきた非認証プラグインとは異なるインフラが必要となるため、構成を再設定する必要があります。次のステップでその方法を確認できます。

次に、**teamsapp.local.yml** ファイルを開き、内容を以下のコード スニペットに置き換えます。これにより、Bot Service のデプロイなど、インフラの一部が再設定されます。

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

**env** フォルダーにある **.env.local** ファイルを開き、既存のすべての変数を完全に削除して、以下の内容を追加します。

```
APP_INTERNAL_NAME=Northwind
APP_DISPLAY_NAME=Northwind
CONNECTION_NAME=MicrosoftGraph

```

**env** フォルダーにある **.env.local.user** ファイルも開き、全変数を完全に削除して、以下の内容を追加します。

```
SECRET_BOT_PASSWORD=
SECRET_GRAPH_AAD_APP_CLIENT_SECRET=
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
```

## 演習 2: 連絡先のための新しい検索コマンド

### ステップ 1: 連絡先（サプライヤー）検索のためのコマンドの追加

まず、連絡先を検索する新しいコマンドを追加します。最終的には Microsoft Graph から連絡先の詳細を取得しますが、ここではメッセージ拡張コマンドが正常に動作するかを確認するために、モック データを使用します。
**src** フォルダー > **messageExtensions** 内に新しいファイル **supplierContactSearchCommand.ts** を追加します。

新しいファイルに以下の内容をコピーしてください。

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

**src** フォルダー内の **searchApp.ts** ファイルに移動し、新しく作成したコマンドをインポートします。

```JavaScript
import supplierContactSearchCommand from "./messageExtensions/supplierContactSearchCommand";
```

そして、*case customerSearchCommand.COMMAND_ID:* の後に、新規追加したコマンドのために **handleTeamsMessagingExtensionQuery** 内に別のケースを追加します。

```JavaScript
  case supplierContactSearchCommand.COMMAND_ID: {
        return supplierContactSearchCommand.handleTeamsMessagingExtensionQuery(context, query);
      } 
```

次に、**appPackage** フォルダーの **manifest.json** に移動し、*composeExtensions* ノード内の *commands* 配列にコマンドを追加します。

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

これにより、モック リストから連絡先を検索するための新しい非認証コマンドが追加されます。

### ステップ 2: Agents Toolkit で Azure へのサインイン

Agents Toolkit を使用するには、Azure アカウントにサインインし、サブスクリプションが必要です。その後、これらのリソースを使用してアプリを Azure にデプロイしてホストします。

プロジェクト エディターのアクティビティ バーで、Microsoft Teams アイコン 1️⃣ を選択します。これにより、Agents Toolkit 拡張パネルが開きます。

Agents Toolkit パネル内の「Accounts」セクションで、"Sign in to Azure" 2️⃣ を選択してください。

![Sign into azure](../../assets/images/extend-message-ext-04/03-sign-into-azure.png)

表示されるダイアログで "Sign in" を選択します。

![Sign in dialog](../../assets/images/extend-message-ext-04/03-sign-into-azure-alert.png)

### ステップ 3: Teams でアプリを実行して新しいコマンドをテスト

新しいコマンドをテストするために、アプリをローカルで実行する必要があります。

F5 をクリックしてデバッグを開始するか、スタート ボタン 1️⃣ をクリックします。デバッグ プロファイルを選択する機会があり、Debug in Teams (Edge) 2️⃣ を選択するか、別のプロファイルを選択してください。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

!!! tip "このラボでの F5"
       F5 を押してアプリを実行すると、演習 1 で設定した Teams Toolkit のアクションを使用して、認証フローに必要なすべてのリソースもプロビジョニングされます。

環境変数をクリアしたため、Azure にすべての Entra ID アプリとボット サービスがインストールされます。初回実行時には、Agents Toolkit を通じてサインインした Azure サブスクリプション内のリソース グループを選択する必要があります。

![resource group selection](../../assets/images/extend-message-ext-04/new-resource-group.png)

整理整頓のために **+ New resource group** を選択してください。そして、Agents Toolkit が提案したデフォルト名を選択し、Enter を押します。

次に、ロケーションを選択してください。このラボでは **Central US** を選択します。

![resource group selection](../../assets/images/extend-message-ext-04/new-resource-group2.png)

続いて、Agents Toolkit はリソースをプロビジョニングしますが、実行前に確認を求めるダイアログも表示されます。

![provision](../../assets/images/extend-message-ext-04/provision.png)

**Provision** を選択してください。

すべてのリソースがプロビジョニングされると、ブラウザーで Northwind アプリのインストール ダイアログが表示されるので、**Add** を選択してください。

![provision](../../assets/images/extend-message-ext-04/app-install.png)

インストール完了後、アプリを開くかどうかのダイアログが表示されます。これにより、個人チャット内にメッセージ拡張としてアプリが開かれます。**Open** を選択してください。

![app open](../../assets/images/extend-message-ext-04/app-open.png)

コマンドが動作するかどうかをテストするために、Teams チャット内でアプリをテストします。
個人チャット内で、アプリの **Contacrt search** を選択し、*a* と入力してください。

![app open](../../assets/images/extend-message-ext-04/contacts-non-auth.png)

上記のように連絡先がリスト表示されれば、コマンドは正常に動作しています（ただし、モック データを使用しています）。次の演習でこれを修正します。

## 演習 3 : 新しいコマンドへの認証の有効化

前のステップで新しいコマンドの基礎を構築しました。次に、コマンドに認証を追加し、モックの連絡先リストを置き換えて、ログイン中のユーザーの Outlook 連絡先から実際の連絡先リストを取得するようにします。

まず、プラグインに必要ないくつかの npm パッケージをインストールします。プロジェクトで新しいターミナル ウィンドウを作成してください。

以下のスクリプトをターミナルで実行します:

```CLI
npm i @microsoft/microsoft-graph-client @microsoft/microsoft-graph-types
```

**src** フォルダー内の **config.ts** ファイルを探します。`storageAccountConnectionString: process.env.STORAGE_ACCOUNT_CONNECTION_STRING` の後にコンマ「,」を追加し、以下のように新しいプロパティ `connectionName` とその値を追加してください。

<pre>
 const config = {
  botId: process.env.BOT_ID,
  botPassword: process.env.BOT_PASSWORD,
  storageAccountConnectionString: process.env.STORAGE_ACCOUNT_CONNECTION_STRING<b>,
  connectionName: process.env.CONNECTION_NAME</b>
};
</pre>

次に、プロジェクトのベースとなる **src** フォルダー内に **services** というフォルダーを作成します。
その中に **AuthService.ts** と **GraphService.ts** の 2 つのファイルを作成します。

- **AuthService** : 認証サービスを提供するクラスを含みます。特定の接続の詳細を使用して、非同期にサインイン URL を取得し、この URL を返す **getSignInLink** メソッドが含まれます。

- **GraphService** : Microsoft Graph API と連携するクラスを定義します。認証トークンを使用して Graph クライアントを初期化し、ユーザーの連絡先を取得するために特定のフィールド (displayName と emailAddresses) を選択して取得する getContacts メソッドを提供します。

次に、**AuthService.ts** に以下のコードをコピー＆ペーストしてください。

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

次に、**GraphService.ts** に以下のコードをコピー＆ペーストしてください。

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

続いて、**supplierContactSearchCommand.ts** ファイルに戻り、先ほど追加した 2 つのサービスをインポートしてください。

```JavaScript
import { AuthService } from "../services/AuthService";
import { GraphService } from "../services/GraphService";
```

次に、認証を初期化し、ユーザー トークンを取得、その有効性をチェックし、トークンが有効な場合に Microsoft Graph API と連携するためのサービスをセットアップするコードを追加します。トークンが無効の場合は、ユーザーにサインインを促します。

以下のコードを **handleTeamsMessagingExtensionQuery** 関数内、モック定義の **allContacts** 定数の上にコピーしてください。

```JavaScript
  const credentials = new AuthService(context);
  const token = await credentials.getUserToken(query);
  if (!token) {
    return credentials.getSignInComposeExtension();
  }
  const graphService = new GraphService(token);
```

次に、モック定義の **allContacts** 定数を以下のコードに置き換えてください:

```JavaScript
const allContacts = await graphService.getContacts();
```

次に、**appPackage/manifest.json** ファイルに移動し、*validDomains* ノードを以下のように更新します。

```JSON
"validDomains": [
        "token.botframework.com",
        "${{BOT_DOMAIN}}"
    ]
```

さらに、`validDomains` 配列の後にカンマ「,」を追加し、*webApplicationInfo* ノードを追加して、以下の値に更新してください。

```JSON
    "webApplicationInfo": {
        "id": "${{BOT_ID}}",
        "resource": "api://${{BOT_DOMAIN}}/botid-${{BOT_ID}}"
    },
```

最後に、マニフェスト バージョンを "1.0.10" から "1.0.11" にアップグレードして、変更が反映されるようにしてください。

これらのマニフェスト変更により、サインイン URL が正しく生成され、ユーザーに同意を求めるために送信されます。

## 演習 4: 認証のテスト

### ステップ 1: ローカルでアプリを実行 
ローカル デバッガーが実行中の場合は停止してください。新しいコマンドをマニフェストに更新したため、新しいパッケージでアプリを再インストールする必要があります。

F5 をクリックするか、スタート ボタン 1️⃣ をクリックしてデバッガーを再起動してください。デバッグ プロファイルを選択する機会があり、Debug in Teams (Edge) 2️⃣ を選択するか、別のプロファイルを選択してください。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

!!! pied-piper "プロビジョニング"
    ここで、リソースのプロビジョニング確認ダイアログが再度表示されます。「Provision」を選択してください。これは新しいリソースをプロビジョニングするのではなく、既存のリソースの上書きを行うだけです。

デバッグにより Teams がブラウザー ウィンドウで開かれます。Agents Toolkit にサインインしたのと同じ資格情報でログインしてください。
Teams が開かれると、アプリを開くかどうかのダイアログが表示されます。

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

アプリを開くと、すぐにどこでアプリを開くか尋ねられます。デフォルトでは個人チャットになっています。チャネルやグループチャットでも選択できます。**Open** を選択してください。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これでアプリとの個人チャットが開始されました。しかし、Copilot でテストするため、次の指示に従ってください。 

Teams 内で **Chat** をクリックし、次に **Copilot** を選択します。Copilot が最上位に表示されるはずです。
**Plugin icon** をクリックし、**Northwind Inventory** を選択してプラグインを有効にしてください。

### ステップ 2 : テスト データを入力
実際の連絡先を取得する前に、Microsoft 365 にテスト用の連絡先情報を追加する必要があります。
まず、Microsoft 365 に連絡先が存在することを確認しましょう。

1️⃣ Microsoft Teams から、"waffle" メニューをクリックします。

2️⃣ Microsoft Outlook を選択します。

![outlook](../../assets/images/extend-message-ext-04/Lab05-002-EnterTestData1.png)

1️⃣ Outlook 内で、"Contacts" ボタンをクリックします。

2️⃣ 新しい連絡先をいくつか入力します。

このアプリはシンプルで、個人名または会社名とメール アドレスのみを表示します。ビジネス シナリオに合わせるために、サプライヤーらしく聞こえるようにしてください。

![outlook](../../assets/images/extend-message-ext-04/Lab05-003-EnterTestData2.png)

### ステップ 2: Copilot でテスト

以下のプロンプトを使用して、連絡先を検索するように Copilot に依頼してください － **Find my conacts with name {first name} in Northwind** （{first name} は、演習 4 のステップ 1 で入力した連絡先の名前に置き換えてください）

サインイン ボタンが表示され、（一度だけ）認証を促されます。

![prompt](../../assets/images/extend-message-ext-04/prompt.png)

これにより、プラグインのこの機能を呼び出すための認証が正しく設定されていることが確認できます。**Sign in to Northwind Inventory** を選択してください。

次に、GIF に示されているように、対話および同意のためのダイアログが表示されます。同意すると、Microsoft 365 Copilot から実行結果が返されるはずです。
![working gif](../../assets/images/extend-message-ext-04/working.gif)

## おめでとうございます
これは難しいものでしたが、あなたは見事に成し遂げました！
Message Extension エージェント トラックにご参加いただき、ありがとうございました！

<cc-next url="/" label="Home" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/04-add-authentication" />