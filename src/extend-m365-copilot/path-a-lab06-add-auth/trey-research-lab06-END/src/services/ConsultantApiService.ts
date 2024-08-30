import { Consultant, HoursEntry, Assignment } from '../model/baseModel';
import { ApiConsultant, ApiChargeTimeResponse } from '../model/apiModel';
import ProjectDbService from './ProjectDbService';
import AssignmentDbService from './AssignmentDbService';
import ConsultantDbService from './ConsultantDbService';
import { HttpError } from './Utilities';
import ProjectApiService from './ProjectApiService';

const AVAILABLE_HOURS_PER_MONTH = 160;

class ConsultantApiService {

    async getApiConsultantById(consultantId: string): Promise<ApiConsultant> {

        let result = null;
        let consultant = await ConsultantDbService.getConsultantById(consultantId);
        if (consultant) {
            let assignments = await AssignmentDbService.getAssignments();
            result = await this.getApiConsultantForBaseConsultant(consultant, assignments);
        }
        return result;
    }

    async getApiConsultants(
        consultantName: string, projectName: string, skill: string,
        certification: string, role: string, hoursAvailable: string): Promise<ApiConsultant[]> {

        let consultants = await ConsultantDbService.getConsultants();
        let assignments = await AssignmentDbService.getAssignments();

        // Filter on base properties
        if (consultantName) {
            consultants = consultants.filter(
                (c) => c.name.toLowerCase().includes(consultantName.toLocaleLowerCase()));
        }
        if (skill) {
            consultants = consultants.filter(
                (c) => c.skills.find((s) => s.toLowerCase().includes(skill.toLocaleLowerCase())));
        }
        if (certification) {
            consultants = consultants.filter(
                (c) => c.certifications.find((s) => s.toLowerCase().includes(certification.toLocaleLowerCase())));
        }
        if (role) {
            consultants = consultants.filter(
                (c) => c.roles.find((s) => s.toLowerCase().includes(role)));
        }

        // Augment the base properties with assignment information
        let result = await Promise.all(consultants.map((c) => this.getApiConsultantForBaseConsultant(c, assignments)));

        // Filter on project name
        if (result && projectName) {
            result = result.filter(
                (c) => {
                    let project = c.projects.find((p) => {
                        let x = p.projectName.toLowerCase() + p.clientName.toLowerCase();
                        return x.includes(projectName);
                    });
                    return project;
                });
        };
        // Filter on available hours
        if (result && hoursAvailable) {
            result = result.filter(
                (c) => {
                    let availableHours = AVAILABLE_HOURS_PER_MONTH * 2 - c.forecastThisMonth - c.forecastNextMonth;
                    return availableHours >= parseInt(hoursAvailable);
                });
        };

        return result;
    }

    public async createApiConsultant(consultant: Consultant): Promise<ApiConsultant> {
        await ConsultantDbService.createConsultant(consultant);
        const assignments = await AssignmentDbService.getAssignments();

        const newApiConsultant = 
            this.getApiConsultantForBaseConsultant(consultant, assignments);
        return newApiConsultant;
    }

    // Augment a base consultant to get an ApiConsultant
    async getApiConsultantForBaseConsultant(consultant: Consultant, assignments: Assignment[]): Promise<ApiConsultant> {

        const result = {
            id: consultant.id,
            name: consultant.name,
            email: consultant.email,
            phone: consultant.phone,
            consultantPhotoUrl: consultant.consultantPhotoUrl,
            location: consultant.location,
            skills: consultant.skills,
            certifications: consultant.certifications,
            roles: consultant.roles,
            projects: [],
            forecastThisMonth: 0,
            forecastNextMonth: 0,
            deliveredLastMonth: 0,
            deliveredThisMonth: 0
        }
        assignments = assignments.filter((a) => a.consultantId === consultant.id);

        result.forecastThisMonth = 0;
        result.forecastNextMonth = 0;
        result.deliveredLastMonth = 0;
        result.deliveredThisMonth = 0;

        for (let assignment of assignments) {
            const project = await ProjectDbService.getProjectById(assignment.projectId);
            const { lastMonthHours: forecastLastMonth,
                thisMonthHours: forecastThisMonth,
                nextMonthHours: forecastNextMonth } = this.findHours(assignment.forecast);
            const { lastMonthHours: deliveredLastMonth,
                thisMonthHours: deliveredThisMonth,
                nextMonthHours: deliveredNextMonth } = this.findHours(assignment.delivered);

            result.projects.push({
                projectName: project.name,
                projectDescription: project.description,
                projectLocation: project.location,
                mapUrl: project.mapUrl,
                clientName: project.clientName,
                clientContact: project.clientContact,
                clientEmail: project.clientEmail,
                role: assignment.role,
                forecastThisMonth: forecastThisMonth,
                forecastNextMonth: forecastNextMonth,
                deliveredLastMonth: deliveredLastMonth,
                deliveredThisMonth: deliveredThisMonth
            });
            result.forecastThisMonth += forecastThisMonth;
            result.forecastNextMonth += forecastNextMonth;
            result.deliveredLastMonth += deliveredLastMonth;
            result.deliveredThisMonth += deliveredThisMonth;

        }
        return result;
    }

    // Extract this and next month's hours from an array of HoursEntry
    private findHours(hours: HoursEntry[]): { lastMonthHours: number, thisMonthHours: number, nextMonthHours: number } {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        const nextMonth = thisMonth === 11 ? 0 : thisMonth + 1;
        const nextYear = thisMonth === 11 ? thisYear + 1 : thisYear;

        const result = {
            lastMonthHours: hours.find((h) => h.month === lastMonth + 1 && h.year === lastYear)?.hours || 0,
            thisMonthHours: hours.find((h) => h.month === thisMonth + 1 && h.year === thisYear)?.hours || 0,
            nextMonthHours: hours.find((h) => h.month === nextMonth + 1 && h.year === nextYear)?.hours || 0
        };
        return result;
    }

    async chargeTimeToProject(projectName: string, consultantId: string, hours: number): Promise<ApiChargeTimeResponse> {
        let projects = await ProjectApiService.getApiProjects(projectName, "");
        if (projects.length === 0) {
            throw new HttpError(404, `Project not found: ${projectName}`);
        } else if (projects.length > 1) {
            throw new HttpError(406, `Multiple projects found with the name: ${projectName}`);
        } else {
            const project = projects[0];
            // Always charge to the current month
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();
            const remainingForecast = await AssignmentDbService.chargeHoursToProject(project.id, consultantId, month, year, hours);
            let message = "";
            if (remainingForecast < 0) {
                message = `Charged ${hours} hours to ${project.clientName} on project "${project.name}". You are ${-remainingForecast} hours over your forecast this month.`;
            } else {
                message = `Charged ${hours} hours to ${project.clientName} on project "${project.name}". You have ${remainingForecast} hours remaining this month.`;
            }
            return {
                clientName: project.clientName,
                projectName: project.name,
                remainingForecast,
                message
            };
        }
    }
}

export default new ConsultantApiService();
