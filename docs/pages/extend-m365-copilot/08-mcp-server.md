# Lab 08 : Connect Declarative agent to MCP Server

<div data-widget="hero"
    data-badge="Bundle A/B · Lab E8"
    data-badge-color="teal"
    data-icon="🔌"
    data-title="Connect Declarative Agent to MCP Server"
    data-subtitle="Run Zava's MCP server locally, expose claims tools, and wire a Declarative Agent to invoke them in natural language."
    data-time="90-120 min"
    data-toolkit="MCP SDK + Agents Toolkit"></div>

<div data-widget="checklist"
    data-items="MCP server running with seeded claims data~Azurite and server runtime verified locally|Tool metadata fetched into agent package~ai-plugin.json generated and validated|Copilot tool-calling flow working~Natural language prompts invoke MCP tools correctly"></div>

## Key concepts before you build

<div data-widget="concepts"
    data-cards="MCP tool contract::teal::Typed tool interface for agents::The server exposes tools with structured schemas so Copilot can choose and call them reliably.||Manifest synchronization::green::Fetch actions into ai-plugin.json::The agent relies on fetched tool metadata; refresh it whenever server tools change.||Local-to-cloud bridge::amber::Dev tunnel enables host reachability::Copilot runs in the cloud, so your local MCP server must be reachable through a public HTTPS tunnel."></div>

In this lab, you'll run a complete Model Context Protocol (MCP) server for Zava Insurance's claims system and integrate it with Declarative Agent in Microsoft 365 Copilot that you will create, enabling natural language interactions with real claims data through secure, standardized AI agent communication.


<div class="lab-intro-video">
    <div style="flex: 1; max-width:650px;">
        <iframe  src="//www.youtube.com/embed/vbkcntieMmI" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>Get a quick overview of the lab in this video.</div>          
    </div>
        <div style="flex: 1; min-width: 0;">
  ---8<--- "e-labs-prelude.md"
    </div>

</div>



## Scenario

<div data-widget="arch"
    data-rows="row::Claims Adjuster::tunnel::&quot;Show me urgent storm damage claims&quot;|Microsoft 365 Copilot::copilot::Routes query to your Declarative Agent||label::Declarative Agent reads ai-plugin.json → calls MCP tools over HTTPS via Dev Tunnel||row::Declarative Agent::agent::declarativeAgent.json + instruction.txt|Dev Tunnel::tunnel::Public HTTPS ↔ localhost:3001||label::MCP server handles tool calls → reads claims data from Azurite||row::MCP Server (Node.js)::mcp::15 claims tools · runs on your machine|Azurite::data::Claims · Inspections · Contractors"></div>

---

## Exercise 1: Set Up Your Development Environment

In this exercise, you'll clone Zava's MCP server codebase and set up your local development environment.

<div data-widget="callout"
    data-type="info"
    data-title="Exercise outcome"
    data-body="By the end of this exercise, your local project is cloned, dependencies are installed, and you are ready to run the MCP stack."></div>

### Step 1: Clone the Repository

Open your terminal and run: 

```bash
git clone https://github.com/microsoft/copilot-camp.git
cd copilot-camp/src/extend-m365-copilot/path-e-lab08-mcp-server/zava-mcp-server
```

<cc-end-step lab="e8" exercise="1" step="1" />

### Step 2: Install Dependencies

Install all required packages:

```bash
npm install
```

This installs key dependencies:

- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `@azure/data-tables` - Azure Table Storage client
- `express` - HTTP server framework
- `zod` - Runtime type validation

<cc-end-step lab="e8" exercise="1" step="2" />

### Step 3: Examine the Project Structure

Explore the codebase structure, open the project in VSCode by typing and enter

```
code .
```

Key directories:

- `src/` - TypeScript source code
- `data/` - Sample JSON data files

<cc-end-step lab="e8" exercise="1" step="3" />

You have the code base ready with sample data. 

---

