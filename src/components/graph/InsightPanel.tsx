import { motion } from 'framer-motion';
import { 
  X, 
  User, 
  Building, 
  Calendar, 
  GitBranch, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Artefact, RiskLevel } from '@/data/mockData';
import { relationships, artefacts } from '@/data/mockData';

interface InsightPanelProps {
  artefact: Artefact;
  onClose: () => void;
}

const riskStyles: Record<RiskLevel, { bg: string; text: string; label: string }> = {
  high: { bg: 'bg-risk-high/10', text: 'text-risk-high', label: 'สูง' },
  medium: { bg: 'bg-risk-medium/10', text: 'text-risk-medium', label: 'ปานกลาง' },
  low: { bg: 'bg-risk-low/10', text: 'text-risk-low', label: 'ต่ำ' },
  none: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'ไม่มี' },
};

const statusStyles: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-success/10', text: 'text-success' },
  draft: { bg: 'bg-warning/10', text: 'text-warning' },
  deprecated: { bg: 'bg-muted', text: 'text-muted-foreground' },
  planned: { bg: 'bg-info/10', text: 'text-info' },
};

export function InsightPanel({ artefact, onClose }: InsightPanelProps) {
  // Find related artefacts
  const upstreamRels = relationships.filter((r) => r.target === artefact.id);
  const downstreamRels = relationships.filter((r) => r.source === artefact.id);
  
  const upstream = upstreamRels.map(r => artefacts.find(a => a.id === r.source)!).filter(Boolean);
  const downstream = downstreamRels.map(r => artefacts.find(a => a.id === r.target)!).filter(Boolean);

  const riskStyle = riskStyles[artefact.riskLevel];
  const statusStyle = statusStyles[artefact.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-80 flex-shrink-0 bg-card border-l border-border p-5 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground">{artefact.name}</h3>
          <p className="text-sm text-muted-foreground">{artefact.nameTh}</p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Status & Risk */}
      <div className="flex items-center gap-2 mb-6">
        <span className={cn(
          "px-2.5 py-1 text-xs font-medium rounded-full capitalize",
          statusStyle.bg,
          statusStyle.text
        )}>
          {artefact.status}
        </span>
        <span className={cn(
          "px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1",
          riskStyle.bg,
          riskStyle.text
        )}>
          <AlertTriangle className="w-3 h-3" />
          ความเสี่ยง: {riskStyle.label}
        </span>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
          Description
        </h4>
        <p className="text-sm text-foreground leading-relaxed">{artefact.description}</p>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <User className="w-3.5 h-3.5" />
            <span className="text-xs">Owner</span>
          </div>
          <p className="text-sm font-medium text-foreground truncate">{artefact.owner}</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Building className="w-3.5 h-3.5" />
            <span className="text-xs">Department</span>
          </div>
          <p className="text-sm font-medium text-foreground truncate">{artefact.department}</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <GitBranch className="w-3.5 h-3.5" />
            <span className="text-xs">Version</span>
          </div>
          <p className="text-sm font-medium text-foreground">{artefact.version}</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-xs">Last Update</span>
          </div>
          <p className="text-sm font-medium text-foreground">{artefact.lastUpdated}</p>
        </div>
      </div>

      {/* Relationships */}
      <div className="space-y-4">
        {/* Upstream */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownRight className="w-4 h-4 text-info" />
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Upstream ({upstream.length})
            </h4>
          </div>
          <div className="space-y-2">
            {upstream.length > 0 ? upstream.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
              >
                <span className="text-sm text-foreground flex-1 truncate">{item.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )) : (
              <p className="text-sm text-muted-foreground italic">ไม่มี</p>
            )}
          </div>
        </div>

        {/* Downstream */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="w-4 h-4 text-accent" />
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Downstream ({downstream.length})
            </h4>
          </div>
          <div className="space-y-2">
            {downstream.length > 0 ? downstream.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
              >
                <span className="text-sm text-foreground flex-1 truncate">{item.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )) : (
              <p className="text-sm text-muted-foreground italic">ไม่มี</p>
            )}
          </div>
        </div>
      </div>

      {/* Impact Analysis Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          // Trigger impact analysis modal - parent component handles this
          const event = new CustomEvent('openImpactAnalysis', { detail: artefact });
          window.dispatchEvent(event);
        }}
        className="w-full mt-6 px-4 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
      >
        วิเคราะห์ผลกระทบ
      </motion.button>
    </motion.div>
  );
}
