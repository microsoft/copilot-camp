# Zava Claims MCP Server - Authentication Summary

This MCP server implements **OAuth 2.0 bearer token validation** for securing MCP tool access. The authentication model is designed for scenarios where a **consumer agent** (like Microsoft 365 Copilot) handles the OAuth authorization flow and passes access tokens to this server.

## Authentication Architecture

| Component | Responsibility |
|-----------|----------------|
| **Consumer Agent** | Handles OAuth authorization code flow with Microsoft Entra ID |
| **MCP Server** | Validates incoming bearer tokens and protects tool endpoints |

## Key Components

### `OAuthManager` Class
- **Token Validation**: Uses `jwt-validate` library to verify tokens against Microsoft Entra ID JWKS
- **Multitenant Support**: Validates tokens from any Azure AD tenant
- **Audience Validation**: Accepts both `client-id` and `api://client-id` formats
- **Scope Validation**: Requires `access_as_user` scope

### Protected Endpoints
- `/mcp/*` - All MCP tool endpoints require valid bearer tokens
- `/oauth/userinfo` - Returns authenticated user info (for debugging)

### Public Endpoints
- `/health` - Health check
- `/.well-known/oauth-authorization-server` - RFC 9728 metadata discovery
- `/mcp/messages/.well-known/oauth-protected-resource` - Resource metadata

## RFC 9728 Compliance

The server implements **Protected Resource Metadata** (RFC 9728) to help clients discover OAuth configuration:

```json
{
  "issuer": "https://your-server-url",
  "authorization_endpoint": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
  "token_endpoint": "https://login.microsoftonline.com/common/oauth2/v2.0/token",
  "scopes_supported": ["api://client-id/access_as_user"]
}
```

## Authentication Flow

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Consumer Agent │      │  Microsoft Entra │      │   MCP Server    │
│  (M365 Copilot) │      │        ID        │      │  (This Server)  │
└────────┬────────┘      └────────┬─────────┘      └────────┬────────┘
         │                        │                         │
         │  1. Authorization Code │                         │
         │  ───────────────────►  │                         │
         │                        │                         │
         │  2. Access Token       │                         │
         │  ◄───────────────────  │                         │
         │                        │                         │
         │  3. MCP Request + Bearer Token                   │
         │  ────────────────────────────────────────────►   │
         │                        │                         │
         │                        │   4. Validate Token     │
         │                        │   ◄─────────────────    │
         │                        │                         │
         │  5. MCP Response (tools, data)                   │
         │  ◄────────────────────────────────────────────   │
```

## Configuration

Required environment variables:

| Variable | Description |
|----------|-------------|
| `OAUTH_CLIENT_ID` | Azure AD application client ID |
| `OAUTH_CLIENT_SECRET` | Azure AD application client secret |
| `OAUTH_AUTHORITY` | `https://login.microsoftonline.com/common` |
| `OAUTH_SCOPES` | `api://<client-id>/access_as_user` |
| `SERVER_BASE_URL` | Public URL of the MCP server |
