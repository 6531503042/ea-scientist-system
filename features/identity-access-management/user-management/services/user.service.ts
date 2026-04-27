import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { BaseResponse } from "@/features/identity-access-management/types/access-control.types";
import type {
  UsersListPayload,
  UserItem,
  CreateUserRequest,
  UpdateUserRequest,
} from "../types/user-profile.types";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  role_id?: number;
  department_id?: number;
}

export const userService = {
  getUsers: async (params?: GetUsersParams) => {
    const response = await axiosInstance.get<BaseResponse<UsersListPayload>>(
      API_ENDPOINTS.users.list,
      { params },
    );
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await axiosInstance.get<BaseResponse<UserItem>>(
      API_ENDPOINTS.users.byId(id),
    );
    return response.data;
  },

  createUser: async (dto: CreateUserRequest) => {
    const response = await axiosInstance.post<BaseResponse<UserItem>>(
      API_ENDPOINTS.users.create,
      dto,
    );
    return response.data;
  },

  updateUser: async (id: number, dto: UpdateUserRequest) => {
    const response = await axiosInstance.patch<BaseResponse<UserItem>>(
      API_ENDPOINTS.users.update(id),
      dto,
    );
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await axiosInstance.delete<BaseResponse<{ id: number }>>(
      API_ENDPOINTS.users.delete(id),
    );
    return response.data;
  },
};
