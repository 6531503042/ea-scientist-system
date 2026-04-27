"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { canAccessMenuByPermissions } from "@/features/auth/utils/permission-check";
import type { MenuKey } from "@/lib/navigation/types";

interface UseRoutePermissionOptions {
  menuKey: MenuKey;
  requiredAction?: string;
}

export function useRoutePermission({
  menuKey,
  requiredAction,
}: UseRoutePermissionOptions) {
  const permissions = useAuthStore((s) => s.permissions);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const bypassAccessControl =
    process.env.NEXT_PUBLIC_BYPASS_ACCESS_CONTROL === "true";

  const canAccess = useMemo(() => {
    if (!isAuthenticated) return false;
    if (bypassAccessControl) return true;
    return canAccessMenuByPermissions(permissions, menuKey, requiredAction);
  }, [
    bypassAccessControl,
    isAuthenticated,
    menuKey,
    permissions,
    requiredAction,
  ]);

  return { canAccess, isAuthenticated };
}
