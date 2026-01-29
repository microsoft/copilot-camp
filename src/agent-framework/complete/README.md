# Zava Insurance Agent

AI-powered insurance claims assistant built with Microsoft 365 Agents Toolkit.

## 🚀 Zero to Hero - Run This App

### Prerequisites

**What you need:**
- Visual Studio Code
- .NET 9 SDK
- Azure CLI
- Microsoft 365 account with Copilot access
- Azure subscription

**Azure Resources (create these first):**
1. **Microsoft Foundry project** with deployed models:
   - `gpt-4.1` (language model)
   - `mistral-medium-2505` (vision analysis)
   - `text-embedding-ada-002` (embeddings)
   - 💡 Use **France Central** region (supports all models)

2. **Azure AI Search service** (Basic tier or higher)


### Step 1: Install Tools

```bash
# Install Microsoft 365 Agents Toolkit in VS Code
# Go to Extensions (Ctrl+Shift+X) → Search "Microsoft 365 Agents Toolkit" → Install
```

### Step 2: Open Project

```bash
cd copilot-camp/src/agent-framework/complete
code .
```

### Step 3: Sign In

Open **Microsoft 365 Agents Toolkit** panel in VS Code:
1. Sign in to **Microsoft 365** (ensure Copilot access + custom app upload enabled)
2. Sign in to **Azure** (same account recommended)

### Step 4: Configure Settings

Edit `env/.env.local`:

```env
# Get these from Microsoft Foundry (ai.azure.com)
MODELS_ENDPOINT=https://YOUR-RESOURCE.cognitiveservices.azure.com/
LANGUAGE_MODEL_NAME=gpt-4.1
VISION_MODEL_NAME=mistral-medium-2505
EMBEDDING_MODEL_NAME=text-embedding-ada-002

# Get these from Azure AI Search
AZURE_AI_SEARCH_ENDPOINT=https://YOUR-SEARCH.search.windows.net
```

Edit `env/.env.local.user` (for API keys - this file is gitignored):

```env
# Get API key from Microsoft Foundry → Keys and Endpoint
SECRET_MODELS_APIKEY=YOUR_AI_FOUNDRY_API_KEY

# Azure storage will be auto-generated during provisioning
SECRET_AZURE_STORAGE_CONNECTION_STRING=

# Get these from Azure AI Search
SECRET_AZURE_AI_SEARCH_API_KEY=YOUR_API_KEY
```

### Step 5: Press F5 🎉

Press **F5** in VS Code. The toolkit will automatically:
- ✅ Create DevTunnel
- ✅ Provision Azure resources
- ✅ Generate configuration files
- ✅ Deploy Teams app
- ✅ Start the app
- ✅ Open Copilot in browser

### Step 6: Grant Permissions (First Time Only)

1. Go to [Microsoft Entra Admin Center](https://entra.microsoft.com)
2. **App registrations** → Find your app (use BOT_ID from `env/.env.local`)
3. **API permissions** → **Grant admin consent**

### Step 7: Start Chatting!

Try these commands in Copilot:
```
Get details for claim CLM-2025-001007
Show damage photo for this claim
Analyze fraud risk for this claim
```
