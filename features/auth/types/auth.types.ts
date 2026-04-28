/* ── Types matching API Prisma schema (camelCase contract) ── */

export type UserStatus = "active" | "suspended" | "inactive";

export interface Role {
  id: number;
  name: string;
  description: string | null;
  roleKey: string;
  level: number;
  isActive: boolean;
}

export interface Department {
  id: number;
  name: string;
}

export interface User {
  id: number;
  roleId: number;
  departmentId: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string | null;
  status: UserStatus;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
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
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface LogoutResponse {
  revokedCount: number;
}

export type PermissionMap = Record<string, string[]>;

export interface AccessControlMeData {
  subject: {
    userId: number;
    roleId: number;
    roleKey: string;
    username: string;
  };
  effectiveRoleIds: number[];
  permissions: string[];
  policyVersion?: string;
  generatedAt?: string;
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
