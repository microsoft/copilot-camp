# Lab E1 - Build your first Declarative agent with TypeSpec definition using Microsoft 365 Agents Toolkit

In this lab your will build a Declarative Agent with TypeSpec definition using Microsoft 365 Agents Toolkit. You will create an agent called `RepairServiceAgent`, which interacts with repairs data via an existing API service to help users manage car repair records.

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

As you build more agents for Copilot, you’ll notice that the final output is a set of a few files bundled into a zip file that we call an app package, which you'll install and use. So it's important you have a basic understanding of what the app package consists of. The app package of a Declarative Agent is similar to a Teams app, if you have built one before, with additonal elements. See the table to see all the core elements. You will also see that the app deployment process is very similar to deploying a teams app.

| File Type                          | Description                                                                                                                                                     | Required |
|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| Microsoft 365 App Manifest        | A JSON file (`manifest.json`) that defines the standard Teams app manifest.                                                                                     | Yes      |
| Declarative Agent Manifest        | A JSON file containing the agent's name, instructions, capabilities, conversation starters, and actions (if applicable).                                        | Yes      |
| Plugin Manifest       | A JSON file used to configure your action as an API plugin. Includes authentication, required fields, adaptive card responses, etc. Only needed if actions exist. | No       |
| OpenAPI Spec            | A JSON or YAML file defining your API. Required only if your agent includes actions.                                                                            | No       |

### Capabilities of a Declarative Agent

You can enhance the agent's focus on context and data by not only adding instructions but also specifying the knowledge base it should access. They are called capabilities. Below are the ones supported in a Declarative Agent at the time of this writing: 

- **Copilot Connectors** - let you centralize content on Microsoft 365. By importing external content to Microsoft 365, you not only make it easier to find relevant information, but you also let others in your organization discover new content.
- **OneDrive and SharePoint** - let you provide URLs of files/sites in OneDrive and SharePoint, which will be part of the agent's knowledge base.
- **Web search** - let you enable or disable web content as part of the agent's knowledge base. You can also pass around up to 4 websites URLs as sources. 
- **Code interpreter** - enables you to build an agent with capabilities to better solve math problems and, when needed, leverage Python code for complex data analysis or chart generation.
- **GraphicArt** - enables you to build an agent for image or video generation using DALL·E.
- **Email knowledge** - enables you to build an agent to acces a personal or shared mailbox, and optionally, a specific mailbox folder as knowledge.
- **People knowledge** - enables you to build an agent to answer questions about individuals in an organization.
- **Teams messages** - enables you to equip the agent to search through Teams channels, teams, meetings, 1:1 chats, and group chats.
- **Dataverse knowledge** - enables you to add a Dataverse instance as a knowledge source.


!!! tip "OnDrive and SharePoint"
    URLs should be full path to SharePoint items (site, document library, folder, or file). You can use the "Copy direct link" option in SharePoint to get the full path of files and folders. To achieve this, right-click on the file or folder and select Details. Navigate to Path and click on the copy icon.<mark> Not specifying the URLs, the entire corpus of OneDrive and SharePoint content available to the logged in user will be used by the agent.</mark>

!!! tip "Microsoft Copilot Connector"
    Not specifying the connections, the entire corpus of Copilot Connectors content available to the logged in user will be used by the agent.

!!! tip "Web search"
    Not specifying the sites, the agent is allowed to search all the sites. You can specify up to four sites with no more than 2 path segments and no querystring parameters. 


## Significance of TypeSpec for Declarative Agents

### What is TypeSpec

TypeSpec is a language developed by Microsoft for designing and describing API contracts in a structured and type-safe way. Think of it like a blueprint for how an API should look and behave including what data it accepts, returns, and how different parts of the API and its actions are connected.

### Why TypeSpec for Agents?

If you like how TypeScript enforces structure in your frontend/backend code, you'll love how TypeSpec enforces structure in your agent and its API services like actions. It fits perfectly in design-first development workflows that align with tools like Visual Studio Code.

Clear Communication - provides a single source of truth that defines how your agent should behave, avoiding confusion when dealing with multiple manifest files like in the case of Declarative Agents.

Consistency - ensures all parts of your agent and its actions, capabilities, etc. are designed consistently following the same pattern.

