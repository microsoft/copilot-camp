# Lab E6a - Add Entra ID authentication with Teams Toolkit

---8<--- "e-labs-prelude.md"

In this lab you will add authentication to your API plugin using OAuth 2.0 with Entra ID as the identity provider. You will learn how to set up Teams Toolkit to automate the Entra ID and Teams Developer Portal registrations.

!!! note
    This lab builds on the previous one, Lab E5. If you have completed lab E5, you can continue working in the same folder. If not, please copy the [solution folder for Lab E5 from **/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END**](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END){target=_blank}
    and work there.
    The finished solution for this lab is in the [**/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END**](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END){target=_blank} folder.

## Exercise 1: Update the local Teams Toolkit configuration

In this exercise you will modify the Teams Toolkit configuration files to instruct it to register the application in Entra ID and to place the information in the Teams Developer Portal "vault".

### Step 1: Add an Entra ID app manifest

Create a new files **aad.manifest.json** in the root of your working folder. Copy these lines into this file.

```json
{
    "id": "${{AAD_APP_OBJECT_ID}}",
    "appId": "${{AAD_APP_CLIENT_ID}}",
    "name": "Trey-Research-OAuth-aad",
    "accessTokenAcceptedVersion": 2,
    "signInAudience": "AzureADMyOrg",
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
    "oauth2Permissions": [
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
    ],
    "replyUrlsWithType": [
        {
           "url": "https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect",
           "type": "Web"
        }
    ],
    "identifierUris": [
        "api://${{AAD_APP_CLIENT_ID}}"
    ]
}
```

This file contains details for the Entra ID application to be registered or updated. Notice that it contains various tokens such as `${{AAD_APP_CLIENT_ID}}` which will be replaced with actual values when Teams Toolkit provisions the application.

!!! Note
    Entra ID was previously called "Azure Active Directory"; references to "AAD" refer to Entra ID under its old name.

### Step 2: Update the file version number in **teamsapp.local.ynl**

The **teamsapp.local.yml** file contains instructions for Teams Toolkit for running and debugging your solution locally. This is the file you will update in remainder of this exercise.

!!! warning Indentation is critical in yaml
    Editing yaml files is sometimes tricky because containment is indicated by indentation. Be sure to indent properly when making each change or the lab won't work. If in doubt, you can refer to the completed solution file [here](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END/teamsapp.local.yml){_target=blank}.

These labs were originally written using a slightly older version of Teams Toolkit, which uses version 1.5 of this file. In this step you will update the file to version 1.7.

Begin by replacing the first line with this new schema reference:

```yaml
# yaml-language-server: $schema=https://aka.ms/teams-toolkit/v1.7/yaml.schema.json
```

Then on the 4th line, update the version number to 1.7.

```yaml
version: v1.7
```

### Step 3: Provision an Entra ID application

In order for an application to authenticate a user and authorize it to do something, the application must first be registered in Entra ID. In this step we'll add this app registration if it's not already present.

Locate these lines in the file:

```yaml
provision:
  # Creates a Teams app
```
Insert the following yaml between these lines, directly under the `provision:` line. You may leave blank lines for readability if you wish.

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

Notice that by setting `signInAudience` to `AzureADMyOrg`, Teams Toolkit creates a single tenant application that can only be used within the Entra ID tenant where it is registered. If you want to allow the app to be used in other tenants, such as your customer's tenants, you would set this to `AzureADMultipleOrgs`. All three steps use the **aad.manifest.json** file you created in the previous step.

Also note that this step will write several values into your environment files, where they will be inserted into **aad.manifest.json** as well as in your application package.

### Step 4: Update the Entra ID application

Locate this line in **teamsapp.local.yml**
```yaml
  # Build Teams app package with latest env value
```

Insert the following yaml before this line:

```yaml
  - uses: oauth/register
    with:
      name: oAuth2AuthCode
      flow: authorizationCode
      appId: ${{TEAMS_APP_ID}}
      clientId: ${{AAD_APP_CLIENT_ID}}
      clientSecret: ${{SECRET_AAD_APP_CLIENT_SECRET}}
      # Path to OpenAPI description document
      apiSpecPath: ./appPackage/trey-definition.json
    writeToEnvironmentFile:
      configurationId: OAUTH2AUTHCODE_CONFIGURATION_ID

  - uses: oauth/update
    with:
      name: oAuth2AuthCode
      appId: ${{TEAMS_APP_ID}}
      clientId: ${{AAD_APP_CLIENT_ID}}
      # Path to OpenAPI description document
      apiSpecPath: ./appPackage/trey-definition.json
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

The `oauth/register` and `oauth/update` steps will register the application in the Teams Developer Portal's vault, where Copilot can obtain the necessary details to implement the OAuth 2.0 Auth Code authorization flow. The `aadApp/update` step will update the Entra ID application itself with the details for this app. These details are in a separte file, **aad.manifest.json**, which we'll add in the next exercise.

### Step 5: Change the output path

The new yaml schema changes the output path slightly. Locate this line:

```yaml
      outputJsonPath: ./appPackage/build/manifest.${{TEAMSFX_ENV}}.json
