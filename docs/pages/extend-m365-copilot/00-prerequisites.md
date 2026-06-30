---
title: Lab E0 — Prerequisites & Concepts
---

<div data-widget="hero"
     data-badge="Prerequisites · Lab E0"
     data-badge-color="amber"
     data-icon="🔧"
     data-title="Prerequisites & Concepts"
     data-subtitle="Install every tool, understand the core concepts, and see exactly what each bundle will build — before writing a single line of code."
     data-time="45–60 min"
     data-requires="M365 admin account required"
     data-toolkit="Windows / Mac / Linux"></div>

<div data-widget="checklist"
     data-items="M365 tenant with Copilot licence~Custom app uploads enabled in Teams admin|Node.js 22 LTS~Verified with node -v|VS Code + Agents Toolkit v6.4.2+~Extension signed in to M365|Git installed~For cloning the Copilot Camp repo|GitHub account~Required for Dev Tunnels (Bundles A &amp; B)|Azure subscription~Free tier OK · needed for Lab E10 (Bundle A) only"></div>

---

## Key concepts before you build

Four ideas appear across every bundle. Read this once — it will save hours of confusion later.

<div data-widget="concepts"
     data-cards="Microsoft 365 Copilot::blue::The AI host::The LLM and orchestration layer built by Microsoft. It decides when to call your agent, routes the conversation, and renders responses. You don't build this — you extend it.||Declarative Agent::purple::Your custom Copilot persona::Three JSON/text files that give Copilot a specialist identity: a name, custom instructions, and a list of tools it can call. Copilot provides the AI; you provide the purpose and the data.||MCP — Model Context Protocol::teal::The tool connector::An open standard for wiring AI agents to external data and actions. Your MCP server exposes named, typed functions. The agent calls them by name — you never write routing logic.||API Plugin::green::The tool manifest::A generated &lt;code&gt;ai-plugin.json&lt;/code&gt; file that tells your agent which tools exist, what their parameters are, and where to call them. Bundles A &amp; B use MCP tools; Bundles C &amp; D use REST API tools — both are wired through this file."></div>

<div data-widget="callout"
     data-type="concept"
     data-title="One-line summary"
     data-body="&lt;strong&gt;Microsoft 365 Copilot&lt;/strong&gt; runs the AI. Your &lt;strong&gt;Declarative Agent&lt;/strong&gt; gives it a persona. &lt;strong&gt;MCP or an API plugin&lt;/strong&gt; gives it tools to call. Everything else in the labs is implementation detail."></div>

---

## How each bundle works

Pick the bundle that matches your scenario. Each diagram shows exactly what you will wire together and what extra prerequisites you need.

### Bundle A — MCP Foundations

Stand up a real MCP server locally, wire a Declarative Agent to it via a Dev Tunnel, then secure it with OAuth.

<div data-widget="arch"
     data-rows="row::Microsoft 365 Copilot::copilot::Receives user query → calls your agent|Declarative Agent::agent::declarativeAgent.json + instruction.txt||label::reads ai-plugin.json → calls MCP tools over HTTPS via Dev Tunnel||row::Dev Tunnel::tunnel::Public HTTPS ↔ localhost:3001|MCP Server (Node.js)::mcp::15 claims tools · runs on your machine|Azurite::data::Local Azure Table Storage · port 10002"></div>

<div data-widget="checklist"
     data-title="Extra prerequisites for Bundle A"
     data-variant="soft"
     data-items="GitHub account~Needed for Dev Tunnels|Azurite installed globally~Local Azure Table Storage emulator|MCP Inspector installed globally~Inspect and debug MCP tool wiring|Azure subscription~Free tier OK · needed for Lab E10 Entra ID registration"></div>

### Bundle B — MCP Advanced

Build on Bundle A's MCP server to add connected agents and embedded knowledge for multi-agent orchestration.

<div data-widget="arch"
     data-rows="row::Microsoft 365 Copilot::copilot::Orchestrates the conversation|Declarative Agent::agent::Orchestrator · routes to connected agents||label::Connected agents coordinate via MCP; MCP apps/tools can return rich widget-based responses||row::Dev Tunnel::tunnel::Public HTTPS ↔ localhost:3001|MCP Server (Node.js)::mcp::Claims tools from Bundle A|Connected Agent::agent::Handles delegated sub-tasks|MCP App + Tools::teal::Rich widget-based tool experiences"></div>

