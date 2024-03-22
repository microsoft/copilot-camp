import { Project, Consultant, Location } from './baseModel';

//#region GET requests for /projects --------------------

export interface ApiProjectAssignment {
    consultantName: string;
    consultantLocation: Location;
    role: string;
    forecastThisMonth: number;
    forecastNextMonth: number;
    deliveredLastMonth: number;
    deliveredThisMonth: number;
}

// Returned by all /api/projects GET requests
export interface ApiProject extends Project {
    consultants: ApiProjectAssignment[];
    clientLogoUrl: string;
    mapUrl: string;
    forecastThisMonth: number;
    forecastNextMonth: number;
    deliveredLastMonth: number;
    deliveredThisMonth: number;
}
//#endregion

//#region GET requests for /me and /consultants ---

export interface ApiConsultantAssignment {
    projectName: string;
    projectDescription: string;
    projectLocation: Location;
    role: string;
    forecastThisMonth: number;
    forecastNextMonth: number;
    deliveredLastMonth: number;
    deliveredThisMonth: number;
}

// Returned by all /api/consultants GET requests
export interface ApiConsultant extends Consultant {
    projects: ApiConsultantAssignment[];
    consultantPhotoUrl: string;
    forecastThisMonth: number;
    forecastNextMonth: number;
    deliveredLastMonth: number;
    deliveredThisMonth: number;
}
//#endregion

//#region POST request to /api/me/chargeTime ---
export interface ApiChargeTimeRequest {
    projectName: string;
    hours: number;
}
//#endregion

//#region POST request to /api/projects/addConsultant ---
export interface ApiAddConsultantToProjectRequest {
    projectName: string;
    consultantName: string;
    role: string;
    hours: number;
}
//#endregion

export interface ErrorResult {
    status: number;
    message: string;
}
