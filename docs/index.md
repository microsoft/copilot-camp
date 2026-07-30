# Extend Microsoft 365 Copilot

**Copilot Developer Camp** is a self-paced learning resource, designed to help you extend Microsoft 365 Copilot. It provides practical guidance and real-world examples to support your development journey.

<!-- <div class="video">
  <iframe src="//www.youtube.com/embed/uLYdP4ST7k0" frameborder="0" allowfullscreen></iframe>
  <div>Overview of Copilot Dev Camp</div>
</div> -->

In this dev camp, you have multiple options to extend Microsoft 365 Copilot, depending on your needs.

Building an agent:

- **Declarative Agents**: You build your agents on the Microsoft 365 Copilot stack. You rely on the foundational model, orchestrator, and user experience of Copilot.
- **Custom Engine Agents**: You build your agents on any AI stack of your choice. You choose the foundational model, the orchestrator, and the user experience.

Extending Copilot Cowork:

- **Skills and plugins for Copilot Cowork**: You build skills and plugins to extend the capabilities of Copilot Cowork.

Adding work intelligence layer:

- **Work IQ**: Optionally, you build agents with Work IQ, which can provide access to the organizations' intelligence (email, meetings, files, people context, search, memory, reasoning signals) to every agent.

No matter what technology you use to create agents or to extend Microsoft 365 Copilot, you can always rely on **Microsoft Agent 365** to observe, govern, and secure every agent across your organization.

![Diagram that shows M365 extensibility options: Build on the Microsoft 365 Copilot Stack leading to Declarative Agents, Build on your own AI stack leading to Custom Engine Agents, and Extend Cowork. Additionally, Work IQ for organizational intelligence, and Microsoft Agent 365 as a control plane for agents.](./assets/images/m365-copilot-extensibility.png)

## Your learning options to extend Microsoft 365 Copilot

<div><span><a href="/copilot-camp/pages/extend-m365-copilot/" class="cta-button-fixed-width">🧩 Declarative Agents</a></span><span class="cta-button-description">Build on the Microsoft 365 Copilot Stack<span></div>

<div><span><a href="/copilot-camp/pages/custom-engine/" class="cta-button-fixed-width">⚙️ Custom Engine Agents</a></span><span class="cta-button-description">Build on your own AI stack<span></div>

<div><span><a href="/copilot-camp/pages/copilot-cowork/00-cowork-setup/" class="cta-button-fixed-width">🤖 Copilot Cowork</a></span><span class="cta-button-description">Move from intent to action while keeping the user in control<span></div>

<div><span><a href="/copilot-camp/pages/work-iq/" class="cta-button-fixed-width">🧠 Work IQ</a></span><span class="cta-button-description">Unlock the organizations' intelligence to every agent<span></div>

<div><span><a href="/copilot-camp/pages/agent-365/" class="cta-button-fixed-width">🛡️ Agent 365</a></span><span class="cta-button-description">The control plane for agents<span></div>


<!--
![Architecture diagram of an Agent for Microsoft 365 showing the user-experience layer with Microsoft 365 apps, an orchestrator managing knowledge (instructions and grounding), skills (actions, triggers, and workflow), and autonomy (planning, learning, escalation), all powered by foundation models, with the ability to connect to other agents.](./assets/images/m365-agent-general.png)
-->



## 🧪 Where should I start to build agents?

There are plenty of options for you to start from. To create Declarative Agents, you can dig into technologies like Agent Builder, Custom SharePoint Agents, or pro-code Declarative Agents with the Microsoft 365 Agents Toolkit.
To create Custom Engine Agents, you can explore technologies like Microsoft Copilot Studio, Microsoft Foundry, or pro-code Custom Engine Agents with the Microsoft 365 Agents Toolkit.
To create your own apps built on top of Microsoft 365 and Microsoft 365 Copilot you should explore the Work IQ area.

No matter what kind of AI solution you are working on, you should always learn about Microsoft Agent 365 to manage agents via the agents registry, have access control and security, handle visualization and observability, and implement interoperability.

In the following flowchart, you can find useful tips to learn where to start from.

