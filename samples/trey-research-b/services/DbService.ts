import { TableClient, TableEntity } from "@azure/data-tables";
import { HttpError } from '../utilities';

export default class DbService<DbEntityType> {

    private storageAccountConnectionString = process.env.STORAGE_ACCOUNT_CONNECTION_STRING;
    private okToCacheLocally = false;
    private entityCache: DbEntityType[] = [];

    constructor(okToCacheLocally: boolean) {
        if (!this.storageAccountConnectionString) {
            throw new Error("STORAGE_ACCOUNT_CONNECTION_STRING is not set");
        }
        this.okToCacheLocally = okToCacheLocally;
    }


    async getEntityByRowKey(tableName: string, rowKey: string): Promise<DbEntityType> {
        if (!this.okToCacheLocally) {
            const tableClient = TableClient.fromConnectionString(this.storageAccountConnectionString, tableName);
            const result = this.expandPropertyValues(await tableClient.getEntity(tableName, rowKey) as DbEntityType);
            console.log(`Retrieved ${tableName} entity id=${rowKey}`);
            return result as DbEntityType;
        } else {
            const entities = await this.getEntities(tableName, (entity: any) => entity.rowKey === rowKey);
            if (entities.length === 0) {
                throw new HttpError(401, `Entity ${rowKey} not found`);
            } else {
                console.log(`Retrieved cached ${tableName} entity id=${rowKey}`);
                return entities[0];
            }
        }
    }

    async getEntities(tableName: string, filter: (entity: DbEntityType) => boolean): Promise<DbEntityType[]> {

        let entities;
        let result: DbEntityType[] = [];

        if (this.okToCacheLocally && this.entityCache.length > 0) {
            entities = this.entityCache;
        } else {
            const tableClient = TableClient.fromConnectionString(this.storageAccountConnectionString, tableName);
            entities = tableClient.listEntities();
            if (this.okToCacheLocally) {
                for await (const entity of entities) {
                    this.entityCache.push(entity as DbEntityType);
                }
            }
        }

        for await (const entity of this.entityCache) {
            if (filter(entity as DbEntityType)) {
                result.push(this.expandPropertyValues(entity as DbEntityType));
            }
        }
        return result;
    }

    async updateEntity(tableName: string, id: string, updatedEntity: DbEntityType,
        copyFields: (from: DbEntityType, to: DbEntityType) => void): Promise<DbEntityType> {
        const tableClient = TableClient.fromConnectionString(this.storageAccountConnectionString, tableName);
        const foundEntity: DbEntityType = <DbEntityType>await tableClient.getEntity(tableName, id);
        if (!foundEntity) {
            throw new HttpError(401, `Entity ${id} not found`);
        } else {
            copyFields(updatedEntity, foundEntity as DbEntityType);
            await tableClient.updateEntity(foundEntity as TableEntity, "Replace");
            console.log(`Updated ${tableName} entity id=${id}`);
            return foundEntity;
        }
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
}
