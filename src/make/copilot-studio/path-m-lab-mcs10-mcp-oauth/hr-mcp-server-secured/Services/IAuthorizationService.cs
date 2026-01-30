namespace HRMCPServer.Services;

/// <summary>
/// Service interface for handling authorization and scope validation
/// </summary>
public interface IAuthorizationService
{
    /// <summary>
    /// Validates that the current user has the required scope
    /// </summary>
    /// <param name="requiredScope">The scope required for the operation</param>
    /// <returns>True if the user has the required scope, false otherwise</returns>
    Task<bool> ValidateScopeAsync(string requiredScope);
    
    /// <summary>
    /// Gets the current user's scopes from the token
    /// </summary>
    /// <returns>List of scopes the user has</returns>
    Task<IEnumerable<string>> GetUserScopesAsync();
    
    /// <summary>
    /// Throws an UnauthorizedAccessException if the user doesn't have the required scope
    /// </summary>
    /// <param name="requiredScope">The scope required for the operation</param>
    Task EnsureScopeAsync(string requiredScope);
}
