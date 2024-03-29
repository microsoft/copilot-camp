import { Context, HttpRequest } from "@azure/functions";
import ProjectApiService from "../services/ProjectApiService";
import { ApiProject, ErrorResult } from "../model/apiModel";
import { HttpError } from "../utilities";

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

    const id = req.params.id?.toLowerCase();

    switch (req.method) {
      case "GET": {

        const projectName = req.query.projectName?.toString().toLowerCase() || "";
        const consultantName = req.query.consultantName?.toString().toLowerCase() || "";

        console.log (`➡️ GET /api/projects: request for projectName=${projectName}, consultantName=${consultantName}, id=${id}`);

        if (id) {
          const result = await ProjectApiService.getApiProjectById(id);
          res.body.results = [result];
          console.log (`   ✅ GET /api/projects: response status ${res.status}; 1 projects returned`);
          return res;
        }

        const result = await ProjectApiService.getApiProjects(projectName, consultantName);
        res.body.results = result;
        console.log (`   ✅ GET /api/projects: response status ${res.status}; ${result.length} projects returned`);
        return res;
      }
      case "POST": {
        //   {
        //     projectName: "foo",
        //     consultantName: "avery",
        //     role: "architect",
        //     forecast: number,
        // }
        switch (id.toLocaleLowerCase()) {      
          case "assignconsultant": {
            const projectName = req.body.projectName;
            if (!projectName) {
              throw new HttpError(400, `Missing project name`);
            }
            const consultantName = req.body.consultantName?.toString() || (req.body.consultant.name?.toString()||"");
            if (!consultantName) {
              throw new HttpError(400, `Missing consultant name`);
            }
            const role = req.body.role;
            if (!role) {
              throw new HttpError(400, `Missing role`);
            }
            let forecast = req.body.forecast;
            if (!forecast) {
              forecast = 0;
              //throw new HttpError(400, `Missing forecast this month`);
            }
            console.log (`➡️ POST /api/projects: assignconsultant request, projectName=${projectName}, consultantName=${consultantName}, role=${role}, forecast=${forecast}`);
            const message = await ProjectApiService.addConsultantToProject(projectName, consultantName, role, forecast);
            res.body.results = {
              status: 200,
              message
            };
            console.log (`   ✅ POST /api/projects: response status ${res.status} - ${message}`);
            return res;
          }
          default: {
            throw new HttpError(400, `Invalid command: ${id}`);
          }
        }

      }
      default: {
        throw new Error(`Method not allowed: ${req.method}`);
      }
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
