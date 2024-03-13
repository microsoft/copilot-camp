import { Project, Consultant, Assignment } from './baseModel';

export interface DbRow {
    etag: string;
    partitionKey: string;
    rowKey: string;
    timestamp: Date;
}

export interface DbProject extends DbRow, Project { }

export interface DbConsultant extends DbRow, Consultant { } 

export interface DbAssignment extends DbRow, Assignment { }