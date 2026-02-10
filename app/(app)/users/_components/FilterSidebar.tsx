'use client';

import { useState, useEffect } from 'react';
import { Users, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/types/role';

interface FilterSidebarProps {
    roles: Role[];
    selectedRole: string;
    onRoleChange: (roleId: string) => void;
    userCounts: Record<string, number>;
    totalUsers: number;
}

// Role color mapping
const roleColors: Record<string, { bg: string; text: string }> = {
    admin: { bg: 'bg-red-500/10', text: 'text-red-600' },
    architect: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
    manager: { bg: 'bg-amber-500/10', text: 'text-amber-600' },
    viewer: { bg: 'bg-gray-500/10', text: 'text-gray-600' },
    // Backwards compatibility if needed, but safe to add
    auditor: { bg: 'bg-amber-500/10', text: 'text-amber-600' },
    business_owner: { bg: 'bg-sky-500/10', text: 'text-sky-600' },
};

export function FilterSidebar({
    roles,
    selectedRole,
    onRoleChange,
    userCounts,
    totalUsers
}: FilterSidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Load collapsed state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('user-filter-sidebar-collapsed');
        if (saved !== null) {
            setIsCollapsed(saved === 'true');
        }
    }, []);

    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('user-filter-sidebar-collapsed', String(newState));
    };

    return (
        <aside className={cn(
            "bg-card border-r border-border transition-all duration-300 flex flex-col",
            isCollapsed ? "w-16" : "w-64"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                {!isCollapsed && (
                    <h3 className="text-sm font-semibold text-foreground">บทบาท</h3>
                )}
                <button
                    onClick={toggleCollapse}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-auto"
                    title={isCollapsed ? "ขยาย" : "ย่อ"}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Filters */}
            <div className="flex-1 overflow-y-auto p-2">
                {/* All Users */}
                <button
                    onClick={() => onRoleChange('all')}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-1",
                        selectedRole === 'all'
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    title="ทุกบทบาท"
                >
                    <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        selectedRole === 'all' ? "bg-primary/20" : "bg-muted"
                    )}>
                        <Users className={cn(
                            "w-4 h-4",
                            selectedRole === 'all' ? "text-primary" : "text-muted-foreground"
                        )} />
                    </div>
                    {!isCollapsed && (
                        <>
                            <span className="flex-1 text-left truncate">ทุกบทบาท</span>
                            <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                selectedRole === 'all'
                                    ? "bg-primary/20 text-primary"
                                    : "bg-muted text-muted-foreground"
                            )}>
                                {totalUsers}
                            </span>
                        </>
                    )}
                </button>

                {/* Role Items */}
                {roles.map((role) => {
                    const colors = roleColors[role._id] || roleColors.viewer;
                    const count = userCounts[role._id] || 0;

                    return (
                        <button
                            key={role._id}
                            onClick={() => onRoleChange(role._id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-1",
                                selectedRole === role._id
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                            title={role.name}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                colors.bg
                            )}>
                                <Shield className={cn("w-4 h-4", colors.text)} />
                            </div>
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1 text-left truncate">
                                        {role.nameTh || role.name}
                                    </span>
                                    <span className={cn(
                                        "text-xs px-2 py-0.5 rounded-full",
                                        selectedRole === role._id
                                            ? "bg-primary/20 text-primary"
                                            : "bg-muted text-muted-foreground"
                                    )}>
                                        {count}
                                    </span>
                                </>
                            )}
                        </button>
                    );
                })}
            </div>
        </aside>
    );
}
