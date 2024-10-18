import DbService from './DbService';
import { DbAssignment } from '../model/dbModel';
import { Assignment } from '../model/baseModel';
import { HttpError } from './Utilities';

const TABLE_NAME = "Assignment";

class AssignmentDbService {

    // NOTE: Assignments are READ-WRITE so disable local caching
    private dbService = new DbService<DbAssignment>(false);

    async getAssignments(): Promise<Assignment[]> {
        const assignments = await this.dbService.getEntities(TABLE_NAME) as DbAssignment[];
        const result = assignments.map((e) => this.convertDbAssignment(e));
        return result;
    }

    async chargeHoursToProject(projectId: string, consultantId: string, month: number, year: number, hours: number): Promise<number> {
        try {
            const dbAssignment = await this.dbService.getEntityByRowKey(TABLE_NAME, projectId + "," + consultantId) as DbAssignment;
            if (!dbAssignment) {
                throw new HttpError(404, "Assignment not found");
            }
            // Add the hours delivered
            if (!dbAssignment.delivered) {
                dbAssignment.delivered = [{ month: month, year: year, hours: hours }];
            } else {
                let a = dbAssignment.delivered.find(d => d.month === month && d.year === year);
                if (a) {
                    a.hours += hours;
                } else {
                    dbAssignment.delivered.push({ month, year, hours });
                }
            }
            dbAssignment.delivered.sort((a, b) => a.year - b.year || a.month - b.month);

            // Subtract the hours from the forecast
            let remainingForecast = -hours;
            if (!dbAssignment.forecast) {
                dbAssignment.forecast = [{ month: month, year: year, hours: -hours }];
            } else {
                let a = dbAssignment.forecast.find(d => d.month === month && d.year === year);
                if (a) {
                    a.hours -= hours;
                    remainingForecast = a.hours;
                } else {
                    dbAssignment.forecast.push({ month: month, year: year, hours: -hours });
                }
            }
            dbAssignment.forecast.sort((a, b) => a.year - b.year || a.month - b.month);

            await this.dbService.updateEntity(TABLE_NAME, dbAssignment)

            return remainingForecast;
        } catch (e) {
            throw new HttpError(404, "Assignment not found");
        }
    }

    async addConsultantToProject(projectId: string, consultantId: string, role: string, hours: number): Promise<number> {

        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();

        let dbAssignment = null;
        try {
            dbAssignment = await this.dbService.getEntityByRowKey(TABLE_NAME, projectId + "," + consultantId) as DbAssignment;
        } catch { }

        if (dbAssignment) {
            throw new HttpError(403, "Assignment already exists");
        }

        try {
            const newAssignment: DbAssignment = {
                etag: "",
                partitionKey: TABLE_NAME,
                rowKey: projectId + "," + consultantId,
                timestamp: new Date(),
                id: projectId + "," + consultantId,
                projectId: projectId,
                consultantId: consultantId,
                role: role,
                billable: true,
                rate: 100,
                forecast: [{ month: month, year: year, hours: hours }],
                delivered: []
            };

            await this.dbService.createEntity(TABLE_NAME, newAssignment.id, newAssignment)

            return hours;
        } catch (e) {
            throw new HttpError(500, "Unable to add assignment");
        }
    }

    private convertDbAssignment(dbAssignment: DbAssignment): Assignment {
        const result: Assignment = {
            id: dbAssignment.id,
            projectId: dbAssignment.projectId,
            consultantId: dbAssignment.consultantId,
            role: dbAssignment.role,
            billable: dbAssignment.billable,
            rate: dbAssignment.rate,
            forecast: dbAssignment.forecast,
            delivered: dbAssignment.delivered
        };

        return result;
    }
}

export default new AssignmentDbService();