## Exercise 2: Start Zava's Local Claims Database

Zava uses Azure Table Storage for their claims database. In this exercise, you'll start a local emulator and load sample data.

<div data-widget="callout"
    data-type="concept"
    data-title="Exercise outcome"
    data-body="By the end of this exercise, Azurite is running and the sample claims dataset is loaded into local tables."></div>

### Step 1: Start Azure Storage Emulator

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
<cc-end-step lab="e8" exercise="2" step="1" />

### Step 2: Load Sample Claims Data

In **Terminal 2**, initialize Zava's sample data:

```bash
npm run init-data
```

This loads realistic data including:

- **Claims**: Storm damage, water damage, fire damage cases
- **Contractors**: Roofing specialists, water restoration, general contractors
- **Inspections**: Scheduled and completed inspection tasks
- **Inspectors**: Available field inspectors with specialties

<cc-end-step lab="e8" exercise="2" step="2" />

## Step 3: Verify Data Loading

Check the console output. You should see:
```
🚀 Starting data initialization...
📋 Initializing table: claims
✅ Table 'claims' created or already exists
📄 Loaded 2 items from claims.json
✅ Upserted entity: CN202504990
✅ Upserted entity: CN202504991
✅ Completed initialization for table: claims
📋 Initializing table: inspections
✅ Table 'inspections' created or already exists
📄 Loaded 2 items from inspections.json
✅ Upserted entity: insp-001
✅ Upserted entity: insp-002
.....
✅ Upserted entity: po-001
✅ Upserted entity: po-002
✅ Completed initialization for table: purchaseOrders
🎉 Data initialization completed successfully!
✨ All tables initialized successfully
```


Your local claims database is now running with sample data that mirrors Zava's production environment.

<cc-end-step lab="e8" exercise="2" step="3" />


---


## Exercise 3: Launch the MCP Server

Now you'll start Zava's MCP server that enables AI agents to interact with the claims system.

<div data-widget="callout"
    data-type="info"
    data-title="Exercise outcome"
    data-body="By the end of this exercise, the MCP server is live and health/docs/tools endpoints are reachable."></div>



### Step 1: Start the MCP Server

In **Terminal 2** (keeping Azurite running in Terminal 1):

```bash
npm run start:mcp-http
```

You should see a message as below (parts of the message):
```
🚀 Zava Claims MCP HTTP Server started on 127.0.0.1:3001 
...
```


<cc-end-step lab="e8" exercise="3" step="1" />

### Step 2: Test Server Health

Open a new browser tab and visit:
```
http://127.0.0.1:3001/health
```

You should see a JSON response confirming the server is healthy in the browser.

```json
{"status":"healthy","timestamp":"2025-11-11T01:46:11.618Z","service":"zava-claims-mcp-server","authentication":"No authentication"}
```

<cc-end-step lab="e8" exercise="3" step="2" />

### Step 3: Explore Available Endpoints

Visit these URLs to explore the API:

- **Health Check**: `http://127.0.0.1:3001/health`
- **API Documentation**: `http://127.0.0.1:3001/docs`
- **MCP Tools List**: `http://127.0.0.1:3001/tools`

Your MCP server is now running and ready. 

<cc-end-step lab="e8" exercise="3" step="3" />

---

## Exercise 4: Test AI Agent Interactions

Experience how AI agents interact with Zava's claims system using the MCP Inspector tool.

<div data-widget="callout"
    data-type="tip"
    data-title="Exercise outcome"
    data-body="By the end of this exercise, you can run MCP tools in Inspector and expose your local server through a public Dev Tunnel URL."></div>

### Step 1: Launch MCP Inspector

In **Terminal 3**, start the interactive MCP testing tool:

```bash
npm run inspector
```

This opens a web interface where you can test MCP tools as if you were an AI agent.

<cc-end-step lab="e8" exercise="4" step="1" />

### Step 2: Explore Available Tools

