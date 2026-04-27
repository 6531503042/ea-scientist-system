"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import type { User } from "@/types/user";
import type { CreateUserInput, UpdateUserInput } from "@/lib/validators/users-validator";
import { queryKeys } from "@/lib/query-keys";
import { mapApiUser } from "@/lib/api-adapters/iam";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export function useUsers() {
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery<User[]>({
    queryKey: queryKeys.users.all,
    queryFn: async () => {
      const resp = await axiosInstance.get(API_ENDPOINTS.users.list, {
        params: { limit: 100 },
      });
      // API wraps in BaseResponse: resp.data = { success, data: { data: [...], page, ... } }
      const items: any[] = resp.data?.data?.data ?? [];
      return items.map(mapApiUser);
    },
    staleTime: 2 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (userData: CreateUserInput) => {
      const dto = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        username: userData.username,
        password: userData.password,
        role_id: userData.roleId,
        department_id: userData.departmentId ?? undefined,
        status: "active",
      };
      const resp = await axiosInstance.post(API_ENDPOINTS.users.create, dto);
      return mapApiUser(resp.data?.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: UpdateUserInput }) => {
      const dto: Record<string, unknown> = {};
      if (userData.firstName !== undefined) dto.first_name = userData.firstName;
      if (userData.lastName !== undefined) dto.last_name = userData.lastName;
      if (userData.email !== undefined) dto.email = userData.email;
      if (userData.username !== undefined) dto.username = userData.username;
      if (userData.password) dto.password = userData.password;
      if (userData.roleId !== undefined) dto.role_id = userData.roleId;
      if (userData.departmentId !== undefined) dto.department_id = userData.departmentId;
      if (userData.isActive !== undefined) dto.status = userData.isActive ? "active" : "inactive";

      await axiosInstance.patch(API_ENDPOINTS.users.update(Number(id)), dto);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(API_ENDPOINTS.users.delete(Number(id)));
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  const deleteMultipleMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(
        ids.map((id) => axiosInstance.delete(API_ENDPOINTS.users.delete(Number(id)))),
      );
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  const error =
    queryError?.message ||
    createMutation.error?.message ||
    updateMutation.error?.message ||
    deleteMutation.error?.message ||
    deleteMultipleMutation.error?.message ||
    null;

  const loading =
    isLoading ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    deleteMultipleMutation.isPending;

  return {
    users,
    loading,
    error,
    fetchUsers: refetch,
    createUser: createMutation.mutateAsync,
    updateUser: (id: string, userData: UpdateUserInput) =>
      updateMutation.mutateAsync({ id, userData }),
    deleteUser: deleteMutation.mutateAsync,
    deleteMultiple: deleteMultipleMutation.mutateAsync,
  };
}
