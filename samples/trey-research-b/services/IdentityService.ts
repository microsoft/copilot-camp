import { HttpRequest } from "@azure/functions";

let requestCounter = 0;
export default class Identity {

    public requestNumber: number;
    public id: string;
    public name: string;
    public email: string;

    constructor(req: HttpRequest) {
        this.requestNumber = ++requestCounter;

        // This is a DEMO ONLY identity solution. All users will be identified as User ID 1 so 
        // everyone who runs the demo will share the same projects and other data.
        this.id = '1';

        // If the request has a valid client principal, the user's actual name and email will be used.
        // Otherwise the default username ("Avery Howard") and email ("avery@treyresearch.com") will be used.
        let clientPrincipal = req.headers['x-ms-client-principal'];
        // TEST TOKEN:
        // clientPrincipal = 'eyJhdXRoX3R5cCI6ImFhZCIsImNsYWltcyI6W3sidHlwIjoiYXVkIiwidmFsIjoiYXBpOlwvXC81MzA1Zjc0Ni05MDI0LTQ5YmMtODc4My1hMTY5MGM1OTE1NzgifSx7InR5cCI6ImlzcyIsInZhbCI6Imh0dHBzOlwvXC9zdHMud2luZG93cy5uZXRcLzU3ODcyNTQ4LTQ2YmQtNDU4ZS04YWU0LWMyYTU0MWVhNmQxYlwvIn0seyJ0eXAiOiJpYXQiLCJ2YWwiOiIxNzEyOTUzMDA1In0seyJ0eXAiOiJuYmYiLCJ2YWwiOiIxNzEyOTUzMDA1In0seyJ0eXAiOiJleHAiLCJ2YWwiOiIxNzEyOTU4MDY5In0seyJ0eXAiOiJodHRwOlwvXC9zY2hlbWFzLm1pY3Jvc29mdC5jb21cL2NsYWltc1wvYXV0aG5jbGFzc3JlZmVyZW5jZSIsInZhbCI6IjEifSx7InR5cCI6ImFpbyIsInZhbCI6IkFWUUFxXC84V0FBQUF0VWRZUmkyUWRVQW1MYklBbmFUQUpEXC9xTGhQZFYyUUlZVXgxY3l6RERZYXUzMklRT2czRmtHVmRpS05Mclg5MGRTenhNRytRdmRGOElLeTN1YnJPU2tTdmYyRVpibW90NUlFQ3dqWjF1V3M9In0seyJ0eXAiOiJodHRwOlwvXC9zY2hlbWFzLm1pY3Jvc29mdC5jb21cL2NsYWltc1wvYXV0aG5tZXRob2RzcmVmZXJlbmNlcyIsInZhbCI6InB3ZCJ9LHsidHlwIjoiaHR0cDpcL1wvc2NoZW1hcy5taWNyb3NvZnQuY29tXC9jbGFpbXNcL2F1dGhubWV0aG9kc3JlZmVyZW5jZXMiLCJ2YWwiOiJtZmEifSx7InR5cCI6ImFwcGlkIiwidmFsIjoiNTMwNWY3NDYtOTAyNC00OWJjLTg3ODMtYTE2OTBjNTkxNTc4In0seyJ0eXAiOiJhcHBpZGFjciIsInZhbCI6IjEifSx7InR5cCI6Imh0dHA6XC9cL3NjaGVtYXMueG1sc29hcC5vcmdcL3dzXC8yMDA1XC8wNVwvaWRlbnRpdHlcL2NsYWltc1wvc3VybmFtZSIsInZhbCI6Ikdlcm1hbiJ9LHsidHlwIjoiaHR0cDpcL1wvc2NoZW1hcy54bWxzb2FwLm9yZ1wvd3NcLzIwMDVcLzA1XC9pZGVudGl0eVwvY2xhaW1zXC9naXZlbm5hbWUiLCJ2YWwiOiJCb2IifSx7InR5cCI6ImlwYWRkciIsInZhbCI6IjIxNi4yMTIuMzIuMTI4In0seyJ0eXAiOiJuYW1lIiwidmFsIjoiQm9iIEdlcm1hbiJ9LHsidHlwIjoiaHR0cDpcL1wvc2NoZW1hcy5taWNyb3NvZnQuY29tXC9pZGVudGl0eVwvY2xhaW1zXC9vYmplY3RpZGVudGlmaWVyIiwidmFsIjoiODZhMWZjMjktODhlYi00MGU4LWFhZjYtYzgwNGNiODhmMDVjIn0seyJ0eXAiOiJyaCIsInZhbCI6IjAuQVZrQVNDV0hWNzFHamtXSzVNS2xRZXB0RzBiM0JWTWtrTHhKaDRPaGFReFpGWGlkQUljLiJ9LHsidHlwIjoiaHR0cDpcL1wvc2NoZW1hcy5taWNyb3NvZnQuY29tXC9pZGVudGl0eVwvY2xhaW1zXC9zY29wZSIsInZhbCI6InVzZXJfaW1wZXJzb25hdGlvbiJ9LHsidHlwIjoiaHR0cDpcL1wvc2NoZW1hcy54bWxzb2FwLm9yZ1wvd3NcLzIwMDVcLzA1XC9pZGVudGl0eVwvY2xhaW1zXC9uYW1laWRlbnRpZmllciIsInZhbCI6ImxSd2NTN2hxTDJrV0l5WlMtWVVKS2hJSE8wWF9YT0k2ZDV3eGs4YjAwUTAifSx7InR5cCI6Imh0dHA6XC9cL3NjaGVtYXMubWljcm9zb2Z0LmNvbVwvaWRlbnRpdHlcL2NsYWltc1wvdGVuYW50aWQiLCJ2YWwiOiI1Nzg3MjU0OC00NmJkLTQ1OGUtOGFlNC1jMmE1NDFlYTZkMWIifSx7InR5cCI6Imh0dHA6XC9cL3NjaGVtYXMueG1sc29hcC5vcmdcL3dzXC8yMDA1XC8wNVwvaWRlbnRpdHlcL2NsYWltc1wvbmFtZSIsInZhbCI6ImJvYkBsb3djb2RlcmV2b2x1dGlvbi5vbm1pY3Jvc29mdC5jb20ifSx7InR5cCI6Imh0dHA6XC9cL3NjaGVtYXMueG1sc29hcC5vcmdcL3dzXC8yMDA1XC8wNVwvaWRlbnRpdHlcL2NsYWltc1wvdXBuIiwidmFsIjoiYm9iQGxvd2NvZGVyZXZvbHV0aW9uLm9ubWljcm9zb2Z0LmNvbSJ9LHsidHlwIjoidXRpIiwidmFsIjoiNlU5T2RPLTJPVUs0MnRYZ1E5cERBQSJ9LHsidHlwIjoidmVyIiwidmFsIjoiMS4wIn1dLCJuYW1lX3R5cCI6Imh0dHA6XC9cL3NjaGVtYXMueG1sc29hcC5vcmdcL3dzXC8yMDA1XC8wNVwvaWRlbnRpdHlcL2NsYWltc1wvbmFtZSIsInJvbGVfdHlwIjoiaHR0cDpcL1wvc2NoZW1hcy5taWNyb3NvZnQuY29tXC93c1wvMjAwOFwvMDZcL2lkZW50aXR5XC9jbGFpbXNcL3JvbGUifQ==';
        if (clientPrincipal) {
            const clientPrincipalObj = JSON.parse(Buffer.from(clientPrincipal, 'base64').toString('utf8'));
            this.name = clientPrincipalObj.claims.find((c: any) => c.typ === 'name')?.val;
            this.email = clientPrincipalObj.claims.find((c: any) => c.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name')?.val;
            console.log(`🔐 Request ${this.requestNumber} authenticated as ${this.name} (${this.email})`);
        } else {
            this.name = "Avery Howard";
            this.email = "avery@treyresearch.com";
            console.log(`🔓 Request ${this.requestNumber} not authenticated`);
        }
    }

    public getDbConsultantName(apiConsultantName: string): string {
        if (this.name.toLowerCase().indexOf(apiConsultantName.toLowerCase()) < 0) {
            return apiConsultantName;
        } else {
            return "Avery Howard";
        }
    }
}