In the MCP Inspector interface, you'll see **15 tools** available to AI agents:

**Claims Management Tools:**

- `get_claims` - List all insurance claims
- `get_claim` - Get specific claim details
- `create_claim` - File a new claim
- `update_claim` - Update claim status
- `delete_claim` - Close/delete claims

**Inspection Tools:**

- `get_inspections` - List inspection tasks
- `create_inspection` - Schedule new inspections
- `update_inspection` - Update inspection status

**Contractor & Inspector Tools:**

- `get_contractors` - Find contractors by specialty
- `get_inspectors` - List available inspectors

<cc-end-step lab="e8" exercise="4" step="2" />

### Step 3: Test the "Get Claims" Tool

1. Click on `get_claims` tool
2. Click **"Run Tool"** (no parameters needed)
3. Observe the JSON response with Zava's current claims

You should see claims like:
```json
{
  "id": "1",
  "claimNumber": "CN202504990", 
  "policyHolderName": "John Smith",
  "property": "123 Main St, Seattle, WA 98101",
  "status": "Open - Claim is under investigation",
  "damageTypes": ["Roof damage - moderate severity", "Storm damage"],
  "estimatedLoss": 15000
}
```

![image of mcp inspector tool interacting with zava mcp server](../../assets/images/extend-m365-copilot-08/mcp-inspector.png)

<cc-end-step lab="e8" exercise="4" step="3" />

### Step 4: Set Up Public Access with Dev Tunnel

Copilot runs in the cloud, so your local MCP server needs a public HTTPS address it can reach. VS Code's built-in Dev Tunnel creates one in seconds.

<div data-widget="callout"
    data-type="concept"
    data-title="Why HTTPS and not HTTP?"
    data-body="Copilot is a cloud service — it cannot reach &lt;code&gt;localhost&lt;/code&gt;. A Dev Tunnel gives your local port 3001 a public &lt;code&gt;https://…devtunnels.ms&lt;/code&gt; address. HTTPS is also required for CORS and matches production deployment patterns."></div>

#### 1: Forward port 3001

1. In VS Code, open the **Ports** tab (in the terminal panel)
2. Click **Forward a Port**, enter `3001`, and press Enter

####  2: Make it public

1. Right-click the new port entry → **Port Visibility** → **Public**
2. Sign in with your GitHub account if prompted
3. Copy the forwarded address — it looks like `https://abc123def456.use.devtunnels.ms`

Save this URL. It will be referred to as `<tunnel-url>` throughout the rest of this lab.

<div data-widget="callout"
    data-type="warn"
    data-title="Tunnels expire on VS Code restart"
    data-body="You will need to recreate the tunnel each new session and update &lt;code&gt;package.json&lt;/code&gt;'s inspector script with the new URL."></div>

#### 3: Update the inspector script in package.json

Open **package.json** in the `zava-mcp-server` directory and update the `inspector` script:

```json
"inspector": "npx @modelcontextprotocol/inspector --transport http --server-url <tunnel-url>/mcp/messages"
```

Replace `<tunnel-url>` with your actual tunnel address. Keep a copy of `<tunnel-url>/mcp/messages` — this is your public MCP endpoint for agent integration.

If the inspector is running, stop it (`Ctrl+C`) and restart:

```bash
npm run inspector
```

The MCP Inspector now connects through your public tunnel. Test the available tools to confirm data flows end-to-end.

<cc-end-step lab="e8" exercise="4" step="4" />

---

## Exercise 5: Create a New Declarative Agent Project

In this exercise, you'll use the Microsoft 365 Agents Toolkit to create a new Declarative Agent project that will connect to Zava's claims system.

<div data-widget="callout"
    data-type="info"
    data-title="Exercise outcome"
    data-body="By the end of this exercise, you have a scaffolded Declarative Agent project with MCP actions fetched into ai-plugin.json."></div>

### Step 1: Create New Agent using Microsoft 365 Agents Toolkit

