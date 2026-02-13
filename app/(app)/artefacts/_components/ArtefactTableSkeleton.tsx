'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function ArtefactTableSkeleton() {
    return (
        <div className="flex h-full bg-background">
            {/* Sidebar skeleton */}
            <aside className="hidden xl:block w-56 border-r border-border bg-card/50 p-4">
                <Skeleton className="h-5 w-24 mb-4" />
                <div className="space-y-1">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-5 w-8 rounded-full" />
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Filters skeleton */}
                <div className="flex-shrink-0 border-b bg-card px-4 py-4 sm:px-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <Skeleton className="h-10 w-full max-w-md rounded-lg" />
                        <Skeleton className="h-9 w-24 rounded-lg" />
                        <Skeleton className="h-9 w-24 rounded-lg" />
                        <Skeleton className="h-9 w-24 rounded-lg" />
                    </div>
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-8 w-20 rounded-lg flex-shrink-0" />
                        ))}
                    </div>
                </div>

                {/* Table skeleton */}
                <div className="flex-1 overflow-hidden p-4">
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="text-left px-5 py-4"><Skeleton className="h-3 w-16" /></th>
                                    <th className="text-left px-5 py-4"><Skeleton className="h-3 w-20" /></th>
                                    <th className="text-left px-5 py-4"><Skeleton className="h-3 w-16" /></th>
                                    <th className="text-left px-5 py-4"><Skeleton className="h-3 w-16" /></th>
                                    <th className="text-left px-5 py-4"><Skeleton className="h-3 w-14" /></th>
                                    <th className="text-right px-5 py-4"><Skeleton className="h-3 w-16 ml-auto" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(8)].map((_, i) => (
                                    <tr key={i} className="border-b border-border">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="w-10 h-10 rounded-lg" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-36" />
                                                    <Skeleton className="h-3 w-24" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4"><Skeleton className="h-5 w-16 rounded-lg" /></td>
                                        <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                                        <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                                        <td className="px-5 py-4"><Skeleton className="h-5 w-14 rounded-lg" /></td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Skeleton className="w-8 h-8 rounded-lg" />
                                                <Skeleton className="w-8 h-8 rounded-lg" />
                                                <Skeleton className="w-8 h-8 rounded-lg" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination skeleton */}
                <div className="p-4 pt-0 flex items-center justify-between">
                    <Skeleton className="h-4 w-40" />
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-9 w-9 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
