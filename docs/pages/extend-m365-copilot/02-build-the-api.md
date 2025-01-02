
# Lab E2: Build an API

---8<--- "e-labs-prelude.md"

In this lab you will set up an API based on Azure Functions and install it as an API plugin for Copilot for Microsoft 365.

## Introduction

In this lab you will set up a REST API for Trey Research, a hypothetical consulting company. It provides API's for accessing information about consultants (using the /api/consultants path) and about the current user (using the /api/me path). For now the API doesn't support authentication, so the current user will always be "Avery Howard"; in [Lab E6](./06-add-authentication.md) you will add authentication and the ability to access the logged in user.

The code consists of Azure Functions written in TypeScript, backed by a database in Azure Table storage. When you run the app locally, table storage will be provided by the Azurite storage emulator.

???+ Question "How did you create this API?"
    The project was created using Teams Toolkit. You can create the same scaffolding for your own project by opening an empty folder in VS Code and going to Teams Toolkit. Create a new app project and select "Agent", then "Declarative Agent" and "Add plugin".

## Exercise 1: Configure and run the starting application

### Step 1: Install additional prerequisites

This lab calls for a couple of additional prerequisites; please install them now.

* [Azure functions core tool](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-csharp#install-the-azure-functions-core-tools) OR
[REST Client add-in for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=humao.rest-client): You will use one of these toolks to test your API locally
* (optional) [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer): This will allow you to view and modify the Trey Research database

<cc-end-step lab="e2" exercise="1" step="1" />

### Step 2: Download the starting application

Begin by downloading the Copilot Developer Camp repository at [https://github.com/microsoft/copilot-camp](https://github.com/microsoft/copilot-camp){target=_blank}. Select the "Code" button and clone or download the content to your computer.

Find starting code in the repo at **/src/extend-m365-copilot/path-e-lab02-build-api/trey-research**.
Copy this folder to a location on your computer where you want to do your work. These instructions will refer to this as the "working folder" going forward.

!!! note
    The next several labs build on this one, and you should be able to continue working in the same folder for labs E2-E6. At the completion of this lab you will not have changed any of the files visible in Github, so the folder **/src/extend-m365-copilot/path-e-lab02-build-api/trey-research** is the same at the beginning and end of the lab.

<cc-end-step lab="e2" exercise="1" step="2" />

### Step 3: Set up the local environment files

Open your working folder in Visual Studio Code. You might see a popup dialog asking you to "trust the authors of the files in this folder". If that is the case, select the button "Yes, I trust the authors" to proceed. Copy the **/env/.env.local.user.sample** file to **/env/.env.local.user**. If **env.local.user** already exists, ensure this line is present:

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
~~~

<cc-end-step lab="e2" exercise="1" step="3" />

### Step 4: Install the dependencies

Open a command line in your working folder and type:

~~~sh
npm install
~~~

<cc-end-step lab="e2" exercise="1" step="4" />

### Step 5: Run the application

In Visual Studio Code, click the Teams logo in the left sidebar to open Teams Toolkit. Ensure you are logged into Microsoft 365 1️⃣ and that Custom App Uploads and Copilot Access Enabled indicators 2️⃣ are both showing green checkmarks.

![Visual Studio Code with the Teams Toolkit enabled and the accounts section with green checkmarks.](../../assets/images/extend-m365-copilot-02/run-in-ttk01.png)

Now you can just hit F5 to debug using Microsoft Edge, or you can hover over the "local" enviroment and click the debugger symbol that will be displayed 1️⃣, then select the browser of your choice 2️⃣.

![Visual Studio Code with the Teams Toolkit enabled, the debug mode active for local environment, and the option to start debugging in the Microsoft Edge browser.](../../assets/images/extend-m365-copilot-02/run-in-ttk02.png)

Eventually a browser will open (it's faster after the first time). You'll log into this in the next lab to test with Copilot, but for now just minimize the browser so your app keeps running, and we'll proceed to test the API.

![The debug session in the browser, with suggestion to minimize the browser window.](../../assets/images/extend-m365-copilot-02/run-in-ttk03.png)

<cc-end-step lab="e2" exercise="1" step="5" />

## Exercise 2: Test the app's web services

The Trey Resarch project is an API plugin, so naturally it includes an API. In this exercise you'll test the API manually and, in the process, learn about what it does. 

### Step 1: GET the /me resource

With the debugger still running 1️⃣, switch to the code view in Visual Studio Code 2️⃣. Open the **http** folder and select the **treyResearchAPI.http** file 3️⃣.

Before proceeding, ensure the log file is in view by opening the "Debug console" tab 4️⃣ and ensuring that the console called "Attach to Backend" is selected 5️⃣.

Now click the "Send Request" link in **treyResearchAAPI.http** just above the link `{{base_url}}/me` 6️⃣.

![Visual Studio Code with the sample treyResearchAPI.http file open and the shortcut to send a sample HTTP request while in debug mode.](../../assets/images/extend-m365-copilot-02/run-in-ttk04.png)

You should see the response in the right panel, and a log of the request in the bottom panel. The response shows the information about the logged-in user, but since we haven't implemented authentication as yet (that's coming in Lab 6), the app will return information on the fictitious consultant "Avery Howard". Take a moment to scroll through the response to see details about Avery, including a list of project assignments.

![Visual Studio Code with the output of the request triggered in the treyResearchAPI.http file.](../../assets/images/extend-m365-copilot-02/run-in-ttk05.png)

<cc-end-step lab="e2" exercise="2" step="1" />

### Step 2: Try the other methods and resources

Now try sending the POST request for `{{base_url}}/me/chargeTime`. This will charge 3 hours of Avery's time to the Woodgrove Bank project. This is stored in the project database, which is a locally hosted emulation of Azure Table Storage, so the system will remember that Avery has delivered these hours. (To test this, call the `/me` resource again and look at the `"deliveredThisMonth"` property under the Woodgrove project).

Continue to try the various GET requests in the .http file to find consultants with various skills, certifications, roles, and availability. All this information will be available to Copilot so it can answer user prompts.

<cc-end-step lab="e2" exercise="2" step="2" />

### Step 3: Examine the database (optional)

If you've installed the [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer), you can examine and modify the application's data. The data is stored in Azure Table Storage, which in this case is running locally using the Azurite emulator.

!!! note
    When you ran `npm install` in the previous exercise you installed the Azurite storage emulator. For more information check the [Azurite documention here](https://learn.microsoft.com/azure/storage/common/storage-use-azurite){target=_blank}, and when you start the project, Azurite is automatically started up. So as long as your project is started successfully you can view the storage.

Within the Azure Storage Explorer, open the "Emulator & Attached" selection and pick the "(Emulator: Default Ports)" collection; then drill down to "Tables". You shold see 3 tables:

  * **Consultant:** This table stores details about Trey Research consultants
  * **Project:** This table stores details about Trey Research projects
  * **Assignment:** This table stores consultant assignments to projects, such as Avery Howard's assignment to the Woodgrove Bank project. This table includes a "delivered" field that contains a JSON representation of the hours delivered by that consultant on the project over time.

![The UI of the Azure Storage Explorer while browsing the local storage tables for Consultant, Project, and Assignment.](../../assets/images/extend-m365-copilot-02/azure-storage-explorer01.png)

<cc-end-step lab="e2" exercise="2" step="3" />

---8<--- "e-congratulations.md"

You've successfully built the lab sample API! You can now proceed to make it into a Copilot plugin, and expose it via a Declarative agent.

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/02-build-the-api" />
