'use client';

import { motion } from 'framer-motion';
import { AuditTable } from './_components/AuditTable';
import { mockAuditLogs } from '@/data/mockAuditLogs';

const usageStats = [
  { category: 'User/Login', count: 49, percentage: 69, color: 'hsl(199, 89%, 48%)' },
  { category: 'Export', count: 20, percentage: 28.2, color: 'hsl(168, 76%, 42%)' },
  { category: 'Audit trail', count: 2, percentage: 2.8, color: 'hsl(38, 92%, 50%)' },
];

export default function AuditPage() {
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

      {/* Table */}
      <AuditTable initialData={mockAuditLogs} />
    </div>
  );
}
