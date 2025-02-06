import { TableClient, TableEntity } from "@azure/data-tables";
import { HttpError } from './Utilities';
import { DbEntity } from '../model/dbModel';

export default class DbService<DbEntityType> {

    private storageAccountConnectionString = process.env.STORAGE_ACCOUNT_CONNECTION_STRING;
    private okToCacheLocally = false;
    private entityCache: DbEntity[] = [];

    constructor(okToCacheLocally: boolean) {
        if (!this.storageAccountConnectionString) {
            throw new Error("STORAGE_ACCOUNT_CONNECTION_STRING is not set");
        }
        this.okToCacheLocally = okToCacheLocally;
    }

    async getEntityByRowKey(tableName: string, rowKey: string): Promise<DbEntity> {
        if (!this.okToCacheLocally) {
            const tableClient = TableClient.fromConnectionString(this.storageAccountConnectionString, tableName);
            const result = this.expandPropertyValues(await tableClient.getEntity(tableName, rowKey) as DbEntityType);
            return result as DbEntity;
        } else {
            let result = await this.getEntities(tableName);
            result = result.filter((e) => {
                return e.rowKey === rowKey
            });
            if (result.length === 0) {
                throw new HttpError(404, `Entity ${rowKey} not found`);
            } else {
                return result[0];
            }
        }
    }

    async getEntities(tableName: string): Promise<DbEntity[]> {

        if (!this.okToCacheLocally || this.entityCache.length === 0) {
            // Rebuild cache for this entity
            const tableClient = TableClient.fromConnectionString(this.storageAccountConnectionString, tableName);
            const entities = tableClient.listEntities();
            this.entityCache = [];
            for await (const entity of entities) {
                // Remove any duplicates which sometimes occur after a watch restart
                if (this.entityCache.find((e) => e.rowKey === entity.rowKey) === undefined) {
                    const e = this.expandPropertyValues(entity as DbEntityType);
                    this.entityCache.push(e as DbEntity);
                }
            }
        }
        return this.entityCache;
    }

    async createEntity(tableName: string, rowKey: string, newEntity: DbEntityType): Promise<void> {

        this.entityCache = [];
        const entity = this.compressPropertyValues(newEntity) as DbEntityType;
        const tableClient = TableClient.fromConnectionString(this.storageAccountConnectionString, tableName);
        try {
             await tableClient.createEntity({
                partitionKey: tableName,
                rowKey,
                ...entity
            });
        } catch (ex) {
            if (ex.response?.status !== 409) {
                throw new HttpError(500, ex.message);
            }
        }
}

    async updateEntity(tableName: string, updatedEntity: DbEntityType): Promise<void> {

        this.entityCache = [];
        const e = this.compressPropertyValues(updatedEntity) as DbEntityType;
        const tableClient = TableClient.fromConnectionString(this.storageAccountConnectionString, tableName);
        await tableClient.updateEntity(e as TableEntity, "Replace");

    }

    private expandPropertyValues(entity: DbEntityType): DbEntityType {
        const result = {} as DbEntityType;
        for (const key in entity) {
            result[key] = this.expandPropertyValue(entity[key]);
        }
        return result;
    }

    private expandPropertyValue(v: any): any {
        if (typeof v === "string" && (v.charAt(0) === '{' || v.charAt(0) === '[')) {
            try {
                return JSON.parse(v);
            }
            catch (e) {
                return v;
            }
        } else {
            return v;
        }
    };

    private compressPropertyValues(entity: DbEntityType): DbEntityType {
        const result = {} as DbEntityType;
        for (const key in entity) {
            result[key] = this.compressPropertyValue(entity[key]);
        }
        return result;
    }

    private compressPropertyValue(v: any): any {
        if (typeof v === "object") {
            return JSON.stringify(v);
        } else {
            return v;
        }
    };

}
