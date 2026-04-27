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
  role_key: string;
  description: string | null;
  level: number;
  is_active: boolean;
  updated_at?: string;
  _count?: {
    users?: number;
    role_permissions?: number;
  };
}

export interface RolesListPayload {
  data: RoleItem[];
  pagination: Pagination;
}

export interface CreateRoleRequest {
  name: string;
  role_key: string;
  description?: string;
  level: number;
  is_active?: boolean;
}

export interface UpdateRoleRequest {
  name?: string;
  role_key?: string;
  description?: string;
  level?: number;
  is_active?: boolean;
}

export interface UpdateRoleStatusRequest {
  is_active: boolean;
}

export interface RolePermissionTokensPayload {
  role: {
    id: number;
    name: string;
    role_key: string;
    level: number;
  };
  permissions: string[];
  policy_version: string;
  generated_at: string;
}

export interface ReplacePermissionTokensRequest {
  mode: "replace";
  permissions: string[];
}

export interface ReplacePermissionTokensResult {
  saved_count: number;
  removed_count: number;
  permissions: string[];
  invalid_permissions: string[];
}

export interface PreviewPermissionTokensRequest {
  permissions: string[];
}

export interface PreviewPermissionTokensResult {
  valid: string[];
  invalid: string[];
}

export interface PermissionCatalogPayload {
  permission_keys: string[];
  action_keys: string[];
  permissions: string[];
  policy_version: string;
  generated_at: string;
}
