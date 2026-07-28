# Welcome to Copilot Developer Camp!

This repo is for hosting a virtual workshop for developers who want to build agents and connectors for Microsoft 365 Copilot.

Please visit Copilot Developer Camp at [https://aka.ms/copilotdevcamp](https://aka.ms/copilotdevcamp)

## Learning Paths

Copilot Developer Camp offers multiple hands-on learning paths depending on your role and scenario:

### 🧩 Extend Microsoft 365 Copilot (Declarative Agents)

Build declarative agents that focus Copilot on your business data. From no-code to pro-code, you'll define instructions, knowledge sources, and actions — while Copilot handles orchestration and reasoning.

**On-ramp (required):** Start with E1A (Agent Builder, no-code) or E1B (Agents Toolkit, pro-code), then complete Prerequisites before choosing a bundle.

| Bundle | Focus | What you'll build |
|---|---|---|
| **A — MCP Foundation** | Build & secure an MCP server | OAuth 2.0 + Entra ID secured MCP tools with least-privilege access |
| **B — Multi-Agent Workflows** | Orchestrate multiple agents | Coordinated multi-agent flows with role-based handoffs |
| **C — MCP App** | Rich interactive UI on MCP | React + Fluent UI widgets for actionable responses (portable across MCP hosts) |
| **D — API-Based Agent** | Call custom APIs via plugins | API plugin from OpenAPI spec with auth and real external operations |
| **E — Copilot Connectors** | Enterprise data grounding | Connector-grounded responses anchored in organizational data |

- [**Start the labs →**](https://microsoft.github.io/copilot-camp/pages/extend-m365-copilot/)

### 🤖 Build Custom Engine Agents

Full control over the foundation model, orchestrator, and security stack. Choose between two paths:

| Path | Stack | Description |
|---|---|---|
| [M365 Agents SDK + Semantic Kernel](https://microsoft.github.io/copilot-camp/pages/custom-engine/agents-sdk/) | C# | Start in Microsoft Foundry, then build with the Agents SDK and Semantic Kernel for multi-step reasoning across Teams and Copilot Chat |
| [Agent Framework](https://microsoft.github.io/copilot-camp/pages/custom-engine/agent-framework/) | C# | Build a production-ready insurance claims agent from scratch with document search, vision analysis, and auth |

### 🤝 Copilot Cowork (Extensibility)

Extend Copilot Cowork — an orchestrator that goes beyond chat to execute multi-step, cross-app workflows across Microsoft 365. Learn how to configure your tenant, build skills and plugins, and add SSO-secured extensibility.

- [**Start the labs →**](https://microsoft.github.io/copilot-camp/pages/copilot-cowork/)

### 📄 SharePoint Agents & Copilot Apps

Build agents grounded in SharePoint content or create SharePoint Copilot Apps that bring rich, interactive experiences to SharePoint Online.

- [**Start the labs →**](https://microsoft.github.io/copilot-camp/pages/sharepoint/)



We'd love it if you would test out the [Copilot Developer Camp](https://aka.ms/copilotdevcamp) labs, and very much appreciate your feedback! Please use the [issues list](https://github.com/microsoft/copilot-camp/issues) to share your comments and issues.

You can also join the community, by simply introducing yourself, sharing ideas and connecting with other members in [Copilot Developer Camp Discussions](https://github.com/microsoft/copilot-camp/discussions/328) 🎉!

Watch the Microsoft 365 Copilot: Developer Camp on-demand to learn more about Copilot Agents: [Microsoft 365 Copilot: Developer Camp Playlist 🎉](https://youtube.com/playlist?list=PLlrxD0HtieHiMCKFMGsGFX9oZEwDQtFIT&si=OpsV43XZ5YAhbJOI)

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.

## Getting Help

If you get stuck or have any questions about building AI apps, join:

[![Azure AI Foundry Discord](https://img.shields.io/badge/Discord-Azure_AI_Foundry_Community_Discord-blue?style=for-the-badge&logo=discord&color=5865f2&logoColor=fff)](https://aka.ms/foundry/discord)

If you have product feedback or errors while building visit:

[![Azure AI Foundry Developer Forum](https://img.shields.io/badge/GitHub-Azure_AI_Foundry_Developer_Forum-blue?style=for-the-badge&logo=github&color=000000&logoColor=fff)](https://aka.ms/foundry/forum)

## Check typos in a Markdown page

To check typos in a single `.md` file (similar to quick local validation while editing pages):

```bash
python -m pip install -r requirements.txt
python scripts/check_md_typos.py docs/pages/extend-m365-copilot/index.md
```

Optional flags:

- `--fix` to apply auto-corrections where possible.
- `--ignore-words-file scripts/typo-ignore-words.txt` to load ignored terms from a text file (one word per line).
- `--ignore-words-list "word1,word2"` to add extra ignored words ad-hoc.
- `--known-typos-only` to use only `codespell` built-in typo dictionary.

Example with custom ignore file:

```bash
python scripts/check_md_typos.py docs/pages/extend-m365-copilot/index.md --ignore-words-file scripts/typo-ignore-words.txt
```
