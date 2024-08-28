@maxLength(20)
@minLength(4)
@description('Used to generate names for all resources in this file')
param resourceBaseName string

@description('Required when create Azure Bot service')
param botAadAppClientId string
@maxLength(42)
param botDisplayName string
param botAppDomain string

param graphAadAppClientId string
@secure()
param graphAadAppClientSecret string

param connectionName string

// Register your web service as a bot with the Bot Framework
module azureBotRegistration './botRegistration/azurebot.bicep' = {
  name: 'Azure-Bot-registration'
  params: {
    resourceBaseName: resourceBaseName
    botAadAppClientId: botAadAppClientId
    botAppDomain: botAppDomain
    botDisplayName: botDisplayName
    graphAadAppClientId: graphAadAppClientId
    graphAadAppClientSecret: graphAadAppClientSecret
    connectionName: connectionName
  }
}
