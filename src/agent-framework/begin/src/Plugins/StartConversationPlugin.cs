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
                                "I'm an AI assistant currently in development. Right now, I'm learning to help with insurance claims processing.\n\n" +
                                "🔍 **What I can do:**\n" +
                                "* Answer general questions using AI\n" +
                                "* Provide current date and time information\n" +
                                "* Have conversations about insurance concepts\n\n" +
                                "💬 **Try asking me:**\n" +
                                "* \"What's today's date?\"\n" +
                                "* \"Tell me about insurance claims\"\n" +
                                "* \"Explain how claims processing works\"\n\n" +
                                "How can I help you today?";

            return welcomeMessage;
        }
    }
}
