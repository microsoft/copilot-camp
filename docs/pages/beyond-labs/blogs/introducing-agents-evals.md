# Agent Evaluations: From Principles to Practice

<cc-blog-meta author="Paolo Pialorsi" date="August 3, 2026" image="../../../../assets/authors/paolo-pialorsi.png"></cc-blog-meta>

Agents are probabilistic systems. The same request can produce different answers, and a small change to instructions, knowledge, tools, or models can improve one scenario while quietly breaking another.

Agent evaluations, often shortened to *evals*, replace "now it seems better" with repeatable evidence. They help teams measure quality, reproduce failures, catch regressions, and explain progress with data.

## Why agent evaluations matter

Traditional software can often be verified by comparing a deterministic output with an expected value. Agents are different: their responses can vary in wording, reasoning, source selection, and tool usage while still being valid.

Manual testing alone cannot provide enough confidence. A few successful conversations might demonstrate that an agent can work, but they do not prove that it works consistently across users, phrasings, contexts, and edge cases.

Without a structured evaluation practice, common challenges are difficult to manage:

- A change appears helpful, but its wider impact is unknown.
- A user-reported problem cannot be reproduced consistently.
- Updating instructions or knowledge introduces an unnoticed regression.
- Stakeholders ask whether quality improved, but there is no measurable answer.
- The team relies on subjective impressions instead of shared success criteria.

Evals address these challenges by turning expected behavior into testable outcomes. They create a common language for developers, subject-matter experts, product owners, and other stakeholders.

You should never release an agent to end users without first evaluating its performance and establishing a repeatable evaluation plan. Users often provide vague requests or complaints; a structured evaluation framework helps you turn that feedback into reproducible test cases and measurable improvements.

## The building blocks of an evaluation

An evaluation starts by defining what success means for a realistic scenario. Several concepts work together to make that definition measurable.

### Test cases and test sets

A **test case** represents one evaluation scenario. It normally includes:

- A prompt that represents the user's request.
- The behavior expected from the agent.
- One or more assertions that make the expectation verifiable.
- Optional grounding data that supplies known facts for the scenario.

A good test case is specific, independent, and repeatable. When a case contains too many unrelated intents, a failure becomes harder to diagnose.

A **test set** groups related test cases. It lets you evaluate a capability, compare agent versions, calculate aggregate results, and maintain a regression baseline over time.

### Realistic and focused prompts

The quality of an eval depends heavily on the quality of its prompts. Evaluation prompts should resemble the language that real users employ, including natural phrasing, incomplete details, and reasonable variations.

For single-turn tests, keep each prompt focused on one intent. If a prompt tests several goals at once, you might know that the response failed without knowing which capability caused the failure.

Whenever possible, ground prompts in representative data. A prompt such as "What is my remaining leave balance?" becomes measurable when the test context identifies the user and defines the expected balance.

### Clear and verifiable assertions

An **assertion** describes one observable expectation for the response. Strong assertions are:

- **Atomic:** each assertion checks one condition.
- **Binary:** the result can clearly pass or fail.
- **Outcome-focused:** it checks what happened, not how the implementation works.
- **Verifiable:** independent reviewers can reach the same conclusion.

For example, "the response is helpful" is too subjective. "The response cites the employee leave policy" is concrete and testable.

Assertions can verify factual accuracy, source attribution, tool selection, tool parameters, error handling, escalation, refusal behavior, personalization, and privacy boundaries.

## Graders and quality signals

A **grader** determines whether an assertion passes. Different expectations call for different grading approaches.

Deterministic graders are useful when the expected outcome is precise. They can check an exact value, required phrase, citation count, tool invocation, or structured identifier.

Semantic or LLM-based graders are useful when multiple answers can be correct. They can assess relevance, coherence, groundedness, similarity, or another quality that cannot be reduced to a literal string match.

No single grader is appropriate for every scenario. A robust test set combines deterministic checks for strict requirements with semantic judgment for flexible natural-language outcomes.

A **quality signal** groups assertion results into a meaningful quality dimension. Common signals include:

- Policy or factual accuracy.
- Relevance and completeness.
- Groundedness and source attribution.
- Tool selection and parameter accuracy.
- Personalization and context awareness.
- Escalation and refusal appropriateness.
- Privacy and boundary adherence.

