using Microsoft.Agents.Builder;
using Microsoft.Agents.Core;
using Microsoft.Agents.Core.Models;
using System.ComponentModel;
using System.Text;
using System.Text.Json;
using InsuranceAgent.Services.Models;
using Azure;
using Azure.AI.OpenAI;
using Microsoft.Extensions.Configuration;
using OpenAI.Chat;
using InsuranceAgent;
using Microsoft.Agents.Connector;
using Microsoft.Agents.Builder.State;

namespace ZavaInsurance.Plugins
{
    /// <summary>
    /// Start Conversation Plugin for Zava Insurance
    /// Provides tools for initiating and managing conversations with users
    /// </summary>
    public class StartConversationPlugin
    {
        public StartConversationPlugin()
        {
        }

        /// <summary>
        /// Starts a new conversation suggesting a conversation flow
        /// </summary>
        /// <returns>A welcome message</returns>
        [Description("Starts a new conversation suggesting a conversation flow.")]
        public async Task<string> StartConversation()
        {
            var welcomeMessage = "👋 Welcome to Zava Insurance Claims Assistant!\n\n" +
                                "I'm your AI-powered insurance claims specialist. I help adjusters and investigators streamline the entire claims process - from initial assessment to final approval.\n\n" +
                                "**What I can do:**\n\n" +
                                "- Analyze claims for fraud indicators and risk patterns\n" +
                                "- Validate policy coverage and check expiration dates\n" +
                                "- Search policy documentation and claims procedures\n" +
                                "- Use Mistral AI to analyze damage photos instantly\n" +
                                "- Generate investigation reports\n" +
                                "- Track claim timelines and identify processing bottlenecks\n\n" +
                                "🎯 Try this complete investigation workflow:\n" +
                                "1. \"Get details for claim CLM-2025-001007\"\n" +
                                "2. \"Check policy for this claim\"\n" +
                                "3. \"What coverage does auto insurance include?\"\n" +
                                "4. \"Analyze fraud risk for this claim\"\n" +
                                "5. \"Show damage photo for this claim\"\n" +
                                "6. \"Analyze this damage photo\"\n" +
                                "7. \"What's the claims filing procedure?\"\n" +
                                "8. \"Check compliance for this claim\"\n" +
                                "9. \"Generate investigation report for claim CLM-2025-001007\"\n" +
                                "10. \"Update claim status to 'Approved for Payment'\"\n\n" +
                                "Ready to complete a full claims investigation? What would you like to start with?";

            return welcomeMessage;
        }
    }
}
