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
    forecastThisMonth: number;
    forecastNextMonth: number;
    deliveredLastMonth: number;
    deliveredThisMonth: number;
}
//#endregion

//#region GET requests for /me and /consultants ---

// Information about a project that a consultant is assigned to
export interface ApiConsultantAssignment {
    projectName: string;
    projectDescription: string;
    projectLocation: Location;
    clientName: string;
    clientContact: string;
    clientEmail: string;
    role: string;
    forecastThisMonth: number;
    forecastNextMonth: number;
    deliveredLastMonth: number;
    deliveredThisMonth: number;
}

// Returned by all /api/consultants GET requests
export interface ApiConsultant extends Consultant {
    projects: ApiConsultantAssignment[];
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
export interface ApiChargeTimeResponse {
    clientName: string;
    projectName: string;
    remainingForecast: number;
    message: string;
}
//#endregion

//#region POST request to /api/projects/assignConsultant ---
export interface ApiAddConsultantToProjectRequest {
    projectName: string;
    consultantName: string;
    role: string;
    hours: number;
}
export interface ApiAddConsultantToProjectResponse {
    clientName: string;
    projectName: string;
    consultantName: string;
    remainingForecast: number;
    message: string;
}
//#endregion

export interface ErrorResult {
    status: number;
    message: string;
}
