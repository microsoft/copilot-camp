# Zava Claims Ops - OAuth-Protected MCP Server for AI Agents

A modern **Model Context Protocol (MCP) server** built with TypeScript that provides AI agents with **OAuth 2.0 protected access** to insurance claims data through **Azure Table Storage** integration and **Microsoft Entra ID** authentication.


## 🎯 What This Project Provides

- **🤖 MCP Server**: Standards-compliant MCP server for AI agent integration
- **🔐 OAuth 2.0 Authentication**: Microsoft Entra ID integration with JWT validation
- **🛡️ RFC 9728 Compliance**: Protected Resource Metadata discovery for MCP clients
- **☁️ Azure Storage**: Azure Table Storage for scalable data management
- **📦 Production Ready**: Docker containerization with Azure deployment guide
- **🔧 Full CRUD Operations**: Complete Create, Read, Update, Delete operations for claims, inspections, and inspector management
- **📊 Rich Sample Data**: Pre-loaded with realistic insurance data for immediate testing

## 🔐 Authentication Overview

This MCP server implements **OAuth 2.0 authentication** using **Microsoft Entra ID** (formerly Azure Active Directory). Unlike the anonymous version (path-e-lab08-mcp-server), all MCP tool endpoints require a valid Bearer token.

### Key Authentication Features

| Feature | Description |
|---------|-------------|
| **OAuth 2.0 Flow** | Authorization Code flow with Microsoft Entra ID |
| **JWT Validation** | Tokens validated using Microsoft JWKS endpoint |
| **RFC 9728 Support** | Protected Resource Metadata discovery endpoints |
| **Scope-based Access** | `access_as_user` scope for tool access |
| **WWW-Authenticate Headers** | Proper 401 responses with metadata URLs |
| **Configurable Protection** | Choose which tools require authentication |

### Authentication Flow

```
1. Client → GET /.well-known/oauth-authorization-server
   ↳ Discovers OAuth metadata (issuer, token endpoint, scopes)

2. Client → POST /mcp/tools/call (no token)
   ↳ Returns 401 + WWW-Authenticate header with metadata URL

3. Client → Redirects user to Microsoft Entra ID login
   ↳ User authenticates and consents to scopes

4. Client → Receives authorization code → exchanges for access token

5. Client → POST /mcp/tools/call
   Authorization: Bearer <access_token>
   ↳ Token validated → Tool executed → Response returned
```

## 🔄 Code Changes from Anonymous to OAuth

This section documents the key code changes made to add OAuth authentication to the MCP server.

### 1. New Authentication Module (`src/auth/oauth.ts`)

A new `auth` folder was added with the OAuth implementation:

```typescript
// src/auth/oauth.ts - Key exports
export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  authority: string;
  redirectUri: string;
  scopes: string[];
}

export class OAuthManager {
  // Validates JWT tokens using Microsoft JWKS endpoint
  async validateToken(token: string): Promise<UserInfo | null>;
  
  // Extracts Bearer token from Authorization header
  extractBearerToken(authHeader: string): string | null;
}

// RFC 9728 Protected Resource Metadata
export function generateProtectedResourceMetadata(...): ProtectedResourceMetadata;
export function createProtectedResourceMetadataRoutes(...);
export function createOAuthMiddleware(oauthManager, resourceMetadataUrl);
export function createOAuthRoutes(oauthManager);
```

### 2. Import Changes in `mcp-server-http.ts`

**Anonymous version:**
```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { z } from 'zod';
import express from 'express';
import cors from 'cors';
```

**OAuth version adds:**
```typescript
// Import OAuth functionality
import { 
  OAuthManager, 
  createOAuthMiddleware, 
  createOAuthRoutes, 
  OAuthConfig,
  createProtectedResourceMetadataRoutes,
  ProtectedResourceMetadata
} from './auth/oauth';
```

### 3. New Helper Functions

