# Trey Research Plugin

> NOTE: This plugin is still Type A; working on Type B packaging

Trey Research is a fictitious consulting company that supplies talent in the software and pharmaceuticals industries.

## Prompts that work

  * what trey research projects is domi assigned to?
  * what trey research clients is avery working with?
  * do we have any trey research consultants with azure certifications?
  * what trey projects are we doing for relecloud?
  * which trey consultants are working with woodgrove bank?
  * in trey research, how many hours has avery delivered this month?
  * does trey research have any architects with javascript skills? (multi-parameter!)
  * what trey research designers are working at woodgrove bank? (multi-parameter!)

## Prompts that we're working on

   * please charge 10 hours to woodgrove bank
   * please add sanjay to the contoso project
   * what trey project leads are have availability this month?
   * what are my current trey research projects?  (assumes Entra ID SSO)
   * how far does avery work from the woodgrove project site?  (can the AI do this or does the service need to calculate it?)

## Planned content

    * Trey Research Assistant - A Copilot GPT to facilitate the use of this plugin
    * Adaptive cards - note the data is ready with images and maps to make the cards look good!
    * We plan to generate sample documents and/or other Microsoft 365 content to show how Copilot can work with both
    * MAYBE a Graph Connector with related data
    * MAYBE a public facing version which only supports limited read-only features such as consultants