Assertions tell you *what* failed. Quality signals help you understand *where patterns of failure are emerging*. This distinction makes evaluation results more useful for prioritization and stakeholder communication.

## Designing representative coverage

An agent should not be evaluated only against ideal requests. A balanced test strategy includes several categories:

- **Core tests** verify the most important capabilities and business outcomes.
- **Variation tests** express the same intent with different wording or detail.
- **Edge-case tests** explore unusual but valid situations.
- **Boundary tests** confirm escalation, refusal, privacy, and scope limits.
- **Adversarial tests** probe attempts to bypass instructions or safeguards.
- **Regression tests** preserve issues that were found and fixed previously.

Start with the workflows that would cause the greatest harm if they failed. For critical actions or privacy boundaries, consistency should approach 100 percent. Lower-risk, creative experiences can allow more variation.

### Evaluating multi-turn conversations

Real users rarely interact through isolated questions. They clarify requests, provide information incrementally, change direction, and expect the agent to remember earlier details.

Use multi-turn evaluations when the agent must:

- Collect required information across several exchanges.
- Clarify an ambiguous request before acting.
- Retain facts supplied in earlier turns.
- Complete a multistep task.
- Keep its role and facts consistent throughout a conversation.

Single-turn tests provide broad, easy-to-diagnose coverage. Multi-turn tests add realism by measuring conversation completeness, context retention, consistency, and efficient task completion. A mature test set usually needs both.

## Evaluation is a continuous practice

Evals are not a final gate performed once before release. They create a continuous improvement loop:

1. Define expected outcomes.
2. Run the test set.
3. Analyze failures and quality signals.
4. Improve instructions, knowledge, tools, or orchestration.
5. Run the same tests again and compare the results.

Because agent responses can vary, run important evaluations multiple times and look at aggregate results rather than trusting a single execution. Keep core regression tests stable so that comparisons across versions remain meaningful.

When users report a problem, convert the report into a focused test case before fixing it. After the fix, retain that case in the regression suite. Over time, production feedback becomes a durable quality asset.

Evals do not replace responsible AI reviews, content moderation, security testing, performance testing, or user research. They complement these practices by measuring whether the agent behaves as intended in defined scenarios.

## Moving from theory to practice with the Agent Evaluations CLI

The Microsoft 365 Copilot Agent Evaluations CLI, currently in preview, brings structured evaluations into the development workflow. It supports batch and interactive evaluations, automated scoring, and reports in HTML, JSON, or CSV format.

At a high level, the workflow is straightforward:

1. Install and configure the CLI.
2. Connect it to the tenant and the deployed Microsoft 365 Copilot agent.
3. Configure the Azure OpenAI resource used for LLM-based scoring.
4. Create a JSON dataset containing prompts and expected responses.
5. Run the evaluations with the `runevals` command.
6. Review the report, improve the agent, and repeat.

For Microsoft 365 Agents Toolkit projects, the CLI can use the project's existing environment files and identify the agent from its title ID. Other projects can provide the required environment configuration explicitly.

Keep credentials and API keys in user-specific environment files that are excluded from source control. The configuration connects the CLI to the tenant, the agent under test, and the Azure OpenAI model used by LLM-based evaluators.

### A practical example

Imagine that you have deployed an IT HelpDesk agent that can order equipment for employees. Before submitting a laptop order, the agent must collect the requested model, memory, screen size, and cost center. You want to verify that it recognizes missing information instead of submitting an incomplete request.

First, install the preview CLI and verify that the `runevals` command is available:

```bash
npm install -g @microsoft/m365-copilot-eval
runevals --version
```

In a Microsoft 365 Agents Toolkit project, add the tenant and Azure OpenAI values to `.env.local.user`. Keep this file out of source control because it contains secrets.

```ini
TENANT_ID="your-tenant-id"
AZURE_AI_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/"
AZURE_AI_API_KEY="your-api-key"
AZURE_AI_MODEL_NAME="gpt-4o-mini"
```

