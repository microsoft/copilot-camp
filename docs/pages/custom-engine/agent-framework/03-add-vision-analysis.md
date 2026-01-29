# Lab BAF3 - Add Vision Analysis with Mistral AI

In this lab, you'll add AI vision capabilities to analyze damage photos from insurance claims using the Mistral medium-2505 model. Your agent will be able to automatically assess vehicle damage, estimate repair costs, and identify safety concerns from photos.

???+ info "What You'll Learn"
    - How to integrate Mistral AI vision model for multimodal analysis
    - Processing image data from Azure Blob Storage
    - Implementing AI-powered damage assessment
    - Creating approval workflows for AI-generated analysis

<hr />

## Overview

In Lab BAF2, you added claim search using Azure AI Search Knowledgebases. Now you'll enhance your agent with multimodal AI vision capabilities to analyze damage photos and provide detailed assessment reports.

The Vision Service uses the **mistral-medium-2505** model deployed in Azure AI Services, which can analyze images and generate structured JSON responses with damage assessments.

## Exercise 1: Update Prerequisites

Before adding vision analysis, you need to deploy the Mistral vision model.

### Step 1: Deploy Mistral Vision Model in Microsoft Foundry

1️⃣ Sign in to [Microsoft Foundry](https://ai.azure.com).

2️⃣ Go to your project or create a new one.

3️⃣ Navigate to **Models + endpoints** → **Deploy model** → **Deploy base model**.

4️⃣ Search for **mistral-medium-2505** and deploy it:

- Model: `mistral-medium-2505`
- Deployment name: `mistral-medium-2505` (use exactly this name)
- Version: Latest available

5️⃣ Wait for the deployment to complete (~2-3 minutes).

6️⃣ Note your deployment details:

- The model uses the **same endpoint** as your gpt-4.1 deployment
- The model uses the **same API key** as your other models
- Only the **model name** changes to `mistral-medium-2505`

<cc-end-step lab="baf3" exercise="1" step="1" />

### Step 2: Create Azure Storage Account and Container

Create a storage account and container for damage photos.

1️⃣ Sign in to the [Azure Portal](https://portal.azure.com).

2️⃣ Create a new **Storage Account**:

- Search for "Storage accounts" in the top search bar
- Click **+ Create**
- Fill in the details:
    - **Subscription**: Select your subscription
    - **Resource group**: Use the same resource group as your other resources
    - **Storage account name**: Choose a unique name (e.g., `zavadamagestorage` + your initials)
    - **Region**: Same region as your AI services
    - **Performance**: Standard
    - **Redundancy**: Locally-redundant storage (LRS)

- Click **Review + Create**, then **Create**
- Wait for deployment to complete (~1-2 minutes)

3️⃣ Navigate to your new storage account and **enable anonymous access**:

- In the left menu, under **Settings**, select **Configuration**
- Find **Allow Blob anonymous access** and set it to **Enabled**
- Click **Save** at the top

???+ warning "Required for Public Access"
    Anonymous blob access must be enabled at the storage account level before you can configure public access on individual containers. Without this, the container public access settings won't work.

4️⃣ Select **Containers** from the left menu under **Data storage**.

5️⃣ Click **+ Container** at the top.

5️⃣ Configure the new container:

- **Name**: `claim-photos`
- **Public access level**: `Blob (anonymous read access for blobs only)`
- Click **Create**

6️⃣ Copy your storage account details for configuration:

- Go to **Access keys** in the left menu
- Copy the **Connection string** from key1 or key2
- Copy your **Storage account name**

???+ note "Why Blob Public Access?"
    Setting the container to "Blob" public access level allows:

    - Direct URL access to individual images for the AI vision model
    - Images can be displayed in the chat interface
    - No authentication needed for reading specific blob URLs

    Only individual blob URLs work - the container itself cannot be listed publicly, maintaining security.

<cc-end-step lab="baf3" exercise="1" step="2" />

### Step 3: Update Configuration

Add the vision model and blob storage configuration to your environment variables.

1️⃣ Open your `.env.local` file.

2️⃣ Add the vision model and blob storage configuration:

```bash
# Vision & Fraud analysis model (mistral-medium-2505)
VISION_MODEL_NAME=mistral-medium-2505

# Storage
AZURE_STORAGE_ACCOUNT_NAME=YOUR-STORAGE-ACCOUNT

# Blob Storage for Damage Photos
BLOB_STORAGE_CONTAINER_NAME=claim-photos
BLOB_STORAGE_BASE_URL=https://YOUR-STORAGE-ACCOUNT.blob.core.windows.net
```

3️⃣ Open your `.env.local.user` file.

4️⃣ Add the blob storage connection string:

```bash
# Storage
SECRET_AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=YOUR-STORAGE-ACCOUNT;AccountKey=YOUR-STORAGE-KEY;EndpointSuffix=core.windows.net
```

???+ note "Configuration Notes"
    - **SECRET_AZURE_STORAGE_CONNECTION_STRING**: Paste the connection string you copied from Azure Portal
    - **AZURE_STORAGE_ACCOUNT_NAME**: Your storage account name
    - **BLOB_STORAGE_CONTAINER_NAME**: Must be `claim-photos` (the container you just created)
    - **BLOB_STORAGE_BASE_URL**: Replace `YOUR-STORAGE-ACCOUNT` with your actual storage account name

<cc-end-step lab="baf3" exercise="1" step="3" />

## Exercise 2: Create Vision and Storage Services

Now let's create the services that handle AI vision analysis and blob storage for damage photos.

### Step 1: Create VisionService and BlobStorageService

??? note "What this code does"
    **VisionService**: Analyzes damage photos using Mistral AI vision model
    
    - Connects to Azure OpenAI with mistral-medium-2505 deployment
    - Takes image bytes and generates structured JSON damage analysis
    - Provides damage type, severity, cost estimates, safety concerns, repair recommendations
    - Includes fallback logic if analysis fails
    - Uses low temperature (0.3) for consistent, factual responses
    
    **BlobStorageService**: Manages damage photos in Azure Blob Storage

    - Uploads photos organized by claim number with timestamp naming
    - Downloads photos for AI analysis
    - Deletes photos when needed
    - Automatically detects MIME types (JPEG, PNG, GIF, BMP, WebP)
    - Configures public blob access for direct URL access
    
    This is the complete implementation - no additional methods will be added later.

1️⃣ Create a new file `src/Services/VisionService.cs` and add the complete implementation:

```csharp
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
```



2️⃣ Create a new file `src/Services/BlobStorageService.cs` and add the complete implementation:

```csharp
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Configuration;

namespace InsuranceAgent.Services;

/// <summary>
/// Service for uploading and managing damage photos in Azure Blob Storage
/// </summary>
public class BlobStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly string _containerName;
    private readonly string _baseUrl;

    public BlobStorageService(IConfiguration configuration)
    {
        var connectionString = configuration["SECRET_AZURE_STORAGE_CONNECTION_STRING"]
            ?? throw new InvalidOperationException("SECRET_AZURE_STORAGE_CONNECTION_STRING not configured");
        
        _containerName = configuration["BLOB_STORAGE_CONTAINER_NAME"] ?? "claim-photos";
        _baseUrl = configuration["BLOB_STORAGE_BASE_URL"] ?? "";
        
        _blobServiceClient = new BlobServiceClient(connectionString);
    }

    /// <summary>
    /// Uploads a damage photo and returns the public URL
    /// </summary>
    /// <param name="claimNumber">The claim number for organizing photos</param>
    /// <param name="imageBytes">The image file bytes</param>
    /// <param name="fileName">Original filename</param>
    /// <returns>Public URL to the uploaded blob</returns>
    public async Task<string> UploadDamagePhotoAsync(string claimNumber, byte[] imageBytes, string fileName)
    {
        // Ensure container exists
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

        // Generate unique blob name: {claimNumber}/{timestamp}_{filename}
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        var blobName = $"{claimNumber}/{timestamp}_{fileName}";
        
        var blobClient = containerClient.GetBlobClient(blobName);

        // Check if blob already exists
        if (await blobClient.ExistsAsync())
        {
            Console.WriteLine($"⏭️  Blob already exists: {blobName}");
            return blobClient.Uri.ToString();
        }

        // Set content type based on file extension
        var contentType = GetContentType(fileName);
        var blobHttpHeaders = new BlobHttpHeaders { ContentType = contentType };

        // Upload the image
        using var stream = new MemoryStream(imageBytes);
        await blobClient.UploadAsync(stream, new BlobUploadOptions
        {
            HttpHeaders = blobHttpHeaders
        });

        // Return public URL
        return blobClient.Uri.ToString();
    }

    /// <summary>
    /// Downloads a damage photo by URL
    /// </summary>
    public async Task<byte[]> DownloadPhotoAsync(string blobUrl)
    {
        var blobClient = new BlobClient(new Uri(blobUrl));
        var response = await blobClient.DownloadContentAsync();
        return response.Value.Content.ToArray();
    }

    /// <summary>
    /// Deletes a damage photo by URL
    /// </summary>
    public async Task<bool> DeletePhotoAsync(string blobUrl)
    {
        try
        {
            var blobClient = new BlobClient(new Uri(blobUrl));
            await blobClient.DeleteIfExistsAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }

    private string GetContentType(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".bmp" => "image/bmp",
            ".webp" => "image/webp",
            _ => "application/octet-stream"
        };
    }
}
```

<cc-end-step lab="baf3" exercise="2" step="1" />

## Exercise 3: Enhance KnowledgeBaseService with Vision Capabilities

Before creating the VisionPlugin, we need to add methods to KnowledgeBaseService that the plugin will use. This ensures all dependencies exist when we create the plugin.

### Step 1: Update KnowledgeBaseService Constructor

??? note "What's changing"
    The KnowledgeBaseService constructor now accepts an optional BlobStorageService parameter for uploading damage photos. The constructor was already simplified to only take IConfiguration in Lab BAF2 - now we're just adding the optional blob storage parameter.

1️⃣ Open `src/Services/KnowledgeBaseService.cs`.

2️⃣ Find `KnowledgeBaseService` constructor and replace it with the code block below that adds BlobStorageService field and update the constructor parameter:

```csharp
private readonly BlobStorageService? _blobStorageService;

public KnowledgeBaseService(IConfiguration configuration, BlobStorageService? blobStorageService = null)
{
    _configuration = configuration;
    
    _searchEndpoint = configuration["AZURE_AI_SEARCH_ENDPOINT"]
        ?? throw new InvalidOperationException("AZURE_AI_SEARCH_ENDPOINT not configured");
    _searchApiKey = configuration["SECRET_AZURE_AI_SEARCH_API_KEY"]
        ?? throw new InvalidOperationException("SECRET_AZURE_AI_SEARCH_API_KEY not configured");
    
    _aiEndpoint = configuration["MODELS_ENDPOINT"]
        ?? throw new InvalidOperationException("MODELS_ENDPOINT not configured");
    _aiApiKey = configuration["AIModels:ApiKey"]
        ?? throw new InvalidOperationException("AIModels:ApiKey not configured");
    _embeddingModel = configuration["EMBEDDING_MODEL_NAME"]
        ?? "text-embedding-ada-002";

    var credential = new AzureKeyCredential(_searchApiKey);
    _indexClient = new SearchIndexClient(new Uri(_searchEndpoint), credential);
    _retrievalClient = new KnowledgeBaseRetrievalClient(new Uri(_searchEndpoint), KnowledgeBaseName, credential);
    
    _openAIClient = new AzureOpenAIClient(new Uri(_aiEndpoint), new AzureKeyCredential(_aiApiKey));
    
    _blobStorageService = blobStorageService;
}
```

??? note "Constructor changes"
    The constructor now accepts an optional BlobStorageService parameter which will be used to upload damage photos to Azure Blob Storage during data indexing.

<cc-end-step lab="baf3" exercise="3" step="1" />

### Step 2: Add Vision-Related Methods

??? note "What this code does"
    **GetClaimImageUrlAsync**: Direct query to claims index for imageUrl field - more efficient than RetrieveAsync for simple field lookups. Returns nullable string.
    
    **UploadSampleDamagePhotosAsync**: Complete photo upload workflow:

    - Reads claims from JSON file
    - Matches images using policyholder name pattern (firstname-lastname-*.jpg)
    - Uploads to blob storage with claim number organization
    - Creates searchable documents in claim-documents-index
    - Updates claims index with imageUrl field
    - Runs automatically during first startup
    
    This ensures all 35 sample damage photos are uploaded and indexed immediately.

Add these two new methods to the `KnowledgeBaseService` class at the end, just before the closing brace:

**GetClaimImageUrlAsync Method** - Retrieves image URLs directly from the claims index:

```csharp
/// <summary>
/// Gets the damage photo URL for a specific claim
/// Checks both claims index and claim-documents index
/// </summary>
/// <param name="claimNumber">The claim number to retrieve the image for</param>
/// <returns>The image URL or null if not found</returns>
public async Task<string?> GetClaimImageUrlAsync(string claimNumber)
{
    // Check claims index for imageUrl (still stored there for direct access)
    var claimsClient = _indexClient.GetSearchClient(ClaimsIndex);
    
    var searchOptions = new SearchOptions
    {
        Filter = $"claimNumber eq '{claimNumber}'",
        Size = 1,
        Select = { "imageUrl" }
    };
    
    var searchResults = await claimsClient.SearchAsync<SearchDocument>("*", searchOptions);
    
    await foreach (var searchResult in searchResults.Value.GetResultsAsync())
    {
        var doc = searchResult.Document;
        if (doc.ContainsKey("imageUrl") && doc["imageUrl"] != null)
        {
            return doc["imageUrl"].ToString();
        }
    }
    
    return null;
}
```

??? note "Why not use RetrieveAsync?"
    This method directly queries the search index instead of using the Knowledge Base RetrieveAsync API. This is more efficient for simple field lookups where we just need the imageUrl value without LLM synthesis.

**UploadSampleDamagePhotosAsync Method** - Complete implementation for uploading damage photos from `infra/img/sample-images`:

```csharp
/// <summary>
/// Uploads sample damage photos to blob storage and indexes them in Azure AI Search
/// Reads claims from claims.json, matches images from infra/img/sample-images by policyholder name,
/// uploads to blob storage, creates searchable documents, and updates claims with imageUrl
/// </summary>
private async Task UploadSampleDamagePhotosAsync()
{
    if (_blobStorageService == null) return;

    Console.WriteLine("📸 Uploading sample damage photos to blob storage and indexing...");

    var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
    var dataPath = Path.Combine(baseDirectory, "infra", "data", "sample-data");
    var filePath = Path.Combine(dataPath, "claims.json");
    var imagesPath = Path.Combine(baseDirectory, "infra", "img", "sample-images");

    if (!File.Exists(filePath))
    {
        Console.WriteLine($"⚠️  Claims data file not found: {filePath}");
        return;
    }

    if (!Directory.Exists(imagesPath))
    {
        Console.WriteLine($"⚠️  Sample images directory not found: {imagesPath}");
        return;
    }

    var json = await File.ReadAllTextAsync(filePath);
    var claimsData = System.Text.Json.JsonSerializer.Deserialize<List<System.Text.Json.JsonElement>>(json);

    if (claimsData == null || !claimsData.Any())
    {
        Console.WriteLine("⚠️  No claims data to process");
        return;
    }

    var uploadCount = 0;
    var claimsClient = _indexClient.GetSearchClient(ClaimsIndex);
    var claimsToUpdate = new List<SearchDocument>();
    
    Console.WriteLine($"📋 Processing {claimsData.Count} total claims for damage photos...");
    Console.WriteLine($"📸 Uploading to blob storage...");

    foreach (var claimData in claimsData)
    {
        var claimNumber = claimData.GetProperty("claimNumber").GetString() ?? "";
        var policyholderName = claimData.GetProperty("policyholderName").GetString() ?? "";
        
        // Build the expected image filename based on policyholder name
        // Format: firstname-lastname-description.jpg (e.g., "ajlal-nueimat-deer-collision.jpg")
        var nameKey = policyholderName.ToLower().Replace(" ", "-");
        
        // Find matching image file in sample-images directory
        var imageFiles = Directory.GetFiles(imagesPath, $"{nameKey}*.jpg");
        
        if (imageFiles.Length == 0)
        {
            Console.WriteLine($"⏭️  No image found for {claimNumber} ({policyholderName})");
            continue;
        }
        
        var imageFile = imageFiles[0];
        var fileName = Path.GetFileName(imageFile);
        
        Console.WriteLine($"📸 Processing damage photo for claim {claimNumber}: {fileName}");
        
        try
        {
            // Read image from local file
            var imageBytes = await File.ReadAllBytesAsync(imageFile);
            
            // Upload to blob storage - blob URL will be directly accessible for viewing and AI analysis
            var blobUrl = await _blobStorageService.UploadDamagePhotoAsync(claimNumber, imageBytes, fileName);
            
            // Update the claim record with the image URL for direct access
            claimsToUpdate.Add(new SearchDocument
            {
                ["id"] = claimNumber,
                ["imageUrl"] = blobUrl
            });
            
            uploadCount++;
            Console.WriteLine($"✅ Uploaded photo for {claimNumber}: {blobUrl}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️  Failed to upload photo for {claimNumber}: {ex.Message}");
        }
    }
    
    // Update claims with image URLs
    if (claimsToUpdate.Any())
    {
        Console.WriteLine($"📝 Updating {claimsToUpdate.Count} claims with image URLs...");
        var claimsBatch = IndexDocumentsBatch.MergeOrUpload(claimsToUpdate);
        await claimsClient.IndexDocumentsAsync(claimsBatch);
        Console.WriteLine($"✅ Updated {claimsToUpdate.Count} claims with image URLs");
    }
    
    if (uploadCount > 0)
    {
        Console.WriteLine($"📸 Total: Uploaded {uploadCount} damage photos to blob storage");
    }
    else
    {
        Console.WriteLine("⚠️  No damage photos found to upload");
    }
}
```

??? note "What this code does"
    The `UploadSampleDamagePhotosAsync` method provides complete photo upload functionality:
    
    - **Reads claims data**: Loads all claims from `infra/data/sample-data/claims.json`
    - **Matches images**: Finds corresponding images in `infra/img/sample-images` using policyholder name pattern (firstname-lastname-description.jpg)
    - **Uploads to blob storage**: Uses BlobStorageService to upload each image to Azure Blob Storage with claim number organization
    - **Updates claims**: Merges imageUrl field into existing claim records in `claims-index` for direct access
    - **Automatic execution**: Runs during first app startup when IndexSampleDataAsync is called
    
    This simplified approach:

    - ✅ Uploads images to Azure Blob Storage for persistent storage
    - ✅ Updates claims index with imageUrl field pointing to blob URLs
    - ✅ No separate document index needed - claims contain image URLs directly
    - ✅ Images are immediately available for AI vision analysis
    
    This ensures all sample damage photos are automatically uploaded and linked to claims, making them immediately available for vision analysis.

<cc-end-step lab="baf3" exercise="3" step="2" />

### Step 3: Update IndexSampleDataAsync Method

Find the `IndexSampleDataAsync` method and update the method with the below code for adding the photo upload call:

```csharp
public async Task IndexSampleDataAsync()
{
    await IndexClaimsDataAsync();
    
    // Upload damage photos to blob storage if BlobStorageService is available
    if (_blobStorageService != null)
    {
        await UploadSampleDamagePhotosAsync();
    }
    
    Console.WriteLine("✅ Sample data indexed successfully");
}
```

<cc-end-step lab="baf3" exercise="3" step="3" />

## Exercise 4: Create the Vision Plugin

Now that KnowledgeBaseService has all the necessary methods, let's create the VisionPlugin that uses them.

### Step 1: Create Complete VisionPlugin

??? note "What this code does"
    The `VisionPlugin` provides complete AI vision analysis capabilities:
    
    - **ShowDamagePhoto**: Retrieves and displays damage photos from claims without analysis - proxies images through devtunnel for inline display in chat
    - **AnalyzeAndShowDamagePhoto**: Downloads photo, uses Mistral AI to analyze damage, extracts structured results (damage type, severity, cost, affected areas, safety concerns, recommendations, specialist needs), presents formatted analysis to user
    - **ApproveAnalysis/RejectAnalysis**: Approval workflow methods that handle user feedback on AI analysis - in production would update claim database and trigger workflows
    - **NotifyUserAsync**: Helper for real-time streaming updates during long operations
    
    Each method has `[Description]` attribute so the AI agent knows when to call them based on user intent.

1️⃣ Create a new file `src/Plugins/VisionPlugin.cs` and add the complete implementation:

```csharp
using Microsoft.Agents.Builder;
using Microsoft.Agents.Core;
using Microsoft.Agents.Core.Models;
using System.ComponentModel;
using InsuranceAgent.Services;
using Microsoft.Extensions.Configuration;

namespace ZavaInsurance.Plugins
{
    /// <summary>
    /// Vision Plugin for Zava Insurance
    /// Uses AI vision models to analyze damage photos from insurance claims
    /// Provides damage assessment, severity analysis, and repair cost estimates
    /// </summary>
    public class VisionPlugin
    {
        private readonly ITurnContext _turnContext;
        private readonly KnowledgeBaseService _knowledgeBaseService;
        private readonly VisionService _visionService;
        private readonly BlobStorageService _blobStorageService;
        private readonly IConfiguration _configuration;

        public VisionPlugin(
            ITurnContext turnContext, 
            KnowledgeBaseService knowledgeBaseService, 
            VisionService visionService, 
            BlobStorageService blobStorageService, 
            IConfiguration configuration)
        {
            _turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
            _knowledgeBaseService = knowledgeBaseService ?? throw new ArgumentNullException(nameof(knowledgeBaseService));
            _visionService = visionService ?? throw new ArgumentNullException(nameof(visionService));
            _blobStorageService = blobStorageService ?? throw new ArgumentNullException(nameof(blobStorageService));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Finds and shows the first damage photo for a claim (without analyzing)
        /// Proxies image through devtunnel for inline display in chat
        /// </summary>
        [Description("Finds and shows the first damage photo for a claim. Use this when user wants to see/view the damage photo. Does not perform AI analysis.")]
        public async Task<string> ShowDamagePhoto(string claimNumber)
        {
            await NotifyUserAsync($"🔍 Searching for damage photos in claim {claimNumber}...");

            try
            {
                // Search for the claim with image URL
                var imageUrl = await _knowledgeBaseService.GetClaimImageUrlAsync(claimNumber);
                
                if (string.IsNullOrEmpty(imageUrl))
                {
                    return $"❌ No damage photo found for claim {claimNumber}.\n\n" +
                           $"_The claim may not have an uploaded damage photo yet._";
                }

                // Get bot endpoint for devtunnel proxy (required for image display in M365 Copilot)
                var botEndpoint = _configuration["BOT_ENDPOINT"];
                if (string.IsNullOrEmpty(botEndpoint))
                {
                    var botDomain = _configuration["BOT_DOMAIN"];
                    botEndpoint = !string.IsNullOrEmpty(botDomain) ? $"https://{botDomain}" : "http://localhost:3978";
                }
                botEndpoint = botEndpoint.TrimEnd('/');
                
                // Proxy the blob storage URL through devtunnel for inline display
                var proxyUrl = $"{botEndpoint}/api/image?url={Uri.EscapeDataString(imageUrl)}";
                
                // Return the image with Markdown syntax for inline display
                return $"📸 **Damage Photo for Claim {claimNumber}**\n\n" +
                       $"![Damage Photo]({proxyUrl})\n\n" +
                       $"_Image stored in Azure Blob Storage_";
            }
            catch (Exception ex)
            {
                return $"❌ Error retrieving damage photo: {ex.Message}";
            }
        }

        /// <summary>
        /// Analyzes a damage photo using Mistral AI vision model and presents results
        /// Downloads image, calls VisionService, formats structured analysis
        /// </summary>
        [Description("Analyzes a damage photo using Mistral AI model and requests user approval before updating the system.")]
        public async Task<string> AnalyzeAndShowDamagePhoto(string claimNumber, string documentId)
        {
            await NotifyUserAsync($"🤖 Starting AI Vision Analysis for claim {claimNumber}...");
            
            try
            {
                // Get the image URL for this claim from knowledge base
                var imageUrl = await _knowledgeBaseService.GetClaimImageUrlAsync(claimNumber);
                
                if (string.IsNullOrEmpty(imageUrl))
                {
                    return $"❌ No damage photo found for claim {claimNumber}.\n\n" +
                           $"Please ensure a damage photo has been uploaded first.";
                }
                
                await NotifyUserAsync($"📸 Downloading image from blob storage...");
                
                // Download the image bytes from blob storage
                using var httpClient = new HttpClient();
                var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
                var fileName = Path.GetFileName(new Uri(imageUrl).LocalPath);
                
                await NotifyUserAsync($"🤖 Analyzing damage with Mistral AI Vision...");
                
                // Analyze the image using Vision AI (Mistral model)
                var analysisResult = await _visionService.AnalyzeDamagePhotoAsync(imageBytes, fileName);
                
                await NotifyUserAsync($"✅ Analysis complete!");
                
                // Format the structured analysis results for user
                var response = $"🔍 **AI Vision Analysis Results**\n\n";
                response += $"**Claim:** {claimNumber}\n";
                response += $"**Image:** {imageUrl}\n\n";
                response += $"**Analysis:**\n";
                response += $"- **Damage Type:** {analysisResult.DamageType}\n";
                response += $"- **Severity:** {analysisResult.Severity}\n";
                response += $"- **Estimated Cost:** ${analysisResult.EstimatedRepairCost:N2}\n";
                response += $"- **Urgency:** {analysisResult.Urgency}\n";
                response += $"- **Description:** {analysisResult.DetailedDescription}\n";
                if (analysisResult.AffectedAreas.Length > 0)
                    response += $"- **Affected Areas:** {string.Join(", ", analysisResult.AffectedAreas)}\n";
                if (!string.IsNullOrEmpty(analysisResult.SafetyConcerns))
                    response += $"- **Safety Concerns:** {analysisResult.SafetyConcerns}\n";
                if (!string.IsNullOrEmpty(analysisResult.RepairRecommendations))
                    response += $"- **Recommendations:** {analysisResult.RepairRecommendations}\n";
                if (analysisResult.RequiresSpecialist)
                    response += $"- **Specialist Required:** {analysisResult.SpecialistType}\n";
                response += $"\n---\n\n";
                response += $"Would you like to:\n";
                response += $"- Approve this analysis and update the claim\n";
                response += $"- Reject the analysis\n";
                response += $"- Check for fraud indicators\n";
                
                return response;
            }
            catch (Exception ex)
            {
                return $"❌ Error analyzing damage photo: {ex.Message}\n\n" +
                       $"Please try again or contact support if the issue persists.";
            }
        }

        /// <summary>
        /// Approves a damage photo analysis via text command
        /// In production: would update database, trigger workflows, assign adjusters
        /// </summary>
        [Description("Approves a damage photo analysis by claim number and document ID. Use this when user says 'approve' or 'approve analysis'.")]
        public async Task<string> ApproveAnalysis(string claimNumber, string documentId, string userFeedback = "")
        {
            return await HandleAnalysisApproval(claimNumber, documentId, true, userFeedback);
        }

        /// <summary>
        /// Rejects a damage photo analysis via text command
        /// In production: would flag for manual review, assign human adjuster
        /// </summary>
        [Description("Rejects a damage photo analysis by claim number and document ID. Use this when user says 'reject' or 'reject analysis'.")]
        public async Task<string> RejectAnalysis(string claimNumber, string documentId, string userFeedback = "")
        {
            return await HandleAnalysisApproval(claimNumber, documentId, false, userFeedback);
        }

        /// <summary>
        /// Common logic for handling analysis approval or rejection
        /// Provides structured feedback and next steps
        /// </summary>
        private async Task<string> HandleAnalysisApproval(string claimNumber, string documentId, bool approved, string userFeedback = "")
        {
            await NotifyUserAsync($"Processing {(approved ? "approval" : "rejection")}...");
            
            try
            {
                var action = approved ? "approved" : "rejected";
                var emoji = approved ? "✅" : "❌";
                
                // In a real system, you would:
                // 1. Update the claim status in the database
                // 2. Store the analysis results
                // 3. Update estimated costs
                // 4. Trigger workflow actions (assign adjuster, schedule inspection, etc.)
                
                var response = $"{emoji} **Analysis {action.ToUpper()}**\n\n";
                response += $"**Claim:** {claimNumber}\n";
                
                if (approved)
                {
                    response += $"**Status:** The AI analysis has been accepted and the claim has been updated.\n\n";
                    response += $"**Next Steps:**\n";
                    response += $"- The estimated repair costs have been added to the claim\n";
                    response += $"- An adjuster will be notified for final review\n";
                    response += $"- The claim is ready for processing\n";
                }
                else
                {
                    response += $"**Status:** The AI analysis has been rejected.\n\n";
                    response += $"**Next Steps:**\n";
                    response += $"- The claim will be flagged for manual review\n";
                    response += $"- An adjuster will be assigned to inspect the damage\n";
                    response += $"- Additional documentation may be requested\n";
                }
                
                if (!string.IsNullOrEmpty(userFeedback))
                {
                    response += $"\n**Your Feedback:** {userFeedback}\n";
                }
                
                response += $"\n_Note: In a production system, this would update the claim database and trigger automated workflows._";
                
                return response;
            }
            catch (Exception ex)
            {
                return $"❌ Error processing {(approved ? "approval" : "rejection")}: {ex.Message}";
            }
        }

        /// <summary>
        /// Helper to send real-time streaming updates during long operations
        /// Shows as typing indicators with messages in chat
        /// </summary>
        private async Task NotifyUserAsync(string message)
        {
            // Use StreamingResponse for real-time feedback
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
```

<cc-end-step lab="baf3" exercise="4" step="1" />

## Exercise 5: Update ClaimsPlugin to Display Damage Photos

### Step 1: Update ClaimsPlugin to Display Damage Photos

??? note "What this code does"
    Now that `GetClaimImageUrlAsync` is available in KnowledgeBaseService, we can update the ClaimsPlugin to display damage photos in claim details. This adds back the image display functionality that was removed in Lab BAF2.

1️⃣ Open `src/Plugins/ClaimsPlugin.cs`.

2️⃣ Find the `GetClaimDetails` method and locate this section near the end:

```csharp
            result.AppendLine("**Documentation Status:**");
            var isComplete = GetFieldValue(claimDoc, "isDocumentationComplete");
            result.AppendLine($"- Documentation Complete: {(isComplete == "True" || isComplete == "true" ? "Yes" : "No")}");
            var missingDocs = GetFieldValue(claimDoc, "missingDocumentation");
            result.AppendLine($"- Missing Documentation: {(string.IsNullOrWhiteSpace(missingDocs) ? "None" : missingDocs)}");

            await NotifyUserAsync($"Retrieved details for claim {claimId}");

            return result.ToString();
```

3️⃣ Replace it with this updated version that includes image display:

```csharp
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
```

??? note "Why this update is needed"
    In Lab BAF2, we omitted the image display code because `GetClaimImageUrlAsync` didn't exist yet. Now that we've added it to KnowledgeBaseService in Exercise 3, we can add the image display functionality to `ClaimsPlugin`.

<cc-end-step lab="baf3" exercise="5" step="1" />

## Exercise 6: Register Services and Configure Agent

Now let's wire everything together by updating Program.cs and the agent configuration.

### Step 1: Update Service Registration and KnowledgeBaseService Factory

??? note "What this code does"

    - **Service Registration**: Registers BlobStorageService (singleton) and VisionService (scoped) for dependency injection
    - **KnowledgeBaseService Factory**: Updates factory to pass BlobStorageService to simplified constructor
    
    The factory pattern ensures proper service resolution and initialization order.

1️⃣ Open `src/Program.cs`.

2️⃣ Find where `builder.Services.AddSingleton<KnowledgeBaseService>();` is and **replace it** with this complete registration block:

```csharp
// Register Blob Storage Service for damage photo uploads
builder.Services.AddSingleton<BlobStorageService>();

// Register VisionService for Mistral AI vision analysis
builder.Services.AddScoped<VisionService>();

// Register Knowledge Base Service with BlobStorageService dependency
builder.Services.AddSingleton<KnowledgeBaseService>(serviceProvider =>
{
    var configuration = serviceProvider.GetRequiredService<IConfiguration>();
    var blobStorageService = serviceProvider.GetRequiredService<BlobStorageService>();
    
    return new KnowledgeBaseService(configuration, blobStorageService);
});
```

??? note "Simplified constructor"
    The updated `KnowledgeBaseService` constructor now requires:
    
    - **IConfiguration**: For all connection strings and endpoints
    - **BlobStorageService**: For damage photo uploads (optional parameter)
    
    The service creates its own SearchIndexClient, KnowledgeBaseRetrievalClient, and AzureOpenAIClient internally from the configuration. This simplifies the factory function and reduces coupling.

<cc-end-step lab="baf3" exercise="6" step="1" />

### Step 2: Update Agent with VisionPlugin

??? note "What this code does"
    **Agent Instructions**: Updates system prompt to include VisionPlugin tools (ShowDamagePhoto, AnalyzeAndShowDamagePhoto, ApproveAnalysis)
    **Plugin Creation**: Instantiates VisionPlugin with all required dependencies (context, knowledge base, vision service, blob storage, configuration)
    **Tool Registration**: Adds 4 vision tools to agent's capability set for AI-powered damage photo analysis

1️⃣ Open `src/Agent/ZavaInsuranceAgent.cs`.

2️⃣ Find the `AgentInstructions` property and replace it with the updated version:

```csharp
private readonly string AgentInstructions = """
You are a professional insurance claims assistant for Zava Insurance.

Whenever the user starts a new conversation or provides a prompt to start a new conversation like "start over", "restart", 
"new conversation", "what can you do?", "how can you help me?", etc. use {{StartConversationPlugin.StartConversation}} and 
provide to the user exactly the message you get back from the plugin.

**Available Tools:**
Use {{DateTimeFunctionTool.getDate}} to get the current date and time.
For claims search, use {{ClaimsPlugin.SearchClaims}} and {{ClaimsPlugin.GetClaimDetails}}.
For damage photo viewing, use {{VisionPlugin.ShowDamagePhoto}}.
For AI vision damage analysis, use {{VisionPlugin.AnalyzeAndShowDamagePhoto}} and require approval via {{VisionPlugin.ApproveAnalysis}}.

Stick to the scenario above and use only the information from the tools when answering questions.
Be concise and professional in your responses.
""";
```

3️⃣ In the `GetClientAgent` method, find where services are resolved (after `var knowledgeBaseService = ...`) and add:

```csharp
// Resolve vision and storage services
var visionService = scope.ServiceProvider.GetRequiredService<VisionService>();
var blobStorageService = scope.ServiceProvider.GetRequiredService<BlobStorageService>();
```

4️⃣ Find where `ClaimsPlugin claimsPlugin = new(...)` is and add right after:

```csharp
// Create VisionPlugin with all dependencies
VisionPlugin visionPlugin = new(context, knowledgeBaseService, visionService, blobStorageService, configuration);
```

5️⃣ Find where tools are added to `toolOptions.Tools` and add the vision tools:

```csharp
// Register Vision tools for AI damage photo analysis
toolOptions.Tools.Add(AIFunctionFactory.Create(visionPlugin.AnalyzeAndShowDamagePhoto));
toolOptions.Tools.Add(AIFunctionFactory.Create(visionPlugin.ShowDamagePhoto));
toolOptions.Tools.Add(AIFunctionFactory.Create(visionPlugin.ApproveAnalysis));
toolOptions.Tools.Add(AIFunctionFactory.Create(visionPlugin.RejectAnalysis));
```

<cc-end-step lab="baf3" exercise="6" step="2" />

### Step 3: Add Image Proxy Endpoint

??? note "Why this is needed"
    Microsoft 365 Copilot cannot directly access Azure Blob Storage URLs due to network restrictions. Images must be proxied through the bot's devtunnel endpoint to display inline in the chat interface. The `/api/image` endpoint fetches images from blob storage and serves them through the bot endpoint.

1️⃣ Open `src/Program.cs`.

2️⃣ Find where `app.MapControllers()` is called (near the end of the file, before `app.Run()`).

3️⃣ Add the image proxy endpoint **after** `app.MapGet("/api/citation"` mapping:

```csharp
app.MapGet("/api/image", async (string url) =>
{
    try
    {
        using var httpClient = new HttpClient();
        var imageBytes = await httpClient.GetByteArrayAsync(url);
        var contentType = url.EndsWith(".png") ? "image/png" : "image/jpeg";
        return Results.File(imageBytes, contentType);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error retrieving image: {ex.Message}");
    }
});
```

??? note "How the proxy works"
    1. VisionPlugin calls ShowDamagePhoto with a claim number
    2. Gets blob storage URL from knowledge base (e.g., `https://storage.blob.core.windows.net/claim-photos/image.jpg`)
    3. Constructs proxy URL: `https://your-devtunnel.devtunnels.ms/api/image?url=<escaped-blob-url>`
    4. Copilot requests the proxy URL from bot endpoint
    5. Bot fetches image from blob storage and returns it
    6. Image displays inline in chat

<cc-end-step lab="baf3" exercise="6" step="3" />

### Step 4: Update StartConversationPlugin Welcome Message

Now that we've added vision analysis capabilities, let's update the welcome message to reflect the new features.

1️⃣ Open `src/Plugins/StartConversationPlugin.cs`.

2️⃣ Find the `welcomeMessage` variable in the `StartConversation` method and replace it with:

```csharp
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
```

??? note "Progressive feature updates"
    The welcome message now includes vision analysis capabilities (damage photo viewing and AI analysis with Mistral). Each lab progressively enhances the message to reflect new features.

<cc-end-step lab="baf3" exercise="6" step="4" />

## Exercise 7: Test Vision Analysis

Let's test the vision analysis capabilities!

### Step 1: Run the Agent

1️⃣ Press **F5** in VS Code to start debugging.

2️⃣ Select **(Preview) Debug in Copilot (Edge)** if prompted.

3️⃣ Watch the terminal output - you should see:

```
🔍 Initializing Azure AI Search Knowledge Base...
📝 Creating claims index 'claims-index'...
✅ Claims index 'claims-index' created successfully
✅ Knowledge source 'claims-knowledge-source' created
✅ Knowledge base 'zava-insurance-kb' created with model 'gpt-4.1'
📝 Indexing sample claims...
✅ Indexed 35 claims
📸 Uploading sample damage photos to blob storage and indexing...
📋 Processing 35 total claims for damage photos...
📸 Uploading to blob storage...
📸 Processing damage photo for claim CLM-2025-001001: ajlal-nueimat-deer-collision.jpg
✅ Uploaded photo for CLM-2025-001001: https://your-storage.blob.core.windows.net/claim-photos/...
...
📸 Total: Uploaded 35 damage photos to blob storage
✅ Sample data indexed successfully
```

4️⃣ **Verify Blob Storage** (optional but recommended):

- Go to [Azure Portal](https://portal.azure.com){target=_blank} → Navigate to your Storage Account
- Click **Containers** → Select **claim-photos**
- You should see 35 uploaded images organized by claim number
- Each image has a public blob URL that can be accessed directly

5️⃣ **Verify Azure AI Search Knowledge Sources** (optional but recommended):

- Go to [Azure Portal](https://portal.azure.com){target=_blank} → Search for your Azure AI Search service
- Click **Agentic retrieval** → **Knowledge Sources** in the left menu
- You should see `claims-knowledge-source` listed
- This knowledge source connects your claims index to the knowledge base for AI-powered retrieval

6️⃣ A browser window will open with Microsoft 365 Copilot. Your agent should already be installed from the previous labs.

<cc-end-step lab="baf3" exercise="7" step="1" />

### Step 2: Test Viewing Damage Photos

1️⃣ In Microsoft 365 Copilot, try: 

```text
Show me the damage photo for claim CLM-2025-001007
```

The agent should use the `ShowDamagePhoto` tool and display the damage photo.

???+ note "Image Loading Time"
    Images may take a few seconds to load in the chat as they are being proxied through the bot endpoint from Azure Blob Storage. This is normal behavior.

2️⃣ Try another claim: 

```text
View the damage photo for claim CLM-2025-001003
```

<cc-end-step lab="baf3" exercise="7" step="1" />

### Step 2: Test AI Vision Analysis

1️⃣ Try: 

```text
Analyze the damage photo for claim CLM-2025-001007
```

The agent should:
- Use the `AnalyzeAndShowDamagePhoto` tool
- Download and analyze the image with Mistral AI
- Present detailed analysis including damage type, severity, cost estimates, and recommendations
- Ask for approval or rejection

2️⃣ After reviewing the analysis, try: 

```text
Approve the analysis
```

The agent should use `ApproveAnalysis` and confirm the approval with next steps.

<cc-end-step lab="baf3" exercise="7" step="2" />

## 🎉 Congratulations!

You've successfully added AI vision analysis to your insurance agent! 

**What you accomplished:**

✅ Deployed the Mistral medium-2505 vision model  
✅ Created a VisionService for image analysis  
✅ Built a VisionPlugin with multiple vision capabilities  
✅ Implemented AI-powered damage assessment with structured output  
✅ Added approval workflows for AI-generated analyses  

**Your agent can now:**

- View damage photos from claims
- Analyze photos with multimodal AI
- Extract damage type, severity, and cost estimates
- Identify safety concerns and recommend repairs
- Provide approval workflows for AI analysis

In the next lab, you'll add authentication and email capabilities to secure your agent and enable communication features.

<cc-next url="../04-add-policy-search" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/03-add-vision-analysis" />
