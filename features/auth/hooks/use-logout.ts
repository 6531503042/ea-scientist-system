"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/store/use-auth-store";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  return async () => {
    try {
      await authService.logout();
    } catch {
      // Still clear local session even if revoke request fails.
    } finally {
      logout();
      document.cookie = "session=; Path=/; Max-Age=0; SameSite=Lax";
      queryClient.clear();
      toast.success("ออกจากระบบเรียบร้อยแล้ว");
      router.push("/login");
    }
  };
}
