'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuditBottomContentProps {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemLabel?: string;
}

export function AuditBottomContent({
    totalItems,
    currentPage,
    totalPages,
    onPageChange,
    itemLabel = 'records'
}: AuditBottomContentProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 text-sm text-muted-foreground">
            <div>
                Showing {totalItems === 0 ? 0 : (currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalItems)} of {totalItems} {itemLabel}
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </Button>
                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Simple pagination logic for display
                        let pageNum = i + 1;
                        if (totalPages > 5 && currentPage > 3) {
                            pageNum = currentPage - 2 + i;
                        }
                        if (pageNum > totalPages) return null;

                        return (
                            <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "ghost"}
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => onPageChange(pageNum)}
                            >
                                {pageNum}
                            </Button>
                        );
                    })}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
