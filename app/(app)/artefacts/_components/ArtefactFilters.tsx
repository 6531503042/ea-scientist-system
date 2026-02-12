'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    Download,
    Upload,
    ChevronDown,
    SlidersHorizontal,
    ArrowUpDown,
    FileSpreadsheet,
    FileText,
    X,
    GitBranch,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ArtefactStatus } from '@/types/artefact';
import { useLanguage } from '@/context/LanguageContext';

interface ArtefactFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    sortBy: 'name' | 'type' | 'updated';
    onSortChange: (value: 'name' | 'type' | 'updated') => void;
    statusFilter: ArtefactStatus | 'all';
    onStatusFilterChange: (status: ArtefactStatus | 'all') => void;
    onAdd: () => void;
    onExport: (format: 'excel' | 'pdf') => void;
    onImport: () => void;
    onRulePairs?: () => void;
    onOpenSidebar?: () => void;
    totalCount: number;
    filteredCount: number;
}

const STATUS_OPTIONS: { value: ArtefactStatus | 'all'; labelEn: string; labelTh: string }[] = [
    { value: 'all', labelEn: 'All Status', labelTh: 'สถานะทั้งหมด' },
    { value: 'active', labelEn: 'Active', labelTh: 'ใช้งาน' },
    { value: 'draft', labelEn: 'Draft', labelTh: 'ร่าง' },
    { value: 'deprecated', labelEn: 'Deprecated', labelTh: 'เลิกใช้' },
    { value: 'planned', labelEn: 'Planned', labelTh: 'แผนงาน' },
];

const SORT_OPTIONS = [
    { value: 'type', labelEn: 'TOGAF Type', labelTh: 'ประเภท TOGAF' },
    { value: 'name', labelEn: 'Name', labelTh: 'ชื่อ' },
    { value: 'updated', labelEn: 'Last Updated', labelTh: 'อัปเดตล่าสุด' },
];

