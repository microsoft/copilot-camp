import { BaseProject, BaseConsultant, BaseAssignment } from "./baseModel";

export interface DbRow {
    etag: string;
    partitionKey: string;
    rowKey: string;
    timestamp: Date;
}

export interface DbProject extends DbRow, BaseProject { }

export interface DbConsultant extends DbRow, BaseConsultant { } 

export interface DbAssignment extends DbRow, BaseAssignment { }