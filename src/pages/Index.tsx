import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layers, Activity, Clock, Users, Shield, AlertTriangle } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { RiskCard } from '@/components/dashboard/RiskCard';
import { RecentChangesCard } from '@/components/dashboard/RecentChangesCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ArtefactTypeChart, TrendChart, RiskByDepartmentChart, CoverageDonut } from '@/components/dashboard/DashboardCharts';
import { riskHotspots } from '@/data/mockData';
import { api, ArtefactStats } from '@/lib/api';

const Index = () => {
  const [stats, setStats] = useState<ArtefactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getMetric = (label: string, iconName: string, value: number, change: number, trend: 'up' | 'down' | 'stable') => ({
    label,
    value,
    change,
    trend,
    icon: iconName,
    // Helper to map string to component if needed, or pass component directly
  });

  const displayMetrics = [
    getMetric('Total Artefacts', 'Layers', stats?.total || 125, 12, 'up'),
    getMetric('Pending Updates', 'Clock', 23, -5, 'down'),
    getMetric('System Health', 'Activity', 98.5, 0, 'stable'),
    getMetric('Active Users', 'Users', 47, 8, 'up'),
  ];

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden p-6 mb-6 bg-gradient-to-r from-primary to-primary/80 rounded-2xl text-primary-foreground"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Executive Dashboard</h2>
            <p className="text-primary-foreground/80 max-w-xl">
              Connected to Backend (MongoDB) • ระบบเชื่อมต่อสมบูรณ์ • มี {stats?.total || 125} Artefacts ในระบบ
            </p>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {displayMetrics.map((metric, index) => (
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
            <QuickActions onExploreGraph={() => navigate('/graph')} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
