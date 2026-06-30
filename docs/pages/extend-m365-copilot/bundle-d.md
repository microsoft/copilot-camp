---
title: "Bundle D — API-Based Declarative Agent: From API to Agent"
---

<div data-widget="hero"
     data-badge="Bundle D · API-Based Agent"
     data-badge-color="blue"
     data-icon="🧭"
     data-title="Build the classic API-to-agent path"
     data-subtitle="This bundle focuses on a custom API-backed Declarative Agent without MCP, taking you from backend service design through agent wiring, cards, and authentication."
     data-time="~5 hrs"
     data-requires="E0 + E1 "
     data-extra="Labs E2 + E3 + E4 + E5 + E6a"></div>

<div data-widget="sectionlabel" data-text="Bundle D · API-Based Declarative Agent"></div>

<div data-widget="callout"
     data-type="info"
     data-title="Best for developers who want the fundamentals first"
     data-body="Complete &lt;a href='../00-prerequisites/'&gt;Lab E0 — Prerequisites&lt;/a&gt; and &lt;a href='../01-first-agent-new/'&gt;Lab E1  — Your First Declarative Agent&lt;/a&gt; first. Choose this bundle if you want to understand the standard API plugin path before exploring MCP or connector-based grounding."></div>

<div data-widget="checklist"
     data-items="A custom backend API wired into a Declarative Agent~You will build the service and connect it progressively|Enhanced responses with Adaptive Cards~You will shape richer outputs after the core API flow works|Authentication added through the toolkit flow~You will end with a more complete production-style API agent"></div>

---

## Prerequisites & key concepts

Use this sequence if you want the classic API-plugin path from first principles.

<div data-widget="concepts"
     data-cards="Prerequisites::amber::E0 + E1  completed::The on-ramp ensures your environment, tenant, and toolkit setup are ready before backend and agent work begins.||Backend-first architecture::blue::API as source of truth::Lab E2 builds the service layer first. The declarative agent in E3/E4 calls this API through plugin actions.||Progressive enrichment::teal::Core flow, then richer UX::After basic actions are working, E5 adds adaptive cards so responses become more structured and actionable in Copilot.||Authentication layer::green::Protect the API integration::E6a applies Entra ID authentication through the toolkit flow so the API-backed agent can run with proper identity controls."></div>

<div data-widget="bundleseq"
     data-bundle-key="d"
     data-steps="e2::Lab E2::blue::Build a Backend API::Scaffold the Node.js API project~Define the data model and routes~Verify the API returns data locally::../02-build-the-api/|e3::Lab E3::blue::Add Declarative Agent and API Plugin::Scaffold the declarative agent~Add ai-plugin.json and wire actions~Validate agent queries the API::../03-add-declarative-agent/|e4::Lab E4::blue::Enhance API and Plugin::Add filtering and paging~Expand plugin actions~Test enhanced queries in Copilot::../04-enhance-api-plugin/|e5::Lab E5::teal::Add Adaptive Cards::Define Adaptive Card templates~Map card to plugin response~Validate rich card rendering::../05-add-adaptive-card/|e6a::Lab E6a::teal::Add Entra ID Authentication (Toolkit)::Register the app in Entra ID~Configure auth in the Agents Toolkit~Test authenticated Copilot flow::../06a-add-authentication-ttk/"></div>

<div data-widget="labnav"
     data-prev="../bundles/"
     data-prev-label="Back to Bundle Overview"></div>
