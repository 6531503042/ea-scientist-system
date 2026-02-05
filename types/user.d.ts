/**
 * User Type Definitions
 * Ready for backend integration
 */

import { Role, RoleKey } from "./role";
import { Department } from "./department";

export type UserName = {
    first: string;
    middle?: string;
    last?: string;
};

export type UserStatus = 'active' | 'inactive' | 'pending';

export type User = {
    _id: string;
    name: UserName;
    displayName?: string;
    username: string;
    email: string;
    role: Role | RoleKey | string;
    department?: Department | string;
    status: UserStatus;
    lastLogin?: string;
    createdAt?: string;
    updatedAt?: string;
    metadata?: Record<string, string>;
};

export type CreateUserInput = Omit<User, '_id' | 'createdAt' | 'updatedAt' | 'lastLogin'>;
export type UpdateUserInput = Partial<CreateUserInput>;
