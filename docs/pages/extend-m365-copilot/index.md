---
title: Extend Microsoft 365 Copilot
---

<div data-widget="landinghero"
     data-badge="🤖 Developer path"
     data-badge-color="blue"
     data-title="Extend Microsoft 365 Copilot"
     data-subtitle="Build customized assistants with Declarative Agents. From fundamentals to production-grade security and rich interactive UI — all in one coherent narrative."
     data-path="0::Prerequisites (E0)|1::Fundamentals (E-Intro)|2::Build &amp; Integrate|3::Authentication|4::Integration"></div>

<div data-widget="dacompare"
     data-title="What is a Declarative Agent?"
     data-left-label="Microsoft 365 Copilot (base)"
     data-left-body="General-purpose AI across your M365 data. No domain focus, no custom tools, no branded identity."
     data-right-label="Declarative Agent"
     data-right-body="A focused Copilot persona with custom instructions, domain knowledge, conversation starters, and tool integrations — deployed as an app inside M365 for your organization."
     data-note="Think of it like this: Copilot is a Swiss Army knife. A Declarative Agent is a scalpel — same AI foundation, purpose-built for one job. The three artefacts that define it are &lt;code&gt;manifest.json&lt;/code&gt; (Teams app identity), &lt;code&gt;declarativeAgent.json&lt;/code&gt; (persona + instructions), and optionally &lt;code&gt;ai-plugin.json&lt;/code&gt; (tools/actions)."></div>

### What can you extend in a Declarative Agent?

| Capability area | What you can extend with | Example outcome |
| --- | --- | --- |
| Role and behavior | Agent name, description, instructions, tone, boundaries | "HR Policy Assistant" that stays in-policy and concise |
| Knowledge grounding | Microsoft 365 knowledge sources (for example SharePoint, OneDrive, connectors) | Answers cite your org's docs instead of generic web knowledge |
| Actions and tools | API plugins, connector actions, MCP/API-backed operations | "Create a ticket", "Check order status", "Submit approval" from chat |
| Conversation design | Conversation starters and guided prompts | Faster onboarding with "Try asking..." scenarios |
| Identity and packaging | Teams app manifest and app distribution model | Branded, discoverable agent available to the right users |
| Security and governance | Entra ID auth, permissions, admin controls, compliance boundaries | Least-privilege access with enterprise governance |
| Rich responses and UX | Adaptive Cards and interactive app experiences | Users can review, confirm, and act without leaving Copilot |

## What you're going to build

In this section of Copilot Developer Camp, you first complete a mandatory on-ramp, then choose a bundle based on your implementation style and scenario.

Your journey is:

- **Mandatory on-ramp: E0 + E1** — Set up your environment and build your first Declarative Agent
- **Then choose your bundle:**
     - **Bundle A — MCP Foundations** — Build, connect, and secure an MCP server with OAuth 2.0 and Entra ID
     - **Bundle B — Multi-Agent Workflows** — Compose connected agents and orchestrate multi-agent workflows inside Copilot
     - **Bundle C — MCP App** — Extend an MCP server with React + Fluent UI interactive widgets
     - **Bundle D — API-Based Declarative Agent** — Build a Declarative Agent that retrieves data from a custom API (not MCP)
     - **Bundle E — Declarative Agents with Copilot Connectors** — Ground your agent using connectors for domain relevance
     <!-- - **Bundle F — DA + CLI Tools** — Build, validate, and evaluate using CLI-first workflows (coming soon) -->



<div data-widget="sectionlabel" data-text="Learning path sections"></div>

| Section                            | Labs | Focus                                                 |
| ---------------------------------- | ---- | ------------------------------------------------------- |
| **Mandatory On-ramp**              | E0 + E1  | Complete prerequisites and build your first Declarative Agent before any bundle |
| **Bundle A — MCP Foundations**     | E8 + E10 | Build, connect, and secure an MCP server with OAuth 2.0 and Entra ID |
| **Bundle B — Multi-Agent Workflows**  | E8 + E9 | Compose connected agents and orchestrate multi-agent workflows inside Copilot |
| **Bundle C — MCP App**     | E11 | Extend an MCP server with React + Fluent UI interactive widgets |
| **Bundle D — API-Based Declarative Agent**  | E2 + E3 + E4 + E5 + E6a | Build a Declarative Agent that retrieves data from a custom API (not MCP) |
| **Bundle E — Declarative Agents with Copilot Connectors**  | E2 + E3 + E4 + E7 | Ground your agent using connectors for domain relevance |
<!-- | **Bundle F — DA + CLI Tools**      | E12 + E13 (coming soon) | Build, validate, and evaluate using CLI-first workflows | -->

---

## Start here with prerequisites

<div data-widget="onramp"
     data-title="Get your environment ready"
     data-sub="One focused lab prepares your machine and builds your mental model. Time: ~45 min."
     data-steps="Prerequisites &amp; Concepts::preq::Lab E0 — Prerequisites &amp; Concepts::Install every tool, verify every version, and understand MCP, Dev Tunnels, Azurite, and Declarative Agents before building anything.::Go to Lab E0::00-prerequisites"></div>

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/index" />