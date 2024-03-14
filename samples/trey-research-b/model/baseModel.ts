export interface Project {
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

export interface Consultant {
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

export interface Assignment {
    id: string;
    projectId: string;
    consultantId: string;
    startDate: Date;
    endDate: Date;
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
