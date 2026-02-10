'use client';

import { Briefcase, User, Network, FolderTree, Search, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GraphToolbarProps } from '@/types/graph';

export function GraphToolbar({
    viewMode,
    setViewMode,
    layoutMode,
    setLayoutMode,
    showFloatingPanel,
    setShowFloatingPanel,
    searchQuery,
    setSearchQuery,
}: GraphToolbarProps) {
    return (
        <div className="border-b bg-background px-2 sm:px-4 py-2 z-10 space-y-2">
            {/* First Row: Mode toggles */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                    {/* View Mode Toggle */}
                    <div className="flex items-center h-8 p-0.5 bg-muted rounded-lg">
                        <button
                            onClick={() => setViewMode('architect')}
                            className={cn(
                                "flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-medium transition-all",
                                viewMode === 'architect'
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <Briefcase className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Architect</span>
                        </button>
                        <button
                            onClick={() => setViewMode('executive')}
                            className={cn(
                                "flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-medium transition-all",
                                viewMode === 'executive'
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <User className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Executive</span>
                        </button>
                    </div>

                    {/* Layout Toggle - Only Graph and Hierarchy */}
                    <div className="flex items-center h-8 p-0.5 bg-muted rounded-lg">
                        <button
                            onClick={() => setLayoutMode('graph')}
                            className={cn(
                                "flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-medium transition-all",
                                layoutMode === 'graph'
                                    ? 'bg-card text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                            title="Graph View"
                        >
                            <Network className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Graph</span>
                        </button>
                        <button
                            onClick={() => setLayoutMode('hierarchy')}
                            className={cn(
                                "flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-medium transition-all",
                                layoutMode === 'hierarchy'
                                    ? 'bg-card text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                            title="Hierarchy View"
                        >
                            <FolderTree className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Hierarchy</span>
                        </button>
                    </div>

                    {/* Artefact Library Toggle - Moved to left side */}
                    {layoutMode === 'graph' && (
                        <button
                            onClick={() => setShowFloatingPanel(!showFloatingPanel)}
                            className="flex items-center gap-1.5 px-2 sm:px-3 h-8 rounded-lg bg-muted hover:bg-muted/80 text-xs font-medium transition-all"
                            title={showFloatingPanel ? "ซ่อน Artefact Library" : "แสดง Artefact Library"}
                        >
                            {showFloatingPanel ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                            <span className="hidden lg:inline">{showFloatingPanel ? 'ซ่อน' : 'แสดง'}</span>
                        </button>
                    )}
                </div>

                {/* Right side - empty for now */}
                <div className="flex items-center gap-2">
                </div>
            </div>

            {/* Second Row: Search */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="ค้นหา Artefact..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-9 pl-9 pr-3 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/60"
                    />
                </div>
            </div>
        </div>
    );
}
