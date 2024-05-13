import DbService from './DbService';
import { DbConsultant } from '../model/dbModel';
import { Consultant } from '../model/baseModel';
import Identity from "../services/IdentityService";

const TABLE_NAME = "Consultant";

class ConsultantDbService {

    // NOTE: Consultants are READ ONLY in this demo app, so we are free to cache them in memory.
    private dbService = new DbService<DbConsultant>(true);

    async getConsultantById(identity: Identity, id: string): Promise<Consultant> {
        const consultant = await this.dbService.getEntityByRowKey(TABLE_NAME, id) as DbConsultant;
        return this.convertDbConsultant(identity, consultant);
    }

    async getConsultants(identity: Identity): Promise<Consultant[]> {
        const consultants = await this.dbService.getEntities(TABLE_NAME) as DbConsultant[];
        return consultants.map<Consultant>((c) => this.convertDbConsultant(identity, c));
    }

    private convertDbConsultant(identity: Identity, dbConsultant: DbConsultant): Consultant {
        const result = {
            id: dbConsultant.id,
            name: dbConsultant.name,
            email: dbConsultant.email,
            phone: dbConsultant.phone,
            consultantPhotoUrl: dbConsultant.consultantPhotoUrl,
            location: dbConsultant.location,
            skills: dbConsultant.skills,
            certifications: dbConsultant.certifications,
            roles: dbConsultant.roles
        };
        if (dbConsultant.id === identity.id) {
            // If this is the current user, return the actual name and email
            result.name = identity.name;
            result.email = identity.email;
        }
        return result;
    }
}

export default new ConsultantDbService();
