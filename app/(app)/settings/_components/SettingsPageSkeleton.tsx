'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function SettingsPageSkeleton() {
    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-72" />
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-card rounded-xl border border-border p-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                                    <Skeleton className="w-4 h-4 rounded" />
                                    <Skeleton className="h-4 flex-1" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-4 bg-card rounded-xl border border-border">
                            <Skeleton className="h-5 w-24 mb-3" />
                            <div className="space-y-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex justify-between">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-16 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="bg-card rounded-xl border border-border p-6">
                            <Skeleton className="h-6 w-32 mb-6" />
                            <div className="space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full rounded-lg" />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-border flex justify-end">
                                <Skeleton className="h-10 w-36 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
