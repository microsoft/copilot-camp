namespace InsuranceAgent;

public class UserProfile
{
    public string Id { get; set; } = string.Empty;
    public string GivenName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string UserPrincipalName { get; set; } = string.Empty;
    public string Mail { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string PreferredLanguage { get; set; } = string.Empty;
    public string ProfileUrl => new Uri($"https://m365.cloud.microsoft/search/overview/?pp={Id}").ToString();
}