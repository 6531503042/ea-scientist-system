'use client';

import { ReactNode, useCallback } from 'react';
import { Shield, Eye, Edit, Trash2, Key, CheckCircle2, XCircle, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@/types';
import { UserColumnKey } from './columns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

// ============= Role Configuration =============
export const roleColors: Record<string, { bg: string; text: string }> = {
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

export const roleLabels: Record<string, { label: string; labelTh: string }> = {
    admin: { label: 'Admin', labelTh: 'ผู้ดูแลระบบ' },
    administrator: { label: 'Administrator', labelTh: 'ผู้ดูแลระบบ' },
    architect: { label: 'Architect', labelTh: 'Enterprise Architect' },
    manager: { label: 'Manager', labelTh: 'ผู้บริหาร' },
    business_owner: { label: 'Business Owner', labelTh: 'เจ้าของกระบวนการ' },
    data_owner: { label: 'Data Owner', labelTh: 'เจ้าของข้อมูล' },
    data_steward: { label: 'Data Steward', labelTh: 'ผู้ดูแลข้อมูล' },
    auditor: { label: 'Auditor', labelTh: 'ผู้ตรวจสอบ' },
    viewer: { label: 'Viewer', labelTh: 'ผู้ดู' },
};

// ============= Status Configuration =============
export const statusConfig = {
    active: { label: 'ใช้งาน', icon: CheckCircle2, color: 'text-emerald-600' },
    inactive: { label: 'ไม่ใช้งาน', icon: XCircle, color: 'text-gray-500' },
    suspended: { label: 'ระงับ', icon: XCircle, color: 'text-red-600' },
    pending: { label: 'รอยืนยัน', icon: CheckCircle2, color: 'text-amber-600' },
};

// ============= Cell Renderer Props =============
interface UserCellRendererProps {
    onViewUser?: (user: User) => void;
    onEditUser?: (user: User) => void;
    onDeleteUser?: (userId: string) => void;
    onResetPassword?: (userId: string) => void;
}

// ============= Cell Renderer Hook =============
export function useUserCellRenderer({
    onViewUser,
    onEditUser,
    onDeleteUser,
    onResetPassword,
}: UserCellRendererProps) {
    const renderCell = useCallback((user: User, columnKey: UserColumnKey): ReactNode => {
        const roleKey = typeof user.role === 'string' ? user.role.toLowerCase() : 'viewer';
        const colors = roleColors[roleKey] || roleColors.viewer;
        const labels = roleLabels[roleKey] || roleLabels.viewer;
        const displayName = user.displayName || `${user.name.first} ${user.name.last || ''}`.trim();

        switch (columnKey) {
            case 'name':
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-medium text-foreground">{displayName}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                );

            case 'role':
                return (
                    <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium",
                        colors.bg, colors.text
                    )}>
                        <Shield className="w-3.5 h-3.5" />
                        {labels.labelTh || labels.label}
                    </div>
                );

            case 'department':
                const deptName = typeof user.department === 'string'
                    ? user.department
                    : user.department?.name || '-';
                return <span className="text-sm text-foreground">{deptName}</span>;

            case 'status':
                const status = user.status || 'active';
                const statusInfo = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
                const StatusIcon = statusInfo.icon;
                return (
                    <div className={cn("flex items-center gap-1.5 text-sm", statusInfo.color)}>
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.label}
                    </div>
                );

            case 'lastLogin':
                return (
                    <span className="text-sm text-muted-foreground">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString('th-TH', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : '-'}
                    </span>
                );

            case 'actions':
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onViewUser?.(user)}>
                                <Eye className="w-4 h-4 mr-2" />
                                ดูรายละเอียด
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEditUser?.(user)}>
                                <Edit className="w-4 h-4 mr-2" />
                                แก้ไข
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onResetPassword?.(user._id)}>
                                <Key className="w-4 h-4 mr-2" />
                                รีเซ็ตรหัสผ่าน
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => onDeleteUser?.(user._id)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                ลบผู้ใช้
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );

            default:
                return null;
        }
    }, [onViewUser, onEditUser, onDeleteUser, onResetPassword]);

    return { renderCell };
}
