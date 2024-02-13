import { IProductResult } from '../model';
import IProductsService from './IProductsService';

class ProductsServiceMock implements IProductsService {
    public async searchProducts(productName: string, categoryName: string, inventoryStatus: string,
        supplierCity: string, stockLevel: string): Promise<IProductResult[]> {
        return mockResults;
    }

    public async getDiscountedProductsByCategory(categoryName: string): Promise<IProductResult[]> {
        return mockResults;
    }

    public async getProductsByRevenueRange(revenueRange: string): Promise<IProductResult[]> {
        return mockResults;
    }
}
const mockResults: IProductResult[] =
    [
        {
            productId: "1",
            productName: "Chai",
            supplierId: "1",
            categoryId: "1",
            quantityPerUnit: "10 boxes x 20 bags",
            unitPrice: 18,
            unitsInStock: 350,
            unitsOnOrder: 0,
            reorderLevel: 25,
            discontinued: false,
            imageUrl: "https://picsum.photos/seed/1/200/300",
            categoryName: "Beverages",
            supplierName: "Contoso Beverage Company",
            supplierCity: "London",
            inventoryStatus: "In stock",
            inventoryValue: 6300,
            unitSales: 828,
            revenue: 12788,
            averageDiscount: 8.6
        },
        {
            productId: "14",
            productName: "Tofu",
            supplierId: "6",
            categoryId: "7",
            quantityPerUnit: "40 - 100 g pkgs.",
            unitPrice: 23.25,
            unitsInStock: 35,
            unitsOnOrder: 0,
            reorderLevel: 20,
            discontinued: false,
            imageUrl: "https://picsum.photos/seed/14/200/300",
            categoryName: "Produce",
            supplierName: "Mayumi's",
            supplierCity: "Osaka",
            inventoryStatus: "In stock",
            inventoryValue: 814,
            unitSales: 404,
            revenue: 7991,
            averageDiscount: 12.5,
        }
    ];

export default new ProductsServiceMock;
