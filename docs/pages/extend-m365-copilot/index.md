---
title: Extend Microsoft 365 Copilot
---

<div data-widget="landinghero"
     data-badge="🤖 Developer path"
     data-badge-color="blue"
     data-title="Extend Microsoft 365 Copilot"
     data-subtitle="Build customized assistants with Declarative Agents. From fundamentals to production-grade security and rich interactive UI — all in one coherent narrative."
     data-path="0::Fundamentals|1::Prerequisites|2::Build &amp; Integrate|3::Authentication|4::Integration"></div>
# Build Declarative Agents in Microsoft 365 Copilot
### From your first agent in a browser to production-grade deployment in VS Code

> **Microsoft 365 Copilot is powerful — but it answers everything.**
> Declarative agents make it answer only what matters to you.
> This course takes you from first idea to production deployment — no matter your starting point.

- **✓ No-code soft launch: E1A -> E1B -> Prerequisites -> choose a bundle**
- **✓ Pro-code jump: start at E1B -> Prerequisites -> choose a bundle**
- **✓ Then choose your bundle: A, B, C, D, or E based on scenario**


---

## The Problem

**Copilot is smart. But it doesn't know *your* business.**

Out of the box, Microsoft 365 Copilot knows everything — and nothing specific. It can't stay focused on your HR policies, your project data, your customer files. It answers the whole world when you need it to answer your corner of it.

Declarative agents fix that. You declare what it knows, how it behaves, and what it can do — and Copilot's own orchestrator does the rest. No custom LLM. No orchestration code. Just a focused, purposeful agent that lives inside Copilot Chat.

> *"I kept asking Copilot about our onboarding process and it kept giving me generic HR advice. I didn't know I could just… scope it."*
> — **Corporate Power User**, searching *"can I build my own Microsoft Copilot"*

> *"I wanted an agent that only knows our project files — our policies, our templates. But every time I started Googling I ended up in a rabbit hole. I just wanted something simple."*
> — **Non-technical Team Lead**, searching *"how to build a copilot agent no code step by step"*

> *"I use LangChain. Is Microsoft's declarative model powerful enough, or do I need a custom engine agent for my scenario?"*
> — **Pro-Code Developer**, searching *"declarative vs custom engine agent when to use"*
---

## Who This Is For

### One course. One on-ramp. Multiple bundles.

Whether you've never opened a code editor **or** you live in VS Code, this course meets you where you are.

The non-developer discovers that natural language *is* the interface, and that agents can generate code on their behalf when they need to go further. The developer can quickly validate how fast and capable the declarative model is in a setup where Microsoft 365 Copilot access and licensing are already in place.

---

### Mandatory On-ramp — Fundamentals + Prerequisites for Pro-code bundles

**Start here, no exceptions.**

Before any bundle, follow one of these jump patterns, then complete the Prerequisites for Pro-code bundles -  bundle-readiness gate:

- **No-code learners:** E1A (Agent Builder) -> E1B (Agents Toolkit)
- **Pro-code learners:** E1B directly
- **Prerequisites for Pro-code bundles:** tools, versions, and mental model (MCP, Dev Tunnels, Azurite, declarative agents)

This gives every learner a shared baseline before specializing.

---

### Bundle A — MCP Foundations

**"I want to build and secure an MCP server the right way."**

Build, connect, and secure an MCP server with OAuth 2.0 and Entra ID. Focus on authentication, authorization, and production-safe integration patterns.

**You will build:**
- An MCP server connected to your declarative agent
- OAuth 2.0 and Entra ID-secured tool access
- A least-privilege security model for enterprise rollout

---

### Bundle B — Multi-Agent Workflows

**"I want multiple agents working together in one workflow."**

Compose connected agents and orchestrate multi-agent workflows inside Copilot for complex, multi-step scenarios.

**You will build:**
- A coordinated multi-agent flow
- Role-based agent responsibilities and handoffs
- End-to-end workflow testing across agents

---

### Bundle C — MCP App

**"I want richer, interactive experiences on top of MCP."**

