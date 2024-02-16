import {
    DbSupplier, DbCategory, DbOrderDetail
} from './dbModel';
import { TableClient } from "@azure/data-tables";
import config from "../../config";

interface IReferenceData<DataType> {
    [index: string]: DataType;
}

class ReferenceDataManager {

    // Build a dictionary of reference data from the database
    private async loadReferenceData<DataType>(tableName): Promise<IReferenceData<DataType>> {

        const tableClient = TableClient.fromConnectionString(config.storageAccountConnectionString, tableName);
    
        const entities = tableClient.listEntities();
    
        let result = {};
        for await (const entity of entities) {
            result[entity.rowKey] = entity;
        }
        return result;
    
    }
    
    // Reference data does not change; cache it here
    private _suppliers: IReferenceData<DbSupplier>;
    public async getSupplier(supplierId: string): Promise<DbSupplier> {
        if (!this._suppliers) {
            this._suppliers = await this.loadReferenceData<DbSupplier>("Suppliers");
        }
        return this._suppliers[supplierId];
    }

    private _categories: IReferenceData<DbCategory>;
    public async getCategory(categoryId: string ): Promise<DbCategory> {
        if (!this._categories) {
            this._categories = await this.loadReferenceData<DbCategory>("Categories");
        }
        return this._categories[categoryId];
    }

}

export default new ReferenceDataManager();