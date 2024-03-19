import DbService from './DbService';
import { DbProject } from '../model/dbModel';
import { Project } from '../model/baseModel';

const TABLE_NAME = "Project";

class ProjectDbService {

    // NOTE: Projects are READ ONLY in this demo app, so we are free to cache them in memory.
    private dbService = new DbService<DbProject>(true);

    async getProjectById(id: string): Promise<Project> {
        const dbConsultant = await this.dbService.getEntityByRowKey(TABLE_NAME, id);
        return this.convertDbProject(dbConsultant);
    }

    async getProjects(filter: (entity: DbProject) => boolean): Promise<Project[]> {
        const dbConsultants = await this.dbService.getEntities(TABLE_NAME, filter);
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
        // Insert augmentation here

        return result;
    }
}

export default new ProjectDbService();
