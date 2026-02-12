'use client';

import { useState, useEffect } from 'react';
import { Users, Shield, ChevronLeft, ChevronRight, Crown, Layout, UserCircle, Eye } from 'lucide-react';
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
const roleColors: Record<string, { bg: string; text: string; accent: string }> = {
    admin: { bg: 'bg-red-500/10', text: 'text-red-600', accent: 'bg-red-500' },
    administrator: { bg: 'bg-red-500/10', text: 'text-red-600', accent: 'bg-red-500' },
    architect: { bg: 'bg-blue-500/10', text: 'text-blue-600', accent: 'bg-blue-500' },
    manager: { bg: 'bg-violet-500/10', text: 'text-violet-600', accent: 'bg-violet-500' },
    executive: { bg: 'bg-amber-500/10', text: 'text-amber-600', accent: 'bg-amber-500' },
    user: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', accent: 'bg-emerald-500' },
    viewer: { bg: 'bg-slate-500/10', text: 'text-slate-600', accent: 'bg-slate-500' },
    auditor: { bg: 'bg-amber-500/10', text: 'text-amber-600', accent: 'bg-amber-500' },
    business_owner: { bg: 'bg-sky-500/10', text: 'text-sky-600', accent: 'bg-sky-500' },
};

// Role-specific icons for visual distinction
const roleIcons: Record<string, React.ElementType> = {
    admin: Crown,
    administrator: Crown,
    architect: Layout,
    executive: UserCircle,
    user: UserCircle,
    viewer: Eye,
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

    const countBadgeClass = "min-w-[1.5rem] h-6 px-2 flex items-center justify-center text-xs font-medium rounded-full tabular-nums";

    return (
        <div className={cn(
            "flex flex-col h-full bg-card/80 backdrop-blur-sm transition-all duration-200 ease-in-out border-r border-border",
            isCollapsed ? "w-14" : "w-56"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border/60">
                {!isCollapsed && (
                    <span className="text-sm font-semibold text-foreground">บทบาท</span>
                )}
                <button
                    onClick={toggleCollapse}
                    className="p-2 rounded-lg hover:bg-muted/80 transition-colors shrink-0"
                    title={isCollapsed ? "ขยาย" : "ย่อ"}
                    aria-label={isCollapsed ? "ขยาย" : "ย่อ"}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    ) : (
                        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                    )}
                </button>
            </div>

            {/* All Users Button */}
            <div className="p-2">
                <button
                    onClick={() => onRoleChange('all')}
                    className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                        isCollapsed ? "justify-center" : "justify-between",
                        selectedRole === 'all'
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-muted/80 text-foreground"
                    )}
                    title="ทุกบทบาท"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/20 shrink-0">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        {!isCollapsed && <span className="font-medium truncate">ทุกบทบาท</span>}
                    </div>
                    {!isCollapsed && (
                        <span className={cn(
                            countBadgeClass,
                            selectedRole === 'all' ? "bg-white/25 text-white" : "bg-muted text-muted-foreground"
                        )}>
                            {totalUsers}
                        </span>
                    )}
                </button>
            </div>

            {/* Section Header */}
            {!isCollapsed && (
                <div className="px-3 pt-4 pb-2">
                    <p className="text-[11px] font-medium text-muted-foreground/90 uppercase tracking-widest">
                        ตามบทบาท
                    </p>
                </div>
            )}

            {/* Role Items */}
            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
                {roles.map((role) => {
                    const roleKey = role.name?.toLowerCase() || role._id;
                    const colors = roleColors[roleKey] || roleColors.viewer;
                    const Icon = roleIcons[roleKey] || Shield;
                    const count = userCounts[role._id] || 0;
                    const isSelected = selectedRole === role._id;

                    return (
                        <button
                            key={role._id}
                            onClick={() => onRoleChange(role._id)}
                            title={isCollapsed ? (role.nameTh || role.name) : undefined}
                            className={cn(
                                "w-full flex items-center gap-3 p-2.5 rounded-xl text-sm transition-all duration-200 relative overflow-hidden",
                                isCollapsed ? "justify-center" : "justify-between",
                                isSelected
                                    ? "bg-muted font-medium text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            {isSelected && (
                                <motion.div
                                    layoutId="sidebarActiveRole"
                                    className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full", colors.accent)}
                                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                />
                            )}

                            <div className="flex items-center gap-3 min-w-0">
                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0",
                                    colors.bg
                                )}>
                                    <Icon className={cn("w-4 h-4", colors.text)} />
                                </div>
                                {!isCollapsed && (
                                    <span className="truncate">{role.nameTh || role.name}</span>
                                )}
                            </div>

                            {!isCollapsed && (
                                <span className={cn(
                                    countBadgeClass,
                                    isSelected ? "bg-foreground/10 text-foreground font-semibold" : "bg-muted/80 text-muted-foreground"
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
