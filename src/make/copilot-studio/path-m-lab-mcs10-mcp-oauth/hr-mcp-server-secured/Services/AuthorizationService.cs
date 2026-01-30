using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace HRMCPServer.Services;

/// <summary>
/// Implementation of authorization service that validates JWT tokens and scopes
/// </summary>
public class AuthorizationService : IAuthorizationService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<AuthorizationService> _logger;
    
    // Common claim types for scopes in Azure AD tokens
    private static readonly string[] ScopeClaimTypes = new[]
    {
        "scp",                                           // Azure AD v1 tokens
        "http://schemas.microsoft.com/identity/claims/scope", // Alternative scope claim
        "scope"                                          // Generic OAuth scope claim
    };

    public AuthorizationService(
        IHttpContextAccessor httpContextAccessor,
        ILogger<AuthorizationService> logger)
    {
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc/>
    public Task<bool> ValidateScopeAsync(string requiredScope)
    {
        if (string.IsNullOrWhiteSpace(requiredScope))
        {
            throw new ArgumentNullException(nameof(requiredScope));
        }

        var httpContext = _httpContextAccessor.HttpContext;
        
        if (httpContext?.User?.Identity?.IsAuthenticated != true)
        {
            _logger.LogWarning("User is not authenticated");
            return Task.FromResult(false);
        }

        var userScopes = GetScopesFromClaims(httpContext.User.Claims);
        var hasScope = userScopes.Any(s => 
            s.Equals(requiredScope, StringComparison.OrdinalIgnoreCase));

        if (!hasScope)
        {
            _logger.LogWarning(
                "User does not have required scope '{RequiredScope}'. Available scopes: {AvailableScopes}",
                requiredScope, 
                string.Join(", ", userScopes));
        }
        else
        {
            _logger.LogDebug("User has required scope '{RequiredScope}'", requiredScope);
        }

        return Task.FromResult(hasScope);
    }

    /// <inheritdoc/>
    public Task<IEnumerable<string>> GetUserScopesAsync()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        
        if (httpContext?.User?.Identity?.IsAuthenticated != true)
        {
            _logger.LogDebug("User is not authenticated, returning empty scopes");
            return Task.FromResult(Enumerable.Empty<string>());
        }

        var scopes = GetScopesFromClaims(httpContext.User.Claims);
        return Task.FromResult(scopes);
    }

    /// <inheritdoc/>
    public async Task EnsureScopeAsync(string requiredScope)
    {
        var hasScope = await ValidateScopeAsync(requiredScope);
        
        if (!hasScope)
        {
            var message = $"Access denied. Required scope '{requiredScope}' is missing. " +
                         $"Please ensure your token includes the '{requiredScope}' permission.";
            
            _logger.LogError(
                "Authorization failed: User lacks required scope '{RequiredScope}'", 
                requiredScope);
            
            throw new UnauthorizedAccessException(message);
        }
    }

    /// <summary>
    /// Extracts scopes from the user's claims
    /// </summary>
    private IEnumerable<string> GetScopesFromClaims(IEnumerable<Claim> claims)
    {
        var scopes = new List<string>();
        
        foreach (var claimType in ScopeClaimTypes)
        {
            var scopeClaims = claims
                .Where(c => c.Type.Equals(claimType, StringComparison.OrdinalIgnoreCase))
                .SelectMany(c => c.Value.Split(' ', StringSplitOptions.RemoveEmptyEntries))
                .Select(s => s.Trim());
            
            scopes.AddRange(scopeClaims);
        }

        return scopes.Distinct(StringComparer.OrdinalIgnoreCase);
    }
}
