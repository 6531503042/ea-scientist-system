'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AuditLog, AuditLogFilter } from '@/types/audit';

// Mock audit data
const mockAuditLogs: AuditLog[] = [
    {
        _id: 'log_1',
        timestamp: '2026-02-05T10:30:00+07:00',
        userId: 'user_1',
        userName: 'สมชาย ใจดี',
        userRole: 'admin',
        action: 'login',
        module: 'auth',
        description: 'เข้าสู่ระบบสำเร็จ',
        ipAddress: '192.168.1.100',
        severity: 'info',
    },
    {
        _id: 'log_2',
        timestamp: '2026-02-05T10:35:00+07:00',
        userId: 'user_1',
        userName: 'สมชาย ใจดี',
        userRole: 'admin',
        action: 'create',
        module: 'artefacts',
        resourceType: 'artefact',
        resourceId: 'art_1',
        resourceName: 'ระบบบริการประชาชน',
        description: 'สร้าง Artefact ใหม่: ระบบบริการประชาชน',
        ipAddress: '192.168.1.100',
        severity: 'info',
    },
    {
        _id: 'log_3',
        timestamp: '2026-02-05T11:00:00+07:00',
        userId: 'user_2',
        userName: 'สมหญิง รักษ์งาน',
        userRole: 'architect',
        action: 'update',
        module: 'artefacts',
        resourceType: 'artefact',
        resourceId: 'art_2',
        resourceName: 'ฐานข้อมูลกลาง',
        description: 'แก้ไข Artefact: ฐานข้อมูลกลาง',
        ipAddress: '192.168.1.101',
        severity: 'info',
    },
    {
        _id: 'log_4',
        timestamp: '2026-02-05T11:30:00+07:00',
        userId: 'user_3',
        userName: 'ผู้ใช้ทั่วไป',
        userRole: 'viewer',
        action: 'export',
        module: 'reports',
        description: 'ส่งออกรายงาน EA Dashboard',
        ipAddress: '192.168.1.102',
        severity: 'info',
    },
    {
        _id: 'log_5',
        timestamp: '2026-02-05T12:00:00+07:00',
        userId: 'user_1',
        userName: 'สมชาย ใจดี',
        userRole: 'admin',
        action: 'delete',
        module: 'users',
        resourceType: 'user',
        resourceId: 'user_old',
        resourceName: 'ผู้ใช้เก่า',
        description: 'ลบผู้ใช้งาน: ผู้ใช้เก่า',
        ipAddress: '192.168.1.100',
        severity: 'warning',
    },
];

export function useAudit() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<AuditLogFilter>({});

    const fetchLogs = useCallback(async (filterParams?: AuditLogFilter) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 300));

            let filteredLogs = [...mockAuditLogs];

            const activeFilter = filterParams || filter;

            if (activeFilter.userId) {
                filteredLogs = filteredLogs.filter(log => log.userId === activeFilter.userId);
            }
            if (activeFilter.action) {
                filteredLogs = filteredLogs.filter(log => log.action === activeFilter.action);
            }
            if (activeFilter.module) {
                filteredLogs = filteredLogs.filter(log => log.module === activeFilter.module);
            }
            if (activeFilter.severity) {
                filteredLogs = filteredLogs.filter(log => log.severity === activeFilter.severity);
            }

            setLogs(filteredLogs);
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
