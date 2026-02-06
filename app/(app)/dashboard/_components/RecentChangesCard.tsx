import { motion } from 'framer-motion';
import { History, ChevronRight, Layers, Database, Cpu, Link, Shield, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ArtefactType } from '@/data/mockData';

interface ChangeItem {
  artefact: string;
  type: ArtefactType | string;
  action: string;
  user: string;
  time: string;
}

interface RecentChangesCardProps {
  items: ChangeItem[];
  onViewAll?: () => void;
}

const typeIcons: Record<string, React.ElementType> = {
  business: Briefcase,
  data: Database,
  application: Layers,
  technology: Cpu,
  integration: Link,
  security: Shield,
};

const typeColors: Record<string, string> = {
  business: 'bg-ea-business/10 text-ea-business',
  data: 'bg-ea-data/10 text-ea-data',
  application: 'bg-ea-application/10 text-ea-application',
  technology: 'bg-ea-technology/10 text-ea-technology',
  integration: 'bg-ea-integration/10 text-ea-integration',
  security: 'bg-ea-security/10 text-ea-security',
};

export function RecentChangesCard({ items, onViewAll }: RecentChangesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 bg-card rounded-2xl border border-border shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-info/10">
            <History className="w-4 h-4 text-info" />
          </div>
          <h3 className="font-semibold text-foreground">Recent Changes</h3>
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
        {items.map((item, index) => {
          const Icon = typeIcons[item.type] || Layers;
          const colorClass = typeColors[item.type] || 'bg-muted text-muted-foreground';
          
          return (
            <motion.div
              key={`${item.artefact}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg", colorClass)}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground truncate">{item.artefact}</p>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent/10 text-accent">
                    {item.action}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  โดย {item.user} • {item.time}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