## Prerequisites

  * [Visual Studio Code](https://code.visualstudio.com/Download)
  * [NodeJS 18.x](https://nodejs.org/en/download)
  * [Teams Toolkit extension for VS Code](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension)
  * [Teams Toolkit CLI](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/teams-toolkit-cli?pivots=version-three) (`npm install -g @microsoft/teamsapp-cli`)
  * (optional) [Postman](https://www.postman.com/downloads/)

## Setup instructions (one-time setup)

1. Log into Teams Toollkit using any tenant for now, as we will be uploading manually.

1. If your project doesn't yet have a file **env/.env.local.user**, then create one by copying **env/.env.local.user.sample**. If you do have such a file, ensure it includes this line:

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
~~~

## Running the solution (after each build)

1. Press F5 to start the application. Eventually a browser window should open up; this is from the Teams Toolkit API Message Extension we used to start the project. Please minimize the browser window - i.e. leave it running, but don't use it.

1. Log into the target tenant with Teams Toolkit CLI:

    `teamsapp account login m365`

    You can check your login with this command:

    `teamsapp account show`

1. Upload the package using the Teams Toolkit CLI. Run below command while in the root folder of the project:

   `teamsapp m365 install -file-path ./pluginPackage-Local/build/pluginPackage.zip`

1. Wait 15 minutes

1. Go to the Copilot app in Teams and enable your plugin in the plugin panel.

1. Try some of the sample prompts. Use `-developer on` and view the application log to try and understand what's going on. The application log can be viewed under the Debug Console tab by selecting "Attach to Backend" from the dropdown on the top right of the debug console window.


## API Summary

### GET Requests

~~~javascript

 GET /api/me/ - get my consulting profile and projects

GET /api/consultants/ - get all consultants
// Query string params can be used in any combination to filter results
GET /api/projects/?consultantName=Avery - get consultants with names containing "Avery"
GET /api/consultants/?projectName=Foo - get consultants on projects with "Foo" in the name
GET /api/consultants/?skill=Foo - get consultants with "Foo" in their skills list
GET /api/consultants/?certification=Foo - get consultants with "Foo" in their certifications list
GET /api/consultants/?role=Foo - get consultants who can serve the "Foo" role on a project
GET /api/consultants/?availability=x - get consultants with x hours availability this month or next month

~~~
The above requests all return an array of consultant objects, which are defined in the ApiConsultant interface in /model/apiModel.ts.

~~~javascript
GET /api/projects/ - get all projects
// Query string params can be used in any combination to filter results
GET /api/projects/?projectName=Foo - get projects with "Foo" in the name
GET /api/projects/?consultantName=Avery - get projects where a consultant containing "Avery" is assigned

~~~

The above requests all return an array of project objects, which are defined in the ApiProject interface in /model/apiModel.ts.


### POST Requests

~~~javascript
POST /api/me/chargeTime - Add hours to project with "Foo" in the name

Request body:
{
  projectName: "foo",
  hours: 5
}
Response body:
{
    status: 200,
    message: "Charged 3 hours to Woodgrove Bank on project \"Financial data plugin for Microsoft Copilot\". You have 17 hours remaining this month";
}

POST /api/projects/assignConsultant - Add consultant to project with "Foo" in the name
Request body:
{
    projectName: "foo",
    consultantName: "avery",
    role: "architect",
    hours: number
}
Response body:
{
    status: 200
    message: "Added Alice to the \"Financial data plugin for Microsoft Copilot\" project at Woodgrove Bank. She has 100 hours remaining this month.";
}
~~~


## API Design considerations

The process began with a bunch of sample prompts that serve as simple use cases for the service. The API is designed specifically to serve those use cases and likely prompts. In order to make it easier for use in the RAG orchestration, tje service:

    1. Completes each prompt / use case in a single HTTP request
        - accept names or partial names that might be stated in a user prompt rather than requiring IDs which must be looked up
        - return enough information to allow for richer responses; err on the side of providing more detail including related entities
    
    2. Return human readable messages

    3. In GET requests, use the resource that corresponds to the entity the user is asking for. Don't expect Copilot to figure out that some data is buried in another entity.

    4. In POST requests, use a command style such as `/me/chargeTime`, as opposed to asking the API to update a data structure

## Build a message extension from a new API with Azure Functions

This app template allows Teams to interact directly with third-party data, apps, and services, enhancing its capabilities and broadening its range of capabilities. It allows Teams to:

- Retrieve real-time information, for example, latest news coverage on a product launch.
- Retrieve knowledge-based information, for example, my team’s design files in Figma.

## Get started with the template

> **Prerequisites**
>
> To run this app template in your local dev machine, you will need:
>
> - [Node.js](https://nodejs.org/), supported versions: 16, 18
> - A [Microsoft 365 account for development](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts)
> - [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.0.0 and higher or [Teams Toolkit CLI](https://aka.ms/teams-toolkit-cli)

1. First, select the Teams Toolkit icon on the left in the VS Code toolbar.
2. In the Account section, sign in with your [Microsoft 365 account](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts) if you haven't already.
3. Select `Debug in Teams (Edge)` or `Debug in Teams (Chrome)` from the launch configuration dropdown.
4. When Teams launches in the browser, you can navigate to a chat message and [trigger your search commands from compose message area](https://learn.microsoft.com/microsoftteams/platform/messaging-extensions/what-are-messaging-extensions?tabs=dotnet#search-commands).

## What's included in the template

| Folder       | Contents                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| `.vscode`    | VSCode files for debugging                                                                                  |
| `appPackage` | Templates for the Teams application manifest, the API specification and response template for API responses |
| `env`        | Environment files                                                                                           |
| `infra`      | Templates for provisioning Azure resources                                                                  |
| `repair`     | The source code for the repair API                                                                          |

The following files can be customized and demonstrate an example implementation to get you started.

| File                                          | Contents                                                                     |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| `repair/function.json`                        | A configuration file that defines the function’s trigger and other settings. |
| `repair/index.ts`                             | The main file of a function in Azure Functions.                              |
| `appPackage/apiSpecificationFile/repair.yml` | A file that describes the structure and behavior of the repair API.          |
| `appPackage/responseTemplates/repair.json`    | A generated Adaptive Card that used to render API response.                  |
| `repairsData.json`                            | The data source for the repair API                                           |

The following are Teams Toolkit specific project files. You can [visit a complete guide on Github](https://github.com/OfficeDev/TeamsFx/wiki/Teams-Toolkit-Visual-Studio-Code-v5-Guide#overview) to understand how Teams Toolkit works.

| File                 | Contents                                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `teamsapp.yml`       | This is the main Teams Toolkit project file. The project file defines two primary things: Properties and configuration Stage definitions. |
| `teamsapp.local.yml` | This overrides `teamsapp.yml` with actions that enable local execution and debugging.                                                     |

## Addition information and references

- [Extend Teams platform with APIs](https://aka.ms/teamsfx-api-plugin)
