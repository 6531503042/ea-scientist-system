export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'architect' | 'manager' | 'viewer';
    department: string;
    status: 'active' | 'inactive';
    lastLogin: string;
    avatar?: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    userCount: number;
    permissions: string[];
    color: string;
}

export interface Department {
    id: string;
    name: string;
    code: string;
    head: string; // User ID or Name
    memberCount: number;
    location?: string;
}

export const mockUsers: User[] = [
    {
        id: '1',
        name: 'Somchai Administrator',
        email: 'admin@dss.go.th',
        role: 'admin',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ',
        status: 'active',
        lastLogin: '2024-01-19 09:30',
    },
    {
        id: '2',
        name: 'Wipa Architect',
        email: 'wipa.a@dss.go.th',
        role: 'architect',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ',
        status: 'active',
        lastLogin: '2024-01-18 16:45',
    },
    {
        id: '3',
        name: 'Prasit Manager',
        email: 'prasit.m@dss.go.th',
        role: 'manager',
        department: 'กองตรวจวิเคราะห์',
        status: 'active',
        lastLogin: '2024-01-19 10:15',
    },
    {
        id: '4',
        name: 'Suda Viewer',
        email: 'suda.v@dss.go.th',
        role: 'viewer',
        department: 'สำนักงานเลขานุการกรม',
        status: 'inactive',
        lastLogin: '2024-01-15 11:20',
    },
    {
        id: '5',
        name: 'Manat Data',
        email: 'manat.d@dss.go.th',
        role: 'architect',
        department: 'กองข้อมูลและสถิติ',
        status: 'active',
        lastLogin: '2024-01-19 08:00',
    },
    {
        id: '6',
        name: 'Napa Service',
        email: 'napa.s@dss.go.th',
        role: 'manager',
        department: 'กองบริการ',
        status: 'active',
        lastLogin: '2024-01-18 14:30',
    },
    {
        id: '7',
        name: 'Thep Infra',
        email: 'thep.i@dss.go.th',
        role: 'architect',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ',
        status: 'active',
        lastLogin: '2024-01-19 11:00',
    },
    {
        id: '8',
        name: 'Safe Security',
        email: 'safe.s@dss.go.th',
        role: 'admin',
        department: 'ศูนย์รักษาความปลอดภัย',
        status: 'active',
        lastLogin: '2024-01-19 13:20',
    },
    {
        id: '9',
        name: 'Apiwat Connect',
        email: 'apiwat.c@dss.go.th',
        role: 'architect',
        department: 'กองนโยบาย',
        status: 'active',
        lastLogin: '2024-01-17 09:10',
    },
];

export const mockRoles: Role[] = [
    {
        id: 'admin',
        name: 'ผู้ดูแลระบบ (Admin)',
        description: 'มีสิทธิ์การเข้าถึงและจัดการทุกส่วนของระบบ',
        userCount: 2,
        permissions: ['all_access', 'user_management', 'system_config'],
        color: 'bg-red-500/10 text-red-700 border-red-200',
    },
    {
        id: 'architect',
        name: 'สถาปนิก (Architect)',
        description: 'สามารถสร้าง แก้ไข และจัดการข้อมูลสถาปัตยกรรม',
        userCount: 4,
        permissions: ['create_artefact', 'edit_artefact', 'view_all'],
        color: 'bg-blue-500/10 text-blue-700 border-blue-200',
    },
    {
        id: 'manager',
        name: 'ผู้บริหาร (Manager)',
        description: 'ดูภาพรวมรายงาน และอนุมัติการเปลี่ยนแปลง',
        userCount: 2,
        permissions: ['view_reports', 'approve_changes', 'view_dashboard'],
        color: 'bg-amber-500/10 text-amber-700 border-amber-200',
    },
    {
        id: 'viewer',
        name: 'ผู้ใช้งานทั่วไป (Viewer)',
        description: 'ดูข้อมูลสถาปัตยกรรมได้เท่านั้น',
        userCount: 1,
        permissions: ['view_artefacts', 'view_dashboard'],
        color: 'bg-green-500/10 text-green-700 border-green-200',
    },
];

export const mockDepartments: Department[] = [
    { id: 'dept-it', name: 'ศูนย์เทคโนโลยีสารสนเทศ', code: 'CIT', head: 'Somchai Administrator', memberCount: 15 },
    { id: 'dept-qa', name: 'กองตรวจวิเคราะห์', code: 'QA', head: 'Prasit Manager', memberCount: 20 },
    { id: 'dept-data', name: 'กองข้อมูลและสถิติ', code: 'DS', head: 'Manat Data', memberCount: 8 },
    { id: 'dept-sec', name: 'สำนักงานเลขานุการกรม', code: 'SEC', head: 'Suda Viewer', memberCount: 12 },
    { id: 'dept-serv', name: 'กองบริการ', code: 'SVC', head: 'Napa Service', memberCount: 18 },
    { id: 'dept-security', name: 'ศูนย์รักษาความปลอดภัย', code: 'CSOC', head: 'Safe Security', memberCount: 5 },
    { id: 'dept-policy', name: 'กองนโยบาย', code: 'POL', head: 'Apiwat Connect', memberCount: 10 },
];
