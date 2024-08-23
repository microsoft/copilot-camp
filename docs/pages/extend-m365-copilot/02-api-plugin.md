# Lab E2 - First API Plugin

In this lab you will set up an API based on Azure Functions and install it as an API plugin for Copilot for Microsoft 365.

???+ "Navigating the Extend Copilot labs (Extend Path)"
    - [Lab E0 - Prerequisites](/copilot-camp/pages/extend-m365-copilot/00-prerequisites)
    - [Lab E1 - Declarative Copilot](/copilot-camp/pages/extend-m365-copilot/01-declarative-copilot)
    - [Lab E2 - First API Plugin](/copilot-camp/pages/extend-m365-copilot/02-api-plugin) (📍You are here)
    - [Lab E3 - Enhance the API Plugin](/copilot-camp/pages/extend-m365-copilot/03-enhance-api-plugin) 
    - [Lab E4 - Add Adaptive Cards](/copilot-camp/pages/extend-m365-copilot/04-add-adaptive-card)
    - [Lab E5 - Add a Declarative Copilot](/copilot-camp/pages/extend-m365-copilot/05-add-declarative-copilot)
    - [Lab E6 - Add authentication](/copilot-camp/pages/extend-m365-copilot/06-add-authentication)

!!! info "Where did I leave off?"
    <cc-last-completed-step />

## Introduction

