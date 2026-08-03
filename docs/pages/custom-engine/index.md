---
title: Build Custom Engine Agents
---

<div data-widget="landinghero"
     data-badge="🧠 Developer path"
     data-badge-color="purple"
     data-title="Build Custom Engine Agents"
     data-subtitle="Bring your own model, your own orchestrator, and your own data. Build agents with the Microsoft 365 Agents SDK and Microsoft Agent Framework that run in Microsoft Teams and Microsoft 365 Copilot."
     data-path="0::Prerequisites|1::Foundry agent|2::Agent Framework|3::Teams &amp; Microsoft 365 Copilot"></div>

# Build Custom Engine Agents

### You own the model, the orchestration, and the grounding

> **A custom engine agent is your agent, end to end.**
> You choose the foundation model, you write the reasoning loop, and you decide exactly
> which data it reasons over — delivered right inside Microsoft Teams and Microsoft 365 Copilot.

---

## What Is a Custom Engine Agent?

A custom engine agent is an agent you build in code and host yourself. You bring the intelligence; Microsoft 365 provides the surface your users already work in.

This is the right choice when you want a specific foundation model, a reasoning loop tailored to your business process, your own retrieval and grounding stack, or delivery to channels beyond Microsoft 365.

![Custom engine agent architecture diagram. At the very basis you can have any foundational model of your choice. Also the orchestrator is completely customizable. Knowledge, skills, and autonomous capabilities can be implemented with custom code, relying on external SDKs and libraries. The user experience can be in Microsoft 365 Copilot, in Microsoft Teams, or any other supported channel.](../../assets/images/m365-custom-engine-agent.png)

| Layer | What you control |
|---|---|
| **Model** | Any foundation model you deploy — in Microsoft Foundry or elsewhere. |
| **Orchestration** | The reasoning loop, tool calling, and multi-step planning, powered by Microsoft Agent Framework. |
| **Knowledge** | Your retrieval stack: Foundry IQ knowledge bases, Microsoft 365 content, or your own data sources. |
| **Channel** | Microsoft Teams, Microsoft 365 Copilot, and other channels through the Microsoft 365 Agents SDK. |

The **Microsoft 365 Agents SDK** handles hosting, activities, streaming, and channel delivery. **Microsoft Agent Framework** powers the AI: agents, sessions, tools, and grounded responses. Together they let you ship a production-shaped agent without rebuilding the plumbing.

<div data-widget="callout"
     data-type="info"
     data-title="Microsoft Agent Framework is the successor to Semantic Kernel for agents"
     data-body="Both paths in this section use &lt;strong&gt;Microsoft Agent Framework&lt;/strong&gt;. If you previously followed these labs with Semantic Kernel, note that &lt;code&gt;AzureAIAgent&lt;/code&gt; is replaced by &lt;code&gt;AIAgent&lt;/code&gt;, &lt;code&gt;InvokeStreamingAsync&lt;/code&gt; by &lt;code&gt;RunStreamingAsync&lt;/code&gt;, and threads by &lt;code&gt;AgentSession&lt;/code&gt;. No &lt;code&gt;Kernel&lt;/code&gt; is required."></div>

---

## Who This Is For

### Two paths. One framework. Pick your starting point.

Both paths land in the same place — an agent running in Microsoft Teams and Microsoft 365 Copilot — but they start from different ends.

**Start in the portal** if you want to shape the agent's instructions and knowledge visually in Microsoft Foundry first, then wire it into a .NET host. **Start in code** if you would rather clone a working solution and build capabilities into it feature by feature.

---

### Path 1 — Start with Microsoft Foundry

**"I want to design my agent in the portal, then bring it into Microsoft 365."**

Create and ground an agent in Microsoft Foundry, then connect it from a Microsoft 365 Agents SDK host using Microsoft Agent Framework so it streams grounded, cited answers into Microsoft Teams and Microsoft 365 Copilot.

**You will build:**

- A Foundry agent grounded on your own documents
- A .NET host that resolves and runs that agent with Microsoft Agent Framework
- Streaming responses with citations, conversation memory, and delivery to Microsoft 365 Copilot

---

### Path 2 — Start with Agent Framework

**"I want to build the agent in code and add grounding myself."**

Build the **Zava Insurance** claims agent from a working starter solution, then ground it twice: first on enterprise search with a Foundry IQ knowledge base, then on Microsoft 365 content with the Microsoft 365 Copilot Retrieval API.

**You will build:**

- A tool-calling claims agent running in Microsoft Teams and Microsoft 365 Copilot
- Foundry IQ grounding over claims data in Azure AI Search
- Work IQ grounding over policy documents stored in SharePoint

---

<div data-widget="callout"
     data-type="tip"
     data-title="Not sure which to pick?"
     data-body="Choose &lt;strong&gt;Path 1&lt;/strong&gt; if you are new to custom engine agents — it is the shortest route to a running agent. Choose &lt;strong&gt;Path 2&lt;/strong&gt; if you already know the basics and want to focus on retrieval and grounding."></div>

<div data-widget="callout"
     data-type="info"
     data-title="Learn Microsoft IQ with The IQ Series"
     data-body="Path 2 grounds an agent with Foundry IQ and Work IQ. For the full picture of Microsoft's unified intelligence layer — Foundry IQ, Work IQ, and Fabric IQ — watch &lt;a href='https://aka.ms/iq-series' target='_blank'&gt;The Microsoft IQ Series&lt;/a&gt;: short expert-led episodes, each with a hands-on cookbook and a community badge."></div>

---

## Start Here: Choose Your Path

Your first custom engine agent is a few labs away.

<div data-widget="onramp"
     data-title="Choose your starting point"
     data-sub="Portal-first path: design in Microsoft Foundry, then host it in .NET. Code-first path: start from a working solution and add grounding."
     data-steps="Portal first::lab::Path 1 — Start with Microsoft Foundry::Create and ground an agent in Microsoft Foundry, then run it from a Microsoft 365 Agents SDK host with Microsoft Agent Framework.::Start Path 1::agents-sdk/|Code first::lab::Path 2 — Start with Agent Framework::Build the Zava Insurance agent in code and ground it with Foundry IQ and the Microsoft 365 Copilot Retrieval API.::Start Path 2::agent-framework/"></div>

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/index" />
