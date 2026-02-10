'use client';

import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    ChevronDown,
    Clock,
    User,
    Activity,
    AlertCircle,
    Info,
    AlertTriangle,
} from 'lucide-react';
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
}

export function AuditLogTable({
    logs,
    searchQuery,
    onSearchChange,
    loading,
}: AuditLogTableProps) {
    const filteredLogs = logs.filter(log =>
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.module.toLowerCase().includes(searchQuery.toLowerCase())
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
                <button className="flex items-center gap-2 px-4 h-11 bg-muted hover:bg-muted/80 rounded-xl transition-colors">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">กรองข้อมูล</span>
                    <ChevronDown className="w-4 h-4" />
                </button>
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">เวลา</th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ผู้ใช้</th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">การกระทำ</th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">โมดูล</th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">รายละเอียด</th>
                                    <th className="text-center px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ระดับ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log, index) => {
                                    const SeverityIcon = severityIcons[log.severity];
                                    const actionLabel = actionLabels[log.action];

                                    return (
                                        <motion.tr
                                            key={log._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.02 }}
                                            className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(log.timestamp).toLocaleString('th-TH', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{log.userName}</p>
                                                        <p className="text-xs text-muted-foreground">{log.userRole || '-'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={cn("text-sm font-medium", actionLabel.color)}>
                                                    {actionLabel.label}
                                                </span>
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
                                            <td className="px-5 py-4 text-center">
                                                <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded", severityColors[log.severity])}>
                                                    <SeverityIcon className="w-4 h-4" />
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
