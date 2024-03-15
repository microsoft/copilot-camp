import DbService from './DbService';
import { DbProject } from '../model/dbModel';
import { Project } from '../model/apiModel';

// NOTE: Consultants are READ ONLY in this demo app, so we are free to cache them in memory.
const TABLE_NAME = "Project";

class ProjectService {

    private dbProjectService = new DbService<DbProject>();

    async getProjectById(id: string): Promise<Project> {
        const dbConsultant = await this.dbProjectService.getEntityById(TABLE_NAME, id);
        return this.convertDbProject(dbConsultant);
    }

    async getProjects(filter: (entity: DbProject) => boolean): Promise<Project[]> {
        const dbConsultants = await this.dbProjectService.getEntities(TABLE_NAME, filter);
        return dbConsultants.map(this.convertDbProject);
    }

    private convertDbProject(dbProject: DbProject): Project {
        const result = {
            id: dbProject.id,
            name: dbProject.name,
            description: dbProject.description,
            clientName: dbProject.clientName,
            clientContact: dbProject.clientContact,
            clientEmail: dbProject.clientEmail,
            location: dbProject.location
        };
        // Insert any augmentation here

        return result;
    }
}

export default new ProjectService();
