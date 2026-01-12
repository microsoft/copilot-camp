#!/usr/bin/env node

// Load environment variables from .env file first
import dotenv from 'dotenv';
import { resolve } from 'path';

// Parse command line arguments for environment
const args = process.argv.slice(2);
let targetEnv = 'dev'; // Default to dev

const envFlagIndex = args.findIndex(arg => arg.startsWith('--env=') || arg === '--env' || arg === '-e');
if (envFlagIndex !== -1) {
  const envArg = args[envFlagIndex];
  if (envArg.startsWith('--env=')) {
    targetEnv = envArg.split('=')[1];
  } else if (envFlagIndex + 1 < args.length) {
    targetEnv = args[envFlagIndex + 1];
  }
}

// Load environment-specific .env file
const envPath = resolve(process.cwd(), `env`, `.env.${targetEnv}`);
console.log(`Loading environment from: ${envPath}`);
dotenv.config({ path: envPath });

// For Azure Functions, also try to load from local.settings.json
import { existsSync, readFileSync } from 'fs';


import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { z } from 'zod';
import express from 'express';
import cors from 'cors';


// Import our existing services and types
import { logger } from './utils/logger';
import { 
  Claim, 
  ApiResponse,
  Contractor,
  PurchaseOrder,
  CreatePurchaseOrderRequest,
  Inspector
} from './types/index';
import { claimsImplementation } from './implementation/claimsImplementation';
import { inspectionsImplementation } from './implementation/inspectionsImplementation';
import { contractorsImplementation } from './implementation/contractorsImplementation';
import { inspectorsImplementation } from './implementation/inspectorsImplementation';
import { ClaimNotFoundError, InspectionNotFoundError, ContractorNotFoundError, PurchaseOrderNotFoundError } from './utils/errors';

