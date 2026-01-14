import { AzureNamedKeyCredential } from '@azure/data-tables';
import { logger } from '../utils/logger';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
function loadEnvironmentVariables() {
  // First try to load from .env file
  dotenv.config();
  
  // Then try to load from local.settings.json (Azure Functions format)
  try {
    const localSettingsPath = path.join(process.cwd(), 'local.settings.json');
    if (fs.existsSync(localSettingsPath)) {
      const localSettings = JSON.parse(fs.readFileSync(localSettingsPath, 'utf-8'));
      if (localSettings.Values) {
        // Merge local.settings.json Values into process.env if not already set
        Object.keys(localSettings.Values).forEach(key => {
          if (!process.env[key]) {
            process.env[key] = localSettings.Values[key];
          }
        });
        logger.info('Loaded environment variables from local.settings.json');
      }
    }
  } catch (error) {
    logger.warn('Could not load local.settings.json:', error instanceof Error ? error.message : String(error));
  }
}

// Storage configuration interface
export interface StorageConfig {
  connectionString: string;
  allowInsecureConnection: boolean;
}

// Get storage configuration based on environment
export function getStorageConfig(): StorageConfig {
  // Load environment variables first
  loadEnvironmentVariables();
  
  // Check NODE_ENV to determine environment
  const nodeEnv = process.env.NODE_ENV;
  const isProduction = nodeEnv === 'production';
  
  logger.info(`Storage configuration for NODE_ENV: ${nodeEnv || 'undefined'}, using ${isProduction ? 'Azure Storage' : 'Azurite'}`);
  
  if (isProduction) {
    // Production environment - use Azure Storage connection string
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || process.env.AzureWebJobsStorage;
    
    if (!connectionString) {
      throw new Error('Azure Storage connection string must be provided in production environment (AZURE_STORAGE_CONNECTION_STRING or AzureWebJobsStorage)');
    }
    
    logger.info('Using Azure Storage connection string for production');
    
    return {
      connectionString,
      allowInsecureConnection: false
    };
  } else {
    // Local development or any other environment - use Azurite connection string
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || 
      'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;';
    
    logger.info('Using Azurite storage emulator connection string');
    
    return {
      connectionString,
      allowInsecureConnection: true
    };
  }
}