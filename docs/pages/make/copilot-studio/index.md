
# Lab MCS - Understanding Microsoft Copilot Studio

With Microsoft Copilot Studio you have the maximum potential for making custom agents. You can use it to create agents that you can host in multiple different channels like Microsoft Teams, custom web sites, Skype, Slack, etc. You can also host your agents in Microsoft 365 Copilot chat.

Copilot Studio agents use the same infrastructure, orchestrator, foundation model, and security controls as Microsoft 365 Copilot, which ensures a consistent and familiar user experience.

![Copilot Studio agent architecture diagram. At the very basis there is the foundational model, which is provided by Microsoft Copilot Studio, but you can customize it. The orchestrator is provided by Copilot Studio. The agent provides also custom knowledge and grounding data, custom skills, and autonomous capabilities. The user experience is provided in Microsoft Teams, Microsoft 365 Copilot, Microsoft SharePoint Online, and much more.](../../../assets/images/copilot-studio-agent.png)

The knowledge base can be:

- SharePoint Online
- OneDrive for Business
- Public web sites
- Microsoft Dataverse tables
- Power Platform connectors
- etc.

Agents interact with users through topics, which can define single-turn or multi-turn conversations with the user.
Every agent can have custom actions to interact with Power Automate flows, Power Platform connectors, external REST APIs, etc.
Generally speaking, with Copilot Studio you can create really powerful agents without the need to write any line of code.

![The UI of Microsoft Copilot Studio when creating a new agent. It prompts the user for a name, logo, description, instructions in natural language, etc.](../../../assets/images/make-global-intro/copilot-studio-01.png)

In order to use Copilot Studio, you need a user license (also known as _per user license_) for each user creating or maintaining an agent. Moreover, you need an organization level license for Copilot Studio (also known as _tenant license_). Starting December 1, 2024, Pay-As-You-Go is supported for Copilot Studio messages, which allows customers flexibility to only pay for the message capacity they consume.

<hr />

---8<--- "mcs-labs-toc.md"

## <a href="./00-prerequisites">Start here</a> with Lab MCS0, where you'll set up your environment for Copilot Studio.

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/agent-builder/index" />