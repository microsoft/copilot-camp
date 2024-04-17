import { Context, HttpRequest } from "@azure/functions";
import ConsultantApiService from "../services/ConsultantApiService";
import { ApiConsultant, ApiChargeTimeResponse, ErrorResult } from "../model/apiModel";
import { HttpError, cleanUpParameter } from "../services/Utilities";
import Identity from "../services/IdentityService";

// Define a Response interface.
interface Response {
  status: number;
  body: {
    results: ApiConsultant[] | ApiChargeTimeResponse | ErrorResult;
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
      results: []
    }
  };

  try {

    const identity = new Identity(req);

    const command = req.params.command?.toLowerCase();

    switch (req.method) {
      case "GET": {

        if (command) {
          throw new HttpError(400, `Invalid command: ${command}`);
        }

        console.log(`➡️ GET /api/me request`);

        const result = [await ConsultantApiService.getApiConsultantById(identity, identity.id)];
        res.body.results = result;
        console.log(`   ✅ GET /me response status ${res.status}; ${result.length} consultants returned`);
        return res;
      }
      case "POST": {
        switch (command) {
          case "chargetime": {
            const projectName = cleanUpParameter("projectName", req.body.projectName);
            if (!projectName) {
              throw new HttpError(400, `Missing project name`);
            }
            const hours = req.body.hours;
            if (!hours) {
              throw new HttpError(400, `Missing hours`);
            }
            if (typeof hours !== 'number' || hours < 0 || hours > 24) {
              throw new HttpError(400, `Invalid hours: ${hours}`);
            }

            console.log(`➡️ POST /api/me/chargetime request for project ${projectName}, hours ${hours}`);
            const result = await ConsultantApiService.chargeTimeToProject
              (identity, projectName, identity.id, hours);

            res.body.results = {
              status: 200,
              clientName: result.clientName,
              projectName: result.projectName,
              remainingForecast: result.remainingForecast,
              message: result.message
            };
            console.log(`   ✅ POST /api/me/chargetime response status ${res.status}; ${result.message}`);
            return res;
          }
          default: {
            throw new HttpError(400, `Invalid command: ${command}`);
          }
        }
      }
      default:
        throw new HttpError(405, `Method not allowed: ${req.method}`);
    }

  } catch (error) {

    const status = <number>error.status || <number>error.response?.status || 500;
    console.log(`   ⛔ Returning error status code ${status}: ${error.message}`);

    res.status = status;
    res.body.results = {
      status: status,
      message: error.message
    };
    return res;
  }
}
