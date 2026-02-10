'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    Eye,
    Edit2,
    Trash2,
    Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/types/role';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

// Role color mapping
const roleColors: Record<string, { bg: string; text: string }> = {
    admin: { bg: 'bg-red-500/10', text: 'text-red-600' },
    administrator: { bg: 'bg-red-500/10', text: 'text-red-600' },
    architect: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
    manager: { bg: 'bg-violet-500/10', text: 'text-violet-600' },
    business_owner: { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
    data_owner: { bg: 'bg-sky-500/10', text: 'text-sky-600' },
    data_steward: { bg: 'bg-teal-500/10', text: 'text-teal-600' },
    auditor: { bg: 'bg-amber-500/10', text: 'text-amber-600' },
    viewer: { bg: 'bg-gray-500/10', text: 'text-gray-600' },
};

interface RolesTableProps {
    roles: Role[];
    onEditRole?: (role: Role) => void;
    onDeleteRole?: (roleId: string) => void;
}

export function RolesTable({ roles, onEditRole, onDeleteRole }: RolesTableProps) {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    // Stats - calculated automatically
    const systemRoles = roles.filter(r => r.isSystemRole || ['admin', 'administrator'].includes(r.name.toLowerCase()));
    const customRoles = roles.filter(r => !r.isSystemRole && !['admin', 'administrator'].includes(r.name.toLowerCase()));

    return (
        <div className="space-y-6">
            {/* Stats Cards - 4 cards, no button inside */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="text-xs text-muted-foreground mb-1">บทบาททั้งหมด</div>
                    <div className="text-2xl font-bold text-foreground">{roles.length}</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="text-xs text-muted-foreground mb-1">บทบาทระบบ</div>
                    <div className="text-2xl font-bold text-foreground">{systemRoles.length}</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="text-xs text-muted-foreground mb-1">บทบาทกำหนดเอง</div>
                    <div className="text-2xl font-bold text-foreground">{customRoles.length}</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="text-xs text-muted-foreground mb-1">สิทธิ์ทั้งหมด</div>
                    <div className="text-2xl font-bold text-foreground">12</div>
                </div>
            </div>

            {/* Roles Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                        <colgroup>
                            <col className="w-[200px]" />
                            <col className="w-[300px]" />
                            <col className="w-[250px]" />
                            <col className="w-[100px]" />
                            <col className="w-[120px]" />
                        </colgroup>
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">บทบาท</th>
                                <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">คำอธิบาย</th>
                                <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">สิทธิ์การใช้งาน</th>
                                <th className="text-right px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ผู้ใช้</th>
                                <th className="text-right px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">การดำเนินการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role, index) => {
                                const roleKey = role._id;
                                const colors = roleColors[roleKey] || roleColors.viewer;
                                const isSystemRole = role.isSystemRole || ['admin', 'administrator'].includes(role.name.toLowerCase());
                                const permissions = Array.isArray(role.permissions) ? role.permissions : [];

                                return (
                                    <motion.tr
                                        key={role._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.02 }}
                                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                                        onClick={() => setSelectedRole(role)}
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", colors.bg)}>
                                                    <Shield className={cn("w-6 h-6", colors.text)} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-foreground">{role.nameTh || role.name}</p>
                                                        {isSystemRole && (
                                                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground rounded border border-border">
                                                                System
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{role.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {role.description || 'ไม่มีคำอธิบาย'}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {permissions.slice(0, 3).map((perm, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-0.5 text-xs bg-muted rounded-md text-muted-foreground"
                                                    >
                                                        {typeof perm === 'string' ? perm : (perm as { name?: string }).name || 'permission'}
                                                    </span>
                                                ))}
                                                {permissions.length > 3 && (
                                                    <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-md font-medium">
                                                        +{permissions.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-semibold text-foreground">
                                                    {role.userCount || 0}
                                                </span>
                                                <span className="text-xs text-muted-foreground">คน</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="ดูรายละเอียด"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedRole(role);
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                                </button>
                                                <button
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="แก้ไข"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEditRole?.(role);
                                                    }}
                                                >
                                                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                                                </button>
                                                {!isSystemRole && (
                                                    <button
                                                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                                        title="ลบ"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDeleteRole?.(role._id);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Role Detail Dialog */}
            <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    {selectedRole && (() => {
                        const roleKey = selectedRole._id;
                        const colors = roleColors[roleKey] || roleColors.viewer;
                        const isSystemRole = selectedRole.isSystemRole || ['admin', 'administrator'].includes(selectedRole.name.toLowerCase());
                        const permissions = Array.isArray(selectedRole.permissions) ? selectedRole.permissions : [];

                        return (
                            <>
                                <DialogHeader>
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors.bg)}>
                                            <Shield className={cn("w-6 h-6", colors.text)} />
                                        </div>
                                        <div className="flex-1">
                                            <DialogTitle className="text-xl font-bold">{selectedRole.nameTh || selectedRole.name}</DialogTitle>
                                            <DialogDescription className="mt-1">{selectedRole.name}</DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>

                                <div className="space-y-6 py-4">
                                    {/* Description */}
                                    <div>
                                        <h4 className="text-sm font-semibold mb-2">คำอธิบาย</h4>
                                        <p className="text-sm text-foreground bg-muted/50 p-4 rounded-lg border border-border">
                                            {selectedRole.description || 'ไม่มีคำอธิบาย'}
                                        </p>
                                    </div>

                                    {/* Permissions */}
                                    <div>
                                        <h4 className="text-sm font-semibold mb-3">
                                            สิทธิ์การใช้งาน ({permissions.length} สิทธิ์)
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {permissions.map((perm, i) => (
                                                <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted/30">
                                                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                    <span className="text-sm text-foreground">
                                                        {typeof perm === 'string' ? perm : (perm as { name?: string }).name || 'permission'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Info Cards */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                            <span className="text-xs text-muted-foreground block mb-1">จำนวนผู้ใช้</span>
                                            <p className="text-xl font-bold text-foreground">{selectedRole.userCount || 0} คน</p>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                            <span className="text-xs text-muted-foreground block mb-1">ประเภทบทบาท</span>
                                            <span className={cn(
                                                "inline-flex px-2 py-1 text-xs font-medium rounded mt-1",
                                                isSystemRole ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                            )}>
                                                {isSystemRole ? 'บทบาทระบบ' : 'บทบาทกำหนดเอง'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                    <button
                                        onClick={() => setSelectedRole(null)}
                                        className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
                                    >
                                        ปิด
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedRole(null);
                                            onEditRole?.(selectedRole);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        แก้ไขบทบาท
                                    </button>
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    );
}
