"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "@/types/department";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { mapApiDepartment } from "@/lib/api-adapters/iam";

export function useDepartments() {
  const queryClient = useQueryClient();

  // Fetch Departments
  const {
    data: departments = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery<Department[]>({
    queryKey: queryKeys.departments.all,
    queryFn: async () => {
      const data = await apiClient.get<any[]>("/api/v1/departments");
      return data.map(mapApiDepartment);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Create Department
  const createMutation = useMutation({
    mutationFn: async (data: CreateDepartmentInput) => {
      const parentValue =
        typeof data.parent === "string" ? data.parent : undefined;
      const apiData = {
        shortName: data.code,
        fullName: data.name,
        parentId: parentValue ? parseInt(parentValue) : undefined,
      };

      const responseData = await apiClient.post<any>(
        "/api/v1/departments",
        apiData,
      );
      return mapApiDepartment(responseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
    },
  });

  // Update Department
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateDepartmentInput;
    }) => {
      const apiData: any = {};
      if (data.code) apiData.shortName = data.code;
      if (data.name) apiData.fullName = data.name;

      await apiClient.put(`/api/v1/departments/${id}`, apiData);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
    },
  });

  // Delete Department
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/v1/departments/${id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
    },
  });

  // Derived error state combining query and mutation errors
  const error =
    queryError?.message ||
    createMutation.error?.message ||
    updateMutation.error?.message ||
    deleteMutation.error?.message ||
    null;

  // Derived loading state
  const loading =
    isLoading ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return {
    departments,
    loading,
    error,
    fetchDepartments: refetch, // Backwards compatibility for existing components
    createDepartment: createMutation.mutateAsync,
    updateDepartment: (id: string, data: UpdateDepartmentInput) =>
      updateMutation.mutateAsync({ id, data }),
    deleteDepartment: deleteMutation.mutateAsync,
  };
}
