import { NextResponse } from "next/server";
import { AuditLogsRepository } from "@/lib/repositories/audit-logs/audit-logs-repository";

const auditLogsRepository = new AuditLogsRepository();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const page = Math.max(1, Number(searchParams.get("page") || "1"));
        const pageSize = Math.min(
            100,
            Math.max(1, Number(searchParams.get("pageSize") || "50"))
        );
        const userId = searchParams.get("userId");
        const action = searchParams.get("action");
        const entityType = searchParams.get("entityType");
        const entityId = searchParams.get("entityId");

        const where: Record<string, unknown> = {};
        if (userId) where.userId = Number(userId);
        if (action) where.action = action;
        if (entityType) where.entityType = entityType;
        if (entityId) where.entityId = Number(entityId);

        const { data, total } = await auditLogsRepository.findAll({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return NextResponse.json({
            success: true,
            data,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch audit logs" },
            { status: 500 }
        );
    }
}