```typescript
// Interface for authenticated requests
interface AuthenticatedRequest extends express.Request {
  user?: {
    oid: string;
    tid: string;
    preferred_username: string;
    name?: string;
    scp?: string[];
  };
  mcpAuthenticated?: boolean;
}

// Generate WWW-Authenticate headers (RFC 9728 compliant)
function getWWWAuthenticateHeader(error?: string, errorDescription?: string): string {
  const resourceIdentifier = getResourceIdentifier();
  const resourceMetadataUrl = `${resourceIdentifier}/.well-known/oauth-authorization-server`;
  
  let header = `Bearer realm="${resourceIdentifier}", resource_metadata="${resourceMetadataUrl}"`;
  if (error) header += `, error="${error}"`;
  if (errorDescription) header += `, error_description="${errorDescription}"`;
  
  return header;
}

// Define which tools require authentication
function requiresAuthentication(toolName: string): boolean {
  const protectedTools = [
    'get_claims', 'get_claim', 'create_claim', 'update_claim', 'delete_claim',
    'get_inspections', 'get_inspection', 'create_inspection', 'update_inspection', 'delete_inspection',
    'get_contractors', 'create_purchase_order', 'get_purchase_order',
    'get_inspectors', 'get_inspector'
  ];
  return protectedTools.includes(toolName);
}

// Check user permissions for specific tools
function hasRequiredPermissions(user: any, toolName: string): boolean {
  const toolPermissions: { [key: string]: string[] } = {
    'get_claims': ['access_as_user'],
    'get_claim': ['access_as_user']
  };
  const requiredPermissions = toolPermissions[toolName] || [];
  if (requiredPermissions.length === 0) return true;
  
  const userRoles = user?.scp || [];
  return requiredPermissions.some(permission => userRoles.includes(permission));
}
```

### 4. OAuth Configuration and Initialization

```typescript
// OAuth Configuration from environment variables
const oauthConfig: OAuthConfig = {
  clientId: process.env.OAUTH_CLIENT_ID || '',
  clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
  authority: process.env.OAUTH_AUTHORITY || '',
  redirectUri: process.env.OAUTH_REDIRECT_URI || '',
  scopes: [process.env.OAUTH_SCOPES || '']
};

// Initialize OAuth only if configured
const isOAuthEnabled = isNonEmptyString(oauthConfig.clientId) && 
                       isNonEmptyString(oauthConfig.clientSecret);

if (isOAuthEnabled) {
  oauthManager = new OAuthManager(oauthConfig);
  
  const resourceIdentifier = process.env.SERVER_BASE_URL || `http://localhost:${port}`;
  const resourceMetadataUrl = `${resourceIdentifier}/mcp/messages/.well-known/oauth-authorization-server`;
  
  // Create middleware and routes
  oauthMiddleware = createOAuthMiddleware(oauthManager, resourceMetadataUrl);
  oauthRoutes = createOAuthRoutes(oauthManager);
  protectedResourceMetadataRoutes = createProtectedResourceMetadataRoutes(
    resourceIdentifier, oauthConfig, additionalMetadata
  );
}
```

### 5. Route Registration Changes

**Anonymous version:**
```typescript
// No authentication middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => { ... });

// MCP endpoints - all public
app.get('/mcp/tools', async (req, res) => { ... });
app.post('/mcp/tools/call', async (req, res) => { ... });
```

**OAuth version adds:**
```typescript
// Protected Resource Metadata endpoints (RFC 9728) - BEFORE OAuth middleware
if (protectedResourceMetadataRoutes) {
  app.get('/.well-known/oauth-authorization-server', 
          protectedResourceMetadataRoutes.wellKnownMetadata);
  app.get('/mcp/messages/.well-known/oauth-protected-resource', 
          protectedResourceMetadataRoutes.wellKnownMetadata);
}

// Apply OAuth middleware to MCP endpoints
if (oauthMiddleware) {
  app.use('/mcp', oauthMiddleware);
}

// OAuth user info endpoint
if (oauthRoutes) {
  app.get('/oauth/userinfo', oauthMiddleware, oauthRoutes.tokenInfo);
}
```

### 6. Error Handling with WWW-Authenticate

**Anonymous version:**
```typescript
res.status(500).json({
  success: false,
  error: errorMessage,
  timestamp: new Date().toISOString()
});
```

**OAuth version adds authentication error handling:**
```typescript
const isAuthError = errorMessage.includes('Authentication required') || 
                    errorMessage.includes('Access denied');

