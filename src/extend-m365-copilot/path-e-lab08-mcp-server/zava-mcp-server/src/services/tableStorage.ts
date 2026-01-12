import { TableClient, TableEntity, odata, AzureNamedKeyCredential } from '@azure/data-tables';
import { logger } from '../utils/logger';
import { getStorageConfig } from '../config/storageConfig';
import { TokenCredential } from '@azure/identity';
// Table Storage Entity interfaces
export interface ClaimEntity extends TableEntity {
  partitionKey: string; // 'claims'
  rowKey: string; // claimNumber
  id: string;
  claimNumber: string;
  policyNumber: string;
  policyHolderName: string; // Simple string
  policyHolderEmail: string; // Simple string
  property: string; // Simple string (address only)
  dateOfLoss: string;
  dateReported: string;
  status: string; // Simple string
  damageTypesData: string; // JSON string array
  description: string;
  estimatedLoss: number;
  adjusterAssigned?: string;
  notesData: string; // JSON string array
  createdAt: string;
  updatedAt: string;
}

export interface InspectionEntity extends TableEntity {
  partitionKey: string; // 'inspections'
  rowKey: string; // inspection id
  id: string;
  claimId: string;
  claimNumber: string;
  taskType: string;
  priority: string;
  status: string;
  scheduledDate?: string;
  completedDate?: string;
  inspectorId?: string; // Simple string (inspector ID)
  property: string; // Simple string (address only)
  instructions: string;
  photosData: string; // JSON string array of URLs
  findings: string;
  recommendedActionsData: string; // JSON string
  flaggedIssuesData: string; // JSON string
  createdAt: string;
  updatedAt: string;
}

export interface InspectorEntity extends TableEntity {
  partitionKey: string; // 'inspectors'
  rowKey: string; // inspector id
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specializationsData: string; // JSON string array
}

export interface ContractorEntity extends TableEntity {
  partitionKey: string; // 'contractors'
  rowKey: string; // contractor id
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  addressData: string; // JSON string
  licenseNumber: string;
  insuranceCertificate: string;
  specialtiesData: string; // JSON string
  rating: number;
  isPreferred: boolean;
  isActive: boolean;
}

export interface PurchaseOrderEntity extends TableEntity {
  partitionKey: string; // 'purchaseOrders'
  rowKey: string; // PO id
  id: string;
  poNumber: string;
  claimId: string;
  claimNumber: string;
  contractorId: string;
  workDescription: string;
  lineItemsData: string; // JSON string
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  createdDate: string;
  approvedDate?: string;
  completedDate?: string;
  approvedBy?: string;
  notesData: string; // JSON string
}

export class TableStorageService {
  private connectionString: string;
  private allowInsecureConnection: boolean;

  constructor() {
    const config = getStorageConfig();
    this.connectionString = config.connectionString;
    this.allowInsecureConnection = config.allowInsecureConnection;
  }

  private getTableClient(tableName: string): TableClient {
    return TableClient.fromConnectionString(this.connectionString, tableName, {
      allowInsecureConnection: this.allowInsecureConnection
    });
  }

