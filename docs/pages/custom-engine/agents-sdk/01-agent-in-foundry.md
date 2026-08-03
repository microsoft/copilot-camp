# Lab BMA1 - Prepare your agent in Microsoft Foundry

<div data-widget="hero"
     data-badge="Path 1 · Lab BMA1"
     data-badge-color="blue"
     data-icon="🧠"
     data-subtitle="Create a grounded agent in Microsoft Foundry: author its instructions, attach your HR documents as knowledge, and validate its answers in the playground."
     data-time="30-40 min"
     data-requires="Lab BMA0 completed"></div>

In this lab you'll create the foundation for the rest of this path: a **Foundry agent** that answers Contoso Electronics HR questions using only the documents you give it.

You'll define the agent's role and guardrails, attach knowledge so it can ground its answers, and test it in the playground before any code is involved.

???+ info "What is Microsoft Foundry?"
    Microsoft Foundry is the platform where you build, ground, and version AI agents. You define instructions, attach knowledge sources, configure tools, and test behavior interactively — then invoke the published agent from your own application. Foundry agents are **versioned and addressed by name**, which is how you'll connect to this agent from .NET in Lab BMA3.

## Lab objectives

By the end of this lab you will be able to:

- Create a Microsoft Foundry project and deploy a model
- Author instructions that define an agent's persona, scope, and guardrails
- Ground an agent on your own documents so answers cite real content
- Validate grounding and boundary behavior in the playground

---

## Exercise 1: Create a Foundry project and agent

### Step 1: Create your Microsoft Foundry project

1. Navigate to [https://ai.azure.com](https://ai.azure.com){target=_blank} and sign in with the account that has your Azure subscription.
1. Select **+ Create new**, choose **Microsoft Foundry resource**, then select **Next**.
1. Leave the suggested project name and select **Create**. Provisioning usually takes 3-5 minutes.
1. When the project opens, expand the left navigation and select **Agents**.
1. If prompted to deploy a model, search for **gpt-4.1** (or the latest available GPT model), select **Confirm**, then **Deploy**.

> Keep this browser tab open. You'll come back to it in Lab BMA3 to copy the project endpoint.

<cc-end-step lab="bma1" exercise="1" step="1" />

### Step 2: Name your agent

Foundry creates a starter agent in your project. You'll rename it and make the name meaningful, because **your .NET code will look the agent up by this exact name** in Lab BMA3.

1. In the **Agents** list, select the pre-populated agent, then select **Try in playground**.
1. In the agent's **Setup** panel, set the **Name** to `Contoso HR Agent`.

!!! warning "Write the agent name down exactly"
    Agent Framework resolves a Foundry agent by **name**, so `Contoso HR Agent` must match character for character in your configuration later. Avoid trailing spaces.

> If the setup panel doesn't appear when you select the agent, widen your browser window until the right-hand panel is visible.

<cc-end-step lab="bma1" exercise="1" step="2" />

---

## Exercise 2: Ground the agent

### Step 1: Define instructions and guardrails

Instructions are what turn a general model into a focused HR assistant. In the **Setup** panel, replace the **Instructions** with the following:

```text
You are Contoso HR Agent, an internal assistant for Contoso Electronics.

## Scope
Help employees with:
- Job role descriptions and responsibilities
- The performance review process
- Health and wellness benefits (PerksPlus, Northwind Standard, Northwind Health Plus)
- Employee rights and workplace safety
- Company values and conduct

## Guardrails
- Base every answer on the official documents provided as knowledge.
- Never invent policy details, figures, or eligibility rules.
- If the answer is not covered by the documents, say so clearly and tell the employee to contact HR.

## Tone
Professional but approachable. Factual and to the point.
```

Select **Save** (or **Update**) to apply the instructions.

<cc-end-step lab="bma1" exercise="2" step="1" />

### Step 2: Attach HR documents as knowledge

1. Download the HR document set from [this link](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/agents-sdk/docs/){target=_blank} and extract the archive.
1. In the **Knowledge** section, select **+ Add**, choose **Files**, then **Select local files**.
1. Select all extracted documents and choose **Upload and save**.

> Foundry chunks and embeds the documents into a vector store, then exposes them to the agent through the **File Search** tool. This is Retrieval-Augmented Generation (RAG) without writing any retrieval code — and it's what produces the citations you'll stream into Teams in Lab BMA3.

<cc-end-step lab="bma1" exercise="2" step="2" />

---

## Exercise 3: Test and validate

### Step 1: Verify grounded answers

In the playground, ask questions that can only be answered from the uploaded documents:

- What's the difference between Northwind Standard and Northwind Health Plus for emergency and mental health coverage?
- Can I use PerksPlus to pay for both a rock climbing class and a virtual fitness program?
- If I hit my out-of-pocket max on Northwind Standard, do I still pay for prescriptions?
- What exactly happens during a Contoso performance review, and how should I prepare?
- What are the key differences between the roles of COO and CFO at Contoso?

**Expected result:**

- Answers reflect the content of the uploaded documents rather than generic HR advice.
- Responses include citations pointing back to the source files.

<cc-end-step lab="bma1" exercise="3" step="1" />

### Step 2: Verify the guardrails hold

Now test the boundary of the agent's knowledge:

- What is Contoso's stock option vesting schedule?
- How much parental leave do contractors in Germany get?

**Expected result:**

- The agent does **not** invent an answer.
- It states that the information isn't covered and directs the employee to HR.

If the agent fabricates an answer, revisit your instructions and strengthen the guardrails section, then retest.

<cc-end-step lab="bma1" exercise="3" step="2" />

### Step 3: Record the values you'll need next

You'll need two values in Lab BMA3. Capture them now:

| Value | Where to find it |
|---|---|
| **Agent name** | The **Name** field in the agent's **Setup** panel — `Contoso HR Agent` |
| **Project endpoint** | The project **Overview** page, under **Endpoints and keys** |

!!! tip "Agent name, not agent id"
    Earlier versions of this lab used the agent **id**. Microsoft Agent Framework resolves versioned Foundry agents by **name**, so that's the value you need.

<cc-end-step lab="bma1" exercise="3" step="3" />

---8<--- "b-congratulations.md"

You have completed Lab BMA1 - Prepare your agent in Microsoft Foundry!

Your agent is grounded and behaving correctly in the playground. Next, you'll build the .NET host that will run it.

<cc-next url="../02-agent-with-agents-sdk" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/01-agent-in-foundry" />
