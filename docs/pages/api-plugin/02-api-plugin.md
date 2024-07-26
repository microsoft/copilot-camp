# Lab A2 - First API Plugin

In this lab you will set up an API based on Azure Functions and install it as an API plugin for Copilot for Microsoft 365.

???+ "Navigating the Extending Copilot labs (A Path)"
    - [Lab A0 - Prerequisites](/copilot-camp/pages/api-plugin/00-prerequisites)
    - [Lab A1 - Declarative Copilot](/copilot-camp/pages/01-declarative-copilot.md)
    - Lab A2 - First API Plugin (📍You are here)
    - [Lab A3 - Extend an API Plugin](/copilot-camp/pages/api-plugin/03-add-to-api-plugin)
    - [Lab A4 - Add a Declarative Copilot](/copilot-camp/pages/api-plugin/04-add-declarative-copilot)

## Introduction

In this lab you will set up a REST API for Trey Research, a hypothetical consulting company. It provides API's for accessing information about consultants (using the /api/consultants path) and about the current user (using the /api/me path). For now the API doesn't support authentication, so the current user will always be "Avery Howard"; in [Lab ??](#) you will add authentication and the ability to access the logged in user.

The code consists of Azure Functions written in TypeScript, backed by a database in Azure Table storage. When you run the app locally, table storage will be provided by the Azurite storage emulator.

## Exercise 1: Install additional prerequisites

This lab calls for a couple of additional prerequisites; please install them now.

* [REST Client add-in for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - You will use this to test your API locally
* (optional)[Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer) - This will allow you to view and modify the Trey Research database

## Exercise 2: Configure and run the starting application

### Step 1: Download the starting application

Begin by downloading the Copilot Camp repository at https://github.com/microsoft/copilot-camp. Select the "Code" button and clone or download the content to your computer.



1. npm install
2. F5
3. 