// Zod schemas for tool arguments validation
const GetClaimsArgsSchema = z.object({
  location: z.string().optional(),
  damageType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const GetClaimArgsSchema = z.object({
  claimId: z.string(),
});

const CreateClaimArgsSchema = z.object({
  claimNumber: z.string(),
  policyNumber: z.string(),
  policyHolderName: z.string(),
  policyHolderEmail: z.string().email(),
  property: z.string(),
  dateOfLoss: z.string(),
  dateReported: z.string(),
  status: z.string(),
  damageTypes: z.array(z.string()),
  description: z.string(),
  estimatedLoss: z.number(),
  adjusterAssigned: z.string().optional(),
  notes: z.array(z.string()).optional()
});

const UpdateClaimArgsSchema = z.object({
  claimId: z.string(),
  status: z.string().optional(),
  description: z.string().optional(),
  estimatedLoss: z.number().optional(),
  adjusterAssigned: z.string().optional(),
  notes: z.array(z.string()).optional(),
  damageTypes: z.array(z.string()).optional()
});

const DeleteClaimArgsSchema = z.object({
  claimId: z.string(),
});

const GetInspectionsArgsSchema = z.object({
  claimId: z.string().optional(),
  claimNumber: z.string().optional(),
  status: z.string().optional()
});

const GetInspectionArgsSchema = z.object({
  inspectionId: z.string(),
});

const CreateInspectionArgsSchema = z.object({
  claimId: z.string(),
  taskType: z.enum(['initial', 'reinspection', 'final', 'emergency']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  scheduledDate: z.string().optional(),
  inspectorId: z.string().optional(),
  instructions: z.string()
});

const UpdateInspectionArgsSchema = z.object({
  inspectionId: z.string(),
  taskType: z.enum(['initial', 'reinspection', 'final', 'emergency']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['pending', 'scheduled', 'in-progress', 'completed', 'cancelled']).optional(),
  scheduledDate: z.string().optional(),
  completedDate: z.string().optional(),
  inspectorId: z.string().optional(),
  instructions: z.string().optional(),
  findings: z.string().optional(),
  recommendedActions: z.array(z.string()).optional(),
  flaggedIssues: z.array(z.string()).optional(),
  photos: z.array(z.string()).optional()
});

const DeleteInspectionArgsSchema = z.object({
  inspectionId: z.string(),
});

// Contractor-related schemas
const GetContractorsArgsSchema = z.object({
  name: z.string().optional(),
  specialty: z.string().optional(),
  isPreferred: z.string().optional()
});

const CreatePurchaseOrderArgsSchema = z.object({
  claimId: z.string(),
  contractorId: z.string(),
  workDescription: z.string(),
  lineItems: z.array(z.object({
    description: z.string(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    category: z.enum(['materials', 'labor', 'equipment', 'permits'])
  })),
  notes: z.array(z.string()).optional()
});

const GetPurchaseOrderArgsSchema = z.object({
  poId: z.string(),
});

// Inspector-related schemas
const GetInspectorsArgsSchema = z.object({
  specialization: z.string().optional()
});

const GetInspectorArgsSchema = z.object({
  inspectorId: z.string(),
});

// Available tools



// Zod schemas for prompt arguments validation
const ClaimsAnalysisPromptArgsSchema = z.object({
  claimId: z.string(),
  analysisType: z.enum(['damage_assessment', 'cost_estimation', 'fraud_detection']).optional()
});

const DamageAssessmentPromptArgsSchema = z.object({
  claimId: z.string(),
  damageType: z.string(),
  severity: z.enum(['minor', 'moderate', 'major', 'total']).optional()
});

const InspectionReportPromptArgsSchema = z.object({
  inspectionId: z.string(),
  reportType: z.enum(['preliminary', 'detailed', 'final']).optional()
});

// Create MCP server
const server = new Server({
  name: 'zava-claims-mcp-server',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
    prompts: {},
  },
});

// Available tools
const TOOLS = [
  {
    name: 'get_claims',
    description: 'Retrieve all insurance claims from the system with optional filters for location, damage type, and time range',
    inputSchema: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'Filter claims by property location (partial address match, case-insensitive)',
        },
        damageType: {
          type: 'string',
          description: 'Filter claims by damage type (partial match, case-insensitive)',
        },
        startDate: {
          type: 'string',
          description: 'Filter claims with dateOfLoss on or after this date (ISO 8601 format, e.g., "2025-01-01")',
        },
        endDate: {
          type: 'string',
          description: 'Filter claims with dateOfLoss on or before this date (ISO 8601 format, e.g., "2025-12-31")',
        },
      },
    },
  },
  {
    name: 'get_claim',
    description: 'Retrieve a specific insurance claim by ID or claim number',
    inputSchema: {
      type: 'object',
      properties: {
        claimId: {
          type: 'string',
          description: 'The claim ID (e.g., "1", "2") or claim number (e.g., "CN202504990")',
        },
      },
      required: ['claimId'],
    },
  },
  {
    name: 'create_claim',
    description: 'Create a new insurance claim',
    inputSchema: {
      type: 'object',
      properties: {
        claimNumber: { type: 'string', description: 'Unique claim number' },
        policyNumber: { type: 'string', description: 'Policy number' },
        policyHolderName: { type: 'string', description: 'Policy holder full name' },
        policyHolderEmail: { type: 'string', description: 'Policy holder email address' },
        property: { type: 'string', description: 'Property address' },
        dateOfLoss: { type: 'string', description: 'ISO date string' },
        dateReported: { type: 'string', description: 'ISO date string' },
        status: { type: 'string', description: 'Current claim status' },
        damageTypes: { type: 'array', items: { type: 'string' }, description: 'Array of damage types' },
        description: { type: 'string', description: 'Claim description' },
        estimatedLoss: { type: 'number', description: 'Estimated loss amount' },
        adjusterAssigned: { type: 'string', description: 'Assigned adjuster ID' },
        notes: { type: 'array', items: { type: 'string' }, description: 'Additional notes' }
      },
      required: ['claimNumber', 'policyNumber', 'policyHolderName', 'policyHolderEmail', 'property', 'dateOfLoss', 'dateReported', 'status', 'damageTypes', 'description', 'estimatedLoss']
    },
  },
  {
    name: 'update_claim',
    description: 'Update an existing insurance claim',
    inputSchema: {
      type: 'object',
      properties: {
        claimId: { type: 'string', description: 'The claim ID or claim number' },
        status: { type: 'string', description: 'Updated claim status' },
        description: { type: 'string', description: 'Updated claim description' },
        estimatedLoss: { type: 'number', description: 'Updated estimated loss amount' },
        adjusterAssigned: { type: 'string', description: 'Updated assigned adjuster ID' },
        notes: { type: 'array', items: { type: 'string' }, description: 'Updated notes' },
        damageTypes: { type: 'array', items: { type: 'string' }, description: 'Updated damage types' }
      },
      required: ['claimId']
    },
  },
  {
    name: 'delete_claim',
    description: 'Delete an insurance claim',
    inputSchema: {
      type: 'object',
      properties: {
        claimId: { type: 'string', description: 'The claim ID or claim number' },
      },
      required: ['claimId']
    },
  },
  {
    name: 'get_inspections',
    description: 'Retrieve inspection tasks, optionally filtered by claim ID, claim number, or status',
    inputSchema: {
      type: 'object',
      properties: {
        claimId: { type: 'string', description: 'Filter by claim ID' },
        claimNumber: { type: 'string', description: 'Filter by claim number (e.g., "CN202504990")' },
        status: { type: 'string', description: 'Filter by status' }
      },
    },
  },
  {
    name: 'get_inspection',
    description: 'Retrieve a specific inspection task by ID',
    inputSchema: {
      type: 'object',
      properties: {
        inspectionId: { type: 'string', description: 'The inspection task ID' },
      },
      required: ['inspectionId']
    },
  },
  {
    name: 'create_inspection',
    description: 'Create a new inspection task',
    inputSchema: {
      type: 'object',
      properties: {
        claimId: { type: 'string' },
        taskType: { type: 'string', enum: ['initial', 'reinspection', 'final', 'emergency'] },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
        scheduledDate: { type: 'string', description: 'ISO date string' },
        inspectorId: { type: 'string' },
        instructions: { type: 'string' }
      },
      required: ['claimId', 'taskType', 'priority', 'instructions']
    },
  },
  {
    name: 'update_inspection',
    description: 'Update an existing inspection task',
    inputSchema: {
      type: 'object',
      properties: {
        inspectionId: { type: 'string' },
        taskType: { type: 'string', enum: ['initial', 'reinspection', 'final', 'emergency'] },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
        status: { type: 'string', enum: ['pending', 'scheduled', 'in-progress', 'completed', 'cancelled'] },
        scheduledDate: { type: 'string' },
        completedDate: { type: 'string' },
        inspectorId: { type: 'string' },
        instructions: { type: 'string' },
        findings: { type: 'string' },
        recommendedActions: { type: 'array', items: { type: 'string' } },
        flaggedIssues: { type: 'array', items: { type: 'string' } }
      },
      required: ['inspectionId']
    },
  },
  {
    name: 'delete_inspection',
    description: 'Delete an inspection task',
    inputSchema: {
      type: 'object',
      properties: {
        inspectionId: { type: 'string', description: 'The inspection task ID' },
      },
      required: ['inspectionId']
    },
  },
  {
    name: 'get_contractors',
    description: 'Retrieve contractors with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Filter by contractor name' },
        specialty: { type: 'string', description: 'Filter by contractor specialty' },
        isPreferred: { type: 'string', description: 'Filter by preferred status (true/false)' }
      },
    },
  },
  {
    name: 'create_purchase_order',
    description: 'Create a new purchase order for contractor work',
    inputSchema: {
      type: 'object',
      properties: {
        claimId: { type: 'string', description: 'The claim ID' },
        contractorId: { type: 'string', description: 'The contractor ID' },
        workDescription: { type: 'string', description: 'Description of work to be performed' },
        lineItems: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              description: { type: 'string', description: 'Line item description' },
              quantity: { type: 'number', description: 'Quantity', minimum: 1 },
              unitPrice: { type: 'number', description: 'Unit price', minimum: 0 },
              category: { type: 'string', enum: ['materials', 'labor', 'equipment', 'permits'], description: 'Line item category' }
            },
            required: ['description', 'quantity', 'unitPrice', 'category']
          },
          description: 'Array of line items for the purchase order'
        },
        notes: { type: 'array', items: { type: 'string' }, description: 'Optional notes' }
      },
      required: ['claimId', 'contractorId', 'workDescription', 'lineItems']
    },
  },
  {
    name: 'get_purchase_order',
    description: 'Retrieve a specific purchase order by ID',
    inputSchema: {
      type: 'object',
      properties: {
        poId: { type: 'string', description: 'The purchase order ID' },
      },
      required: ['poId']
    },
  },
  {
    name: 'get_inspectors',
    description: 'Retrieve all inspectors with optional filtering by specialization',
    inputSchema: {
      type: 'object',
      properties: {
        specialization: { type: 'string', description: 'Filter inspectors by specialization (e.g., "Roofing", "Water Damage", "Fire Damage")' }
      },
    },
  },
  {
    name: 'get_inspector',
    description: 'Retrieve a specific inspector by ID',
    inputSchema: {
      type: 'object',
      properties: {
        inspectorId: { type: 'string', description: 'The inspector ID' },
      },
      required: ['inspectorId']
    },
  },
] as const;

