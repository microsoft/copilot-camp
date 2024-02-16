/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

import { Context, HttpRequest } from "@azure/functions";

import { IProduct } from "../services/serviceModel";
import productService from "../services/Products/productsServiceMock";

// Define a Response interface.
interface Response {
  status: number;
  body: {
    results: any[];
  };
}

/**
 * This function handles the HTTP request and returns the repair information.
 *
 * @param {Context} context - The Azure Functions context object.
 * @param {HttpRequest} req - The HTTP request.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response containing the repair information.
 */
export default async function run(context: Context, req: HttpRequest): Promise<Response> {

  // Initialize response.
  let results = [];
  const res: Response = {
    status: 200,
    body: {
      results: results,
    },
  };

  const productIdOrName = req.params?.id;
  switch (req.method) {
    case 'GET': {
      if (!productIdOrName) {

        // Request is a query of products by attribute:
        // /products?productName=x&categoryName=x&supplierName=x&supplierLocation=x&
        //                         inventoryStatus=x&inventoryRange=x&discounted=x&
        //                         revenueRange=x
        const productName = req.query?.productName || "";
        const categoryName = req.query?.categoryName || "";
        const supplierName = req.query?.supplierName || "";
        const supplierLocation = req.query?.supplierLocation || "";
        const inventoryStatus = req.query?.inventoryStatus || "";
        const inventoryRange = req.query?.inventoryRange || "";
        const discontinued = req.query?.discontinued || "";
        const revenueRange = req.query?.revenueRange || "";
        results = await productService.getProducts(productName, categoryName, supplierName,
          supplierLocation, inventoryStatus, inventoryRange, discontinued, revenueRange)
        console.log(`Returning ${results.length} rows in search for ${productIdOrName}`);

      } else {

        // Request for an individual product by ID or name
        // /products/idOrName

        const product = await productService.getProduct(productIdOrName);
        results = product ? [product] : [];

      }
      break;
    }

    case 'POST': {

      const product = req.body;
      if (!productIdOrName) {
        // Request to create a product
        const newProduct = await productService.createProduct(product);
        results = [newProduct];
      } else {
        // Request to update a product by ID or name
        const updatedProduct = await productService.updateProduct(productIdOrName, product);
        results = [updatedProduct];
      }
      break;
    }
    default: {
      break;
    }
  }

    res.body.results = results;
  return res;
}
