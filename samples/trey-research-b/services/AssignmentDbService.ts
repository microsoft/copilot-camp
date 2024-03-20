import DbService from './DbService';
import { DbAssignment } from '../model/dbModel';
import { Assignment } from '../model/baseModel';
import { HttpError } from '../utilities';

const TABLE_NAME = "Assignment";

class AssignmentDbService {

    // NOTE: Assignments are READ-WRITE so disable local caching
    private dbService = new DbService<DbAssignment>(false);

    async getAssignments(): Promise<Assignment[]> {
        const assignments = await this.dbService.getEntities(TABLE_NAME) as DbAssignment[];
        const result = assignments.map((e) => this.convertDbAssignment(e));
        return result;
    }

    async chargeHoursToProject(projectId: string, consultantId: string, month: number, year: number, hours: number): Promise<Assignment> {
        try {
            const dbAssignment = await this.dbService.getEntityByRowKey(TABLE_NAME, projectId + "," + consultantId) as DbAssignment;
            if (!dbAssignment) {
                throw new HttpError(404, "Assignment not found");
            }
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
            await this.dbService.updateEntity(TABLE_NAME, dbAssignment)
            return this.convertDbAssignment(dbAssignment);
        } catch (e) {
            throw new HttpError(404, "Assignment not found");
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
