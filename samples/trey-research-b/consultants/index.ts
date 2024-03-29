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

    let consultantName = req.query.consultantName?.toString().toLowerCase() || "";
    let projectName = req.query.projectName?.toString().toLowerCase() || "";
    let skill = req.query.skill?.toString().toLowerCase() || "";
    let certification = req.query.certification?.toString().toLowerCase() || "";
    let role = req.query.role?.toString().toLowerCase() || "";
    let hoursAvailable = req.query.hoursAvailable?.toString().toLowerCase() || "";

    const id = req.params.id?.toLowerCase();

    if (id) {
      const result = await ConsultantApiService.getApiConsultantById(id);
      res.body.results = [result];
      return res;
    }

    console.log(`➡️ GET /api/consultants: request for consultantName=${consultantName}, projectName=${projectName}, skill=${skill}, certification=${certification}, role=${role}, hoursAvailable=${hoursAvailable}`);

    // *** Tweak parameters for the AI ***
    if (consultantName === "<user_name>") {
      console.log(`   ❗ Invalid consultantName '${consultantName}'; replacing with 'avery'.`);
      consultantName = "avery";
    }
    if (consultantName.toLowerCase().includes("trey")){
      console.log(`   ❗ Invalid consultantName '${consultantName}'; replacing with blank (matches any consultant).`);
      consultantName = "";
    }
    if (projectName.toLowerCase().includes("trey")){
      console.log(`   ❗ Invalid projectName '${projectName}'; replacing with blank (matches any project).`);
      projectName = "";
    }

    const result = await ConsultantApiService.getApiConsultants(
      consultantName, projectName, skill, certification, role, hoursAvailable
    );
    res.body.results = result;
    console.log(`   ✅ GET /api/consultants: response status ${res.status}; ${result.length} consultants returned`);
    return res;

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
