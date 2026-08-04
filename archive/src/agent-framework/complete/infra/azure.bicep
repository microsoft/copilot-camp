@maxLength(20)
@minLength(4)
@description('Used to generate names for all resources in this file')
param resourceBaseName string

@description('The SKU for the App Service Plan')
param webAppSKU string

@maxLength(42)
@description('The bot display name')
param botDisplayName string

@description('Location for all resources')
param location string = resourceGroup().location

@description('The Graph Entra App client ID')
param entraAppClientId string

@description('The Graph Entra App tenant ID')
param entraAppTenantId string

@description('The Graph Entra App client secret')
@secure()
param entraAppClientSecret string

@description('The language model endpoint')
param modelsEndpoint string

@description('The language model name')
param languageModelName string

@description('The vision model name')
param visionModelName string

@description('The embedding model name')
param embeddingModelName string

@description('The language model API key')
@secure()
param modelsApiKey string

// Deploy managed identity module
module identityModule 'modules/identity.bicep' = {
  name: 'identity'
  params: {
    resourceBaseName: resourceBaseName
    location: location
  }
}

// Deploy monitoring module
module monitoringModule 'modules/monitoring.bicep' = {
  name: 'monitoring'
  params: {
    resourceBaseName: resourceBaseName
    location: location
    identityPrincipalId: identityModule.outputs.identityPrincipalId
  }
}

// Deploy storage module
module storageModule 'modules/storage.bicep' = {
  name: 'storage'
  params: {
    resourceBaseName: resourceBaseName
    location: location
    identityPrincipalId: identityModule.outputs.identityPrincipalId
    identityId: identityModule.outputs.identityId
    logAnalyticsWorkspaceId: monitoringModule.outputs.logAnalyticsWorkspaceId
  }
}

// Deploy Key Vault module
module keyVaultModule 'modules/keyvault.bicep' = {
  name: 'keyVault'
  params: {
    resourceBaseName: resourceBaseName
    location: location
    identityPrincipalId: identityModule.outputs.identityPrincipalId
    identityId: identityModule.outputs.identityId
    logAnalyticsWorkspaceId: monitoringModule.outputs.logAnalyticsWorkspaceId
    entraAppClientSecret: entraAppClientSecret
    modelsApiKey: modelsApiKey
    applicationInsightsConnectionString: monitoringModule.outputs.applicationInsightsConnectionString
    azureStorageConnectionString: storageModule.outputs.storageAccountConnectionString
    azureStorageAccountName: storageModule.outputs.storageAccountName
  }
}

// Deploy web app module
module webAppModule 'modules/webapp.bicep' = {
  name: 'webApp'
  params: {
    resourceBaseName: resourceBaseName
    location: location
    webAppSKU: webAppSKU
    identityId: identityModule.outputs.identityId
    identityClientId: identityModule.outputs.identityClientId
    identityTenantId: identityModule.outputs.identityTenantId
    logAnalyticsWorkspaceId: monitoringModule.outputs.logAnalyticsWorkspaceId
    storageAccountName: storageModule.outputs.storageAccountName
    keyVaultName: keyVaultModule.outputs.keyVaultName
    modelsEndpoint: modelsEndpoint
    languageModelName: languageModelName
    visionModelName: visionModelName
    embeddingModelName: embeddingModelName
  }
}

// Deploy bot service module
module botServiceModule 'modules/botservice.bicep' = {
  name: 'botService'
  params: {
    resourceBaseName: resourceBaseName
    botDisplayName: botDisplayName
    identityId: identityModule.outputs.identityId
    identityClientId: identityModule.outputs.identityClientId
    identityTenantId: identityModule.outputs.identityTenantId
    webAppDefaultHostName: webAppModule.outputs.webAppDefaultHostName
    logAnalyticsWorkspaceId: monitoringModule.outputs.logAnalyticsWorkspaceId
    entraAppClientId: entraAppClientId
    entraAppTenantId: entraAppTenantId
    entraAppClientSecret: entraAppClientSecret
    applicationInsightsInstrumentationKey: monitoringModule.outputs.applicationInsightsInstrumentationKey
    applicationInsightsAppId: monitoringModule.outputs.applicationInsightsAppId
  }
}

@description('The web app resource ID')
output BOT_AZURE_APP_SERVICE_RESOURCE_ID string = webAppModule.outputs.webAppId

@description('The web app domain')
output BOT_DOMAIN string = webAppModule.outputs.webAppDefaultHostName

@description('The bot client ID')
output BOT_ID string = identityModule.outputs.identityClientId

@description('The bot tenant ID')
output BOT_TENANT_ID string = identityModule.outputs.identityTenantId

@description('The Log Analytics workspace ID')
output LOG_ANALYTICS_WORKSPACE_ID string = monitoringModule.outputs.logAnalyticsWorkspaceId
