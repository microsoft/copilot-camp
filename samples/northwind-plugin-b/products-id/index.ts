/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

import { Context, HttpRequest } from "@azure/functions";

import productService from "../services/productsServiceMock";

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
  const res: Response = {
    status: 200,
    body: {
      results: [],
    },
  };

  // Get the query parameter
  const productIdOrName = req.params?.id;

  let results = await productService.searchProducts("", "", "","","");

  // Fix me  
  if (productIdOrName) {
    results = results.filter(r => r.productId == productIdOrName ||
                                  r.productName.toLowerCase() == productIdOrName.toLocaleLowerCase());
  }

  if (results) {
    res.body.results = results;
  }

  return res;
}
