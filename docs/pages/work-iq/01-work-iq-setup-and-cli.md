---
code: WIQ01
title: Work IQ Setup and consumption via CLI
description: Learn how to set up Work IQ in your tenant, consume it via CLI, and integrate it with GitHub Copilot and third-party applications.
tags: [work-iq, cli, copilot, api, entra-id, microsoft-365]
level: 200
time: 75
badge: WorkIQ-Expert
products: [Work IQ, Copilot, Entra ID, Microsoft 365]
created-date: 2026-07-28
last-edited-date: 2026-07-28
---

# Lab WIQ01 - Work IQ Setup and consumption via CLI

Work IQ is a workplace intelligence layer that enables agents and developers to securely access and reason over organizational data from Microsoft 365. In this lab, you'll set up Work IQ in your tenant, explore CLI consumption, integrate it with GitHub Copilot CLI, and register applications for programmatic access.

<!--
<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe src="//www.youtube.com/embed/<VIDEO_ID>" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">
        </iframe>
        <div>Get a quick overview of the lab in this video.</div>
    </div>
</div>
-->

## Scenario

You're a developer tasked with enabling your organization to use Work IQ across different consumption patterns. You need to set up the infrastructure, verify CLI access, integrate GitHub Copilot CLI, and prepare for programmatic consumption via registered applications.

## Lab objectives

After completing this lab, you'll be able to:

- Enable Work IQ in your Microsoft 365 tenant
- Configure Copilot Credits billing profile for usage-based AI services
- Install and configure the Work IQ CLI
- Connect GitHub Copilot CLI to Work IQ
- Register an Entra ID application for secure API consumption

## Exercise 1: Enable Work IQ API in your tenant

Work IQ API requires organization-wide enablement through the service principal registration in Entra ID.

### Step 1: Prepare prerequisites

Before enabling Work IQ, ensure:

- You have a **usage-based billing plan** configured in your tenant (see the following step 4)
- You have **Global Administrator** or **Privileged Role Administrator** access in your Microsoft Entra tenant
- You understand the Work IQ service principal ID: `fdcc1f02-fc51-4226-8753-f668596af7f7`

<cc-end-step lab="WIQ01" exercise="1" step="1" />

### Step 2: Create the Work IQ service principal

The easiest way to create the Work IQ service principal is to use Graph Explorer:

