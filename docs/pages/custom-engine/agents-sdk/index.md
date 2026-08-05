---
title: Start with Microsoft Foundry
---

<div data-widget="landinghero"
     data-badge="🧰 Path 1 · Labs BMA0-BMA4"
     data-badge-color="teal"
     data-title="Start with Microsoft Foundry"
     data-subtitle="Design and ground an agent in Microsoft Foundry, then run it from a Microsoft 365 Agents SDK host with Microsoft Agent Framework — all the way into Microsoft Teams and Copilot Chat."
     data-path="0::Setup|1::Foundry agent|2::Agents SDK|*3::Agent Framework|4::Microsoft 365 Copilot"></div>

# Start with Microsoft Foundry

### From a portal-built agent to a custom engine agent running in Microsoft 365 Copilot

> **You should not have to choose between a visual authoring experience and real code.**
> Shape the agent's persona and knowledge in Microsoft Foundry, then own the runtime in .NET.

---

## What You'll Build

You'll build **Contoso HR Agent**, an internal assistant for Contoso Electronics that answers employee questions about benefits, roles, and workplace policies — grounded strictly in the HR documents you upload.

<div data-widget="checklist"
     data-items="A grounded agent in Microsoft Foundry~Instructions, knowledge, and File Search over your HR documents|A .NET host built on the Agents SDK~Microsoft 365 Agents Toolkit project running locally|Agent Framework orchestration~AIAgent, AgentSession, and streaming responses|Delivery to Teams and Microsoft 365 Copilot~One manifest change turns it into a custom engine agent"></div>

---

## Key Concepts

<div data-widget="concepts"
     data-cards="Microsoft Foundry::blue::Where the agent is defined::You author instructions, attach knowledge, and publish a versioned agent. The definition lives in the service, so you can change behavior without redeploying code.||Microsoft 365 Agents SDK::teal::The host and the channel::Provides hosting, activity routing, conversation state, and streaming delivery into Microsoft Teams and Microsoft 365 Copilot.||Microsoft Agent Framework::purple::The orchestration layer::Wraps your Foundry agent as an &lt;code&gt;AIAgent&lt;/code&gt; and runs it. Replaces Semantic Kernel for new agent development.||AgentSession::amber::Conversation memory::Each Teams conversation maps to a Foundry conversation. Persist its id in conversation state so the agent remembers the thread across turns."></div>

<div data-widget="callout"
     data-type="info"
     data-title="These labs use Microsoft Agent Framework"
     data-body="Earlier versions of this path used Semantic Kernel. The code has been migrated: &lt;code&gt;AzureAIAgent&lt;/code&gt; → &lt;code&gt;AIAgent&lt;/code&gt;, &lt;code&gt;InvokeStreamingAsync&lt;/code&gt; → &lt;code&gt;RunStreamingAsync&lt;/code&gt;, threads → &lt;code&gt;AgentSession&lt;/code&gt;, and &lt;code&gt;AddKernel()&lt;/code&gt; is no longer needed."></div>

---

## Lab Sequence

Complete the labs in order — each one builds on the previous.

<div data-widget="bundleseq"
     data-steps="bma0::Lab BMA0::amber::Prerequisites::Enable Teams custom app uploads~Install Visual Studio 2022 and Agents Toolkit~Get an Azure subscription::./00-prerequisites/|bma1::Lab BMA1::blue::Prepare your agent in Microsoft Foundry::Create a Foundry project and deploy a model~Author instructions for the HR agent~Ground it on HR documents with File Search::./01-agent-in-foundry/|bma2::Lab BMA2::teal::Build your first agent with the Agents SDK::Scaffold an Agents SDK project in Visual Studio~Explore the hosting and activity model~Test locally in Microsoft 365 Agents Playground::./02-agent-with-agents-sdk/|bma3::Lab BMA3::purple::Connect Foundry and Agent Framework::Add the Agent Framework packages~Resolve the Foundry agent as an AIAgent~Stream grounded answers into Microsoft Teams::./03-agent-configuration/|bma4::Lab BMA4::green::Bring your agent to Microsoft 365 Copilot::Declare the agent in the app manifest~Add conversation starters~Test the agent inside Microsoft 365 Copilot::./04-bring-agent-to-copilot/"></div>

## <a href="./00-prerequisites">Start here</a> with Lab BMA0, where you'll set up your development environment.

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/index" />