Automation Friendly - automatically generates OpenAPI specs and other manifests saving time and reducing human errors.

Early Validation - catches design issues early before writing actual code for example, mismatched data types or unclear definintions.

Design-First Approach - encourages thinking about agent and API structure and contracts before jumping into implementation, leading to better long-term maintainability.

## Exercise 1: Build the base agent with TypeSpec using Microsoft 365 Agents Toolkit


### Step 1: Scaffold your base agent project using Microsoft 365 Agents Toolkit
-	Locate the Microsoft 365 Agents Toolkit icon <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> from the VS Code menu on the left and select it. An activity bar will be open. 
-	Select the "Create a New Agent/App" button in the activity bar which will open the palette with a list of app templates available on Microsoft 365 Agents Toolkit.
-	Choose "Declarative Agent" from the list of templates.
-	Next, select "Start with TypeSpec for Microsoft 365 Copilot" to define your agent using TypeSpec.
-	Next, select the folder where you want the agents toolkit to scaffold the agent project.
-	Next, give an application name like "RepairServiceAgent" and select Enter to complete the process. You will get a new VS Code window with the agent project preloaded.

<cc-end-step lab="e01" exercise="1" step="1" />

### Step 2: Sign into the Microsoft 365 Agents Toolkit 

You'll need to sign into the Microsoft 365 Agents Toolkit in order to upload and test your agent from within it.

-	Within the project window, select the Microsoft 365 Agents Toolkit icon <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> again from the left side menu. This will open the Agent Toolkit’s activity bar with sections like Accounts, Environment, Development etc. 
-	Under "Accounts" section select "Sign in to Microsoft 365". This will open a dialog from the editor to sign in or create a Microsoft 365 developer sandbox or Cancel. Select "Sign in". 
-	Once signed in, close the browser and go back to the project window.

<cc-end-step lab="e01" exercise="1" step="2" />

### Step 3: Define your agent 

The Declarative Agent project scaffolded by the Agents Toolkit provides a template that includes code for connecting an agent to the GitHub API to display repository issues. In this lab, you’ll build your own agent that integrates with a car repair service, supporting multiple operations to manage repair data.

In the project folder, you will find two TypeSpec files `main.tsp` and `actions.tsp`.
The agent is defined with its metadata, instructions and capabilities in the `main.tsp` file.
Use the `actions.tsp` file to define your agent’s actions. If your agent includes any actions like connecting to an API service, then this is the file where it should be defined.

Open `main.tsp` and inspect what is there in the default template, which you will modify for our agent’s repair service scenario. 

#### Update the Agent Metadata and Instructions

In the `main.tsp` file you will find the basic structure of the agent. Review the content provided by the agents toolkit template which includes:
-	Agent name and description 1️⃣
-	Basic instructions 2️⃣
-	Placeholder code for actions and capabilities (commented out) 3️⃣

