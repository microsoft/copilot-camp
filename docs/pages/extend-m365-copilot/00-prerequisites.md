---
title: Prerequisites for Pro-code bundles
---

<div data-widget="hero"
     data-badge-color="amber"
     data-icon="🔧"
     data-title="Prerequisites for Pro-code bundles"
     data-subtitle="Install every tool, understand the core concepts, and see exactly what each bundle will build — before writing a single line of code."
     data-time="45–60 min"
     data-requires="M365 admin account required"
     data-toolkit="Windows / Mac / Linux"></div>


## Key concepts before you build

Few concepts appear across every bundle. Read this once — it will save hours of confusion later.

<div data-widget="concepts"
     data-cards="Microsoft 365 Copilot::blue::The AI host::The LLM and orchestration layer built by Microsoft. It decides when to call your agent, routes the conversation, and renders responses. You don't build this — you extend it.||Declarative Agent::purple::Your custom Copilot persona::Three JSON/text files that give Copilot a specialist identity: a name, custom instructions, and a list of tools it can call. Copilot provides the AI; you provide the purpose and the data.||MCP — Model Context Protocol::teal::The tool connector::An open standard for wiring AI agents to external data and actions. Your MCP server exposes named, typed functions. The agent calls them by name — you never write routing logic.||API Plugin::green::The tool manifest::A generated &lt;code&gt;ai-plugin.json&lt;/code&gt; file that tells your agent which tools exist, what their parameters are, and where to call them. Bundles A &amp; B use MCP tools; Bundles C &amp; D use REST API tools — both are wired through this file.||Azurite::amber::Local Azure Storage emulator::Azurite simulates Azure Storage locally so you can run and test storage-dependent labs without provisioning cloud storage first.||Dev Tunnel::coral::Public URL to localhost::Dev Tunnel gives your local server a secure public HTTPS endpoint so cloud-hosted Copilot can reach tools running on your machine."></div>


---

## How each bundle works

Pick the bundle that matches your scenario. Each diagram shows exactly what you will wire together and what extra prerequisites you need.

Complete this lab after E1A or E1B and before you start any bundle.

<div data-widget="checklist"
     data-title="Common prerequisites (Installed from E1B foundation lab)"
     data-variant="soft"
     data-items="Global Admin access in your M365 tenant~Required to configure tenant-wide app and policy settings|Complete one foundation path (E1A or E1B)~Required before this bundle-readiness lab|VS Code with Microsoft 365 Agents Toolkit~Sign in with your M365 developer account|Node.js 22 LTS and Git installed~Baseline tooling for all bundle workflows"></div>

<div data-widget="checklist"
     data-title="Common prerequisites for MCP bundles (A, B, and C)"
     data-variant="soft"
     data-items="GitHub account~Needed for Dev Tunnels sign-in|Azurite installed globally~Local Azure Table Storage emulator|MCP Inspector installed globally~Inspect and debug MCP tool wiring"></div>

### Bundle A — MCP Foundations

Stand up a real MCP server locally, wire a Declarative Agent to it via a Dev Tunnel, then secure it with OAuth.

<div data-widget="arch"
     data-rows="row::Microsoft 365 Copilot::copilot::Receives user query → calls your agent|Declarative Agent::agent::declarativeAgent.json + instruction.txt||label::reads ai-plugin.json → calls MCP tools over HTTPS via Dev Tunnel||row::Dev Tunnel::tunnel::Public HTTPS ↔ localhost:3001|MCP Server (Node.js)::mcp::15 claims tools · runs on your machine|Azurite::data::Local Azure Table Storage ·"></div>

<div data-widget="checklist"
     data-title="Extra prerequisites for Bundle A"
     data-variant="soft"
     data-items="Azure account (free tier OK) – required only for the Entra ID app registration step in Lab E10. No paid Azure subscription is needed."></div>

### Bundle B — MCP Advanced

Build on Bundle A's MCP server to add connected agents and embedded knowledge for multi-agent orchestration.

<div data-widget="arch"
     data-rows="row::Microsoft 365 Copilot::copilot::Orchestrates the conversation|Declarative Agent::agent::Orchestrator · routes to connected agents||label::Connected agents coordinate via MCP; MCP apps/tools can return rich widget-based responses||row::Dev Tunnel::tunnel::Public HTTPS ↔ localhost:3001|MCP Server (Node.js)::mcp::Claims tools from Bundle A|Connected Agent::agent::Handles delegated sub-tasks|MCP App + Tools::teal::Rich widget-based tool experiences"></div>


