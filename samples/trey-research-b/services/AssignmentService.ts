import DbService from './DbService';
import { DbAssignment } from '../model/dbModel';
import { Assignment } from '../model/apiModel';

// NOTE: Assignments are READ-WRITE so we always need to re-read the database
// in case another instance has updated the data.
const TABLE_NAME = "Assignment";

class AssignmentService {

    private dbService = new DbService<DbAssignment>();

    async getAssignments(filter: (entity: DbAssignment) => boolean): Promise<Assignment[]> {
        const dbConsultants = await this.dbService.getEntities(TABLE_NAME, filter);
        return dbConsultants.map(this.convertDbAssignment);
    }

    private convertDbAssignment(dbAssignment: DbAssignment): Assignment {
        const result = {
            id: dbAssignment.id,
            projectId: dbAssignment.projectId,
            consultantId: dbAssignment.consultantId,
            role: dbAssignment.role,
            billable: dbAssignment.billable,
            rate: dbAssignment.rate,
            forecast: dbAssignment.forecast,
            delivered: dbAssignment.delivered
        };
        // Insert any augmentation here

        return result;
    }
}

export default new AssignmentService();
