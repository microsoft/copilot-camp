# Lab E1 - Build your first Declarative agent with TypeSpec definition using Microsoft 365 Agents Toolkit

In this lab your will build a Declarative Agent with TypeSpec definition using Microsoft 365 Agents Toolkit. You will create an agent called `RepairServiceAgent`, which interacts with repairs data via an existing API service to help users manage car repair records. 
You will find the source code to the finished agent [here](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab01-declarative-copilot/RepairServiceAgent).

This lab has been updated to reflect Ignite 2025 announcements. TypeSpec is now GA, and Toolkit version 6.4.1 is released. This lab is based on Lab 560, the hands-on session delivered at Ignite in Nov 2025.

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RNsa0kLsXgY" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>Get a quick overview of the lab in this video.</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "e-labs-prelude.md"
    </div>
</div>


## What are Declarative Agents? 

**Declarative Agents** leverage the same scalable infrastructure and platform of Microsoft 365 Copilot, tailored specifically to meet focus on a special area of your needs. They function as subject matter experts in a specific area or business need, allowing you to use the same interface as a standard Microsoft 365 Copilot chat while ensuring they focus exclusively on the specific task at hand.

### Anatomy of a Declarative Agent

As you build more agents for Copilot, you’ll notice that the final output is a set of a few files bundled into a zip file what we call an app package, that you'll install and use. So it's important you have a basic understanding of what the app package consists of. The app package of a Declarative Agent is similar to a Teams app if you have built one before with additonal elements. See the table to see all the core elements. You will also see that the app deployment process is very similar to deploying a Teams app.

| File Type                          | Description                                                                                                                                                     | Required |
|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| App manifest        | A JSON file (**manifest.json**) that defines the standard Teams app manifest.                                                                                     | Yes      |
| Declarative agents manifest        | A JSON file containing the agent's name, instructions, capabilities, conversation starters, and actions (if applicable).                                        | Yes      |
| Plugin manifest       | A JSON file used to configure your action as an API plugin. Includes authentication, required fields, adaptive card responses, etc. Only needed if actions exist. | No       |
| App icons            | A color and outline icon for your declarative agent.                                                                            | Yes    |

### Capabilities of a Declarative Agent

You can enhance the agent's focus on context and data by not only adding instructions but also specifying the knowledge base it should access. They are called capabilities. Below are the ones supported in a Declarative Agent today: 

- **Copilot Connectors** - let you centralize content on Microsoft 365. By importing external content to Microsoft 365, you not only make it easier to find relevant information, but you also let others in your organization discover new content.
- **OneDrive and SharePoint** - let you provide URLs of files/sites in OneDrive and SharePoint, which will part of the agent's knowledge base.
- **Web search** - let you enable or disable web content as part of the agent's knowledge base. You can also pass around 4 websites URLs as source. 
- **Code interpreter** - enables you to build an agent with capabilities to better solve math problems and, when needed, leverage Python code for complex data analysis or chart generation.
- **GraphicArt** - enables you to build an agent for image or video generation using DALL·E.
- **Email knowledge** - enables you to build an agent to acces a personal or shared mailbox, and optionally, a specific mailbox folder as knowledge.
- **People knowledge** - enables you to build an agent to answer questions about individuals in an organization.
- **Teams messages** - enables you to equip the agent to search through Teams channels, teams, meetings, 1:1 chats, and group chats.
- **Dataverse knowledge** - enables you to add a Dataverse instance as a knowledge source.
- **Scenario models** - enables you to add task-specific models.
- **Teams Meetings**- enables you to build an agent to search for information about meetings in the organization.



!!! tip "OnDrive and SharePoint"
    URLs should be full path to SharePoint items (site, document library, folder, or file). You can use the "Copy direct link" option in SharePoint to get the full path of files and folders. To achieve this, right-click on the file or folder and select Details. Navigate to Path and click on the copy icon.<mark> Not specifying the URLs, the entire corpus of OneDrive and SharePoint content available to the logged in user will be used by the agent.</mark>

