'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Layers,
    ChevronDown,
    ChevronRight,
    Edit2,
    Trash2,
    FolderOpen,
    FolderTree,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ArchitectureLayer, ArtefactCategory } from '@/types/artefact-type';

interface TypesTableProps {
    layers: ArchitectureLayer[];
    categories: ArtefactCategory[];
    loading: boolean;
    getLoc: (val: { en?: string; th?: string } | string | null | undefined, lang?: 'en' | 'th') => string;
    onEditLayer: (layer: ArchitectureLayer) => void;
    onDeleteLayer: (id: number) => void;
    onEditCategory: (category: ArtefactCategory) => void;
    onDeleteCategory: (id: number) => void;
}

export function TypesTable({
    layers,
    categories,
    loading,
    getLoc,
    onEditLayer,
    onDeleteLayer,
    onEditCategory,
    onDeleteCategory,
}: TypesTableProps) {
    const [expandedLayerIds, setExpandedLayerIds] = useState<Set<number>>(new Set(layers.map(l => l.id)));

    const toggleLayer = (id: number) => {
        setExpandedLayerIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const getCategoriesForLayer = (layerId: number) =>
        categories.filter(c => c.architectureLayerId === layerId);

    if (loading) {
        return (
            <div className="space-y-4 p-4">
                <div className="h-10 w-48 bg-muted rounded animate-pulse" />
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-4 sm:p-5">
            <p className="text-sm text-muted-foreground">
                จัดการ Architecture Layers (TOGAF) และ Categories สำหรับ Artefacts
            </p>

            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/50">
                            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase w-[40px]"></th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">ชื่อ (TH / EN)</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase w-[80px]">ประเภท</th>
                            <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase w-[100px]">การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {layers.flatMap(layer => {
                            const layerCats = getCategoriesForLayer(layer.id);
                            const isExpanded = expandedLayerIds.has(layer.id);

                            return [
                                <motion.tr
                                    key={`layer-${layer.id}`}
                                    layout
                                    className="border-b border-border hover:bg-muted/30 transition-colors"
                                >
                                    <td className="py-2 px-4">
                                        <button
                                            onClick={() => toggleLayer(layer.id)}
                                            className="p-1 hover:bg-muted rounded"
                                        >
                                            {isExpanded ? (
                                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="py-2 px-4">
                                        <div className="flex items-center gap-2">
                                            <FolderOpen className="w-4 h-4 text-primary" />
                                            <span className="font-medium">{getLoc(layer.layerName, 'th')}</span>
                                            <span className="text-xs text-muted-foreground">/ {getLoc(layer.layerName, 'en')}</span>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Layer</span>
                                    </td>
                                    <td className="py-2 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => onEditLayer(layer)}
                                                className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                                                title="แก้ไข"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteLayer(layer.id)}
                                                className="p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
                                                title="ลบ"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>,
                                ...(isExpanded ? layerCats.map(cat => (
                                    <motion.tr
                                        key={`cat-${cat.id}`}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border-b border-border/50 bg-muted/20 hover:bg-muted/40"
                                    >
                                        <td className="py-2 px-4 pl-10">
                                            <FolderTree className="w-4 h-4 text-muted-foreground" />
                                        </td>
                                        <td className="py-2 px-4">
                                            <span className="text-sm">{getLoc(cat.categoryName, 'th')}</span>
                                            <span className="text-xs text-muted-foreground ml-2">/ {getLoc(cat.categoryName, 'en')}</span>
                                        </td>
                                        <td className="py-2 px-4">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-info/10 text-info">Category</span>
                                        </td>
                                        <td className="py-2 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => onEditCategory(cat)}
                                                    className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                                                    title="แก้ไข"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onDeleteCategory(cat.id)}
                                                    className="p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
                                                    title="ลบ"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )) : []),
                            ];
                        })}
                    </tbody>
                </table>

                {layers.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                        <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>ยังไม่มีประเภท Artefact</p>
                        <p className="text-sm">เพิ่ม Architecture Layer ก่อน</p>
                    </div>
                )}
            </div>
        </div>
    );
}
