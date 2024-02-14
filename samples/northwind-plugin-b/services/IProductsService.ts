import { IProductResult } from '../model';

export default interface IProductsService {
    searchProducts (productName: string, categoryName: string, inventoryStatus: string,
        supplierCity: string, stockLevel: string) : Promise<IProductResult[]>;
    getDiscountedProductsByCategory(categoryName: string): Promise<IProductResult[]>;
    getProductsByRevenueRange(revenueRange: string): Promise<IProductResult[]>;
}
