import { TableClient, TableEntity } from "@azure/data-tables";
import { HttpError } from '../utilities';

export default class DbService<DbEntityType> {

    private storageAccountConnectionString = process.env.STORAGE_ACCOUNT_CONNECTION_STRING;

    async getEntityById(tableName: string, id: string): Promise<DbEntityType> {
        const tableClient = TableClient.fromConnectionString(this.storageAccountConnectionString, tableName);
        const result = this.expandPropertyValues(await tableClient.getEntity(tableName, id) as DbEntityType);
        return result as DbEntityType;
    }

    async getEntities(tableName: string, filter: (entity: DbEntityType) => boolean): Promise<DbEntityType[]> {
        const tableClient = TableClient.fromConnectionString(this.storageAccountConnectionString, tableName);
        const entities = tableClient.listEntities();
        const result: DbEntityType[] = [];

        for await (const entity of entities) {
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
            console.log(`Converting key ${key}`);
            result[key] = this.expandPropertyValue(entity[key]);
            console.log(`Converted key ${key}`);
        }
        return result;
    }

    private expandPropertyValue(v: any): any {
        console.log (`Converting value ${v}`);
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
