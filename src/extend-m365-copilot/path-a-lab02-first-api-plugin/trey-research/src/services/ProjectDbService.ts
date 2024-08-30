import DbService from './DbService';
import { DbProject } from '../model/dbModel';
import { Project } from '../model/baseModel';

const TABLE_NAME = "Project";

class ProjectDbService {

    // NOTE: Projects are READ ONLY in this demo app, so we are free to cache them in memory.
    private dbService = new DbService<DbProject>(true);

    async getProjectById(id: string): Promise<Project> {
        const project = await this.dbService.getEntityByRowKey(TABLE_NAME, id) as DbProject;
        return this.convertDbProject(project);
    }

    async getProjects(): Promise<Project[]> {
        const projects = await this.dbService.getEntities(TABLE_NAME) as DbProject[];
        return projects.map<Project>((p) => this.convertDbProject(p));
    }

    private convertDbProject(dbProject: DbProject): Project {
        const result = {
            id: dbProject.id,
            name: dbProject.name,
            description: dbProject.description,
            clientName: dbProject.clientName,
            clientContact: dbProject.clientContact,
            clientEmail: dbProject.clientEmail,
            location: dbProject.location,
            mapUrl: this.getMapUrl(dbProject)
        };
        return result;
    }

    private getMapUrl(project: Project): string {
        let companyNameKabobCase = project.clientName.toLowerCase().replace(/ /g, "-");
        return `https://microsoft.github.io/copilot-camp/demo-assets/images/maps/${companyNameKabobCase}.jpg`;
    }
}

export default new ProjectDbService();
