'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Artefact, ArtefactType } from '@/types/artefact';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

// Helper to safely get localized string
const getLoc = (val: any, lang: 'th' | 'en' = 'en') => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[lang] || val['en'] || val['th'] || '';
};

/**
 * Map API architectureLayer name to ArtefactType.
 * layerName/categoryName from API are localized JSON objects { en: "...", th: "..." }
 */
function mapLayerToType(layerName?: any, categoryName?: any): ArtefactType {
    // Extract English string from localized object or use as-is if string
    const rawLayer = getLoc(layerName, 'en');
    const rawCategory = getLoc(categoryName, 'en');
    const name = (rawLayer || rawCategory || '').toLowerCase();

    if (name.includes('business')) return 'business';
    if (name.includes('application')) return 'application';
    if (name.includes('data')) return 'data';
    if (name.includes('technology')) return 'technology';
    if (name.includes('security')) return 'security';
    if (name.includes('integration')) return 'integration';
    return 'application'; // safe fallback
}

/**
 * Transform API response → Artefact (frontend type)
 * เตรียมรองรับ backend จริง โดย map fields ให้ตรงกับ types/artefact.d.ts
 */
function transformApiArtefact(apiArtefact: any): Artefact {
    return {
        id: apiArtefact.id?.toString() ?? '',
        name: getLoc(apiArtefact.artefactName, 'en'),
        nameTh: getLoc(apiArtefact.artefactName, 'th'),
        type: mapLayerToType(
            apiArtefact.architectureLayer?.layerName,
            apiArtefact.category?.categoryName,
        ),
        description: getLoc(apiArtefact.description),
        status: (apiArtefact.lifecycleStatus?.toLowerCase() as Artefact['status']) || 'draft',
        riskLevel: apiArtefact.riskLevel?.toLowerCase() || 'none',
        owner: apiArtefact.responsibleBy
            ? `${apiArtefact.responsibleBy.firstName} ${apiArtefact.responsibleBy.lastName}`
            : '-',
        department: apiArtefact.ownerDepartment?.fullName || '-',
        ownerId: apiArtefact.responsibleBy?.id,
        departmentId: apiArtefact.ownerDepartment?.id,
        version: apiArtefact.version?.toString() || '1.0',
        lastUpdated: apiArtefact.updatedAt || apiArtefact.createdAt || new Date().toISOString(),
        usageFrequency: apiArtefact.usageFrequency?.toLowerCase() || 'medium',
        dependencies: apiArtefact._count?.sourceRelationships ?? 0,
        dependents: apiArtefact._count?.targetRelationships ?? 0,

        // Optional fields
        classification: apiArtefact.classification || 'internal',
        attributes: apiArtefact.attributes ?? {},
        tags: apiArtefact.tags ?? [],
    };
}

export function useArtefacts() {
    const queryClient = useQueryClient();
    const [typeFilter, setTypeFilter] = useState<ArtefactType | 'all'>('all');

    const { data: artefacts = [], isLoading, error: queryError, refetch } = useQuery<Artefact[]>({
        queryKey: queryKeys.artefacts.all,
        queryFn: async () => {
            const data = await apiClient.get<any[]>('/api/v1/artefacts');
            return data.map(transformApiArtefact);
        }
    });

    const createMutation = useMutation({
        mutationFn: async (apiPayload: Record<string, unknown>) => {
            const responseData = await apiClient.post<any>('/api/v1/artefacts', apiPayload);
            return transformApiArtefact(responseData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.artefacts.all });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: Record<string, unknown> }) => {
            const apiData = data.artefactName
                ? data
                : {
                    ...(data.name && { artefactName: { en: data.name, th: data.nameTh || data.name } }),
                    ...(data.description && { description: { en: data.description, th: data.description } }),
                };

            await apiClient.put(`/api/v1/artefacts/${id}`, apiData);
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.artefacts.all });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/api/v1/artefacts/${id}`);
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.artefacts.all });
        }
    });

    const getArtefactById = useCallback((id: string) => {
        return artefacts.find(a => a.id === id) || null;
    }, [artefacts]);

    const getArtefactsByType = useCallback((type: ArtefactType) => {
        return artefacts.filter(a => a.type === type);
    }, [artefacts]);

    const filteredArtefacts = typeFilter === 'all'
        ? artefacts
        : artefacts.filter(a => a.type === typeFilter);

    // Derived error state combining query and mutation errors
    const error = queryError?.message
        || createMutation.error?.message
        || updateMutation.error?.message
        || deleteMutation.error?.message
        || null;

    // Derived loading state
    const loading = isLoading
        || createMutation.isPending
        || updateMutation.isPending
        || deleteMutation.isPending;

    return {
        artefacts: filteredArtefacts,
        allArtefacts: artefacts,
        loading,
        error,
        typeFilter,
        setTypeFilter,
        fetchArtefacts: refetch,
        getArtefactById,
        getArtefactsByType,
        createArtefact: createMutation.mutateAsync,
        updateArtefact: (id: string, data: Record<string, unknown>) => updateMutation.mutateAsync({ id, data }),
        deleteArtefact: deleteMutation.mutateAsync,
    };
}


