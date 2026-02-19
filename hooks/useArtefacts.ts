'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Artefact, ArtefactType } from '@/types/artefact';

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
    const [artefacts, setArtefacts] = useState<Artefact[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [typeFilter, setTypeFilter] = useState<ArtefactType | 'all'>('all');

    const fetchArtefacts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/v1/artefacts');
            if (!response.ok) throw new Error('Failed to fetch artefacts');
            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                setArtefacts(result.data.map(transformApiArtefact));
            } else {
                setArtefacts([]);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch artefacts.');
        } finally {
            setLoading(false);
        }
    }, []);

    const getArtefactById = useCallback((id: string) => {
        return artefacts.find(a => a.id === id) || null;
    }, [artefacts]);

    const getArtefactsByType = useCallback((type: ArtefactType) => {
        return artefacts.filter(a => a.type === type);
    }, [artefacts]);

    /**
     * Create artefact via API.
     * The caller (e.g. CreateArtefactModal) should pass the full API payload
     * including categoryId, architectureLayerId, etc.
     */
    const createArtefact = useCallback(async (apiPayload: Record<string, unknown>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/v1/artefacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiPayload),
            });

            if (!response.ok) {
                const res = await response.json();
                throw new Error(res.error || 'Failed to create artefact');
            }

            const result = await response.json();
            const newArtefact = transformApiArtefact(result.data);
            setArtefacts(prev => [...prev, newArtefact]);
            return newArtefact;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to create artefact.');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Update artefact via API.
     * Accepts either a full API payload or legacy { name, nameTh, description } shape.
     */
    const updateArtefact = useCallback(async (id: string, data: Record<string, unknown>) => {
        setLoading(true);
        setError(null);
        try {
            // Support both raw API payload and legacy shape
            const apiData = data.artefactName
                ? data
                : {
                    ...(data.name && { artefactName: { en: data.name, th: data.nameTh || data.name } }),
                    ...(data.description && { description: { en: data.description, th: data.description } }),
                };

            const response = await fetch(`/api/v1/artefacts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiData),
            });

            if (!response.ok) throw new Error('Failed to update artefact');

            await fetchArtefacts();
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update artefact.');
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchArtefacts]);

    const deleteArtefact = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/v1/artefacts/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete artefact');

            setArtefacts(prev => prev.filter(a => a.id !== id));
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to delete artefact.');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const filteredArtefacts = typeFilter === 'all'
        ? artefacts
        : artefacts.filter(a => a.type === typeFilter);

    useEffect(() => {
        fetchArtefacts();
    }, [fetchArtefacts]);

    return {
        artefacts: filteredArtefacts,
        allArtefacts: artefacts,
        loading,
        error,
        typeFilter,
        setTypeFilter,
        fetchArtefacts,
        getArtefactById,
        getArtefactsByType,
        createArtefact,
        updateArtefact,
        deleteArtefact,
    };
}
