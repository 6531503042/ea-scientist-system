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
import type { User } from '@/types/user';
import { UserTableHeader } from './UserTableHeader';
import { UserTablePagination } from './UserTablePagination';
import type { Column } from './UsersTable';

interface UserTableContentProps {
    // Data
    users: User[];
    totalUsers: number;

    // State
    filterValue?: string;
    onSearchChange?: (value: string) => void;

    visibleColumns: Set<string>;
    setVisibleColumns: (columns: Set<string>) => void;

    sortDescriptor?: { column: string; direction: 'ascending' | 'descending' };
    setSortDescriptor?: (descriptor: { column: string; direction: 'ascending' | 'descending' }) => void;
    sortField?: string | null;
    sortDirection?: 'asc' | 'desc' | null;
    onSort?: (field: string) => void;

    currentPage?: number;
    page: number;
    totalPages?: number;
    pages: number;

    onPageChange?: (page: number) => void;
    setPage: (page: number | ((p: number) => number)) => void;
    onNextPage?: () => void;
    onPreviousPage?: () => void;

    pageSize?: number;
    rowsPerPage: number;
    setRowsPerPage?: (rows: number) => void;

    selectedKeys?: Set<string>;
    setSelectedKeys?: (keys: Set<string>) => void;

    // Render
    renderCell: (user: User, columnKey: string) => ReactNode;

    // Columns
    columns: Column[];
    allColumns: Column[];
}

export function UserTableContent({
    users,
    totalUsers,
    filterValue = '',
    onSearchChange,
    visibleColumns,
    setVisibleColumns,

    sortDescriptor,
    setSortDescriptor,
    sortField,
    sortDirection,
    onSort,

    page,
    pages,
    currentPage,
    totalPages,
    setPage,

    rowsPerPage,
    renderCell,
    columns,
    allColumns,
}: UserTableContentProps) {

    const handleSort = (columnUid: string) => {
        if (setSortDescriptor) {
            const currentDirection = sortDescriptor?.column === columnUid ? sortDescriptor.direction : null;
            const newDirection = currentDirection === 'ascending' ? 'descending' : 'ascending';
            setSortDescriptor({ column: columnUid, direction: newDirection });
        } else if (onSort) {
            onSort(columnUid);
        }
    };

    const currentSortColumn = sortDescriptor?.column || sortField;
    const currentSortDirection = sortDescriptor?.direction === 'ascending' ? 'asc' : sortDescriptor?.direction === 'descending' ? 'desc' : sortDirection;

    return (
        <div className="space-y-4 h-full flex flex-col">
            <UserTableHeader
                searchQuery={filterValue}
                onSearchChange={onSearchChange || (() => { })}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                columns={allColumns}
            />

            <div className="rounded-xl border border-border flex-1 overflow-auto bg-card">
                <Table className="min-w-[900px]">
                    <TableHeader className="sticky top-0 z-10 bg-muted/50">
                        <TableRow className="border-b border-border hover:bg-transparent">
                            {columns.map((column) => (
                                <TableHead
                                    key={column.uid}
                                    className={cn(
                                        "whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-4",
                                        column.align === 'end' ? 'text-right' :
                                            column.align === 'center' ? 'text-center' : 'text-left',
                                        column.widthClass
                                    )}
                                >
                                    {column.sortable ? (
                                        <div
                                            className={cn(
                                                "inline-flex items-center gap-1.5 cursor-pointer select-none hover:text-foreground transition-colors",
                                                column.align === 'end' && "justify-end",
                                                column.align === 'center' && "justify-center"
                                            )}
                                            onClick={() => handleSort(column.uid)}
                                        >
                                            {column.name}
                                            {currentSortColumn === column.uid ? (
                                                currentSortDirection === 'asc' ? <ArrowUp className="w-3 h-3 shrink-0" /> : <ArrowDown className="w-3 h-3 shrink-0" />
                                            ) : (
                                                <ArrowUpDown className="w-3 h-3 opacity-40 shrink-0" />
                                            )}
                                        </div>
                                    ) : (
                                        <span>{column.name}</span>
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-40 text-center align-middle">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <span className="text-sm">ไม่พบข้อมูลผู้ใช้งาน</span>
                                        <span className="text-xs">ลองค้นหาด้วยคำค้นอื่น</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user._id} className="hover:bg-muted/20 transition-colors border-b border-border/50">
                                    {columns.map((column) => (
                                        <TableCell
                                            key={`${user._id}-${column.uid}`}
                                            className={cn(
                                                "px-5 py-4 align-middle",
                                                column.align === 'end' ? 'text-right' :
                                                    column.align === 'center' ? 'text-center' : 'text-left',
                                                column.widthClass
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
                currentPage={page || currentPage || 1}
                totalPages={pages || totalPages || 1}
                onPageChange={(p) => setPage(p)}
                pageSize={rowsPerPage}
            />
        </div>
    );
}
