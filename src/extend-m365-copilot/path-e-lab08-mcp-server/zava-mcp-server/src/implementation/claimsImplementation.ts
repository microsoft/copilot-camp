import { logger } from '../utils/logger';
import { tableStorageService } from '../services/tableStorage';
import { Claim, UpdateClaimRequest, CreateClaimRequest } from '../types';
import { ClaimNotFoundError, ValidationError } from '../utils/errors';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';

// Validation schemas
const updateClaimSchema = Joi.object({
  status: Joi.string(),
  description: Joi.string(),
  estimatedLoss: Joi.number().min(0),
  adjusterAssigned: Joi.string(),
  notes: Joi.array().items(Joi.string()),
  damageTypes: Joi.array().items(Joi.string())
});

const createClaimSchema = Joi.object({
  claimNumber: Joi.string().required(),
  policyNumber: Joi.string().required(),
  policyHolderName: Joi.string().required(),
  policyHolderEmail: Joi.string().email().required(),
  property: Joi.string().required(),
  dateOfLoss: Joi.string().isoDate().required(),
  dateReported: Joi.string().isoDate().required(),
  status: Joi.string().required(),
  damageTypes: Joi.array().items(Joi.string()).required(),
  description: Joi.string().required(),
  estimatedLoss: Joi.number().min(0).required(),
  adjusterAssigned: Joi.string(),
  notes: Joi.array().items(Joi.string())
});

export class ClaimsImplementation {
  async getAllClaims(filters?: {
    location?: string;
    damageType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Claim[]> {
    logger.info('Fetching all claims', { filters });
    
    // Pass filters to table storage service for server-side filtering
    return await tableStorageService.getClaims(filters);
  }

  async getClaimByNumber(claimNumber: string): Promise<Claim> {
    logger.info(`Fetching claim: ${claimNumber}`);
    
    const claim = await tableStorageService.getClaim(claimNumber);
    
    if (!claim) {
      throw new ClaimNotFoundError(claimNumber);
    }
    
    return claim;
  }

  async getClaimById(claimId: string): Promise<Claim> {
    logger.info(`Fetching claim by ID: ${claimId}`);
    
    // Use the updated getClaim function that handles both ID and claimNumber searches
    const claim = await tableStorageService.getClaim(claimId);
    
    if (!claim) {
      throw new ClaimNotFoundError(claimId);
    }
    
    return claim;
  }

  async updateClaim(claimNumber: string, updateData: UpdateClaimRequest): Promise<Claim> {
    // Validate request body
    const { error } = updateClaimSchema.validate(updateData);
    if (error) {
      throw new ValidationError(error.details[0]?.message || 'Invalid request data');
    }
    
    logger.info(`Updating claim: ${claimNumber}`, { updateData });
    
    const existingClaim = await tableStorageService.getClaim(claimNumber);
    
    if (!existingClaim) {
      throw new ClaimNotFoundError(claimNumber);
    }
    
    // Update the claim
    const updatedClaim: Claim = {
      ...existingClaim,
      ...updateData,
      status: updateData.status || existingClaim.status,
      updatedAt: new Date().toISOString()
    };
    
    await tableStorageService.upsertClaim(updatedClaim);
    
    return updatedClaim;
  }

  async createClaim(claimData: CreateClaimRequest): Promise<Claim> {
    // Validate request body
    const { error } = createClaimSchema.validate(claimData);
    if (error) {
      throw new ValidationError(error.details[0]?.message || 'Invalid request data');
    }
    
    logger.info('Creating new claim', { claimNumber: claimData.claimNumber });
    
    // Check if claim number already exists
    const existingClaim = await tableStorageService.getClaim(claimData.claimNumber);
    if (existingClaim) {
      throw new ValidationError(`Claim with number ${claimData.claimNumber} already exists`);
    }
    
    // Create new claim
    const newClaim: Claim = {
      id: uuidv4(),
      ...claimData,
      notes: claimData.notes || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await tableStorageService.upsertClaim(newClaim);
    
    return newClaim;
  }

  async deleteClaim(claimNumber: string): Promise<void> {
    logger.info(`Deleting claim: ${claimNumber}`);
    
    const existingClaim = await tableStorageService.getClaim(claimNumber);
    
    if (!existingClaim) {
      throw new ClaimNotFoundError(claimNumber);
    }
    
    await tableStorageService.deleteClaim(claimNumber);
  }
}

// Create a singleton instance
export const claimsImplementation = new ClaimsImplementation();