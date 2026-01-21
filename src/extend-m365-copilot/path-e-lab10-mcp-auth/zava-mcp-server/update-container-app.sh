#!/bin/bash

# Zava MCP Server - Container App Update Script
set -e  # Exit on any error

echo "🚀 Starting Zava MCP Server update process..."

# Set variables
RESOURCE_GROUP="rg-rabia-mcp-server"
CONTAINER_REGISTRY="claimsmcpregistry"
APP_NAME="claims-mcp-app"

# Build new image
echo "📦 Building Docker image..."
docker buildx build --platform linux/amd64 -f Dockerfile.azure -t $CONTAINER_REGISTRY.azurecr.io/$APP_NAME:latest .

# Login and push
echo "🔐 Logging into Azure Container Registry..."
az acr login --name $CONTAINER_REGISTRY

echo "⬆️  Pushing image to registry..."
docker push $CONTAINER_REGISTRY.azurecr.io/$APP_NAME:latest

# Update container app
echo "🔄 Updating container app..."
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image $CONTAINER_REGISTRY.azurecr.io/$APP_NAME:latest

# Get URL and status
CONTAINER_APP_URL=$(az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo "✅ Update completed successfully!"
echo "🌐 Container App URL: https://$CONTAINER_APP_URL"

# Show current status
echo "📊 Current app status:"
az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "{status: properties.runningStatus, replicas: properties.template.scale}" \
  --output table

echo "🎉 Zava MCP Server is now updated and running!"

# chmod +x update-container-app.sh
# ./update-container-app.sh

#one liner
# docker buildx build --platform linux/amd64 -f Dockerfile.azure -t claimsmcpregistry.azurecr.io/claims-mcp-app:latest . && az acr login --name claimsmcpregistry && docker push claimsmcpregistry.azurecr.io/claims-mcp-app:latest && az containerapp update --name claims-mcp-app --resource-group rg-rabia-mcp-server --image claimsmcpregistry.azurecr.io/claims-mcp-app:latest