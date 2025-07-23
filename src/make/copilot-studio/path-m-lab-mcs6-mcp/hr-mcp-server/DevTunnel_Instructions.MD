# Dev Tunnel Instructions for HR MCP Server

## Overview

This document provides complete instructions for setting up and using dev tunnels with the HR MCP Server. Dev tunnels allow you to expose your locally running MCP server to the internet via a secure public URL, making it accessible for testing, sharing, and integration purposes.

## Basic Setup Commands

For a quick and simple setup, use these four basic commands:

### 1. Login to DevTunnel
```bash
devtunnel user login
```
**What it does:** Authenticates you with the DevTunnel service using your Microsoft account. This is required before you can create or manage tunnels.

### 2. Create a Tunnel
```bash
devtunnel create hr-mcp -a --host-header unchanged
```
**What it does:** 
- Creates a new tunnel named `hr-mcp`
- `-a` flag makes the tunnel accessible to anyone (anonymous access)
- `--host-header unchanged` preserves the original host header, which is important for applications that depend on specific host values

### 3. Create a Port Mapping
```bash
devtunnel port create hr-mcp -p 47002
```
**What it does:** Creates a port mapping for the `hr-mcp` tunnel, forwarding traffic to local port `47002` where the HR MCP Server is running.

### 4. Start the Tunnel
```bash
devtunnel host hr-mcp
```
**What it does:** Starts hosting the `hr-mcp` tunnel, making your local application accessible via a public URL. This command will display the public URL that you can use to access your HR MCP Server from anywhere.

> **Note:** Keep the terminal window with `devtunnel host hr-mcp` open while you need the tunnel active. Make sure your HR MCP Server is running on port 47002 before starting the tunnel.

