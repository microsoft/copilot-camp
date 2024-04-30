/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import ProjectApiService from "../../services/ProjectApiService";
import { ApiProject, ApiAddConsultantToProjectResponse, ErrorResult } from "../../model/apiModel";
import { HttpError, cleanUpParameter } from "../../services/Utilities";
import Identity from "../../services/IdentityService";

/**
 * This function handles the HTTP request and returns the repair information.
 *
 * @param {HttpRequest} req - The HTTP request.
 * @param {InvocationContext} context - The Azure Functions context object.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response containing the repair information.
 */

// Define a Response interface.
interface Response extends HttpResponseInit {
    status: number;
    jsonBody: {
        results: ApiProject[] | ApiAddConsultantToProjectResponse | ErrorResult;
    };
}
export async function projects(
    req: HttpRequest,
    context: InvocationContext
): Promise<Response> {
    context.log("HTTP trigger function projects processed a request.");
    // Initialize response.
    const res: Response = {
        status: 200,
        jsonBody: {
            results: [],
        },
    };

    try {

        const identity = new Identity(req);
        const id = req.params.id?.toLowerCase();
        let body = req.json ? await req.json() : null;
        switch (req.method) {
            case "GET": {

                let projectName = req.query.get("projectName")?.toString().toLowerCase() || "";
                let consultantName = req.query.get("consultantName")?.toString().toLowerCase() || "";

                console.log(`➡️ GET /api/projects: request for projectName=${projectName}, consultantName=${consultantName}, id=${id}`);

                projectName = cleanUpParameter("projectName", projectName);
                consultantName = cleanUpParameter("consultantName", consultantName);

                if (id) {
                    const result = await ProjectApiService.getApiProjectById(identity, id);
                    res.jsonBody.results = [result];
                    console.log(`   ✅ GET /api/projects: response status ${res.status}; 1 projects returned`);
                    return res;
                }

                const result = await ProjectApiService.getApiProjects(identity, projectName, consultantName);
                res.jsonBody.results = result;
                console.log(`   ✅ GET /api/projects: response status ${res.status}; ${result.length} projects returned`);
                return res;
            }
            case "POST": {
                switch (id.toLocaleLowerCase()) {
                    case "assignconsultant": {
                        if (body) {
                            const projectName = cleanUpParameter("projectName", body["projectName"]);
                            if (!projectName) {
                                throw new HttpError(400, `Missing project name`);
                            }
                            const consultantName = cleanUpParameter("consultantName", body["consultantName"]?.toString() || "");
                            if (!consultantName) {
                                throw new HttpError(400, `Missing consultant name`);
                            }
                            const role = cleanUpParameter("Role", body["role"]);
                            if (!role) {
                                throw new HttpError(400, `Missing role`);
                            }
                            let forecast = body["forecast"];
                            if (!forecast) {
                                forecast = 0;
                                //throw new HttpError(400, `Missing forecast this month`);
                            }
                            console.log(`➡️ POST /api/projects: assignconsultant request, projectName=${projectName}, consultantName=${consultantName}, role=${role}, forecast=${forecast}`);
                            const message = await ProjectApiService.addConsultantToProject
                                (identity, projectName, consultantName, role, forecast);

                            res.jsonBody.results = {
                                status: 200,
                                clientName: message.clientName,
                                projectName: message.projectName,
                                consultantName: message.consultantName,
                                remainingForecast: message.remainingForecast,
                                message: message.message
                            };
                        
                        console.log(`   ✅ POST /api/projects: response status ${res.status} - ${message}`);
                        } else {
                            throw new HttpError(400, `Missing request body`);
                          }
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
        res.jsonBody.results = {
            status: status,
            message: error.message
        };
        return res;
    }
}

app.http("projects", {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    route: "projects/{*id}",
    handler: projects,
});
