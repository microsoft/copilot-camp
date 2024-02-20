import {
    DbSupplier, DbCategory, DbOrderDetail
} from './dbModel';
import { TableClient } from "@azure/data-tables";
import config from "../../config";

interface IReferenceData<DataType> {
    [index: string]: DataType;
}

class ReferenceDataManager {

    constructor() {
        // Warm up the cache
        this._suppliersPromise = this.getSuppliersFromDb();
        this._categoriesPromise = this.getCategoriesFromDb();
    }

    // Build a dictionary of reference data from the database
    private async loadReferenceData<DataType>(tableName): Promise<IReferenceData<DataType>> {

        const tableClient = TableClient.fromConnectionString(config.storageAccountConnectionString, tableName);
    
        const entities = tableClient.listEntities();
    
        let result = {};
        for await (const entity of entities) {
            result[entity.rowKey] = entity;
        }

        console.log (`${tableName} loaded from DB`);
        return result;
    }
    
    // Reference data does not change so we can cache it in memory
    // For each table of reference data, cache a single promise to ensure we only load it once.
    // Then cache the data itself once it is loaded.

    private _suppliersPromise: Promise<IReferenceData<DbSupplier>>;
    private getSuppliersFromDb(): Promise<IReferenceData<DbSupplier>> {
        if (!this._suppliersPromise) {
            this._suppliersPromise = this.loadReferenceData<DbSupplier>("Suppliers");
        }
        return this._suppliersPromise;
    }
    private _suppliers: IReferenceData<DbSupplier>;
    public async getSupplier(supplierId: string): Promise<DbSupplier> {
        if (!this._suppliers) {
            this._suppliers = await this.getSuppliersFromDb();
        }
        return this._suppliers[supplierId];
    }

    private _categoriesPromise: Promise<IReferenceData<DbCategory>>;
    private getCategoriesFromDb(): Promise<IReferenceData<DbCategory>> {
        if (!this._categoriesPromise) {
            this._categoriesPromise = this.loadReferenceData<DbCategory>("Categories");
        }
        return this._categoriesPromise;
    }
    private _categories: IReferenceData<DbCategory>;
    public async getCategory(categoryId: string ): Promise<DbCategory> {
        if (!this._categories) {
            this._categories = await this.getCategoriesFromDb();
        }
        return this._categories[categoryId];
    }
}

export default new ReferenceDataManager();