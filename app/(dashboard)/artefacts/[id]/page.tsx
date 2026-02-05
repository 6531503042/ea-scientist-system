'use client';

import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/ui/page-header';
import { Briefcase } from 'lucide-react';
import { artefacts } from '@/data/mockData';

export default function ArtefactDetailPage() {
    const { id } = useParams();

    // Find artefact by ID
    const artefact = artefacts.find(a => a.id === id);

    if (!artefact) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-destructive">Artefact Not Found</h1>
                <p>ID: {id}</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <PageHeader
                title={`${artefact.name}`}
                description={artefact.nameTh}
                icon={<Briefcase />}
            />

            <div className="bg-card border border-border rounded-xl p-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <h2 className="text-lg font-semibold mb-2">Description</h2>
                        <p className="text-muted-foreground">{artefact.description}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-medium capitalize">{artefact.type}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-medium capitalize">{artefact.status}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Owner</p>
                        <p className="font-medium">{artefact.owner}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{artefact.lastUpdated}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
