@description('Used to generate names for Key Vault resources')
param resourceBaseName string

@description('Location for the Key Vault resources')
param location string = resourceGroup().location

@description('The managed identity principal ID for role assignments')
param identityPrincipalId string

@description('The managed identity resource ID for role assignments')
param identityId string

@description('The Log Analytics workspace ID for diagnostics')
param logAnalyticsWorkspaceId string

@description('The Graph Entra App client secret to store in Key Vault')
@secure()
param entraAppClientSecret string

@description('The models API key to store in Key Vault')
@secure()
param modelsApiKey string

@description('The Application Insights connection string to store in Key Vault')
@secure()
param applicationInsightsConnectionString string

@description('The Azure Storage connection string to store in Key Vault')
@secure()
param azureStorageConnectionString string

@description('The Azure Storage account name to store in Key Vault')
param azureStorageAccountName string

resource keyVault 'Microsoft.KeyVault/vaults@2024-04-01-preview' = {
  name: resourceBaseName
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enablePurgeProtection: true
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
      ipRules: []
      virtualNetworkRules: []
    }
    accessPolicies: []
  }
}

resource keyVaultSecretUserRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, identityId, '4633458b-17de-408a-b874-0445c86b69e6')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6') // Key Vault Secrets User
    principalId: identityPrincipalId
    principalType: 'ServicePrincipal'
  }
}

resource keyVaultDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'keyvault-diagnostics'
  scope: keyVault
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    logs: [
      {
        category: 'AuditEvent'
        enabled: true
      }
      {
        category: 'AzurePolicyEvaluationDetails'
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

resource entraAppClientSecretVault 'Microsoft.KeyVault/vaults/secrets@2024-04-01-preview' = {
  parent: keyVault
  name: 'entraAppClientSecret'
  properties: {
    value: entraAppClientSecret
  }
  dependsOn: [
    keyVaultSecretUserRole
  ]
}

resource languageModelApiKeyVault 'Microsoft.KeyVault/vaults/secrets@2024-04-01-preview' = {
  parent: keyVault
  name: 'modelsApiKey'
  properties: {
    value: modelsApiKey
  }
  dependsOn: [
    keyVaultSecretUserRole
  ]
}

resource applicationInsightsConnectionStringVault 'Microsoft.KeyVault/vaults/secrets@2024-04-01-preview' = {
  parent: keyVault
  name: 'applicationInsightsConnectionString'
  properties: {
    value: applicationInsightsConnectionString
  }
  dependsOn: [
    keyVaultSecretUserRole
  ]
}

resource azureStorageConnectionStringVault 'Microsoft.KeyVault/vaults/secrets@2024-04-01-preview' = {
  parent: keyVault
  name: 'azureStorageConnectionString'
  properties: {
    value: azureStorageConnectionString
  }
  dependsOn: [
    keyVaultSecretUserRole
  ]
}

resource azureStorageAccountNameVault 'Microsoft.KeyVault/vaults/secrets@2024-04-01-preview' = {
  parent: keyVault
  name: 'azureStorageAccountName'
  properties: {
    value: azureStorageAccountName
  }
  dependsOn: [
    keyVaultSecretUserRole
  ]
}

@description('The Key Vault name')
output keyVaultName string = keyVault.name
