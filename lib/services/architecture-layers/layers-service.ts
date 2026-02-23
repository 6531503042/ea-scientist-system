import { prisma } from "@/lib/db/prisma";
import type {
    CreateArchitectureLayerInput,
    UpdateArchitectureLayerInput
} from "@/lib/validators/artefact-types-validator";
import { NotFoundError } from "@/lib/utils/api-error";

export class ArchitectureLayersService {
    async getAll() {
        return prisma.architectureLayer.findMany({
            where: { isActive: true },
            include: {
                artefactCategories: {
                    where: { isActive: true },
                    select: { id: true, categoryName: true, architectureLayerId: true },
                    orderBy: { id: "asc" },
                },
            },
            orderBy: { id: "asc" },
        });
    }

    async create(data: CreateArchitectureLayerInput) {
        return prisma.architectureLayer.create({
            data: {
                layerName: data.layerName,
                description: data.description ?? undefined,
                isActive: data.isActive ?? true,
            },
        });
    }

    async update(id: number, data: UpdateArchitectureLayerInput) {
        try {
            return await prisma.architectureLayer.update({
                where: { id },
                data: {
                    ...(data.layerName && { layerName: data.layerName }),
                    ...(data.description !== undefined && { description: data.description }),
                    ...(data.isActive !== undefined && { isActive: data.isActive }),
                },
            });
        } catch (error) {
            throw new NotFoundError("Architecture layer not found");
        }
    }

    async delete(id: number) {
        try {
            await prisma.architectureLayer.update({
                where: { id },
                data: { isActive: false },
            });
            return true;
        } catch (error) {
            throw new NotFoundError("Architecture layer not found");
        }
    }
}
