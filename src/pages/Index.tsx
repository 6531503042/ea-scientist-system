import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layers, Clock, Activity, Users, Download, Grid, List, TrendingUp, Link, Database, Cpu, Shield, Briefcase } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { MaturityRadarChart, PillarDetails, RecentActivity, QuickStats } from '@/components/dashboard/MaturityRadarChart';
import { artefacts, relationships } from '@/data/mockData';

const Index = () => {
  const navigate = useNavigate();

  // Calculate real stats from mockData
  const stats = useMemo(() => {
    const total = artefacts.length;
    const byType = [
      { type: 'Business', count: artefacts.filter(a => a.type === 'business').length, icon: Briefcase, color: '#8B5CF6' },
      { type: 'Application', count: artefacts.filter(a => a.type === 'application').length, icon: Layers, color: '#0EA5E9' },
      { type: 'Data', count: artefacts.filter(a => a.type === 'data').length, icon: Database, color: '#14B8A6' },
      { type: 'Technology', count: artefacts.filter(a => a.type === 'technology').length, icon: Cpu, color: '#6366F1' },
      { type: 'Security', count: artefacts.filter(a => a.type === 'security').length, icon: Shield, color: '#F59E0B' },
      { type: 'Integration', count: artefacts.filter(a => a.type === 'integration').length, icon: Link, color: '#EC4899' },
    ];
    const totalRelationships = relationships.length;
    const activeCount = artefacts.filter(a => a.status === 'Active').length;
    const draftCount = artefacts.filter(a => a.status === 'Draft').length;

    return { total, byType, totalRelationships, activeCount, draftCount };
  }, []);

  const displayMetrics = [
    { label: 'Total Artefacts', value: stats.total, change: 0, trend: 'stable' as const, icon: 'Layers' },
    { label: 'Relationships', value: stats.totalRelationships, change: 0, trend: 'stable' as const, icon: 'Link' },
    { label: 'Active', value: stats.activeCount, change: 0, trend: 'stable' as const, icon: 'Activity' },
    { label: 'Draft', value: stats.draftCount, change: 0, trend: 'stable' as const, icon: 'Clock' },
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

          {/* Artefact Type Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 bg-card rounded-2xl border border-border shadow-sm"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Artefacts by Type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.byType.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.type}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="p-4 bg-muted/30 rounded-xl border border-border hover:border-primary/30 transition-all cursor-pointer group"
                    onClick={() => navigate('/graph')}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{item.count}</p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Maturity Radar Chart */}
          <MaturityRadarChart artefactsByType={stats.byType} />

          {/* Pillar Details */}
          <PillarDetails artefactsByType={stats.byType} />
        </div>

        {/* Right Column - Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Recent Activity */}
          <RecentActivity artefacts={artefacts} />

          {/* Quick Stats */}
          <QuickStats
            totalArtefacts={stats.total}
            totalRelationships={stats.totalRelationships}
            activeCount={stats.activeCount}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
