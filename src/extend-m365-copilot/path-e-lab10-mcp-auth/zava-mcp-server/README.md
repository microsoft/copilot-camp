# Zava Claims Ops – OAuth 2.0 Protected MCP Server

A **Model Context Protocol (MCP) server** built with TypeScript that exposes insurance-claims data to AI agents behind standard **OAuth 2.0 bearer-token authentication**.

The server is a *resource server* in OAuth terms — it validates incoming JWTs against any standards-compliant issuer (Microsoft Entra ID, Auth0, Keycloak, Okta, etc.) and does not run its own authorization flow.

---

## Key Features

| Area | Details |
|------|---------|
| **MCP** | Standards-compliant MCP server (tools + prompts) over HTTP |
| **OAuth 2.0** | Generic resource-server JWT validation via JWKS |
| **RFC 9728** | Protected Resource Metadata discovery endpoints |
| **Multi-issuer** | Accept tokens from one or many issuers (configurable list) |
| **Storage** | Azure Table Storage (with local Azurite emulator) |
| **Validation** | Zod schema validation for all tool inputs |
| **Deployment** | Docker / Azure Container Apps ready |

---

## Authentication Overview

This server acts as a **standard OAuth 2.0 resource server**:

1. Every request to `/mcp/*` must carry an `Authorization: Bearer <token>` header.
2. The JWT is validated using signing keys fetched from the issuer's **JWKS endpoint** (auto-discovered via `/.well-known/openid-configuration` or configured explicitly).
3. **Signature**, **expiry**, **`iss`** (issuer), and **`aud`** (audience) claims are verified.
4. Accepted issuers and audiences are **configurable lists** — not hardcoded to any single provider.

### Authentication Flow

```
Consumer Agent                   Identity Provider               MCP Server
(e.g. Copilot, CLI)              (Entra / Auth0 / …)            (this server)
       │                                │                            │
       │  1. GET /.well-known/oauth-protected-resource               │
       │  ──────────────────────────────────────────────────────────► │
       │  ◄── { authorization_servers, scopes_supported, … }         │
       │                                │                            │
       │  2. Obtain token via provider  │                            │
       │  ─────────────────────────────►│                            │
       │  ◄── access_token (JWT)        │                            │
       │                                │                            │
       │  3. POST /mcp/tools/call       │                            │
       │     Authorization: Bearer <token>                           │
       │  ──────────────────────────────────────────────────────────► │
       │                                │  4. Fetch JWKS, verify JWT │
       │                                │  ◄─────────────────────────│
       │  5. Tool result                │                            │
       │  ◄──────────────────────────────────────────────────────────│
```

Unauthenticated requests receive a **401** with a `WWW-Authenticate` header pointing to the RFC 9728 metadata URL, which is also what triggers on-behalf-of sign-in flows in compatible clients.

---

## Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd zava-mcp-server
npm install
```

### 2. Configure Environment

Create `env/.env.dev` (or whichever environment you target):

```bash
# ── OAuth 2.0 Resource-Server Settings ───────────────────────────
# Comma-separated lists; at least one issuer + one audience enables auth.
OAUTH_ACCEPTED_ISSUERS=https://login.microsoftonline.com/<tenant-id>/v2.0
OAUTH_ACCEPTED_AUDIENCES=api://<client-id>
OAUTH_REQUIRED_SCOPES=access_as_user           # optional
OAUTH_JWKS_URIS=https://login.microsoftonline.com/common/discovery/v2.0/keys
# OAUTH_VALIDATE_ISSUER=true                   # default; set false for multitenant
# OAUTH_ALLOWED_ALGORITHMS=RS256               # optional — defaults to RS256
# OAUTH_CLOCK_TOLERANCE_SEC=60                 # optional

# ── Authorization Server Endpoints (for MCP client discovery) ────
OAUTH_AUTHORIZATION_ENDPOINT=https://login.microsoftonline.com/common/oauth2/v2.0/authorize
OAUTH_TOKEN_ENDPOINT=https://login.microsoftonline.com/common/oauth2/v2.0/token

