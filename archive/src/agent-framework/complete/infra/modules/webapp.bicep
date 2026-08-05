@description('Used to generate names for web app resources')
param resourceBaseName string

@description('Location for the web app resources')
param location string = resourceGroup().location

@description('The SKU for the App Service Plan')
param webAppSKU string

@description('The managed identity resource ID')
param identityId string

@description('The managed identity client ID')
param identityClientId string

@description('The managed identity tenant ID')
param identityTenantId string

@description('The Log Analytics workspace ID for diagnostics')
param logAnalyticsWorkspaceId string

@description('The storage account name for blob storage')
param storageAccountName string

@description('The Key Vault name for secrets')
param keyVaultName string

@description('The models endpoint')
param modelsEndpoint string

@description('The language model name')
param languageModelName string

@description('The vision model name')
param visionModelName string

@description('The embedding model name')
param embeddingModelName string

resource serverfarm 'Microsoft.Web/serverfarms@2024-04-01' = {
  kind: 'app'
  location: location
  name: resourceBaseName
  sku: {
    name: webAppSKU
  }
  properties: {
    reserved: false
  }
}

resource webApp 'Microsoft.Web/sites@2024-04-01' = {
  kind: 'app'
  location: location
  name: resourceBaseName
  properties: {
    serverFarmId: serverfarm.id
    httpsOnly: true
    keyVaultReferenceIdentity: identityId
    clientAffinityEnabled: false
    siteConfig: {
      alwaysOn: true
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      http20Enabled: true
      httpLoggingEnabled: true
      detailedErrorLoggingEnabled: true
      requestTracingEnabled: true
      remoteDebuggingEnabled: false
      webSocketsEnabled: false
      use32BitWorkerProcess: false
      managedPipelineMode: 'Integrated'
      loadBalancing: 'LeastRequests'
      ipSecurityRestrictions: []
      scmIpSecurityRestrictionsUseMain: true
      defaultDocuments: []
    }
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${identityId}': {}
    }
  }
}

resource webAppDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'webapp-diagnostics'
  scope: webApp
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    logs: [
      {
        category: 'AppServiceHTTPLogs'
        enabled: true
      }
      {
        category: 'AppServiceConsoleLogs'
        enabled: true
      }
      {
        category: 'AppServiceAppLogs'
        enabled: true
      }
      {
        category: 'AppServiceAuditLogs'
        enabled: true
      }
      {
        category: 'AppServicePlatformLogs'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}

resource siteConfig 'Microsoft.Web/sites/config@2024-04-01' = {
  name: 'appsettings'
  parent: webApp
  properties: {
    WEBSITE_RUN_FROM_PACKAGE: '1'
    RUNNING_ON_AZURE: '1'
    
    // Application Insights settings
    APPLICATIONINSIGHTS_AUTHENTICATION_STRING: 'Authorization=AAD;ClientId=${identityClientId}'
    APPLICATIONINSIGHTS_CONNECTION_STRING: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=applicationInsightsConnectionString)'
    ApplicationInsightsAgent_EXTENSION_VERSION: '~2'

    // Enhanced logging configuration
    APPINSIGHTS_ENABLE_HEARTBEAT: 'true'
    WEBSITE_HTTPLOGGING_RETENTION_DAYS: '30'
    WEBSITE_LOAD_CERTIFICATES: '*'
    
    // AgentApplication settings
    AgentApplication__StartTypingTimer: 'false'
    AgentApplication__RemoveRecipientMention: 'false'
    AgentApplication__NormalizeMentions: 'false'
    AgentApplication__UserAuthorization__DefaultHandlerName: 'me'
    AgentApplication__UserAuthorization__AutoSignin: 'true'
    AgentApplication__UserAuthorization__Handlers__me__Settings__AzureBotOAuthConnectionName: 'Microsoft Graph'
    AgentApplication__UserAuthorization__Handlers__me__Settings__OBOConnectionName: 'BotServiceConnection'
    AgentApplication__UserAuthorization__Handlers__me__Settings__OBOScopes__0: 'https://graph.microsoft.com/.default'
    AgentApplication__UserAuthorization__Handlers__me__Settings__Title: 'Sign in'
    AgentApplication__UserAuthorization__Handlers__me__Settings__Text: 'Sign in to Microsoft Graph'
    
    // TokenValidation settings
    TokenValidation__Audiences__ClientId: identityClientId
    TokenValidation__TenantId: identityTenantId
    
    // Security baseline: Enhanced logging settings
    Logging__LogLevel__Default: 'Information'
    'Logging__LogLevel__Microsoft.AspNetCore': 'Warning'
    'Logging__LogLevel__Microsoft.Agents': 'Information'
    'Logging__LogLevel__Microsoft.Hosting.Lifetime': 'Information'
    'Logging__LogLevel__Microsoft.AspNetCore.Authentication': 'Information'
    'Logging__LogLevel__Microsoft.AspNetCore.Authorization': 'Information'
    
    // BotServiceConnection settings
    Connections__BotServiceConnection__Settings__AuthType: 'UserManagedIdentity'
    Connections__BotServiceConnection__Settings__ClientId: identityClientId
    Connections__BotServiceConnection__Settings__Scopes__0: 'https://api.botframework.com/.default'
    
    // BlobsStorageOptions settings
    BlobsStorageOptions__StorageAccountName: storageAccountName
    BlobsStorageOptions__ContainerName: 'state'

    // Models settings with Key Vault reference
    AIModels__Endpoint: modelsEndpoint
    AIModels__ApiKey: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=modelsApiKey)'
    AIModels__LanguageModel__Name: languageModelName
    AIModels__VisionModel__Name: visionModelName
    AIModels__EmbeddingModel__Name: embeddingModelName

    // Azure Storage settings with Key Vault reference
    AzureStorage__ConnectionString: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=azureStorageConnectionString)'
    AzureStorage__StorageAccountName: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=azureStorageAccountName)'
    AzureStorage__ClaimsContainerName: 'claims-documents'
    AzureStorage__StateContainerName: 'state'

    // Managed Identity settings
    AZURE_CLIENT_ID: identityClientId
    DiagnosticServices_EXTENSION_VERSION: '~3'
    InstrumentationEngine_EXTENSION_VERSION: 'disabled'
    SnapshotDebugger_EXTENSION_VERSION: 'disabled'
    XDT_MicrosoftApplicationInsights_BaseExtensions: 'disabled'
    XDT_MicrosoftApplicationInsights_Java: '1'
    XDT_MicrosoftApplicationInsights_Mode: 'recommended'
    XDT_MicrosoftApplicationInsights_NodeJS: '1'
    XDT_MicrosoftApplicationInsights_PreemptSdk: 'disabled'
  }
}

@description('The web app resource ID')
output webAppId string = webApp.id

@description('The web app default host name')
output webAppDefaultHostName string = webApp.properties.defaultHostName
