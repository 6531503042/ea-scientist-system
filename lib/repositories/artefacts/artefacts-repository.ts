import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Repository for Artefact data access
 */
export class ArtefactsRepository {
    async findAll(where?: Prisma.ArtefactWhereInput) {
        return prisma.artefact.findMany({
            where: { lifecycleStatus: "ACTIVE", ...where },
            include: {
                architectureLayer: { select: { id: true, layerName: true } },
                category: { select: { id: true, categoryName: true } },
                ownerDepartment: { select: { id: true, shortName: true, fullName: true } },
                responsibleBy: { select: { id: true, firstName: true, lastName: true } },
                _count: {
                    select: {
                        sourceRelationships: true,
                        targetRelationships: true,
                        artefactAttributes: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async findById(id: number) {
        return prisma.artefact.findUnique({
            where: { id },
            include: {
                architectureLayer: true,
                category: {
                    include: {
                        attributeDefinitions: {
                            where: { isActive: true },
                            orderBy: { sortOrder: "asc" },
                        },
                    },
                },
                ownerDepartment: true,
                responsibleBy: { select: { id: true, firstName: true, lastName: true, email: true } },
                artefactAttributes: {
                    include: { attributeDefinition: true },
                },
                artefactVersions: { orderBy: { versionNumber: "desc" }, take: 5 },
                sourceRelationships: {
                    include: {
                        targetArtefact: { select: { id: true, artefactName: true } },
                        relationshipType: true,
                    },
                },
                targetRelationships: {
                    include: {
                        sourceArtefact: { select: { id: true, artefactName: true } },
                        relationshipType: true,
                    },
                },
            },
        });
    }

    async findByLayer(architectureLayerId: number) {
        return this.findAll({ architectureLayerId });
    }

    async findByCategory(categoryId: number) {
        return this.findAll({ categoryId });
    }

    async create(data: Prisma.ArtefactCreateInput) {
        return prisma.artefact.create({
            data,
            include: {
                architectureLayer: { select: { id: true, layerName: true } },
                category: { select: { id: true, categoryName: true } },
            },
        });
    }

    async update(id: number, data: Prisma.ArtefactUpdateInput) {
        return prisma.artefact.update({
            where: { id },
            data,
            include: {
                architectureLayer: { select: { id: true, layerName: true } },
                category: { select: { id: true, categoryName: true } },
            },
        });
    }

    async delete(id: number) {
        return prisma.artefact.update({
            where: { id },
            data: { lifecycleStatus: "RETIRED" },
        });
    }

    async upsertAttributes(
        artefactId: number,
        attributes: { attributeDefinitionId: number; value: any }[]
    ) {
        return prisma.$transaction(
            attributes.map((attr) =>
                prisma.artefactAttribute.upsert({
                    where: {
                        artefactId_attributeDefinitionId: {
                            artefactId,
                            attributeDefinitionId: attr.attributeDefinitionId,
                        },
                    },
                    update: { value: attr.value },
                    create: {
                        artefactId,
                        attributeDefinitionId: attr.attributeDefinitionId,
                        value: attr.value,
                    },
                })
            )
        );
    }

    async createVersion(
        artefactId: number,
        versionNumber: number,
        changeSummary: any,
        snapshot: any
    ) {
        return prisma.artefactVersion.create({
            data: { artefactId, versionNumber, changeSummary, snapshot },
        });
    }
}
