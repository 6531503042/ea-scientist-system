'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ARTEFACT_TYPE_LABELS, ARTEFACT_TYPE_ICONS, ARTEFACT_TYPE_COLORS } from '@/config/ui-constants';
import type { ArtefactType } from '@/types/artefact';
import { useLanguage } from '@/context/LanguageContext';

// TOGAF Order
const TOGAF_ORDER: ArtefactType[] = ['business', 'application', 'data', 'technology', 'security', 'integration'];

interface ArtefactSidebarProps {
    selectedType: ArtefactType | 'all';
    onTypeChange: (type: ArtefactType | 'all') => void;
    counts: Record<string, number>;
}

export function ArtefactSidebar({ selectedType, onTypeChange, counts }: ArtefactSidebarProps) {
    const { language } = useLanguage();
    const [collapsed, setCollapsed] = useState(false);
    const totalCount = counts['all'] || 0;

    // Persist collapsed state
    useEffect(() => {
        const saved = localStorage.getItem('artefact-sidebar-collapsed');
        if (saved !== null) {
            setCollapsed(saved === 'true');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('artefact-sidebar-collapsed', collapsed.toString());
    }, [collapsed]);

    return (
        <div className={cn(
            "flex flex-col h-full transition-all duration-200 ease-in-out",
            collapsed ? "w-16" : "w-64"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-border/50">
                {!collapsed && (
                    <span className="text-sm font-semibold text-foreground">
                        {language === 'th' ? 'กลุ่ม Artefact' : 'Artefact Types'}
                    </span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors ml-auto"
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            {/* All/Total Button */}
            <div className="p-2">
                <button
                    onClick={() => onTypeChange('all')}
                    className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200",
                        collapsed ? "justify-center" : "justify-between",
                        selectedType === 'all'
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "hover:bg-muted text-foreground"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <LayoutGrid className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span className="font-medium">{language === 'th' ? 'ทั้งหมด' : 'All'}</span>}
                    </div>
                    {!collapsed && (
                        <span className={cn(
                            "px-2 py-0.5 text-xs font-bold rounded-md",
                            selectedType === 'all' ? "bg-white/20" : "bg-muted"
                        )}>
                            {totalCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Section Header */}
            {!collapsed && (
                <div className="px-4 pt-2 pb-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {language === 'th' ? 'ประเภท TOGAF' : 'TOGAF Types'}
                    </p>
                </div>
            )}

            {/* Type List */}
            <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
                {TOGAF_ORDER.map((type) => {
                    const label = ARTEFACT_TYPE_LABELS[type];
                    const Icon = ARTEFACT_TYPE_ICONS[type];
                    const colors = ARTEFACT_TYPE_COLORS[type];
                    const count = counts[type] || 0;
                    const isSelected = selectedType === type;

                    return (
                        <button
                            key={type}
                            onClick={() => onTypeChange(type)}
                            title={collapsed ? label.en : undefined}
                            className={cn(
                                "w-full flex items-center gap-3 p-2.5 rounded-lg text-sm transition-all duration-200 relative",
                                collapsed ? "justify-center" : "justify-between",
                                isSelected
                                    ? "bg-muted font-medium text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            {/* Active indicator */}
                            {isSelected && (
                                <motion.div
                                    layoutId="sidebarActiveType"
                                    className={cn("absolute left-0 w-1 h-6 rounded-r-full", colors.text.replace('text-', 'bg-'))}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0",
                                    colors.bg
                                )}>
                                    <Icon className={cn("w-4 h-4", colors.text)} />
                                </div>
                                {!collapsed && (
                                    <span>{language === 'th' ? label.th : label.en}</span>
                                )}
                            </div>

                            {!collapsed && (
                                <span className={cn(
                                    "text-xs px-1.5 py-0.5 rounded",
                                    isSelected ? "font-semibold bg-muted-foreground/10" : ""
                                )}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Footer Section */}
            {!collapsed && (
                <div className="p-3 border-t border-border/50">
                    <div className="text-xs text-muted-foreground text-center">
                        {language === 'th' ? 'สถาปัตยกรรมองค์กร' : 'Enterprise Architecture'}
                    </div>
                </div>
            )}
        </div>
    );
}
