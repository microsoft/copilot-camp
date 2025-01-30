export interface Location {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
}

export interface HoursEntry {
    month: number;
    year: number;
    hours: number;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    clientName: string;
    clientContact: string;
    clientEmail: string;
    location: Location;
    mapUrl: string;
}

export interface Consultant {
    id: string;
    name: string;
    email: string;
    phone: string;
    consultantPhotoUrl: string;
    location: Location;
    skills: string[];
    certifications: string[];
    roles: string[];
}

export interface Assignment {
    id: string;         // The assignment ID is "projectid,consultantid"
    projectId: string;
    consultantId: string;
    role: string;
    billable: boolean;
    rate: number;
    forecast: HoursEntry [];
    delivered: HoursEntry[];
}
