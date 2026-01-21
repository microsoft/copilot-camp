# Lab 10 : Connect Declarative Agent to OAuth-Protected MCP Server

In this lab, you'll run a **OAuth 2.0 protected** Model Context Protocol (MCP) server for Zava Insurance's claims system and integrate it with a Declarative Agent in Microsoft 365 Copilot. This builds on Lab 08 by adding **Microsoft Entra ID authentication** for secure, enterprise-grade access to claims data.




## Scenario

Building on the MCP server Lab 08, **Zava Insurance** now needs to secure their claims operations system for production use. While the anonymous MCP server was excellent for development and testing, the security team requires OAuth 2.0 authentication before deploying to production. The development team must now integrate **Microsoft Entra ID** authentication to ensure only authorized users can access sensitive claims data. This authenticated MCP server will validate JWT tokens, implement scope-based permissions, and comply with **RFC 9728** for protected resource metadata discovery, enabling secure integration with **Microsoft 365 Copilot** Declarative Agents.

---

## 🎯 Lab Objectives

By completing this lab, you will:

- Set up Microsoft Entra ID app registration for OAuth 2.0 authentication
- Configure environment variables for secure MCP server operation
- Build and run Zava's OAuth-protected MCP server
- Understand how JWT token validation works with Microsoft Entra ID
- Create a Declarative Agent that authenticates with the protected MCP server
- Test the agent with authenticated natural language queries

---

## 📚 Prerequisites

Before starting this lab, ensure you have:

- **Node.js 22+** installed on your machine
- **VS Code** with **Microsoft 365 Agents Toolkit extension** V 6.4.2 or higher
- **Microsoft 365 developer account** with Copilot license
- **Azure subscription** with access to Microsoft Entra ID (for app registration)
- Basic knowledge of **TypeScript/JavaScript**, **REST APIs**, **JSON**, and **OAuth 2.0**
- GitHub account for using VS Code tunneling
- Completion of **Lab 08** is recommended but not required

---

## Exercise 1: Set Up Your Development Environment

In this exercise, you'll clone Zava's authenticated MCP server codebase and set up your local development environment.

### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/microsoft/copilot-camp.git
cd src/extend-m365-copilot/path-e-lab10-mcp-auth/zava-mcp-server
```
<cc-end-step lab="e10" exercise="1" step="1" />

### Step 2: Install Dependencies

Install all required packages:

```bash
npm install
```

This installs key dependencies including:

- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `@azure/data-tables` - Azure Table Storage client
- `express` - HTTP server framework
- `zod` - Runtime type validation
- `jwt-validate` - JWT token validation with JWKS support

<cc-end-step lab="e10" exercise="1" step="2" />

### Step 3: Examine the Project Structure

Explore the codebase structure, open the project in VSCode by typing and enter:

```
code .
```

Key directories:

- `src/` - TypeScript source code
- `src/auth/` - **NEW**: OAuth authentication module
- `data/` - Sample JSON data files

Notice the new `src/auth/oauth.ts` file - this contains the OAuth 2.0 implementation for token validation and protected resource metadata.

<cc-end-step lab="e10" exercise="1" step="3" />

You have the code base ready with sample data and authentication support.

---

## Exercise 2: Create Microsoft Entra ID App Registration

Before running the authenticated MCP server, you need to register an application in Microsoft Entra ID to handle OAuth 2.0 authentication.

### Step 1: Create App Registration

1. Go to [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID** → **App registrations**
2. Click **New registration**
3. Configure:
   - **Name**: `Zava Claims MCP Server`
   - **Supported account types**: `Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)`
   - **Redirect URI**: Leave blank for now (we'll configure this in the next step)
4. Click **Register**
5. **Copy the Application (client) ID** - you'll need this later

<cc-end-step lab="e10" exercise="2" step="1" />

### Step 2: Configure Platform Redirect URIs

After registration, configure redirect URIs for different platforms:

1. Go to **Authentication** → **Platform configurations**

2. **Add a Web platform**:
   - Click **Add a platform** → **Web**
   - Add these redirect URIs:
     ```
     http://127.0.0.1:33418
     https://vscode.dev/redirect
     https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect
     ```
   - Under **Implicit grant and hybrid flows**, leave both options **unchecked** (disabled)
   - Click **Configure**

<cc-end-step lab="e10" exercise="2" step="2" />

### Step 3: Create Client Secret

1. Go to **Certificates & secrets** → **Client secrets**
2. Click **New client secret**
3. Add description (e.g., `zava-mcp-secret`) and select expiration (recommended: 24 months)
4. Click **Add**
5. **Copy the secret value immediately** - it won't be shown again!

<cc-end-step lab="e10" exercise="2" step="3" />

### Step 4: Expose an API

1. Go to **Expose an API**
2. Click **Set** next to **Application ID URI** and accept the default format: `api://your-client-id`
3. Click **Add a scope** and configure:
   - **Scope name**: `access_as_user`
   - **Who can consent**: Admins and users
   - **Admin consent display name**: `Read Zava as Admin`
   - **Admin consent description**: `Read Zava as Admin`
   - **User consent display name**: `Read Zava as User`
   - **User consent description**: `Read Zava as Admin`
   - **State**: Enabled