The CLI can identify the deployed agent from `M365_TITLE_ID` in the project's `.env.local` file. For other project types, configure `M365_AGENT_ID` explicitly and select the environment with the `--env` option.

Next, create an `evals/evals.json` dataset with a focused test case:

```json
{
	"schemaVersion": "1.6.0",
	"default_evaluators": {
		"Relevance": {},
		"Similarity": {}
	},
	"items": [
		{
			"prompt": "Order a Surface Laptop with 32 GB of RAM for me.",
			"expected_response": "Before I submit the order, which screen size do you need and which cost center should I use?"
		}
	]
}
```

Run the evaluation from the agent project directory:

```bash
runevals
```

For a project that does not use Microsoft 365 Agents Toolkit environment files, specify the configured environment instead:

```bash
runevals --env dev
```

The CLI sends the prompt to the deployed agent, captures its response, and applies the configured evaluators. In this example, **Relevance** checks whether the response addresses the equipment request, while **Similarity** checks whether the agent asks for the missing screen size and cost center before proceeding. The wording does not need to be identical, but the intent should match the expected behavior.

After the run, the CLI creates a timestamped HTML report in the `.evals` folder and opens it in the browser. Review the scores and the captured response rather than looking only at the overall pass result. If the agent attempts to submit the order without collecting the missing values, refine its instructions or action workflow and rerun the same dataset. Keep the case in the suite to prevent that behavior from returning later.

### Choosing CLI evaluators

The CLI provides evaluator families for different kinds of expectations:

| Evaluator family | What it helps measure |
| --- | --- |
| LLM-based | Relevance, coherence, groundedness, and semantic similarity |
| Retrieval | Whether the agent formed an appropriate retrieval query and returned expected resources |
| Citation | Whether the response includes the required source references |
| String matching | Whether the response exactly or partially matches an expected answer |

Relevance and coherence provide a useful general baseline. Groundedness matters when responses must stay within retrieved evidence. Similarity is helpful when an expected answer exists but wording may vary.

Retrieval evaluators look beyond the final response. They help verify whether the agent searched with the right intent and whether expected resources appeared in the retrieved results.

Exact and partial matching remain valuable for deterministic outcomes such as identifiers, confirmation values, or mandatory wording. Combining evaluator types gives a more complete picture than relying on one overall score.

### Learning from reports

An evaluation report is not merely a pass-rate summary. Use it to inspect individual failures, compare categories, and identify recurring quality signals.

Avoid maximizing every metric without context. Evaluators and thresholds should reflect the agent's purpose and risk. A creative assistant can tolerate variation, while privacy boundaries, financial values, and critical tool actions require stricter outcomes.

Start with a small set of high-value scenarios and establish a baseline. Expand coverage as user feedback, incidents, and new capabilities reveal what matters next.

The CLI is currently in preview, so its requirements and features can change. Check the current documentation when configuring it, and use the troubleshooting guidance when setup, authentication, environment, or runtime issues occur.

## A practical evaluation mindset

The most important change is cultural rather than technical: define what good looks like before debating whether an agent is good.

Treat evaluation cases as product requirements expressed in executable form. Keep them understandable to domain experts, connect them to business risk, and review them whenever the agent's scope changes.

An effective eval practice does not eliminate uncertainty, but it makes quality visible and improvement repeatable. That is what turns a promising demonstration into an agent that teams can operate with confidence.

There is one more opportunity worth exploring: use AI to help build the evaluation dataset itself. Given the agent's purpose, instructions, capabilities, grounding data, and known failures, an LLM can propose a comprehensive set of prompts, expected responses, and assertions spanning core, variation, edge-case, boundary, adversarial, and regression tests. This approach can accelerate dataset creation, uncover scenarios that a team might overlook, and continuously turn production feedback into new test candidates. However, AI-generated tests should remain proposals rather than unquestioned truth: domain experts must review their realism, expected outcomes, assertions, coverage, and risk before adding them to the trusted evaluation suite. With that human oversight in place, AI can help automate not only how evaluations run, but also how evaluation datasets evolve.

## Learn more

- [Agent evaluation overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/evaluation-overview)
- [Agent Evaluations CLI overview (preview)](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/evaluations-cli-overview)

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/blogs/introducing-agents-evals" />