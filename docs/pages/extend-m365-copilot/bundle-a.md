---
title: "Bundle A — MCP Foundation: Build, Connect & Secure"
---

<div data-widget="hero"
     data-badge="Bundle A · MCP Foundation"
     data-badge-color="teal"
     data-icon="🔌"
     data-subtitle="This path starts with a live Declarative Agent to MCP flow and then upgrades it with OAuth 2.0 and Entra ID protection."
     data-time="~3 hrs"
      data-requires="Foundation built by  E1B"
     data-extra="Labs E8 + E10"></div>

<div data-widget="sectionlabel" data-text="Bundle A · MCP Foundation"></div>

<div data-widget="callout"
     data-type="info"
     data-title="Best for developers new to MCP"
     data-body="Complete &lt;a href='../01-first-agent-new/'&gt;Lab E1 — Choose Foundation Path&lt;/a&gt; first and finish E1B. Choose this bundle if you want the cleanest end-to-end introduction to MCP + Declarative Agents."></div>

<div data-widget="checklist"
     data-items="A live MCP server connected to a Declarative Agent~You will run the base Zava integration first|OAuth 2.0 protection on the MCP surface~You will add Entra ID app registration and JWT validation|A strong foundation for the advanced MCP tracks~Bundle B builds naturally on this sequence"></div>


## Before you start

Complete these requirements before starting Lab E8.

<div data-widget="checklist"
     data-title="Bundle A prerequisites"
     data-variant="soft"
     data-items="Complete E1B~Your first declarative agent should be provisioned and tested|Global Admin access in your Microsoft 365 tenant~Required for tenant-wide app and policy settings|VS Code with Microsoft 365 Agents Toolkit~Sign in with your Microsoft 365 developer account|Node.js 22 LTS and Git~Required for the MCP server and source workflow|GitHub account~Required when signing in to Dev Tunnels|Azurite and MCP Inspector~Required to run and inspect the local MCP server|Azure subscription~Free tier is sufficient for the Entra ID app registration in Lab E10"></div>

<div data-widget="verify"
     data-label="Verify Bundle A tools"
     data-cmd="node --version\ngit --version\nnpm install -g azurite @modelcontextprotocol/inspector\nazurite --version\n# Expected: Node.js 22.x and Azurite 3.x"></div>

### Verify Dev Tunnels

In the VS Code **Ports** tab, forward port `3001`, set **Port Visibility** to **Public**, and sign in with your GitHub account if prompted. Confirm that you can copy an `https://...use.devtunnels.ms` address, then stop forwarding the port until the lab needs it.

## Key concepts

<div data-widget="concepts"
      data-cards="MCP server baseline::teal::Local tools exposed through MCP::Lab E8 establishes the core server runtime, tool schemas, and end-to-end tool invocation path from Copilot.||ai-plugin.json contract::green::Agent-to-tool bridge::The agent reads tool metadata from &lt;code&gt;ai-plugin.json&lt;/code&gt;. If tools change on the server, you fetch actions again to regenerate this contract.||OAuth hardening with DCR::purple::From local dev to protected API::Lab E10 adds Entra ID app registration, Dynamic Client Registration (RFC 7591), and JWT validation so only authorized calls reach the MCP server—ATK handles client registration automatically."></div>

<div data-widget="bundleseq"
     data-bundle-key="a"
     data-steps="e8::Lab E8::blue::Connect Declarative Agent to MCP Server::Run Azurite + seed claims data~Start the Zava MCP server~Wire tools via ai-plugin.json~Validate natural language tool calls::../08-mcp-server/|e10::Lab E10::purple::OAuth-Protected MCP Server with DCR::Register app in Microsoft Entra ID~Expose API scope and .well-known metadata~Enable JWT validation + Dynamic Client Registration~Provision agent with OAuth (dynamic registration)::../10-mcp-auth/"></div>

<div data-widget="labnav"
     data-prev="../bundles/"
     data-prev-label="Back to Bundle Overview"></div>
