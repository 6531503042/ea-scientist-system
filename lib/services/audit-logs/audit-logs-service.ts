import { AuditLogsRepository } from "@/lib/repositories/audit-logs/audit-logs-repository";

export class AuditLogsService {
    private repository: AuditLogsRepository;

    constructor() {
        this.repository = new AuditLogsRepository();
    }

    async getStats() {
        const stats = await this.repository.getStats();

        // The mock used: Login, Export/Import, Audit Trail (Others)
        const totalKnown = stats.loginCount + stats.exportCount + stats.importCount;
        const auditTrailCount = Math.max(0, stats.totalLogs - totalKnown);

        const loginPct = stats.totalLogs ? Math.round((stats.loginCount / stats.totalLogs) * 100) : 0;
        const exportImportPct = stats.totalLogs ? Math.round(((stats.exportCount + stats.importCount) / stats.totalLogs) * 100) : 0;
        const othersPct = stats.totalLogs ? Math.max(0, 100 - (loginPct + exportImportPct)) : 0;

        const usage = [
            {
                category: 'User/Login',
                count: stats.loginCount,
                percentage: loginPct,
                color: 'hsl(199, 89%, 48%)',
            },
            {
                category: 'Export / Import',
                count: stats.exportCount + stats.importCount,
                percentage: exportImportPct,
                color: 'hsl(168, 76%, 42%)',
            },
            {
                category: 'Audit trail อื่น ๆ',
                count: auditTrailCount,
                percentage: othersPct,
                color: 'hsl(38, 92%, 50%)',
            },
        ];

        return {
            total: stats.totalLogs,
            thisMonth: stats.thisMonthLogs,
            activeUsers: stats.activeUsers,
            usage, // Pre-calculated for frontend convenience
            raw: stats // Send raw stats too just in case
        };
    }
}

