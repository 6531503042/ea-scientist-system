'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Shield,
    Edit,
    Trash2,
    Key,
    Eye,
    CheckCircle2,
    XCircle,
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

// Role color mapping (matching example-other-project)
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

const roleLabels: Record<string, { label: string; labelTh: string }> = {
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

const statusConfig = {
    active: { label: 'ใช้งาน', icon: CheckCircle2, color: 'text-emerald-600' },
    inactive: { label: 'ไม่ใช้งาน', icon: XCircle, color: 'text-gray-500' },
    suspended: { label: 'ระงับ', icon: XCircle, color: 'text-red-600' },
    pending: { label: 'รอยืนยัน', icon: CheckCircle2, color: 'text-amber-600' },
};

type SortField = 'name' | 'department' | 'lastLogin' | null;
type SortDirection = 'asc' | 'desc' | null;

const ITEMS_PER_PAGE = 10;

interface UsersTableProps {
    users: User[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onViewUser?: (user: User) => void;
    onEditUser?: (user: User) => void;
    onDeleteUser?: (userId: string) => void;
    onResetPassword?: (userId: string) => void;
}

export function UsersTable({
    users,
    searchQuery,
    onSearchChange,
    onViewUser,
    onEditUser,
    onDeleteUser,
    onResetPassword,
}: UsersTableProps) {
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else if (sortDirection === 'desc') {
                setSortField(null);
                setSortDirection(null);
            }
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    // Filter and sort users
    const filteredUsers = useMemo(() => {
        let result = users.filter(user => {
            const displayName = user.displayName || `${user.name.first} ${user.name.last || ''}`.trim();
            return displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());
        });

        // Apply sorting
        if (sortField && sortDirection) {
            result = [...result].sort((a, b) => {
                let aValue: string;
                let bValue: string;

                switch (sortField) {
                    case 'name':
                        aValue = (a.displayName || `${a.name.first} ${a.name.last || ''}`).toLowerCase();
                        bValue = (b.displayName || `${b.name.first} ${b.name.last || ''}`).toLowerCase();
                        break;
                    case 'department':
                        aValue = (typeof a.department === 'string' ? a.department : a.department?.name || '').toLowerCase();
                        bValue = (typeof b.department === 'string' ? b.department : b.department?.name || '').toLowerCase();
                        break;
                    case 'lastLogin':
                        aValue = a.lastLogin || '';
                        bValue = b.lastLogin || '';
                        break;
                    default:
                        return 0;
                }

                if (sortDirection === 'asc') {
                    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                } else {
                    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
                }
            });
        }

        return result;
    }, [users, searchQuery, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Generate page numbers
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
        <button
            onClick={() => handleSort(field)}
            className={cn(
                "group flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wider transition-all px-2 py-1 -mx-2 -my-1 rounded-md",
                "hover:bg-muted/50 hover:text-foreground",
                sortField === field && "text-foreground bg-muted/70"
            )}
        >
            <span>{children}</span>
            <div className="min-w-[14px]">
                {sortField === field ? (
                    sortDirection === 'asc' ? (
                        <ArrowUp className="h-3.5 w-3.5 text-primary" />
                    ) : (
                        <ArrowDown className="h-3.5 w-3.5 text-primary" />
                    )
                ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-40 group-hover:opacity-70" />
                )}
            </div>
        </button>
    );

    return (
        <div className="flex-1 min-w-0 space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="ค้นหาชื่อ, อีเมล..."
                    value={searchQuery}
                    onChange={(e) => {
                        onSearchChange(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full h-11 pl-11 pr-10 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                {searchQuery && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                        <colgroup>
                            <col className="w-[250px]" />
                            <col className="w-[150px]" />
                            <col className="w-[200px]" />
                            <col className="w-[100px]" />
                            <col className="w-[160px]" />
                            <col className="w-[140px]" />
                        </colgroup>
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-left px-5 py-4">
                                    <SortableHeader field="name">ผู้ใช้</SortableHeader>
                                </th>
                                <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    บทบาท
                                </th>
                                <th className="text-left px-5 py-4">
                                    <SortableHeader field="department">หน่วยงาน</SortableHeader>
                                </th>
                                <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    สถานะ
                                </th>
                                <th className="text-left px-5 py-4">
                                    <SortableHeader field="lastLogin">เข้าใช้ล่าสุด</SortableHeader>
                                </th>
                                <th className="text-right px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    การดำเนินการ
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((user, index) => {
                                const roleKey = typeof user.role === 'string' ? user.role : 'viewer';
                                const colors = roleColors[roleKey] || roleColors.viewer;
                                const labels = roleLabels[roleKey] || roleLabels.viewer;
                                const status = statusConfig[user.status as keyof typeof statusConfig] || statusConfig.active;
                                const StatusIcon = status.icon;
                                const displayName = user.displayName || `${user.name.first} ${user.name.last || ''}`.trim();

                                return (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.02 }}
                                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold shrink-0">
                                                    {displayName.charAt(0)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-foreground truncate">{displayName}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={cn(
                                                "px-3 py-1.5 text-xs font-medium rounded-lg inline-block",
                                                colors.bg, colors.text
                                            )}>
                                                {labels.labelTh}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-foreground truncate block">
                                                {typeof user.department === 'string' ? user.department : user.department?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className={cn("flex items-center gap-1.5", status.color)}>
                                                <StatusIcon className="w-4 h-4 shrink-0" />
                                                <span className="text-sm">{status.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-muted-foreground">{user.lastLogin || '-'}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => onViewUser?.(user)}
                                                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                                                    title="ดูรายละเอียด"
                                                >
                                                    <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                                </button>
                                                <button
                                                    onClick={() => onEditUser?.(user)}
                                                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                                                    title="แก้ไข"
                                                >
                                                    <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                                </button>
                                                <button
                                                    onClick={() => onResetPassword?.(user._id)}
                                                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                                                    title="รีเซ็ตรหัสผ่าน"
                                                >
                                                    <Key className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                                </button>
                                                <button
                                                    onClick={() => onDeleteUser?.(user._id)}
                                                    className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
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

                {/* Pagination */}
                <div className="px-5 py-3 border-t border-border bg-muted/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                            แสดง <span className="font-semibold text-foreground">
                                {filteredUsers.length > 0 ? startIndex + 1 : 0}
                            </span> - <span className="font-semibold text-foreground">
                                {Math.min(endIndex, filteredUsers.length)}
                            </span> จาก <span className="font-semibold text-foreground">{filteredUsers.length}</span> รายการ
                        </p>

                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={cn(
                                        "flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium transition-all",
                                        currentPage === 1
                                            ? "opacity-50 cursor-not-allowed bg-muted"
                                            : "bg-background hover:bg-muted border border-border"
                                    )}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="hidden sm:inline">ก่อนหน้า</span>
                                </button>

                                <div className="flex items-center gap-1">
                                    {getPageNumbers().map((page, index) => (
                                        typeof page === 'string' ? (
                                            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={cn(
                                                    "h-9 w-9 rounded-lg text-sm font-medium transition-all",
                                                    currentPage === page
                                                        ? "bg-primary text-primary-foreground shadow-md"
                                                        : "bg-background hover:bg-muted border border-border"
                                                )}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}
                                </div>

                                <button
                                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={cn(
                                        "flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium transition-all",
                                        currentPage === totalPages
                                            ? "opacity-50 cursor-not-allowed bg-muted"
                                            : "bg-background hover:bg-muted border border-border"
                                    )}
                                >
                                    <span className="hidden sm:inline">ถัดไป</span>
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
