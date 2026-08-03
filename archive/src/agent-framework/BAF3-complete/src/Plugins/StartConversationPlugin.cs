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
                "I'm your AI-powered insurance claims specialist. I help adjusters and investigators streamline the claims process.\n\n" +
                "**What I can do:**\n\n" +
                "- Search and retrieve detailed claim information\n" +
                "- Use Mistral AI to analyze damage photos instantly\n" +
                "- Provide damage assessments with cost estimates\n" +
                "- Identify safety concerns from photos\n" +
                "- Provide current date and time\n\n" +
                "🎯 Try this workflow:\n" +
                "1. \"Get details for claim CLM-2025-001007\"\n" +
                "2. \"Show damage photo for this claim\"\n" +
                "3. \"Analyze this damage photo\"\n" +
                "4. \"Approve the analysis\" or \"Reject the analysis\"\n\n" +
                "Ready to help with your claims investigation. What would you like to start with?";

            return welcomeMessage;
        }
    }
}