![Visual Studio Code showing the initially scaffolded template for a Declarative Agent defined in TypeSpec. There TypeSpec syntax elements to define the agent, its instructions, and some commented out commands to define starter prompts and actions.](https://github.com/user-attachments/assets/42da513c-d814-456f-b60f-a4d9201d1620)


Begin by defining your agent for the repair scenario. Replace the "@agent" and "@instructions" definitions with below code snippet.

```typespec
@agent(
  "RepairServiceAgent",
   "An agent for managing repair information"
)

@instructions("""
  ## Purpose
You will assist the user in finding car repair records based on the information provided by the user. 
""")

```

Next, add a conversation starter for the agent. Just below the instructions you will see a commented out code for a conversation starter. Uncomment it.
And replace title and text as below.

```typespec
// Uncomment this part to add a conversation starter to the agent.
// This will be shown to the user when the agent is first created.
@conversationStarter(#{
  title: "List repairs",
  text: "List all repairs"
})

```

#### Update the action for the agent

Next, you will define the action for your agent by opening the `actions.tsp` file. You’ll return to the `main.tsp` file later to complete the agent metadata with the action reference, but first, the action itself must be defined. For that open the file `actions.tsp`.

The placeholder code in `actions.tsp` is designed to search for open issues in a GitHub repository. It serves as a starting point to help newcomers understand how to define an action for their agent like action’s metadata, API host url and operations or functions and their definitions. You will replace all this with repair service. 

After the module-level directives like import and using statements, replace the existing code up to the point where the "SERVER_URL" is defined with the snippet below. This update introduces the action metadata and sets the server URL. Also, note that the namespace has been changed from GitHubAPI to RepairsAPI.

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

Next, replace the operation in the template code from "searchIssues" to "listRepairs" which is a repair operation to get the list of repairs.
Replace the entire block of code starting just after the SERVER_URL definition and ending *before* the final closing braces with the snippet below. Be sure to leave the closing braces intact.

```typespec
  /**
   * List repairs from the API 
   * @param assignedTo The user assigned to a repair item.
   */

  @route("/repairs")
  @get  op listRepairs(@query assignedTo?: string): string;

```

Now go back to `main.tsp` file and add the action you just defined into the agent. After the conversation starters replace the entire block of code with below snippet.

```typespec
namespace RepairServiceAgent{  
  // Uncomment this part to add actions to the agent.
  @service
  @server(global.RepairsAPI.SERVER_URL)
  @actions(global.RepairsAPI.ACTIONS_METADATA)
  namespace RepairServiceActions {
    op listRepairs is global.RepairsAPI.listRepairs;   
  }
}
```
<cc-end-step lab="e01" exercise="1" step="3" />

### Step 4: (Optional) Understand the decorators

This is an optional step but if curious to know what we have defined in the TypeSpec file just read through this step, or if you wish to test the agent right away go to Step 5.
In the TypeSpec files `main.tsp` and `actions.tsp`, you'll find decorators (starting with @), namespaces, models, and other definitions for your agent.

Check this table to understand some of the decorators used in these files 


| Annotation             | Description                                                                                                                                                     |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| @agent             | Defines the namespace (name) and description of the agent                                                                                                       |
| @instructions       | Defines the instructions that prescribe the behaviour of the agent. 8000 characters or less                                                                     |
| @conversationStarter | Defines conversation starters for the agent                                                                                                                     |
| op            | Defines any operation. Either it can be an operation to define agent’s capabilities like *op GraphicArt*, *op CodeInterpreter* etc., or define API operations like **op listRepairs**. |
| @server           | Defines the server endpoint of the API and its name                                                                                                              |
| @capabilities      | When used inside a function, it defines simple adaptive cards with small definitions like a confirmation card for the operation                                  |


<cc-end-step lab="e01" exercise="1" step="4" />

### Step 5: Test your agent

Next step is to test the Repair Service Agent. 

- Select the Agents Toolkit extension's icon, to open the activity bar from within your project.
- In the activity bar of the Agents Toolkit under "LifeCycle" select "Provision". This will build the app package consisting of the generated manifest files and icons and side load the app into the catalog only for you to test. 

!!! tip "Knowledge"
    Here the agents toolkit also helps validate all the definitions provided in the TypeSpec file to ensure accuracy. It also identifies errors to streamline the developer experience.

- Next, open your web browser and navigate to [https://m365.cloud.microsoft/chat](https://m365.cloud.microsoft/chat){target=_blank} to open Copilot app.

!!! note "Help"
    If for any reason you see a "Something went wrong" screen in Copilot app, just refresh the browser.  

- Select the **RepairServiceAgent** from the list of **Agents** available in the Microsoft 365 Copilot interface.
This will take a while and you will be able to see a toaster message showing the progress of the task to provision.

- Select the conversation starter `List repairs` and send the prompt to the chat to initiate conversation with your agent and see check out the response.

!!! tip "Help"
    When prompted to connect the agent to process a query, you’ll usually see this screen just once. To streamline your experience in this lab, select **"Always allow"** when it appears.
    ![Screenshot of the agent in action with the response for the prompt 'List all repairs' showing repairs with pictures.](https://github.com/user-attachments/assets/02400c13-0766-4440-999b-93c88ca45dc7)

- Keep the browser session open for upcoming exercises. 

<cc-end-step lab="e01" exercise="1" step="5" />

## Exercise 2:  Enhance Agent capabilities
Next, you will enhance the agent by adding more operations, enabling responses with Adaptive Cards, and incorporating code interpreter capabilities. Let’s explore each of these enhancements step by step. Go back to the project in VS Code.

### Step 1: Modify agent to add more operations

- Go to file `actions.tsp` and copy paste below snippet just after `listRepairs` operation to add these new operations `createRepair`, `updateRepair` and `deleteRepair`. Here you are also defining the `Repair` item data model.

```typespec
  /**
   * Create a new repair. 
   * When creating a repair, the `id` field is optional and will be generated by the server.
   * The `date` field should be in ISO 8601 format (e.g., "2023-10-01T12:00:00Z").
   * The `image` field should be a valid URL pointing to the image associated with the repair.
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
  @patch  op updateRepair(@body repair: Repair): Repair;

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

- Next, go back to `main.tsp` file and make sure these new operations are also added into the agent's action. Paste the below snippet after the line `op listRepairs is global.RepairsAPI.listRepairs;` inside the `RepairServiceActions` namespace

```typespec
op createRepair is global.RepairsAPI.createRepair;
op updateRepair is global.RepairsAPI.updateRepair;
op deleteRepair is global.RepairsAPI.deleteRepair;   

```
- Also add a new conversation starter for creating a new repair item just after the first conversation start definintion.

```typespec
@conversationStarter(#{
  title: "Create repair",
  text: "Create a new repair titled \"[TO_REPLACE]\" and assign it to me"
})

```

<cc-end-step lab="e01" exercise="2" step="1" />

### Step 2: Add adaptive card to function reference

Next, you will enhance the reference cards or response cards using adaptive cards. Let’s take the `listRepairs` operation and add an adaptive card for the repair item. 

- In the project folder, notice a folder called **adaptiveCards** inside the **appPackage** folder. Create a file `repair.json` in the **adaptiveCards** folder and paste the code snippet as is from below to the file. 

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

- Next, go back to `actions.tsp` file and locate the `listRepairs` operation. Just above the operation definition `@get op listRepairs(@query assignedTo?: string): string;`, paste the card definition using below snippet.

```typespec

  @card( #{ dataPath: "$",  title: "$.title",   url: "$.image", file: "adaptiveCards/repair.json"}) 
  
```

The above card response will be sent by the agent when you ask about a repair item or when agent brings a list of items as its reference.
Continue to add card response for the `createRepair` operation to show what the agent created after the POST operation. 

- Copy paste below snippet just above the code `@post op createRepair(@body repair: Repair): Repair;`

```typespec

   @card( #{ dataPath: "$",  title: "$.title",   url: "$.image", file: "adaptiveCards/repair.json"}) 

```

<cc-end-step lab="e01" exercise="2" step="2" />

## Step 3:  Add code interpreter capabilities

Declarative Agents can be extended to have many capabilities like *OneDriveAndSharePoint*, *WebSearch*, *CodeInterpreter*, etc.
Next, you will enhance the agent by adding code interpreter capability to it.

- To do this, open the `main.tsp` file and locate the `RepairServiceAgent` namespace.

- Within this namespace, insert the following snippet to define a new operation that enables the agent to interpret and execute code.

```typespec
  op codeInterpreter is AgentCapabilities.CodeInterpreter;
```

!!! tip
    When you add above *Codeinterpreter* operation, paste it inside the outer `RepairServiceAgent` namespace and not the `RepairServiceActions` namespace which defines the action of the agent.  

Since the agent now supports additional functionality, update the instructions accordingly to reflect this enhancement.

- In the same `main.tsp` file, update instructions definition to have additional directives for the agent.

```typespec
@instructions("""
  ## Purpose
You will assist the user in finding car repair records based on the information provided by the user. When asked to display a report, you will use the code interpreter to generate a report based on the data you have.

  ## Guidelines
- You are a repair service agent.
- You can use the code interpreter to generate reports based on the data you have.
- You can use the actions to create, update, and delete repairs.
- When creating a repair item, if the user did not provide a description or date , use title as description and put todays date in format YYYY-MM-DD
- Do not show any code or technical details to the user. 
- Do not use any technical jargon or complex terms.

""")

```

<cc-end-step lab="e01" exercise="2" step="3" />

### Step 4:  Provision and Test the Agent

Let’s take the updated agent who is also now a repairs analyst to test. 

- Select the Agents Toolkit's extension icon to open its activity bar from within your project.
- In the activity bar of the toolkit under "LifeCycle" select "Provision" to package and upload the newly updated agent for testing. 
- Next, go back to the open browser session and do a refresh. 
- Select the **RepairServiceAgent** from the list under **Agents**.
- Start by using the conversation starter 'Create repair'. Replace parts of the prompt to add a title, then send it to the chat to initiate the interaction. For example:

    `Create a new repair titled "rear camera issue" and assign it to me.`

- The confirmation dialog if you notice has more metadata that what you sent, thanks to the new instructions. 

![The confirmation message provided by Microsoft 365 Copilot when sending a POST request to the target API. There are buttons to 'Confirm' or to 'Cancel' sending the request to the API.](https://github.com/user-attachments/assets/56629979-b1e5-4a03-a413-0bb8bb438f00)
 
 - Proceed to add the item by confirming the dialog.

 The agent responds with the created item shown in a rich adaptive card.

 ![The response after creating a new item, with the information about the item to repair rendered through an adaptive card with a button to show the associated image.](https://github.com/user-attachments/assets/6da0a38f-5de3-485a-999e-c695389853f8)

 - Next, re-check reference cards work. Send below prompt in the conversation:

     `List all my repairs.`

The agent will respond with the list of repairs, with each item referenced with an adaptive card.

![The response for the list of repairs with a reference button for each item, showing an adaptive card when hoovering on it.](https://github.com/user-attachments/assets/880ad3aa-2ed3-4051-a68b-d988527d9d53)

- Next, you will test the new analytical capability of your agent. Open a new chat by selecting the **New chat** button on the top right corner of your agent.
- Next, copy the prompt below and paste it to the message box and hit enter to send it.

    `Classify repair items based on title into three distinct categories: Routine Maintenance, Critical, and Low Priority. Then, generate a pie chart displaying the percentage representation of each category. Use unique colours for each group and incorporate tooltips to show the precise values for each segment.`

You should get some response similar to below screen. It may vary sometimes. 

![The response when using the Code Interpreter capability. There are a detailed text and a chart showing the percentage representation of each category of repair.](https://github.com/user-attachments/assets/ea1a5b21-bc57-4ed8-a8a4-c187caff2c64)

<cc-end-step lab="e01" exercise="2" step="3" />

## Exercise 3: Diagnosing and Debugging Agent

You can enable developer mode in a chat to allow you as a developer to understand how well the agent understands the tasks, ensure it calls your services appropriately, identify areas that need fine-tuning, detect performance issues, and generally help you track and analyse its interactions.

### Step 1:   Agent debugging in the chat

- Copy and paste the following line into the chat with your agent to enable debugging mode.

    ```
    -developer on
    ```

- The agent will respond with a success message if everything went well `Successfully enabled developer mode.`

- Next to test, send a prompt to interact with the agent like the one below.

   `Find out what Karin is working on.`

- You will get a response with information from the repair service but also get the **Agent debug info** card along with the response.
- Expand the **Agent debug info** card to view all the details.
- You will be able to see: 
    -	Agent information 1️⃣
    -	Capabilities of the agent 2️⃣
    -	Actions and what function were selected 3️⃣
    -	Executed action info with detailed information about the request, latency, response data, etc. 4️⃣

![The developer debug information card in Microsoft 365 Copilot when analysing the request for an action. There are sections about agent info, capabilities, actions, connected agents, execution, etc.](https://github.com/user-attachments/assets/b135f3b0-50f1-47a1-b608-a5a1b27b806e)

- Try expanding the **Executed Actions** and you will see the request url, parameters passed, request header, response, latency, etc. 

<cc-end-step lab="e01" exercise="3" step="1" />

---8<--- "e-congratulations.md"

Great job on building your first agent 🎉 

 Proceed to create, build, and integrate an API selecting **Next**.
 <cc-next url="../02-build-the-api" label="Next" />

If you still want to keep exploring the fundamentals by building a game called Geolocator game, select below **Create a game**
 <cc-next url="../01a-geolocator" label="Create a game" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/01-typespec-declarative-agent" />
