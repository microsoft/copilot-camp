import { IProduct } from '../serviceModel';
import {
    TABLE_NAME, DbProduct, DbSupplier, DbCategory, DbOrderDetail
} from './dbModel';
import { TableClient } from "@azure/data-tables";
import config from "../../config";
import ReferenceDataManager from './dbReferenceData';
import CalculatedDataManager from './dbCalculatedData';
import { HttpError } from '../../utilities';

class NorthwindDbService {

    async getAllProducts(): Promise<IProduct[]> {

        const result: IProduct[] = [];
        const tableClient = TableClient.fromConnectionString(config.storageAccountConnectionString, TABLE_NAME.PRODUCT);

        const entities = tableClient.listEntities();

        for await (const entity of entities) {
            const supplier = await ReferenceDataManager.getSupplier(entity.SupplierID as string);
            const category = await ReferenceDataManager.getCategory(entity.CategoryID as string);
            const calculatedProperties = await CalculatedDataManager.getCalculatedPropertiesForProduct(entity);

            const p: IProduct = {
                productId: entity.ProductID as number,
                productName: entity.ProductName as string,
                supplierId: entity.SupplierID as number,
                categoryId: entity.CategoryID as number,
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
    async updateProduct(updatedProduct: IProduct): Promise<IProduct> {

        const tableClient = TableClient.fromConnectionString(config.storageAccountConnectionString, TABLE_NAME.PRODUCT);

        const foundProduct = await tableClient.getEntity(TABLE_NAME.PRODUCT, updatedProduct.productId.toString()) as DbProduct;
        if (!foundProduct) {
            throw new HttpError(401, `Product ${updatedProduct.productId} not found`);
        }

        // Make sure someone isn't trying to update a field they shouldn't
        this.validateUpdatedField("Product ID", foundProduct.ProductID, updatedProduct.productId);
        this.validateUpdatedField("Product Name", foundProduct.ProductName, updatedProduct.productName);
        this.validateUpdatedField("Supplier ID", foundProduct.SupplierID, updatedProduct.supplierId);
        this.validateUpdatedField("Category ID", foundProduct.CategoryID, updatedProduct.categoryId);
        this.validateUpdatedField("Unit Price", foundProduct.UnitPrice, updatedProduct.unitPrice);
        this.validateUpdatedField("Quantity Per Unit", foundProduct.QuantityPerUnit, updatedProduct.quantityPerUnit);
        this.validateUpdatedField("Unit price", foundProduct.UnitPrice, updatedProduct.unitPrice);
        this.validateUpdatedField("Reorder Level", foundProduct.ReorderLevel, updatedProduct.reorderLevel);
        this.validateUpdatedField("Image URL", foundProduct.ImageUrl, updatedProduct.imageUrl);

        // Only these fields can be updated!
        foundProduct.UnitsInStock = updatedProduct.unitsInStock;
        foundProduct.UnitsOnOrder = updatedProduct.unitsOnOrder;
        foundProduct.Discontinued = updatedProduct.discontinued;

        await tableClient.updateEntity(foundProduct, "Replace");

        console.log(`Updated product ${updatedProduct.productId}`);
        return updatedProduct;

    }

    validateUpdatedField(fieldName: string, foundField: any, updatedField: any) {
        if (foundField !== updatedField) {
            throw new HttpError(401, `Field ${fieldName} cannot be updated`);
        }
    }
}

export default new NorthwindDbService();