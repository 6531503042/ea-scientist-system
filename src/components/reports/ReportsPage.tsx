import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Layers,
  Users,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportTemplate {
  id: string;
  name: string;
  nameTh: string;
  description: string;
  icon: React.ElementType;
  category: 'summary' | 'detailed' | 'compliance';
  lastGenerated?: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    nameTh: 'รายงานสรุปผู้บริหาร',
    description: 'ภาพรวมสถาปัตยกรรมองค์กร ความเสี่ยง และ KPIs',
    icon: BarChart3,
    category: 'summary',
    lastGenerated: '2024-01-10',
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment',
    nameTh: 'รายงานการประเมินความเสี่ยง',
    description: 'วิเคราะห์ความเสี่ยงของระบบและ Artefacts ทั้งหมด',
    icon: AlertTriangle,
    category: 'detailed',
    lastGenerated: '2024-01-08',
  },
  {
    id: 'coverage-analysis',
    name: 'Coverage Analysis',
    nameTh: 'รายงานความครอบคลุมภารกิจ',
    description: 'วิเคราะห์ความครอบคลุมของระบบต่อภารกิจองค์กร',
    icon: PieChart,
    category: 'summary',
    lastGenerated: '2024-01-05',
  },
  {
    id: 'dependency-map',
    name: 'Dependency Map',
    nameTh: 'รายงานความสัมพันธ์ระบบ',
    description: 'แผนผังความสัมพันธ์ระหว่าง Artefacts ทั้งหมด',
    icon: Layers,
    category: 'detailed',
  },
  {
    id: 'change-log',
    name: 'Change Log',
    nameTh: 'รายงานการเปลี่ยนแปลง',
    description: 'ประวัติการเปลี่ยนแปลงทั้งหมดในช่วงเวลาที่กำหนด',
    icon: Clock,
    category: 'detailed',
    lastGenerated: '2024-01-12',
  },
  {
    id: 'compliance-report',
    name: 'Compliance Report',
    nameTh: 'รายงานการปฏิบัติตามมาตรฐาน',
    description: 'ตรวจสอบความสอดคล้องกับมาตรฐาน EA ที่กำหนด',
    icon: Shield,
    category: 'compliance',
  },
  {
    id: 'owner-report',
    name: 'Owner Report',
    nameTh: 'รายงานผู้รับผิดชอบ',
    description: 'สรุป Artefacts ตามผู้รับผิดชอบและหน่วยงาน',
    icon: Users,
    category: 'summary',
  },
  {
    id: 'trend-analysis',
    name: 'Trend Analysis',
    nameTh: 'รายงานแนวโน้ม',
    description: 'วิเคราะห์แนวโน้มการเปลี่ยนแปลงในระยะยาว',
    icon: TrendingUp,
    category: 'detailed',
  },
];

const recentReports = [
  { name: 'Executive Summary - ม.ค. 2567', date: '2024-01-10', status: 'ready', size: '2.4 MB' },
  { name: 'Risk Assessment Q4/2566', date: '2024-01-08', status: 'ready', size: '1.8 MB' },
  { name: 'Coverage Analysis - ธ.ค. 2566', date: '2024-01-05', status: 'ready', size: '3.1 MB' },
  { name: 'Change Log - สัปดาห์ที่ 1', date: '2024-01-12', status: 'generating', size: '-' },
];

export function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'summary' | 'detailed' | 'compliance'>('all');
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const filteredTemplates = reportTemplates.filter(
    t => selectedCategory === 'all' || t.category === selectedCategory
  );

  const handleGenerateReport = (reportId: string) => {
    setGeneratingReport(reportId);
    // Simulate generation
    setTimeout(() => setGeneratingReport(null), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">รายงาน</h2>
        <p className="text-muted-foreground">สร้างและดาวน์โหลดรายงานสถาปัตยกรรมองค์กร</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-card rounded-xl border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">24</p>
              <p className="text-sm text-muted-foreground">รายงานที่สร้างแล้ว</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-card rounded-xl border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-info/10">
              <Calendar className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">ม.ค. 2567</p>
              <p className="text-sm text-muted-foreground">รายงานล่าสุด</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-card rounded-xl border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">8</p>
              <p className="text-sm text-muted-foreground">เทมเพลตรายงาน</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Templates */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">เทมเพลตรายงาน</h3>
            <div className="flex items-center gap-2">
              {(['all', 'summary', 'detailed', 'compliance'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-lg transition-colors",
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  )}
                >
                  {cat === 'all' ? 'ทั้งหมด' : cat === 'summary' ? 'สรุป' : cat === 'detailed' ? 'รายละเอียด' : 'Compliance'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template, index) => {
              const Icon = template.icon;
              const isGenerating = generatingReport === template.id;
              
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-card rounded-xl border border-border hover:shadow-card-hover transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground">{template.nameTh}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                      {template.lastGenerated && (
                        <p className="text-xs text-muted-foreground mt-2">
                          สร้างล่าสุด: {template.lastGenerated}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGenerateReport(template.id)}
                      disabled={isGenerating}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isGenerating
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          กำลังสร้าง...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          สร้างรายงาน
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">รายงานล่าสุด</h3>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {recentReports.map((report, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{report.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{report.date}</p>
                    </div>
                    {report.status === 'ready' ? (
                      <button className="flex items-center gap-1 px-2 py-1 text-xs bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors">
                        <Download className="w-3 h-3" />
                        {report.size}
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 text-xs bg-warning/10 text-warning rounded-lg">
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        กำลังสร้าง
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Schedule Report */}
          <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20">
            <h4 className="font-medium text-foreground mb-2">📅 ตั้งเวลาสร้างรายงานอัตโนมัติ</h4>
            <p className="text-sm text-muted-foreground mb-3">
              ให้ระบบสร้างรายงานให้อัตโนมัติทุกสัปดาห์/เดือน
            </p>
            <button className="w-full px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              ตั้งค่า Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
