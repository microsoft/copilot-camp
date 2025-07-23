namespace HRMCPServer.Services;

/// <summary>
/// Interface for managing candidate data operations
/// </summary>
public interface ICandidateService
{
    /// <summary>
    /// Gets all candidates
    /// </summary>
    /// <returns>A list of all candidates</returns>
    Task<List<Candidate>> GetAllCandidatesAsync();

    /// <summary>
    /// Adds a new candidate to the collection
    /// </summary>
    /// <param name="candidate">The candidate to add</param>
    /// <returns>True if added successfully, false if candidate with same email already exists</returns>
    Task<bool> AddCandidateAsync(Candidate candidate);

    /// <summary>
    /// Updates an existing candidate by email
    /// </summary>
    /// <param name="email">Email of the candidate to update</param>
    /// <param name="updateAction">Action to perform the update</param>
    /// <returns>True if candidate was found and updated, false otherwise</returns>
    Task<bool> UpdateCandidateAsync(string email, Action<Candidate> updateAction);

    /// <summary>
    /// Removes a candidate by email
    /// </summary>
    /// <param name="email">Email of the candidate to remove</param>
    /// <returns>True if candidate was found and removed, false otherwise</returns>
    Task<bool> RemoveCandidateAsync(string email);

    /// <summary>
    /// Searches for candidates based on a search term
    /// </summary>
    /// <param name="searchTerm">The term to search for</param>
    /// <returns>A list of matching candidates</returns>
    Task<List<Candidate>> SearchCandidatesAsync(string searchTerm);
}
