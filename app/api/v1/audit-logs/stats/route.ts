import { NextResponse } from "next/server";
import { AuditLogsRepository } from "@/lib/repositories/audit-logs/audit-logs-repository";

const auditLogsRepository = new AuditLogsRepository();

export async function GET() {
    try {
        const stats = await auditLogsRepository.getStats();

        // Calculate usage stats for the chart
        // We can group export/import together if needed, or keep separate
        // The mock used: Login, Export/Import, Audit Trail (Others)
        const totalKnown = stats.loginCount + stats.exportCount + stats.importCount;
        const auditTrailCount = Math.max(0, stats.totalLogs - totalKnown);

        const usage = [
            {
                category: 'User/Login',
                count: stats.loginCount,
                percentage: stats.totalLogs ? Math.round((stats.loginCount / stats.totalLogs) * 100) : 0,
                color: 'hsl(199, 89%, 48%)',
            },
            {
                category: 'Export / Import',
                count: stats.exportCount + stats.importCount,
                percentage: stats.totalLogs ? Math.round(((stats.exportCount + stats.importCount) / stats.totalLogs) * 100) : 0,
                color: 'hsl(168, 76%, 42%)',
            },
            {
                category: 'Audit trail อื่น ๆ',
                count: auditTrailCount,
                percentage: stats.totalLogs ? Math.max(0, 100 - Math.round(((stats.loginCount + stats.exportCount + stats.importCount) / stats.totalLogs) * 100)) : 0,
                color: 'hsl(38, 92%, 50%)',
            },
        ];

        return NextResponse.json({
            success: true,
            data: {
                total: stats.totalLogs,
                thisMonth: stats.thisMonthLogs,
                activeUsers: stats.activeUsers,
                usage, // Pre-calculated for frontend convenience
                raw: stats // Send raw stats too just in case
            }
        });
    } catch (error) {
        console.error("Error fetching audit stats:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch audit stats" },
            { status: 500 }
        );
    }
}
