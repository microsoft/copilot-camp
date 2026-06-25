---
name: dev-camp-deck
description: |
  Creates a professional PowerPoint presentation about a Copilot Dev Camp lab or topic. Researches Microsoft Learn documentation, organizes content into a slide structure, and generates a polished deck with speaker notes.
  Use when user asks to "create a presentation on", "make a deck about", "build a slideshow for", "present on Dev Camp topic", or "generate slides about" any Copilot Dev Camp lab or Microsoft technology topic.
license: MIT
metadata:
  author: Paolo Pialorsi (M365 Developer Advocate)
  version: "1.0"
---

# Dev Camp PowerPoint Deck Skill

## What This Skill Does

Creates a professional PowerPoint presentation on any Copilot Dev Camp lab or Microsoft technology topic by:

1. **Topic Confirmation** — Clarifies the specific lab/topic and target audience
2. **Research** — Performs multiple searches across Microsoft Learn documentation
3. **Structure** — Organizes findings into a logical slide flow with proper pacing
4. **Content Creation** — Generates a polished PowerPoint deck with:
   - Title slide with topic and date
   - Agenda/outline slide
   - Content slides with key concepts
   - Code/architecture example slides
   - Best practices slide
   - Conclusion with next steps
   - Speaker notes on each slide
   - Source citations

## When to Use This Skill

Activate this skill when you need:
- Presentation on a Dev Camp lab (e.g., Building Agents, Extensions, etc.)
- Overview deck on a Microsoft technology topic
- Training material for a technology or concept
- Conference or team presentation on copilot/AI topics
- Educational slides with speaker guidance

## Workflow

### Step 1: Topic & Audience Selection

Ask the user:
- **Topic**: Which Dev Camp lab or Microsoft technology? (e.g., "Building AI Agents with Copilot")
- **Audience**: Who is this for? (e.g., "Enterprise architects", "Developers", "Executives")
- **Duration**: How long is the presentation? (e.g., "15 minutes", "30 minutes", "60 minutes")
- **Depth**: Technical depth level? (e.g., "Overview", "Intermediate", "Advanced")

### Step 2: Multi-Source Research

Conduct multiple searches to gather comprehensive content:

1. Search: "[Topic] overview"
2. Search: "[Topic] architecture and design"
3. Search: "[Topic] implementation guide"
4. Search: "[Topic] best practices"
5. Search: "[Topic] code examples"
6. Search: "[Specific scenario relevant to topic]"

### Step 3: Slide Structure Planning

Organize content into a logical flow:

```
Slide Breakdown (for 30-minute presentation):

1. Title Slide (1 slide)
   - Topic, presenter, date, organization

2. Agenda (1 slide)
   - Overview of topics to be covered

3. Context/Introduction (2-3 slides)
   - Problem statement
   - Why this matters
   - Key goals

4. Core Content (6-8 slides)
   - Architecture/overview
   - Key components
   - How it works
   - Use cases/scenarios

5. Deep Dive (3-5 slides)
   - Technical details
   - Code examples
   - Configuration/setup

6. Best Practices (2-3 slides)
   - Do's and don'ts
   - Performance tips
   - Security considerations

7. Case Study/Real-World Example (1-2 slides)
   - Practical application
   - Results/impact

8. Conclusion & Next Steps (1-2 slides)
   - Key takeaways
   - Resources
   - Call to action
```

Adjust slide count based on presentation duration.

### Step 4: PowerPoint Generation

Create a professionally formatted PowerPoint with:

**Visual Design**:
- Consistent color scheme (Microsoft branding colors)
- Professional fonts (Segoe UI or similar)
- Proper spacing and alignment
- High-contrast text for readability

**Content Elements**:
- Clear headings on each slide
- Bullet points (not paragraphs)
- Relevant code snippets in formatted code blocks
- Architecture diagrams (text descriptions or ASCII art)
- Tables for comparisons

**Speaker Notes**:
- Detailed notes explaining each slide's talking points
- Estimated speaking time per slide
- Key questions to engage audience
- Transitions between topics

**Citations**:
- Source links in footer or at end
- References to Microsoft Learn documentation
- Links to code samples and repositories

## Output Format

The skill produces a `.pptx` file with:

| Component | Details |
|-----------|---------|
| Slide Count | 10-25 slides depending on topic depth |
| Design | Microsoft-branded, professional template |
| Content | Well-researched, cited from official sources |
| Interactivity | Built-in speaker notes for presenter guidance |
| Media | Text, tables, code blocks, architectural descriptions |

## Slide Template Example

```
Title Slide:
- Centered title: "[Topic] – Copilot Dev Camp"
- Subtitle: Audience level and presenter info
- Date and organization

Content Slide:
- Slide Title (H1)
- 3-5 bullet points (concise, not paragraphs)
- Optional: Code snippet, diagram, or comparison table
- Footer: Slide number and document name

Closing Slide:
- "Thank You" or "Questions?"
- Key resources and links
- Contact information
- Next steps
```

## Topics Covered

The skill can create presentations on:
- Copilot Dev Camp labs (Building Agents, Extensions, etc.)
- Microsoft Foundry concepts and deployment
- Copilot integration patterns
- AI/ML fundamentals
- Microsoft 365 Copilot extensibility
- Teams development
- SharePoint Framework (SPFx)
- Azure AI services
- Any Microsoft technology with Learn documentation

## Information Sources

All content comes from two primary sources:

### 1. Microsoft Learn (`https://learn.microsoft.com`)
- Official Microsoft documentation
- Quickstart guides and tutorials
- Best practice guides
- Code samples and reference implementations
- Architecture patterns and design guides

### 2. Copilot Developer Camp (`https://microsoft.github.io/copilot-camp/`)
- Official Dev Camp labs and learning modules
- Hands-on tutorials and walkthroughs
- Code samples and working examples
- Best practices from the training curriculum
- Real-world scenarios and use cases
- Slide templates and presentation materials

## Tips for Success

- **Be specific** about the topic to get focused content
- **Define your audience** for appropriate technical depth
- **Specify duration** to get right slide count
- **Request variations** if the deck doesn't match expectations
- **Use as a starting point** — customize with your organization's branding and additional data

## Notes

- Presentation generation may take 1-2 minutes for complex topics
- Slides include speaker notes for presenter preparation
- All code examples are from official Microsoft documentation
- Links to Learn docs are included for audience reference
- Decks are ready to present but can be customized further
