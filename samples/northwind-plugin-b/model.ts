export interface IProductResult {
    productId: string;
    productName: string;
    supplierId: string;
    categoryId: string;
    quantityPerUnit: string;
    unitPrice: number;
    unitsInStock: number;
    unitsOnOrder: number;
    reorderLevel: number;
    discontinued: boolean;
    imageUrl: string;
    categoryName: string,
    supplierName: string,
    supplierCity: string,
    inventoryStatus: string,
    inventoryValue: number,
    unitSales: number,
    revenue: number,
    averageDiscount: number
}