export function ArtefactFilters({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    statusFilter,
    onStatusFilterChange,
    onAdd,
    onExport,
    onImport,
    onRulePairs,
    onOpenSidebar,
    totalCount,
    filteredCount
}: ArtefactFiltersProps) {
    const { language, t } = useLanguage();
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const exportRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);

    // Close menus on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExportMenu(false);
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSortMenu(false);
            if (statusRef.current && !statusRef.current.contains(e.target as Node)) setShowStatusMenu(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentSort = SORT_OPTIONS.find(o => o.value === sortBy);
    const currentStatus = STATUS_OPTIONS.find(o => o.value === statusFilter);

    return (
        <div className="flex flex-col gap-4 p-4 bg-white border-b border-border">
            {/* Row 1: Search + Filters + Actions */}
            <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
                {/* Search - Full width on mobile/tablet, fixed width on desktop */}
                <div className="flex gap-2 relative flex-1 w-full xl:max-w-md">
                    {onOpenSidebar && (
                        <button
                            onClick={onOpenSidebar}
                            className="xl:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-background hover:bg-muted transition-colors flex-shrink-0"
                        >
                            <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
                        </button>
                    )}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder={language === 'th' ? 'ค้นหา Artefact...' : 'Search Artefact...'}
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full h-10 pl-10 pr-10 text-sm bg-muted/50 border border-transparent rounded-lg focus:bg-background focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted"
                            >
                                <X className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Controls - Scrollable on very small screens, wrapped on tablets */}
                <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 xl:pb-0">
                    {/* Status Filter */}
                    <div ref={statusRef} className="relative">
                        <button
                            onClick={() => setShowStatusMenu(!showStatusMenu)}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-muted/50 hover:bg-muted border border-transparent rounded-lg transition-colors whitespace-nowrap"
                        >
                            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                            <span>{language === 'th' ? currentStatus?.labelTh : currentStatus?.labelEn}</span>
                            <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", showStatusMenu && "rotate-180")} />
                        </button>
                        <AnimatePresence>
                            {showStatusMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="absolute left-0 mt-1 w-40 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden"
                                >
                                    {STATUS_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                onStatusFilterChange(opt.value);
                                                setShowStatusMenu(false);
                                            }}
                                            className={cn(
                                                "w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors",
                                                statusFilter === opt.value && "bg-muted font-medium"
                                            )}
                                        >
                                            {language === 'th' ? opt.labelTh : opt.labelEn}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sort */}
                    <div ref={sortRef} className="relative">
                        <button
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-muted/50 hover:bg-muted border border-transparent rounded-lg transition-colors whitespace-nowrap"
                        >
                            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                            <span>{language === 'th' ? currentSort?.labelTh : currentSort?.labelEn}</span>
                            <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", showSortMenu && "rotate-180")} />
                        </button>
                        <AnimatePresence>
                            {showSortMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="absolute left-0 mt-1 w-40 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden"
                                >
                                    {SORT_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                onSortChange(opt.value as typeof sortBy);
                                                setShowSortMenu(false);
                                            }}
                                            className={cn(
                                                "w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors",
                                                sortBy === opt.value && "bg-muted font-medium"
                                            )}
                                        >
                                            {language === 'th' ? opt.labelTh : opt.labelEn}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Rule Pairs */}
                    {onRulePairs && (
                        <button
                            onClick={onRulePairs}
                            className="flex items-center gap-2 px-3 py-2 text-sm border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary rounded-lg transition-colors whitespace-nowrap"
                            title="Relationship Rule Pairs"
                        >
                            <GitBranch className="w-4 h-4" />
                            <span className="hidden sm:inline">Rule Pairs</span>
                        </button>
                    )}

                    <div className="h-6 w-px bg-border hidden sm:block" />

                    {/* Import */}
                    <button
                        onClick={onImport}
                        className="flex items-center gap-2 px-3 py-2 text-sm border border-border bg-card hover:bg-muted rounded-lg transition-colors whitespace-nowrap"
                    >
                        <Upload className="w-4 h-4 text-muted-foreground" />
                        <span className="hidden sm:inline">{t('artefacts.import')}</span>
                    </button>

                    {/* Export Dropdown */}
                    <div ref={exportRef} className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="flex items-center gap-2 px-3 py-2 text-sm border border-border bg-card hover:bg-muted rounded-lg transition-colors whitespace-nowrap"
                        >
                            <Download className="w-4 h-4 text-muted-foreground" />
                            <span className="hidden sm:inline">{t('artefacts.export')}</span>
                            <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", showExportMenu && "rotate-180")} />
                        </button>
                        <AnimatePresence>
                            {showExportMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="absolute right-0 mt-1 w-44 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden"
                                >
                                    <button
                                        onClick={() => { onExport('excel'); setShowExportMenu(false); }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                                    >
                                        <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                        <span>Excel (.xlsx)</span>
                                    </button>
                                    <button
                                        onClick={() => { onExport('pdf'); setShowExportMenu(false); }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                                    >
                                        <FileText className="w-4 h-4 text-red-600" />
                                        <span>PDF (.pdf)</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Add Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap ml-auto xl:ml-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('artefacts.addArtefact')}</span>
                        <span className="sm:hidden">{t('artefacts.add')}</span>
                    </motion.button>
                </div>
            </div>

            {/* Row 2: Results count */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    {language === 'th'
                        ? `แสดง ${filteredCount} จาก ${totalCount} รายการ`
                        : `Showing ${filteredCount} of ${totalCount} items`}
                </span>
                {statusFilter !== 'all' && (
                    <button
                        onClick={() => onStatusFilterChange('all')}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                        <X className="w-3 h-3" />
                        {language === 'th' ? 'ล้างตัวกรอง' : 'Clear filter'}
                    </button>
                )}
            </div>
        </div>
    );
}
