import { z } from "zod";

const LocalizedNameSchema = z.object({
  en: z.string().min(1, "กรุณากรอกภาษาอังกฤษ"),
  th: z.string().min(1, "กรุณากรอกภาษาไทย"),
});

// ============================================================
// Architecture Layer
// ============================================================

export const CreateArchitectureLayerSchema = z.object({
  layerName: LocalizedNameSchema,
  description: LocalizedNameSchema.optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const UpdateArchitectureLayerSchema = z.object({
  layerName: LocalizedNameSchema.optional(),
  description: LocalizedNameSchema.optional().nullable(),
  isActive: z.boolean().optional(),
});

export const ArchitectureLayerIdSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

// ============================================================
// Artefact Category
// ============================================================

export const CreateArtefactCategorySchema = z.object({
  architectureLayerId: z.number().int().positive("กรุณาเลือก Layer"),
  categoryName: LocalizedNameSchema,
  description: LocalizedNameSchema.optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const UpdateArtefactCategorySchema = z.object({
  architectureLayerId: z.number().int().positive().optional(),
  categoryName: LocalizedNameSchema.optional(),
  description: LocalizedNameSchema.optional().nullable(),
  isActive: z.boolean().optional(),
});

export const ArtefactCategoryIdSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

export type CreateArchitectureLayerInput = z.infer<typeof CreateArchitectureLayerSchema>;
export type UpdateArchitectureLayerInput = z.infer<typeof UpdateArchitectureLayerSchema>;
export type CreateArtefactCategoryInput = z.infer<typeof CreateArtefactCategorySchema>;
export type UpdateArtefactCategoryInput = z.infer<typeof UpdateArtefactCategorySchema>;
