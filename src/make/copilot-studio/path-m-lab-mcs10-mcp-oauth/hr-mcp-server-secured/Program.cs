using ModelContextProtocol.Server;
using System.ComponentModel;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using HRMCPServer;
using HRMCPServer.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure the HR MCP Server settings
builder.Services.Configure<HRMCPServerConfiguration>(
    builder.Configuration.GetSection(HRMCPServerConfiguration.SectionName));

// Configure OAuth settings
builder.Services.Configure<OAuthConfiguration>(
    builder.Configuration.GetSection(OAuthConfiguration.SectionName));

// Load candidates data and register as singleton
var candidatesData = await LoadCandidatesAsync(builder.Configuration);
builder.Services.AddSingleton(candidatesData);

// Register the candidate service
builder.Services.AddScoped<ICandidateService, CandidateService>();

// Register HTTP context accessor for authorization service
builder.Services.AddHttpContextAccessor();

// Register the authorization service
builder.Services.AddScoped<IAuthorizationService, AuthorizationService>();

// Configure JWT Bearer authentication with Microsoft Identity Web
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection(OAuthConfiguration.SectionName));

// Configure JWT Bearer events for RFC 9728 Protected Resource Metadata Discovery
builder.Services.Configure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
{
    options.Events ??= new JwtBearerEvents();
    
    var existingOnChallenge = options.Events.OnChallenge;
    options.Events.OnChallenge = async context =>
    {
        // Call existing handler if any
        if (existingOnChallenge != null)
        {
            await existingOnChallenge(context);
        }

        // Build the resource_metadata URL for RFC 9728 compliance
        var request = context.Request;
        // Use X-Forwarded-Proto header if present (for reverse proxy/dev tunnel support)
        var scheme = request.Headers["X-Forwarded-Proto"].FirstOrDefault() ?? request.Scheme;
        var host = request.Headers["X-Forwarded-Host"].FirstOrDefault() ?? request.Host.ToString();
        var resourceMetadataUrl = $"{scheme}://{host}/.well-known/oauth-protected-resource";

        // Get the OAuth configuration for the realm
        var configuration = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
        var oauthConfig = configuration.GetSection(OAuthConfiguration.SectionName).Get<OAuthConfiguration>();
        
        // Build the WWW-Authenticate header with resource_metadata parameter (RFC 9728)
        var realm = oauthConfig?.Audience ?? "api";
        var errorDescription = context.ErrorDescription ?? "Bearer token is required";
        
        // Construct the header value with resource_metadata
        var headerValue = $"Bearer realm=\"{realm}\"";
        
        if (!string.IsNullOrEmpty(context.Error))
        {
            headerValue += $", error=\"{context.Error}\"";
        }
        
        if (!string.IsNullOrEmpty(context.ErrorDescription))
        {
            headerValue += $", error_description=\"{context.ErrorDescription}\"";
        }
        
        // Add resource_metadata parameter per RFC 9728 Section 5.1
        headerValue += $", resource_metadata=\"{resourceMetadataUrl}\"";

        // Add scope parameter if available
        if (oauthConfig != null && !string.IsNullOrEmpty(oauthConfig.Scopes))
        {
            headerValue += $", scope=\"{oauthConfig.Scopes}\"";
        }


        // Replace the default WWW-Authenticate header
        context.Response.Headers.Remove("WWW-Authenticate");
        context.Response.Headers.Append("WWW-Authenticate", headerValue);
    };
});

// Configure authorization policies
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("HRManagePolicy", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("scp", HRScopes.HRManage);
    });

// Add the MCP services: the transport to use (HTTP) and the tools to register.
builder.Services.AddMcpServer()
    .WithHttpTransport()
    .WithToolsFromAssembly();

// Configure forwarded headers to support reverse proxies (dev tunnels, etc.)
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedFor | 
                                Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedProto |
                                Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedHost;
    options.KnownIPNetworks.Clear();
    options.KnownProxies.Clear();
});
    
var app = builder.Build();

// Use forwarded headers middleware (must be early in pipeline)
app.UseForwardedHeaders();

// HTTP request tracking middleware - logs all requests to the console
app.Use(async (context, next) =>
{
    var startTime = DateTime.UtcNow;
    var request = context.Request;
    
    // Log the incoming request
    Console.ForegroundColor = ConsoleColor.Cyan;
    Console.WriteLine($"[{startTime:HH:mm:ss.fff}] --> {request.Method} {request.Path}{request.QueryString}");
    Console.ResetColor();
    
    // Log request headers if present
    if (request.Headers.Authorization.Count > 0)
    {
        Console.ForegroundColor = ConsoleColor.DarkGray;
        var authHeader = request.Headers.Authorization.ToString();
        var maskedAuth = authHeader.Length > 20 
            ? $"{authHeader[..15]}...{authHeader[^5..]}" 
            : authHeader;
        Console.WriteLine($"           Authorization: {maskedAuth}");
        Console.ResetColor();
    }

    await next();

    // Log the response
    var elapsed = DateTime.UtcNow - startTime;
    var statusCode = context.Response.StatusCode;
    
    Console.ForegroundColor = statusCode switch
    {
        >= 200 and < 300 => ConsoleColor.Green,
        >= 300 and < 400 => ConsoleColor.Yellow,
        >= 400 and < 500 => ConsoleColor.Red,
        >= 500 => ConsoleColor.DarkRed,
        _ => ConsoleColor.White
    };
    
    Console.WriteLine($"[{DateTime.UtcNow:HH:mm:ss.fff}] <-- {statusCode} {request.Method} {request.Path} ({elapsed.TotalMilliseconds:F1}ms)");
    Console.ResetColor();
});

