@description('Used to generate names for monitoring resources')
param resourceBaseName string

@description('Location for the monitoring resources')
param location string = resourceGroup().location

@description('The managed identity principal ID for role assignments')
param identityPrincipalId string

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' = {
  name: '${resourceBaseName}-logs'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 90
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: resourceBaseName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
    WorkspaceResourceId: logAnalyticsWorkspace.id
    DisableIpMasking: false
    DisableLocalAuth: true
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource applicationInsightsPublisherRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(applicationInsights.id, identityPrincipalId, '3913510d-42f4-4e42-8a64-420c390055eb')
  scope: applicationInsights
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '3913510d-42f4-4e42-8a64-420c390055eb') // Monitoring Metrics Publisher
    principalId: identityPrincipalId
    principalType: 'ServicePrincipal'
  }
}

resource logAnalyticsContributorRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(logAnalyticsWorkspace.id, identityPrincipalId, '92aaf0da-9dab-42b6-94a3-d43ce8d16293')
  scope: logAnalyticsWorkspace
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '92aaf0da-9dab-42b6-94a3-d43ce8d16293') // Log Analytics Contributor
    principalId: identityPrincipalId
    principalType: 'ServicePrincipal'
  }
}

@description('The Log Analytics workspace ID')
output logAnalyticsWorkspaceId string = logAnalyticsWorkspace.id

@description('The Application Insights connection string')
output applicationInsightsConnectionString string = applicationInsights.properties.ConnectionString

@description('The Application Insights instrumentation key')
output applicationInsightsInstrumentationKey string = applicationInsights.properties.InstrumentationKey

@description('The Application Insights application ID')
output applicationInsightsAppId string = applicationInsights.properties.AppId
