"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types/user";
import type {
  CreateUserInput,
  UpdateUserInput,
} from "@/lib/validators/users-validator";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { mapApiUser } from "@/lib/api-adapters/iam";

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
      const data = await apiClient.get<any[]>("/api/v1/users");
      return data.map(mapApiUser);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (userData: CreateUserInput) => {
      const responseData = await apiClient.post<any>("/api/v1/users", userData);
      return mapApiUser(responseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: UpdateUserInput;
    }) => {
      await apiClient.put(`/api/v1/users/${id}`, userData);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/v1/users/${id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  const deleteMultipleMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(
        ids.map((id) => apiClient.delete(`/api/v1/users/${id}`)),
      );
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  // Derived error state combining query and mutation errors
  const error =
    queryError?.message ||
    createMutation.error?.message ||
    updateMutation.error?.message ||
    deleteMutation.error?.message ||
    deleteMultipleMutation.error?.message ||
    null;

  // Derived loading state
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
