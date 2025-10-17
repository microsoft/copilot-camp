# Repair Service Agent - Microsoft 365 Copilot Declarative Agent

The Repair Service Agent is a specialized Microsoft 365 Copilot declarative agent designed to help users manage car repair records and maintenance tasks. This agent provides an intuitive interface for tracking repairs, generating reports, and maintaining service history through natural language interactions.

## Features

The Repair Service Agent provides the following capabilities:

### Core Functionality
- **Repair Management**: Create, update, and delete repair records
- **Repair Tracking**: List and search repair records by assigned user
- **Report Generation**: Use code interpreter to generate reports based on repair data
- **Visual Cards**: Display repair information in rich adaptive cards with images

### Repair Record Fields
Each repair record includes:
- **Title**: Short summary of the repair
- **Description**: Detailed description of the repair work
- **Assigned To**: User responsible for the repair
- **Date**: Scheduled or completion date (ISO 8601 format)
- **Image**: URL to associated repair images

### Conversation Starters
- "List all repairs" - View all repair records
- "Create a new repair titled '[repair name]' and assign it to me" - Quick repair creation

### Integration
- Connects to the Repairs API at `https://repairshub.azurewebsites.net`
- Displays rich adaptive cards with repair details and images
- Supports natural language interactions for all repair operations

## Get started with the Repair Service Agent

> **Prerequisites**
>
> To run this app template in your local dev machine, you will need:
>
> - [Node.js](https://nodejs.org/), supported versions: 18, 20, 22
> - A [Microsoft 365 account for development](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts).
> - [Microsoft 365 Agents Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.0.0 and higher or [Microsoft 365 Agents Toolkit CLI](https://aka.ms/teamsfx-toolkit-cli)
> - [Microsoft 365 Copilot license](https://learn.microsoft.com/microsoft-365-copilot/extensibility/prerequisites#prerequisites)



1. First, select the Microsoft 365 Agents Toolkit icon on the left in the VS Code toolbar.
2. In the Account section, sign in with your [Microsoft 365 account](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts) if you haven't already.
3. Run `npm install` to install dependencies before working with TypeSpec files.
4. Update the [`main.tsp`](./main.tsp) to configure your agent and its plugins. This is the default entry point for TypeSpec files. 
5. Create app by clicking `Provision` in "Lifecycle" section.
6. Select `Preview in Copilot (Edge)` or `Preview in Copilot (Chrome)` from the launch configuration dropdown.
7. Once the Copilot agent is loaded in the browser, click on the "…" menu and select "Copilot chats". You will see the Repair Service Agent on the right rail. Clicking on it will change the experience to showcase the repair service branding.
8. Try these example interactions with your repair service agent:
   - "List all repairs"
   - "Create a new repair for oil change and assign it to John"
   - "Show me repairs assigned to Sarah"
   - "Generate a report of all completed repairs"
   - "Update repair #123 to mark it as completed"

## What's included in the template

| Folder       | Contents                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------- |
| `.vscode`    | VSCode files for debugging                                                               |
| `appPackage` | Application manifest and adaptive card templates for repair display                     |
| `env`        | Environment configuration files                                                          |

The following files can be customized and demonstrate the repair service implementation:

| File                               | Contents                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `appPackage/manifest.json`         | Application manifest defining the Repair Service Agent metadata             |
| `appPackage/cards/repair.json`     | Adaptive card template for displaying repair records with images            |

The following are Microsoft 365 Agents Toolkit specific project files:

| File           | Contents                                                                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `m365agents.yml` | Main Microsoft 365 Agents Toolkit project configuration file with properties and stage definitions                                       |

The following are TypeSpec files that define the repair service functionality:

| File          | Contents                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------- |
| `main.tsp`    | Root TypeSpec file defining the Repair Service Agent with instructions and conversation starters |
| `actions.tsp` | API endpoints and data models for repair operations (CRUD operations for repair records)   |


### Advanced Features
- [Add web content search](https://learn.microsoft.com/microsoft-365-copilot/extensibility/build-declarative-agents?tabs=ttk&tutorial-step=4) for repair documentation
- [Integrate OneDrive/SharePoint](https://learn.microsoft.com/microsoft-365-copilot/extensibility/build-declarative-agents?tabs=ttk&tutorial-step=5) for repair manuals and documentation
- [Add Microsoft Copilot Connectors](https://learn.microsoft.com/microsoft-365-copilot/extensibility/build-declarative-agents?tabs=ttk&tutorial-step=6) for enterprise repair management systems

## API Reference

The Repair Service Agent uses the following API endpoints:

### Repair Operations
- **GET /repairs**: List all repairs (optionally filtered by `assignedTo`)
- **POST /repairs**: Create a new repair record
- **PATCH /repairs**: Update an existing repair record  
- **DELETE /repairs**: Delete a repair record

### Repair Data Model
```typescript
{
  id?: string;           // Unique identifier (auto-generated)
  title: string;         // Required: Short summary
  description?: string;  // Detailed description
  assignedTo?: string;   // User assigned to repair
  date?: string;        // ISO 8601 date-time format
  image?: string;       // URL to repair image
}
```

## Additional Information and References

- [Declarative agents for Microsoft 365](https://aka.ms/teams-toolkit-declarative-agent)
- [Microsoft 365 Agents Toolkit](https://aka.ms/teams-toolkit)
- [TypeSpec for Microsoft 365 Copilot](https://learn.microsoft.com/microsoft-365-copilot/extensibility/overview-declarative-agent)
- [Adaptive Cards Documentation](https://adaptivecards.io/)
- [Repair Hub API](https://repairshub.azurewebsites.net) - The backend service for this agent
