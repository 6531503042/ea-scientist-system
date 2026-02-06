'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    Download,
    Upload,
    ChevronDown,
    List,
    Grid,
    FileSpreadsheet,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ArtefactType } from '@/types/artefact';
import { useLanguage } from '@/context/LanguageContext';

interface ArtefactTopContentProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedType: ArtefactType | 'all';
    sortBy: 'name' | 'type' | 'updated';
    onSortChange: (value: 'name' | 'type' | 'updated') => void;
    viewMode: 'list' | 'grid';
    onViewModeChange: (mode: 'list' | 'grid') => void;
    onAdd: () => void;
    onExport: (format: 'excel' | 'pdf') => void;
    onImport: () => void;
    totalCount: number;
    statusCounts: Record<string, number>;
}

export function ArtefactTopContent({
    searchQuery,
    onSearchChange,
    selectedType,
    sortBy,
    onSortChange,
    viewMode,
    onViewModeChange,
    onAdd,
    onExport,
    onImport,
    totalCount,
    statusCounts
}: ArtefactTopContentProps) {
    const { language, t } = useLanguage();
    const [showExportMenu, setShowExportMenu] = useState(false);
    const exportMenuRef = useRef<HTMLDivElement>(null);

    // Close export menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
                setShowExportMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex-shrink-0 border-b bg-card px-4 py-3 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-foreground">
                        {selectedType !== 'all'
                            ? (language === 'th' ? 'สถาปัตยกรรม' : 'Architecture')
                            : (language === 'th' ? 'Artefacts ทั้งหมด' : 'All Artefacts')}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        {language === 'th' ? `แสดง ${totalCount} รายการ` : `Showing ${totalCount} items`}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Export Dropdown */}
                    <div ref={exportMenuRef} className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-border bg-card hover:bg-muted rounded-lg transition-colors"
                            title={t('artefacts.exportData')}
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('artefacts.export')}</span>
                            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showExportMenu && "rotate-180")} />
                        </button>
                        <AnimatePresence>
                            {showExportMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-1 w-44 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden"
                                >
                                    <button
                                        onClick={() => {
                                            onExport('excel');
                                            setShowExportMenu(false);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                                    >
                                        <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                        <div>
                                            <span className="font-medium">Excel (.xlsx)</span>
                                            <p className="text-xs text-muted-foreground">{t('artefacts.exportSpreadsheet')}</p>
                                        </div>
                                    </button>
                                    <div className="border-t border-border" />
                                    <button
                                        onClick={() => {
                                            onExport('pdf');
                                            setShowExportMenu(false);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                                    >
                                        <FileText className="w-4 h-4 text-red-600" />
                                        <div>
                                            <span className="font-medium">PDF (.pdf)</span>
                                            <p className="text-xs text-muted-foreground">{t('artefacts.exportDocument')}</p>
                                        </div>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <button
                        onClick={onImport}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm border border-border bg-card hover:bg-muted rounded-lg transition-colors"
                        title={t('artefacts.import')}
                    >
                        <Upload className="w-4 h-4 text-muted-foreground" />
                        <span className="hidden sm:inline">{t('artefacts.import')}</span>
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('artefacts.addArtefact')}</span>
                        <span className="sm:hidden">{t('artefacts.add')}</span>
                    </motion.button>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                {/* Search */}
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder={t('artefacts.search')}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 text-sm bg-muted/50 border border-transparent focus:bg-background focus:border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
                            className="w-full h-10 pl-3 pr-8 text-sm bg-muted/50 border border-transparent focus:bg-background focus:border-primary/20 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="type">{t('artefacts.sortByTOGAF')}</option>
                            <option value="name">{t('artefacts.sortByName')}</option>
                            <option value="updated">{t('artefacts.sortByDate')}</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>

                    <div className="flex items-center bg-muted rounded-lg p-1 flex-shrink-0">
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={cn(
                                "p-2 rounded transition-colors",
                                viewMode === 'list' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={cn(
                                "p-2 rounded transition-colors",
                                viewMode === 'grid' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Summary */}
            <div className="mt-3 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm overflow-x-auto pb-2 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0">
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-muted-foreground">{language === 'th' ? 'ใช้งาน' : 'Active'}:</span>
                    <span className="font-medium text-foreground">{statusCounts['active'] || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    <span className="text-muted-foreground">{language === 'th' ? 'ร่าง' : 'Draft'}:</span>
                    <span className="font-medium text-foreground">{statusCounts['draft'] || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                    <span className="text-muted-foreground">{language === 'th' ? 'ยกเลิก' : 'Deprecated'}:</span>
                    <span className="font-medium text-foreground">{statusCounts['deprecated'] || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-info" />
                    <span className="text-muted-foreground">{language === 'th' ? 'วางแผน' : 'Planned'}:</span>
                    <span className="font-medium text-foreground">{statusCounts['planned'] || 0}</span>
                </div>
            </div>
        </div>
    );
}
