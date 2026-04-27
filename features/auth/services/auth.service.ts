import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  AccessControlMeResponse,
  LoginApiResponse,
  LoginRequest,
  LogoutApiResponse,
  UserProfileResponse,
} from "@/features/auth/types/auth.types";

export const authService = {
  async login(dto: LoginRequest): Promise<LoginApiResponse> {
    const { data } = await axiosInstance.post<LoginApiResponse>(
      API_ENDPOINTS.auth.login,
      dto,
    );
    return data;
  },

  async logout(): Promise<LogoutApiResponse> {
    const { data } = await axiosInstance.post<LogoutApiResponse>(
      API_ENDPOINTS.auth.logout,
      {},
    );
    return data;
  },

  async getAccessControl(): Promise<AccessControlMeResponse> {
    const { data } = await axiosInstance.get<AccessControlMeResponse>(
      API_ENDPOINTS.accessControl.me,
    );
    return data;
  },

  async getUserProfile(): Promise<UserProfileResponse> {
    const { data } = await axiosInstance.get<UserProfileResponse>(
      API_ENDPOINTS.users.me,
    );
    return data;
  },
};
