import {
    Briefcase,
    Layers,
    Database,
    Cpu,
    Shield,
    Link,
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    XCircle,
    Plus,
    Edit,
    Trash2,
    Eye,
    FileUp,
    LogIn,
    LogOut
} from 'lucide-react';
import type { ArtefactType, RiskLevel, ArtefactStatus } from '@/types/artefact';
import type { AuditAction } from '@/types/audit';

// --- Type Configuration ---
export const ARTEFACT_TYPE_LABELS: Record<ArtefactType, { en: string; th: string; color: string }> = {
    business: { en: 'Business', th: 'กระบวนการธุรกิจ', color: 'ea-business' },
    data: { en: 'Data', th: 'ข้อมูล', color: 'ea-data' },
    application: { en: 'Application', th: 'แอปพลิเคชัน', color: 'ea-application' },
    technology: { en: 'Technology', th: 'เทคโนโลยี', color: 'ea-technology' },
    security: { en: 'Security', th: 'ความปลอดภัย', color: 'ea-security' },
    integration: { en: 'Integration', th: 'การเชื่อมต่อ', color: 'ea-integration' },
};

export const ARTEFACT_TYPE_ICONS: Record<ArtefactType, any> = {
    business: Briefcase,
    application: Layers,
    data: Database,
    technology: Cpu,
    security: Shield,
    integration: Link,
};

export const ARTEFACT_TYPE_COLORS: Record<ArtefactType, { bg: string; text: string; border: string }> = {
    business: { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500/30' },
    application: { bg: 'bg-sky-500/10', text: 'text-sky-500', border: 'border-sky-500/30' },
    data: { bg: 'bg-teal-500/10', text: 'text-teal-500', border: 'border-teal-500/30' },
    technology: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/30' },
    security: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' },
    integration: { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/30' },
};

// --- Status Configuration ---
export const STATUS_LABELS: Record<ArtefactStatus, string> = {
    active: 'ใช้งาน',
    draft: 'ร่าง',
    deprecated: 'เลิกใช้',
    planned: 'แผนงาน',
    archived: 'จัดเก็บ',
};

export const STATUS_COLORS: Record<ArtefactStatus, string> = {
    active: 'bg-success/10 text-success',
    draft: 'bg-warning/10 text-warning',
    deprecated: 'bg-muted text-muted-foreground',
    planned: 'bg-info/10 text-info',
    archived: 'bg-gray-500/10 text-gray-500',
};

// --- Risk Configuration ---
export const RISK_LABELS: Record<RiskLevel, { th: string; en: string }> = {
    high: { th: 'สูง', en: 'High' },
    medium: { th: 'ปานกลาง', en: 'Medium' },
    low: { th: 'ต่ำ', en: 'Low' },
    none: { th: 'ไม่มี', en: 'None' },
};

export const RISK_COLORS: Record<RiskLevel, { bg: string; text: string }> = {
    high: { bg: 'bg-destructive/10', text: 'text-destructive' },
    medium: { bg: 'bg-warning/10', text: 'text-warning' },
    low: { bg: 'bg-success/10', text: 'text-success' },
    none: { bg: 'bg-muted', text: 'text-muted-foreground' },
};

// --- Audit Configuration ---
export const AUDIT_ACTION_CONFIG: Record<AuditAction, { icon: any; color: string; label: string }> = {
    create: { icon: Plus, color: 'text-success bg-success/10', label: 'สร้าง' },
    read: { icon: Eye, color: 'text-muted-foreground bg-muted', label: 'ดู' },
    update: { icon: Edit, color: 'text-info bg-info/10', label: 'แก้ไข' },
    delete: { icon: Trash2, color: 'text-destructive bg-destructive/10', label: 'ลบ' },
    login: { icon: LogIn, color: 'text-info bg-info/10', label: 'เข้าสู่ระบบ' },
    logout: { icon: LogOut, color: 'text-muted-foreground bg-muted', label: 'ออกจากระบบ' },
    export: { icon: FileUp, color: 'text-success bg-success/10', label: 'Export' },
    import: { icon: FileUp, color: 'text-primary bg-primary/10', label: 'Import' },
    view: { icon: Eye, color: 'text-muted-foreground bg-muted', label: 'ดูรายละเอียด' },
    relationship: { icon: Link, color: 'text-primary bg-primary/10', label: 'ความสัมพันธ์' }
};