4. Click **Add scope**

<cc-end-step lab="e10" exercise="2" step="4" />

### Step 5: Verify API Permissions

1. Go to **API permissions**
2. Verify that **Microsoft Graph** → **User.Read** (delegated) is listed
3. This permission allows the app to sign in users and read their basic profile

Your Microsoft Entra ID app registration is now complete!

<cc-end-step lab="e10" exercise="2" step="5" />

---

## Exercise 3: Configure Environment and Start Local Database

In this exercise, you'll configure the OAuth environment variables and start the local database.

### Step 1: Set Up Public Access with Dev Tunnel

Before configuring environment variables, you need a public HTTPS URL for your MCP server.

1. In VS Code's terminal panel, locate the **Ports** tab
2. Click the **Forward a Port** button and enter port number `3001`
3. Right-click on the forwarded port address and select **Port Visibility** → **Public**
4. Copy the tunnel URL (e.g., `https://abc123def456.use.devtunnels.ms`)

Save this URL - you'll need it for the environment configuration.

<cc-end-step lab="e10" exercise="3" step="1" />

### Step 2: Configure Environment Variables

Create or update the `.env` file in the `zava-mcp-server` directory with your OAuth configuration:

```bash
# OAuth Configuration (Required for authentication)
OAUTH_CLIENT_ID=<your-application-client-id>
OAUTH_CLIENT_SECRET=<your-client-secret-value>
OAUTH_AUTHORITY=https://login.microsoftonline.com/common
OAUTH_REDIRECT_URI=http://localhost:6274/oauth/callback/debug
OAUTH_SCOPES=api://<your-application-client-id>/access_as_user

# Resource Identifier (for MCP Inspector and RFC 9728 metadata)
RESOURCE_IDENTIFIER=<your-tunnel-url>

# CORS Configuration
ADDITIONAL_ALLOWED_ORIGINS=<your-tunnel-url>,http://localhost:6274
SERVER_BASE_URL=<your-tunnel-url>

# Server Configuration
PORT=3001
HOST=127.0.0.1
NODE_ENV=development

# Storage Configuration
AZURE_STORAGE_CONNECTION_STRING=UseDevelopmentStorage=true
```

Replace the placeholders:
- `<your-application-client-id>` - Application (client) ID from Entra ID app registration
- `<your-client-secret-value>` - Client secret value you copied
- `<your-tunnel-url>` - Dev tunnel URL from Step 1 (e.g., `https://abc123def456.use.devtunnels.ms`)

<cc-end-step lab="e10" exercise="3" step="2" />

### Step 3: Start Azure Storage Emulator

In **Terminal 1**, start the Azurite emulator:

```bash
npm run start:azurite
```

You should see:
```
Azurite Blob service is starting at http://127.0.0.1:10000
Azurite Queue service is starting at http://127.0.0.1:10001
Azurite Table service is starting at http://127.0.0.1:10002
```

**Keep this terminal running** - it's your local database server.

<cc-end-step lab="e10" exercise="3" step="3" />

### Step 4: Load Sample Claims Data

In **Terminal 2**, initialize Zava's sample data:

```bash
npm run init-data
```

This loads realistic data including:

- **Claims**: Storm damage, water damage, fire damage cases
- **Contractors**: Roofing specialists, water restoration, general contractors
- **Inspections**: Scheduled and completed inspection tasks
- **Inspectors**: Available field inspectors with specialties

You should see confirmation messages for all tables being initialized.

<cc-end-step lab="e10" exercise="3" step="4" />

---

## Exercise 4: Launch the OAuth-Protected MCP Server

