export interface Project {
    id: string;
    name: string;
    description: string;
    clientName: string;
    clientContact: string;
    clientEmail: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
}

export interface Consultant {
    id: string;
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    skills: string;
    certifications: string;
    roles: string;
}

export interface HoursJson {
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

export interface Assignment {
    id: string;
    projectId: string;
    consultantId: string;
    startDate: Date;
    endDate: Date;
    billable: boolean;
    rate: number;
    hours: HoursJson;              // Serialized HoursJSON
}