// Prompt definitions
const PROMPTS = [
  {
    name: 'claims_analysis',
    description: 'Generate a comprehensive analysis prompt for insurance claims processing',
    arguments: [
      {
        name: 'claimId',
        description: 'The unique identifier of the claim to analyze',
        required: true,
      },
      {
        name: 'analysisType',
        description: 'Type of analysis to perform (damage_assessment, cost_estimation, fraud_detection)',
        required: false,
      },
    ],
  },
  {
    name: 'damage_assessment',
    description: 'Generate a detailed damage assessment prompt for property evaluation',
    arguments: [
      {
        name: 'claimId',
        description: 'The claim ID for the damaged property',
        required: true,
      },
      {
        name: 'damageType',
        description: 'The type of damage reported (e.g., water, fire, storm, theft)',
        required: true,
      },
      {
        name: 'severity',
        description: 'The severity level of the damage (minor, moderate, major, total)',
        required: false,
      },
    ],
  },
  {
    name: 'inspection_report',
    description: 'Generate a structured prompt for property inspection reporting',
    arguments: [
      {
        name: 'inspectionId',
        description: 'The unique identifier of the inspection',
        required: true,
      },
      {
        name: 'reportType',
        description: 'Type of inspection report (preliminary, detailed, final)',
        required: false,
      },
    ],
  },
] as const;

// No authentication interfaces or functions needed for anonymous server

