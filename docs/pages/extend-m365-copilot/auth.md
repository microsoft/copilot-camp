# Shortcut to Declarative Agent Authentication

Do you already know how to build a declarative agent and API plugin, and want to learn how to secure your API? Well you've come to the right place! You can skip the regular labs (E1-E5) and jump right to your choice of DA Authentication lab!

Begin by completing [Lab E0](../extend-m365-copilot/00-prerequisites.md) to get up your development environment.
Then choose an auth lab from these choices:

<hr />
### Lab E6a - Add OAuth authentication with Teams Toolkit

In this lab, the student:

  - adds Teams Toolkit directives to register an Entra ID application
  - updates the app packaging so Copilot uses OAuth when calling the API
  - updates the code to validate the access token
  - tests the declarative agent

Test procedure:
    
  1. copy the [Lab E5 solution files](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) to a folder on your computer
  - open in VS Code such that the solution is at the root of your open folder (you should see **.vscode**, **appPackage**, etc. at the root level)
  - copy **/env/.env.local.sample** to **/env/.env.local** and change the SHAREPOINT_DOCS_URL to a valid SharePoint site URL in your tenant (if you want all the features to work, upload the contents of the **sampleDocs** folder to this SharePoint location)
  - copy **/env/.env.local.user.sample** to **/env/.env.local.user**
  - (optional) edit **/appPackage/trey-declarative-agent.json** and rename the agent so you know which instance you're testing
  - press F5. You should get a declarative agent for Trey Research.
  - click the green button to open the instructions
  <cc-next url="../06a-add-authentication-ttk" label="Lab E6a - OAuth with Teams Toolkit"/>
 
<hr />
### Lab E6b - Add OAuth authentication with Manual Setup

In this lab, the student:

  - registers an app with Entra ID and configures it to work with Copilot
  - registers the app in the Teams Developer Portal "vault" so Copilot can access secure Entra ID information such as the client secret
  - updates the app packaging so Copilot uses OAuth when calling the API
  - updates the code to validate the access token
  - tests the declarative agent

Test procedure:
    
  1. copy the [Lab E5 solution files](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) to a folder on your computer
  - open in VS Code such that the solution is at the root of your open folder (you should see **.vscode**, **appPackage**, etc. at the root level)
  - copy **/env/.env.local.sample** to **/env/.env.local** and change the SHAREPOINT_DOCS_URL to a valid SharePoint site URL in your tenant (if you want all the features to work, upload the contents of the **sampleDocs** folder to this SharePoint location)
  - copy **/env/.env.local.user.sample** to **/env/.env.local.user**
  - (optional) edit **/appPackage/trey-declarative-agent.json** and rename the agent so you know which instance you're testing
  - press F5. You should get a declarative agent for Trey Research.
  - click the green button to open the instructions
  <cc-next url="../06b-add-authentication" label="Lab E6b - OAuth with Manual Setup"/>

<hr />
## Lab E6c - Add Single Sign-on authentication

In this lab, the student:

  - registers an app with Entra ID and configures it to work with Single Sign-on in Copilot
  - registers the app in the Teams Developer Portal "vault"
  - udates the app packaging for SSO
  - updates the code to validate the access token
  - tests the declarative agent

Test procedure:

  1. copy the [Lab E5 solution files](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) to a folder on your computer
  - open in VS Code such that the solution is at the root of your open folder (you should see **.vscode**, **appPackage**, etc. at the root level)
  - copy **/env/.env.local** to **/env/.env.local** and change the SHAREPOINT_DOCS_URL to a valid SharePoint site URL in your tenant (if you want all the features to work, upload the contents of the **sampleDocs** folder to this SharePoint location)
  - copy **/env/.env.local.user.sample** to **/env/.env.local.user**
  - (optional) edit **/appPackage/trey-declarative-agent.json** and rename the agent so you know which instance you're testing
  - press F5. You should get a declarative agent for Trey Research.
  - click the green button to open the instructions 
    <cc-next url="../06c-add-sso" label="Lab E6c - Single Sign-on"/>

