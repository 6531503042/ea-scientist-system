import { motion } from 'framer-motion';
import { Filter, Layers, Database, Cpu, Link, Shield, Briefcase, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ArtefactType } from '@/data/mockData';

interface FilterPanelProps {
  selectedTypes: ArtefactType[];
  onFilterChange: (types: ArtefactType[]) => void;
}

const filterOptions: { type: ArtefactType; label: string; labelTh: string; icon: React.ElementType; color: string }[] = [
  { type: 'business', label: 'Business', labelTh: 'กระบวนการ', icon: Briefcase, color: 'ea-business' },
  { type: 'application', label: 'Application', labelTh: 'แอปพลิเคชัน', icon: Layers, color: 'ea-application' },
  { type: 'data', label: 'Data', labelTh: 'ข้อมูล', icon: Database, color: 'ea-data' },
  { type: 'technology', label: 'Technology', labelTh: 'เทคโนโลยี', icon: Cpu, color: 'ea-technology' },
  { type: 'security', label: 'Security', labelTh: 'ความปลอดภัย', icon: Shield, color: 'ea-security' },
  { type: 'integration', label: 'Integration', labelTh: 'การเชื่อมต่อ', icon: Link, color: 'ea-integration' },
];

export function FilterPanel({ selectedTypes, onFilterChange }: FilterPanelProps) {
  const toggleFilter = (type: ArtefactType) => {
    if (selectedTypes.includes(type)) {
      onFilterChange(selectedTypes.filter((t) => t !== type));
    } else {
      onFilterChange([...selectedTypes, type]);
    }
  };

  const clearFilters = () => {
    onFilterChange([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-64 flex-shrink-0 bg-card border-r border-border p-4 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Filters</h3>
        </div>
        {selectedTypes.length > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            <X className="w-3 h-3" />
            ล้าง
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Artefact Type Filter */}
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Artefact Type
          </h4>
          <div className="space-y-1">
            {filterOptions.map((option) => {
              const isSelected = selectedTypes.includes(option.type);
              const Icon = option.icon;
              
              return (
                <button
                  key={option.type}
                  onClick={() => toggleFilter(option.type)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all duration-200",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-md",
                    isSelected ? "bg-primary-foreground/20" : `bg-${option.color}/10`
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="flex-1 text-left">{option.labelTh}</span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-accent"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Quick Filters
          </h4>
          <div className="space-y-1">
            <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
              <span className="w-2 h-2 rounded-full bg-risk-high" />
              High Risk Only
            </button>
            <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
              <span className="w-2 h-2 rounded-full bg-warning" />
              Duplicates
            </button>
            <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
              <span className="w-2 h-2 rounded-full bg-muted-foreground" />
              No Owner
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
