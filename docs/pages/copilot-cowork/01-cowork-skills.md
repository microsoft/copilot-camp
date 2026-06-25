# Lab CWRK01 - Copilot Cowork Build your first skill

---8<--- "../includes/cwrk-labs-prelude.md"

In this lab, you'll learn how to build custom Agent Skills for Copilot Cowork, manage skills in the product, and publish your own skills.

At a high level, an Agent Skill is a structured instruction file that teaches Cowork when and how to execute a specific domain workflow. Skills are not generic prompts. They include intent signals, execution guidance, and output expectations so Cowork can reliably select and run the right behavior for a given request.

By the end of this lab, you will:

- Understand what skills are and when to create custom skills
- Manage built-in and custom skills from the **Customize** experience
- Create a skill using the native **Add skill** guided flow
- Create skills manually at a lower level (for example with VS Code), package, and upload them

## Exercise 1: Understand what Agent Skills are

In this exercise you will build a clear mental model of skills, where they fit in Cowork orchestration, and how they differ from plugins.

### Step 1: Review the role of skills in Cowork

Cowork uses skills as reusable execution patterns. During a task, Cowork can load one or more skills based on conversation intent and then run a step-by-step workflow.

From a practical perspective, skills help Cowork:

- Recognize when a specialized workflow is needed
- Apply consistent instructions instead of ad-hoc prompting
- Produce predictable outputs for recurring business tasks

Unlike one-off prompts, skills are durable assets you can reuse across many conversations.

<cc-end-step lab="cwrk01" exercise="1" step="1" />

### Step 2: Compare built-in skills and custom skills

Cowork already includes built-in skills for common tasks like documents, communication, scheduling, and enterprise search. You can create custom skills when:

- You need organization-specific process logic
- You need consistent formatting or governance for outputs
- You want Cowork to trigger a domain workflow from clear phrases

Custom skills complement built-in skills. They do not replace all of Cowork behavior, but they extend Cowork with your business context.

<cc-end-step lab="cwrk01" exercise="1" step="2" />

### Step 3: Distinguish skills from plugins

Keep this distinction in mind:

- **Skills** define behavior and workflow instructions
- **Plugins** package integrations, connectors, and optional skill bundles

Choose a skill-first approach when your main goal is guided task execution. Add plugin/connectors when the workflow also needs external systems.

<cc-end-step lab="cwrk01" exercise="1" step="3" />

## Exercise 2: Manage skills in the Customize panel

In this exercise you will explore how to manage available skills directly in Cowork.

### Step 1: Open the Customize experience

