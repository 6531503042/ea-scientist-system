'use client';

import {
    Search,
    Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Column } from './UsersTable';

interface UserTableHeaderProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    visibleColumns: Set<string>;
    setVisibleColumns: (columns: Set<string>) => void;
    columns: Column[];
}

export function UserTableHeader({
    searchQuery,
    onSearchChange,
    visibleColumns,
    setVisibleColumns,
    columns,
}: UserTableHeaderProps) {

    const toggleColumn = (columnUid: string) => {
        const newVisibleColumns = new Set(visibleColumns);
        if (newVisibleColumns.has(columnUid)) {
            newVisibleColumns.delete(columnUid);
        } else {
            newVisibleColumns.add(columnUid);
        }
        setVisibleColumns(newVisibleColumns);
    };

    return (
        <div className="flex items-center justify-between pb-4">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="ค้นหาชื่อ, อีเมล..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
                            <Settings2 className="mr-2 h-4 w-4" />
                            มุมมอง
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                        {columns.map((column) => (
                            <DropdownMenuCheckboxItem
                                key={column.uid}
                                className="capitalize"
                                checked={visibleColumns.has(column.uid)}
                                onCheckedChange={() => toggleColumn(column.uid)}
                            >
                                {column.name}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

