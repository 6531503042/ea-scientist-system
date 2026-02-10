'use client';

import { useState, useCallback, useEffect } from 'react';
import type { AuditLog, AuditLogFilter } from '@/types/audit';

function transformApiLog(apiLog: any): AuditLog {
    return {
        _id: apiLog.id.toString(),
        timestamp: apiLog.createdAt,
        userId: apiLog.userId?.toString(),
        userName: apiLog.user ? `${apiLog.user.firstName} ${apiLog.user.lastName}` : 'System',
        userRole: apiLog.user?.role?.roleName || 'unknown',
        action: apiLog.action?.toLowerCase(), // LOGIN / EXPORT / IMPORT
        module: apiLog.entityType || 'system',
        description: apiLog.summary || apiLog.action,
        ipAddress: apiLog.ipAddress || '-',
        severity: 'info', // Mock severity for now as schema doesn't have it
        resourceType: apiLog.entityType,
        resourceId: apiLog.entityId?.toString(),
        resourceName: apiLog.entityLabel,
    };
}

export function useAudit() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
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

    const updateFilter = useCallback((newFilter: AuditLogFilter) => {
        setFilter(newFilter);
    }, []);

    const clearFilter = useCallback(() => {
        setFilter({});
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return {
        logs,
        loading,
        error,
        filter,
        fetchLogs,
        updateFilter,
        clearFilter,
    };
}
