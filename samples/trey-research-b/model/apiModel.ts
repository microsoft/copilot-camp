import { Project, Consultant } from './baseModel';

//#region GET requests for /projects --------------------

interface ApiProjectAssignment {
    consultant: {
        name: string;
        details: Consultant;
        role: string;
        forecastThisMonth: number;
        forecastNextMonth: number;
        deliveredThisMonth: number;
        deliveredNextMonth: number;
    };
}

// Returned by all /api/projects GET requests
export interface ApiProject extends Project {
    consultants: ApiProjectAssignment[];
}
//#endregion

//#region GET requests for /me and /consultants ---

interface ApiConsultantAssignment {
    project: {
        name: string;
        details: Project;
        role: string;
        forecastThisMonth: number;
        forecastNextMonth: number;
        deliveredThisMonth: number;
        deliveredNextMonth: number;
    };
}

// Returned by all /api/consultants GET requests
export interface ApiConsultant extends Consultant {
    projects: ApiConsultantAssignment[];
    forecastThisMonth: number;
    forecastNextMonth: number;
    deliveredThisMonth: number;
    deliveredNextMonth: number;
}
//#endregion

//#region POST request to /api/me/chargeTime ---
export interface ApiChargeTimeRequest {
    projectName: string;
    hours: number;
}
export interface ApiChargeTimeResponse {
    success: boolean;
    message: string;
}
//#endregion

//#region POST request to /api/projects/addConsultant ---
export interface ApiAddConsultantToProjectRequest {
    projectName: string;
    consultantName: string;
    role: string;
}
export interface ApiAddConsultantToProjectResponse {
    success: boolean;
    message: string;
}
//#endregion

export interface ErrorResult {
    status: number;
    error: string;
}
