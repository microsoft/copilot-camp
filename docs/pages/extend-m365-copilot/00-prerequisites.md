
# Lab E0 - Prerequisites

In this lab, you will set up the development environment to build, test, and deploy the Copilot agents, that will help you achieve tailor made AI assitance using Microsoft 365 Copilot. 

???+ "Navigating the Extend Copilot labs (Extend Path)"
    - [Lab E0 - Prerequisites](./00-prerequisites.md) (📍You are here)
    - [Lab E1 - Declarative Agent](./01-declarative-copilot.md)
    - [Lab E2 - Build an API](./02-build-the-api.md)
    - [Lab E3 - Add a Declarative Copilot and API Plugin](./03-add-declarative-copilot.md) 
    - [Lab E4 - Enhance the API and Plugin](./04-enhance-api-plugin.md)
    - [Lab E5 - Add Adaptive Cards](./05-add-adaptive-card.md)
    - [Lab E6 - Add authentication](./06-add-authentication.md)

---8<--- "e-path-prelude.md"

In this lab you will learn:

- How to set up your Microsoft 365 tenant to run the entire lab exercise for this path
- How to install and configure Teams toolkit for Visual Studio Code

!!! pied-piper "Disclaimer"
    These samples and labs are intended for instructive and demonstration purposes and are not intended for use in production. Do not put them into production without upgrading them to production quality.


## Exercise 1: Configure Teams upload policy

### Step 1: Enable Teams application uploads

By default, end users can't upload applications directly; instead an administrator needs to upload them into the enterprise app catalog. In this step you will ensure your tenant is set up for direct uploads by Teams Toolkit.

- Sign in to [Microsoft Teams admin center](https://admin.teams.microsoft.com/dashboard) with your admin credentials.
- Go to **Teams apps** > **Setup Policies** > **Global**.
- Toggle **Upload custom apps** to the "On" position.
- Select "Save". Your test tenant can permit custom app upload.


> The change can take up to 24 hours to take effect, but usually it's much faster.

<cc-lab-end-step lab="e0" exercise="1" step="1" />

## Exercise 2: Install Teams Toolkit and prerequisites
You can complete these labs on a Windows, Mac, or Linux machine, but you do need the ability to install the prerequisites. If you are not permitted to install applications on your computer, you'll need to find another machine (or virtual machine) to use throughout the workshop.

### Step 1: Install Visual Studio Code

It should be no surprise that [Teams Toolkit for Visual Studio Code](){target=_blank} requires Visual Studio Code! You can download it here: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}.

<cc-lab-end-step lab="e0" exercise="2" step="1" />

### Step 2: Install NodeJS

Node.js is a runtime that allows you to run JavaScript on your computer. It uses the open-source V8 engine, which is used in popular web browsers like Google Chrome (and the Chromium-based version of Microsoft Edge). You will need Node.js to run the web server code used throughout this workshop.

Browse to [https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} and install version 20.x, the "LTS" (Long Term Support) version for your operating system. This lab has been tested using NodeJS version LTS.

???+ tip "If you need more than one version of NodeJS"
    Browse to https://nodejs.org/en/download/ and install the "LTS" (Long Term Support) version for your operating system. This lab has been tested using NodeJS version 18.x and 20.x. If you already have another version of NodeJS installed, or want future flexibility to change Node versions, you may want to set up the [Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank} (or [this variation](https://github.com/coreybutler/nvm-windows) for Microsoft Windows), which allows you to easily switch Node versions on the same computer.

<cc-lab-end-step lab="e0" exercise="2" step="2" />

### Step 3: Install Teams Toolkit

These labs are based on the latest general available version of [Teams Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank}.
Follow the steps as shown in the screen shot below.

1️⃣ Open Visual Studio Code and click on the Extensions toolbar button

2️⃣ Search for "Teams" and locate Teams Toolkit

3️⃣ Click "Install"

![Open the App setup policies](../../assets/images/extend-m365-copilot-00/install-ttk.png)

!!! note "If you have Teams Toolkit installed but hidden"
    If you previously installed Teams Toolkit, and then hid it on the Visual Studio sidebar, you might wonder why you can't see it. Right-click on the left sidebar and check off Teams Toolkit to bring it back into view.

<cc-lab-end-step lab="e0" exercise="2" step="3" />
    
Now you are all set to create your first extensibility feature for Copilot for Microsoft 365. Proceed to create a Declarative Agent in the next lab. 

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/00-prerequisites" />