
# Lab B0 - Prerequisites

In this lab you will set up your development environment to build, test, and deploy the custom engine agent you will develop throughout the path.

???+ "Navigating the Build your own agent labs (Build Path)"
    - [Lab B0 - Prerequisites](/copilot-camp/pages/custom-engine/00-prerequisites) (📍 You are here)
    - [Lab B1 - Build a custom engine agent using Azure OpenAI and Teams Toolkit](/copilot-camp/pages/custom-engine/01-custom-engine-agent)
    - [Lab B2 - Index your data in Azure AI Search and bring it into your custom engine agent](/copilot-camp/pages/custom-engine/02-rag)
    - [Lab B3 - Enhance user experience with the Powered by AI kit](/copilot-camp/pages/custom-engine/03-powered-by-ai)
    - [Lab B4 - Secure your solution using authentication](/copilot-camp/pages/custom-engine/04-authentication)
    - [Lab B5 - Add actions to handle complex tasks](/copilot-camp/pages/custom-engine/05-actions)
   
---8<--- "b-path-prelude.md"

In this lab you will learn how to:

- Install and configure Teams toolkit for Visual Studio Code
- Prepare your Azure environment to create required resources

!!! warning "These samples and labs are intended for instructive and demonstration purposes and are not intended for use in production. Do not put them into production without upgrading them to production quality."

!!! note "To install and run your own custom engine agent, you'll need a Microsoft 365 tenant where you have administrator permission. You won't need Microsoft 365 Copilot License to test your custom engine agent."


## Exercise 1 : Setup Microsoft Teams

### Step 1: Enable Teams custom application uploads

By default, end users can't upload applications directly; instead an administrator needs to upload them into the enterprise app catalog. In this step you will ensure your tenant is set up for direct uploads by Teams Toolkit.

1️⃣ Navigate to [https://admin.microsoft.com/](https://admin.microsoft.com/{target=_blank}), which is the Microsoft 365 Admin Center.

2️⃣ In the left panel of the admin center, select **Show all** to open up the entire navigation. When the panel opens, select Teams to open the Microsoft Teams admin center.

3️⃣ In the left of the Microsoft Teams admin center, open the Teams apps accordion. Select **Setup Policies**, you will see a list of App setup policies. Then, select the **Global (Org-wide default) policy**.

4️⃣ Ensure the first switch, **Upload custom apps** is turned **On**.

5️⃣ Be sure to scroll down and select the **Save** button to persist your change.

> The change can take up to 24 hours to take effect, but usually it's much faster.

<cc-lab-end-step lab="b0" exercise="1" step="1" />

## Exercise 2: Install Teams Toolkit and prerequisites

You can complete these labs on a Windows, Mac, or Linux machine, but you do need the ability to install the prerequisites. If you are not permitted to install applications on your computer, you'll need to find another machine (or virtual machine) to use throughout the workshop.

### Step 1: Install Visual Studio Code

It should be no surprise that **Teams Toolkit for Visual Studio Code** requires Visual Studio Code! You can download it here: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}.

<cc-lab-end-step lab="b0" exercise="2" step="1" />

### Step 2: Install NodeJS

NodeJS is a program that allows you to run JavaScript on your computer; it uses the open source "V8" engine, which is used in popular web browsers such as Microsoft Edge and Google Chrome. You will need NodeJS to run the web server code used throughout this workshop.

Browse to [https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} and install version 20.x, the "LTS" (Long Term Support) version for your operating system. This lab has been tested using NodeJS version 18.16.0. If you already have another version of NodeJS installed, you may want to set up the [Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank} (or [this variation](https://github.com/coreybutler/nvm-windows){target=_blank} for Microsoft Windows), which allows you to easily switch Node versions on the same computer.

<cc-lab-end-step lab="b0" exercise="2" step="2" />

### Step 3: Install Teams Toolkit

These labs are based on [Teams Toolkit version 5.0](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank}.
Follow the steps as shown in the screen shot below.

1️⃣ Open Visual Studio Code and click on the Extensions toolbar button

2️⃣ Search for "Teams" and locate Teams Toolkit

3️⃣ Click **Install**

!!! note "If you have Teams Toolkit installed but hidden"
    If you previously installed Teams Toolkit, and then hid it on the Visual Studio sidebar, you might wonder why you can't see it. Right-click on the left sidebar and check off Teams Toolkit to bring it back into view.

<cc-lab-end-step lab="b0" exercise="2" step="3" />

## Exercise 3: Get an Azure subscription

To complete the exercises in Path B, you'll need an Azure subscription to create resources on Azure. If you don't have Azure subscription yet, you can activate an [Azure free account](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p) that offers $200 in credits which can be used within the first 30 days on most Azure services.

### Step 1: Create an Azure free account

Follow the steps to activate an Azure free account:

1️⃣ Navigate to [Azure free account](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p) page and select **Activate**.

2️⃣ Login with an account of your choice, it's recommended to use the Microsoft 365 tenant account you would like to use in the exercises.

3️⃣ Check the boxes for Privacy Statement, then select **Next**.

4️⃣ Provide a mobile phone number for identity verification step.

5️⃣ Provide payment details for a temporary authorization. You won’t be charged unless you move to pay-as-you-go pricing. Then, select **Sign up**.

!!! tip "Tip: Managing Azure resources after 30 days"
    Azure free account will be available only for 30 days. Make sure you don't have any services running in your free subscription at the end of 30 days. If you want to continue using Azure services at the end of 30 days, you must upgrade to a pay-as-you-go subscription by removing the spending limit. This allows continued use of the Azure free account and select free services for the term.

<cc-lab-end-step lab="b0" exercise="3" step="1" />

## CONGRATULATIONS

You have completed Lab B0 - Prerequisites!
You are now ready to proceed to lab B1 - Build a custom engine agent using Azure OpenAI and Teams Toolkit. Select Next. 

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/custom-engine/00-prerequisites" />