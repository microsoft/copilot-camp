using InsuranceAgent;
using InsuranceAgent.Plugins;
using Microsoft.Agents.AI;
using Microsoft.Agents.Builder;
using Microsoft.Agents.Builder.App;
using Microsoft.Agents.Builder.State;
using Microsoft.Agents.Core;
using Microsoft.Agents.Core.Models;
using Microsoft.Agents.Core.Serialization;
using Microsoft.Extensions.AI;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using ZavaInsurance.Plugins;

namespace ZavaInsurance.Agent
{
    /// <summary>
    /// Zava Insurance Claims Agent - Stage 1: Quick Wins with Microsoft 365 Copilot
    /// 
    /// This agent demonstrates how Zava Insurance can leverage intelligent agents 
    /// to streamline claims processing, reduce manual work, and improve customer satisfaction.
    /// 
    /// Scenario: From claims chaos to an agent-powered operations fabric
    /// - Reduces context switching between Outlook, Teams, SharePoint, and claims systems
    /// - Centralizes access to field photos, invoices, and inspection notes
    /// - Provides real-time visibility into bottlenecks and fraud indicators
    /// </summary>
    public class ZavaInsuranceAgent : AgentApplication
    {
        private readonly string AgentInstructions = """
        You are a professional insurance claims assistant for Zava Insurance.

        Whenever the user starts a new conversation or provides a prompt to start a new conversation like "start over", "restart", 
        "new conversation", "what can you do?", "how can you help me?", etc. use {{StartConversationPlugin.StartConversation}} and 
        provide to the user exactly the message you get back from the plugin.

        **Available Tools:**
        Use {{DateTimeFunctionTool.getDate}} to get the current date and time.

        Stick to the scenario above and use only the information from the tools when answering questions.
        Be concise and professional in your responses.
        """;

        private readonly HttpClient _httpClient = null;
        private readonly IChatClient? _chatClient = null;
        private readonly IConfiguration? _configuration = null;
        private readonly IServiceProvider _serviceProvider;

        public ZavaInsuranceAgent(AgentApplicationOptions options, IChatClient chatClient, IConfiguration configuration, IServiceProvider serviceProvider, IHttpClientFactory httpClientFactory) : base(options)
        {
            _chatClient = chatClient;
            _configuration = configuration;
            _serviceProvider = serviceProvider;
            _httpClient = httpClientFactory.CreateClient() ?? throw new ArgumentNullException(nameof(httpClientFactory));

            // Greet when members are added to the conversation
            OnConversationUpdate(ConversationUpdateEvents.MembersAdded, WelcomeMessageAsync);

            // Listen for ANY message to be received. MUST BE AFTER ANY OTHER MESSAGE HANDLERS
            OnActivity(ActivityTypes.Message, OnMessageAsync);
        }

        protected async Task WelcomeMessageAsync(ITurnContext turnContext, ITurnState turnState, CancellationToken cancellationToken)
        {
            var startConversation = new StartConversationPlugin();
            var welcomeMessage = await startConversation.StartConversation();

            foreach (ChannelAccount member in turnContext.Activity.MembersAdded)
            {
                if (member.Id != turnContext.Activity.Recipient.Id)
                {
                    await turnContext.StreamingResponse.QueueInformativeUpdateAsync(welcomeMessage, cancellationToken);
                }
            }
        }

