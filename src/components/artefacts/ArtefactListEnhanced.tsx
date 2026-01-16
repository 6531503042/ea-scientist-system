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
  FileText,
  Upload,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { artefacts, typeLabels, type Artefact, type ArtefactType } from '@/data/mockData';
import { ArtefactDetailModal } from './ArtefactDetailModal';
import { CreateArtefactModal } from './CreateArtefactModal';
import { EditArtefactModal } from './EditArtefactModal';

const typeIcons: Record<ArtefactType, React.ElementType> = {
  business: Briefcase,
  data: Database,
  application: Layers,
  technology: Cpu,
  integration: Link,
  security: Shield,
};

// TOGAF Order - Business → Application → Data → Technology → Security → Integration
const togafOrder: ArtefactType[] = ['business', 'application', 'data', 'technology', 'security', 'integration'];

const typeColors: Record<ArtefactType, { bg: string; text: string; border: string }> = {
  business: { bg: 'bg-[hsl(262,83%,58%)]/10', text: 'text-[hsl(262,83%,58%)]', border: 'border-[hsl(262,83%,58%)]/30' },
  data: { bg: 'bg-info/10', text: 'text-info', border: 'border-info/30' },
  application: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
  technology: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
  security: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/30' },
  integration: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
};

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success',
  draft: 'bg-warning/10 text-warning',
  deprecated: 'bg-muted text-muted-foreground',
  planned: 'bg-info/10 text-info',
};

// Full labels following TOGAF
const togafLabels: Record<ArtefactType, { en: string; th: string; description: string }> = {
  business: { 
    en: 'Business Architecture', 
    th: 'สถาปัตยกรรมธุรกิจ', 
    description: 'กระบวนการธุรกิจ, กลยุทธ์, องค์กร' 
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

const filterCategories = togafOrder.map(type => ({
  type,
  label: togafLabels[type].th,
  labelEn: togafLabels[type].en,
  icon: typeIcons[type],
  description: togafLabels[type].description
}));

export function ArtefactListEnhanced() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ArtefactType | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'updated'>('type');
  const [selectedArtefact, setSelectedArtefact] = useState<Artefact | null>(null);
  const [editArtefact, setEditArtefact] = useState<Artefact | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
          // Sort by TOGAF order
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

  return (
    <div className="flex gap-6">
      {/* Sidebar Filters - TOGAF Ordered */}
      <div className="w-72 flex-shrink-0 space-y-6">
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-2">ประเภท Artefact</h3>
          <p className="text-xs text-muted-foreground mb-4">เรียงตามมาตรฐาน TOGAF</p>
          
          <div className="space-y-1">
            {/* All button */}
            <button
              onClick={() => setSelectedType(null)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
                selectedType === null
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4" />
                <span className="font-medium">ทั้งหมด</span>
              </div>
              <span className={cn(
                "px-2 py-0.5 text-xs rounded-full",
                selectedType === null ? "bg-primary-foreground/20" : "bg-muted"
              )}>
                {artefacts.length}
              </span>
            </button>
            
            {filterCategories.map((cat, index) => {
              const Icon = cat.icon;
              const count = artefactCounts[cat.type];
              return (
                <button
                  key={cat.type}
                  onClick={() => setSelectedType(selectedType === cat.type ? null : cat.type)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
                    selectedType === cat.type
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground w-4">{index + 1}.</span>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="block">{cat.label}</span>
                      <span className="text-xs opacity-70">{cat.labelEn}</span>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 text-xs rounded-full",
                    selectedType === cat.type ? "bg-primary-foreground/20" : "bg-muted"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">สรุปข้อมูล</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Active</span>
              <span className="font-medium text-success">{artefacts.filter(a => a.status === 'active').length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Draft</span>
              <span className="font-medium text-warning">{artefacts.filter(a => a.status === 'draft').length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ไม่มีเจ้าของ</span>
              <span className="font-medium text-muted-foreground">{artefacts.filter(a => !a.owner).length}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-2">การนำเข้า/ส่งออก</h3>
          <div className="space-y-2 mt-3">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              ส่งออก Excel
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
              นำเข้า Excel
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {selectedType ? togafLabels[selectedType].th : 'Artefacts ทั้งหมด'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedType ? togafLabels[selectedType].description : `${filteredArtefacts.length} รายการ`}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            เพิ่ม Artefact
          </motion.button>
        </div>

        {/* Search & Controls */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ค้นหา Artefact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-11 pl-4 pr-10 text-sm bg-card border border-border rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="type">เรียงตาม TOGAF</option>
              <option value="name">เรียงตามชื่อ</option>
              <option value="updated">เรียงตามวันที่อัปเดต</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="flex items-center bg-muted rounded-xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === 'list' ? "bg-card shadow-sm" : "hover:bg-card/50"
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === 'grid' ? "bg-card shadow-sm" : "hover:bg-card/50"
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List View */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Artefact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ประเภท</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">สถานะ</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Owner</th>
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
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg", colors.bg)}>
                              <TypeIcon className={cn("w-5 h-5", colors.text)} />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{artefact.name}</p>
                              <p className="text-xs text-muted-foreground">{artefact.nameTh}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={cn("text-sm px-2 py-1 rounded-lg", colors.bg, colors.text)}>
                            {togafLabels[artefact.type].th}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={cn(
                            "px-2.5 py-1 text-xs font-medium rounded-full capitalize",
                            statusColors[artefact.status]
                          )}>
                            {artefact.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-foreground">{artefact.owner}</p>
                          <p className="text-xs text-muted-foreground">{artefact.department}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-muted-foreground">v{artefact.version}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-muted-foreground">{artefact.lastUpdated}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => setSelectedArtefact(artefact)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                              title="ดูรายละเอียด"
                            >
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button 
                              onClick={() => setEditArtefact(artefact)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                              title="แก้ไข"
                            >
                              <Edit className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" title="ลบ">
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
    </div>
  );
}