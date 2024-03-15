export interface BaseProject {
    id: string;
    name: string;
    description: string;
    clientName: string;
    clientContact: string;
    clientEmail: string;
    location: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        latitude: number;
        longitude: number;
    }
}

export interface BaseConsultant {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        latitude: number;
        longitude: number;
    }
    skills: string[];
    certifications: string[];
    roles: string[];
}

export interface BaseAssignment {
    id: string;         // The assignment ID is "projectid,consultantid"
    projectId: string;
    consultantId: string;
    role: string;
    billable: boolean;
    rate: number;
    forecast: [
        {
            month: number;
            year: number;
            hours: number;
        }
    ];
    delivered: [
        {
            month: number;
            year: number;
            hours: number;
        }
    ]
}
