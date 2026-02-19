'use client';

import { useState } from 'react';
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
  Briefcase,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Artefact, ArtefactType } from '@/types/artefact';
import { relationships, artefacts } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { useLocale } from '@/hooks/useLocale';
import {
  ARTEFACT_TYPE_ICONS,
  RISK_COLORS,
  RISK_LABELS,
  STATUS_COLORS
} from '@/config/ui-constants';
import { VersionHistoryDrawer } from './VersionHistoryDrawer';

interface ArtefactDetailModalProps {
  artefact: Artefact | null;
  onClose: () => void;
  onEdit: (artefact: Artefact) => void;
}

export function ArtefactDetailModal({ artefact, onClose, onEdit }: ArtefactDetailModalProps) {
  const { language } = useLanguage();
  const detail = useLocale('detail');
  const versionHistory = useLocale('versionHistory');
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  if (!artefact) return null;

  const upstreamRels = relationships.filter((r) => r.target === artefact.id);
  const downstreamRels = relationships.filter((r) => r.source === artefact.id);

  const upstream = upstreamRels.map(r => artefacts.find(a => a.id === r.source)!).filter(Boolean);
  const downstream = downstreamRels.map(r => artefacts.find(a => a.id === r.target)!).filter(Boolean);

  const TypeIcon = ARTEFACT_TYPE_ICONS[artefact.type] || Layers;

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-card border-l border-border shadow-2xl z-50 overflow-y-auto flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border p-6 z-10">
              <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4 sm:gap-0">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 flex-shrink-0">
                    <TypeIcon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-1 break-words">{artefact.name}</h2>
                    <p className="text-base text-muted-foreground break-words">{artefact.nameTh}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className={cn(
                        "px-3 py-1 text-sm font-medium rounded-full capitalize",
                        STATUS_COLORS[artefact.status]
                      )}>
                        {artefact.status}
                      </span>
                      <span className={cn(
                        "px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1.5",
                        RISK_COLORS[artefact.riskLevel]?.bg,
                        RISK_COLORS[artefact.riskLevel]?.text
                      )}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Risk: {language === 'th' ? RISK_LABELS[artefact.riskLevel]?.th : RISK_LABELS[artefact.riskLevel]?.en}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="absolute right-6 top-6 sm:static flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onEdit(artefact)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Artefact
                </button>
                <div className="flex items-center gap-2">
                  <button className="flex items-center justify-center w-10 h-10 bg-muted hover:bg-muted/80 rounded-xl transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 bg-muted hover:bg-muted/80 rounded-xl transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-xl transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8 flex-1">

              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {detail.details}
                </h4>
                <div className="p-5 bg-muted/30 rounded-2xl border border-border/50">
                  <p className="text-base text-foreground leading-relaxed">{artefact.description}</p>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">{detail.owner}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{artefact.owner}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Building className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">{detail.department}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{artefact.department}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <GitBranch className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">{detail.version}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{artefact.version}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">{detail.updated}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{artefact.lastUpdated}</p>
                </div>
              </div>

              {/* Usage Stats - Horizontal */}
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Usage Statistics
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 text-center">
                    <p className="text-3xl font-bold text-foreground mb-1">{artefact.dependencies}</p>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Dependencies</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 text-center">
                    <p className="text-3xl font-bold text-foreground mb-1">{artefact.dependents}</p>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Dependents</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 text-center">
                    <p className="text-xl font-bold text-foreground mb-1 capitalize">{artefact.usageFrequency}</p>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Usage</p>
                  </div>
                </div>
              </div>

              {/* Relationships */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upstream */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ArrowDownRight className="w-5 h-5 text-info" />
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {detail.upstream} ({upstream.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {upstream.length > 0 ? upstream.map((item) => {
                      const ItemIcon = ARTEFACT_TYPE_ICONS[item.type] || Layers;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-muted/30 border border-border/50 rounded-xl hover:bg-muted/50 transition-colors"
                        >
                          <ItemIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground line-clamp-1">
                            {language === 'th' ? (item.nameTh || item.name) : item.name}
                          </span>
                        </div>
                      );
                    }) : (
                      <div className="p-4 text-center border border-dashed border-border rounded-xl">
                        <p className="text-sm text-muted-foreground">{detail.noUpstream}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Downstream */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ArrowUpRight className="w-5 h-5 text-accent" />
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {detail.downstream} ({downstream.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {downstream.length > 0 ? downstream.map((item) => {
                      const ItemIcon = ARTEFACT_TYPE_ICONS[item.type] || Layers;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-muted/30 border border-border/50 rounded-xl hover:bg-muted/50 transition-colors"
                        >
                          <ItemIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground line-clamp-1">
                            {language === 'th' ? (item.nameTh || item.name) : item.name}
                          </span>
                        </div>
                      );
                    }) : (
                      <div className="p-4 text-center border border-dashed border-border rounded-xl">
                        <p className="text-sm text-muted-foreground">{detail.noDownstream}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Version History */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-muted-foreground" />
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {versionHistory.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => setShowVersionHistory(true)}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    {versionHistory.viewAll}
                  </button>
                </div>
                <button
                  onClick={() => setShowVersionHistory(true)}
                  className="w-full flex items-center gap-3 p-4 bg-muted/30 border border-border/50 rounded-xl hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <History className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {versionHistory.versionHistoryLabel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {versionHistory.viewAllChanges}
                    </p>
                  </div>
                </button>
              </div>

              <VersionHistoryDrawer
                isOpen={showVersionHistory}
                onClose={() => setShowVersionHistory(false)}
                artefactId={artefact.id}
                artefactName={artefact.name || artefact.nameTh || ''}
              />

              {/* Impact Analysis Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-accent text-accent-foreground font-medium rounded-xl hover:bg-accent/90 transition-colors"
              >
                🔍 {detail.analyzeImpact}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
