---
title: Prerequisites for Pro-code bundles
---

<div data-widget="hero"
     data-badge-color="amber"
     data-icon="🔧 One time configuration"
     data-subtitle="Install the extra tools your chosen bundle needs and verify port forwarding works."
     data-time="10–15 min"
     data-toolkit="Windows / Mac / Linux"></div>


## What you need

Complete this lab after E1A or E1B and before you start any bundle.

<div data-widget="checklist"
     data-title="Common prerequisites (Installed from E1B foundation lab)"
     data-variant="soft"
     data-items="Global Admin access in your M365 tenant~Required to configure tenant-wide app and policy settings|Complete one foundation path (E1A or E1B)~Required before this bundle-readiness lab|VS Code with Microsoft 365 Agents Toolkit~Sign in with your M365 developer account|Node.js 22 LTS and Git installed~Baseline tooling for all bundle workflows"></div>

### Extra prerequisites by bundle

| Bundle | Extra tools needed |
|---|---|
| **A — MCP Foundation** | GitHub account, Azurite, MCP Inspector, Azure account (free tier OK — Entra ID app reg only) |
| **B — MCP Advanced** | GitHub account, Azurite, MCP Inspector |
| **C — MCP App** | GitHub account, Azurite, MCP Inspector, Azure Functions Core Tools v4 |
| **D — API Plugin** | Azure Functions Core Tools v4, REST Client extension |
| **E — Connectors** | _(no extras beyond common prerequisites)_ |

---
## Exercise 1: Verify extra prerequisites installed

| Tool | Version needed | Used in | Download |
|---|---|---|---|
| **GitHub account** | Free | Bundles A & B — Dev Tunnels | [github.com/join](https://github.com/join) |
| **Azure Functions Core Tools** | v4 | Bundles C & D | [learn.microsoft.com](https://learn.microsoft.com/azure/azure-functions/functions-run-local) |
| **REST Client (VS Code extension)** | Latest | Bundle D | VS Code Extensions panel |
| **Azure subscription** | Free tier OK | Bundle A — Lab E10 only | [azure.microsoft.com/free](https://azure.microsoft.com/free) |


Open a terminal and run these checks. Every one should pass before you proceed.

<div data-widget="verify"
     data-label="Azurite — Bundles A, B, and C"
     data-cmd="npm install -g azurite\nazurite --version\n# Expected: 3.x.x"></div>

<div data-widget="verify"
     data-label="MCP Inspector — Bundles A and B"
     data-cmd="npm install -g @modelcontextprotocol/inspector\n# No version command — install succeeding without errors is the check"></div>

<div data-widget="callout"
     data-type="tip"
     data-title="Windows users: run terminal as Administrator"
     data-body="Global npm installs on Windows sometimes need elevated permissions. Right-click the terminal icon and select &quot;Run as Administrator&quot; if you see EACCES or permission errors."></div>


---

## Exercise 2: Verify port forwarding with your first Dev Tunnel

Use this exercise to confirm your machine can expose a local port through a public Dev Tunnel URL.

Success criteria:

- Port `3001` is forwarded in VS Code.
- Visibility is set to **Public**.
- You can copy a valid `https://...use.devtunnels.ms` URL.


<div data-widget="step" data-n="1" data-title="Forward port 3001"></div>

1. In VS Code, open the **Ports** tab (in the terminal panel)
2. Click **Forward a Port**, enter `3001`, and press Enter



<div data-widget="step" data-n="2" data-title="Make it public"></div>

1. Right-click the new port entry → **Port Visibility** → **Public**
2. Sign in with your GitHub account if prompted
3. Copy the forwarded address — it looks like `https://abc123def456.use.devtunnels.ms`

If you reached this point, port forwarding is working correctly, and you can stop tunneling for now.



<div data-widget="labnav"
     data-prev="../01-first-agent-new/"
     data-prev-label="Back to E1 Path Choice"
     data-next="../bundles/"
     data-next-label="Choose Your Bundle"></div>


<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/00-prerequisites" />
