import { IProduct, IProductsService } from '../serviceModel';

class ProductsServiceMock implements IProductsService {

    public async getProducts(productId: number, productName: string, categoryName: string, supplierName: string,
        supplierLocation: string, inventoryStatus: string, inventoryRange: string,
        discontinued: string, revenueRange: string): Promise<IProduct[]> {

        let results: IProduct[] = mockResults;
        if (productId) {
            results = results.filter(r => r.productId === productId);
        }
        if (productName) {
            results = results.filter(r => r.productName.toLowerCase().indexOf(productName.toLowerCase()) >= 0);
        }
        if (categoryName) {
            results = results.filter(r => r.categoryName.toLowerCase().indexOf(categoryName.toLowerCase()) >= 0);
        }
        if (supplierName) {
            results = results.filter(r => r.supplierName.toLowerCase().indexOf(supplierName.toLowerCase()) >= 0);
        }
        if (supplierLocation) {
            results = results.filter(r => r.supplierCity.toLowerCase().indexOf(supplierLocation.toLowerCase()) >= 0);
        }
        if (inventoryStatus) {
            results = results.filter(r => r.inventoryStatus.toLowerCase().indexOf(inventoryStatus.toLowerCase()) >= 0);
        }
        if (inventoryRange) {
            const range = inventoryRange.split("-");
            const min = parseInt(range[0]) || 0;;
            const max = parseInt(range[1]) || Number.MAX_VALUE;
            results = results.filter(r => r.unitsInStock >= min && r.unitsInStock <= max);
        }
        if (discontinued) {
            results = results.filter(r => r.discontinued === (discontinued.toLowerCase() === "true"));
        }
        if (revenueRange) {
            const range = revenueRange.split("-");
            const min = parseInt(range[0]) || 0;
            const max = parseInt(range[1]) || Number.MAX_VALUE
            results = results.filter(r => r.revenue >= min && r.revenue <= max);
        }
        return results;
    }

    public async getProduct(productIdOrName: string): Promise<IProduct> {

        let results: IProduct[] = [];
        if (parseInt(productIdOrName) >= 0) {

            // We have a product ID
            const productId = parseInt(productIdOrName);
            results = mockResults.filter(r => r.productId === productId);

        } else {

            // We have a product name
            const nameQuery = productIdOrName.toLowerCase().trim();
            results = mockResults.filter(r => r.productName.toLowerCase().indexOf(nameQuery) >= 0);
        }
        return results?.length > 0 ? results[0] : null;
    }

    public async createProduct(product: IProduct) {
        product.productId = 999;
        return product;
    }

    public async updateProduct(productIdOrName: string, product: IProduct) {
        return product;
    }
}

const mockResults: IProduct[] =
    [
        {
            productId: 1,
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
            valueOfInventory: 6300,
            unitSales: 828,
            revenue: 12788,
            averageDiscount: 8.6
        },
        {
            productId: 14,
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
            valueOfInventory: 814,
            unitSales: 404,
            revenue: 7991,
            averageDiscount: 12.5,
        }
    ];

export default new ProductsServiceMock;
