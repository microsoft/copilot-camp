import { Context, HttpRequest } from "@azure/functions";
import ConsultantApiService from "../services/ConsultantApiService";
import { ApiConsultant, ErrorResult } from "../model/apiModel";
import { HttpError } from "../utilities";

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

  const MY_CONSULTANT_ID = '1';

  try {

    const command = req.params.command?.toLowerCase();

    switch (req.method) {
      case "GET": {

        if (command) {
          throw new HttpError(400, `Invalid command: ${command}`);
        }

        const result = [await ConsultantApiService.getApiConsultantById(MY_CONSULTANT_ID)];
        res.body.results = result;
        return res;
      }
      case "POST": {
        throw new HttpError(405, `Method not allowed: ${req.method}`);
      }
      default:
        throw new HttpError(405, `Method not allowed: ${req.method}`);
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
