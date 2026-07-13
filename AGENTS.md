# AGENTS.md - Copilot Developer Camp

This file helps AI coding assistants understand the repository structure, conventions, and workflows for [Copilot Developer Camp](https://aka.ms/copilotdevcamp) - a self-paced lab resource for extending Microsoft 365 Copilot and building custom engine agents.

---

## Repository Overview

| Path | Purpose |
|---|---|
| `docs/` | All MkDocs site content (lab markdown, assets, JS, CSS) |
| `docs/pages/` | Lab content organized by learning path |
| `docs/assets/` | Images, badge artwork, logos |
| `docs/includes/` | Shared markdown snippets (used via `pymdownx.snippets`) |
| `docs/ja/` | Japanese translations (mirrors English structure) |
| `docs/javascripts/` | Custom JS for award tracking, lab navigation, adaptive cards |
| `docs/stylesheets/` | Custom CSS overrides for the Material theme |
| `src/` | Sample source code referenced by labs |
| `mkdocs.yml` | MkDocs configuration - nav structure, plugins, theme settings |
| `README.md` | Repo overview and quick sample index |

---

## Lab Structure and Naming Conventions

Labs are organized under `docs/pages/` by learning path. Each path has its own prefix:

| Prefix | Learning Path | Folder |
|---|---|---|
| `E` | Declarative Agents | `docs/pages/extend-m365-copilot/` |
| `BMA` | Custom Engine - M365 Agents SDK + Microsoft Foundry | `docs/pages/custom-engine/agents-sdk/` |
| `BAF` | Custom Engine - Agent Framework | `docs/pages/custom-engine/agent-framework/` |
| `MCS` | No-code/low-code - Microsoft Copilot Studio | `docs/pages/make/copilot-studio/` |
| `MAB` | No-code/low-code - Agent Builder | `docs/pages/make/agent-builder/` |
| `MSA` | No-code/low-code - Custom SharePoint Agents | `docs/pages/make/sharepoint-agents/` |

**File naming:** `NN-short-description.md` where `NN` is zero-padded (e.g., `00-prerequisites.md`, `01-first-agent.md`, `08-mcp-server.md`).

**Every learning path has:**
- An `index.md` (welcome/overview page)
- A `00-prerequisites.md` (setup and environment)
- Numbered lab files for each step

---

## Running the Docs Site Locally

```bash
# Install dependencies (Python 3.8+ required)
pip install mkdocs-material
pip install mkdocs-static-i18n

# Serve with live reload
mkdocs serve
```

Site is available at `http://127.0.0.1:8000`. The `site/` output folder is git-ignored.

Alternatively with Docker:

```bash
docker run --rm -it -p 8000:8000 -v ${PWD}:/docs squidfunk/mkdocs-material serve --dev-addr=0.0.0.0:8000
```

---

## Adding or Editing Lab Content

1. Create or edit the markdown file in the appropriate `docs/pages/<path>/` folder.
2. Add the new file to the `nav:` section of `mkdocs.yml` (under both `en` and `ja` locales if translating).
3. For shared content (repeated across labs), add a snippet to `docs/includes/` and reference it with:
   ```markdown
   --8<-- "snippet-name.md"
   ```
4. Images go in `docs/assets/images/`. Use relative paths in markdown.
5. For lab step navigation buttons, use the custom `cc-next.js` class (see existing labs for the pattern).

**Admonition blocks** (used heavily throughout the labs):
```markdown
!!! note
    Text here

!!! tip "Custom title"
    Text here

??? warning "Collapsible"
    Text here
```

---

## JavaScript and Award Logic

| File | Purpose |
|---|---|
| `docs/javascripts/cc-award.js` | Badge award tracking and Credly integration |
| `docs/javascripts/cc-next.js` | Lab step navigation (Next/Previous buttons) |
| `docs/javascripts/cc-lab-step.js` | In-page lab step rendering |
| `docs/javascripts/cc-card.js` | Card layout rendering |

---

## Source Code Samples

Sample code for labs lives in `src/`. Each subfolder corresponds to a lab path. Labs reference the source via GitHub links in the markdown rather than embedding code inline.

---

## i18n (Translations)

English is the default locale. Japanese (`ja`) translations mirror the English folder structure under `docs/ja/`. When adding English content, add a corresponding entry in the `ja:` locale nav in `mkdocs.yml` even if the translation is not yet available (use the file path without a label to inherit the English version).

---

## Contribution Checklist

- [ ] Lab markdown follows the existing heading and admonition style
- [ ] New lab file is added to the `nav:` in `mkdocs.yml` (English locale at minimum)
- [ ] `mkdocs serve` runs without errors or warnings
- [ ] Images are in `docs/assets/images/` and referenced with relative paths
- [ ] No hardcoded tenant IDs, client IDs, or secrets in any file
- [ ] CLA bot check passes (required for all external contributors)

---

## Key Contacts and Resources

- Issues: https://github.com/microsoft/copilot-camp/issues
- Discussions: https://github.com/microsoft/copilot-camp/discussions
- Awards: https://microsoft.github.io/copilot-camp/awards/
- Community Recognition Program: https://aka.ms/community/recognition-register
- Sample Solution Gallery: https://aka.ms/community/samples
