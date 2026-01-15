import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layers, Clock, Activity, Users, Download, Grid, List } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { MaturityRadarChart, PillarDetails, RecentActivity, QuickStats } from '@/components/dashboard/MaturityRadarChart';
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

  const displayMetrics = [
    { label: 'Total Artefacts', value: stats?.total || 1284, change: 12, trend: 'up' as const, icon: 'Layers' },
    { label: 'Pending Updates', value: 23, change: -5, trend: 'down' as const, icon: 'Clock' },
    { label: 'System Health', value: 98.5, change: 0, trend: 'stable' as const, icon: 'Activity', suffix: '%' },
    { label: 'Active Users', value: 47, change: 8, trend: 'up' as const, icon: 'Users' },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>EA Repository</span>
            <span>›</span>
            <span>Executive Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground">Maturity Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm">Download Report</span>
          </button>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button className="p-2 bg-muted">
              <Grid className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-muted transition-colors">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Main Content */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayMetrics.map((metric, index) => (
              <MetricCard key={metric.label} {...metric} index={index} />
            ))}
          </div>

          {/* Maturity Radar Chart */}
          <MaturityRadarChart />

          {/* Pillar Details */}
          <PillarDetails />
        </div>

        {/* Right Column - Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Recent Activity */}
          <RecentActivity />

          {/* Quick Stats */}
          <QuickStats />
        </div>
      </div>
    </div>
  );
};

export default Index;
