using Microsoft.Agents.Builder;
using Microsoft.Agents.Core.Models;
using System.ComponentModel;
using System.Text;
using Azure.Search.Documents.Models;
using InsuranceAgent.Services;

namespace ZavaInsurance.Plugins
{
    /// <summary>
    /// Policy Plugin for Zava Insurance
    /// Provides policy search and retrieval using Azure AI Search Knowledge Base
    /// Supports filtering by policy type, status, and policyholder name
    /// </summary>
    public class PolicyPlugin
    {
        private readonly ITurnContext _turnContext;
        private readonly KnowledgeBaseService _knowledgeBaseService;

        public PolicyPlugin(ITurnContext turnContext, KnowledgeBaseService knowledgeBaseService)
        {
            _turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
            _knowledgeBaseService = knowledgeBaseService ?? throw new ArgumentNullException(nameof(knowledgeBaseService));
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

            // Display vehicle or property info based on policy type
            var policyType = GetFieldValue(policyDoc, "policyType");
            if (policyType.Contains("Auto", StringComparison.OrdinalIgnoreCase))
            {
                var vehicleMake = GetFieldValue(policyDoc, "vehicleMake");
                var vehicleModel = GetFieldValue(policyDoc, "vehicleModel");
                var vehicleYear = GetFieldValue(policyDoc, "vehicleYear");

                if (vehicleMake != "Not available")
                {
                    result.AppendLine("**Vehicle Information:**");
                    result.AppendLine($"- Vehicle: {vehicleYear} {vehicleMake} {vehicleModel}");
                    result.AppendLine($"- VIN: {GetFieldValue(policyDoc, "vehicleVin")}");
                }
            }
            else if (policyType.Contains("Home", StringComparison.OrdinalIgnoreCase))
            {
                var propertyAddress = GetFieldValue(policyDoc, "propertyAddress");
                if (propertyAddress != "Not available")
                {
                    result.AppendLine("**Property Information:**");
                    result.AppendLine($"- Address: {propertyAddress}");
                    result.AppendLine($"- Property Type: {GetFieldValue(policyDoc, "propertyType")}");
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