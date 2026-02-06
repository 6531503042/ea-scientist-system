'use client';

import { Skeleton } from '@/components/ui/skeleton';

// Stats Cards Skeleton
export function StatsCardsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4">
                    <Skeleton className="h-3 w-24 mb-2" />
                    <Skeleton className="h-8 w-12" />
                </div>
            ))}
        </div>
    );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
    return (
        <tr className="border-b border-border">
            {[...Array(columns)].map((_, i) => (
                <td key={i} className="px-5 py-4">
                    {i === 0 ? (
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    ) : i === columns - 1 ? (
                        <div className="flex items-center justify-end gap-2">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <Skeleton className="w-8 h-8 rounded-lg" />
                        </div>
                    ) : (
                        <Skeleton className="h-4 w-full max-w-[120px]" />
                    )}
                </td>
            ))}
        </tr>
    );
}

// Users Table Skeleton
export function UsersTableSkeleton() {
    return (
        <div className="space-y-4">
            {/* Search */}
            <Skeleton className="h-10 w-full max-w-md rounded-lg" />

            {/* Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-16" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-16" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-16" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-16" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-16" /></th>
                            <th className="text-right px-5 py-4"><Skeleton className="h-3 w-16 ml-auto" /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, i) => (
                            <TableRowSkeleton key={i} columns={6} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-40" />
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <Skeleton className="h-9 w-9 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

// Roles Table Skeleton
export function RolesTableSkeleton() {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <StatsCardsSkeleton />

            {/* Roles Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-16" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-16" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-20" /></th>
                            <th className="text-right px-5 py-4"><Skeleton className="h-3 w-12 ml-auto" /></th>
                            <th className="text-right px-5 py-4"><Skeleton className="h-3 w-16 ml-auto" /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(4)].map((_, i) => (
                            <tr key={i} className="border-b border-border">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-12 h-12 rounded-xl" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-28" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <Skeleton className="h-4 w-48" />
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex gap-1.5">
                                        <Skeleton className="h-5 w-20 rounded-md" />
                                        <Skeleton className="h-5 w-20 rounded-md" />
                                        <Skeleton className="h-5 w-10 rounded-md" />
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex flex-col items-end">
                                        <Skeleton className="h-4 w-6" />
                                        <Skeleton className="h-3 w-8 mt-1" />
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-end gap-1">
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
    );
}

// Departments Table Skeleton
export function DepartmentsTableSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-9 w-32 rounded-lg" />
            </div>

            {/* Search */}
            <Skeleton className="h-10 w-full rounded-lg" />

            {/* Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-20" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-12" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-16" /></th>
                            <th className="text-left px-5 py-4"><Skeleton className="h-3 w-14" /></th>
                            <th className="text-right px-5 py-4"><Skeleton className="h-3 w-16 ml-auto" /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, i) => (
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
                                <td className="px-5 py-4">
                                    <Skeleton className="h-6 w-12 rounded-lg" />
                                </td>
                                <td className="px-5 py-4">
                                    <Skeleton className="h-4 w-8" />
                                </td>
                                <td className="px-5 py-4">
                                    <Skeleton className="h-6 w-16 rounded-lg" />
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Skeleton className="w-8 h-8 rounded-lg" />
                                        <Skeleton className="w-8 h-8 rounded-lg" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-40" />
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <Skeleton className="h-9 w-9 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

// Filter Sidebar Skeleton
export function FilterSidebarSkeleton() {
    return (
        <aside className="w-64 bg-card border-r border-border p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-6 w-6 rounded" />
            </div>

            {/* All Roles Item */}
            <div className="p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-8 rounded-full ml-auto" />
                </div>
            </div>

            {/* Role Items */}
            {[...Array(5)].map((_, i) => (
                <div key={i} className="p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-6 rounded-full ml-auto" />
                    </div>
                </div>
            ))}
        </aside>
    );
}

// Full Page Skeleton
export function UserManagementSkeleton({ activeTab = 'users' }: { activeTab?: 'users' | 'roles' | 'departments' }) {
    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 pb-0">
                <Skeleton className="h-4 w-72" />
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>

            {/* Tabs */}
            <div className="px-4 sm:px-6 py-4">
                <div className="flex items-center gap-1 p-1 bg-muted rounded-xl w-fit">
                    <Skeleton className="h-9 w-24 rounded-lg" />
                    <Skeleton className="h-9 w-20 rounded-lg" />
                    <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
            </div>

            {/* Content */}
            {activeTab === 'users' ? (
                <div className="flex flex-1 overflow-hidden">
                    <div className="hidden lg:block">
                        <FilterSidebarSkeleton />
                    </div>
                    <div className="flex-1 p-4 sm:p-6 pt-0">
                        <UsersTableSkeleton />
                    </div>
                </div>
            ) : activeTab === 'roles' ? (
                <div className="flex-1 p-4 sm:p-6 pt-0">
                    <RolesTableSkeleton />
                </div>
            ) : (
                <div className="flex-1 p-4 sm:p-6 pt-0">
                    <DepartmentsTableSkeleton />
                </div>
            )}
        </div>
    );
}