<div data-widget="checklist"
     data-title="Extra prerequisites for Bundle B"
     data-variant="soft"
     data-items="GitHub account~Needed for Dev Tunnels|Agents Toolkit pre-release~Required for Embedded Knowledge in Lab E9|Azurite installed globally~Local storage dependency for the MCP path|MCP Inspector installed globally~Inspect and debug MCP tool wiring|Complete Lab E8 first~Bundle B builds on Bundle A's MCP setup"></div>

### Bundle C — API-Based Declarative Agent

Build a REST API backed by Azure Functions, then wire a Declarative Agent to it as an API plugin.

<div data-widget="arch"
     data-rows="row::Microsoft 365 Copilot::copilot::Calls your API plugin|Declarative Agent::agent::declarativeAgent.json + ai-plugin.json||label::API plugin calls Azure Functions endpoints over REST||row::Azure Functions (TypeScript)::mcp::HTTP endpoints · runs locally on port 7071|Azurite::data::Local Table Storage · consultant &amp; project data"></div>

<div data-widget="checklist"
     data-title="Extra prerequisites for Bundle C"
     data-variant="soft"
     data-items="Azure Functions Core Tools v4~Run and debug Functions locally|REST Client VS Code extension~Test local API endpoints quickly|No Dev Tunnel needed~Everything runs locally|No Azure subscription needed~For this bundle path, Azurite local is sufficient"></div>

### Bundle D — DA with Connectors

Build a Declarative Agent that queries your own external data indexed into Microsoft Graph via a Copilot Connector.

<div data-widget="arch"
     data-rows="row::Microsoft 365 Copilot::copilot::Queries via Copilot Connector|Declarative Agent::agent::declarativeAgent.json + connector config||label::connector pushes external data into Microsoft Graph||row::Copilot Connector (Node.js)::tunnel::Indexes your data · runs locally|Microsoft Graph::data::Stores and serves connector items to Copilot"></div>

<div data-widget="checklist"
     data-title="Extra prerequisites for Bundle D"
     data-variant="soft"
     data-items="No Dev Tunnel needed~Connector flow does not require local tunnel exposure|No Azure subscription needed~Path stays in local tooling + Microsoft 365 services|Complete Labs E2-E4 first~Bundle D shares the Bundle C API setup before diverging to Lab E7"></div>

### Bundle E — DA with CLI Tools (Placeholder)

Use command-line tooling to inspect, test, and evaluate your Declarative Agent workflows with fast iteration loops.

<div data-widget="arch"
     data-rows="row::Microsoft 365 Copilot::copilot::Invokes your Declarative Agent|Declarative Agent::agent::instructions + tool manifest||label::CLI loop runs inspection and eval tooling for rapid iteration||row::WIQD-style CLI tools::mcp::Inspect and validate DA + tools behavior|Evals CLI tools::data::Run prompt/test evaluations|Iteration loop::tunnel::Refine prompts, tools, and configs"></div>

<div data-widget="checklist"
     data-title="Extra prerequisites for Bundle E"
     data-variant="soft"
     data-items="Comfort with terminal workflows~Most actions in this bundle are CLI-first|WIQD-style tooling access~Use organization-approved CLI tooling for inspection/debug|Evals tooling access~Run local eval commands on prompt/test sets|Placeholder status~Labs E12 and E13 are starter placeholders for upcoming content"></div>

---

## Exercise 1: Configure your M365 tenant

By default, Teams doesn't allow uploading custom apps — an admin toggle must be flipped first.

<div data-widget="step" data-n="1" data-title="Enable custom app uploads in Teams"></div>

