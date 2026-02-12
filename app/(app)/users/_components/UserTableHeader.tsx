'use client';

import {
    Search,
    Settings2,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="ค้นหาชื่อ, อีเมล..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full h-10 pl-10 pr-10 text-sm bg-background border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                />
                {searchQuery && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-muted transition-colors"
                        aria-label="ล้างการค้นหา"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                )}
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10 gap-2 text-sm px-4 rounded-xl shrink-0">
                        <Settings2 className="w-4 h-4" />
                        <span className="hidden sm:inline">มุมมอง</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                    {columns.map((column) => (
                        <DropdownMenuCheckboxItem
                            key={column.uid}
                            className="text-sm py-2"
                            checked={visibleColumns.has(column.uid)}
                            onCheckedChange={() => toggleColumn(column.uid)}
                        >
                            {column.name}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