# ── Server ───────────────────────────────────────────────────────
RESOURCE_IDENTIFIER=https://your-server-url     # used in RFC 9728 metadata
SERVER_BASE_URL=https://your-server-url
PORT=3001
HOST=127.0.0.1
NODE_ENV=development

# ── CORS ─────────────────────────────────────────────────────────
ADDITIONAL_ALLOWED_ORIGINS=http://localhost:6274

# ── Azure Table Storage (local Azurite) ──────────────────────────
AZURE_STORAGE_CONNECTION_STRING="UseDevelopmentStorage=true"
```

> **Running without auth?** Leave `OAUTH_ACCEPTED_ISSUERS` and `OAUTH_ACCEPTED_AUDIENCES` empty or unset. The server starts in anonymous/development mode.

### 3. Build

```bash
npm run build
```

### 4. Start Local Storage (Terminal 1)

```bash
npm run start:azurite
```

### 5. Initialize Sample Data (Terminal 2)

```bash
npm run init-data
```

### 6. Start the MCP Server (Terminal 2)

```bash
npm run start:mcp-http
```

The server starts on `http://127.0.0.1:3001` by default.

---

## Environment Variables Reference

### OAuth 2.0 (Resource-Server)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `OAUTH_ACCEPTED_ISSUERS` | Comma-separated list of accepted JWT `iss` values | Yes (for auth) | `https://login.microsoftonline.com/<tid>/v2.0` |
| `OAUTH_ACCEPTED_AUDIENCES` | Comma-separated list of accepted JWT `aud` values | Yes (for auth) | `api://<client-id>,https://my-api` |
| `OAUTH_REQUIRED_SCOPES` | Scopes advertised in metadata (comma-separated) | No | `access_as_user` |
| `OAUTH_JWKS_URIS` | Explicit JWKS URIs for signature verification | Recommended | `https://login.microsoftonline.com/common/discovery/v2.0/keys` |
| `OAUTH_VALIDATE_ISSUER` | Enforce `iss` claim check (default: `true`). Set `false` for multitenant | No | `false` |
| `OAUTH_ALLOWED_ALGORITHMS` | JWT signing algorithms (default: `RS256`) | No | `RS256,ES256` |
| `OAUTH_CLOCK_TOLERANCE_SEC` | Clock skew tolerance in seconds (default: `60`) | No | `120` |
| `OAUTH_AUTHORIZATION_ENDPOINT` | External authorization URL for MCP client discovery | Yes (for MCP clients) | `https://login.microsoftonline.com/common/oauth2/v2.0/authorize` |
| `OAUTH_TOKEN_ENDPOINT` | External token URL for MCP client discovery | Yes (for MCP clients) | `https://login.microsoftonline.com/common/oauth2/v2.0/token` |

### Server

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `RESOURCE_IDENTIFIER` | Base URL for RFC 9728 metadata | Recommended | `https://your-server-url` |
| `SERVER_BASE_URL` | Server's public URL | Recommended | `https://your-server-url` |
| `PORT` | Listening port | No | `3001` |
| `HOST` | Bind address | No | `127.0.0.1` |
| `NODE_ENV` | `development` or `production` | No | `development` |
| `ADDITIONAL_ALLOWED_ORIGINS` | Extra CORS origins (comma-separated) | No | `http://localhost:6274` |
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Table Storage connection | No | `UseDevelopmentStorage=true` |

---

## Provider-Specific Setup

### Microsoft Entra ID (Azure AD)

#### 1. Register an Application

