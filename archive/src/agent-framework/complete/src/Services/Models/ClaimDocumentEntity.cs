namespace InsuranceAgent.Services.Models;

/// <summary>
/// Entity model for Claim Documents
/// </summary>
public class ClaimDocumentEntity
{
    public string DocumentId { get; set; } = string.Empty;
    public string ClaimNumber { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string BlobName { get; set; } = string.Empty;
    public string BlobUrl { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public string UploadedBy { get; set; } = string.Empty;
    
    private DateTime _uploadedAt = DateTime.UtcNow;
    public DateTime UploadedAt 
    { 
        get => _uploadedAt;
        set => _uploadedAt = value.Kind == DateTimeKind.Unspecified 
            ? DateTime.SpecifyKind(value, DateTimeKind.Utc) 
            : value.ToUniversalTime();
    }
    
    public string Description { get; set; } = string.Empty;

    // Vision Analysis Fields
    public bool IsAnalyzed { get; set; } = false;
    public DateTime? AnalyzedAt { get; set; }
    public string? AnalyzedBy { get; set; } = "Mistral AI";
    public string? VisionAnalysisJson { get; set; } // Full analysis JSON
    public string? DamageType { get; set; }
    public string? Severity { get; set; }
    public string? AffectedAreas { get; set; } // JSON array as string
    public decimal? EstimatedRepairCost { get; set; }
    public string? Urgency { get; set; }
    public string? SafetyConcerns { get; set; }
    public string? RepairRecommendations { get; set; }
    public bool? RequiresSpecialist { get; set; }
    public string? SpecialistType { get; set; }
    public bool IsApproved { get; set; } = false;
    public DateTime? ApprovedAt { get; set; }
    public string? ApprovedBy { get; set; }
}
