# Lab BMA1 - Prepare your agent in Azure AI Foundry

In this lab, you’ll begin your journey by preparing a custom engine agent using Azure AI Foundry, Microsoft’s platform for creating, configuring, and scaling AI agents. You'll explore the **Agents Playground**, define your agent's role, personalize its instructions, and connect it to relevant internal documents to support Retrieval-Augmented Generation (RAG).

This exercise sets the foundation for the rest of the Build Path using the **Microsoft 365 Agents SDK** and **Semantic Kernel**. You’ll simulate a real-world Human Resources agent for Contoso Electronics that can answer questions based on uploaded documents like the Employee Handbook, Role Library, and Benefit Plans.

???+ info "What is Azure AI Foundry?"
    Azure AI Foundry is a development platform that helps you build, manage, and test intelligent agents powered by large language models. It provides a centralized workspace where you can define agent instructions, configure tool usage, upload knowledge sources, and interactively test agent behavior. It supports integration with custom orchestrators like Semantic Kernel and downstream endpoints like Teams and Copilot Chat.

## Exercise 1: Prepare your agent in Azure AI Foundry

In this exercise, you'll explore Azure AI Foundry, a platform that enables developers to build, deploy, and scale AI agents with ease. You'll learn how to configure an agent, and test its functionality using the Agents Playground. This hands-on experience will provide insight into the capabilities of Azure AI Agent Service and how it integrates with various AI models and tools.

### Step 1: Get started with Azure AI Foundry

Azure AI Foundry is your launchpad for building AI agents. In this step, you’ll log in to Azure AI Foundry with the account that has Azure subscription enabled.

1. Open the browser and navigate to [https://ai.azure.com](https://ai.azure.com) and sign to your Azure account.
1. From the Azure AI Foundry homepage, select **+ Create new**, **Azure AI Foundry resource** and then **Next**.
1. Leave the project name as recommended and select **Create**.
1. This will scaffold a new project for you in Azure AI Foundry, it usually takes 3-5 minutes.
1. When your project is created, you'll be redirected to your project, extend the left side bar and select **Agents**. This will open the Agents Playground.
1. In the Agent Playground, the first time you'll see the **Deploy a model** window. Search for **gpt-4o** and select **Confirm**, then select **Deploy** in the following window.
1. Once you are in the **Agents Playground**, you'll recognize there is a pre-populated agent for you in the list. Select the agent and select **Try in playground**.
    ![The Azure AI Foundry list of Agents with the custom agent and the "Try in playground" command highlighted.](https://github.com/user-attachments/assets/dd481101-c15d-4aed-af62-aeb7d3c8e5ed){width="1029"}

> If you don't see the agent side bar with **Try in playground** option when you click on the agent, extend the browser size on your screen until it shows up on the right side.

<cc-end-step lab="bma1" exercise="1" step="1" />

### Step 2: Customize your agent in Agent Playground

Now that you're inside the Agents Playground, you'll customize your agent's identity and behavior to match a real-world scenario: an internal HR Agent at Contoso.

1. In your agent's **Setup** panel, **Name** your agent as Contoso HR Agent and update the **Instructions** as the following:

```
You are Contoso HR Agent, an internal assistant for Contoso Electronics. Your role is to help employees find accurate, policy-aligned answers to questions related to:
- Job role descriptions and responsibilities
- Performance review process
- Health and wellness benefits (PerksPlus, Northwind Standard, Northwind Plus)
- Employee rights and workplace safety
- Company values and conduct

Always base your responses on the content provided in the official documents such as the Employee Handbook, Role Library, and Benefit Plans. If you are unsure or the information is not covered, suggest the employee contact HR.

Respond in a professional but approachable tone. Keep answers factual and to the point.

Example scenarios you should support:
- What is the deductible for Northwind Standard?
- Can I use PerksPlus for spa treatments?
- What does the CTO at Contoso do?
- What happens during a performance review?
```

2. Finally in the **Knowledge** section, Select **+ Add** and select **Files**, then **Select local files**. Download this zip file consisting of few files from the following **[link](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/agents-sdk/docs/)**, extract the files, browse for them and hit **Upload and save** to upload them. This will create a vector store for our agent.

> When you upload documents, Foundry automatically converts them into vectors, a format that allows the agent to search and retrieve relevant information efficiently.

![The UI of Azure AI Foundry when adding files as knowledge base, with the "Select local files".](https://github.com/user-attachments/assets/64bb7392-15f6-458c-9e74-d8ab100ca8fd)

By customizing the instructions and uploading relevant documents, you're teaching the agent how to behave and what knowledge to rely on. This is a simplified form of Retrieval-Augmented Generation (RAG).

<cc-end-step lab="bma1" exercise="1" step="2" />

### Step 3: Test your agent in the playground

It's time to test your agent. You’ll simulate realistic employee questions to see how well the agent understands and responds based on the documents you uploaded.

In the Agent Playground, interact with your agent by entering prompts and observe the agent's responses, adjust instructions or tools as needed to refine performance. You may use the examples listed below to test the agent’s response:

- What’s the difference between Northwind Standard and Health Plus when it comes to emergency and mental health coverage?
- Can I use PerksPlus to pay for both a rock climbing class and a virtual fitness program?
- If I hit my out-of-pocket max on Northwind Standard, do I still pay for prescriptions?
- What exactly happens during a Contoso performance review, and how should I prepare?
- Is a wellness spa weekend eligible under the PerksPlus reimbursement program?
- What are the key differences between the roles of COO and CFO at Contoso?
- How does the split copay work under Northwind Health Plus for office visits?
- Can I combine yoga class reimbursements from PerksPlus with services covered under my health plan?
- What values guide behavior and decision-making at Contoso Electronics?
- I’m seeing a non-participating provider — what costs should I expect under my current plan?

!!! tip "Save Agents id for the next exercises"
    Save the **Agent id** that'll be required in the next exercises. You can find your Agent id in the agent’s details panel.
    ![The Agents Playground of Azure AI Foundry with the Agent id field highlighted.](https://github.com/user-attachments/assets/13421287-d476-41c4-88df-bed1bff2f2f8)

<cc-end-step lab="bma1" exercise="1" step="3" />

---8<--- "b-congratulations.md"

You have completed Lab BMA1 - Prepare your agent in Azure AI Foundry! If you want explore further.

You are now ready to proceed to Lab BMA2 - Build your first agent using M365 Agents SDK. Select Next.

<cc-next url="../02-agent-with-agents-sdk" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/01-agent-in-foundry" />