Now you'll start Zava's authenticated MCP server that validates OAuth tokens before allowing access.

### Step 1: Build and Start the MCP Server

In **Terminal 2** (keeping Azurite running in Terminal 1):

```bash
npm run build
npm run start:mcp-http
```

You should see a message indicating OAuth is enabled:
```
🚀 Zava Claims MCP HTTP Server started on 127.0.0.1:3001
Security: OAuth 2.0 authentication enabled
...
🔍 Protected Resource Metadata Endpoints (RFC 9728):
    GET  /.well-known/oauth-authorization-server - Standard OAuth metadata
...
```

<cc-end-step lab="e10" exercise="4" step="1" />

### Step 2: Verify OAuth is Enabled

Open a browser and visit:
```
http://127.0.0.1:3001/health
```

You should see a JSON response confirming OAuth is enabled:

```json
{
  "status": "healthy",
  "timestamp": "2025-01-21T10:00:00.000Z",
  "service": "zava-claims-mcp-server",
  "authentication": "OAuth enabled"
}
```

Notice the `"authentication": "OAuth enabled"` - this confirms the server is running in authenticated mode.

<cc-end-step lab="e10" exercise="4" step="2" />

### Step 3: Test OAuth Discovery Endpoint

Visit the OAuth discovery endpoint:
```
http://127.0.0.1:3001/.well-known/oauth-authorization-server
```

You should see OAuth metadata including:
- `issuer` - Your server's base URL
- `authorization_endpoint` - Microsoft login URL
- `token_endpoint` - Token exchange URL
- `scopes_supported` - Available OAuth scopes

This RFC 9728 compliant endpoint allows MCP clients to discover authentication requirements.

<cc-end-step lab="e10" exercise="4" step="3" />

### Step 4: Verify Authentication is Required

Try accessing the MCP tools without authentication:

```bash
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_claims","arguments":{}}'
```

You should receive a 401 Unauthorized response with a `WWW-Authenticate` header:

```json
{
  "error": "Missing Authorization header",
  "description": "Please include Bearer token in Authorization header",
  "auth_url": "https://your-tunnel-url/oauth/authorize",
  "resource_metadata_url": "https://your-tunnel-url/.well-known/oauth-authorization-server"
}
```

This confirms that authentication is working correctly.

<cc-end-step lab="e10" exercise="4" step="4" />

---


## Exercise 5: Create a New Declarative Agent Project

In this exercise, you'll use the Microsoft 365 Agents Toolkit to create a new Declarative Agent project that will connect to Zava's authenticated claims system.

### Step 1: Create New Agent using Microsoft 365 Agents Toolkit

1. Open a new window in **VS Code**
2. Click the **Microsoft 365 Agents Toolkit** icon in the Activity Bar (left sidebar)
3. Sign in with your Microsoft 365 developer account if prompted

#### Create New Agent Project

1. In the Agents Toolkit panel, click **"Create a New Agent/App"**
2. Select **"Declarative Agent"** from the template options
3. Next choose **"Add an Action"** to add to your agent
4. Next select **Start with an MCP server (preview)**
5. Enter the publicly accessible MCP Server URL from Exercise 3 (your tunnel URL + `/mcp/messages`)
6. Choose the Default folder to scaffold the agent (or choose a preferred location on your machine)
7. When prompted for project details:

   - **Application Name**: `Zava Claims Assistant (Auth)`

You will be directed to the newly created project which has the file `.vscode/mcp.json` open. This is the MCP server configuration file for VS Code to use.

//TODO: New DA steps for Auth
 
You now have a Declarative Agent connected to your OAuth-protected MCP Server.

<cc-end-step lab="e10" exercise="6" step="2" />

---

## Exercise 7: Configure the Agent for Authenticated Claims Operations

Transform the basic agent into Zava's secure claims assistant by configuring its identity, instructions, and capabilities.

### Step 1: Update Agent Identity and Description

Replace the content of `appPackage/declarativeAgent.json` with Zava's configuration:

