# Lab E6a - Add Entra ID authentication with Teams Toolkit

---8<--- "e-labs-prelude.md"

In this lab you will add authentication to your API plugin using OAuth 2.0 with Entra ID as the identity provider. You will learn how to set up Teams Toolkit to automate the Entra ID and Teams Developer Portal registrations.

!!! note
    This lab builds on the previous one, Lab E5. You should be able to continue working in the same folder for labs E2-E6, but solution folders have been provided for your reference.
    The finished solution for this lab is in the [**/src/extend-m365-copilot/path-e-lab06a-add-oauth/trey-research-lab06a-END**](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot//path-e-lab06a-add-oauth/trey-research-lab06a-END){target=_blank} folder.

## Exercise 1: Update Teams Toolkit configuration

In this exercise you will modify the Teams Toolkit configuration files to instruct it to register the application in Entra ID and to place the information in the Teams Developer Portal "vault"

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