if (isAuthError && isOAuthEnabled) {
  const wwwAuthHeader = errorMessage.includes('Access denied') 
    ? getWWWAuthenticateHeader('insufficient_scope', errorMessage)
    : getWWWAuthenticateHeader('invalid_token', errorMessage);
  
  return res.status(401)
    .set('WWW-Authenticate', wwwAuthHeader)
    .json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
}
```

### 7. Dependencies Added

```json
// package.json additions
{
  "dependencies": {
    "jwt-validate": "^x.x.x"  // For JWT validation with JWKS
  }
}
```

## 🚀 Tech Stack

### Core Technologies
- **Runtime**: Node.js 18+ with TypeScript
- **MCP Framework**: [@modelcontextprotocol/sdk](https://modelcontextprotocol.io/)
- **Web Framework**: Express.js with CORS support
- **Storage**: Azure Table Storage (with local Azurite emulator)
- **Validation**: Zod schema validation for all inputs
- **Testing**: Jest with comprehensive test coverage

### Dependencies
- **@azure/data-tables**: Azure Table Storage client
- **@modelcontextprotocol/sdk**: MCP server implementation
- **express**: HTTP server framework
- **cors**: Cross-origin resource sharing
- **zod**: Runtime type validation
- **joi**: Additional validation schemas

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js 22.x or later** installed
- **npm** or **yarn** package manager
- **TypeScript** (`npm install -g typescript`) 
- **Docker Desktop** (for containerization and deployment)
- **Azure CLI** (for Azure deployment)
- **Git** (for version control)

## 🚀 Quick Start Guide

### Step 1: Clone and Install
```bash
git clone <repository-url>
cd zava-mcp-server
npm install
```

### Step 2: Build the Project
```bash
npm run build
```

### Step 3: Start Local Storage (Terminal 1)
```bash
# Start Azure Storage Emulator - keep this running
npm run start:azurite
```

### Step 4: Initialize Sample Data (Terminal 2)
```bash
# Load sample claims, contractors, inspections data
npm run init-data
```

### Step 5: Start MCP Server (Terminal 2)
```bash
# Start MCP HTTP server on http://127.0.0.1:3001
npm run start:mcp-http
```


## 🛠️ Available MCP Tools

The MCP server provides **15 comprehensive tools** for AI agents across four main categories:

### 📋 Claims Operations
| Tool | Description | Parameters | Example Usage |
|------|-------------|------------|---------------|
| `get_claims` | Retrieve all insurance claims | None | Returns list of all claims |
| `get_claim` | Get specific claim by ID or number | `claimId: string` | Get claim "1" or "CN202504990" |
| `create_claim` | Create a new insurance claim | Full claim object | Create new storm damage claim |
| `update_claim` | Update existing claim | `claimId + update fields` | Update claim status, add notes |
| `delete_claim` | Remove claim from system | `claimId: string` | Permanently delete claim |

### 🔍 Inspection Operations  
| Tool | Description | Parameters | Example Usage |
|------|-------------|------------|---------------|
| `get_inspections` | Get all inspections (with filters) | `claimId?`, `status?` | List inspections for specific claim |
| `get_inspection` | Get specific inspection by ID | `inspectionId: string` | Retrieve inspection details |
| `create_inspection` | Schedule new inspection | Task details | Schedule roof inspection |
| `update_inspection` | Update inspection task | `inspectionId + updates` | Mark inspection complete |
| `delete_inspection` | Remove inspection task | `inspectionId: string` | Cancel scheduled inspection |

### 👷 Inspector Operations
| Tool | Description | Parameters | Example Usage |
|------|-------------|------------|---------------|
| `get_inspectors` | Retrieve all inspectors (with optional specialization filter) | `specialization?` | List all inspectors or filter by "Roofing" |
| `get_inspector` | Get specific inspector by ID | `inspectorId: string` | Get inspector details for assignment |

### 🏗️ Contractor & Purchase Order Operations
| Tool | Description | Parameters | Example Usage |
|------|-------------|------------|---------------|
| `get_contractors` | Retrieve contractors with filters | `name?`, `specialty?`, `isPreferred?` | Find roofing contractors or preferred vendors |
| `create_purchase_order` | Create new purchase order for contractor work | `claimId`, `contractorId`, `workDescription`, `lineItems` | Issue PO for repair work |
| `get_purchase_order` | Get specific purchase order by ID | `poId: string` | Retrieve PO details and status |

### 🤖 AI Prompts Available
| Prompt | Description | Parameters | Purpose |
|--------|-------------|------------|---------|
| `claims_analysis` | Generate comprehensive claim analysis | `claimId`, `analysisType?` | AI-powered claim assessment |
| `damage_assessment` | Generate damage assessment prompt | `claimId`, `damageType`, `severity?` | Property damage evaluation |
| `inspection_report` | Generate inspection report prompt | `inspectionId`, `reportType?` | Structured inspection reporting |

## 🌐 MCP Server Endpoints (OAuth Protected)

### OAuth Discovery Endpoints (No Auth Required)
- **`GET /.well-known/oauth-authorization-server`** - OAuth metadata discovery (RFC 9728)
- **`GET /mcp/messages/.well-known/oauth-protected-resource`** - MCP-specific OAuth metadata

### Health & Status (No Auth Required)
- **`GET /health`** - Comprehensive health check with capabilities

### OAuth Endpoints
- **`GET /oauth/userinfo`** - Get authenticated user info (requires Bearer token)

### MCP Protocol Endpoints (Requires Bearer Token)
- **`POST /mcp/messages`** - JSON-RPC 2.0 MCP protocol communication
- **`GET /mcp/tools`** - List available tools with schemas
- **`POST /mcp/tools/call`** - Execute tool directly (bypass JSON-RPC)
- **`GET /mcp/prompts`** - List available AI prompts
- **`POST /mcp/prompts/get`** - Generate AI prompt content
- **`GET /mcp/stream`** - Server-Sent Events streaming interface
- **`POST /mcp/stream/tools/call`** - Execute tool with streaming response

## 📝 Example Usage with curl (Authenticated Access)

### Step 1: Discover OAuth Metadata (No Auth Required)

```bash
# Get OAuth discovery metadata
curl -X GET "http://127.0.0.1:3001/.well-known/oauth-authorization-server"

