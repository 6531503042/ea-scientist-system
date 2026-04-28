"use client";

import { createContext, useContext, type ReactNode } from "react";
import { authService } from "@/features/auth/services/auth.service";
import { clearClientAuthState } from "@/features/auth/utils/clear-client-auth";
import { useAuthStore } from "@/store/use-auth-store";

interface AuthContextType {
  user: any;
  role: string;
  login: (token: string, user: any) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Backward-compatibility wrapper.
 * Auth state now lives in Zustand (useAuthStore). This provider reads from
 * the store so that existing consumers of useAuth() continue to work unchanged.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const storeLogout = useAuthStore((s) => s.logout);

  // login is a no-op: the login page handles auth directly via authService + store
  const login = (_token: string, _newUser: any) => {};

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      /* still clear local session on failure */
    } finally {
      storeLogout();
      clearClientAuthState();
      if (typeof window !== "undefined") window.location.href = "/login";
    }
  };

  // Derive roleKey from user object returned by the new API
  const role: string =
    (user as any)?.role?.roleKey ?? (user as any)?.roleKey ?? "viewer";

  return (
    <AuthContext.Provider
      value={{ user, role, login, logout, isAuthenticated, loading: false }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