Open [Microsoft 365 Copilot](https://m365.cloud.microsoft){target=_blank}, switch to **Cowork**, and select **Customize** in the left navigation.

You should see two tabs:

- **Plugins**
- **Skills**

Select **Skills** and review:

- **Your skills**: skills you created or acquired through plugin packages
- **Built-in**: skills shipped by Cowork

Use the search box and source filters to narrow results and quickly find specific skills.
Select a skill to open its details page.

For your own skills, if any, validate you can perform management operations such as:

- Edit instructions
- Download the skill file
- Open the file location in OneDrive
- Delete the skill

After any edits, start a new conversation to test behavior changes.

<cc-end-step lab="cwrk01" exercise="2" step="1" />

## Exercise 3: Create a skill with the native Add skill flow

In this exercise you will use Cowork's built-in guided authoring experience from **Customize** -> **Skills**.

### Step 1: Start guided creation from Customize

In **Customize** -> **Skills**, select **Add** -> **Create new**.

Cowork opens a guided conversation to collect your skill definition.
Notice that Cowork is now using a native skill with name **Skill management** to guide you through the creation of a new skill.

Now Cowork will prompt you to select the purpose of your skill. The available options are:

- Writing & drafting: Generates recurring written content in your voice/format.
- Summarizing & briefing: Condenses meetings, email threads, documents, or channels into a consistent structured summary.
- Data & analysis: Pulls and formats data into a standard layout — trackers, dashboards, recurring metric reports.
- Process automation: Runs a multi-step routine you do often — e.g. triage inbox, prep for a meeting, end-of-day wrap-up.
- Describe another option: to freely describe your goal

Select the option **Skip** to provide free text inscrutions for your custom skill.

For example, you can use the following text:

```text
Generate a set of flash cards in PowerPoint to test my knowledge about a specific lab of the Copilot Dev Camp.

Trigger this skill whenver the prompt includes "Create flash cards for a Copilot Dev Camp lab" or something similar, but still referring to "flash cards" and "Copilot Dev Camp".

The result should be a PowerPoint deck with no more than 10 flash cards based on the actual content of the lab referenced, as a URL, by the user. If there is no URL of the lab, ask the user to provide it.

Name the skill "copilot-flash-cards".
```

Cowork will start processing your request, will check the skill name, the capacity of your Cowork profile, it will generate the skill, store it in your OneDrive for Business, validate it and produce a quality report. 

!!! info
    You can have up to 50 custom skills configured in your profile, so when you create a new skill Cowork checks if you are at limit with your capacity.

You can test your skill directly from Cowork and you can iterate the process to fine tune the skill. For example, you can provide the following prompt and check the result.  

```text
Test it with the following URL: https://microsoft.github.io/copilot-camp/pages/extend-m365-copilot/11-mcp-app/
```

<cc-end-step lab="cwrk01" exercise="3" step="1" />

### Step 2: Save and verify where the skill is stored

Once you are happy with your skill, simply close the current session. Cowork stored the skill in your OneDrive for Business in a subfolder of the following folder:

`/Documents/Cowork/skills/`

You can browse your OneDrive for Business and check the content of the new skill folder.

Start a new Cowork task and test a prompt that should trigger your new skill. For example, you can use the following prompt:

```text
Generate flash cards for the Copilot Dev Camp lab available at the following URL: https://microsoft.github.io/copilot-camp/pages/extend-m365-copilot/08-mcp-server/
```

In the right side panel, open **Skills** and verify your custom skill appears among the active skills used during execution.

If the skill does not activate, refine the description to be more specific about when Cowork should use it, then test again in a new conversation.

<cc-end-step lab="cwrk01" exercise="3" step="2" />

## Exercise 4: Create skills manually with VS Code

In this exercise you will build a skill at a lower level by creating the `SKILL.md` file yourself. Or you can also download one of the many skills already available on the Internet and upload it to Cowork.

### Step 1: Create the skill folder and author the SKILL.md file

Create a new folder on your file system, for example name it `weekly-status-coach` and open it with Visual Studio Code. Add an empty `SKILL.md` file to the folder using the VS Code file explorer.

Open the file in VS Code and add YAML frontmatter with `name` and `description`.

Use this baseline template:

```yaml
---
name: weekly-status-coach
description: |
	Creates a concise weekly status update from meetings, notes, and action items.
	Use when user asks to "draft weekly status", "summarize this week",
	"prepare a team update", or "create a Friday status report".
---

# Weekly Status Coach

## What This Skill Does

Creates a structured weekly update with highlights, risks, blockers, and next steps.

## Workflow

1. Gather context from provided files and conversation history.
2. Group items by project or workstream.
3. Identify completed work, risks, and planned next actions.
4. Produce a concise status report with consistent headings.

## Output Format

- Summary
- Completed this week
- Risks and blockers
- Next week plan
```

Important checks:

- Keep `name` in kebab-case
- Ensure `name` aligns with the skill folder identity
- Keep description explicit about trigger scenarios

<cc-end-step lab="cwrk01" exercise="4" step="1" />

### Step 2: Upload the skill in Cowork

In Cowork, open **Customize**, select **Skills**, and use the **Upload skill** option under the **Add** action to upload your package.

After upload, verify the included skills appear in **Your skills**.

If validation fails, check common issues:

- Missing `SKILL.md`
- Invalid YAML frontmatter
- `name` mismatch with folder identity
- Invalid kebab-case naming

<cc-end-step lab="cwrk01" exercise="4" step="2" />

### Step 3: Test end-to-end usage

Start a new conversation and run prompts that should activate your uploaded skills. For example, you can use the following prompt:

```text
Draft my weekly status
```

Verify activation from the side panel and confirm outputs follow the expected workflow and format.

<cc-end-step lab="cwrk01" exercise="4" step="3" />

---8<--- "../includes/cwrk-congratulations.md"

You have completed Lab CWRK01 - Copilot Cowork Build your first skill!

<a href="../copilot-cowork/copilot-cowork/02-cowork-plugins">Continue with</a> Lab CWRK2, to build your first Plugin for Copilot Cowork.

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/copilot-cowork/01-cowork-skills" />
