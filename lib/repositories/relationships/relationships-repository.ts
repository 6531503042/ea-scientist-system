import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Repository for Relationship data access
 */
export class RelationshipsRepository {
    async findAll(where?: Prisma.RelationshipWhereInput) {
        return prisma.relationship.findMany({
            where,
            include: {
                sourceArtefact: { select: { id: true, artefactName: true, categoryId: true } },
                targetArtefact: { select: { id: true, artefactName: true, categoryId: true } },
                relationshipType: { select: { id: true, relationshipName: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async findById(id: number) {
        return prisma.relationship.findUnique({
            where: { id },
            include: {
                sourceArtefact: true,
                targetArtefact: true,
                relationshipType: true,
            },
        });
    }

    async findByArtefact(artefactId: number) {
        return prisma.relationship.findMany({
            where: {
                OR: [{ sourceArtefactId: artefactId }, { targetArtefactId: artefactId }],
            },
            include: {
                sourceArtefact: { select: { id: true, artefactName: true } },
                targetArtefact: { select: { id: true, artefactName: true } },
                relationshipType: true,
            },
        });
    }

    async create(data: Prisma.RelationshipCreateInput) {
        return prisma.relationship.create({
            data,
            include: {
                sourceArtefact: { select: { id: true, artefactName: true } },
                targetArtefact: { select: { id: true, artefactName: true } },
                relationshipType: true,
            },
        });
    }

    async update(id: number, data: Prisma.RelationshipUpdateInput) {
        return prisma.relationship.update({
            where: { id },
            data,
            include: {
                sourceArtefact: { select: { id: true, artefactName: true } },
                targetArtefact: { select: { id: true, artefactName: true } },
                relationshipType: true,
            },
        });
    }

    async delete(id: number) {
        return prisma.relationship.delete({ where: { id } });
    }
}