1. Open a new window in **VS Code**
2. Click the **Microsoft 365 Agents Toolkit** icon in the Activity Bar (left sidebar)
3. Sign in with your Microsoft 365 developer account if prompted

#### Create New Agent Project

1. In the Agents Toolkit panel, click **"Create a New Agent/App"**
2. Select **"Declarative Agent"** from the template options
3. Next choose **"Add an Action"** to add to your agent
4. Next select **Start with an MCP server**
5. Enter the publicly accessible MCP Server URl from previous exercise
6. Choose the Default folder to scaffold the agent (or choose a preferred location in your machine)
7. When prompted for project details:

   - **Application Name**: `Zava Claims Assistant`

You will be directed to the newly created project which has the file `.vscode/mcp.json` open. This is the MCP server configuration file for VS Code to use.

- Select **Start** button to fetch tools from your server.
- Once started you will see the number of tools and prompts available 1️⃣. 
- Select **ATK:Fetch action from MCP** 2️⃣ to select tools you want to add to the agent. 

![image ATK picking mcp tools](../../assets/images/extend-m365-copilot-08/atk.png)

!!! note "Don't see the ATK: Fetch action from MCP option?"
    If you don't see the **ATK: Fetch action from MCP** option, try restarting VS Code and reopening the project.

- When you select  **ATK:Fetch action from MCP**, you will be asked to provide the action manifest, select **ai-plugin.json**.
- Select the tools you want to add to the agent. Let's select 10 tools for now.

    - create_claim
    - create_inspection
    - get_claim
    - get_claims
    - get_contractors
    - get_inspection
    - get_inspections
    - update_claim
    - update_inspection
    - get_inspectors

This step will populate the action manifest **ai-plugin.json** with the required functions, MCP server url, etc. that is needed for actions in an agent.

<cc-end-step lab="e8" exercise="5" step="1" />

### Step 2: Understand the Action manifest update from previous step

Open `appPackage/ai-plugin.json` and examine the structure with your chosen tools and MCP server url pre-populated:

```json
{
     "$schema": "https://aka.ms/json-schemas/copilot-extensions/v2.1/plugin.schema.json",
    "schema_version": "v2.4",
    "name_for_human": "Zava Claims Assistant",
    "description_for_human": "Zava Claims Assistant${{APP_NAME_SUFFIX}}",
    "contact_email": "publisher-email@example.com",
    "namespace": "zavaclaimsassistant",
    "functions": [
        {
            "name": "create_claim",
            "description": "Create a new insurance claim",
            "parameters": {
                ...
}
```

You now have a basic Declarative Agent that is connected to your MCP Server with 10 tools ready for use.


<cc-end-step lab="e8" exercise="5" step="2" />

---

## Exercise 6: Configure the Agent for Zava's Claims Operations

Transform the basic agent into Zava's intelligent claims assistant by configuring its identity, instructions,  capabilities, and conversation starters.

<div data-widget="callout"
    data-type="concept"
    data-title="Exercise outcome"
    data-body="By the end of this exercise, your agent has a finalized persona, conversation starters, and manifest metadata for Zava claims operations."></div>

### Step 1: Update Agent Identity and Description

Replace the content of `appPackage/declarativeAgent.json` with Zava's configuration:

```json
{
    "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.7/schema.json",
    "version": "v1.7",
    "name": "Zava Claims",
    "description": "An intelligent insurance claims management assistant that leverages MCP server integration to streamline inspection workflows, analyze damage patterns, coordinate contractor services, and generate comprehensive operational reports for efficient claims processing",
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

<cc-end-step lab="e8" exercise="6" step="1" />

### Step 2: Create Detailed Agent Instructions

Update `appPackage/instruction.txt` with comprehensive instructions for the agent:

```plaintext
# Zava Claims Operations Assistant

## Role
You are an intelligent insurance claims management assistant with access to the Zava Claims Operations MCP Server. Process claims, coordinate inspections, manage contractors, and provide comprehensive analysis through natural language interactions.

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

