import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load environment variables (.env.local.user takes precedence over .env.local)
const envLocalFile = path.join(__dirname, "../../../env/.env.local");
const envLocalUserFile = path.join(__dirname, "../../../env/.env.local.user");

// Load .env.local first, then .env.local.user (later values override earlier ones)
dotenv.config({ path: envLocalFile });
if (fs.existsSync(envLocalUserFile)) {
    dotenv.config({ path: envLocalUserFile, override: true });
}

interface ClaimAdjuster {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    area: string;
}

// Initialize Table Storage client
function getTableClient(): TableClient {
    const account = process.env.AZURE_STORAGE_ACCOUNT;
    const accountKey = process.env.SECRET_AZURE_STORAGE_KEY;
    const tableEndpoint = process.env.AZURE_TABLE_ENDPOINT;
    const tableName = process.env.TABLE_NAME;
    const allowInsecure = process.env.ALLOW_INSECURE_CONNECTION === "true";

    if (!account || !accountKey || !tableEndpoint || !tableName) {
        throw new Error("Missing required environment variables. Please check your env/.env file.");
    }

    const credential = new AzureNamedKeyCredential(account, accountKey);
    return new TableClient(tableEndpoint, tableName, credential, {
        allowInsecureConnection: allowInsecure
    });
}

// Load claims adjusters data from Table Storage
async function loadClaimsAdjusters(): Promise<ClaimAdjuster[]> {
    const tableClient = getTableClient();
    const adjusters: ClaimAdjuster[] = [];

    const entities = tableClient.listEntities({
        queryOptions: { filter: `PartitionKey eq 'ClaimsAdjusters'` }
    });

    for await (const entity of entities) {
        adjusters.push({
            id: entity.rowKey as string,
            firstName: entity.firstName as string,
            lastName: entity.lastName as string,
            email: entity.email as string,
            phone: entity.phone as string,
            country: entity.country as string,
            area: entity.area as string
        });
    }

    return adjusters;
}

// Internal implementation: List claims adjusters with optional filters
async function listClaimsAdjustersImpl(country?: string, area?: string): Promise<ClaimAdjuster[]> {
    let adjusters = await loadClaimsAdjusters();

    // Apply filters
    if (country) {
        adjusters = adjusters.filter(adj => adj.country.toLowerCase() === country.toLowerCase());
    }

    if (area) {
        adjusters = adjusters.filter(adj => adj.area.toLowerCase() === area.toLowerCase());
    }

    return adjusters;
}

// Internal implementation: Get claim adjuster by ID
async function getClaimAdjusterByIdImpl(id: string): Promise<ClaimAdjuster | null> {
    const tableClient = getTableClient();
    
    try {
        const entity = await tableClient.getEntity("ClaimsAdjusters", id);
        const adjuster: ClaimAdjuster = {
            id: entity.rowKey as string,
            firstName: entity.firstName as string,
            lastName: entity.lastName as string,
            email: entity.email as string,
            phone: entity.phone as string,
            country: entity.country as string,
            area: entity.area as string
        };
        return adjuster;
    } catch (entityError: any) {
        if (entityError.statusCode === 404) {
            return null;
        }
        throw entityError;
    }
}

// Internal implementation: Assign a claim adjuster to a claim
async function assignClaimAdjusterImpl(claimId: string, adjusterId: string): Promise<{
    success: boolean;
    assignmentId?: string;
    adjusterName?: string;
    error?: string;
}> {
    if (!claimId || !adjusterId) {
        return {
            success: false,
            error: "Both claimId and adjusterId are required"
        };
    }

    // Verify adjuster exists
    const adjuster = await getClaimAdjusterByIdImpl(adjusterId);
    
    if (!adjuster) {
        return {
            success: false,
            error: `Claim adjuster with ID ${adjusterId} not found`
        };
    }

    // Generate fake assignment ID
    const currentYear = new Date().getFullYear();
    const randomNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const assignmentId = `ASS-${currentYear}-${randomNumber}`;

    return {
        success: true,
        assignmentId: assignmentId,
        adjusterName: `${adjuster.firstName} ${adjuster.lastName}`
    };
}

// HTTP Handler: List claims adjusters with optional filters
export async function listClaimsAdjusters(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`HTTP: Listing claims adjusters with filters`);

    try {
        const country = request.query.get('country') || undefined;
        const area = request.query.get('area') || undefined;

        const adjusters = await listClaimsAdjustersImpl(country, area);

        return {
            status: 200,
            jsonBody: {
                count: adjusters.length,
                adjusters: adjusters
            }
        };
    } catch (error) {
        context.error(`Error listing claims adjusters: ${error}`);
        return {
            status: 500,
            jsonBody: { error: "Failed to retrieve claims adjusters" }
        };
    }
}

