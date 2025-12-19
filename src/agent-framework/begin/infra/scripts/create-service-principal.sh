#!/usr/bin/env bash
set -e

# Parse command line arguments
APP_ID=""
SUBSCRIPTION_ID=""
BOT_SERVICE_PRINCIPAL_ID="_"

while [[ $# -gt 0 ]]; do
    case $1 in
        --app-id)
            APP_ID="$2"
            shift 2
            ;;
        --subscription-id)
            SUBSCRIPTION_ID="$2"
            shift 2
            ;;
        --bot-service-principal-id)
            BOT_SERVICE_PRINCIPAL_ID="$2"
            shift 2
            ;;
        *)
            echo "Unknown parameter: $1"
            echo "Usage: $0 --app-id <APP_ID> --subscription-id <SUBSCRIPTION_ID> [--bot-service-principal-id <ID>]"
            exit 1
            ;;
    esac
done

# Validate required parameters
if [[ -z "$APP_ID" ]]; then
    echo "Error: --app-id is required"
    echo "Usage: $0 --app-id <APP_ID> --subscription-id <SUBSCRIPTION_ID> [--bot-service-principal-id <ID>]"
    exit 1
fi

if [[ -z "$SUBSCRIPTION_ID" ]]; then
    echo "Error: --subscription-id is required"
    echo "Usage: $0 --app-id <APP_ID> --subscription-id <SUBSCRIPTION_ID> [--bot-service-principal-id <ID>]"
    exit 1
fi

# Check if service principal ID is already set and not the placeholder value
if [[ "$BOT_SERVICE_PRINCIPAL_ID" != "_" ]]; then
    echo "Service principal ID already exists: $BOT_SERVICE_PRINCIPAL_ID"
    echo "Skipping service principal creation."
    exit 0
fi

echo "Ensuring Azure authentication..."
if ! az account show --output none 2>/dev/null; then
    az login --only-show-errors
    if [[ $? -ne 0 ]]; then
        echo "Error: Azure login failed. Exiting."
        exit 1
    fi
fi

echo "Setting subscription to $SUBSCRIPTION_ID..."
az account set --subscription "$SUBSCRIPTION_ID"
if [[ $? -ne 0 ]]; then
    echo "Error: Failed to set subscription. Exiting."
    exit 1
fi

echo "Checking if service principal exists for App ID: $APP_ID..."
SP_EXISTS=$(az ad sp list --filter "appId eq '$APP_ID'" --query "[].appId" -o tsv)

if [[ -n "$SP_EXISTS" ]]; then
    echo "Service principal already exists for App ID: $APP_ID"
    # Get the existing service principal details
    BOT_SERVICE_PRINCIPAL_ID=$(az ad sp list --filter "appId eq '$APP_ID'" --query "[0].appId" -o tsv)
else
    echo "Creating service principal for App ID: $APP_ID..."
    SP_CREATE_RESULT=$(az ad sp create --id "$APP_ID" --query "appId" -o tsv)
    if [[ $? -eq 0 ]]; then
        echo "Service principal created successfully."
        BOT_SERVICE_PRINCIPAL_ID="$SP_CREATE_RESULT"
    else
        echo "Error: Failed to create service principal."
        exit 1
    fi
fi

# Write service principal details to environment file
ENV_FILE="./env/.env.local"
FOUND_BOT_SERVICE_PRINCIPAL_ID=false

# Create temporary file
TEMP_FILE=$(mktemp)

# Read and update the file
if [[ -f "$ENV_FILE" ]]; then
    while IFS= read -r line; do
        if [[ "$line" == BOT_SERVICE_PRINCIPAL_ID=* ]]; then
            echo "BOT_SERVICE_PRINCIPAL_ID=$BOT_SERVICE_PRINCIPAL_ID" >> "$TEMP_FILE"
            FOUND_BOT_SERVICE_PRINCIPAL_ID=true
        else
            echo "$line" >> "$TEMP_FILE"
        fi
    done < "$ENV_FILE"
else
    # Create the file if it doesn't exist
    mkdir -p "$(dirname "$ENV_FILE")"
    touch "$ENV_FILE"
fi

# Add missing entries
if [[ "$FOUND_BOT_SERVICE_PRINCIPAL_ID" == false ]]; then
    echo "BOT_SERVICE_PRINCIPAL_ID=$BOT_SERVICE_PRINCIPAL_ID" >> "$TEMP_FILE"
fi

# Replace original file with updated content
mv "$TEMP_FILE" "$ENV_FILE"
echo "BOT_SERVICE_PRINCIPAL_ID=$BOT_SERVICE_PRINCIPAL_ID added to $ENV_FILE"

echo "Script completed. Service Principal ID: $BOT_SERVICE_PRINCIPAL_ID"