1. Go to [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID** → **App registrations** → **New registration**.
2. **Name**: `Zava Claims MCP Server`.
3. **Supported account types**: *Accounts in any organizational directory (Multitenant)* and personal Microsoft accounts.
4. Click **Register**.

#### 2. Configure Redirect URIs

Go to **Authentication** → **Add a platform** → **Web**. Add:

```
http://127.0.0.1:33418
https://vscode.dev/redirect
https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect
```

Leave *Implicit grant* unchecked.

#### 3. Expose an API

1. **Expose an API** → Set the **Application ID URI** (e.g. `api://<client-id>`).
2. **Add a scope**: `access_as_user` (Admins and users can consent).

#### 4. Create a Client Secret *(only needed by the consumer agent, not this server)*

Certificates & secrets → New client secret → copy the value.

#### 5. Environment Variables for Entra ID

**Single-tenant:**
```bash
OAUTH_ACCEPTED_ISSUERS=https://login.microsoftonline.com/<tenant-id>/v2.0
OAUTH_ACCEPTED_AUDIENCES=api://<client-id>,<client-id>
OAUTH_REQUIRED_SCOPES=access_as_user
OAUTH_JWKS_URIS=https://login.microsoftonline.com/<tenant-id>/discovery/v2.0/keys
OAUTH_AUTHORIZATION_ENDPOINT=https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/authorize
OAUTH_TOKEN_ENDPOINT=https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/token
RESOURCE_IDENTIFIER=https://your-server-url
SERVER_BASE_URL=https://your-server-url
```

**Multitenant:**
```bash
OAUTH_ACCEPTED_ISSUERS=https://login.microsoftonline.com/common/v2.0
OAUTH_ACCEPTED_AUDIENCES=api://<client-id>,<client-id>
OAUTH_REQUIRED_SCOPES=access_as_user
OAUTH_JWKS_URIS=https://login.microsoftonline.com/common/discovery/v2.0/keys
OAUTH_VALIDATE_ISSUER=false
OAUTH_AUTHORIZATION_ENDPOINT=https://login.microsoftonline.com/common/oauth2/v2.0/authorize
OAUTH_TOKEN_ENDPOINT=https://login.microsoftonline.com/common/oauth2/v2.0/token
RESOURCE_IDENTIFIER=https://your-server-url
SERVER_BASE_URL=https://your-server-url
```

### Auth0

```bash
OAUTH_ACCEPTED_ISSUERS=https://<your-tenant>.auth0.com/
OAUTH_ACCEPTED_AUDIENCES=https://zava-claims-api
OAUTH_REQUIRED_SCOPES=read:claims
```

### Keycloak

```bash
OAUTH_ACCEPTED_ISSUERS=https://<keycloak-host>/realms/<realm>
OAUTH_ACCEPTED_AUDIENCES=zava-claims
```

> JWKS URIs are **auto-discovered** from each issuer's `/.well-known/openid-configuration`. Override with `OAUTH_JWKS_URIS` only if the provider doesn't publish a standard discovery document.

---

## MCP Server Endpoints

### Public (No Auth Required)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/.well-known/oauth-authorization-server` | RFC 9728 OAuth metadata |
| `GET` | `/mcp/messages/.well-known/oauth-protected-resource` | MCP-specific OAuth metadata |

### Protected (Requires Bearer Token when OAuth is enabled)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/mcp/tools` | List available tools |
| `POST` | `/mcp/tools/call` | Execute a tool directly |
| `POST` | `/mcp/messages` | MCP JSON-RPC 2.0 protocol |
| `GET` | `/mcp/stream` | SSE streaming connection |
| `POST` | `/mcp/stream/tools/call` | Execute tool with SSE response |
| `GET` | `/oauth/userinfo` | Authenticated user info (debug) |

---

## Available MCP Tools

### Claims (5 tools)

| Tool | Description |
|------|-------------|
| `get_claims` | List claims with optional filters (location, damage type, date range) |
| `get_claim` | Get a claim by ID or claim number |
| `create_claim` | Create a new insurance claim |
| `update_claim` | Update an existing claim |
| `delete_claim` | Delete a claim |

### Inspections (5 tools)

| Tool | Description |
|------|-------------|
| `get_inspections` | List inspections (filter by claim, status) |
| `get_inspection` | Get a specific inspection |
| `create_inspection` | Schedule a new inspection |
| `update_inspection` | Update inspection details / status |
| `delete_inspection` | Cancel / delete an inspection |

### Inspectors (2 tools)

| Tool | Description |
|------|-------------|
| `get_inspectors` | List inspectors (filter by specialization) |
| `get_inspector` | Get inspector details |

### Contractors & Purchase Orders (3 tools)

| Tool | Description |
|------|-------------|
| `get_contractors` | List contractors (filter by specialty, preferred status) |
| `create_purchase_order` | Create a PO for contractor work |
| `get_purchase_order` | Get purchase order details |

### AI Prompts (3 prompts)

| Prompt | Description |
|--------|-------------|
| `claims_analysis` | Comprehensive claim analysis (damage, cost, fraud) |
| `damage_assessment` | Detailed property damage assessment |
| `inspection_report` | Structured inspection report template |

---

## Example Usage with curl

### 1. Discover OAuth Metadata (no auth)

```bash
curl http://127.0.0.1:3001/.well-known/oauth-authorization-server
```

### 2. Attempt Unauthenticated Access

```bash
curl -i -X POST http://127.0.0.1:3001/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name":"get_claims","arguments":{}}'
# → 401 Unauthorized
# WWW-Authenticate: Bearer resource_metadata="…"
```

### 3. Make Authenticated Requests

```bash
ACCESS_TOKEN="<your-jwt>"

# List tools
curl http://127.0.0.1:3001/mcp/tools \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Get all claims
curl -X POST http://127.0.0.1:3001/mcp/tools/call \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"name":"get_claims","arguments":{}}'

# MCP JSON-RPC
curl -X POST http://127.0.0.1:3001/mcp/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

### 4. Verify Your Token

```bash
curl http://127.0.0.1:3001/oauth/userinfo \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## Security

| Feature | Implementation |
|---------|---------------|
| **JWT Validation** | Signature verified via issuer's JWKS endpoint (`jose` library) |
| **Issuer Check** | `iss` claim must match one of `OAUTH_ACCEPTED_ISSUERS` |
| **Audience Check** | `aud` claim must match one of `OAUTH_ACCEPTED_AUDIENCES` |
| **Expiry Check** | `exp` / `nbf` enforced with configurable clock tolerance |
| **Multi-issuer** | Tokens from multiple identity providers accepted simultaneously |
| **RFC 9728** | Protected Resource Metadata discovery for MCP clients |
| **WWW-Authenticate** | 401 responses include `resource_metadata` URL |
| **CORS** | Origin allowlist prevents DNS rebinding |

### Protected Tools

All 15 tools require authentication when OAuth is enabled. To make a tool public, remove it from the `protectedTools` array in `mcp-server-http.ts`.

### Scope-Based Permissions

```typescript
const toolPermissions: { [key: string]: string[] } = {
  'get_claims': ['access_as_user'],
  'get_claim': ['access_as_user'],
  // Add more per-tool scope requirements as needed
};
```

---

## Tech Stack

- **Runtime**: Node.js 18+ / TypeScript
- **MCP**: `@modelcontextprotocol/sdk`
- **HTTP**: Express 5
- **JWT**: `jose` (standards-compliant JWKS + JWT verification)
- **Storage**: `@azure/data-tables`
- **Validation**: Zod
- **Testing**: Jest

---

## Project Structure

```
src/
├── mcp-server-http.ts        # Express server, MCP endpoints, middleware
├── auth/
│   └── oauth.ts              # Generic OAuth 2.0 resource-server (JWKS/JWT)
├── config/
│   └── storageConfig.ts      # Azure Table Storage config
├── implementation/            # Business logic per domain
│   ├── claimsImplementation.ts
│   ├── contractorsImplementation.ts
│   ├── inspectionsImplementation.ts
│   └── inspectorsImplementation.ts
├── services/
│   └── tableStorage.ts       # Table Storage client
├── types/
│   └── index.ts              # Shared TypeScript types
├── utils/
│   ├── errors.ts             # Custom error classes
│   └── logger.ts             # Logging utility
└── scripts/
    ├── initializeData.ts     # Seed local Azurite
    └── initializeAzureData.ts# Seed production storage
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript |
| `npm run start:mcp-http` | Build + start MCP HTTP server |
| `npm run start:azurite` | Start local Azure Storage emulator |
| `npm run init-data` | Build + seed local storage with sample data |
| `npm run init-data-prod` | Build + seed production Azure Table Storage |
| `npm test` | Run Jest tests |
| `npm run inspector` | Open MCP Inspector against dev tunnel |

---

## License

MIT
