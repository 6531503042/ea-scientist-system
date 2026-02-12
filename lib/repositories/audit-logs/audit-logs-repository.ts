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

        // Run without transaction to avoid pool exhaustion and timeouts in Docker
        const [data, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: { select: { roleName: true } },
                        },
                    },
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

    async getStats() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Run counts in parallel without transaction to avoid pool exhaustion and timeouts
        const [totalLogs, thisMonthLogs, activeUsers, loginCount, exportCount, importCount] =
            await Promise.all([
                prisma.auditLog.count(),
                prisma.auditLog.count({
                    where: { createdAt: { gte: startOfMonth } },
                }),
                prisma.user.count({ where: { isActive: true } }),
                prisma.auditLog.count({ where: { action: 'LOGIN' } }),
                prisma.auditLog.count({ where: { action: 'EXPORT' } }),
                prisma.auditLog.count({ where: { action: 'IMPORT' } }),
            ]);

        return {
            totalLogs,
            thisMonthLogs,
            activeUsers,
            loginCount,
            exportCount,
            importCount,
        };
    }
}
