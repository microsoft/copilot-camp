# Lab BAF0 - Prerequisites

In this lab you will set up your development environment to build, test, and deploy the custom engine agent you will develop using the Microsoft 365 Agents SDK and Agent Framework throughout this path.

In this lab you will learn how to:

- Setup your Microsoft 365 environment
- Install and configure Visual Studio Code with Microsoft 365 Agents Toolkit
- Prepare your Azure environment to create required resources
- Install required development tools

!!! pied-piper "Disclaimer"
    These samples and labs are intended for instructive and demonstration purposes and are not intended for use in production. Do not put them into production without upgrading them to production quality.

!!! note "Note"
    To install and run your own custom engine agent, you'll need a Microsoft 365 tenant where you have administrator permission. You won't need Microsoft 365 Copilot License to test your custom engine agent.

## Exercise 1 : Setup Microsoft Teams

### Step 1: Enable Teams custom application uploads

By default, end users can't upload applications directly; instead a Teams administrator needs to upload them into the enterprise app catalog. In this step you will ensure your tenant is set up for direct uploads by M365 Agents Toolkit.

1️⃣ Navigate to [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank}, which is the Microsoft 365 Admin Center.

2️⃣ In the left panel of the admin center, select **Show all** to open up the entire navigation. When the panel opens, select Teams to open the Microsoft Teams admin center.

3️⃣ In the left of the Microsoft Teams admin center, open the Teams apps accordion. Select **Setup Policies**, you will see a list of App setup policies. Then, select the **Global (Org-wide default) policy**.

4️⃣ Ensure the first switch, **Upload custom apps** is turned **On**.

5️⃣ Be sure to scroll down and select the **Save** button to persist your change.

> The change can take up to 24 hours to take effect, but usually it's much faster.

<cc-end-step lab="baf0" exercise="1" step="1" />

## Exercise 2: Setup Development Environment

You can complete these labs on a Windows, macOS, or Linux machine and you do need the ability to install the prerequisites. If you are not permitted to install applications on your computer, you'll need to find another machine (or virtual machine) to use.

### Step 1: Install Visual Studio Code

