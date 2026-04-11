# Zava Insurance Agent

AI-powered insurance claims assistant built with Microsoft 365 Agents SDK.

## 🚀 Zero to Hero in 5 Minutes

### What You Need

- **Node.js 18+** and **npm**
- **.NET 9 SDK**
- **VS Code** with extensions:
  - C# Dev Kit
  - Microsoft 365 Agents Toolkit
- **Azure CLI**
- Microsoft 365 account (with Copilot)
- Azure subscription

### Run It

1. **Clone & Open**

   ```bash
   git clone https://github.com/microsoft/copilot-camp.git
   cd copilot-camp/src/agent-framework/begin
   code .
   ```

2. **Get Azure AI Credentials**
   - Go to [Microsoft Foundry](https://ai.azure.com)
   - Create project → Deploy **gpt-4.1**
   - Copy **Endpoint** and **API Key**

3. **Configure**

   ```bash
   # Copy both environment files
   cp env/.env.local.sample env/.env.local
   cp env/.env.local.user.sample env/.env.local.user
   
   # Edit env/.env.local - set your Azure AI endpoint:
   MODELS_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
   
   # Edit env/.env.local.user - add your API key:
   SECRET_MODELS_API_KEY=your-api-key-here
   ```

4. **Sign In**

   - Open **M365 Agents Toolkit** panel in VS Code
   - Sign in to Microsoft 365
   - Sign in to Azure

       ```bash
       az login  # In terminal
       ```

5. **Run**

   ```
   Press F5
   ```

   First run provisions Azure resources automatically. Agent opens in Copilot. Done!

## 🎯 What to Expect

**First Run:**

- Provisions Azure Bot Service  
- Sets up dev tunnel
- Generates config files
- Opens in Copilot

**What It Does:**

- Basic AI conversation
- Date/time info
- Runs in Microsoft 365 Copilot

**Try:**

- "What can you do?"
- "What's today's date?"
- "Tell me about insurance claims"

## 📁 Project Structure

```
begin/
├── src/Agent/              # Main agent
├── src/Plugins/            # Tools & actions
├── appPackage/             # Teams manifest
├── env/                    # Config files
└── m365agents.local.yml    # Provisioning
```

**Ready?** Press F5 and start building! 🚀
