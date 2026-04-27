"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/store/use-auth-store";
import type {
  ApiErrorResponse,
  LoginRequest,
} from "@/features/auth/types/auth.types";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setAccessControl = useAuthStore((s) => s.setAccessControl);

  return useMutation({
    mutationFn: (dto: LoginRequest) => authService.login(dto),
    onSuccess: async (res) => {
      const { access_token, user } = res.data;
      setAuth(user, access_token);
      const accessControl = await authService.getAccessControl();
      setAccessControl(accessControl.data);
      document.cookie = "session=1; Path=/; SameSite=Lax";
      toast.success(`ยินดีต้อนรับ ${user.first_name}`);
      router.push("/");
    },
    onError: (error) => {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const message = error.response?.data?.message;
        toast.error(message || "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่");
        return;
      }
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    },
  });
}
