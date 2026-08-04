# Lab BMA4 - Bring your agent to Microsoft 365 Copilot

<div data-widget="hero"
     data-badge="Path 1 · Lab BMA4"
     data-badge-color="green"
     data-icon="🚀"
     data-subtitle="Declare your agent as a custom engine agent in the app manifest and test it inside Microsoft 365 Copilot."
     data-time="15-20 min"
     data-requires="Lab BMA3 completed"></div>

Your agent already runs in Microsoft Teams. Bringing it into Microsoft 365 Copilot is a manifest change, not a code change — you declare the agent as a **custom engine agent** and Microsoft 365 Copilot surfaces it alongside every other agent the user has.

!!! note
    If you want to start directly from this lab without completing the previous ones, you can download the agent's complete source code (as it is at the end of the previous lab) [from here](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/agents-sdk/BMA3-complete&filename=BMA3-complete){target=_blank}. Remember to add your own `AIServices` settings to `appsettings.json` as described in ["Lab BMA3"](../03-agent-configuration).

## Lab objectives

By the end of this lab you will be able to:

- Declare a custom engine agent in the app manifest
- Add conversation starters that help users get going
- Test your agent inside Microsoft 365 Copilot

---

## Exercise 1: Declare the agent for Microsoft 365 Copilot

!!! tip "Stop debugging first"
    Close the previous debugging session before starting this exercise.

### Step 1: Update the manifest schema

Open **M365Agent/appPackage/manifest.json** and update the schema and version:

```json
"$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.22/MicrosoftTeams.schema.json",
"manifestVersion": "1.22",
```

<cc-end-step lab="bma4" exercise="1" step="1" />

### Step 2: Add conversation starters and the copilotAgents block

Replace the `bots` section with the following, which adds a command list and the `copilotAgents` declaration:

```json
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
            "description": "What's the difference between Northwind Standard and Health Plus when it comes to emergency and mental health coverage?"
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

> The `copilotAgents.customEngineAgents` block is what tells Microsoft 365 to expose this agent inside Copilot Chat. The `commandLists` entries become the conversation starters users see before their first message.

<cc-end-step lab="bma4" exercise="1" step="2" />

---

## Exercise 2: Test your agent in Microsoft 365 Copilot

### Step 1: Upload the app package

Select **Start** or press **F5** to begin debugging. When Microsoft Teams opens in your browser, dismiss the app pop-up and instead select **Apps > Manage your apps > Upload an app**, then **Upload a custom app**.

Select `...\ContosoHRAgent\M365Agent\appPackage\build\appPackage.local.zip`.

<cc-end-step lab="bma4" exercise="2" step="1" />

### Step 2: Open the agent in Microsoft 365 Copilot

When the app pop-up appears, select **Add**. This time you'll also see **Open with Copilot** — select it.

Choose **ContosoHRAgentlocal** from the agent list in Microsoft 365 Copilot Chat.

<cc-end-step lab="bma4" exercise="2" step="2" />

### Step 3: Verify the behavior matches

Select one of the conversation starters, then ask a follow-up question.

**Expected result:**

- The conversation starters you defined in the manifest appear before the first message.
- Answers are grounded in your HR documents, exactly as they were in Teams.
- Responses stream in and include the running message count.

<cc-end-step lab="bma4" exercise="2" step="3" />

---8<--- "b-congratulations.md"

🎉 You've built a custom engine agent with the Microsoft 365 Agents SDK, Microsoft Foundry, and Microsoft Agent Framework!

Across this path you learned how to:

* Create and ground an agent in Microsoft Foundry with instructions and File Search
* Scaffold a Microsoft 365 Agents SDK host and test it locally
* Resolve a published Foundry agent as an `AIAgent` with Microsoft Agent Framework
* Stream responses and citations, and persist an `AgentSession` for conversation memory
* Deliver the same agent to **Microsoft Teams** and **Microsoft 365 Copilot**

### Where to go next

Want to build the agent's reasoning and grounding yourself instead of in the portal? Continue with [Path 2 — Start with Agent Framework](../../agent-framework/), where you'll ground an agent with Foundry IQ and the Copilot Retrieval API.

## Resources

- [Copilot Developer Camp](https://aka.ms/copilotdevcamp){target=_blank}
- [Microsoft Agent Framework documentation](https://learn.microsoft.com/agent-framework/){target=_blank}
- [Microsoft 365 Agents SDK documentation](https://aka.ms/open-hack/m365agentssdk){target=_blank}
- [Microsoft Foundry](https://ai.azure.com){target=_blank}
- [Learn more about Microsoft 365 Copilot extensibility](https://aka.ms/extensibility-docs){target=_blank}

<cc-next label="Home" url="/" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/04-bring-agent-to-copilot" />
