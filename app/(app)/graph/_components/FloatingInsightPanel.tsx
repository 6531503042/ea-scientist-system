'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ArrowDownToLine,
    ArrowUpFromLine,
    AlertTriangle,
    ArrowRight,
    Layers,
    RotateCcw,
    Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { relationships, artefacts, type Artefact, typeLabels, type ArtefactType } from '@/data/mockData';

// Type colors matching ArtefactListEnhanced
const typeColors: Record<ArtefactType, string> = {
    business: 'bg-violet-500',
    application: 'bg-sky-500',
    data: 'bg-teal-500',
    technology: 'bg-indigo-500',
    security: 'bg-amber-500',
    integration: 'bg-pink-500',
};

interface FloatingInsightPanelProps {
    artefact: Artefact;
    onClose: () => void;
    onImpactAnalysis: () => void;
    impactMode: boolean;
    impactStats: { affected: number; critical: number; upstream: number };
    upstreamList: Artefact[];
    downstreamList: Artefact[];
    simulationAction: 'none' | 'delete' | 'modify';
    setSimulationAction: (action: 'none' | 'delete' | 'modify') => void;
    setImpactMode: (mode: boolean) => void;
}

export function FloatingInsightPanel({
    artefact,
    onClose,
    onImpactAnalysis,
    impactMode,
    impactStats,
    upstreamList: impactUpstream,
    downstreamList: impactDownstream,
    simulationAction,
    setSimulationAction,
    setImpactMode
}: FloatingInsightPanelProps) {
    const { t, language } = useLanguage();

    // Find related artefacts (for normal mode)
    const upstreamRels = relationships.filter((r) => r.target === artefact.id);
    const downstreamRels = relationships.filter((r) => r.source === artefact.id);

    const upstream = upstreamRels.map(r => artefacts.find(a => a.id === r.source)).filter(Boolean) as Artefact[];
    const downstream = downstreamRels.map(r => artefacts.find(a => a.id === r.target)).filter(Boolean) as Artefact[];

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute right-3 top-3 bottom-3 w-72 lg:w-80 bg-card/98 backdrop-blur-xl border border-border rounded-xl shadow-2xl flex flex-col z-40 overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-start justify-between p-3 border-b bg-gradient-to-r from-primary/5 to-transparent">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                            "px-2 py-0.5 text-[10px] font-medium rounded-full",
                            artefact.status === 'active' ? "bg-success/10 text-success" :
                                artefact.status === 'draft' ? "bg-warning/10 text-warning" :
                                    "bg-muted text-muted-foreground"
                        )}>
                            {artefact.status}
                        </span>
                    </div>
                    <h3 className="font-bold text-foreground truncate">{artefact.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{artefact.nameTh}</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                >
                    <X className="w-4 h-4 text-muted-foreground" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {impactMode ? (
                    <>
                        {/* Impact Stats Cards - Enhanced */}
                        <div className="grid grid-cols-3 gap-2">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-600/5 border border-blue-500/30 shadow-sm"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-1.5">
                                    <ArrowDownToLine className="w-4 h-4 text-blue-500" />
                                </div>
                                <span className="text-xl font-bold text-blue-600">{impactStats.upstream}</span>
                                <span className="text-[10px] font-medium text-blue-500/80">Upstream</span>
                            </motion.div>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.05 }}
                                className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-600/5 border border-amber-500/30 shadow-sm"
                            >
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mb-1.5">
                                    <ArrowUpFromLine className="w-4 h-4 text-amber-500" />
                                </div>
                                <span className="text-xl font-bold text-amber-600">{impactStats.affected}</span>
                                <span className="text-[10px] font-medium text-amber-500/80">Downstream</span>
                            </motion.div>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-red-500/15 to-rose-600/5 border border-red-500/30 shadow-sm"
                            >
                                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mb-1.5">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                </div>
                                <span className="text-xl font-bold text-red-600">{impactStats.critical}</span>
                                <span className="text-[10px] font-medium text-red-500/80">วิกฤต</span>
                            </motion.div>
                        </div>

                        {/* Flow Diagram Header - Visual Impact Overview */}
                        <div className="relative py-4 mb-2">
                            <div className="flex items-center justify-center gap-3">
                                {/* Upstream indicator */}
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                                        <span className="text-sm font-bold text-white">{impactStats.upstream}</span>
                                    </div>
                                    <span className="text-[9px] font-medium text-blue-500 mt-1">Inputs</span>
                                </div>

                                {/* Flow arrows to center */}
                                <div className="flex items-center">
                                    <div className="w-6 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400" />
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                </div>

                                {/* Center - Current Artefact */}
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-xl border-2 border-white">
                                    <Layers className="w-5 h-5 text-white" />
                                </div>

                                {/* Flow arrows from center */}
                                <div className="flex items-center">
                                    <ArrowRight className="w-4 h-4 text-amber-400" />
                                    <div className="w-6 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500" />
                                </div>

                                {/* Downstream indicator */}
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
                                        <span className="text-sm font-bold text-white">{impactStats.affected}</span>
                                    </div>
                                    <span className="text-[9px] font-medium text-amber-500 mt-1">Outputs</span>
                                </div>
                            </div>

                            {/* Labels */}
                            <div className="flex justify-between mt-3 px-2">
                                <span className="text-[10px] text-blue-500 font-medium">← {t('detail.systemsSendingData')}</span>
                                <span className="text-[10px] text-amber-500 font-medium">{t('detail.systemsReceivingData')} →</span>
                            </div>
                        </div>

                        {/* Upstream Section - Redesigned */}
                        <div className="rounded-xl overflow-hidden border border-blue-500/20">
                            {/* Header with gradient */}
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                        <ArrowDownToLine className="w-3 h-3 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">{t('detail.upstream')}</h4>
                                        <p className="text-[9px] text-blue-100">{t('detail.systemsSendingData')} {artefact.name}</p>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 text-xs font-bold text-blue-600 bg-white rounded-full">{impactUpstream.length}</span>
                            </div>

                            {/* Content */}
                            <div className="bg-blue-50/50 dark:bg-blue-950/20 p-2">
                                {impactUpstream.length > 0 ? (
                                    <div className="space-y-1.5">
                                        {impactUpstream.slice(0, 5).map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer group"
                                            >
                                                {/* Type icon with color */}
                                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                                    typeColors[item.type].replace('bg-', 'bg-').replace('-500', '-100'),
                                                    "dark:bg-opacity-20"
                                                )}>
                                                    <div className={cn("w-2 h-2 rounded-full", typeColors[item.type])} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <span className="text-xs font-medium text-foreground block truncate">{item.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">{item.nameTh}</span>
                                                </div>

                                                {/* Arrow showing flow direction */}
                                                <div className="flex items-center text-blue-400 opacity-50 group-hover:opacity-100">
                                                    <ArrowRight className="w-3 h-3" />
                                                </div>
                                            </motion.div>
                                        ))}
                                        {impactUpstream.length > 5 && (
                                            <button className="w-full py-1.5 text-[10px] text-blue-500 font-medium hover:bg-blue-500/10 rounded-lg transition-colors">
                                                ดูเพิ่มเติม +{impactUpstream.length - 5} รายการ
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                                            <ArrowDownToLine className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <p className="text-xs text-muted-foreground">{t('detail.noUpstream')}</p>
                                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{language === 'th' ? 'ระบบนี้ไม่ขึ้นกับ input จากที่อื่น' : 'This system does not depend on external inputs'}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Downstream Section - Redesigned */}
                        <div className="rounded-xl overflow-hidden border border-amber-500/20">
                            {/* Header with gradient */}
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                        <ArrowUpFromLine className="w-3 h-3 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">{t('detail.downstream')}</h4>
                                        <p className="text-[9px] text-amber-100">{t('detail.systemsReceivingData')} {artefact.name}</p>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 text-xs font-bold text-amber-600 bg-white rounded-full">{impactDownstream.length}</span>
                            </div>

                            {/* Content */}
                            <div className="bg-amber-50/50 dark:bg-amber-950/20 p-2">
                                {impactDownstream.length > 0 ? (
                                    <div className="space-y-1.5">
                                        {impactDownstream.slice(0, 5).map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer group"
                                            >
                                                {/* Arrow showing flow direction */}
                                                <div className="flex items-center text-amber-400 opacity-50 group-hover:opacity-100">
                                                    <ArrowRight className="w-3 h-3" />
                                                </div>

                                                {/* Type icon with color */}
                                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                                    typeColors[item.type].replace('bg-', 'bg-').replace('-500', '-100'),
                                                    "dark:bg-opacity-20"
                                                )}>
                                                    <div className={cn("w-2 h-2 rounded-full", typeColors[item.type])} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <span className="text-xs font-medium text-foreground block truncate">{item.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">{item.nameTh}</span>
                                                </div>

                                                {/* Warning indicator for impact */}
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                                                </div>
                                            </motion.div>
                                        ))}
                                        {impactDownstream.length > 5 && (
                                            <button className="w-full py-1.5 text-[10px] text-amber-500 font-medium hover:bg-amber-500/10 rounded-lg transition-colors">
                                                ดูเพิ่มเติม +{impactDownstream.length - 5} รายการ
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-2">
                                            <ArrowUpFromLine className="w-5 h-5 text-amber-400" />
                                        </div>
                                        <p className="text-xs text-muted-foreground">{t('detail.noDownstream')}</p>
                                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{language === 'th' ? 'ไม่มีระบบอื่นที่ขึ้นกับ output นี้' : 'No other systems depend on this output'}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Simulation Actions */}
                        <div className="border-t pt-3">
                            <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-2">จำลองสถานการณ์</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSimulationAction(simulationAction === 'modify' ? 'none' : 'modify')}
                                    className={cn(
                                        "flex-1 py-2 px-2 rounded-lg border-2 transition-all flex items-center justify-center gap-1 text-xs font-medium",
                                        simulationAction === 'modify' ? 'border-warning bg-warning/10 text-warning' : 'border-border hover:bg-muted'
                                    )}
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    ปรับแก้
                                </button>
                                <button
                                    onClick={() => setSimulationAction(simulationAction === 'delete' ? 'none' : 'delete')}
                                    className={cn(
                                        "flex-1 py-2 px-2 rounded-lg border-2 transition-all flex items-center justify-center gap-1 text-xs font-medium",
                                        simulationAction === 'delete' ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border hover:bg-muted'
                                    )}
                                >
                                    <Trash2 className="w-3 h-3" />
                                    ลบ
                                </button>
                            </div>
                            {simulationAction !== 'none' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs p-2 rounded-lg border">
                                    {simulationAction === 'delete' ? (
                                        <p className="text-destructive">⚠️ {impactStats.affected} ระบบจะไม่ทำงาน</p>
                                    ) : (
                                        <p className="text-warning">📋 ต้องทดสอบ {impactStats.affected} ระบบ</p>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Normal Mode - Description */}
                        <div>
                            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">{t('detail.details')}</h4>
                            <p className="text-sm text-foreground leading-relaxed">{artefact.description}</p>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-muted/50 rounded-lg">
                                <p className="text-[10px] text-muted-foreground">{t('detail.owner')}</p>
                                <p className="text-xs font-medium text-foreground truncate">{artefact.owner}</p>
                            </div>
                            <div className="p-2 bg-muted/50 rounded-lg">
                                <p className="text-[10px] text-muted-foreground">{t('detail.department')}</p>
                                <p className="text-xs font-medium text-foreground truncate">{artefact.department}</p>
                            </div>
                            <div className="p-2 bg-muted/50 rounded-lg">
                                <p className="text-[10px] text-muted-foreground">{t('detail.version')}</p>
                                <p className="text-xs font-medium text-foreground">{artefact.version}</p>
                            </div>
                            <div className="p-2 bg-muted/50 rounded-lg">
                                <p className="text-[10px] text-muted-foreground">{t('detail.updated')}</p>
                                <p className="text-xs font-medium text-foreground">{artefact.lastUpdated}</p>
                            </div>
                        </div>

                        {/* Upstream Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <ArrowDownToLine className="w-3 h-3 text-blue-500" />
                                </div>
                                <h4 className="text-xs font-semibold text-foreground">{t('detail.upstream')}</h4>
                                <span className="text-[10px] text-muted-foreground">({upstream.length})</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mb-2">{t('detail.systemsSendingData')}</p>
                            {upstream.length > 0 ? (
                                <div className="space-y-1">
                                    {upstream.slice(0, 4).map(item => (
                                        <div key={item.id} className="flex items-center gap-2 p-2 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                                            <div className={cn("w-2 h-2 rounded-full", typeColors[item.type])} />
                                            <span className="text-xs font-medium flex-1 truncate">{item.name}</span>
                                            <span className="text-[9px] text-muted-foreground">{typeLabels[item.type]?.th}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-2 border border-dashed border-border rounded-lg text-center">
                                    <p className="text-[10px] text-muted-foreground">{t('detail.noUpstream')}</p>
                                </div>
                            )}
                        </div>

                        {/* Downstream Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center">
                                    <ArrowUpFromLine className="w-3 h-3 text-amber-500" />
                                </div>
                                <h4 className="text-xs font-semibold text-foreground">{t('detail.downstream')}</h4>
                                <span className="text-[10px] text-muted-foreground">({downstream.length})</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mb-2">{t('detail.systemsReceivingData')}</p>
                            {downstream.length > 0 ? (
                                <div className="space-y-1">
                                    {downstream.slice(0, 4).map(item => (
                                        <div key={item.id} className="flex items-center gap-2 p-2 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                                            <div className={cn("w-2 h-2 rounded-full", typeColors[item.type])} />
                                            <span className="text-xs font-medium flex-1 truncate">{item.name}</span>
                                            <span className="text-[9px] text-muted-foreground">{typeLabels[item.type]?.th}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-2 border border-dashed border-border rounded-lg text-center">
                                    <p className="text-[10px] text-muted-foreground">{t('detail.noDownstream')}</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Footer Button */}
            <div className="p-3 border-t bg-muted/30">
                {impactMode ? (
                    <button
                        onClick={() => setImpactMode(false)}
                        className="w-full px-4 py-2.5 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                        <X className="w-4 h-4" />
                        {t('detail.close')}
                    </button>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onImpactAnalysis}
                        className="w-full px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                        <AlertTriangle className="w-4 h-4" />
                        {t('detail.analyzeImpact')}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}
