'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WifiDevice, WifiAuthLog, WifiAuthFilter, WifiAuthStatus } from '@/types';

// Mock WiFi data
const mockWifiDevices: WifiDevice[] = [
    {
        _id: 'wifi_1',
        macAddress: 'AA:BB:CC:DD:EE:01',
        deviceName: 'MacBook Pro - สมชาย',
        deviceType: 'computer',
        userId: 'user_1',
        userName: 'สมชาย ใจดี',
        ipAddress: '192.168.1.100',
        status: 'connected',
        lastSeen: '2026-02-05T16:00:00+07:00',
        connectedAt: '2026-02-05T08:00:00+07:00',
        bandwidth: 150,
        ssid: 'DSS-STAFF',
    },
    {
        _id: 'wifi_2',
        macAddress: 'AA:BB:CC:DD:EE:02',
        deviceName: 'iPhone 15 - สมหญิง',
        deviceType: 'mobile',
        userId: 'user_2',
        userName: 'สมหญิง รักษ์งาน',
        ipAddress: '192.168.1.101',
        status: 'connected',
        lastSeen: '2026-02-05T15:55:00+07:00',
        connectedAt: '2026-02-05T09:30:00+07:00',
        bandwidth: 75,
        ssid: 'DSS-STAFF',
    },
    {
        _id: 'wifi_3',
        macAddress: 'AA:BB:CC:DD:EE:03',
        deviceName: 'Unknown Device',
        deviceType: 'other',
        ipAddress: '192.168.1.102',
        status: 'pending',
        lastSeen: '2026-02-05T15:30:00+07:00',
        ssid: 'DSS-GUEST',
    },
    {
        _id: 'wifi_4',
        macAddress: 'AA:BB:CC:DD:EE:04',
        deviceName: 'IoT Sensor - ห้องประชุม 1',
        deviceType: 'iot',
        ipAddress: '192.168.1.200',
        status: 'connected',
        lastSeen: '2026-02-05T16:00:00+07:00',
        connectedAt: '2026-02-01T00:00:00+07:00',
        bandwidth: 5,
        ssid: 'DSS-IOT',
    },
    {
        _id: 'wifi_5',
        macAddress: 'AA:BB:CC:DD:EE:05',
        deviceName: 'Blocked Device',
        deviceType: 'computer',
        ipAddress: '192.168.1.250',
        status: 'blocked',
        lastSeen: '2026-02-04T10:00:00+07:00',
        ssid: 'DSS-STAFF',
    },
];

export function useWifi() {
    const [devices, setDevices] = useState<WifiDevice[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<WifiAuthFilter>({});

    const fetchDevices = useCallback(async (filterParams?: WifiAuthFilter) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 300));

            let filteredDevices = [...mockWifiDevices];
            const activeFilter = filterParams || filter;

            if (activeFilter.status) {
                filteredDevices = filteredDevices.filter(d => d.status === activeFilter.status);
            }
            if (activeFilter.deviceType) {
                filteredDevices = filteredDevices.filter(d => d.deviceType === activeFilter.deviceType);
            }
            if (activeFilter.userId) {
                filteredDevices = filteredDevices.filter(d => d.userId === activeFilter.userId);
            }

            setDevices(filteredDevices);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch devices.');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    const blockDevice = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            setDevices(prev => prev.map(d =>
                d._id === id ? { ...d, status: 'blocked' as WifiAuthStatus } : d
            ));
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to block device.');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const unblockDevice = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            setDevices(prev => prev.map(d =>
                d._id === id ? { ...d, status: 'disconnected' as WifiAuthStatus } : d
            ));
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to unblock device.');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const authorizeDevice = useCallback(async (id: string, userId?: string) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            setDevices(prev => prev.map(d =>
                d._id === id ? {
                    ...d,
                    status: 'connected' as WifiAuthStatus,
                    userId: userId,
                    connectedAt: new Date().toISOString(),
                } : d
            ));
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to authorize device.');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateFilter = useCallback((newFilter: WifiAuthFilter) => {
        setFilter(newFilter);
    }, []);

    const clearFilter = useCallback(() => {
        setFilter({});
    }, []);

    // Stats
    const stats = {
        total: devices.length,
        connected: devices.filter(d => d.status === 'connected').length,
        pending: devices.filter(d => d.status === 'pending').length,
        blocked: devices.filter(d => d.status === 'blocked').length,
    };

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    return {
        devices,
        loading,
        error,
        filter,
        stats,
        fetchDevices,
        blockDevice,
        unblockDevice,
        authorizeDevice,
        updateFilter,
        clearFilter,
    };
}
