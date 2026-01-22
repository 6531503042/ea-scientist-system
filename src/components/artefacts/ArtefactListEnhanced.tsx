import { useState, useMemo, useRef, useEffect } from 'react';
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
  FileText,
  Download
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
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close export menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="flex flex-col h-full bg-background/95">
      {/* Header Section */}
      <div className="flex-shrink-0 border-b bg-card px-4 py-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {selectedType ? togafLabels[selectedType].th : 'Artefacts ทั้งหมด'}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {selectedType ? togafLabels[selectedType].description : `แสดง ${filteredArtefacts.length} รายการ`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Export Dropdown */}
            <div ref={exportMenuRef} className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm border border-border bg-card hover:bg-muted rounded-lg transition-colors"
                title="ส่งออกข้อมูล"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">ส่งออก</span>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showExportMenu && "rotate-180")} />
              </button>
              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-1 w-44 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        setExportFormat('excel');
                        setIsExportModalOpen(true);
                        setShowExportMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-green-600" />
                      <div>
                        <span className="font-medium">Excel (.xlsx)</span>
                        <p className="text-xs text-muted-foreground">ส่งออกเป็น Spreadsheet</p>
                      </div>
                    </button>
                    <div className="border-t border-border" />
                    <button
                      onClick={() => {
                        setExportFormat('pdf');
                        setIsExportModalOpen(true);
                        setShowExportMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                    >
                      <FileText className="w-4 h-4 text-red-600" />
                      <div>
                        <span className="font-medium">PDF (.pdf)</span>
                        <p className="text-xs text-muted-foreground">ส่งออกเป็นเอกสาร</p>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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

        {/* Mobile/Tablet Filter Tabs (Hidden on Desktop) */}
        <div className="mt-3 sm:mt-4 lg:hidden overflow-x-auto -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-1.5 sm:gap-2 min-w-max pb-2">
            <button
              onClick={() => setSelectedType(null)}
              className={cn(
                "flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
                selectedType === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border hover:bg-muted"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                    "flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap border",
                    selectedType === type
                      ? cn("border-transparent", colors.bg, colors.text)
                      : "bg-card border-border hover:bg-muted"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">{typeLabels[type]?.th || type}</span>
                  <span className="xs:hidden">{(typeLabels[type]?.th || type).slice(0, 4)}</span>
                  <span className="opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar (Hidden on Mobile) */}
        <aside className="hidden lg:flex flex-col w-64 border-r bg-muted/10 p-4 overflow-y-auto">
          <div className="space-y-1">
            <button
              onClick={() => setSelectedType(null)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                selectedType === null
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                <span>ทั้งหมด</span>
              </div>
              <span>{artefacts.length}</span>
            </button>
            <div className="my-2 border-t border-border/50" />
            <div className="text-xs font-semibold text-muted-foreground px-3 mb-2 uppercase tracking-wider">
              ประเภท Artefact
            </div>
            {togafOrder.map((type) => {
              const Icon = typeIcons[type];
              const count = artefactCounts[type];
              const colors = typeColors[type];
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(isSelected ? null : type)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5",
                    isSelected
                      ? cn(colors.bg, colors.text)
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn("w-4 h-4", isSelected ? "text-current" : colors.text)} />
                    <span className="truncate text-left">{typeLabels[type]?.th || type}</span>
                  </div>
                  <span className={cn("text-xs", isSelected ? "opacity-80" : "text-muted-foreground")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
          {/* Controls Bar */}
          <div className="p-3 sm:p-4 border-b space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              {/* Search */}
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="ค้นหา Artefact..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 text-sm bg-muted/50 border border-transparent focus:bg-background focus:border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="w-full h-10 pl-3 pr-8 text-sm bg-muted/50 border border-transparent focus:bg-background focus:border-primary/20 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="type">เรียงตาม TOGAF</option>
                    <option value="name">เรียงตามชื่อ</option>
                    <option value="updated">เรียงตามวันที่</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>

                <div className="flex items-center bg-muted rounded-lg p-1 flex-shrink-0">
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2 rounded transition-colors",
                      viewMode === 'list' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 rounded transition-colors",
                      viewMode === 'grid' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Status Summary */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm overflow-x-auto pb-2 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0">
              {Object.entries(statusCounts).map(([status, count]) => {
                const config = statusConfig[status];
                return (
                  <div key={status} className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={cn("w-2 h-2 rounded-full", config.color.replace('text-', 'bg-').replace('bg-', 'bg-current '))} />
                    <span className="text-muted-foreground">{config.label}:</span>
                    <span className="font-medium text-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Scroll Area */}
          <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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
                          "group relative bg-card rounded-xl border border-border p-3 sm:p-4 cursor-pointer",
                          "hover:border-primary/50 hover:shadow-lg transition-all duration-200"
                        )}
                      >
                        <div className={cn(
                          "absolute top-0 left-4 w-8 h-1 rounded-b shadow-sm",
                          colors.text.replace('text-', 'bg-')
                        )} />

                        <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3 mt-1">
                          <div className={cn(
                            "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex-shrink-0",
                            colors.bg
                          )}>
                            <TypeIcon className={cn("w-4 h-4 sm:w-5 sm:h-5", colors.text)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">{artefact.name}</h3>
                            <p className="text-xs text-muted-foreground truncate">{artefact.nameTh}</p>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 sm:mb-4 h-8 sm:h-10">
                          {artefact.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <span className={cn("px-2 py-0.5 text-xs rounded-full bg-muted font-medium", status.color)}>
                            {status.label}
                          </span>
                          <span className="text-xs text-muted-foreground">{artefact.lastUpdated}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 bg-muted/50 border-b text-xs sm:text-sm font-medium text-muted-foreground">
                  <div className="col-span-4">ชื่อ Artefact</div>
                  <div className="col-span-2">ประเภท</div>
                  <div className="col-span-2">สถานะ</div>
                  <div className="col-span-2">ผู้รับผิดชอบ</div>
                  <div className="col-span-2 text-right">การดำเนินการ</div>
                </div>

                <div className="divide-y divide-border">
                  <AnimatePresence>
                    {filteredArtefacts.map((artefact, index) => {
                      const TypeIcon = typeIcons[artefact.type];
                      const colors = typeColors[artefact.type];
                      const status = statusConfig[artefact.status];

                      return (
                        <motion.div
                          key={artefact.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: index * 0.02 }}
                          onClick={() => setSelectedArtefact(artefact)}
                          className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 lg:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-muted/30 cursor-pointer transition-colors group"
                        >
                          <div className="md:col-span-4 flex items-center gap-3">
                            <div className={cn("w-2 h-2 rounded-full flex-shrink-0 md:hidden", colors.text.replace('text-', 'bg-'))} />
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-foreground truncate">{artefact.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{artefact.nameTh}</p>
                            </div>
                          </div>

                          <div className="hidden md:flex md:col-span-2 items-center">
                            <span className={cn("px-2 py-1 text-xs rounded-full", colors.bg, colors.text)}>
                              {typeLabels[artefact.type]?.th}
                            </span>
                          </div>

                          <div className="md:col-span-2 flex items-center justify-between md:justify-start">
                            <span className={cn("px-2 py-1 text-xs rounded-full", status.color)}>
                              {status.label}
                            </span>
                          </div>

                          <div className="hidden md:flex md:col-span-2 items-center">
                            <span className="text-sm text-muted-foreground truncate">{artefact.owner}</span>
                          </div>

                          <div className="md:col-span-2 flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditArtefact(artefact);
                              }}
                              className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setVersionHistoryArtefact(artefact);
                              }}
                              className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                            >
                              <History className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {filteredArtefacts.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">ไม่พบข้อมูล</h3>
                <p className="text-muted-foreground">ลองเปลี่ยนคำค้นหาหรือตัวกรองใหม่</p>
              </div>
            )}
          </div>
        </main>
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
        isOpen={!!versionHistoryArtefact}
        onClose={() => setVersionHistoryArtefact(null)}
        artefactId={versionHistoryArtefact?.id || ''}
        artefactName={versionHistoryArtefact?.name || ''}
      />
    </div>
  );
}
