# Lab E1A : Declarative Agent Foundation with Agent Builder

<div data-widget="hero"
  data-badge="On-ramp · Lab E1A"
  data-badge-color="blue"
  data-icon="🧰"
   data-title="Declarative Agent Foundation with Agent Builder"
  data-subtitle="Build your first declarative agent in Agent Builder with grounding, capability checks, and governance basics."
  data-time="30-45 min"
   data-requires="Microsoft 365 Copilot Chat access"
  data-toolkit="Microsoft 365 Copilot Chat"></div>

## Prerequisites

- Access to **Microsoft 365 Copilot Chat**
- Permission to create and edit agents in your tenant

---

## Exercise 1: Create your first agent

1. Open [https://m365.cloud.microsoft/chat/](https://m365.cloud.microsoft/chat/).
2. In the left pane, go to **Agents** -> **Create agent**.
3. Paste this prompt:

```text
Create a declarative agent named Zava Onboarding Assistant.
It helps new Zava Insurance employees with common HR and IT onboarding questions.
Keep the tone warm, concise, and practical.
Focus on office locations, helpdesk support, annual leave, benefits, and mandatory onboarding tasks.
```

4. Review generated details and select **Create**.

---

## Exercise 2: Define persona and instructions

1. Open your agent in **Edit** mode.
2. Set identity:
      - Name: **Zava Onboarding Assistant**
      - Description: `Helps new Zava Insurance employees find answers to common HR and IT onboarding questions`.
3. Update instructions with clear:
      - Persona
      - Scope boundaries
      - Guardrails (no fabrication)
      - Tone (warm and concise)

Use this starter instruction block:

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

Then select **Create/Update** as per your UI.
---

> Achieve Edit mode by selecting **Agents** from left navigation. Then choose your agent from the list, select ... menu option and then select **Edit**.

## Exercise 3: Add grounding and verify retrieval

1. Download [Zava New Hire Logistics.docx](../../assets/docs/extend-m365-copilot-09/Zava%20New%20Hire%20Logistics.docx).
2. Open your agent in **Edit** mode, go to **Knowledge** and upload `Zava New Hire Logistics.docx`.
3. Save or update the agent.
4. Validate with prompts:
   - "Where is the badge pickup desk and what time does it open?"
   - "If a new hire is locked out, what fallback should they use?"

Expected result:

- Response includes **Floor 1, Reception B** and opening time **8:15 AM**.
- Response includes **+1-800-ZAVA-ITS** and **Badge Assist** fallback.

---

## Exercise 4: Enable Code Interpreter and test charts

1. Open your agent in **Edit** mode.
2. Go to **Capabilities**.
3. Ensure **Create documents, charts, and code** is enabled.
4. Select **Save** or **Update**.

Run these prompts:

- "Given 20 annual leave days and 260 working days per year, calculate leave percentage and show the result in a 2-row table."
- "Create a 2-week onboarding checklist with columns: Day, Task, Owner, Priority."
- "Using that 2-week checklist, create a bar chart of tasks by owner and add a one-paragraph summary of workload balance."

Expected result:

- Agent returns a table for leave percentage.
- Agent returns a checklist table with the requested columns.
- Agent returns a readable chart and short workload summary.

---

## Exercise 5: Governance and rollout basics

Before wider rollout, document:

1. Pilot audience (5-15 users)
2. Included knowledge sources
3. Enabled capability (Code Interpreter)
4. Content owner for updates
5. Weekly review cadence

---

## Exercise 6: Run a focused test matrix

Run these prompts and mark pass/fail:

1. Grounding check: "Where is badge pickup and when does it open?"
2. Policy check: "How do I request annual leave?"
3. Boundary check: "Tell me about Zava stock options."
4. Capability check: reuse the Code Interpreter chart prompt.

Pass criteria:

- Grounding answers match uploaded document details.
- Policy answers are concise and in scope.
- Boundary answers do not fabricate and include a safe redirect.
- Capability output uses table/chart correctly without overriding policy boundaries.

---

## Exercise 7: Iterate with one controlled change

1. Reopen your agent instructions and add:

```text
The staff canteen at Seattle HQ is on floor 2. It is open Mon-Fri 7:30am-3pm.
```

2. Save/update the agent.
3. Ask: "Is there a canteen at HQ?"
4. Confirm the new answer appears without regressing previous behavior.

---

## Complete

You can now continue to **Lab E1B — Declarative Agent Foundation with Agents Toolkit** for the pro-code jump.

<div data-widget="labnav"
  data-prev="../01-first-agent-new/"
  data-prev-label="Back to E1 Path Choice"
   data-next="../01-first-agent-toolkit/"
   data-next-label="Continue to Lab E1B - Declarative Agent Foundation with Agents Toolkit"></div>

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/01-first-agent-builder" />
