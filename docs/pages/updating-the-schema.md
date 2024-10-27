# Updating the Manifest schema

If you began any of the "Extend" path labs prior to October 27, 2024, you may be using a developer preview schema. A new, supported schema, v1.19, is now available and all preview applications need to update. The new schema also reflects the new Copilot agent naming.

To update your project, open the **appPackage/manifest.json** file.

First, replace the first two lines with these:

~~~json
  "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.19/MicrosoftTeams.schema.json",
  "manifestVersion": "1.19",
~~~

Then replace the `copilotExtensions` property with this:

~~~json
  "copilotAgents": {
    "declarativeAgents": [
      {
        "id": "treygenie",
        "file": "trey-declarative-agent.json"
      }
    ]   
  }, 
~~~

Finally, rename **trey-declarative-copilot.json** to **trey-declarative-agent.json** to match the lab instructions.