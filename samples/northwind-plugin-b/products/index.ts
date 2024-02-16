/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

import { Context, HttpRequest } from "@azure/functions";

import productService from "../services/Products/productsService";
import { HttpError } from "../utilities";

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

  try {

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
          results = await productService.getProducts(null, productName, categoryName, supplierName,
            supplierLocation, inventoryStatus, inventoryRange, discontinued, revenueRange)
          console.log(`Returning ${results.length} rows in search for ${productIdOrName}`);

        } else if (parseInt(productIdOrName) >= 0) {

          // Request for a product by ID
          const productId = parseInt(productIdOrName);
          results = await productService.getProducts(productId, null, null, null, null, null, null, null, null);
          results = results.length > 0 ? [results[0]] : [];
          console.log(`Found product with id ${productIdOrName}`);

        } else {

          // Request for a product by name
          results = await productService.getProducts(null, productIdOrName, null, null, null, null, null, null, null);
          results = results.length > 0 ? [results[0]] : [];
          console.log(`Found product with name ${productIdOrName}`);

        }
        break;
      }

      case 'POST': {

        const product = req.body;
        if (!productIdOrName) {

          // Invalid request to update an unidentified product
          throw new HttpError(400, "Product ID or name is required in the URL");

        } else {

          // Request to update a product by ID
          const productId = parseInt(productIdOrName);
          const updatedProduct = await productService.updateProduct(productId, product);
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

  catch (error) {
    console.log(`Error: ${error.message}`);
    return {
      status: error.status || 500,
      body: {
        results: [{ error: error.message }],
      },
    };
  }
}