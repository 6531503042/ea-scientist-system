import { prisma } from "@/lib/db/prisma";
import type { CreateArtefactCategoryInput, UpdateArtefactCategoryInput } from "@/lib/validators/artefact-types-validator";
import { NotFoundError } from "@/lib/utils/api-error";

export class CategoriesService {
    async getAll(layerId?: number | null) {
        return prisma.artefactCategory.findMany({
            where: {
                isActive: true,
                ...(layerId ? { architectureLayerId: layerId } : {}),
            },
            include: {
                architectureLayer: { select: { id: true, layerName: true } },
            },
            orderBy: { id: "asc" },
        });
    }

    async create(data: CreateArtefactCategoryInput) {
        return prisma.artefactCategory.create({
            data: {
                architectureLayerId: data.architectureLayerId,
                categoryName: data.categoryName,
                description: data.description ?? undefined,
                isActive: data.isActive ?? true,
            },
            include: {
                architectureLayer: { select: { id: true, layerName: true } },
            },
        });
    }
    async update(id: number, data: UpdateArtefactCategoryInput) {
        // Option to verify existence:
        // const existing = await prisma.artefactCategory.findUnique({ where: { id } });
        // if (!existing) throw new NotFoundError("Category not found");

        try {
            return await prisma.artefactCategory.update({
                where: { id },
                data: {
                    ...(data.architectureLayerId && { architectureLayerId: data.architectureLayerId }),
                    ...(data.categoryName && { categoryName: data.categoryName }),
                    ...(data.description !== undefined && { description: data.description }),
                    ...(data.isActive !== undefined && { isActive: data.isActive }),
                },
                include: {
                    architectureLayer: { select: { id: true, layerName: true } },
                },
            });
        } catch (error) {
            throw new NotFoundError("Category not found");
        }
    }

    async delete(id: number) {
        try {
            await prisma.artefactCategory.update({
                where: { id },
                data: { isActive: false },
            });
            return true;
        } catch (error) {
            throw new NotFoundError("Category not found");
        }
    }
}
