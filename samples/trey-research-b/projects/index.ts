import { Context, HttpRequest } from "@azure/functions";
import ProjectApiService from "../services/ProjectApiService";
import { ApiProject, ErrorResult } from "../model/apiModel";

// Define a Response interface.
interface Response {
  status: number;
  body: {
    results: ApiProject[] | ErrorResult;
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

  try {

    const command = req.params.command?.toLowerCase();

    switch (req.method) {
      case "GET": {

        const projectName = req.query.projectName?.toString().toLowerCase() || "";
        const consultantName = req.query.consultantName?.toString().toLowerCase() || "";

        const id = req.params.id?.toLowerCase();

        if (id) {
          const result = await ProjectApiService.getApiProjectById(id);
          res.body.results = [result];
          return res;
        }

        const result = await ProjectApiService.getApiProjects(projectName, consultantName);
        res.body.results = result;
        return res;
      }
      case "POST": {
        throw new Error(`Method not allowed: ${req.method}`);
      }
      default: {
        throw new Error(`Method not allowed: ${req.method}`);
      }
    }

  } catch (error) {

    const status = <number>error.status || <number>error.response?.status || 500;
    console.log(`Returning error status code ${status}: ${error.message}`);

    res.status = status;
    res.body.results = {
      status: status,
      error: error.message
    };
    return res;
  }
  
}
