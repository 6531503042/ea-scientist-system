'use client';

import { useArtefacts } from '@/hooks/useArtefacts';
import { ArtefactTable } from './_components/ArtefactTable';
import { useLanguage } from '@/context/LanguageContext';

export default function ArtefactsPage() {
    const { artefacts, loading, fetchArtefacts } = useArtefacts();
    const { language } = useLanguage();

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-muted-foreground">
                                {language === 'th' ? 'กำลังโหลด...' : 'Loading...'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <ArtefactTable initialData={artefacts} onRefresh={fetchArtefacts} />
                )}
            </div>
        </div>
    );
}
