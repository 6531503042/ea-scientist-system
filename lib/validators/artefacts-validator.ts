import { z } from "zod";

// ============================================================
// Localization helper
// ============================================================

const LocalizedStringSchema = z.object({
  th: z.string().min(1, "กรุณากรอกข้อมูลภาษาไทย"),
  en: z.string().min(1, "กรุณากรอกข้อมูลภาษาอังกฤษ"),
});

const OptionalLocalizedStringSchema = z
  .object({
    th: z.string().optional(),
    en: z.string().optional(),
  })
  .optional()
  .nullable();

// ============================================================
// Artefact Validators
// ============================================================

export const CreateArtefactSchema = z.object({
  architectureLayerId: z.number().int().positive().optional().nullable(),
  categoryId: z.number({ message: "กรุณาเลือกหมวดหมู่" }).int().positive(),
  ownerDepartmentId: z.number().int().positive().optional().nullable(),
  responsibleById: z.number().int().positive().optional().nullable(),
  artefactName: LocalizedStringSchema,
  description: OptionalLocalizedStringSchema,
  lifecycleStatus: z
    .enum(["ACTIVE", "INACTIVE", "RETIRED"])
    .optional()
    .default("ACTIVE"),
  attributes: z
    .array(
      z.object({
        attributeDefinitionId: z.number().int().positive(),
        value: z.any(),
      }),
    )
    .optional()
    .default([]),
});

export const UpdateArtefactSchema = z.object({
  architectureLayerId: z.number().int().positive().optional().nullable(),
  categoryId: z.number().int().positive().optional(),
  ownerDepartmentId: z.number().int().positive().optional().nullable(),
  responsibleById: z.number().int().positive().optional().nullable(),
  artefactName: LocalizedStringSchema.optional(),
  description: OptionalLocalizedStringSchema,
  lifecycleStatus: z.enum(["ACTIVE", "INACTIVE", "RETIRED"]).optional(),
  attributes: z
    .array(
      z.object({
        attributeDefinitionId: z.number().int().positive(),
        value: z.any(),
      }),
    )
    .optional(),
});

export const ArtefactIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID ต้องเป็นตัวเลข").transform(Number),
});

export type CreateArtefactInput = z.infer<typeof CreateArtefactSchema>;
export type UpdateArtefactInput = z.infer<typeof UpdateArtefactSchema>;
export type ArtefactIdInput = z.infer<typeof ArtefactIdSchema>;
