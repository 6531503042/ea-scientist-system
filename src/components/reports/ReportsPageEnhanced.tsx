import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Shield,
  Eye,
  Printer,
  Share2,
  FolderOpen,
  ChevronRight,
  Plus,
  Settings
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
  color: string;
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
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment',
    nameTh: 'รายงานการประเมินความเสี่ยง',
    description: 'วิเคราะห์ความเสี่ยงของระบบและ Artefacts ทั้งหมด',
    icon: AlertTriangle,
    category: 'detailed',
    lastGenerated: '2024-01-08',
    color: 'bg-destructive/10 text-destructive',
  },
  {
    id: 'coverage-analysis',
    name: 'Coverage Analysis',
    nameTh: 'รายงานความครอบคลุมภารกิจ',
    description: 'วิเคราะห์ความครอบคลุมของระบบต่อภารกิจองค์กร',
    icon: PieChart,
    category: 'summary',
    lastGenerated: '2024-01-05',
    color: 'bg-success/10 text-success',
  },
  {
    id: 'dependency-map',
    name: 'Dependency Map',
    nameTh: 'รายงานความสัมพันธ์ระบบ',
    description: 'แผนผังความสัมพันธ์ระหว่าง Artefacts ทั้งหมด',
    icon: Layers,
    category: 'detailed',
    color: 'bg-info/10 text-info',
  },
  {
    id: 'change-log',
    name: 'Change Log',
    nameTh: 'รายงานการเปลี่ยนแปลง',
    description: 'ประวัติการเปลี่ยนแปลงทั้งหมดในช่วงเวลาที่กำหนด',
    icon: Clock,
    category: 'detailed',
    lastGenerated: '2024-01-12',
    color: 'bg-warning/10 text-warning',
  },
  {
    id: 'compliance-report',
    name: 'Compliance Report',
    nameTh: 'รายงานการปฏิบัติตามมาตรฐาน',
    description: 'ตรวจสอบความสอดคล้องกับมาตรฐาน EA ที่กำหนด',
    icon: Shield,
    category: 'compliance',
    color: 'bg-accent/10 text-accent',
  },
];

const recentReports = [
  { name: 'Executive Summary - ม.ค. 2567', date: '10 ม.ค. 2567', status: 'ready', size: '2.4 MB', type: 'PDF' },
  { name: 'Risk Assessment Q4/2566', date: '8 ม.ค. 2567', status: 'ready', size: '1.8 MB', type: 'PDF' },
  { name: 'Coverage Analysis - ธ.ค. 2566', date: '5 ม.ค. 2567', status: 'ready', size: '3.1 MB', type: 'XLSX' },
  { name: 'Change Log - สัปดาห์ที่ 1', date: '12 ม.ค. 2567', status: 'generating', size: '-', type: 'PDF' },
];

const categoryLabels = {
  summary: { label: 'รายงานสรุป', icon: FileText, color: 'bg-primary/10 text-primary' },
  detailed: { label: 'รายงานละเอียด', icon: BarChart3, color: 'bg-info/10 text-info' },
  compliance: { label: 'Compliance', icon: Shield, color: 'bg-success/10 text-success' },
};

export function ReportsPageEnhanced() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'summary' | 'detailed' | 'compliance'>('all');
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [previewReport, setPreviewReport] = useState<ReportTemplate | null>(null);

  const filteredTemplates = reportTemplates.filter(
    t => selectedCategory === 'all' || t.category === selectedCategory
  );

  const handleGenerateReport = (reportId: string) => {
    setGeneratingReport(reportId);
    setTimeout(() => setGeneratingReport(null), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">รายงาน</h2>
          <p className="text-muted-foreground">สร้างและจัดการรายงานสถาปัตยกรรมองค์กร</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-muted hover:bg-muted/80 font-medium rounded-xl transition-colors"
          >
            <Settings className="w-4 h-4" />
            ตั้งค่า Schedule
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            สร้างรายงานใหม่
          </motion.button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'รายงานที่สร้างแล้ว', value: 24, icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
          { label: 'รายงานเดือนนี้', value: 8, icon: Calendar, color: 'text-info', bg: 'bg-info/10' },
          { label: 'เทมเพลตทั้งหมด', value: 6, icon: FileText, color: 'text-accent', bg: 'bg-accent/10' },
          { label: 'กำลังสร้าง', value: 1, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 bg-card rounded-xl border border-border"
          >
            <div className="flex items-center gap-4">
              <div className={cn("flex items-center justify-center w-12 h-12 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Templates */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-lg">เทมเพลตรายงาน</h3>
            <div className="flex items-center gap-1 p-1 bg-muted rounded-xl">
              {(['all', 'summary', 'detailed', 'compliance'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                    selectedCategory === cat
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
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
                  className="p-5 bg-card rounded-xl border border-border hover:shadow-lg hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("flex items-center justify-center w-12 h-12 rounded-xl", template.color)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {template.nameTh}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {template.description}
                      </p>
                      {template.lastGenerated && (
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
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
                        "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors",
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
                    <button
                      onClick={() => setPreviewReport(template)}
                      className="p-2.5 rounded-xl border border-border hover:bg-muted transition-colors"
                    >
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Recent Reports */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">รายงานล่าสุด</h3>
                <button className="text-sm text-primary hover:underline">ดูทั้งหมด</button>
              </div>
            </div>
            <div className="divide-y divide-border">
              {recentReports.map((report, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0",
                      report.type === 'PDF' ? "bg-destructive/10" : "bg-success/10"
                    )}>
                      <FileText className={cn(
                        "w-5 h-5",
                        report.type === 'PDF' ? "text-destructive" : "text-success"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{report.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{report.date}</p>
                    </div>
                    {report.status === 'ready' ? (
                      <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Share2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
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

          {/* Quick Actions */}
          <div className="p-5 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-xl border border-primary/20">
            <h4 className="font-semibold text-foreground mb-4">📋 การดำเนินการด่วน</h4>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-card/80 hover:bg-card rounded-lg transition-colors">
                <span className="text-sm text-foreground">สร้างรายงานประจำสัปดาห์</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-card/80 hover:bg-card rounded-lg transition-colors">
                <span className="text-sm text-foreground">ตั้งเวลาสร้างอัตโนมัติ</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-card/80 hover:bg-card rounded-lg transition-colors">
                <span className="text-sm text-foreground">ดาวน์โหลดทั้งหมด</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Storage Info */}
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-3">
              <FolderOpen className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">พื้นที่จัดเก็บ</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[35%] bg-primary rounded-full" />
              </div>
              <p className="text-sm text-muted-foreground">
                ใช้ไป 3.5 GB จาก 10 GB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setPreviewReport(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={cn("flex items-center justify-center w-14 h-14 rounded-xl", previewReport.color)}>
                  <previewReport.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{previewReport.nameTh}</h3>
                  <p className="text-sm text-muted-foreground">{previewReport.name}</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">{previewReport.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">ประเภท</span>
                  <span className="text-sm font-medium text-foreground">
                    {categoryLabels[previewReport.category].label}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">รูปแบบไฟล์</span>
                  <span className="text-sm font-medium text-foreground">PDF, XLSX</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">สร้างล่าสุด</span>
                  <span className="text-sm font-medium text-foreground">
                    {previewReport.lastGenerated || 'ยังไม่เคยสร้าง'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setPreviewReport(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-border hover:bg-muted transition-colors"
                >
                  ปิด
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleGenerateReport(previewReport.id);
                    setPreviewReport(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  สร้างรายงาน
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
