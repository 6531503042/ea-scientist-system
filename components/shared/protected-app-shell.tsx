"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBootstrapAuth } from "@/features/auth/hooks/use-bootstrap-auth";
import { useAuthStore } from "@/store/use-auth-store";

/**
 * Wraps protected app pages.
 * - Calls useBootstrapAuth() to refresh user + permissions on mount.
 * - Shows a loading spinner while bootstrapping.
 * - Redirects to /login when not authenticated.
 * - Does NOT render its own sidebar/navbar; the (app) layout handles that.
 */
export function ProtectedAppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { isBootstrapping } = useBootstrapAuth();

  useEffect(() => {
    if (!isBootstrapping && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isBootstrapping, router]);

  if (!isAuthenticated || isBootstrapping) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm">กำลังโหลด...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
