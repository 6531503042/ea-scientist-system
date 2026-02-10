import { ArtefactsRepository } from "@/lib/repositories/artefacts/artefacts-repository";
import type { CreateArtefactInput, UpdateArtefactInput } from "@/lib/validators/artefacts-validator";

/**
 * Service for Artefact business logic
 */
export class ArtefactsService {
    private repository: ArtefactsRepository;

    constructor() {
        this.repository = new ArtefactsRepository();
    }

    async getAll(filters?: {
        architectureLayerId?: number;
        categoryId?: number;
        lifecycleStatus?: string;
    }) {
        const where: Record<string, unknown> = {};

        if (filters?.architectureLayerId) {
            where.architectureLayerId = filters.architectureLayerId;
        }
        if (filters?.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters?.lifecycleStatus) {
            where.lifecycleStatus = filters.lifecycleStatus;
        }

        return this.repository.findAll(where);
    }

    async getById(id: number) {
        const artefact = await this.repository.findById(id);
        if (!artefact) throw new Error("ไม่พบ Artefact");
        return artefact;
    }

    async create(data: CreateArtefactInput) {
        const artefact = await this.repository.create({
            artefactName: data.artefactName,
            description: data.description || undefined,
            lifecycleStatus: data.lifecycleStatus,
            category: { connect: { id: data.categoryId } },
            ...(data.architectureLayerId && {
                architectureLayer: { connect: { id: data.architectureLayerId } },
            }),
            ...(data.ownerDepartmentId && {
                ownerDepartment: { connect: { id: data.ownerDepartmentId } },
            }),
            ...(data.responsibleById && {
                responsibleBy: { connect: { id: data.responsibleById } },
            }),
        });

        // Create attributes if provided
        if (data.attributes && data.attributes.length > 0) {
            const validAttrs = data.attributes.filter(
                (a): a is { attributeDefinitionId: number; value: any } =>
                    a.attributeDefinitionId !== undefined && a.value !== undefined
            );
            if (validAttrs.length > 0) {
                await this.repository.upsertAttributes(artefact.id, validAttrs);
            }
        }

        // Create initial version snapshot
        await this.repository.createVersion(
            artefact.id,
            1,
            { th: "สร้าง Artefact", en: "Created artefact" },
            artefact
        );

        return artefact;
    }

    async update(id: number, data: UpdateArtefactInput) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new Error("ไม่พบ Artefact");

        const newVersion = existing.version + 1;

        const artefact = await this.repository.update(id, {
            ...(data.artefactName && { artefactName: data.artefactName }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.lifecycleStatus && { lifecycleStatus: data.lifecycleStatus }),
            ...(data.categoryId && { category: { connect: { id: data.categoryId } } }),
            ...(data.architectureLayerId !== undefined && {
                architectureLayer: data.architectureLayerId
                    ? { connect: { id: data.architectureLayerId } }
                    : { disconnect: true },
            }),
            ...(data.ownerDepartmentId !== undefined && {
                ownerDepartment: data.ownerDepartmentId
                    ? { connect: { id: data.ownerDepartmentId } }
                    : { disconnect: true },
            }),
            ...(data.responsibleById !== undefined && {
                responsibleBy: data.responsibleById
                    ? { connect: { id: data.responsibleById } }
                    : { disconnect: true },
            }),
            version: newVersion,
        });

        // Update attributes if provided
        if (data.attributes && data.attributes.length > 0) {
            const validAttrs = data.attributes.filter(
                (a): a is { attributeDefinitionId: number; value: any } =>
                    a.attributeDefinitionId !== undefined && a.value !== undefined
            );
            if (validAttrs.length > 0) {
                await this.repository.upsertAttributes(id, validAttrs);
            }
        }

        // Create version snapshot
        await this.repository.createVersion(
            id,
            newVersion,
            { th: "อัปเดต Artefact", en: "Updated artefact" },
            artefact
        );

        return artefact;
    }

    async delete(id: number) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new Error("ไม่พบ Artefact");
        return this.repository.delete(id); // Soft-delete: sets RETIRED
    }
}
