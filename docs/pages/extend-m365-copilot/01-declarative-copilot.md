# Lab E1 - Customize Copilot by building a declarative copilot

In this lab you will build a declarative copilot using Teams Toolkit for Visual Studio Code. This tool is not mandatory for you to create a declarative copilot but it makes it so much easier to scaffold, package and deploy your app. 

???+ "Navigating the Extend Copilot labs (Extend Path)"
    - [Lab E0 - Prerequisites](/copilot-camp/pages/extend-m365-copilot/00-prerequisites)
    - [Lab E1 - Declarative Copilot](/copilot-camp/pages/extend-m365-copilot/01-declarative-copilot) (📍You are here)
    - [Lab E2 - First API Plugin](/copilot-camp/pages/extend-m365-copilot/02-api-plugin)
    - [Lab E3 - Enhance the API Plugin](/copilot-camp/pages/extend-m365-copilot/03-enhance-api-plugin) 
    - [Lab E4 - Add Adaptive Cards](/copilot-camp/pages/extend-m365-copilot/04-add-adaptive-card)
    - [Lab E5 - Add a Declarative Copilot](/copilot-camp/pages/extend-m365-copilot/05-add-declarative-copilot)
    - [Lab E6 - Add authentication](/copilot-camp/pages/extend-m365-copilot/06-add-authentication)


In this lab you will learn:

