'use client';

import { useState, useCallback, useEffect } from 'react';
import type { AuditLog, AuditLogFilter } from '@/types/audit';

function transformApiLog(apiLog: any): AuditLog {
    return {
        _id: apiLog.id.toString(),
        timestamp: apiLog.createdAt,
        userId: apiLog.userId?.toString(),
        userName: apiLog.user ? `${apiLog.user.firstName} ${apiLog.user.lastName}` : 'System',
        userEmail: apiLog.user?.email,
        userRole: apiLog.user?.role?.roleName ?? 'unknown',
        action: apiLog.action?.toLowerCase(),
        module: apiLog.entityType || 'system',
        description: apiLog.summary || apiLog.action,
        ipAddress: apiLog.ipAddress || '-',
        userAgent: apiLog.userAgent,
        sessionId: apiLog.requestId,
        severity: 'info',
        resourceType: apiLog.entityType,
        resourceId: apiLog.entityId?.toString(),
        resourceName: apiLog.entityLabel,
    };
}

export interface AuditStats {
    total: number;
    thisMonth: number;
    activeUsers: number;
    usage: {
        category: string;
        count: number;
        percentage: number;
        color: string;
    }[];
}

export function useAudit() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [stats, setStats] = useState<AuditStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<AuditLogFilter>({});

    const fetchLogs = useCallback(async (filterParams?: AuditLogFilter) => {
        setLoading(true);
        setError(null);
        try {
            const activeFilter = filterParams || filter;
            const query = new URLSearchParams();

            if (activeFilter.userId) query.append('userId', activeFilter.userId);
            if (activeFilter.action) query.append('action', activeFilter.action);
            if (activeFilter.module) query.append('entityType', activeFilter.module);

            const response = await fetch(`/api/v1/audit-logs?${query.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch audit logs');

            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                setLogs(result.data.map(transformApiLog));
            } else {
                setLogs([]);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch audit logs.');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch('/api/v1/audit-logs/stats');
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setStats(result.data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch audit stats:', error);
        }
    }, []);

    const updateFilter = useCallback((newFilter: AuditLogFilter) => {
        setFilter(newFilter);
    }, []);

    const clearFilter = useCallback(() => {
        setFilter({});
    }, []);

    useEffect(() => {
        fetchLogs();
        fetchStats();
    }, [fetchLogs, fetchStats]);

    return {
        logs,
        stats,
        loading,
        error,
        filter,
        fetchLogs,
        fetchStats,
        updateFilter,
        clearFilter,
    };
}
