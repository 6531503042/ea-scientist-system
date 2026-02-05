'use client';

import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

interface RolesCardProps {
    roles: Role[];
    onEditRole?: (role: Role) => void;
    onViewUsers?: (roleId: string) => void;
}

export function RolesCard({ roles, onEditRole, onViewUsers }: RolesCardProps) {
    const roleColors: Record<string, string> = {
        admin: 'border-destructive/30',
        architect: 'border-info/30',
        manager: 'border-amber-500/30',
        business_owner: 'border-success/30',
        auditor: 'border-warning/30',
        viewer: 'border-muted',
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role, index) => (
                <motion.div
                    key={role._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                        "p-5 bg-card rounded-xl border-2 hover:shadow-lg transition-all",
                        roleColors[role.name.toLowerCase()] || 'border-border'
                    )}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-foreground text-lg">{role.nameTh || role.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{role.description || '-'}</p>
                        </div>
                        <button
                            onClick={() => onEditRole?.(role)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <Settings className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>

                    <div className="mb-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                            สิทธิ์การใช้งาน
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {(role.permissions as string[]).slice(0, 5).map((perm) => (
                                <span
                                    key={typeof perm === 'string' ? perm : perm}
                                    className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground"
                                >
                                    {typeof perm === 'string' ? perm : perm}
                                </span>
                            ))}
                            {(role.permissions as string[]).length > 5 && (
                                <span className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground">
                                    +{(role.permissions as string[]).length - 5} more
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-sm text-muted-foreground">
                            ผู้ใช้งาน
                        </span>
                        <button
                            onClick={() => onViewUsers?.(role._id)}
                            className="text-sm text-primary hover:underline"
                        >
                            ดูรายชื่อ →
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
