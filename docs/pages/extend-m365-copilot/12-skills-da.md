---
code: E12
title: Build Agent with Skill using Microsoft 365 Agents Toolkit
description: Build a generic Declarative Agent with a selectively invoked skill that generates realistic business scenarios for demos, workshops, and customer conversations.
tags: [agents, skills, copilot, declarative-agent]
level: 200
time: 20
badge: TBD
products: [Microsoft 365 Copilot, Microsoft 365 Agents Toolkit]
created-date: 2026-08-13
last-edited-date: 2026-08-13
---

# Lab E12 - Build Agent with Skill using Microsoft 365 Agents Toolkit

<!--
<div class="lab-intro-video">
		<div style="flex: 1; min-width: 0;">
				<iframe src="//www.youtube.com/embed/<VIDEO_ID>" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">
				</iframe>
				<div>Get a quick overview of the lab in this video.</div>
		</div>
</div>
-->

<div data-widget="hero"
	data-badge="Standalone · Lab E12"
	data-badge-color="green"
	data-icon="🧩"
	data-subtitle="Add skills to your Declarative agent using code"
	data-time="20 min"
	data-requires="VS Code + Microsoft 365 Agents Toolkit + Microsoft 365 Copilot"
	></div>

In this lab, you'll create a generic **Demo Planning Agent** and extend it with a reusable skill. The skill generates realistic business scenarios for demos, workshops, hackathons, presentations, and customer conversations.

## Why skills in an agent?

A skill is a focused capability that the agent loads when the user's task matches its description. This **progressive disclosure** keeps specialized guidance out of the agent's standing context until it is relevant.

Skills provide several benefits:

- **Smaller always-on instructions:** Keep the agent's core role, tone, and safety guidance concise instead of loading every task-specific procedure on every turn.
- **Focused behavior:** Give each specialized task its own instructions, actions, and supporting knowledge without crowding the agent's general instructions.
- **Predictable activation:** Use the skill description to define which requests should load the capability and which requests the agent should handle normally.
- **Easier maintenance and reuse:** Update a focused skill independently and reuse the same capability across agents without duplicating long instruction blocks.

Use agent-level instructions for behavior that applies to nearly every interaction. Use a skill for specialized guidance or knowledge needed only for matching tasks. If a procedure is deterministic and repeatable, implement it as a script, action, or connector rather than asking the model to reinterpret prose on every run.

## Scenario

Compelling demos begin with a business challenge, not a list of technology features. You need a repeatable way to turn topics such as Microsoft 365 Copilot, Declarative Agents, Model Context Protocol (MCP), Microsoft Graph, Teams applications, and Power Platform into stories that an audience can understand and evaluate.

The **Demo Planning Agent** will handle general planning requests. When a user asks for a demo idea, business scenario, use case, customer story, or workshop example, its **Demo Scenario Generator** skill will identify the requested topic, create a realistic business problem, describe the users and solution, and define measurable outcomes.

## Lab objectives

By the end of this lab, you'll be able to:

- Create a Declarative Agent with Microsoft 365 Agents Toolkit
- Keep the agent's core instructions generic
- Add a custom skill to a Declarative Agent
- Write focused skill activation guidance and instructions in `SKILL.md`
- Explain how a skill is matched to a user's request
- Provision the agent and validate skill invocation in Microsoft 365 Copilot

## Prerequisites

- Visual Studio Code with **Microsoft 365 Agents Toolkit** installed
- A Microsoft 365 account with access to Microsoft 365 Copilot
- Permission to upload custom apps in your Microsoft 365 tenant

---

## Exercise 1: Create the Demo Planning Agent

In this exercise, you'll scaffold a Declarative Agent that you can extend with a skill.

### Step 1: Create a Declarative Agent project

1. Open Visual Studio Code.
2. Open **Microsoft 365 Agents Toolkit** from the Activity Bar.
3. Select **Create a New Agent/App**.
4. Select **Declarative Agent**, and then select **Add an Agent Skill**.
5. Enter `Demo Planning Agent` as the project name and choose a folder.
6. Wait for the toolkit to create and open the project.

The toolkit creates the Declarative Agent project and includes a sample skill as a starting point. In the next exercise, you'll replace the sample skill's placeholder name, activation description, and instructions with the **Demo Scenario Generator** skill.

<cc-end-step lab="E12" exercise="1" step="1" />

### Step 2: Configure generic agent instructions

In the VS Code Explorer, review the generated project structure. The `appPackage` folder contains the app manifest, Declarative Agent manifest, agent instructions, and two app icons. The `skills/hello-atk` folder contains the sample skill and its `SKILL.md` file. You'll customize that skill in Exercise 2; first, configure the agent's general instructions.

Open `appPackage/instruction.txt` and replace its contents with:

```markdown
# Demo Planning Agent

## Role

Help users plan professional demos, workshops, hackathons, presentations,
and customer conversations.

## Skill routing

- Review the available skills for every request.
- Use a skill when its description matches the user's intent.
- Follow the selected skill's instructions and output format.
- Do not apply a skill's specialized format to unrelated requests.
- If no skill matches, respond using the general instructions or ask a concise
	clarifying question.

## General behavior

- Be concise, credible, and practical.
- Do not invent product capabilities.
- State important assumptions.
```

These instructions define general behavior and routing. Do not add scenario-generation steps or output headings here; those belong only in the skill.

<cc-end-step lab="E12" exercise="1" step="2" />

---

## Exercise 2: Customize the sample skill

