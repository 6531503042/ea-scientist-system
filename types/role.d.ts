/**
 * Role and Permission Type Definitions
 * Ready for backend integration
 */

export type Permission = {
    _id: string;
    name: string;
    description?: string;
    module: string;
    actions: ('create' | 'read' | 'update' | 'delete')[];
};

export type Role = {
    _id: string;
    name: string;
    nameTh?: string;
    description?: string;
    permissions: Permission[] | string[];
    isDefault?: boolean;
    isSystemRole?: boolean;
    userCount?: number;
    createdAt?: string;
    updatedAt?: string;
};

export type RoleKey = 'admin' | 'architect' | 'manager' | 'business_owner' | 'auditor' | 'viewer';

export type RoleLabel = {
    label: string;
    labelTh: string;
    color: string;
};

export type RoleLabels = Record<RoleKey, RoleLabel>;
