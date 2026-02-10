import { z } from "zod";

// ============================================================
// Department Validators
// ============================================================

export const CreateDepartmentSchema = z.object({
    shortName: z
        .string({ required_error: "กรุณากรอกชื่อย่อหน่วยงาน" })
        .min(1, "ชื่อต้องไม่เป็นค่าว่าง")
        .max(255, "ชื่อต้องไม่เกิน 255 ตัวอักษร"),
    fullName: z
        .string({ required_error: "กรุณากรอกชื่อเต็มหน่วยงาน" })
        .min(1, "ชื่อต้องไม่เป็นค่าว่าง")
        .max(255, "ชื่อต้องไม่เกิน 255 ตัวอักษร"),
    parentId: z.number().int().positive().optional().nullable(),
    isActive: z.boolean().optional().default(true),
});

export const UpdateDepartmentSchema = z.object({
    shortName: z.string().min(1).max(255).optional(),
    fullName: z.string().min(1).max(255).optional(),
    parentId: z.number().int().positive().optional().nullable(),
    isActive: z.boolean().optional(),
});

export const DepartmentIdSchema = z.object({
    id: z
        .string()
        .regex(/^\d+$/, "ID ต้องเป็นตัวเลข")
        .transform(Number),
});

export type CreateDepartmentInput = z.infer<typeof CreateDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof UpdateDepartmentSchema>;
export type DepartmentIdInput = z.infer<typeof DepartmentIdSchema>;
