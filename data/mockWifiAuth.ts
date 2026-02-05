// Mock WiFi Authenticator Data - TOR Requirement #17 (ภาคผนวก จ)

export interface WifiDevice {
    id: string;
    macAddress: string;
    ipAddress: string;
    deviceType: 'smartphone' | 'tablet' | 'laptop' | 'desktop' | 'other';
    deviceName: string;
    userName: string;
    department: string;
    connectedAt: string;
    sessionDuration: number; // minutes
    dataUsage: number; // MB
    status: 'connected' | 'idle' | 'blocked';
}

export interface WifiSession {
    id: string;
    userId: string;
    userName: string;
    loginMethod: 'username' | 'ldap' | 'facebook' | 'line' | 'sms' | 'id_card';
    startTime: string;
    endTime: string | null;
    ipAddress: string;
    macAddress: string;
    dataDownload: number; // MB
    dataUpload: number; // MB
    status: 'active' | 'completed' | 'terminated';
}

export interface WifiStats {
    totalDevices: number;
    activeConnections: number;
    totalDataUsage: number; // GB
    peakHour: string;
    avgSessionDuration: number; // minutes
}

// Mock Connected Devices
export const wifiDevices: WifiDevice[] = [
    { id: 'd1', macAddress: 'AA:BB:CC:11:22:33', ipAddress: '192.168.10.101', deviceType: 'laptop', deviceName: 'MacBook Pro', userName: 'คุณประสิทธิ์ เทคโน', department: 'ศูนย์เทคโนโลยีสารสนเทศ', connectedAt: '2024-01-12 08:30', sessionDuration: 420, dataUsage: 1250, status: 'connected' },
    { id: 'd2', macAddress: 'AA:BB:CC:11:22:34', ipAddress: '192.168.10.102', deviceType: 'smartphone', deviceName: 'iPhone 15', userName: 'ดร.สมชาย วิทยาการ', department: 'กองตรวจวิเคราะห์', connectedAt: '2024-01-12 09:15', sessionDuration: 375, dataUsage: 450, status: 'connected' },
    { id: 'd3', macAddress: 'AA:BB:CC:11:22:35', ipAddress: '192.168.10.103', deviceType: 'tablet', deviceName: 'iPad Air', userName: 'คุณวิภา สุขใจ', department: 'ศูนย์วิทยาศาสตร์การแพทย์', connectedAt: '2024-01-12 10:00', sessionDuration: 330, dataUsage: 890, status: 'connected' },
    { id: 'd4', macAddress: 'AA:BB:CC:11:22:36', ipAddress: '192.168.10.104', deviceType: 'laptop', deviceName: 'Dell XPS', userName: 'คุณสุรีย์ ดิจิทัล', department: 'ศูนย์เทคโนโลยีสารสนเทศ', connectedAt: '2024-01-12 08:45', sessionDuration: 405, dataUsage: 2100, status: 'connected' },
    { id: 'd5', macAddress: 'AA:BB:CC:11:22:37', ipAddress: '192.168.10.105', deviceType: 'smartphone', deviceName: 'Samsung S24', userName: 'คุณเทพ โครงสร้าง', department: 'ศูนย์เทคโนโลยีสารสนเทศ', connectedAt: '2024-01-12 11:30', sessionDuration: 240, dataUsage: 320, status: 'idle' },
    { id: 'd6', macAddress: 'AA:BB:CC:11:22:38', ipAddress: '192.168.10.106', deviceType: 'laptop', deviceName: 'ThinkPad X1', userName: 'ผู้มาติดต่อ #1', department: 'บุคคลภายนอก', connectedAt: '2024-01-12 13:00', sessionDuration: 120, dataUsage: 180, status: 'connected' },
    { id: 'd7', macAddress: 'AA:BB:CC:11:22:39', ipAddress: '192.168.10.107', deviceType: 'other', deviceName: 'Unknown Device', userName: 'ผู้มาติดต่อ #2', department: 'บุคคลภายนอก', connectedAt: '2024-01-12 14:00', sessionDuration: 60, dataUsage: 50, status: 'blocked' },
];

