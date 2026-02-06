'use client';

import {
    Briefcase,
    Layers,
    Database,
    Cpu,
    Shield,
    Link,
    AlertTriangle,
    Eye,
    Edit,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Artefact } from '@/types/artefact';
import {
    ARTEFACT_TYPE_LABELS,
    ARTEFACT_TYPE_ICONS,
    ARTEFACT_TYPE_COLORS,
    RISK_COLORS,
    RISK_LABELS,
    STATUS_COLORS
} from '@/config/ui-constants';

interface ArtefactCellRendererProps {
    artefact: Artefact;
    columnKey: string;
    onView: (a: Artefact) => void;
    onEdit: (a: Artefact) => void;
    onDelete: (a: Artefact) => void;
}

export function ArtefactCellRenderer({
    artefact,
    columnKey,
    onView,
    onEdit,
    onDelete
}: ArtefactCellRendererProps) {

    switch (columnKey) {
        case 'name': {
            const TypeIcon = ARTEFACT_TYPE_ICONS[artefact.type] || Layers;
            const colors = ARTEFACT_TYPE_COLORS[artefact.type];

            return (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex-shrink-0",
                        colors.bg
                    )}>
                        <TypeIcon className={cn("w-4 h-4 sm:w-5 sm:h-5", colors.text)} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground text-sm sm:text-base truncate">{artefact.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{artefact.nameTh}</p>
                    </div>
                </div>
            );
        }

        case 'type':
            const typeColors = ARTEFACT_TYPE_COLORS[artefact.type];
            return (
                <span className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-full",
                    typeColors.bg,
                    typeColors.text
                )}>
                    {ARTEFACT_TYPE_LABELS[artefact.type]?.th || artefact.type}
                </span>
            );

        case 'status':
            return (
                <span className={cn(
                    "px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-full capitalize",
                    STATUS_COLORS[artefact.status]
                )}>
                    {artefact.status}
                </span>
            );


        case 'owner':
            return (
                <div>
                    <p className="text-sm text-foreground">{artefact.owner}</p>
                    <p className="text-xs text-muted-foreground">{artefact.department}</p>
                </div>
            );

        case 'updated':
            return <span className="text-sm text-muted-foreground">{artefact.lastUpdated}</span>;

        case 'actions':
            return (
                <div className="flex items-center justify-end gap-0.5 sm:gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onView(artefact)}
                        className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                        onClick={() => onEdit(artefact)}
                        className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                        onClick={() => onDelete(artefact)}
                        className="p-1.5 sm:p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                </div>
            );

        default:
            return null;
    }
}
