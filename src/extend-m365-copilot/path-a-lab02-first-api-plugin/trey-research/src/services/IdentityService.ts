import { HttpRequest } from "@azure/functions";
import { HttpError } from './Utilities';
import { Consultant } from '../model/baseModel';
import { ApiConsultant } from '../model/apiModel';

// This is a DEMO ONLY identity solution.
import ConsultantApiService from "./ConsultantApiService";

class Identity {
    private requestNumber = 1;  // Number the requests for logging purposes


    public async validateRequest(req: HttpRequest): Promise<ApiConsultant> {

        // Default user used for unauthenticated testing
        let userId = "1";
        let userName = "Avery Howard";
        let userEmail = "avery@treyresearch.com";

        // ** INSERT REQUEST VALIDATION HERE (see Lab E6) **

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






