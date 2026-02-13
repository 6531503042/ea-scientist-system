/**
 * Role Templates
 * Pre-defined templates for common user roles.
 * Used by CreateRoleModal for quick setup with pre-selected permissions.
 */

export interface RoleTemplate {
    name: string;
    nameTh: string;
    description?: string;
    permissions: string[];
    isSystemRole?: boolean;
}

export const roleTemplates: RoleTemplate[] = [
    {
        name: 'admin',
        nameTh: 'ผู้ดูแลระบบ',
        description: 'สิทธิ์เต็มในการจัดการระบบ',
        permissions: [
            'view_dashboard', 'view_artefacts', 'create_artefacts', 'edit_artefacts', 'delete_artefacts',
            'view_users', 'manage_users', 'manage_roles',
            'view_reports', 'export_data', 'view_settings', 'manage_settings',
        ],
        isSystemRole: true,
    },
    {
        name: 'architect',
        nameTh: 'Enterprise Architect',
        description: 'จัดการ Artefacts และแผนผังสถาปัตยกรรม',
        permissions: [
            'view_dashboard', 'view_artefacts', 'create_artefacts', 'edit_artefacts', 'delete_artefacts',
            'view_users', 'view_reports', 'export_data', 'view_settings',
        ],
    },
    {
        name: 'manager',
        nameTh: 'ผู้บริหาร',
        description: 'ดูรายงานและแดชบอร์ด',
        permissions: [
            'view_dashboard', 'view_artefacts', 'view_users', 'view_reports', 'export_data',
        ],
    },
    {
        name: 'user',
        nameTh: 'ผู้ใช้ทั่วไป',
        description: 'ใช้งาน Artefacts และสร้างข้อมูลได้',
        permissions: [
            'view_dashboard', 'view_artefacts', 'create_artefacts', 'edit_artefacts',
            'view_reports', 'export_data',
        ],
    },
    {
        name: 'viewer',
        nameTh: 'ผู้ดู',
        description: 'ดูข้อมูลได้อย่างเดียว',
        permissions: [
            'view_dashboard', 'view_artefacts', 'view_users', 'view_reports',
        ],
    },
    {
        name: 'auditor',
        nameTh: 'ผู้ตรวจสอบ',
        description: 'ดูข้อมูลและรายงานทั้งหมด',
        permissions: [
            'view_dashboard', 'view_artefacts', 'view_users', 'view_reports', 'export_data', 'view_settings',
        ],
    },
];
