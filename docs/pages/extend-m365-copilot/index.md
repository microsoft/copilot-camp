---
title: Extend Microsoft 365 Copilot
---

<div data-widget="landinghero"
     data-badge="🤖 Developer path"
     data-badge-color="blue"
     data-title="Extend Microsoft 365 Copilot"
     data-subtitle="Build customized assistants with Declarative Agents. Start with the fundamentals, follow a guided bundle, or choose a focused standalone lab."
     data-path="1::Fundamentals|2::Bundle-based learning|3::Standalone labs"></div>
# Build Declarative Agents in Microsoft 365 Copilot
### Choose the learning path that matches your goal

> **Microsoft 365 Copilot is powerful — but it answers everything.**
> Declarative agents make it answer only what matters to you.
> This course takes you from first idea to production deployment — no matter your starting point.

- **Path 1 — Fundamentals:** complete E1A and E1B
- **Path 2 — Bundle-based learning:** complete the pro-code prerequisites, then choose Bundle A, B, D, or E
- **Path 3 — Standalone labs:** choose a focused lab without committing to a complete bundle


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

## Choose Your Path

### Three ways to learn

Whether you've never opened a code editor **or** you live in VS Code, choose the path that fits what you want to learn now.

The non-developer discovers that natural language *is* the interface, and that agents can generate code on their behalf when they need to go further. The developer can quickly validate how fast and capable the declarative model is in a setup where Microsoft 365 Copilot access and licensing are already in place.

---

## Path 1 — Fundamentals

Build the shared foundation for creating declarative agents. Complete both labs in order if you are new to agent development; experienced developers can start with E1B.

- **[Lab E1A — Declarative Agent Foundation with Agent Builder](01-first-agent-builder):** create your first agent with a no-code experience.
- **[Lab E1B — Declarative Agent Foundation with Agents Toolkit](01-first-agent-toolkit):** move into a pro-code workflow in VS Code.

**Recommended progression:** E1A -> E1B.

---

## Path 2 — Bundle-Based Learning

Choose a guided sequence when you want to build an end-to-end scenario. Before starting a bundle, complete E1B and the **[Prerequisites for Pro-code bundles](00-prerequisites)** to confirm your tools, tenant, and development environment are ready.

---

### Bundle A — MCP Foundation

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

## Path 3 — Standalone Labs

Use these focused labs when you want to explore a specific technique without following a complete bundle. Choose from MCP Apps with interactive widgets, TypeSpec, or instructions and knowledge.

[View Standalone Labs](standalone-labs)

<div data-widget="callout"
     data-type="tip"
     data-title="Not sure where to begin?"
     data-body="Start with Path 1. After E1B, choose a complete bundle for guided progression or a standalone lab for one focused skill."></div>

---

## Start Here
Your first production agent is closer than you think.

<div data-widget="onramp"
     data-title="Choose your starting point"
     data-sub="Start with E1A and E1B, follow a guided bundle, or select a focused standalone lab."
     data-steps="Path 1 - Fundamental::lab::Fundamentals — E1A and E1B::Build your first agent in Agent Builder, then move to Agents Toolkit in VS Code.::Start Fundamentals::01-first-agent-new|Path 2 - Bundle based::bundle::Bundle-Based Learning::Complete the pro-code prerequisites, then choose an end-to-end scenario from Bundles A, B, D, or E.::View Bundles::bundles|Path 3 - Single labs for focused learning::lab::Standalone Labs::Explore MCP Apps, TypeSpec, or an instructions-based game agent.::View Standalone Labs::standalone-labs"></div>


<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/index" />