/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

import { Context, HttpRequest, HttpRequestQuery } from "@azure/functions";

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

  // Initialize response.
  let results = [];
  const res: Response = {
    status: 200,
    body: {
      results: results,
    },
  };

  try {

    const productIdOrName = req.params?.id;
    switch (req.method) {

      case 'GET': {

        if (!productIdOrName) {

          // Request for all products matching the specified query strings
          checkInvalidQueryStrings(req.query);
          const productName = req.query?.productName || "";
          const categoryName = req.query?.categoryName || "";
          let supplierName = req.query?.supplierName || "";
          const supplierCity = req.query?.supplierCity || "";
          const inventoryStatus = req.query?.inventoryStatus || "";
          const inventoryRange = req.query?.inventoryRange || "";
          const discontinued = req.query?.discontinued || "";
          const revenueRange = req.query?.revenueRange || "";

          // HACKS
          if (supplierName.toLowerCase().indexOf("northwind") >= 0) {
            console.log(`HACK: Removing requested supplier name "${supplierName}" from API query`);
            supplierName = "";
          }
          // END HACKS
          
          results = await productService.getProducts(null, productName, categoryName, supplierName,
            supplierCity, inventoryStatus, inventoryRange, discontinued, revenueRange);
          console.log(`Returning ${results.length} rows in search for ${JSON.stringify(req.query)}`);

        } else {

          for (const key in req.query) {
            throw new HttpError(400, "Query strings are not allowed with a product ID or name");
          } 
          if (!isNaN(parseInt(productIdOrName))) {

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
          
        }
        break;
      }

      case 'POST': {

        const product = req.body;
        if (!productIdOrName || isNaN(parseInt(productIdOrName))) {

          // Invalid request to update an unidentified product
          throw new HttpError(400, "A numeric product ID is required in the URL");

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
    const status = error.status || error.response?.status || 500;
    console.log(`Returning error status code ${status.status}: ${error.message}`);

    res.status = status;
    res.body.results = [{ error: error.message }];
    return res;
  }

  function checkInvalidQueryStrings(query: HttpRequestQuery): void {
    const validQueryStrings = [
      "productName", "categoryName", "supplierName", "supplierCity",
      "inventoryStatus", "inventoryRange", "discontinued", "revenueRange"
    ];
    for (const key in query) {
      if (!validQueryStrings.includes(key)) {
        throw new HttpError(400, `Invalid query string: ${key}. Choices are ${validQueryStrings}`);
      }
    }
  }
}