# Lab E1B : Declarative Agent Foundation with Agents Toolkit

<div data-widget="hero"
  data-badge="On-ramp · Lab E1B"
  data-badge-color="blue"
  data-icon="🛠️"
  data-title="Declarative Agent Foundation with Agents Toolkit"
  data-subtitle="Build your first declarative agent in VS Code with source files, provisioning, grounding, and capability checks."
  data-time="45-60 min"
  data-requires="VS Code + Agents Toolkit"
  data-toolkit="Microsoft 365 Agents Toolkit | Microsoft 365 Copilot Chat"></div>

## Prerequisites

- VS Code with **Microsoft 365 Agents Toolkit**
- Microsoft 365 developer account with Copilot access
- Global Admin access in your M365 tenant, required to configure tenant-wide app and policy settings

---

## Exercise 1: Common prerequsites for pro-code 


### Step 1: Configure your M365 tenant

By default, Teams doesn't allow uploading custom apps — an admin toggle must be flipped first.

<div data-widget="step" data-n="1" data-title="Enable custom app uploads in Teams"></div>

1. Go to [admin.microsoft.com](https://admin.microsoft.com) and sign in with your M365 admin account
2. In the left nav: **Show all** → **Teams** → **Teams apps** → **Setup policies**
3. Select **Global (Org-wide default)**
4. Toggle **Upload custom apps** to **On** and click **Save**



<div data-widget="callout"
     data-type="warn"
     data-title="Propagation delay"
     data-body="This setting can take up to 24 hours in some tenants. If Provision fails with an upload error later, wait an hour and retry."></div>

<div data-widget="step" data-n="2" data-title="Verify your Copilot licence"></div>

Go to [m365.cloud.microsoft/chat/](https://m365.cloud.microsoft/chat/). If you see the Copilot Chat interface, you have a valid licence. If you see a licence error, contact your tenant admin — you need a Microsoft 365 Copilot licence assigned to your account.



---

### Step 2: Install developer tools

<div data-widget="step" data-n="1" data-title="Install Node.js v22"></div>

Version 22 is required — older versions fail silently on certain SDK dependencies.

If you have a different version installed, use [nvm](https://github.com/nvm-sh/nvm) (Mac/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows) to manage versions side by side.



<div data-widget="step" data-n="2" data-title="Install Microsoft 365 Agents Toolkit"></div>

1. Open VS Code → Extensions (`Ctrl+Shift+X`)
2. Search **Microsoft 365 Agents Toolkit** and click **Install**
3. Click the hexagonal icon in the Activity Bar and sign in with your M365 developer account


---

### Step 3 : Verify your installation

Open a terminal and run these checks. Every one should pass before you proceed.

<div data-widget="verify" data-label="Node.js version" data-cmd="node -v\n# Expected: v22.x.x"></div>

<div data-widget="verify" data-label="npm version" data-cmd="npm -v\n# Expected: 10.x.x or higher"></div>

<div data-widget="verify" data-label="Git installed" data-cmd="git --version\n# Expected: git version 2.x.x"></div>


---

## Exercise 2: Scaffold the project

1. Open VS Code and select **Microsoft 365 Agents Toolkit**.
2. Select **Create a New Agent/App**.
3. Choose **Declarative Agent** -> **No Action**.
4. Name it **Zava Onboarding Agent**.

You should have a new VS code project window with a similar file structure as below:

```text
appPackage/
  declarativeAgent.json
  instruction.txt
  manifest.json
env/.env.dev
m365agents.yml
```

---

## Exercise 3: Configure core files

1. Open `appPackage/declarativeAgent.json` and copy/paste this branding baseline (then keep/add your instructions and conversation starters):

  ```json
  "name": "Zava Onboarding Agent",
  "description": "Helps new Zava Insurance employees find answers to common HR and IT onboarding questions",
  ```

2. Open `appPackage/manifest.json` and copy/paste this branding block:

  ```json
  "name": {
    "short": "Zava Onboarding Agent",
    "full": "Zava Insurance Onboarding Agent"
  },
  "description": {
    "short": "HR and IT onboarding help for new Zava employees",
    "full": "A friendly onboarding agent that helps new Zava Insurance employees with office access, helpdesk support, annual leave, benefits, and mandatory onboarding tasks."
  },
  ```

3. Open `appPackage/instruction.txt` and copy this block exactly as-is:

  ```text
  # Zava Onboarding Assistant

  ## Role
  You are a friendly HR and IT onboarding assistant for new employees at Zava Insurance.

  ## Scope
  - Office locations and access
  - IT helpdesk process and hours
  - Leave, benefits, and onboarding tasks

  ## Guardrails
  - Do not invent policy details.
  - If information is missing, say what is unknown and provide a safe next contact.

  ## Tone
  - Warm, concise, practical.
  ```

4. Save all files.


---

## Exercise 4: Add grounding via Embedded Knowledge capability

1. Download [Zava New Hire Logistics.docx](../../assets/docs/extend-m365-copilot-09/Zava%20New%20Hire%20Logistics.docx).
2. In **Microsoft 365 Agents Toolkit** -> **Development** -> **Add Capability**.
3. Choose **Embedded Knowledge**.
4. Keep default `appPackage/manifest.json`.
5. Import `Zava New Hire Logistics.docx`.
6. Confirm `appPackage/EmbeddedKnowledge` is created.

![image of adding capability](../../assets/images/extend-m365-copilot-09/flow-embed.png)

---

## Exercise 5: Test your agent

1. Provision from **Lifecycle -> Provision**.
2. Open your agent **Zava Onboarding Agent** in Copilot Chat.
3. Ask:
    - "Where is the badge pickup desk and what time does it open?"
    - "If a new hire is locked out, what fallback should they use?"

Expected result:

- Response includes **Floor 1, Reception B** and **8:15 AM** opening time.
- Response includes **+1-800-ZAVA-ITS** and **Badge Assist** fallback.

---

## Exercise 6: Enable Code Interpreter in code and validate charts

1. Open `appPackage/declarativeAgent.json`.
2. In the existing `capabilities` array, add `CodeInterpreter` as a new item after the `EmbeddedKnowledge` entry. Make sure the previous item ends with a comma.

   ```json
   {
     "name": "CodeInterpreter"
   }
   ```
   
3. Save the file.
4. Open `appPackage/manifest.json` file. Increase version from `"version": "1.0.0",` to `"version": "1.0.1",`
5. Provision from **Lifecycle -> Provision**.

> For your agent changes to take effect, increment the manifest version before provisioning.

Run these prompts in Copilot Chat for your provisioned agent:

- "Given 20 annual leave days and 260 working days per year, calculate leave percentage and show the result in a 2-row table."
- "Create a 2-week onboarding checklist with columns: Day, Task, Owner, Priority."
- "Using that 2-week checklist, create a bar chart of tasks by owner and add a one-paragraph summary of workload balance."

Expected result:

- Agent returns table output for the calculation.
- Agent returns checklist table with requested schema.
- Agent returns a readable chart and short summary.


---

## Exercise 7: Debug your agent with developer mode

1. Open your provisioned agent in Microsoft 365 Copilot Chat.
2. Send this message to the agent:

```text
-developer on
```

3. Run a few prompts from Exercises 5 and 6 again.
4. Review the debug information shown after each response:
   - Which tools/capabilities were used
   - What grounding context was applied
   - Whether output matched your expected behavior
5. Capture at least one improvement you want to make before wider rollout.

---

## Complete

You can now continue to **Prerequisites for Pro-code bundles** before selecting a bundle.

---8<--- "e-congratulations.md"

<div data-widget="labnav"
  data-prev="../01-first-agent-new/"
  data-prev-label="Back to E1 Path Choice"
  data-next="../00-prerequisites/"
  data-next-label="Continue to Prerequisites for Pro-code bundles"></div>

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/01-first-agent-toolkit" />
