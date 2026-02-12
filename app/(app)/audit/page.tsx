'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAudit } from '@/hooks/useAudit';
import { AuditLogTable } from './_components/AuditLogTable';

type AuditTab = 'login' | 'export' | 'audit';

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<AuditTab>('login');
  const { logs, stats, loading } = useAudit();

  const filteredLogs = useMemo(() => {
    if (activeTab === 'login') {
      return logs.filter((log) => log.action === 'login');
    }
    if (activeTab === 'export') {
      return logs.filter((log) => log.action === 'export' || log.action === 'import');
    }
    return logs.filter(
      (log) =>
        !['login', 'export', 'import'].includes(log.action)
    );
  }, [logs, activeTab]);

  const tabs: { id: AuditTab; label: string }[] = [
    { id: 'login', label: 'User/Login' },
    { id: 'export', label: 'Export' },
    { id: 'audit', label: 'Audit trail' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Subtitle */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-sm text-muted-foreground">ติดตามการใช้งานและกิจกรรมต่าง ๆ ในระบบ</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-card rounded-xl border border-border"
        >
          <p className="text-sm text-muted-foreground">จำนวน Log ทั้งหมด</p>
          <p className="text-3xl font-bold text-info mt-1">{stats?.total ?? '-'}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 bg-card rounded-xl border border-border"
        >
          <p className="text-sm text-muted-foreground">Log เดือนนี้</p>
          <p className="text-3xl font-bold text-info mt-1">{stats?.thisMonth ?? '-'}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 bg-card rounded-xl border border-border"
        >
          <p className="text-sm text-muted-foreground">จำนวนผู้ใช้งานที่ Active</p>
          <p className="text-3xl font-bold text-success mt-1">{stats?.activeUsers ?? '-'}</p>
        </motion.div>
      </div>

      {/* Usage Statistics */}
      {stats?.usage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-card rounded-xl border border-border"
        >
          <h3 className="font-semibold text-foreground mb-4">สถิติการใช้งาน</h3>
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
      )}

      {/* Tab bar + Search + Audit Log Table */}
      <div className="space-y-4">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
                    activeTab === tab.id
                      ? tab.id === 'login'
                        ? 'bg-info/10 text-info'
                        : tab.id === 'export'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <AuditLogTable
          logs={filteredLogs}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          loading={loading}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
}
