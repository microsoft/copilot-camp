# Authentication – Zava Claims MCP Server

This MCP server is a standard **OAuth 2.0 resource server**. It validates incoming JWT bearer tokens against any compliant identity provider and does not run its own authorization flow.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| **Identity Provider** | Issues JWTs (Entra ID, Auth0, Keycloak, Okta, etc.) |
| **Consumer Agent** | Obtains a token and sends it with each request |
| **MCP Server (this)** | Validates the bearer token and serves tool results |

## How Token Validation Works

1. On startup the server reads `OAUTH_ACCEPTED_ISSUERS` and `OAUTH_ACCEPTED_AUDIENCES`.
2. For each issuer it fetches `<issuer>/.well-known/openid-configuration` to discover the `jwks_uri` (or uses explicitly configured `OAUTH_JWKS_URIS`).
3. On every request to `/mcp/*`, the middleware:
   - Extracts the `Authorization: Bearer <token>` header.
   - Verifies the JWT **signature** against the JWKS keys.
   - Checks **`exp`** (expiry) and **`nbf`** (not-before) with configurable clock tolerance.
   - Validates **`iss`** against `OAUTH_ACCEPTED_ISSUERS`.
   - Validates **`aud`** against `OAUTH_ACCEPTED_AUDIENCES`.
4. If any check fails, a `401` is returned with a `WWW-Authenticate` header pointing to the RFC 9728 metadata URL.

### Multi-Issuer Support

Multiple issuers can be listed (comma-separated). The server tries each JWKS key set in turn until one validates the token. This allows accepting tokens from different identity providers simultaneously.

## RFC 9728 – Protected Resource Metadata

The server exposes discovery endpoints so MCP clients can learn what authentication is required:

```
GET /.well-known/oauth-authorization-server
GET /mcp/messages/.well-known/oauth-protected-resource
```

Response:

```json
{
  "resource": "https://your-server-url",
  "authorization_servers": [
    "https://login.microsoftonline.com/<tenant>/v2.0"
  ],
  "scopes_supported": ["access_as_user"],
  "bearer_methods_supported": ["header"],
  "resource_signing_alg_values_supported": ["RS256"]
}
```

## Configuration

```bash
# Required – at least one issuer and one audience enables auth
OAUTH_ACCEPTED_ISSUERS=https://login.microsoftonline.com/<tenant>/v2.0
OAUTH_ACCEPTED_AUDIENCES=api://<client-id>,<client-id>

# Optional
OAUTH_REQUIRED_SCOPES=access_as_user
OAUTH_JWKS_URIS=              # auto-discovered if omitted
OAUTH_ALLOWED_ALGORITHMS=RS256 # default
OAUTH_CLOCK_TOLERANCE_SEC=60   # default
```

If both `OAUTH_ACCEPTED_ISSUERS` and `OAUTH_ACCEPTED_AUDIENCES` are empty or unset, the server starts in **anonymous/development mode** — all tools are public.

## Flow Diagram

```
Consumer Agent              Identity Provider            MCP Server
       │                          │                          │
       │  1. Discover auth reqs   │                          │
       │  ──────────────────────────────────────────────────►│
       │  ◄── RFC 9728 metadata   │                          │
       │                          │                          │
       │  2. Auth code / token    │                          │
       │  ───────────────────────►│                          │
       │  ◄── access_token (JWT)  │                          │
       │                          │                          │
       │  3. Bearer <token>       │                          │
       │  ──────────────────────────────────────────────────►│
       │                          │   4. JWKS → verify JWT   │
       │                          │   ◄──────────────────────│
       │  5. Tool response        │                          │
       │  ◄──────────────────────────────────────────────────│
```

## Key Implementation Details

- **Library**: `jose` – standards-compliant JWKS fetching and JWT verification.
- **JWKS caching**: Remote key sets are cached in memory and refreshed automatically by `jose`.
- **Scope extraction**: Reads `scp` (space-delimited string or array) or `scope` (space-delimited string) from the JWT payload — covers Entra, Auth0, and most other providers.
- **User identity**: Uses the standard `sub` claim; also extracts `preferred_username`, `upn`, or `email` for display.

## Public Endpoints (No Auth)

- `GET /health`
- `GET /.well-known/oauth-authorization-server`
- `GET /mcp/messages/.well-known/oauth-protected-resource`

## Protected Endpoints (Bearer Token)

- `GET /mcp/tools`
- `POST /mcp/tools/call`
- `POST /mcp/messages`
- `GET /mcp/stream`
- `POST /mcp/stream/tools/call`
- `GET /oauth/userinfo`
