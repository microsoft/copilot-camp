@description('Used to generate names for identity resources')
param resourceBaseName string

@description('Location for the identity resources')
param location string = resourceGroup().location

resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2024-11-30' = {
  location: location
  name: resourceBaseName
}

@description('The managed identity client ID')
output identityClientId string = identity.properties.clientId

@description('The managed identity principal ID')
output identityPrincipalId string = identity.properties.principalId

@description('The managed identity tenant ID')
output identityTenantId string = identity.properties.tenantId

@description('The managed identity resource ID')
output identityId string = identity.id
