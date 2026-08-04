# Archived labs

This folder holds Copilot Developer Camp lab content that has been retired from the published site.

The pages are kept here so the material is not lost and can be consulted or revived, but they are **outside `docs/`**, so MkDocs does not build them and they are not reachable from the site or the navigation.

## custom-engine/agent-framework

These five labs were part of the earlier eight-lab Agent Framework track (BAF0-BAF7). In August 2026 that track was shortened to four labs focused on building the agent and grounding it:

| Retired lab | Was | Notes |
|---|---|---|
| `03-add-vision-analysis.md` | BAF3 - Add Vision Analysis with Mistral AI | Damage-photo analysis with a Mistral vision model and Azure Blob Storage |
| `04-add-policy-search.md` | BAF4 - Add Policy Search | Policy index, knowledge source, and `PolicyPlugin` |
| `05-add-communication.md` | BAF5 - Add Communication Capabilities | Investigation reports and email via Microsoft Graph. **Also contained the On-Behalf-Of (OBO) user-authentication setup**, which has been carried forward into the current BAF3 lab |
| `06-add-copilot-api.md` | BAF6 - Add Copilot Retrieval API Integration | Superseded by the current `03-add-copilot-retrieval.md` (BAF3 - Work IQ), which is a shortened, self-contained rewrite |
| `07-add-mcp-tools.md` | BAF7 - Add MCP Tools Integration | Consumed the `src/agent-framework/insurance-mcp` server |

### The current track

- BAF0 - Prerequisites
- BAF1 - Build and Run Your First Agent
- BAF2 - Ground your agent with Foundry IQ
- BAF3 - Ground your agent in Microsoft 365 content with Work IQ

### Related source code

The reference solutions for the retired labs were moved to `archive/src/agent-framework/`:

| Archived folder | Was the solution for |
|---|---|
| `BAF3-complete` | the old BAF3 (vision analysis) — **note:** `src/agent-framework/BAF3-complete` now refers to the *new* BAF3 (Work IQ) |
| `BAF4-complete` | BAF4 (policy search) |
| `BAF5-complete` | BAF5 (communication) |
| `BAF6-complete` | BAF6 (Copilot Retrieval API) |
| `BAF7-complete` | BAF7 (MCP tools) |
| `insurance-mcp` | the MCP server consumed by BAF7 |
| `complete` | the full eight-lab solution |

The current track ships one complete solution per lab under `src/agent-framework/`: `begin`, `BAF1-complete`, `BAF2-complete`, and `BAF3-complete`. All four compile cleanly.

### Reviving a lab

1. Move the file back into `docs/pages/custom-engine/agent-framework/`.
2. Re-add it to the `nav` in `mkdocs.yml`.
3. Re-add its `labId` and exercise/step entries to `docs/javascripts/labs-and-steps.json` so badge progress tracks correctly.
4. Check its "start from here" download link and its `cc-next` target still point at the right neighbours.
