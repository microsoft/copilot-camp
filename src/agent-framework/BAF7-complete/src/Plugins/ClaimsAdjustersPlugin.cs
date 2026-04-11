using Microsoft.Agents.Builder;
using Microsoft.Agents.Core.Models;
using System.ComponentModel;
using System.Text.Json;
using InsuranceAgent;
using Microsoft.Agents.Builder.State;
using ModelContextProtocol.Client;

namespace ZavaInsurance.Plugins
{
    /// <summary>
    /// Claims Adjusters Plugin for Zava Insurance
    /// Provides tools for managing and retrieving claims adjuster information via MCP.
    /// </summary>
    public class ClaimsAdjustersPlugin
    {
        private readonly ITurnContext _turnContext;
        private readonly McpClient _mcpClient;
        private readonly IConfiguration _configuration;

        public ClaimsAdjustersPlugin(ITurnContext turnContext,
            McpClient mcpClient, 
            IConfiguration configuration)
        {
            _turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
            _mcpClient = mcpClient ?? throw new ArgumentNullException(nameof(mcpClient));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Retrieves claims adjusters based on claim type and country.
        /// </summary>
        /// <param name="claimType">The claim type to filter claims adjusters (Auto or Homeowners)</param>
        /// <param name="country">The country to filter claims adjusters</param>
        /// <returns>A list of claims adjusters matching the criteria</returns>
        [Description("Retrieves claims adjusters based on area and country")]
        public async Task<string> ListClaimsAdjustersAsync(string claimType, string country)
        {
            await NotifyUserAsync($"Retrieving claims adjusters for area {claimType} and country {country}...");

            // Validate claim type - only "Auto" and "Homeowners" are supported
            if (claimType != "Auto" && claimType != "Homeowners")
            {
                claimType = null;
            }

            // Validate country
            if (country == "All")
            {
                country = null;
            }

            var result = await _mcpClient.CallToolAsync("get_claims_adjusters", 
                new Dictionary<string, object?> {                 
                    ["area"] = claimType, 
                    ["country"] = country
                }
            );

            if (!result.IsError.HasValue || result.IsError.HasValue && !result.IsError.Value)
            {
                var adjusters = result.Content;
                return JsonSerializer.Serialize(adjusters, new JsonSerializerOptions { WriteIndented = true });
            }
            else
            {
                return $"Error retrieving claims adjusters!";
            }
        }

        /// <summary>
        /// Assigns a claims adjuster to a specific claim.
        /// </summary>
        /// <param name="claimId">The ID of the claim</param>
        /// <param name="adjusterId">The ID of the claims adjuster</param>
        /// <returns>Confirmation message of assignment</returns>
        [Description("Assigns a claims adjuster to a specific claim")]
        public async Task<string> AssignClaimAdjusterAsync(string claimId, string adjusterId)
        {
            await NotifyUserAsync($"Assigning claims adjuster {adjusterId} to claim {claimId}...");

            var result = await _mcpClient.CallToolAsync("assign_claim_adjuster", 
                new Dictionary<string, object?> {                 
                    ["claimId"] = claimId, 
                    ["adjusterId"] = adjusterId
                }
            );

            if (!result.IsError.HasValue || result.IsError.HasValue && !result.IsError.Value)
            {
                var adjusters = result.Content;
                return JsonSerializer.Serialize(adjusters, new JsonSerializerOptions { WriteIndented = true });
            }
            else
            {
                return $"Error assigning claims adjuster!";
            }
        }

        private async Task NotifyUserAsync(string message)
        {
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