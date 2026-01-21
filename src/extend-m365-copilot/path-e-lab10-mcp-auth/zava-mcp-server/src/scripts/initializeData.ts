import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Azurite configuration for local development
const accountName = 'devstoreaccount1';
const accountKey = 'Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==';
const tableEndpoint = 'http://127.0.0.1:10002/devstoreaccount1';
const credential = new AzureNamedKeyCredential(accountName, accountKey);

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
  console.log('🚀 Starting data initialization...');

  try {
    for (const tableConfig of tables) {
      console.log(`📋 Initializing table: ${tableConfig.tableName}`);
      
      // Create table client
      const tableClient = new TableClient(tableEndpoint, tableConfig.tableName, credential, {
        allowInsecureConnection: true
      });
      
      // Create table if it doesn't exist
      await tableClient.createTable();
      console.log(`✅ Table '${tableConfig.tableName}' created or already exists`);
      
      // Load data from JSON file
      const dataPath = path.join(process.cwd(), 'data', tableConfig.dataFile);
      
      if (!fs.existsSync(dataPath)) {
        console.log(`⚠️  Data file not found: ${dataPath}`);
        continue;
      }
      
      const rawData = fs.readFileSync(dataPath, 'utf-8');
      const items = JSON.parse(rawData);
      
      console.log(`📄 Loaded ${items.length} items from ${tableConfig.dataFile}`);
      
      // Insert entities
      for (const item of items) {
        const entity = tableConfig.mapToEntity(item);
        try {
          await tableClient.upsertEntity(entity, 'Replace');
          console.log(`✅ Upserted entity: ${entity.rowKey}`);
        } catch (error) {
          console.error(`❌ Error upserting entity ${entity.rowKey}:`, error);
        }
      }
      
      console.log(`✅ Completed initialization for table: ${tableConfig.tableName}`);
    }
    
    console.log('🎉 Data initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during data initialization:', error);
    throw error;
  }
}

// Run initialization
initializeTables()
  .then(() => {
    console.log('✨ All tables initialized successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Initialization failed:', error);
    process.exit(1);
  });