!!! tip "Microsoft Copilot Connector"
    Not specifying the connections, the entire corpus of Copilot Connectors content available to the logged in user will be used by the agent.

!!! tip "Web search"
    Not specifying the sites, the agent is allowed to search all the sites. You can specify up to four sites with no more than 2 path segments and no querystring parameters. 


## Significance of TypeSpec for Declarative Agents

### What is TypeSpec

**TypeSpec** is a language developed by Microsoft for designing and describing API contracts in a structured and type-safe way. Think of it like a blueprint for how an API should look and behave including what data it accepts, returns, and how different parts of the API and its actions are connected.

### Why TypeSpec for Agents?

If you like how TypeScript enforces structure in your frontend/backend code, you'll love how TypeSpec enforces structure in your agent and its API services like actions. It fits perfectly in design-first development workflows that align with tools like Visual Studio Code.

- **Clear Communication** - provides a single source of truth that defines how your agent should behave, avoiding confusion when dealing with multiple manifest files like in the case of Declarative Agents.

- **Consistency** - ensures all parts of your agent and its actions, capabilities etc are designed consistently following the same pattern.

- **Automation Friendly** - automatically generates OpenAPI specs and other manifests saving time and reducing human errors.

- **Early Validation** - catches design issues early before writing actual code for example, mismatched data types or unclear definitions.

- **Design-First Approach** - encourages thinking about agent and API structure and contracts before jumping into implementation, leading to better long-term maintainability.


☑️ Well done understanding all the basic concepts you need to know about Declarative agents and TypeSpec! Proceed to the first exercise.

## Exercise 1: Build your first Declarative Agent with one action that performs a single operation

It’s time to build your first Declarative Agent using Microsoft 365 Agents Toolkit. 
You will create an agent called **RepairServiceAgent**, which interacts with repairs data via an existing Repairs API service to help users manage car repair records.
Checkout the  additional prerequisites for this lab, please install them now.

- [REST Client add-in for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=humao.rest-client): You will use one of these toolkits to test your API locally.
- [Microsoft 365 Agents Toolkit version 6.4.0 and up](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension). If you have an older version, update now.

### Step 1: Scaffold your base agent project using Microsoft 365 Agents Toolkit

- Open VS Code, locate the Microsoft 365 Agents Toolkit icon <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> from the VS Code menu on the left and select it. An activity bar will be open. 
-	Select the "Create a New Agent/App" button in the activity bar which will open the palette with a list of app templates available on Microsoft 365 Agents Toolkit.
-	Choose "Declarative Agent" from the list of templates.
-	Next, select "Start with TypeSpec for Microsoft 365 Copilot" to define your agent using TypeSpec.
-	Next, select the **Default folder** where you want the agents toolkit to scaffold the agent project.
-	Next, give an application name like - `RepairServiceAgent` and select Enter to complete the process. You will get a new VSCode window with the agent project preloaded.


!!! note
    You may get a prompt window asking if you trust the authors of the files in the folder. This is expected and you can safely select **Yes, I trust the authors**. The dialog is a security safeguard that helps you decide whether to run all features or limit execution based on the trustworthiness of the code authors. If you're opening your own code or from a reliable source, it's safe to trust.


<cc-end-step lab="e01" exercise="1" step="1" />

### Step 2: Sign into the Microsoft 365 Agents Toolkit 

You'll need to sign into the Microsoft 365 Agents Toolkit in order to upload and test your agent from within it.

-	Within the project window, select the Microsoft 365 Agents Toolkit icon <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> again from the left side menu. This will open the Agent Toolkit’s activity bar with sections like Accounts, Environment, Development etc. 
-	Under "Accounts" section select "Sign in to Microsoft 365". This will open a dialog from the editor to sign in or create a Microsoft 365 developer sandbox or Cancel. Select "Sign in". 
-	Once signed in, close the browser and go back to the project window.

<cc-end-step lab="e01" exercise="1" step="2" />

### Step 3: Define your agent 

