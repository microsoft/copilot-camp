# Lab 01 - Build custom engine copilots using Azure OpenAI and Teams Toolkit

In this lab you will build a custom engine copilot using Teams Toolkit for Visual Studio Code. You will also utilize Azure OpenAI models in your custom engine copilot and define your first prompt.

In this lab you will learn:

- What is a custom engine copilot
- Create Azure OpenAI service and models
- Create a custom engine copilot using Teams toolkit
- Define a prompt in your custom engine copilot
- Learn how to run and test your app

## Introduction

Welcome aboard to the exciting journey of building your own custom engine copilot! In this path, you'll create a personalized copilot for Microsoft Teams using cutting-edge Azure OpenAI models. You'll be able to define specific prompts, integrate complex data, and add advanced skills to make your copilot truly unique. By using custom models and orchestration, your copilot will tackle advanced tasks, complex conversations, and workflows, delivering an exceptional, personalized experience. Let's dive in and start building your first custom engine copilot!

## Exercise 1: Create Azure OpenAI service and models

You'll need to complete the Azure subscription pre-requisite before starting with this exercise.

### Step 1: Create Azure OpenAI Service

1. Open the browser of your choice and navigate to [Azure Portal](https://portal.azure.com).
1. Select **Create a resource**, then search for `Azure OpenAI`. Select the Azure OpenAI service and then **Create**.
1. Fill out the following details and select **Next**:
    - **Subscription:** The Azure subscription for your Azure OpenAI Service
    - **Resource group:** The Azure resource group to contain your Azure OpenAI resource. You can create a new group or use a pre-existing group.
    - **Region:** The location of your instance.
    - **Name:** A descriptive name for your Azure OpenAI Service resource, such as `MyOpenAIResource`.
    - **Pricing Tier:** The pricing tier for the resource. Currently, only the `Standard` tier is available for the Azure OpenAI Service.
1. Select the network configuration of your choice and select **Next**.
1. Leave the Tags section as default and select **Next**.
1. Finally, review your Azure OpenAI service details and select **Create**.

Once your Azure OpenAI service is created successfully, navigate to your resource, select **Keys and Endpoint** from the left side panel. Copy and save `KEY 1` and `Endpoint`that will be required later in Exercise 2.

### Step 2: Create a deployment model

In your Azure OpenAI service, navigate to **Model deployments** from the left side panel, then select **Manage deployments**. This will direct you to `Azure OpenAI Studio` where you can create your deployment model.

??? info "What is Azure OpenAI Studio?"
    Azure OpenAI Studio is a playground to explore the generative AI models, craft unique prompts for your use cases, and fine-tune select models.

From the **Deployments** tab, select **Create a new deployment**. Fill out the following details and select **Create**:

- **Select a model:** Select either one of the `gpt-35-turbo`, `gpt-4`, `gpt-4-32k` or `gpt-4o`.
- **Model version:** Auto update to default.
- **Deployment type:** Provisioned-Managed.
- **Deployment name:** Recommended to use the same name with the selected deployment model, such as `gpt-4`.
- **Content Filter:** Default.

!!! tip "Tip: Handling no quota available message"
    When you select a model, you may see **No quota available** message pop-up on top of the configuration page. To handle this, you have two options:
    1. Select a different version or deployment type
    1. Free up the resources on other deployments by requesting for [more quota or adjust the existing quota](https://oai.azure.com/portal/96d4a6668daf4335bc1273c1bb46cb4f/quota)

Once your model is successfully created, you can navigate to **Chat**, and test your model by selecting one of the available templates in **Prompt** section and asking relevant questions in the chat playground.

![Testing the model in Azure OpenAI Studio Chat Playground](../../assets/images/azure-openai-studio-chat.png)

## Exercise 2: Scaffold a custom engine copilot from template

You'll need to complete all the required pre-requisites before starting with this exercise.

### Step 1: Use Teams Toolkit to create a new custom engine copilot

1. Open Teams Toolkit on Visual Studio Code and select **Create a New App** > **Custom Copilot** > **Basic AI Chatbot**.
1. Select **TypeScript** as a programming language choice and **Azure OpenAI** as Large Language model of your choice.
    1. Paste the Azure OpenAI key and press enter.
    1. Paste the Azure OpenAI endpoint and press enter. (Endpoint shouldn't include forward slash at the end of its URL.)
    1. Type Azure OpenAI deployment model name and press enter.
1. Select a folder for your project root.
1. Provide a name for your project such as `CareerGenie` and press enter.

After providing all the details mentioned above, your project will be scaffolded successfully in seconds.

### Step 2: Understanding the files in the app

Let's explore what's included in the custom engine copilot template. Here is the list of folders and files that are important to know:

- `appPackage`: Templates for the Teams application manifest
- `env`: Environment files
- `infra`: Templates for provisioning Azure resources
- `src`: The source code for the application
- `teamsapp.yml`: The main Teams Toolkit project file that defines properties and configuration definitions.
- `teamsapp.local.yml`: This overrides `teamsapp.yml` with actions that enable local execution and debugging.
- `teamsapp.testtool.yml`: This overrides `teamsapp.yml` with actions that enable local execution and debugging in Teams App Test Tool.

Diving into the application folder `src` that includes the main app files:

- `src/index.ts`: Sets up the bot app server.
- `src/adapter.ts`: Sets up the bot adapter.
- `src/config.ts`: Defines the environment variables.
- `src/prompts/chat/skprompt.txt`: Defines the prompt.
- `src/prompts/chat/config.json`: Configures the prompt.
- `src/app/app.ts`: Handles business logics for the Basic AI Chatbot.


### Step 3: Customize prompt and test the app

Prompts are essential for interacting with AI language models (LLMs) and directing their behavior. They serve as the inputs or questions we provide to the model to obtain specific responses. By crafting prompts carefully, we can guide the AI to generate desired outputs. Let's customize the prompt of our custom engine copilot and define the behavior of Career Genie!

In your project folder, navigate to `src/prompts/chat/skprompt.txt` and replace the existing text with the following prompt:

```html
You are a career specialist named "Career Genie" that helps Human Resources team for writing job posts.
You are friendly and professional.
You always greet users with excitement and introduce yourself first.
You like using emojis where appropriate.
```

To test the behavior of your app quickly, you can use Teams App Test Tool. Later in the exercise, you'll run and debug your custom engine copilot on Microsoft Teams.

??? info "More information about the Teams App Test Tool"
    Teams App Test Tool (or short as Test Tool) is a component integrated into Teams Toolkit. This component helps developers to debug, test, and iterate on the app design of a Teams bot application in a web-based chat environment that emulates the behavior, look, and feel of Microsoft Teams.

Start debugging our app by selecting **Run and Debug** tab on Visual Studio Code and **Debug in Test Tool**. Teams App Test Tool will pop up on your browser and you can start chatting with your custom engine copilot right away! Some of the recommended questions you can ask to test the behavior:

- "Can you help me write a job post for a Senior Developer role?"
- "What would be the list of required skills for a Project Manager role?"
- "Can you share a job template?"

![Test Career Genie in App Test Tool](../../assets/images/teams-app-test-tool.png)

Congratulations you've successfully built your first custom engine copilot, Career Genie! To advance the skills of the Career Genie, continue with the next lab [Configure single sign on](02-sso-custom-engine.md).