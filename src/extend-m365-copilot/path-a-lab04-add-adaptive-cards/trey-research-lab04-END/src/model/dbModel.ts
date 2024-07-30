import { TableEntity } from "@azure/data-tables";
import { Project, Consultant, Assignment } from "./baseModel";

export interface DbEntity extends TableEntity {
    etag: string;
    partitionKey: string;
    rowKey: string;
    timestamp: Date;
}

export interface DbProject extends DbEntity, Project { }

export interface DbConsultant extends DbEntity, Consultant { } 

export interface DbAssignment extends DbEntity, Assignment { }