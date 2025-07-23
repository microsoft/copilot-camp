using ModelContextProtocol.Server;
using System.ComponentModel;
using System.Text.Json;
using System.Text.Json.Serialization;
using HRMCPServer;
using HRMCPServer.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure the HR MCP Server settings
builder.Services.Configure<HRMCPServerConfiguration>(
    builder.Configuration.GetSection(HRMCPServerConfiguration.SectionName));

// Load candidates data and register as singleton
var candidatesData = await LoadCandidatesAsync(builder.Configuration);
builder.Services.AddSingleton(candidatesData);

// Register the candidate service
builder.Services.AddScoped<ICandidateService, CandidateService>();

// Add the MCP services: the transport to use (HTTP) and the tools to register.
builder.Services.AddMcpServer()
    .WithHttpTransport()
    .WithToolsFromAssembly();
    
var app = builder.Build();

// Configure the application to use the MCP server
app.MapMcp();

// Run the application
// This will start the MCP server and listen for incoming requests.
app.Run();

// Helper method to load candidates from JSON file
static async Task<List<Candidate>> LoadCandidatesAsync(IConfiguration configuration)
{
    try
    {
        var hrConfig = configuration.GetSection(HRMCPServerConfiguration.SectionName).Get<HRMCPServerConfiguration>();
        
        if (hrConfig == null || string.IsNullOrEmpty(hrConfig.CandidatesPath))
        {
            Console.WriteLine("HR configuration or CandidatesPath not found. Using empty candidate list.");
            return new List<Candidate>();
        }

        if (!File.Exists(hrConfig.CandidatesPath))
        {
            Console.WriteLine($"Candidates file not found at: {hrConfig.CandidatesPath}. Using empty candidate list.");
            return new List<Candidate>();
        }

        var jsonContent = await File.ReadAllTextAsync(hrConfig.CandidatesPath);
        var candidates = JsonSerializer.Deserialize<List<Candidate>>(jsonContent, GetJsonOptions());

        Console.WriteLine($"Loaded {candidates?.Count ?? 0} candidates from file: {hrConfig.CandidatesPath}");
        return candidates ?? new List<Candidate>();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error loading candidates from file: {ex.Message}. Using empty candidate list.");
        return new List<Candidate>();
    }
}

// Helper method for JSON serialization options
static JsonSerializerOptions GetJsonOptions()
{
    return new JsonSerializerOptions
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        WriteIndented = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };
}