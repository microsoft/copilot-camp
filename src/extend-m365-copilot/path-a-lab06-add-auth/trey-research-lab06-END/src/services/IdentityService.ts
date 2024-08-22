import { HttpRequest } from "@azure/functions";
import { HttpError } from './Utilities';
import { Consultant } from '../model/baseModel';
import { ApiConsultant } from '../model/apiModel';

// This is a DEMO ONLY identity solution.
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
import ConsultantApiService from "./ConsultantApiService";

class Identity {
    private requestNumber = 1;  // Number the requests for logging purposes


    public async validateRequest(req: HttpRequest): Promise<ApiConsultant> {

        // Default user used for unauthenticated testing
        let userId = "1";
        let userName = "Avery Howard";
        let userEmail = "avery@treyresearch.com";

        // Try to validate the token and get user's basic information
        try {
            const token = req.headers.get("Authorization")?.split(" ")[1];
            if (!token) {
                throw new HttpError(404, "Assignment not found");
            }

            // create a new token validator for the Microsoft Entra common tenant
            const entraJwksUri = await getEntraJwksUri();
            const validator = new TokenValidator({
                jwksUri: entraJwksUri
            });

            // Use these options for single-tenant applications
            const API_CLIENT_ID = '2f7a0770-4301-4dc3-b812-6315b8d51379';
            const API_TENANT_ID = '883a30d4-ca91-4cbb-b025-9c0f6d7820a0';
            const options: ValidateTokenOptions = {
                audience: `api://${API_CLIENT_ID}`,
                issuer: `https://sts.windows.net/${API_TENANT_ID}/`,
                scp: ["access_as_user"]
            };

            // Use these options for multi-tenant applications
            // const options: ValidateTokenOptions = {
            //   audience: process.env["AAD_APP_CLIENT_ID"],
            //   issuer: `https://login.microsoftonline.com/${process.env["AAD_APP_TENANT_ID"]}/v2.0`,
            //   // You need to manage the list of allowed tenants on your own!
            //   // For this sample, we only allow the tenant that the app is registered in
            //   allowedTenants: [process.env["AAD_APP_TENANT_ID"]],
            //   scp: ["access_as_user"]
            // };


            // validate the token
            const validToken = await validator.validateToken(token, options);

            userId = validToken.oid;
            userName = validToken.name;
            userEmail = validToken.upn;
            console.log(`Request ${this.requestNumber++}: Token is valid for user ${userName} (${userId})`);
        }
        catch (ex) {
            // Token is missing or invalid - return a 401 error
            console.error(ex);
            throw new HttpError(404, "Unauthorized");
        }

        // Get the consultant record for this user; create one if necessary
        let consultant: ApiConsultant = null;
        try {
            consultant = await ConsultantApiService.getApiConsultantById(userId);
        }
        catch (ex) {
            consultant = await this.createConsultantForUser(userId, userName, userEmail);
        }

        return consultant;
    }

    private async createConsultantForUser(userId: string, userName: string,
        userEmail: string): Promise<ApiConsultant> {

        // Create a new consultant record for this user with default values
        const consultant: Consultant = {
            id: userId,
            name: userName,
            email: userEmail,
            phone: "1-555-123-4567",
            consultantPhotoUrl: "https://bobgerman.github.io/fictitiousAiGenerated/Avery.jpg",
            location: {
                street: "One Memorial Drive",
                city: "Cambridge",
                state: "MA",
                country: "USA",
                postalCode: "02142",
                latitude: 42.361366,
                longitude: -71.081257,
                mapUrl: ""
            },
            skills: ["JavaScript", "TypeScript"],
            certifications: ["Azure Development"],
            roles: ["Architect", "Project Lead"]
        };
        const result = await ConsultantApiService.createApiConsultant(consultant);
        return result;
    }
}

export default new Identity();






