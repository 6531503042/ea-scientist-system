import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  BaseResponse,
  CreateRoleRequest,
  PermissionCatalogPayload,
  PreviewPermissionTokensRequest,
  PreviewPermissionTokensResult,
  ReplacePermissionTokensResult,
  RoleItem,
  RolePermissionTokensPayload,
  RolesListPayload,
  UpdateRoleRequest,
  UpdateRoleStatusRequest,
} from "@/features/identity-access-management/types/access-control.types";

type RoleListParams = {
  page?: number;
  limit?: number;
  isActive?: boolean;
};

export const accessControlService = {
  async getRoles(
    params?: RoleListParams,
  ): Promise<BaseResponse<RolesListPayload>> {
    const { data } = await axiosInstance.get<BaseResponse<RolesListPayload>>(
      API_ENDPOINTS.accessControl.roles,
      { params },
    );
    return data;
  },

  async createRole(dto: CreateRoleRequest): Promise<BaseResponse<RoleItem>> {
    const { data } = await axiosInstance.post<BaseResponse<RoleItem>>(
      API_ENDPOINTS.accessControl.roles,
      dto,
    );
    return data;
  },

  async updateRole(
    id: number,
    dto: UpdateRoleRequest,
  ): Promise<BaseResponse<RoleItem>> {
    const { data } = await axiosInstance.patch<BaseResponse<RoleItem>>(
      API_ENDPOINTS.accessControl.roleById(id),
      dto,
    );
    return data;
  },

  async updateRoleStatus(
    id: number,
    dto: UpdateRoleStatusRequest,
  ): Promise<BaseResponse<RoleItem>> {
    const { data } = await axiosInstance.patch<BaseResponse<RoleItem>>(
      API_ENDPOINTS.accessControl.roleStatus(id),
      dto,
    );
    return data;
  },

  async deleteRole(id: number): Promise<BaseResponse<{ success: boolean }>> {
    const { data } = await axiosInstance.delete<
      BaseResponse<{ success: boolean }>
    >(API_ENDPOINTS.accessControl.roleById(id));
    return data;
  },

  async getRolePermissionTokens(
    roleId: number,
  ): Promise<BaseResponse<RolePermissionTokensPayload>> {
    const { data } = await axiosInstance.get<
      BaseResponse<RolePermissionTokensPayload>
    >(API_ENDPOINTS.accessControl.rolePermissionTokens(roleId));
    return data;
  },

  async replaceRolePermissionTokens(
    roleId: number,
    permissions: string[],
  ): Promise<BaseResponse<ReplacePermissionTokensResult>> {
    const { data } = await axiosInstance.put<
      BaseResponse<ReplacePermissionTokensResult>
    >(API_ENDPOINTS.accessControl.rolePermissionTokens(roleId), {
      mode: "replace" as const,
      permissions,
    });
    return data;
  },

  async previewRolePermissionTokens(
    roleId: number,
    permissions: string[],
  ): Promise<BaseResponse<PreviewPermissionTokensResult>> {
    const payload: PreviewPermissionTokensRequest = { permissions };
    const { data } = await axiosInstance.post<
      BaseResponse<PreviewPermissionTokensResult>
    >(API_ENDPOINTS.accessControl.rolePermissionTokensPreview(roleId), payload);
    return data;
  },

  async getPermissionCatalog(): Promise<
    BaseResponse<PermissionCatalogPayload>
  > {
    const { data } = await axiosInstance.get<
      BaseResponse<PermissionCatalogPayload>
    >(API_ENDPOINTS.accessControl.permissionCatalog);
    return data;
  },
};
