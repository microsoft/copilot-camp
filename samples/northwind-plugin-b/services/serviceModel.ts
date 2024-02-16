// Internal service used by Azure functions to satisfy http requests

export interface IProduct {
    // Mapped directly to database fields:
    productId: number;
    productName: string;
    supplierId: number;
    categoryId: number;
    quantityPerUnit: string;
    unitPrice: number;
    unitsInStock: number;
    unitsOnOrder: number;
    reorderLevel: number;
    discontinued: boolean;
    imageUrl: string;
    // Denormalized during augmentation
    categoryName: string,
    supplierName: string,
    supplierCity: string,
    // Generated from order details during augmentation
    inventoryStatus: string,
    valueOfInventory: number,
    unitSales: number,
    revenue: number,
    averageDiscount: number
}

export interface IProductsService {

    getProducts (
        productId: number,
        productName: string,
        categoryName: string,
        supplierName: string,
        supplierLocation: string,
        inventoryStatus: string,
        inventoryRange: string,
        discontinued: string,
        revenueRange: string
        ) : Promise<IProduct[]>;
    updateProduct(productIdOrName: string, product: IProduct);
}
