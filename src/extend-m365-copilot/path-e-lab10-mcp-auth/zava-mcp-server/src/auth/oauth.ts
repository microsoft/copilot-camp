import { Request, Response, NextFunction } from 'express';
import * as jose from 'jose';
import { logger } from '../utils/logger';

// ─── Resource-server configuration ─────────────────────────────────────────────
// This is what a standard OAuth 2.0 resource server needs – no provider-specific
// fields (no clientSecret, redirectUri, authority, etc.).
export interface ResourceServerConfig {
  /** One or more JWKS URIs to fetch signing keys from.
   *  If omitted, keys are discovered via each issuer's
   *  `<issuer>/.well-known/openid-configuration` → `jwks_uri`. */
  jwksUris?: string[];

  /** Accepted `iss` claim values.  At least one is required. */
  acceptedIssuers: string[];

  /** Accepted `aud` claim values.  At least one is required. */
  acceptedAudiences: string[];

  /** Scopes the resource server advertises / expects (for metadata).
   *  Scope enforcement per-tool is handled separately. */
  requiredScopes?: string[];

  /** Allowed signing algorithms (default: RS256). */
  allowedAlgorithms?: string[];

  /** Clock tolerance in seconds for exp / nbf checks (default: 60). */
  clockToleranceSec?: number;

  /** Whether to validate the `iss` claim against acceptedIssuers (default: true).
   *  Set to false for multitenant apps where tokens come from many tenants
   *  but audience + signature checks are sufficient.
   *  When false, `acceptedTenantIds` MUST be provided to prevent open-relay. */
  validateIssuer?: boolean;

  /** Accepted tenant IDs (e.g. Entra `tid` claim).  Required when
   *  `validateIssuer` is false to ensure tokens still come from known tenants. */
  acceptedTenantIds?: string[];

  /** External authorization endpoint (e.g. Entra's /authorize URL).
   *  Required for MCP clients that discover auth via /.well-known/oauth-authorization-server. */
  authorizationEndpoint?: string;

  /** External token endpoint (e.g. Entra's /token URL). */
  tokenEndpoint?: string;
}

// Keep the old name as an alias so existing imports compile.
export type OAuthConfig = ResourceServerConfig;

// ─── Validated token claims ────────────────────────────────────────────────────
// Generic – no provider-specific fields are required.
export interface TokenClaims {
  /** Subject (standard JWT `sub` claim). */
  sub: string;
  /** Issuer. */
  iss: string;
  /** Audience(s). */
  aud: string | string[];
  /** Preferred username / email – extracted from common claims. */
  preferred_username: string;
  /** Display name (if present). */
  name?: string;
  /** Scopes – parsed from the `scp` (string) or `scope` claim. */
  scp?: string[];
  /** Full set of raw claims for anything callers need beyond the above. */
  raw: jose.JWTPayload;
}

// Re-export under the old name so the server file keeps compiling.
export type UserInfo = TokenClaims;

// Augment Express request.
declare global {
  namespace Express {
    interface Request {
      user?: TokenClaims;
      mcpAuthenticated?: boolean;
    }
  }
}

// ─── JWKS helpers ──────────────────────────────────────────────────────────────

/** Cache of JWKS remote key sets keyed by URI. */
const jwksCache = new Map<string, jose.JWTVerifyGetKey>();

function getOrCreateJWKS(uri: string): jose.JWTVerifyGetKey {
  let keySet = jwksCache.get(uri);
  if (!keySet) {
    keySet = jose.createRemoteJWKSet(new URL(uri));
    jwksCache.set(uri, keySet);
  }
  return keySet;
}

/**
 * Discover the JWKS URI from an issuer's OpenID Connect discovery document.
 * Works with any standards-compliant provider (Entra, Auth0, Keycloak, etc.).
 */
