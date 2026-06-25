---
name: dev-camp-document
description: |
  Authors a professional Word document about a Copilot Dev Camp lab or Microsoft technology topic. Researches Microsoft Learn documentation, organizes content into a document structure, and generates a polished one-pager or detailed guide with formatting and citations.
  Use when user asks to "write a document about", "create a guide for", "author a one-pager on", "write a technical brief on", or "create documentation for" any Copilot Dev Camp lab or Microsoft technology topic.
license: MIT
metadata:
  author: Paolo Pialorsi (M365 Developer Advocate)
  version: "1.0"
---

# Dev Camp Word Document Skill

## What This Skill Does

Creates a professional Word document on any Copilot Dev Camp lab or Microsoft technology topic by:

1. **Topic Confirmation** — Clarifies the specific lab/topic, audience, and document type
2. **Research** — Performs multiple searches across Microsoft Learn documentation
3. **Structure** — Organizes findings into a logical document outline
4. **Content Creation** — Generates a polished Word document with:
   - Professional header and title page
   - Table of contents (auto-generated)
   - Organized sections with clear hierarchy
   - Code examples and architecture diagrams
   - Summary tables and comparisons
   - Conclusion and next steps
   - Formatted citations and references
   - Consistent styling throughout

## When to Use This Skill

Activate this skill when you need:
- One-pager summary of a Dev Camp lab
- Technical guide or implementation documentation
- Architecture decision record (ADR) for a technology
- Training material or learning guide
- Best practices documentation
- Quick reference guide
- Comparison or evaluation document
- Requirements or design document

## Workflow

### Step 1: Topic, Audience & Format Selection

Ask the user:
- **Topic**: Which Dev Camp lab or Microsoft technology? (e.g., "Building AI Agents with Copilot")
- **Document Type**: What kind of document? (e.g., "One-pager", "Technical Guide", "How-To", "Overview")
- **Audience**: Who is this for? (e.g., "Developers", "Architects", "Decision Makers", "Operations")
- **Length**: How detailed? (e.g., "1 page", "3-5 pages", "Comprehensive guide")

### Step 2: Multi-Source Research

Conduct multiple searches to gather comprehensive content:

1. Search: "[Topic] overview and getting started"
2. Search: "[Topic] architecture and design patterns"
3. Search: "[Topic] implementation guide and best practices"
4. Search: "[Topic] code examples and quickstarts"
5. Search: "[Topic] troubleshooting and common issues"
6. Search: "[Topic] vs [similar technology]" (if relevant)

### Step 3: Document Structure Planning

Organize content based on document type:

**One-Pager Structure**:
```
- Title and date
- Executive Summary (150 words)
- Key Capabilities (bullet list)
- Architecture Overview (diagram description)
- Getting Started (quick reference)
- Best Practices (3-5 items)
- Resources and Links
```

**Technical Guide Structure**:
```
- Title page
- Table of Contents
- Executive Summary
- Introduction and Context
- Architecture and Design
  - System overview
  - Components and interaction
  - Data flow
- Implementation
  - Prerequisites
  - Step-by-step setup
  - Configuration
  - Code examples
- Best Practices
  - Performance optimization
  - Security considerations
  - Scalability patterns
- Troubleshooting
- Resources and References
```

**How-To Structure**:
```
- Title and objective
- Prerequisites
- Overview/Context
- Step-by-step instructions
  - Step 1: [Task]
  - Step 2: [Task]
  - Step 3: [Task]
- Example walkthrough
- Troubleshooting
- Advanced options
- Resources
```

### Step 4: Word Document Generation

Create a professionally formatted document with:

**Formatting**:
- Professional template with consistent styling
- Proper heading hierarchy (H1, H2, H3)
- Readable font and size (Calibri 11pt or Segoe UI 11pt)
- Proper spacing between sections
- Page breaks for logical sections
- Header and footer with document title and page numbers

**Content Elements**:
- Clear, concise writing
- Bullet points for readability
- Numbered lists for procedures
- Tables for comparisons or data
- Code blocks for technical examples
- Callout boxes for important notes
- Images/diagrams (described or embedded if available)

**Professional Elements**:
- Title page with topic, date, and version
- Automatically generated table of contents
- Section breaks for organization
- Consistent formatting throughout
- Proper citation of sources
- Links to Learn documentation

## Output Format

The skill produces a `.docx` file with:

| Component | Details |
|-----------|---------|
| Page Count | 1-15 pages depending on depth |
| Format | Professional Word template with styling |
| Content | Well-researched, cited from official sources |
| Structure | Clear hierarchy with TOC and sections |
| Elements | Text, tables, code blocks, lists |

## Document Template Example

**One-Pager**:
```
[HEADER]
Document Title | Version 1.0 | Date | Author

[TITLE]
# [Topic] – Quick Reference Guide

[EXECUTIVE SUMMARY]
[2-3 sentence overview of what this is about]

[KEY CAPABILITIES]
• Capability 1: Description
• Capability 2: Description
• Capability 3: Description

[GETTING STARTED]
[Step-by-step or quick reference]

[RESOURCES]
• Link to Learn doc
• Link to sample code
• Link to tutorial
```

**Technical Guide**:
```
# [Topic] Technical Guide

## Executive Summary
[Overview and key points]

## Architecture
[System design and components]

## Implementation
[How to set up and configure]

## Best Practices
[Performance and security guidance]

## Resources
[Links and references]
```

## Topics Covered

The skill can create documents on:
- Copilot Dev Camp labs (Building Agents, Extensions, etc.)
- Microsoft Foundry concepts and deployment
- Copilot integration patterns
- Microsoft 365 Copilot extensibility
- Teams development
- SharePoint Framework (SPFx)
- Azure AI services
- API design and development
- Security and compliance topics
- Any Microsoft technology with Learn documentation

## Information Sources

All content comes from two primary sources:

### 1. Microsoft Learn (`https://learn.microsoft.com`)
- Official Microsoft documentation
- Quickstart guides and tutorials
- Best practice guides and design patterns
- Code samples and reference implementations
- Architecture guides and decision records

### 2. Copilot Developer Camp (`https://microsoft.github.io/copilot-camp/`)
- Official Dev Camp labs and learning modules
- Hands-on tutorials and walkthroughs
- Code samples and working examples
- Best practices from the training curriculum
- Real-world scenarios and use cases
- Documentation templates and examples

## Document Customization

The generated documents can be further customized:
- Add company branding and logos
- Adjust color scheme to match organization style
- Add additional sections or details
- Include internal examples or screenshots
- Add team-specific notes or recommendations
- Expand or condense sections as needed

## Tips for Success

- **Be specific** about the topic to get focused content
- **Define document type** for appropriate structure
- **Specify audience** for appropriate technical depth
- **Indicate length** to get right level of detail
- **Use as draft** — document may need your customization
- **Request variations** if content needs adjustment

## Notes

- Document generation may take 1-2 minutes for complex topics
- All code examples are from official Microsoft documentation
- Links to Learn docs are included for reader reference
- Documents use standard formatting compatible with all Word versions
- Documents are print-ready and can be exported to PDF
- All content is cited and sourced from official Microsoft resources
