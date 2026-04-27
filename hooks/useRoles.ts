"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import type { Role } from "@/types/role";
import { queryKeys } from "@/lib/query-keys";
import { mapApiRole } from "@/lib/api-adapters/iam";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface CreateRolePayload {
  name: string;
  role_key: string;
  description?: string;
  level: number;
}

export interface UpdateRolePayload {
  name?: string;
  role_key?: string;
  description?: string;
  level?: number;
  is_active?: boolean;
}

export function useRoles() {
  const queryClient = useQueryClient();

  const {
    data: roles = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery<Role[]>({
    queryKey: queryKeys.roles.all,
    queryFn: async () => {
      const resp = await axiosInstance.get(API_ENDPOINTS.accessControl.roles, {
        params: { limit: 100 },
      });
      // API: resp.data = { success, data: { data: [...], pagination: {} } }
      const items: any[] = resp.data?.data?.data ?? [];
      return items.map(mapApiRole);
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: CreateRolePayload) => {
      const resp = await axiosInstance.post(API_ENDPOINTS.accessControl.roles, {
        name: payload.name,
        role_key: payload.role_key,
        description: payload.description || null,
        level: payload.level,
        is_active: true,
      });
      return mapApiRole(resp.data?.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, roleData }: { id: string; roleData: UpdateRolePayload }) => {
      const dto: Record<string, unknown> = {};
      if (roleData.name !== undefined) dto.name = roleData.name;
      if (roleData.role_key !== undefined) dto.role_key = roleData.role_key;
      if (roleData.description !== undefined) dto.description = roleData.description;
      if (roleData.level !== undefined) dto.level = roleData.level;
      if (roleData.is_active !== undefined) dto.is_active = roleData.is_active;

      await axiosInstance.patch(API_ENDPOINTS.accessControl.roleById(Number(id)), dto);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(API_ENDPOINTS.accessControl.roleById(Number(id)));
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all });
    },
  });

  const error =
    queryError?.message ||
    createMutation.error?.message ||
    updateMutation.error?.message ||
    deleteMutation.error?.message ||
    null;

  const loading =
    isLoading ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return {
    roles,
    loading,
    error,
    fetchRoles: refetch,
    createRole: createMutation.mutateAsync,
    updateRole: (id: string, roleData: UpdateRolePayload) =>
      updateMutation.mutateAsync({ id, roleData }),
    deleteRole: deleteMutation.mutateAsync,
  };
}
