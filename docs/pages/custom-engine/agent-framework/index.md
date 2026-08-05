---
title: Start with Agent Framework
---

<div data-widget="landinghero"
     data-badge="🏢 Path 2 · Labs BAF0-BAF3"
     data-badge-color="purple"
     data-title="Start with Agent Framework"
     data-subtitle="Build the Zava Insurance claims agent in code with Microsoft Agent Framework, then ground it twice — on enterprise search with Foundry IQ, and on Microsoft 365 content with Work IQ."
     data-path="0::Setup|1::Build the agent|2::Foundry IQ|3::Work IQ"></div>

# Start with Agent Framework

### A code-first path focused on what makes agents genuinely useful: grounding

> **Grounding is what turns a helpful agent into a trusted one.**
> This path spends its time where it matters most — connecting a real agent to real enterprise knowledge.

---

## What You'll Build

You'll build the **Zava Insurance Agent**, an assistant that helps claims adjusters work faster.

???+ info "About the Zava Insurance Agent"
    Zava Insurance is a fictional insurance company whose adjusters waste hours switching between systems to process a single claim. You'll build an agent that looks up claims, searches enterprise data, and checks claims against company policy — starting from a working solution and adding grounding capability by capability.

<div data-widget="checklist"
     data-items="A tool-calling agent in Microsoft 365 Copilot~Built with the Agents SDK and Microsoft Agent Framework|Foundry IQ grounding~A knowledge base over claims data in Azure AI Search|Work IQ grounding~Policy documents in SharePoint via the Copilot Retrieval API|Permission-aware retrieval~On-Behalf-Of auth so users only see what they're allowed to see"></div>

---

## Key Concepts

<div data-widget="concepts"
     data-cards="Microsoft 365 Agents SDK::teal::The host and the channel::Hosting, activity routing, conversation state, and delivery into Microsoft Teams and Microsoft 365 Copilot. AI-agnostic by design.||Microsoft Agent Framework::purple::The agent and its tools::&lt;code&gt;ChatClientAgent&lt;/code&gt;, sessions, and tools registered with &lt;code&gt;AIFunctionFactory.Create&lt;/code&gt;. The successor to Semantic Kernel and AutoGen.||Foundry IQ::blue::Enterprise search grounding::A reusable, permission-aware knowledge base backed by Azure AI Search that returns grounded, citation-bearing results to your agent.||Work IQ::green::Microsoft 365 grounding::The Copilot Retrieval API performs RAG over SharePoint and OneDrive content inside the Microsoft 365 trust boundary — no index to build, permissions always respected."></div>

<div data-widget="callout"
     data-type="info"
     data-title="Two kinds of grounding, and when to use each"
     data-body="Use &lt;strong&gt;Foundry IQ&lt;/strong&gt; when you own the data and want full control over the index — structured records, custom scoring, your own schema. Use &lt;strong&gt;Work IQ&lt;/strong&gt; when the knowledge already lives in Microsoft 365 and you want retrieval that inherits existing permissions without copying data anywhere."></div>

---

<div data-widget="callout"
     data-type="tip"
     data-title="Go deeper with The Microsoft IQ Series"
     data-body="Foundry IQ and Work IQ are two of the three services that make up Microsoft IQ. Watch &lt;a href='https://aka.ms/iq-series' target='_blank'&gt;The Microsoft IQ Series&lt;/a&gt; for expert-led episodes and hands-on cookbooks covering Foundry IQ, Work IQ, and Fabric IQ — plus community badges."></div>

## Lab Sequence

Each lab builds on the previous one, following the pattern **Services → Plugins → Integration → Testing**.

<div data-widget="bundleseq"
     data-steps="baf0::Lab BAF0::amber::Prerequisites::Set up Teams and your development environment~Create a Microsoft Foundry project~Deploy a model and configure content safety::./00-prerequisites/|baf1::Lab BAF1::teal::Build and Run Your First Agent::Explore the Agent Framework starter solution~Configure your Foundry credentials~Run and test the agent in Microsoft 365 Copilot::./01-build-and-run/|baf2::Lab BAF2::blue::Ground your agent with Foundry IQ::Create an Azure AI Search knowledge base~Add the KnowledgeBaseService and ClaimsPlugin~Return grounded answers about real claims::./02-add-claim-search/|baf3::Lab BAF3::purple::Ground your agent in Microsoft 365 with Work IQ::Publish policy documents to SharePoint~Add On-Behalf-Of user authentication~Analyze claim compliance with the Copilot Retrieval API::./03-add-copilot-retrieval/"></div>

<div data-widget="callout"
     data-type="tip"
     data-title="Reference solutions"
     data-body="Each lab links to a matching &lt;code&gt;BAFn-complete&lt;/code&gt; folder under &lt;code&gt;src/agent-framework/&lt;/code&gt; so you can start from any lab. Note that some folders in that directory were produced by earlier, longer versions of this track and may contain extra features that are no longer taught here."></div>

## <a href="./00-prerequisites">Start here</a> with Lab BAF0, where you'll set up your development environment.

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/index" />
