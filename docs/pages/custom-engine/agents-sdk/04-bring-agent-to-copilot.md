# Lab MBA4 - Bring your agent to Copilot Chat

In this final lab, you’ll bring your custom engine agent into Copilot Chat by updating the agent's manifest. By enabling copilotAgents in the app manifest, you’ll make your AI-powered assistant available directly inside the Copilot experience.

## Exercise 1: Bring your agent to Copilot Chat

### Step 1: Update the manifest

!!!tip "Stop debugging"
    Close the previous debugging session before proceeding with this exercise.

Go to **M365Agent/AppPackage/manifest.json**, update the manifest schema and version as following: 

``` 
"$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.20/MicrosoftTeams.schema.json", 
"manifestVersion": "1.20", 
```

Replace bots section with the following that will also add copilotAgents in the manifest:

> This block declares your agent as a custom engine agent for M365 Copilot. It tells Microsoft 365 to expose this agent in Copilot Chat and surface its command list in the conversation UI along with the conversation starters to help users get started quickly.

```   
  "bots": [ 
    { 
      "botId": "${{BOT_ID}}", 
      "scopes": [ 
        "personal", 
        "team", 
        "groupChat" 
      ], 
      "supportsFiles": false, 
      "isNotificationOnly": false, 
      "commandLists": [ 
        { 
          "scopes": [ "personal", "team", "groupChat" ], 
          "commands": [ 
            { 
              "title": "Emergency and Mental Health",
              "description": "What’s the difference between Northwind Standard and Health Plus when it comes to emergency and mental health coverage?" 
            }, 
            { 
              "title": "PerksPlus Details", 
              "description": "Can I use PerksPlus to pay for both a rock climbing class and a virtual fitness program?" 
            }, 
            { 
              "title": "Contoso Electronics Values", 
              "description": "What values guide behavior and decision making at Contoso Electronics?" 
            } 
          ] 
        } 
      ] 
    } 
  ], 
  "copilotAgents": { 
    "customEngineAgents": [ 
      { 
        "id": "${{BOT_ID}}", 
        "type": "bot" 
      } 
    ] 
  }, 
```

Hit **Start** or **F5** to start debugging. Microsoft Teams will launch automatically. When Microsoft Teams open in your browser, ignore the app pop-up and select **Apps > Manage your apps > Upload an app**. In the File Explorer go to your project folder `...\ContosoHRAgent\M365Agent\appPackage\build` select **appPackage.local**.

![Upload app](https://github.com/user-attachments/assets/5fad723f-b087-4481-8c8c-d5ad87c1bead)

Your app will pop-up on Teams again, select **Add**. This time there will be an option to **Open with Copilot**, select **Open with Copilot** to test your agent on Copilot.

![Copilot option](https://github.com/user-attachments/assets/97f9d9fd-bd90-48b5-983b-b1fea3f85721)

Select your **ContosoHRAgentlocal** from the list of agents in Copilot Chat. You can select one of the conversation starters to chat with your agent.

![agent on Copilot](https://github.com/user-attachments/assets/2aab299c-23ff-4369-a42c-bd74c66f854d)

Observe that your agent responds back with a similar behavior on Copilot Chat.

![image](https://github.com/user-attachments/assets/4211f43d-8aef-4262-95e3-1efac7dba495)

---8<--- "b-congratulations.md"

🎉 Congratulations! You've just built your first Custom Engine Agent using the Microsoft 365 Agents SDK and Azure AI Foundry!

In this lab, you learned how to:

* Configure an AI agent in Azure AI Foundry using the Agent Playground
* Upload enterprise documents to ground your agent’s responses
* Scaffold a bot using the M365 Agents SDK in Visual Studio
* Add Semantic Kernel and connect to Azure AI Agent Service
* Integrate your bot with the Azure AI Foundry agent for real-time, grounded reasoning
* Deploy and test your agent in **Microsoft Teams** and **Copilot Chat**

## Resources

- [Copilot Developer Camp](https://aka.ms/copilotdevcamp)
- [M365 Agents SDK docs](https://aka.ms/open-hack/m365agentssdk)
- [Azure AI Foundry](https://ai.azure.com)
- [Learn more about Copilot extensibility](https://aka.ms/extensibility-docs)

<cc-next label="Home" url="/" />

<cc-award path="Build" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/04-bring-agent-to-copilot" />