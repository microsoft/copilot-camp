# Build the Zava Insurance Agent - Microsoft 365 Agents SDK with Agents Framework

In this learning path, you'll build the **Zava Insurance Agent** - an AI-powered assistant designed to help insurance adjusters streamline claims processing. Using the Microsoft 365 Agents SDK and Agents Framework, you'll create a custom engine agent that runs across Microsoft Teams and Microsoft 365 Copilot.

???+ info "About the Zava Insurance Agent"
    Zava Insurance is a fictional insurance company that needs to help their adjusters quickly process claims, look up policy information, analyze damage photos, and send notifications. You'll build an agent that does all of this using AI, starting simple and progressively adding advanced capabilities through a Build-A-Feature (BAF) approach.

You'll start with a basic conversational agent and progressively enhance it with real-world capabilities like document search, semantic policy lookup, multi-modal vision analysis, and secure authentication.

The Microsoft 365 Agents SDK provides the infrastructure to deploy your agent to Microsoft 365 Copilot and Teams, handling message routing, activities, and channel-specific behaviors. The Agents Framework powers your agent's AI capabilities, including LLM interactions, tool calling, and intelligent decision-making.

<hr />

## What You'll Build

The labs follow a **Build with Agent Framework (BAF)** approach where you progressively enhance your agent with new capabilities:

* [**Lab BAF0**](./00-prerequisites): Prerequisites - Set up your development environment
* [**Lab BAF1**](./01-build-and-run): Build and Run - Create a basic conversational agent with plugins and tools
* [**Lab BAF2**](./02-add-claim-search): Add Claims Search - Integrate Azure AI Search Knowledgebases for intelligent claims lookup
* [**Lab BAF3**](./03-add-vision-analysis): Add Vision Analysis - Enable AI-powered damage photo analysis using Mistral vision model
* [**Lab BAF4**](./04-add-policy-search): Add Policy Search - Implement policy validation and SharePoint document search
* [**Lab BAF5**](./05-add-communication): Add Communication Capabilities - Send professional emails via Microsoft Graph and generate investigation reports
* [**Lab BAF6**](06-add-copilot-api): Add Work IQ API - Rely on content stored in SharePoint Online via Copilot Retrieval API to add RAG to the agent
* [**Lab BAF7**](./07-add-mcp-tools): Add MCP Tools - Enrich the agent with MCP tools provided by an external MCP server

Each lab builds on the previous one, following the pattern: **Services → Plugins → Integration → Testing**

## <a href="./00-prerequisites">Start here</a> with Lab BAF0, where you'll set up your development environment.

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/index" />
