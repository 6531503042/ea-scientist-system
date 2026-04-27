"use client";

import { useEffect, useState } from "react";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/store/use-auth-store";

/**
 * Runs once per mount of ProtectedAppShell.
 * If authenticated, refreshes user profile and access-control data from the API.
 * On failure (e.g. expired token), clears local session and lets ProtectedAppShell
 * redirect to /login.
 */
export function useBootstrapAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAccessControl = useAuthStore((s) => s.setAccessControl);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      if (!isAuthenticated) {
        if (mounted) setIsBootstrapping(false);
        return;
      }

      try {
        const [accessControlRes, profileRes] = await Promise.all([
          authService.getAccessControl(),
          authService.getUserProfile(),
        ]);

        if (!mounted) return;

        setAccessControl(accessControlRes.data);
        setUser(profileRes.data);
      } catch {
        if (!mounted) return;
        logout();
        document.cookie = "session=; Path=/; Max-Age=0; SameSite=Lax";
      } finally {
        if (mounted) setIsBootstrapping(false);
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return { isBootstrapping };
}
