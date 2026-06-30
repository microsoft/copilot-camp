# Lab E1 : Your First Declarative Agent

<div data-widget="hero"
  data-badge="On-ramp · Lab E1 "
  data-badge-color="blue"
  data-icon="🧰"
  data-title="Your First Declarative Agent"
  data-subtitle="Create the same starter Declarative Agent through Agent Builder or Agents Toolkit, then use that foundation to understand when you need the code-first path."
  data-time="30-45 min"
  data-requires="Lab E0"
  data-toolkit="Agent Builder or Microsoft 365 Agents Toolkit"></div>

<div data-widget="checklist"
  data-items="First Declarative Agent created~Built in Agent Builder or scaffolded with Agents Toolkit|Agent identity and persona customized~Name, instructions, and starters reflect the Zava onboarding scenario|Test loop completed~Validated the same onboarding agent in Microsoft 365 Copilot Chat"></div>

## Key concepts before you build

<div data-widget="concepts"
  data-cards="Declarative Agent anatomy::purple::Persona + instructions + starters::Whether you use Agent Builder or Agents Toolkit, you are defining the same core ingredients: who the agent is, how it should behave, and how users can start using it.||Two creation paths::teal::Same agent, different authoring experience::Agent Builder is the fastest way to understand the persona and experience. Agents Toolkit exposes the project files and deployment workflow you'll extend in later code-first labs.||Edit and test loop::blue::Refine, publish, validate::Both paths teach the same habit: make a small change, publish or provision it, then test the resulting behavior in Copilot Chat."></div>

In this lab, you will create, configure, and test your first Declarative Agent using one of two tabs: **Agent Builder** or **Microsoft 365 Agents Toolkit**. Both paths produce the same Zava onboarding agent and teach the same persona design fundamentals. The Agent Builder path is the quickest way to understand how a declarative agent is shaped. The Agents Toolkit path is the code-first route you will use in later labs when you need capabilities that Agent Builder alone cannot extend.

## Scenario

You have joined the Zava Insurance developer team. Before building MCP-powered workflows, you need to prove your local environment works and that you understand Declarative Agent anatomy.

You will build a simple **Zava Onboarding Assistant** that helps new employees with common HR and IT onboarding questions (office locations, helpdesk, leave policy, and benefits).

---

## Lab objectives

By completing this lab, you will:

- Understand how a Declarative Agent's persona, instructions, and starters fit together
- Create the same starter agent with Agent Builder or Agents Toolkit
- Customize identity, instructions, and Suggested prompt(s) for the Zava scenario
- Test the agent in Microsoft 365 Copilot Chat
- Understand why later bundle labs move to a code-first path for deeper extensibility

---

## Prerequisites

Before starting this lab, complete:

- **Lab E0**: [Prerequisites & Concepts](../00-prerequisites)
- Microsoft 365 account with Copilot access
- If you choose the **Agents Toolkit** tab: VS Code with **Microsoft 365 Agents Toolkit** (v6.10.2+)
- If you choose the **Agent Builder** tab: permission to create agents in Microsoft 365 Copilot Chat

<div class="ccw-choice">
  <div class="ccw-choice-card builder">
    <div class="ccw-choice-label">Agent Builder</div>
    <div class="ccw-choice-desc">
      <strong>Fastest path to understand agent persona.</strong><br/>
      Visual editor, no coding. Best for prototyping and learning the declarative agent shape (who, what, how, starters).
    </div>
  </div>
  <div class="ccw-choice-card toolkit">
    <div class="ccw-choice-label">Agents Toolkit</div>
    <div class="ccw-choice-desc">
      <strong>Code-first path for extensibility.</strong><br/>
      Project files, VS Code, local provisioning. Prepares you for bundles that add tools, APIs, MCP servers, and authentication.
    </div>
  </div>
</div>

---

## Exercise 1: Create the starter agent

