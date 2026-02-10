'use client';

import { motion } from 'framer-motion';
import { X, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { artefacts, typeLabels } from '@/data/mockData';
import type { Artefact, ArtefactType } from '@/types/artefact';
import { graphTypeColors, artefactTypeOrder } from '@/lib/graph-helpers';

interface ArtefactLibraryPanelProps {
    onClose: () => void;
}

export function ArtefactLibraryPanel({ onClose }: ArtefactLibraryPanelProps) {
    const { t, language } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="absolute left-3 top-3 bottom-3 w-48 lg:w-52 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl flex-col z-30 hidden md:flex"
        >
            <div className="px-3 py-2 border-b flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-sm">{t('graph.artefactLibrary')}</h3>
                    <p className="text-[10px] text-muted-foreground">
                        {language === 'th' ? 'ลากไปวางบน Canvas' : 'Drag to Canvas'}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-muted rounded transition-colors"
                >
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-3">
                    {artefactTypeOrder.map((type) => {
                        const typeArtefacts = artefacts.filter(a => a.type === type);
                        if (typeArtefacts.length === 0) return null;

                        return (
                            <div key={type} className="space-y-1">
                                <h4 className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                                    <span className={cn("w-1.5 h-1.5 rounded-full", graphTypeColors[type])}></span>
                                    {language === 'th' ? (typeLabels[type]?.th || type) : (typeLabels[type]?.en || type)}
                                </h4>
                                <div className="space-y-1">
                                    {typeArtefacts.map(artefact => (
                                        <ArtefactDraggableItem key={artefact.id} artefact={artefact} type={type} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

interface ArtefactDraggableItemProps {
    artefact: Artefact;
    type: ArtefactType;
}

function ArtefactDraggableItem({ artefact, type }: ArtefactDraggableItemProps) {
    return (
        <div
            className="p-1.5 bg-muted/30 border border-border rounded hover:bg-muted cursor-move flex items-center gap-2 transition-colors group"
            draggable
            onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', JSON.stringify(artefact));
                event.dataTransfer.effectAllowed = 'move';
            }}
        >
            <div className={cn("p-1 rounded shadow-sm", graphTypeColors[type])}>
                <Briefcase className="w-2.5 h-2.5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
                <span className="text-xs font-medium block truncate">{artefact.name}</span>
            </div>
        </div>
    );
}
