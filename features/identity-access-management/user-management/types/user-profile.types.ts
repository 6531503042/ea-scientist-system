import { Pagination } from "@/features/identity-access-management/types/access-control.types";
import { UserStatus, Role, Department } from "@/features/auth/types/auth.types";

export type { UserStatus, Role as RoleLite, Department as DepartmentLite };

export interface UserItem {
  id: number;
  roleId: number;
  departmentId: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber?: string | null;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
  role?: Role;
  department?: Department;
}

export interface UsersListPayload {
  data: UserItem[];
  pagination: Pagination;
}

export interface CreateUserRequest {
  roleId: number;
  departmentId: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?: string;
  phoneNumber?: string | null;
  status: UserStatus;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string | null;
  status?: UserStatus;
  roleId?: number;
  departmentId?: number;
}
