#!/usr/bin/env bash
# Post-create setup for the Custom Engine Agents (C#) dev container.
# Installs the CLI tools the Agent Framework labs rely on.
set -euo pipefail

echo "==> Installing DevTunnel CLI"
if ! command -v devtunnel >/dev/null 2>&1; then
  curl -sL https://aka.ms/DevTunnelCliInstall | bash
fi

# The installer drops the binary in ~/.bin; make sure it is on PATH for future shells.
if ! grep -q 'HOME/.bin' "$HOME/.bashrc" 2>/dev/null; then
  echo 'export PATH="$HOME/.bin:$PATH"' >> "$HOME/.bashrc"
fi
export PATH="$HOME/.bin:$PATH"

echo "==> Installing Microsoft 365 Agents Toolkit CLI (atk)"
npm install -g @microsoft/m365agentstoolkit-cli >/dev/null 2>&1 || \
  echo "    (atk CLI install skipped - you can install it later with: npm install -g @microsoft/m365agentstoolkit-cli)"

echo "==> Restoring the Agent Framework starter project"
if [ -d "src/agent-framework/begin" ]; then
  dotnet restore src/agent-framework/begin/InsuranceAgent.csproj >/dev/null || true
fi

echo ""
echo "================================================================"
echo " Custom Engine Agents dev container is ready."
echo ""
printf " .NET SDK    : "; dotnet --version 2>/dev/null || echo "not found"
printf " Azure CLI   : "; az version --output tsv --query '"azure-cli"' 2>/dev/null || echo "not found"
printf " DevTunnel   : "; devtunnel --version 2>/dev/null | head -n1 || echo "not found"
printf " Node        : "; node --version 2>/dev/null || echo "not found"
echo ""
echo " Next: sign in, then start with Lab BAF1."
echo "   az login --use-device-code"
echo "================================================================"
