'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Edit, Trash2, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Artefact } from '@/types/artefact';
import { ARTEFACT_TYPE_ICONS, ARTEFACT_TYPE_COLORS, STATUS_COLORS } from '@/config/ui-constants';
import { useLanguage } from '@/context/LanguageContext';

interface ArtefactDataTableProps {
    data: Artefact[];
    onView: (artefact: Artefact) => void;
    onEdit: (artefact: Artefact) => void;
    onDelete: (artefact: Artefact) => void;
    isLoading?: boolean;
}

// Table columns - removed Updated, System, Usage columns per user request
const COLUMNS = [
    { key: 'name', labelEn: 'Artefact Name', labelTh: 'ชื่อ Artefact', className: '' },
    { key: 'department', labelEn: 'Department', labelTh: 'หน่วยงาน', className: 'hidden md:table-cell' },
    { key: 'owner', labelEn: 'Owner', labelTh: 'เจ้าของ', className: 'hidden lg:table-cell' },
    { key: 'status', labelEn: 'Status', labelTh: 'สถานะ', className: 'hidden sm:table-cell' },
    { key: 'actions', labelEn: 'Actions', labelTh: '', className: 'text-right w-28' },
];

export function ArtefactDataTable({ data, onView, onEdit, onDelete, isLoading }: ArtefactDataTableProps) {
    const { language } = useLanguage();

    if (isLoading) {
        return (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="animate-pulse">
                    <div className="h-12 bg-muted/50 border-b" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 border-b border-border flex items-center px-4 gap-4">
                            <div className="w-8 h-8 rounded-lg bg-muted" />
                            <div className="flex-1 h-4 bg-muted rounded" />
                            <div className="w-20 h-4 bg-muted rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            {COLUMNS.map((col) => (
                                <th
                                    key={col.key}
                                    className={cn(
                                        "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-left",
                                        col.className
                                    )}
                                >
                                    {language === 'th' ? col.labelTh : col.labelEn}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {data.map((artefact, index) => {
                                const TypeIcon = ARTEFACT_TYPE_ICONS[artefact.type] || Layers;
                                const colors = ARTEFACT_TYPE_COLORS[artefact.type];
                                const usagePercent = Math.min(100, Math.max(0, artefact.dependents * 10 + artefact.dependencies * 5));

                                return (
                                    <motion.tr
                                        key={artefact.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: index * 0.02 }}
                                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group"
                                    >
                                        {/* Name */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0", colors.bg)}>
                                                    <TypeIcon className={cn("w-4 h-4", colors.text)} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-foreground truncate">{artefact.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{artefact.nameTh}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Department */}
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <span className="text-sm text-foreground">{artefact.department}</span>
                                        </td>

                                        {/* Owner */}
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className="text-sm text-foreground">{artefact.owner}</span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className={cn(
                                                "inline-flex px-2.5 py-1 text-xs font-medium rounded-full capitalize",
                                                STATUS_COLORS[artefact.status]
                                            )}>
                                                {artefact.status}
                                            </span>
                                        </td>

                                        {/* Actions - always visible */}
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onView(artefact); }}
                                                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                                    title={language === 'th' ? 'ดู' : 'View'}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onEdit(artefact); }}
                                                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-info transition-colors"
                                                    title={language === 'th' ? 'แก้ไข' : 'Edit'}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDelete(artefact); }}
                                                    className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                                    title={language === 'th' ? 'ลบ' : 'Delete'}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {data.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                        <Layers className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium text-foreground">
                        {language === 'th' ? 'ไม่พบ Artefact' : 'No Artefacts Found'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {language === 'th' ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรอง' : 'Try changing search or filters'}
                    </p>
                </div>
            )}
        </div>
    );
}
