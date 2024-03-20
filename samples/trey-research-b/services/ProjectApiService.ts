import { Project, HoursEntry, Assignment } from '../model/baseModel';
import { ApiProject, ApiChargeTimeResponse } from '../model/apiModel';
import ProjectDbService from './ProjectDbService';
import AssignmentDbService from './AssignmentDbService';
import ConsultantDbService from './ConsultantDbService';

class ProjectApiService {

    async getApiProjectById(projectId: string): Promise<ApiProject> {
        const project = await ProjectDbService.getProjectById(projectId);
        let assignments = await AssignmentDbService.getAssignments();

        const result = await this.getApiProject(project, assignments);
        return result;
    }

    async getApiProjects(projectOrClientName: string, consultantName: string): Promise<ApiProject[]> {

        let projects = await ProjectDbService.getProjects();
        let assignments = await AssignmentDbService.getAssignments();

        // Filter on base properties
        if (projectOrClientName) {
            projects = projects.filter(
                (p) => {
                    const name = p.name?.toLowerCase();
                    const clientName = p.clientName?.toLowerCase();
                    return name.includes(projectOrClientName) || clientName.includes(projectOrClientName);
                });
        }

        // Augment the base properties with consultant information
        let result = await Promise.all(projects.map((p) => this.getApiProject(p, assignments)));

        // Filter on consultant information
        if (result) {
            result = result.filter(
                (p) => {
                    const name = consultantName.toLowerCase();
                    return p.consultants.find((n) => n.consultant.name.toLowerCase().includes(name));
                });
            };
            
        return result;
    }

    // Augment a project to get an ApiProject
    async getApiProject(project: Project, assignments: Assignment[]): Promise<ApiProject> {

        const result = project as ApiProject;
        assignments = assignments.filter((a) => a.projectId === project.id);

        result.consultants = [];
        result.forecastThisMonth = 0;
        result.forecastNextMonth = 0;
        result.deliveredThisMonth = 0;
        result.deliveredNextMonth = 0;

        for (let assignment of assignments) {
            const consultant = await ConsultantDbService.getConsultantById(assignment.consultantId);
            const { thisMonthHours: forecastThisMonth,
                    nextMonthHours: forecastNextMonth } = this.findHours(assignment.forecast);
            const { thisMonthHours: deliveredThisMonth,
                    nextMonthHours: deliveredNextMonth } = this.findHours(assignment.delivered);

            result.consultants.push({
                consultant: {
                    name: consultant.name,
                    details: consultant,
                    role: assignment.role,
                    forecastThisMonth: forecastThisMonth,
                    forecastNextMonth: forecastNextMonth,
                    deliveredThisMonth: deliveredThisMonth,
                    deliveredNextMonth: deliveredNextMonth
                }
            });
            result.forecastThisMonth += forecastThisMonth;
            result.forecastNextMonth += forecastNextMonth;
            result.deliveredThisMonth += deliveredThisMonth;
            result.deliveredNextMonth += deliveredNextMonth;

        }
        return result;
    }

    private findHours(hours: HoursEntry[]): { thisMonthHours: number, nextMonthHours: number } {
        const now = new Date();
        const thisMonth = now.getMonth() + 1;
        const thisYear = now.getFullYear();

        const nextMonth = thisMonth === 11 ? 0 : thisMonth + 1;
        const nextYear = thisMonth === 11 ? thisYear + 1 : thisYear;

        const result = {
            thisMonthHours: hours.find((h) => h.month === thisMonth && h.year === thisYear)?.hours || 0,
            nextMonthHours: hours.find((h) => h.month === nextMonth && h.year === nextYear)?.hours || 0
        };
        return result;
    }

    async addConsultantToProject(projectName: string, consultantId: string, hours: number): Promise<ApiChargeTimeResponse> {
        return {
            success: false,
            message: "Not implemented"
        };
    }
}

export default new ProjectApiService();
