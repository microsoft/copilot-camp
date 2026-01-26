namespace InsuranceAgent.Services.Models;

/// <summary>
/// Entity model for Claims
/// </summary>
public class ClaimEntity
{
    // Claim properties
    public string ClaimNumber { get; set; } = string.Empty;
    public string PolicyholderName { get; set; } = string.Empty;
    public string PolicyNumber { get; set; } = string.Empty;
    public string ClaimType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public double EstimatedCost { get; set; }
    public string Severity { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public string AssignedAdjuster { get; set; } = string.Empty;
    
    private DateTime _dateFiled = DateTime.UtcNow;
    public DateTime DateFiled 
    { 
        get => _dateFiled;
        set => _dateFiled = value.Kind == DateTimeKind.Unspecified 
            ? DateTime.SpecifyKind(value, DateTimeKind.Utc) 
            : value.ToUniversalTime();
    }
    
    public DateTime? DateResolved { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int FraudRiskScore { get; set; }
    public string FraudIndicators { get; set; } = string.Empty;
    public bool IsDocumentationComplete { get; set; }
    public string MissingDocumentation { get; set; } = string.Empty;
    
    private DateTime _createdAt = DateTime.UtcNow;
    public DateTime CreatedAt 
    { 
        get => _createdAt;
        set => _createdAt = value.Kind == DateTimeKind.Unspecified 
            ? DateTime.SpecifyKind(value, DateTimeKind.Utc) 
            : value.ToUniversalTime();
    }
    
    private DateTime _updatedAt = DateTime.UtcNow;
    public DateTime UpdatedAt 
    { 
        get => _updatedAt;
        set => _updatedAt = value.Kind == DateTimeKind.Unspecified 
            ? DateTime.SpecifyKind(value, DateTimeKind.Utc) 
            : value.ToUniversalTime();
    }
}
