import { IProduct, IProductsService } from '../serviceModel';
import NorthwindDbService from '../NorthwindDB/dbService';
import { HttpError } from "../../utilities";
import dbService from '../NorthwindDB/dbService';

class ProductsService implements IProductsService {

    public async getProducts(productId: number, productName: string, categoryName: string, supplierName: string,
        supplierLocation: string, inventoryStatus: string, inventoryRange: string,
        discontinued: string, revenueRange: string): Promise<IProduct[]> {

        let results: IProduct[] = await NorthwindDbService.getAllProducts();
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
            results = results.filter(r => this.isMatchingStatus(inventoryStatus, r));
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

    // Returns true if the inventory status in a product matches the query
    // Note the inventory status calculated field won't work because more than one
    // status may apply (e.g. a product could be low on stock and on order at the same time)
    private isMatchingStatus(inventoryStatusQuery: string, product: IProduct): boolean {

        const query = inventoryStatusQuery.toLowerCase();
        if (query.startsWith("out")) {
            // Out of stock
            return product.unitsInStock === 0;
        } else if (query.startsWith("low")) {
            // Low stock
            return product.unitsInStock <= product.reorderLevel;
        } else if (query.startsWith("on")) {
            // On order
            return product.unitsOnOrder > 0;
        } else {
            // In stock
            return product.unitsInStock > 0;
        }
    }

    public async updateProduct(productId: number, product: IProduct) {

        // First check to be sure we're updating the right product
        if (product.productId !== productId) {
            throw new HttpError(400, "Product ID in URL does not match product ID in body");
        }
        await dbService.updateProduct(product);

        return product;
    }
}

export default new ProductsService();
