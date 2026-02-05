// Mock Notifications Data - TOR Requirement #21

export interface Notification {
    id: string;
    type: 'info' | 'warning' | 'success' | 'error';
    category: 'artefact' | 'system' | 'user' | 'security';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    actionUrl?: string;
    userId?: string;
}

export const notifications: Notification[] = [
    {
        id: 'n1',
        type: 'info',
        category: 'artefact',
        title: 'Artefact อัปเดต',
        message: 'LIMS ถูกอัปเดตเป็นเวอร์ชัน 5.2.1',
        timestamp: '2024-01-12 14:30',
        read: false,
        actionUrl: '/artefacts?id=app-001',
    },
    {
        id: 'n2',
        type: 'warning',
        category: 'security',
        title: 'ความเสี่ยงสูง',
        message: 'พบ Artefact ที่มีความเสี่ยงสูง 2 รายการ',
        timestamp: '2024-01-12 10:00',
        read: false,
        actionUrl: '/artefacts?risk=high',
    },
    {
        id: 'n3',
        type: 'success',
        category: 'artefact',
        title: 'ความสัมพันธ์ใหม่',
        message: 'สร้างความสัมพันธ์ระหว่าง GovConnect API และ LIMS สำเร็จ',
        timestamp: '2024-01-12 10:15',
        read: true,
        actionUrl: '/graph',
    },
    {
        id: 'n4',
        type: 'info',
        category: 'user',
        title: 'ผู้ใช้ใหม่',
        message: 'คุณใหม่ ทดสอบ ได้รับสิทธิ์ Architect',
        timestamp: '2024-01-11 14:00',
        read: true,
        actionUrl: '/users',
    },
    {
        id: 'n5',
        type: 'info',
        category: 'system',
        title: 'สำรองข้อมูลสำเร็จ',
        message: 'ระบบสำรองข้อมูลอัตโนมัติเสร็จสมบูรณ์',
        timestamp: '2024-01-12 03:00',
        read: true,
    },
    {
        id: 'n6',
        type: 'warning',
        category: 'artefact',
        title: 'เวอร์ชันเก่า',
        message: 'Lab Sample Management ยังใช้เวอร์ชันเก่า ควรอัปเดต',
        timestamp: '2024-01-11 09:00',
        read: false,
        actionUrl: '/artefacts?id=ba-002',
    },
    {
        id: 'n7',
        type: 'error',
        category: 'system',
        title: 'การเชื่อมต่อล้มเหลว',
        message: 'ไม่สามารถเชื่อมต่อ LDAP Server ได้ชั่วคราว',
        timestamp: '2024-01-10 15:30',
        read: true,
    },
];

// Notification Settings
export interface NotificationSettings {
    emailEnabled: boolean;
    emailAddress: string;
    inAppEnabled: boolean;
    categories: {
        artefact: boolean;
        system: boolean;
        user: boolean;
        security: boolean;
    };
}

export const defaultNotificationSettings: NotificationSettings = {
    emailEnabled: true,
    emailAddress: 'admin@dss.go.th',
    inAppEnabled: true,
    categories: {
        artefact: true,
        system: true,
        user: true,
        security: true,
    },
};

// Helper functions
export function getUnreadCount(notificationList: Notification[]): number {
    return notificationList.filter(n => !n.read).length;
}

export function getNotificationsByCategory(notificationList: Notification[], category: Notification['category']): Notification[] {
    return notificationList.filter(n => n.category === category);
}
