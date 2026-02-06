'use client';

import { Search, Filter, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { AuditAction, AuditTargetType } from '@/types/audit';

interface AuditTopContentProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    activeTab: 'login' | 'export' | 'audit';
    onTabChange: (tab: 'login' | 'export' | 'audit') => void;
    onFilterClick: () => void;
}

export function AuditTopContent({
    searchQuery,
    onSearchChange,
    activeTab,
    onTabChange,
    onFilterClick
}: AuditTopContentProps) {
    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
            {/* Tab Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-border gap-4 sm:gap-0">
                <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
                    <button
                        onClick={() => onTabChange('login')}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                            activeTab === 'login'
                                ? "bg-info/10 text-info"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        User/Login
                    </button>
                    <button
                        onClick={() => onTabChange('export')}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                            activeTab === 'export'
                                ? "bg-success/10 text-success"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        Export
                    </button>
                    <button
                        onClick={() => onTabChange('audit')}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                            activeTab === 'audit'
                                ? "bg-warning/10 text-warning"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        Audit trail
                    </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อ, อีเมล, IP..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full sm:w-64 h-9 pl-9 pr-4 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <button
                        onClick={onFilterClick}
                        className="flex items-center gap-2 px-3 h-9 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">กรองข้อมูล</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
