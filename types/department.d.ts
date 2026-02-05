/**
 * Department/Organization Type Definitions
 * Ready for backend integration
 */

export type Department = {
    _id: string;
    code: string;
    name: string;
    nameTh?: string;
    description?: string;
    parent?: Department | string;
    head?: string;
    memberCount?: number;
    createdAt?: string;
    updatedAt?: string;
};

export type CreateDepartmentInput = Omit<Department, '_id' | 'createdAt' | 'updatedAt' | 'memberCount'>;
export type UpdateDepartmentInput = Partial<CreateDepartmentInput>;
