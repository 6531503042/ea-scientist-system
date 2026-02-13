'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function GraphPageSkeleton() {
    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex-shrink-0 border-b bg-card px-4 py-3 flex items-center gap-4">
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-9 flex-1 max-w-md rounded-lg" />
            </div>

            {/* Main area - canvas placeholder */}
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 bg-muted/20 relative">
                    {/* Dot grid pattern simulation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-2">
                            <Skeleton className="h-12 w-48 mx-auto rounded-lg" />
                            <Skeleton className="h-4 w-64 mx-auto" />
                        </div>
                    </div>
                </div>
                <aside className="hidden lg:block w-64 border-l border-border bg-card p-4">
                    <Skeleton className="h-5 w-20 mb-4" />
                    <div className="space-y-2">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4 rounded" />
                                <Skeleton className="h-4 flex-1" />
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
