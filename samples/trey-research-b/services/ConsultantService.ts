import DbService from './DbService';
import { DbConsultant } from '../model/dbModel';
import { Consultant } from '../model/apiModel';

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

    // async updateConsultant(id: string, updatedConsultant: Consultant): Promise<Consultant> {
    //     const dbConsultant = await this.dbConsultantService.getEntityById(TABLE_NAME, id);
    //     const updatedDbConsultant = await this.dbConsultantService.updateEntity(TABLE_NAME, id, dbConsultant, (from: DbConsultant, to: DbConsultant) => ({
    //         id: from.id,

    // }));
    //     return this.convertDbConsultant(updatedDbConsultant);
    // }

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