In this exercise, you'll turn the generated sample skill into the **Demo Scenario Generator** and define the requests that should activate it.

### Step 1: Locate the generated sample skill

1. In the VS Code Explorer, open the `skills/hello-atk` folder.
2. Confirm that it contains a `SKILL.md` file.
3. Rename the `hello-atk` folder to `demo-scenario-generator`.
4. Open `appPackage/declarativeAgent.json` and update the skill folder reference:

	 ```diff
	 "agent_skills": [
		 {
	 -   "folder": "skills/hello-atk"
	 +   "folder": "skills/demo-scenario-generator"
		 }
	 ]
	 ```


<cc-end-step lab="E12" exercise="2" step="1" />

### Step 2: Add the skill instructions

Open the generated `SKILL.md` file and replace its contents with:

```markdown
---
name: demo-scenario-generator
description: |
	Creates realistic business scenarios for demos, workshops, hackathons, and
	presentations. Use when users ask for demo ideas, business scenarios, use
	cases, customer stories, workshop examples, or sample projects.
---

When activated:

1. Identify the technology or topic.
2. Pick the "after" metric first - the specific number or outcome the solution
	 produces (e.g. "cart abandonment drops from 47% to 28%") - then build the
	 business problem backward from it, so the "before" state is exactly what
	 would produce that number. This is what makes a scenario survive a
	 follow-up question instead of collapsing into "improves efficiency."
3. Create a realistic business problem consistent with that number.
4. Describe who the users are.
5. Explain how the solution helps.
6. Include measurable outcomes, stated as the same concrete numbers from step 2.

Return results using the following format:

## Scenario

## Users

## Challenge

## Solution

## Success Criteria
```

> **Tip:** The YAML frontmatter at the top of `SKILL.md` controls skill discovery. The `name` identifies the skill and should match its folder name. The `description` is the activation guidance Copilot compares with the user's intent, so it should clearly state both what the skill does and when to use it.

Save the file. Confirm that its `name` matches the skill folder and that all scenario-specific workflow and formatting rules are contained in `SKILL.md`, not in the agent's core instructions.

<cc-end-step lab="E12" exercise="2" step="2" />

---

## Exercise 3: Provision and test the skill

In this exercise, you'll publish the updated app package and verify that Copilot invokes the skill for different request types.



### Step 1: Provision the updated agent

> **Tip - provisioning workaround:** Before provisioning, open `appPackage/declarativeAgent.json` and rename the `agent_skills` property to `x-agent_skills`. Leaving the property as `agent_skills` currently causes provisioning to fail.
>
> ```diff
> - "agent_skills": [
> + "x-agent_skills": [
> ```
>
> Change only the property name; keep the generated skill configuration inside the array unchanged.

1. Open **Microsoft 365 Agents Toolkit**.
2. Under **Lifecycle**, select **Provision**.
3. Sign in if prompted and select the target Microsoft 365 environment.
4. Wait for provisioning to complete without errors.

Provision the agent again whenever you change its packaged skill files so the latest version is available for testing.

<cc-end-step lab="E12" exercise="3" step="1" />

### Step 2: Test skill activation

Open **Demo Planning Agent** in Microsoft 365 Copilot and start a new conversation. Test each prompt separately:

```text
Give me a customer story for a workshop about our vector search product, something for a technical audience
```

```text
Create a demo scenario for Declarative Agents.
```

```text
Give me a workshop scenario for Microsoft 365 Copilot.
```

```text
Create a customer story for an MCP-enabled agent.
```

For each response, confirm that the agent uses the five headings from `SKILL.md` and creates a scenario relevant to the requested topic.

Then send a request that belongs to the agent's general demo-planning role but not to the scenario-generation skill:

```text
Help me plan the rehearsal schedule and presenter handoffs for a customer demo next week.
```

Confirm that the agent provides practical rehearsal or handoff guidance without using the scenario skill's five-section format. The request is in the agent's scope, but it does not ask for a demo idea, business scenario, use case, customer story, or workshop example. This boundary test demonstrates that `SKILL.md` is loaded only when its description matches the request.

<cc-end-step lab="E12" exercise="3" step="2" />

### Step 3: Compare the result with the expected structure

A response to `Create a demo scenario for Declarative Agents.` should resemble this example:

```text
## Scenario

A customer support organization receives hundreds of repetitive policy questions every week.

## Users

Customer Support Specialists

## Challenge

Support staff spend significant time searching documentation and repeatedly answering the same questions.

## Solution

A Declarative Agent provides consistent answers, surfaces relevant knowledge, and guides employees through company policies and procedures.

## Success Criteria

- Reduce response times
- Improve answer consistency
- Decrease repetitive requests
- Increase employee satisfaction
```

The wording can vary. Validate the structure, business relevance, intended users, solution value, and measurable outcomes rather than expecting an exact match.

<cc-end-step lab="E12" exercise="3" step="3" />

## How skill matching works

When a user sends a prompt, the agent evaluates the request against its available capabilities. Copilot compares the user's intent with skill descriptions and loads the relevant skill instructions when there is a match. The agent then follows the selected `SKILL.md` workflow to produce its response.

Keeping each skill focused makes its activation easier to predict and prevents specialized instructions from crowding the agent's general instructions.

## Congratulations

You created a generic Declarative Agent with a custom skill and verified both positive and negative skill matching.

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/e12-skills-da" />

<!-- Badge pending. Add the approved award before publishing:
<cc-award badgeId="TBD" badgeName="TBD" />
-->
