using Microsoft.Agents.Builder;
using Microsoft.Agents.Core;
using Microsoft.Agents.Core.Models;
using Microsoft.Extensions.Configuration;
using System.ComponentModel;
using System.Text;
using InsuranceAgent.Services;
using Azure.Search.Documents.Models;

namespace ZavaInsurance.Plugins
{
    /// <summary>
    /// Plugin that provides claim search and retrieval capabilities using Azure AI Search
    /// </summary>
    public class ClaimsPlugin
    {
        private readonly ITurnContext _turnContext;
        private readonly KnowledgeBaseService _knowledgeBaseService;
        private readonly IConfiguration _configuration;

        public ClaimsPlugin(
            ITurnContext turnContext, 
            KnowledgeBaseService knowledgeBaseService,
            IConfiguration configuration)
        {
            _turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
            _knowledgeBaseService = knowledgeBaseService ?? throw new ArgumentNullException(nameof(knowledgeBaseService));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Searches for claims based on multiple criteria (region, type, severity, status)
        /// Returns up to 10 matching claims with structured summaries
        /// </summary>
        [Description("Searches for insurance claims based on region, type, severity, and status. Returns a summary of matching claims.")]
        public async Task<string> SearchClaims(
            string region = null,
            string claimType = null,
            string severity = null,
            string status = null)
        {
            await NotifyUserAsync($"Searching claims database using AI Search...");

            // Build natural language query from parameters
            var queryParts = new List<string> { "insurance claims" };

            if (!string.IsNullOrEmpty(region))
                queryParts.Add($"in {region} region");
            if (!string.IsNullOrEmpty(claimType))
                queryParts.Add($"of type {claimType}");
            if (!string.IsNullOrEmpty(severity))
                queryParts.Add($"with {severity} severity");
            if (!string.IsNullOrEmpty(status))
                queryParts.Add($"with status {status}");

            var query = string.Join(" ", queryParts);

            // Use agentic retrieval with instructions for structured output
            var instructions = @"You are an insurance claims specialist. Provide a clear, structured summary of matching claims.
                Format your response as follows:
                - Total number of claims found
                - For each claim, include: Claim Number, Policyholder, Claim Type, Amount, Status, Date Filed, Severity, Region
                - Use bullet points for readability
                - Include relevant details like adjuster notes or special circumstances
                - Cite sources using [ref_id:X] format";

            // Retrieve up to 10 matching claims
            var response = await _knowledgeBaseService.RetrieveAsync(query, instructions, topResults: 10);

            await NotifyUserAsync($"Retrieved claims information");

            return response;
        }

        /// <summary>
        /// Retrieves comprehensive details for a specific claim by claim number
        /// Uses direct document access for structured data retrieval
        /// </summary>
        [Description("Retrieves detailed information for a specific claim by claim ID, including policyholder info, documentation, and history.")]
        public async Task<string> GetClaimDetails(string claimId)
        {
            await NotifyUserAsync($"Retrieving details for claim {claimId}...");

            // Use direct search to get structured data (more reliable than Knowledge Base answer synthesis)
            var claimDoc = await _knowledgeBaseService.GetClaimByNumberAsync(claimId);

            if (claimDoc == null)
            {
                return $"❌ Claim {claimId} not found in the system.";
            }

            // Extract fields from the search document
            var result = new StringBuilder();
            result.AppendLine("**Claim Information:**");
            result.AppendLine($"- Claim Number: {GetFieldValue(claimDoc, "claimNumber")}");
            result.AppendLine($"- Status: {GetFieldValue(claimDoc, "status")}");
            result.AppendLine($"- Claim Type: {GetFieldValue(claimDoc, "claimType")}");
            result.AppendLine();

            result.AppendLine("**Policyholder & Policy:**");
            result.AppendLine($"- Policyholder Name: {GetFieldValue(claimDoc, "policyholderName")}");
            result.AppendLine($"- Policy Number: {GetFieldValue(claimDoc, "policyNumber")}");
            result.AppendLine();

            result.AppendLine("**Financial Details:**");
            var estimatedCost = GetFieldValue(claimDoc, "estimatedCost");
            result.AppendLine($"- Estimated Cost: ${estimatedCost}");
            result.AppendLine($"- Severity: {GetFieldValue(claimDoc, "severity")}");
            result.AppendLine();

            result.AppendLine("**Assignment & Location:**");
            result.AppendLine($"- Assigned Adjuster: {GetFieldValue(claimDoc, "assignedAdjuster")}");
            result.AppendLine($"- Region: {GetFieldValue(claimDoc, "region")}");
            result.AppendLine($"- Location: {GetFieldValue(claimDoc, "location")}");
            result.AppendLine();

            result.AppendLine("**Incident Details:**");
            result.AppendLine($"- Description: {GetFieldValue(claimDoc, "description")}");
            result.AppendLine();

            result.AppendLine("**Fraud Assessment:**");
            var fraudScore = GetFieldValue(claimDoc, "fraudRiskScore");
            result.AppendLine($"- Fraud Risk Score: {fraudScore}/100");
            var fraudIndicators = GetFieldValue(claimDoc, "fraudIndicators");
            result.AppendLine($"- Fraud Indicators: {(string.IsNullOrWhiteSpace(fraudIndicators) ? "None identified" : fraudIndicators)}");
            result.AppendLine();

            result.AppendLine("**Documentation Status:**");
            var isComplete = GetFieldValue(claimDoc, "isDocumentationComplete");
            result.AppendLine($"- Documentation Complete: {(isComplete == "True" || isComplete == "true" ? "Yes" : "No")}");
            var missingDocs = GetFieldValue(claimDoc, "missingDocumentation");
            result.AppendLine($"- Missing Documentation: {(string.IsNullOrWhiteSpace(missingDocs) ? "None" : missingDocs)}");

            // Get damage photo URL if available
            var imageUrl = await _knowledgeBaseService.GetClaimImageUrlAsync(claimId);

            if (!string.IsNullOrEmpty(imageUrl))
            {
                // Get bot endpoint for devtunnel proxy
                var botEndpoint = _configuration["BOT_ENDPOINT"];
                if (string.IsNullOrEmpty(botEndpoint))
                {
                    var botDomain = _configuration["BOT_DOMAIN"];
                    botEndpoint = !string.IsNullOrEmpty(botDomain) ? $"https://{botDomain}" : "http://localhost:3978";
                }
                botEndpoint = botEndpoint.TrimEnd('/');

                // Proxy the blob storage URL through devtunnel
                var proxyUrl = $"{botEndpoint}/api/image?url={Uri.EscapeDataString(imageUrl)}";

                result.AppendLine();
                result.AppendLine("**Damage Photo:**");
                result.AppendLine($"![Damage Photo]({proxyUrl})");
            }

            await NotifyUserAsync($"Retrieved details for claim {claimId}");

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

        /// <summary>
        /// Helper method to send real-time status updates to users
        /// Uses StreamingResponse for immediate feedback during long operations
        /// </summary>
        private async Task NotifyUserAsync(string message)
        {
            // Send streaming updates (shows as typing indicators with message)
            if (!_turnContext.Activity.ChannelId.Channel!.Contains(Channels.Webchat))
            {
                await _turnContext.StreamingResponse.QueueInformativeUpdateAsync(message);
            }
            else
            {
                await _turnContext.StreamingResponse.QueueInformativeUpdateAsync(message).ConfigureAwait(false);
            }
        }
    }
}