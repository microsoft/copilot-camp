# Integrate with Microsoft 365 Copilot

In this series of labs and articles, you can learn how to connect agents, how to integrate external tools and data sources, and how to consume Copilot API. Overall, you can understand how to create Microsoft 365 Copilot agents using modern integration patterns.

## Understanding Connected Agents

Connected Agents enable Microsoft 365 Copilot agents to extend their capabilities by integrating with other agents. This allows to delegate specialized tasks to other agents that have domain-specific expertise or access to external systems. This approach allows to create multi-agent architectures.

Multi-agent architecture is based on the principle of **modularity and specialization**. Instead of building a single monolithic agent that handles every possible scenario, you break complex problems into multiple specialized agents, each focused on a specific domain or task. This approach improves **scalability**, **manageability**, and **maintainability** of your AI solutions.

The core philosophy follows these principles:

- **Single Responsibility**: Each agent focuses on one domain or task, making it easier to develop, test, and maintain
- **Delegation**: A main (orchestrator) agent identifies when to hand off tasks to specialized agents based on user intent
- **Reusability**: Specialized agents can be shared across multiple solutions, creating a library of capabilities
- **Separation of Concerns**: Different teams can own different agents with their own governance, security, and deployment lifecycles

Connected Agents can be leveraged in all the different flavours of agents like Microsoft Copilot Studio Agents, Declarative Agents, or Custom Engine Agents.

## Understanding MCP (Model Context Protocol)

MCP is a new open-source standard protocol that allows AI assistants to securely connect to external data sources and tools. Think of MCP as a "universal plug" that lets AI models connect to tools, apps, and data—just like USB-C connects your smartphone to anything else. MCP helps AI agents do more (like calling APIs, reading files, sending messages, writing data, etc.) without needing custom code for each task.

With MCP, developers save time and make AI solutions more powerful, flexible, and easier to maintain.

### MCP Architecture

The following diagram illustrates the high-level architecture of MCP:

![The general architecture of MCP (Model Context Protocol). There is a MCP Host on the left side, which leverages a LLM/Orchestrator to consume MCP via a MCP client. On the right side there are MCP servers offering tools, resources, and prompts. The communication happens over STDIO or HTTP and can be secured with variout technologies.](../../assets/images/MCP-Architecture.png)

The architecture defines the following key components:

- **MCP Host**: The AI application that coordinates and manages one or multiple MCP clients
- **MCP Client**: A component that maintains a connection to an MCP server and obtains context from an MCP server for the MCP host to use
- **MCP Server**: A program that provides context to MCP clients

### What MCP Servers Can Expose

Every MCP Server can expose three types of capabilities:

- **Tools**: Functions that your LLM can actively call and decides when to use them based on user requests. Tools can write to databases, call external APIs, modify files, or trigger any other logic.
- **Resources**: Passive data sources that provide read-only access to information for context, such as file contents, database schemas, API documentation, etc.
- **Prompts**: Pre-built instruction templates that tell the model to work with specific tools and resources.

### Communication Protocols

The communication between an MCP Client and the corresponding MCP Server relies on two available protocols:

- **stdio (local)**: for MCP Servers running locally on your environment
- **Streamable HTTP (remote)**: for MCP Servers publicly available, such as those deployed to Azure

Regardless of the transport protocol, the communication relies on JSON-RPC 2.0 messages and can be accessed anonymously or secured over HTTPS with API Keys or OAuth 2.0.

### Learn More

You can learn more about MCP by exploring the [Model Context Protocol (MCP) for beginners](https://github.com/microsoft/mcp-for-beginners) training class.

## Understanding Copilot API

Copilot API provide programmatic access to Copilot's powerful AI capabilities, enabling developers to build custom experiences, automate workflows, and integrate Copilot into their applications. Unlike declarative approaches, the Copilot API give you fine-grained control over conversations, context, and user interactions.

The API available are:

- Retrieval API
- Search API (preview)
- Interaction Export API
- Change Notifications API (preview)
- Meeting Insights API (preview)
- Chat API (preview)

### Learn More

You can learn more about Copilot APIs by exploring the [Microsoft 365 Copilot APIs overview](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-apis-overview) documentation.

---

## Choose Your Integration Path

Below are various labs to integrate your agents for Microsoft 365 Copilot with external agents, platforms, and systems. Choose the labs that best fit your scenario and needs:

- Microsoft Copilot Studio
    - [Lab MCS6 - Consuming an MCP Server](../make/copilot-studio/06-mcp)
    - [Lab MCS8 - Integrating Azure AI Search for RAG](../make/copilot-studio/08-rag)
    - [Lab MCS9 - Connected Agents](../make/copilot-studio/09-connected-agents)
    - [Lab MCS10 - Consuming an MCP Server with OAuth 2.0](../make/copilot-studio/10-mcp-oauth)
- Declarative Agents
    - [Lab E08 - Connect Declarative agent to MCP Server](../extend-m365-copilot/08-mcp-server)
    - [Lab E09 - Connected Agents - Zava's Multi-Agent Claims Orchestration](../extend-m365-copilot/09-connected-agent)
    - [Lab E10 - Connect Declarative Agent to OAuth-Protected MCP Server](../extend-m365-copilot/10-mcp-auth)
- Custom Engine Agents
    - [Lab BAF06 - Add Copilot Retrieval API Integration](../custom-engine/agent-framework/06-add-copilot-api)
    - [Lab BAF07 - Add MCP Tools Integration](../custom-engine/agent-framework/07-add-mcp-tools)


<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/integrate/index" />
