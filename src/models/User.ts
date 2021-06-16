export type UserRoles = "SUPER_ADMIN" | "ADMIN" | "AGENT" | "EMPLOYEE";
export type UserStatus = "REGULAR" | "CLOSED" | "BANNED" | "EXPIRE";

export enum UserRolesEnum {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    AGENT = "AGENT",
    EMPLOYEE = "EMPLOYEE",
}

export enum UserStatusEnum {
    REGULAR = "REGULAR",
    CLOSED = "CLOSED",
    BANNED = "BANNED",
    EXPIRE = "EXPIRE",
}

export interface ChildID {
    ADMID?: string[]; // ADMIN ID
    AGEID?: string[]; // AGENT ID
    EMPID?: string[]; // EMPOLYEE ID
}

export interface ParentID {
    SADMID?: string[]; // SUPER_ADMIN ID
    ADMID?: string[]; // ADMIN ID
    AGEID?: string[]; // AGENT ID
}

export interface User {
    id: string;
    username: string;
    password: string;
    role: UserRoles;
    child?: ChildID;
    parent?: ParentID;
    status: UserStatus;
    tokenVersion: number;
    resetPasswordToken?: string;
    resetPasswordExpiry?: number;
    createAt: Date;
    updateAt: Date;
    lastActive?: Date;
}
