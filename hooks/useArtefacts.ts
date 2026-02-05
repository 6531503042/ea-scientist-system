'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Artefact, CreateArtefactInput, UpdateArtefactInput, ArtefactType } from '@/types';
import { artefacts as mockArtefacts } from '@/data/mockData';

// Edge type from mockData
type MockArtefact = typeof mockArtefacts[number];

// Transform mock artefact to proper Artefact type
function transformArtefact(mock: MockArtefact): Artefact {
    return {
        _id: mock.id,
        name: mock.name,
        nameTh: mock.nameTh,
        type: mock.type as ArtefactType,
        description: mock.description,
        status: mock.status as Artefact['status'],
        classification: 'internal',
        owner: mock.owner,
        department: mock.department,
        version: mock.version,
        relations: [],
        attributes: {},
        tags: [],
        createdAt: mock.lastUpdated,
        updatedAt: mock.lastUpdated,
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
            await new Promise(resolve => setTimeout(resolve, 300));
            const transformed = mockArtefacts.map(transformArtefact);
            setArtefacts(transformed);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch artefacts.');
        } finally {
            setLoading(false);
        }
    }, []);

    const getArtefactById = useCallback((id: string) => {
        return artefacts.find(a => a._id === id) || null;
    }, [artefacts]);

    const getArtefactsByType = useCallback((type: ArtefactType) => {
        return artefacts.filter(a => a.type === type);
    }, [artefacts]);

    const createArtefact = useCallback(async (data: CreateArtefactInput) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            const newArtefact: Artefact = {
                ...data,
                _id: `artefact_${Date.now()}`,
                createdAt: new Date().toISOString(),
            };
            setArtefacts(prev => [...prev, newArtefact]);
            return newArtefact;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to create artefact.');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateArtefact = useCallback(async (id: string, data: UpdateArtefactInput) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            setArtefacts(prev => prev.map(a =>
                a._id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
            ));
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update artefact.');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteArtefact = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            setArtefacts(prev => prev.filter(a => a._id !== id));
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