[![Flowchart to help you start your learning journey. Starting with Agent 365 (Lab AG) which applies to all solutions. The main decision asks What kind of AI solution are you working on? Building on the Microsoft 365 Copilot stack leads to Declarative Agents: end users choose between Agent Builder (Lab MAB) for Microsoft 365 content or Custom SharePoint Agent (Lab MSA) for SharePoint Online content only, while developers go to Declarative Agent (Lab E). Building for your own app leads to Work IQ (Lab WIQ). Building on your own AI stack leads to Custom Engine Agents: power users go to Copilot Studio via Agent Academy and Copilot Studio labs (Lab MCS), while developers build Custom Engine Agents with Microsoft Foundry, Agent Framework, and Microsoft 365 Agents SDK (Labs BMA and BAF).](./assets/images/CopilotCamp-Flow-Chart.png)](./assets/images/CopilotCamp-Flow-Chart.png){target="_blank"}

## 🆕 What's New?

!!! example "Updated in July 2026"

    We’re excited to announce **a brand new set of hands-on labs** about extending Microsoft 365 Copilot with the new SharePoint Copilot Apps. 

    - **Build your first SharePoint Copilot App**:
    Scaffold an SPFx v1.24 Copilot Component with React, customize it, add custom tool parameters, test it locally in the Copilot Workbench, then package and deploy it so it renders as an interactive UX component inside Microsoft 365 Copilot.
    [🔗 Start this lab](https://microsoft.github.io/copilot-camp/pages/sharepoint/sharepoint-copilot-apps/01-first-copilot-app/)

!!! example "Updated in June 2026"

    We’re happy to introduce **a brand new set of hands-on labs** designed to help you understand how to extend Copilot Cowork. 

    - **Copilot Cowork setup and extensibility**:
    Learn what Copilot Cowork is, how to prepare your tenant for Cowork, and which extensibility options are available to tailor Cowork to your organization's needs.
    [🔗 Start this lab](https://microsoft.github.io/copilot-camp/pages/copilot-cowork/00-cowork-setup/)

    - **Build your first skill**:
    Build custom Agent Skills that teach Cowork when and how to run a specific domain workflow, then manage and publish your own skills.    
    [🔗 Start this lab](https://microsoft.github.io/copilot-camp/pages/copilot-cowork/01-cowork-skills/)

    - **Build your first plugin**:
    Package skills and connectors into a Cowork plugin as a Microsoft 365 app, then build and deploy your own plugin to extend Cowork.
    [🔗 Start this lab](https://microsoft.github.io/copilot-camp/pages/copilot-cowork/02-cowork-plugins/)

<!-- !!! example "Updated in April 2026"

    We’re excited to introduce **a brand new hands-on lab** designed to help you build powerful Copilot experiences. 

    - **Build an MCP App with Interactive Widgets**:
    Build an MCP app that powers an Access Request & Approval Workflow with interactive widgets rendered directly in the AI agent’s response, and integrate it with a Declarative Agent in Microsoft 365 Copilot.
    [🔗 Start this lab](https://microsoft.github.io/copilot-camp/pages/extend-m365-copilot/11-mcp-app/) -->

## 🧑‍💻 More

---8<--- "more-links.md"

<!-- ## 🎖️ Copilot Developer Camp Awards

We are excited to announce a thrilling initiative that will challenge you to showcase your knowledge and skills in Microsoft 365 Copilot extensibility. This is your chance to dive deep into the world of Copilot, explore its capabilities, and demonstrate your expertise. [Find out more on awards.](https://microsoft.github.io/copilot-camp/awards)
 -->


<!-- ## 🎁 Copilot Camp in a Box 

Got the labs working? Ready to share your knowledge? Why not run your own Copilot Camp workshop using our [Copilot Camp in a Box resources](https://microsoft.github.io/copilot-camp/pages/in-a-box/)! We've got you covered with presentation materials that even include embedded demos. -->



## 🚑 Issues

We really appreciate your feedback! Please use the [issues list](https://github.com/microsoft/copilot-camp/issues) to share your comments and issues, or if you're in Microsoft let us know in the "Copilot Developer Camp Early Testers" chat in Microsoft Teams. Thanks!


## 📜 Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

Resources:

- [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/)
- [Microsoft Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/)
- Contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with questions or concerns

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/index" />
