using Azure;
using Azure.AI.OpenAI;
using Azure.Identity;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using ZavaInsurance.Agent;
using InsuranceAgent;
using Microsoft.Agents.Builder;
using Microsoft.Agents.Core;
using Microsoft.Agents.Hosting.AspNetCore;
using Microsoft.Agents.Storage;
using Microsoft.Agents.Storage.Blobs;
using Microsoft.Agents.Storage.Transcript;
using Microsoft.Extensions.AI;
using OpenTelemetry.Trace;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

if (IsLocalEnvironment(builder.Environment))
{
    // Load environment-specific .env files
    // This loads both .env.{environment} and .env.{environment}.user
    // with .user file taking precedence for local overrides
    builder.Configuration.AddEnvFile(builder.Environment.EnvironmentName);
}

// Load user secrets in development
builder.Configuration.AddUserSecrets(Assembly.GetExecutingAssembly());

// Add environment variables to configuration
builder.Configuration.AddEnvironmentVariables();

builder.Services.AddControllers();
builder.Services.AddHttpClient("WebClient", client => client.Timeout = TimeSpan.FromSeconds(600));
builder.Services.AddHttpContextAccessor();
builder.Logging.AddConsole();

Console.WriteLine($"🌍 Environment: {builder.Environment.EnvironmentName}");

// Configure OpenTelemetry with Azure Monitor in production
if (builder.Environment.IsProduction())
{
    builder.Services.AddOpenTelemetry()
        .WithTracing(tracerProviderBuilder =>
            tracerProviderBuilder.AddHttpClientInstrumentation(options =>
            {
                // Configure HTTP client instrumentation for better OpenAI telemetry
                options.RecordException = true;
                options.EnrichWithHttpRequestMessage = (activity, httpRequestMessage) =>
                {
                    activity.SetTag("http.request.header.user-agent", httpRequestMessage.Headers.UserAgent?.ToString());
                };
                options.EnrichWithHttpResponseMessage = (activity, httpResponseMessage) =>
                {
                    activity.SetTag("http.response.status_code", (int)httpResponseMessage.StatusCode);
                };
            }))
        .UseAzureMonitor(options =>
        {
            options.Credential = new DefaultAzureCredential();
        });
}

// Add AspNet token validation (temporarily disabled for local development)
builder.Services.AddAgentAspNetAuthentication(builder.Configuration);

// Register IStorage.  For development, MemoryStorage is suitable.
// For production Agents, persisted storage should be used so
// that state survives Agent restarts, and operate correctly
// in a cluster of Agent instances.
builder.Services.AddSingleton<IStorage, MemoryStorage>();

// Add AgentApplicationOptions from config.
builder.AddAgentApplicationOptions();

// Determine which agent to use based on configuration
var agentType = builder.Configuration.GetValue<string>("AgentType", "ZavaInsurance");

// Add the bot (which is transient)
builder.AddAgent<ZavaInsuranceAgent>();
Console.WriteLine("🏢 Starting Zava Insurance Agent...");

// Register IChatClient for the agent - basic setup without LanguageModelService
builder.Services.AddSingleton<IChatClient>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var endpoint = config["AIModels:Endpoint"] ?? throw new InvalidOperationException("AIModels:Endpoint is required");
    var apiKey = config["AIModels:ApiKey"] ?? throw new InvalidOperationException("AIModels:ApiKey is required");
    var deployment = config["AIModels:LanguageModel:Name"] ?? "gpt-4.1";

    Console.WriteLine($"🤖 Main agent using model: {deployment}");

    var azureOpenAIClient = new AzureOpenAIClient(new Uri(endpoint), new AzureKeyCredential(apiKey));
    return azureOpenAIClient.GetChatClient(deployment).AsIChatClient();
});

// Add transcript logging middleware to log all conversations to files
builder.Services.AddSingleton<Microsoft.Agents.Builder.IMiddleware[]>([new TranscriptLoggerMiddleware(new FileTranscriptLogger())]);

// Build the app
var app = builder.Build();

Console.WriteLine("✅ Agent initialized successfully!");

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Configure the HTTP request pipeline
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// Map the /api/messages endpoint to the AgentApplication
app.MapPost("/api/messages", async (HttpRequest request, HttpResponse response, IAgentHttpAdapter adapter, IAgent agent, CancellationToken cancellationToken) =>
{
    await adapter.ProcessAsync(request, response, agent, cancellationToken);
});

app.MapGet("/api/citation", async (string targetUrl) =>
{
    try
    {
        return Results.Redirect(targetUrl);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error retrieving citation: {ex.Message}");
    }
});

Console.WriteLine($"🌍 App Environment: {app.Environment.EnvironmentName}");

if (IsLocalEnvironment(app.Environment))
{
    var agentName = "Zava Insurance Claims Agent";

    app.MapGet("/", () => agentName);
    app.UseDeveloperExceptionPage();
    app.MapControllers().AllowAnonymous();

    // Hardcoded for brevity and ease of testing. 
    // In production, this should be set in configuration.
    app.Urls.Add($"http://localhost:3978");
}
else
{
    app.MapControllers();
}

app.Run();

// define a local function to test if the environment is production
bool IsLocalEnvironment(IWebHostEnvironment env)
{
    return env.IsDevelopment() ||
        env.EnvironmentName == "Playground" ||
        env.EnvironmentName == "local";
}