---
title: "Bundle A — MCP Foundations: Build, Connect & Secure"
---

<div data-widget="hero"
     data-badge="Bundle A · MCP Foundations"
     data-badge-color="teal"
     data-icon="🔌"
     data-title="Build a working MCP integration, then secure it"
     data-subtitle="This path starts with a live Declarative Agent to MCP flow and then upgrades it with OAuth 2.0 and Entra ID protection."
     data-time="~4 hrs"
      data-requires="Foundation built by E0 + E1A/E1B"
     data-extra="Labs E8 + E10"></div>

<div data-widget="sectionlabel" data-text="Bundle A · MCP Foundations"></div>

<div data-widget="callout"
     data-type="info"
     data-title="Best for developers new to MCP"
     data-body="Complete &lt;a href='../00-prerequisites/'&gt;Lab E0 — Prerequisites&lt;/a&gt; and &lt;a href='../01-first-agent-new/'&gt;Lab E1 — Choose Foundation Path&lt;/a&gt; first (then finish either E1A or E1B), then use this bundle if you want the cleanest end-to-end introduction to MCP + Declarative Agents."></div>

<div data-widget="checklist"
     data-items="A live MCP server connected to a Declarative Agent~You will run the base Zava integration first|OAuth 2.0 protection on the MCP surface~You will add Entra ID app registration and JWT validation|A strong foundation for the advanced MCP tracks~Bundle B builds naturally on this sequence"></div>


## Prerequisites & key concepts

Complete the on-ramp first, then review these concepts before starting the sequence.

<div data-widget="concepts"
      data-cards="Prerequisites::amber::E0 + E1A/E1B completed::You should have tools installed, tenant settings configured, and your first declarative agent already provisioned and tested.||MCP server baseline::teal::Local tools exposed through MCP::Lab E8 establishes the core server runtime, tool schemas, and end-to-end tool invocation path from Copilot.||ai-plugin.json contract::green::Agent-to-tool bridge::The agent reads tool metadata from &lt;code&gt;ai-plugin.json&lt;/code&gt;. If tools change on the server, you fetch actions again to regenerate this contract.||OAuth hardening::purple::From local dev to protected API::Lab E10 adds Entra ID app registration, scope configuration, and JWT validation so only authorized calls reach the MCP server."></div>

<div data-widget="bundleseq"
     data-bundle-key="a"
     data-steps="e8::Lab E8::blue::Connect Declarative Agent to MCP Server::Run Azurite + seed claims data~Start the Zava MCP server~Wire tools via ai-plugin.json~Validate natural language tool calls::../08-mcp-server/|e10::Lab E10::purple::OAuth-Protected MCP Server::Register app in Microsoft Entra ID~Add API scope and client secret~Enable JWT validation in the MCP server~Test authenticated Copilot flow::../10-mcp-auth/"></div>

<div data-widget="labnav"
     data-prev="../bundles/"
     data-prev-label="Back to Bundle Overview"></div>
