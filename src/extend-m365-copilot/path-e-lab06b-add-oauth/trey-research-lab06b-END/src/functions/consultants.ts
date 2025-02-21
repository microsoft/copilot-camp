/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import ConsultantApiService from "../services/ConsultantApiService";
import { ApiConsultant, ErrorResult } from "../model/apiModel";
import { cleanUpParameter } from "../services/Utilities";
import IdentityService from "../services/IdentityService";

/**
 * This function handles the HTTP request and returns the consultant information.
 *
 * @param {HttpRequest} req - The HTTP request.
 * @param {InvocationContext} context - The Azure Functions context object.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response containing the consultant information.
 */

// Define a Response interface.
interface Response extends HttpResponseInit {
    status: number;
    jsonBody: {
      results: ApiConsultant[] | ErrorResult;
    };
  }
export async function consultants(
  req: HttpRequest,
  context: InvocationContext
): Promise<Response> {
  context.log("HTTP trigger function consultants processed a request.");

   // Initialize response.
   const res: Response = {
    status: 200,
    jsonBody: {
      results: [],
    },
  };
  try {
    // Will throw an exception if the request is not valid
    await IdentityService.validateRequest(req);

    // Get the input parameters
    let consultantName = req.query.get("consultantName")?.toString().toLowerCase() || "";
    let projectName = req.query.get("projectName")?.toString().toLowerCase() || "";
    let skill = req.query.get("skill")?.toString().toLowerCase() || "";
    let certification = req.query.get("certification")?.toString().toLowerCase() || "";
    let role = req.query.get("role")?.toString().toLowerCase() || "";
    let hoursAvailable = req.query.get("hoursAvailable")?.toString().toLowerCase() || "";

    const id = req.params?.id?.toLowerCase();

    if (id) {
      console.log(`➡️ GET /api/consultants/${id}: request for consultant ${id}`);
      const result = await ConsultantApiService.getApiConsultantById(id);
      res.jsonBody.results = [result];
      console.log(`   ✅ GET /api/consultants/${id}: response status 1 consultant returned`);
      return res;
    }

    console.log(`➡️ GET /api/consultants: request for consultantName=${consultantName}, projectName=${projectName}, skill=${skill}, certification=${certification}, role=${role}, hoursAvailable=${hoursAvailable}`);

    // *** Tweak parameters for the AI ***
    consultantName = cleanUpParameter("consultantName", consultantName);
    projectName = cleanUpParameter("projectName", projectName);
    skill = cleanUpParameter("skill", skill);
    certification = cleanUpParameter("certification", certification);
    role = cleanUpParameter("role", role);
    hoursAvailable = cleanUpParameter("hoursAvailable", hoursAvailable);
    
    const result = await ConsultantApiService.getApiConsultants(
      consultantName, projectName, skill, certification, role, hoursAvailable
    );
    res.jsonBody.results = result;
    console.log(`   ✅ GET /api/consultants: response status ${res.status}; ${result.length} consultants returned`);
    return res;

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

app.http("consultants", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "consultants/{*id}",
  handler: consultants,
});
