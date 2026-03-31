/**
 * Data access layer backed by Azurite (Azure Table Storage emulator).
 * All functions are async and talk to the AccessRequests / Counters tables.
 */
import { TableClient, TableServiceClient } from "@azure/data-tables";

const CONN =
  process.env.AZURE_STORAGE_CONNECTION_STRING ??
  "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;" +
  "AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;" +
  "TableEndpoint=http://127.0.0.1:10002/devstoreaccount1";

const requestsTable = TableClient.fromConnectionString(CONN, "AccessRequests", { allowInsecureConnection: true });
const countersTable = TableClient.fromConnectionString(CONN, "Counters", { allowInsecureConnection: true });

// Ensure tables exist (runs once)
const tablesReady = (async () => {
  const svc = TableServiceClient.fromConnectionString(CONN, { allowInsecureConnection: true });
  await svc.createTable("AccessRequests").catch(() => {});
  await svc.createTable("Counters").catch(() => {});
})();

// ── Types ───────────────────────────────────────────────────────────

export interface AccessRequest {
  id: string;
  employeeName: string;
  employeeEmail: string;
  system: string;
  role: string;
  justification: string;
  status: "Requested" | "Manager Review" | "IT Review" | "Granted" | "Rejected";
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
}

export interface TimelineEntry {
  stage: string;
  status: "completed" | "current" | "pending" | "rejected";
  actor?: string;
  comment?: string;
  timestamp: string;
}

// ── Helpers ─────────────────────────────────────────────────────────

function entityToRequest(e: Record<string, unknown>): AccessRequest {
  return {
    id: e.rowKey as string,
    employeeName: e.employeeName as string,
    employeeEmail: e.employeeEmail as string,
    system: e.system as string,
    role: e.role as string,
    justification: e.justification as string,
    status: e.status as AccessRequest["status"],
    createdAt: e.createdAt as string,
    updatedAt: e.updatedAt as string,
    timeline: JSON.parse(e.timeline as string),
  };
}

// ── Helpers — ID normalisation ───────────────────────────────────────

/**
 * Accepts flexible request-ID formats and normalises to "REQ-NNN".
 * Examples: "4" | "04" | "004" | "REQ-4" | "req-004" → "REQ-004"
 */
export function normalizeRequestId(raw: string): string {
  const stripped = raw.trim().replace(/^req-?/i, "");
  const num = parseInt(stripped, 10);
  if (Number.isNaN(num) || num <= 0) return raw.toUpperCase();
  return `REQ-${String(num).padStart(3, "0")}`;
}

// ── Public API ──────────────────────────────────────────────────────

export async function getAllRequests(): Promise<AccessRequest[]> {
  await tablesReady;
  const results: AccessRequest[] = [];
  for await (const entity of requestsTable.listEntities({
    queryOptions: { filter: "PartitionKey eq 'requests'" },
  })) {
    results.push(entityToRequest(entity as unknown as Record<string, unknown>));
  }
  return results;
}

export async function getRequest(id: string): Promise<AccessRequest | undefined> {
  await tablesReady;
  const normalised = normalizeRequestId(id);
  try {
    const entity = await requestsTable.getEntity("requests", normalised);
    return entityToRequest(entity as unknown as Record<string, unknown>);
  } catch {
    return undefined;
  }
}

export async function getPendingApprovals(): Promise<AccessRequest[]> {
  await tablesReady;
  const all = await getAllRequests();
  return all.filter(
    (r) => r.status === "Manager Review" || r.status === "IT Review",
  );
}

export async function createRequest(
  employeeName: string,
  employeeEmail: string,
  system: string,
  role: string,
  justification: string,
): Promise<AccessRequest> {
  await tablesReady;
  // Auto-increment ID via Counters table
  let nextId = 4;
  try {
    const counter = await countersTable.getEntity("counters", "requestId");
    nextId = (counter as unknown as Record<string, unknown>).value as number;
  } catch {
    // counter missing — use default
  }
  const id = `REQ-${String(nextId).padStart(3, "0")}`;
  await countersTable.upsertEntity({
    partitionKey: "counters",
    rowKey: "requestId",
    value: nextId + 1,
  });

  const now = new Date().toISOString();
  const timeline: TimelineEntry[] = [
    { stage: "Requested", status: "completed", actor: employeeName, comment: "Submitted access request", timestamp: now },
    { stage: "Manager Review", status: "current", timestamp: now },
    { stage: "IT Review", status: "pending", timestamp: "" },
    { stage: "Granted", status: "pending", timestamp: "" },
  ];

  await requestsTable.upsertEntity({
    partitionKey: "requests",
    rowKey: id,
    employeeName,
    employeeEmail,
    system,
    role,
    justification,
    status: "Manager Review",
    createdAt: now,
    updatedAt: now,
    timeline: JSON.stringify(timeline),
  });

  return {
    id,
    employeeName,
    employeeEmail,
    system,
    role,
    justification,
    status: "Manager Review",
    createdAt: now,
    updatedAt: now,
    timeline,
  };
}

export async function recordDecision(
  id: string,
  decision: "approve" | "reject",
  reviewer: string,
  comment: string,
): Promise<AccessRequest | undefined> {
  await tablesReady;
  const request = await getRequest(normalizeRequestId(id));
  if (!request) return undefined;

  const now = new Date().toISOString();
  request.updatedAt = now;

  if (decision === "reject") {
    for (const entry of request.timeline) {
      if (entry.status === "current") {
        entry.status = "rejected";
        entry.actor = reviewer;
        entry.comment = comment;
        entry.timestamp = now;
        break;
      }
    }
    request.status = "Rejected";
  } else {
    // Approve: advance to next stage
    let foundCurrent = false;
    for (let i = 0; i < request.timeline.length; i++) {
      const entry = request.timeline[i];
      if (entry.status === "current") {
        entry.status = "completed";
        entry.actor = reviewer;
        entry.comment = comment;
        entry.timestamp = now;
        foundCurrent = true;

        if (i + 1 < request.timeline.length) {
          const next = request.timeline[i + 1];
          if (next.stage === "Granted") {
            next.status = "completed";
            next.actor = "System";
            next.comment = "Access granted automatically after all approvals.";
            next.timestamp = now;
            request.status = "Granted";
          } else {
            next.status = "current";
            next.timestamp = now;
            request.status = next.stage as AccessRequest["status"];
          }
        }
        break;
      }
    }
    if (!foundCurrent) return request;
  }

  // Persist updated entity
  await requestsTable.upsertEntity({
    partitionKey: "requests",
    rowKey: request.id,
    employeeName: request.employeeName,
    employeeEmail: request.employeeEmail,
    system: request.system,
    role: request.role,
    justification: request.justification,
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    timeline: JSON.stringify(request.timeline),
  });

  return request;
}
