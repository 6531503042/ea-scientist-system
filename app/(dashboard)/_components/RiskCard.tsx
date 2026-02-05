import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/data/mockData';

interface RiskItem {
  name: string;
  department: string;
  risk: string;
  severity: RiskLevel;
}

interface RiskCardProps {
  items: RiskItem[];
  onViewAll?: () => void;
}

const severityStyles: Record<RiskLevel, { bg: string; text: string; border: string; dot: string }> = {
  high: { 
    bg: 'bg-destructive/10', 
    text: 'text-destructive', 
    border: 'border-destructive/20',
    dot: 'bg-destructive'
  },
  medium: { 
    bg: 'bg-warning/10', 
    text: 'text-warning', 
    border: 'border-warning/20',
    dot: 'bg-warning'
  },
  low: { 
    bg: 'bg-success/10', 
    text: 'text-success', 
    border: 'border-success/20',
    dot: 'bg-success'
  },
  none: { 
    bg: 'bg-muted', 
    text: 'text-muted-foreground', 
    border: 'border-border',
    dot: 'bg-muted-foreground'
  },
};

export function RiskCard({ items, onViewAll }: RiskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 bg-card rounded-2xl border border-border shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/10">
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <h3 className="font-semibold text-foreground">Risk Hotspots</h3>
        </div>
        <button 
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          ดูทั้งหมด
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={cn(
              "p-4 rounded-xl border transition-all duration-200 hover:shadow-sm cursor-pointer",
              severityStyles[item.severity].bg,
              severityStyles[item.severity].border
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full mt-2 animate-pulse",
                severityStyles[item.severity].dot
              )} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.department}</p>
                <p className={cn(
                  "text-sm font-medium mt-1",
                  severityStyles[item.severity].text
                )}>
                  {item.risk}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
