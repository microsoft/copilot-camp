import { HttpRequest } from "@azure/functions";
import { HttpError } from './Utilities';
import { Consultant } from '../model/baseModel';
import { ApiConsultant } from '../model/apiModel';

// This is a DEMO ONLY identity solution.
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
import ConsultantApiService from "./ConsultantApiService";

class Identity {
    private validator: TokenValidator;

    private requestNumber = 1;  // Number the requests for logging purposes

    public async validateRequest(req: HttpRequest): Promise<ApiConsultant> {

        // Default user used for unauthenticated testing
        let userId = "1";
        let userName = "Avery Howard";
        let userEmail = "avery@treyresearch.com";

        // Try to validate the token and get user's basic information
        try {
            const { API_APPLICATION_ID, API_TENANT_ID } = process.env;
            const token = req.headers.get("Authorization")?.split(" ")[1];
            if (!token) {
                throw new HttpError(401, "Authorization token not found");
            }

            // create a new token validator for the Microsoft Entra common tenant
            if (!this.validator) {
                // We need a new validator object which we will continue to use on subsequent
                // requests so it can cache the Entra ID signing keys
                // For multitenant, use:
                // const entraJwksUri = await getEntraJwksUri();
                const entraJwksUri = await getEntraJwksUri(API_TENANT_ID);
                this.validator = new TokenValidator({
                    jwksUri: entraJwksUri
                });
                console.log ("Token validator created");
            }

            // Use these options for single-tenant applications
            const options: ValidateTokenOptions = {
                audience: `api://${API_APPLICATION_ID}`,
                issuer: `https://sts.windows.net/${API_TENANT_ID}/`,
                // NOTE: If this is a multi-tenant app, look for 
                // issuer: "https://sts.windows.net/common/",
                // Also you may wish to manage a list of allowed tenants
                // and test them as well
                //   allowedTenants: [process.env["AAD_APP_TENANT_ID"]],
                scp: ["access_as_user"]
            };

            // validate the token
            const validToken = await this.validator.validateToken(token, options);

            userId = validToken.oid;
            userName = validToken.name;
            userEmail = validToken.upn;
            console.log(`Request ${this.requestNumber++}: Token is valid for user ${userName} (${userId})`);
        }
        catch (ex) {
            // Token is missing or invalid - return a 401 error
            console.error(ex);
            throw new HttpError(401, "Unauthorized");
        }
        
        // Get the consultant record for this user; create one if necessary
        let consultant: ApiConsultant = null;
        try {
            consultant = await ConsultantApiService.getApiConsultantById(userId);
        }
        catch (ex) {
            if (ex.status !== 404) {
                throw ex;
            }
            // Consultant was not found, so we'll create one below
            consultant = null;
        }
        if (!consultant) consultant = await this.createConsultantForUser(userId, userName, userEmail);

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
            consultantPhotoUrl: "https://microsoft.github.io/copilot-camp/demo-assets/images/consultants/Unknown.jpg",
            location: {
                street: "One Memorial Drive",
                city: "Cambridge",
                state: "MA",
                country: "USA",
                postalCode: "02142",
                latitude: 42.361366,
                longitude: -71.081257
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






