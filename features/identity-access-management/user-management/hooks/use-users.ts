import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, GetUsersParams } from "../services/user.service";
import type { CreateUserRequest, UpdateUserRequest } from "../types/user-profile.types";

export const USERS_QUERY_KEY = ["users"];

export function useGetUsers(params: GetUsersParams) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, params],
    queryFn: () => userService.getUsers(params),
  });
}

export function useGetUserById(id: number, enabled = true) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, id],
    queryFn: () => userService.getUserById(id),
    enabled,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateUserRequest) => userService.createUser(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateUserRequest }) =>
      userService.updateUser(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}
