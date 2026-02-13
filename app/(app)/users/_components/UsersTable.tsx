'use client';

import { useState, useMemo, useCallback, ReactNode } from 'react';
import {
    Shield,
    Edit,
    Trash2,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserTableContent } from './UserTableContent';
import type { User } from '@/types/user';
import { Button } from '@/components/ui/button';

// ============= Column Definitions =============
export type Column = {
    uid: string;
    name: string;
    sortable?: boolean;
    align?: 'start' | 'center' | 'end';
    widthClass?: string;
};

export const columns: Column[] = [
    { uid: 'name', name: 'ผู้ใช้', sortable: true, widthClass: 'min-w-[200px]' },
    { uid: 'role', name: 'บทบาท', widthClass: 'min-w-[120px]' },
    { uid: 'department', name: 'หน่วยงาน', sortable: true, widthClass: 'min-w-[100px]' },
    { uid: 'status', name: 'สถานะ', widthClass: 'min-w-[100px]' },
    { uid: 'lastLogin', name: 'เข้าสู่ระบบล่าสุด', sortable: true, widthClass: 'min-w-[140px]' },
    { uid: 'actions', name: 'การดำเนินการ', align: 'end', widthClass: 'w-[100px]' },
];

const INITIAL_VISIBLE_COLUMNS = ['name', 'role', 'department', 'status', 'lastLogin', 'actions'];