async function discoverJwksUri(issuer: string): Promise<string> {
  const base = issuer.endsWith('/') ? issuer.slice(0, -1) : issuer;
  const discoveryUrl = `${base}/.well-known/openid-configuration`;

  const res = await fetch(discoveryUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch OIDC discovery from ${discoveryUrl}: ${res.status}`);
  }
  const doc = (await res.json()) as { jwks_uri?: string };
  if (!doc.jwks_uri) {
    throw new Error(`No jwks_uri in OIDC discovery document at ${discoveryUrl}`);
  }
  return doc.jwks_uri;
}

// ─── OAuthManager (generic resource-server token validator) ────────────────────

export class OAuthManager {
  private config: ResourceServerConfig;
  private resolvedJWKS: jose.JWTVerifyGetKey[] | null = null;
  private algorithms: string[];
  private clockTolerance: number;

  constructor(config: ResourceServerConfig) {
    if (!config.acceptedIssuers.length) {
      throw new Error('ResourceServerConfig.acceptedIssuers must contain at least one issuer');
    }
    if (!config.acceptedAudiences.length) {
      throw new Error('ResourceServerConfig.acceptedAudiences must contain at least one audience');
    }
    if (config.validateIssuer === false && (!config.acceptedTenantIds || !config.acceptedTenantIds.length)) {
      throw new Error(
        'ResourceServerConfig.acceptedTenantIds must contain at least one tenant ID ' +
        'when validateIssuer is false, to prevent accepting tokens from arbitrary tenants'
      );
    }
    this.config = config;
    this.algorithms = config.allowedAlgorithms ?? ['RS256'];
    this.clockTolerance = config.clockToleranceSec ?? 60;
    logger.info('OAuthManager initialised (generic resource-server mode)');
  }

  /**
   * Lazily resolve JWKS key sets.  If explicit `jwksUris` were provided they are
   * used directly; otherwise we discover them from each accepted issuer.
   */
  private async getKeySets(): Promise<jose.JWTVerifyGetKey[]> {
    if (this.resolvedJWKS) return this.resolvedJWKS;

    const uris: string[] = [];
    if (this.config.jwksUris?.length) {
      uris.push(...this.config.jwksUris);
    } else {
      for (const issuer of this.config.acceptedIssuers) {
        try {
          const jwksUri = await discoverJwksUri(issuer);
          uris.push(jwksUri);
          logger.info(`Discovered JWKS URI for issuer ${issuer}: ${jwksUri}`);
        } catch (err) {
          logger.error(`JWKS discovery failed for issuer ${issuer}:`, err);
        }
      }
    }

    if (!uris.length) {
      throw new Error('No JWKS URIs could be resolved – cannot validate tokens');
    }

    this.resolvedJWKS = uris.map(uri => getOrCreateJWKS(uri));
    return this.resolvedJWKS;
  }

  /**
   * Validate a bearer JWT.
   * Tries each resolved JWKS key set until one succeeds (supports multi-issuer).
   */
  async validateToken(token: string): Promise<TokenClaims | null> {
    try {
      const keySets = await this.getKeySets();
      let lastError: unknown;

      for (const jwks of keySets) {
        try {
          const verifyOptions: jose.JWTVerifyOptions = {
            algorithms: this.algorithms,
            audience: this.config.acceptedAudiences,
            clockTolerance: this.clockTolerance,
          };

          // Only enforce issuer check when validateIssuer is not explicitly false
          if (this.config.validateIssuer !== false) {
            verifyOptions.issuer = this.config.acceptedIssuers;
          }

          const { payload } = await jose.jwtVerify(token, jwks, verifyOptions);

          // When issuer validation is disabled, enforce tenant-ID check instead
          if (this.config.validateIssuer === false && this.config.acceptedTenantIds?.length) {
            const tid = (payload as any).tid;
            if (!tid || !this.config.acceptedTenantIds.includes(tid)) {
              throw new Error(
                `Token tenant ID "${tid || '(missing)'}" is not in the accepted tenant list`
              );
            }
          }

          const scopes = this.extractScopes(payload);

          const claims: TokenClaims = {
            sub: payload.sub ?? '',
            iss: payload.iss ?? '',
            aud: payload.aud ?? '',
            preferred_username:
              (payload as any).preferred_username ??
              (payload as any).upn ??
              (payload as any).email ??
              payload.sub ??
              'unknown',
            name: (payload as any).name,
            scp: scopes,
            raw: payload,
          };

          logger.info('Token validated successfully', {
            user: claims.preferred_username,
            issuer: claims.iss,
          });

          return claims;
        } catch (err) {
          lastError = err;
        }
      }

      // Decode (without verifying) to inspect the aud claim for debugging
      try {
        const decoded = jose.decodeJwt(token);
        logger.warn('Token validation failed across all JWKS key sets', {
          error: lastError instanceof Error ? lastError.message : String(lastError),
          tokenAud: decoded.aud,
          expectedAud: this.config.acceptedAudiences,
        });
      } catch {
        logger.warn('Token validation failed across all JWKS key sets', {
          error: lastError instanceof Error ? lastError.message : String(lastError),
        });
      }
      return null;
    } catch (error) {
      logger.error('Error validating token:', error);
      return null;
    }
  }

  /** Extract bearer token from an Authorization header value. */
  extractBearerToken(authHeader: string): string | null {
    if (!authHeader?.startsWith('Bearer ')) return null;
    return authHeader.substring(7);
  }

  private extractScopes(payload: jose.JWTPayload): string[] {
    if (typeof (payload as any).scp === 'string') {
      return (payload as any).scp.split(' ');
    }
    if (typeof (payload as any).scope === 'string') {
      return (payload as any).scope.split(' ');
    }
    if (Array.isArray((payload as any).scp)) {
      return (payload as any).scp;
    }
    return [];
  }
}

// ─── RFC 9728 Protected Resource Metadata ──────────────────────────────────────

export interface ProtectedResourceMetadata {
  resource?: string;
  authorization_servers?: string[];
  jwks_uri?: string;
  scopes_supported?: string[];
  bearer_methods_supported?: string[];
  resource_signing_alg_values_supported?: string[];
  resource_name?: string;
  resource_documentation?: string;
  resource_policy_uri?: string;
  resource_tos_uri?: string;
  tls_client_certificate_bound_access_tokens?: boolean;
  authorization_details_types_supported?: string[];
  dpop_signing_alg_values_supported?: string[];
  dpop_bound_access_tokens_required?: boolean;
  signed_metadata?: string;
  [key: string]: any;
}

/**
 * Build RFC 9728 Protected Resource Metadata.
 * No provider-specific endpoints are injected.
 */
export function generateProtectedResourceMetadata(
  resourceIdentifier: string,
  config: ResourceServerConfig,
  additionalMetadata: Partial<ProtectedResourceMetadata> = {}
): ProtectedResourceMetadata {
  return {
    resource: resourceIdentifier,
    authorization_servers: config.acceptedIssuers,
    scopes_supported: config.requiredScopes ?? [],
    bearer_methods_supported: ['header'],
    resource_signing_alg_values_supported: config.allowedAlgorithms ?? ['RS256'],
    ...additionalMetadata,
  };
}

/**
 * Create RFC 9728 `.well-known` route handlers.
 */
export function createProtectedResourceMetadataRoutes(
  resourceIdentifier: string,
  config: ResourceServerConfig,
  additionalMetadata: Partial<ProtectedResourceMetadata> = {}
) {
  return {
    wellKnownMetadata: (_req: Request, res: Response) => {
      try {
        const metadata = generateProtectedResourceMetadata(
          resourceIdentifier,
          config,
          additionalMetadata,
        );

        res.set({
          'Cache-Control': 'public, max-age=3600',
          'Content-Type': 'application/json',
        });

        res.json(metadata);
      } catch (error) {
        logger.error('Error generating protected resource metadata:', error);
        res.status(500).json({
          error: 'Failed to generate protected resource metadata',
          timestamp: new Date().toISOString(),
        });
      }
    },
  };
}

// ─── RFC 8414 Authorization Server Metadata ────────────────────────────────────
// MCP clients (e.g. VS Code) fetch /.well-known/oauth-authorization-server to
// discover where to send the user for authorization and where to exchange codes.

export interface AuthorizationServerMetadata {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  scopes_supported?: string[];
  response_types_supported?: string[];
  code_challenge_methods_supported?: string[];
  [key: string]: any;
}

/**
 * Build RFC 8414 Authorization Server Metadata.
 * Points the client at the external authorization and token endpoints.
 */
export function generateAuthorizationServerMetadata(
  resourceIdentifier: string,
  config: ResourceServerConfig,
): AuthorizationServerMetadata {
  if (!config.authorizationEndpoint || !config.tokenEndpoint) {
    throw new Error(
      'OAUTH_AUTHORIZATION_ENDPOINT and OAUTH_TOKEN_ENDPOINT must be set ' +
      'for MCP clients that use /.well-known/oauth-authorization-server discovery'
    );
  }

  return {
    issuer: resourceIdentifier,
    authorization_endpoint: config.authorizationEndpoint,
    token_endpoint: config.tokenEndpoint,
    scopes_supported: config.requiredScopes ?? [],
    response_types_supported: ['code'],
    code_challenge_methods_supported: ['S256'],
  };
}

/**
 * Create the /.well-known/oauth-authorization-server route handler.
 */
export function createAuthorizationServerMetadataRoute(
  resourceIdentifier: string,
  config: ResourceServerConfig,
) {
  return (_req: Request, res: Response) => {
    try {
      const metadata = generateAuthorizationServerMetadata(resourceIdentifier, config);

      res.set({
        'Cache-Control': 'public, max-age=3600',
        'Content-Type': 'application/json',
      });

      res.json(metadata);
    } catch (error) {
      logger.error('Error generating authorization server metadata:', error);
      res.status(500).json({
        error: 'Failed to generate authorization server metadata',
        timestamp: new Date().toISOString(),
      });
    }
  };
}

// ─── Middleware ─────────────────────────────────────────────────────────────────

/**
 * Express middleware that enforces required scopes on a per-request basis.
 * Attach after `createOAuthMiddleware`.  Returns 403 when the token lacks
 * any of the `requiredScopes`.
 */
export function createScopeEnforcementMiddleware(
  requiredScopes: string[],
  resourceMetadataUrl?: string,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip for unauthenticated routes (handled by auth middleware)
    if (!req.user || !requiredScopes.length) return next();

    const tokenScopes = req.user.scp ?? [];
    const missing = requiredScopes.filter(required => {
      // Match full URI (api://client-id/scope) or short name (scope)
      // Entra ID v2.0 tokens only include the short name in the scp claim
      const shortName = required.includes('/') ? required.split('/').pop()! : required;
      return !tokenScopes.includes(required) && !tokenScopes.includes(shortName);
    });

    if (missing.length > 0) {
      const wwwAuth = resourceMetadataUrl
        ? `Bearer resource_metadata="${resourceMetadataUrl}", error="insufficient_scope", error_description="Missing scopes: ${missing.join(', ')}"`
        : `Bearer realm="MCP Protected Resource", error="insufficient_scope"`;

      logger.warn(`🔒 SCOPE CHECK FAILED: ${req.method} ${req.path}`, {
        user: req.user.preferred_username,
        required: requiredScopes,
        actual: tokenScopes,
        missing,
      });

      return res
        .status(403)
        .set('WWW-Authenticate', wwwAuth)
        .json({
          error: 'insufficient_scope',
          description: `Token is missing required scope(s): ${missing.join(', ')}`,
          resource_metadata_url: resourceMetadataUrl,
          timestamp: new Date().toISOString(),
        });
    }

    next();
  };
}

/**
 * Express middleware that enforces bearer-token authentication.
 * Returns 401 with a `WWW-Authenticate` header (RFC 9728 section 5) on failure.
 */
export function createOAuthMiddleware(
  oauthManager: OAuthManager,
  resourceMetadataUrl?: string,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const skipAuthPaths = [
      '/health',
      '/mcp/messages/.well-known/oauth-authorization-server',
      '/mcp/messages/.well-known/oauth-protected-resource',
    ];

    if (skipAuthPaths.includes(req.path)) {
      logger.info(`\ud83d\udd0d DISCOVERY: ${req.method} ${req.path} (no auth required)`);
      return next();
    }

    const wwwAuth = resourceMetadataUrl
      ? `Bearer resource_metadata="${resourceMetadataUrl}"`
      : 'Bearer realm="MCP Protected Resource"';

    const authHeader = req.get('Authorization');
    if (!authHeader) {
      logger.warn(`🔒 AUTH ATTEMPT: ${req.method} ${req.path} → 401 Missing Authorization header`, {
        ip: req.ip,
        origin: req.get('Origin') || 'none',
      });
      return res
        .status(401)
        .set('WWW-Authenticate', wwwAuth)
        .json({
          error: 'Missing Authorization header',
          description: 'Include a Bearer token in the Authorization header',
          resource_metadata_url: resourceMetadataUrl,
          timestamp: new Date().toISOString(),
        });
    }

    const token = oauthManager.extractBearerToken(authHeader);
    if (!token) {
      logger.warn(`🔒 AUTH ATTEMPT: ${req.method} ${req.path} → 401 Malformed Authorization header`, {
        ip: req.ip,
        headerPrefix: authHeader.substring(0, 20),
      });
      return res
        .status(401)
        .set('WWW-Authenticate', wwwAuth)
        .json({
          error: 'Invalid Authorization header format',
          description: 'Authorization header must be: Bearer <token>',
          resource_metadata_url: resourceMetadataUrl,
          timestamp: new Date().toISOString(),
        });
    }

    logger.info(`🔑 AUTH ATTEMPT: ${req.method} ${req.path} — validating bearer token...`);

    try {
      const claims = await oauthManager.validateToken(token);
      if (!claims) {
        logger.warn(`🔒 AUTH FAILED: ${req.method} ${req.path} → 401 Token validation returned null`);
        return res
          .status(401)
          .set('WWW-Authenticate', wwwAuth)
          .json({
            error: 'Invalid or expired token',
            description: 'The provided token could not be validated',
            resource_metadata_url: resourceMetadataUrl,
            timestamp: new Date().toISOString(),
          });
      }

      req.user = claims;
      req.mcpAuthenticated = true;

      logger.info(`✅ AUTH SUCCESS: ${req.method} ${req.path}`, {
        user: claims.preferred_username,
        issuer: claims.iss,
        scopes: claims.scp?.join(', ') || 'none',
      });

      next();
    } catch (error) {
      logger.error(`❌ AUTH ERROR: ${req.method} ${req.path} → 401 Exception during validation`, error);
      return res
        .status(401)
        .set('WWW-Authenticate', wwwAuth)
        .json({
          error: 'Token validation failed',
          description: 'An error occurred while validating the token',
          resource_metadata_url: resourceMetadataUrl,
          timestamp: new Date().toISOString(),
        });
    }
  };
}

// ─── OAuth routes (token-info / debugging) ─────────────────────────────────────

export function createOAuthRoutes(_oauthManager: OAuthManager) {
  return {
    tokenInfo: (req: Request, res: Response) => {
      if (!req.user || !req.mcpAuthenticated) {
        return res.status(401).json({
          error: 'Not authenticated',
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        authenticated: true,
        user: {
          sub: req.user.sub,
          username: req.user.preferred_username,
          name: req.user.name,
          issuer: req.user.iss,
          scp: req.user.scp,
        },
        timestamp: new Date().toISOString(),
      });
    },
  };
}
