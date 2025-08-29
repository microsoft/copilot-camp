# GitHub Actions Workflows

This directory contains the GitHub Actions workflows for the Copilot Camp repository. These workflows automate documentation deployment and translation processes.

## 1. `main.yml` - Documentation Deployment
**Trigger:** Automatic on push to `main` branch  
**Purpose:** Builds and deploys the MkDocs site to GitHub Pages

### What it does:
- ✅ Checks out the repository
- 🐍 Sets up Python 3.x environment
- 📦 Installs MkDocs Material theme and i18n plugin
- 🚀 Builds and deploys documentation to `gh-pages` branch
- 🌐 Updates the live documentation site

### Key Features:
- **Automatic deployment** - No manual intervention needed
- **Multi-language support** - Handles internationalization with `mkdocs-static-i18n`
- **Force deployment** - Ensures clean updates with `--force` flag

### 🛠️ Setup Requirements
No additional setup required - uses built-in `GITHUB_TOKEN`.

## 🎯 Usage

### Automatic Documentation Deployment
Documentation automatically deploys when you push to `main`:
```bash
git push origin main
```

### Manual Documentation Deployment
You can also deploy documentation on-demand:
1. Go to **Actions** tab in GitHub repository
2. Select **"🚀 Deploy Documentation"** workflow
3. Click **"Run workflow"**
4. Optionally provide a reason for deployment (e.g., "Emergency rebuild", "Config update")
5. Click **"Run workflow"** to start deployment
---

## 2. `translate-docs.yml` - Translation Automation
**Trigger:** Manual dispatch (workflow_dispatch)  
**Purpose:** Translates English documentation to Japanese using Azure OpenAI

### What it does:
- ✅ Validates Azure OpenAI secrets are configured
- 🔍 Checks timestamps to only translate updated files
- 🌐 Translates Markdown files using AI
- 📝 Commits and pushes translation updates
- 📊 Provides detailed progress and summary reports

### Key Features:

#### 🚀 **Real-time Progress Monitoring**
- **Unbuffered output** - See translation progress as it happens
- **Live status updates** - Each file being processed shows immediately
- **No silent waiting** - Always know what's happening

#### ⚡ **Smart Translation Logic**
- **Incremental updates** - Only translates files newer than existing translations
- **Force mode** - Option to re-translate all files regardless of timestamps
- **Path-aware** - Handles both regular docs and includes directory

#### 🔒 **Security & Validation**
- **Secret validation** - Checks all required Azure OpenAI credentials upfront
- **Error handling** - Clear error messages for common issues
- **Safe execution** - Runs from repository root with proper file paths

#### 📋 **Comprehensive Reporting**
- **Progress summary** - Shows which files were translated/skipped
- **File change tracking** - Lists all updated translation files
- **Failure notifications** - Helpful troubleshooting information

### 🛠️ Setup Requirements
Configure these repository secrets in Settings → Secrets and variables → Actions:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AZURE_OPENAI_ENDPOINT_URL` | Your Azure OpenAI endpoint | `https://your-resource.openai.azure.com/` |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | Model deployment name | `gpt-5` or `o3` |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key | `abc123...` |


### 🎯 Usage 
1. Go to **Actions** tab in GitHub repository
2. Select **"🌐 Run Translation Script"** workflow
3. Click **"Run workflow"**
4. Choose options:
   - ☑️ **Force re-translation** - Translate all files (ignore timestamps)
   - ☐ **Standard mode** - Only translate updated files (recommended)

## 📊 Understanding Translation Output

### Real-time Logs
During execution, you'll see:
```
🚀 Running Python script with real-time output...
Translating docs/mslearn.md into a different language: ja
Skipping up-to-date file: docs/ja/index.md
Translating docs/awards.md into a different language: ja
✅ Translation script completed
```

### Summary Report
After completion, the workflow summary shows:
- **Triggered by:** Username who ran the workflow
- **Force retranslation:** Whether force mode was enabled
- **Translation Progress:** Key messages from the translation process
- **Files updated:** List of modified translation files

### 🐛 Troubleshooting - Common Issues

#### Translation Workflow Fails
1. **Missing secrets** - Verify all Azure OpenAI secrets are configured
2. **API rate limits** - Wait and try again, or contact Azure support
3. **Network issues** - Retry the workflow

#### Documentation Deployment Fails
1. **Pages not enabled** - Enable GitHub Pages in repository settings
2. **Permissions error** - Ensure workflow has `contents: write` permission
