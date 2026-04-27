/* ── Types matching API Prisma schema (snake_case contract) ── */

export type UserStatus = "active" | "suspended" | "inactive";

export interface Role {
  id: number;
  name: string;
  description: string | null;
  role_key: string;
  level: number;
  is_active: boolean;
}

export interface Department {
  id: number;
  name: string;
}

export interface User {
  id: number;
  role_id: number;
  department_id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone_number: string | null;
  status: UserStatus;
  must_change_password: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  role?: Role;
  department?: Department;
}

/* ── Auth request / response DTOs ── */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

export interface LogoutResponse {
  revoked_count: number;
}

export type PermissionMap = Record<string, string[]>;

export interface AccessControlMeData {
  subject: {
    user_id: number;
    role_id: number;
    role_key: string;
    username: string;
  };
  effective_role_ids: number[];
  permissions: string[];
  policy_version?: string;
  generated_at?: string;
}

export type AccessControlMeResponse = ApiSuccessResponse<AccessControlMeData>;
export type LoginApiResponse = ApiSuccessResponse<LoginResponse>;
export type LogoutApiResponse = ApiSuccessResponse<LogoutResponse>;
export type UserProfileResponse = ApiSuccessResponse<User>;

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  messageList?: string[];
}
