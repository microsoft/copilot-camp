---
name: copilot-dev-camp-lab-author
description: |
  Creates new Copilot Dev Camp lab markdown files under docs/pages/<subfolder>/ with a consistent structure, concise exercises, and required custom components.
  Use when asked to author a new lab, scaffold a lab file, or draft a Copilot Dev Camp lab page.
license: MIT
metadata:
  owner: Copilot Dev Camp
  version: "1.0"
---

# Copilot Dev Camp Lab Author

## Purpose

Author a new lab file for Copilot Dev Camp, with the right structure and writing style, and place it in the correct docs path.

## Required Inputs

Collect all required values before creating the lab:

- Target subfolder under `docs/pages`.
- Lab number.
- Lab unique code.
- Lab title.
- Knowledge-base URLs (web sites/pages to use for grounded content).
- Badge suggestions (`badgeId`, `badgeName`) for `cc-award`.

If the target subfolder is missing, ask for it.
If the lab number is missing, ask for it.
If knowledge-base URLs are missing, ask for them before drafting content.

## File Placement Rules

- Create the file only under `docs/pages/<subfolder>/`.
- Use markdown file extension `.md`.
- Suggested naming pattern: `<lab-number>-<slug>.md`.
- If file already exists, ask whether to pick a new number/slug or update existing content.

## Frontmatter Requirements

Every lab markdown file must begin with YAML frontmatter containing the following fields:

```yaml
---
code: <lab-unique-code>
title: <lab-title>
description: <brief-description-of-lab>
tags: [tag1, tag2, tag3]
level: <100|200|300|400|500>
time: <time-to-complete-in-minutes>
badge: <badge-code>
products: [product1, product2]
created-date: <YYYY-MM-DD>
last-edited-date: <YYYY-MM-DD>
---
```

### Frontmatter Field Definitions

- **code**: Unique identifier for the lab (e.g., `WIQ01`).
- **title**: Lab title matching the lab title in content.
- **description**: 1-2 sentence summary of what students will learn (infer the value from the lab content, once created).
- **tags**: Comma-separated list (ask user) converted to YAML list. Examples: `agents`, `copilot`, `m365`.
- **level**: Difficulty level: `100` (beginner), `200` (intermediate), `300` (advanced), `400` (expert), `500` (professional).
- **time**: Estimated time in minutes to complete the lab (infer the value based on the length of the content, once created).
- **badge**: The badge code issued upon lab completion (e.g., `WorkIQ-Expert`).
- **products**: Comma-separated list (ask user) converted to YAML list. Examples: `Teams`, `Copilot`, `SharePoint`, `Work IQ`.
- **created-date**: Lab creation date in `YYYY-MM-DD` format.
- **last-edited-date**: Most recent edit date in `YYYY-MM-DD` format.

## Authoring Constraints

- Every lab must have a unique code and title.
- Every lab file must include YAML frontmatter with all required fields.
- Use no more than 4-5 exercises total.
- Each exercise must have no more than 5-6 steps.
- Keep steps concise; fewer is preferred when pedagogically valid.
- All links to external sites must include the `{target=_blank}` attribute so they open in a new tab. Example: `[Link text](https://example.com){target=_blank}`.

## Writing Style And Structure

Use this style in all generated labs:

- Instructional and practical, focused on outcomes.
- Clear progression from context to hands-on steps.
- Short paragraphs and concrete actions.
- Enterprise-aware language: prerequisites, validation, and expected outcomes.
- Each exercise should end with a visible checkpoint step component.

Use this baseline structure:

1. Lab title and short intro.
2. Scenario.
3. Lab objectives.
4. Exercises with numbered steps.
5. Completion section.
6. Visitor stats image.
7. `cc-next` component.
8. One or more `cc-award` components.

## Mandatory Markup

### A) Lab Title Heading

Immediately after the YAML frontmatter (first line of markdown content), always add a level-1 heading with the lab code and title in this format:

```markdown
# Lab <code> - <title>
```

Example:
```markdown
# Lab WIQ02 - Work IQ A2A Protocol
```

### B) Video placeholder near top (commented out)

Always add this placeholder block near the top of the lab, after the title:

```html
<!--
<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe src="//www.youtube.com/embed/<VIDEO_ID>" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">
        </iframe>
        <div>Get a quick overview of the lab in this video.</div>
    </div>
</div>
-->
```

### C) End each step with cc-end-step

### C) End each step with cc-end-step

At the end of every step, add:

```xml
<cc-end-step lab="<lab-code>" exercise="<exercise-number>" step="<step-number>" />
```

Values must match the current lab code, exercise index, and step index.

### D) Add cc-next at lab end

Always include:

```xml
<cc-next />
```

### E) Visitor stats image before awards

Always include, before awards:

```html
<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/<section>/<lab-id>" />
```

### F) One or more awards

Always include one or more awards and ask the developer for suitable badges if missing:

```xml
<cc-award badgeId="<BadgeId>" badgeName="<Badge Name>" />
```

### G) Image placeholders where useful

When a step needs a screenshot, add placeholders:

```markdown
![TODO: replace with screenshot description](../../assets/images/<folder>/<image>.png)
```

Use the alternate text of the image to suggest to the lab author the image content to capture. The image path should be relative to the lab file.

## Behavior Contract

When this skill is triggered:

1. Ask for any missing required inputs.
2. Confirm target file path under `docs/pages/<subfolder>/`.
3. Confirm lab number and lab code.
4. Ask for knowledge-base URL list.
5. Ask which badges to add.
6. **Collect frontmatter information:**
   - Prompt for lab title and description.
   - Ask for tags (comma-separated) and convert to YAML list.
   - Ask for difficulty level (100–500).
   - Ask for estimated time to completion (in minutes).
   - Ask for badge code.
   - Ask for products (comma-separated) and convert to YAML list.
   - Record created-date and last-edited-date (use current date if not provided).
7. Generate the complete lab markdown with YAML frontmatter and required components.

Do not skip questions when required inputs are missing.

## Generation Checklist

Before finalizing:

- YAML frontmatter is present at the top of the file with all required fields.
- Lab title heading (format: `# Lab <code> - <title>`) is present immediately after frontmatter.
- Frontmatter values match the collected user inputs (code, title, description, tags, level, time, badge, products).
- created-date and last-edited-date are in `YYYY-MM-DD` format.
- File path is under `docs/pages/<subfolder>/`.
- Exercise count is within limits.
- Step count per exercise is within limits.
- Every step ends with `cc-end-step`.
- `cc-next` is present.
- Visitor stats image is present before awards.
- At least one `cc-award` exists.
- Knowledge-base URLs were requested from developer.
- All links to external sites use the `{target=_blank}` attribute.