# Response includes:
# - issuer
# - authorization_endpoint
# - token_endpoint
# - scopes_supported
```

### Step 2: Attempt Unauthenticated Access

```bash
# This will return 401 with WWW-Authenticate header
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_claims","arguments":{}}'

# Response:
# HTTP/1.1 401 Unauthorized
# WWW-Authenticate: Bearer realm="https://your-server", resource_metadata="https://your-server/.well-known/oauth-authorization-server"
# {
#   "error": "Missing Authorization header",
#   "auth_url": "https://your-server/oauth/authorize",
#   "resource_metadata_url": "https://your-server/.well-known/oauth-authorization-server"
# }
```

### Step 3: Get Access Token

Obtain an access token through your OAuth flow (authorization code flow with Microsoft Entra ID).

### Step 4: Make Authenticated Requests

```bash
# Set your access token
ACCESS_TOKEN="your-jwt-access-token"

# List available tools (requires auth)
curl -X GET "http://127.0.0.1:3001/mcp/tools" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Get all claims (requires auth)
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"name":"get_claims","arguments":{}}'

# Get specific claim (requires auth)
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"name":"get_claim","arguments":{"claimId":"1"}}'

# Create new claim (requires auth)
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "name":"create_claim",
    "arguments":{
      "claimNumber":"CN202504991",
      "policyNumber":"POL-HO-2025-003", 
      "policyHolderName":"Jane Doe",
      "policyHolderEmail":"jane.doe@email.com",
      "property":"789 Oak Street, Portland, OR 97205",
      "dateOfLoss":"2025-01-15T00:00:00Z",
      "dateReported":"2025-01-16T10:30:00Z",
      "status":"submitted",
      "damageTypes":["fire_damage"],
      "description":"Kitchen fire caused by electrical fault",
      "estimatedLoss":25000
    }
  }'

# Get user info (verify your token)
curl -X GET "http://127.0.0.1:3001/oauth/userinfo" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### MCP JSON-RPC Protocol (Authenticated)

