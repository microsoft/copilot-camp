**Copilot Developer Camp** is a self-paced learning resource, designed to help you build agents for Microsoft 365 Copilot. It provides practical guidance and real-world examples to support your development journey.

---8<--- "starrepo.md"

# Building Agents for Microsoft 365

<!-- <div class="video">
  <iframe src="//www.youtube.com/embed/uLYdP4ST7k0" frameborder="0" allowfullscreen></iframe>
  <div>Overview of Copilot Dev Camp</div>
</div> -->

Agents for Microsoft 365 are conversational AI-powered assistants that automate tasks, answer questions, and streamline workflows across Microsoft 365. Common use cases include customer support, IT helpdesk, and HR assistance.

![Architecture diagram of an Agent for Microsoft 365 showing the user-experience layer with Microsoft 365 apps, an orchestrator managing knowledge (instructions and grounding), skills (actions, triggers, and workflow), and autonomy (planning, learning, escalation), all powered by foundation models, with the ability to connect to other agents.](./assets/images/m365-agent-general.png)

An agent for Microsoft 365 typically consists of three core components: a foundation AI model that powers intelligent responses, an orchestrator that coordinates knowledge, skills, and autonomous processes, and optionally, a user interface like Microsoft 365 Copilot, Microsoft Teams, Microsoft SharePoint Online, etc. Agents can then be connected with other agents in a multi-agent architecture.

![Diagram titled Empowering every developer to build agents, showing three paths: Build on the Microsoft 365 Copilot Stack leading to Declarative Agents, Build on your own AI stack leading to Custom Engine Agents, and Build for your own app leading to Copilot APIs. Moreover, Microsoft Agent 365 is available across all of the options to observe, govern, and secure every agent across your organization.](./assets/images/m365-copilot-extensibility.png)

When it comes to extending Microsoft 365 Copilot you have multiple options, depending on your actual needs:

- **Declarative Agents**: you build your agents on the Microsoft 365 Copilot stack. You rely on the foundational model, orchestrator, and user experience of Copilot.
- **Custom Engine Agents**: you build your agents on any AI stack of your choice. You choose the foundational model, the orchestrator, and the user experience.
- **Work IQ**: you create custom applications that consume Microsoft 365 and Microsoft 365 Copilot via Work IQ, the AI-driven intelligence layer of Microsoft 365.

No matter what technology you use to create agents or to extend Microsoft 365 Copilot, you can always rely on **Microsoft Agent 365** to observe, govern, and secure every agent across your organization.

## 🧪 Where should I start to build agents?

There are plenty of options for you to start from. To create Declarative Agents, you can dig into technologies like Agent Builder, Custom SharePoint Agents, or pro-code Declarative Agents with the Microsoft 365 Agents Toolkit.
To create Custom Engine Agents, you can explore technologies like Microsoft Copilot Studio, Microsoft Foundry, or pro-code Custom Engine Agents with the Microsoft 365 Agents Toolkit.
To create your own apps built on top of Microsoft 365 and Microsoft 365 Copilot you should explore the Work IQ area.

No matter what kind of AI solution you are working on, you should always learn about Microsoft Agent 365 to manage agents via the agents registry, have access control and security, handle visualization and observability, and implement interoperability.

In the following flowchart, you can find useful tips to learn where to start from.

[![Flowchart to help you start your learning journey. Starting with Agent 365 (Lab AG) which applies to all solutions. The main decision asks What kind of AI solution are you working on? Building on the Microsoft 365 Copilot stack leads to Declarative Agents: end users choose between Agent Builder (Lab MAB) for Microsoft 365 content or Custom SharePoint Agent (Lab MSA) for SharePoint Online content only, while developers go to Declarative Agent (Lab E). Building for your own app leads to Work IQ (Lab WIQ). Building on your own AI stack leads to Custom Engine Agents: power users go to Copilot Studio via Agent Academy and Copilot Studio labs (Lab MCS), while developers build Custom Engine Agents with Microsoft Foundry, Agent Framework, and Microsoft 365 Agents SDK (Labs BMA and BAF).](./assets/images/CopilotCamp-Flow-Chart.png)](./assets/images/CopilotCamp-Flow-Chart.png){target="_blank"}

<!-- ## 🆕 What's New?

!!! example "Updated in Jan 2026"

    We’re excited to introduce **three new hands-on labs** designed to help you build powerful Copilot experiences. 

    - **Connect Declarative agent to MCP Server**:
    Run a complete Model Context Protocol (MCP) server for Zava Insurance's claims system and integrate it with Declarative Agent in Microsoft 365 Copilot.
    [🔗 Start this lab](https://microsoft.github.io/copilot-camp/pages/extend-m365-copilot/08-mcp-server/)

     - **Connected Agents using Copilot Studio**:
    Understand how to create agents in Microsoft Copilot Studio that can communicate with other agents.
    [🔗 Start this lab](https://microsoft.github.io/copilot-camp/pages/make/copilot-studio/09-connected-agents/)

    - **Build with Microsoft 365 Agents SDK**:
    Leverage the full capabilities of the Microsoft 365 Agents SDK to create production-ready Copilot agents that integrate with real business data.
    [🔗 Start this lab](https://microsoft.github.io/copilot-camp/pages/custom-engine/agents-sdk/) -->

## 🧑‍💻 More

---8<--- "more-links.md"

<!-- ## 🎖️ Copilot Developer Camp Awards

We are excited to announce a thrilling initiative that will challenge you to showcase your knowledge and skills in Microsoft 365 Copilot extensibility. This is your chance to dive deep into the world of Copilot, explore its capabilities, and demonstrate your expertise. [Find out more on awards.](https://microsoft.github.io/copilot-camp/awards)
 -->


## 🎁 Copilot Camp in a Box 

Got the labs working? Ready to share your knowledge? Why not run your own Copilot Camp workshop using our [Copilot Camp in a Box resources](https://microsoft.github.io/copilot-camp/pages/in-a-box/)! We've got you covered with presentation materials that even include embedded demos.



## 🚑 Issues

We really appreciate your feedback! Please use the [issues list](https://github.com/microsoft/copilot-camp/issues) to share your comments and issues, or if you're in Microsoft let us know in the "Copilot Developer Camp Early Testers" chat in Microsoft Teams. Thanks!


## 📜 Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

Resources:

- [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/)
- [Microsoft Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/)
- Contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with questions or concerns

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/index" />
