import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Repository for AuditLog data access
 */
export class AuditLogsRepository {
    async findAll(options?: {
        where?: Prisma.AuditLogWhereInput;
        skip?: number;
        take?: number;
    }) {
        const { where, skip = 0, take = 50 } = options || {};

        const [data, total] = await prisma.$transaction([
            prisma.auditLog.findMany({
                where,
                include: {
                    user: { select: { id: true, firstName: true, lastName: true, email: true } },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            prisma.auditLog.count({ where }),
        ]);

        return { data, total };
    }

    async create(data: Prisma.AuditLogCreateInput) {
        return prisma.auditLog.create({ data });
    }

    async findByEntity(entityType: string, entityId: number) {
        return prisma.auditLog.findMany({
            where: { entityType, entityId },
            include: {
                user: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async findByUser(userId: number, take = 50) {
        return prisma.auditLog.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take,
        });
    }
}
