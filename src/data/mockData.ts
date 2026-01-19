// Mock data for EA Management System
// Based on Department of Medical Sciences use case

export type ArtefactType = 'business' | 'data' | 'application' | 'technology' | 'security' | 'integration';
export type RiskLevel = 'high' | 'medium' | 'low' | 'none';
export type Status = 'active' | 'draft' | 'deprecated' | 'planned';

export interface Artefact {
  id: string;
  name: string;
  nameTh: string;
  type: ArtefactType;
  description: string;
  owner: string;
  department: string;
  status: Status;
  riskLevel: RiskLevel;
  lastUpdated: string;
  version: string;
  usageFrequency: 'high' | 'medium' | 'low';
  dependencies: number;
  dependents: number;
}

export interface Relationship {
  id: string;
  source: string;
  target: string;
  type: 'supports' | 'uses' | 'depends_on' | 'manages' | 'integrates_with';
  label: string;
}

export interface DashboardMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

// Version Control - TOR requirement #11
export interface ArtefactVersion {
  id: string;
  artefactId: string;
  version: string;
  changes: string;
  changedBy: string;
  changedAt: string;
  previousVersion: string | null;
}

// Audit Trail - TOR requirement #18
export interface AuditLogEntry {
  id: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'export' | 'import' | 'login' | 'logout';
  entityType: 'artefact' | 'user' | 'relationship' | 'system';
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

export const artefacts: Artefact[] = [
  {
    id: 'ba-001',
    name: 'Water Quality Testing',
    nameTh: 'กระบวนการตรวจคุณภาพน้ำ',
    type: 'business',
    description: 'Core business process for water quality analysis and certification',
    owner: 'ดร.สมชาย วิทยาการ',
    department: 'กองตรวจวิเคราะห์',
    status: 'active',
    riskLevel: 'low',
    lastUpdated: '2024-01-10',
    version: '2.1',
    usageFrequency: 'high',
    dependencies: 3,
    dependents: 5,
  },
  {
    id: 'ba-002',
    name: 'Lab Sample Management',
    nameTh: 'การจัดการตัวอย่างห้องปฏิบัติการ',
    type: 'business',
    description: 'End-to-end sample tracking from receipt to disposal',
    owner: 'คุณวิภา สุขใจ',
    department: 'ศูนย์วิทยาศาสตร์การแพทย์',
    status: 'active',
    riskLevel: 'medium',
    lastUpdated: '2024-01-08',
    version: '1.8',
    usageFrequency: 'high',
    dependencies: 4,
    dependents: 8,
  },
  {
    id: 'app-001',
    name: 'LIMS',
    nameTh: 'ระบบจัดการข้อมูลห้องปฏิบัติการ',
    type: 'application',
    description: 'Laboratory Information Management System - Core platform',
    owner: 'คุณประสิทธิ์ เทคโน',
    department: 'ศูนย์เทคโนโลยีสารสนเทศ',
    status: 'active',
    riskLevel: 'high',
    lastUpdated: '2024-01-12',
    version: '5.2.1',
    usageFrequency: 'high',
    dependencies: 6,
    dependents: 12,
  },
  {
    id: 'app-002',
    name: 'E-Lab Request',
    nameTh: 'ระบบขอใช้บริการห้องปฏิบัติการ',
    type: 'application',
    description: 'Online lab service request and tracking portal',
    owner: 'คุณสุรีย์ ดิจิทัล',
    department: 'ศูนย์เทคโนโลยีสารสนเทศ',
    status: 'active',
    riskLevel: 'low',
    lastUpdated: '2024-01-11',
    version: '3.0',
    usageFrequency: 'medium',
    dependencies: 2,
    dependents: 3,
  },
  {
    id: 'data-001',
    name: 'Test Results Dataset',
    nameTh: 'ชุดข้อมูลผลการทดสอบ',
    type: 'data',
    description: 'Master dataset containing all laboratory test results',
    owner: 'ดร.มนัส ข้อมูล',
    department: 'กองมาตรฐาน',
    status: 'active',
    riskLevel: 'high',
    lastUpdated: '2024-01-12',
    version: '1.0',
    usageFrequency: 'high',
    dependencies: 1,
    dependents: 7,
  },
  {
    id: 'data-002',
    name: 'Customer Registry',
    nameTh: 'ทะเบียนผู้รับบริการ',
    type: 'data',
    description: 'Registry of all service recipients and their history',
    owner: 'คุณนภา ลูกค้า',
    department: 'กองบริการ',
    status: 'active',
    riskLevel: 'medium',
    lastUpdated: '2024-01-09',
    version: '2.3',
    usageFrequency: 'high',
    dependencies: 0,
    dependents: 4,
  },
  {
    id: 'tech-001',
    name: 'Central Database Server',
    nameTh: 'เซิร์ฟเวอร์ฐานข้อมูลกลาง',
    type: 'technology',
    description: 'Primary database server hosting all core systems',
    owner: 'คุณเทพ โครงสร้าง',
    department: 'ศูนย์เทคโนโลยีสารสนเทศ',
    status: 'active',
    riskLevel: 'high',
    lastUpdated: '2024-01-05',
    version: 'v12.2',
    usageFrequency: 'high',
    dependencies: 0,
    dependents: 15,
  },
  {
    id: 'sec-001',
    name: 'LDAP Authentication',
    nameTh: 'ระบบยืนยันตัวตน LDAP',
    type: 'security',
    description: 'Centralized authentication and access control',
    owner: 'คุณปลอดภัย รักษา',
    department: 'ศูนย์เทคโนโลยีสารสนเทศ',
    status: 'active',
    riskLevel: 'medium',
    lastUpdated: '2024-01-07',
    version: '2.0',
    usageFrequency: 'high',
    dependencies: 1,
    dependents: 10,
  },
  {
    id: 'int-001',
    name: 'GovConnect API',
    nameTh: 'API เชื่อมต่อหน่วยงานรัฐ',
    type: 'integration',
    description: 'Integration layer for government agency data exchange',
    owner: 'คุณเชื่อม ต่อ',
    department: 'กองนโยบาย',
    status: 'active',
    riskLevel: 'low',
    lastUpdated: '2024-01-06',
    version: '1.5',
    usageFrequency: 'medium',
    dependencies: 2,
    dependents: 3,
  },
];

export const relationships: Relationship[] = [
  { id: 'r1', source: 'ba-001', target: 'app-001', type: 'uses', label: 'ใช้งาน' },
  { id: 'r2', source: 'ba-001', target: 'data-001', type: 'manages', label: 'จัดการ' },
  { id: 'r3', source: 'ba-002', target: 'app-001', type: 'uses', label: 'ใช้งาน' },
  { id: 'r4', source: 'app-001', target: 'tech-001', type: 'depends_on', label: 'พึ่งพา' },
  { id: 'r5', source: 'app-001', target: 'data-001', type: 'manages', label: 'จัดการ' },
  { id: 'r6', source: 'app-001', target: 'sec-001', type: 'uses', label: 'ใช้งาน' },
  { id: 'r7', source: 'app-002', target: 'app-001', type: 'integrates_with', label: 'เชื่อมต่อ' },
  { id: 'r8', source: 'app-002', target: 'data-002', type: 'uses', label: 'ใช้งาน' },
  { id: 'r9', source: 'data-001', target: 'tech-001', type: 'depends_on', label: 'พึ่งพา' },
  { id: 'r10', source: 'sec-001', target: 'tech-001', type: 'depends_on', label: 'พึ่งพา' },
  { id: 'r11', source: 'int-001', target: 'app-001', type: 'integrates_with', label: 'เชื่อมต่อ' },
];

export const dashboardMetrics: DashboardMetric[] = [
  { label: 'Total Artefacts', value: 156, change: 12, trend: 'up', icon: 'Layers' },
  { label: 'Active Systems', value: 42, change: 3, trend: 'up', icon: 'Activity' },
  { label: 'High Risk Items', value: 8, change: -2, trend: 'down', icon: 'AlertTriangle' },
  { label: 'Coverage Rate', value: 87, change: 5, trend: 'up', icon: 'Shield' },
];

export const riskHotspots = [
  { name: 'LIMS', department: 'ศูนย์เทคโนโลยีสารสนเทศ', risk: 'Single Point of Failure', severity: 'high' as RiskLevel },
  { name: 'Central Database', department: 'ศูนย์เทคโนโลยีสารสนเทศ', risk: 'No Backup System', severity: 'high' as RiskLevel },
  { name: 'Test Results Dataset', department: 'กองมาตรฐาน', risk: 'Data Integrity', severity: 'medium' as RiskLevel },
];

export const redundancies = [
  { system1: 'E-Lab Request', system2: 'Lab Portal', overlap: '78%', recommendation: 'Merge' },
  { system1: 'Customer DB', system2: 'Service Registry', overlap: '45%', recommendation: 'Review' },
];

export const recentChanges = [
  { artefact: 'LIMS', type: 'application', action: 'Updated', user: 'คุณประสิทธิ์', time: '2 ชั่วโมงที่แล้ว' },
  { artefact: 'GovConnect API', type: 'integration', action: 'New Relationship', user: 'คุณเชื่อม', time: '5 ชั่วโมงที่แล้ว' },
  { artefact: 'Lab Sample Management', type: 'business', action: 'Risk Updated', user: 'ดร.สมชาย', time: '1 วันที่แล้ว' },
];

export const typeLabels: Record<ArtefactType, { en: string; th: string; color: string }> = {
  business: { en: 'Business', th: 'กระบวนการธุรกิจ', color: 'ea-business' },
  data: { en: 'Data', th: 'ข้อมูล', color: 'ea-data' },
  application: { en: 'Application', th: 'แอปพลิเคชัน', color: 'ea-application' },
  technology: { en: 'Technology', th: 'เทคโนโลยี', color: 'ea-technology' },
  security: { en: 'Security', th: 'ความปลอดภัย', color: 'ea-security' },
  integration: { en: 'Integration', th: 'การเชื่อมต่อ', color: 'ea-integration' },
};

// Mock Version History Data
export const artefactVersions: ArtefactVersion[] = [
  { id: 'v1', artefactId: 'app-001', version: '5.2.1', changes: 'แก้ไขบั๊กการเชื่อมต่อฐานข้อมูล', changedBy: 'คุณประสิทธิ์ เทคโน', changedAt: '2024-01-12 14:30', previousVersion: '5.2.0' },
  { id: 'v2', artefactId: 'app-001', version: '5.2.0', changes: 'เพิ่มฟีเจอร์ Export รายงาน', changedBy: 'คุณประสิทธิ์ เทคโน', changedAt: '2024-01-05 10:15', previousVersion: '5.1.0' },
  { id: 'v3', artefactId: 'app-001', version: '5.1.0', changes: 'ปรับปรุงหน้า Dashboard', changedBy: 'คุณสุรีย์ ดิจิทัล', changedAt: '2023-12-20 16:45', previousVersion: '5.0.0' },
  { id: 'v4', artefactId: 'ba-001', version: '2.1', changes: 'ปรับปรุงขั้นตอนการตรวจสอบ', changedBy: 'ดร.สมชาย วิทยาการ', changedAt: '2024-01-10 09:00', previousVersion: '2.0' },
  { id: 'v5', artefactId: 'data-001', version: '1.0', changes: 'สร้างชุดข้อมูลใหม่', changedBy: 'ดร.มนัส ข้อมูล', changedAt: '2024-01-12 11:00', previousVersion: null },
];

// Mock Audit Log Data
export const auditLogs: AuditLogEntry[] = [
  { id: 'log1', action: 'update', entityType: 'artefact', entityId: 'app-001', entityName: 'LIMS', userId: 'u1', userName: 'คุณประสิทธิ์ เทคโน', timestamp: '2024-01-12 14:30:22', details: 'อัปเดตเวอร์ชันเป็น 5.2.1', ipAddress: '192.168.1.100' },
  { id: 'log2', action: 'create', entityType: 'relationship', entityId: 'r11', entityName: 'GovConnect API → LIMS', userId: 'u2', userName: 'คุณเชื่อม ต่อ', timestamp: '2024-01-12 10:15:30', details: 'สร้างความสัมพันธ์ใหม่', ipAddress: '192.168.1.101' },
  { id: 'log3', action: 'view', entityType: 'artefact', entityId: 'ba-002', entityName: 'การจัดการตัวอย่างห้องปฏิบัติการ', userId: 'u3', userName: 'คุณวิภา สุขใจ', timestamp: '2024-01-12 09:30:00', details: 'เปิดดูรายละเอียด', ipAddress: '192.168.1.102' },
  { id: 'log4', action: 'export', entityType: 'artefact', entityId: 'all', entityName: 'ทั้งหมด', userId: 'u1', userName: 'คุณประสิทธิ์ เทคโน', timestamp: '2024-01-11 16:00:00', details: 'Export Artefacts เป็น CSV', ipAddress: '192.168.1.100' },
  { id: 'log5', action: 'login', entityType: 'system', entityId: 'sys', entityName: 'ระบบ', userId: 'u4', userName: 'Admin', timestamp: '2024-01-12 08:00:00', details: 'เข้าสู่ระบบสำเร็จ', ipAddress: '192.168.1.200' },
  { id: 'log6', action: 'update', entityType: 'user', entityId: 'u5', entityName: 'คุณใหม่ ทดสอบ', userId: 'u4', userName: 'Admin', timestamp: '2024-01-11 14:00:00', details: 'เปลี่ยน Role เป็น Architect', ipAddress: '192.168.1.200' },
];
