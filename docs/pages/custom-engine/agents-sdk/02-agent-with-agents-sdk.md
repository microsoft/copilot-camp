# Lab BMA2 - Build your first agent using M365 Agents SDK

<div data-widget="hero"
     data-badge="Path 1 · Lab BMA2"
     data-badge-color="teal"
     data-icon="🛠️"
     data-subtitle="Scaffold a Microsoft 365 Agents SDK project in Visual Studio and run it locally, so you understand the host before you plug in the AI."
     data-time="15-20 min"
     data-requires="Lab BMA1 completed"></div>

In Lab BMA1 you built an agent that lives in Microsoft Foundry. Now you'll build the other half: the **host** that delivers it to users.

The Microsoft 365 Agents SDK gives you a production-shaped host — activity routing, conversation state, streaming, and channel delivery to Microsoft Teams and Microsoft 365 Copilot. You'll start from the simplest possible agent so the plumbing is obvious, then add the AI in Lab BMA3.

## Lab objectives

By the end of this lab you will be able to:

- Scaffold a Microsoft 365 Agents SDK project in Visual Studio
- Explain how activities, handlers, and conversation state fit together
- Run and test an agent locally in the Microsoft 365 Agents Playground

---

## Exercise 1: Scaffold and explore the project

### Step 1: Create the project

1. Open **Visual Studio 2022** and select **Create a new project**.
1. Search for and select the **Microsoft 365 Agents** template.
1. Name the project `ContosoHRAgent` and select **Create**.
1. From the list of templates, select **Echo Bot**, then select **Create**.

> An **Echo Bot** simply repeats back whatever the user sends. That's deliberate — it lets you verify the host, the local runtime, and the debugging loop before any model is involved.

<cc-end-step lab="bma2" exercise="1" step="1" />

### Step 2: Explore what was generated

In **Solution Explorer**, expand the **ContosoHRAgent** project and open these two files:

| File | What it does |
|---|---|
| **Program.cs** | Configures and runs the web host. Registers authentication, routing, storage, and the agent itself, and maps the `/api/messages` endpoint that every channel posts to. |
| **Bot/EchoBot.cs** | The agent. It greets users when they join the conversation and handles every incoming message activity. |

Look specifically at the constructor in `EchoBot.cs`:

- `OnConversationUpdate(ConversationUpdateEvents.MembersAdded, ...)` runs when someone joins the conversation.
- `OnActivity(ActivityTypes.Message, ...)` runs for every user message.

These two handlers are the extension points you'll replace in Lab BMA3.

<cc-end-step lab="bma2" exercise="1" step="2" />

---

## Exercise 2: Run and test locally

### Step 1: Start a debugging session

Select **Start** or press **F5**. The **Microsoft 365 Agents Playground** launches on localhost automatically.

> If Visual Studio asks you to trust a self-issued SSL certificate for local development, accept it and continue.

<cc-end-step lab="bma2" exercise="2" step="1" />

### Step 2: Verify the agent responds

Wait for the agent's **"Hello and Welcome!"** greeting, then send a few messages such as `Hi` or `Hello`.

**Expected result:**

- The agent echoes your message back, prefixed with a running message count.
- The right-hand panel shows the raw activity history for each turn.

The message counter proves conversation state is working — the same mechanism you'll use in Lab BMA3 to remember which Foundry conversation belongs to which chat.

Stop the debugging session before moving on.

!!! tip "Reference solution"
    A completed version of this lab is available at [`src/agents-sdk/BMA2-complete`](https://github.com/microsoft/copilot-camp/tree/main/src/agents-sdk/BMA2-complete){target=_blank} if you want to compare against your own project.

<cc-end-step lab="bma2" exercise="2" step="2" />

---8<--- "b-congratulations.md"

You have completed Lab BMA2 - Build your first agent using M365 Agents SDK!

You now have a working host and a working Foundry agent. Next, you'll connect them with Microsoft Agent Framework.

<cc-next url="../03-agent-configuration" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/02-agent-with-agents-sdk" />
