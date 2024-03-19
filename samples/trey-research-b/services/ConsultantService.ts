import DbService from './DbService';
import { DbConsultant } from '../model/dbModel';
import { Consultant } from '../model/baseModel';

const TABLE_NAME = "Consultant";

class ConsultantService {

    // NOTE: Consultants are READ ONLY in this demo app, so we are free to cache them in memory.
    private dbService = new DbService<DbConsultant>(true);

    async getConsultantById(id: string): Promise<Consultant> {
        const dbConsultant = await this.dbService.getEntityByRowKey(TABLE_NAME, id);
        return this.convertDbConsultant(dbConsultant);
    }

    async getConsultants(filter: (entity: DbConsultant) => boolean): Promise<Consultant[]> {
        const dbConsultants = await this.dbService.getEntities(TABLE_NAME, filter);
        return dbConsultants.map(this.convertDbConsultant);
    }

    private convertDbConsultant(dbConsultant: DbConsultant): Consultant {
        const result = {
            id: dbConsultant.id,
            name: dbConsultant.name,
            email: dbConsultant.email,
            phone: dbConsultant.phone,
            location: dbConsultant.location,
            skills: dbConsultant.skills,
            certifications: dbConsultant.certifications,
            roles: dbConsultant.roles
        };
        // Insert augmentation here

        return result;
    }
}

export default new ConsultantService();
