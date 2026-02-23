import { z } from "zod";

// ============================================================
// Role Validators
// ============================================================

export const CreateRoleSchema = z.object({
    roleName: z
        .string({ message: "กรุณากรอกชื่อบทบาท" })
        .min(1, "ชื่อบทบาทต้องไม่เป็นค่าว่าง")
        .max(255, "ชื่อบทบาทต้องไม่เกิน 255 ตัวอักษร"),
    description: z.string().max(1000).optional().nullable(),
    isActive: z.boolean().optional().default(true),
    permissionIds: z.array(z.number().int().positive()).optional().default([]),
});

export const UpdateRoleSchema = z.object({
    roleName: z.string().min(1).max(255).optional(),
    description: z.string().max(1000).optional().nullable(),
    isActive: z.boolean().optional(),
    permissionIds: z.array(z.number().int().positive()).optional(),
});

export const RoleIdSchema = z.object({
    id: z
        .string()
        .regex(/^\d+$/, "ID ต้องเป็นตัวเลข")
        .transform(Number),
});

export type CreateRoleInput = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleInput = z.infer<typeof UpdateRoleSchema>;
export type RoleIdInput = z.infer<typeof RoleIdSchema>;
