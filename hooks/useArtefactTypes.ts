'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLocalizedName } from '@/lib/utils';
import type { ArchitectureLayer, ArtefactCategory } from '@/types/artefact-type';
import type {
    CreateArchitectureLayerInput,
    UpdateArchitectureLayerInput,
    CreateArtefactCategoryInput,
    UpdateArtefactCategoryInput,
} from '@/lib/validators/artefact-types-validator';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

export function useArtefactTypes() {
    const queryClient = useQueryClient();

    // Fetch Layers
    const { data: layers = [], isLoading: isLoadingLayers, error: layersError, refetch: fetchLayers } = useQuery<ArchitectureLayer[]>({
        queryKey: queryKeys.architectureLayers.all,
        queryFn: async () => {
            return await apiClient.get<ArchitectureLayer[]>('/api/v1/architecture-layers');
        },
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });

    // Fetch Categories
    const { data: categories = [], isLoading: isLoadingCategories, error: categoriesError, refetch: fetchCategories } = useQuery<ArtefactCategory[]>({
        queryKey: queryKeys.categories.all,
        queryFn: async () => {
            return await apiClient.get<ArtefactCategory[]>('/api/v1/categories');
        },
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });

    // Helper to simulate fetchAll
    const fetchAll = () => {
        fetchLayers();
        fetchCategories();
    };

    // Layer Mutations
    const createLayerMutation = useMutation({
        mutationFn: async (data: CreateArchitectureLayerInput) => {
            return await apiClient.post<ArchitectureLayer>('/api/v1/architecture-layers', data);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.architectureLayers.all }),
    });

    const updateLayerMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number, data: UpdateArchitectureLayerInput }) => {
            return await apiClient.put<ArchitectureLayer>(`/api/v1/architecture-layers/${id}`, data);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.architectureLayers.all }),
    });

    const deleteLayerMutation = useMutation({
        mutationFn: async (id: number) => {
            return await apiClient.delete<boolean>(`/api/v1/architecture-layers/${id}`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.architectureLayers.all }),
    });

    // Category Mutations
    const createCategoryMutation = useMutation({
        mutationFn: async (data: CreateArtefactCategoryInput) => {
            return await apiClient.post<ArtefactCategory>('/api/v1/categories', data);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }),
    });

    const updateCategoryMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number, data: UpdateArtefactCategoryInput }) => {
            return await apiClient.put<ArtefactCategory>(`/api/v1/categories/${id}`, data);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }),
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: async (id: number) => {
            return await apiClient.delete<boolean>(`/api/v1/categories/${id}`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }),
    });

    const error = layersError?.message
        || categoriesError?.message
        || createLayerMutation.error?.message
        || updateLayerMutation.error?.message
        || deleteLayerMutation.error?.message
        || createCategoryMutation.error?.message
        || updateCategoryMutation.error?.message
        || deleteCategoryMutation.error?.message
        || null;

    const loading = isLoadingLayers
        || isLoadingCategories
        || createLayerMutation.isPending
        || updateLayerMutation.isPending
        || deleteLayerMutation.isPending
        || createCategoryMutation.isPending
        || updateCategoryMutation.isPending
        || deleteCategoryMutation.isPending;

    return {
        layers,
        categories,
        loading,
        error,
        fetchAll,
        fetchLayers,
        // Optional parameter handling backwards compat
        fetchCategories: (layerId?: number) => {
            console.warn('fetchCategories parameter layerId is deprecated in React Query migration. Categories are cached globally.');
            return fetchCategories();
        },
        createLayer: createLayerMutation.mutateAsync,
        updateLayer: (id: number, data: UpdateArchitectureLayerInput) => updateLayerMutation.mutateAsync({ id, data }),
        deleteLayer: deleteLayerMutation.mutateAsync,
        createCategory: createCategoryMutation.mutateAsync,
        updateCategory: (id: number, data: UpdateArtefactCategoryInput) => updateCategoryMutation.mutateAsync({ id, data }),
        deleteCategory: deleteCategoryMutation.mutateAsync,
        getLoc: getLocalizedName,
    };
}
