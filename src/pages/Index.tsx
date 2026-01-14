import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { RiskCard } from '@/components/dashboard/RiskCard';
import { RecentChangesCard } from '@/components/dashboard/RecentChangesCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { CoverageChart } from '@/components/dashboard/CoverageChart';
import { EAGraph } from '@/components/graph/EAGraph';
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

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Risk & Changes */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RiskCard items={riskHotspots} />
                    <RecentChangesCard items={recentChanges} />
                  </div>
                  <CoverageChart />
                </div>

                {/* Right Column - Quick Actions */}
                <div>
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

        {currentView !== 'dashboard' && currentView !== 'graph' && (
          <>
            <AppHeader 
              title={currentPath.substring(1).charAt(0).toUpperCase() + currentPath.substring(2)} 
              subtitle="Coming soon..."
            />
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                  <span className="text-4xl">🚧</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  หน้านี้อยู่ระหว่างการพัฒนา
                </p>
              </motion.div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
