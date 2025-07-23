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