  // Claims operations
  async getClaims(filters?: {
    location?: string;
    damageType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any[]> {
    try {
      logger.info('Getting all claims from table storage', { filters });
      const tableClient = this.getTableClient('claims');
      const entities: ClaimEntity[] = [];
      
      // Build filter query if filters are provided
      let queryFilter = "PartitionKey eq 'claims'";
      
      if (filters?.startDate || filters?.endDate) {
        if (filters.startDate) {
          queryFilter += ` and dateOfLoss ge '${filters.startDate}'`;
        }
        if (filters.endDate) {
          queryFilter += ` and dateOfLoss le '${filters.endDate}'`;
        }
      }
      
      // Fetch entities with date filters applied at storage level
      const queryOptions = filters?.startDate || filters?.endDate 
        ? { queryOptions: { filter: queryFilter } }
        : {};
      
      for await (const entity of tableClient.listEntities<ClaimEntity>(queryOptions)) {
        // Apply location and damageType filters (these need to be done client-side
        // as they involve partial string matching and JSON array contains checks)
        let include = true;
        
        if (filters?.location && include) {
          const locationLower = filters.location.toLowerCase();
          include = entity.property?.toLowerCase().includes(locationLower) ?? false;
        }
        
        if (filters?.damageType && include) {
          const damageTypeLower = filters.damageType.toLowerCase();
          try {
            const damageTypes: string[] = JSON.parse(entity.damageTypesData || '[]');
            include = damageTypes.some((type: string) => 
              type.toLowerCase().includes(damageTypeLower)
            );
          } catch {
            include = false;
          }
        }
        
        if (include) {
          entities.push(entity);
        }
      }
      
      logger.info(`Found ${entities.length} claim entities in table storage after filtering`);
      const mappedClaims = entities.map(this.mapClaimEntityToObject);
      
      if (mappedClaims.length === 1) {
        logger.info(`Retrieved single claim:`, mappedClaims[0]);
      } else {
        logger.info(`Mapped ${mappedClaims.length} claims successfully`);
      }
      
      return mappedClaims;
    } catch (error) {
      logger.error('Error getting claims:', error);
      throw error;
    }
  }

  async getClaim(claimIdentifier: string): Promise<any | null> {
    try {
      logger.info(`Fetching claim by identifier: ${claimIdentifier}`);
      const tableClient = this.getTableClient('claims');
      
      // First try to get by claimNumber (rowKey)
      try {
        const entity = await tableClient.getEntity<ClaimEntity>('claims', claimIdentifier);
        const mappedClaim = this.mapClaimEntityToObject(entity);
        logger.info(`Successfully retrieved claim by claimNumber:`, mappedClaim);
        return mappedClaim;
      } catch (firstError: any) {
        if (firstError?.statusCode === 404) {
          // If not found by claimNumber, search by ID using filter
          logger.info(`Claim not found by claimNumber, searching by ID: ${claimIdentifier}`);
          
          const entities: ClaimEntity[] = [];
          for await (const entity of tableClient.listEntities<ClaimEntity>({
            queryOptions: { filter: `id eq '${claimIdentifier}'` }
          })) {
            entities.push(entity);
          }
          
          if (entities.length > 0) {
            const mappedClaim = this.mapClaimEntityToObject(entities[0]);
            logger.info(`Successfully retrieved claim by ID:`, mappedClaim);
            return mappedClaim;
          } else {
            logger.info(`Claim not found by ID or claimNumber: ${claimIdentifier}`);
            return null;
          }
        } else {
          throw firstError;
        }
      }
    } catch (error: any) {
      logger.error('Error getting claim:', error);
      throw error;
    }
  }

  async upsertClaim(claim: any): Promise<any> {
    try {
      logger.info(`Upserting claim: ${claim.claimNumber}`);
      const tableClient = this.getTableClient('claims');
      const entity = this.mapClaimObjectToEntity(claim);
      await tableClient.upsertEntity(entity, 'Replace');
      logger.info(`Successfully upserted claim: ${claim.claimNumber}`);
      return claim;
    } catch (error) {
      logger.error('Error upserting claim:', error);
      throw error;
    }
  }

  async deleteClaim(claimNumber: string): Promise<void> {
    try {
      const tableClient = this.getTableClient('claims');
      await tableClient.deleteEntity('claims', claimNumber);
      logger.info(`Deleted claim: ${claimNumber}`);
    } catch (error) {
      logger.error(`Error deleting claim ${claimNumber}:`, error);
      throw error;
    }
  }

  // Inspections operations
  async getInspections(claimId?: string, claimNumber?: string, status?: string): Promise<any[]> {
    try {
      logger.info('Getting inspections from table storage', { claimId, claimNumber, status });
      const tableClient = this.getTableClient('inspections');
      const entities: InspectionEntity[] = [];
      
      let filter = '';
      const filters: string[] = [];
      
      if (claimId) {
        filters.push(`claimId eq '${claimId}'`);
      }
      if (claimNumber) {
        filters.push(`claimNumber eq '${claimNumber}'`);
      }
      if (status) {
        filters.push(`status eq '${status}'`);
      }
      
      if (filters.length > 0) {
        filter = filters.join(' and ');
      }
      
      const options = filter ? { queryOptions: { filter } } : undefined;
      
      for await (const entity of tableClient.listEntities<InspectionEntity>(options)) {
        entities.push(entity);
      }
      
      logger.info(`Found ${entities.length} inspection entities in table storage`);
      const mappedInspections = entities.map(this.mapInspectionEntityToObject);
      
      if (mappedInspections.length === 1) {
        logger.info(`Retrieved single inspection:`, mappedInspections[0]);
      } else {
        logger.info(`Mapped ${mappedInspections.length} inspections successfully`);
      }
      
      return mappedInspections;
    } catch (error) {
      logger.error('Error getting inspections:', error);
      throw error;
    }
  }

  async getInspection(taskId: string): Promise<any | null> {
    try {
      logger.info(`Fetching inspection by ID: ${taskId}`);
      const tableClient = this.getTableClient('inspections');
      const entity = await tableClient.getEntity<InspectionEntity>('inspections', taskId);
      const mappedInspection = this.mapInspectionEntityToObject(entity);
      logger.info(`Successfully retrieved inspection:`, mappedInspection);
      return mappedInspection;
    } catch (error: any) {
      if (error?.statusCode === 404) {
        logger.info(`Inspection not found: ${taskId}`);
        return null;
      }
      logger.error('Error getting inspection:', error);
      throw error;
    }
  }

  async upsertInspection(inspection: any): Promise<any> {
    try {
      logger.info(`Upserting inspection: ${inspection.id}`);
      const tableClient = this.getTableClient('inspections');
      const entity = this.mapInspectionObjectToEntity(inspection);
      await tableClient.upsertEntity(entity, 'Replace');
      logger.info(`Successfully upserted inspection: ${inspection.id}`);
      return inspection;
    } catch (error) {
      logger.error('Error upserting inspection:', error);
      throw error;
    }
  }

  async deleteInspection(taskId: string): Promise<void> {
    try {
      const tableClient = this.getTableClient('inspections');
      await tableClient.deleteEntity('inspections', taskId);
      logger.info(`Deleted inspection: ${taskId}`);
    } catch (error) {
      logger.error(`Error deleting inspection ${taskId}:`, error);
      throw error;
    }
  }

  // Inspectors operations
  async getInspectors(): Promise<any[]> {
    try {
      logger.info('Getting inspectors from table storage');
      const tableClient = this.getTableClient('inspectors');
      const entities: InspectorEntity[] = [];
      
      for await (const entity of tableClient.listEntities<InspectorEntity>()) {
        entities.push(entity);
      }
      
      logger.info(`Found ${entities.length} inspector entities in table storage`);
      const mappedInspectors = entities.map(this.mapInspectorEntityToObject);
      
      if (mappedInspectors.length === 1) {
        logger.info(`Retrieved single inspector:`, mappedInspectors[0]);
      } else {
        logger.info(`Mapped ${mappedInspectors.length} inspectors successfully`);
      }
      
      return mappedInspectors;
    } catch (error) {
      logger.error('Error getting inspectors:', error);
      return [];
    }
  }

  async getInspector(inspectorId: string): Promise<any | null> {
    try {
      logger.info(`Fetching inspector by ID: ${inspectorId}`);
      const tableClient = this.getTableClient('inspectors');
      const entity = await tableClient.getEntity<InspectorEntity>('inspectors', inspectorId);
      const mappedInspector = this.mapInspectorEntityToObject(entity);
      logger.info(`Successfully retrieved inspector:`, mappedInspector);
      return mappedInspector;
    } catch (error: any) {
      if (error?.statusCode === 404) {
        logger.info(`Inspector not found: ${inspectorId}`);
        return null;
      }
      logger.error('Error getting inspector:', error);
      throw error;
    }
  }

  async upsertInspector(inspector: any): Promise<any> {
    try {
      logger.info(`Upserting inspector: ${inspector.id}`);
      const tableClient = this.getTableClient('inspectors');
      const entity = this.mapInspectorObjectToEntity(inspector);
      await tableClient.upsertEntity(entity, 'Replace');
      logger.info(`Successfully upserted inspector: ${inspector.id}`);
      return inspector;
    } catch (error) {
      logger.error('Error upserting inspector:', error);
      throw error;
    }
  }

  // Contractors operations
  async getContractors(specialty?: string, isPreferred?: boolean): Promise<any[]> {
    try {
      logger.info('Getting contractors from table storage', { specialty, isPreferred });
      const tableClient = this.getTableClient('contractors');
      const entities: ContractorEntity[] = [];
      
      let filter = odata`isActive eq true`;
      if (isPreferred) {
        filter = odata`isActive eq true and isPreferred eq true`;
      }
      
      for await (const entity of tableClient.listEntities<ContractorEntity>({
        queryOptions: { filter }
      })) {
        entities.push(entity);
      }
      
      logger.info(`Found ${entities.length} contractor entities in table storage`);
      let contractors = entities.map(this.mapContractorEntityToObject);
      
      // Filter by specialty (can't do this in Table Storage query easily)
      if (specialty) {
        const originalCount = contractors.length;
        contractors = contractors.filter(c => 
          c.specialties.some((s: string) => s.toLowerCase().includes(specialty.toLowerCase()))
        );
        logger.info(`Filtered contractors by specialty "${specialty}": ${originalCount} -> ${contractors.length}`);
      }
      
      if (contractors.length === 1) {
        logger.info(`Retrieved single contractor:`, contractors[0]);
      } else {
        logger.info(`Mapped ${contractors.length} contractors successfully`);
      }
      
      return contractors;
    } catch (error) {
      logger.error('Error getting contractors:', error);
      throw error;
    }
  }

  async getContractor(contractorId: string): Promise<any | null> {
    try {
      logger.info(`Fetching contractor by ID: ${contractorId}`);
      const tableClient = this.getTableClient('contractors');
      const entity = await tableClient.getEntity<ContractorEntity>('contractors', contractorId);
      const mappedContractor = this.mapContractorEntityToObject(entity);
      logger.info(`Successfully retrieved contractor:`, mappedContractor);
      return mappedContractor;
    } catch (error: any) {
      if (error?.statusCode === 404) {
        logger.info(`Contractor not found: ${contractorId}`);
        return null;
      }
      logger.error('Error getting contractor:', error);
      throw error;
    }
  }

  async upsertContractor(contractor: any): Promise<any> {
    try {
      logger.info(`Upserting contractor: ${contractor.id}`);
      const tableClient = this.getTableClient('contractors');
      const entity = this.mapContractorObjectToEntity(contractor);
      await tableClient.upsertEntity(entity, 'Replace');
      logger.info(`Successfully upserted contractor: ${contractor.id}`);
      return contractor;
    } catch (error) {
      logger.error('Error upserting contractor:', error);
      throw error;
    }
  }

  // Purchase Orders operations
  async getPurchaseOrders(claimId?: string): Promise<any[]> {
    try {
      logger.info('Getting purchase orders from table storage', { claimId });
      const tableClient = this.getTableClient('purchaseOrders');
      const entities: PurchaseOrderEntity[] = [];
      
      const options = claimId ? {
        queryOptions: { filter: odata`claimId eq ${claimId}` }
      } : undefined;
      
      for await (const entity of tableClient.listEntities<PurchaseOrderEntity>(options)) {
        entities.push(entity);
      }
      
      logger.info(`Found ${entities.length} purchase order entities in table storage`);
      const mappedPurchaseOrders = entities.map(this.mapPurchaseOrderEntityToObject);
      
      if (mappedPurchaseOrders.length === 1) {
        logger.info(`Retrieved single purchase order:`, mappedPurchaseOrders[0]);
      } else {
        logger.info(`Mapped ${mappedPurchaseOrders.length} purchase orders successfully`);
      }
      
      return mappedPurchaseOrders;
    } catch (error) {
      logger.error('Error getting purchase orders:', error);
      throw error;
    }
  }

  async getPurchaseOrder(poId: string): Promise<any | null> {
    try {
      logger.info(`Fetching purchase order by ID: ${poId}`);
      const tableClient = this.getTableClient('purchaseOrders');
      const entity = await tableClient.getEntity<PurchaseOrderEntity>('purchaseOrders', poId);
      const mappedPurchaseOrder = this.mapPurchaseOrderEntityToObject(entity);
      logger.info(`Successfully retrieved purchase order:`, mappedPurchaseOrder);
      return mappedPurchaseOrder;
    } catch (error: any) {
      if (error?.statusCode === 404) {
        logger.info(`Purchase order not found: ${poId}`);
        return null;
      }
      logger.error('Error getting purchase order:', error);
      throw error;
    }
  }

  async upsertPurchaseOrder(purchaseOrder: any): Promise<any> {
    try {
      logger.info(`Upserting purchase order: ${purchaseOrder.id}`);
      const tableClient = this.getTableClient('purchaseOrders');
      const entity = this.mapPurchaseOrderObjectToEntity(purchaseOrder);
      await tableClient.upsertEntity(entity, 'Replace');
      logger.info(`Successfully upserted purchase order: ${purchaseOrder.id}`);
      return purchaseOrder;
    } catch (error) {
      logger.error('Error upserting purchase order:', error);
      throw error;
    }
  }

  // Entity mapping functions
  private mapClaimEntityToObject(entity: ClaimEntity): any {
    return {
      id: entity.id,
      claimNumber: entity.claimNumber,
      policyNumber: entity.policyNumber,
      policyHolderName: entity.policyHolderName,
      policyHolderEmail: entity.policyHolderEmail,
      property: entity.property,
      dateOfLoss: entity.dateOfLoss,
      dateReported: entity.dateReported,
      status: entity.status,
      damageTypes: JSON.parse(entity.damageTypesData || '[]'),
      description: entity.description,
      estimatedLoss: entity.estimatedLoss,
      adjusterAssigned: entity.adjusterAssigned,
      notes: JSON.parse(entity.notesData || '[]'),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  private mapClaimObjectToEntity(claim: any): ClaimEntity {
    return {
      partitionKey: 'claims',
      rowKey: claim.claimNumber,
      id: claim.id,
      claimNumber: claim.claimNumber,
      policyNumber: claim.policyNumber,
      policyHolderName: claim.policyHolderName,
      policyHolderEmail: claim.policyHolderEmail,
      property: claim.property,
      dateOfLoss: claim.dateOfLoss,
      dateReported: claim.dateReported,
      status: claim.status,
      damageTypesData: JSON.stringify(claim.damageTypes || []),
      description: claim.description,
      estimatedLoss: claim.estimatedLoss,
      adjusterAssigned: claim.adjusterAssigned,
      notesData: JSON.stringify(claim.notes || []),
      createdAt: claim.createdAt,
      updatedAt: claim.updatedAt
    };
  }

  private mapInspectionEntityToObject(entity: InspectionEntity): any {
    return {
      id: entity.id,
      claimId: entity.claimId,
      claimNumber: entity.claimNumber,
      taskType: entity.taskType,
      priority: entity.priority,
      status: entity.status,
      scheduledDate: entity.scheduledDate,
      completedDate: entity.completedDate,
      inspectorId: entity.inspectorId,
      property: entity.property,
      instructions: entity.instructions,
      photos: JSON.parse(entity.photosData || '[]'),
      findings: entity.findings,
      recommendedActions: JSON.parse(entity.recommendedActionsData || '[]'),
      flaggedIssues: JSON.parse(entity.flaggedIssuesData || '[]'),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  private mapInspectionObjectToEntity(inspection: any): InspectionEntity {
    return {
      partitionKey: 'inspections',
      rowKey: inspection.id,
      id: inspection.id,
      claimId: inspection.claimId,
      claimNumber: inspection.claimNumber,
      taskType: inspection.taskType,
      priority: inspection.priority,
      status: inspection.status,
      scheduledDate: inspection.scheduledDate,
      completedDate: inspection.completedDate,
      inspectorId: inspection.inspectorId,
      property: inspection.property,
      instructions: inspection.instructions,
      photosData: JSON.stringify(inspection.photos || []),
      findings: inspection.findings,
      recommendedActionsData: JSON.stringify(inspection.recommendedActions || []),
      flaggedIssuesData: JSON.stringify(inspection.flaggedIssues || []),
      createdAt: inspection.createdAt,
      updatedAt: inspection.updatedAt
    };
  }

  private mapContractorEntityToObject(entity: ContractorEntity): any {
    return {
      id: entity.id,
      name: entity.name,
      businessName: entity.businessName,
      email: entity.email,
      phone: entity.phone,
      address: JSON.parse(entity.addressData),
      licenseNumber: entity.licenseNumber,
      insuranceCertificate: entity.insuranceCertificate,
      specialties: JSON.parse(entity.specialtiesData),
      rating: entity.rating,
      isPreferred: entity.isPreferred,
      isActive: entity.isActive
    };
  }

  private mapContractorObjectToEntity(contractor: any): ContractorEntity {
    return {
      partitionKey: 'contractors',
      rowKey: contractor.id,
      id: contractor.id,
      name: contractor.name,
      businessName: contractor.businessName,
      email: contractor.email,
      phone: contractor.phone,
      addressData: JSON.stringify(contractor.address),
      licenseNumber: contractor.licenseNumber,
      insuranceCertificate: contractor.insuranceCertificate,
      specialtiesData: JSON.stringify(contractor.specialties),
      rating: contractor.rating,
      isPreferred: contractor.isPreferred,
      isActive: contractor.isActive
    };
  }

  private mapPurchaseOrderEntityToObject(entity: PurchaseOrderEntity): any {
    return {
      id: entity.id,
      poNumber: entity.poNumber,
      claimId: entity.claimId,
      claimNumber: entity.claimNumber,
      contractorId: entity.contractorId,
      workDescription: entity.workDescription,
      lineItems: JSON.parse(entity.lineItemsData),
      subtotal: entity.subtotal,
      tax: entity.tax,
      total: entity.total,
      status: entity.status,
      createdDate: entity.createdDate,
      approvedDate: entity.approvedDate,
      completedDate: entity.completedDate,
      approvedBy: entity.approvedBy,
      notes: JSON.parse(entity.notesData)
    };
  }

  private mapPurchaseOrderObjectToEntity(purchaseOrder: any): PurchaseOrderEntity {
    return {
      partitionKey: 'purchaseOrders',
      rowKey: purchaseOrder.id,
      id: purchaseOrder.id,
      poNumber: purchaseOrder.poNumber,
      claimId: purchaseOrder.claimId,
      claimNumber: purchaseOrder.claimNumber,
      contractorId: purchaseOrder.contractorId,
      workDescription: purchaseOrder.workDescription,
      lineItemsData: JSON.stringify(purchaseOrder.lineItems),
      subtotal: purchaseOrder.subtotal,
      tax: purchaseOrder.tax,
      total: purchaseOrder.total,
      status: purchaseOrder.status,
      createdDate: purchaseOrder.createdDate,
      approvedDate: purchaseOrder.approvedDate,
      completedDate: purchaseOrder.completedDate,
      approvedBy: purchaseOrder.approvedBy,
      notesData: JSON.stringify(purchaseOrder.notes)
    };
  }

  // Inspector mapping methods
  private mapInspectorEntityToObject(entity: InspectorEntity): any {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      licenseNumber: entity.licenseNumber,
      specializations: JSON.parse(entity.specializationsData || '[]')
    };
  }

  private mapInspectorObjectToEntity(inspector: any): InspectorEntity {
    return {
      partitionKey: 'inspectors',
      rowKey: inspector.id,
      id: inspector.id,
      name: inspector.name,
      email: inspector.email,
      phone: inspector.phone,
      licenseNumber: inspector.licenseNumber,
      specializationsData: JSON.stringify(inspector.specializations || [])
    };
  }
}

export const tableStorageService = new TableStorageService();