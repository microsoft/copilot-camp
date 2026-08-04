using Microsoft.Extensions.Configuration;

namespace InsuranceAgent;

public static class EnvFileConfigurationExtensions
{
    /// <summary>
    /// Adds environment-specific .env files to the configuration builder.
    /// Loads both .env.{environment} and .env.{environment}.user files,
    /// with .user file taking precedence for local overrides.
    /// </summary>
    public static IConfigurationBuilder AddEnvFile(
        this IConfigurationBuilder builder,
        string environmentName,
        string basePath = "env",
        bool optional = true)
    {
        var envName = environmentName.ToLower();
        
        // Load .env.{environment} first
        var envFile = Path.Combine(basePath, $".env.{envName}");
        builder.AddEnvFileInternal(envFile, optional);
        
        // Load .env.{environment}.user second (overrides base env file)
        var userEnvFile = Path.Combine(basePath, $".env.{envName}.user");
        builder.AddEnvFileInternal(userEnvFile, optional: true); // Always optional for .user files
        
        return builder;
    }

    private static IConfigurationBuilder AddEnvFileInternal(
        this IConfigurationBuilder builder,
        string path,
        bool optional)
    {
        if (!File.Exists(path))
        {
            if (!optional)
            {
                throw new FileNotFoundException($"Env file not found: {path}");
            }
            return builder;
        }

        var envVars = new Dictionary<string, string?>();
        foreach (var line in File.ReadAllLines(path))
        {
            // Skip empty lines and comments
            if (string.IsNullOrWhiteSpace(line) || line.TrimStart().StartsWith("#"))
                continue;

            var parts = line.Split('=', 2);
            if (parts.Length == 2)
            {
                var key = parts[0].Trim();
                var value = parts[1].Trim();
                
                // Remove surrounding quotes if present
                if (value.Length >= 2 && 
                    ((value.StartsWith("\"") && value.EndsWith("\"")) ||
                     (value.StartsWith("'") && value.EndsWith("'"))))
                {
                    value = value.Substring(1, value.Length - 2);
                }
                
                envVars[key] = value;
            }
        }

        if (envVars.Count > 0)
        {
            builder.AddInMemoryCollection(envVars);
        }

        return builder;
    }
}
