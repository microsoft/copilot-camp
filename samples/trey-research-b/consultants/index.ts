import { Context, HttpRequest } from "@azure/functions";
import ConsultantApiService from "../services/ConsultantApiService";
import { ApiConsultant, ErrorResult } from "../model/apiModel";

// Define a Response interface.
interface Response {
  status: number;
  body: {
    results: ApiConsultant[] | ErrorResult;
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

    const consultantName = req.query.consultantName?.toString().toLowerCase() || "";
    const projectName = req.query.projectName?.toString().toLowerCase() || "";
    const skill = req.query.skill?.toString().toLowerCase() || "";
    const certification = req.query.certification?.toString().toLowerCase() || "";
    const role = req.query.role?.toString().toLowerCase() || "";
    const hoursAvailable = req.query.hoursAvailable?.toString().toLowerCase() || "";
    const hoursDelivered = req.query.hoursDelivered?.toString().toLowerCase() || "";

    const id = req.params.id?.toLowerCase();

    if (id) {
      const result = await ConsultantApiService.getApiConsultantById(id);
      res.body.results = [result];
      return res;
    }

    const result = await ConsultantApiService.getApiConsultants(
      consultantName, projectName, skill, certification, role, hoursAvailable, hoursDelivered
    );
    res.body.results = result;
    return res;

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
