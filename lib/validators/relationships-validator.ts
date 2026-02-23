import { z } from "zod";

// ============================================================
// Relationship Validators
// ============================================================

const OptionalLocalizedStringSchema = z
    .object({
        th: z.string().optional(),
        en: z.string().optional(),
    })
    .optional()
    .nullable();

export const CreateRelationshipSchema = z.object({
    sourceArtefactId: z
        .number({ message: "กรุณาเลือก Artefact ต้นทาง" })
        .int()
        .positive(),
    targetArtefactId: z
        .number({ message: "กรุณาเลือก Artefact ปลายทาง" })
        .int()
        .positive(),
    relationshipTypeId: z.number().int().positive().optional().nullable(),
    description: OptionalLocalizedStringSchema,
});

export const UpdateRelationshipSchema = z.object({
    sourceArtefactId: z.number().int().positive().optional(),
    targetArtefactId: z.number().int().positive().optional(),
    relationshipTypeId: z.number().int().positive().optional().nullable(),
    description: OptionalLocalizedStringSchema,
});

export const RelationshipIdSchema = z.object({
    id: z
        .string()
        .regex(/^\d+$/, "ID ต้องเป็นตัวเลข")
        .transform(Number),
});

export type CreateRelationshipInput = z.infer<typeof CreateRelationshipSchema>;
export type UpdateRelationshipInput = z.infer<typeof UpdateRelationshipSchema>;
export type RelationshipIdInput = z.infer<typeof RelationshipIdSchema>;
