---
code: CWRK04
title: Create plugins using Work IQ Dev Tools with GitHub Copilot
description: Build, validate, provision, and test a Microsoft Learn MCP plugin for Copilot Cowork using Work IQ Dev Tools (WIQD) and GitHub Copilot.
tags: [copilot, cowork, plugins, wiqd, mcp]
level: 300
time: 45
badge: CWRK04
products: [Microsoft 365 Copilot, Copilot Cowork, GitHub Copilot, Work IQ Dev Tools]
created-date: 2026-10-19
last-edited-date: 2026-10-21
---
# Lab CWRK04 - Create plugins using Work IQ Dev Tools with GitHub Copilot

<!--
<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe src="//www.youtube.com/embed/<VIDEO_ID>" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">
        </iframe>
        <div>Get a quick overview of the lab in this video.</div>
    </div>
</div>
-->


In [Lab CWRK02](02-cowork-plugins.md), you explored the pieces of a Cowork plugin. In this lab, you'll use **Work IQ Dev Tools (WIQD)** and its GitHub Copilot agent to generate and validate those pieces through a guided conversation.

You'll build **Microsoft Learn Helper**, a connector-only plugin that gives Copilot Cowork access to current Microsoft documentation and code samples. You don't need to host an MCP server or configure connector credentials.

