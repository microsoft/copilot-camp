import { Request, Response, NextFunction } from 'express';
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
import { logger } from '../utils/logger';

// OAuth configuration interface
export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  authority: string;
  redirectUri: string;
  scopes: string[];
}

// User info interface
export interface UserInfo {
  oid: string;
  tid: string;
  preferred_username: string;
  name?: string;
  scp?: string[];
}

// Extended Request interface to include user info
declare global {
  namespace Express {
    interface Request {
      user?: UserInfo;
      mcpAuthenticated?: boolean;
    }
  }
}

export class OAuthManager {
  private config: OAuthConfig;
  private validator: TokenValidator | null = null;

  constructor(config: OAuthConfig) {
    this.config = config;
    logger.info('OAuthManager initialized for token validation');
  }

  /**
   * Validate and decode JWT token
   */
  async validateToken(token: string): Promise<UserInfo | null> {
    try {

     // logger.info('The token is being validated', { token });
         // Create validator if it doesn't exist
    if (!this.validator) {
      // For multitenant apps, use the common endpoint
      const entraJwksUri = await getEntraJwksUri(); // No tenant ID for multitenant
      this.validator = new TokenValidator({
        jwksUri: entraJwksUri
      });
      logger.info('Token validator created for multitenant application');
    }

  const options: ValidateTokenOptions = {
  audience: [this.config.clientId, `api://${this.config.clientId}`], // Accept both formats
  scp: ['access_as_user'] 
};

      // Validate the token
      const validToken = await this.validator.validateToken(token, options);

      if (!validToken || !validToken.oid || !validToken.tid) {
        logger.warn('Invalid token structure - missing required claims');
        return null;
      }

      logger.info('Token validated successfully', { 
        user: validToken.preferred_username || validToken.upn,
        tenant: validToken.tid 
      });

      return {
        oid: validToken.oid,
        tid: validToken.tid,
        preferred_username: validToken.preferred_username || validToken.upn || 'unknown',
        name: validToken.name,
        scp: validToken.scp || [],
      };
    } catch (error) {
      logger.error('Error validating token:', error);
      return null;
    }
  }

