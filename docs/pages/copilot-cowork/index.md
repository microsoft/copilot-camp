# 🧩 Build Plugins for Copilot Cowork

> **Developer path · Plugins**
> Package your know-how, your tools and your data once — and bring them into Copilot Cowork today. More Microsoft 365 Copilot surfaces are coming soon.

!!! info "Where plugins run"
    **Available now:** Copilot Cowork

    **Coming soon:** More Microsoft 365 Copilot surfaces. The plugin you build today is the same package that will light up there, so you won't need to rebuild it.

---

## What Is a Plugin?

**A plugin is the package. The building blocks are what you put in it.**

It isn't a new kind of file. A plugin is a standard **Microsoft 365 app package**, the same one used by Teams apps, Copilot agents and Office add-ins, and `manifest.json` is its single source of truth.

| Building block | What it is | Use it when… |
|---|---|---|
| **Skills** | Workflows written in the open `SKILL.md` format ([agentskills.io](https://agentskills.io)). Plain instructions that teach Cowork how to do a job, with optional scripts. | The job is a **workflow**, like triaging issues, preparing a report or following a review checklist. |
| **Connectors** | Your own **remote MCP servers** that give Cowork live tools and data from external systems and APIs. | The job is an **action against your system**, or needs **your data**. |
| **Agents** | Declarative agents that combine instructions, tools and orchestration for multi-step work. | The job is **multi-step** and needs orchestration. |

### Any combination is a valid plugin

Skills alone · Connectors alone · Skills + Connectors · Skills + Agent 

You don't have to build all primitives. **Start with the one your problem needs**, then add the others to the same package as the problem grows.

---

## Why Plugins?

- **Build once.** You package one set of files once, and new surfaces pick up the plugin you've already shipped.
- **Built on open standards.** Tools use **MCP (Model Context Protocol)**, skills use **SKILL.md**, and authentication uses patterns your security reviewers already know.
- **Portable skills.** The same `SKILL.md` works in VS Code / GitHub Copilot, Claude Code and more. If you already have a Claude Code or Cursor plugin, you can import it.
- **Governed.** Admins upload, scope, install and block plugins in the **Microsoft 365 admin center**.

> 💡 *Your effort compounds instead of repeating.*

---

## Choose Your Starting Point
 
<div data-widget="onramp"
     data-title="Choose your pathway"
     data-sub="Explore Copilot Cowork first, or start building and securing a plugin."
     data-steps="Explore Copilot Cowork::lab::Copilot Cowork setup and extensibility — CWRK0::Learn how Cowork works, prepare your tenant, and explore its extensibility options.::Explore Cowork::00-cowork-setup|Build plugin::lab::Plugin pathway — CWRK2 and CWRK3::Build your first plugin, then add Microsoft Entra SSO authentication.::Start the plugin pathway::02-cowork-plugins"></div>


