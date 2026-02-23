import { z } from "zod";

// ============================================================
// Auth Validators
// ============================================================

/**
 * Login validation schema
 */
export const loginSchema = z.object({
    email: z
        .string({ message: "กรุณากรอกอีเมล" })
        .min(1, "กรุณากรอกอีเมล")
        .email("รูปแบบอีเมลไม่ถูกต้อง")
        .max(255, "อีเมลยาวเกินไป")
        .transform((v) => v.trim().toLowerCase()),
    password: z
        .string({ message: "กรุณากรอกรหัสผ่าน" })
        .min(1, "กรุณากรอกรหัสผ่าน")
        .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
        .max(128, "รหัสผ่านยาวเกินไป"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Change password validation schema
 */
export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "กรุณากรอกรหัสผ่านปัจจุบัน"),
        newPassword: z
            .string()
            .min(8, "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร")
            .max(128, "รหัสผ่านยาวเกินไป"),
        confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่านใหม่"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "รหัสผ่านไม่ตรงกัน",
        path: ["confirmPassword"],
    });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/**
 * Reset password validation schema (admin action)
 */
export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร")
            .max(128, "รหัสผ่านยาวเกินไป"),
        confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่านใหม่"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "รหัสผ่านไม่ตรงกัน",
        path: ["confirmPassword"],
    });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
