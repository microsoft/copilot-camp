# Custom Engine Agents (C#) dev container

A ready-to-use environment for the **Agent Framework** labs (BAF0-BAF3) in Copilot Developer Camp.

Use it and you can skip the manual tool installs in [Lab BAF0 - Prerequisites](https://microsoft.github.io/copilot-camp/pages/custom-engine/agent-framework/00-prerequisites/).

## What's included

| Tool | Why |
|---|---|
| .NET 9 SDK | The samples target `net9.0` and pin the SDK in `global.json` |
| Azure CLI | `az login` for the Foundry project, and Azure resource provisioning |
| DevTunnel CLI | Exposes your locally running agent so Microsoft 365 can reach it |
| Node.js 22 + `atk` CLI | Microsoft 365 Agents Toolkit CLI |
| GitHub CLI | Convenience for repository tasks |

VS Code extensions installed automatically: **C# Dev Kit**, **C#**, **Microsoft 365 Agents Toolkit**, **Azure Resource Groups**.

## How to use it

### GitHub Codespaces

1. Open the repository on GitHub.
2. Select **Code** > **Codespaces** > **...** > **New with options...**.
3. Choose the **Copilot Camp - Custom Engine Agents (C#)** dev container configuration.

### Locally with Docker

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
2. Open the repository in Visual Studio Code.
3. Run **Dev Containers: Reopen in Container** and choose this configuration.

After the container is created it prints the installed tool versions. Then sign in:

```bash
az login --use-device-code
```

## Debugging notes

The agent runs **inside** the container while your browser runs on your machine, so the browser-launching debug profiles behave a little differently:

- Port **3978** is forwarded automatically. Use the forwarded URL wherever a lab tells you to open the agent.
- In **Codespaces**, set the forwarded port visibility to **Public** so Microsoft 365 can reach your agent.
- If a debug profile does not open a browser for you, start debugging and then open the forwarded URL yourself.

## Scope

This configuration targets the **Agent Framework (BAF)** track, which is built around Visual Studio Code.

The **Microsoft Foundry (BMA)** track uses **Visual Studio 2022**, which is Windows-only and cannot run in a Linux dev container. Follow the local install steps in Lab BMA0 for that track.
