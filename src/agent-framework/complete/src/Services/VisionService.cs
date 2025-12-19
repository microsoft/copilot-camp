using Azure;
using Azure.AI.OpenAI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.ClientModel;
using System.Text.Json;
using OpenAI.Chat;

namespace InsuranceAgent.Services;

/// <summary>
/// Service for analyzing images using Mistral AI model capabilities
/// </summary>
public class VisionService
{
    private readonly ChatClient _chatClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<VisionService> _logger;

    public VisionService(
        IConfiguration configuration,
        ILogger<VisionService> logger)
    {
        _configuration = configuration;
        _logger = logger;

        // Use shared endpoint and API key, but different model for vision analysis
        var endpoint = configuration["AIModels:Endpoint"]
            ?? throw new InvalidOperationException("AIModels:Endpoint not configured");
        var apiKey = configuration["AIModels:ApiKey"]
            ?? throw new InvalidOperationException("AIModels:ApiKey not configured");
        var deployment = configuration["AIModels:VisionModel:Name"] 
            ?? throw new InvalidOperationException("AIModels:VisionModel:Name not configured");

        _logger.LogInformation("🔍 VisionService Configuration:");
        _logger.LogInformation("   Endpoint: {Endpoint}", endpoint);
        _logger.LogInformation("   Deployment: {DeploymentName}", deployment);

        var azureClient = new AzureOpenAIClient(new Uri(endpoint), new AzureKeyCredential(apiKey));
        _chatClient = azureClient.GetChatClient(deployment);
    }

    /// <summary>
    /// Analyzes an insurance claim damage photo using Mistral AI model
    /// </summary>
    /// <param name="imageBytes">The image file bytes</param>
    /// <param name="fileName">The image file name</param>
    /// <returns>Detailed damage analysis</returns>
    public async Task<DamageAnalysisResult> AnalyzeDamagePhotoAsync(byte[] imageBytes, string fileName)
    {
        try
        {
            _logger.LogInformation("Starting vision analysis for {FileName} ({Size} bytes)", fileName, imageBytes.Length);

            // Create the vision analysis prompt
            var prompt = @"You are an expert insurance claims adjuster analyzing damage photos. 

Analyze this image and provide a detailed assessment in the following JSON format:

{
  ""damageType"": ""<type of damage: water, fire, storm, hail, flood, etc.>"",
  ""severity"": ""<Low, Medium, High, or Critical>"",
  ""detailedDescription"": ""<detailed description of what you see in the image>"",
  ""affectedAreas"": [""<list of affected areas/structures as array>""],
  ""estimatedRepairCost"": <numeric estimate in dollars>,
  ""safetyConcerns"": ""<any immediate safety concerns>"",
  ""repairRecommendations"": ""<recommended repair actions>"",
  ""urgency"": ""<Immediate, Within 1 week, Within 1 month, Non-urgent>"",
  ""requiresSpecialist"": <true/false>,
  ""specialistType"": ""<type of specialist needed, if any>""
}

Be specific, professional, and focus on details that would help with claims processing.";

            // Create chat completion request with image
            var messages = new List<ChatMessage>
            {
                new UserChatMessage(
                    ChatMessageContentPart.CreateTextPart(prompt),
                    ChatMessageContentPart.CreateImagePart(BinaryData.FromBytes(imageBytes), GetMimeType(fileName))
                )
            };

            var chatOptions = new ChatCompletionOptions
            {
                Temperature = 0.3f, // Lower temperature for more consistent analysis
                ResponseFormat = ChatResponseFormat.CreateJsonObjectFormat()
            };

            // Call Mistral AI model for vision analysis
            var response = await _chatClient.CompleteChatAsync(messages, chatOptions);

            var analysisJson = response.Value.Content[0].Text ?? "{}";
            _logger.LogInformation("Vision analysis completed for {FileName}", fileName);
            _logger.LogDebug("Analysis result: {Analysis}", analysisJson);

            // Parse the JSON response
            var result = JsonSerializer.Deserialize<DamageAnalysisResult>(analysisJson, new JsonSerializerOptions 
            { 
                PropertyNameCaseInsensitive = true 
            });
            
            if (result == null)
            {
                _logger.LogWarning("Failed to parse vision analysis result for {FileName}", fileName);
                return CreateFallbackResult(fileName);
            }

            result.AnalyzedAt = DateTime.UtcNow;
            result.FileName = fileName;

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing image {FileName}", fileName);
            return CreateFallbackResult(fileName);
        }
    }

    /// <summary>
    /// Batch analyze multiple images for a claim
    /// </summary>
    public async Task<List<DamageAnalysisResult>> AnalyzeMultipleImagesAsync(
        List<(byte[] bytes, string fileName)> images)
    {
        var results = new List<DamageAnalysisResult>();

        foreach (var (bytes, fileName) in images)
        {
            var result = await AnalyzeDamagePhotoAsync(bytes, fileName);
            results.Add(result);
            
            // Small delay to avoid rate limiting
            await Task.Delay(500);
        }

        return results;
    }

    /// <summary>
    /// Extract text from a document image (OCR)
    /// </summary>
    public async Task<string> ExtractTextFromImageAsync(byte[] imageBytes, string fileName)
    {
        try
        {
            _logger.LogInformation("Extracting text from {FileName}", fileName);

            var prompt = "Extract all visible text from this image. Provide only the extracted text without any additional commentary.";

            var messages = new List<ChatMessage>
            {
                new UserChatMessage(
                    ChatMessageContentPart.CreateTextPart(prompt),
                    ChatMessageContentPart.CreateImagePart(BinaryData.FromBytes(imageBytes), GetMimeType(fileName))
                )
            };

            var chatOptions = new ChatCompletionOptions
            {
                Temperature = 0.1f
            };

            var response = await _chatClient.CompleteChatAsync(messages, chatOptions);
            var extractedText = response.Value.Content[0].Text ?? "";
            
            _logger.LogInformation("Text extraction completed for {FileName}. Extracted {Length} characters", 
                fileName, extractedText.Length);

            return extractedText;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error extracting text from {FileName}", fileName);
            return "";
        }
    }

    private string GetMimeType(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            _ => "image/jpeg"
        };
    }

    private DamageAnalysisResult CreateFallbackResult(string fileName)
    {
        return new DamageAnalysisResult
        {
            FileName = fileName,
            DamageType = "Unknown",
            Severity = "Medium",
            DetailedDescription = "Unable to analyze image automatically. Manual review required.",
            AffectedAreas = new[] { "Unknown" },
            EstimatedRepairCost = 0,
            SafetyConcerns = "Please review manually",
            RepairRecommendations = "Manual assessment required",
            Urgency = "Within 1 week",
            RequiresSpecialist = true,
            SpecialistType = "Insurance Adjuster",
            AnalyzedAt = DateTime.UtcNow
        };
    }
}

/// <summary>
/// Result of damage analysis using Mistral AI model
/// </summary>
public class DamageAnalysisResult
{
    public string FileName { get; set; } = "";
    public string DamageType { get; set; } = "";
    public string Severity { get; set; } = "";
    public string DetailedDescription { get; set; } = "";
    public string[] AffectedAreas { get; set; } = Array.Empty<string>();
    public double EstimatedRepairCost { get; set; }
    public string SafetyConcerns { get; set; } = "";
    public string RepairRecommendations { get; set; } = "";
    public string Urgency { get; set; } = "";
    public bool RequiresSpecialist { get; set; }
    public string SpecialistType { get; set; } = "";
    public DateTime AnalyzedAt { get; set; }
}
