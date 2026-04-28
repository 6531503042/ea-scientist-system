export interface BaseResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RoleItem {
  id: number;
  name: string;
  roleKey: string;
  description: string | null;
  level: number;
  isActive: boolean;
  updatedAt?: string;
  _count?: {
    users?: number;
    rolePermissions?: number;
  };
}

export interface RolesListPayload {
  data: RoleItem[];
  pagination: Pagination;
}

export interface CreateRoleRequest {
  name: string;
  roleKey: string;
  description?: string;
  level: number;
  isActive?: boolean;
}

export interface UpdateRoleRequest {
  name?: string;
  roleKey?: string;
  description?: string;
  level?: number;
  isActive?: boolean;
}

export interface UpdateRoleStatusRequest {
  isActive: boolean;
}

export interface RolePermissionTokensPayload {
  role: {
    id: number;
    name: string;
    roleKey: string;
    level: number;
  };
  permissions: string[];
  policyVersion: string;
  generatedAt: string;
}

export interface ReplacePermissionTokensRequest {
  mode: "replace";
  permissions: string[];
}

export interface ReplacePermissionTokensResult {
  savedCount: number;
  removedCount: number;
  permissions: string[];
  invalidPermissions: string[];
}

export interface PreviewPermissionTokensRequest {
  permissions: string[];
}

export interface PreviewPermissionTokensResult {
  valid: string[];
  invalid: string[];
}

export interface PermissionCatalogPayload {
  permissionKeys: string[];
  actionKeys: string[];
  permissions: string[];
  policyVersion: string;
  generatedAt: string;
}
