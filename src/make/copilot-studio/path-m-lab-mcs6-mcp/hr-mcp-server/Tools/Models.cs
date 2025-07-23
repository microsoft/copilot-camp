using System.Text.Json.Serialization;

namespace HRMCPServer;

/// <summary>
/// Represents a candidate in the HR system
/// </summary>
public class Candidate
{
    /// <summary>
    /// The candidate's first name
    /// </summary>
    [JsonPropertyName("firstname")]
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// The candidate's last name
    /// </summary>
    [JsonPropertyName("lastname")]
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// The candidate's email address
    /// </summary>
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// List of languages the candidate speaks
    /// </summary>
    [JsonPropertyName("spoken_languages")]
    public List<string> SpokenLanguages { get; set; } = new();

    /// <summary>
    /// List of the candidate's skills
    /// </summary>
    [JsonPropertyName("skills")]
    public List<string> Skills { get; set; } = new();

    /// <summary>
    /// The candidate's current role
    /// </summary>
    [JsonPropertyName("current_role")]
    public string CurrentRole { get; set; } = string.Empty;

    /// <summary>
    /// Gets the candidate's full name
    /// </summary>
    public string FullName => $"{FirstName} {LastName}";
}

/// <summary>
/// Container for a collection of candidates
/// </summary>
public class CandidateCollection
{
    /// <summary>
    /// List of candidates
    /// </summary>
    public List<Candidate> Candidates { get; set; } = new();
}