In this lab you will set up a REST API for Trey Research, a hypothetical consulting company. It provides API's for accessing information about consultants (using the /api/consultants path) and about the current user (using the /api/me path). For now the API doesn't support authentication, so the current user will always be "Avery Howard"; in [Lab ??](#) you will add authentication and the ability to access the logged in user.

The code consists of Azure Functions written in TypeScript, backed by a database in Azure Table storage. When you run the app locally, table storage will be provided by the Azurite storage emulator.

## Exercise 1 - Install additional prerequisites

This lab calls for a couple of additional prerequisites; please install them now.

* [REST Client add-in for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - You will use this to test your API locally
* (optional)[Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer) - This will allow you to view and modify the Trey Research database

## Exercise 2 - Configure and run the starting application

<cc-lab-step lab="E2" exercise="2" step="1" />
### Step 1 - Download the starting application

Begin by downloading the Copilot developer camp repository at https://github.com/microsoft/copilot-camp. Select the "Code" button and clone or download the content to your computer.

Find starting code in the repo at **/src/extend-m365-copilot/path-a-lab02-first-api-plugin/trey-research**.
Copy this folder to a location on your computer where you want to do your work. These instructions will refer to this as the "working folder" going forward.

<cc-lab-step lab="E2" exercise="2" step="2" />
### Step 2 - Set up the local environment files

Open your working folder in Visual Studio Code. Copy the **/env/.env.local.user.sample** file to **/env/.env.local.user**. If **env.local.user** already exists, ensure these lines are present:

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
SECRET_BING_MAPS_KEY=xxxxxxxxxxxxxxxxxxxxxxx
~~~

If you want Bing maps to work correctly in future labs, you will need to [obtain a Bing Maps developer key](https://learn.microsoft.com/bingmaps/getting-started/bing-maps-dev-center-help/getting-a-bing-maps-key) and include it here in place of "xxxxxxxxxxxxxxxxxxxxxxx". If you skip this, the app will still work but the maps won't show up.

<cc-lab-step lab="E2" exercise="2" step="3" />
### Step 3: Install the dependencies

!!! question "Testers -- Is this step necessary?"
    I don't think this should be necessary but I had a problem with spinning up the database when just hitting F5 on the first run; it looked like the Azurite dependencies were missing so they must be used before TTK does its initial `npm install`

Open a command line in your working folder and type:

~~~sh
npm install
~~~

<cc-lab-step lab="E2" exercise="2" step="4" />
### Step 4: Run the application

In Visual Studio Code, click the Teams logo in the left sidebar to open Teams Toolkit. Ensure you are logged into Microsoft 365 1️⃣ and that Custom App Uploads and Copilot Access Enabled indicators 2️⃣ are both showing green checkmarks.

![Teams Toolkit](../../assets/images/extend-m365-copilot-02/run-in-ttk01.png)

Now you can just hit F5 to debug using Microsoft Edge, or you can hover over the "local" enviroment and click the debugger symbol that will be displayed 1️⃣, then select the browser of your choice 2️⃣.

![Teams Toolkit](../../assets/images/extend-m365-copilot-02/run-in-ttk02.png)

Eventually a browser will open (it's faster after the first time). You'll log into this later to test your app in Copilot, but for now just minimize the browser so we can test the project's web service.

![Teams Toolkit](../../assets/images/extend-m365-copilot-02/run-in-ttk03.png)

## Exercise 3: Test the app's web services

The Trey Resarch project is an API plugin, so naturally it includes an API. In this exercise you'll test the API manually and, in the process, learn about what it does. 

<cc-lab-step lab="E2" exercise="3" step="1" />
### Step 1: GET the /me resource

With the debugger still running 1️⃣, switch to the code view in Visual Studio Code 2️⃣. Open the **http** folder and select the **treyResearchAPI.http** file 3️⃣.

Before proceeding, ensure the log file is in view by opening the "Debug console" tab 4️⃣ and ensuring that the console called "Attach to Backend" is selected 5️⃣.

Now click the "Send Request" link in **treyResearchAAPI.http** just above the link `{{base_url}}/me` 6️⃣.

![Teams Toolkit](../../assets/images/extend-m365-copilot-02/run-in-ttk04.png)

You should see the response in the right panel, and a log of the request in the bottom panel. The response shows the information about the logged-in user, but since we haven't implemented authentication as yet (that's coming in Lab 6), the app will return information on the fictitious consultant "Avery Howard". Take a moment to scroll through the response to see details about Avery, including a list of project assignments.

![Teams Toolkit](../../assets/images/extend-m365-copilot-02/run-in-ttk05.png)

<cc-lab-step lab="E2" exercise="3" step="2" />
### Step 2: Try the other methods and resources

Now try sending the POST request for `{{base_url}}/me/chargeTime`. This will charge 3 hours of Avery's time to the Woodgrove Bank project. This is stored in the project database, which is a locally hosted emulation of Azure Table Storage, so the system will remember that Avery has delivered these hours. (To test this, call the `/me` resource again and look at the `"deliveredThisMonth"` property under the Woodgrove project).

Continue to try the various GET requests in the .http file to find consultants with various skills, certifications, roles, and availability. All this information will be available to Copilot so it can answer user prompts.

<cc-lab-step lab="E2" exercise="3" step="3" />
### Step 3: Examine the database (optional)

If you've installed the [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer), you can examine and modify the application's data. The data is stored in Azure Table Storage, which in this case is running locally using the Azurite emulator.

Within the Azure Storage Explorer, open the "Emulator & Attached" selection and pick the "(Emulator - Default Ports)" collection; then drill down to "Tables". You shold see 3 tables:

  * **Consultant:** This table stores details about Trey Research consultants
  * **Project:** This table stores details about Trey Research projects
  * **Assignment:** This table stores consultant assignments to projects, such as Avery Howard's assignment to the Woodgrove Bank project. This table includes a "delivered" field that contains a JSON representation of the hours delivered by that consultant on the project over time.

![Azure Storage Explorer](../../assets/images/extend-m365-copilot-02/azure-storage-explorer01.png)


## Exercise 4: Run the plugin in Copilot

<cc-lab-step lab="E2" exercise="4" step="1" />
### Step 1: Install the plugin

Now restore the web browser you minimized back in Exercise 2 Step 4. If you get an error that your sign-in has timed out, close the browser and restart the debugger and log in when the browser appears.

You will be brought into Microsoft Teams, where you will be prompted to install the app. Go ahead and do this; it should bring you to the Copilot screen. Open the plugin panel 1️⃣, which is the small icon of 4 boxes to the left of the send button in the message compose box. Turn off all the plugins except for the green "Trey" icon 2️⃣, which should be turned on. If you previously deployed the app to Azure, you may see a 2nd (red) Trey icon; turn that off to test the local instance.

![Run in Copilot](../../assets/images/extend-m365-copilot-02/run-in-copilot02.png)

Click the "Try it now" link 1️⃣ to show suggested prompts, and select the prompt "What Trey projects am I assigned to?" 2️⃣.

![Run in Copilot](../../assets/images/extend-m365-copilot-02/run-in-copilot03.png)

You may be asked to consent to call the web service; if so, click "Always allow" or "Allow" to proceed.

![Run in Copilot](../../assets/images/extend-m365-copilot-02/run-in-copilot04.png)

Finally, you should see a list of Avery's projects!

![Run in Copilot](../../assets/images/extend-m365-copilot-02/run-in-copilot05b.png)

Notice that even though Copilot addressed the user as "Robert" (since that's who made the screen shot), it still thinks the user is "Avery Howard". That's because we haven't implemented authentication yet; that will be handled in [Lab A6](06-add-authentication.md).

## CONGRATULATIONS

You've successfully built your first API Plugin! You are now ready to proceed to enhance this API Plugin with more API calls. 

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/02-api-plugin" />