### Bundle C — MCP App

Build an MCP-powered app surface with interactive widgets so tool results render as rich UI in Copilot conversations.

<div data-widget="arch"
     data-rows="row::Microsoft 365 Copilot::copilot::Renders interactive MCP app responses|Declarative Agent::agent::Routes tool calls and responses||label::MCP app tools return structured output mapped to React + Fluent UI widgets||row::MCP App Server (Node.js)::mcp::Tool handlers + widget mappings|React + Fluent UI Widgets::teal::Interactive UI in Copilot conversation"></div>



### Bundle D — API-Based Declarative Agent

Build a REST API backed by Azure Functions, then wire a Declarative Agent to it as an API plugin.

<div data-widget="arch"
     data-rows="row::Microsoft 365 Copilot::copilot::Calls your API plugin|Declarative Agent::agent::declarativeAgent.json + ai-plugin.json||label::API plugin calls Azure Functions endpoints over REST||row::Azure Functions (TypeScript)::mcp::HTTP endpoints · runs locally on port 7071|Azurite::data::Local Table Storage · consultant &amp; project data"></div>

<div data-widget="checklist"
     data-title="Extra prerequisites for Bundle D"
     data-variant="soft"
     data-items="Azure Functions Core Tools v4~Run and debug Functions locally|REST Client VS Code extension~Test local API endpoints quickly"></div>

### Bundle E — DA with Connectors

Build a Declarative Agent that queries your own external data indexed into Microsoft Graph via a Copilot Connector.

<div data-widget="arch"
     data-rows="row::Microsoft 365 Copilot::copilot::Queries via Copilot Connector|Declarative Agent::agent::declarativeAgent.json + connector config||label::connector pushes external data into Microsoft Graph||row::Copilot Connector (Node.js)::tunnel::Indexes your data · runs locally|Microsoft Graph::data::Stores and serves connector items to Copilot"></div>


---
## Exercise 1: Verify extra prerequisites installed

| Tool | Version needed | Used in | Download |
|---|---|---|---|
| **GitHub account** | Free | Bundles A & B — Dev Tunnels | [github.com/join](https://github.com/join) |
| **Azure Functions Core Tools** | v4 | Bundles C & D | [learn.microsoft.com](https://learn.microsoft.com/azure/azure-functions/functions-run-local) |
| **REST Client (VS Code extension)** | Latest | Bundle D | VS Code Extensions panel |
| **Azure subscription** | Free tier OK | Bundle A — Lab E10 only | [azure.microsoft.com/free](https://azure.microsoft.com/free) |


Open a terminal and run these checks. Every one should pass before you proceed.

<div data-widget="verify"
     data-label="Azurite — Bundles A, B, and C"
     data-cmd="npm install -g azurite\nazurite --version\n# Expected: 3.x.x"></div>

<div data-widget="verify"
     data-label="MCP Inspector — Bundles A and B"
     data-cmd="npm install -g @modelcontextprotocol/inspector\n# No version command — install succeeding without errors is the check"></div>

<div data-widget="callout"
     data-type="tip"
     data-title="Windows users: run terminal as Administrator"
     data-body="Global npm installs on Windows sometimes need elevated permissions. Right-click the terminal icon and select &quot;Run as Administrator&quot; if you see EACCES or permission errors."></div>


---

## Exercise 2: Verify port forwarding with your first Dev Tunnel

Use this exercise to confirm your machine can expose a local port through a public Dev Tunnel URL.

Success criteria:

- Port `3001` is forwarded in VS Code.
- Visibility is set to **Public**.
- You can copy a valid `https://...use.devtunnels.ms` URL.


<div data-widget="step" data-n="1" data-title="Forward port 3001"></div>

1. In VS Code, open the **Ports** tab (in the terminal panel)
2. Click **Forward a Port**, enter `3001`, and press Enter



<div data-widget="step" data-n="2" data-title="Make it public"></div>

1. Right-click the new port entry → **Port Visibility** → **Public**
2. Sign in with your GitHub account if prompted
3. Copy the forwarded address — it looks like `https://abc123def456.use.devtunnels.ms`

If you reached this point, port forwarding is working correctly, and you can stop tunneling for now.



<div data-widget="labnav"
     data-prev="../01-first-agent-new/"
     data-prev-label="Back to E1 Path Choice"
     data-next="../bundles/"
     data-next-label="Choose Your Bundle"></div>


<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/00-prerequisites" />