1. Go to [admin.microsoft.com](https://admin.microsoft.com) and sign in with your M365 admin account
2. In the left nav: **Show all** → **Teams** → **Teams apps** → **Setup policies**
3. Select **Global (Org-wide default)**
4. Toggle **Upload custom apps** to **On** and click **Save**



<div data-widget="callout"
     data-type="warn"
     data-title="Propagation delay"
     data-body="This setting can take up to 24 hours in some tenants. If Provision fails with an upload error later, wait an hour and retry."></div>

<div data-widget="step" data-n="2" data-title="Verify your Copilot licence"></div>

Go to [m365.cloud.microsoft/chat/](https://m365.cloud.microsoft/chat/). If you see the Copilot Chat interface, you have a valid licence. If you see a licence error, contact your tenant admin — you need a Microsoft 365 Copilot licence assigned to your account.



---

## Exercise 2: Install developer tools

| Tool | Version needed | Used in | Download |
|---|---|---|---|
| **VS Code** | 1.90+ | All bundles | [code.visualstudio.com](https://code.visualstudio.com/download) |
| **Node.js** | v22 LTS | All bundles | [nodejs.org](https://nodejs.org) |
| **Agents Toolkit** | v6.4.2+ | All bundles | VS Code Extensions panel |
| **Git** | Any recent | Bundles A & B | [git-scm.com](https://git-scm.com/downloads) |
| **GitHub account** | Free | Bundles A & B — Dev Tunnels | [github.com/join](https://github.com/join) |
| **Azure Functions Core Tools** | v4 | Bundles C & D | [learn.microsoft.com](https://learn.microsoft.com/azure/azure-functions/functions-run-local) |
| **Azure subscription** | Free tier OK | Bundle A — Lab E10 only | [azure.microsoft.com/free](https://azure.microsoft.com/free) |

<div data-widget="step" data-n="1" data-title="Install Node.js v22"></div>

Version 22 is required — older versions fail silently on certain SDK dependencies.

If you have a different version installed, use [nvm](https://github.com/nvm-sh/nvm) (Mac/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows) to manage versions side by side.



<div data-widget="step" data-n="2" data-title="Install Microsoft 365 Agents Toolkit"></div>

1. Open VS Code → Extensions (`Ctrl+Shift+X`)
2. Search **Microsoft 365 Agents Toolkit** and click **Install**
3. Click the hexagonal icon in the Activity Bar and sign in with your M365 developer account

<div data-widget="callout"
     data-type="info"
     data-title="Bundle B requires the pre-release version"
     data-body="Lab E9 uses Embedded Knowledge which is only in the pre-release build. In the Extensions panel, find Agents Toolkit → click the dropdown arrow next to Install → &lt;strong&gt;Install Pre-Release Version&lt;/strong&gt; You can switch back to stable at any time."></div>

---

## Exercise 3: Verify your installation

Open a terminal and run these checks. Every one should pass before you proceed.

<div data-widget="verify" data-label="Node.js version" data-cmd="node -v\n# Expected: v22.x.x"></div>

<div data-widget="verify" data-label="npm version" data-cmd="npm -v\n# Expected: 10.x.x or higher"></div>

<div data-widget="verify" data-label="Git installed" data-cmd="git --version\n# Expected: git version 2.x.x"></div>

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

## Exercise 4: Create your first Dev Tunnel

<div data-widget="callout"
     data-type="info"
     data-title="Bundles A and B only"
     data-body="Dev Tunnels are only needed when your MCP server runs locally but Copilot is a cloud service. &lt;strong&gt;If you are doing Bundles C or D, you can skip this exercise.&lt;/strong&gt;"></div>

<div data-widget="callout"
     data-type="concept"
     data-title="The analogy"
     data-body="Imagine you've built a vending machine in your garage. Customers (Copilot) can't come to your garage, so a Dev Tunnel gives your garage a public street address — customers knock on that address and the knock arrives at your machine."></div>

<div data-widget="step" data-n="1" data-title="Forward port 3001"></div>

1. In VS Code, open the **Ports** tab (in the terminal panel)
2. Click **Forward a Port**, enter `3001`, and press Enter



<div data-widget="step" data-n="2" data-title="Make it public"></div>

1. Right-click the new port entry → **Port Visibility** → **Public**
2. Sign in with your GitHub account if prompted
3. Copy the forwarded address — it looks like `https://abc123def456.use.devtunnels.ms`


<div data-widget="callout"
     data-type="warn"
     data-title="Tunnels expire on VS Code restart"
     data-body="You will need to recreate the tunnel and update the URL in your config files each new session. In Bundle A, this URL goes into &lt;code&gt;package.json&lt;/code&gt;'s inspector script and into your declarative agent's MCP server config."></div>


<div data-widget="labnav"
     data-next="../01-first-agent-new/"
     data-next-label="Lab E1 - Your First Declarative Agent"></div>


<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/00-prerequisites" />
