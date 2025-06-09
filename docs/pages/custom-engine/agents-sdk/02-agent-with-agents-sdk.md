# Lab BMA2 - Build your first agent using M365 Agents SDK

This lab introduces you to the Microsoft 365 Agents SDK and Microsoft 365 Agents Toolkit for building enterprise-grade, scalable, multi-channel agents. You'll learn how to create a new agent project with Visual Studio and test it within Test Tool. This experience will demonstrate how to integrate agent capabilities into Microsoft 365 apps and Copilot Chat effectively.

## Exercise 1: Build your first agent using M365 Agents SDK

### Step 1: Create an echo bot using Visual Studio

Now that you’ve seen how to build an agent using Azure AI Foundry, let’s switch gears and explore how to build your own agent locally using the Microsoft 365 Agents SDK. This SDK lets you build multi-channel, production-ready agents that can run in Microsoft Teams, Microsoft 365 Copilot, and other preferred channels.

1. Open Visual Studio 2022 and select **Create a new project**.
1. Search and select **Microsoft 365 Agents**.
1. Provide a name for your agent as `ContosoHRAgent` and select **Create**.  
1. From the list of templates, select **Echo Bot** and select **Create**.
1. When the project template is scaffolded, go to Solution Explorer on the right-side panel and explore the agent template. Expand the **ContosoHRAgent** project.
    - Open **Program.cs**, this code configures and runs the web server that hosts your agent. It sets up required services like authentication, routing, storage and registers the **EchoBot** and injects memory-based state handling.
    - Open **Bot > EchoBot.cs** and observe that this sample sets up a basic AI agent using the **Microsoft.Agents.Builder**. It sends a welcome message when a user joins the chat and listens for any message and echoes it back with a running message count.

You've started with an **Echo Bot**, a simple bot that repeats back any message a user sends. It’s a useful way to verify your setup and understand how conversations are handled behind the scenes.

<cc-end-step lab="bma2" exercise="1" step="1" />

### Step 2: Test your agent in Test Tool

To test your echo agent, hit **Start** or **F5**. This will launch Test Tool automatically in localhost where you can interact with your agent. In case Visual Studio will ask you to confirm the creation of a self-issued SSL certificate to test the application locally, confirm and proceed.

Wait until the agent's message "Hello and Welcome!", then type anything such as “Hi”, “Hello”. Observe that the agent echoes everything back.

![The local Microsoft 365 Agents Playground when testing locally the Echo Bot. On the left side of the screen there is an emulated chat, while on the right side of the screen there is a panel with the history of the interaction between the user and the agent.](https://github.com/user-attachments/assets/4562052d-856b-44d5-b2dd-27623d9bed11)


<cc-end-step lab="bma2" exercise="1" step="2" />

---8<--- "b-congratulations.md"

You have completed Lab BMA2 - Build your first agent using M365 Agents SDK! This simple agent forms the base for more powerful experiences. In the next step, you'll combine this with your Azure AI Foundry agent to enable richer, context-aware answers.

You are now ready to proceed to Lab BMA3 - Integrate Azure AI Foundry Agent with M365 Agents SDK. Select Next.

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/02-agent-with-agents-sdk" />