!!! warning "Responsible AI Content Guidelines"
    If you encounter errors indicating that your "Declarative Copilot content violates Responsible AI guidelines", try simplifying the instructions. Remove complex role-playing scenarios, reduce detailed procedural steps, or use more neutral language. Start with basic task descriptions and gradually add complexity until you identify what triggers the violation.
    
<cc-end-step lab="e8" exercise="6" step="2" />

### Step 3: Update the Teams App Manifest

Open `appPackage/manifest.json` and update it with Zava's branding:

```json

    "name": {
        "short": "Zava Claims",
        "full": "Zava Insurance Claims Assistant"
    },
    "description": {
        "short": "An intelligent insurance claims management assistant",
        "full": "An AI-powered claims management assistant that leverages MCP server capabilities to streamline inspection workflows, coordinate contractors, and provide comprehensive operational insights for efficient claims processing."
    },
  
```

Your agent now has a clear identity as Zava's claims assistant with comprehensive instructions.
<cc-end-step lab="e8" exercise="6" step="3" />

---


## Exercise 7: Test the Agent Integration

Test your Declarative Agent to ensure it can successfully communicate with the MCP server and handle claims operations.

<div data-widget="callout"
    data-type="tip"
    data-title="Exercise outcome"
    data-body="By the end of this exercise, you can validate end-to-end tool calls in Copilot and inspect agent behavior using developer debugging."></div>

### Step 1: Ensure MCP Server is Running

Before testing, make sure your MCP server from previous exercise is still running:

1. Open the window where zava-mcp-server project is running
2. In the terminal, verify Azurite is running: `npm run start:azurite`
3. Verify MCP server is running: `npm run start:mcp-http`

<cc-end-step lab="e8" exercise="7" step="1" />

### Step 2: Provision the Agent

In VS Code with your `zava-claims-agent` project open:

1. Open the **Microsoft 365 Agents Toolkit** panel
2. Click **"Provision"** in the Lifecycle section
3. Wait for provisioning to complete - this creates and uploads the agent package

<cc-end-step lab="e8" exercise="7" step="2" />

### Step 3: Test in Microsoft 365 Copilot

Now validate that your provisioned agent appears in Copilot and can call MCP-backed tools.

1. Open Microsoft 365 Copilot: https://m365.cloud.microsoft/chat/
2. In the left pane, under **Agents**, select **Zava Claims**.
3. Run these conversation starters:
    - `Find all inspections for claim number CN202504991`
    - `Show me all high-priority claims and their inspection status`

Expected result: the agent responds with claims/inspection data from your MCP server, not a generic answer.

  <cc-end-step lab="e8" exercise="7" step="3" />

### Step 4: Test Natural Language Queries

Try these natural language queries to test the agent's capabilities:

```
What claims do we have for storm damage?
```

```
Create a new urgent inspection for claim CN202504990 to assess water damage in the basement
```

```
Find contractors who specialize in roofing and are marked as preferred
```

```
Show me the details for claim number CN202504991
```

```
Create a new claim for Alice Johnson at 456 Oak Street with fire damage from yesterday
```

Your agent should successfully respond to natural language queries and interact with the MCP server data.

<cc-end-step lab="e8" exercise="7" step="4" />


### Step 5: Debug the agent 

1. In the chat with the Zava Claims agent, send message `-developer on`
2. This will enable debugging of these conversations 
3. Continue testing the agent with queries  

Analyze debugger information in the Agent debug info panel at the end of each agent response. 

![agent debugger](../../assets/images/extend-m365-copilot-08/agent-debugger.png)

---8<--- "e-congratulations.md"

<div data-widget="labnav"></div>

<cc-award badgeId="DeclarativePioneer" badgeName="Declarative Pioneer" />
<cc-award badgeId="MCPIntegrator" badgeName="MCP Integrator" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extent/08-mcp-server" />