```

and replace it with this one:

```yaml
      outputFolder: ./appPackage/build
```
### Step 6: Make the Entra ID values available to your application code

Locate these lines:

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

This code publishes environment variables for use within your application code. Add these lines under the `STORAGE_ACCOUNT_CONNECTION_STRING` to make them available:

```yaml
        AAD_APP_TENANT_ID: ${{AAD_APP_TENANT_ID}}
        AAD_APP_CLIENT_ID: ${{AAD_APP_CLIENT_ID}}
```


## Exercise 2: Update your application package

### Step 1: Update the Plugin file

Open your working folder in Visual Studio Code. In the **appPackage** folder, open the **trey-plugin.json** file. This is where information is stored that Copilot needs, but is not already in the Open API Specification (OAS) file.

Under `Runtimes` you will find an `auth` property with `type` of `"None"`, indicating the API is currently not authenticated. Change it as follows to tell Copilot to authenticate using the OAuth settings you saved in the vault.

~~~json
"auth": {
  "type": "OAuthPluginVault",
  "reference_id":  "${{OAUTH_CLIENT_REGISTRATION_ID}}"
},
~~~

Then add this line to your **env/.env.local** file:

~~~text
OAUTH_CLIENT_REGISTRATION_ID=<registration id you saved in the previous exercise>
~~~

The next time you start and prompt your API plugin, it should prompt you to sign in.
However we've done nothing to secure the application; anyone on the Internet can call it!
In the next step you'll update the application code to check for a valid login and access the API as the actual Microsoft 365 user instead of "Avery Howard" (which is a name from Microsoft's fictitious name generator).

<cc-end-step lab="e6" exercise="2" step="1" />

## Exercise 3: Update the application code

### Step 1: Install the JWT validation library

From a command line in your working directory, type:

~~~sh
npm i jwt-validate
~~~

This will install a library for validating the incoming Entra ID authorization token.

!!! warning
    Microsoft does not provide a supported library for validating Entra ID tokens in NodeJS, but instead provides [this detailed documentation](https://learn.microsoft.com/entra/identity-platform/access-tokens#validate-tokens){target=_blank} on how to write your own. [Another useful article](https://www.voitanos.io/blog/validating-entra-id-generated-oauth-tokens/){target=_blank} is also available from [Microsoft MVP Andrew Connell](https://www.voitanos.io/pages/about/#whos-behind-voitanos){target=_blank}.

    **This lab uses a [community provided library](https://www.npmjs.com/package/jwt-validate){target=_blank} written by [Waldek Mastykarz](https://github.com/waldekmastykarz){target=_blank}, which is intended to follow this guidance. Note that this library is not supported by Microsoft and is under an MIT License, so use it at your own risk.**
    
    If you want to track progress on a supported library, please follow [this Github issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/6113){target=_blank}.

<cc-end-step lab="e6" exercise="3" step="1" />

### Step 2: Update the identity service

In the **src/services** folder, open **IdentityService.ts**. 
At the top of the file along with the other `import` statements, add this one:

~~~typescript
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
~~~

Then, right under the `class Identity` statement, add this line:

~~~typescript
    private validator: TokenValidator;
~~~

Now look for the comment

~~~typescript
// ** INSERT REQUEST VALIDATION HERE (see Lab E6) **
~~~

Replace the comment with this code:

~~~typescript
// Try to validate the token and get user's basic information
try {
    const { API_APPLICATION_ID, API_TENANT_ID } = process.env;
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
        const entraJwksUri = await getEntraJwksUri(API_TENANT_ID);
        this.validator = new TokenValidator({
            jwksUri: entraJwksUri
        });
        console.log ("Token validator created");
    }

    // Use these options for single-tenant applications
    const options: ValidateTokenOptions = {
        audience: `api://${API_APPLICATION_ID}`,
        issuer: `https://sts.windows.net/${API_TENANT_ID}/`,
        // NOTE: If this is a multi-tenant app, look for 
        // issuer: "https://sts.windows.net/common/",
        // Also you may wish to manage a list of allowed tenants
        // and test them as well
        //   allowedTenants: [process.env["AAD_APP_TENANT_ID"]],
        scp: ["access_as_user"]
    };

    // validate the token
    const validToken = await this.validator.validateToken(token, options);

    userId = validToken.oid;
    userName = validToken.name;
    userEmail = validToken.upn;
    console.log(`Request ${this.requestNumber++}: Token is valid for user ${userName} (${userId})`);
}
catch (ex) {
    // Token is missing or invalid - return a 401 error
    console.error(ex);
    throw new HttpError(401, "Unauthorized");
}
~~~

