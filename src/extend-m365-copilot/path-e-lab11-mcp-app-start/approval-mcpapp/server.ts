/**
 * MCP Server — Access Request & Approval Workflow
 *
 * Tools:
 *   - request-access:   Shows the access request form
 *   - approve-access:   Shows the approval panel to a manager
 *   - access-status:    Shows the status timeline for a request
 *   - submit-request:   Backend tool — creates a new request (called from form widget)
 *   - submit-decision:  Backend tool — records approve/reject (called from approval widget)
 *   - get-request:      Backend tool — fetches a single request (called from widgets)
 */
import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import {

  getRequest,
  getPendingApprovals,
  createRequest,
  recordDecision,
} from "./mock-data/requests.js";

// Resolve dist directory — works from both source (.ts) and compiled (.js)
const DIST_DIR = import.meta.filename.endsWith(".ts")
  ? path.join(import.meta.dirname, "dist", "ui")
  : path.join(import.meta.dirname, "ui");

/**
 * Helper to register a tool + its corresponding UI resource.
 */
function registerToolWithUI(
  server: McpServer,
  name: string,
  title: string,
  description: string,
  resourceFileName: string,
  inputSchema: Record<string, z.ZodTypeAny>,
  handler: (args: Record<string, any>) => Promise<CallToolResult> | CallToolResult,
) {
  const resourceUri = `ui://${name}/${resourceFileName}`;

  registerAppTool(
    server,
    name,
    {
      title,
      description,
      inputSchema,
      annotations: { readOnlyHint: true },
      _meta: { ui: { resourceUri } },
    },
    handler,
  );

  registerAppResource(
    server,
    resourceUri,
    resourceUri,
    { mimeType: RESOURCE_MIME_TYPE, description: title },
    async (): Promise<ReadResourceResult> => {
      const html = await fs.readFile(
        path.join(DIST_DIR, resourceFileName),
        "utf-8",
      );
      return {
        contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
      };
    },
  );
}

/**
 * Creates a new MCP server instance with all tools and resources registered.
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: "Access Request & Approval Workflow",
    version: "1.0.0",
  });

  // ─── Tool 1: Request Access Form ─────────────────────────────────
  registerToolWithUI(
    server,
    "request-access",
    "Request Access",
    "Shows an access request form where an employee can request access to a system (GitHub, SAP, Production Database) with a specific role and justification.",
    "request-form.html",
    {
      employeeName: z.string().optional().describe("Pre-fill employee name"),
      employeeEmail: z.string().optional().describe("Pre-fill employee email"),
    },
    (args): CallToolResult => {
      const systems = ["GitHub", "SAP", "Production Database", "Azure DevOps", "Salesforce", "Jira"];
      const roles: Record<string, string[]> = {
        "GitHub": ["Read", "Write", "Admin"],
        "SAP": ["Finance Viewer", "Finance Editor", "Admin"],
        "Production Database": ["Read-Only", "Read-Write", "DBA"],
        "Azure DevOps": ["Reader", "Contributor", "Project Admin"],
        "Salesforce": ["Viewer", "Editor", "Admin"],
        "Jira": ["Viewer", "Developer", "Project Lead"],
      };
      return {
        content: [{ type: "text", text: "Access request form is ready. Fill in the details and submit." }],
        structuredContent: {
          employeeName: args.employeeName ?? "",
          employeeEmail: args.employeeEmail ?? "",
          systems,
          roles,
        } as unknown as Record<string, unknown>,
      };
    },
  );

  // ─── Tool 2: Approval Panel ──────────────────────────────────────
  registerToolWithUI(
    server,
    "approve-access",
    "Approve Access Request",
    "Shows the approval panel for a manager or IT admin to review, approve, or reject an access request. Pass a request ID to review a specific request, or leave blank to see all pending requests.",
    "approval-panel.html",
    {
      requestId: z.string().optional().describe("Request ID to review — accepts any format: REQ-001, 001, or 1"),
    },
    async (args): Promise<CallToolResult> => {
      if (args.requestId) {
        const request = await getRequest(args.requestId);
        if (!request) {
          return {
            content: [{ type: "text", text: `Request ${args.requestId} not found.` }],
            structuredContent: { error: "not_found", requestId: args.requestId } as unknown as Record<string, unknown>,
          };
        }
        return {
          content: [{ type: "text", text: `Showing approval panel for ${request.id} — ${request.employeeName} requesting ${request.role} access to ${request.system}.` }],
          structuredContent: { requests: [request] } as unknown as Record<string, unknown>,
        };
      }

      const pending = await getPendingApprovals();
      return {
        content: [{ type: "text", text: `${pending.length} pending approval request(s).` }],
        structuredContent: { requests: pending } as unknown as Record<string, unknown>,
      };
    },
  );



  // ─── Backend Tool: Submit Request (called from form widget) ──────
  server.registerTool(
    "submit-request",
    {
      title: "Submit Access Request",
      description: "Creates a new access request. Called from the request form widget via app.callServerTool().",
      inputSchema: {
        employeeName: z.string().describe("Employee full name"),
        employeeEmail: z.string().describe("Employee email"),
        system: z.string().describe("Target system"),
        role: z.string().describe("Requested role"),
        justification: z.string().describe("Business justification"),
      },
    },
    async (args): Promise<CallToolResult> => {
      const request = await createRequest(
        args.employeeName,
        args.employeeEmail,
        args.system,
        args.role,
        args.justification,
      );
      return {
        content: [{ type: "text", text: `Request ${request.id} created successfully.` }],
        structuredContent: { success: true, request } as unknown as Record<string, unknown>,
      };
    },
  );

  // ─── Backend Tool: Submit Decision (called from approval widget) ─
  server.registerTool(
    "submit-decision",
    {
      title: "Submit Approval Decision",
      description: "Records an approve or reject decision for an access request. Called from the approval panel widget.",
      inputSchema: {
        requestId: z.string().describe("Request ID — accepts any format: REQ-001, 001, or 1"),
        decision: z.enum(["approve", "reject"]).describe("Approval decision"),
        reviewer: z.string().describe("Reviewer name"),
        comment: z.string().describe("Review comment"),
      },
    },
    async (args): Promise<CallToolResult> => {
      const updated = await recordDecision(args.requestId, args.decision, args.reviewer, args.comment);
      if (!updated) {
        return {
          content: [{ type: "text", text: `Request ${args.requestId} not found.` }],
          structuredContent: { success: false, error: "not_found" } as unknown as Record<string, unknown>,
        };
      }
      return {
        content: [{ type: "text", text: `Decision recorded: ${args.decision} for ${args.requestId}. New status: ${updated.status}` }],
        structuredContent: { success: true, request: updated } as unknown as Record<string, unknown>,
      };
    },
  );

  // ─── Backend Tool: Get Request (called from any widget) ──────────
  server.registerTool(
    "get-request",
    {
      title: "Get Access Request",
      description: "Fetches a single access request by ID. Used by widgets to refresh data.",
      inputSchema: {
        requestId: z.string().describe("Request ID — accepts any format: REQ-001, 001, or 1"),
      },
    },
    async (args): Promise<CallToolResult> => {
      const request = await getRequest(args.requestId);
      if (!request) {
        return {
          content: [{ type: "text", text: `Request ${args.requestId} not found.` }],
          structuredContent: { error: "not_found" } as unknown as Record<string, unknown>,
        };
      }
      return {
        content: [{ type: "text", text: `Request ${request.id}: ${request.status}` }],
        structuredContent: { request } as unknown as Record<string, unknown>,
      };
    },
  );

  return server;
}
