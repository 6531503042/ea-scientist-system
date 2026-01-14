import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
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
  ArrowUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { artefacts, typeLabels, type Artefact, type ArtefactType, type RiskLevel } from '@/data/mockData';
import { ArtefactDetailModal } from './ArtefactDetailModal';

const typeIcons: Record<ArtefactType, React.ElementType> = {
  business: Briefcase,
  data: Database,
  application: Layers,
  technology: Cpu,
  integration: Link,
  security: Shield,
};

const riskColors: Record<RiskLevel, string> = {
  high: 'bg-risk-high text-white',
  medium: 'bg-risk-medium text-white',
  low: 'bg-risk-low text-white',
  none: 'bg-muted text-muted-foreground',
};

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success',
  draft: 'bg-warning/10 text-warning',
  deprecated: 'bg-muted text-muted-foreground',
  planned: 'bg-info/10 text-info',
};

export function ArtefactList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ArtefactType | 'all'>('all');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'risk' | 'updated'>('name');
  const [selectedArtefact, setSelectedArtefact] = useState<Artefact | null>(null);

  const filteredArtefacts = useMemo(() => {
    let result = [...artefacts];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(query) || 
        a.nameTh.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
      );
    }
    
    // Type filter
    if (selectedType !== 'all') {
      result = result.filter(a => a.type === selectedType);
    }
    
    // Risk filter
    if (selectedRisk !== 'all') {
      result = result.filter(a => a.riskLevel === selectedRisk);
    }
    
    // Sort
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Artefacts</h2>
          <p className="text-muted-foreground">จัดการ Artefacts ทั้งหมดในระบบ ({artefacts.length} รายการ)</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่ม Artefact
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ค้นหา Artefact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ArtefactType | 'all')}
            className="h-10 pl-4 pr-10 text-sm bg-card border border-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <option value="all">ทุกประเภท</option>
            {Object.entries(typeLabels).map(([key, value]) => (
              <option key={key} value={key}>{value.th}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Risk Filter */}
        <div className="relative">
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value as RiskLevel | 'all')}
            className="h-10 pl-4 pr-10 text-sm bg-card border border-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <option value="all">ทุกระดับความเสี่ยง</option>
            <option value="high">สูง</option>
            <option value="medium">ปานกลาง</option>
            <option value="low">ต่ำ</option>
            <option value="none">ไม่มี</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-10 pl-4 pr-10 text-sm bg-card border border-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <option value="name">เรียงตามชื่อ</option>
            <option value="type">เรียงตามประเภท</option>
            <option value="risk">เรียงตามความเสี่ยง</option>
            <option value="updated">เรียงตามวันที่อัปเดต</option>
          </select>
          <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        <button className="flex items-center gap-2 px-4 h-10 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Table */}
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
                  return (
                    <motion.tr
                      key={artefact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedArtefact(artefact)}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-lg",
                            `bg-${typeLabels[artefact.type].color}/10`
                          )}>
                            <TypeIcon className={cn("w-5 h-5", `text-${typeLabels[artefact.type].color}`)} />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{artefact.name}</p>
                            <p className="text-xs text-muted-foreground">{artefact.nameTh}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-foreground">{typeLabels[artefact.type].th}</span>
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

      {/* Detail Modal */}
      <ArtefactDetailModal 
        artefact={selectedArtefact} 
        onClose={() => setSelectedArtefact(null)} 
      />
    </div>
  );
}
