import { prisma } from "@/lib/db/prisma";
import { NotFoundError, BadRequestError } from "@/lib/utils/api-error";

interface CreateRelationshipTypeInput {
    relationshipKey: string;
    relationshipName: string;
    description?: string;
    allowedPairs?: any[];
}

interface UpdateRelationshipTypeInput {
    relationshipName?: string;
    description?: string;
    allowedPairs?: any[];
}

export class RelationshipTypesService {
    async getAll() {
        return prisma.relationshipType.findMany({
            where: { isActive: true },
            include: { _count: { select: { relationships: true } } },
            orderBy: { id: "asc" },
        });
    }

    async create(data: CreateRelationshipTypeInput) {
        if (!data.relationshipKey || !data.relationshipName) {
            throw new BadRequestError("relationshipKey and relationshipName are required");
        }

        return prisma.relationshipType.create({
            data: {
                relationshipKey: data.relationshipKey,
                relationshipName: data.relationshipName,
                description: data.description || null,
                allowedPairs: data.allowedPairs || [],
                isActive: true,
            },
        });
    }

    async update(id: number, data: UpdateRelationshipTypeInput) {
        try {
            return await prisma.relationshipType.update({
                where: { id },
                data: {
                    ...(data.relationshipName && { relationshipName: data.relationshipName }),
                    ...(data.description !== undefined && { description: data.description }),
                    ...(data.allowedPairs !== undefined && { allowedPairs: data.allowedPairs }),
                },
            });
        } catch (error) {
            throw new NotFoundError("Relationship type not found");
        }
    }

    async delete(id: number) {
        try {
            await prisma.relationshipType.update({
                where: { id },
                data: { isActive: false },
            });
            return true;
        } catch (error) {
            throw new NotFoundError("Relationship type not found");
        }
    }
}
