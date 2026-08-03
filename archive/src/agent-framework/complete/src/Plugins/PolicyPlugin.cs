using Microsoft.Agents.Builder;
using Microsoft.Agents.Builder.State;
using Microsoft.Agents.Core.Models;
using System.ComponentModel;
using System.Text;
using System.Text.Json;
using Azure.Search.Documents.Models;
using InsuranceAgent;
using InsuranceAgent.Services;

namespace ZavaInsurance.Plugins
{
    /// <summary>
    /// Policy Plugin for Zava Insurance
    /// Provides policy search and retrieval using Azure AI Search Knowledge Base
    /// Provides policy document search using Copilot Retrieval API for real-time SharePoint access
    /// Supports filtering by policy type, status, and policyholder name
    /// </summary>
    public class PolicyPlugin
    {
        private readonly ITurnContext _turnContext;
        private readonly Microsoft.Agents.Builder.State.ITurnState _turnState;
        private readonly KnowledgeBaseService _knowledgeBaseService;
        private readonly HttpClient _httpClient;

        public PolicyPlugin(ITurnContext turnContext, Microsoft.Agents.Builder.State.ITurnState turnState, KnowledgeBaseService knowledgeBaseService, HttpClient httpClient)
        {
            _turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
            _turnState = turnState ?? throw new ArgumentNullException(nameof(turnState));
            _knowledgeBaseService = knowledgeBaseService ?? throw new ArgumentNullException(nameof(knowledgeBaseService));
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        }

        /// <summary>
        /// Searches for insurance policies using filters
        /// </summary>
        /// <param name="policyType">Filter by policy type (Auto, Homeowners, Commercial) - optional</param>
        /// <param name="status">Filter by status (Active, Expired, Cancelled) - optional</param>
        /// <param name="policyholderName">Filter by policyholder name - optional</param>
        /// <returns>Matching policy information</returns>
        [Description("Searches insurance policies with optional filters for policy type, status, or policyholder name. Returns relevant policies with details.")]
        public async Task<string> SearchPolicies(string policyType = null, string status = null, string policyholderName = null)
        {
            await NotifyUserAsync($"🔍 Searching policies...");

            try
            {
                // Build natural language query for agentic retrieval
                var queryParts = new List<string> { "insurance policies" };
                
                if (!string.IsNullOrWhiteSpace(policyType))
                    queryParts.Add($"type {policyType}");
                if (!string.IsNullOrWhiteSpace(status))
                    queryParts.Add($"status {status}");
                if (!string.IsNullOrWhiteSpace(policyholderName))
                    queryParts.Add($"for {policyholderName}");

                var query = string.Join(" ", queryParts);

                // Use agentic retrieval with instructions for structured policy listing
                var instructions = @"You are an insurance policy specialist. Provide a comprehensive list of matching policies.
                    For each policy, include:
                    - Policy Number and Type
                    - Policyholder Name
                    - Status and Effective Dates
                    - Coverage Limit and Deductible
                    - Premium Amount
                    - Property/Vehicle details if applicable
                    Format with clear sections and bullet points. Cite sources with [ref_id:X].";
                
                var response = await _knowledgeBaseService.RetrieveAsync(query, instructions, topResults: 10);

                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SearchPolicies: {ex.Message}");
                return $"❌ Error searching policies: {ex.Message}";
            }
        }

