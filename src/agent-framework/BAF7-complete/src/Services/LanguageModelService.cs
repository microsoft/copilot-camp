using Azure;
using Azure.AI.OpenAI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OpenAI.Chat;

namespace InsuranceAgent.Services;

/// <summary>
/// Service for language model operations using gpt-4o-mini
/// Provides centralized access to language understanding and text generation capabilities
/// </summary>
public class LanguageModelService
{
    private readonly ChatClient _chatClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<LanguageModelService> _logger;

    public LanguageModelService(
        IConfiguration configuration,
        ILogger<LanguageModelService> logger)
    {
        _configuration = configuration;
        _logger = logger;

        // Use shared endpoint and API key with language model for general understanding
        var endpoint = configuration["AIModels:Endpoint"]
            ?? throw new InvalidOperationException("AIModels:Endpoint not configured");
        var apiKey = configuration["AIModels:ApiKey"]
            ?? throw new InvalidOperationException("AIModels:ApiKey not configured");
        var deployment = configuration["LANGUAGE_MODEL_NAME"] 
            ?? throw new InvalidOperationException("LANGUAGE_MODEL_NAME not configured");

        _logger.LogInformation("🔍 LanguageModelService Configuration:");
        _logger.LogInformation("   Endpoint: {Endpoint}", endpoint);
        _logger.LogInformation("   Deployment: {DeploymentName}", deployment);

        var azureClient = new AzureOpenAIClient(new Uri(endpoint), new AzureKeyCredential(apiKey));
        _chatClient = azureClient.GetChatClient(deployment);
    }

    /// <summary>
    /// Completes a chat request with the language model
    /// </summary>
    /// <param name="messages">The chat messages</param>
    /// <param name="options">Optional chat completion options</param>
    /// <returns>Chat completion response</returns>
    public async Task<ChatCompletion> CompleteChatAsync(
        IEnumerable<ChatMessage> messages, 
        ChatCompletionOptions? options = null)
    {
        try
        {
            _logger.LogDebug("Sending chat completion request with {MessageCount} messages", messages.Count());

            var response = await _chatClient.CompleteChatAsync(messages, options);

            _logger.LogDebug("Received chat completion response");

            return response.Value;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error completing chat request");
            throw;
        }
    }

    /// <summary>
    /// Gets the underlying ChatClient for advanced scenarios
    /// </summary>
    public ChatClient ChatClient => _chatClient;
}