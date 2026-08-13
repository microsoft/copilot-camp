---
title: "Bundle B — Multi-Agent Workflows in Copilot"
---

<div data-widget="hero"
     data-badge="Bundle B · Multi-Agent Workflows"
     data-badge-color="coral"
     data-icon="🕸️"
     data-subtitle="This bundle layers connected agents and interactive widgets on top of the core MCP experience so your agent can route work and present richer responses."
     data-time="~4 hrs"
     data-requires="Foundation built by  E1B"
     data-extra="Labs E8 + E9"></div>

<div data-widget="sectionlabel" data-text="Bundle B · Multi-Agent Workflows"></div>

<div data-widget="callout"
     data-type="info"
     data-title="Best for developers extending the MCP experience"
     data-body="Complete &lt;a href='../01-first-agent-new/'&gt;Lab E1 — Choose Foundation Path&lt;/a&gt; first and finish E1B. Choose this bundle if you want routing across connected agents, not just a basic tool call flow."></div>

<div data-widget="checklist"
     data-items="Connected-agent orchestration over MCP Foundation~You will establish the base MCP flow before composing agents|A scalable MCP path with full orchestration~This bundle covers the deepest MCP orchestration pattern in the track"></div>

---

## Before you start

Complete these requirements before starting Lab E8.

<div data-widget="checklist"
     data-title="Bundle B prerequisites"
     data-variant="soft"
     data-items="Complete E1B~Your first declarative agent should be provisioned and tested|Global Admin access in your Microsoft 365 tenant~Required for tenant-wide app and policy settings|VS Code with Microsoft 365 Agents Toolkit~Sign in with your Microsoft 365 developer account|Node.js 22 LTS and Git~Required for the MCP server and source workflow|GitHub account~Required when signing in to Dev Tunnels|Azurite and MCP Inspector~Required to run and inspect the local MCP server"></div>

<div data-widget="verify"
     data-label="Verify Bundle B tools"
     data-cmd="node --version\ngit --version\nnpm install -g azurite @modelcontextprotocol/inspector\nazurite --version\n# Expected: Node.js 22.x and Azurite 3.x"></div>

### Verify Dev Tunnels

In the VS Code **Ports** tab, forward port `3001`, set **Port Visibility** to **Public**, and sign in with your GitHub account if prompted. Confirm that you can copy an `https://...use.devtunnels.ms` address, then stop forwarding the port until the lab needs it.

## Key concepts

<div data-widget="concepts"
     data-cards="Foundation first::teal::E8 is the starting point::Bundle B includes E8 because orchestration depends on a working MCP server and declarative agent tool wiring.||Connected-agent orchestration::coral::Route work across agents::Lab E9 introduces a pattern where specialized agents collaborate, each handling a focused responsibility in the workflow."></div>

<div data-widget="bundleseq"
     data-bundle-key="b"
     data-steps="e8::Lab E8::amber::Connect Declarative Agent to MCP Server::Run Azurite + seed claims data~Start the Zava MCP server~Wire tools via ai-plugin.json~Validate natural language tool calls::../08-mcp-server/|e9::Lab E9::amber::Connected Agents Orchestration::Build MCP foundation (E8)~Implement connected agents (E9)~Validate orchestration routing::../09-connected-agent/"></div>

<div data-widget="labnav"
     data-prev="../bundles/"
     data-prev-label="Back to Bundle Overview"></div>
