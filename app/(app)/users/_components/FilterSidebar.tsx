'use client';

import { useState, useEffect } from 'react';
import { Users, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
    administrator: { bg: 'bg-red-500/10', text: 'text-red-600' },
    architect: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
    manager: { bg: 'bg-violet-500/10', text: 'text-violet-600' },
    executive: { bg: 'bg-amber-500/10', text: 'text-amber-600' },
    user: { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
    viewer: { bg: 'bg-gray-500/10', text: 'text-gray-600' },
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
        <div className={cn(
            "flex flex-col h-full bg-card/50 transition-all duration-200 ease-in-out border-r border-border",
            isCollapsed ? "w-16" : "w-64"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-border/50">
                {!isCollapsed && (
                    <span className="text-sm font-semibold text-foreground">บทบาท</span>
                )}
                <button
                    onClick={toggleCollapse}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors ml-auto"
                    title={isCollapsed ? "ขยาย" : "ย่อ"}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* All Users Button */}
            <div className="p-2">
                <button
                    onClick={() => onRoleChange('all')}
                    className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200",
                        isCollapsed ? "justify-center" : "justify-between",
                        selectedRole === 'all'
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "hover:bg-muted text-foreground"
                    )}
                    title="ทุกบทบาท"
                >
                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium">ทุกบทบาท</span>}
                    </div>
                    {!isCollapsed && (
                        <span className={cn(
                            "px-2 py-0.5 text-xs font-bold rounded-md",
                            selectedRole === 'all' ? "bg-white/20" : "bg-muted"
                        )}>
                            {totalUsers}
                        </span>
                    )}
                </button>
            </div>

            {/* Section Header */}
            {!isCollapsed && (
                <div className="px-4 pt-2 pb-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        ตามบทบาท
                    </p>
                </div>
            )}

            {/* Role Items */}
            <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
                {roles.map((role) => {
                    const colors = roleColors[role._id] || roleColors.viewer;
                    const count = userCounts[role._id] || 0;
                    const isSelected = selectedRole === role._id;

                    return (
                        <button
                            key={role._id}
                            onClick={() => onRoleChange(role._id)}
                            title={isCollapsed ? (role.nameTh || role.name) : undefined}
                            className={cn(
                                "w-full flex items-center gap-3 p-2.5 rounded-lg text-sm transition-all duration-200 relative",
                                isCollapsed ? "justify-center" : "justify-between",
                                isSelected
                                    ? "bg-muted font-medium text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            {/* Active indicator */}
                            {isSelected && (
                                <motion.div
                                    layoutId="sidebarActiveRole"
                                    className={cn("absolute left-0 w-1 h-6 rounded-r-full", colors.text.replace('text-', 'bg-'))}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0",
                                    colors.bg
                                )}>
                                    <Shield className={cn("w-4 h-4", colors.text)} />
                                </div>
                                {!isCollapsed && (
                                    <span className="truncate">{role.nameTh || role.name}</span>
                                )}
                            </div>

                            {!isCollapsed && (
                                <span className={cn(
                                    "text-xs px-1.5 py-0.5 rounded",
                                    isSelected ? "font-semibold bg-muted-foreground/10" : ""
                                )}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
