import { NextResponse } from "next/server";
import { AuditLogsRepository } from "@/lib/repositories/audit-logs/audit-logs-repository";
import { z } from "zod";

const auditLogsRepository = new AuditLogsRepository();

const createAuditLogSchema = z.object({
    userId: z.number(),
    action: z.string(),
    summary: z.string().optional(),
    entityType: z.string().optional(),
    entityId: z.number().optional(),
    entityLabel: z.string().optional(),
    requestId: z.string().optional(),
});

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

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = createAuditLogSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: "Invalid input", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const logData = result.data;

        // In a real scenario, we would get user info from the session
        // For now, we trust the client to send the userId (since this is internal tool context)
        // or getting it from headers if available.

        // Get IP and User Agent
        const forwarded = request.headers.get("x-forwarded-for");
        const ipAddress = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
        const userAgent = request.headers.get("user-agent") || undefined;

        const requestId = crypto.randomUUID();
        await auditLogsRepository.create({
            user: { connect: { id: logData.userId } },
            action: logData.action,
            summary: logData.summary,
            entityType: logData.entityType,
            entityId: logData.entityId,
            entityLabel: logData.entityLabel,
            ipAddress,
            userAgent: userAgent ? (userAgent.length > 1000 ? userAgent.substring(0, 1000) : userAgent) : undefined,
            requestId: logData.requestId ?? requestId,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error creating audit log:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create audit log" },
            { status: 500 }
        );
    }
}