// Enable authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// Configure OAuth 2.0 Protected Resource Metadata endpoint (RFC 9728)
// This endpoint provides metadata about the protected resource and its authorization servers
app.MapMethods("/.well-known/oauth-protected-resource", new[] { "GET", "OPTIONS" }, async (HttpContext context) =>
{
    // Handle OPTIONS preflight request for CORS
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.Headers.Append("Access-Control-Allow-Origin", "*");
        context.Response.Headers.Append("Access-Control-Allow-Methods", "GET, OPTIONS");
        context.Response.Headers.Append("Access-Control-Allow-Headers", "Content-Type, Authorization");
        context.Response.Headers.Append("Access-Control-Max-Age", "120");
        context.Response.StatusCode = StatusCodes.Status204NoContent;
        return Results.Empty;
    }

    var configuration = context.RequestServices.GetRequiredService<IConfiguration>();
    var oauthConfig = configuration.GetSection(OAuthConfiguration.SectionName).Get<OAuthConfiguration>();

    if (oauthConfig == null)
    {
        return Results.Problem("OAuth configuration not found", statusCode: StatusCodes.Status500InternalServerError);
    }

    // Build the resource URI (canonical URI of the MCP server per RFC 8707)
    var resourceUri = $"{context.Request.Scheme}://{context.Request.Host}";

    // Build the authorization server issuer URL
    var authorizationServerIssuer = oauthConfig.Authority;
    
    // Build the authorization server metadata URL (RFC 8414)
    var authServerMetadataUrl = $"{oauthConfig.Instance.TrimEnd('/')}/{oauthConfig.TenantId}/v2.0/.well-known/openid-configuration";

    // Build the Protected Resource Metadata response per RFC 9728
    var metadata = new Dictionary<string, object>
    {
        // REQUIRED: The resource identifier (RFC 8707)
        ["resource"] = resourceUri,
        
        // REQUIRED: Array of authorization server issuer identifiers
        ["authorization_servers"] = new[] { authorizationServerIssuer },
        
        // OPTIONAL but recommended: Scopes supported by this resource
        ["scopes_supported"] = oauthConfig.Scopes.Split(' ', StringSplitOptions.RemoveEmptyEntries),
        
        // OPTIONAL: Bearer token methods supported
        ["bearer_methods_supported"] = new[] { "header" },
        
        // OPTIONAL: Resource documentation URL
        ["resource_documentation"] = $"{resourceUri}/docs"
    };

    // Set Cache-Control header with max-age of 120 seconds
    context.Response.Headers.Append("Cache-Control", "public, max-age=120");
    context.Response.Headers.Append("Access-Control-Allow-Origin", "*");

    return Results.Json(metadata, contentType: "application/json");
}).AllowAnonymous();

// Configure OAuth 2.0 Authorization Server Metadata (RFC 8414) and OpenID Connect Discovery endpoints
// Both redirect to Azure AD's OpenID configuration
IResult HandleAuthorizationServerMetadataRequest(HttpContext context)
{
    // Handle OPTIONS preflight request for CORS
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.Headers.Append("Access-Control-Allow-Origin", "*");
        context.Response.Headers.Append("Access-Control-Allow-Methods", "GET, OPTIONS");
        context.Response.Headers.Append("Access-Control-Allow-Headers", "Content-Type, Authorization");
        context.Response.Headers.Append("Access-Control-Max-Age", "120");
        context.Response.StatusCode = StatusCodes.Status204NoContent;
        return Results.Empty;
    }

    var configuration = context.RequestServices.GetRequiredService<IConfiguration>();
    var oauthConfig = configuration.GetSection(OAuthConfiguration.SectionName).Get<OAuthConfiguration>();

    if (oauthConfig == null)
    {
        return Results.Problem("OAuth configuration not found", statusCode: StatusCodes.Status500InternalServerError);
    }

    // Redirect to Azure AD's OpenID configuration endpoint
    var openIdConfigUrl = $"{oauthConfig.Instance.TrimEnd('/')}/{oauthConfig.TenantId}/v2.0/.well-known/openid-configuration";
    
    context.Response.Headers.Append("Cache-Control", "public, max-age=120");
    return Results.Redirect(openIdConfigUrl, permanent: false);
}

app.MapMethods("/.well-known/oauth-authorization-server", new[] { "GET", "OPTIONS" }, HandleAuthorizationServerMetadataRequest).AllowAnonymous();
app.MapMethods("/.well-known/openid-configuration", new[] { "GET", "OPTIONS" }, HandleAuthorizationServerMetadataRequest).AllowAnonymous();

// Configure the application to use the MCP server
app.MapMcp().RequireAuthorization();

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