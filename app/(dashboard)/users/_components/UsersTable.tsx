'use client';

import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    Shield,
    Edit,
    Trash2,
    Key,
    ChevronDown,
    CheckCircle2,
    UserX,
    Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

const roleLabels: Record<string, { label: string; labelTh: string; color: string }> = {
    admin: { label: 'Admin', labelTh: 'ผู้ดูแลระบบ', color: 'bg-destructive/10 text-destructive' },
    architect: { label: 'Architect', labelTh: 'Enterprise Architect', color: 'bg-info/10 text-info' },
    manager: { label: 'Manager', labelTh: 'ผู้บริหาร', color: 'bg-amber-500/10 text-amber-700' },
    business_owner: { label: 'Business Owner', labelTh: 'เจ้าของกระบวนการ', color: 'bg-success/10 text-success' },
    auditor: { label: 'Auditor', labelTh: 'ผู้ตรวจสอบ', color: 'bg-warning/10 text-warning' },
    viewer: { label: 'Viewer', labelTh: 'ผู้ดู', color: 'bg-muted text-muted-foreground' },
};

const statusLabels: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    active: { label: 'ใช้งาน', color: 'text-success', icon: CheckCircle2 },
    inactive: { label: 'ไม่ใช้งาน', color: 'text-muted-foreground', icon: UserX },
    pending: { label: 'รอยืนยัน', color: 'text-warning', icon: Mail },
};

interface UsersTableProps {
    users: User[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onEditUser?: (user: User) => void;
    onDeleteUser?: (userId: string) => void;
    onResetPassword?: (userId: string) => void;
    onManagePermissions?: (user: User) => void;
}

export function UsersTable({
    users,
    searchQuery,
    onSearchChange,
    onEditUser,
    onDeleteUser,
    onResetPassword,
    onManagePermissions,
}: UsersTableProps) {
    return (
        <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="ค้นหา..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-11 pl-11 pr-4 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 h-11 bg-muted hover:bg-muted/80 rounded-xl transition-colors">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">กรองข้อมูล</span>
                    <ChevronDown className="w-4 h-4" />
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ผู้ใช้</th>
                                <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">บทบาท</th>
                                <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">หน่วยงาน</th>
                                <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">สถานะ</th>
                                <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">เข้าใช้ล่าสุด</th>
                                <th className="text-right px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">การดำเนินการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => {
                                const roleKey = typeof user.role === 'string' ? user.role : 'viewer';
                                const roleLabel = roleLabels[roleKey] || roleLabels.viewer;
                                const statusLabel = statusLabels[user.status] || statusLabels.active;
                                const StatusIcon = statusLabel.icon;
                                const displayName = user.displayName || `${user.name.first} ${user.name.last || ''}`.trim();

                                return (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
                                                    {displayName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{displayName}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={cn(
                                                "px-3 py-1.5 text-xs font-medium rounded-lg",
                                                roleLabel.color
                                            )}>
                                                {roleLabel.labelTh}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-foreground">
                                                {typeof user.department === 'string' ? user.department : user.department?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className={cn("flex items-center gap-1.5", statusLabel.color)}>
                                                <StatusIcon className="w-4 h-4" />
                                                <span className="text-sm">{statusLabel.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-muted-foreground">{user.lastLogin || '-'}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => onManagePermissions?.(user)}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="จัดการสิทธิ์"
                                                >
                                                    <Shield className="w-4 h-4 text-muted-foreground" />
                                                </button>
                                                <button
                                                    onClick={() => onEditUser?.(user)}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="แก้ไข"
                                                >
                                                    <Edit className="w-4 h-4 text-muted-foreground" />
                                                </button>
                                                <button
                                                    onClick={() => onResetPassword?.(user._id)}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="รีเซ็ตรหัสผ่าน"
                                                >
                                                    <Key className="w-4 h-4 text-muted-foreground" />
                                                </button>
                                                <button
                                                    onClick={() => onDeleteUser?.(user._id)}
                                                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                                    title="ลบ"
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