Extend an MCP server with React + Fluent UI interactive widgets so users can review, confirm, and act with richer UX. This is a build-once, work-anywhere pattern: MCP apps and tools can also be used across other compatible clients, including Claude and ChatGPT.

**You will build:**

- Interactive UI widgets backed by MCP tools
- Fluent UI components for actionable responses
- A polished app-style user experience inside Copilot flows
- A portable MCP-based agent surface you can reuse across compatible hosts

---

### Bundle D — API-Based Declarative Agent

**"I need my agent to call a custom API, not MCP."**

Build a declarative agent that retrieves and acts on external data through API plugins, including authentication and resilient integration behavior.

**You will build:**
- An API plugin from OpenAPI definition to working action
- Secure API authentication (OAuth/API key as needed)
- A declarative agent that performs real external operations

---

### Bundle E — Declarative Agents with Copilot Connectors

**"I want stronger domain grounding from enterprise data sources."**

Ground your declarative agent using connectors so responses are anchored in organizational data and business context.

**You will build:**
- Connector-grounded responses for higher relevance
- Domain-specific retrieval behavior
- A governed grounding strategy for production usage

---

<div data-widget="callout"
     data-type="tip"
     data-title="Optional fast path for no-code learners"
     data-body="Start with E1A to build confidence in Agent Builder, then jump to E1B for gradual pro-code exposure, then complete Prerequisites for Pro-code bundles,  before choosing a bundle."></div>

---

## What Is a Declarative Agent?

> You *declare* what it knows, how it should behave, and what it can do.
> Copilot's orchestration, reasoning, and retrieval infrastructure handles everything else.

| Component | What it is |
|---|---|
| **Instructions** | Define persona, tone, scope, guardrails. Written in plain English — no code. |
| **Knowledge** | SharePoint, OneDrive, uploaded files, web content, Graph connectors — up to 512 MB per file. |
| **Actions** | API plugins, MCP tools, code interpreter, image generation — real-time, real-world capabilities. |

The declarative model sits at the most accessible point on the entire agent-building spectrum — but it's not limited. It supports image generation, code interpreter, API plugins, and MCP tools. You're building on Copilot's own secure, hosted infrastructure, which means prompts and responses are never used to train foundation models.

---

## Ready to Build

> **Your first production agent is closer than you think.**

Agents are the new apps. In Microsoft 365, the fastest, safest, most accessible way to build one is a declarative agent — and this course shows you how, from sentence-forming to API-wiring.

**Mandatory first step:** E1 jumps (E1A -> E1B or direct E1B) + Prerequisites for Pro-code bundles on-ramp
**Then specialize with bundles:**

- **Bundle A:** MCP Foundations
- **Bundle B:** Multi-Agent Workflows
- **Bundle C:** MCP App (React + Fluent UI widgets)
- **Bundle D:** API-Based Declarative Agent
- **Bundle E:** Declarative Agents with Copilot Connectors

---



## Start Here: On-ramp Or Bundles

<div data-widget="onramp"
     data-title="Choose your starting point"
     data-sub="No-code path: E1A -> E1B -> Prerequisites for Pro-code bundles -> bundles. Pro-code path: E1B -> Prerequisites for Pro-code bundles -> bundles."
     data-steps="Fundamentals::lab::Lab E1 — Choose Foundation Path::No-code learners should take E1A then E1B. Pro-code learners can jump straight to E1B.::Choose E1 Path::01-first-agent-new|Bundle Readiness::preq::Prerequisites for Pro-code bundles::Confirm tenant setup, tools, and bundle-specific prerequisites before starting bundle labs.::Complete Prerequisites::00-prerequisites|Choose Bundle::bundle::Bundles A-E::Pick the implementation path that matches your scenario and continue from the bundle guide page.::View Bundles::bundles"></div>

### Bundle Pages

- [Bundle A — MCP Foundations](bundle-a)
- [Bundle B — Multi-Agent Workflows](bundle-b)
- [Bundle C — MCP App](bundle-c)
- [Bundle D — API-Based Declarative Agent](bundle-d)
- [Bundle E — Declarative Agents with Copilot Connectors](bundle-e)

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/index" />