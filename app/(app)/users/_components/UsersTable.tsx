'use client';

import { useState, useMemo } from 'react';
import type { User } from '@/types';
import { UserColumnKey, userInitialVisibleColumns } from './columns';
import { useUserCellRenderer } from './UserCellRenderer';
import { UserTableContent } from './UserTableContent';

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
    const [sortField, setSortField] = useState<UserColumnKey | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleColumns, setVisibleColumns] = useState<Set<UserColumnKey>>(new Set(userInitialVisibleColumns));

    // Cell Renderer Hook
    const { renderCell } = useUserCellRenderer({
        onViewUser,
        onEditUser,
        onDeleteUser,
        onResetPassword
    });

    const handleSort = (field: UserColumnKey) => {
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
                    // Add logic for sorting by role/status if needed
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

    return (
        <UserTableContent
            users={paginatedUsers}
            totalUsers={filteredUsers.length}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={ITEMS_PER_PAGE}
            renderCell={renderCell}
        />
    );
}
