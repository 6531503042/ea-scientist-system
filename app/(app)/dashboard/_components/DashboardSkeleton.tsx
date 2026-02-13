'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
    return (
        <div className="flex-1 overflow-y-auto">
            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Skeleton className="w-10 h-10 rounded-lg" />
                            <div className="space-y-1">
                                <Skeleton className="h-7 w-12" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left - TOGAF section */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex justify-between mb-4">
                            <div className="space-y-1">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="p-4 rounded-xl border border-border">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Skeleton className="w-10 h-10 rounded-lg" />
                                        <Skeleton className="h-7 w-8" />
                                    </div>
                                    <Skeleton className="h-4 w-24 mb-1" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right - Quick actions & activity */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-card border border-border rounded-xl p-4">
                        <Skeleton className="h-5 w-24 mb-3" />
                        <div className="space-y-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3">
                                    <Skeleton className="w-8 h-8 rounded-lg" />
                                    <div className="flex-1 space-y-1">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-3 w-40" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-4">
                        <div className="flex justify-between mb-3">
                            <Skeleton className="h-5 w-28" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                                    <div className="flex-1 space-y-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-40" />
                                    </div>
                                    <Skeleton className="h-5 w-14 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