        /// <summary>
        /// Searches policy documents (terms, coverage guides, handbooks, FAQs) using Copilot Retrieval API
        /// </summary>
        /// <param name="query">Natural language query about policy terms, coverage, or claims procedures</param>
        /// <returns>Relevant policy documentation with citations from SharePoint</returns>
        [Description("Searches policy documentation (coverage guides, policy terms, handbooks, FAQs) in SharePoint using Copilot API. Perfect for finding coverage details, claims procedures, and policy questions.")]
        public async Task<string> SearchPolicyDocuments(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return "❌ Error: Search query cannot be empty.";

            await NotifyUserAsync($"🔍 Searching policy documents in SharePoint for: {query}");

            try
            {
                // Get OBO access token from turn state
                var accessToken = _turnState.Conversation.GetCachedOBOAccessToken();
                if (string.IsNullOrEmpty(accessToken))
                {
                    Console.WriteLine("No OBO token available, authentication may be required");
                    return "❌ Error: Unable to access SharePoint. Please sign in to continue.";
                }

                // Call Copilot Retrieval API (using beta endpoint)
                var payload = new
                {
                    queryString = query,
                    dataSource = "SharePoint",
                    resourceMetadata = new[] { "title", "author" }
                };

                var httpContent = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");

                var response = await _httpClient.PostAsync("https://graph.microsoft.com/beta/copilot/retrieval", httpContent);
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Copilot Retrieval API error: {response.StatusCode}");
                    Console.WriteLine($"Error details: {errorContent}");
                    return $"❌ Error: Unable to retrieve policy documents from SharePoint (Status: {response.StatusCode}). The Copilot Retrieval API may not be available in your tenant.";
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Copilot API Response: {responseContent}");
                
                var jsonResponse = JsonDocument.Parse(responseContent);
                
                // Parse results and format response
                var results = new StringBuilder();
                results.AppendLine("📄 **Policy Documentation from SharePoint:**\n");

                // Copilot Retrieval API returns "retrievalHits" array
                if (jsonResponse.RootElement.TryGetProperty("retrievalHits", out var retrievalHits) && retrievalHits.GetArrayLength() > 0)
                {
                    foreach (var hit in retrievalHits.EnumerateArray())
                    {
                        // Get document title from resourceMetadata
                        string title = "Policy Document";
                        if (hit.TryGetProperty("resourceMetadata", out var metadata) &&
                            metadata.TryGetProperty("title", out var titleProp))
                        {
                            title = titleProp.GetString() ?? title;
                        }

                        // Get extracts (text snippets)
                        if (hit.TryGetProperty("extracts", out var extracts) && extracts.GetArrayLength() > 0)
                        {
                            results.AppendLine($"**{title}**");
                            
                            foreach (var extract in extracts.EnumerateArray())
                            {
                                if (extract.TryGetProperty("text", out var textProp))
                                {
                                    var text = textProp.GetString();
                                    if (!string.IsNullOrWhiteSpace(text))
                                    {
                                        // Clean up and limit text length
                                        text = text.Trim().Replace("\r\n", " ").Replace("\n", " ");
                                        if (text.Length > 500)
                                        {
                                            text = text.Substring(0, 500) + "...";
                                        }
                                        results.AppendLine($"- {text}");
                                    }
                                }
                            }
                            
                            results.AppendLine();
                        }
                    }
                }
                else
                {
                    results.AppendLine("ℹ️ No policy documents found matching your query. Try rephrasing your question or check if the documents exist in SharePoint.");
                }

                return results.ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SearchPolicyDocuments: {ex.Message}");
                Console.WriteLine($"Error type: {ex.GetType().Name}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                return $"❌ Error searching policy documents: {ex.Message}";
            }
        }

        /// <summary>
        /// Creates a proxied citation URL through the bot endpoint for secure SharePoint document access
        /// </summary>
        private string GetCitationUrl(string targetUrl)
        {
            var botEndpoint = Environment.GetEnvironmentVariable("BOT_ENDPOINT");
            var encodedUrl = Uri.EscapeDataString(targetUrl);
            return $"{botEndpoint}/api/citation?targetUrl={encodedUrl}";
        }



        /// <summary>
        /// Gets detailed information about a specific insurance policy
        /// </summary>
        /// <param name="policyNumber">The policy number to retrieve</param>
        /// <returns>Detailed policy information</returns>
        [Description("Retrieves comprehensive details for a specific insurance policy by policy number.")]
        public async Task<string> GetPolicyDetails(string policyNumber)
        {
            if (string.IsNullOrWhiteSpace(policyNumber))
                return "❌ Error: Policy number cannot be empty.";

            await NotifyUserAsync($"Retrieving policy {policyNumber}...");

            // Use direct search for structured data (more reliable than Knowledge Base answer synthesis)
            var policyDoc = await _knowledgeBaseService.GetPolicyByNumberAsync(policyNumber);
            
            if (policyDoc == null)
            {
                return $"❌ Policy {policyNumber} not found in the system.";
            }

            // Extract fields from the search document
            var result = new StringBuilder();
            result.AppendLine("**Policy Information:**");
            result.AppendLine($"- Policy Number: {GetFieldValue(policyDoc, "policyNumber")}");
            result.AppendLine($"- Policy Type: {GetFieldValue(policyDoc, "policyType")}");
            result.AppendLine($"- Status: {GetFieldValue(policyDoc, "status")}");
            result.AppendLine($"- Policyholder Name: {GetFieldValue(policyDoc, "policyholderName")}");
            result.AppendLine();
            
            result.AppendLine("**Coverage & Financial:**");
            result.AppendLine($"- Coverage Limit: ${GetFieldValue(policyDoc, "coverageLimit")}");
            result.AppendLine($"- Deductible: ${GetFieldValue(policyDoc, "deductible")}");
            result.AppendLine($"- Annual Premium: ${GetFieldValue(policyDoc, "annualPremium")}");
            result.AppendLine();

            // Parse and display coverage details
            var coverageDetailsJson = GetFieldValue(policyDoc, "coverageDetails");
            if (coverageDetailsJson != "Not available")
            {
                try
                {
                    var coverageDetails = JsonSerializer.Deserialize<Dictionary<string, object>>(coverageDetailsJson);
                    if (coverageDetails != null && coverageDetails.Count > 0)
                    {
                        result.AppendLine("**Coverage Details:**");
                        foreach (var coverage in coverageDetails)
                        {
                            result.AppendLine($"- {coverage.Key}: {coverage.Value}");
                        }
                        result.AppendLine();
                    }
                }
                catch { }
            }

            // Display vehicle or property info based on policy type
            var policyType = GetFieldValue(policyDoc, "policyType");
            if (policyType.Contains("Auto", StringComparison.OrdinalIgnoreCase))
            {
                var vehicleInfoJson = GetFieldValue(policyDoc, "vehicleInfo");
                if (vehicleInfoJson != "Not available")
                {
                    try
                    {
                        var vehicleInfo = JsonSerializer.Deserialize<Dictionary<string, object>>(vehicleInfoJson);
                        if (vehicleInfo != null && vehicleInfo.Count > 0)
                        {
                            result.AppendLine("**Vehicle Information:**");
                            foreach (var info in vehicleInfo)
                            {
                                result.AppendLine($"- {info.Key}: {info.Value}");
                            }
                        }
                    }
                    catch { }
                }
            }
            else if (policyType.Contains("Home", StringComparison.OrdinalIgnoreCase))
            {
                var propertyInfoJson = GetFieldValue(policyDoc, "propertyInfo");
                if (propertyInfoJson != "Not available")
                {
                    try
                    {
                        var propertyInfo = JsonSerializer.Deserialize<Dictionary<string, object>>(propertyInfoJson);
                        if (propertyInfo != null && propertyInfo.Count > 0)
                        {
                            result.AppendLine("**Property Information:**");
                            foreach (var info in propertyInfo)
                            {
                                result.AppendLine($"- {info.Key}: {info.Value}");
                            }
                        }
                    }
                    catch { }
                }
            }

            return result.ToString();
        }

        /// <summary>
        /// Helper method to safely extract field values from SearchDocument
        /// </summary>
        private string GetFieldValue(SearchDocument doc, string fieldName)
        {
            if (doc.ContainsKey(fieldName) && doc[fieldName] != null)
            {
                return doc[fieldName].ToString() ?? "Not available";
            }
            return "Not available";
        }





        // Helper methods
        private async Task NotifyUserAsync(string message)
        {
            if (!_turnContext.Activity.ChannelId.Channel!.Contains(Channels.Webchat))
            {
                await _turnContext.StreamingResponse.QueueInformativeUpdateAsync(message);
            }
            else
            {
                Console.WriteLine(message);
            }
        }
    }
}
