import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Building,
  Calendar,
  GitBranch,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Edit,
  Trash2,
  Download,
  Share2,
  History,
  Layers,
  Database,
  Cpu,
  Link,
  Shield,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Artefact, ArtefactType, RiskLevel } from '@/data/mockData';
import { relationships, artefacts } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';

interface ArtefactDetailModalProps {
  artefact: Artefact | null;
  onClose: () => void;
}

const typeIcons: Record<ArtefactType, React.ElementType> = {
  business: Briefcase,
  data: Database,
  application: Layers,
  technology: Cpu,
  integration: Link,
  security: Shield,
};

const riskStylesBase: Record<RiskLevel, { bg: string; text: string; labelTh: string; labelEn: string }> = {
  high: { bg: 'bg-risk-high/10', text: 'text-risk-high', labelTh: 'สูง', labelEn: 'High' },
  medium: { bg: 'bg-risk-medium/10', text: 'text-risk-medium', labelTh: 'ปานกลาง', labelEn: 'Medium' },
  low: { bg: 'bg-risk-low/10', text: 'text-risk-low', labelTh: 'ต่ำ', labelEn: 'Low' },
  none: { bg: 'bg-muted', text: 'text-muted-foreground', labelTh: 'ไม่มี', labelEn: 'None' },
};

export function ArtefactDetailModal({ artefact, onClose }: ArtefactDetailModalProps) {
  const { t, language } = useLanguage();

  if (!artefact) return null;

  const upstreamRels = relationships.filter((r) => r.target === artefact.id);
  const downstreamRels = relationships.filter((r) => r.source === artefact.id);

  const upstream = upstreamRels.map(r => artefacts.find(a => a.id === r.source)!).filter(Boolean);
  const downstream = downstreamRels.map(r => artefacts.find(a => a.id === r.target)!).filter(Boolean);

  const riskStyle = riskStylesBase[artefact.riskLevel];
  const TypeIcon = typeIcons[artefact.type];

  return (
    <AnimatePresence>
      {artefact && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-card border-l border-border shadow-xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border p-4 z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                    <TypeIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{artefact.name}</h2>
                    <p className="text-sm text-muted-foreground">{artefact.nameTh}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4">
                <button className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  {t('artefacts.export')}
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-auto">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* Status & Risk */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-success/10 text-success capitalize">
                  {artefact.status}
                </span>
                <span className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1",
                  riskStyle.bg,
                  riskStyle.text
                )}>
                  <AlertTriangle className="w-3 h-3" />
                  Risk: {language === 'th' ? riskStyle.labelTh : riskStyle.labelEn}
                </span>
              </div>

              {/* Description */}
              <div className="p-4 bg-muted/50 rounded-xl">
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  {t('detail.details')}
                </h4>
                <p className="text-sm text-foreground leading-relaxed">{artefact.description}</p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <User className="w-3.5 h-3.5" />
                    <span className="text-xs">{t('detail.owner')}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{artefact.owner}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Building className="w-3.5 h-3.5" />
                    <span className="text-xs">{t('detail.department')}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{artefact.department}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <GitBranch className="w-3.5 h-3.5" />
                    <span className="text-xs">{t('detail.version')}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{artefact.version}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">{t('detail.updated')}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{artefact.lastUpdated}</p>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="p-4 bg-muted/50 rounded-xl">
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                  Usage Statistics
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{artefact.dependencies}</p>
                    <p className="text-xs text-muted-foreground">Dependencies</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{artefact.dependents}</p>
                    <p className="text-xs text-muted-foreground">Dependents</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground capitalize">{artefact.usageFrequency}</p>
                    <p className="text-xs text-muted-foreground">Usage</p>
                  </div>
                </div>
              </div>

              {/* Relationships */}
              <div className="space-y-4">
                {/* Upstream */}
                <div className="p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowDownRight className="w-4 h-4 text-info" />
                    <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t('detail.upstream')} ({upstream.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {upstream.length > 0 ? upstream.map((item) => {
                      const ItemIcon = typeIcons[item.type];
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-background cursor-pointer transition-colors"
                        >
                          <ItemIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground flex-1">
                            {language === 'th' ? (item.nameTh || item.name) : item.name}
                          </span>
                        </div>
                      );
                    }) : (
                      <p className="text-sm text-muted-foreground italic">{t('detail.noUpstream')}</p>
                    )}
                  </div>
                </div>

                {/* Downstream */}
                <div className="p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowUpRight className="w-4 h-4 text-accent" />
                    <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t('detail.downstream')} ({downstream.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {downstream.length > 0 ? downstream.map((item) => {
                      const ItemIcon = typeIcons[item.type];
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-background cursor-pointer transition-colors"
                        >
                          <ItemIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground flex-1">
                            {language === 'th' ? (item.nameTh || item.name) : item.name}
                          </span>
                        </div>
                      );
                    }) : (
                      <p className="text-sm text-muted-foreground italic">{t('detail.noDownstream')}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* History */}
              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    History (Mock)
                  </h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-muted-foreground">Updated version by {artefact.owner}</span>
                    <span className="text-xs text-muted-foreground ml-auto">2 days ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-info" />
                    <span className="text-muted-foreground">Added new relationship</span>
                    <span className="text-xs text-muted-foreground ml-auto">1 week ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                    <span className="text-muted-foreground">Changed risk level</span>
                    <span className="text-xs text-muted-foreground ml-auto">2 weeks ago</span>
                  </div>
                </div>
              </div>

              {/* Impact Analysis Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors"
              >
                🔍 {t('detail.analyzeImpact')}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
