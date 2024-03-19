/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

import { Context, HttpRequest } from "@azure/functions";
// import repairRecords from "../repairsData.json";

import ConsultantService from "../services/ConsultantService";
import ProjectService from "../services/ProjectService";
import AssignmentService from "../services/AssignmentService";

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

  try {

    let consultantId = "1";
    const consultantNameOrId = req.query.consultantNameOrId?.toString().toLowerCase() || "";

    const command = req.params.command.toLowerCase();

    // Refactor these to remove duplicated code and make things more compact
    switch (command) {
      case "getmyprojects": {
        const results = [];
        const a = await AssignmentService.getAssignments((a) => a.consultantId === consultantId);
        for (const assignment of a) {
          const p = await ProjectService.getProjectById(assignment.projectId);
          results.push(p);
        }
        res.body.results = results;
        break;
      }
      case "getmybilledhours": {
        const results = [];
        const a = await AssignmentService.getAssignments((a) => a.consultantId === consultantId);
        for (const assignment of a) {
          const p: any = await ProjectService.getProjectById(assignment.projectId);
          const thisMonth = new Date().getMonth() + 1;
          const thisYear = new Date().getFullYear();
          const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
          const lastYear = thisMonth === 1 ? thisYear - 1 : thisYear;
          const deliveredThisMonth = assignment.delivered.find(d => d.month === thisMonth && d.year === thisYear);
          const deliveredLastMonth = assignment.delivered.find(d => d.month === lastMonth && d.year === lastYear);
          p.deliveredThisMonth = deliveredThisMonth ? deliveredThisMonth.hours : 0;
          p.deliveredLastMonth = deliveredLastMonth ? deliveredLastMonth.hours : 0;
          results.push(p);
        }
        res.body.results = results;
        break;
      }
      case "getprojectsforconsultant": {
        const results = [];
        const consultants = await ConsultantService.getConsultants((c) => c.name.toLowerCase().indexOf(consultantNameOrId) >= 0 || c.id === consultantNameOrId);
        if (consultants.length > 0) {
          const a = await AssignmentService.getAssignments((a) => a.consultantId === consultants[0].id);
          for (const assignment of a) {
            const p = await ProjectService.getProjectById(assignment.projectId);
            results.push(p);
          }
          res.body.results = results;
        }
        break;
      }
      case "getbilledhoursforconsultant": {
        const results = [];
        const consultants = await ConsultantService.getConsultants((c) => c.name.toLowerCase().indexOf(consultantNameOrId) >= 0 || c.id === consultantNameOrId);
        if (consultants.length > 0) {
          const a = await AssignmentService.getAssignments((a) => a.consultantId === consultants[0].id);
          for (const assignment of a) {
            const p: any = await ProjectService.getProjectById(assignment.projectId);
            const thisMonth = new Date().getMonth() + 1;
            const thisYear = new Date().getFullYear();
            const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
            const lastYear = thisMonth === 1 ? thisYear - 1 : thisYear;
            const deliveredThisMonth = assignment.delivered.find(d => d.month === thisMonth && d.year === thisYear);
            const deliveredLastMonth = assignment.delivered.find(d => d.month === lastMonth && d.year === lastYear);
            p.deliveredThisMonth = deliveredThisMonth ? deliveredThisMonth.hours : 0;
            p.deliveredLastMonth = deliveredLastMonth ? deliveredLastMonth.hours : 0;
            results.push(p);
          }
          res.body.results = results;
        }
        break;
      }
    }
    return res;

  } catch (error) {
    const status = error.status || error.response?.status || 500;
    console.log(`Returning error status code ${status.status}: ${error.message}`);

    res.status = status;
    res.body.results = [{
      status: status,
      error: error.message
    }];
    return res;
  }
}
