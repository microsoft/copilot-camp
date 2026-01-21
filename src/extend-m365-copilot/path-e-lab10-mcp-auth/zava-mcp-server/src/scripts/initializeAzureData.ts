import { TableClient } from '@azure/data-tables';
import * as fs from 'fs';
import * as path from 'path';
import { getStorageConfig } from '../config/storageConfig';
import { logger } from '../utils/logger';

interface TableData {
  tableName: string;
  dataFile: string;
  partitionKey: string;
  getRowKey: (item: any) => string;
  mapToEntity: (item: any) => any;
}

const tables: TableData[] = [
  {
    tableName: 'claims',
    dataFile: 'claims.json',
    partitionKey: 'claims',
    getRowKey: (item) => item.claimNumber,
    mapToEntity: (item) => ({
      partitionKey: 'claims',
      rowKey: item.claimNumber,
      id: item.id,
      claimNumber: item.claimNumber,
      policyNumber: item.policyNumber,
      policyHolderName: item.policyHolderName,
      policyHolderEmail: item.policyHolderEmail,
      property: item.property,
      dateOfLoss: item.dateOfLoss,
      dateReported: item.dateReported,
      status: item.status,
      damageTypesData: JSON.stringify(item.damageTypes),
      description: item.description,
      estimatedLoss: item.estimatedLoss,
      adjusterAssigned: item.adjusterAssigned,
      notesData: JSON.stringify(item.notes),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    })
  },
  {
    tableName: 'inspections',
    dataFile: 'inspections.json',
    partitionKey: 'inspections',
    getRowKey: (item) => item.id,
    mapToEntity: (item) => ({
      partitionKey: 'inspections',
      rowKey: item.id,
      id: item.id,
      claimId: item.claimId,
      claimNumber: item.claimNumber,
      taskType: item.taskType,
      priority: item.priority,
      status: item.status,
      scheduledDate: item.scheduledDate,
      completedDate: item.completedDate || null,
      inspectorId: item.inspectorId,
      property: item.property,
      instructions: item.instructions,
      photosData: JSON.stringify(item.photos),
      findings: item.findings || '',
      recommendedActionsData: JSON.stringify(item.recommendedActions),
      flaggedIssuesData: JSON.stringify(item.flaggedIssues),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    })
  },
  {
    tableName: 'inspectors',
    dataFile: 'inspectors.json',
    partitionKey: 'inspectors',
    getRowKey: (item) => item.id,
    mapToEntity: (item) => ({
      partitionKey: 'inspectors',
      rowKey: item.id,
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      licenseNumber: item.licenseNumber,
      specializationsData: JSON.stringify(item.specializations)
    })
  },
  {
    tableName: 'contractors',
    dataFile: 'contractors.json',
    partitionKey: 'contractors',
    getRowKey: (item) => item.id,
    mapToEntity: (item) => ({
      partitionKey: 'contractors',
      rowKey: item.id,
      id: item.id,
      name: item.name,
      businessName: item.businessName,
      email: item.email,
      phone: item.phone,
      addressData: JSON.stringify(item.address),
      licenseNumber: item.licenseNumber,
      insuranceCertificate: item.insuranceCertificate,
      specialtiesData: JSON.stringify(item.specialties),
      rating: item.rating,
      isPreferred: item.isPreferred,
      isActive: item.isActive
    })
  },
  {
    tableName: 'purchaseOrders',
    dataFile: 'purchaseOrders.json',
    partitionKey: 'purchaseOrders',
    getRowKey: (item) => item.id,
    mapToEntity: (item) => ({
      partitionKey: 'purchaseOrders',
      rowKey: item.id,
      id: item.id,
      poNumber: item.poNumber,
      claimId: item.claimId,
      claimNumber: item.claimNumber,
      contractorId: item.contractorId,
      workDescription: item.workDescription,
      lineItemsData: JSON.stringify(item.lineItems),
      subtotal: item.subtotal,
      tax: item.tax,
      total: item.total,
      status: item.status,
      createdDate: item.createdDate,
      approvedDate: item.approvedDate || null,
      completedDate: item.completedDate || null,
      approvedBy: item.approvedBy || null,
      notesData: JSON.stringify(item.notes || [])
    })
  }
];

async function initializeTables(): Promise<void> {
  logger.info('🚀 Starting data initialization...');

  try {
    // Get storage configuration (production or development)
    const storageConfig = getStorageConfig();
    logger.info(`Using storage configuration with connection string for environment: ${process.env.NODE_ENV || 'development'}`);
    
    for (const tableConfig of tables) {
      logger.info(`📋 Initializing table: ${tableConfig.tableName}`);
      
      // Create table client using connection string - use the correct static method
      const tableClient = TableClient.fromConnectionString(
        storageConfig.connectionString, 
        tableConfig.tableName
      );
      
      // Create table if it doesn't exist
      await tableClient.createTable();
      logger.info(`✅ Table '${tableConfig.tableName}' created or already exists`);
      
      // Load data from JSON file
      const dataPath = path.join(process.cwd(), 'data', tableConfig.dataFile);
      
      if (!fs.existsSync(dataPath)) {
        logger.warn(`⚠️  Data file not found: ${dataPath}`);
        continue;
      }
      
      const rawData = fs.readFileSync(dataPath, 'utf-8');
      const items = JSON.parse(rawData);
      
      logger.info(`📄 Loaded ${items.length} items from ${tableConfig.dataFile}`);
      
      // Insert entities
      for (const item of items) {
        const entity = tableConfig.mapToEntity(item);
        try {
          await tableClient.upsertEntity(entity, 'Replace');
          logger.info(`✅ Upserted entity: ${entity.rowKey}`);
        } catch (error) {
          logger.error(`❌ Error upserting entity ${entity.rowKey}:`, error);
        }
      }
      
      logger.info(`✅ Completed initialization for table: ${tableConfig.tableName}`);
    }
    
    logger.info('🎉 Data initialization completed successfully!');
    
  } catch (error) {
    logger.error('❌ Error during data initialization:', error);
    logger.error('❌ Error message:', error instanceof Error ? error.message : String(error));
    logger.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw error;
  }
}

// Run initialization
initializeTables()
  .then(() => {
    logger.info('✨ All tables initialized successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('💥 Initialization failed:', error);
    logger.error('💥 Error message:', error instanceof Error ? error.message : String(error));
    logger.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    process.exit(1);
  });