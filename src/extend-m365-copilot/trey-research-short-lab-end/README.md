# Trey Research - Consultant Management Agent

A declarative agent for Trey Research consultancy that helps manage consultants, projects, and time tracking through Microsoft 365 Copilot. Built with Azure Functions and API plugins.

## What It Does

**Trey Genie** assists consultants with:
- 🔍 Finding consultants by skills, certifications, roles, or availability
- 👤 Viewing your profile and project assignments
- ⏱️ Charging time to projects
- 📊 Tracking hours forecast and delivered

## Prerequisites

- [Node.js](https://nodejs.org/) 18, 20, or 22
- [Microsoft 365 account](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts) with [Copilot license](https://learn.microsoft.com/microsoft-365-copilot/extensibility/prerequisites#prerequisites)
- [Microsoft 365 Agents Toolkit](https://aka.ms/teams-toolkit) v5.0.0+ for VS Code
- [Azurite](https://github.com/Azure/Azurite) for local Azure Table Storage emulation

## Quick Start

1. Open Microsoft 365 Agents Toolkit in VS Code sidebar
2. Sign in with your Microsoft 365 account
3. Select `Debug in Copilot (Edge)` or `Debug in Copilot (Chrome)` or select F5
4. Choose **Trey Genie** from Copilot
5. Try: *"Find consultants with TypeScript skills"*

## Project Structure

```
src/
├── functions/           Azure Functions endpoints
│   ├── consultants.ts   GET consultants with filters
│   └── me.ts           GET user profile, POST charge time
├── services/           Business logic and data access
└── model/             TypeScript interfaces

appPackage/
├── trey-plugin.json            Plugin manifest with API functions
├── trey-declarative-agent.json Agent configuration & instructions
├── apiSpecificationFile/       OpenAPI spec for REST API
└── adaptiveCards/              Response UI templates
```

## API Functions

| Function | Method | Description |
|----------|--------|-------------|
| `getConsultants` | GET | Search consultants by name, project, skills, certifications, role, or availability |
| `getUserInformation` | GET | Get logged-in user's profile and project assignments |
| `postBillhours` | POST | Charge hours to a project (requires confirmation) |

## Key Files

| File | Purpose |
|------|---------|
| `src/functions/consultants.ts` | Consultant search endpoint with multi-filter support |
| `src/functions/me.ts` | User profile and time tracking endpoint |
| `appPackage/trey-plugin.json` | Defines API functions, adaptive cards, and conversation starters |
| `appPackage/trey-declarative-agent.json` | Agent personality, instructions, and capabilities |
| `scripts/db-setup.js` | Initializes Azure Table Storage with sample data |
| `m365agents.yml` | Microsoft 365 Agents Toolkit configuration |

## Development

**Build & Watch**
```bash
npm run build        # Compile TypeScript
npm run watch        # Watch mode for development
```

**Local Storage**
```bash
npm run storage              # Start Azurite emulator
npm run reset-local-db       # Reset database with sample data
```

**Data Models**
- Consultants, Projects, and Assignments stored in Azure Table Storage
- See `src/model/` for TypeScript interfaces
- Sample data in `scripts/db/` (JSON files)

## Customization

- **Add functions**: Extend `src/functions/` and update `appPackage/trey-plugin.json`
- **Modify agent behavior**: Edit instructions in `appPackage/trey-declarative-agent.json`
- **Update UI**: Customize adaptive cards in `appPackage/adaptiveCards/`
- **Change data**: Modify sample data in `scripts/db/*.json`

## Resources

- [Declarative Agents](https://aka.ms/teams-toolkit-declarative-agent)
- [API Plugins](https://learn.microsoft.com/microsoft-365-copilot/extensibility/build-declarative-agents?tabs=ttk&tutorial-step=7)
- [Adaptive Cards](https://adaptivecards.io/)
- [Azure Functions TypeScript](https://docs.microsoft.com/azure/azure-functions/functions-reference-node)
