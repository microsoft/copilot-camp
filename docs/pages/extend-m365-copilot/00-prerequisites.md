
# Lab E0 - Prerequisites

In this lab, you will set up the development environment to build, test, and deploy the plugins that will extend the capabilities of Copilot for Microsoft 365.

???+ "Navigating the Extend Copilot labs (Extend Path)"
    - [Lab E0 - Prerequisites](/copilot-camp/pages/extend-m365-copilot/00-prerequisites) (📍You are here)
    - [Lab E1 - Declarative Copilot](/copilot-camp/pages/extend-m365-copilot/01-declarative-copilot)
    - [Lab E2 - First API Plugin](/copilot-camp/pages/extend-m365-copilot/02-api-plugin)
    - [Lab E3 - Enhance the API Plugin](/copilot-camp/pages/extend-m365-copilot/03-enhance-api-plugin) 
    - [Lab E4 - Add Adaptive Cards](/copilot-camp/pages/extend-m365-copilot/04-add-adaptive-card)
    - [Lab E5 - Add a Declarative Copilot](/copilot-camp/pages/extend-m365-copilot/05-add-declarative-copilot)
    - [Lab E6 - Add authentication](/copilot-camp/pages/extend-m365-copilot/06-add-authentication)

In this lab you will learn:

- How to set up your developer tenant for Microsoft 365
- How to install and configure Teams toolkit for Visual Studio Code

## Exercise 1: Set up your Microsoft 365 Subscription
To install and run your own declarative copilot, you'll need a Microsoft 365 tenant where you have administrator permission. Fortunately you can get one for free through the Microsoft 365 Developer Program! In the labs which follow, you'll also use this tenant to run Microsoft Teams where you can test this lab.
You will also need Copilot License to test the app.

### Step 1: Get a tenant

If you don't yet have a tenant, please join the [Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program?WT.mc_id=m365-58890-cxa){target=_blank} to get a free one. Your tenant includes 25 [E5 user licenses](https://www.microsoft.com/microsoft-365/enterprise/compare-office-365-plans?WT.mc_id=m365-58890-cxa){target=_blank} and can be renewed as long as you keep developing!

Select "Join now" to begin.
Log in with any Microsoft personal or work and school account, enter your information, and select "Next". You will have an opportunity to choose what kind of "sandbox" you want; the "Instant sandbox" is recommended.

Follow the wizard and select your administrator username and password, tenant domain name, etc. The domain name you choose is just the left-most portion - for example if you enter "Contoso" your domain will be "Contoso.onmicrosoft.com".

Remember this information as you'll need it throughout the labs! You will log in as &gt;username&lt;@&gt;domain&lt;.onmicrosoft.com with the password you chose. You'll be prompted for your phone number and then the system will set up your subscription.

Eventually you'll be prompted to log into your new tenant. Be sure to use the new administrator credentials you just created, not the ones you used when you signed up for the developer program.

!!! tip "Tip: Navigating many tenants"
    Consider creating a browser profile for each tenant that will have its own favorites, stored credentials, and cookies so you can easily swtch between tenants as you work.

!!! note "You may be asked to enable multi-factor authentication (MFA)"
    [This is certainly a good idea!](https://www.microsoft.com/security/blog/2019/08/20/one-simple-action-you-can-take-to-prevent-99-9-percent-of-account-attacks/){target=_blank} Just follow the instructions. If you really must turn off MFA, [here are instructions](https://docs.microsoft.com/en-us/answers/questions/101179/how-to-disable-the-two-factor-authentication-from.html){target=_blank}. 

??? info "More tips on setting up your Microsoft 365 Development Tenant!"
    <div class="tinyVideo">
      <iframe src="//www.youtube.com/embed/DhhpJ1UjbJ0" frameborder="0" allowfullscreen></iframe>
      <div>Setting up your Microsoft 365 Development tenant</div>
    </div>

### Step 2: Enable Teams application uploads

By default, end users can't upload applications directly; instead an administrator needs to upload them into the enterprise app catalog. In this step you will ensure your tenant is set up for direct uploads by Teams Toolkit.
a. Navigate to [https://admin.microsoft.com/}](https://admin.microsoft.com/{target=_blank}), which is the Microsoft 365 Admin Center.
b. In the left panel of the admin center, select "Show all" to open up the entire navigation. When the panel opens, select Teams to open the Microsoft Teams admin center.
c. In the left of the Microsoft Teams admin center, open the Teams apps accordion 1️⃣ and select Setup Policies 2️⃣. You will see a list of App setup policies. Select the Global (Org-wide default) policy 3️⃣.

![Open the App setup policies](../../assets/images/extend-m365-copilot-00/01-007-TeamsAdmin1.png)

d. Ensure the first switch, "Upload custom apps" is turned On.

![Open the App setup policies](../../assets/images/extend-m365-copilot-00/01-008-TeamsAdmin2.png)

e. Be sure to scroll down and select the "Save" button to persist your change.

![Open the App setup policies](../../assets/images/extend-m365-copilot-00/01-008-TeamsAdmin2b.png)

> The change can take up to 24 hours to take effect, but usually it's much faster.

## Exercise 2: Install Teams Toolkit and prerequisites
You can complete these labs on a Windows, Mac, or Linux machine, but you do need the ability to install the prerequisites. If you are not permitted to install applications on your computer, you'll need to find another machine (or virtual machine) to use throughout the workshop.

### Step 1: Install Visual Studio Code

It should be no surprise that [Teams Toolkit for Visual Studio Code](){target=_blank} requires Visual Studio Code! You can download it here: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}.

### Step 2: Install NodeJS

NodeJS is a program that allows you to run JavaScript on your computer; it uses the open source "V8" engine, which is used in popular web browsers such as Microsoft Edge and Google Chrome. You will need NodeJS to run the web server code used throughout this workshop.

Browse to [https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} and install version 20.x, the "LTS" (Long Term Support) version for your operating system. This lab has been tested using NodeJS version LTS.

???+ tip "If you need more than one version of NodeJS"
    Browse to https://nodejs.org/en/download/ and install the "LTS" (Long Term Support) version for your operating system. This lab has been tested using NodeJS version 18.x and 20.x. If you already have another version of NodeJS installed, or want future flexibility to change Node versions, you may want to set up the [Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank} (or [this variation](https://github.com/coreybutler/nvm-windows) for Microsoft Windows), which allows you to easily switch Node versions on the same computer.

### Step 3: Install Teams Toolkit

These labs are based on the latest general available version of [Teams Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension){target=_blank}.
Follow the steps as shown in the screen shot below.

1️⃣ Open Visual Studio Code and click on the Extensions toolbar button

2️⃣ Search for "Teams" and locate Teams Toolkit

3️⃣ Click "Install"

![Open the App setup policies](../../assets/images/extend-m365-copilot-00/install-ttk.png)

!!! note "If you have Teams Toolkit installed but hidden"
    If you previously installed Teams Toolkit, and then hid it on the Visual Studio sidebar, you might wonder why you can't see it. Right-click on the left sidebar and check off Teams Toolkit to bring it back into view.
    
Now you are all set to create your first extensibility feature for Copilot for Microsoft 365. Proceed to create a Declarative Copilot in the next lab. 