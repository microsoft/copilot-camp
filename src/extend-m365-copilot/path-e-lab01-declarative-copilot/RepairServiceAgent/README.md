# RepairServiceAgent - A Declarative Agent for Car Repair Management

The RepairServiceAgent is a specialized Microsoft 365 Copilot agent built with TypeSpec that helps users manage car repair records and maintenance tasks. This agent provides a conversational interface for creating, updating, viewing, and deleting repair items while also offering advanced reporting capabilities through code interpretation.

## What the RepairServiceAgent Can Do

### 🔧 Core Repair Management Features
- **List Repairs**: View all repair records, optionally filtered by assigned user
- **Create Repairs**: Add new repair items with title, description, assignment, and scheduling
- **Update Repairs**: Modify existing repair records
- **Delete Repairs**: Remove repair items from the system
- **Visual Cards**: Display repair information using rich Adaptive Cards with images

### 📊 Advanced Capabilities
- **Code Interpreter**: Generate reports and analytics based on repair data
- **Smart Defaults**: Automatically use title as description and today's date when creating repairs if not provided
- **User-Friendly Interface**: No technical jargon or code exposure to end users

### 💬 Conversation Starters
The agent comes with pre-configured conversation starters to help users get started:
- "List repairs" - View all current repairs
- "Create repair" - Add a new repair with guided prompts

## Get started with the template

> **Prerequisites**
>
> To run this app template in your local dev machine, you will need:
>
> - [Node.js](https://nodejs.org/), supported versions: 18, 20, 22
> - A [Microsoft 365 account for development](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts).
> - [Microsoft 365 Agents Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.0.0 and higher or [Microsoft 365 Agents Toolkit CLI](https://aka.ms/teamsfx-toolkit-cli)
> - [Microsoft 365 Copilot license](https://learn.microsoft.com/microsoft-365-copilot/extensibility/prerequisites#prerequisites)

![image](./assets/image.png)

### Setup Instructions

1. First, select the Microsoft 365 Agents Toolkit icon on the left in the VS Code toolbar.
2. In the Account section, sign in with your [Microsoft 365 account](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts) if you haven't already.
3. Run `npm install` to install dependencies before working with TypeSpec files.
4. The agent is pre-configured with repair management capabilities in [`main.tsp`](./main.tsp) and [`actions.tsp`](./actions.tsp).
5. Create app by clicking `Provision` in "Lifecycle" section.
6. Select `Preview in Copilot (Edge)` or `Preview in Copilot (Chrome)` from the launch configuration dropdown.
7. Once the Copilot agent is loaded in the browser, click on the "…" menu and select "Copilot chats". You will see your RepairServiceAgent on the right rail.
8. Try these sample interactions:
   - "List all repairs"
   - "Create a new repair for brake replacement"
   - "Show me repairs assigned to John"
   - "Generate a report of this month's repairs"

## What's included in the template

| Folder       | Contents                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------- |
| `.vscode`    | VSCode files for debugging                                                               |
| `appPackage` | Application manifest, Adaptive Cards templates, and build artifacts                     |
| `env`        | Environment files                                                                        |
| `assets`     | Images and other assets                                                                  |
| `http`       | HTTP test files for API endpoints                                                       |

### Key Files for RepairServiceAgent

| File                               | Contents                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `main.tsp`                         | Main TypeSpec file defining the RepairServiceAgent with instructions and conversation starters |
| `actions.tsp`                      | TypeSpec definitions for repair management API endpoints and data models |
| `appPackage/manifest.json`         | Application manifest defining the agent metadata and permissions |
| `appPackage/adaptiveCards/repair.json` | Adaptive Card template for displaying repair information visually |
| `m365agents.yml`                   | Microsoft 365 Agents Toolkit project configuration file |

### Data Model
The RepairServiceAgent works with repair items that include:
- **ID**: Unique identifier (auto-generated)
- **Title**: Short summary of the repair
- **Description**: Detailed repair information
- **Assigned To**: User responsible for the repair
- **Date**: Scheduled or completion date (ISO 8601 format)
- **Image**: Optional image URL for visual context

### API Integration
The agent connects to a repair service API hosted at `https://repairshub.azurewebsites.net` providing:
- RESTful endpoints for CRUD operations
- Rich card displays with images
- User assignment and filtering capabilities

## Example Interactions

### Creating a Repair
**User**: "Create a new repair for oil change assigned to me"
**Agent**: Creates a repair with title "oil change", uses today's date, and assigns to the current user

### Listing Repairs
**User**: "Show me all repairs assigned to John"
**Agent**: Displays repairs filtered by assignee using rich Adaptive Cards

### Reporting
**User**: "Generate a report showing repair trends this month"
**Agent**: Uses code interpreter to analyze repair data and create visual reports

## Extend the RepairServiceAgent

You can customize this agent further by:

- **Adding new repair categories**: Extend the data model in `actions.tsp`
- **Custom conversation starters**: Add more prompts in `main.tsp`
- **Enhanced reporting**: Modify agent instructions for specific analytics
- **Integration with other systems**: Add new API endpoints for parts inventory, scheduling, etc.
- **Custom Adaptive Cards**: Design new card templates for different repair types

## Additional Information and References

- [Declarative agents for Microsoft 365](https://aka.ms/teams-toolkit-declarative-agent)
- [TypeSpec for Microsoft 365 Copilot](https://learn.microsoft.com/microsoft-365-copilot/extensibility/overview-typespec)
- [Building Declarative Agents](https://learn.microsoft.com/microsoft-365-copilot/extensibility/build-declarative-agents)
- [Microsoft 365 Agents Toolkit](https://aka.ms/teams-toolkit)