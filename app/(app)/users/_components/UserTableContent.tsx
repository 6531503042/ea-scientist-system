'use client';

import { ReactNode } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@/types';
import { UserColumnKey, userColumns } from './columns';
import { UserTableHeader } from './UserTableHeader';
import { UserTablePagination } from './UserTablePagination';

interface UserTableContentProps {
    // Data
    users: User[];
    totalUsers: number;

    // State
    searchQuery: string;
    onSearchChange: (value: string) => void;

    visibleColumns: Set<UserColumnKey>;
    setVisibleColumns: (columns: Set<UserColumnKey>) => void;

    sortField: UserColumnKey | null;
    sortDirection: 'asc' | 'desc' | null;
    onSort: (field: UserColumnKey) => void;

    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize: number;

    // Render
    renderCell: (user: User, columnKey: UserColumnKey) => ReactNode;

    // Actions
}

export function UserTableContent({
    users,
    totalUsers,
    searchQuery,
    onSearchChange,
    visibleColumns,
    setVisibleColumns,
    sortField,
    sortDirection,
    onSort,
    currentPage,
    totalPages,
    onPageChange,
    pageSize,
    renderCell,
    //   onAddUser, // Removed as not used in header anymore
}: UserTableContentProps) {

    const headerColumns = userColumns.filter(col => visibleColumns.has(col.uid));

    return (
        <div className="space-y-4">
            <UserTableHeader
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {headerColumns.map((column) => (
                                <TableHead
                                    key={column.uid}
                                    className={cn(
                                        "whitespace-nowrap",
                                        column.align === 'end' ? 'text-right' :
                                            column.align === 'center' ? 'text-center' : 'text-left'
                                    )}
                                    style={{ width: column.width }}
                                >
                                    {column.sortable ? (
                                        <div
                                            className={cn(
                                                "flex items-center gap-2 cursor-pointer select-none hover:text-foreground transition-colors",
                                                column.align === 'end' && "justify-end",
                                                column.align === 'center' && "justify-center"
                                            )}
                                            onClick={() => onSort(column.uid)}
                                        >
                                            {column.nameTh || column.name}
                                            {sortField === column.uid ? (
                                                sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                            ) : (
                                                <ArrowUpDown className="w-3 h-3 opacity-50" />
                                            )}
                                        </div>
                                    ) : (
                                        <div>{column.nameTh || column.name}</div>
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={headerColumns.length} className="h-24 text-center">
                                    ไม่พบข้อมูลผู้ใช้งาน
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user._id}>
                                    {headerColumns.map((column) => (
                                        <TableCell
                                            key={`${user._id}-${column.uid}`}
                                            className={cn(
                                                column.align === 'end' ? 'text-right' :
                                                    column.align === 'center' ? 'text-center' : 'text-left'
                                            )}
                                        >
                                            {renderCell(user, column.uid)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <UserTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                pageSize={pageSize}
            />
        </div>
    );
}