```json
{
    "version": "v1.6",
    "name": "Zava Claims (Secure)",
    "description": "A secure, OAuth-authenticated insurance claims management assistant that leverages protected MCP server integration to streamline inspection workflows, analyze damage patterns, coordinate contractor services, and generate comprehensive operational reports for efficient claims processing",
    "instructions": "$[file('instruction.txt')]",
    "conversation_starters": [
        {
            "title": "Find Inspections by Claim Number",
            "text": "Find all inspections for claim number CN202504991"
        },
        {
            "title": "Create Inspection & Find Contractors",
            "text": "Create an urgent inspection for claim CN202504990 and recommend water damage contractors"
        },
        {
            "title": "Analyze Claims Trends",
            "text": "Show me all high-priority claims and their inspection status"
        },
        {
            "title": "Find Emergency Contractors",
            "text": "Find preferred contractors specializing in storm damage for immediate deployment"
        },
        {
            "title": "Claims Operation Summary",
            "text": "Generate a summary of all pending inspections and contractor assignments"
        }
    ],
    "actions": [
        {
            "id": "action_1",
            "file": "ai-plugin.json"
        }
    ]
}
```

<cc-end-step lab="e10" exercise="7" step="1" />

### Step 2: Create Detailed Agent Instructions

Update `appPackage/instruction.txt` with comprehensive instructions for the agent:

```plaintext
# Zava Claims Operations Assistant (Secure)

## Role
You are an intelligent, OAuth-authenticated insurance claims management assistant with secure access to the Zava Claims Operations MCP Server. Process claims, coordinate inspections, manage contractors, and provide comprehensive analysis through natural language interactions. All operations are authenticated and audited for security compliance.

## Security Context
- All requests are authenticated using OAuth 2.0 with Microsoft Entra ID
- User identity and permissions are validated before each operation
- Operations are logged for audit and compliance purposes

## Core Functions

### Claims Management
- Retrieve and analyze all claims using natural language queries
- Get specific claim details by claim number or partial information
- Create new insurance claims with complete documentation
- Update existing claim information and status
- Use fuzzy matching for partial claim information to help users find what they need

### Inspection Operations
- Filter inspections by claim ID, status, priority, or workload
- Retrieve detailed inspection data and schedules
- Create new inspection tasks with appropriate priority levels
- Modify existing inspection details and assignments
- Access inspector availability and specialties
- Automatically determine priorities: safety hazards = 'urgent', water damage = 'high', routine = 'medium'

### Contractor Services
- Find contractors by specialty, location, and preferred status
- Access contractor ratings, availability, and past performance
- Coordinate contractor assignments with inspection schedules
- Track purchase orders and contractor costs

## Decision Framework

### For Inspections:
1. Assess urgency based on damage type and safety requirements
2. Select appropriate task type: 'initial', 'reinspection', 'emergency', 'final'
3. Generate detailed instructions with specific focus areas
4. Consider inspector specialties and contractor availability for scheduling

### For Claims Analysis:
1. Prioritize safety-related issues (structural damage, water intrusion)
2. Group similar damage types for efficient processing
3. Identify patterns that might indicate fraud or systemic issues
4. Recommend preventive measures based on damage trends

## Response Guidelines

**Always Include:**
- Relevant claim numbers and context
- Clear next steps and action items
- Priority levels and urgency indicators
- Safety risk assessments when applicable

**For Complex Requests:**
1. Break down the request into specific components
2. Retrieve relevant claim and inspection data
3. Execute appropriate MCP server functions
4. Provide integrated analysis with actionable recommendations
5. Suggest follow-up actions or monitoring

**Communication Style:**
- Professional yet approachable for insurance professionals
- Use industry terminology appropriately
- Provide clear explanations for complex procedures
- Always prioritize customer service and regulatory compliance
```

<cc-end-step lab="e10" exercise="7" step="2" />

### Step 3: Update the Teams App Manifest

Open `appPackage/manifest.json` and update it with Zava's branding:

```json
{
    "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.23/MicrosoftTeams.schema.json",
    "manifestVersion": "1.23",
    "version": "1.0.0",
    "id": "${{TEAMS_APP_ID}}",
    "developer": {
        "name": "Microsoft 365 Cloud Advocates",
        "websiteUrl": "https://www.zavainsurance.com",
        "privacyUrl": "https://www.zavainsurance.com/privacy",
        "termsOfUseUrl": "https://www.zavainsurance.com/terms"
    },
    "icons": {
        "color": "color.png",
        "outline": "outline.png"
    },
    "name": {
        "short": "Zava Claims (Secure)",
        "full": "Zava Insurance Claims Assistant (OAuth Protected)"
    },
    "description": {
        "short": "A secure, OAuth-authenticated insurance claims management assistant",
        "full": "An AI-powered, OAuth 2.0 authenticated claims management assistant that leverages protected MCP server capabilities to streamline inspection workflows, coordinate contractors, and provide comprehensive operational insights for efficient claims processing with enterprise-grade security."
    },
    "accentColor": "#0078D4",
    "composeExtensions": [],
    "copilotAgents": {
        "declarativeAgents": [
            {
                "id": "declarativeAgent",
                "file": "declarativeAgent.json"
            }
        ]
    },
    "permissions": [
        "identity",
        "messageTeamMembers"
    ],
    "validDomains": []
}
```

