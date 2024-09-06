/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import ConsultantApiService from "../services/ConsultantApiService";
import { ApiConsultant, ApiChargeTimeResponse, ErrorResult } from "../model/apiModel";
import { HttpError, cleanUpParameter } from "../services/Utilities";
import IdentityService from "../services/IdentityService";
/**
 * This function handles the HTTP request and returns my information.
 *
 * @param {HttpRequest} req - The HTTP request.
 * @param {InvocationContext} context - The Azure Functions context object.
 * @returns {Promise<HttpResponse>} - A promise that resolves with the HTTP response containing my information.
 */

// Define a Response interface.
interface Response extends HttpResponseInit {
  status: number;
  jsonBody: {
    results: ApiConsultant[] | ApiChargeTimeResponse | ErrorResult;
  };
}
export async function me(
  req: HttpRequest,
  context: InvocationContext
): Promise<Response> {
  context.log("HTTP trigger function me processed a request.");

  // Initialize response.
  const res: Response = {
    status: 200,
    jsonBody: {
      results: [],
    },
  };

  try {
    const me = await IdentityService.validateRequest(req);
    const command = req.params.command?.toLowerCase();   
    let body=null; 
    switch (req.method) {
      case "GET": {

        if (command) {
          throw new HttpError(400, `Invalid command: ${command}`);
        }

        console.log(`➡️ GET /api/me request`);

        const result = [ me ];
        res.jsonBody.results = result;
        console.log(`   ✅ GET /me response status ${res.status}; ${result.length} consultants returned`);
        return res;
      }
      case "POST": {
        const me = await IdentityService.validateRequest(req);
        switch (command) {
          case "chargetime": {  
            try {
              const bd = await req.text();
              body = JSON.parse(bd);
            } catch (error) {
              throw new HttpError(400, `No body to process this request.`);
            }
            if (body) {              
            
            const projectName = cleanUpParameter("projectName", body["projectName"]);
            if (!projectName) {
              throw new HttpError(400, `Missing project name`);
            }
            const hours = body["hours"];
            if (!hours) {
              throw new HttpError(400, `Missing hours`);
            }
            if (typeof hours !== 'number' || hours < 0 || hours > 24) {
              throw new HttpError(400, `Invalid hours: ${hours}`);
            }

            console.log(`➡️ POST /api/me/chargetime request for project ${projectName}, hours ${hours}`);
            const result = await ConsultantApiService.chargeTimeToProject (projectName, me.id, hours);

            res.jsonBody.results = {
              status: 200,
              clientName: result.clientName,
              projectName: result.projectName,
              remainingForecast: result.remainingForecast,
              message: result.message
            };
            console.log(`   ✅ POST /api/me/chargetime response status ${res.status}; ${result.message}`);
            } else {
              throw new HttpError(400, `Missing request body`);
            }
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
    res.jsonBody.results = {
      status: status,
      message: error.message
    };
    return res;
  }

}

app.http("me", {
  methods: ["GET","POST"],
  authLevel: "anonymous",
  route: "me/{*command}",
  handler: me,
});
