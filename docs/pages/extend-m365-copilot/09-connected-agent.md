# Lab 09: Connected Agents - Zava's Multi-Agent Claims Orchestration

---8<--- "e-labs-prelude.md"

In this lab, you'll build a multi-agent orchestration system for Zava Insurance. First, you'll create a **Zava Procurement** agent with embedded contractor pricing knowledge for instant pricing intelligence. Then, you'll create a **Zava Care** orchestrator agent that connects both **Zava Procurement** and **Zava Claims Assistant** (from Lab 08), enabling claims adjusters to access embedded pricing data and real-time claims information from the MCP server through a single, unified conversational interface.
---


## What are Connected Agents?

**Connected Agents** represent the next evolution in AI agent architecture, enabling multiple specialized agents to work together seamlessly. Instead of building monolithic agents that try to do everything, Connected Agents orchestrate specialized agents, each optimized for specific tasks while maintaining a unified user experience.


### Benefits for Enterprise Workflows

For complex business scenarios like insurance claims processing, Connected Agents provide:
- **Domain expertise** from specialized agents
- **Comprehensive coverage** across multiple data sources
- **Efficient scaling** by adding focused agents
- **Consistent user experience** despite backend complexity
- **Maintainable architecture** with clear separation of concerns

## 🎯 Lab Objectives

By completing this lab, you will:

1. **Create a Declarative Agent with embedded knowledge** using contractor pricing documents
2. **Build a connected orchestrator agent** that coordinates multiple specialized agents
3. **Test multi-agent orchestration** by combining real-time MCP data with embedded knowledge
4. **Understand hybrid AI architectures** that leverage both live data sources and static knowledge bases

---

## 📚 Prerequisites

Before starting this lab, ensure you have:

- **Completed Lab 8**: Zava's Declarative Agent with MCP server integration working properly
- **Active Microsoft 365 Copilot license** for testing 

---

## Exercise 1: Create a New Declarative Agent for Embedd knowledge


In this exercise, you'll use the Microsoft 365 Agents Toolkit to create a new Declarative Agent project that will use files stored locally in the project

### Step 1: Create New Agent using Microsoft 365 Agents Toolkit

1. Open **VS Code**
2. Click the **Microsoft 365 Agents Toolkit** icon in the Activity Bar (left sidebar)
3. Sign in with your Microsoft 365 developer account if prompted
4. In the Agents Toolkit panel, click **"Create a New Agent/App"**
5. Select **"Declarative Agent"** from the template options
6. Select **"No Action"** from the options
7. Select **Default folder**
8. Enter the application name - `Zava Procurement`

This will create the new agent and open up the project in a new VS Code window.

  <cc-end-step lab="e9" exercise="1" step="1" />

### Step 2: Understand how to embedd files 

