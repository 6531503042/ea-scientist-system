import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { RiskCard } from '@/components/dashboard/RiskCard';
import { RecentChangesCard } from '@/components/dashboard/RecentChangesCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ArtefactTypeChart, TrendChart, RiskByDepartmentChart, CoverageDonut } from '@/components/dashboard/DashboardCharts';
import { EAGraph } from '@/components/graph/EAGraph';
import { ArtefactListEnhanced } from '@/components/artefacts/ArtefactListEnhanced';
import { ReportsPageEnhanced } from '@/components/reports/ReportsPageEnhanced';
import { UsersPageEnhanced } from '@/components/admin/UsersPageEnhanced';
import { AuditLogPageEnhanced } from '@/components/admin/AuditLogPageEnhanced';
import { SettingsPage } from '@/components/admin/SettingsPage';
import { dashboardMetrics, riskHotspots, recentChanges } from '@/data/mockData';

type View = 'dashboard' | 'graph' | 'artefacts' | 'reports' | 'users' | 'audit' | 'settings';

const viewMap: Record<string, View> = {
  '/': 'dashboard',
  '/graph': 'graph',
  '/artefacts': 'artefacts',
  '/reports': 'reports',
  '/users': 'users',
  '/audit': 'audit',
  '/settings': 'settings',
};

const Index = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const currentView = viewMap[currentPath] || 'dashboard';

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar currentPath={currentPath} onNavigate={handleNavigate} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentView === 'dashboard' && (
          <>
            <AppHeader 
              title="Executive Dashboard" 
              subtitle="ภาพรวมสถาปัตยกรรมองค์กร • กรมวิทยาศาสตร์บริการ"
            />
            <div className="flex-1 overflow-y-auto p-6">
              {/* Welcome Banner */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden p-6 mb-6 bg-gradient-to-r from-primary to-primary/80 rounded-2xl text-primary-foreground"
              >
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">สวัสดี, Enterprise Architect 👋</h2>
                  <p className="text-primary-foreground/80 max-w-xl">
                    วันนี้มีการเปลี่ยนแปลง 3 รายการ และพบความเสี่ยง 2 จุดที่ต้องตรวจสอบ
                  </p>
                </div>
              </motion.div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {dashboardMetrics.map((metric, index) => (
                  <MetricCard key={metric.label} {...metric} index={index} />
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ArtefactTypeChart />
                <TrendChart />
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RiskByDepartmentChart />
                <CoverageDonut />
                <div className="space-y-6">
                  <RiskCard items={riskHotspots} />
                  <QuickActions onExploreGraph={() => handleNavigate('/graph')} />
                </div>
              </div>
            </div>
          </>
        )}

        {currentView === 'graph' && (
          <>
            <AppHeader 
              title="Architecture Map" 
              subtitle="แผนผังความสัมพันธ์ระหว่าง Artefacts"
            />
            <EAGraph />
          </>
        )}

        {currentView === 'artefacts' && (
          <>
            <AppHeader title="Artefacts" subtitle="จัดการ Artefacts ทั้งหมดในระบบ" />
            <div className="flex-1 overflow-hidden">
              <ArtefactListEnhanced />
            </div>
          </>
        )}

        {currentView === 'reports' && (
          <>
            <AppHeader title="รายงาน" subtitle="สร้างและดาวน์โหลดรายงาน" />
            <div className="flex-1 overflow-y-auto">
              <ReportsPageEnhanced />
            </div>
          </>
        )}

        {currentView === 'users' && (
          <>
            <AppHeader title="จัดการผู้ใช้งาน" subtitle="บัญชีผู้ใช้และสิทธิ์การเข้าถึง" />
            <div className="flex-1 overflow-y-auto">
              <UsersPageEnhanced />
            </div>
          </>
        )}

        {currentView === 'audit' && (
          <>
            <AppHeader title="Audit Log" subtitle="บันทึกการใช้งานระบบ" />
            <div className="flex-1 overflow-y-auto">
              <AuditLogPageEnhanced />
            </div>
          </>
        )}

        {currentView === 'settings' && (
          <>
            <AppHeader title="ตั้งค่าระบบ" subtitle="กำหนดค่าระบบ EA Management" />
            <div className="flex-1 overflow-y-auto">
              <SettingsPage />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
