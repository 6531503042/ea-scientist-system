'use client';

import { useMemo } from 'react';
import {
    Search,
    Filter,
    ChevronDown,
    Clock,
    User,
    Info,
    AlertTriangle,
    AlertCircle,
    Download,
} from 'lucide-react';
import { AuditLogTableSkeleton } from './AuditLogTableSkeleton';
import { cn } from '@/lib/utils';
import type { AuditLog, AuditAction, AuditSeverity } from '@/types/audit';

const actionLabels: Record<AuditAction, { label: string; color: string }> = {
    create: { label: 'สร้าง', color: 'text-success' },
    read: { label: 'ดู', color: 'text-info' },
    update: { label: 'แก้ไข', color: 'text-warning' },
    delete: { label: 'ลบ', color: 'text-destructive' },
    login: { label: 'เข้าสู่ระบบ', color: 'text-primary' },
    logout: { label: 'ออกจากระบบ', color: 'text-muted-foreground' },
    export: { label: 'ส่งออก', color: 'text-info' },
    import: { label: 'นำเข้า', color: 'text-info' },
    view: { label: 'เข้าดู', color: 'text-info' },
    relationship: { label: 'ความสัมพันธ์', color: 'text-primary' },
};

const severityIcons: Record<AuditSeverity, React.ElementType> = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    critical: AlertCircle,
};

const severityColors: Record<AuditSeverity, string> = {
    info: 'text-info',
    warning: 'text-warning',
    error: 'text-destructive',
    critical: 'text-destructive bg-destructive/10',
};

interface AuditLogTableProps {
    logs: AuditLog[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    loading?: boolean;
    activeTab?: 'login' | 'export' | 'audit';
}

export function AuditLogTable({
    logs,
    searchQuery,
    onSearchChange,
    loading,
    activeTab = 'login',
}: AuditLogTableProps) {
    const handleExport = () => {
        const url = new URL('/api/v1/audit-logs/export', window.location.origin);
        url.searchParams.set('tab', activeTab);
        url.searchParams.set('limit', '5000');
        window.open(url.toString(), '_blank');
    };
    const q = searchQuery.toLowerCase();
    const filteredLogs = useMemo(
        () =>
            logs.filter(
                (log) =>
                    log.description.toLowerCase().includes(q) ||
                    log.userName.toLowerCase().includes(q) ||
                    log.module.toLowerCase().includes(q) ||
                    (log.userEmail ?? '').toLowerCase().includes(q) ||
                    (log.ipAddress ?? '').toLowerCase().includes(q) ||
                    (log.userAgent ?? '').toLowerCase().includes(q) ||
                    (log.sessionId ?? '').toLowerCase().includes(q)
            ),
        [logs, q]
    );

    return (
        <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="ค้นหาบันทึก..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-11 pl-11 pr-4 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 h-11 bg-success/10 hover:bg-success/20 text-success rounded-xl transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">ส่งออก CSV</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 h-11 bg-muted hover:bg-muted/80 rounded-xl transition-colors">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm">กรองข้อมูล</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <AuditLogTableSkeleton />
            ) : (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ชื่อ</th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">E-mail</th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">การกระทำ</th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ที่อยู่ IP</th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">เบราว์เซอร์/อุปกรณ์</th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Session</th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">โมดูล</th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">รายละเอียด</th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">วันที่และเวลา</th>
                                    <th className="text-center px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ระดับ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan={10} className="px-5 py-12 text-center text-muted-foreground">
                                          <p className="text-sm">ไม่พบข้อมูล</p>
                                          <p className="text-xs mt-1">ลองเปลี่ยน tab หรือคำค้นหา</p>
                                        </td>
                                    </tr>
                                ) : (
                                filteredLogs.map((log) => {
                                    const SeverityIcon = severityIcons[log.severity];
                                    const actionLabel = actionLabels[log.action] ?? {
                                        label: log.action,
                                        color: 'text-muted-foreground',
                                    };

                                    return (
                                        <tr
                                            key={log._id}
                                            className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary flex-shrink-0">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <p className="text-sm font-medium">{log.userName}</p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-sm text-muted-foreground">{log.userEmail || '-'}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={cn("text-sm font-medium", actionLabel.color)}>
                                                    {actionLabel.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-sm text-muted-foreground font-mono">{log.ipAddress || '-'}</p>
                                            </td>
                                            <td className="px-5 py-4 max-w-[200px]">
                                                <p className="text-xs text-muted-foreground truncate" title={log.userAgent || undefined}>
                                                    {log.userAgent ? (log.userAgent.length > 60 ? `${log.userAgent.slice(0, 60)}...` : log.userAgent) : '-'}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-xs text-muted-foreground font-mono truncate max-w-[100px]" title={log.sessionId || undefined}>
                                                    {log.sessionId ? (log.sessionId.length > 12 ? `${log.sessionId.slice(0, 12)}...` : log.sessionId) : '-'}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="px-2.5 py-1 text-xs font-medium bg-muted rounded-md text-muted-foreground">
                                                    {log.module}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-sm text-foreground max-w-xs truncate">{log.description}</p>
                                                {log.resourceName && (
                                                    <p className="text-xs text-muted-foreground">{log.resourceName}</p>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="w-4 h-4 flex-shrink-0" />
                                                    {new Date(log.timestamp).toLocaleString('th-TH', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded", severityColors[log.severity])}>
                                                    <SeverityIcon className="w-4 h-4" />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                                )}
                            </tbody>
                        </table>
                    </div>
            </div>
            )}
        </>
    );
}
