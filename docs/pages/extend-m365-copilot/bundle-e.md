---
title: "Bundle E — Declarative Agents with Copilot Connectors"
---

<div data-widget="hero"
     data-badge="Bundle E · Grounding with Connectors"
     data-badge-color="purple"
     data-icon="🔗"
     data-title="Start with API fundamentals, then ground the agent"
     data-subtitle="This bundle reuses the API-based Declarative Agent core and then extends it with connector-based grounding so responses can draw from indexed enterprise content."
     data-time="~5 hrs"
     data-requires="Foundation built by E0 + E1A/E1B"
     data-extra="Labs E2 + E3 + E4 + E7"></div>

<div data-widget="sectionlabel" data-text="Bundle E · Declarative Agents with Copilot Connectors"></div>

<div data-widget="callout"
     data-type="info"
     data-title="Best for developers focused on grounded responses"
     data-body="Complete &lt;a href='../00-prerequisites/'&gt;Prerequisites for Pro-code bundles&lt;/a&gt; and &lt;a href='../01-first-agent-new/'&gt;Lab E1 — Choose Foundation Path&lt;/a&gt; first (then finish either E1A or E1B). Choose this bundle if you want the agent to answer from indexed data sources instead of relying only on API actions."></div>

<div data-widget="checklist"
     data-items="A solid API-backed Declarative Agent core~You will reuse the same fundamentals as Bundle C through E4|Connector-based grounding on top of that core~You will ingest and index data before testing grounded answers|A path tuned for enterprise knowledge scenarios~This is the bundle for search and grounding rather than MCP"></div>

---

## Prerequisites & key concepts

This bundle shares the API core with Bundle C, then adds grounding through connectors.

<div data-widget="concepts"
     data-cards="Prerequisites::amber::E0 + E1A/E1B completed::You should complete the on-ramp before beginning the API + connector grounding sequence.||Shared API core::blue::E2-E4 mirror Bundle D::You first establish a working API-backed declarative agent, including plugin action design and validation.||Grounding strategy::purple::Connector-backed response quality::Lab E7 introduces indexed enterprise content so answers are grounded in curated data instead of only API action outputs.||Enterprise retrieval mindset::teal::Search + context + trust::Connector-based grounding is best when responses must reference knowledge sources users can inspect and validate."></div>

<div data-widget="bundleseq"
     data-bundle-key="e"
     data-steps="e2::Lab E2::blue::Build a Backend API::Scaffold the Node.js API project~Define the data model and routes~Verify the API returns data locally::../02-build-the-api/|e3::Lab E3::blue::Add Declarative Agent and API Plugin::Scaffold the declarative agent~Add ai-plugin.json and wire actions~Validate agent queries the API::../03-add-declarative-agent/|e4::Lab E4::blue::Enhance API and Plugin::Add filtering and paging~Expand plugin actions~Test enhanced queries in Copilot::../04-enhance-api-plugin/|e7::Lab E7::purple::Add Copilot Connector::Register the Microsoft Graph connector~Ingest and index sample data~Ground the declarative agent with indexed data~Validate grounded responses in Copilot::../07-add-graphconnector/"></div>

<div data-widget="labnav"
     data-prev="../bundles/"
     data-prev-label="Back to Bundle Overview"></div>
