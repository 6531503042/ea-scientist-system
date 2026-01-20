import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  ChevronDown,
  Layers,
  Database,
  Cpu,
  Link,
  Shield,
  Briefcase,
  Grid,
  List,
  Upload,
  LayoutGrid,
  Clock,
  User,
  History,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { artefacts, typeLabels, type Artefact, type ArtefactType } from '@/data/mockData';
import { ArtefactDetailModal } from './ArtefactDetailModal';
import { CreateArtefactModal } from './CreateArtefactModal';
import { EditArtefactModal } from './EditArtefactModal';
import { ExportImportModal } from './ExportImportModal';
import { VersionHistoryDrawer } from './VersionHistoryDrawer';

const typeIcons: Record<ArtefactType, React.ElementType> = {
  business: Briefcase,
  application: Layers,
  data: Database,
  technology: Cpu,
  security: Shield,
  integration: Link,
};

// TOGAF Order - Business → Application → Data → Technology → Security → Integration
const togafOrder: ArtefactType[] = ['business', 'application', 'data', 'technology', 'security', 'integration'];

const typeColors: Record<ArtefactType, { bg: string; text: string; border: string; light: string }> = {
  business: { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500/30', light: 'bg-violet-50' },
  application: { bg: 'bg-sky-500/10', text: 'text-sky-500', border: 'border-sky-500/30', light: 'bg-sky-50' },
  data: { bg: 'bg-teal-500/10', text: 'text-teal-500', border: 'border-teal-500/30', light: 'bg-teal-50' },
  technology: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/30', light: 'bg-indigo-50' },
  security: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30', light: 'bg-amber-50' },
  integration: { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/30', light: 'bg-pink-50' },
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  active: { label: 'ใช้งาน', color: 'bg-success/10 text-success', icon: Eye },
  draft: { label: 'ร่าง', color: 'bg-warning/10 text-warning', icon: Edit },
  deprecated: { label: 'ยกเลิก', color: 'bg-muted text-muted-foreground', icon: Clock },
  planned: { label: 'วางแผน', color: 'bg-info/10 text-info', icon: Clock },
};

// Full labels following TOGAF
const togafLabels: Record<ArtefactType, { en: string; th: string; description: string }> = {
  business: {
    en: 'Business Architecture',
    th: 'สถาปัตยกรรมธุรกิจ',
    description: 'กระบวนการ, กลยุทธ์, โครงสร้างองค์กร'
  },
  application: {
    en: 'Application Architecture',
    th: 'สถาปัตยกรรมแอปพลิเคชัน',
    description: 'ระบบซอฟต์แวร์และแอปพลิเคชัน'
  },
  data: {
    en: 'Data Architecture',
    th: 'สถาปัตยกรรมข้อมูล',
    description: 'โครงสร้างข้อมูลและการจัดการ'
  },
  technology: {
    en: 'Technology Architecture',
    th: 'สถาปัตยกรรมเทคโนโลยี',
    description: 'โครงสร้างพื้นฐาน IT'
  },
  security: {
    en: 'Security Architecture',
    th: 'สถาปัตยกรรมความปลอดภัย',
    description: 'การรักษาความปลอดภัย'
  },
  integration: {
    en: 'Integration Architecture',
    th: 'สถาปัตยกรรมการเชื่อมต่อ',
    description: 'การเชื่อมต่อระบบ API'
  },
};

export function ArtefactListEnhanced() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ArtefactType | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'updated'>('type');
  const [selectedArtefact, setSelectedArtefact] = useState<Artefact | null>(null);
  const [editArtefact, setEditArtefact] = useState<Artefact | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [versionHistoryArtefact, setVersionHistoryArtefact] = useState<Artefact | null>(null);
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel');

  const filteredArtefacts = useMemo(() => {
    let result = [...artefacts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.nameTh.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
      );
    }

    if (selectedType) {
      result = result.filter(a => a.type === selectedType);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return togafOrder.indexOf(a.type) - togafOrder.indexOf(b.type);
        case 'updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, selectedType, sortBy]);

  const artefactCounts = useMemo(() => {
    const counts: Record<ArtefactType, number> = {
      business: 0, application: 0, data: 0, technology: 0, security: 0, integration: 0
    };
    artefacts.forEach(a => counts[a.type]++);
    return counts;
  }, []);

  const statusCounts = useMemo(() => {
    return {
      active: artefacts.filter(a => a.status === 'active').length,
      draft: artefacts.filter(a => a.status === 'draft').length,
      deprecated: artefacts.filter(a => a.status === 'deprecated').length,
      planned: artefacts.filter(a => a.status === 'planned').length,
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Mobile Type Filter (visible only on mobile) */}
      <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedType(null)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
              selectedType === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            ทั้งหมด ({artefacts.length})
          </button>
          {togafOrder.map((type) => {
            const Icon = typeIcons[type];
            const count = artefactCounts[type];
            const colors = typeColors[type];
            return (
              <button
                key={type}
                onClick={() => setSelectedType(selectedType === type ? null : type)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
                  selectedType === type
                    ? `${colors.bg} ${colors.text}`
                    : "bg-muted text-foreground"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {togafLabels[type].th} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar - Hidden on mobile, visible on tablet and up */}
      <div className="hidden md:block flex-shrink-0 w-full md:w-56 lg:w-64 space-y-4">

        {/* Type Filter */}
        <div className="bg-card rounded-xl border border-border p-3">
          <h3 className="font-semibold text-foreground mb-1 text-sm">ประเภท Artefact</h3>
          <p className="text-xs text-muted-foreground mb-3">เรียงตามมาตรฐาน TOGAF</p>

          <div className="space-y-1">
            {/* All button */}
            <button
              onClick={() => setSelectedType(null)}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors",
                selectedType === null
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              )}
            >
              <LayoutGrid className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left font-medium">ทั้งหมด</span>
              <span className={cn(
                "px-2 py-0.5 text-xs rounded-full",
                selectedType === null ? "bg-primary-foreground/20" : "bg-muted"
              )}>
                {artefacts.length}
              </span>
            </button>

            {togafOrder.map((type) => {
              const Icon = typeIcons[type];
              const count = artefactCounts[type];
              const colors = typeColors[type];
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-all",
                    selectedType === type
                      ? `${colors.bg} ${colors.text} ${colors.border} border`
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center flex-shrink-0",
                    selectedType === type ? colors.bg : "bg-muted"
                  )}>
                    <Icon className={cn("w-3.5 h-3.5", selectedType === type ? colors.text : "text-muted-foreground")} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="block text-xs font-medium">{togafLabels[type].th}</span>
                  </div>
                  <span className={cn(
                    "px-1.5 py-0.5 text-xs rounded-full min-w-[24px] text-center",
                    selectedType === type ? `${colors.bg} ${colors.text}` : "bg-muted text-muted-foreground"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Summary */}
        <div className="bg-card rounded-xl border border-border p-3">
          <h3 className="font-semibold text-foreground mb-3 text-sm">สถานะ</h3>
          <div className="space-y-2">
            {Object.entries(statusCounts).map(([status, count]) => {
              const config = statusConfig[status];
              return (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs", config.color)}>
                    {config.label}
                  </span>
                  <span className="font-medium text-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span>ระบบสถาปัตยกรรมองค์กร</span>
              <span>›</span>
              <span>Artefacts</span>
              {selectedType && (
                <>
                  <span>›</span>
                  <span className={typeColors[selectedType].text}>{togafLabels[selectedType].th}</span>
                </>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {selectedType ? togafLabels[selectedType].th : 'Artefacts ทั้งหมด'}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {selectedType ? togafLabels[selectedType].description : `แสดง ${filteredArtefacts.length} รายการ`}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Export Buttons with Icons */}
            <button
              onClick={() => {
                setExportFormat('excel');
                setIsExportModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-border bg-card hover:bg-muted rounded-lg transition-colors"
              title="ส่งออก Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-600" />
              <span className="hidden sm:inline">Excel</span>
            </button>
            <button
              onClick={() => {
                setExportFormat('pdf');
                setIsExportModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-border bg-card hover:bg-muted rounded-lg transition-colors"
              title="ส่งออก PDF"
            >
              <FileText className="w-4 h-4 text-red-600" />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-border bg-card hover:bg-muted rounded-lg transition-colors"
              title="นำเข้า"
            >
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="hidden sm:inline">นำเข้า</span>
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">เพิ่ม Artefact</span>
              <span className="sm:hidden">เพิ่ม</span>
            </motion.button>
          </div>
        </div>

        {/* Search & Controls */}
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[150px] sm:min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ค้นหา Artefact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 sm:h-10 pl-10 pr-4 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-10 pl-3 pr-8 text-sm bg-card border border-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="type">เรียงตาม TOGAF</option>
              <option value="name">เรียงตามชื่อ</option>
              <option value="updated">เรียงตามวันที่</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1.5 rounded transition-colors",
                viewMode === 'list' ? "bg-card shadow-sm" : "hover:bg-card/50"
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded transition-colors",
                viewMode === 'grid' ? "bg-card shadow-sm" : "hover:bg-card/50"
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            <AnimatePresence>
              {filteredArtefacts.map((artefact, index) => {
                const TypeIcon = typeIcons[artefact.type];
                const colors = typeColors[artefact.type];
                const status = statusConfig[artefact.status];

                return (
                  <motion.div
                    key={artefact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => setSelectedArtefact(artefact)}
                    className={cn(
                      "bg-card border rounded-xl p-4 cursor-pointer hover:shadow-md transition-all",
                      colors.border
                    )}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.bg)}>
                        <TypeIcon className={cn("w-5 h-5", colors.text)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{artefact.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{artefact.nameTh}</p>
                      </div>
                      <span className={cn("px-2 py-0.5 text-xs rounded-full", status.color)}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{artefact.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate max-w-[100px]">{artefact.owner}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{artefact.lastUpdated}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* List View - Scrollable on mobile */
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Artefact</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ประเภท</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">สถานะ</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">เจ้าของ</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Version</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">อัปเดต</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredArtefacts.map((artefact, index) => {
                      const TypeIcon = typeIcons[artefact.type];
                      const colors = typeColors[artefact.type];
                      const status = statusConfig[artefact.status];

                      return (
                        <motion.tr
                          key={artefact.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.02 }}
                          className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => setSelectedArtefact(artefact)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg", colors.bg)}>
                                <TypeIcon className={cn("w-4 h-4", colors.text)} />
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">{artefact.name}</p>
                                <p className="text-xs text-muted-foreground">{artefact.nameTh}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn("text-xs px-2 py-1 rounded-lg", colors.bg, colors.text)}>
                              {togafLabels[artefact.type].th}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn("px-2 py-1 text-xs font-medium rounded-full", status.color)}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-foreground">{artefact.owner}</p>
                            <p className="text-xs text-muted-foreground">{artefact.department}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-muted-foreground">v{artefact.version}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-muted-foreground">{artefact.lastUpdated}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setSelectedArtefact(artefact)}
                                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                                title="ดูรายละเอียด"
                              >
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => setVersionHistoryArtefact(artefact)}
                                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                                title="ประวัติเวอร์ชัน"
                              >
                                <History className="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => setEditArtefact(artefact)}
                                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                                title="แก้ไข"
                              >
                                <Edit className="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button
                                className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
                                title="ลบ"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {filteredArtefacts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground">ไม่พบ Artefact</p>
                <p className="text-sm text-muted-foreground">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <ArtefactDetailModal
        artefact={selectedArtefact}
        onClose={() => setSelectedArtefact(null)}
      />

      {/* Create Modal */}
      <CreateArtefactModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => {
          console.log('Create artefact:', data);
          setIsCreateModalOpen(false);
        }}
      />

      {/* Edit Modal */}
      {editArtefact && (
        <EditArtefactModal
          artefact={editArtefact}
          onClose={() => setEditArtefact(null)}
          onSubmit={(data) => {
            console.log('Update artefact:', data);
            setEditArtefact(null);
          }}
        />
      )}

      {/* Export Modal */}
      <ExportImportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        mode="export"
      />

      {/* Import Modal */}
      <ExportImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        mode="import"
      />

      {/* Version History Drawer */}
      <VersionHistoryDrawer
        isOpen={!!versionHistoryArtefact}
        onClose={() => setVersionHistoryArtefact(null)}
        artefactId={versionHistoryArtefact?.id || ''}
        artefactName={versionHistoryArtefact?.name || ''}
      />
    </div>
  );
}
