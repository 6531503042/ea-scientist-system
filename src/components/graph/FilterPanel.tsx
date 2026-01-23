import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, Layers, Database, Cpu, Link, Shield, Briefcase, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ArtefactType } from '@/data/mockData';
import type { Edge } from '@xyflow/react';
import { useLanguage } from '@/context/LanguageContext';

interface FilterPanelProps {
  selectedTypes: ArtefactType[];
  onFilterChange: (types: ArtefactType[]) => void;
  relationships?: Edge[];
}

export function FilterPanel({ selectedTypes, onFilterChange, relationships = [] }: FilterPanelProps) {
  const { t, language } = useLanguage();

  const filterOptions: { type: ArtefactType; labelEn: string; labelTh: string; icon: React.ElementType; color: string }[] = [
    { type: 'business', labelEn: 'Business', labelTh: 'กระบวนการ', icon: Briefcase, color: 'ea-business' },
    { type: 'application', labelEn: 'Application', labelTh: 'แอปพลิเคชัน', icon: Layers, color: 'ea-application' },
    { type: 'data', labelEn: 'Data', labelTh: 'ข้อมูล', icon: Database, color: 'ea-data' },
    { type: 'technology', labelEn: 'Technology', labelTh: 'เทคโนโลยี', icon: Cpu, color: 'ea-technology' },
    { type: 'security', labelEn: 'Security', labelTh: 'ความปลอดภัย', icon: Shield, color: 'ea-security' },
    { type: 'integration', labelEn: 'Integration', labelTh: 'การเชื่อมต่อ', icon: Link, color: 'ea-integration' },
  ];

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

  // Calculate relationship counts per type based on source/target node prefixes
  const relationshipCounts = useMemo(() => {
    const counts: Record<ArtefactType, number> = {
      business: 0,
      application: 0,
      data: 0,
      technology: 0,
      security: 0,
      integration: 0,
    };

    relationships.forEach(edge => {
      // Extract type from node ID prefixes (e.g., 'ba-001' -> business, 'app-001' -> application)
      const getTypeFromId = (id: string): ArtefactType | null => {
        if (id.startsWith('ba-')) return 'business';
        if (id.startsWith('app-')) return 'application';
        if (id.startsWith('data-')) return 'data';
        if (id.startsWith('tech-')) return 'technology';
        if (id.startsWith('sec-')) return 'security';
        if (id.startsWith('int-')) return 'integration';
        return null;
      };

      const sourceType = getTypeFromId(edge.source);
      const targetType = getTypeFromId(edge.target);

      if (sourceType) counts[sourceType]++;
      if (targetType && targetType !== sourceType) counts[targetType]++;
    });

    return counts;
  }, [relationships]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:block w-56 xl:w-64 flex-shrink-0 bg-card border-r border-border p-4 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">{t('graph.filters')}</h3>
        </div>
        {selectedTypes.length > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            <X className="w-3 h-3" />
            {t('detail.close')}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Artefact Type Filter */}
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            {t('graph.artefactType')}
          </h4>
          <div className="space-y-1">
            {filterOptions.map((option) => {
              const isSelected = selectedTypes.includes(option.type);
              const Icon = option.icon;
              const relCount = relationshipCounts[option.type];

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
                  <span className="flex-1 text-left">
                    {language === 'th' ? option.labelTh : option.labelEn}
                  </span>
                  {relCount > 0 && (
                    <span className={cn(
                      "flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded",
                      isSelected ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
                    )}>
                      <ArrowRight className="w-3 h-3" />
                      {relCount}
                    </span>
                  )}
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

        {/* Relationship Summary */}
        {relationships.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              {t('graph.relationships')}
            </h4>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('graph.total')}</span>
                <span className="font-medium">{relationships.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