!!! Note "Learn from the code"
    Have a look at the new source code. First, it obtains the token from the `Authorization` header in the HTTPs request. This header contains the word "Bearer", a space, and then the token, so a JavaScript `split(" ")` is used to obtain only the token.

    Also note that the code will throw an exception if authentication should fail for any reason; the Azure function will then return
    the appropriate error.

    The code then creates a validator for use with the `jwks-validate` library. This call reads the latest private keys from Entra ID, so it is an async call that may take some time to run.

    Next, the code sets up a `ValidateTokenOptions` object. Based on this object, in addition to validating that the token was signed with Entra ID's private key, the library will validate that:

    * the _audience_ must be the same as the API service app URI; this ensures that the token is intended for our web service and no other

    * the _issuer_ must be from the security token service for our tenant

    * the _scope_ must match the scope defined in our app registration, which is `"access_as_user"`.

    If the token is valid, the library returns an object with all the "claims" that were inside, including the user's unique ID, name, and email. We will use these values instead of relying on the fictitious "Avery Howard".

!!! Note "If your app will be multi-tenant"
    Check the comments in the above code for notes about validating tokens for a multi-tenant app

Once the code has a `userId` it will look for a Consultant record for the user. This was hard-coded to Avery Howard's ID in the original code. Now it will use the user ID for the logged in user, and create a new Consultant record if it doesn't find one in the database.

As a result, when you run the app for the first time, it should create a new Consultant for your logged-in user with a default set of skills, roles, etc. If you want to change them to make your own demo, you can do that using the [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/){target=_blank}

![The Azure Storage Explorer in action while editing the Consultant table. The actual current user is highlighted.](../../assets/images/extend-m365-copilot-06/oauth-azure-storage-explorer.png)

Note that project assignments are stored in the `Assignment` table and reference the project ID and the assigned consultant's consultant ID.

<cc-end-step lab="e6" exercise="3" step="2" />

## Exercise 4: Test the application

Before you test the application, update the manifest version of your app package in the `appPackage\manifest.json` file, follow these steps:

1. Open the `manifest.json` file located in the `appPackage` folder of your project.

2. Locate the `version` field in the JSON file. It should look something like this:  
   ```json
   "version": "1.0.0"
   ```

3. Increment the version number to a small increment. For example, change it to:  
   ```json
   "version": "1.0.1"
   ```

4. Save the file after making the change.

### Step 1: (Re)start the application

If your app is still running from an earlier lab, stop it to force it to re-create the application package.

Then press F5 to run the application again, and install it as before.

Prompt the plugin, "What Trey projects am I assigned to?". You may see a confirmation card asking if it's OK to call your API. No authentication is happening here; click "Allow Once" to proceed.

![Microsoft 365 Copilot showing a confirmation card asking if it is ok to call your API. There are buttons to 'Always allow', 'Allow once', or 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-01small.png)

The confirmation card will be replaced with a login card.
Click "Sign in to Trey" to sign in. At first you should see a pop-up window asking you to log in and to consent to permissions. On subsequent vists this may be hidden as your credentials have been cached by Entra ID in your local browser.

![Microsoft 365 Copilot showing a login card with a button to 'Sign in to Trey' and another one to 'Cancel.'](../../assets/images/extend-m365-copilot-06/oauth-run-02small.png)

There are cases where your admin has not allowed you to consent as a user and may see something like below:
![The Microsoft Entra popup dialog asking for an admin approval to consume the API.](../../assets/images/extend-m365-copilot-06/need-admin-approval.png)

This is because the admin has restricted applications to allow user consent tenant wide. In this case, you have to request admin to manually grant global consent for all users for the plugin API registration as below:

![The 'API permissions' page of the 'API Plugin' application registered in Microsoft Entra with the 'Grant admin consent ...' command highlighted.](../../assets/images/extend-m365-copilot-06/approval-admin.png)


The login card should be replaced by Copilot's response to your prompt. Since you were just added to the database, you aren't assigned to any projects.

Since you were just added to the database, you're not assigned to any projects.

![The response from the 'Trey Genie' agent when the actual user doesn't have any assigned project.](../../assets/images/extend-m365-copilot-06/oauth-run-03bsmall.png)

Ask Copilot to add you to the Woodgrove project. Copilot will press you for details if you forgot to include any required values.

![The response from the 'Trey Genie' agent when adding the current user to a project. If some information are missing, Copilot asks to provide them. Once all the information are provided, the agent provides a confirmation of the action.](../../assets/images/extend-m365-copilot-06/oauth-run-05.png)

Now check out your default skills and confirm the project assignment by asking, "What are my skills and what projects am I assigned to?"

![](../../assets/images/extend-m365-copilot-06/oauth-run-07.png)

<cc-end-step lab="e6" exercise="4" step="1" />

---8<--- "e-congratulations.md"

You have completed lab Ea6, Add Entra ID authentication with Teams Toolkit!

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/06a-add-authentication" />