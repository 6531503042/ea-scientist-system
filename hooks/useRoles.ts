'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Role } from '@/types/role';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

function transformApiRole(apiRole: any): Role {
    return {
        _id: apiRole.id.toString(),
        name: apiRole.roleName,
        nameTh: apiRole.roleName, // Use same name for now
        description: apiRole.description || '',
        permissions: apiRole.permissions || [],
        isDefault: false, // API doesn't have this yet
        isSystemRole: false,
        userCount: apiRole.userCount || 0,
        color: apiRole.color || 'bg-gray-500/10 text-gray-700 border-gray-200', // Default color
    };
}

export function useRoles() {
    const queryClient = useQueryClient();

    const { data: roles = [], isLoading, error: queryError, refetch } = useQuery<Role[]>({
        queryKey: queryKeys.roles.all,
        queryFn: async () => {
            const data = await apiClient.get<any[]>('/api/v1/roles');
            return data.map(transformApiRole);
        },
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });

    const createMutation = useMutation({
        mutationFn: async (roleData: Partial<Role>) => {
            const apiData = {
                roleName: roleData.name,
                description: roleData.description,
                permissions: roleData.permissions,
            };

            const responseData = await apiClient.post<any>('/api/v1/roles', apiData);
            return transformApiRole(responseData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.all });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, roleData }: { id: string, roleData: Partial<Role> }) => {
            const apiData: any = {};
            if (roleData.name) apiData.roleName = roleData.name;
            if (roleData.description) apiData.description = roleData.description;
            if (roleData.permissions) apiData.permissions = roleData.permissions;

            await apiClient.put(`/api/v1/roles/${id}`, apiData);
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.all });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/api/v1/roles/${id}`);
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.roles.all });
        }
    });

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
        roles,
        loading,
        error,
        fetchRoles: refetch,
        createRole: createMutation.mutateAsync,
        updateRole: (id: string, roleData: Partial<Role>) => updateMutation.mutateAsync({ id, roleData }),
        deleteRole: deleteMutation.mutateAsync,
    };
}