        protected async Task OnMessageAsync(ITurnContext turnContext, ITurnState turnState, CancellationToken cancellationToken)
        {
            // Start a Streaming Process to let clients that support streaming know that we are processing the request. 
            await turnContext.StreamingResponse.QueueInformativeUpdateAsync("Processing your request...", cancellationToken).ConfigureAwait(false);

            try
            {
                var userText = turnContext.Activity.Text?.Trim() ?? string.Empty;
                var _agent = GetClientAgent(turnContext, turnState);

                // Read or Create the conversation thread for this conversation.
                AgentThread? thread = GetConversationThread(_agent, turnState);

                // Stream the response back to the user as we receive it from the agent.
                await foreach (var response in _agent.RunStreamingAsync(userText, thread, cancellationToken: cancellationToken))
                {
                    // Log out tool calls for monitoring and compliance
                    if (response.Role == ChatRole.Tool)
                    {
                        System.Diagnostics.Trace.WriteLine($"Tool called with response: {response.Text}");
                    }

                    if (response.Role == ChatRole.Assistant && !string.IsNullOrEmpty(response.Text))
                    {
                        turnContext.StreamingResponse.QueueTextChunk(response.Text);
                    }
                }

                // Save the updated thread state back to the conversation state.
                turnState.Conversation.SetValue("conversation.threadInfo", ProtocolJsonSerializer.ToJson(thread.Serialize()));
            }
            finally
            {
                await turnContext.StreamingResponse.EndStreamAsync(cancellationToken).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Resolve the ChatClientAgent with tools and options for this turn operation. 
        /// This will use the IChatClient registered in DI.
        /// </summary>
        private ChatClientAgent GetClientAgent(ITurnContext context, ITurnState turnState)
        {
            AssertionHelpers.ThrowIfNull(_configuration!, nameof(_configuration));
            AssertionHelpers.ThrowIfNull(context, nameof(context));
            AssertionHelpers.ThrowIfNull(_chatClient!, nameof(_chatClient));

            // Setup the plugins with access to the Agent SDK current context and services
            StartConversationPlugin startConversationPlugin = new();

            // Setup the tools for the agent using Agent Framework
            var toolOptions = new ChatOptions
            {
                Temperature = (float?)1,
                Tools = new List<AITool>()
            };

            // Add Start Conversation tool
            toolOptions.Tools.Add(AIFunctionFactory.Create(startConversationPlugin.StartConversation));

            // Add DateTime tool
            toolOptions.Tools.Add(AIFunctionFactory.Create(DateTimeFunctionTool.getDate));

            // Create the chat Client passing in agent instructions and tools
            return new ChatClientAgent(_chatClient!,
                    new ChatClientAgentOptions
                    {
                        Name = "Zava Insurance Claims Agent",
                        Instructions = AgentInstructions,
                        ChatOptions = toolOptions,
                        ChatMessageStoreFactory = ctx =>
                        {
#pragma warning disable MEAI001 // MessageCountingChatReducer is for evaluation purposes only and is subject to change or removal in future updates
                            return new InMemoryChatMessageStore(new MessageCountingChatReducer(15), ctx.SerializedState, ctx.JsonSerializerOptions);
#pragma warning restore MEAI001 // MessageCountingChatReducer is for evaluation purposes only and is subject to change or removal in future updates
                        }
                    });
        }

        /// <summary>
        /// Manage Agent threads against the conversation state.
        /// </summary>
        private AgentThread GetConversationThread(ChatClientAgent agent, ITurnState turnState)
        {
            AgentThread thread;
            string? agentThreadInfo = turnState.Conversation.GetValue<string?>("conversation.threadInfo", () => null);
            if (string.IsNullOrEmpty(agentThreadInfo))
            {
                thread = agent.GetNewThread();
            }
            else
            {
                JsonElement ele = ProtocolJsonSerializer.ToObject<JsonElement>(agentThreadInfo);
                thread = agent.DeserializeThread(ele);
            }
            return thread;
        }

        [Route(RouteType = RouteType.Message, Type = ActivityTypes.Message, Text = "-reset")]
        protected async Task Reset(ITurnContext turnContext, ITurnState turnState, CancellationToken cancellationToken)
        {
            await UserAuthorization.SignOutUserAsync(turnContext, turnState, "me", cancellationToken: cancellationToken);
            turnState.Conversation.ClearConversationHistory();
            turnState.Conversation.ClearCachedUserProfile();
            await turnContext.StreamingResponse.QueueInformativeUpdateAsync("Reset complete", cancellationToken: cancellationToken);
        }

        private async Task<UserProfile> GetUserProfile(string accessToken, CancellationToken cancellationToken)
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            HttpResponseMessage response = await _httpClient.GetAsync("https://graph.microsoft.com/v1.0/me?$select=department,jobTitle,preferredLanguage,displayName,givenName,companyName,userPrincipalName,id,mail", cancellationToken);
            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            return JsonSerializer.Deserialize<UserProfile>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            })!;
        }
    }
}