// Tool execution function (anonymous access)
async function executeTool(name: string, args: any, req?: express.Request) {
  // Start comprehensive logging for MCP tool call
  const metrics = logger.mcpToolStart(name, args);
  
  try {
    // No authentication checks - all tools are public

    switch (name) {
      case 'get_claims': {
        const parsed = GetClaimsArgsSchema.parse(args);
        const filters = {
          location: parsed.location,
          damageType: parsed.damageType,
          startDate: parsed.startDate,
          endDate: parsed.endDate,
        };
        
        const claims = await claimsImplementation.getAllClaims(filters);
        
        const response: ApiResponse<Claim[]> = {
          success: true,
          data: claims,
          message: 'Claims retrieved successfully',
          timestamp: new Date().toISOString()
        };

        logger.mcpToolSuccess(metrics, response);
        return response;
      }

      case 'get_claim': {
        const parsed = GetClaimArgsSchema.parse(args);
        const claim = await claimsImplementation.getClaimById(parsed.claimId);

        const response: ApiResponse<Claim> = {
          success: true,
          data: claim,
          message: 'Claim retrieved successfully',
          timestamp: new Date().toISOString()
        };

        logger.mcpToolSuccess(metrics, response);
        return response;
      }

      case 'create_claim': {
        const parsed = CreateClaimArgsSchema.parse(args);
        const newClaim = await claimsImplementation.createClaim(parsed);

        const response: ApiResponse<Claim> = {
          success: true,
          data: newClaim,
          message: 'Claim created successfully',
          timestamp: new Date().toISOString()
        };

        logger.mcpToolSuccess(metrics, response);
        return response;
      }

      case 'update_claim': {
        const parsed = UpdateClaimArgsSchema.parse(args);
        const { claimId, ...updateData } = parsed;
        const updatedClaim = await claimsImplementation.updateClaim(claimId, updateData);

        const response: ApiResponse<Claim> = {
          success: true,
          data: updatedClaim,
          message: 'Claim updated successfully',
          timestamp: new Date().toISOString()
        };

        logger.mcpToolSuccess(metrics, response);
        return response;
      }

      case 'delete_claim': {
        const parsed = DeleteClaimArgsSchema.parse(args);
        await claimsImplementation.deleteClaim(parsed.claimId);

        const response: ApiResponse<null> = {
          success: true,
          data: null,
          message: 'Claim deleted successfully',
          timestamp: new Date().toISOString()
        };

        logger.mcpToolSuccess(metrics, response);
        return response;
      }

      case 'get_inspections': {
        const parsed = GetInspectionsArgsSchema.parse(args);
        const inspections = await inspectionsImplementation.getAllInspections(parsed.claimId, parsed.claimNumber, parsed.status);

        const response: ApiResponse<any[]> = {
          success: true,
          data: inspections,
          message: 'Inspections retrieved successfully',
          timestamp: new Date().toISOString()
        };

        logger.mcpToolSuccess(metrics, response);
        return response;
      }

      case 'get_inspection': {
        const parsed = GetInspectionArgsSchema.parse(args);
        const inspection = await inspectionsImplementation.getInspectionById(parsed.inspectionId);

        const response: ApiResponse<any> = {
          success: true,
          data: inspection,
          message: 'Inspection retrieved successfully',
          timestamp: new Date().toISOString()
        };

        logger.mcpToolSuccess(metrics, response);
        return response;
      }

      case 'create_inspection': {
        const parsed = CreateInspectionArgsSchema.parse(args);
        const newInspection = await inspectionsImplementation.createInspectionTask(parsed);

        const response: ApiResponse<any> = {
          success: true,
          data: newInspection,
          message: 'Inspection created successfully',
          timestamp: new Date().toISOString()
        };

        logger.mcpToolSuccess(metrics, response);
        return response;
      }

      case 'update_inspection': {
        const parsed = UpdateInspectionArgsSchema.parse(args);
        const { inspectionId, ...updateData } = parsed;
        const updatedInspection = await inspectionsImplementation.updateInspectionTask(inspectionId, updateData);

        const response: ApiResponse<any> = {
          success: true,
          data: updatedInspection,
          message: 'Inspection updated successfully',
          timestamp: new Date().toISOString()
        };

        logger.mcpToolSuccess(metrics, response);
        return response;
      }

      case 'delete_inspection': {
        const parsed = DeleteInspectionArgsSchema.parse(args);
        await inspectionsImplementation.deleteInspectionTask(parsed.inspectionId);

        const response: ApiResponse<null> = {
          success: true,
          data: null,
          message: 'Inspection deleted successfully',
          timestamp: new Date().toISOString()
        };

        logger.mcpToolSuccess(metrics, response);
        return response;
      }

      case 'get_contractors': {
        const parsed = GetContractorsArgsSchema.parse(args);
        const contractors = await contractorsImplementation.getAllContractors(parsed.specialty, parsed.isPreferred);

        const response: ApiResponse<Contractor[]> = {
          success: true,
          data: contractors,
          message: 'Contractors retrieved successfully',
          timestamp: new Date().toISOString()
        };

        logger.mcpToolSuccess(metrics, response);
        return response;
      }

      case 'create_purchase_order': {
        const parsed = CreatePurchaseOrderArgsSchema.parse(args);
        const newPO = await contractorsImplementation.createPurchaseOrder(parsed);

        const response: ApiResponse<PurchaseOrder> = {
          success: true,
          data: newPO,
          message: 'Purchase order created successfully',
          timestamp: new Date().toISOString()
        };

        logger.mcpToolSuccess(metrics, response);
        return response;
      }

      case 'get_purchase_order': {
        const parsed = GetPurchaseOrderArgsSchema.parse(args);
        const purchaseOrder = await contractorsImplementation.getPurchaseOrderById(parsed.poId);

        const response: ApiResponse<PurchaseOrder> = {
          success: true,
          data: purchaseOrder,
          message: 'Purchase order retrieved successfully',
          timestamp: new Date().toISOString()
        };

        logger.mcpToolSuccess(metrics, response);
        return response;
      }

      case 'get_inspectors': {
        const parsed = GetInspectorsArgsSchema.parse(args);
        const inspectors = await inspectorsImplementation.getAllInspectors(parsed.specialization);

        const response: ApiResponse<Inspector[]> = {
          success: true,
          data: inspectors,
          message: 'Inspectors retrieved successfully',
          timestamp: new Date().toISOString()
        };

        logger.mcpToolSuccess(metrics, response);
        return response;
      }

      case 'get_inspector': {
        const parsed = GetInspectorArgsSchema.parse(args);
        const inspector = await inspectorsImplementation.getInspectorById(parsed.inspectorId);

        if (!inspector) {
          const response: ApiResponse<null> = {
            success: false,
            error: 'Inspector not found',
            message: 'Inspector not found',
            timestamp: new Date().toISOString()
          };
          logger.mcpToolError(metrics, new Error('Inspector not found'));
          return response;
        }

        const response: ApiResponse<Inspector> = {
          success: true,
          data: inspector,
          message: 'Inspector retrieved successfully',
          timestamp: new Date().toISOString()
        };

        logger.mcpToolSuccess(metrics, response);
        return response;
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    logger.mcpToolError(metrics, error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}

// Prompt generation function
async function generatePrompt(name: string, args: any): Promise<string> {
  try {
    switch (name) {
      case 'claims_analysis': {
        const parsed = ClaimsAnalysisPromptArgsSchema.parse(args);
        logger.info(`MCP HTTP: Generating claims analysis prompt for claim ${parsed.claimId}`);
        
        // Fetch claim data to include in prompt
        const claim = await claimsImplementation.getClaimById(parsed.claimId);

        const analysisType = parsed.analysisType || 'damage_assessment';
        let promptContent = '';

        switch (analysisType) {
          case 'damage_assessment':
            promptContent = `# Insurance Claim Damage Assessment

## Claim Information
- **Claim ID**: ${claim.id}
- **Policy Number**: ${claim.policyNumber}
- **Date Reported**: ${claim.dateReported}
- **Date of Loss**: ${claim.dateOfLoss}
- **Current Status**: ${claim.status}
- **Estimated Loss**: $${claim.estimatedLoss?.toLocaleString() || 'Not specified'}

## Property Details
- **Property Address**: ${claim.property}

## Damage Information
${claim.damageTypes?.map((damage: string) => `- ${damage}`).join('\\n') || '- No damage details recorded'}

## Assessment Instructions
Please provide a comprehensive damage assessment including:
1. Analysis of reported damage types and severity levels
2. Evaluation of estimated loss amount reasonableness
3. Identification of any potential issues or red flags
4. Recommendations for next steps in claims processing
5. Suggested inspection priorities if field inspection is needed

## Current Description
${claim.description}

${claim.notes?.length ? `## Additional Notes\n${claim.notes.map((note: string, i: number) => `${i + 1}. ${note}`).join('\\n')}` : ''}`;
            break;

          case 'cost_estimation':
            promptContent = `# Insurance Claim Cost Estimation Analysis

## Claim Overview
- **Claim ID**: ${claim.id}
- **Property Address**: ${claim.property}
- **Current Estimated Loss**: $${claim.estimatedLoss?.toLocaleString() || 'Not specified'}
- **Policy Limits**: Please check policy for coverage limits

## Cost Analysis Instructions
Based on the claim information provided, please:
1. Review the current estimated loss amount for accuracy
2. Break down potential costs by damage category
3. Consider regional pricing variations for the property location
4. Identify any costs that may exceed reasonable market rates
5. Suggest cost-saving alternatives while maintaining quality standards
6. Flag any estimates that require additional verification

## Damage Summary
${claim.damageTypes?.map((damage: string) => `- ${damage}`).join('\\n') || 'No damage details available'}

## Current Claim Description
${claim.description}`;
            break;

          case 'fraud_detection':
            promptContent = `# Insurance Claim Fraud Detection Review

## Claim Profile
- **Claim ID**: ${claim.id}
- **Report Date**: ${claim.dateReported}
- **Date of Loss**: ${claim.dateOfLoss}
- **Time Between Loss and Report**: ${new Date(claim.dateReported).getTime() - new Date(claim.dateOfLoss).getTime() > 0 ? Math.ceil((new Date(claim.dateReported).getTime() - new Date(claim.dateOfLoss).getTime()) / (1000 * 60 * 60 * 24)) + ' days' : 'Same day or negative time difference'}
- **Estimated Loss**: $${claim.estimatedLoss?.toLocaleString() || 'Not specified'}

## Fraud Risk Assessment Instructions
Please analyze this claim for potential fraud indicators including:
1. **Timing Analysis**: Evaluate the timing between incident and report
2. **Loss Estimation**: Assess if estimated loss is reasonable for damage described
3. **Consistency Check**: Look for inconsistencies in the claim narrative
4. **Pattern Recognition**: Identify any unusual patterns or red flags
5. **Documentation Quality**: Assess completeness and quality of provided information
6. **Risk Score**: Assign a risk score (Low/Medium/High) with justification

## Claim Details
**Description**: ${claim.description}

**Damage Types**: 
${claim.damageTypes?.map((damage: string) => `- ${damage}`).join('\\n') || 'No damage types recorded'}

**Property Address**: ${claim.property}

## Additional Context
${claim.notes?.length ? claim.notes.map((note: string, i: number) => `${i + 1}. ${note}`).join('\\n') : 'No additional notes provided'}`;
            break;
        }

        return promptContent;
      }

      case 'damage_assessment': {
        const parsed = DamageAssessmentPromptArgsSchema.parse(args);
        logger.info(`MCP HTTP: Generating damage assessment prompt for claim ${parsed.claimId}`);
        
        const claim = await claimsImplementation.getClaimById(parsed.claimId);

        const severity = parsed.severity || 'moderate';
        const promptContent = `# Property Damage Assessment Report

## Property Information
- **Address**: ${claim.property}

## Damage Type Focus: ${parsed.damageType}
**Assessment Severity Level**: ${severity}

## Assessment Guidelines
Please provide a detailed assessment covering:

### 1. Structural Impact
- Evaluate structural integrity concerns
- Identify load-bearing elements affected
- Assess foundation or framing damage

### 2. Safety Considerations
- Immediate safety hazards requiring attention
- Habitability concerns
- Required emergency repairs

### 3. Repair Scope and Timeline
- Priority levels for different repair tasks
- Estimated timeline for restoration
- Temporary measures needed

### 4. Cost Implications
- Preliminary cost estimates by category
- Factors that could increase costs
- Potential for cost savings

### 5. Documentation Requirements
- Additional photos or documentation needed
- Specialist inspections required
- Expert evaluations recommended

## Current Claim Status
- **Estimated Loss**: $${claim.estimatedLoss?.toLocaleString() || 'Pending assessment'}
- **Adjuster**: ${claim.adjusterAssigned || 'Not assigned'}
- **Status**: ${claim.status}

## Incident Details
**Date of Loss**: ${claim.dateOfLoss}
**Description**: ${claim.description}

${claim.damageTypes?.length ? `## Recorded Damage Types
${claim.damageTypes.map((damage: string) => `- ${damage}`).join('\\n')}` : ''}`;

        return promptContent;
      }

      case 'inspection_report': {
        const parsed = InspectionReportPromptArgsSchema.parse(args);
        logger.info(`MCP HTTP: Generating inspection report prompt for inspection ${parsed.inspectionId}`);
        
        // Note: In a real implementation, you'd fetch inspection data
        // For now, we'll create a comprehensive template
        const reportType = parsed.reportType || 'detailed';
        
        const promptContent = `# Property Inspection Report Template

## Inspection Details
- **Inspection ID**: ${parsed.inspectionId}
- **Report Type**: ${reportType}
- **Date**: [To be filled during inspection]
- **Inspector**: [Inspector name and credentials]
- **Weather Conditions**: [Weather at time of inspection]

## Report Structure

### 1. Executive Summary
- Overall property condition
- Key findings and concerns
- Immediate action items
- Estimated scope of work

### 2. Exterior Inspection
#### Roof System
- Shingles/roofing material condition
- Gutters and downspouts
- Flashing and penetrations
- Chimneys and vents

#### Siding and Structure
- Exterior wall condition
- Foundation inspection
- Windows and doors
- Driveway and walkways

### 3. Interior Inspection
#### Structural Elements
- Wall condition and damage
- Floor systems
- Ceiling condition
- Stairways and railings

#### Systems Assessment
- Electrical system impact
- Plumbing system damage
- HVAC system condition
- Insulation and ventilation

### 4. Damage Documentation
#### Primary Damage Areas
- [Document each damaged area with:]
  - Location and description
  - Extent of damage
  - Probable cause
  - Repair recommendations
  - Priority level (1-5)

#### Secondary/Related Damage
- [Document any secondary damage from primary incident]
- [Note any pre-existing conditions]

### 5. Photo Documentation
- [Reference photo numbers and descriptions]
- [Key areas requiring visual documentation]
- [Before/during/after comparisons if applicable]

### 6. Recommendations
#### Immediate Actions Required
- Safety concerns requiring immediate attention
- Emergency repairs needed
- Temporary protective measures

#### Repair Recommendations
- Scope of work by trade
- Material specifications
- Code compliance requirements
- Permit requirements

### 7. Cost Considerations
- Preliminary cost estimates by category
- Factors affecting final costs
- Alternative repair approaches
- Value engineering opportunities

## Additional Instructions for Inspector
${reportType === 'preliminary' ? 
  '- Focus on safety assessment and immediate needs\\n- Provide rough estimates for emergency repairs\\n- Identify areas requiring detailed follow-up inspection' :
  reportType === 'final' ?
  '- Verify completion of all repair work\\n- Document quality of repairs\\n- Confirm code compliance\\n- Provide final condition assessment' :
  '- Provide comprehensive damage assessment\\n- Include detailed repair specifications\\n- Document all findings thoroughly\\n- Prepare for contractor bidding process'
}

## Quality Control Checklist
- [ ] All damaged areas documented
- [ ] Photos correlate with written descriptions
- [ ] Repair recommendations are specific and actionable
- [ ] Safety concerns clearly identified
- [ ] Cost estimates are reasonable and supported
- [ ] Report is clear and professional`;

        return promptContent;
      }

      default:
        throw new Error(`Unknown prompt: ${name}`);
    }
  } catch (error) {
    logger.error(`Error generating prompt ${name}:`, error);
    throw error;
  }
}


// Authentication is disabled - this is an anonymous MCP server

// Create Express app
const app = express();
const port = parseInt(process.env.PORT || '3001', 10);
const host = process.env.HOST || '127.0.0.1'; // Bind to localhost only for security

// Security: Allowlist of permitted origins to prevent DNS rebinding attacks
const allowedOrigins = [
  'https://x8m4kwmz-3001.aue.devtunnels.ms',
  'https://onlinemcpinspector.com',
  'https://localhost:3001',
  'http://127.0.0.1:3001',
  // Allow all localhost ports for development tools (MCP Inspector, etc.)
  'http://localhost:',
  'http://127.0.0.1:',
  'https://localhost:',
  'https://127.0.0.1:',
  // Add VS Code dev server origins
  'vscode-webview://',
  // Common development URLs
  'https://login.microsoftonline.com',
  'https://login.live.com',
  'https://account.live.com',
  // Add devtunnel URL from environment (set by deploy script)
  ...(process.env.DEVTUNNEL_URL ? [process.env.DEVTUNNEL_URL] : []),
  // Add any additional trusted origins via environment variable (comma-separated)
  ...(process.env.ADDITIONAL_ALLOWED_ORIGINS?.split(',').map(o => o.trim()).filter(o => o) || [])
];

// Origin validation middleware to prevent DNS rebinding attacks
const validateOrigin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const origin = req.get('Origin') || req.get('Referer');
  
  // Allow requests without origin (direct API calls, curl, etc.)
  if (!origin) {
    return next();
  }

  // Check if origin is in allowlist or matches VS Code webview pattern
  const isAllowed = allowedOrigins.some(allowed => {
    if (allowed.endsWith('://')) {
      return origin.startsWith(allowed);
    }
    // Handle localhost/127.0.0.1 with any port (e.g., "http://localhost:")
    if (allowed.endsWith(':')) {
      return origin.startsWith(allowed);
    }
    return origin === allowed || origin.startsWith(allowed + '/');
  });

  if (!isAllowed) {
    logger.warn(`Rejected request from unauthorized origin: ${origin}`);
    return res.status(403).json({
      error: 'Forbidden: Origin not allowed',
      origin: origin
    });
  }

  next();
};

// Middleware
app.use(validateOrigin);
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.endsWith('://')) {
        return origin.startsWith(allowed);
      }
      // Handle localhost/127.0.0.1 with any port (e.g., "http://localhost:")
      if (allowed.endsWith(':')) {
        return origin.startsWith(allowed);
      }
      return origin === allowed || origin.startsWith(allowed + '/');
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true
}));
app.use(express.json());