The Declarative Agent project scaffolded by the Agents Toolkit provides a template that includes code for connecting an agent to the GitHub API to display repository issues. In this lab, you'll build your own agent that integrates with a Repairs API service, supporting multiple operations to manage repair data.

Before proceeding with the agent definition, take a moment to examine the Repairs API service to gain a clearer understanding of its functionality.

#### Get to know the repair API service

You'll need to explore endpoints and payloads of the API service interactively. Using a **.http** file in Visual Studio Code with the REST Client extension, which is already installed for you, allows you to define and send HTTP requests directly from your editor. It's a lightweight, code-friendly way to test APIs, inspect responses, and iterate quickly without switching to external tools.

Inside the root folder of the project you just created, create a folder called **http**.
Create a new file named `repairs-api.http` inside the http folder.

!!! note
    **Creating folders and files in VS Code:**

      - To create a new folder: Right-click in the Explorer panel (file tree) on the left side of VS Code, select "New Folder", and type the folder name.

      - To create a new file: Right-click on the folder where you want to add the file, select "New File", and type the filename with its extension.

      - Alternatively, you can use the icons in the Explorer panel: the folder icon (📁) creates a new folder, and the file icon (📄) creates a new file in the currently selected location.

Copy paste below content into the file.

```
@base_url = https://repairshub.azurewebsites.net

### Get all repair requests
{{base_url}}/repairs

### Get a specific repair request by ID
{{base_url}}/repairs/1

### Create a new repair request
POST {{base_url}}/repairs
Content-Type: application/json

{
  "description": "Repair broken screen",
  "date": "2023-10-01T12:00:00Z",
  "image": "https://example.com/image.png"
}

### Update an existing repair request
PATCH {{base_url}}/repairs/1
Content-Type: application/json  

{
  "id": 1,
  "description": "Repair broken screen - updated",
  "date": "2023-10-01T12:00:00Z",
  "image": "https://example.com/image-updated.png"
}


### Delete a repair request by ID
DELETE {{base_url}}/repairs/10
Content-Type: application/json

{
  "id": 10
}
```

> Note there is a small delay to process the request from the editor, but the response should come back in a few seconds.

To run each request, hover over each request line (e.g., GET {{base_url}}/repairs) and click **Send Request** to see the response.
Observe the structure of requests and responses and use the response data to understand how your agent will interact with the API.

