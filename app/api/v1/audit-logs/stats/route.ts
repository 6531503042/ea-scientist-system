import { NextResponse } from "next/server";
import { AuditLogsService } from "@/lib/services/audit-logs/audit-logs-service";
import { apiHandler } from "@/lib/utils/api-handler";

const auditLogsService = new AuditLogsService();

export const GET = apiHandler(async () => {
    const statsData = await auditLogsService.getStats();

    return NextResponse.json({
        success: true,
        data: statsData
    });
});