  /**
   * Extract bearer token from Authorization header
   */
  extractBearerToken(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

// Protected Resource Metadata interface according to RFC 9728
export interface ProtectedResourceMetadata {
  resource?: string; // REQUIRED: The protected resource's resource identifier
  authorization_servers?: string[]; // OPTIONAL: Array of OAuth authorization server issuer identifiers
  jwks_uri?: string; // OPTIONAL: URL of the protected resource's JSON Web Key Set document
  scopes_supported?: string[]; // RECOMMENDED: Array of scope values used in authorization requests
  bearer_methods_supported?: string[]; // OPTIONAL: Array of supported bearer token methods
  resource_signing_alg_values_supported?: string[]; // OPTIONAL: Array of JWS signing algorithms
  resource_name?: string; // Human-readable name of the protected resource
  resource_documentation?: string; // OPTIONAL: URL of documentation page
  resource_policy_uri?: string; // OPTIONAL: URL of policy page
  resource_tos_uri?: string; // OPTIONAL: URL of terms of service page
  tls_client_certificate_bound_access_tokens?: boolean; // OPTIONAL: Support for mutual-TLS client certificate-bound access tokens
  authorization_details_types_supported?: string[]; // OPTIONAL: Array of authorization details type values
  dpop_signing_alg_values_supported?: string[]; // OPTIONAL: Array of DPoP signing algorithms
  dpop_bound_access_tokens_required?: boolean; // OPTIONAL: Whether DPoP-bound access tokens are always required
  signed_metadata?: string; // OPTIONAL: JWT containing metadata parameters as claims
  // Allow additional parameters
  [key: string]: any;
}

/**
 * Generate Protected Resource Metadata according to RFC 9728
 * Updated to match specific MCP server response format
 */
export function generateProtectedResourceMetadata(
  resourceIdentifier: string,
  oauthConfig: OAuthConfig,
  additionalMetadata: Partial<ProtectedResourceMetadata> = {}
): ProtectedResourceMetadata {
  // Use tunnel URL or SERVER_BASE_URL from environment
  let baseUrl: string;
  try {
    const url = new URL(resourceIdentifier);
    baseUrl = url.protocol.startsWith('http') ? url.origin : process.env.SERVER_BASE_URL || '';
  } catch {
    baseUrl = process.env.SERVER_BASE_URL || '';
  }
  
  // Build the metadata with OpenID Connect configuration format
  const metadata: ProtectedResourceMetadata = {
    issuer: baseUrl,
    authorization_endpoint: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    token_endpoint: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    jwks_uri: "https://login.microsoftonline.com/common/discovery/v2.0/keys",
    scopes_supported: oauthConfig.scopes,
    response_types_supported: [
      "code",
      "token",
      "id_token",
      "code id_token"
    ],
    subject_types_supported: [
      "public"
    ],
    id_token_signing_alg_values_supported: [
      "RS256"
    ],
    userinfo_endpoint: `${baseUrl}/oauth/userinfo`,
    end_session_endpoint: "https://login.microsoftonline.com/common/oauth2/v2.0/logout",
    microsoft_multi_refresh_token: true,
    check_session_iframe: "https://login.microsoftonline.com/common/oauth2/v2.0/checksession",
    frontchannel_logout_supported: true,
    frontchannel_logout_session_required: false,
    revocation_endpoint: "https://login.microsoftonline.com/common/oauth2/v2.0/logout",
    ...additionalMetadata
  };

  return metadata;
}

/**
 * Create Protected Resource Metadata routes according to RFC 9728
 */
export function createProtectedResourceMetadataRoutes(
  resourceIdentifier: string,
  oauthConfig: OAuthConfig,
  additionalMetadata: Partial<ProtectedResourceMetadata> = {}
) {
  return {
    // Well-known OAuth protected resource metadata endpoint
    wellKnownMetadata: (req: Request, res: Response) => {
      try {
        const metadata = generateProtectedResourceMetadata(
          resourceIdentifier,
          oauthConfig,
          additionalMetadata
        );

        // Log the request for debugging but don't warn on mismatch
        // Requests can legitimately come from localhost during development
        // while the resource identifier points to a tunnel/production URL
        const requestHost = req.get('Host') || 'unknown';
        logger.debug('Protected resource metadata requested', {
          requestHost,
          resourceIdentifier
        });

        // Set appropriate cache headers as recommended by RFC 9728
        res.set({
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
          'Content-Type': 'application/json'
        });

        res.json(metadata);
      } catch (error) {
        logger.error('Error generating protected resource metadata:', error);
        res.status(500).json({
          error: 'Failed to generate protected resource metadata',
          timestamp: new Date().toISOString()
        });
      }
    }
  };
}

/**
 * Enhanced OAuth middleware factory with WWW-Authenticate support for metadata URL
 * Reference: RFC 9728 Section 5 - Use of WWW-Authenticate for Protected Resource Metadata
 */
export function createOAuthMiddleware(
  oauthManager: OAuthManager, 
  resourceMetadataUrl?: string
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip authentication for health checks and well-known metadata endpoints
    const skipAuthPaths = [
      '/health', 
      '/mcp/messages/.well-known/oauth-authorization-server',
      '/mcp/messages/.well-known/oauth-protected-resource'
    ];
    
    if (skipAuthPaths.includes(req.path)) {
      return next();
    }

    const authHeader = req.get('Authorization');
    if (!authHeader) {
      // RFC 9728 Section 5.1 - Include resource_metadata parameter in WWW-Authenticate
      let headerValue = '';
      if (req.path === `/messages`) {
        headerValue = 'Bearer realm="OAuth", error="invalid_token", error_description="Missing or invalid access token"';
      } else {
        headerValue = resourceMetadataUrl
          ? `Bearer resource_metadata="${resourceMetadataUrl}"`
          : 'Bearer realm="MCP Protected Resource"';

      }

    // Construct the full authorization URL from base URL
    const baseUrl = process.env.SERVER_BASE_URL || resourceMetadataUrl?.split('/.well-known')[0] || '';
    const authUrl = `${baseUrl}/oauth/authorize`;

      return res.status(401)
        .set('WWW-Authenticate', headerValue)
        .json({
          error: 'Missing Authorization header',
          description: 'Please include Bearer token in Authorization header',
          auth_url: authUrl,
          resource_metadata_url: resourceMetadataUrl,
          timestamp: new Date().toISOString()
        });
    }

    const token = oauthManager.extractBearerToken(authHeader);
    if (!token) {
      const wwwAuthenticateValue = resourceMetadataUrl 
        ? `Bearer resource_metadata="${resourceMetadataUrl}"`
        : 'Bearer realm="MCP Protected Resource"';
      return res.status(401)
        .set('WWW-Authenticate', wwwAuthenticateValue)
        .json({
          error: 'Invalid Authorization header format',
          description: 'Authorization header must be in format: Bearer <token>',
          resource_metadata_url: resourceMetadataUrl,
          timestamp: new Date().toISOString()
        });
    }

    try {
      const userInfo = await oauthManager.validateToken(token);
      if (!userInfo) {
        const wwwAuthenticateValue = resourceMetadataUrl 
          ? `Bearer resource_metadata="${resourceMetadataUrl}"`
          : 'Bearer realm="MCP Protected Resource"';

        return res.status(401)
          .set('WWW-Authenticate', wwwAuthenticateValue)
          .json({
            error: 'Invalid or expired token',
            description: 'The provided token is invalid or has expired',
            resource_metadata_url: resourceMetadataUrl,
            timestamp: new Date().toISOString()
          });
      }

      // Add user info to request object
      req.user = userInfo;
      req.mcpAuthenticated = true;

      logger.info('User authenticated', { 
        user: userInfo.preferred_username, 
        tenant: userInfo.tid 
      });

      next();
    } catch (error) {
      logger.error('Token validation error:', error);
      const wwwAuthenticateValue = resourceMetadataUrl 
        ? `Bearer resource_metadata="${resourceMetadataUrl}"`
        : 'Bearer realm="MCP Protected Resource"';

      return res.status(401)
        .set('WWW-Authenticate', wwwAuthenticateValue)
        .json({
          error: 'Token validation failed',
          description: 'An error occurred while validating the token',
          resource_metadata_url: resourceMetadataUrl,
          timestamp: new Date().toISOString()
        });
    }
  };
}

/**
 * Create OAuth routes for token info/debugging
 * Note: Authorization flow is handled by the consumer agent, not this MCP server
 */
export function createOAuthRoutes(oauthManager: OAuthManager) {
  return {
    // Token info endpoint - for debugging/testing
    tokenInfo: (req: Request, res: Response) => {
      if (!req.user || !req.mcpAuthenticated) {
        return res.status(401).json({
          error: 'Not authenticated',
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        authenticated: true,
        user: {
          id: req.user.oid,
          username: req.user.preferred_username,
          name: req.user.name,
          tenant: req.user.tid,
          scp: req.user.scp
        },
        timestamp: new Date().toISOString()
      });
    }
  };
}