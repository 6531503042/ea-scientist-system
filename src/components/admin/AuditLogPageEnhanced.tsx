import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
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
  ChevronDown,
  Filter,
  LogIn,
  FileUp,
  History,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

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
  userAgent?: string;
  sessionId?: string;
}

const mockLogs: AuditLog[] = [
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
  },
];

const usageStats = [
  { category: 'User/Login', count: 49, percentage: 69, color: 'hsl(199, 89%, 48%)' },
  { category: 'Export', count: 20, percentage: 28.2, color: 'hsl(168, 76%, 42%)' },
  { category: 'Audit trail', count: 2, percentage: 2.8, color: 'hsl(38, 92%, 50%)' },
];

const actionConfig: Record<AuditLog['action'], { icon: React.ElementType; color: string; label: string }> = {
  create: { icon: Plus, color: 'text-success bg-success/10', label: 'สร้าง' },
  update: { icon: Edit, color: 'text-info bg-info/10', label: 'แก้ไข' },
  delete: { icon: Trash2, color: 'text-destructive bg-destructive/10', label: 'ลบ' },
  view: { icon: Eye, color: 'text-muted-foreground bg-muted', label: 'ดู' },
  export: { icon: FileUp, color: 'text-success bg-success/10', label: 'Export' },
  login: { icon: LogIn, color: 'text-info bg-info/10', label: 'เข้าสู่ระบบ' },
  relationship: { icon: Link, color: 'text-primary bg-primary/10', label: 'ความสัมพันธ์' },
};

export function AuditLogPageEnhanced() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'export' | 'audit'>('login');
  const [dateRange, setDateRange] = useState('7days');

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      (activeTab === 'login' && log.action === 'login') ||
      (activeTab === 'export' && log.action === 'export') ||
      (activeTab === 'audit' && !['login', 'export'].includes(log.action));
    return matchesSearch && matchesTab;
  });

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Subtitle */}
      <p className="text-sm text-muted-foreground">แสดงข้อมูลการใช้งานของผู้ใช้ในระบบ</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-card rounded-xl border border-border"
        >
          <p className="text-sm text-muted-foreground">จำนวน Log ทั้งหมด</p>
          <p className="text-3xl font-bold text-info mt-1">71</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 bg-card rounded-xl border border-border"
        >
          <p className="text-sm text-muted-foreground">Log เดือนนี้</p>
          <p className="text-3xl font-bold text-info mt-1">71</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 bg-card rounded-xl border border-border"
        >
          <p className="text-sm text-muted-foreground">จำนวนผู้ใช้งานที่ Active</p>
          <p className="text-3xl font-bold text-success mt-1">30</p>
        </motion.div>
      </div>

      {/* Usage Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 bg-card rounded-xl border border-border"
      >
        <h3 className="font-semibold text-foreground mb-4">สถิติการใช้งาน</h3>
        <div className="space-y-4">
          {usageStats.map((stat, index) => (
            <div key={stat.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  />
                  <span className="text-sm text-foreground">{stat.category}</span>
                </div>
                <span className="text-sm text-muted-foreground">{stat.count} รายการ</span>
              </div>
              <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.percentage}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  className="absolute inset-y-0 left-0 rounded-full flex items-center justify-end pr-3"
                  style={{ backgroundColor: stat.color }}
                >
                  <span className="text-xs font-medium text-white">{stat.percentage}%</span>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tabs & Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Tab Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('login')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeTab === 'login'
                  ? "bg-info/10 text-info"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              User/Login
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeTab === 'export'
                  ? "bg-success/10 text-success"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Export
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeTab === 'audit'
                  ? "bg-warning/10 text-warning"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Audit trail
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, อีเมล, IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 h-9 pl-9 pr-4 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="flex items-center gap-2 px-3 h-9 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
              กรองข้อมูล
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ชื่อ</th>
                {activeTab === 'login' && (
                  <>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">E-mail</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">การกระทำ</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ที่อยู่ IP</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">เบราว์เซอร์/อุปกรณ์</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">sessions</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">คำแนะนำที่คลิก</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">วันที่และเวลา</th>
                  </>
                )}
                {activeTab === 'export' && (
                  <>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ตำแหน่ง</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ประเภทรายงาน</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ไฟล์รูปแบบ</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">สถานะ</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">วันที่และเวลา</th>
                  </>
                )}
                {activeTab === 'audit' && (
                  <>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ตำแหน่ง</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">การกระทำ</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">เลขรัส</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ผลพิจารณา</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">วันที่และเวลา</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ความคิดเห็น</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ระบบ</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => {
                const config = actionConfig[log.action];
                return (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <span className="font-medium text-foreground">{log.user}</span>
                    </td>
                    {activeTab === 'login' && (
                      <>
                        <td className="px-4 py-4 text-sm text-muted-foreground">admin@oae.go.th</td>
                        <td className="px-4 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap",
                            log.userRole === 'Admin'
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-rose-100 text-rose-700 border border-rose-200"
                          )}>
                            {log.userRole === 'Admin' ? (
                              <><LogIn className="w-3 h-3" /> เข้าสู่ระบบสำเร็จ</>
                            ) : (
                              <>ออกจากระบบ</>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">::1</td>
                        <td className="px-4 py-4 text-sm text-muted-foreground max-w-xs truncate">
                          {log.userAgent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground font-mono text-xs">
                          {log.sessionId?.slice(0, 8)}...
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {log.ipAddress}
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">{log.timestamp}</td>
                      </>
                    )}
                    {activeTab === 'export' && (
                      <>
                        <td className="px-4 py-4 text-sm text-foreground">ผู้ตรวจสอบภายใน</td>
                        <td className="px-4 py-4 text-sm text-foreground">ผลการตรวจสอบ</td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 text-xs font-medium rounded bg-destructive/10 text-destructive">
                            DOC
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-success">สำเร็จ</span>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">{log.timestamp}</td>
                      </>
                    )}
                    {activeTab === 'audit' && (
                      <>
                        <td className="px-4 py-4 text-sm text-foreground">ผู้ดูแลระบบ</td>
                        <td className="px-4 py-4 text-sm text-foreground">สร้าง</td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">-</td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 text-xs font-medium rounded bg-warning/10 text-warning">
                            รอพิจารณา
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">09/01/2569 19:02</td>
                        <td className="px-4 py-4 text-sm text-muted-foreground max-w-xs truncate">
                          มอบหมายสิทธิ์ "หัวหน้ากลุ่มตรวจสอบภายใน" ได้กับ นางสาวศรีพัชริ์
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">ระบบจัดการผู้ใช้งาน</td>
                      </>
                    )}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <History className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">ไม่พบข้อมูล</p>
            <p className="text-sm text-muted-foreground">ลองเปลี่ยนตัวกรองหรือคำค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
}