```bash
# Standard MCP protocol communication with auth
curl -X POST "http://127.0.0.1:3001/mcp/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "jsonrpc":"2.0",
    "method":"tools/list",
    "id":1
  }'

# Execute tool via JSON-RPC with auth
curl -X POST "http://127.0.0.1:3001/mcp/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "jsonrpc":"2.0",
    "method":"tools/call",
    "params":{"name":"get_claims","arguments":{}},
    "id":1
  }'
```

## ⚙️ Environment Configuration

### OAuth Environment Variables (Required for Authentication)

Create a `.env` file in the root directory with OAuth configuration:

```bash
# OAuth Configuration (Required for authentication)
OAUTH_CLIENT_ID=your-entra-app-client-id
OAUTH_CLIENT_SECRET=your-entra-app-client-secret
OAUTH_AUTHORITY=https://login.microsoftonline.com/common
OAUTH_REDIRECT_URI=https://your-server-url/oauth/callback
OAUTH_SCOPES=api://your-client-id/access_as_user

# Resource Identifier (for MCP Inspector and RFC 9728 metadata)
RESOURCE_IDENTIFIER=https://your-server-url

# CORS Configuration
ADDITIONAL_ALLOWED_ORIGINS=https://your-server-url,http://localhost:6274

# Server Configuration
SERVER_BASE_URL=https://your-server-url
PORT=3001
HOST=127.0.0.1
NODE_ENV=development

# Azure Storage Configuration (Local Azurite)
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;"
```

### Example with Dev Tunnel

When using VS Code Dev Tunnels for local development:

```bash
# OAuth Configuration with Dev Tunnel (not actual values)
OAUTH_CLIENT_ID=acc9sd
OAUTH_CLIENT_SECRET=sdds
OAUTH_AUTHORITY=https://login.microsoftonline.com/common
OAUTH_REDIRECT_URI=https://sdsdssds-3001.aue.devtunnels.ms/oauth/callback
OAUTH_SCOPES=api://acc9sd/access_as_user

# Resource Identifier (for MCP Inspector compatibility)
RESOURCE_IDENTIFIER=https://sdsdssds-3001.aue.devtunnels.ms

# CORS Configuration
ADDITIONAL_ALLOWED_ORIGINS=https://sdsdssds-3001.aue.devtunnels.ms,http://localhost:6274
SERVER_BASE_URL=https://sdsdssds-3001.aue.devtunnels.ms

# Server Configuration
PORT=3001
HOST=127.0.0.1
NODE_ENV=development

# Storage Configuration
AZURE_STORAGE_CONNECTION_STRING=UseDevelopmentStorage=true
```

### Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `OAUTH_CLIENT_ID` | Microsoft Entra ID Application (client) ID | Yes (for auth) | `client-id/` |
| `OAUTH_CLIENT_SECRET` | Client secret from Entra ID app | Yes (for auth) | `client-secret...` |
| `OAUTH_AUTHORITY` | Entra ID authority URL | Yes (for auth) | `https://login.microsoftonline.com/common` |
| `OAUTH_REDIRECT_URI` | OAuth callback URL | Yes (for auth) | `https://your-url/oauth/callback` |
| `OAUTH_SCOPES` | Required OAuth scopes | Yes (for auth) | `api://client-id/access_as_user` |
| `RESOURCE_IDENTIFIER` | Base URL for OAuth metadata | Yes (for auth) | `https://your-server-url` |
| `SERVER_BASE_URL` | Server's public URL | Recommended | `https://your-server-url` |
| `ADDITIONAL_ALLOWED_ORIGINS` | Extra CORS origins (comma-separated) | No | `http://localhost:6274` |
| `PORT` | Server port number | No | `3001` |
| `HOST` | Server host binding | No | `127.0.0.1` |
| `NODE_ENV` | Environment mode | No | `development` |
| `AZURE_STORAGE_CONNECTION_STRING` | Storage connection | No | Azurite local |

### Running Without Authentication

If OAuth environment variables are not configured, the server will start in anonymous mode:

```bash
# Server output when OAuth is not configured
⚠️  Development Mode - No Authentication
   All MCP tools are publicly accessible without authentication.
   To enable OAuth 2.0 authentication, set these environment variables:
   
   OAUTH_CLIENT_ID="your-entra-app-client-id"
   OAUTH_CLIENT_SECRET="your-entra-app-client-secret"
   ...
```

