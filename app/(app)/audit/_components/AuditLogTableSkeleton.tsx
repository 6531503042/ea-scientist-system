'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function AuditLogTableSkeleton() {
    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-12" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-16" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-16" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-20" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-24" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-16" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-16" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-20" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-32" /></th>
                            <th className="text-center px-5 py-4"><Skeleton className="h-3 w-12 mx-auto" /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(6)].map((_, i) => (
                            <tr key={i} className="border-b border-border">
                                <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                                <td className="px-5 py-4"><Skeleton className="h-4 w-32" /></td>
                                <td className="px-5 py-4"><Skeleton className="h-5 w-20 rounded-lg" /></td>
                                <td className="px-5 py-4"><Skeleton className="h-4 w-24 font-mono" /></td>
                                <td className="px-5 py-4"><Skeleton className="h-4 w-36" /></td>
                                <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                                <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                                <td className="px-5 py-4"><Skeleton className="h-4 w-28" /></td>
                                <td className="px-5 py-4"><Skeleton className="h-4 w-full max-w-[200px]" /></td>
                                <td className="px-5 py-4 text-center"><Skeleton className="h-5 w-14 rounded-lg mx-auto" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
