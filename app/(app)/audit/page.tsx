'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAudit } from '@/hooks/useAudit';
import { AuditLogTable } from './_components/AuditLogTable';

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { logs, loading } = useAudit();

  const stats = useMemo(() => {
    const total = logs.length;
    const loginCount = logs.filter(log => log.action === 'login').length;
    const exportCount = logs.filter(log => log.action === 'export' || log.action === 'import').length;
    const auditTrailCount = total - loginCount - exportCount;

    return {
      total,
      loginCount,
      exportCount,
      auditTrailCount,
      usage: [
        {
          category: 'User/Login',
          count: loginCount,
          percentage: total ? Math.round((loginCount / total) * 100) : 0,
          color: 'hsl(199, 89%, 48%)',
        },
        {
          category: 'Export / Import',
          count: exportCount,
          percentage: total ? Math.round((exportCount / total) * 100) : 0,
          color: 'hsl(168, 76%, 42%)',
        },
        {
          category: 'Audit trail อื่น ๆ',
          count: auditTrailCount,
          percentage: total ? Math.max(0, 100 - Math.round((loginCount + exportCount) / total * 100)) : 0,
          color: 'hsl(38, 92%, 50%)',
        },
      ],
    };
  }, [logs]);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Subtitle */}
      <p className="text-sm text-muted-foreground">แสดงข้อมูลการใช้งานของผู้ใช้ในระบบ (ดึงจาก Audit Logs API จริง)</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-card rounded-xl border border-border"
        >
          <p className="text-sm text-muted-foreground">จำนวน Log ทั้งหมด</p>
          <p className="text-3xl font-bold text-info mt-1">{stats.total}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 bg-card rounded-xl border border-border"
        >
          <p className="text-sm text-muted-foreground">User/Login</p>
          <p className="text-3xl font-bold text-info mt-1">{stats.loginCount}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 bg-card rounded-xl border border-border"
        >
          <p className="text-sm text-muted-foreground">Export / Audit อื่น ๆ</p>
          <p className="text-3xl font-bold text-success mt-1">{stats.exportCount + stats.auditTrailCount}</p>
        </motion.div>
      </div>

      {/* Usage Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 bg-card rounded-xl border border-border"
      >
        <h3 className="font-semibold text-foreground mb-4">สถิติการใช้งานจาก Audit Logs</h3>
        <div className="space-y-4">
          {stats.usage.map((stat, index) => (
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

      {/* Audit Log Table (API-backed) */}
      <AuditLogTable
        logs={logs}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        loading={loading}
      />
    </div>
  );
}
