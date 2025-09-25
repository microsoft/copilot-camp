import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as data from '../data/candidates.json';

import * as openapiSpec from "../openapi.json";
import { promises as fs } from 'fs';
import * as path from 'path';

// ADDED FOR TOKEN VALIDATION
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
let validator: TokenValidator;

async function validateToken(req: HttpRequest, scope: string): Promise<void> {

    // Try to validate the token and get user's basic information
    const { AAD_APP_CLIENT_ID, AAD_APP_TENANT_ID, AAD_APP_OAUTH_AUTHORITY, UseOAuth } = process.env;
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (token && UseOAuth.toLowerCase() === "true") {

        if (!validator) {
        const entraJwksUri = await getEntraJwksUri(AAD_APP_TENANT_ID);
        validator = new TokenValidator({
            jwksUri: entraJwksUri
        });
        console.log("Token validator created");
        }

        const options: ValidateTokenOptions = {
            audience: `${AAD_APP_CLIENT_ID}`,
            // NOTE: Issuer will be different for non-public clouds
            issuer: `${AAD_APP_OAUTH_AUTHORITY}/v2.0`,
            scp: [scope]
        };

        const validToken = await validator.validateToken(token, options);

        const userId = validToken.oid;
        const userName = validToken.name;
        console.log(`Token is valid for user ${userName} (${userId})`);
    } else if (UseOAuth !== "true") {
        console.log("OAuth is disabled. Skipping token validation");
    } else {
        console.error("No token found in request");
        throw (new Error("No token found in request"));
    }
}

// END ADDED FOR TOKEN VALIDATION

interface Candidate {
    firstname: string;
    lastname: string;
    email: string;
    spoken_languages: string[];
    skills: string[];
    current_role: string;
}

// Preload the list of candidates
let candidates: Candidate[] = data;

export async function getCandidates(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function getCandidates processed request for url "${request.url}"`);

    // ADDED FOR TOKEN VALIDATION
    try {
        await validateToken(request, 'HR.Consume');
    }
    catch (ex) {
        // Token is missing or invalid - return a 401 error
        console.error(ex);
        return  {
          status: 401
        };
    }
    // END ADDED FOR TOKEN VALIDATION

    try {        
        // Return the in-memory list of candidates
        return { body: JSON.stringify(candidates) };
    } catch (error) {
        context.log(`Error while reading candidates data: ${error}`);
        return { body: JSON.stringify(error) };
    }
};

export async function getCandidate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function getCandidate processed request for url "${request.url}"`);

    // ADDED FOR TOKEN VALIDATION
    try {
        await validateToken(request, 'HR.Consume');
    }
    catch (ex) {
        // Token is missing or invalid - return a 401 error
        console.error(ex);
        return  {
          status: 401
        };
    }
    // END ADDED FOR TOKEN VALIDATION

    try {
        // Read the email from the URL path
        const email: string = request.params['email'];

        // Find the candidate with the given email
        const candidate = candidates.find(c => c.email === email);

        if (candidate) {
            // Return the candidate details
            return { body: JSON.stringify(candidate) };
        } else {
            // Return a not found response
            return { status: 404, body: `Candidate with email ${email} not found` };
        }
    } catch (error) {
        context.log(`Error while retrieving candidate: ${error}`);
        return { body: JSON.stringify(error) };
    }
}

export async function addCandidate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function addCandidate processed request for url "${request.url}"`);

    // ADDED FOR TOKEN VALIDATION
    try {
        await validateToken(request, 'HR.Consume');
    }
    catch (ex) {
        // Token is missing or invalid - return a 401 error
        console.error(ex);
        return  {
          status: 401
        };
    }
    // END ADDED FOR TOKEN VALIDATION

    try {
        // Parse the request body
        const candidate: Candidate = await request.json() as Candidate;

        // Add the candidate to the in-memory list
        candidates.push(candidate);

        // Return the updated list of candidates
        return { body: JSON.stringify(candidates) };
    } catch (error) {
        context.log(`Error while adding a candidate: ${error}`);
        return { body: JSON.stringify(error) };
    }
}

export async function removeCandidate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function removeCandidate processed request for url "${request.url}"`);

    // ADDED FOR TOKEN VALIDATION
    try {
        await validateToken(request, 'HR.Consume');
    }
    catch (ex) {
        // Token is missing or invalid - return a 401 error
        console.error(ex);
        return  {
          status: 401
        };
    }
    // END ADDED FOR TOKEN VALIDATION

    try {
        // Read the email from the URL path
        const email: string = request.params['email'];

        // Find the index of the candidate with the given email
        const index = candidates.findIndex(c => c.email === email);

        if (index !== -1) {
            // Remove the candidate from the list
            const removedCandidate = candidates.splice(index, 1)[0];

            // Return the updated list of candidates
            return { body: JSON.stringify(candidates) };
        } else {
            // Return a not found response
            return { status: 404, body: `Candidate with email ${email} not found` };
        }
    } catch (error) {
        context.log(`Error while removing candidate: ${error}`);
        return { body: JSON.stringify(error) };
    }
}

app.http('getCandidates', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'candidates',
    handler: getCandidates
});

app.http('getCandidate', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'candidates/{email}',
    handler: getCandidate
});

app.http('addCandidate', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'candidates',
    handler: addCandidate
});

app.http('removeCandidate', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'candidates/{email}',
    handler: removeCandidate
});

app.http('openapi', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        return {
            status: 200,
            jsonBody: openapiSpec
        };
    }
});

app.http('openapi-yaml', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        try {
            const filePath = path.join(__dirname, '../openapi.yaml');
            const fileContent = await fs.readFile(filePath, 'utf8');
    
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/x-yaml'
                },
                body: fileContent
            };
    
        } catch (error) {

            // Initialize failure response
            const failureResponse: HttpResponseInit = {
                status: 500,
                jsonBody: error
            };

            return failureResponse;

        }
    }
});