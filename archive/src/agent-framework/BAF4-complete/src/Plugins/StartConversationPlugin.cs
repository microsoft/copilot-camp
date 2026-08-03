using Microsoft.Agents.Builder;
using Microsoft.Agents.Core;
using Microsoft.Agents.Core.Models;
using System.ComponentModel;
using System.Text;
using System.Text.Json;
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
                                "- Search and retrieve detailed claim information\n" +
                                "- Validate policy coverage and check expiration dates\n" +
                                "- Use Mistral AI to analyze damage photos instantly\n" +
                                "- Provide damage assessments with cost estimates\n" +
                                "- Track claim timelines and identify processing bottlenecks\n\n" +
                                "🎯 Try this complete workflow:\n" +
                                "1. \"Get details for claim CLM-2025-001007\"\n" +
                                "2. \"Check policy for this claim\"\n" +
                                "3. \"Show damage photo for this claim\"\n" +
                                "4. \"Analyze this damage photo\"\n" +
                                "5. \"Approve the analysis\" or \"Reject the analysis\"\n\n" +
                                "Ready to complete a full claims investigation? What would you like to start with?";

            return welcomeMessage;
        }
    }
}
