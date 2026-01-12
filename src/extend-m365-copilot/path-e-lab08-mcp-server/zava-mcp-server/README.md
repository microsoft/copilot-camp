# Zava Claims Ops - Anonymous MCP Server for AI Agents

A modern **Model Context Protocol (MCP) server** built with TypeScript that provides AI agents with **anonymous access** to insurance claims data through **Azure Table Storage** integration.

## 📚 Table of Contents

- [🎯 What This Project Provides](#-what-this-project-provides)
- [🚀 Tech Stack](#-tech-stack)  
- [📋 Prerequisites](#-prerequisites)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [🛠️ Available MCP Tools](#️-available-mcp-tools)
- [🌐 MCP Server Endpoints](#-mcp-server-endpoints-all-public---no-authentication)
- [📝 Example Usage with curl](#-example-usage-with-curl-anonymous-access)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [🚀 Available NPM Scripts](#-available-npm-scripts)
- [📊 Sample Data Included](#-sample-data-included)
- [🚀 Production Deployment: Azure Container Apps](#-production-deployment-azure-container-apps)
- [🔍 Testing and Monitoring](#-testing-and-monitoring)
- [🧪 Local Development and Testing](#-local-development-and-testing)
- [📚 Additional Resources and Documentation](#-additional-resources-and-documentation)
- [🔒 Security Considerations](#-security-considerations)
- [📝 Changelog and Versioning](#-changelog-and-versioning)
- [🤝 Contributing](#-contributing)
- [📄 License and Legal](#-license-and-legal)

## 🎯 What This Project Provides

- **🤖 MCP Server**: Standards-compliant MCP server for AI agent integration
- **🌐 Anonymous Access**: No authentication required - all endpoints are public
- **☁️ Azure Storage**: Azure Table Storage for scalable data management
- **📦 Production Ready**: Docker containerization with Azure deployment guide
- **🔧 Full CRUD Operations**: Complete Create, Read, Update, Delete operations for claims, inspections, and inspector management
- **📊 Rich Sample Data**: Pre-loaded with realistic insurance data for immediate testing

## 🚀 Tech Stack

### Core Technologies
- **Runtime**: Node.js 18+ with TypeScript
- **MCP Framework**: [@modelcontextprotocol/sdk](https://modelcontextprotocol.io/)
- **Web Framework**: Express.js with CORS support
- **Storage**: Azure Table Storage (with local Azurite emulator)
- **Validation**: Zod schema validation for all inputs
- **Testing**: Jest with comprehensive test coverage

### Dependencies
- **@azure/data-tables**: Azure Table Storage client
- **@modelcontextprotocol/sdk**: MCP server implementation
- **express**: HTTP server framework
- **cors**: Cross-origin resource sharing
- **zod**: Runtime type validation
- **joi**: Additional validation schemas

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js 18.x or later** installed
- **npm** or **yarn** package manager
- **TypeScript** (`npm install -g typescript`) 
- **Docker Desktop** (for containerization and deployment)
- **Azure CLI** (for Azure deployment)
- **Git** (for version control)

## 🚀 Quick Start Guide

### Step 1: Clone and Install
```bash
git clone <repository-url>
cd zava-mcp-server
npm install
```

### Step 2: Build the Project
```bash
npm run build
```

### Step 3: Start Local Storage (Terminal 1)
```bash
# Start Azure Storage Emulator - keep this running
npm run start:azurite
```

### Step 4: Initialize Sample Data (Terminal 2)
```bash
# Load sample claims, contractors, inspections data
npm run init-data
```

### Step 5: Start MCP Server (Terminal 2)
```bash
# Start MCP HTTP server on http://127.0.0.1:3001
npm run start:mcp-http
```

### Step 6: Test with MCP Inspector (Terminal 3) 
```bash
# Open interactive MCP testing UI (optional)
npm run inspector
```

## 🛠️ Available MCP Tools

The MCP server provides **15 comprehensive tools** for AI agents across four main categories:

### 📋 Claims Operations
| Tool | Description | Parameters | Example Usage |
|------|-------------|------------|---------------|
| `get_claims` | Retrieve all insurance claims | None | Returns list of all claims |
| `get_claim` | Get specific claim by ID or number | `claimId: string` | Get claim "1" or "CN202504990" |
| `create_claim` | Create a new insurance claim | Full claim object | Create new storm damage claim |
| `update_claim` | Update existing claim | `claimId + update fields` | Update claim status, add notes |
| `delete_claim` | Remove claim from system | `claimId: string` | Permanently delete claim |

### 🔍 Inspection Operations  
| Tool | Description | Parameters | Example Usage |
|------|-------------|------------|---------------|
| `get_inspections` | Get all inspections (with filters) | `claimId?`, `status?` | List inspections for specific claim |
| `get_inspection` | Get specific inspection by ID | `inspectionId: string` | Retrieve inspection details |
| `create_inspection` | Schedule new inspection | Task details | Schedule roof inspection |
| `update_inspection` | Update inspection task | `inspectionId + updates` | Mark inspection complete |
| `delete_inspection` | Remove inspection task | `inspectionId: string` | Cancel scheduled inspection |

### 👷 Inspector Operations
| Tool | Description | Parameters | Example Usage |
|------|-------------|------------|---------------|
| `get_inspectors` | Retrieve all inspectors (with optional specialization filter) | `specialization?` | List all inspectors or filter by "Roofing" |
| `get_inspector` | Get specific inspector by ID | `inspectorId: string` | Get inspector details for assignment |

### 🏗️ Contractor & Purchase Order Operations
| Tool | Description | Parameters | Example Usage |
|------|-------------|------------|---------------|
| `get_contractors` | Retrieve contractors with filters | `name?`, `specialty?`, `isPreferred?` | Find roofing contractors or preferred vendors |
| `create_purchase_order` | Create new purchase order for contractor work | `claimId`, `contractorId`, `workDescription`, `lineItems` | Issue PO for repair work |
| `get_purchase_order` | Get specific purchase order by ID | `poId: string` | Retrieve PO details and status |

### 🤖 AI Prompts Available
| Prompt | Description | Parameters | Purpose |
|--------|-------------|------------|---------|
| `claims_analysis` | Generate comprehensive claim analysis | `claimId`, `analysisType?` | AI-powered claim assessment |
| `damage_assessment` | Generate damage assessment prompt | `claimId`, `damageType`, `severity?` | Property damage evaluation |
| `inspection_report` | Generate inspection report prompt | `inspectionId`, `reportType?` | Structured inspection reporting |

## 🌐 MCP Server Endpoints (All Public - No Authentication)

### MCP Protocol Endpoints
- **`POST /mcp/messages`** - JSON-RPC 2.0 MCP protocol communication
- **`GET /mcp/tools`** - List available tools with schemas
- **`POST /mcp/tools/call`** - Execute tool directly (bypass JSON-RPC)
- **`GET /mcp/prompts`** - List available AI prompts
- **`POST /mcp/prompts/get`** - Generate AI prompt content
- **`GET /mcp/stream`** - Server-Sent Events streaming interface
- **`POST /mcp/stream/tools/call`** - Execute tool with streaming response

### Health & Status
- **`GET /health`** - Comprehensive health check with capabilities

## 📝 Example Usage with curl (Anonymous Access)

### Testing MCP Tools - No Authentication Required

#### Basic Tool Operations
```bash
# List available tools with schemas
curl -X GET "http://127.0.0.1:3001/mcp/tools"

# Get all claims
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_claims","arguments":{}}'

# Get specific claim (by ID or claim number)
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_claim","arguments":{"claimId":"1"}}'

# Create new claim
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"create_claim",
    "arguments":{
      "claimNumber":"CN202504991",
      "policyNumber":"POL-HO-2025-003", 
      "policyHolderName":"Jane Doe",
      "policyHolderEmail":"jane.doe@email.com",
      "property":"789 Oak Street, Portland, OR 97205",
      "dateOfLoss":"2025-01-15T00:00:00Z",
      "dateReported":"2025-01-16T10:30:00Z",
      "status":"submitted",
      "damageTypes":["fire_damage"],
      "description":"Kitchen fire caused by electrical fault",
      "estimatedLoss":25000
    }
  }'

# Update existing claim
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"update_claim",
    "arguments":{
      "claimId":"1",
      "status":"under_review",
      "adjusterAssigned":"ADJ-001",
      "notes":["Claim reviewed by adjuster", "Photos uploaded"]
    }
  }'
```

#### Inspection Operations
```bash
# Get all inspections
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_inspections","arguments":{}}'

# Get inspections for specific claim
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_inspections","arguments":{"claimId":"1"}}'

# Create new inspection
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"create_inspection",
    "arguments":{
      "claimId":"1",
      "taskType":"initial",
      "priority":"high",
      "scheduledDate":"2025-01-20T14:00:00Z",
      "inspectorId":"inspector-001",
      "instructions":"Assess roof damage from recent storm"
    }
  }'
```

#### Contractor & Purchase Order Operations
```bash
# Get all contractors
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_contractors","arguments":{}}'

# Get contractors by specialty
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_contractors","arguments":{"specialty":"roofing"}}'

# Get preferred contractors only
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_contractors","arguments":{"isPreferred":"true"}}'

# Create new purchase order
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"create_purchase_order",
    "arguments":{
      "claimId":"1",
      "contractorId":"contractor-001",
      "workDescription":"Emergency roof repair following storm damage",
      "lineItems":[
        {
          "description":"Asphalt shingles (architectural grade)",
          "quantity":20,
          "unitPrice":45.50,
          "category":"materials"
        },
        {
          "description":"Professional installation and cleanup",
          "quantity":8,
          "unitPrice":125.00,
          "category":"labor"
        }
      ],
      "notes":["Urgent repair needed", "Weather permitting"]
    }
  }'

# Get purchase order details
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_purchase_order","arguments":{"poId":"po-uuid-here"}}'
```

#### Inspector Operations
```bash
# Get all inspectors
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_inspectors","arguments":{}}'

# Get inspectors by specialization
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_inspectors","arguments":{"specialization":"Roofing"}}'

# Get specific inspector by ID
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_inspector","arguments":{"inspectorId":"inspector-001"}}'
```

#### AI Prompts
```bash
# List available prompts
curl -X GET "http://127.0.0.1:3001/mcp/prompts"

# Generate claims analysis prompt
curl -X POST "http://127.0.0.1:3001/mcp/prompts/get" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"claims_analysis",
    "arguments":{
      "claimId":"1",
      "analysisType":"damage_assessment"
    }
  }'
```

#### MCP JSON-RPC Protocol
```bash
# Standard MCP protocol communication
curl -X POST "http://127.0.0.1:3001/mcp/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"tools/list",
    "id":1
  }'

# Execute tool via JSON-RPC
curl -X POST "http://127.0.0.1:3001/mcp/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"tools/call",
    "params":{"name":"get_claims","arguments":{}},
    "id":1
  }'
```

#### Health and Status
```bash
# Comprehensive health check
curl -X GET "http://127.0.0.1:3001/health"
```

## ⚙️ Environment Configuration

### Development Environment (.env)
Create `.env` file in the root directory:
```bash
# Server Configuration
SERVER_BASE_URL=http://127.0.0.1:3001
NODE_ENV=development
LOG_LEVEL=debug
PORT=3001

# CORS Configuration - Add additional allowed origins
ADDITIONAL_ALLOWED_ORIGINS=http://localhost:6274,http://localhost:3000

# Azure Storage Configuration (Local Azurite)
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;"

```

### Production Environment
For Azure deployment, use Azure App Configuration or environment variables:
```bash
# Production Azure Storage
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=yourprodaccount;AccountKey=...;EndpointSuffix=core.windows.net"

# Production Server Settings
NODE_ENV=production
LOG_LEVEL=info
PORT=3001
```

### Available Configuration Options
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | `3001` | No |
| `NODE_ENV` | Environment mode | `development` | No |
| `LOG_LEVEL` | Logging level | `info` | No |
| `AZURE_STORAGE_CONNECTION_STRING` | Storage connection | Azurite local | No |
| `ADDITIONAL_ALLOWED_ORIGINS` | Extra CORS origins | None | No |


## 🚀 Available NPM Scripts

The project includes comprehensive npm scripts for all development and deployment tasks:

### Development Scripts
```bash
# Build and compilation
npm run build          # Compile TypeScript to JavaScript
npm run clean           # Remove dist directory
npm run prebuild       # Auto-runs clean before build

# Local development servers
npm run start:azurite   # Start Azure Storage Emulator
npm run start:mcp-http  # Start MCP HTTP server
npm start              # Start Azure Functions (alternative mode)

# Data initialization
npm run init-data      # Load sample data (development)
npm run init-data-prod # Load data to production Azure Storage
```

### Testing and Quality
```bash
# Testing
npm test               # Run Jest test suite
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report

# Code quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix linting issues automatically
```

### MCP Inspector and Debugging
```bash
# Development inspector (local tunnel)
npm run inspector      # Open MCP Inspector (dev tunnel)
npm run inspector:dev  # Start inspector with auto-reload

# Production inspector (deployed server)
npm run inspector-prod # Test production deployment
```

### VS Code Tasks Integration
The project includes pre-configured VS Code tasks:
- **Start Azure Functions** (`Ctrl+Shift+P` → `Tasks: Run Task`)
- **Start MCP HTTP Server** (Background task)
- **Open MCP Inspector** (Depends on MCP server)
- **MCP Dev with Inspector** (Combined development)

## 📊 Sample Data Included

The project includes comprehensive, realistic sample data across all entities:

### 📋 Insurance Claims (2 samples)
- **Storm Damage**: Roof damage from severe weather
- **Theft**: Burglary with stolen electronics and jewelry
- Complete policyholder information, damage assessments, and claim histories

### 🔍 Inspection Tasks (2 samples)  
- **Roof Inspection**: Storm damage assessment with photos
- **Security Assessment**: Post-theft property evaluation
- Inspector assignments, schedules, and detailed findings

### 🔨 Contractors (3 profiles)
- **Thompson Roofing Solutions**: Storm damage specialists
- **Pacific Water Restoration**: Water damage experts  
- **Secure Home Solutions**: Security system installers
- Complete business profiles with ratings and specializations

### 📄 Purchase Orders (2 samples)
- **Roofing Materials**: $8,500 emergency roof repair
- **Security Equipment**: $3,200 security system upgrade
- Line-item details with materials, labor, and equipment costs

### � Inspectors (4 profiles)
- **Sarah Johnson**: Roofing and Storm Damage specialist (INS-12345)
- **Mike Rodriguez**: Water Damage and Plumbing expert (INS-67890)
- **Lisa Chen**: Fire Damage, Smoke Assessment, and Electrical specialist (INS-11111)
- **David Williams**: Structural, Foundation, and General inspection expert (INS-22222)
- Complete contact information, license numbers, and specialization areas

### Sample Data Structure
```json
{
  "claimNumber": "CN202504990",
  "policyNumber": "POL-HO-2025-001",
  "policyHolderName": "John Smith",
  "policyHolderEmail": "john.smith@email.com", 
  "property": "123 Main Street, Seattle, WA 98101",
  "dateOfLoss": "2025-01-10T08:00:00Z",
  "dateReported": "2025-01-10T14:30:00Z",
  "status": "under_review",
  "damageTypes": ["storm_damage", "roof_damage"],
  "description": "Severe storm caused significant roof damage...",
  "estimatedLoss": 15000,
  "adjusterAssigned": "ADJ-12345"
}
```

### Data Initialization
```bash
# Initialize all sample data
npm run init-data

# For production Azure Storage
npm run init-data-prod
```

## 🚀 Production Deployment: Azure Container Apps

### Prerequisites for Deployment
- Azure CLI installed (`az login`)
- Docker Desktop running
- Azure subscription with Container Apps enabled

### Quick Deployment Script

```bash
# Set deployment variables
RESOURCE_GROUP="rg-mcp-claims-server"
LOCATION="eastus"
CONTAINER_APP_NAME="claims-mcp-app"
CONTAINER_ENV_NAME="mcp-environment"
STORAGE_ACCOUNT="claimsmcpstorage"
CONTAINER_REGISTRY="claimsmcpregistry"

# 1. Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# 2. Create Container Apps environment
az containerapp env create \
  --name $CONTAINER_ENV_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# 3. Create storage account
az storage account create \
  --name $STORAGE_ACCOUNT \
  --location $LOCATION \
  --resource-group $RESOURCE_GROUP \
  --sku Standard_LRS

# 4. Create container registry
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $CONTAINER_REGISTRY \
  --sku Basic \
  --admin-enabled true

# 5. Build and push Docker image
docker buildx build --platform linux/amd64 -f Dockerfile.azure -t $CONTAINER_REGISTRY.azurecr.io/claims-mcp:latest .
az acr login --name $CONTAINER_REGISTRY
docker push $CONTAINER_REGISTRY.azurecr.io/claims-mcp:latest

# 6. Deploy container app
az containerapp create \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_ENV_NAME \
  --image $CONTAINER_REGISTRY.azurecr.io/claims-mcp:latest \
  --target-port 3001 \
  --ingress 'external' \
  --min-replicas 1 \
  --max-replicas 5 \
  --cpu 0.5 \
  --memory 1.0Gi
```



## 🔍 Testing and Monitoring

### Health Checks and Monitoring
```bash
# Comprehensive server health check
curl -X GET "http://127.0.0.1:3001/health"

# Response includes:
{
  "status": "healthy",
  "timestamp": "2025-11-09T10:30:00.000Z",
  "oauth": "disabled", // or "enabled" if OAuth configured
  "capabilities": ["tools", "prompts"],
  "version": "1.0.0",
  "environment": "development",
  "storage": "connected",
  "endpoints": {
    "mcp": "/mcp/messages",
    "tools": "/mcp/tools", 
    "prompts": "/mcp/prompts",
    "stream": "/mcp/stream"
  }
}
```

### MCP Inspector Integration

The project includes full MCP Inspector support for interactive testing:

#### Development Testing (Local)
```bash
# Start server first
npm run start:mcp-http

# In another terminal, start inspector
npm run inspector
# Opens: http://localhost:6274
```

#### Production Testing (Deployed)
```bash
# Test deployed server
npm run inspector-prod
# Connects to: https://claims-mcp-app.proudglacier-5e06022c.eastus.azurecontainerapps.io
```

#### Inspector Features
1. **Interactive Tool Testing**: Execute all MCP tools with real-time results
2. **Schema Validation**: Automatic input validation based on tool schemas  
3. **Response Formatting**: Pretty-printed JSON responses
4. **Error Handling**: Clear error messages and debugging info
5. **Prompt Testing**: Generate and test AI prompts interactively



### Logging and Debugging
```bash
# View server logs in real-time
tail -f logs/server.log

# Debug mode with verbose logging
LOG_LEVEL=debug npm run start:mcp-http

# Check Azurite storage logs
tail -f azurite/debug.log
```

### Performance Monitoring
- **Response Times**: All endpoints include timing information
- **Request Logging**: Comprehensive request/response logging
- **Error Tracking**: Structured error logging with stack traces
- **Storage Metrics**: Azure Table Storage operation metrics 

## 🧪 Local Development and Testing

### Complete Development Workflow

1. **Initial Setup** (One time)
   ```bash
   git clone <repository-url>
   cd zava-mcp-server
   npm install
   npm run build
   ```

2. **Start Development Environment** (3 terminals)
   ```bash
   # Terminal 1: Storage emulator
   npm run start:azurite
   
   # Terminal 2: Initialize data and start server  
   npm run init-data
   npm run start:mcp-http
   
   # Terminal 3: MCP Inspector (optional)
   npm run inspector
   ```

3. **Development Cycle**
   ```bash
   # Make changes to TypeScript files
   # Rebuild and restart server
   npm run build
   npm run start:mcp-http
   
   # Or use VS Code tasks for integrated development
   ```

### Testing All Features

```bash
# Test all tools programmatically
npm test

# Interactive testing with Inspector
npm run inspector

# Manual API testing
curl -X GET "http://127.0.0.1:3001/mcp/tools"
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_claims","arguments":{}}'
```

### Database and Storage Management

```bash
# Reset local data
rm -rf azurite/__blobstorage__/*
rm -rf azurite/__queuestorage__/* 
rm azurite/*.json
npm run init-data

# Backup local data  
cp -r azurite/ azurite-backup/

# View storage contents (use Azure Storage Explorer or)
# Connect to: http://127.0.0.1:10002/devstoreaccount1
```

## 📚 Additional Resources and Documentation

### Official Documentation
- **[Model Context Protocol Specification](https://modelcontextprotocol.io/specification/)** - Complete MCP protocol docs
- **[MCP SDK Documentation](https://modelcontextprotocol.io/docs)** - TypeScript SDK guide
- **[Azure Table Storage API](https://docs.microsoft.com/en-us/rest/api/storageservices/table-service-rest-api)** - Storage service reference
- **[Azure Container Apps](https://docs.microsoft.com/en-us/azure/container-apps/)** - Deployment platform docs

### Development Tools
- **[MCP Inspector](https://github.com/modelcontextprotocol/inspector)** - Interactive MCP testing tool
- **[Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/)** - GUI for Azure Storage
- **[Azurite](https://github.com/Azure/Azurite)** - Local Azure Storage emulator
- **[VS Code Azure Extensions](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)** - Azure development tools

### API and Integration Guides
- **[Express.js Documentation](https://expressjs.com/en/4x/api.html)** - Web framework reference
- **[Zod Validation](https://zod.dev/)** - Schema validation library
- **[Jest Testing Framework](https://jestjs.io/docs/getting-started)** - Testing documentation
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Language reference


## 🔒 Security Considerations

### Development Security (Anonymous Mode)
- **Open Access**: All endpoints are publicly accessible by design
- **Local Network**: Server binds to localhost only (127.0.0.1)
- **CORS Policy**: Configured for common development origins
- **Input Validation**: All inputs validated with Zod schemas
- **No Sensitive Data**: Sample data contains no real personal information

### Production Security Recommendations (Auth coming soon)
- **Authentication**: Enable OAuth 2.0 with Microsoft Entra ID
- **Authorization**: Implement role-based access control (RBAC)
- **Rate Limiting**: Configure Azure Front Door or API Management
- **Secret Management**: Use Azure Key Vault for sensitive configuration
- **Network Security**: Deploy in private virtual networks with NSGs
- **Data Encryption**: Enable encryption at rest for Azure Table Storage
- **Monitoring**: Enable Azure Security Center and logging

### Security Headers and Policies
```typescript
// Recommended security middleware for production
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### Data Privacy and Compliance
- **GDPR Compliance**: Implement data subject rights (delete, export)
- **Data Retention**: Configure automatic data cleanup policies
- **Audit Logging**: Log all data access and modifications
- **Anonymization**: Remove or hash PII in non-production environments

### Vulnerability Management
- **Dependency Scanning**: Use `npm audit` and Dependabot
- **Container Scanning**: Scan Docker images for vulnerabilities
- **Code Analysis**: Use SonarQube or similar static analysis tools
- **Penetration Testing**: Regular security assessments

## 📝 Changelog and Versioning

### Version 1.0.0 (Current)
- ✅ Complete MCP server implementation
- ✅ Full CRUD operations for claims and inspections  
- ✅ AI prompt generation capabilities
- ✅ Azure Table Storage integration
- ✅ Local development with Azurite
- ✅ Production Azure Container Apps deployment
- ✅ Comprehensive test coverage
- ✅ MCP Inspector integration
- ✅ Anonymous access mode (development)


### Planned Features (v1.1.0)
- 🔄 Real-time notifications via Server-Sent Events
- 🔄 Enhanced contractor management tools
- 🔄 Document upload and management
- 🔄 Advanced reporting and analytics
- 🔄 Webhook support for integrations

### Future Roadmap (v2.0.0)
- 🔮 Machine learning integration for fraud detection
- 🔮 Advanced workflow automation
- 🔮 Multi-tenant architecture
- 🔮 GraphQL API endpoints
- 🔮 Mobile app support

## 🤝 Contributing

### Development Guidelines
1. **Fork the repository** and create a feature branch
2. **Follow TypeScript best practices** and maintain type safety
3. **Write tests** for all new functionality
4. **Update documentation** for any API changes
5. **Run linting** and fix all issues before submitting
6. **Test with MCP Inspector** to ensure compatibility

### Code Quality Standards
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Configured with recommended rules and auto-fixing
- **Prettier**: Consistent code formatting across the project
- **Jest**: Unit and integration test coverage >90%
- **Documentation**: JSDoc comments for all public APIs

### Pull Request Process
```bash
# Development workflow
git checkout -b feature/your-feature-name
npm run build
npm test
npm run lint:fix
git commit -m "feat: your descriptive commit message"
git push origin feature/your-feature-name
# Create pull request on GitHub
```

## 📄 License and Legal

**MIT License** - See [LICENSE](LICENSE) file for full details.

This project is provided as-is for educational and development purposes. The sample insurance data is fictional and not representative of real claims or policies.

### Third-Party Licenses
- **@modelcontextprotocol/sdk**: MIT License
- **@azure/data-tables**: MIT License  
- **express**: MIT License
- **zod**: MIT License
- See [package.json](package.json) for complete dependency list



