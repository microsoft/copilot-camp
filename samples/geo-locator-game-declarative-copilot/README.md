# Geo Locator Game Declarative Copilot
This is a Geo Locator Game copilot that plays a game with users by asking a location around the World for users to guess. Geo Locator Game copilot is entertaining, fun and congratulates users when their guesses are correct.

Follow the steps to run the Geo Locator Game Declarative Copilot.

## Pre-requisites
- [Install Visual Studio Code](https://code.visualstudio.com/download) 
- [Install Teams Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension) 
- [Install Node.js](https://nodejs.org/en/download)
- [Install Teams Toolkit CLI](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/teams-toolkit-cli?pivots=version-three#get-started) 

## Run the app
1. If it’s the first time you use the Teams Toolkit CLI, you will need to log in to the tenant to allow access to some of the deployment and sideloading APIs. To login, use the following command: 

```cli
teamsapp auth login m365 
```
 
2. If it’s the first time that you use this template, you will need to install its dependencies. To install, use the following command: 
 
```cli
npm install 
```

3. Once logged in, to deploy the app, use the following command: 

```cli
npm run sideload:dev 
```

4. The browser will pop-up with Copilot for Microsoft 365. To access Geo Locator Game declarative copilot, click on the **…** menu and then on the **Copilot chats** option. 
5. Select **Geo Locator Game declarative copilot** on the right rail.
6. Enjoy playing Geo Locator Game with copilot, you can start by asking "Hi".

![Geo Locator Game](geo-locator.gif)