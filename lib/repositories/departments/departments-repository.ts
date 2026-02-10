import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Repository for Department data access
 */
export class DepartmentsRepository {
    async findAll(where?: Prisma.DepartmentWhereInput) {
        return prisma.department.findMany({
            where: { isActive: true, ...where },
            include: {
                parent: { select: { id: true, shortName: true, fullName: true } },
                _count: { select: { users: true, children: true } },
            },
            orderBy: { fullName: "asc" },
        });
    }

    async findById(id: number) {
        return prisma.department.findUnique({
            where: { id },
            include: {
                parent: { select: { id: true, shortName: true, fullName: true } },
                children: { select: { id: true, shortName: true, fullName: true } },
                _count: { select: { users: true, children: true } },
            },
        });
    }

    async findHierarchy() {
        return prisma.department.findMany({
            where: { isActive: true, parentId: null },
            include: {
                children: {
                    where: { isActive: true },
                    include: {
                        children: { where: { isActive: true } },
                        _count: { select: { users: true } },
                    },
                },
                _count: { select: { users: true } },
            },
            orderBy: { fullName: "asc" },
        });
    }

    async create(data: Prisma.DepartmentCreateInput) {
        return prisma.department.create({ data });
    }

    async update(id: number, data: Prisma.DepartmentUpdateInput) {
        return prisma.department.update({ where: { id }, data });
    }

    async delete(id: number) {
        return prisma.department.update({
            where: { id },
            data: { isActive: false },
        });
    }
}
