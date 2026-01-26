
# Build Custom Engine Agents

**Custom engine agents** are a type of agent for Microsoft 365 Copilot that give you full control. Unlike declarative agents, which rely on Microsoft 365 Copilot's model and orchestration, custom engine agents let you bring your own foundation model, orchestrator, and security stack. This approach is ideal when you need to tailor the agent's behavior, data access, or reasoning logic to fit specific requirements or infrastructure.

![Custom engine agent architecture diagram. At the very basis you can have any foundational model of your choice. Also the orchestrator is completely customizable. Knowledge, skills, and autonomous capabilities can be implemented with custom code, relying on external SDKs and libraries. The user experience can be in Microsoft 365 Copilot, in Microsoft Teams, or any other supported channel.](../../assets/images/m365-custom-engine-agent.png)

## What you're going to do

In the Build Path of the Copilot Developer Camp, you will dive deeper into building custom engine agents that integrate with Microsoft 365 Copilot.

You'll create a cross-channel custom engine agent using C# and the **Microsoft 365 Agents SDK** that supports Microsoft Teams, Microsoft 365 Copilot, and external channels, offering full control over the orchestration layer.

## Choose Your Learning Path

We offer two hands-on learning paths to build custom engine agents. Choose the one that matches your scenario and interests:

### Option 1: [Start with Microsoft Foundry](./agents-sdk/)

This journey begins in **Microsoft Foundry**, where you'll define your agent's core instructions, tools, and personality. From there, you'll use the Microsoft 365 Agents SDK and Visual Studio to bring your agent to life, customizing its behaviors and integrating it with Semantic Kernel for orchestration. You'll then test your agent in Microsoft Teams, bring it into Copilot Chat, and see it come to life across Microsoft 365 applications.

**Best for:** Developers who want to start with Microsoft Foundry and use Semantic Kernel for multi-step reasoning

**You'll build:** A custom engine agent with intent handling, planner integration, and system message configuration that runs across Microsoft 365

### Option 2: [Start with Agent Framework](./agent-framework/)

Build an AI-powered assistant for insurance claims processing from the ground up. You'll start with a basic conversational agent and progressively enhance it with real-world capabilities like document search, semantic policy lookup, multi-modal vision analysis, and secure authentication. Each lab builds on the previous one using a Build-A-Feature approach.

**Best for:** Developers who want hands-on experience building production-ready agents with the Agent Framework

**You'll build:** A complete insurance claims assistant that integrates Azure AI Search, vision models, SharePoint, Microsoft Graph, and MCP tools

---8<--- "b-labs-branches.md"

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/index" />