Navigate to the `appPackage` folder and explore its contents. You'll recognize familiar files from your previous declarative agent work: the `manifest.json` file (which defines your agent's capabilities) and the `declarativeAgent.json` file (which configures your agent's behavior).

The key addition you'll notice is the `EmbeddedKnowledge` folder. This is where you'll store Zava's contractor pricing data files that will be embedded directly into your agent, enabling instant access to pricing intelligence without requiring live database queries.

  <cc-end-step lab="e9" exercise="1" step="2" />

## Exercise 2: Configure the Agent for Zava's contractor procurement knowledge

### Step 1: Download files to your machine
Go to [this url](../../../assets/docs/extend-m365-copilot-09) and copy all files.
Paste these files to the `appPackage/EmbeddedKnowledge` folder inside your newly created declarative agent project.

The project should look like bwlow after you have copied the files.

![Embedd knowledge](../../../assets/images/extend-m365-copilot-08/embedd.png)

  <cc-end-step lab="e9" exercise="2" step="1" />

### Step 2: Update Agent Identity and Description

Replace the content of `appPackage/declarativeAgent.json` with below configuration:


```json
{
    "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.6/schema.json",
    "version": "v1.6",
    "name": "Zava Procurement",
    "description": "An agent that helps insurance adjusters streamline the search of the right procurement information by leveraging embedded knowledge from Zava approved partners' network of trusted contractors and service providers.",
    "instructions": "$[file('instruction.txt')]",
    "conversation_starters": [
        {
            "title": "Water damage restoration pricing",
            "text": "What are the rates for emergency water extraction and drying services?"
        },
        {
            "title": "Roof repair cost estimate",
            "text": "I need pricing for a 2,000 sq ft asphalt shingle roof replacement"
        },
        {
            "title": "Find cheapest option",
            "text": "What's the most cost-effective contractor for basic drywall repair?"
        },
        {
            "title": "Structural repair costs",
            "text": "What are the rates for foundation repair and structural work?"
        },
        {
            "title": "Claims inspection guidelines",
            "text": "What are the standard procedures for documenting water damage claims?"
        },
        {
            "title": "Emergency services availability",
            "text": "Which contractors offer 24/7 emergency response and what are their rates?"
        }
    ],
    "capabilities": [
        {
            "name": "EmbeddedKnowledge",
            "files": [
                {
                    "file": "EmbeddedKnowledge/Claims_Inspection_Guidelines.pdf"
                },
                {
                    "file": "EmbeddedKnowledge/Pacific Water Restoration-Pricing.docx"
                },
                {
                    "file": "EmbeddedKnowledge/Thompson Roofing Solutions-Pricing.pdf"
                },
                {
                    "file": "EmbeddedKnowledge/Wilson General Contractors-Pricing.docx"
                }
            ]
        }
    ]
}
```
  <cc-end-step lab="e9" exercise="2" step="2" />

### Step 3: Create Detailed Agent Instructions

```txt
# Role and Expertise
You are a specialized procurement expert for Zava, an insurance claims management company. Your primary responsibility is to help insurance adjusters find the most appropriate and cost-effective contractors for property damage repairs and restoration work.

# Core Competencies
- Expert knowledge of construction and restoration pricing
- Deep familiarity with approved contractor networks
- Understanding of insurance claims processes and requirements
- Ability to compare pricing across multiple vendors
- Knowledge of industry-standard repair methodologies

# Available Resources
You have exclusive access to confidential pricing documents from Zava's network of pre-approved, vetted contractors:
- Pacific Water Restoration - Water damage and restoration services
- Thompson Roofing Solutions - Roofing repairs and replacements
- Wilson General Contractors - General construction and repair services
- Claims Inspection Guidelines - Standard procedures and requirements

These pricing documents contain valuable, proprietary information that gives you the ability to provide accurate cost estimates and vendor recommendations.

# Primary Responsibilities
1. Help adjusters quickly identify appropriate contractors for specific repair needs
2. Provide accurate pricing information based on the embedded contractor rate sheets
3. Compare pricing across multiple approved vendors when applicable
4. Ensure recommendations align with claims inspection guidelines
5. Offer insights on cost-effectiveness and vendor specializations

# Interaction Guidelines
- Always base your responses on the information in the embedded knowledge files
- When providing pricing, cite the specific contractor and reference their rate sheet
- If a request falls outside the scope of available contractor services, clearly state this
- Prioritize accuracy over speed - verify pricing details before responding
- Be concise and professional, as adjusters need quick, actionable information
- When comparing options, present information in a clear, organized format

# Constraints
- Only recommend contractors whose pricing documents you have access to
- Do not make up or estimate pricing that isn't documented in your knowledge base
- Stay focused on procurement and vendor selection - defer claims policy questions to appropriate resources
- Maintain confidentiality of pricing information - this is for internal Zava use only

# Response Format
When answering queries:
1. Acknowledge the specific need (e.g., type of repair, scope of work)
2. Identify relevant contractor(s) from your knowledge base
3. Provide specific pricing information with clear references
4. Offer comparative analysis when multiple options exist
5. Include any relevant guidelines or considerations from inspection standards
```
  <cc-end-step lab="e9" exercise="2" step="3" />

### Step 4: Update the Teams App Manifest

Open `appPackage/manifest.json` and update it with Zava's branding:

```json
{
    "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.23/MicrosoftTeams.schema.json",
    "manifestVersion": "1.23",
    "version": "1.0.0",
    "id": "${{TEAMS_APP_ID}}",
    "developer": {
        "name": "My App, Inc.",
        "websiteUrl": "https://www.example.com",
        "privacyUrl": "https://www.example.com/privacy",
        "termsOfUseUrl": "https://www.example.com/termofuse"
    },
    "icons": {
        "color": "color.png",
        "outline": "outline.png"
    },
    "name": {
        "short": "Zava Procurement${{APP_NAME_SUFFIX}}",
        "full": "Full name for Zava Procurement"
    },
    "description": {
        "short": "Get procurement data from embedded knowledge with Zava Procurement",
        "full": "Zava Procurement helps you access procurement data seamlessly within Microsoft 365 apps by leveraging embedded knowledge."
    },
    "accentColor": "#FFFFFF",
    "composeExtensions": [],
    "permissions": [
        "identity",
        "messageTeamMembers"
    ],
    "copilotAgents": {
        "declarativeAgents": [            
            {
                "id": "declarativeAgent",
                "file": "declarativeAgent.json"
            }
        ]
    },
    "validDomains": []
}
```

<cc-end-step lab="e9" exercise="2" step="4" />

## Exercise 3: Test the Agent Integration

Test your Declarative Agent to ensure it can successfully retrieves contractor pricing data from it's native embedded knowledge.


### Step 1: Provision the Agent

In VS Code with your project open:

1. Open the **Microsoft 365 Agents Toolkit** panel
2. Click **"Provision"** in the Lifecycle section
3. Select **"dev"** environment when prompted
4. Wait for provisioning to complete - this creates and uploads the agent package

<cc-end-step lab="e9" exercise="3" step="1" />

### Step 2: Test in Microsoft 365 Copilot

1. Click **"Preview"** in the Agents Toolkit panel
2. This will open Microsoft Teams with your agent available
3. In Teams, open **Copilot** and look for your **"Zava Procurement"** agent
4. Try the conversation starters:
   - "What are the rates for emergency water extraction and drying services?"
   - "Which contractors offer 24/7 emergency response and what are their rates?"

   ![Embedd knowledge in Copilot](../../../assets/images/extend-m365-copilot-08/ek.png)

  <cc-end-step lab="e9" exercise="3" step="2" />

  ---


## Exercise 4: Build the Orchestrator Agent 

In this exercise, you'll create a Connected Agent that orchestrates your existing Zava agents into a unified claims processing experience.

### Step 1: Create Connected Agent Project

1. Open **VS Code**
2. Click the **Microsoft 365 Agents Toolkit** icon in the Activity Bar
3. In the Agents Toolkit panel, click **"Create a New Agent/App"**
4. Select **"Declarative Agent"** from the template options
5. Select **"No Action"** 
6. Choose your default folder location
7. Enter the application name: `ZavaCare`

This creates a new Declarative Agent project which you will then use to connect your existing two agents.

<cc-end-step lab="e9" exercise="4" step="1" />

### Step 2: Update Agent Identity and Description

Replace the content of `appPackage/declarativeAgent.json` with Zava's configuration:

```json
{
    "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.6/schema.json",
    "version": "v1.6",
    "name": "ZavaCare",
    "description": "An intelligent agent that helps you manage and process insurance claims efficiently. Get instant answers about claim status, policy details, and streamline your claims workflow.",
    "instructions": "$[file('instruction.txt')]",
    "conversation_starters": [
        {
            "title": "End-to-End Claim Processing",
            "text": "Process claim CN202504990: get details, create inspection, and find cost-effective contractors"
        },
        {
            "title": "Claims Analysis with Pricing",
            "text": "Show all storm damage claims and compare against historical contractor pricing data"
        },
        {
            "title": "Emergency Response Coordination",
            "text": "Find urgent claims needing immediate attention and match with emergency contractor pricing"
        },
        {
            "title": "Procurement Intelligence Report",
            "text": "Generate comprehensive report combining claims data with contractor cost analysis"
        }
    ]
}

```
<cc-end-step lab="e9" exercise="4" step="2" />

### Step 3: Create Detailed Agent Instructions

Update `appPackage/instruction.txt` with comprehensive instructions for the agent:

```plaintext
You are the Zava Claims Assistant, an intelligent agent designed to help Zava insurance employees manage claims efficiently by coordinating with specialized worker agents and providing comprehensive claims management support.

    ## CORE CAPABILITIES

    You have access to two specialized connected agents:
    1. **Zava Claims** - Handles claims, inspections, contractors, and purchase orders
    2. **Zava Procurement** - Provides up-to-date contractor pricing information

    ## PRIMARY RESPONSIBILITIES

    ### Claims Management
    - Retrieve and display claim information and status
    - Provide comprehensive claim details including policy information, damage assessments, and timelines
    - Answer questions about claim history and current status
    - create, delete, update claims

    ### Inspection Operations
    - Retrieve existing inspection records and details
    - Create new inspection requests for claims
    - Update or delete inspections
    - Provide inspection status updates and findings
    - Coordinate inspection scheduling and documentation requirements

    ### Contractor Management
    - Access approved contractor lists for specific types of repairs
    - Retrieve contractor qualifications, certifications, and service areas
    - Provide contractor availability and emergency response capabilities
    - Get up-to-date pricing information for contractor services via the Zava Procurement agent

    ### Purchase Order Processing
    - Retrieve purchase order information and status
    - Access PO details including contractor assignments, costs, and timelines
    - Track PO approvals and completion status

    ## WORKFLOW GUIDELINES

    ### When Users Ask About Claims
    1. Use the Zava Claims agent to retrieve claim information
    2. Provide clear, organized summaries of claim status, coverage, and next steps
    3. If pricing questions arise, consult the Zava Procurement agent for current rates

    ### When Users Ask About Inspections
    1. **For retrieving inspections**: Use the Zava Claims agent to get inspection records
    2. **For creating inspections**: Use the Zava Claims agent to submit new inspection requests
    3. Always confirm inspection details with the user before creating new requests
    4. Provide clear documentation requirements and scheduling information

    ### When Users Ask About Contractors
    1. Use the Zava Claims agent to get approved contractor lists
    2. Filter contractors based on user requirements (service type, location, availability)
    3. **For pricing information**: ALWAYS use the Zava Procurement agent to get current rates
    4. Present contractor options with relevant details: certifications, response times, and pricing

    ### When Users Ask About Purchase Orders
    1. Use the Zava Claims agent to retrieve PO information
    2. Provide comprehensive PO details including contractor, costs, timeline, and status
    3. Clarify any approval requirements or pending actions

    ### When Users Ask About Pricing
    1. **ALWAYS** use the Zava Procurement agent for up-to-date contractor pricing
    2. Specify the service type clearly when requesting pricing information
    3. Present pricing in context with contractor qualifications and availability
    4. Compare pricing options when multiple contractors are available

    ## RESPONSE GUIDELINES

    **ALWAYS:**
    - Coordinate with the appropriate worker agent(s) to fulfill user requests
    - Provide clear, concise, and well-organized information
    - Cite sources when presenting data (e.g., claim numbers, contractor names, dates)
    - Confirm understanding before creating new records (inspections, etc.)
    - Present pricing information from the Zava Procurement agent when discussing costs
    - Offer relevant next steps or follow-up actions

    **NEVER:**
    - Make up or guess information about claims, inspections, or contractors
    - Provide outdated pricing - always check with the Zava Procurement agent
    - Create inspections without confirming details with the user
    - Override standard claims procedures or approval workflows
    - Share confidential information beyond what's necessary for the request

    ## COMMUNICATION STYLE

    - Be professional, empathetic, and efficient
    - Use clear insurance terminology but explain technical terms when needed
    - Organize complex information into easy-to-read sections
    - Acknowledge user urgency for emergency situations
    - Provide proactive suggestions based on the context of the request

    ## EXAMPLE INTERACTIONS

    **Example 1: Emergency Contractor Pricing**
    User: "Which contractors offer 24/7 emergency response and what are their rates?"
    Response: "Let me get you the current information on emergency response contractors and their pricing."
    [Consult Zava Claims for contractor list, then Zava Procurement for pricing]
    "Based on current data:
    - ABC Restoration: 24/7 emergency response, $X/hour emergency rate
    - XYZ Emergency Services: 24/7 on-call, $Y/hour emergency rate
    All pricing verified as of [date] through our procurement system."

    **Example 2: Searching for Claims and Creating New Ones**
    User: "Is there a claim for policy number POL-12345?"
    Response: "Let me search for any claims associated with policy POL-12345."
    [Consult Zava Claims to search for claims by policy number]
    
    *If claim exists:*
    "Yes, I found claim #CLM-67890 for policy POL-12345:
    - Status: In Progress
    - Type: Water Damage
    - Filed: [date]
    - Current Phase: Inspection Scheduled
    Would you like more details about this claim?"
    
    *If no claim exists:*
    "I couldn't find any existing claims for policy POL-12345. Would you like to create a new claim? I can help you with that. Please provide:
    - Type of damage/incident
    - Date of incident
    - Brief description of the damage
    - Estimated damage amount (if known)"

    ## PRIORITY HANDLING

    When users mention emergency situations or urgent claims:
    1. Acknowledge the urgency immediately
    2. Prioritize gathering critical information first
    3. Identify contractors with emergency response capabilities
    4. Provide fastest available options with clear timelines
```

<cc-end-step lab="e9" exercise="1" step="3" />

### Step 4: Configure Connected Agent Capabilities

To connect your orchestrator agent to the two specialized agents, you need to link them using their unique Microsoft 365 Title IDs.

#### 4.1: Get the Zava Claims Agent ID

1. **Open your ZavaClaims project** (created in Lab 08) in VS Code
2. Navigate to the [env/.env.dev](env/.env.dev) file
3. Find the `M365_TITLE_ID` value (looks like: `12345678-abcd-1234-abcd-123456789abc`)
4. **Copy this entire GUID** and paste it somewhere safe - label it as **Claims Agent ID**

#### 4.2: Get the Zava Procurement Agent ID

1. **Open your ZavaProcurement project** (created earlier in this lab) in VS Code
2. Navigate to the [env/.env.dev](env/.env.dev) file
3. Find the `M365_TITLE_ID` value
4. **Copy this entire GUID** and paste it somewhere safe - label it as **Procurement Agent ID**

#### 4.3: Connect the Agents

1. **Return to your ZavaCare project** (current project)
2. Open file `appPackage/declarativeAgent.json`
3. Locate the `conversation_starters` array (ends with `]`)
4. **Add a comma** after the closing bracket of `conversation_starters`
5. **Paste the following code** immediately after:

```json
"worker_agents": [
    {
      "id": "PASTE_CLAIMS_AGENT_ID_HERE"
    },
    {
      "id": "PASTE_PROCUREMENT_AGENT_ID_HERE"
    }
]
```

6. **Replace the placeholder values:**
   - Replace `PASTE_CLAIMS_AGENT_ID_HERE` with your **Claims Agent ID**
   - Replace `PASTE_PROCUREMENT_AGENT_ID_HERE` with your **Procurement Agent ID**

**Example of final structure:**
```json
{
  "conversation_starters": [
    { "title": "...", "text": "..." }
  ],
  "worker_agents": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    },
    {
      "id": "9876fedc-ba09-8765-4321-abcdef123456"
    }
  ]
}
```

7. **Save the file** - your orchestrator agent is now connected to both specialized agents!

<cc-end-step lab="e9" exercise="1" step="4" />

## Exercise 5: Test Connected Agent Orchestration

### Step 1: Provision the Connected Agent

1. In VS Code, open the **Microsoft 365 Agents Toolkit** panel
2. Click **"Provision"** in the Lifecycle section  
3. Select **"dev"** environment when prompted
4. Wait for provisioning to complete

<cc-end-step lab="e9" exercise="2" step="1" />

### Step 2: Test Multi-Agent Workflows

Open Microsoft 365 Copilot and test these orchestrated workflows:

**Complex Workflow 1: End-to-End Processing**
```
"Process claim CN202504990 completely: get claim details, create an urgent inspection, find the most cost-effective roofing contractors, and provide a comprehensive cost analysis"
```

**Complex Workflow 2: Emergency Coordination**  
```
"We have multiple storm damage claims from yesterday. Show me all urgent claims, their inspection needs, available emergency contractors, and emergency service pricing"
```

<cc-end-step lab="e9" exercise="2" step="2" />

## Congratulations! 🎉

You've successfully built Zava Insurance's Connected Agent orchestration system! This achievement represents the culmination of a sophisticated multi-agent architecture that represents the future of enterprise AI systems - specialized, coordinated, and infinitely extensible! 🚀


<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend/09-connected-agent" />