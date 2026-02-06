
import { AuditLog } from '@/types/audit';

export const mockAuditLogs: AuditLog[] = [
    {
        id: '1',
        action: 'login',
        target: 'ระบบ',
        targetType: 'system',
        user: 'ผู้ดูแล ระบบ',
        userRole: 'Admin',
        timestamp: '15/01/2569 09:11',
        ipAddress: 'localhost',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        sessionId: 'bc10c01d-b990-4dd4-b255-3bdad9a0b1a1',
        severity: 'info'
    },
    {
        id: '2',
        action: 'login',
        target: 'ระบบ',
        targetType: 'system',
        user: 'นางสาวจิราวรรณ สมัคร',
        userRole: 'ผู้ตรวจสอบภายใน',
        timestamp: '15/01/2569 09:11',
        ipAddress: 'unknown',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        sessionId: '247b92c5-2995-4d60-b636-7592b762eec0',
        severity: 'info'
    },
    {
        id: '3',
        action: 'login',
        target: 'ระบบ',
        targetType: 'system',
        user: 'นางสาวจิราวรรณ สมัคร',
        userRole: 'เข้าสู่ระบบสำเร็จ',
        timestamp: '14/01/2569 18:11',
        ipAddress: 'unknown',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        sessionId: '247b92c5-2995-4d60-b636-7592b762eec0',
        severity: 'info'
    },
    {
        id: '4',
        action: 'export',
        target: 'ผลการตรวจสอบ',
        targetType: 'report',
        user: 'นายอรุณ ดดบบ',
        userRole: 'ผู้ตรวจสอบภายใน',
        timestamp: '13/01/2569 16:20',
        ipAddress: '::1',
        details: 'สำเร็จ',
        severity: 'info'
    },
    {
        id: '5',
        action: 'export',
        target: 'ผลการตรวจสอบ',
        targetType: 'report',
        user: 'นายอรุณ ดดบบ',
        userRole: 'ผู้ตรวจสอบภายใน',
        timestamp: '13/01/2569 16:16',
        ipAddress: '::1',
        details: 'สำเร็จ',
        severity: 'info'
    },
    {
        id: '6',
        action: 'create',
        target: 'User Management System',
        targetType: 'artefact',
        user: 'Somchai Administrator',
        userRole: 'Admin',
        timestamp: '09/01/2569 19:02',
        details: 'Created new artefact',
        ipAddress: '192.168.1.10',
        severity: 'info'
    },
    {
        id: '7',
        action: 'update',
        target: 'HR Database Schema',
        targetType: 'artefact',
        user: 'Wipa Architect',
        userRole: 'Architect',
        timestamp: '09/01/2569 15:30',
        details: 'Updated schema definition',
        ipAddress: '192.168.1.12',
        severity: 'info'
    },
    {
        id: '8',
        action: 'delete',
        target: 'Old API Gateway',
        targetType: 'artefact',
        user: 'Somchai Administrator',
        userRole: 'Admin',
        timestamp: '08/01/2569 10:45',
        details: 'Deleted deprecated component',
        ipAddress: '192.168.1.10',
        severity: 'warning'
    }
];
