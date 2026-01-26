namespace InsuranceAgent.Services.Models;

/// <summary>
/// Entity model for Claim Events (audit trail)
/// </summary>
public class ClaimEventEntity
{
    public string EventId { get; set; } = string.Empty;
    public string ClaimNumber { get; set; } = string.Empty;
    public string EventType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PerformedBy { get; set; } = string.Empty;
    public string OldStatus { get; set; } = string.Empty;
    public string NewStatus { get; set; } = string.Empty;
    
    private DateTime _eventTimestamp = DateTime.UtcNow;
    public DateTime EventTimestamp 
    { 
        get => _eventTimestamp;
        set => _eventTimestamp = value.Kind == DateTimeKind.Unspecified 
            ? DateTime.SpecifyKind(value, DateTimeKind.Utc) 
            : value.ToUniversalTime();
    }
    
    public string Metadata { get; set; } = string.Empty;
    
    private DateTime _createdAt = DateTime.UtcNow;
    public DateTime CreatedAt 
    { 
        get => _createdAt;
        set => _createdAt = value.Kind == DateTimeKind.Unspecified 
            ? DateTime.SpecifyKind(value, DateTimeKind.Utc) 
            : value.ToUniversalTime();
    }
}
