---
title: "Bundle D — API-Based Declarative Agent: From API to Agent"
---

<div data-widget="hero"
     data-badge="Bundle D · API-Based Agent"
     data-badge-color="blue"
     data-icon="🧭"
     data-subtitle="This bundle focuses on a custom API-backed Declarative Agent without MCP, taking you from backend service design through agent wiring, cards, and authentication."
     data-time="~5 hrs"
     data-requires="Foundation built by  E1B"
     data-extra="Labs E2 + E3 + E4 + E5 + E6a"></div>

<div data-widget="sectionlabel" data-text="Bundle D · API-Based Declarative Agent"></div>

<div data-widget="callout"
     data-type="info"
     data-title="Best for developers who want the fundamentals first"
     data-body="Complete &lt;a href='../01-first-agent-new/'&gt;Lab E1 — Choose Foundation Path&lt;/a&gt; first and finish E1B. Choose this bundle if you want to understand the standard API plugin path before exploring MCP or connector-based grounding."></div>

<div data-widget="checklist"
     data-items="A custom backend API wired into a Declarative Agent~You will build the service and connect it progressively|Enhanced responses with Adaptive Cards~You will shape richer outputs after the core API flow works|Authentication added through the toolkit flow~You will end with a more complete production-style API agent"></div>

---

## Before you start

Complete these requirements before starting Lab E2.

<div data-widget="checklist"
     data-title="Bundle D prerequisites"
     data-variant="soft"
     data-items="Complete E1B~Your first declarative agent should be provisioned and tested|Global Admin access in your Microsoft 365 tenant~Required for tenant-wide app and policy settings|VS Code with Microsoft 365 Agents Toolkit~Sign in with your Microsoft 365 developer account|Node.js 22 LTS and Git~Required for the API and source workflow|Azure Functions Core Tools v4~Required to run the backend API locally|REST Client extension for VS Code~Required to test API endpoints from the provided HTTP files"></div>

<div data-widget="verify"
     data-label="Verify Bundle D command-line tools"
     data-cmd="node --version\ngit --version\nfunc --version\n# Expected: Node.js 22.x and Azure Functions Core Tools 4.x"></div>

Install the latest **REST Client** extension from the VS Code Extensions panel before continuing.

## Key concepts

<div data-widget="concepts"
     data-cards="Backend-first architecture::blue::API as source of truth::Lab E2 builds the service layer first. The declarative agent in E3/E4 calls this API through plugin actions.||Progressive enrichment::teal::Core flow, then richer UX::After basic actions are working, E5 adds adaptive cards so responses become more structured and actionable in Copilot.||Authentication layer::green::Protect the API integration::E6a applies Entra ID authentication through the toolkit flow so the API-backed agent can run with proper identity controls."></div>

<div data-widget="bundleseq"
     data-bundle-key="d"
     data-steps="e2::Lab E2::blue::Build a Backend API::Scaffold the Node.js API project~Define the data model and routes~Verify the API returns data locally::../02-build-the-api/|e3::Lab E3::blue::Add Declarative Agent and API Plugin::Scaffold the declarative agent~Add ai-plugin.json and wire actions~Validate agent queries the API::../03-add-declarative-agent/|e4::Lab E4::blue::Enhance API and Plugin::Add filtering and paging~Expand plugin actions~Test enhanced queries in Copilot::../04-enhance-api-plugin/|e5::Lab E5::teal::Add Adaptive Cards::Define Adaptive Card templates~Map card to plugin response~Validate rich card rendering::../05-add-adaptive-card/|e6a::Lab E6a::teal::Add Entra ID Authentication (Toolkit)::Register the app in Entra ID~Configure auth in the Agents Toolkit~Test authenticated Copilot flow::../06a-add-authentication-ttk/"></div>

<div data-widget="labnav"
     data-prev="../bundles/"
     data-prev-label="Back to Bundle Overview"></div>
