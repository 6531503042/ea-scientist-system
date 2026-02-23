'use client';

import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import type { ApiCategory, RelType } from '@/types/relationship-rule';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

/**
 * Feature hook for Relationship Types + Rule Pairs.
 * - ดูแลเรื่องโหลดค่า relationship-types / categories
 * - คืน refresh() ให้ component เรียกหลังจาก save / delete
 */
export function useRelationshipRules(open: boolean) {
    const { toast } = useToast();

    const { data: types = [], isLoading: isLoadingTypes, refetch: refetchTypes } = useQuery<RelType[]>({
        queryKey: queryKeys.relationshipTypes.all,
        queryFn: async () => {
            try {
                return await apiClient.get<RelType[]>('/api/v1/relationship-types');
            } catch (err: any) {
                toast({ variant: 'destructive', title: 'โหลด Relationship Rules ไม่สำเร็จ', description: err.message });
                return [];
            }
        },
        enabled: open,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });

    const { data: categories = [], isLoading: isLoadingCategories, refetch: refetchCategories } = useQuery<ApiCategory[]>({
        queryKey: queryKeys.categories.all,
        queryFn: async () => {
            try {
                return await apiClient.get<ApiCategory[]>('/api/v1/categories');
            } catch (err) {
                return [];
            }
        },
        enabled: open,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });

    const refresh = () => {
        refetchTypes();
        refetchCategories();
    };

    return {
        types,
        categories,
        loading: isLoadingTypes || isLoadingCategories,
        refresh,
    };
}


