<img src="/copilot-camp/assets/images/CopilotCamp-Tent-Clean.png"
     style="height:200px; float:right;"></img>

# Thank you for testing Code Camp!

The key to successful labs is testing; the more people who try it, the more we'll find any missing steps or assumed knowledge.

The following labs are in need of testing. Please send questions and issues to the lab owner, or bring it up in the Copilot Camp Testers chat. If you add [Github issues](https://github.com/microsoft/copilot-camp/issues) or [Pull requests](https://github.com/microsoft/copilot-camp/pulls) please mention or assign the owner.

!!! note "Lab E6a - Add OAuth authentication with Teams Toolkit"
    Owner: Bob German

    In this lab, the student:

     - adds Teams Toolkit directives to register an Entra ID application
     - updates the app packaging so Copilot uses OAuth when calling the API
     - updates the code to validate the access token
     - tests the declarative agent

    To test you will need a tenant with Microsoft 365 Copilot and [Visual Studio Code with Teams Toolkit](https://microsoft.github.io/copilot-camp/pages/extend-m365-copilot/00-prerequisites/). zs

    Test procedure:
    
      - copy the [Lab E5 solution files](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) to a folder on your computer
      - open in VS Code such that the solution is at the root of your open folder (you should see **.vscode**, **appPackage**, etc. at the root level)
      - copy **\env\.env.local** to **\env\.env.local** and change the SHAREPOINT_DOCS_URL to a valid SharePoint site URL in your tenant (if you want all the features to work, upload the contents of the **sampleDocs** folder to this SharePoint location)
      - copy **\env\.env.local.sample** to **\env\.env.local**
      - press F5. You should get a declarative agent for Trey Research.
      - then follow [the Lab 6a instructions](../extend-m365-copilot/06a-add-authentication-ttk.md)
 
!!! note "Lab E6c - Add Single Sign-on authentication"
    Owner: Rabia Wiliams

    In this lab, the student:

     - registers an application in EntraID and the Teams Developer Portal
     - udates the app packaging for SSO
     - updates the code to validate the access token
     - tests the declarative agent

    To test you will need a tenant with Microsoft 365 Copilot and [Visual Studio Code with Teams Toolkit](https://microsoft.github.io/copilot-camp/pages/extend-m365-copilot/00-prerequisites/). zs

    Test procedure:

      - copy the [Lab E5 solution files](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END) to a folder on your computer
      - open in VS Code such that the solution is at the root of your open folder (you should see **.vscode**, **appPackage**, etc. at the root level)
      - copy **\env\.env.local** to **\env\.env.local** and change the SHAREPOINT_DOCS_URL to a valid SharePoint site URL in your tenant (if you want all the features to work, upload the contents of the **sampleDocs** folder to this SharePoint location)
      - press F5. You should get a declarative agent for Trey Research.
      - then follow [the Lab 6c instructions](../extend-m365-copilot/06c-add-sso.md)
 
 # Thank you!