=== "Agent Builder"

    ### Step 1 - Open Agent Builder in Copilot Chat

    1. Go to [https://m365.cloud.microsoft/chat/](https://m365.cloud.microsoft/chat/).
    2. In the left pane, select **Create agent** or **New agent**.
    3. You will see *Build your own specialist agent* screen where you can use natural language prompt to create your agent. 

    ### Step 2 - Describe the Zava onboarding agent

    In the Agent Builder send your prompt to create agent: 

    ```text

    Create a declarative agent named Zava Onboarding Assistant.
    It helps new Zava Insurance employees with common HR and IT onboarding questions.
    Keep the tone warm, concise, and practical.
    Focus on office locations, helpdesk support, annual leave, benefits, and mandatory onboarding tasks.

    ```

    Agent Builder takes a while to create your agent and opens the details panel with key fields prefilled, including Name (**Zava Onboarding Assistant**) and initial instructions.
   

    ### Step 3 - Review the agent details

    Review the generated details, and **Suggested prompt(s)** (called *conversation starters* in some UI versions), then select **Create**.


    <div data-widget="callout"
      data-type="info"
      data-title="What this path teaches"
      data-body="Agent Builder helps you quickly understand the shape of a declarative agent: persona, behavior, knowledge boundaries, and Suggested prompt(s). Later bundle labs switch to the code-first route because that is where you can version files, wire external tools, and add capabilities beyond the Agent Builder surface."></div>


=== "Agents Toolkit"

    ### Step 1 - Open Agents Toolkit in VS Code

    1. Open VS Code.
    2. Select the **Microsoft 365 Agents Toolkit** icon in the Activity Bar.
    3. Sign in with your Microsoft 365 developer account if prompted.

    ### Step 2 - Create a new Declarative Agent

    1. In Agents Toolkit, select **Create a New Agent/App**.
    2. Select **Declarative Agent**.
    3. Select **No Action** to scaffold a minimal template.
    4. Choose a folder on your machine.
    5. For app name, enter: **Zava Onboarding Agent**.

    ### Step 3 - Inspect generated structure

    Open the generated project and review the `appPackage` folder (similar files):

    ```text
    ZavaOnboardingAgent/
    ├── appPackage/
    │   ├── declarativeAgent.json
    │   ├── instruction.txt
    │   ├── manifest.json
    │   ├── color.png
    │   └── outline.png
    ├── env/
    │   └── .env.dev
    └── m365agents.yml
    ```

    - `manifest.json`: Teams app identity and package metadata
    - `declarativeAgent.json`: Agent persona, starters, and references
    - `instruction.txt`: Agent behavior and policy prompt

    This is the code-first equivalent of the Agent Builder details panel:

    - Agent name and description: `declarativeAgent.json`
    - Persona instructions: `instruction.txt`
    - **Suggested prompt(s)**: `conversation_starters` in `declarativeAgent.json`

---

## Exercise 2: Define the persona

The end goal in both tabs is the same: a **Zava Onboarding Assistant** with a clear role, a narrow knowledge boundary, and useful **Suggested prompt(s)**.

=== "Agent Builder"

    ### Step 1 - Refine the agent's purpose and description

    Continue with the agent you just created and switch to edit mode:

    1. In the left navigation, select **Agents** (if needed).
    2. Select **Zava Onboarding Assistant**.
    3. Open the agent menu (**...**) and choose **Edit** (or **Manage/Edit details**, depending on your UI).

    Then make sure its purpose is clear:

    - Name: **Zava Onboarding Assistant**
    - Description: You can change it to  `Helps new Zava Insurance employees find answers to common HR and IT onboarding questions`.
 

    ### Step 2 - Add the core persona instructions

    In the instructions area, replace the auto-generated one with below: 

    ```text
      # Zava Onboarding Assistant

      ## Role
      You are a friendly HR and IT onboarding assistant for new employees at Zava Insurance,
      a mid-sized home insurance company based in the Pacific Northwest.
      Your job is to answer common questions from people in their first 90 days at Zava.

      ## What you know
      - Zava's offices are in Seattle (HQ), Portland, and Spokane.
        Seattle HQ is at 1400 5th Ave, open Mon-Fri 8am-6pm.
        Free parking is available in the basement for HQ staff with a valid pass.
      - IT Helpdesk: helpdesk@zava-insurance.com or Teams channel #it-help.
        Hours: Mon-Fri 7am-7pm Pacific. For urgent issues out of hours, call +1-800-ZAVA-ITS.
      - Annual leave: 20 days per year (prorated in year one). Request via Workday.
        Christmas shutdown: Dec 24 - Jan 2 is pre-approved leave for all staff.
      - Benefits include: medical/dental/vision (day 1), 401k with 4% match (after 90 days),
        $500 annual wellness budget, and monthly WFH stipend of $50.
      - Mandatory onboarding courses must be completed in your first 30 days via the LMS.
        Log in at learn.zava-insurance.com using your corporate SSO.

      ## Behaviour guidelines
      - Be warm, concise, and reassuring.
      - If you don't know the answer, say so and suggest who to contact.
      - Don't invent policy details not listed above.
      - Keep answers short unless the user asks for detail.
      - Offer a follow-up question at the end.
    ```


=== "Agents Toolkit"

    ### Step 1 - Update declarativeAgent.json

    This step mirrors the Agent Builder details panel edits, but in source files.

    Replace the full content of `appPackage/declarativeAgent.json` with:

    ```json
    {
      "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.6/schema.json",
      "version": "v1.6",
      "name": "Zava Onboarding Assistant",
      "description": "Helps new Zava Insurance employees find answers to common HR and IT onboarding questions.",
      "instructions": "$[file('instruction.txt')]",
      "conversation_starters": [
        {
          "title": "IT helpdesk hours",
          "text": "What are the IT helpdesk hours and how do I raise a ticket?"
        },
        {
          "title": "Holiday policy",
          "text": "How many days of annual leave do I get and how do I book them?"
        },
        {
          "title": "Office locations",
          "text": "Where are Zava's offices and what are the parking arrangements?"
        },
        {
          "title": "Benefits summary",
          "text": "Give me a quick summary of the key employee benefits."
        }
      ]
    }
    ```

    ### Step 2 - Update instruction.txt

    Replace all content in `appPackage/instruction.txt` with:

    ```text
    # Zava Onboarding Assistant

    ## Role
    You are a friendly HR and IT onboarding assistant for new employees at Zava Insurance,
    a mid-sized home insurance company based in the Pacific Northwest.
    Your job is to answer common questions from people in their first 90 days at Zava.

    ## What you know
    - Zava's offices are in Seattle (HQ), Portland, and Spokane.
      Seattle HQ is at 1400 5th Ave, open Mon-Fri 8am-6pm.
      Free parking is available in the basement for HQ staff with a valid pass.
    - IT Helpdesk: helpdesk@zava-insurance.com or Teams channel #it-help.
      Hours: Mon-Fri 7am-7pm Pacific. For urgent issues out of hours, call +1-800-ZAVA-ITS.
    - Annual leave: 20 days per year (prorated in year one). Request via Workday.
      Christmas shutdown: Dec 24 - Jan 2 is pre-approved leave for all staff.
    - Benefits include: medical/dental/vision (day 1), 401k with 4% match (after 90 days),
      $500 annual wellness budget, and monthly WFH stipend of $50.
    - Mandatory onboarding courses must be completed in your first 30 days via the LMS.
      Log in at learn.zava-insurance.com using your corporate SSO.

    ## Behaviour guidelines
    - Be warm, concise, and reassuring.
    - If you don't know the answer, say so and suggest who to contact.
    - Don't invent policy details not listed above.
    - Keep answers short unless the user asks for detail.
    - Offer a follow-up question at the end.
    ```

    ### Step 3 - Update manifest.json

    Update the app identity values in `appPackage/manifest.json`:

    ```json
      
      "name": {
        "short": "Zava Onboarding",
        "full": "Zava Insurance Onboarding Assistant"
      },
      "description": {
        "short": "HR and IT help for new Zava employees",
        "full": "Answers common onboarding questions for new Zava Insurance employees — office locations, IT helpdesk, leave policy, and benefits."
      }    

    ```

---

## Exercise 3: Provision and test

=== "Agent Builder"

    ### Step 1 - Save or publish the agent

    1. In Agent Builder, select **Create**, **Update**, or **Save** depending on the screen you are on.
    2. Wait for the updated agent to become available in Copilot Chat.

    ### Step 2 - Open the agent in Copilot Chat

    1. Go to the agent you created or open **Agents** in the left pane.
    2. Select **Zava Onboarding Assistant**.
    3. Run one of the **Suggested prompt(s)**.

    ### Step 3 - Validate behavior with prompts

    Try these prompts:

    - "Where is the Seattle office and when is it open?"
    - "How do I submit annual leave?"
    - "What happens if I need IT support at 9pm?"
    - "What is the 401k match rate?"
    - "Tell me about stock options" (agent should not invent data)

=== "Agents Toolkit"

    ### Step 1 - Provision the agent

    1. In Agents Toolkit, under **Lifecycle**, select **Provision**.
    2. Wait for a success notification.
    3. Open `env/.env.dev` and confirm `TEAMS_APP_ID` and `M365_TITLE_ID` are populated.

    ### Step 2 - Open the agent in Copilot Chat

    1. Go to [https://m365.cloud.microsoft/chat/](https://m365.cloud.microsoft/chat/).
    2. Open **Agents** in the left pane.
    3. Select **Zava Onboarding**.
    4. Run one of the **Suggested prompt(s)**.

    ### Step 3 - Validate behavior with prompts

    Try these prompts:

    - "Where is the Seattle office and when is it open?"
    - "How do I submit annual leave?"
    - "What happens if I need IT support at 9pm?"
    - "What is the 401k match rate?"
    - "Tell me about stock options" (agent should not invent data)

---

## Exercise 4: Understand the development loop

=== "Agent Builder"

    ### Step 1 - Make a small persona update

    Reopen the agent for editing and add this fact to the instructions area:

    ```text
    The staff canteen at Seattle HQ is on floor 2. It is open Mon-Fri 7:30am-3pm,
    serves hot meals, salads, and barista coffee, and accepts payment through the Zava staff card.
    ```

    Save or update the agent, then ask: "Is there a canteen at HQ?"

    <div data-widget="callout"
      data-type="tip"
      data-title="Optional: next in Agent Builder"
      data-body="After you validate this update, extend the agent with knowledge directly in Agent Builder: <a href='https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-add-knowledge' target='_blank'>Add knowledge in Agent Builder</a>."></div>

    ### Step 2 - Understand where this path stops

    Agent Builder is excellent for quickly shaping an agent's persona, instructions, starters, and some knowledge or capability settings. The later bundle labs move to the code-first path because external tools, manifests, source control, local services, and richer extensibility require files and code that Agent Builder does not expose directly.

    <div data-widget="callout"
      data-type="concept"
      data-title="Key takeaway"
      data-body="Use Agent Builder to understand and prototype the declarative agent experience. Use Agents Toolkit when you need to extend that experience with project files, manifests, APIs, MCP servers, authentication, and repeatable source-controlled changes."></div>

=== "Agents Toolkit"

    ### Step 1 - Make a live update and re-provision

    Add this line to `instruction.txt` under "What you know":

    ```text
    - The staff canteen (Seattle HQ, floor 2) is open Mon-Fri 7:30am-3pm.
      It serves hot meals, salads, and barista coffee.
      Payment via Zava staff card only.
    ```

    Then bump the app version in `appPackage/manifest.json` (e.g. `"version": "1.0.1"`) so Copilot picks up the update, and provision again from Agents Toolkit under **Lifecycle → Provision**.

    ### Step 2 - Enable developer mode and validate

    In Copilot Chat, turn on developer mode to inspect what the agent receives:

    ```text
    -developer on
    ```

    Then submit this query and inspect the debug information that appears below the response:

    ```text
    Is there a canteen at HQ?
    ```

    The agent should now answer using the new canteen fact you added to `instruction.txt`.

    <div data-widget="callout"
      data-type="tip"
      data-title="Optional: next in Agents Toolkit"
      data-body="After you validate this update, extend your declarative agent using knowledge sources in files and manifest settings: <a href='https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/knowledge-sources' target='_blank'>Knowledge sources for declarative agents</a>."></div>



    

---8<--- "e-congratulations.md"

You are now ready to choose a bundle path from the landing page.

<div data-widget="callout"
     data-type="tip"
     data-title="Pro-code vs. no-code path"
     data-body="These bundles mainly teaches the pro-code approach using Agents Toolkit for maximum extensibility with custom tools, APIs, and MCP servers. If you prefer a no-code experience, check out <a href='https://microsoft.github.io/agent-academy/' target='_blank'>Agent Academy</a> to build and extend Agents using Copilot Studio."></div>


<div data-widget="labnav"
  data-next="../bundles/"
  data-next-label="Choose Your Bundle"></div>

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/01-first-agent-new" />
