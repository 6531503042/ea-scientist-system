import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Repository for User data access
 */
export class UsersRepository {
    async findAll(where?: Prisma.UserWhereInput) {
        return prisma.user.findMany({
            where: { isActive: true, ...where },
            include: {
                role: { select: { id: true, roleName: true } },
                department: { select: { id: true, shortName: true, fullName: true } },
            },
            orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
        });
    }

    async findById(id: number) {
        return prisma.user.findUnique({
            where: { id },
            include: {
                role: { select: { id: true, roleName: true } },
                department: { select: { id: true, shortName: true, fullName: true } },
            },
        });
    }

    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: {
                role: {
                    select: {
                        id: true,
                        roleName: true,
                        description: true,
                        rolePermissions: {
                            include: { permission: { select: { name: true } } },
                        },
                    },
                },
                department: { select: { id: true, shortName: true, fullName: true } },
            },
        });
    }

    async findByUsername(username: string) {
        return prisma.user.findUnique({ where: { username } });
    }

    async create(data: Prisma.UserCreateInput) {
        return prisma.user.create({
            data,
            include: {
                role: { select: { id: true, roleName: true } },
                department: { select: { id: true, shortName: true, fullName: true } },
            },
        });
    }

    async update(id: number, data: Prisma.UserUpdateInput) {
        return prisma.user.update({
            where: { id },
            data,
            include: {
                role: { select: { id: true, roleName: true } },
                department: { select: { id: true, shortName: true, fullName: true } },
            },
        });
    }

    async delete(id: number) {
        return prisma.user.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async count(where?: Prisma.UserWhereInput) {
        return prisma.user.count({ where: { isActive: true, ...where } });
    }
}
