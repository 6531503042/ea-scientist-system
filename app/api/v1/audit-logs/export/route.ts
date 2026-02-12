import { NextResponse } from "next/server";
import { AuditLogsRepository } from "@/lib/repositories/audit-logs/audit-logs-repository";

const auditLogsRepository = new AuditLogsRepository();

const actionLabels: Record<string, string> = {
    create: "สร้าง",
    read: "ดู",
    update: "แก้ไข",
    delete: "ลบ",
    login: "เข้าสู่ระบบ",
    logout: "ออกจากระบบ",
    export: "ส่งออก",
    import: "นำเข้า",
    view: "เข้าดู",
    relationship: "ความสัมพันธ์",
};

function escapeCsv(value: string): string {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const userId = searchParams.get("userId");
        const actionParam = searchParams.get("action");
        const entityType = searchParams.get("entityType");
        const tab = searchParams.get("tab");
        const limit = Math.min(5000, Math.max(1, Number(searchParams.get("limit") || "1000")));

        const where: Record<string, unknown> = {};
        if (userId) where.userId = Number(userId);
        if (entityType) where.entityType = entityType;

        if (tab === "login") {
            where.action = "LOGIN";
        } else if (tab === "export") {
            where.action = { in: ["EXPORT", "IMPORT"] };
        } else if (tab === "audit") {
            where.action = { notIn: ["LOGIN", "EXPORT", "IMPORT"] };
        } else if (actionParam) {
            const actions = actionParam.split(",").map((a) => a.trim().toUpperCase());
            where.action = actions.length === 1 ? actions[0] : { in: actions };
        }

        const { data } = await auditLogsRepository.findAll({
            where,
            skip: 0,
            take: limit,
        });

        const headers = [
            "ชื่อ",
            "E-mail",
            "การกระทำ",
            "ที่อยู่ IP",
            "เบราว์เซอร์/อุปกรณ์",
            "Session",
            "โมดูล",
            "รายละเอียด",
            "วันที่และเวลา",
        ];

        const rows = data.map((log) => {
            const userName = log.user
                ? `${log.user.firstName} ${log.user.lastName}`
                : "System";
            const userEmail = log.user?.email ?? "-";
            const actionLabel =
                actionLabels[log.action?.toLowerCase()] ?? log.action ?? "-";
            const ipAddress = log.ipAddress ?? "-";
            const userAgent = log.userAgent ?? "-";
            const sessionId = log.requestId ?? "-";
            const module = log.entityType ?? "-";
            const description = log.summary ?? log.action ?? "-";
            const dateTime = log.createdAt
                ? new Date(log.createdAt).toLocaleString("th-TH", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                  })
                : "-";

            return [
                escapeCsv(userName),
                escapeCsv(userEmail),
                escapeCsv(actionLabel),
                escapeCsv(ipAddress),
                escapeCsv(userAgent),
                escapeCsv(sessionId),
                escapeCsv(module),
                escapeCsv(description),
                escapeCsv(dateTime),
            ].join(",");
        });

        const csv = [headers.join(","), ...rows].join("\n");
        const bom = "\uFEFF";

        return new Response(bom + csv, {
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="audit-logs-${new Date().toISOString().slice(0, 10)}.csv"`,
            },
        });
    } catch (error) {
        console.error("Error exporting audit logs:", error);
        return NextResponse.json(
            { success: false, error: "Failed to export audit logs" },
            { status: 500 }
        );
    }
}
