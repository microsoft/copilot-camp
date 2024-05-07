# Trey Research Plugin

> This is now a proper API Plugin (not Type A)!

Trey Research is a fictitious consulting company that supplies talent in the software and pharmaceuticals industries.
The vision for this demo is to show the full potential of Copilot plugins in a relatable business environment.

### Prompts that work

  * what trey projects am i assigned to?
    (NOTE: Since there is no SSO, the logged in user is hard coded to be consultant Avery Howard)
  * what trey projects is domi working on?
  * do we have any trey consultants with azure certifications?
  * what trey projects are we doing for relecloud?
  * which trey consultants are working with woodgrove bank?
  * in trey research, how many hours has avery delivered this month?
  * please find a trey consultant with python skills who is available immediately
  * are any trey research consultants available who are AWS certified? (multi-parameter!)
  * does trey research have any architects with javascript skills? (multi-parameter!)
  * what trey research designers are working at woodgrove bank? (multi-parameter!)

### Prompts that sometimes work (seems random)

   * please charge 10 hours to woodgrove bank in trey research
     (POST request)
   * please add sanjay to the contoso project for trey research
     (POST request with easy to forget entities, hoping to prompt the user; for now they are defaulted)
   * please find trey consultants from the USA
     (NOTE: There is no query param for country, it's filtering the results itself!)

## Plugin Features

The sample aims to showcase the following plugin features:

  1. √ API based plugin works with any platform that supports REST requests
  1. √ Construct queries for specific data using GET requests
  1. √ Multi-parameter queries
  1. √ Allow updating and adding data using POST requests
  1. √ Prompt users before POSTing data; capture missing parameters
  1. Invoke from Copilot GPT, allowing general instructions and knowledge, and removing the need to name the plugin on every prompt *
  1. Entra ID SSO with /me path support *
  1. Display rich adaptive cards *
  
 \* Not yet supported in Copilot

 \*\* Sometimes works 

## Setup

### Prerequisites

* [Visual Studio Code](https://code.visualstudio.com/Download)
* [NodeJS 18.x](https://nodejs.org/en/download)
* [Teams Toolkit extension for VS Code](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension)
  NOTE: If you want to build new projects of this nature, you'll need Teams Toolkit v5.6.1-alpha.039039fab.0 or newer
* [Teams Toolkit CLI](https://learn.microsoft.com/microsoftteams/platform/toolkit/teams-toolkit-cli?pivots=version-three)
  (`npm install -g @microsoft/teamsapp-cli`)
* (optional) [Postman](https://www.postman.com/downloads/)

### Setup instructions (one-time setup)

1. Log into Teams Toolkit using any tenant for now, as we will be uploading manually.

1. Optional: Obtain a Bing Maps API key. The app works with any string value, but map URLs will be invalid unless you provide a valid API key.

1. If your project doesn't yet have a file **env/.env.local.user**, then create one by copying **env/.env.local.user.sample**. If you do have such a file, ensure it includes these lines:

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
SECRET_BING_MAPS_KEY=xxxxxxxxxxxxxxxxxxxxxxx
~~~

1. OPTIONAL: Copy the files from the **/sampleDocs** folder to OneDrive or SharePoint

### Running the solution (after each build)

1. Press F5 to start the application. Eventually a browser window should open up; this is from the Teams Toolkit API Message Extension we used to start the project. Please minimize the browser window - i.e. leave it running, but don't use it.

2. Wait 15 minutes

3. Go to Copilot; ensure Avalon is enabled with the required flags and settings to run API Plugins

4. Enable the plugin in the Copilot plugin panel. For best results, mention "trey" with each prompt.

### Manual installation (should no longer be needed)

1. Log into the target tenant with Teams Toolkit CLI:

    `teamsapp account login m365`

    You can check your login with this command:

    `teamsapp account show`

1. Upload the package using the Teams Toolkit CLI. Run below command while in the root folder of the project:

   `teamsapp install -file-path ./build/pluginPackage.zip`

1. Wait 15 minutes

1. Go to the Copilot app in Teams and enable your plugin in the plugin panel.

1. Try some of the sample prompts. Use `-developer on` and view the application log to try and understand what's going on. The application log can be viewed under the Debug Console tab by selecting "Attach to Backend" from the dropdown on the top right of the debug console window.

## API Summary

![postman](https://voyager.postman.com/logo/postman-logo-icon-orange.svg) 

We have a [Postman collection](https://documenter.getpostman.com/view/5938178/2sA3JJ8hfn) for you to try out the APIs. 
All API operations are prepared with parameters and body pregenerated to make it easier for you to test our GET and POST calls. 

> Make sure you have [Postman desktop](https://www.postman.com/downloads/) to be able to test urls with `localhost` domain. 
Or simply replace part of the URL `http://localhost:7071` with your tunnel/host URL.


#### GET Requests

~~~javascript

 GET /api/me/ - get my consulting profile and projects

GET /api/consultants/ - get all consultants
// Query string params can be used in any combination to filter results
GET /api/consultants/?consultantName=Avery - get consultants with names containing "Avery"
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

#### POST Requests

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
    forecast: number
}
Response body:
{
    status: 200
    message: "Added Alice to the \"Financial data plugin for Microsoft Copilot\" project at Woodgrove Bank. She has 100 hours remaining this month.";
}
~~~

## API Design considerations

The process began with a bunch of sample prompts that serve as simple use cases for the service. The API is designed specifically to serve those use cases and likely prompts. In order to make it easier for use in the RAG orchestration, the service:

1. Completes each prompt / use case in a single HTTP request

    * accept names or partial names that might be stated in a user prompt rather than requiring IDs which must be looked up
    * return enough information to allow for richer responses; err on the side of providing more detail including related entities

2. Return human readable messages

3. In GET requests, use the resource that corresponds to the entity the user is asking for. Don't expect Copilot to figure out that some data is buried in another entity.

4. In POST requests, use a command style such as `/me/chargeTime`, as opposed to asking the API to update a data structure

5. Don't expect Copilot to filter data; instead provide parameters and filter it server side. (I have seen some filtering by Copilot however - this is for further study)