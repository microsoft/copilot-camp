# Access Request & Approval Workflow — MCP App

An MCP (Model Context Protocol) server that implements a multi-stage employee access request and approval workflow. Employees request system access, and managers and IT admins review and approve or reject requests — all from within an MCP-compatible host like VS Code Copilot Chat.

![MCP](https://img.shields.io/badge/MCP-1.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-22+-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)

---

## Features

- **Multi-stage approval pipeline** — Requested → Manager Review → IT Review → Granted/Rejected
- **Interactive UI panels** — Rich React-based forms and dashboards served as MCP app resources
- **6 supported systems** — GitHub, SAP, Production Database, Azure DevOps, Salesforce, Jira
- **Persistent storage** — Azure Table Storage (Azurite emulator for local dev)

---

## Architecture

```
┌──────────────────────────────────────────────────┐
│  MCP Host (e.g. VS Code Copilot Chat)            │
│                                                  │
│  ┌─────────────┐ ┌──────────────┐                │
│  │ Request Form │ │ Approval     │                │
│  │   (React)    │ │ Panel (React)│                │
│  └──────┬───────┘ └──────┬───────┘                │
│         │                │                        │
│         └────────┬───────┘                        │
│                  │ callServerTool                  │
└──────────────────┼────────────────────────────────┘
                   ▼
         ┌─────────────────────────────────┐
         │     MCP Server (Express)        │
         │     POST /mcp                   │
         │                                 │
         │  Tools: submit-request          │
         │         submit-decision         │
         │         get-request             │
         └──────────────┬──────────────────┘
                        │
                        ▼
              ┌───────────────────┐
              │  Azure Table      │
              │  Storage          │
              │  (Azurite local)  │
              └───────────────────┘
```

---

## Prerequisites

- **Node.js** 22 or later
- **npm** 10 or later

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the Azurite storage emulator

In a separate terminal:

```bash
npm run start:azurite
```

This starts the Azure Table Storage emulator on `http://127.0.0.1:10002`. Data is stored in the `.azurite/` directory.

### 3. Seed sample data (optional)

```bash
npm run seed
```

Loads three sample requests (REQ-001 through REQ-003) from `fixtures/` so you can explore the app immediately.

### 4. Build and run

```bash
npm start
```

The MCP server starts at **`http://localhost:3001/mcp`**.



---

## Development

Start the dev server with hot reload for both UI and backend:

```bash
npm run dev
```

This runs concurrently:
- **UI watcher** — Rebuilds HTML bundles on file changes in `ui/` and `src/`
- **Server watcher** — Restarts the MCP server on backend file changes

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Full build + start the server |
| `npm run build` | Type-check, build UI bundles, compile server TypeScript |
| `npm run serve` | Run the already-built server |
| `npm run dev` | Watch mode with hot reload |
| `npm run start:azurite` | Start Azurite Table Storage emulator |
| `npm run seed` | Seed sample data into Azurite |

---

## MCP Tools

### Frontend Tools (return interactive UI)

#### `request-access`

Opens the access request form for employees.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `employeeName` | string | No | Pre-fill the employee name |
| `employeeEmail` | string | No | Pre-fill the employee email |

**Example prompt:** _"I need to request access to GitHub"_

#### `approve-access`

Opens the approval panel for managers and IT admins to review pending requests.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `requestId` | string | No | View a specific request, or leave blank to see all pending |

**Example prompt:** _"Show me pending access requests to approve"_

### Backend Tools (called by UI widgets)

| Tool | Parameters | Description |
|---|---|---|
| `submit-request` | `employeeName`, `employeeEmail`, `system`, `role`, `justification` | Creates a new access request |
| `submit-decision` | `requestId`, `decision` (approve/reject), `reviewer`, `comment` | Records an approval or rejection |
| `get-request` | `requestId` | Fetches a single request by ID |

---

## Workflow Stages

Each access request progresses through these stages:

```
┌───────────┐    ┌────────────────┐    ┌────────────┐    ┌─────────┐
│ Requested │───▶│ Manager Review │───▶│ IT Review  │───▶│ Granted │
└───────────┘    └───────┬────────┘    └─────┬──────┘    └─────────┘
                         │                   │
                         ▼                   ▼
                    ┌──────────┐        ┌──────────┐
                    │ Rejected │        │ Rejected │
                    └──────────┘        └──────────┘
```

1. **Requested** — Employee submits the form
2. **Manager Review** — Direct manager approves or rejects
3. **IT Review** — IT admin performs final review
4. **Granted** — Access is provisioned
5. **Rejected** — Request denied (can happen at either review stage)

---

## Supported Systems and Roles

| System | Available Roles |
|---|---|
| GitHub | Read, Write, Admin |
| SAP | Finance Viewer, Finance Editor, Admin |
| Production Database | Read-Only, Read-Write, DBA |
| Azure DevOps | Reader, Contributor, Project Admin |
| Salesforce | Viewer, Editor, Admin |
| Jira | Viewer, Developer, Project Lead |

---

## Data Model

### Access Request

```json
{
  "id": "REQ-001",
  "employeeName": "Alice Johnson",
  "employeeEmail": "alice@contoso.com",
  "system": "GitHub",
  "role": "Write",
  "justification": "Need write access for the frontend repo",
  "status": "Manager Review",
  "createdAt": "2026-03-31T10:00:00.000Z",
  "updatedAt": "2026-03-31T10:00:00.000Z",
  "timeline": [
    {
      "stage": "Requested",
      "status": "completed",
      "actor": "Alice Johnson",
      "timestamp": "2026-03-31T10:00:00.000Z"
    },
    {
      "stage": "Manager Review",
      "status": "current",
      "timestamp": "2026-03-31T10:00:00.000Z"
    }
  ]
}
```

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | HTTP server port | `3001` |
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Table Storage connection string | Azurite local default |
| `NODE_ENV` | Set to `development` for watch mode | — |

---

## Project Structure

```
├── main.ts                  # Express app entry point, /mcp endpoint
├── server.ts                # MCP server definition, tool/resource registration
├── mock-data/
│   └── requests.ts          # Data access layer (Azure Table Storage)
├── src/
│   ├── global.css           # Shared styles
│   ├── request-form/
│   │   └── App.tsx          # Employee request form UI
│   └── approval-panel/
│       └── App.tsx          # Manager/admin approval panel UI
├── ui/
│   ├── request-form.html    # Entry HTML for request form
│   └── approval-panel.html  # Entry HTML for approval panel
├── fixtures/
│   ├── access-requests.json # Sample request data for seeding
│   └── counters.json        # Counter seed data
├── scripts/
│   └── seed-data.ts         # Seed script for loading fixtures
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config (type-checking)
├── tsconfig.server.json     # TypeScript config (server compilation)
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| MCP Framework | `@modelcontextprotocol/sdk`, `@modelcontextprotocol/ext-apps` |
| Server | Express 5, TypeScript |
| UI | React 19, Fluent UI React v9 |
| Storage | Azure Table Storage (`@azure/data-tables`) |
| Local Emulator | Azurite |
| Build | Vite, `vite-plugin-singlefile` |
| Validation | Zod |
