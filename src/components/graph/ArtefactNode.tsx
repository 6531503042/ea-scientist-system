import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Layers, Database, Cpu, Link, Shield, Briefcase, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Artefact, ArtefactType, RiskLevel } from '@/data/mockData';

const typeConfig: Record<ArtefactType, {
  icon: React.ElementType; 
  bg: string; 
  border: string;
  iconBg: string;
}> = {
  business: { 
    icon: Briefcase, 
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50', 
    border: 'border-ea-business/30',
    iconBg: 'bg-ea-business/10'
  },
  data: { 
    icon: Database, 
    bg: 'bg-gradient-to-br from-sky-50 to-sky-100/50', 
    border: 'border-ea-data/30',
    iconBg: 'bg-ea-data/10'
  },
  application: { 
    icon: Layers, 
    bg: 'bg-gradient-to-br from-teal-50 to-teal-100/50', 
    border: 'border-ea-application/30',
    iconBg: 'bg-ea-application/10'
  },
  technology: { 
    icon: Cpu, 
    bg: 'bg-gradient-to-br from-slate-50 to-slate-100/50', 
    border: 'border-ea-technology/30',
    iconBg: 'bg-ea-technology/10'
  },
  security: { 
    icon: Shield, 
    bg: 'bg-gradient-to-br from-red-50 to-red-100/50', 
    border: 'border-ea-security/30',
    iconBg: 'bg-ea-security/10'
  },
  integration: { 
    icon: Link, 
    bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50', 
    border: 'border-ea-integration/30',
    iconBg: 'bg-ea-integration/10'
  },
};

const riskIndicator: Record<RiskLevel, string> = {
  high: 'bg-risk-high',
  medium: 'bg-risk-medium',
  low: 'bg-risk-low',
  none: 'bg-muted',
};

interface ArtefactNodeProps {
  data: Artefact;
  selected?: boolean;
}

function ArtefactNodeComponent({ data, selected }: ArtefactNodeProps) {
  const artefact = data;
  const config = typeConfig[artefact.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative min-w-[200px] max-w-[280px] p-4 rounded-xl border-2 shadow-card transition-all duration-200 cursor-pointer",
        config.bg,
        selected ? 'border-accent shadow-glow ring-2 ring-accent/20' : config.border
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-primary border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-primary border-2 border-background"
      />

      {/* Risk Indicator */}
      {artefact.riskLevel !== 'none' && artefact.riskLevel !== 'low' && (
        <motion.div 
          className="absolute -top-2 -right-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className={cn(
            "flex items-center justify-center w-6 h-6 rounded-full",
            riskIndicator[artefact.riskLevel]
          )}>
            <AlertTriangle className="w-3.5 h-3.5 text-white" />
          </div>
        </motion.div>
      )}

      <div className="flex items-start gap-3">
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg", config.iconBg)}>
          <Icon className="w-5 h-5 text-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground truncate">{artefact.name}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{artefact.nameTh}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
          {artefact.type}
        </span>
        <span className="flex-1" />
        <span className="text-[10px] text-muted-foreground">
          v{artefact.version}
        </span>
      </div>
    </motion.div>
  );
}

export const ArtefactNode = memo(ArtefactNodeComponent);
