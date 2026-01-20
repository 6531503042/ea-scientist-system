import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
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
    <div className="flex flex-col h-full">
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 space-y-4 pb-4">
        {/* Top Row: Title + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
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

        {/* Filter Tabs (Mobile scrollable) */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 min-w-max pb-2 sm:pb-0">
            <button
              onClick={() => setSelectedType(null)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                selectedType === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
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
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    selectedType === type
                      ? `${colors.bg} ${colors.text} ${colors.border} border`
                      : "bg-muted text-foreground hover:bg-muted/80"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{togafLabels[type].th}</span>
                  <span className="md:hidden">{typeLabels[type]?.th || type}</span>
                  ({count})
                </button>
              );
            })}
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
              className="w-full h-10 pl-10 pr-4 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                "p-2 rounded transition-colors",
                viewMode === 'list' ? "bg-card shadow-sm" : "hover:bg-card/50"
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded transition-colors",
                viewMode === 'grid' ? "bg-card shadow-sm" : "hover:bg-card/50"
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Summary - Horizontal */}
        <div className="flex items-center gap-4 text-sm">
          {Object.entries(statusCounts).map(([status, count]) => {
            const config = statusConfig[status];
            return (
              <div key={status} className="flex items-center gap-1.5">
                <span className={cn("px-2 py-0.5 rounded-full text-xs", config.color)}>
                  {config.label}
                </span>
                <span className="font-medium text-foreground">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-auto min-h-0">
        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-4">
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
                      "group relative bg-card rounded-xl border border-border p-4 cursor-pointer",
                      "hover:border-primary/30 hover:shadow-lg transition-all duration-200"
                    )}
                  >
                    {/* Type indicator */}
                    <div className={cn(
                      "absolute top-0 left-4 w-8 h-1 rounded-b",
                      colors.text.replace('text-', 'bg-')
                    )} />

                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0",
                        colors.bg
                      )}>
                        <TypeIcon className={cn("w-5 h-5", colors.text)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{artefact.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{artefact.nameTh}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {artefact.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className={cn("px-2 py-0.5 text-xs rounded-full", status.color)}>
                        {status.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{artefact.lastUpdated}</span>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditArtefact(artefact);
                        }}
                        className="p-1.5 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setVersionHistoryArtefact(artefact);
                        }}
                        className="p-1.5 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
                      >
                        <History className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* List View */
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Table Header - Hidden on mobile */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 border-b text-sm font-medium text-muted-foreground">
              <div className="col-span-4">ชื่อ Artefact</div>
              <div className="col-span-2">ประเภท</div>
              <div className="col-span-2">สถานะ</div>
              <div className="col-span-2">ผู้รับผิดชอบ</div>
              <div className="col-span-2 text-right">การดำเนินการ</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border">
              <AnimatePresence>
                {filteredArtefacts.map((artefact, index) => {
                  const TypeIcon = typeIcons[artefact.type];
                  const colors = typeColors[artefact.type];
                  const status = statusConfig[artefact.status];

                  return (
                    <motion.div
                      key={artefact.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => setSelectedArtefact(artefact)}
                      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3 hover:bg-muted/30 cursor-pointer transition-colors group"
                    >
                      {/* Name - Always visible */}
                      <div className="md:col-span-4 flex items-center gap-3">
                        <div className={cn(
                          "flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0",
                          colors.bg
                        )}>
                          <TypeIcon className={cn("w-4 h-4", colors.text)} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">{artefact.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{artefact.nameTh}</p>
                        </div>
                      </div>

                      {/* Type - Hidden on mobile */}
                      <div className="hidden md:flex md:col-span-2 items-center">
                        <span className={cn("px-2 py-1 text-xs rounded-full", colors.bg, colors.text)}>
                          {togafLabels[artefact.type].th}
                        </span>
                      </div>

                      {/* Status - Inline on mobile */}
                      <div className="md:col-span-2 flex items-center">
                        <span className={cn("px-2 py-1 text-xs rounded-full", status.color)}>
                          {status.label}
                        </span>
                        {/* Mobile: Show type inline */}
                        <span className={cn("md:hidden ml-2 px-2 py-0.5 text-xs rounded-full", colors.bg, colors.text)}>
                          {typeLabels[artefact.type]?.th}
                        </span>
                      </div>

                      {/* Owner - Hidden on mobile */}
                      <div className="hidden md:flex md:col-span-2 items-center">
                        <span className="text-sm text-muted-foreground truncate">{artefact.owner}</span>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-2 flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedArtefact(artefact);
                          }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="ดูรายละเอียด"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditArtefact(artefact);
                          }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="แก้ไข"
                        >
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setVersionHistoryArtefact(artefact);
                          }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="ประวัติ"
                        >
                          <History className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Delete action
                          }}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredArtefacts.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">ไม่พบ Artefact</h3>
                <p className="text-sm text-muted-foreground">ลองค้นหาด้วยคำอื่น หรือเปลี่ยนตัวกรอง</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ArtefactDetailModal
        artefact={selectedArtefact}
        onClose={() => setSelectedArtefact(null)}
      />

      <CreateArtefactModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => {
          console.log('Create artefact:', data);
          setIsCreateModalOpen(false);
        }}
      />

      <EditArtefactModal
        artefact={editArtefact}
        onClose={() => setEditArtefact(null)}
        onSubmit={(data) => {
          console.log('Update artefact:', data);
          setEditArtefact(null);
        }}
      />

      <ExportImportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        mode="export"
      />

      <ExportImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        mode="import"
      />

      <VersionHistoryDrawer
        artefactId={versionHistoryArtefact?.id || null}
        onClose={() => setVersionHistoryArtefact(null)}
      />
    </div>
  );
}
