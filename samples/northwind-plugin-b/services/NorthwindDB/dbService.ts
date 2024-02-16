import { IProduct } from '../serviceModel';
import {
    TABLE_NAME, DbProduct, DbSupplier, DbCategory, DbOrderDetail
} from './dbModel';
import { TableClient } from "@azure/data-tables";
import config from "../../config";
import ReferenceDataManager from './dbReferenceData';
import CalculatedDataManager from './dbCalculatedData';

class NorthwindDbService {

    async getAllProducts() : Promise<IProduct[]> {

        const result: IProduct[] = [];
        const tableClient = TableClient.fromConnectionString(config.storageAccountConnectionString, TABLE_NAME.PRODUCT);

        const entities = tableClient.listEntities();

        for await (const entity of entities) {
            const supplier = await ReferenceDataManager.getSupplier(entity.SupplierID as string);
            const category = await ReferenceDataManager.getCategory(entity.CategoryID as string);
            const calculatedProperties = await CalculatedDataManager.getCalculatedPropertiesForProduct(entity);
        
            const p: IProduct = {
                productId: entity.ProductID as string,
                productName: entity.ProductName as string,
                supplierId: entity.SupplierID as string,
                categoryId: entity.CategoryID as string,
                quantityPerUnit: entity.QuantityPerUnit as string,
                unitPrice: entity.UnitPrice as number,
                unitsInStock: entity.UnitsInStock as number,
                unitsOnOrder: entity.UnitsOnOrder as number,
                reorderLevel: entity.ReorderLevel as number,
                discontinued: entity.Discontinued as boolean,
                imageUrl: entity.ImageUrl as string,
                supplierName: supplier.CompanyName as string,
                supplierCity: supplier.City as string,
                categoryName: category.CategoryName,
                inventoryStatus: calculatedProperties.inventoryStatus,
                valueOfInventory: calculatedProperties.valueOfInventory,
                unitSales: calculatedProperties.totalQuantity,
                revenue: calculatedProperties.totalRevenue,
                averageDiscount: calculatedProperties.totalDiscount / calculatedProperties.totalQuantity
            }


            result.push(p);
        }

        return result;

    }

    createProduct(product: IProduct) : Promise<IProduct> {
        return null;
    }

    updateProduct(product: IProduct) : Promise<IProduct> {
        return null;
    }
}

export default new NorthwindDbService();