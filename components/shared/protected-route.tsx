"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRoutePermission } from "@/features/auth/hooks/use-route-permission";
import type { MenuKey } from "@/lib/navigation/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  menuKey: MenuKey;
  requiredAction?: string;
  fallbackPath?: string;
}

/**
 * Page-level access guard.
 * Checks whether the authenticated user has the required permission
 * and redirects to fallbackPath if not.
 */
export function ProtectedRoute({
  children,
  menuKey,
  requiredAction = "read",
  fallbackPath = "/dashboard",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { canAccess, isAuthenticated } = useRoutePermission({
    menuKey,
    requiredAction,
  });

  useEffect(() => {
    if (isAuthenticated && !canAccess) {
      router.replace(fallbackPath);
    }
  }, [canAccess, fallbackPath, isAuthenticated, router]);

  if (!canAccess) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