![http request](https://github.com/user-attachments/assets/050ca976-4523-463d-920f-4f0f2da46249)




#### Repairs API Overview

**Base URL**: *https://repairshub.azurewebsites.net*

| Operation | Method | Endpoint | Payload required | Purpose |
|-----------|--------|----------|------------------|---------|
| Get all repair requests | GET | /repairs | No | Retrieve all repair jobs |
| Get repair by ID | GET | /repairs/{id} | No | Fetch a specific repair job |
| Create a repair request | POST | /repairs | Yes | Submit a new repair job |
| Update a repair request | PATCH | /repairs/{id} | Yes | Modify an existing repair job |
| Delete a repair request | DELETE | /repairs/{id} | No | Remove a repair job by ID |

Now that you're familiar with the API service, let's move on to integrating it with your agent.

#### Project structure

Within your agent project under **src** folder, you'll discover the core TypeSpec configuration files: **main.tsp** and **env.tsp**.

The **main.tsp** file serves as the primary definition point for your agent, containing essential metadata, behavioral instructions, and capability specifications.

The **env.tsp** file is used by the toolkit to process environment variables during compilation. This file is generated from **env/.env.\*** files and offer variables for other TypeSpec files, so manual updates are not required.

You'll also find an **actions** folder containing template files - initially including **github.tsp** which demonstrates GitHub API integration. For this lab, you'll replace this template with your own action definitions to establish connectivity with the Repairs API service.

Additionally, there's a **prompts** folder housing the **instructions.tsp** file, which allows you to define detailed behavioral instructions and guidance for your agent.


#### Update the Agent Metadata and Instructions

Open **main.tsp** and inspect what is there in the default template, which you will modify for our agent's repair service scenario.

In the **main.tsp** file, you will find the basic structure of the agent. Review the content provided by the agents toolkit template which includes:
-	Agent name and description 1️⃣
-	Basic instructions 2️⃣
-	Placeholder code for actions and capabilities (commented out) 3️⃣

![image of main.tsp file](https://github.com/user-attachments/assets/9924db6f-930b-453c-92ec-72ac7534c1cb)



Begin by defining your agent for the repair scenario. Replace the **@agent** metadata with below code snippet.

```typespec
@agent(
  "RepairServiceAgent",
  "An agent for managing repair information"
)

```

Next, configure a conversation starter, the initial prompt that begins user-agent interaction. Uncomment the default template section and update the title and text fields to match the agent scenario.

```typespec
// Uncomment this part to add a conversation starter to the agent.
// This will be shown to the user when the agent is first created.
@conversationStarter(#{
  title: "List repairs",
  text: "List all repairs"
})

```
This starter prompt needs to trigger a GET operation to retrieve all repairs from the service. To enable this behaviour in the agent, you' ll need to define the corresponding action. Proceed to the next step to do so.

Next, go to **prompts/instructions.tsp** and update the instructions.
Replace the entire code block in the file with below code:

```typespec
namespace Prompts {
  const INSTRUCTIONS = """
    ## Purpose
    You will assist the user in finding car repair records based on the information provided by the user.
  """;
}

```

#### Define the action for the agent

Next, you will define the action for your agent by opening the **actions/github.tsp** file. Rename this file to **actions.tsp**.  You can rename a file in VSCode by right clicking on the file and choosing "Rename". 

You'll return to the **main.tsp** file later to complete the agent metadata with the action reference, but first, the action itself must be defined. For that open the file **actions.tsp**.

The default **actions.tsp** template demonstrates how to define an agent action, including metadata, service URL, and operation structure. Replace the sample GitHub logic entirely with definitions relevant to the Repairs API service.

After the module-level directives like import and using statements, replace the existing code up to the point where the "SERVER_URL" is defined with the snippet below. 

```typespec
@service
@server(RepairsAPI.SERVER_URL)
@actions(RepairsAPI.ACTIONS_METADATA)
namespace RepairsAPI{
  /**
   * Metadata for the API actions.
   */
  const ACTIONS_METADATA = #{
    nameForHuman: "Repair Service Agent",
    descriptionForHuman: "Manage your repairs and maintenance tasks.",
    descriptionForModel: "Plugin to add, update, remove, and view repair objects.",
    legalInfoUrl: "https://docs.github.com/en/site-policy/github-terms/github-terms-of-service",
    privacyPolicyUrl: "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
  };
  
  /**
   * The base URL for the  API.
   */
  const SERVER_URL = "https://repairshub.azurewebsites.net";

```

Next, replace the operation in the template code from "searchIssues" to "listRepairs" to get the list of repairs.
Replace the entire block of code starting just after the SERVER_URL definition and ending just *before* the final closing braces with the snippet below. Be sure to leave the closing braces intact. 

**Remember to alway copy the code comment section as well here, do not ignore as they form the documentation for this action and is needed at compile time**. 

```typespec
  /**
   * List repairs from the API 
   * @param assignedTo The user assigned to a repair item.
   */

  @route("/repairs")
  @get  op listRepairs(@query assignedTo?: string): string;

```

Now go back to **main.tsp** file and verify the import statement for actions. If it still references *./actions/github.tsp*, replace *import "./actions/github.tsp";* with the statement below:

```typespec
import "./actions/actions.tsp";
```

Next, in the same file, add the action you just defined into the agent. After the conversation starters replace the entire "RepairServiceAgent" namespace with below snippet:

```typespec
namespace RepairServiceAgent{  

  op listRepairs is global.RepairsAPI.listRepairs;   

}

```


<cc-end-step lab="e01" exercise="1" step="3" />

### Step 4: (Optional) Understand the decorators

This is an optional step but if curious to know what we have defined in the TypeSpec file just read through this step.
In the TypeSpec files **main.tsp** and **actions.tsp**, you'll find decorators (starting with @), namespaces, models, and other definitions for your agent.

Check this table to understand some of the decorators used in these files 


| Annotation             | Description                                                                                                                                                     |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| @agent             | Defines the namespace (name) and description of the agent                                                                                                       |
| @instructions       | Defines the instructions that prescribe the behaviour of the agent. 8000 characters or less                                                                     |
| @conversationStarter | Defines conversation starters for the agent                                                                                                                     |
| @op            | Defines any operation. Either it can be an operation to define agent's capabilities like *op GraphicArt*, *op CodeInterpreter* etc., or define API operations like **op listRepairs**. For a post operation, define it like: *op createRepair(@body repair: Repair): Repair;*                                                                                                               |
| @server           | Defines the server endpoint of the API and its name                                                                                                              |
| @capabilities      | When used inside a function, it defines simple adaptive cards with small definitions like a confirmation card for the operation                                  |

☑️ You've successfully completed the first exercise! You learned how to add an action to list repairs which is the GET operation. In the next exercise, you'll add more operations for managing repairs and test and debug them.

Continue to the next exercise.

<cc-end-step lab="e01" exercise="1" step="4" />

## Exercise 2: Add more operations, test the agent, and learn debugging techniques

Next, you will enhance the agent by adding more operations in the Repairs API service and enabling responses with Adaptive Cards. Let's explore each of these enhancements step by step.
If you are in the browser, go back to your project in VS Code.

### Step 1: Modify agent to add more operations

- Go to file **actions/actions.tsp** and copy paste below snippet just after **listRepairs** operation to add new operations **createRepair**, **updateRepair** and **deleteRepair**. Here you will also define the **Repair** item data model.

```typespec
/**
   * Create a new repair using the API. 
   * When creating a repair, the `id` field is optional and will be generated by the server.
   * The `date` field should be in ISO 8601 format (e.g., "2023-10-01T12:00:00Z").
   * The `title` field based on what repair user wants to create
   * @param repair The repair to create.
   */
  @route("/repairs")  
  @post  op createRepair(@body repair: Repair): Repair;

  /**
   * Update an existing repair.
   * The `id` field is required to identify the repair to update.
   * The `date` field should be in ISO 8601 format (e.g., "2023-10-01T12:00:00Z").
   * The `image` field should be a valid URL pointing to the image associated with the repair.
   * @param repair The repair to update.
   */
  @route("/repairs")  
  @patch(#{implicitOptionality: true})
  op updateRepair(@body repair: Repair): Repair;


  /**
   * Delete a repair.
   * The `id` field is required to identify the repair to delete.
   * @param repair The repair to delete.
   */
  @route("/repairs") 
  @delete  op deleteRepair(@body repair: Repair): Repair;
  
  /**
   * A model representing a repair.
   */
  model Repair {
    /**
     * The unique identifier for the repair.
     */
    id?: string;

    /**
     * The short summary or title of the repair.
     */
    title: string;

    /**
     * The detailed description of the repair.
     */
    description?: string;

    /**
     * The user who is assigned to the repair.
     */
    assignedTo?: string;

    /**
     * The optional date and time when the repair is scheduled or completed.
     */
    @format("date-time")
    date?: string;

    /**
     * The URL of the image associated with the repair.
     */
    @format("uri")
    image?: string;
  }

```


- Next, go back to **main.tsp** file and make sure the new operations are also added as the agent's action. Paste the below snippet after the line **op listRepairs is global.RepairsAPI.listRepairs;** inside the **RepairServiceActions** namespace

```typespec
op createRepair is global.RepairsAPI.createRepair;
op updateRepair is global.RepairsAPI.updateRepair;
op deleteRepair is global.RepairsAPI.deleteRepair;   

```
- Also add a new conversation starter for creating a new repair item just after the first conversation starter definition.

```typespec
@conversationStarter(#{
  title: "Create repair",
  text: "Create a new repair titled \"[TO_REPLACE]\" and assign it to me"
})

```

<cc-end-step lab="e01" exercise="2" step="1" />

### Step 2: Add adaptive card to function reference

Next, you will enhance the reference cards or response cards using adaptive cards. Let's create an adaptive card for the repair items.

- In the project, go to the **adaptiveCards** folder under **appPackage** folder. Create a new file named `repair.json` and paste the provided code snippet. This will define a new adaptive card for the repair object. Ignore the default template card that is already present in this folder.

```json
{
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.5",
    "body": [
  {
    "type": "Container",
    "$data": "${$root}",
    "items": [
      {
        "type": "TextBlock",
        "text": "Title: ${if(title, title, 'N/A')}",
        "weight": "Bolder",
        "wrap": true
      },
      {
        "type": "TextBlock",
        "text": "Description: ${if(description, description, 'N/A')}",
        "wrap": true
      },
      {
        "type": "TextBlock",
        "text": "Assigned To: ${if(assignedTo, assignedTo, 'N/A')}",
        "wrap": true
      },
      {
        "type": "TextBlock",
        "text": "Date: ${if(date, date, 'N/A')}",
        "wrap": true
      },
      {
        "type": "Image",
        "url": "${image}",
        "$when": "${image != null}"
      }
    ]
  }
],  
    "actions": [
      {
        "type": "Action.OpenUrl",
        "title": "View Image",
        "url": "https://www.howmuchisit.org/wp-content/uploads/2011/01/oil-change.jpg"
      }
    ]
  }
  

```

- Next, go back to **actions.tsp** file and locate the listRepairs operation. Just above the operation definition **@get  op listRepairs(@query assignedTo?: string): string;**, paste the card definition using below snippet.

```typespec

@card(#{  dataPath: "$", file: "adaptiveCards/repair.json",    properties: #{ title: "$.title", url: "$.image" } })
  
```
The above card response will be sent by the agent when you ask about a repair item or when agent brings a list of items as its reference.

> To keep things simple for this lab, you'll reuse the same card. In practice, you could create separate cards for different operations based on your needs.

Continue to add card response for the **createRepair** operation to show what the agent created after the POST operation.

- Copy paste below snippet just above the code **@post  op createRepair(@body repair: Repair): Repair;**

```typespec

@card(#{  dataPath: "$", file: "adaptiveCards/repair.json",    properties: #{ title: "$.title", url: "$.image" } })

```

<cc-end-step lab="e01" exercise="2" step="2" />

### Step 3: Update agent instruction for new operations

In the **prompts/instructions.tsp** file, update instructions definition to have additional directives for the agent.
Replace the **INSTRUCTIONS** constant with below code:

```typespec
const INSTRUCTIONS ="""  
    ## Purpose
    You will assist the user in finding car repair records based on the information provided by the user.
   
    ## Guidelines
    - You are a repair service agent.
    - You can use the actions to create, update, and delete repairs.
    - When creating a repair item, if the user did not provide a description or date, use the title as the description and put today's date in the format YYYY-MM-DD.
    - Do not use any technical jargon or complex terms.
  """;
```

<cc-end-step lab="e01" exercise="2" step="3" />

### Step 4:  Provision and Test the Agent

#### Provision

Next step is to test the Repair Service Agent. For this first you need to provision the agent to your tenant. 

Follow below steps:

- Open your **.env.dev** file  in folder **env** in the root of the project to see if you have a variable **AGENT_SCOPE**. If present, change the variable value from `shared` to `personal`.

- Select the Agents toolkit extension icon <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" />. This will open the activity bar for agents toolkit from within your project.

- In the activity bar of the agents toolkit under "LifeCycle" select "Provision". This will build the app package consisting of the generated manifest files and icons and side load the app package into the catalog only for you to test.
  
>!!! note
     Here the agents toolkit also helps validate all the definitions provided in the TypeSpec file to ensure accuracy. It also identifies errors to streamline the developer experience.

This will take a while and you will be able to see a toaster message in VS Code, showing the progress of the task to provision.

!!! warning
    There are couple of known issues where the **Provision** action in Agents Toolkit may fail with the errors shown below. If this happens, simply retry the provisioning process until it succeeds.
    ![provision 429 issue](https://github.com/user-attachments/assets/bf849c94-6f5a-406a-9902-ae5a07d47840)
    ![provision timeout issue](https://github.com/user-attachments/assets/fd13651e-d469-4ecb-91b2-c24045fb4264)


- Next, open Microsoft Edge from lab machine from the taskbar and go to `https://m365.cloud.microsoft/chat` in the browser to open Copilot app. Login using your credentials.

- Select the **RepairServiceAgent** from the left side of the screen under **Agents**. 

> If you don't see left navigation to choose agent,  look for below icon and select it to show the navigation.
> ![find agents nav](https://github.com/user-attachments/assets/0d603d1b-6458-4766-9063-4f87597f10dc)

#### Test list operation

- Select the conversation starter - **List repairs** and send the prompt to the chat to initiate conversation with your agent and check out the response. When prompted to connect the agent to process a query, you’ll usually get a message with buttons to Allow accessing your service through agent. 

- To streamline your experience in this lab, select **"Always allow"** when it appears.

  Once accepted you will see the response from the agent as below: 

![ex1-dem0-01](https://github.com/user-attachments/assets/02400c13-0766-4440-999b-93c88ca45dc7)

#### Diagnosing and Debugging Agent

You can enable developer mode in a chat to allow you as a developer to understand how well the agent understands the tasks, ensure it calls your services appropriately, identify areas that need fine-tuning, detect performance issues, and generally help you track and analyse its interactions.

- Send `-developer on` to the chat to enable debugging mode.

The agent will respond with a success message if everything went well **Successfully enabled developer mode**.

!!! note
    Refresh the browser by pressing F5 to activate the agent debug info.

- Next to test, send a prompt to interact with the agent like the one below.

`Find out what Karin is working on`.

- You will get a response with information from the repair service but also get the **Agent debug info** card along with the response.
- Expand the Agent debug info card to view all the details. You will be able to see:
  - Agent information 1️⃣
  - Capabilities of the agent 2️⃣
  - Actions and what function were selected 3️⃣
  - Executed action info with detailed information about the request, latency, response data, etc. 4️⃣

  ![image of agent debug info](https://github.com/user-attachments/assets/cb8623c7-27e1-4ece-9ec6-4c43b76917fb)


- Try expanding the Executed Actions and you will see the request url, parameters passed, request header, response, latency, etc.

#### Test create operation

Now let's try to invoke a POST call to create a repair item.

- Start by using the conversation starter 'Create repair'. Replace parts of the prompt to add a title, then send it to the chat to initiate the interaction. For e.g.

    `Create a new repair titled "360 camera issue" and assign it to me.`

- The confirmation dialog if you notice has more metadata that what you sent, thanks to updated instructions.

![response from Create a new repair titled "360 camera issue" and assign it to me](https://github.com/user-attachments/assets/f570f9fd-fa85-4ab1-9c3d-f9baf993dc95)

 
 - Proceed to add the item by confirming the dialog.

 The agent responds is with created item shown in a rich adaptive card.

![adaptive card response](https://github.com/user-attachments/assets/d4d5906d-e5fb-4728-bb0c-b7a9f54215c5)


- Next, recheck reference cards work. Open a new chat and then send below prompt in the conversation

     `List all my repairs.`

The agent with the list with each referenced with an adaptive card.

![list all repairs with new repair added](https://github.com/user-attachments/assets/8240525d-c683-40f9-aa68-d6ba9a19d0f2)



☑️ You've successfully completed the second exercise! You've enhanced your agent with additional repair operations and learned how to test and debug it. Continue to the bonus exercise.

<cc-end-step lab="e01" exercise="2" step="4" />

## Bonus Exercise: Add code interpreter capability to the agent

### Step 1: Add code interpreter capability to your agent

Declarative Agents can be extended to have many capabilities like OneDriveAndSharePoint, WebSearch, CodeInterpreter etc
Next, you will enhance the agent by adding code interpreter capability to it.

- To do this, open the **main.tsp** file and locate the **RepairServiceAgent** namespace which is where you define the agent behaviour.

- Inside the namespace **RepairServiceAgent**, insert the following snippet above **op listRepairs** to define a new capability that enables the agent to interpret and execute code.

```typespec
op codeInterpreter is AgentCapabilities.CodeInterpreter;
```

!!! note
    When you add above codeinterpreter operation, paste it inside the outer **RepairServiceAgent** namespace which defines the agent's behaviour including the capabilities and not the **RepairServiceActions** namespace which defines the agent's actions.

Since the agent now supports additional capability, update the instructions accordingly to reflect this enhancement.

- In the **prompts/instructions.tsp** file, update INSTRUCTIONS constant to have additional directives for the agent for new capability. Replace the const with below snippet:

```typespec

  const INSTRUCTIONS ="""
   ## Purpose
    You will assist the user in finding car repair records based on the information provided by the user. You can generate charts based on data. Use python execution for charting/visualization.
   
    ## Guidelines
    - You are a repair service agent.
    - You can use the actions to create, update, and delete repairs.
    - When creating a repair item, if the user did not provide a description or date, use the title as the description and put today's date in the format YYYY-MM-DD.
    - when asked to generate report, generate charts using existing data.
    - Do not use any technical jargon or complex terms.
""";

```

<cc-end-step lab="e01" exercise="3" step="1" />

### Step 2: Test your agent's new capability

Next, you will test the new analytical capability of your agent. You will need to reprovision the agent. Follow below steps:

- Update the version of your agent. Go to **appPackage/manifest.json** and update from **"version": "1.0.0"** to **"version": "1.0.1"**
- Save all changes, select the Agents toolkit extension icon <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" />, to open the activity bar from within your project.
- In the activity bar of the agents toolkit under "LifeCycle" select "Provision". This will reprovision the agent.
- If you already have chat with the agent open, then open a new chat by selecting the **New chat** button on the top right corner of your agent.
- If not, open Microsoft Edge from lab machine from the taskbar and go to `https://m365.cloud.microsoft/chat` in the browser to open Copilot app. Login using your credentials.

- Select the **RepairServiceAgent** from the left side of the screen under **Agents**. 

> If you don't see left navigation to choose agent,  look for below icon and select it to show the navigation.
> ![find agents nav](https://github.com/user-attachments/assets/0d603d1b-6458-4766-9063-4f87597f10dc)

- Next, copy the prompt below and paste it to the message box and hit enter to send it.

`Classify repair items based on title into three distinct categories: Routine Maintenance, Critical, and Low Priority. Then, generate a pie chart displaying the percentage representation of each category. Use unique colours for each group and incorporate tooltips to show the precise values for each segment.`

You should get some response similar to below screen. It may vary sometimes.
![response with chart using code interpreter](https://github.com/user-attachments/assets/8ccc7758-28ec-42ff-96fd-2341cad6c9ed)

!!! warning
    Known issue with code interpreter: If you see an error message in the response as below, don't worry—the chart will still be generated and displayed correctly. You can safely ignore the error.
    ![error with CI](https://github.com/user-attachments/assets/d9d04b7f-5696-42ca-8767-178dbc51f342)

<cc-end-step lab="e01" exercise="3" step="2" />

☑️ Great job completing all the exercises!

---8<--- "e-congratulations.md"
Great job on building your first agent using TypeSpec 🎉 

 Proceed to create, build, and integrate an API selecting **Next**.
 <cc-next url="../02-build-the-api" label="Next" />

Continue practicing by building a Geolocator game agent—select **Create a game** below.
 <cc-next url="../01a-geolocator" label="Create a game" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/01-typespec-declarative-agent" />
