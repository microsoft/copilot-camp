# Geo Locator Game

## Overview

Welcome to the Geo Locator Game! In this interactive geo-location guessing game, you, as the game host, will guide players through a series of clues about a specific city. The goal is to help players guess the city based on the clues you provide. The game features progressive clues, and in special rounds, players will engage with PDF files to enhance their experience.

## Getting Started

To set up and run the Geo Locator Game, follow these instructions:

### Prerequisites

Ensure you have the following prerequisites:

- [Node.js](https://nodejs.org/), supported versions: 16, 18
- A [Microsoft 365 account for development](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts)
- [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.0.0 or higher, or [Teams Toolkit CLI](https://aka.ms/teamsfx-toolkit-cli)
- [Copilot for Microsoft 365 license](https://learn.microsoft.com/microsoft-365-copilot/extensibility/prerequisites#prerequisites)

### Setup

1. Open Visual Studio Code and select the Teams Toolkit icon from the left toolbar.
2. Sign in with your [Microsoft 365 account](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts) if you haven’t already.
3. Copy file **.env.dev.sample** and paste in folder **env** and rename to `.env.dev`. Populate your tenant name for the `TENANT_NAME` value of the env file. Eg if you have a SharePoint site `https://XYZ.sharepoint.com/sites/contoso`, **XYZ** is the TENANT_NAME.
4. Create a new Teams app by clicking `Provision` in the "Lifecycle" section.
5. From the launch configuration dropdown, choose either `Preview in Copilot (Edge)` or `Preview in Copilot (Chrome)`.
6. When the Copilot app loads in the browser. Your declarative agent will appear in the right rail under "Extensions".
7. Interact with your agent and observe its responses based on the configurations.

## Template Contents

The template includes the following structure:

| Folder       | Contents                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------- |
| `.vscode`    | VSCode configuration files for debugging.                                               |
| `appPackage` | Templates for the Teams application manifest, GPT manifest, and API specifications.       |
| `env`        | Environment-specific files.                                                                |

### Customizable Files

| File                                 | Description                                                                                   |
| ------------------------------------ | --------------------------------------------------------------------------------------------- |
| `appPackage/declarativeCopilot.json` | Configuration file defining settings of the declarative agent.            |
| `appPackage/instruction.txt` | Instruction file defining system prompt          |
| `appPackage/manifest.json`           | Teams application manifest outlining metadata for your declarative agent.                  |

### Teams Toolkit Files

| File           | Description                                                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `teamsapp.yml` | Main Teams Toolkit project file defining properties and configuration stages. For a complete guide, visit the [Teams Toolkit guide](https://github.com/OfficeDev/TeamsFx/wiki/Teams-Toolkit-Visual-Studio-Code-v5-Guide#overview). |

## Additional Information and References

- [Extend Microsoft Copilot for Microsoft 365](https://aka.ms/teamsfx-copilot-plugin)


---

Feel free to adjust the content to better fit the specifics of your game and project setup!


