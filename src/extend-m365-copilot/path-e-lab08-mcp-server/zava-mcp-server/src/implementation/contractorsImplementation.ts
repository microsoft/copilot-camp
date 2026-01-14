import { logger } from '../utils/logger';
import { tableStorageService } from '../services/tableStorage';
import { 
  Contractor, 
  PurchaseOrder, 
  CreatePurchaseOrderRequest, 
  LineItem 
} from '../types';
import { ContractorNotFoundError, PurchaseOrderNotFoundError, ValidationError } from '../utils/errors';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';

// Validation schemas
const createPurchaseOrderSchema = Joi.object({
  claimId: Joi.string().required(),
  contractorId: Joi.string().required(),
  workDescription: Joi.string().required(),
  lineItems: Joi.array().items(Joi.object({
    description: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    unitPrice: Joi.number().min(0).required(),
    category: Joi.string().valid('materials', 'labor', 'equipment', 'permits').required()
  })).required(),
  notes: Joi.array().items(Joi.string()).optional()
});

export class ContractorsImplementation {
  async getAllContractors(specialty?: string, isPreferred?: string): Promise<Contractor[]> {
    logger.info('Fetching contractors from Azure Table Storage', { specialty, isPreferred });
    
    // Get all contractors from table storage
    const allContractors = await tableStorageService.getContractors();
    let filteredContractors = allContractors.filter(c => c.isActive);
    
    if (specialty) {
      filteredContractors = filteredContractors.filter(c => 
        c.specialties.some((s: string) => s.toLowerCase().includes(specialty.toLowerCase()))
      );
    }
    
    if (isPreferred === 'true') {
      filteredContractors = filteredContractors.filter(c => c.isPreferred);
    }
    
    return filteredContractors;
  }

  async createPurchaseOrder(poData: CreatePurchaseOrderRequest): Promise<PurchaseOrder> {
    // Validate request body
    const { error } = createPurchaseOrderSchema.validate(poData);
    if (error) {
      throw new ValidationError(error.details[0]?.message || 'Invalid request data');
    }
    
    logger.info('Creating new purchase order in Azure Table Storage', { poData });
    
    // Find contractor from table storage
    const contractors = await tableStorageService.getContractors();
    const contractor = contractors.find(c => c.id === poData.contractorId);
    if (!contractor) {
      throw new ContractorNotFoundError(poData.contractorId);
    }
    
    // Calculate line items with totals
    const lineItemsWithTotals: LineItem[] = poData.lineItems.map(item => ({
      id: uuidv4(),
      ...item,
      totalPrice: item.quantity * item.unitPrice
    }));
    
    const subtotal = lineItemsWithTotals.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.09; // 9% tax rate
    const total = subtotal + tax;
    
    // Get existing purchase orders to generate PO number
    const existingPOs = await tableStorageService.getPurchaseOrders();
    
    // Get claim number from claims table
    const claims = await tableStorageService.getClaims();
    const claim = claims.find(c => c.id === poData.claimId);
    const claimNumber = claim?.claimNumber || 'CN000000000';
    
    // Create new purchase order
    const newPO: PurchaseOrder = {
      id: uuidv4(),
      poNumber: `PO-${new Date().getFullYear()}-${String(existingPOs.length + 1).padStart(3, '0')}`,
      claimId: poData.claimId,
      claimNumber: claimNumber,
      contractorId: poData.contractorId,
      workDescription: poData.workDescription,
      lineItems: lineItemsWithTotals,
      subtotal,
      tax,
      total,
      status: 'draft',
      createdDate: new Date().toISOString(),
      notes: poData.notes || []
    };
    
    // Save to Azure Table Storage
    await tableStorageService.upsertPurchaseOrder(newPO);
    
    return newPO;
  }

  async getPurchaseOrderById(poId: string): Promise<PurchaseOrder> {
    logger.info(`Fetching purchase order from Azure Table Storage: ${poId}`);
    
    // Get purchase order from table storage
    const purchaseOrder = await tableStorageService.getPurchaseOrder(poId);
    
    if (!purchaseOrder) {
      throw new PurchaseOrderNotFoundError(poId);
    }
    
    return purchaseOrder;
  }
}

// Create a singleton instance
export const contractorsImplementation = new ContractorsImplementation();