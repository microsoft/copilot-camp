using Azure;
using Azure.AI.OpenAI;
using Azure.Identity;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using ZavaInsurance.Agent;
using InsuranceAgent;
using InsuranceAgent.Services;
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

// builder.Services.AddSingleton<IStorage>((sp) => {
//     var containerName = builder.Configuration["AzureStorage:StateContainerName"] ?? "state";

//     if (builder.Environment.IsDevelopment() || builder.Environment.EnvironmentName == "Playground")
//     {
//         // Use Azurite for local development storage
//         return new BlobsStorage("UseDevelopmentStorage=true", containerName);
//     }
//     else
//     {
//         // Use managed identity for production
//         var storageAccountName = builder.Configuration["AzureStorage:StorageAccountName"];
//         return new BlobsStorage(
//             new Uri($"https://{storageAccountName}.blob.core.windows.net/{containerName}"), 
//             new DefaultAzureCredential()
//         );
//     }
// });

// Register Knowledge Base Service for Azure AI Search agentic retrieval
// This replaces TableStorageService, BlobStorageService, and AzureAISearchService
builder.Services.AddSingleton<KnowledgeBaseService>();

// Register Blob Storage Service for damage photo uploads
builder.Services.AddSingleton<BlobStorageService>();

// Register VisionService for Mistral vision analysis
builder.Services.AddScoped<VisionService>();

// Register IChatClient for agent language model
builder.Services.AddSingleton<IChatClient>(sp =>
{
    var endpoint = builder.Configuration["MODELS_ENDPOINT"] ?? throw new InvalidOperationException("MODELS_ENDPOINT not configured");
    var apiKey = builder.Configuration["SECRET_MODELS_API_KEY"] ?? throw new InvalidOperationException("SECRET_MODELS_API_KEY not configured");
    var modelName = builder.Configuration["LANGUAGE_MODEL_NAME"] ?? "gpt-4.1";
    
    var azureClient = new AzureOpenAIClient(new Uri(endpoint), new AzureKeyCredential(apiKey));
    return azureClient.GetChatClient(modelName).AsIChatClient();
});

// Add AgentApplicationOptions from config.
builder.AddAgentApplicationOptions();

// Determine which agent to use based on configuration
var agentType = builder.Configuration.GetValue<string>("AgentType", "ZavaInsurance");

// Add the bot (which is transient)
builder.AddAgent<ZavaInsuranceAgent>();
Console.WriteLine("🏢 Starting Zava Insurance Agent...");

// Add transcript logging middleware to log all conversations to files
builder.Services.AddSingleton<Microsoft.Agents.Builder.IMiddleware[]>([new TranscriptLoggerMiddleware(new FileTranscriptLogger())]);

// Build the app
var app = builder.Build();

// Initialize Azure AI Search Knowledge Base (replaces Azurite)
using (var scope = app.Services.CreateScope())
{
    try
    {
        var kbService = scope.ServiceProvider.GetRequiredService<KnowledgeBaseService>();
        
        Console.WriteLine("🔍 Initializing Azure AI Search Knowledge Base...");
        
        // Check if we should force re-index claims only
        var forceReindexClaims = builder.Configuration["FORCE_REINDEX_CLAIMS"]?.ToLower() == "true";
        
        if (forceReindexClaims)
        {
            Console.WriteLine("🔄 Force re-indexing claims (FORCE_REINDEX_CLAIMS=true)...");
            await kbService.ReindexClaimsAsync();
        }
        else
        {
            // ONE-TIME: Recreate resources with correct schema (removes this line after first successful run)
            await kbService.RecreateAllResourcesAsync();
            
            // Create knowledge sources
            Console.WriteLine("📚 Creating knowledge sources...");
            await kbService.CreateKnowledgeSourcesAsync();
            
            // Create unified knowledge base
            Console.WriteLine("🧠 Creating unified knowledge base...");
            await kbService.CreateKnowledgeBaseAsync();
            
            // Index sample data (replaces TableStorageSeeder)
            Console.WriteLine("📊 Indexing sample data...");
            await kbService.IndexSampleDataAsync();
        }
        
        Console.WriteLine("✅ Azure AI Search Knowledge Base initialized successfully");
        Console.WriteLine("   📌 Claims, policies, and policy documents are now searchable via agentic retrieval");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error initializing Knowledge Base: {ex.Message}");
        Console.WriteLine($"   Stack trace: {ex.StackTrace}");
        throw; // Knowledge Base is critical - fail fast if initialization fails
    }
}

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