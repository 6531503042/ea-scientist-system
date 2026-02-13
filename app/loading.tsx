'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
            <div className="w-full max-w-2xl space-y-6">
                <div className="flex gap-4">
                    <Skeleton className="h-20 flex-1 rounded-xl" />
                    <Skeleton className="h-20 flex-1 rounded-xl" />
                    <Skeleton className="h-20 flex-1 rounded-xl" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}
