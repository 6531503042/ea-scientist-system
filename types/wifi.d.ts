/**
 * WiFi Authentication Type Definitions
 */

export type WifiAuthStatus = 'connected' | 'disconnected' | 'pending' | 'blocked';

export type WifiDevice = {
    _id: string;
    macAddress: string;
    deviceName?: string;
    deviceType?: 'computer' | 'mobile' | 'tablet' | 'iot' | 'other';
    userId?: string;
    userName?: string;
    ipAddress?: string;
    status: WifiAuthStatus;
    lastSeen?: string;
    connectedAt?: string;
    disconnectedAt?: string;
    bandwidth?: number;
    ssid?: string;
};

export type WifiAuthLog = {
    _id: string;
    deviceId: string;
    userId?: string;
    action: 'connect' | 'disconnect' | 'block' | 'unblock';
    timestamp: string;
    ipAddress?: string;
    reason?: string;
};

export type WifiAuthFilter = {
    status?: WifiAuthStatus;
    deviceType?: WifiDevice['deviceType'];
    userId?: string;
    startDate?: string;
    endDate?: string;
};
