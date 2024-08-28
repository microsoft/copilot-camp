# Lab M4 - Add authentication
In this lab you will secure your Northwind plugin from the previous lab with authentication using Entra ID SSO (single sign-on) and your own contacts information of suppliers to share in a conversation. 

???+ "Navigating the Extend Teams Message Extension labs (Extend Path)"
    - [Lab M0 - Prerequisites](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [Lab M1 - Get to know Northwind message extension](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [Lab M2 - Run app in Microsoft Copilot for Microsoft 365](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [Lab M3 - Enhance plugin with new search command](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [Lab M4 - Add authentication](/copilot-camp/pages/extend-message-ext/04-add-authentication) (📍You are here)
    - [Lab M5 - Enhance plugin with an action command](/copilot-camp/pages/extend-message-ext/05-add-action) 


    !!! tip "NOTE"
    The completed exercise with all of the code changes can be downloaded [from here](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab04-SSO-Auth/Northwind/). This can be useful for troubleshooting purposes.
    If you ever need to reset your edits, you can clone again the repository and start over.

In this lab you will learn to:

- Add Entra ID single sign-on (SSO) to your app so users can seamlessly log into your app with the same account they use in Microsoft Teams

- Access the Microsoft Graph API to access user content in Microsoft 365. Your app will act on behalf of the logged-in user so they can securely access their own content within your application.

## Introduction : Tasks involved to implement SSO (brief)

Implementing SSO for your plugin (Message extension app) involves several steps. Here is a high level over view of the process:

### Register Your App in Microsoft Entra ID & Configure Your Bot in Azure Bot Service
- Create a new app registration in the Azure portal.
- Configure the app with necessary permissions and scopes.
- Generate a client secret for your app.
- Create a bot in the Azure Bot Service.
- Add the Teams channel to your bot.
- Set up OAuth connection settings in the Azure portal.
### Enable SSO in Your Teams App
- Update your bot code to handle authentication and token exchange.
- Use the Bot Framework SDK to integrate SSO capabilities.
- Implement the OAuth flow to obtain access tokens for the user.
### Configure Authentication in Teams
- Add the necessary permissions in the Teams app manifest.

## Exercise 1: Register Your App in Microsoft Entra ID and Configure Your Bot in Azure Bot Service

Luckily for you, we’ve streamlined everything so that it’s ready to go as soon as you hit **F5**. However, let’s go over the specific changes you’ll need to make in the project

### Step 1: Copy files and folders

Copy the folder [entra](../../../src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/entra/) into the folder **infra** of your [base project](../../../src/extend-message-ext/Lab03-Enhance-NW-Teams/Northwind/). This will provision the Entra IDs needed for the bot as well as the one for generating appID and application ID URI.

Next copy over the files [azure.local.bicep](../../../src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/azure.local.bicep) and [azure.parameters.local.json](../../../src/extend-message-ext/Lab04-SSO-Auth/Northwind/infra/azure.parameters.local.json) to help with the bot registration on F5 into the same **infra** folder

> When Teams Toolkit prepares the app it will provision a new Azure AI Bot Service into the resource group which uses the F0 SKU which grants unlimited messages to be sent to standard channels, this includes Microsoft Teams and Microsoft 365 channel (Outlook and Copilot) and does not incur a cost.

### Step 2: Update existing code

Next, open file **azurebot.bicep** under **botRegistration** folder which is under **infra** folder.

Add below code snippet after declaration of *param botAppDomain*

```bicep
param graphAadAppClientId string
@secure()
param graphAadAppClientSecret string

param connectionName string
```

Next add below snippet to provision bot service into the same file at end of line.

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
Next, open the **teamsapp.local.yml** file and replace its content with the code snippet below. This will rewire parts of the infrastructure, including deploying a bot service in Azure for our lab

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

Open **.env.local** file under **env** folder and completely remove all variable and add below

```
APP_INTERNAL_NAME=Northwind
APP_DISPLAY_NAME=Northwind
CONNECTION_NAME=MicrosoftGraph

```
Open **.env.local.user** file under **env** folder and completely remove all variable and add below
```
SECRET_BOT_PASSWORD=
SECRET_GRAPH_AAD_APP_CLIENT_SECRET=
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
```


## Exercise 2: Add new command into plugin and add authentication

### Step 1: Add a command to search contacts (suppliers)
First step, you need to add a new command to search for contacts. We will get the contact details from Microsoft Graph but for now will use mock data to make sure the message extension command works.

Go to **src** folder and create a file called **utils.ts** and copy the content from below. We will reuse this for other parts of code later.

```JavaScript
import {
    AdaptiveCardInvokeResponse,
    InvokeResponse,
    MessagingExtensionActionResponse,
  } from "botbuilder";
  
  export const CreateInvokeResponse = (
    status: number,
    body?: unknown
  ): InvokeResponse => {
    return { status, body };
  };
  
  export const CreateAdaptiveCardInvokeResponse = (
    statusCode: number,
    body?: Record<string, unknown>
  ): AdaptiveCardInvokeResponse => {
    return {
      statusCode: statusCode,
      type: "application/vnd.microsoft.card.adaptive",
      value: body,
    };
  };
  
  export const CreateActionErrorResponse = (
    statusCode: number,
    errorCode = -1,
    errorMessage = "Unknown error"
  ): AdaptiveCardInvokeResponse => {
    return {
      statusCode: statusCode,
      type: "application/vnd.microsoft.error",
      value: {
        error: {
          code: errorCode,
          message: errorMessage,
        },
      },
    };
  };
  
  export const CreateInvokeErrorResponse = (
    statusCode: number,
    errorCode = -1,
    errorMessage = "Unknown error"
  ): InvokeResponse => {
    return CreateInvokeResponse(statusCode, {
      error: {
        code: errorCode,
        message: errorMessage,
      },
    });
  };
  
  export const setTaskInfo = (taskInfo) => {
    taskInfo.height = 350;
    taskInfo.width = 800;
    taskInfo.title = "";
  };
  
  export const CreateErrorResponseActionResponse = (
    error: string
  ): MessagingExtensionActionResponse => {
    const cardAttachment = {
      contentType: `application/vnd.microsoft.card.adaptive`,
      card: JSON.parse(`{ 
      "type": "AdaptiveCard",
      "version": "1.6",
      "body": [
          {
              "type": "TextBlock",
              "text": "Error",
              "weight": "Bolder",
              "size": "Medium"
          },
          {
              "type": "TextBlock",
              "text": "An error has occurred. ${error}.",
              "wrap": true
          }
      ]
    }`),
    };
  
    const response: MessagingExtensionActionResponse = {
      task: {
        type: "continue",
        value: cardAttachment,
      },
    };
  
    return response;
  };
  
  export const cleanupParam = (value: string): string => {
    if (!value) {
      return "";
    } else {
      let result = value.trim();
      result = result.split(",")[0];
      result = result.replace("*", "");
      return result;
    }
  };
  
  export const getFileNameFromUrl = (url: string): string => {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
  };
```

Go to **src** folder > **messageExtensions** and add an new file **supplierContactSearchCommand.ts** in it.

Copy the content from below into the new file.

```JavaScript
import {
    CardFactory,
    TurnContext
} from "botbuilder";

import config from "../config";
import { cleanupParam } from "../utils";

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

export default { COMMAND_ID, handleTeamsMessagingExtensionQuery }
```


Go to **src** folder > **searchApp.ts** file and import the newly created command.

```JavaScript
import supplierContactSearchCommand from "./messageExtensions/supplierContactSearchCommand";
```

And add another case in the **handleTeamsMessagingExtensionQuery** for the newly added command after *case customerSearchCommand.COMMAND_ID:*

```JavaScript
  case supplierContactSearchCommand.COMMAND_ID: {
        return supplierContactSearchCommand.handleTeamsMessagingExtensionQuery(context, query);
      } 
```
Now to go **appPackage** > **manifest.json** and add the command inside the *commands* array under the node *composeExtensions*.

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
### Step 2: Run the application 
Next, you'll test the new command using mock contacts, which requires running the app. When you press F5 to run the application, it will also provision all the necessary resources for the authenticated flow, as we configured everything using the Team Toolkit's deploy process in Exercise 1. We can then keep the app running for our next exercise, where we will integrate SSO to call contacts from Microsoft Graph.


## Exercise 3 : Enable authentication for new command

In the previous step, you have laid the foundation for the new command. Next you will add authentication on top of the command, replace the mock contact list and replace it with actual contact list from the logged in user's Outlook contacts.

You will first install some npm packages needed for the plugin.
Run below script in the terminal :

```CLI
npm i @microsoft/microsoft-graph-client @microsoft/microsoft-graph-types
```

Now create a folder called **services** under **src** folder of your base project.
Add the files **AuthService.ts** and **GraphService.ts** as is into the **services** folder. 

- **AuthService** : contains a class that provides authentication services. It includes a method **getSignInLink** which asynchronously retrieves a sign-in URL from a client using specific connection details and returns this URL.

- **GraphService** : defines a class that interacts with the Microsoft Graph API. It initializes a Graph client using an authentication token and provides a method getContacts to fetch the user's contacts, selecting specific fields (displayName and emailAddresses).

- Here is the code for **AuthService.ts**

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

- Here is the code for **GraphService.ts**

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

Now append a node for *connectionName* into the **config.ts** file in the **src** folder, we will use this configuration value late. 

<pre>
 const config = {
  botId: process.env.BOT_ID,
  botPassword: process.env.BOT_PASSWORD,
  storageAccountConnectionString: process.env.STORAGE_ACCOUNT_CONNECTION_STRING<b>,
  connectionName: process.env.CONNECTION_NAME</b>
};

export default config;
</pre>

Now, go back to the **supplierContactSearchCommand.ts** file and import these two services.

```JavaScript
import { AuthService } from "../services/AuthService";
import { GraphService } from "../services/GraphService";
```
Next, add the code that initializes authentication, retrieves a user token, checks its validity, and then sets up a service to interact with the Microsoft Graph API if the token is valid. If the token is invalid, it prompts the user to sign in.

Copy this into the *handleTeamsMessagingExtensionQuery* function above the mock definition of *allContacts** constant.

```JavaScript
  const credentials = new AuthService(context);
  const token = await credentials.getUserToken(query);
  if (!token) {
    return credentials.getSignInComposeExtension();
  }
  const graphService = new GraphService(token);
```

Next, replace the mock definition of *allContacts** constant with below code:

```JavaScript
const allContacts = await graphService.getContacts();
```

Next go to **appPackage/manifest.json** file. And update the node *validDomains* as below

```JSON
"validDomains": [
        "token.botframework.com",
        "${{BOT_DOMAIN}}"
    ]
```

Also add a node for *webApplicationInfo* and update it with below value

```JSON
    "webApplicationInfo": {
        "id": "${{BOT_ID}}",
        "resource": "api://${{BOT_DOMAIN}}/botid-${{BOT_ID}}"
    },
```

## Exercise 4:  Test authentication

### Step 1: Enter test data
Before we test the plugin to bring actual contacts, we'll need to add some contact information.
So let us first ensure we have some contacts in Microsoft 365.

1️⃣ From Microsoft Teams, click the "waffle" menu

2️⃣ Select Microsoft Outlook

![outlook](../../assets/images/extend-message-ext-04/Lab05-002-EnterTestData1.png)

1️⃣ Within Outlook, click the "Contacts" button

2️⃣ Enter some new contacts

The app is simple, and will only display the person or company name and email address. If you want to play along with the business scenario, make them sound like suppliers.

![outlook](../../assets/images/extend-message-ext-04/Lab05-002-EnterTestData2.png)

### Step 2: Test in Copilot

Open a new chat in Copilot for Microsoft 365.
Let's re run the project since we made changes to the appPackage.

