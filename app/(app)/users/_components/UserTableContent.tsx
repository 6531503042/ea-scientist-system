'use client';

import { ReactNode } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from '@/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@/types';
import { UserTableHeader } from './UserTableHeader';
import { UserTablePagination } from './UserTablePagination';
import type { Column } from './UsersTable';

interface UserTableContentProps {
    // Data
    users: User[];
    totalUsers: number;

    // State
    filterValue?: string; // Changed from searchQuery to match usage
    onSearchChange?: (value: string) => void; // Optional if handled via filterValue effect

    visibleColumns: Set<string>;
    setVisibleColumns: (columns: Set<string>) => void;

    sortDescriptor?: { column: string; direction: 'ascending' | 'descending' };
    setSortDescriptor?: (descriptor: { column: string; direction: 'ascending' | 'descending' }) => void;
    // Legacy props support or updated names
    sortField?: string | null;
    sortDirection?: 'asc' | 'desc' | null;
    onSort?: (field: string) => void;

    currentPage?: number;
    page: number; // New standard
    totalPages?: number;
    pages: number; // New standard

    onPageChange?: (page: number) => void; // Legacy
    setPage: (page: number | ((p: number) => number)) => void; // New standard
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
    columns: Column[]; // The filtered visible columns
    allColumns: Column[]; // All available columns for the header dropdown
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
    currentPage, // Legacy fallback
    totalPages, // Legacy fallback
    setPage,

    rowsPerPage,
    renderCell,
    columns, // These are the visible ones
    allColumns, // Needed for the header options
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

            <div className="rounded-md border flex-1 overflow-auto bg-background">
                <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead
                                    key={column.uid}
                                    className={cn(
                                        "whitespace-nowrap bg-background",
                                        column.align === 'end' ? 'text-right' :
                                            column.align === 'center' ? 'text-center' : 'text-left'
                                    )}
                                // style={{ width: column.width }}
                                >
                                    {column.sortable ? (
                                        <div
                                            className={cn(
                                                "flex items-center gap-2 cursor-pointer select-none hover:text-foreground transition-colors",
                                                column.align === 'end' && "justify-end",
                                                column.align === 'center' && "justify-center"
                                            )}
                                            onClick={() => handleSort(column.uid)}
                                        >
                                            {column.name}
                                            {currentSortColumn === column.uid ? (
                                                currentSortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                            ) : (
                                                <ArrowUpDown className="w-3 h-3 opacity-50" />
                                            )}
                                        </div>
                                    ) : (
                                        <div>{column.name}</div>
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    ไม่พบข้อมูลผู้ใช้งาน
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user._id}>
                                    {columns.map((column) => (
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
                currentPage={page || currentPage || 1}
                totalPages={pages || totalPages || 1}
                onPageChange={(p) => setPage(p)}
                pageSize={rowsPerPage}
            />
        </div>
    );
}

