'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AuditLog, AuditLogFilter } from '@/types/audit';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

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
    const [filter, setFilter] = useState<AuditLogFilter>({});

    const { data: logs = [], isLoading: isLoadingLogs, error: logsError, refetch: fetchLogs } = useQuery<AuditLog[]>({
        queryKey: queryKeys.audit.all(filter),
        queryFn: async () => {
            const query = new URLSearchParams();
            if (filter.userId) query.append('userId', filter.userId);
            if (filter.action) query.append('action', filter.action);
            if (filter.module) query.append('entityType', filter.module);

            const data = await apiClient.get<any[]>(`/api/v1/audit-logs?${query.toString()}`);
            return data.map((apiLog: any) => transformApiLog(apiLog));
        }
    });

    const { data: stats = null, isLoading: isLoadingStats, error: statsError, refetch: fetchStats } = useQuery<AuditStats>({
        queryKey: queryKeys.audit.stats,
        queryFn: async () => {
            const data = await apiClient.get<AuditStats>('/api/v1/audit-logs/stats');
            return data || null;
        },
        staleTime: 5 * 60 * 1000 // Stats don't usually require ultra real-time reactivity without manual refresh
    });

    const updateFilter = (newFilter: AuditLogFilter) => {
        setFilter(newFilter);
    };

    const clearFilter = () => {
        setFilter({});
    };

    // Derived error and loading state
    const error = logsError?.message || statsError?.message || null;
    const loading = isLoadingLogs || isLoadingStats;

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
