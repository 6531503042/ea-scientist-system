import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Layers, Database, Cpu, Link, Shield, Briefcase, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Artefact, ArtefactType, RiskLevel } from '@/data/mockData';

const typeConfig: Record<ArtefactType, {
  color: string;
  icon: React.ElementType;
}> = {
  business: { color: 'text-purple-600 border-purple-200 bg-purple-50', icon: Briefcase },
  application: { color: 'text-teal-600 border-teal-200 bg-teal-50', icon: Layers },
  data: { color: 'text-sky-600 border-sky-200 bg-sky-50', icon: Database },
  technology: { color: 'text-slate-600 border-slate-200 bg-slate-50', icon: Cpu },
  security: { color: 'text-red-600 border-red-200 bg-red-50', icon: Shield },
  integration: { color: 'text-amber-600 border-amber-200 bg-amber-50', icon: Link },
};

const riskIndicator: Record<RiskLevel, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
  none: 'hidden',
};

interface ArtefactNodeProps {
  data: Artefact;
  selected?: boolean;
}

import { useLanguage } from '@/context/LanguageContext';

function ArtefactNodeComponent({ data, selected }: ArtefactNodeProps) {
  const { language } = useLanguage();
  const artefact = data;
  const config = typeConfig[artefact.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        "relative min-w-[180px] max-w-[240px] bg-background rounded-lg shadow-sm border-2 transition-all duration-200 group",
        config.color.split(' ')[1], // Use the border color
        selected ? 'ring-2 ring-primary border-primary shadow-md' : 'hover:border-primary/50'
      )}
    >
      <div className={cn("absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-md transition-opacity", selected ? "bg-primary" : "bg-transparent")} />

      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background transition-colors group-hover:!bg-primary" />

      <div className="p-3 flex items-start gap-3">
        <div className={cn("p-2 rounded-md shrink-0", config.color.split(' ')[2])}>
          <Icon className={cn("w-4 h-4", config.color.split(' ')[0])} />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm leading-tight text-foreground/90 truncate">{artefact.name}</h4>
          <p className="text-[10px] text-muted-foreground truncate mt-0.5">{artefact.nameTh}</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground/70 bg-muted/50 px-1.5 py-0.5 rounded">
              {artefact.type}
            </span>
            {artefact.riskLevel !== 'none' && (
              <div className="flex items-center gap-1 ml-auto">
                <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", riskIndicator[artefact.riskLevel])} />
                <span className="text-[9px] font-medium text-muted-foreground capitalize">
                  {artefact.riskLevel} {language === 'th' ? 'ความเสี่ยง' : 'Risk'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background transition-colors group-hover:!bg-primary" />
    </motion.div>
  );
}

export const ArtefactNode = memo(ArtefactNodeComponent);
