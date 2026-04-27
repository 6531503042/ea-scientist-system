import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AccessControlMeData,
  PermissionMap,
  User,
} from "@/features/auth/types/auth.types";
import { buildPermissionMapFromTokens } from "@/features/auth/utils/permission-parser";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  permissions: PermissionMap;
  isAuthenticated: boolean;

  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setAccessControl: (accessControl: AccessControlMeData) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      permissions: {},
      isAuthenticated: false,

      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      setAccessToken: (accessToken) => set({ accessToken }),

      setUser: (user) => set({ user }),

      setAccessControl: (accessControl) =>
        set({
          permissions: buildPermissionMapFromTokens(accessControl.permissions),
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          permissions: {},
          isAuthenticated: false,
        }),
    }),
    { name: "auth-storage" },
  ),
);
