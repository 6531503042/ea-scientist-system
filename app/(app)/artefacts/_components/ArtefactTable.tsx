'use client';

import { useState, useMemo } from 'react';
import { ArtefactSidebar } from './ArtefactSidebar';
import { ArtefactFilters } from './ArtefactFilters';
import { ArtefactDataTable } from './ArtefactDataTable';
import { ArtefactBottomContent } from './ArtefactBottomContent';
import { ArtefactDetailModal } from './ArtefactDetailModal';
import { CreateArtefactModal } from './CreateArtefactModal';
import { EditArtefactModal } from './EditArtefactModal';
import { ExportImportModal } from './ExportImportModal';
import { RelationshipRulePairSheet } from './RelationshipRulePairSheet';
import { useToast } from '@/components/ui/use-toast';
import type { Artefact, ArtefactType, ArtefactStatus } from '@/types/artefact';

// TOGAF Order - Business → Application → Data → Technology → Security → Integration
const TOGAF_ORDER: ArtefactType[] = ['business', 'application', 'data', 'technology', 'security', 'integration'];

interface ArtefactTableProps {
    initialData: Artefact[];
    onRefresh?: () => void;
}

export function ArtefactTable({ initialData, onRefresh }: ArtefactTableProps) {
    const { toast } = useToast();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<ArtefactType | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<ArtefactStatus | 'all'>('all');
    const [sortBy, setSortBy] = useState<'name' | 'type' | 'updated'>('type');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedArtefact, setSelectedArtefact] = useState<Artefact | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingArtefact, setEditingArtefact] = useState<Artefact | null>(null);
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [rulePairSheetOpen, setRulePairSheetOpen] = useState(false);

    const ITEMS_PER_PAGE = 10;

    // Filter & Sort Logic
    const filteredData = useMemo(() => {
        let result = [...initialData];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(a =>
                a.name.toLowerCase().includes(query) ||
                a.nameTh.toLowerCase().includes(query) ||
                a.description.toLowerCase().includes(query) ||
                a.owner.toLowerCase().includes(query) ||
                a.department.toLowerCase().includes(query)
            );
        }

        // Type filter
        if (selectedType !== 'all') {
            result = result.filter(a => a.type === selectedType);
        }

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(a => a.status === statusFilter);
        }

        // Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'type':
                    return TOGAF_ORDER.indexOf(a.type) - TOGAF_ORDER.indexOf(b.type);
                case 'updated':
                    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
                default:
                    return 0;
            }
        });

        return result;
    }, [initialData, searchQuery, selectedType, statusFilter, sortBy]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Handlers
    const handleSearch = (val: string) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleTypeChange = (val: ArtefactType | 'all') => {
        setSelectedType(val);
        setCurrentPage(1);
    };

    const handleStatusFilter = (val: ArtefactStatus | 'all') => {
        setStatusFilter(val);
        setCurrentPage(1);
    };

    // Calculate Counts
    const counts = useMemo(() => {
        const counts: Record<string, number> = { all: initialData.length };
        initialData.forEach(item => {
            counts[item.type] = (counts[item.type] || 0) + 1;
        });
        return counts;
    }, [initialData]);

    return (
        <div className="flex h-full bg-background">
            {/* Sidebar */}
            <aside className="hidden lg:block border-r border-border bg-card/50">
                <ArtefactSidebar
                    selectedType={selectedType}
                    onTypeChange={handleTypeChange}
                    counts={counts}
                />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Filters */}
                <ArtefactFilters
                    searchQuery={searchQuery}
                    onSearchChange={handleSearch}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    statusFilter={statusFilter}
                    onStatusFilterChange={handleStatusFilter}
                    onAdd={() => setIsCreateModalOpen(true)}
                    onExport={(format) => {
                        console.log('Export format:', format);
                        setExportModalOpen(true);
                    }}
                    onImport={() => setImportModalOpen(true)}
                    onRulePairs={() => setRulePairSheetOpen(true)}
                    totalCount={initialData.length}
                    filteredCount={filteredData.length}
                />

                {/* Table */}
                <div className="flex-1 overflow-auto p-4">
                    <ArtefactDataTable
                        data={paginatedData}
                        onView={(artefact) => setSelectedArtefact(artefact)}
                        onEdit={(artefact) => setEditingArtefact(artefact)}
                        onDelete={async (artefact) => {
                            if (!confirm(`ต้องการลบ "${artefact.name}" หรือไม่?`)) return;
                            try {
                                const res = await fetch(`/api/v1/artefacts/${artefact.id}`, { method: 'DELETE' });
                                if (!res.ok) throw new Error('Failed to delete');
                                toast({ title: "ลบสำเร็จ", description: `${artefact.name} ถูกลบแล้ว` });
                                onRefresh?.();
                            } catch {
                                toast({ variant: "destructive", title: "ลบไม่สำเร็จ", description: "เกิดข้อผิดพลาด" });
                            }
                        }}
                    />
                </div>

                {/* Pagination */}
                <div className="p-4 pt-0">
                    <ArtefactBottomContent
                        totalItems={filteredData.length}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemLabel="artefacts"
                    />
                </div>
            </div>

            {/* Modals */}
            <CreateArtefactModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={() => {
                    setIsCreateModalOpen(false);
                    onRefresh?.();
                }}
            />

            {editingArtefact && (
                <EditArtefactModal
                    artefact={editingArtefact}
                    onClose={() => setEditingArtefact(null)}
                    onSubmit={() => {
                        setEditingArtefact(null);
                        onRefresh?.();
                    }}
                />
            )}

            <ArtefactDetailModal
                artefact={selectedArtefact}
                onClose={() => setSelectedArtefact(null)}
                onEdit={(artefact) => {
                    setSelectedArtefact(null);
                    setEditingArtefact(artefact);
                }}
            />

            <ExportImportModal
                isOpen={exportModalOpen}
                onClose={() => setExportModalOpen(false)}
                mode="export"
            />

            <ExportImportModal
                isOpen={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                mode="import"
            />

            <RelationshipRulePairSheet
                open={rulePairSheetOpen}
                onOpenChange={setRulePairSheetOpen}
            />
        </div>
    );
}