1. Navigate to [Graph Explorer](https://aka.ms/ge){target=_blank} and sign in with an admin account
2. Change the HTTP method to **POST**
3. Set the URL to `https://graph.microsoft.com/v1.0/servicePrincipals`
4. Select **Modify permissions** and consent to `Application.ReadWrite.All` (one-time admin action)
5. Paste this request body:

```json
{
  "appId": "fdcc1f02-fc51-4226-8753-f668596af7f7"
}
```

6. Click **Run query** and verify a **201 Created** response

**Alternative (CLI method):** If you prefer Azure CLI, run:

```bash
az ad sp create --id fdcc1f02-fc51-4226-8753-f668596af7f7
```

<cc-end-step lab="WIQ01" exercise="1" step="2" />

### Step 3: Verify tenant readiness

After service principal creation, your tenant is ready for Work IQ. Note:

- The service principal creation is a **one-time, organization-wide** action
- All users in your tenant can now authenticate and use Work IQ
- Billing will be usage-based per the configured plan (see the following step)

<cc-end-step lab="WIQ01" exercise="1" step="3" />

### Step 4: Configure Copilot Credits billing profile

**Important:** A Microsoft 365 Copilot license and an active Copilot Credits billing profile are **prerequisites** to consume Work IQ and other usage-based AI services like Cowork. The billing profile enables pay-as-you-go or prepaid credit consumption.

To set up Copilot Credits billing:

1. Navigate to the [Microsoft 365 admin center](https://go.microsoft.com/fwlink/p/?linkid=2024339){target=_blank}
1. Go to **Copilot** → **Cost Management**
1. Select **Get Started** to activate usage-based billing
1. A configuration panel opens titled **Activate the default spending policy for your organization**
1. **Select a billing method:**
    - **Use an existing Azure subscription** (recommended): Select your subscription from the dropdown. If prepaid Copilot Credits (P3) are attached, they'll be labeled and used first.
    - **Create a new Azure subscription**: If you don't have an Azure subscription, the system can create one for you (Global Administrator required).
    - **Buy prepaid credits**: Optionally purchase Copilot Pre-Purchase Plan (P3) credits for discounted rates.
1. **Set spending limits:**
    - Choose **Don't limit monthly spending** for unlimited usage, or **Limit monthly spending** to control budget
    - Optionally set a **per-user monthly limit** to prevent excessive individual consumption
1. **Define alerts:**
    - Select email recipients and alert thresholds (weekly notifications when limits are approached)
1. **Review and activate:**
    - The default policy applies tenant-wide to all users
    - Select **Activate** to complete setup
    - Select **Manage Configuration** to view the Cost Management dashboard

Your organization is now ready to consume Work IQ, Cowork, and other usage-based AI services. Billing will be charged against your selected Azure subscription on a consumption basis, with prepaid credits applied first (if available).

**Reference:** For detailed cost management and policy customization, see [Usage-Based Billing and Cost Management for Copilot Credits](https://learn.microsoft.com/en-us/microsoft-365/copilot/usage-based-billing-overview-copilot-credits){target=_blank}.

<cc-end-step lab="WIQ01" exercise="1" step="4" />

## Exercise 2: Install and use Work IQ CLI

The Work IQ CLI allows you to query Microsoft 365 data directly from your terminal.

### Step 1: Install Work IQ

Choose one installation method:

**Option A: Via npm (recommended for global use)**

```bash
npm install -g @microsoft/workiq
```

To update: `npm update -g @microsoft/workiq`

**Option B: Via GitHub Copilot CLI (if available)**

```bash
copilot
/plugin marketplace add github/copilot-plugins
/plugin install workiq@copilot-plugins
```

**Option C: Via npx (no installation required)**

```bash
npx -y @microsoft/workiq
```

<cc-end-step lab="WIQ01" exercise="2" step="1" />

### Step 2: Accept the EULA

Before your first query, accept the End User License Agreement. Start a terminal window and run the following command:

```bash
workiq accept-eula
```

This is a **one-time, per-user** action.

<cc-end-step lab="WIQ01" exercise="2" step="2" />

### Step 3: Try your first query

Run your first Work IQ CLI query to retrieve personal context:

```bash
workiq ask -q "Who am I? What is my role in the company?"
```

Work IQ returns personalized information from your Microsoft 365 tenant, demonstrating secure, permission-aware data access. Try other queries:

```bash
workiq ask -q "When is my next meeting?"
workiq ask -q "Summarize my recent emails from the engineering team"
```

<cc-end-step lab="WIQ01" exercise="2" step="3" />

### Step 4: Use interactive mode

For multi-turn conversations, use interactive mode:

```bash
workiq ask
```

This launches an interactive prompt where you can ask follow-up questions:

```text
> What meetings do I have this week?
> Tell me more about the one at 2 PM.
> Who is attending from the client side?
```

<cc-end-step lab="WIQ01" exercise="2" step="4" />

## Exercise 3: Integrate with GitHub Copilot

Use GitHub Copilot (CLI or VS Code) to access Work IQ data through the Model Context Protocol (MCP).

### Step 1: Set up GitHub Copilot CLI

If not already installed, install GitHub Copilot CLI from the [official documentation](https://docs.github.com/copilot/how-tos/use-copilot-agents/use-copilot-cli){target=_blank}.

Start Copilot CLI:

```bash
copilot
```

If prompted to sign in, run the following command:

```bash
/login
```

<cc-end-step lab="WIQ01" exercise="3" step="1" />

### Step 2: Add the Work IQ plugin marketplace

Execute this one-time setup command:

```bash
/plugin marketplace add microsoft/work-iq
```

This registers the Work IQ plugin marketplace for your Copilot CLI instance.

<cc-end-step lab="WIQ01" exercise="3" step="2" />

### Step 3: Install the Work IQ plugin

Install the Work IQ plugin:

```bash
/plugin install workiq@work-iq
```

Follow the on-screen prompts. A browser pop-up will appear displaying **Authorization Successful**.

<cc-end-step lab="WIQ01" exercise="3" step="3" />

### Step 4: Verify integration

Verify that the Work IQ MCP server is loaded:

```bash
/mcp show
```

You should see `workiq` listed with the endpoint `https://workiq.svc.cloud.microsoft/mcp`.
Press `ESC` to exit and go back.

Also check available skills:

```bash
/skills info workiq
```

You should see the details about the `workiq` skill.

<cc-end-step lab="WIQ01" exercise="3" step="4" />

### Step 5: Query Microsoft 365 via Copilot

Now ask Copilot to retrieve Microsoft 365 data through Work IQ. For example:

```text
Summarize my upcoming meetings for today.
```

```text
Find recent messages about the Contoso account.
```

```text
Retrieve the latest email related to the quarterly business review.
```

Copilot CLI automatically invokes Work IQ MCP tools, and results respect your Microsoft 365 permissions and tenant policies. Depending on the size of the output returned by Work IQ, you might need to authorize processing of data or execution of multiple requests.

<cc-end-step lab="WIQ01" exercise="3" step="5" />

## Exercise 4: Register an Entra ID application for API consumption

To consume Work IQ programmatically via REST, A2A, or MCP from your own applications, register a consumer application in Entra ID.

### Step 1: Create an app registration

1. Go to the [Azure portal](https://portal.azure.com/){target=_blank}
2. Navigate to **Microsoft Entra ID** → **App registrations** → **New registration**
3. Set the name to `Work IQ Consumer`
4. Under **Supported account types**, select **Accounts in this organizational directory only (Single tenant)**
5. Click **Register**

<cc-end-step lab="WIQ01" exercise="4" step="1" />

### Step 2: Configure a client secret

1. In your new app registration, go to **Certificates & secrets** → **Client secrets** → **New client secret**
2. Provide a description (e.g., `Client Secret`)
3. Choose an expiration period (e.g., 12 months)
4. Click **Add**
5. **Immediately copy and store** the secret value — you cannot retrieve it again after leaving this page

<cc-end-step lab="WIQ01" exercise="4" step="2" />

### Step 3: Add API permissions

1. Navigate to **API permissions** → **Add a permission**
2. Select the **APIs my organization uses** tab
3. Search for `Work IQ`
4. Select **Delegated permissions**
5. Check the **WorkIQAgent.Ask** permission
6. Click **Add permissions**

<cc-end-step lab="WIQ01" exercise="4" step="3" />

### Step 4: Grant admin consent

The `WorkIQAgent.Ask` permission requires admin consent:

1. Back on the **API permissions** page, click **Grant admin consent for <your-tenant\>**
2. Confirm by clicking **Yes** in the dialog
3. Verify that **WorkIQAgent.Ask** now shows a green checkmark ✓

<cc-end-step lab="WIQ01" exercise="4" step="4" />

### Step 5: Collect credentials for API consumption

From the app registration's **Overview** page, collect these values (you'll use them for REST, A2A, or MCP consumption):

- **TENANT_ID** — Directory (tenant) ID
- **CLIENT_ID** — Application (client) ID
- **CLIENT_SECRET** — The secret value you saved earlier
- **AUTHORIZATION_URL** — The OAuth 2.0 authorization endpoint (v2)
- **TOKEN_RETRIEVAL_URL** — The OAuth 2.0 token endpoint (v2)

The URLs are available when you select the **Endpoints** command in the **Overview** page.
Store these securely (e.g., in Azure Key Vault or your app's configuration management system).

<cc-end-step lab="WIQ01" exercise="4" step="5" />

### Step 6: Configure a redirect URI (optional, for OAuth flows)

If you plan to use OAuth 2.0 authorization code flow:

1. Navigate to **Authentication** → **Add a platform** → **Web**
1. In **Redirect URIs**, enter your application's callback URL (e.g., `https://myapp.example.com/callback`)
1. Add the following value `https://microsoft.github.io/copilot-camp/` as another application's callback URL
1. Click **Configure**

<cc-end-step lab="WIQ01" exercise="4" step="6" />

## Completion

Congratulations! You've successfully:

✅ Enabled Work IQ in your Microsoft 365 tenant  
✅ Installed and queried data via Work IQ CLI  
✅ Integrated GitHub Copilot with Work IQ for workplace context  
✅ Registered an Entra ID application for programmatic access

You're now ready to:

- **Build custom agents** that consume Work IQ data
- **Develop web applications** using Work IQ REST APIs
- **Implement agent-to-agent** workflows using A2A protocol
- **Extend third-party tools** with Work IQ MCP integration

---

## <a href="../02-work-iq-a2a">Start here</a> with Lab WIQ02, to consume Work IQ via A2A protocol.

<cc-next />

<cc-award badgeId="WorkIQ-Expert" badgeName="Work IQ Expert" />
<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/work-iq/WIQ01" />
