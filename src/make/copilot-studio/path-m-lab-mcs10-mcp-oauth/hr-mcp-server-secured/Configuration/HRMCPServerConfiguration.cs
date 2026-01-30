namespace HRMCPServer;

/// <summary>
/// Configuration settings for the HR MCP Server
/// </summary>
public class HRMCPServerConfiguration
{
    public const string SectionName = "HRMCPServer";
    
    /// <summary>
    /// The path of the candidates file for HR MCP Server
    /// </summary>
    public string CandidatesPath { get; set; } = string.Empty;
}

/// <summary>
/// Configuration settings for OAuth/Azure AD authentication
/// </summary>
public class OAuthConfiguration
{
    public const string SectionName = "AzureAd";
    
    /// <summary>
    /// The Azure AD tenant ID
    /// </summary>
    public string TenantId { get; set; } = string.Empty;
    
    /// <summary>
    /// The Azure AD instance URL (e.g., https://login.microsoftonline.com/)
    /// </summary>
    public string Instance { get; set; } = "https://login.microsoftonline.com/";
    
    /// <summary>
    /// The client ID (Application ID) of the registered application
    /// </summary>
    public string ClientId { get; set; } = string.Empty;
    
    /// <summary>
    /// The audience for token validation
    /// </summary>
    public string Audience { get; set; } = string.Empty;

    /// <summary>
    /// The scopes required for accessing the API
    /// </summary>
    public string Scopes { get; set; } = string.Empty;
    
    /// <summary>
    /// Gets the Authority URL for token validation
    /// </summary>
    public string Authority => $"{Instance.TrimEnd('/')}/{TenantId}/v2.0";
}

/// <summary>
/// Defines the permission scopes used in the HR MCP Server
/// </summary>
public static class HRScopes
{
    /// <summary>
    /// The scope required for HR management operations
    /// </summary>
    public const string HRManage = "HR.Manage";
}
