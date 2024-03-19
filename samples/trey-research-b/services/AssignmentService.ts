import DbService from './DbService';
import ProjectService from './ProjectService';
import { DbAssignment } from '../model/dbModel';
import { Assignment, Project } from '../model/baseModel';
import { HttpError } from '../utilities';

const TABLE_NAME = "Assignment";

class AssignmentService {

    // NOTE: Assignments are READ-WRITE so disable local caching
    private dbService = new DbService<DbAssignment>(false);

    async getAssignments(filter: (entity: DbAssignment) => boolean): Promise<Assignment[]> {
        const dbConsultants = await this.dbService.getEntities(TABLE_NAME, filter);
        return Promise.all(dbConsultants.map(await this.convertDbAssignment));
    }

    async chargeHoursToProject(projectId: string, consultantId: string, month: number, year: number, hours: number): Promise<Assignment> {
        try {
            const dbAssignment = await this.dbService.getEntityByRowKey(TABLE_NAME, projectId + "," + consultantId);
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
            return await this.convertDbAssignment(dbAssignment);
        } catch (e) {
            throw new HttpError(404, "Assignment not found");
        }
    }

    private async convertDbAssignment(dbAssignment: DbAssignment): Promise<Assignment> {
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
        // Insert augmentation here

        return result;
    }
}

export default new AssignmentService();
