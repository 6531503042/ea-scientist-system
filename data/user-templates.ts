/**
 * User Templates
 * Pre-defined templates for common user types when creating new users.
 * Used by CreateUserModal for quick role/department setup.
 */

import type { RoleKey } from '@/types/role';

export interface UserTemplate {
    name: string;
    role: RoleKey;
    department: string;
    description?: string;
}

export const userTemplates: UserTemplate[] = [
    { name: 'ผู้ดูแลระบบ', role: 'admin', department: 'IT', description: 'สิทธิ์เต็มระบบ' },
    { name: 'Enterprise Architect', role: 'architect', department: 'IT', description: 'จัดการ Artefacts' },
    { name: 'ผู้บริหาร', role: 'manager', department: '', description: 'ดูรายงานและแดชบอร์ด' },
    { name: 'ผู้ใช้ทั่วไป', role: 'viewer', department: '', description: 'ดูข้อมูลได้อย่างเดียว' },
    { name: 'ผู้ตรวจสอบ', role: 'auditor', department: '', description: 'ดูและส่งออกรายงาน' },
];
