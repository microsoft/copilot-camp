using System.ComponentModel;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ModelContextProtocol.Server;
using HRMCPServer.Services;

namespace HRMCPServer;

/// <summary>
/// Provides HR management tools for the MCP server.
/// Loads candidate data from a JSON file on startup and maintains it in memory.
/// All modifications are temporary and reset when the server restarts.
/// </summary>
[McpServerToolType]
internal class HRTools
{
    private readonly ICandidateService _candidateService;
    private readonly ILogger<HRTools> _logger;

    public HRTools(
        ICandidateService candidateService,
        ILogger<HRTools> logger)
    {
        _candidateService = candidateService ?? throw new ArgumentNullException(nameof(candidateService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [McpServerTool]
    [Description("Provides the whole list of the candidates")]
    public async Task<CandidateCollection> ListCandidates()
    {
        var candidates = await _candidateService.GetAllCandidatesAsync();
        return new CandidateCollection 
        { 
            Candidates = candidates 
        };
    }

    [McpServerTool]
    [Description("Adds a new candidate to the list")]
    public async Task<string> AddCandidate(
        [Description("First name of the candidate")] string firstName,
        [Description("Last name of the candidate")] string lastName,
        [Description("Email address of the candidate")] string email,
        [Description("Current role of the candidate")] string currentRole,
        [Description("Comma-separated list of spoken languages")] string spokenLanguages = "",
        [Description("Comma-separated list of skills")] string skills = "")
    {
        var candidate = new Candidate
        {
            FirstName = firstName?.Trim() ?? string.Empty,
            LastName = lastName?.Trim() ?? string.Empty,
            Email = email?.Trim() ?? string.Empty,
            CurrentRole = currentRole?.Trim() ?? string.Empty,
            SpokenLanguages = ParseCommaSeparatedString(spokenLanguages),
            Skills = ParseCommaSeparatedString(skills)
        };

        var success = await _candidateService.AddCandidateAsync(candidate);
        
        if (!success)
        {
            return $"Candidate with email '{candidate.Email}' already exists.";
        }
        
        return $"Successfully added candidate: {candidate.FullName}";
    }

    [McpServerTool]
    [Description("Updates an existing candidate by email")]
    public async Task<string> UpdateCandidate(
        [Description("Email address of the candidate to update")] string email,
        [Description("New first name (optional)")] string? firstName = null,
        [Description("New last name (optional)")] string? lastName = null,
        [Description("New current role (optional)")] string? currentRole = null,
        [Description("New comma-separated list of spoken languages (optional)")] string? spokenLanguages = null,
        [Description("New comma-separated list of skills (optional)")] string? skills = null)
    {
        var success = await _candidateService.UpdateCandidateAsync(email, candidate =>
        {
            // Update fields if provided
            if (!string.IsNullOrWhiteSpace(firstName))
                candidate.FirstName = firstName.Trim();
            
            if (!string.IsNullOrWhiteSpace(lastName))
                candidate.LastName = lastName.Trim();
            
            if (!string.IsNullOrWhiteSpace(currentRole))
                candidate.CurrentRole = currentRole.Trim();
            
            if (spokenLanguages != null)
                candidate.SpokenLanguages = ParseCommaSeparatedString(spokenLanguages);
            
            if (skills != null)
                candidate.Skills = ParseCommaSeparatedString(skills);
        });

        if (!success)
        {
            return $"Candidate with email '{email}' not found.";
        }
        
        return $"Successfully updated candidate with email: {email}";
    }

    [McpServerTool]
    [Description("Removes a candidate by email")]
    public async Task<string> RemoveCandidate(
        [Description("Email address of the candidate to remove")] string email)
    {
        var success = await _candidateService.RemoveCandidateAsync(email);

        if (!success)
        {
            return $"Candidate with email '{email}' not found.";
        }
        
        return $"Successfully removed candidate with email: {email}";
    }

    [McpServerTool]
    [Description("Searches for candidates by name, email, skills, or current role")]
    public async Task<CandidateCollection> SearchCandidates(
        [Description("Search term to find in candidate data")] string searchTerm)
    {
        var matchingCandidates = await _candidateService.SearchCandidatesAsync(searchTerm);
        
        return new CandidateCollection 
        { 
            Candidates = matchingCandidates 
        };
    }

    // Private helper methods
    private static List<string> ParseCommaSeparatedString(string? input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return new List<string>();

        return input.Split(',', StringSplitOptions.RemoveEmptyEntries)
                   .Select(s => s.Trim())
                   .Where(s => !string.IsNullOrEmpty(s))
                   .ToList();
    }
}