'use client';

import { useArtefacts } from '@/hooks/useArtefacts';
import { ArtefactTable } from './_components/ArtefactTable';
import { ArtefactTableSkeleton } from './_components/ArtefactTableSkeleton';

export default function ArtefactsPage() {
    const { artefacts, loading, fetchArtefacts } = useArtefacts();

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
                {loading ? (
                    <ArtefactTableSkeleton />
                ) : (
                    <ArtefactTable initialData={artefacts} onRefresh={fetchArtefacts} />
                )}
            </div>
        </div>
    );
}
