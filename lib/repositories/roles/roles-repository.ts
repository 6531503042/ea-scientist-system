import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Repository for Role data access
 */
export class RolesRepository {
    async findAll(where?: Prisma.RoleWhereInput) {
        return prisma.role.findMany({
            where: { isActive: true, ...where },
            include: {
                _count: { select: { users: true } },
                rolePermissions: {
                    include: { permission: { select: { id: true, name: true } } },
                },
            },
            orderBy: { roleName: "asc" },
        });
    }

    async findById(id: number) {
        return prisma.role.findUnique({
            where: { id },
            include: {
                _count: { select: { users: true } },
                rolePermissions: {
                    include: { permission: { select: { id: true, name: true } } },
                },
            },
        });
    }

    async findByName(roleName: string) {
        return prisma.role.findUnique({ where: { roleName } });
    }

    async create(data: Prisma.RoleCreateInput) {
        return prisma.role.create({ data });
    }

    async update(id: number, data: Prisma.RoleUpdateInput) {
        return prisma.role.update({ where: { id }, data });
    }

    async delete(id: number) {
        return prisma.role.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async setPermissions(roleId: number, permissionIds: number[]) {
        // Transaction: delete existing, then create new
        return prisma.$transaction([
            prisma.rolePermission.deleteMany({ where: { roleId } }),
            ...permissionIds.map((permissionId) =>
                prisma.rolePermission.create({
                    data: { roleId, permissionId },
                })
            ),
        ]);
    }
}
