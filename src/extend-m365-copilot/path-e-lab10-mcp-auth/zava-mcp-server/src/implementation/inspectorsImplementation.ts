import { logger } from '../utils/logger';
import { tableStorageService } from '../services/tableStorage';
import { Inspector } from '../types';

export class InspectorsImplementation {
  async getAllInspectors(specialization?: string): Promise<Inspector[]> {
    logger.info('Fetching inspectors from Azure Table Storage', { specialization });
    
    // Get all inspectors from table storage
    const allInspectors = await tableStorageService.getInspectors();
    let filteredInspectors = allInspectors;
    
    // Filter by specialization if provided
    if (specialization) {
      filteredInspectors = filteredInspectors.filter(inspector => 
        inspector.specializations.some((spec: string) => 
          spec.toLowerCase().includes(specialization.toLowerCase())
        )
      );
    }
    
    return filteredInspectors;
  }

  async getInspectorById(inspectorId: string): Promise<Inspector | null> {
    logger.info('Fetching inspector by ID from Azure Table Storage', { inspectorId });
    
    const inspector = await tableStorageService.getInspector(inspectorId);
    return inspector;
  }
}

// Export singleton instance
export const inspectorsImplementation = new InspectorsImplementation();