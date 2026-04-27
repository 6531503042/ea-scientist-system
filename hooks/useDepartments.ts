"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import type { Department } from "@/types/department";
import { queryKeys } from "@/lib/query-keys";
import { mapApiDepartment } from "@/lib/api-adapters/iam";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export function useDepartments() {
  const queryClient = useQueryClient();

  const {
    data: departments = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery<Department[]>({
    queryKey: queryKeys.departments.all,
    queryFn: async () => {
      const resp = await axiosInstance.get(API_ENDPOINTS.departments.list);
      // Departments endpoint returns: { success, data: [...] } (flat array, not paginated)
      const items: any[] = resp.data?.data ?? [];
      return items.map(mapApiDepartment);
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { code: string; name: string }) => {
      const dto = {
        shortName: data.code,
        fullName: data.name,
        isActive: true,
      };
      const resp = await axiosInstance.post(API_ENDPOINTS.departments.create, dto);
      return mapApiDepartment(resp.data?.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { code?: string; name?: string } }) => {
      const dto: Record<string, unknown> = {};
      if (data.code) dto.shortName = data.code;
      if (data.name) dto.fullName = data.name;
      await axiosInstance.put(API_ENDPOINTS.departments.update(Number(id)), dto);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(API_ENDPOINTS.departments.delete(Number(id)));
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
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
    departments,
    loading,
    error,
    fetchDepartments: refetch,
    createDepartment: createMutation.mutateAsync,
    updateDepartment: (id: string, data: { code?: string; name?: string }) =>
      updateMutation.mutateAsync({ id, data }),
    deleteDepartment: deleteMutation.mutateAsync,
  };
}
