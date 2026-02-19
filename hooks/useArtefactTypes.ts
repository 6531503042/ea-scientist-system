'use client';

import { useState, useCallback, useEffect } from 'react';
import { getLocalizedName } from '@/lib/utils';
import type { ArchitectureLayer, ArtefactCategory } from '@/types/artefact-type';
import type {
  CreateArchitectureLayerInput,
  UpdateArchitectureLayerInput,
  CreateArtefactCategoryInput,
  UpdateArtefactCategoryInput,
} from '@/lib/validators/artefact-types-validator';

export function useArtefactTypes() {
    const [layers, setLayers] = useState<ArchitectureLayer[]>([]);
    const [categories, setCategories] = useState<ArtefactCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLayers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/v1/architecture-layers');
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
                setLayers(json.data);
            } else {
                setLayers([]);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch layers');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async (layerId?: number) => {
        setLoading(true);
        setError(null);
        try {
            const url = layerId ? `/api/v1/categories?layerId=${layerId}` : '/api/v1/categories';
            const res = await fetch(url);
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
                setCategories(json.data);
            } else {
                setCategories([]);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [layersRes, catsRes] = await Promise.all([
                fetch('/api/v1/architecture-layers'),
                fetch('/api/v1/categories'),
            ]);
            const [layersJson, catsJson] = await Promise.all([layersRes.json(), catsRes.json()]);
            if (layersJson.success && Array.isArray(layersJson.data)) setLayers(layersJson.data);
            else setLayers([]);
            if (catsJson.success && Array.isArray(catsJson.data)) setCategories(catsJson.data);
            else setCategories([]);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch');
        } finally {
            setLoading(false);
        }
    }, []);

    const createLayer = useCallback(async (data: CreateArchitectureLayerInput) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/v1/architecture-layers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || 'Failed to create layer');
            await fetchAll();
            return json.data;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to create layer');
            return null;
        } finally {
            setLoading(false);
        }
    }, [fetchAll]);

    const updateLayer = useCallback(async (id: number, data: UpdateArchitectureLayerInput) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/v1/architecture-layers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || 'Failed to update layer');
            await fetchAll();
            return json.data;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update layer');
            return null;
        } finally {
            setLoading(false);
        }
    }, [fetchAll]);

    const deleteLayer = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/v1/architecture-layers/${id}`, { method: 'DELETE' });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || 'Failed to delete layer');
            await fetchAll();
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to delete layer');
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchAll]);

    const createCategory = useCallback(async (data: CreateArtefactCategoryInput) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/v1/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || 'Failed to create category');
            await fetchAll();
            return json.data;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to create category');
            return null;
        } finally {
            setLoading(false);
        }
    }, [fetchAll]);

    const updateCategory = useCallback(async (id: number, data: UpdateArtefactCategoryInput) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/v1/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || 'Failed to update category');
            await fetchAll();
            return json.data;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update category');
            return null;
        } finally {
            setLoading(false);
        }
    }, [fetchAll]);

    const deleteCategory = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/v1/categories/${id}`, { method: 'DELETE' });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || 'Failed to delete category');
            await fetchAll();
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to delete category');
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchAll]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return {
        layers,
        categories,
        loading,
        error,
        fetchAll,
        fetchLayers,
        fetchCategories,
        createLayer,
        updateLayer,
        deleteLayer,
        createCategory,
        updateCategory,
        deleteCategory,
        getLoc: getLocalizedName,
    };
}
