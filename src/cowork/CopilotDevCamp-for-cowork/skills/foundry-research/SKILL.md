---
name: foundry-research
description: |
  Researches and compiles comprehensive information about Microsoft Foundry, including documentation, architecture, models, and deployment options.
  Use when user asks to "research Microsoft Foundry", "learn about Foundry", "Foundry documentation", "Foundry architecture", "Foundry models", "how to deploy with Foundry", "Foundry features", or "Foundry capabilities".
license: MIT
metadata:
  author: Paolo Pialorsi (M365 Developer Advocate)
  version: "1.0"
---

# Microsoft Foundry Research Skill

## What This Skill Does

This skill helps you deep-dive into Microsoft Foundry documentation and capabilities by:

1. **Searching multiple topics** across Microsoft Foundry documentation
2. **Collecting** architecture guides, model documentation, and deployment patterns
3. **Organizing** findings into clear sections (Overview, Architecture, Models, Deployment, Best Practices)
4. **Generating** a comprehensive research summary with links and code samples

## When to Use This Skill

Activate this skill when you need:
- Overview of Microsoft Foundry platform and components
- Understanding of available models and their capabilities
- Deployment and configuration guidance
- Best practices for building with Foundry
- Integration patterns with Azure services
- Code samples and quickstart guides

## Workflow

### Step 1: Topic Definition
Ask the user to clarify their specific Foundry interest:
- **Foundry platform overview?** (architecture, components)
- **Specific model?** (which model and its capabilities)
- **Deployment scenario?** (local, cloud, hybrid)
- **Integration use case?** (agents, workflows, content generation)

### Step 2: Multi-Topic Research
Conduct multiple searches across the Microsoft Learn MCP Server:

1. Search: "Microsoft Foundry platform overview architecture"
2. Search: "Microsoft Foundry models and capabilities"
3. Search: "Microsoft Foundry deployment options"
4. Search: "Microsoft Foundry best practices"
5. Search: Specific topic based on user interest (e.g., "Foundry agents", "Foundry fine-tuning")

### Step 3: Information Organization
Compile findings into these sections:

```
## Microsoft Foundry Research Summary

### Overview
[Platform description, key components, use cases]

### Architecture
[System design, core components, integration points]

### Available Models
[Model list with capabilities, performance characteristics]

### Deployment Options
[Local development, cloud deployment, hybrid approaches]

### Best Practices
[Recommended patterns, performance optimization, security]

### Getting Started
[Quickstart guides, code examples, resources]

### Related Services
[Azure integration, complementary services]

### Additional Resources
[Links to official documentation and samples]
```

### Step 4: Deliverable Format

Structure findings as a detailed markdown document with:
- Clear section headers
- Bullet points for key information
- Direct links to Learn documentation
- Code snippets where relevant
- Architecture diagrams described in text
- Comparison tables for models or options

## Output Format

The skill produces a comprehensive research report with:

| Component | Content |
|-----------|---------|
| Executive Summary | 2-3 sentence overview of Foundry |
| Core Findings | 5-7 key points about the user's interest area |
| Technical Details | Architecture, models, APIs, configuration |
| Code Examples | Relevant quickstart code or integration patterns |
| Best Practices | Performance, security, and scalability guidance |
| Resource Links | Direct links to Learn documentation |

## Information Sources

All research comes from two primary sources:

### 1. Microsoft Learn MCP Server (`https://learn.microsoft.com/api/mcp`)
- Microsoft official documentation
- Quickstart guides and tutorials
- Architecture patterns and design guides
- Code samples and reference implementations
- Best practice recommendations

### 2. Copilot Developer Camp (`https://microsoft.github.io/copilot-camp/`)
- Official Dev Camp labs and learning modules
- Hands-on tutorials and walkthroughs
- Code samples and working examples
- Best practices from the training curriculum
- Real-world scenarios and use cases

## Notes

- All searches are performed against official Microsoft documentation and Copilot Dev Camp resources
- Response times depend on the complexity of the topic and number of searches needed
- Findings are cited directly from Microsoft Learn and Copilot Developer Camp resources
- Code examples are from official Microsoft quickstarts and Copilot Dev Camp samples