## 🔧 Setting Up Microsoft Entra ID App Registration

To enable OAuth authentication, you need to register an application in Microsoft Entra ID:

### Step 1: Create App Registration

1. Go to [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID** → **App registrations**
2. Click **New registration**
3. Configure:
   - **Name**: `Zava Claims MCP Server`
   - **Supported account types**: `Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)`
   - **Redirect URI**: Leave blank for now (we'll configure this in the next step)
4. Click **Register**

### Step 2: Configure Platform Redirect URIs

After registration, configure redirect URIs for different platforms:

1. Go to **Authentication** → **Platform configurations**

2. **Add a Web platform**:
   - Click **Add a platform** → **Web**
   - Add these redirect URIs:
     ```
     http://127.0.0.1:33418
     https://vscode.dev/redirect
     https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect
     ```
   - Under **Implicit grant and hybrid flows**, leave both options **unchecked** (disabled)
   - Click **Configure**


### Step 3: Create Client Secret

1. Go to **Certificates & secrets** → **Client secrets**
2. Click **New client secret**
3. Add description (e.g., `zava`) and select expiration (recommended: 24 months)
4. Click **Add**
5. **Copy the secret value immediately** (it won't be shown again)

### Step 4: Expose an API

1. Go to **Expose an API**
2. Click **Set** next to **Application ID URI** and accept the default format: `api://your-client-id`
3. Click **Add a scope** and configure:
   - **Scope name**: `access_as_user`
   - **Who can consent**: Admins and users
   - **Admin consent display name**: `Read Zava as Admin`
   - **Admin consent description**: `Read Zava as Admin`
   - **User consent display name**: `Read Zava as User`
   - **User consent description**: `Read Zava as Admin`
   - **State**: Enabled
4. Click **Add scope**

### Step 5: Update Environment Variables

```bash
# Use values from your app registration
OAUTH_CLIENT_ID=<Application (client) ID>
OAUTH_CLIENT_SECRET=<Client secret value>
OAUTH_AUTHORITY=https://login.microsoftonline.com/common
OAUTH_REDIRECT_URI=http://localhost:6274/oauth/callback/debug
OAUTH_SCOPES=api://<Application (client) ID>/access_as_user
RESOURCE_IDENTIFIER=<Your server URL or dev tunnel URL>
```

### Testing the Configuration

```bash
# Start the server
npm run start:mcp-http

# Verify OAuth is enabled
curl http://127.0.0.1:3001/health
# Should show: "authentication": "OAuth enabled"

# Test OAuth discovery
curl http://127.0.0.1:3001/.well-known/oauth-authorization-server
```

## 🔒 Security Considerations

### OAuth 2.0 Security Features

This authenticated version implements comprehensive security:

| Feature | Implementation |
|---------|---------------|
| **JWT Validation** | Tokens validated against Microsoft JWKS endpoint |
| **Audience Validation** | Accepts both `client-id` and `api://client-id` formats |
| **Scope Validation** | Requires `access_as_user` scope |
| **Multitenant Support** | Works with any Microsoft Entra ID tenant |
| **RFC 9728 Compliance** | Protected Resource Metadata discovery |
| **WWW-Authenticate Headers** | Proper 401 responses with metadata URLs |
| **CORS Protection** | Origin allowlist prevents DNS rebinding |

### Protected Tools

All 15 MCP tools require authentication by default:

```typescript
const protectedTools = [
  'get_claims', 'get_claim', 'create_claim', 'update_claim', 'delete_claim',
  'get_inspections', 'get_inspection', 'create_inspection', 'update_inspection', 'delete_inspection',
  'get_contractors', 'create_purchase_order', 'get_purchase_order',
  'get_inspectors', 'get_inspector'
];
```

To make a tool public (not require auth), remove it from the `protectedTools` array in `mcp-server-http.ts`.

### Scope-Based Permissions

The server supports role-based access control (RBAC) with scope-based permissions:

```typescript
const toolPermissions: { [key: string]: string[] } = {
  'get_claims': ['access_as_user'],
  'get_claim': ['access_as_user']
  // Add more tool-specific permissions as needed
};
```





