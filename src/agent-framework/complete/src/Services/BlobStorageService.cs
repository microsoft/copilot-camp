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
    private readonly string _connectionString;

    public BlobStorageService(IConfiguration configuration)
    {
        _connectionString = configuration["AZURE_STORAGE_CONNECTION_STRING"]
            ?? throw new InvalidOperationException("AZURE_STORAGE_CONNECTION_STRING not configured");
        
        _containerName = configuration["BLOB_STORAGE_CONTAINER_NAME"] ?? "claim-photos"; // Default to claim-photos for blob KS
        _baseUrl = configuration["BLOB_STORAGE_BASE_URL"] ?? "";
        
        _blobServiceClient = new BlobServiceClient(_connectionString);
    }

    /// <summary>
    /// Gets the blob storage connection string for knowledge source creation
    /// </summary>
    public string GetConnectionString() => _connectionString;

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
