/**
 * Column Configuration for User Management Tables
 * Following bestpractice-frontend-example patterns
 */

export type Column<T = string> = {
    uid: T;
    name: string;
    nameTh?: string;
    sortable?: boolean;
    width?: string;
    align?: 'start' | 'center' | 'end';
};

// ============= Users Table Columns =============
export type UserColumnKey = 'name' | 'role' | 'department' | 'status' | 'lastLogin' | 'actions';

export const userColumns: Column<UserColumnKey>[] = [
    { uid: 'name', name: 'User', nameTh: 'ผู้ใช้', sortable: true },
    { uid: 'role', name: 'Role', nameTh: 'บทบาท' },
    { uid: 'department', name: 'Department', nameTh: 'หน่วยงาน', sortable: true },
    { uid: 'status', name: 'Status', nameTh: 'สถานะ' },
    { uid: 'lastLogin', name: 'Last Login', nameTh: 'เข้าใช้ล่าสุด', sortable: true },
    { uid: 'actions', name: 'Actions', nameTh: 'การดำเนินการ', align: 'end' },
];

export const userInitialVisibleColumns: UserColumnKey[] = [
    'name', 'role', 'department', 'status', 'lastLogin', 'actions'
];

// ============= Roles Table Columns =============
export type RoleColumnKey = 'role' | 'description' | 'permissions' | 'userCount' | 'actions';

export const roleColumns: Column<RoleColumnKey>[] = [
    { uid: 'role', name: 'Role', nameTh: 'บทบาท' },
    { uid: 'description', name: 'Description', nameTh: 'คำอธิบาย' },
    { uid: 'permissions', name: 'Permissions', nameTh: 'สิทธิ์การใช้งาน' },
    { uid: 'userCount', name: 'Users', nameTh: 'ผู้ใช้', align: 'end' },
    { uid: 'actions', name: 'Actions', nameTh: 'การดำเนินการ', align: 'end' },
];

export const roleInitialVisibleColumns: RoleColumnKey[] = [
    'role', 'description', 'permissions', 'userCount', 'actions'
];

// ============= Departments Table Columns =============
export type DepartmentColumnKey = 'name' | 'code' | 'userCount' | 'status' | 'actions';

export const departmentColumns: Column<DepartmentColumnKey>[] = [
    { uid: 'name', name: 'Department', nameTh: 'ชื่อหน่วยงาน' },
    { uid: 'code', name: 'Code', nameTh: 'รหัส' },
    { uid: 'userCount', name: 'Users', nameTh: 'จำนวนผู้ใช้' },
    { uid: 'status', name: 'Status', nameTh: 'สถานะ' },
    { uid: 'actions', name: 'Actions', nameTh: 'การดำเนินการ', align: 'end' },
];

export const departmentInitialVisibleColumns: DepartmentColumnKey[] = [
    'name', 'code', 'userCount', 'status', 'actions'
];

// ============= Shared Utilities =============
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
