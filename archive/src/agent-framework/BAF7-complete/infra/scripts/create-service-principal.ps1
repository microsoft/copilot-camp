#!/usr/bin/env pwsh
param(
    [Parameter(Mandatory=$true)]
    [string]$AppId,
    
    [Parameter(Mandatory=$true)]
    [string]$SubscriptionId,
    
    [Parameter(Mandatory=$false)]
    [string]$BotServicePrincipalId = "_"
)

# Check if service principal ID is already set and not the placeholder value
if ($BotServicePrincipalId -ne "_") {
    Write-Host "Service principal ID already exists: $BotServicePrincipalId"
    Write-Host "Skipping service principal creation."
    exit 0
}

Write-Host "Ensuring Azure authentication..."

# Check if already logged in
$currentAccount = az account show --output json 2>$null
if ($LASTEXITCODE -eq 0) {
    $accountInfo = $currentAccount | ConvertFrom-Json
    $currentSubscriptionId = $accountInfo.id
    
    Write-Host "Currently logged in to subscription: $currentSubscriptionId"
    
    # Check if current subscription matches the desired one
    if ($currentSubscriptionId -ne $SubscriptionId) {
        Write-Host "Current subscription ($currentSubscriptionId) does not match target subscription ($SubscriptionId)"
        Write-Host "Forcing logout and re-login to ensure correct subscription..."
        az logout
        Write-Host "Opening browser for Azure login..."
        az login
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Azure login failed. Exiting."
            exit 1
        }
    } else {
        Write-Host "Already logged in to the correct subscription."
    }
} else {
    # Not logged in, perform login
    Write-Host "Not logged in. Opening browser for Azure login..."
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Azure login failed. Exiting."
        exit 1
    }
}

Write-Host "Setting subscription to $SubscriptionId..."
az account set --subscription $SubscriptionId
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to set subscription. Exiting."
    exit 1
}

# Verify the subscription was set correctly
$verifyAccount = az account show --output json 2>$null | ConvertFrom-Json
if ($verifyAccount.id -ne $SubscriptionId) {
    Write-Error "Failed to switch to subscription $SubscriptionId. Current subscription is $($verifyAccount.id). Exiting."
    exit 1
}
Write-Host "Successfully set subscription to $SubscriptionId"

Write-Host "Checking if service principal exists for App ID: $AppId..."
$spExists = az ad sp list --filter "appId eq '$AppId'" --query "[].appId" -o tsv

if (![string]::IsNullOrEmpty($spExists)) {
    Write-Host "Service principal already exists for App ID: $AppId"
    # Get the existing service principal details
    $spDetails = az ad sp list --filter "appId eq '$AppId'" --query "[0].{id:id, appId:appId}" -o json | ConvertFrom-Json
    $botServicePrincipalId = $spDetails.appId
} else {
    Write-Host "Creating service principal for App ID: $AppId..."
    $spCreateResult = az ad sp create --id $AppId --output json
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Service principal created successfully."
        $spDetails = $spCreateResult | ConvertFrom-Json
        $botServicePrincipalId = $spDetails.appId
    } else {
        Write-Error "Failed to create service principal."
        exit 1
    }
}

# Write service principal details to environment file
$envFile = ".\env\.env.local"
$envFileContent = Get-Content $envFile
$foundBotServicePrincipalId = $false

$updatedContent = $envFileContent | ForEach-Object {
    $line = $_
    if ($line -like "BOT_SERVICE_PRINCIPAL_ID=*") {
        $line = "BOT_SERVICE_PRINCIPAL_ID=$botServicePrincipalId"
        $foundBotServicePrincipalId = $true
    }
    $line
}

# Add missing entries
if (-not $foundBotServicePrincipalId) {
    $updatedContent += "BOT_SERVICE_PRINCIPAL_ID=$botServicePrincipalId"
}

$updatedContent | Set-Content $envFile
Write-Host "BOT_SERVICE_PRINCIPAL_ID=$botServicePrincipalId added to $envFile"

Write-Host "Script completed. Service Principal ID: $botServicePrincipalId"