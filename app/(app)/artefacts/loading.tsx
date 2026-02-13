import { ArtefactTableSkeleton } from './_components/ArtefactTableSkeleton';

export default function ArtefactsLoading() {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
                <ArtefactTableSkeleton />
            </div>
        </div>
    );
}
