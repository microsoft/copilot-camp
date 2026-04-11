@description('Used to generate names for bot service resources')
param resourceBaseName string

@description('The bot display name')
param botDisplayName string

@description('The managed identity resource ID')
param identityId string

@description('The managed identity client ID')
param identityClientId string

@description('The managed identity tenant ID')
param identityTenantId string

@description('The web app default host name')
param webAppDefaultHostName string

@description('The Log Analytics workspace ID for diagnostics')
param logAnalyticsWorkspaceId string

@description('The Graph Entra App client ID')
param entraAppClientId string

@description('The Graph Entra App tenant ID')
param entraAppTenantId string

@description('The Graph Entra App client secret')
@secure()
param entraAppClientSecret string

@description('The Application Insights instrumentation key')
param applicationInsightsInstrumentationKey string

@description('The Application Insights application ID')
param applicationInsightsAppId string

resource botService 'Microsoft.BotService/botServices@2021-03-01' = {
  kind: 'azurebot'
  location: 'global'
  name: resourceBaseName
  properties: {
    displayName: botDisplayName
    endpoint: 'https://${webAppDefaultHostName}/api/messages'
    msaAppId: identityClientId
    msaAppTenantId: identityTenantId
    msaAppType: 'UserAssignedMSI'
    msaAppMSIResourceId: identityId
    disableLocalAuth: true
    schemaTransformationVersion: '1.3'
    isCmekEnabled: false
    publicNetworkAccess: 'Enabled'
    developerAppInsightKey: applicationInsightsInstrumentationKey
    // developerAppInsightsApiKey: (generate a key in Application Insights and apply to the resource configuration manually)
    developerAppInsightsApplicationId: applicationInsightsAppId
  }
  sku: {
    name: 'F0'
  }
}

resource botServiceDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'botservice-diagnostics'
  scope: botService
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    logs: [
      {
        category: 'BotRequest'
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

resource botServiceMsTeamsChannel 'Microsoft.BotService/botServices/channels@2021-03-01' = {
  parent: botService
  location: 'global'
  name: 'MsTeamsChannel'
  properties: {
    channelName: 'MsTeamsChannel'
  }
}

resource botServiceM365Channel 'Microsoft.BotService/botServices/channels@2021-03-01' = {
  parent: botService
  location: 'global'
  name: 'M365Extensions'
  properties: {
    channelName: 'M365Extensions'
  }
}

resource botServiceMicrosoftGraphConnection 'Microsoft.BotService/botServices/connections@2021-03-01' = {
  parent: botService
  name: 'Microsoft Graph'
  location: 'global'
  properties: {
    serviceProviderDisplayName: 'Azure Active Directory v2'
    serviceProviderId: '30dd229c-58e3-4a48-bdfd-91ec48eb906c'
    clientId: entraAppClientId
    clientSecret: entraAppClientSecret
    scopes: 'api://botid-${identityClientId}/access_as_user'
    parameters: [
      {
        key: 'tenantID'
        value: entraAppTenantId
      }
      {
        key: 'tokenExchangeUrl'
        value: 'api://botid-${identityClientId}'
      }
    ]
  }
}
