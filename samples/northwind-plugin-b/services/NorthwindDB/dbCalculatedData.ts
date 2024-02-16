import {
    TABLE_NAME, DbSupplier, DbCategory, DbOrderDetail, DbProduct
} from './dbModel';
import { TableClient, TableEntityResult } from "@azure/data-tables";
import config from "../../config";

// Properties derived from OrderDetails entries for a product
interface ICalculatedOrderProperties {  
    totalQuantity: number;
    totalRevenue: number;
    totalDiscount: number;
}
// Dictionary of calculated properties from OrderDetails for all products
interface ICalculatedOrderPropertyValues {
    [productId: string]: ICalculatedOrderProperties;
}
// All calculated properties for a product
interface ICalculatedProperties extends ICalculatedOrderProperties {
    valueOfInventory: number;
    inventoryStatus: string;
}

class CalculatedDataManager {

    private _calculatedOrderProperties: ICalculatedOrderPropertyValues;
    private async loadCalculatedOrderPropertyValues(): Promise<ICalculatedOrderPropertyValues> {

        const tableClient = TableClient.fromConnectionString(config.storageAccountConnectionString, TABLE_NAME.ORDER_DETAIL);

        const entities = tableClient.listEntities();

        let result: ICalculatedOrderPropertyValues = {};
        for await (const entity of entities) {
            const p = entity.ProductID as string;
            if (!result[p]) {
                result[p] = {
                    totalQuantity: Number(entity.Quantity),
                    totalRevenue: Number(entity.Quantity) * Number(entity.UnitPrice) * (1 - Number(entity.Discount)),
                    totalDiscount: Number(entity.Quantity) * Number(entity.UnitPrice) * Number(entity.Discount)
                }
            } else {
                result[p].totalQuantity += Number(entity.Quantity);
                result[p].totalRevenue += Number(entity.Quantity) * Number(entity.UnitPrice) * (1 - Number(entity.Discount));
                result[p].totalDiscount += Number(entity.Quantity) * Number(entity.UnitPrice) * Number(entity.Discount);
            }
        }

        return result;

    }

    public async getCalculatedPropertiesForProduct(product: TableEntityResult<Record<string, unknown>>): Promise<ICalculatedProperties> {

        if (!this._calculatedOrderProperties) {
            this._calculatedOrderProperties = await this.loadCalculatedOrderPropertyValues();
        }

        const orderProperties = this._calculatedOrderProperties[product.ProductID as string];
        const inventoryStatus = this.getInventoryStatus(product.UnitsInStock as number, product.UnitsOnOrder as number, product.ReorderLevel as number);
        const valueOfInventory = Math.round((product.UnitsInStock as number) * (product.UnitPrice as number));

        return {
            ...orderProperties,
            valueOfInventory,
            inventoryStatus
        };
    }

    private getInventoryStatus = (unitsInStock, unitsOnOrder, reorderLevel) => {
        if (Number(unitsInStock) >= Number(reorderLevel)) {
          return "In stock";
        } else if (Number(unitsInStock) < Number(reorderLevel) && Number(unitsOnOrder) === 0) {
          return "Low stock";
        } else if (Number(unitsInStock) < Number(reorderLevel) && Number(unitsOnOrder) > 0) {
          return "On order";
        } else if (Number(unitsInStock) === 0) {
          return "Out of stock";
        } else {
          return "Unknown"; //fall back
        }
      }

}

export default new CalculatedDataManager();
