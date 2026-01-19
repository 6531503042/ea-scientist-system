import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Clock,
  Activity,
  Database,
  Cpu,
  Shield,
  Briefcase,
  Link,
  Users,
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  GitBranch
} from 'lucide-react';
import { artefacts, relationships, typeLabels } from '@/data/mockData';

// TOGAF ordered types
const togafOrder = ['business', 'application', 'data', 'technology', 'security', 'integration'] as const;

const typeIcons = {
  business: Briefcase,
  application: Layers,
  data: Database,
  technology: Cpu,
  security: Shield,
  integration: Link,
};

const typeColors = {
  business: { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500/30' },
  application: { bg: 'bg-sky-500/10', text: 'text-sky-500', border: 'border-sky-500/30' },
  data: { bg: 'bg-teal-500/10', text: 'text-teal-500', border: 'border-teal-500/30' },
  technology: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/30' },
  security: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' },
  integration: { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/30' },
};

const togafLabels = {
  business: { en: 'Business Architecture', th: 'สถาปัตยกรรมธุรกิจ' },
  application: { en: 'Application Architecture', th: 'สถาปัตยกรรมแอปพลิเคชัน' },
  data: { en: 'Data Architecture', th: 'สถาปัตยกรรมข้อมูล' },
  technology: { en: 'Technology Architecture', th: 'สถาปัตยกรรมเทคโนโลยี' },
  security: { en: 'Security Architecture', th: 'สถาปัตยกรรมความปลอดภัย' },
  integration: { en: 'Integration Architecture', th: 'สถาปัตยกรรมการเชื่อมต่อ' },
};

const Index = () => {
  const navigate = useNavigate();

  // Calculate real stats from mockData
  const stats = useMemo(() => {
    const total = artefacts.length;
    const byType = togafOrder.map(type => ({
      type,
      count: artefacts.filter(a => a.type === type).length,
      icon: typeIcons[type],
      colors: typeColors[type],
      label: togafLabels[type],
    }));
    const totalRelationships = relationships.length;
    const activeCount = artefacts.filter(a => a.status === 'active').length;
    const draftCount = artefacts.filter(a => a.status === 'draft').length;
    const deprecatedCount = artefacts.filter(a => a.status === 'deprecated').length;
    const plannedCount = artefacts.filter(a => a.status === 'planned').length;

    // Calculate coverage per type
    const coverageScore = Math.round((activeCount / total) * 100);

    return { total, byType, totalRelationships, activeCount, draftCount, deprecatedCount, plannedCount, coverageScore };
  }, []);

  // Recent activities
  const recentActivities = useMemo(() => {
    return artefacts
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 5)
      .map(a => ({
        name: a.nameTh || a.name,
        type: a.type,
        status: a.status,
        owner: a.owner,
        date: a.lastUpdated,
      }));
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <span>ระบบสถาปัตยกรรมองค์กร</span>
          <span>›</span>
          <span>Dashboard</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">ภาพรวมสถาปัตยกรรมองค์กร</h1>
        <p className="text-sm text-muted-foreground mt-1">
          กรมวิทยาศาสตร์บริการ - Enterprise Architecture Dashboard
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Artefacts ทั้งหมด</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalRelationships}</p>
              <p className="text-xs text-muted-foreground">ความสัมพันธ์</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.activeCount}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.coverageScore}%</p>
              <p className="text-xs text-muted-foreground">Coverage</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* TOGAF Architecture Layers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">สถาปัตยกรรมตามมาตรฐาน TOGAF</h2>
                <p className="text-xs text-muted-foreground">แบ่งตามประเภท Architecture</p>
              </div>
              <button
                onClick={() => navigate('/artefacts')}
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                ดูทั้งหมด
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stats.byType.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.type}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                    onClick={() => navigate('/artefacts')}
                    className={`p-4 rounded-xl border ${item.colors.border} ${item.colors.bg} hover:shadow-md transition-all text-left group`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg ${item.colors.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${item.colors.text}`} />
                      </div>
                      <span className="text-2xl font-bold text-foreground">{item.count}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-0.5">{item.label.th}</p>
                    <p className="text-xs text-muted-foreground">{item.label.en}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Coverage Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">สถานะ Artefacts</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Active</span>
                  <span className="font-medium text-success">{stats.activeCount}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.activeCount / stats.total) * 100}%` }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="h-full bg-success rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Draft</span>
                  <span className="font-medium text-warning">{stats.draftCount}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.draftCount / stats.total) * 100}%` }}
                    transition={{ delay: 0.45, duration: 0.6 }}
                    className="h-full bg-warning rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Planned</span>
                  <span className="font-medium text-info">{stats.plannedCount}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.plannedCount / stats.total) * 100}%` }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="h-full bg-info rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Deprecated</span>
                  <span className="font-medium text-muted-foreground">{stats.deprecatedCount}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.deprecatedCount / stats.total) * 100}%` }}
                    transition={{ delay: 0.55, duration: 0.6 }}
                    className="h-full bg-muted-foreground rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <h3 className="font-semibold text-foreground mb-3">เมนูด่วน</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/artefacts')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">จัดการ Artefacts</p>
                  <p className="text-xs text-muted-foreground">ดู, เพิ่ม, แก้ไข Artefacts</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/graph')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                  <GitBranch className="w-4 h-4 text-info" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">แผนผังสถาปัตยกรรม</p>
                  <p className="text-xs text-muted-foreground">ดูความสัมพันธ์แบบ Graph</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/reports')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">รายงาน</p>
                  <p className="text-xs text-muted-foreground">ดาวน์โหลดรายงาน EA</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/users')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">ผู้ใช้งาน</p>
                  <p className="text-xs text-muted-foreground">จัดการผู้ใช้และสิทธิ์</p>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">กิจกรรมล่าสุด</h3>
              <button className="text-xs text-primary hover:underline">ดูทั้งหมด</button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => {
                const Icon = typeIcons[activity.type as keyof typeof typeIcons];
                const colors = typeColors[activity.type as keyof typeof typeColors];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.owner} • {activity.date}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${activity.status === 'active' ? 'bg-success/10 text-success' :
                        activity.status === 'draft' ? 'bg-warning/10 text-warning' :
                          'bg-muted text-muted-foreground'
                      }`}>
                      {activity.status}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* System Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-gradient-to-br from-primary/10 to-info/10 border border-primary/20 rounded-xl p-4"
          >
            <h3 className="font-semibold text-foreground mb-2">เกี่ยวกับระบบ</h3>
            <p className="text-xs text-muted-foreground mb-3">
              ระบบจัดการสถาปัตยกรรมองค์กรของกรมวิทยาศาสตร์บริการ พัฒนาตามมาตรฐาน TOGAF Framework
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-0.5 bg-background/50 rounded">TOGAF 10</span>
              <span className="px-2 py-0.5 bg-background/50 rounded">DSS</span>
              <span className="px-2 py-0.5 bg-background/50 rounded">v1.0</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