Your agent now has a clear identity as Zava's secure claims assistant with OAuth authentication.

<cc-end-step lab="e10" exercise="7" step="3" />

---

## Exercise 8: Test the Authenticated Agent Integration

Test your Declarative Agent to ensure it can successfully authenticate and communicate with the OAuth-protected MCP server.

### Step 1: Ensure MCP Server is Running

Before testing, make sure your MCP server from previous exercises is still running:

1. Open the window where zava-mcp-server project is running
2. In the terminal, verify Azurite is running: `npm run start:azurite`
3. Verify MCP server is running: `npm run start:mcp-http`
4. Verify the Dev Tunnel port forwarding is active

<cc-end-step lab="e10" exercise="8" step="1" />

### Step 2: Provision the Agent

In VS Code with your `zava-claims-agent` project open:

1. Open the **Microsoft 365 Agents Toolkit** panel
2. Click **"Provision"** in the Lifecycle section


//TODO: Add steps to create oauth config for DA using ATK



<cc-end-step lab="e10" exercise="8" step="2" />

### Step 3: Test in Microsoft 365 Copilot

1. Open Copilot using URL https://m365.cloud.microsoft/chat/
2. Under Agents on left hand side, find **Zava Claims (Secure)** agent, and select it.
3. Try the conversation starters:
   - "Find all inspections for claim number CN202504991"
   - "Show me all high-priority claims and their inspection status"

<cc-end-step lab="e10" exercise="8" step="3" />

### Step 4: Test Natural Language Queries

Try these natural language queries to test the agent's authenticated capabilities:

```
What claims do we have for storm damage?
```


Your agent should successfully respond to natural language queries through the authenticated MCP server.

<cc-end-step lab="e10" exercise="8" step="4" />

### Step 5: Debug the Agent

1. In the chat with the Zava Claims (Secure) agent, send message `-developer on`
2. This will enable debugging of these conversations
3. Continue testing the agent with queries

Analyze debugger information in the Agent debug info panel at the end of each agent response.

<cc-end-step lab="e10" exercise="8" step="5" />

---

## 🎉 Congratulations!

You've successfully created and deployed Zava Insurance's **OAuth-protected** Declarative Agent that securely integrates with their authenticated MCP server. 

### What You Accomplished

- ✅ Created a Microsoft Entra ID app registration for OAuth 2.0
- ✅ Configured environment variables for secure authentication
- ✅ Ran an OAuth-protected MCP server with JWT token validation
- ✅ Tested RFC 9728 compliant OAuth discovery endpoints
- ✅ Created a Declarative Agent with authenticated MCP integration
- ✅ Tested secure natural language queries with claims data

### Key Differences from Lab 08

| Aspect | Lab 08 (Anonymous) | Lab 10 (Authenticated) |
|--------|-------------------|----------------------|
| Authentication | None - all endpoints public | OAuth 2.0 with Microsoft Entra ID |
| Token Validation | None | JWT validation against JWKS |
| Security Headers | None | WWW-Authenticate with metadata URLs |
| Discovery | None | RFC 9728 protected resource metadata |
| Enterprise Ready | Development only | Production-ready security |

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extent/10-mcp-auth" />

### 🔗 Additional Resources

- **MCP Protocol Documentation**: [https://modelcontextprotocol.io/](https://modelcontextprotocol.io/)
- **Microsoft Entra ID Documentation**: [https://docs.microsoft.com/en-us/azure/active-directory/](https://docs.microsoft.com/en-us/azure/active-directory/)
- **RFC 9728 - OAuth 2.0 Protected Resource Metadata**: [https://datatracker.ietf.org/doc/html/rfc9728](https://datatracker.ietf.org/doc/html/rfc9728)
- **Azure Table Storage**: [Azure Documentation](https://docs.microsoft.com/en-us/azure/storage/tables/)