1️⃣ Download and install Visual Studio Code from [https://code.visualstudio.com/](https://code.visualstudio.com/){target=_blank}.

2️⃣ Launch Visual Studio Code after installation.

<cc-end-step lab="baf0" exercise="2" step="1" />

### Step 2: Install .NET 9 SDK

The Microsoft 365 Agents SDK and Agent Framework require .NET 9 SDK to build and run the agent.

1️⃣ Download and install .NET 9 SDK from [https://dotnet.microsoft.com/download/dotnet/9.0](https://dotnet.microsoft.com/download/dotnet/9.0){target=_blank}.

2️⃣ Verify the installation by opening a terminal and running:

```bash
dotnet --version
```

You should see version 9.0.x or higher.

<cc-end-step lab="baf0" exercise="2" step="2" />

### Step 3: Install C# Dev Kit Extension

1️⃣ In Visual Studio Code, open the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac).

2️⃣ Search for **C# Dev Kit** and click **Install**.

<cc-end-step lab="baf0" exercise="2" step="3" />

### Step 4: Install Microsoft 365 Agents Toolkit Extension

1️⃣ In Visual Studio Code Extensions view, search for **Microsoft 365 Agents Toolkit** and click **Install**.

2️⃣ After installation, you should see the Microsoft 365 Agents Toolkit icon in the Activity Bar.

<cc-end-step lab="baf0" exercise="2" step="4" />

### Step 5: Install Azure CLI

The Azure CLI is required to provision and manage Azure resources.

1️⃣ Download and install Azure CLI from [https://learn.microsoft.com/cli/azure/install-azure-cli](https://learn.microsoft.com/cli/azure/install-azure-cli){target=_blank}.

2️⃣ Verify the installation by opening a terminal and running:

```bash
az --version
```

3️⃣ Sign in to Azure:

```bash
az login
```

<cc-end-step lab="baf0" exercise="2" step="5" />

### Step 6: Install DevTunnel

DevTunnel is required for local development and debugging. It creates a secure tunnel from the internet to your local machine.

**Windows:**

```bash
winget install Microsoft.DevTunnel
```

**macOS/Linux:**

```bash
curl -sL https://aka.ms/DevTunnelCliInstall | bash
```

Verify installation:

```bash
devtunnel --version
```

!!! tip "DevTunnel Alternative"
    DevTunnel is also included with Visual Studio 2022. If you have Visual Studio 2022 installed, you already have DevTunnel.

<cc-end-step lab="baf0" exercise="2" step="6" />

### Step 7: Install Azure Functions Core Tools

Azure Functions Core Tools is required for running Azure Functions locally during development.

1️⃣ Install Azure Functions Core Tools:

**Windows:**

```bash
winget install Microsoft.Azure.FunctionsCoreTools
```

**macOS:**

```bash
brew tap azure/functions
brew install azure-functions-core-tools@4
```

2️⃣ Verify the installation by running:

```bash
func --version
```

You should see version 4.x or higher.

<cc-end-step lab="baf0" exercise="2" step="7" />

## Exercise 3: Setup Azure Environment

To complete the exercises in this path, you'll need an Azure subscription to create Microsoft Foundry resources and deploy AI models.

### Step 1: Get an Azure subscription

If you don't have an Azure subscription yet, you can activate an [Azure free account](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} that offers $200 in credits which can be used within the first 30 days on most Azure services.

Follow the steps to activate an Azure free account:

1️⃣ Navigate to [Azure free account](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} page and select **Activate**.

2️⃣ Login with an account of your choice, it's recommended to use the Microsoft 365 tenant account you would like to use in the exercises.

3️⃣ Check the boxes for Privacy Statement, then select **Next**.

4️⃣ Provide a mobile phone number for identity verification step.

5️⃣ Provide payment details for a temporary authorization. You won't be charged unless you move to pay-as-you-go pricing. Then, select **Sign up**.

!!! tip "Tip: Managing Azure resources after 30 days"
    Azure free account will be available only for 30 days. Make sure you don't have any services running in your free subscription at the end of 30 days. If you want to continue using Azure services at the end of 30 days, you must upgrade to a pay-as-you-go subscription by removing the spending limit.

<cc-end-step lab="baf0" exercise="3" step="1" />

### Step 2: Create Microsoft Foundry Project and Deploy Models

For this lab path, you'll need a Microsoft Foundry project with a couple of models deployed.

1️⃣ Navigate to [Microsoft Foundry](https://ai.azure.com){target=_blank} and sign in with your Azure account.
2️⃣ Select to use the **New Foundry** to switch to the new user experience.
3️⃣ Select to **Create a new project**, when prompted. Leave the project name as recommended and select **Create**. This will scaffold a new project for you in Microsoft Foundry, it usually takes 3-5 minutes.

!!! tip "Region Selection"
    Choose **France Central** or **Sweden Central** region as it supports all the models you'll need throughout the labs.

4️⃣ Once your project is created, select **Start Building** and then **Find models**. Alternatively, you can also choose **Build**, then **Models**, and lastly **Deploy base model**.

5️⃣ Either way, search for **gpt-4.1** and select the **gpt-4.1** model, then select **Confirm** and **Deploy**.

!!! important "Model Selection"
    Please use **gpt-4.1** for a smooth experience . The labs use knowledge base answer synthesis which is optimized for gpt-4.1. Using other models may lead to unexpected behavior.

6️⃣ Now search for model **text-embedding-ada-002** and select the **text-embedding-ada-002** model, then select **Confirm** and **Deploy**.

!!! tip "Save Your Credentials"
    You'll need the following information from your Microsoft Foundry project:

    - **Endpoint URL**: Found in project home page of the project under "Project endpoint". Keep only the URL without any path (e.g., `https://your-resource.services.ai.azure.com/`)
    - **API Key**: Found in project home page as "API Key"
    - **Model Deployment Name**: The name you gave to your gpt-4.1 deployment
    
    Save these values in a secure location - you'll need them in the next lab!

!!! note "Additional Models"
    You'll deploy additional models (for embeddings and vision analysis) and create other Azure services (like Azure AI Search) in later labs when you need them.

<cc-end-step lab="baf0" exercise="3" step="2" />

### Step 3: Configure Content Safety Filter

The insurance domain uses terms like "injury", "collision", "damage" that may trigger default content filters. You need to create a custom content filter with lower thresholds.

1️⃣ In Microsoft Foundry, navigate to your project and select **Build**

2️⃣ In the left sidebar, select **Guardrails**

3️⃣ Click **Create** in the upper right corner

4️⃣ In the **Add controls** section select under **Risk** one by one the items in the **Content safety** group. The items should be:

    - **Violence**
    - **Hate**
    - **Sexual**
    - **Self-harm**

and for each of them set the **Severity level** to **Lowest blocking** both for **User input** and **Output**. When adding controls, confirm to override any already existing setting, if requested for.

5️⃣ Next, in the **Add controls** section select under **Risk** one by one the items in the **Protected materials** group. The items should be:

    - **Protected material for code**
    - **Protected material for text**

and for each of the items set the **Action** to **Annotate** for **Tool call** and **Output**. When adding controls, confirm to override any already existing setting, if requested for.

6️⃣ Then, in the **Add controls** section select under **Risk** the item **Jailbreak** and set the **Action** to **Annotate** for **User input**. When adding controls, confirm to override any already existing setting, if requested for.

7️⃣ Select **Next**.

8️⃣ In **Select agents and models** panel, select your **gpt-4.1** deployment.

9️⃣ Select **Next** to review the guardrail controls.

9️⃣ Select **Submit** to apply the new rules.

!!! warning "Why This Is Needed"
    Insurance claims contain legitimate terms like "injury", "accident", "collision", "bodily harm" that describe real incidents. Default content filters may block these terms. Setting thresholds to **Low** only blocks extreme content while allowing normal insurance terminology.

!!! tip "Production Deployments"
    In production, review your organization's content safety policies and adjust filter settings accordingly. This configuration is for development and testing purposes.

<cc-end-step lab="baf0" exercise="3" step="3" />

---8<--- "b-congratulations.md"

You have completed Lab BAF0 - Prerequisites!

You are now ready to proceed to Lab BAF1 - Build and Run Your First Agent. Select Next.

<cc-next url="../01-build-and-run" />

<cc-award badgeId="CustomEngineRanger" badgeName="Custom Engine Ranger" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/00-prerequisites" />
