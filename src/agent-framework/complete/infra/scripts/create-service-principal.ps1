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
az account show --output none 2>$null || az login --only-show-errors
if ($LASTEXITCODE -ne 0) {
    Write-Error "Azure login failed. Exiting."
    exit 1
}

Write-Host "Setting subscription to $SubscriptionId..."
az account set --subscription $SubscriptionId
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to set subscription. Exiting."
    exit 1
}

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