This lab follows the [WIQD installation guide](https://github.com/microsoft/plugins/blob/main/tools/wiqd/cookbooks/README.md){target=_blank} and the [Microsoft Learn MCP cookbook recipe](https://github.com/microsoft/plugins/tree/main/tools/wiqd/cookbooks/plugins/microsoft-learn-mcp){target=_blank}.

## Scenario

Your engineering team needs up-to-date implementation guidance without switching between Cowork and documentation searches. Package the public Microsoft Learn MCP server as a plugin so the team can search official documentation, retrieve code samples, and read complete Learn pages from a Cowork session.

The workflow has two distinct surfaces:

| Surface | Your task |
|---------|-----------|
| **GitHub Copilot with the WIQD agent** | Create, inspect, validate, and provision the plugin project. |
| **Copilot Cowork** | Install the resulting plugin and verify that it calls the Microsoft Learn tools. |

## Lab objectives

By the end of this lab, you will:

- Install WIQD and check your development environment.
- Use the WIQD agent in GitHub Copilot to create a standalone plugin.
- Add a public MCP connector with its tool-description file.
- Validate the generated app package before provisioning it.
- Test documentation search, code sample search, and page retrieval in Cowork.

!!! tip "Prerequisites"
    - Access to Copilot Cowork with a work or school account.
    - Permission to provision and share an app in your Microsoft 365 development tenant.
    - Node.js 24 or later and WIQD 0.13.1 or later; you'll check these in Exercise 1.

!!! note "No-auth connector does not mean anonymous provisioning"
    The public endpoint at `https://learn.microsoft.com/api/mcp` uses streamable HTTP and requires no connector authentication. You still sign in to WIQD to provision the plugin in your Microsoft 365 tenant. Use a development tenant and follow its app installation and consent policies.

## Exercise 1: Prepare WIQD and GitHub Copilot

In this exercise, you'll install the tools, select the WIQD agent, and confirm that you're working in the intended tenant.

### Step 1: Install Node.js, GitHub Copilot, and WIQD

Check your Node.js version:

```bash
node --version
```

If it is older than 24, install Node.js 24 or later using your preferred method. For example, with an existing version manager:

=== "macOS / Linux (nvm)"

    ```bash
    nvm install 24 && nvm use 24
    ```

=== "Windows (fnm)"

    ```powershell
    fnm install 24 && fnm use 24
    ```

Before installing WIQD, set up the GitHub Copilot experience you'll use:

=== "GitHub Copilot app"

    Install the desktop app using the command for your operating system. You don't need to install the standalone Copilot CLI for this route.

    === "macOS"

        With [Homebrew](https://brew.sh/){target=_blank} installed, run:

        ```bash
        brew install --cask github-copilot-app
        ```

        After installation completes successfully, open the app:

        ```bash
        open -a "GitHub Copilot"
        ```

    === "Windows (PowerShell)"

        With [WinGet](https://learn.microsoft.com/windows/package-manager/winget/){target=_blank} installed, run:

        ```powershell
        winget install --exact --id GitHub.CopilotApp --source winget
        ```

        After installation completes successfully, open **GitHub Copilot** from the Start menu.

    If you don't have Homebrew or WinGet, download and run the installer for your operating system from the [official GitHub Copilot app download page](https://github.com/features/ai/github-app){target=_blank}.

    Sign in with your GitHub account and complete onboarding before installing WIQD. For prerequisites and setup details, see [Getting started with the GitHub Copilot app](https://docs.github.com/en/copilot/get-started/quickstart-copilot-app){target=_blank}.

=== "GitHub Copilot CLI"

    Install the standalone CLI if it isn't already installed:

    ```bash
    npm install -g @github/copilot
    copilot --help
    ```

    Confirm that help lists the `--agent` option. If it doesn't, check which `copilot` executable your shell resolves and reinstall the standalone CLI following the [Copilot CLI installation guide](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli){target=_blank}.

!!! important "Install GitHub Copilot before WIQD"
    The WIQD installer registers the WIQD agent with your installed GitHub Copilot experience. If you install GitHub Copilot after WIQD, rerun the WIQD installer below so it can register the agent. The `--agent` option confirms CLI support for custom agents, not that the WIQD agent is installed.

Once GitHub Copilot is installed, install WIQD using the command for your operating system from the installation guide. Review the installer before running it, according to your organization's policy.

=== "macOS / Linux"

    ```bash
    curl -fsSL https://aka.ms/wiqd/install.sh | bash
    ```

=== "Windows (PowerShell)"

    ```powershell
    iex "& { $(irm 'https://aka.ms/wiqd/install.ps1') }"
    ```

Verify the installed version:

```bash
wiqd --version
```

**Checkpoint:** Node.js reports version 24 or later, your chosen GitHub Copilot experience was installed before running the WIQD installer, and WIQD reports version 0.13.1 or later.

<cc-end-step lab="cwrk04" exercise="1" step="1" />

### Step 2: Sign in and check the environment

Run these commands in your terminal:

```bash
wiqd auth login --interactive
wiqd auth status
wiqd doctor
```

Complete the browser sign-in, consent, and multi-factor authentication prompts with the work or school account for your development tenant. WIQD uses installed authentication providers, so the output can mention more than one provider.

If the status shows the wrong account or tenant, correct it before continuing:

```bash
wiqd auth logout
wiqd auth login --interactive
wiqd auth status
```

Resolve any blocking errors reported by `wiqd doctor`. For provider-specific issues, use the [WIQD authentication guide](https://microsoft.github.io/wiqd/getting-started/authentication/){target=_blank}.

**Checkpoint:** The intended account is signed in and `wiqd doctor` reports no blocking errors.

<cc-end-step lab="cwrk04" exercise="1" step="2" />

### Step 3: Start the WIQD agent in GitHub Copilot

Choose one of the GitHub Copilot experiences:

=== "GitHub Copilot app"

    Open a working folder for the new project in the GitHub Copilot app. Open the **Default agent** selector and choose **wiqd**. You don't need to install the standalone Copilot CLI for this route.

=== "GitHub Copilot CLI"

    From a working directory for your new project, start:

    ```bash
    copilot --agent wiqd:wiqd
    ```

!!! tip "WIQD agent missing?"
    If **wiqd** isn't in the app's agent selector, or the CLI supports `--agent` but can't find `wiqd:wiqd`, rerun the WIQD installer for your operating system from Step 1 now that GitHub Copilot is installed. Then reopen your GitHub Copilot session and select **wiqd** or retry `copilot --agent wiqd:wiqd`. Reinstalling the Copilot CLI alone doesn't register the WIQD agent.

Enter this prompt:

```text
Check my WIQD plugin development environment before making changes.
Verify Node.js is at least version 24, WIQD is at least version 0.13.1,
and my signed-in account targets the intended development tenant.
Run WIQD doctor and explain any blocking issues so we can resolve them.
```

!!! important "Keep the same authoring session"
    Enter the remaining build and provisioning prompts in this same GitHub Copilot session. Review proposed commands and changes before approving them. The prompts in this page are instructions to paste into Copilot, not executable terminal commands.

**Checkpoint:** The WIQD agent confirms that your environment is ready to create and provision a plugin.

<cc-end-step lab="cwrk04" exercise="1" step="3" />

## Exercise 2: Generate and validate the plugin

In this exercise, you'll create the plugin and inspect the connector rather than treating generated files as a black box.

### Step 1: Create Microsoft Learn Helper

Ask the WIQD agent:

```text
Create a standalone Copilot Cowork plugin named Microsoft Learn Helper
in a new project folder. Show me the generated project root and explain
the purpose of wiqd.plugin.json, m365agents.yml, and appPackage/manifest.json.
Use the generated plugin root as the working directory for subsequent commands.
```

Review the proposed changes and confirm that these files exist:

| File | What to inspect |
|------|-----------------|
| `wiqd.plugin.json` | The WIQD plugin project definition. |
| `m365agents.yml` | The project lifecycle configuration used for provisioning. |
| `appPackage/manifest.json` | The Microsoft 365 app manifest that describes the plugin. |

**Checkpoint:** The generated project contains all three files and subsequent commands target its root.

<cc-end-step lab="cwrk04" exercise="2" step="1" />

### Step 2: Add the public Microsoft Learn connector

Enter this prompt in the same session:

```text
Add a Microsoft Learn MCP connector to Microsoft Learn Helper.
Use https://learn.microsoft.com/api/mcp with streamable HTTP and no
authentication. Discover the endpoint's current tools for documentation
search, code sample search, and reading documentation pages.
Include the MCP tool-description file in the app package and reference
it from the connector so Copilot Cowork can verify the tools.
Show me the manifest and tool-description changes before proceeding.
```

Review the generated files and check that:

- The manifest has a Microsoft Learn entry under `agentConnectors`.
- That connector points to `https://learn.microsoft.com/api/mcp`.
- The connector references a tool-description file included in the app package.
- The connector has **no authorization block** and introduces no API key or client secret.

This is a connector-only plugin. Adding a custom skill or declarative agent is not necessary for this scenario.

**Checkpoint:** The connector and its referenced tool-description file are present, with no connector authentication configured.

<cc-end-step lab="cwrk04" exercise="2" step="2" />

### Step 3: Validate the generated package locally

Ask Copilot:

```text
Summarize Microsoft Learn Helper and its connector, then run local WIQD
validation. Verify that the referenced MCP tool-description file exists
in the app package and describes the discovered tools.
If validation fails, explain each error, propose a correction, and
rerun validation after I approve the changes. Do not provision yet.
```

Read the validation output. A summary of the intended design is not a substitute for a successful validation result.

**Checkpoint:** The summary lists the Microsoft Learn connector and WIQD static validation completes successfully.

<cc-end-step lab="cwrk04" exercise="2" step="3" />

## Exercise 3: Provision and install in Copilot Cowork

In this exercise, you'll move from a locally validated project to an installed Cowork plugin.

### Step 1: Provision the plugin

In your authoring session, enter:

```text
Provision Microsoft Learn Helper as a Copilot Cowork plugin using WIQD.
Before running provisioning, confirm the target account and tenant and
explain the actions that will change the tenant. Ask for my approval.
Report the actual provisioning result and any returned app identifiers.
If provisioning fails, show the error and help me resolve it.
```

Approve provisioning only after checking the target tenant. Keep the reported app identifier with your project so you can distinguish this plugin from similarly named apps.

**Checkpoint:** WIQD reports successful provisioning of **Microsoft Learn Helper** in the intended development tenant.

<cc-end-step lab="cwrk04" exercise="3" step="1" />

### Step 2: Install and enable the plugin

Switch to **Copilot Cowork** using the account and tenant you provisioned to.

1. Open the plugin UI and find **Microsoft Learn Helper**.
2. Install the plugin.
3. Start a new Cowork session and enable **Microsoft Learn Helper**.

If you can't find or install the plugin, check the account and tenant, confirm the provisioning result, and ask your tenant administrator whether app availability or installation policies are blocking it. Don't bypass tenant policies.

**Checkpoint:** Microsoft Learn Helper is installed and enabled in a new Cowork session.

<cc-end-step lab="cwrk04" exercise="3" step="2" />

## Exercise 4: Verify the connector in Cowork

In this exercise, you'll verify actual tool use, not just whether Cowork produces a plausible answer. Run these prompts in **Copilot Cowork**, not in the GitHub Copilot authoring session.

### Step 1: Search official documentation

Enter:

```text
Use Microsoft Learn Helper to find current official documentation for
building a remote MCP server in TypeScript. Summarize the relevant
guidance and include links to the Microsoft Learn sources.
```

Inspect the tool activity shown by Cowork. Confirm a call to `microsoft_docs_search` and open the returned Learn links to check that they support the answer.

**Checkpoint:** Cowork uses the connector's documentation search tool and returns relevant official sources.

<cc-end-step lab="cwrk04" exercise="4" step="1" />

### Step 2: Find a language-specific code sample

Enter:

```text
Use Microsoft Learn Helper to find a C# sample that authenticates with
DefaultAzureCredential. Search code samples with C# as the language,
explain the example, and link to its source.
```

Confirm that Cowork invokes `microsoft_code_sample_search` with C# as the language. Check that the returned example uses `DefaultAzureCredential` and includes a source link.

**Checkpoint:** The code sample tool runs with the requested language and returns a relevant example.

<cc-end-step lab="cwrk04" exercise="4" step="2" />

### Step 3: Read a complete Learn page

Copy a Microsoft Learn documentation page URL from the first test and replace the placeholder before sending:

```text
Use Microsoft Learn Helper to read this page in full:
<paste the Microsoft Learn documentation URL here>
Summarize its prerequisites. If it has no explicit prerequisites section,
say so and distinguish any inferred requirements from the page's statements.
Include the source URL.
```

Confirm a call to `microsoft_docs_fetch` for that URL. Compare the answer with the actual page.

!!! tip "If a test doesn't use the connector"
    Confirm the plugin is enabled in the current Cowork session and repeat the request with its name. If the tool call fails, capture the error and return to your WIQD authoring session to inspect the connector and tool-description file. Validate any correction, provision the update, and repeat the affected test. A response based only on model knowledge does not pass the checkpoint.

**Checkpoint:** The page retrieval tool runs for the supplied URL and the summary accurately reflects the source.

<cc-end-step lab="cwrk04" exercise="4" step="3" />

## Congratulations!

You've created **Microsoft Learn Helper** using Work IQ Dev Tools and GitHub Copilot, validated its package, provisioned it to your development tenant, and tested all three Microsoft Learn tool workflows in Copilot Cowork.

You now have a repeatable pattern: describe the plugin to the WIQD agent, review the generated components, validate locally, approve provisioning, and verify the installed connector with observable tool calls.

## References

- [WIQD installation and sign-in guide](https://github.com/microsoft/plugins/blob/main/tools/wiqd/cookbooks/README.md){target=_blank}
- [Microsoft Learn MCP plugin cookbooks recipe](https://github.com/microsoft/plugins/tree/main/tools/wiqd/cookbooks/plugins/microsoft-learn-mcp){target=_blank}


<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/copilot-cowork/04-cowork-plugins-wiqd" />
