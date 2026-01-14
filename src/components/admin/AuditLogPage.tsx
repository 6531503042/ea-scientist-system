import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download,
  Calendar,
  User,
  Activity,
  FileText,
  Edit,
  Trash2,
  Plus,
  Eye,
  Link,
  Clock,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuditLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'export' | 'login' | 'relationship';
  target: string;
  targetType: 'artefact' | 'user' | 'relationship' | 'report' | 'system';
  user: string;
  userRole: string;
  timestamp: string;
  details?: string;
  ipAddress: string;
}

const mockLogs: AuditLog[] = [
  {
    id: '1',
    action: 'update',
    target: 'LIMS',
    targetType: 'artefact',
    user: 'คุณวิภา สถาปัตย์',
    userRole: 'Architect',
    timestamp: '2024-01-12 14:32:15',
    details: 'อัปเดต version จาก 5.2.0 เป็น 5.2.1',
    ipAddress: '192.168.1.45',
  },
  {
    id: '2',
    action: 'relationship',
    target: 'LIMS → Test Results Dataset',
    targetType: 'relationship',
    user: 'คุณวิภา สถาปัตย์',
    userRole: 'Architect',
    timestamp: '2024-01-12 14:30:00',
    details: 'เพิ่มความสัมพันธ์ใหม่',
    ipAddress: '192.168.1.45',
  },
  {
    id: '3',
    action: 'view',
    target: 'Executive Summary Report',
    targetType: 'report',
    user: 'ดร.สมชาย วิทยาการ',
    userRole: 'Admin',
    timestamp: '2024-01-12 10:15:30',
    ipAddress: '192.168.1.20',
  },
  {
    id: '4',
    action: 'export',
    target: 'Risk Assessment Q4',
    targetType: 'report',
    user: 'คุณสุรีย์ ตรวจสอบ',
    userRole: 'Auditor',
    timestamp: '2024-01-11 16:45:00',
    details: 'Export เป็น PDF',
    ipAddress: '192.168.1.78',
  },
  {
    id: '5',
    action: 'create',
    target: 'GovConnect API',
    targetType: 'artefact',
    user: 'คุณวิภา สถาปัตย์',
    userRole: 'Architect',
    timestamp: '2024-01-10 09:20:00',
    details: 'สร้าง Artefact ใหม่ประเภท Integration',
    ipAddress: '192.168.1.45',
  },
  {
    id: '6',
    action: 'login',
    target: 'System',
    targetType: 'system',
    user: 'ดร.สมชาย วิทยาการ',
    userRole: 'Admin',
    timestamp: '2024-01-10 08:30:00',
    ipAddress: '192.168.1.20',
  },
  {
    id: '7',
    action: 'delete',
    target: 'Legacy System X',
    targetType: 'artefact',
    user: 'ดร.สมชาย วิทยาการ',
    userRole: 'Admin',
    timestamp: '2024-01-09 15:00:00',
    details: 'ลบ Artefact ที่ deprecated',
    ipAddress: '192.168.1.20',
  },
];

const actionConfig: Record<AuditLog['action'], { icon: React.ElementType; color: string; label: string }> = {
  create: { icon: Plus, color: 'text-success bg-success/10', label: 'สร้าง' },
  update: { icon: Edit, color: 'text-info bg-info/10', label: 'แก้ไข' },
  delete: { icon: Trash2, color: 'text-destructive bg-destructive/10', label: 'ลบ' },
  view: { icon: Eye, color: 'text-muted-foreground bg-muted', label: 'ดู' },
  export: { icon: Download, color: 'text-accent bg-accent/10', label: 'Export' },
  login: { icon: User, color: 'text-warning bg-warning/10', label: 'เข้าสู่ระบบ' },
  relationship: { icon: Link, color: 'text-primary bg-primary/10', label: 'ความสัมพันธ์' },
};

export function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<AuditLog['action'] | 'all'>('all');
  const [dateRange, setDateRange] = useState('7days');

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Audit Log</h2>
          <p className="text-muted-foreground">บันทึกการใช้งานและการเปลี่ยนแปลงทั้งหมดในระบบ</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Log
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'การดำเนินการวันนี้', value: 24, icon: Activity },
          { label: 'ผู้ใช้งานวันนี้', value: 8, icon: User },
          { label: 'การแก้ไข', value: 12, icon: Edit },
          { label: 'การ Export', value: 5, icon: Download },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 bg-card rounded-xl border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        
        <div className="relative">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as AuditLog['action'] | 'all')}
            className="h-10 pl-4 pr-10 text-sm bg-card border border-border rounded-lg appearance-none cursor-pointer"
          >
            <option value="all">ทุกการดำเนินการ</option>
            <option value="create">สร้าง</option>
            <option value="update">แก้ไข</option>
            <option value="delete">ลบ</option>
            <option value="view">ดู</option>
            <option value="export">Export</option>
            <option value="login">เข้าสู่ระบบ</option>
            <option value="relationship">ความสัมพันธ์</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-10 pl-4 pr-10 text-sm bg-card border border-border rounded-lg appearance-none cursor-pointer"
          >
            <option value="today">วันนี้</option>
            <option value="7days">7 วันที่แล้ว</option>
            <option value="30days">30 วันที่แล้ว</option>
            <option value="90days">90 วันที่แล้ว</option>
          </select>
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="divide-y divide-border">
          {filteredLogs.map((log, index) => {
            const ActionIcon = actionConfig[log.action].icon;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0",
                    actionConfig[log.action].color
                  )}>
                    <ActionIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">{log.user}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-sm text-muted-foreground">{log.userRole}</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">
                      <span className={cn(
                        "font-medium",
                        actionConfig[log.action].color.split(' ')[0]
                      )}>
                        {actionConfig[log.action].label}
                      </span>
                      {' '}
                      <span className="font-medium">{log.target}</span>
                    </p>
                    {log.details && (
                      <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.timestamp}
                      </span>
                      <span>IP: {log.ipAddress}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
