# Trey Feedback Connector

A sample Copilot Connector sample for Trey Genie in Copilot Camp. It ingests customer feedback of clients for consultants in Trey Research. 

## Summary

This is a sample Copilot Connector designed for Trey Genie, used in Copilot Camp lab. Its primary function is to ingest customer feedback from clients, which is then utilized by consultants at Trey Research. This tool aims to streamline the feedback process, enhancing the efficiency and effectiveness of the consultancy services provided.

> [!NOTE]  
> Sample data was generated using Artificial Intelligence. Any resemblance to real data is purely coincidental.



## Features

This sample shows how to ingest data from a custom API into your Microsoft 365 tenant.

The sample illustrates the following concepts:

- simplify debugging and provisioning of resources with Agents Toolkit for Visual Studio code
- create external connection schema
- support full ingestion of data
- visualize the external content in Microsoft 365 search results



## Prerequisites

- [Microsoft 365 Agents Toolkit for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension)
- [Azure Functions Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
- [Microsoft 365 Developer tenant](https://developer.microsoft.com/microsoft-365/dev-program) with [uploading custom apps enabled](https://learn.microsoft.com/microsoftteams/platform/m365-apps/prerequisites#prepare-a-developer-tenant-for-testing)
- [Node@18](https://nodejs.org)

## Minimal path to awesome - Debug against a real Microsoft 365 tenant

- Clone repo
- Open repo in VSCode
- Press <kbd>F5</kbd>, follow the sign in prompts
- When prompted, click on the link in the console to perform the tenant-wide admin consent
- Wait for all tasks to complete
- In the web browser navigate to the [Microsoft 365 admin center](https://admin.microsoft.com/)
- From the side navigation, open [Settings > Search & Intelligence](https://admin.microsoft.com/?source=applauncher#/MicrosoftSearch)
- On the page, navigate to the [Data Sources](https://admin.microsoft.com/?source=applauncher#/MicrosoftSearch/connectors) tab
- A table will display available connections. Locate the **Trey Feedback Connector** connection. In the **Required actions** column, select the link to **Include Connector Results** and confirm the prompt
- Navigate to [Microsoft365.com](https://www.microsoft365.com)
- Using the search box on top, search for: `Adventure Works Cycles`. You should see the following result:


> [!NOTE]  
> It can take a moment for the search results to appear. If you don't see the results immediately, wait a few moments and try again.

## Credit

Thanks to authors of the the Policies Copilot Connector sample which is the bootstrap project for this connector for Trey Research scenario. [https://github.com/pnp/graph-connectors-samples/tree/main/samples/nodejs-typescript-policies](https://github.com/pnp/graph-connectors-samples/tree/main/samples/nodejs-typescript-policies) 

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