// ============= Renderer Helpers =============
const roleColors: Record<string, { bg: string; text: string }> = {
    admin: { bg: 'bg-red-500/10', text: 'text-red-600' },
    administrator: { bg: 'bg-red-500/10', text: 'text-red-600' },
    architect: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
    executive: { bg: 'bg-amber-500/10', text: 'text-amber-600' },
    manager: { bg: 'bg-violet-500/10', text: 'text-violet-600' },
    user: { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
    business_owner: { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
    data_owner: { bg: 'bg-sky-500/10', text: 'text-sky-600' },
    data_steward: { bg: 'bg-teal-500/10', text: 'text-teal-600' },
    auditor: { bg: 'bg-amber-500/10', text: 'text-amber-600' },
    viewer: { bg: 'bg-slate-500/10', text: 'text-slate-600' },
};

const roleLabels: Record<string, { label: string; labelTh: string }> = {
    admin: { label: 'Admin', labelTh: 'ผู้ดูแลระบบ' },
    administrator: { label: 'Administrator', labelTh: 'ผู้ดูแลระบบ' },
    architect: { label: 'Architect', labelTh: 'สถาปนิก' },
    executive: { label: 'Executive', labelTh: 'ผู้บริหาร' },
    manager: { label: 'Manager', labelTh: 'ผู้จัดการ' },
    user: { label: 'User', labelTh: 'ผู้ใช้' },
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

interface UsersTableProps {
    users: User[];
    isLoading: boolean;
    onEditUser: (user: User) => void;
    onDeleteUser: (userId: string) => void;
    searchQuery?: string;
    onSearchChange?: (value: string) => void;
}

export function UsersTable({
    users,
    isLoading,
    onEditUser,
    onDeleteUser,
    searchQuery,
    onSearchChange,
}: UsersTableProps) {
    // State
    const [internalFilterValue, setInternalFilterValue] = useState('');

    const filterValue = searchQuery !== undefined ? searchQuery : internalFilterValue;
    const handleSearchChange = onSearchChange || setInternalFilterValue;

    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState('all');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState<{
        column: string;
        direction: 'ascending' | 'descending';
    }>({
        column: 'name',
        direction: 'ascending',
    });
    const [page, setPage] = useState(1);

    const hasSearchFilter = Boolean(filterValue);

    // Cell Renderer
    const renderCell = useCallback((user: User, columnKey: string): ReactNode => {
        const roleKey = typeof user.role === 'string' ? user.role.toLowerCase() : 'viewer';
        const colors = roleColors[roleKey] || roleColors.viewer;
        const labels = roleLabels[roleKey] || roleLabels.viewer;
        const displayName = user.displayName || `${user.name.first} ${user.name.last || ''}`.trim();

        switch (columnKey) {
            case 'name':
                return (
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex flex-col gap-0.5">
                            <p className="font-medium text-foreground truncate">{displayName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                    </div>
                );

            case 'role':
                return (
                    <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium w-fit",
                        colors.bg, colors.text
                    )}>
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap">{labels.labelTh || labels.label}</span>
                    </div>
                );

            case 'department':
                const deptName = typeof user.department === 'string'
                    ? user.department
                    : (user.department as { name?: string })?.name;
                return (
                    <span className="text-sm text-muted-foreground">
                        {deptName || '-'}
                    </span>
                );

            case 'status':
                const status = user.status || 'active';
                const info = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
                const Icon = info.icon;
                return (
                    <div className={cn("inline-flex items-center gap-1.5 text-sm", info.color)}>
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{info.label}</span>
                    </div>
                );

            case 'lastLogin':
                const lastLoginDate = user.lastLogin ? new Date(user.lastLogin) : null;
                const isValidDate = lastLoginDate && !isNaN(lastLoginDate.getTime());
                return (
                    <span className="text-sm text-muted-foreground">
                        {isValidDate
                            ? lastLoginDate.toLocaleString('th-TH', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                              })
                            : '-'}
                    </span>
                );

            case 'actions':
                return (
                    <div className="flex items-center gap-0.5 justify-end shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => onEditUser?.(user)}
                            title="แก้ไข"
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => onDeleteUser?.(user._id)}
                            title="ลบผู้ใช้"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                );

            default:
                return null;
        }
    }, [onEditUser, onDeleteUser]);

    // Filtering
    const headerColumns = useMemo(() => {
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.name.first.toLowerCase().includes(filterValue.toLowerCase()) ||
                user.name.last.toLowerCase().includes(filterValue.toLowerCase()) ||
                user.email.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (statusFilter !== 'all' && Array.from(statusFilter).length !== Object.keys(statusConfig).length) {
            filteredUsers = filteredUsers.filter((user) =>
                statusFilter.includes(user.status || 'active')
            );
        }

        return filteredUsers;
    }, [users, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a: User, b: User) => {
            let first: string | number | undefined;
            let second: string | number | undefined;

            switch (sortDescriptor.column) {
                case 'name':
                    first = (a.displayName || `${a.name.first} ${a.name.last || ''}`).toLowerCase();
                    second = (b.displayName || `${b.name.first} ${b.name.last || ''}`).toLowerCase();
                    break;
                case 'department':
                    first = (typeof a.department === 'string' ? a.department : a.department?.name || '').toLowerCase();
                    second = (typeof b.department === 'string' ? b.department : b.department?.name || '').toLowerCase();
                    break;
                case 'lastLogin':
                    first = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
                    second = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
                    break;
                default:
                    first = (a as any)[sortDescriptor.column];
                    second = (b as any)[sortDescriptor.column];
                    if (typeof first === 'string') first = first.toLowerCase();
                    if (typeof second === 'string') second = second.toLowerCase();
                    break;
            }

            const cmp = (first || '') < (second || '') ? -1 : (first || '') > (second || '') ? 1 : 0;

            return sortDescriptor.direction === 'descending' ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    return (
        <UserTableContent
            users={sortedItems}
            columns={headerColumns}
            renderCell={renderCell}
            filterValue={filterValue}
            onSearchChange={handleSearchChange}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            allColumns={columns}
            page={page}
            setPage={setPage}
            pages={pages}
            onNextPage={() => setPage(p => Math.min(pages, p + 1))}
            onPreviousPage={() => setPage(p => Math.max(1, p - 1))}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            sortDescriptor={sortDescriptor}
            setSortDescriptor={setSortDescriptor}
            totalUsers={filteredItems.length}
        />
    );
}
