
# Build Custom Engine Agents

**Custom engine agents** are a type of agent for Microsoft 365 Copilot that give you full control. Unlike declarative agents, which rely on Microsoft 365 Copilot's model and orchestration, custom engine agents let you bring your own foundation model, orchestrator, and security stack. This approach is ideal when you need to tailor the agent's behavior, data access, or reasoning logic to fit specific requirements or infrastructure.

![Custom engine agent architecture diagram. At the very basis you can have any foundational model of your choice. Also the orchestrator is completely customizable. Knowledge, skills, and autonomous capabilities can be implemented with custom code, relying on external SDKs and libraries. The user experience can be in Microsoft 365 Copilot, in Microsoft Teams, or any other supported channel.](../../assets/images/m365-custom-engine-agent.png)

## What you're going to do

In the Build Path of the Copilot Developer Camp, you will dive deeper into building custom engine agents that integrate with Microsoft 365 Copilot.

You'll create a cross-channel custom engine agent using C# and the **Microsoft 365 Agents SDK** that supports Microsoft Teams, Microsoft 365 Copilot, and external channels, offering full control over the orchestration layer.

## Choose Your Learning Path

We offer two hands-on learning paths to build custom engine agents. Choose the one that matches your scenario and interests:

### Option 1: [Microsoft 365 Agents SDK with Semantic Kernel](./agents-sdk/)

Build an agent starting from **Azure AI Foundry**, where you'll define your agent's instructions and tools. Then bring it to life using the Microsoft 365 Agents SDK and Semantic Kernel for orchestration.

**Best for:** Teams who want to start with Azure AI Foundry and use Semantic Kernel for multi-step reasoning

**You'll build:** An agent that starts in Azure AI Foundry and integrates with Teams and Microsoft 365 Copilot

### Option 2: [Microsoft 365 Agents SDK with Agents Framework](./agent-framework/)

Build the **Zava Insurance Agent** using the Microsoft 365 Agents SDK and the Agents Framework. You'll progressively add features through a Build-A-Feature approach, from basic conversation to document search, vision analysis, and authentication.

**Best for:** Teams who want to use the latest Agents Framework (successor to Semantic Kernel and AutoGen) with a progressive, hands-on learning approach

**You'll build:** A complete insurance claims assistant with AI-powered document search, policy lookup, photo analysis, and email notifications

---

---8<--- "b-labs-branches.md"

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/index" />