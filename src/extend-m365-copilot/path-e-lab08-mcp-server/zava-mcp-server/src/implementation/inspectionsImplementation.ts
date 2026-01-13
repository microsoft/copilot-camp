import { logger } from '../utils/logger';
import { tableStorageService } from '../services/tableStorage';
import { 
  InspectionTask, 
  CreateInspectionTaskRequest,
  UpdateInspectionTaskRequest 
} from '../types';
import { InspectionNotFoundError, ValidationError } from '../utils/errors';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';

// Validation schemas
const createInspectionTaskSchema = Joi.object({
  claimId: Joi.string().required(),
  taskType: Joi.string().valid('initial', 'reinspection', 'final', 'emergency').required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').required(),
  scheduledDate: Joi.string().isoDate().optional(),
  inspectorId: Joi.string().optional(),
  instructions: Joi.string().required()
});

const updateInspectionTaskSchema = Joi.object({
  taskType: Joi.string().valid('initial', 'reinspection', 'final', 'emergency').optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
  status: Joi.string().valid('pending', 'scheduled', 'in-progress', 'completed', 'cancelled').optional(),
  scheduledDate: Joi.string().isoDate().optional(),
  completedDate: Joi.string().isoDate().optional(),
  inspectorId: Joi.string().optional(),
  instructions: Joi.string().optional(),
  findings: Joi.string().optional(),
  recommendedActions: Joi.array().items(Joi.string()).optional(),
  flaggedIssues: Joi.array().items(Joi.string()).optional()
});

export class InspectionsImplementation {
  async getAllInspections(claimId?: string, claimNumber?: string, status?: string): Promise<InspectionTask[]> {
    logger.info('Fetching inspection tasks from Azure Table Storage', { claimId, claimNumber, status });
    
    // Query table storage with filters directly for optimal performance
    const inspections = await tableStorageService.getInspections(claimId, claimNumber, status);
    
    return inspections;
  }

  async createInspectionTask(taskData: CreateInspectionTaskRequest): Promise<InspectionTask> {
    // Validate request body
    const { error } = createInspectionTaskSchema.validate(taskData);
    if (error) {
      throw new ValidationError(error.details[0]?.message || 'Invalid request data');
    }
    
    logger.info('Creating new inspection task in Azure Table Storage', { taskData });
    
    // Get claim info for claim number (fetch from claims table)
    const claims = await tableStorageService.getClaims();
    const claim = claims.find(c => c.id === taskData.claimId);
    const claimNumber = claim?.claimNumber || 'CN000000000';
    
    // Create new inspection task
    const newTask: InspectionTask = {
      id: uuidv4(),
      claimId: taskData.claimId,
      claimNumber: claimNumber,
      taskType: taskData.taskType,
      priority: taskData.priority,
      status: 'pending',
      scheduledDate: taskData.scheduledDate,
      instructions: taskData.instructions,
      photos: [],
      findings: '',
      recommendedActions: [],
      flaggedIssues: [],
      inspectorId: taskData.inspectorId,
      property: claim?.property || '123 Main St, Seattle, WA 98101',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save to Azure Table Storage
    await tableStorageService.upsertInspection(newTask);
    
    return newTask;
  }

  async getInspectionById(taskId: string): Promise<InspectionTask> {
    logger.info(`Fetching inspection task from Azure Table Storage: ${taskId}`);
    
    // Get inspection from table storage
    const task = await tableStorageService.getInspection(taskId);
    
    if (!task) {
      throw new InspectionNotFoundError(taskId);
    }
    
    return task;
  }

  async updateInspectionTask(taskId: string, updateData: UpdateInspectionTaskRequest): Promise<InspectionTask> {
    // Validate request body
    const { error } = updateInspectionTaskSchema.validate(updateData);
    if (error) {
      throw new ValidationError(error.details[0]?.message || 'Invalid request data');
    }
    
    logger.info(`Updating inspection task: ${taskId}`, { updateData });
    
    const existingTask = await tableStorageService.getInspection(taskId);
    
    if (!existingTask) {
      throw new InspectionNotFoundError(taskId);
    }
    
    // Update the task
    const updatedTask: InspectionTask = {
      ...existingTask,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await tableStorageService.upsertInspection(updatedTask);
    
    return updatedTask;
  }

  async deleteInspectionTask(taskId: string): Promise<void> {
    logger.info(`Deleting inspection task: ${taskId}`);
    
    const existingTask = await tableStorageService.getInspection(taskId);
    
    if (!existingTask) {
      throw new InspectionNotFoundError(taskId);
    }
    
    await tableStorageService.deleteInspection(taskId);
  }
}

// Create a singleton instance
export const inspectionsImplementation = new InspectionsImplementation();