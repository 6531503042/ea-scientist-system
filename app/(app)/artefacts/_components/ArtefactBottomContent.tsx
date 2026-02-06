'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArtefactBottomContentProps {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemLabel?: string;
}

export function ArtefactBottomContent({
    totalItems,
    currentPage,
    totalPages,
    onPageChange,
    itemLabel = 'items'
}: ArtefactBottomContentProps) {
    return (
        <div className="py-4 px-4 flex items-center justify-between border-t border-border">
            <span className="text-sm text-muted-foreground">
                {totalItems} {itemLabel} total
            </span>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