// HTTP Handler: Get claim adjuster by ID
export async function getClaimAdjusterById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const id = request.params.id;
    context.log(`HTTP: Getting claim adjuster with ID: ${id}`);

    if (!id) {
        return {
            status: 400,
            jsonBody: { error: "Claim adjuster ID is required" }
        };
    }

    try {
        const adjuster = await getClaimAdjusterByIdImpl(id);

        if (!adjuster) {
            return {
                status: 404,
                jsonBody: { error: `Claim adjuster with ID ${id} not found` }
            };
        }

        return {
            status: 200,
            jsonBody: adjuster
        };
    } catch (error) {
        context.error(`Error getting claim adjuster: ${error}`);
        return {
            status: 500,
            jsonBody: { error: "Failed to retrieve claim adjuster" }
        };
    }
}

// HTTP Handler: Assign a claim adjuster to a claim
export async function assignClaimAdjuster(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`HTTP: Assigning claim adjuster to claim`);

    try {
        const body = await request.json() as any;
        const { claimId, adjusterId } = body;

        const result = await assignClaimAdjusterImpl(claimId, adjusterId);

        if (!result.success) {
            const status = result.error?.includes("not found") ? 404 : 400;
            return {
                status: status,
                jsonBody: { error: result.error }
            };
        }

        return {
            status: 201,
            jsonBody: {
                success: true,
                assignmentId: result.assignmentId,
                claimId: claimId,
                adjusterId: adjusterId,
                adjusterName: result.adjusterName,
                message: "Claim adjuster successfully assigned to claim"
            }
        };
    } catch (error) {
        context.error(`Error assigning claim adjuster: ${error}`);
        return {
            status: 500,
            jsonBody: { error: "Failed to assign claim adjuster" }
        };
    }
}

// Register HTTP functions
app.http('listClaimsAdjusters', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'adjusters',
    handler: listClaimsAdjusters
});

app.http('getClaimAdjusterById', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'adjusters/{id}',
    handler: getClaimAdjusterById
});

app.http('assignClaimAdjuster', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'adjusters/assign',
    handler: assignClaimAdjuster
});

// MCP Tool Handler: List claims adjusters with optional filters
async function handleListClaimsAdjusters(input: any, context: InvocationContext): Promise<ClaimAdjuster[] | { error: string }> {
    context.log(`MCP: Listing claims adjusters with filters`);

    try {
        const country = input.arguments["country"] || undefined;
        const area = input.arguments["area"] || undefined;

        const adjusters = await listClaimsAdjustersImpl(country, area);
        return adjusters;
    } catch (error) {
        context.log('Error fetching claim adjusters:', error);
        return { error: (error as Error).message };
    }
}

// MCP Tool Handler: Get claim adjuster by ID
async function handleGetClaimsAdjusterById(input: any, context: InvocationContext): Promise<ClaimAdjuster | { error: string }> {
    context.log(`MCP: Getting claim adjuster by ID`);

    try {
        const id = input.arguments["id"];

        if (!id) {
            return { error: "Claim adjuster ID is required" };
        }

        const adjuster = await getClaimAdjusterByIdImpl(id);

        if (!adjuster) {
            return { error: `Claim adjuster with ID ${id} not found` };
        }

        return adjuster;
    } catch (error) {
        context.log('Error fetching claim adjuster:', error);
        return { error: (error as Error).message };
    }
}

// MCP Tool Handler: Assign a claim adjuster to a claim
async function handleAssignClaimAdjuster(input: any, context: InvocationContext): Promise<{ success: boolean; assignmentId?: string; adjusterName?: string; error?: string }> {
    context.log(`MCP: Assigning claim adjuster to claim`);

    try {
        const claimId = input.arguments["claimId"];
        const adjusterId = input.arguments["adjusterId"];

        const result = await assignClaimAdjusterImpl(claimId, adjusterId);
        return result;
    } catch (error) {
        context.log('Error assigning claim adjuster:', error);
        return { success: false, error: (error as Error).message };
    }
}

// Register MCP tools
app.mcpTool("get_claims_adjusters", {
    toolName: "get_claims_adjusters",
    description: "Retrieve a list of all insurance claims adjusters",
    toolProperties: [
        {
            "propertyName": "country",
            "propertyType": "string",
            "description": "The country of the claim adjuster",
            "isRequired": false
        },
        {
            "propertyName": "area",
            "propertyType": "string",
            "description": "The area of expertise of the claim adjuster",
            "isRequired": false
        }
    ],
    handler: handleListClaimsAdjusters
});

app.mcpTool("get_claims_adjuster", {
    toolName: "get_claims_adjuster",
    description: "Retrieve a specific insurance claims adjuster by ID",
    toolProperties: [
        {
            "propertyName": "id",
            "propertyType": "string",
            "description": "The unique identifier of the claim adjuster",
            "isRequired": true
        }
    ],
    handler: handleGetClaimsAdjusterById
});

app.mcpTool("assign_claim_adjuster", {
    toolName: "assign_claim_adjuster",
    description: "Assign a claim adjuster to an insurance claim",
    toolProperties: [
        {
            "propertyName": "claimId",
            "propertyType": "string",
            "description": "The unique identifier of the claim",
            "isRequired": true
        },
        {
            "propertyName": "adjusterId",
            "propertyType": "string",
            "description": "The unique identifier of the claim adjuster to assign",
            "isRequired": true
        }
    ],
    handler: handleAssignClaimAdjuster
});

