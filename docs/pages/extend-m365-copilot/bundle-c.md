---
title: "Bundle C — MCP App: Interactive Widgets"
---

<div data-widget="hero"
     data-badge="Bundle C · MCP App"
     data-badge-color="green"
     data-icon="🖼️"
     data-title="Build an MCP App with Interactive Widgets"
     data-subtitle="This standalone bundle extends a working MCP server with a full app surface — React + Fluent UI widgets mapped directly to tool results in Copilot conversation."
     data-time="~2 hrs"
     data-requires="Foundation built by E0 + E1A/E1B"
     data-extra="Lab E11"></div>

<div data-widget="sectionlabel" data-text="Bundle C · MCP App"></div>

<div data-widget="callout"
     data-type="info"
     data-title="Best for developers who want a richer MCP conversation surface"
     data-body="Complete &lt;a href='../00-prerequisites/'&gt;Lab E0 — Prerequisites&lt;/a&gt; and &lt;a href='../01-first-agent-new/'&gt;Lab E1 — Choose Foundation Path&lt;/a&gt; first (then finish either E1A or E1B). Choose this bundle if you want to move beyond text responses and surface tool results as interactive UI widgets inside Copilot."></div>

<div data-widget="checklist"
     data-items="React + Fluent UI widget built and registered~You will build an interactive widget component and map it to an MCP tool|Live widget rendering validated in Copilot conversation~You will see tool results rendered as interactive UI instead of plain text"></div>

---

## Prerequisites & key concepts

This standalone bundle takes you from the on-ramp directly into building an MCP-powered app with interactive widgets.

<div data-widget="concepts"
     data-cards="Prerequisites::amber::E0 + E1A/E1B completed::The standard on-ramp ensures your environment and tenant are ready. Lab E11 handles the MCP server setup as part of its own flow.||MCP App surface::green::Beyond plain text responses::Lab E11 introduces the MCP App pattern, where tool results are rendered as interactive Fluent UI widgets directly in the Copilot conversation pane.||React + Fluent UI::teal::Component-based widget development::You will build a React component using Fluent UI primitives, then register it so Copilot knows which tool maps to which widget.||Tool-to-widget mapping::blue::Connect output to visual experience::The mapping layer links an MCP tool’s JSON output to the widget’s props, enabling dynamic interactive rendering."></div>

<div data-widget="bundleseq"
     data-bundle-key="c"
     data-steps="e11::Lab E11::green::MCP App with Interactive Widgets::Run the MCP app scaffold~Build React + Fluent UI widget component~Register the tool-to-widget mapping~Test interactive widget rendering in Copilot conversation::../11-mcp-app/"></div>

<div data-widget="labnav"
     data-prev="../bundles/"
     data-prev-label="Back to Bundle Overview"></div>
