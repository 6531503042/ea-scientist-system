import { Pagination } from "@/features/identity-access-management/types/access-control.types";
import { UserStatus, Role, Department } from "@/features/auth/types/auth.types";

export type { UserStatus, Role as RoleLite, Department as DepartmentLite };

export interface UserItem {
  id: number;
  role_id: number;
  department_id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone_number?: string | null;
  status: UserStatus;
  created_at?: string;
  updated_at?: string;
  role?: Role;
  department?: Department;
}

export interface UsersListPayload {
  data: UserItem[];
  pagination: Pagination;
}

export interface CreateUserRequest {
  role_id: number;
  department_id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password?: string;
  phone_number?: string | null;
  status: UserStatus;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  phone_number?: string | null;
  status?: UserStatus;
  role_id?: number;
  department_id?: number;
}