- What is a declarative copilot for Microsoft 365
- Install [Teams toolkit CLI](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/teams-toolkit-cli?pivots=version-three#get-started)
- Create a basic declarative copilot using Teams toolkit CLI
- Customise the basic app to create the geo locator game
- Learn how to run and test your app

## Introduction

Welcome on board to building your own declarative copilot! This is the easiest way to customise Copilot for Microsoft 365 by simply declaring instructions or by adding skills and knowledge to craft your own Copilot with the power of everything you like about Copilot for Microsoft 365. These copilots enhance collaboration, boost productivity, and streamline workflows and most importantly they tailor your Copilot to automate complex tasks and create consistent, personalised experiences. Let's dive in and make your Copilot work magic!

## Anatomy of the app package

You will see as we develop more and more extensions to Copilot,  that in the end what you will build is collection of few file in a zip file which we will refer to has an `app package` that you will  then install and use. So it's important you have a basic understanding of what the app package consists of. The app package of a declarative copilot is similar to a Teams app if you have built one before with additonal elements. See the table to see all the core elements. You will also see that the app deployment process is very similar to deploying a teams app. 


| Element                | Description                                                                                 |
|-----------------------------|---------------------------------------------------------------------------------------------|
| **App manifest**            | Describes app configuration, capabilities, required resources, and important attributes.    |
| **App icons**               | Requires a color and outline icon for your declarative copilot.                             |
| **Declarative copilot manifest** | Describes copilot configuration, required fields, capabilities, conversation starters, and actions. |
| **Plugin manifest (Optional)**   | Describes plugin configuration, required fields, and capabilities.                         |

> In this lab we will have not have the plugin manifest but you can find it in more advanced labs in copilot camp.


## Exercise 1: Scaffold a declarative copilot from template
You can use just an editor to create a declarative copilot if you know the structure of the files in the app package mentioned above. But things are easier if you use a tool like Teams Toolkit to not only create these files for you but also help you deploy and publish your app. 
So to keep things as simple as possible we will install `Teams Toolkit CLI` to create declarative copilot with a base template for the app.


!!! warning "Warning: The prerequisites are currently quite extensive, but this will change with the public preview of Declarative Copilots"
    

### Step 1: Software Pre-Requisites 

- Install Teams Toolkit Command Line Interface (CLI) latest stable version

```
npm i -g @microsoft/teamsapp-cli
```

- Set these Environment Variables [(Refer to this article)](https://chlee.co/how-to-setup-environment-variables-for-windows-mac-and-linux/)	 
```
"TEAMSFX_DECLARATIVE_COPILOT" = "true"

```

### Step 2: Environment Pre-Requisites 

- You need to be on the private preview tenant 
- To test you'll need to go to [https://microsoft365.com/chat](https://microsoft365.com/chat) 


### Step 3: Use Teams Toolkit CLI to create a new app

Go to your terminal of choice and type `teamsapp new` and select Enter. 

![start creating the base app](../../assets/images/extend-m365-copilot-01/teamsapp-new-01.png)

??? warning "Confused if you are really creating a teams app?"
    While it may appear that this command is used to create a new Teams application, it’s important to note that the process of packaging a declarative copilot shares similarities with that of a Teams app as mentioned in the introduction. So in the coming steps it will be a lot clear as you choose options to scaffold the base app. 

Next, you can select the type of project you want to create. Select `Declarative Copilot` as shown in the screen and select Enter. Note that `Declarative Copilot` is the default new project option auto selected, so you can just select Enter.

![select type of project](../../assets/images/extend-m365-copilot-01/teamsapp-new.png)

Next, you will be asked to choose the type of declarative copilot. Choose `Basic Declarative Copilot` and select Enter. 

![select the type of declarative copilot](../../assets/images/extend-m365-copilot-01/teamsapp-new-02.png)

Next, type in the directory where the project folder has to be created.

![choose the folder](../../assets/images/extend-m365-copilot-01/teamsapp-new-03.png)

Next, give it an application name `Geo Locator Game` and select Enter. 

![type in application name](../../assets/images/extend-m365-copilot-01/teamsapp-new-04.png)

The project will be created in a few seconds in the folder you mentioned with indication in the terminal that it is done as shown below. 

![project created](../../assets/images/extend-m365-copilot-01/teamsapp-new-05.png)

Congratulations! You have successfully set up the base application! Now, proceed to examine the files contained within to be able to customise it to make the geo locator game app. 

### Step 4: Understanding the files in the app

Here's how the base project looks like: 

| Folder/File                          | Contents                                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `.vscode`                            | VSCode files for debugging                                                                                          |
| `appPackage`                         | Templates for the Teams application manifest, the GPT manifest, and the API specification                            |
| `env`                                | Environment files              
| `appPackage/color.png`           | Teams application logo image                        |
| `appPackage/outline.png`           | Teams application logo outline image                        |
| `appPackage/declarativeCopilot.json` | Defines the behaviour and configurations of the declarative copilot.                                                |
| `appPackage/manifest.json`           | Teams application manifest that defines metadata for your declarative copilot.                                      |
| `teamsapp.yml`                       | Main Teams Toolkit project file. The project file defines two primary things: Properties and configuration Stage definitions. |

In this lab, your main focus will be the  `declarativeCopilot.json` file located within the `appPackage` directory and it will also be where majority of the modifications to tailor your declarative copilot to specific requirements happen. 
Let's look at it's nodes:

```
{
    "name": "Teams Toolkit declarative copilot",
    "description": "Declarative copilot created with Teams Toolkit",
    "instructions": "You are a declarative copilot and were created with Team Toolkit. You should start every response and answer to the user with \"Thanks for using Teams Toolkit to create your declarative copilot!\\n\" and then answer the questions and help the user."
}
```


- The `name` key represents the name of the declarative copilot.
- The `description` provides a description.
- The `instructions` holds directives which will determine the operational behavior of this Copilot.

Another important file is the `appPackage/manifest.json` file, which contains crucial metadata, including the package name, the developer’s name, and references to the copilot extensions utilised by the application. The following section from the manifest.json file illustrates these details:

```JSON
"copilotExtensions": {
        "declarativeCopilots": [            
            {
                "id": "declarativeCopilot",
                "file": "declarativeCopilot.json"
            }
        ]
    },
```
You could also update the logo files `color.png` and `outline.png` to make it match your application's brand. In today's lab you will change  color.png file for it to stand out. 

## Exercise 2: Update with instructions for Geo Locator game

### Step 1: Update necessary files
First we will do the easy bit which is replacing the logo. Copy the image located [here](../../assets/images/extend-m365-copilot-01/color.png) and replace it with the image of same name in the folder `appPackage` in your base project. 

Next, go to the file `manifest.json` in the folder `appPackage` in your base project and find the node **copilotExtensions**. Update the id value of the declarativeCopilots array's first entry from `declarativeCopilot` to `dcGeolocator` to make this ID unique.

<pre>
 "copilotExtensions": {
        "declarativeCopilots": [            
            {
                "id": "<b>dcGeolocator</b>",
                "file": "declarativeCopilot.json"
            }
        ]
    },

</pre>



Next, go to the file `declarativeCopilot.json`. Copy the script provided below and use it to overwrite the existing contents of the file.

```
{
    "$schema": "https://aka.ms/json-schemas/copilot-extensions/v1.0/declarative-copilot.schema.json",
    "name": "Geo Locator Game (declarative copilot)",
    "description": "This a Geo Locator Game declarative copilot", 
    "instructions": "You are an enthusiastic Geo Locator Game declarative copilot, responsible for challenging, entertaining, and congratulating players as they navigate the game by guessing locations based on your vivid descriptions. Your primary objectives include: Challenge Players: Craft engaging and intricate geographical clues that align with the game's objectives. Use a mix of historical, cultural, and environmental facts to create a rich tapestry of hints that players must decipher. Entertain with Humor: Infuse your interactions with tailored humor that matches the player's guesses. Use a light-hearted and playful tone, incorporating puns, jokes, and witty remarks to keep the players entertained. Celebrate Success: When a player makes a correct guess, celebrate their achievement with exuberance. Use a combination of excitement, emojis, and uplifting humor to make their success feel special. Personalize celebrations to match the uniqueness of each correct guess. Keep Content Fresh: Continuously update your jokes, facts, and emojis to ensure interactions remain fresh and engaging for returning players. Incorporate current events, trending topics, and seasonal themes to keep the content relevant and exciting. Interactive Feedback: Provide feedback that adapts to the player's progress. If they are struggling, offer hints that gradually become more specific. If they are excelling, increase the difficulty of your clues to keep the challenge alive."

}
```

Now all the changes are done to the app, it's time to test it.

### Step 2: Test the app

> At this point you should have already completed the [prerequisites](../extend-m365-copilot/00-prerequisites.md) lab and have logged into your developer tenant's Microsoft 365 account in the Teams Toolkit exension or it's left pane will not show up.

To test the app go to the `Teams Toolkit` extension in `Visual Studio Code`. This will open up the left pane. Under `LIFECYCLE` select `Provision`. 

Teams toolkit at this instance will package all the files inside the `appPackage` folder as a zip file and install it into your own app catalog.

To test, you can now to Teams and select the `Copilot` app OR you could also use Teams toolkit and preview the app in Copilot by selecting `Preview in Copilot (Edge)` or `Preview in Copilot (Chrome)` from the launch configuration dropdown as shown below.

![run app using Teams Toolkit](../../assets/images/extend-m365-copilot-01/dc-run.png)

Once the Copilot app is loaded, Select the "…" menu and select "Copilot chats".

Select **Geo Locator Game (Declarative copilot)** on the right pane of the Copilot app.

You have now succefully loaded your Geo Locator Game with copilot. To say "Hi".

See the full demo of how you can test this app. 

![dem0](../../assets/images/extend-m365-copilot-01/demo-dc.gif)


Congratulations you've successfully built your extensibility feature for Copilot for Microsoft 365 called Decalarative Copilots! Proceed to create an API Plugin in the next lab.
