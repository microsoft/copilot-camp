import DbService from './DbService';
import { DbConsultant } from '../model/dbModel';
import { Consultant } from '../model/apiModel';

// NOTE: Consultants are READ ONLY in this demo app, so we are free to cache them in memory.
const TABLE_NAME = "Consultant";

class ConsultantService extends DbService<DbConsultant> {

    private dbConsultantService = new DbService<DbConsultant>();

    async getConsultantById(id: string): Promise<Consultant> {
        const dbConsultant = await this.dbConsultantService.getEntityById(TABLE_NAME, id);
        return this.convertDbConsultant(dbConsultant);
    }

    async getConsultants(): Promise<Consultant[]> {
        const dbConsultants = await this.dbConsultantService.getEntities(TABLE_NAME, () => true);
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
        // Insert any augmentation here

        return result;
    }
}

export default new ConsultantService();