// No authentication middleware - all endpoints are public

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'zava-claims-mcp-server',
    authentication: 'No authentication'
  });
});

// No OAuth endpoints - authentication is disabled

// No OAuth discovery endpoints - authentication is disabled

// MCP stats endpoint
app.get('/mcp/stats', async (req, res) => {
  try {
    logger.mcpStats();
    res.json({
      success: true,
      message: 'Stats displayed in server console',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error displaying stats:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    });
  }
});

// MCP endpoints
app.get('/mcp/tools', async (req, res) => {
  try {
    res.json({
      tools: TOOLS
    });
  } catch (error) {
    logger.error('Error listing tools:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    });
  }
});

// Execute tool endpoint
app.post('/mcp/tools/call', async (req, res) => {
  try {
    const { name, arguments: args } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Tool name is required',
        timestamp: new Date().toISOString()
      });
    }

    const result = await executeTool(name, args || {}, req);
    res.json(result);
  } catch (error) {
    logger.error('Error executing tool:', error);
    
    // Handle errors without authentication checks
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    res.status(500).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

// MCP JSON-RPC endpoint for protocol communication
app.post('/mcp/messages', async (req, res) => {
  try {
    const { jsonrpc, method, params, id } = req.body;
    
    if (jsonrpc !== '2.0') {
      return res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32600,
          message: 'Invalid Request'
        }
      });
    }

    let result;
    
    switch (method) {
      case 'initialize':
        result = {
          protocolVersion: '2025-06-18',
          capabilities: {
            tools: {
              listChanged: true
            },
            prompts: {
              listChanged: true
            }
          },
          serverInfo: {
            name: 'zava-claims-mcp-server',
            version: '1.0.0'
          }
        };
        break;
        
      case 'tools/list':
        result = {
          tools: TOOLS.map(tool => ({
            name: tool.name,
            description: tool.description,
            inputSchema: tool.inputSchema
          }))
        };
        break;
        
      case 'prompts/list':
        result = {
          prompts: PROMPTS.map(prompt => ({
            name: prompt.name,
            description: prompt.description,
            arguments: prompt.arguments
          }))
        };
        break;
        
      case 'tools/call':
        const { name, arguments: args } = params;
        if (!name) {
          return res.json({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32602,
              message: 'Invalid params: name is required'
            }
          });
        }
        
        try {
          const toolResult = await executeTool(name, args || {}, req);
          result = {
            content: [
              {
                type: 'text',
                text: JSON.stringify(toolResult, null, 2)
              }
            ]
          };
        } catch (toolError) {
          const errorMessage = toolError instanceof Error ? toolError.message : 'Unknown error';
          
          return res.status(500).json({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32603,
              message: `Tool execution failed: ${errorMessage}`
            }
          });
        }
        break;
        
      case 'prompts/get':
        const { name: promptName, arguments: promptArgs } = params;
        if (!promptName) {
          return res.json({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32602,
              message: 'Invalid params: name is required'
            }
          });
        }
        
        try {
          const promptResult = await generatePrompt(promptName, promptArgs || {});
          result = {
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: promptResult
                }
              }
            ]
          };
        } catch (promptError) {
          return res.json({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32603,
              message: `Prompt generation failed: ${promptError instanceof Error ? promptError.message : 'Unknown error'}`
            }
          });
        }
        break;
        
      default:
        return res.json({
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`
          }
        });
    }
    
    res.json({
      jsonrpc: '2.0',
      id,
      result
    });
  } catch (error) {
    logger.error('Error in MCP JSON-RPC handler:', error);
    res.json({
      jsonrpc: '2.0',
      id: req.body.id,
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : 'Internal error'
      }
    });
  }
});

// Server-sent events endpoint for streaming
app.get('/mcp/stream', (req, res) => {
  // Set SSE headers (CORS headers are handled by middleware)
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Send initial connection event
  res.write(`data: ${JSON.stringify({
    type: 'connection',
    timestamp: new Date().toISOString(),
    message: 'Connected to Zava Claims MCP Stream'
  })}\n\n`);

  // Keep connection alive with periodic heartbeats
  const heartbeat = setInterval(() => {
    res.write(`data: ${JSON.stringify({
      type: 'heartbeat',
      timestamp: new Date().toISOString()
    })}\n\n`);
  }, 30000);

  // Handle client disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    logger.info('MCP Stream client disconnected');
  });

  logger.info('MCP Stream client connected');
});

// Execute tool with streaming response
app.post('/mcp/stream/tools/call', async (req, res) => {
  try {
    const { name, arguments: args } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Tool name is required',
        timestamp: new Date().toISOString()
      });
    }

    // No authentication required for anonymous server

    // Set SSE headers for streaming response
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Send start event
    res.write(`data: ${JSON.stringify({
      type: 'start',
      tool: name,
      timestamp: new Date().toISOString()
    })}\n\n`);

    try {
      const result = await executeTool(name, args || {}, req);
      
      // Send result event
      res.write(`data: ${JSON.stringify({
        type: 'result',
        tool: name,
        data: result,
        timestamp: new Date().toISOString()
      })}\n\n`);
    } catch (toolError) {
      const errorMessage = toolError instanceof Error ? toolError.message : 'Unknown error occurred';
      
      // Send error event
      res.write(`data: ${JSON.stringify({
        type: 'error',
        tool: name,
        error: errorMessage,
        timestamp: new Date().toISOString()
      })}\n\n`);
    }

    // Send completion event
    res.write(`data: ${JSON.stringify({
      type: 'complete',
      tool: name,
      timestamp: new Date().toISOString()
    })}\n\n`);

    res.end();
  } catch (error) {
    logger.error('Error in streaming tool execution:', error);
    
    // If headers not sent yet, return error response
    if (!res.headersSent) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return res.status(500).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
    }
    
    // If streaming already started, send error event
    res.write(`data: ${JSON.stringify({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    })}\n\n`);
    res.end();
  }
});

// Start server
async function main() {
  try {
    app.listen(port, host, () => {
      // Use the enhanced startup logging
      logger.mcpServerStart(port, host);
      
      logger.info(`Security: Anonymous mode - no authentication required`);
      logger.info(`CORS: ${allowedOrigins.length} allowed origins configured`);
      
      logger.info(`\n🏥 Health & Status Endpoints:`);
      logger.info(`    GET  /health - Health check (public)`);
      
      logger.info(`\n🛠️ MCP Tool Endpoints (public access):`);
      logger.info(`    GET  /mcp/tools - List available tools`);
      logger.info(`    POST /mcp/tools/call - Execute tool directly`);
      logger.info(`    POST /mcp/messages - MCP JSON-RPC protocol endpoint`);
      logger.info(`    GET  /mcp/stream - SSE stream connection`);
      logger.info(`    POST /mcp/stream/tools/call - Execute tool with streaming response`);
      
      logger.info(`\n� Available Endpoints (No Authentication Required):`);
      logger.info(`    Health Check: http://${host}:${port}/health`);
      logger.info(`    List Tools: http://${host}:${port}/mcp/tools`);
      logger.info(`    Execute Tools: http://${host}:${port}/mcp/tools/call`);
      logger.info(`    MCP Protocol: http://${host}:${port}/mcp/messages`);
      
      logger.info(`\n🎉 Anonymous MCP Server ready! All tools are publicly accessible.`);
    });
  } catch (error) {
    logger.error('Failed to start HTTP MCP server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error('Unhandled error in HTTP MCP server:', error);
  process.exit(1);
});