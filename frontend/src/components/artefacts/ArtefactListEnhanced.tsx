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
  AlertTriangle,
  Grid,
  List,
  Filter,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { artefacts, typeLabels, type Artefact, type ArtefactType, type RiskLevel } from '@/data/mockData';
import { ArtefactDetailModal } from './ArtefactDetailModal';
import { CreateArtefactModal } from './CreateArtefactModal';

const typeIcons: Record<ArtefactType, React.ElementType> = {
  business: Briefcase,
  data: Database,
  application: Layers,
  technology: Cpu,
  integration: Link,
  security: Shield,
};

const typeColors: Record<ArtefactType, { bg: string; text: string; border: string }> = {
  business: { bg: 'bg-[hsl(262,83%,58%)]/10', text: 'text-[hsl(262,83%,58%)]', border: 'border-[hsl(262,83%,58%)]/30' },
  data: { bg: 'bg-info/10', text: 'text-info', border: 'border-info/30' },
  application: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
  technology: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
  security: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/30' },
  integration: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
};

const riskColors: Record<RiskLevel, string> = {
  high: 'bg-destructive text-white',
  medium: 'bg-warning text-white',
  low: 'bg-success text-white',
  none: 'bg-muted text-muted-foreground',
};

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success',
  draft: 'bg-warning/10 text-warning',
  deprecated: 'bg-muted text-muted-foreground',
  planned: 'bg-info/10 text-info',
};

const filterCategories = [
  { type: 'business' as ArtefactType, label: 'กระบวนการ', icon: Briefcase },
  { type: 'application' as ArtefactType, label: 'แอปพลิเคชัน', icon: Layers },
  { type: 'data' as ArtefactType, label: 'ข้อมูล', icon: Database },
  { type: 'technology' as ArtefactType, label: 'เทคโนโลยี', icon: Cpu },
  { type: 'security' as ArtefactType, label: 'ความปลอดภัย', icon: Shield },
  { type: 'integration' as ArtefactType, label: 'การเชื่อมต่อ', icon: Link },
];

export function ArtefactListEnhanced() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ArtefactType | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'risk' | 'updated'>('name');
  const [selectedArtefact, setSelectedArtefact] = useState<Artefact | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
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

    if (selectedRisk !== 'all') {
      result = result.filter(a => a.riskLevel === selectedRisk);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'risk':
          const riskOrder = { high: 0, medium: 1, low: 2, none: 3 };
          return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
        case 'updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, selectedType, selectedRisk, sortBy]);

  return (
    <div className="flex gap-6">
      {/* Sidebar Filters */}
      <div className="w-64 flex-shrink-0 space-y-6">
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Artefact Type</h3>
          <div className="space-y-1">
            {filterCategories.map((cat) => {
              const Icon = cat.icon;
              const count = artefacts.filter(a => a.type === cat.type).length;
              return (
                <button
                  key={cat.type}
                  onClick={() => setSelectedType(selectedType === cat.type ? null : cat.type)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                    selectedType === cat.type
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{cat.label}</span>
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
          <h3 className="font-semibold text-foreground mb-4">ความเสี่ยง</h3>
          <div className="space-y-1">
            {(['all', 'high', 'medium', 'low'] as const).map((risk) => (
              <button
                key={risk}
                onClick={() => setSelectedRisk(risk)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                  selectedRisk === risk
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                )}
              >
                <span>{risk === 'all' ? 'ทั้งหมด' : risk === 'high' ? 'สูง' : risk === 'medium' ? 'ปานกลาง' : 'ต่ำ'}</span>
                <span className={cn(
                  "px-2 py-0.5 text-xs rounded-full",
                  selectedRisk === risk ? "bg-primary-foreground/20" : "bg-muted"
                )}>
                  {risk === 'all' ? artefacts.length : artefacts.filter(a => a.riskLevel === risk).length}
                </span>
              </button>
            ))}
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
              <span className="text-muted-foreground">ความเสี่ยงสูง</span>
              <span className="font-medium text-destructive">{artefacts.filter(a => a.riskLevel === 'high').length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ไม่มีเจ้าของ</span>
              <span className="font-medium text-warning">{artefacts.filter(a => !a.owner).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Artefacts ทั้งหมด</h2>
            <p className="text-sm text-muted-foreground">{filteredArtefacts.length} รายการ</p>
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
              <option value="name">เรียงตามชื่อ</option>
              <option value="type">เรียงตามประเภท</option>
              <option value="risk">เรียงตามความเสี่ยง</option>
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
          <button className="flex items-center gap-2 px-4 h-11 text-sm bg-muted hover:bg-muted/80 rounded-xl transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
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
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ความเสี่ยง</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Owner</th>
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
                            {typeLabels[artefact.type].th}
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
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full",
                            riskColors[artefact.riskLevel]
                          )}>
                            {artefact.riskLevel !== 'none' && artefact.riskLevel !== 'low' && (
                              <AlertTriangle className="w-3 h-3" />
                            )}
                            {artefact.riskLevel === 'high' ? 'สูง' : artefact.riskLevel === 'medium' ? 'ปานกลาง' : artefact.riskLevel === 'low' ? 'ต่ำ' : 'ไม่มี'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-foreground">{artefact.owner}</p>
                          <p className="text-xs text-muted-foreground">{artefact.department}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-muted-foreground">{artefact.lastUpdated}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                              <Edit className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
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
          console.log('New Artefact:', data);
        }}
      />
    </div>
  );
}