// Mock Login Sessions
export const wifiSessions: WifiSession[] = [
    { id: 's1', userId: 'u1', userName: 'คุณประสิทธิ์ เทคโน', loginMethod: 'ldap', startTime: '2024-01-12 08:30:00', endTime: null, ipAddress: '192.168.10.101', macAddress: 'AA:BB:CC:11:22:33', dataDownload: 1100, dataUpload: 150, status: 'active' },
    { id: 's2', userId: 'u2', userName: 'ดร.สมชาย วิทยาการ', loginMethod: 'ldap', startTime: '2024-01-12 09:15:00', endTime: null, ipAddress: '192.168.10.102', macAddress: 'AA:BB:CC:11:22:34', dataDownload: 400, dataUpload: 50, status: 'active' },
    { id: 's3', userId: 'u3', userName: 'คุณวิภา สุขใจ', loginMethod: 'username', startTime: '2024-01-12 10:00:00', endTime: null, ipAddress: '192.168.10.103', macAddress: 'AA:BB:CC:11:22:35', dataDownload: 800, dataUpload: 90, status: 'active' },
    { id: 's4', userId: 'guest1', userName: 'ผู้มาติดต่อ #1', loginMethod: 'sms', startTime: '2024-01-12 13:00:00', endTime: null, ipAddress: '192.168.10.106', macAddress: 'AA:BB:CC:11:22:38', dataDownload: 150, dataUpload: 30, status: 'active' },
    { id: 's5', userId: 'u5', userName: 'คุณมานี รักงาน', loginMethod: 'line', startTime: '2024-01-12 07:00:00', endTime: '2024-01-12 12:30:00', ipAddress: '192.168.10.108', macAddress: 'AA:BB:CC:11:22:40', dataDownload: 500, dataUpload: 80, status: 'completed' },
    { id: 's6', userId: 'u6', userName: 'คุณสมหญิง ดีใจ', loginMethod: 'facebook', startTime: '2024-01-12 08:00:00', endTime: '2024-01-12 11:00:00', ipAddress: '192.168.10.109', macAddress: 'AA:BB:CC:11:22:41', dataDownload: 300, dataUpload: 40, status: 'completed' },
];

// Mock Stats
export const wifiStats: WifiStats = {
    totalDevices: 156,
    activeConnections: 42,
    totalDataUsage: 125.5, // GB
    peakHour: '10:00 - 11:00',
    avgSessionDuration: 245, // minutes
};

// WiFi Configuration Settings (Mock)
export interface WifiConfig {
    ssid: string;
    authMethods: string[];
    sessionTimeout: number; // minutes
    idleTimeout: number; // minutes
    maxDevicesPerUser: number;
    bandwidthLimit: number; // Mbps
    ntpServer: string;
    ldapServer: string;
    ldapPort: number;
    ldapBaseDN: string;
}

export const wifiConfig: WifiConfig = {
    ssid: 'DSS-WiFi',
    authMethods: ['LDAP', 'Username/Password', 'SMS', 'Facebook', 'LINE', 'ID Card'],
    sessionTimeout: 480, // 8 hours
    idleTimeout: 30, // 30 minutes
    maxDevicesPerUser: 3,
    bandwidthLimit: 100, // 100 Mbps
    ntpServer: 'time.navy.mi.th',
    ldapServer: '192.168.1.10',
    ldapPort: 389,
    ldapBaseDN: 'dc=dss,dc=go,dc=th',
};

// Login Methods Stats
export const loginMethodStats = [
    { method: 'LDAP', count: 120, percentage: 45 },
    { method: 'Username/Password', count: 80, percentage: 30 },
    { method: 'SMS', count: 35, percentage: 13 },
    { method: 'LINE', count: 20, percentage: 7 },
    { method: 'Facebook', count: 10, percentage: 4 },
    { method: 'ID Card', count: 3, percentage: 1 },
];

// Hourly Usage Data
export const hourlyUsage = [
    { hour: '06:00', connections: 5, bandwidth: 2 },
    { hour: '07:00', connections: 15, bandwidth: 8 },
    { hour: '08:00', connections: 45, bandwidth: 25 },
    { hour: '09:00', connections: 82, bandwidth: 48 },
    { hour: '10:00', connections: 95, bandwidth: 55 },
    { hour: '11:00', connections: 88, bandwidth: 52 },
    { hour: '12:00', connections: 42, bandwidth: 28 },
    { hour: '13:00', connections: 65, bandwidth: 38 },
    { hour: '14:00', connections: 78, bandwidth: 45 },
    { hour: '15:00', connections: 85, bandwidth: 50 },
    { hour: '16:00', connections: 72, bandwidth: 42 },
    { hour: '17:00', connections: 35, bandwidth: 18 },
    { hour: '18:00', connections: 12, bandwidth: 6 },
];
