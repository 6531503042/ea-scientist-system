import { z } from "zod";

// ============================================================
// User Validators
// ============================================================

export const CreateUserSchema = z.object({
    roleId: z.number({ required_error: "กรุณาเลือกบทบาท" }).int().positive(),
    departmentId: z.number().int().positive().optional().nullable(),
    firstName: z
        .string({ required_error: "กรุณากรอกชื่อ" })
        .min(1, "ชื่อต้องไม่เป็นค่าว่าง")
        .max(255, "ชื่อต้องไม่เกิน 255 ตัวอักษร"),
    lastName: z
        .string({ required_error: "กรุณากรอกนามสกุล" })
        .min(1, "นามสกุลต้องไม่เป็นค่าว่าง")
        .max(255, "นามสกุลต้องไม่เกิน 255 ตัวอักษร"),
    email: z
        .string({ required_error: "กรุณากรอกอีเมล" })
        .email("รูปแบบอีเมลไม่ถูกต้อง")
        .max(255, "อีเมลต้องไม่เกิน 255 ตัวอักษร")
        .transform((v) => v.trim().toLowerCase()),
    username: z
        .string({ required_error: "กรุณากรอก username" })
        .min(3, "Username ต้องมีอย่างน้อย 3 ตัวอักษร")
        .max(255, "Username ต้องไม่เกิน 255 ตัวอักษร"),
    password: z
        .string({ required_error: "กรุณากรอกรหัสผ่าน" })
        .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
        .max(128, "รหัสผ่านยาวเกินไป"),
});

export const UpdateUserSchema = z.object({
    roleId: z.number().int().positive().optional(),
    departmentId: z.number().int().positive().optional().nullable(),
    firstName: z.string().min(1).max(255).optional(),
    lastName: z.string().min(1).max(255).optional(),
    email: z
        .string()
        .email("รูปแบบอีเมลไม่ถูกต้อง")
        .max(255)
        .transform((v) => v.trim().toLowerCase())
        .optional(),
    username: z.string().min(3).max(255).optional(),
    isActive: z.boolean().optional(),
});

export const UserIdSchema = z.object({
    id: z
        .string()
        .regex(/^\d+$/, "ID ต้องเป็นตัวเลข")
        .transform(Number),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserIdInput = z.infer<typeof UserIdSchema>;
