---
search:
  exclude: true
---
# ラボ BAF3 - Mistral AI を使用したビジョン解析の追加

???+ info "学習内容"
    - Mistral AI ビジョンモデルを統合し、マルチモーダル解析を行う方法  
    - Azure Blob Storage から画像データを処理する方法  
    - AI を活用した損傷評価の実装  
    - AI が生成した解析結果に対する承認ワークフローの作成  

<hr />

## 概要

Lab BAF2 では、Azure AI Search Knowledgebases を使用して請求検索を追加しました。今回は、マルチモーダルの AI ビジョン機能を強化し、損傷写真を解析して詳細な評価レポートを生成できるようにします。

Vision Service は Azure AI Services にデプロイされた **mistral-medium-2505** モデルを使用し、画像を解析して損傷評価を含む構造化 JSON 応答を生成します。

## エクササイズ 1: 前提条件の更新

ビジョン解析を追加する前に、Mistral ビジョンモデルをデプロイする必要があります。

### 手順 1: Microsoft Foundry で Mistral Vision モデルをデプロイ

1️⃣ [Microsoft Foundry](https://ai.azure.com) にサインインします。  

2️⃣ 既存のプロジェクトを開くか、新しいプロジェクトを作成します。  

3️⃣ **Models + endpoints** → **Deploy model** → **Deploy base model** に移動します。  

4️⃣ **mistral-medium-2505** を検索してデプロイします:

- Model: `mistral-medium-2505`  
- Deployment name: `mistral-medium-2505`（必ずこの名前を使用）  
- Version: 最新バージョン  

5️⃣ デプロイが完了するまで待ちます（約 2～3 分）。  

6️⃣ デプロイ情報をメモします:

- モデルは gpt-4.1 デプロイメントと **同じエンドポイント** を使用  
- **同じ API キー** を使用  
- **モデル名** のみ `mistral-medium-2505` に変更  

<cc-end-step lab="baf3" exercise="1" step="1" />

### 手順 2: Azure Storage アカウントとコンテナーを作成

損傷写真用のストレージアカウントとコンテナーを作成します。

1️⃣ [Azure Portal](https://portal.azure.com) にサインインします。  

2️⃣ 新しい **Storage Account** を作成します:

- 上部検索バーで「Storage accounts」を検索  
- **+ Create** をクリック  
- 次の情報を入力:
    - **Subscription**: 使用するサブスクリプション  
    - **Resource group**: 他のリソースと同じリソースグループ  
    - **Storage account name**: 一意の名前（例: `zavadamagestorage`+イニシャル）  
    - **Region**: AI サービスと同じリージョン  
    - **Performance**: Standard  
    - **Redundancy**: Locally-redundant storage (LRS)

- **Review + Create** をクリックし、続いて **Create**  
- デプロイが完了するまで待ちます（約 1～2 分）

3️⃣ 新しいストレージアカウントを開き、**匿名アクセス** を有効化します:

- 左メニューの **Settings** で **Configuration** を選択  
- **Allow Blob anonymous access** を **Enabled** に設定  
- 上部の **Save** をクリック

???+ warning "Public Access に必要"
    匿名 BLOB アクセスはストレージアカウント レベルで有効化してから、個々のコンテナーで公開アクセスを設定する必要があります。これを行わないとコンテナー側の公開設定は機能しません。

4️⃣ 左メニューの **Data storage** から **Containers** を選択します。  

5️⃣ 上部の **+ Container** をクリックします。  

5️⃣ 新しいコンテナーを設定します:

- **Name**: `claim-photos`  
- **Public access level**: `Blob (anonymous read access for blobs only)`  
- **Create** をクリック  

6️⃣ 設定用にストレージアカウント情報をコピーします:

- 左メニューの **Access keys** に移動  
- key1 または key2 の **Connection string** をコピー  
- **Storage account name** をコピー

???+ note "Blob Public Access の理由"
    コンテナーを「Blob」公開アクセスレベルに設定すると、次の利点があります:

    - AI ビジョンモデルが個別画像の URL に直接アクセス可能  
    - チャットインターフェイスで画像を表示可能  
    - 読み取りのための認証が不要  

    ただし、公開されるのは個別の BLOB URL のみであり、コンテナーリストは公開されないためセキュリティが保たれます。

<cc-end-step lab="baf3" exercise="1" step="2" />

### 手順 3: 構成の更新

ビジョンモデルと BLOB ストレージの構成を環境変数に追加します。

1️⃣ `.env.local` ファイルを開きます。  

2️⃣ ビジョンモデルと BLOB ストレージの構成を追加します:

```bash
# Vision & Fraud analysis model (mistral-medium-2505)
VISION_MODEL_NAME=mistral-medium-2505

# Storage
AZURE_STORAGE_ACCOUNT_NAME=YOUR-STORAGE-ACCOUNT

# Blob Storage for Damage Photos
BLOB_STORAGE_CONTAINER_NAME=claim-photos
BLOB_STORAGE_BASE_URL=https://YOUR-STORAGE-ACCOUNT.blob.core.windows.net
```

3️⃣ `.env.local.user` ファイルを開きます。  

4️⃣ BLOB ストレージ接続文字列を追加します:

```bash
# Storage
SECRET_AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=YOUR-STORAGE-ACCOUNT;AccountKey=YOUR-STORAGE-KEY;EndpointSuffix=core.windows.net
```

???+ note "構成に関する注意"
    - **SECRET_AZURE_STORAGE_CONNECTION_STRING**: Azure Portal でコピーした接続文字列を貼り付け  
    - **AZURE_STORAGE_ACCOUNT_NAME**: ストレージアカウント名  
    - **BLOB_STORAGE_CONTAINER_NAME**: `claim-photos`（先ほど作成したコンテナー）  
    - **BLOB_STORAGE_BASE_URL**: `YOUR-STORAGE-ACCOUNT` を実際のストレージアカウント名に置き換え  

<cc-end-step lab="baf3" exercise="1" step="3" />

## エクササイズ 2: Vision と Storage サービスの作成

続いて、損傷写真の AI ビジョン解析と BLOB ストレージを処理するサービスを作成します。

### 手順 1: VisionService と BlobStorageService を作成

??? note "このコードの概要"
    **VisionService**: Mistral AI ビジョンモデルで損傷写真を解析  
    - Azure OpenAI の mistral-medium-2505 デプロイメントに接続  
    - 画像バイトを受け取り、構造化 JSON の損傷解析結果を生成  
    - 損傷タイプ、重症度、修理費見積もり、安全上の懸念点、修理推奨を提供  
    - 解析失敗時のフォールバックロジックを含む  
    - 一貫した事実ベースの応答のため温度 0.3 を使用  

    **BlobStorageService**: Azure Blob Storage で損傷写真を管理  
    - 請求番号ごとにタイムスタンプ付きで写真をアップロード  
    - AI 解析用に写真をダウンロード  
    - 不要になった写真を削除  
    - MIME タイプ（JPEG, PNG, GIF, BMP, WebP）を自動検出  
    - 直接 URL アクセス用にパブリック BLOB アクセスを設定  

    これは完全な実装であり、後でメソッドを追加する必要はありません。

1️⃣ `src/Services/VisionService.cs` に新しいファイルを作成し、次の実装を追加します:

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



2️⃣ `src/Services/BlobStorageService.cs` に新しいファイルを作成し、次の実装を追加します:

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

## エクササイズ 3: KnowledgeBaseService をビジョン機能で拡張

VisionPlugin を作成する前に、KnowledgeBaseService にメソッドを追加します。これにより、プラグイン作成時にすべての依存関係が存在するようになります。

### 手順 1: KnowledgeBaseService コンストラクターの更新

??? note "変更点"
    KnowledgeBaseService のコンストラクターが、損傷写真アップロード用のオプション引数として BlobStorageService を受け取るようになります。Lab BAF2 でコンストラクターは IConfiguration だけを取るように簡略化されていましたが、今回はそれに BlobStorageService を追加します。

1️⃣ `src/Services/KnowledgeBaseService.cs` を開きます。  

2️⃣ `KnowledgeBaseService` のコンストラクターを探し、以下のコードブロックに置き換えて BlobStorageService フィールドとコンストラクター引数を追加します:

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

??? note "コンストラクターの変更"
    コンストラクターはオプションで BlobStorageService を受け取り、データインデックス作成時に損傷写真を Azure Blob Storage にアップロードするために使用します。

<cc-end-step lab="baf3" exercise="3" step="1" />

### 手順 2: ビジョン関連メソッドの追加

??? note "このコードの概要"
    **GetClaimImageUrlAsync**: claims インデックスに対して imageUrl フィールドのみを直接クエリし、シンプルな検索を高速化。NULL 可能な文字列を返します。  

    **UploadSampleDamagePhotosAsync**: 写真アップロードの完全なワークフロー  
    - JSON ファイルから請求を読み込み  
    - policyholder 名パターン (firstname-lastname-*.jpg) で画像をマッチング  
    - Blob Storage に請求番号ごとに写真をアップロード  
    - claim-documents-index に検索可能ドキュメントを作成  
    - claims インデックスの imageUrl フィールドを更新  
    - 初回起動時に自動実行  

    これにより、35 枚のサンプル損傷写真が即座にアップロード・インデックス化されます。

`KnowledgeBaseService` クラスの末尾（閉じ括弧の直前）に、次の 2 つのメソッドを追加します:

**GetClaimImageUrlAsync メソッド** - claims インデックスから直接 imageUrl を取得:

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

??? note "RetrieveAsync を使わない理由"
    シンプルなフィールド取得のみの場合は Knowledge Base の RetrieveAsync API よりも、検索インデックスへ直接クエリするほうが効率的です。

**UploadSampleDamagePhotosAsync メソッド** - `infra/img/sample-images` から損傷写真をアップロードする完全実装:

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

??? note "このコードの詳細"
    `UploadSampleDamagePhotosAsync` は写真アップロード機能を提供します:  
    - **請求データ読み込み**: `infra/data/sample-data/claims.json` からすべての請求を読み込み  
    - **画像マッチング**: `infra/img/sample-images` で policyholder 名パターンに一致する画像を検索  
    - **Blob Storage にアップロード**: 画像を請求番号フォルダーにアップロード  
    - **請求を更新**: claims-index の各レコードに imageUrl フィールドをマージ  
    - **自動実行**: IndexSampleDataAsync 実行時に呼び出されます  

    これにより、  
    - ✅ 画像が永続的に Blob Storage へアップロード  
    - ✅ claims インデックスに imageUrl が追加され直接参照可能  
    - ✅ 画像は即座に AI ビジョン解析で利用可能  
    になります。

<cc-end-step lab="baf3" exercise="3" step="2" />

### 手順 3: IndexSampleDataAsync メソッドを更新

`IndexSampleDataAsync` メソッドを見つけ、写真アップロード呼び出しを追加した下記コードに置き換えます:

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

## エクササイズ 4: Vision プラグインの作成

KnowledgeBaseService に必要なメソッドを追加したので、それらを利用する VisionPlugin を作成します。

### 手順 1: 完全な VisionPlugin を作成

??? note "このコードの概要"
    `VisionPlugin` は AI ビジョン解析機能を提供します:  
    - **ShowDamagePhoto**: 損傷写真を取得してチャット内で表示  
    - **AnalyzeAndShowDamagePhoto**: 画像をダウンロードし、Mistral AI で解析し結果を表示  
    - **ApproveAnalysis/RejectAnalysis**: AI 解析への承認ワークフロー  
    - **NotifyUserAsync**: 長時間処理中のリアルタイムストリーミング更新  

    各メソッドには `[Description]` 属性が付いており、エージェントはユーザー意図に応じて呼び出します。

1️⃣ `src/Plugins/VisionPlugin.cs` に新しいファイルを作成し、次の実装を追加します:

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

## エクササイズ 5: ClaimsPlugin を更新し損傷写真を表示

### 手順 1: ClaimsPlugin を写真表示対応に更新

??? note "このコードの概要"
    KnowledgeBaseService に `GetClaimImageUrlAsync` が追加されたため、ClaimsPlugin に画像表示機能を復活させます。

1️⃣ `src/Plugins/ClaimsPlugin.cs` を開きます。  

2️⃣ `GetClaimDetails` メソッド内の次のセクションを探します:

```csharp
            result.AppendLine("**Documentation Status:**");
            var isComplete = GetFieldValue(claimDoc, "isDocumentationComplete");
            result.AppendLine($"- Documentation Complete: {(isComplete == "True" || isComplete == "true" ? "Yes" : "No")}");
            var missingDocs = GetFieldValue(claimDoc, "missingDocumentation");
            result.AppendLine($"- Missing Documentation: {(string.IsNullOrWhiteSpace(missingDocs) ? "None" : missingDocs)}");

            await NotifyUserAsync($"Retrieved details for claim {claimId}");

            return result.ToString();
```

3️⃣ これを画像表示を含む更新版に置き換えます:

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

??? note "更新が必要な理由"
    Lab BAF2 では `GetClaimImageUrlAsync` が存在しなかったため画像表示コードを省いていました。Exercise 3 でメソッドが追加されたので復活させます。

<cc-end-step lab="baf3" exercise="5" step="1" />

## エクササイズ 6: サービス登録とエージェント設定の更新

Program.cs とエージェント設定を更新し、すべてを連携させます。

### 手順 1: サービス登録と KnowledgeBaseService ファクトリの更新

??? note "このコードの概要"
    - **サービス登録**: BlobStorageService（シングルトン）と VisionService（スコープ）を DI に登録  
    - **KnowledgeBaseService ファクトリ**: BlobStorageService を簡略化したコンストラクターに渡す  

1️⃣ `src/Program.cs` を開きます。  

2️⃣ `builder.Services.AddSingleton<KnowledgeBaseService>();` を探し、次の登録ブロックに置き換えます:

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

??? note "簡略化されたコンストラクター"
    変更後の `KnowledgeBaseService` コンストラクターは以下を受け取ります:  
    - **IConfiguration**  
    - **BlobStorageService**（オプション）  

<cc-end-step lab="baf3" exercise="6" step="1" />

### 手順 2: エージェントに VisionPlugin を追加

??? note "このコードの概要"
    - **AgentInstructions**: VisionPlugin ツールを含むようシステムプロンプトを更新  
    - **プラグイン生成**: VisionPlugin をインスタンス化し依存関係を注入  
    - **ツール登録**: Vision 関連ツールをエージェントに追加  

1️⃣ `src/Agent/ZavaInsuranceAgent.cs` を開きます。  

2️⃣ `AgentInstructions` プロパティを次の内容に置き換えます:

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

3️⃣ `GetClientAgent` メソッドでサービスを解決している箇所（`var knowledgeBaseService = ...` の後）に次を追加します:

```csharp
// Resolve vision and storage services
var visionService = scope.ServiceProvider.GetRequiredService<VisionService>();
var blobStorageService = scope.ServiceProvider.GetRequiredService<BlobStorageService>();
```

4️⃣ `ClaimsPlugin claimsPlugin = new(...)` の直後に次を追加します:

```csharp
// Create VisionPlugin with all dependencies
VisionPlugin visionPlugin = new(context, knowledgeBaseService, visionService, blobStorageService, configuration);
```

5️⃣ `toolOptions.Tools` にツールを追加している部分に Vision ツールを追加します:

```csharp
// Register Vision tools for AI damage photo analysis
toolOptions.Tools.Add(AIFunctionFactory.Create(visionPlugin.AnalyzeAndShowDamagePhoto));
toolOptions.Tools.Add(AIFunctionFactory.Create(visionPlugin.ShowDamagePhoto));
toolOptions.Tools.Add(AIFunctionFactory.Create(visionPlugin.ApproveAnalysis));
toolOptions.Tools.Add(AIFunctionFactory.Create(visionPlugin.RejectAnalysis));
```

<cc-end-step lab="baf3" exercise="6" step="2" />

### 手順 3: 画像プロキシエンドポイントの追加

??? note "必要な理由"
    Microsoft 365 Copilot はネットワーク制限により直接 Azure Blob Storage URL にアクセスできません。画像をチャット内で表示するには、ボットの devtunnel エンドポイント経由でプロキシする必要があります。

1️⃣ `src/Program.cs` を開きます。  

2️⃣ `app.MapControllers()` が呼び出されている箇所（ファイル末尾付近、`app.Run()` の前）を探します。  

3️⃣ `app.MapGet("/api/citation"` マッピングの **後** に画像プロキシエンドポイントを追加します:

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

??? note "プロキシの仕組み"
    1. VisionPlugin が ShowDamagePhoto を呼び出し、BLOB URL を取得  
    2. プロキシ URL（`/api/image?url=...`）を生成  
    3. Copilot がボットエンドポイントにリクエスト  
    4. ボットが BLOB から画像を取得し返却  
    5. 画像がチャット内でインライン表示  

<cc-end-step lab="baf3" exercise="6" step="3" />

### 手順 4: StartConversationPlugin の歓迎メッセージを更新

ビジョン解析機能を追加したので、歓迎メッセージを更新します。

1️⃣ `src/Plugins/StartConversationPlugin.cs` を開きます。  

2️⃣ `StartConversation` メソッド内の `welcomeMessage` 変数を次で置き換えます:

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

??? note "機能追加に伴う更新"
    歓迎メッセージにビジョン解析機能（損傷写真の表示と Mistral による AI 解析）を追加しました。各ラボでメッセージを段階的に更新します。

<cc-end-step lab="baf3" exercise="6" step="4" />

## エクササイズ 7: ビジョン解析をテスト

ビジョン解析機能をテストしてみましょう！

### 手順 1: エージェントを実行

1️⃣ VS Code で **F5** を押してデバッグを開始します。  

2️⃣ プロンプトが表示されたら **(Preview) Debug in Copilot (Edge)** を選択します。  

3️⃣ ターミナル出力を確認し、次のように表示されることを確認します:

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

4️⃣ **Blob Storage を確認**（任意推奨）:  
   - [Azure Portal](https://portal.azure.com){target=_blank} → ストレージアカウント  
   - **Containers** → **claim-photos**  
   - 35 枚の画像が請求番号ごとにアップロードされていることを確認  

5️⃣ **Azure AI Search Knowledge Sources を確認**（任意推奨）:  
   - [Azure Portal](https://portal.azure.com){target=_blank} → Azure AI Search サービス  
   - **Agentic retrieval** → 左メニューの **Knowledge Sources**  
   - `claims-knowledge-source` が表示されていることを確認  

6️⃣ ブラウザーが開き、Microsoft 365 Copilot が起動します。エージェントは前回のラボで既にインストール済みです。

<cc-end-step lab="baf3" exercise="7" step="1" />

### 手順 2: 損傷写真の表示をテスト

1️⃣ Microsoft 365 Copilot で次を入力します:

```text
Show me the damage photo for claim CLM-2025-001007
```

エージェントは `ShowDamagePhoto` ツールを使用し、損傷写真を表示します。

???+ note "画像読み込み時間"
    画像は Azure Blob Storage からボットエンドポイント経由でプロキシされるため、チャットに表示されるまで数秒かかることがあります。

2️⃣ 別の請求を試します:

```text
View the damage photo for claim CLM-2025-001003
```

<cc-end-step lab="baf3" exercise="7" step="1" />

### 手順 2: AI ビジョン解析をテスト

1️⃣ 次を試します:

```text
Analyze the damage photo for claim CLM-2025-001007
```

エージェントは以下を実行します:  
- `AnalyzeAndShowDamagePhoto` ツールを使用  
- 画像をダウンロードして Mistral AI で解析  
- 損傷タイプ、重症度、修理費見積もり、推奨事項など詳細を提示  
- 承認または却下を求めるプロンプトを表示  

2️⃣ 解析を確認した後、次を試します:

```text
Approve the analysis
```

エージェントは `ApproveAnalysis` を使用し、承認と次のステップを通知します。

<cc-end-step lab="baf3" exercise="7" step="2" />

### 手順 3: 複合ワークフローをテスト

1️⃣ 次を試します:

```text
Show me high severity claims in the Northeast region, then analyze their damage photos
```

エージェントはまず請求を検索し、その後該当する請求の損傷写真を解析します。

<cc-end-step lab="baf3" exercise="7" step="3" />

## 🎉 おめでとうございます！

保険エージェントに AI ビジョン解析を正常に追加できました！ 

**達成したこと:**  

✅ Mistral medium-2505 ビジョンモデルをデプロイ  
✅ 画像解析用 VisionService を作成  
✅ 複数のビジョン機能を持つ VisionPlugin を構築  
✅ 構造化出力による AI 損傷評価を実装  
✅ AI 解析結果の承認ワークフローを追加  

**エージェントができること:**  

- 請求の損傷写真を表示  
- マルチモーダル AI で写真を解析  
- 損傷タイプ、重症度、修理費を抽出  
- 安全上の懸念点を特定し修理を推奨  
- AI 解析の承認ワークフローを提供  

次のラボでは、認証とメール機能を追加し、エージェントのセキュリティと通信機能を強化します。

<cc-next url="../04-add-policy-search" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/03-add-vision-analysis--ja" />