'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Role } from '@/types/role';

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
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRoles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/v1/roles');
            if (!response.ok) throw new Error('Failed to fetch roles');
            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                setRoles(result.data.map(transformApiRole));
            } else {
                setRoles([]);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch roles.');
        } finally {
            setLoading(false);
        }
    }, []);

    const createRole = useCallback(async (roleData: Partial<Role>) => {
        setLoading(true);
        setError(null);
        try {
            const apiData = {
                roleName: roleData.name,
                description: roleData.description,
                permissions: roleData.permissions,
            };

            const response = await fetch('/api/v1/roles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiData),
            });

            if (!response.ok) {
                const res = await response.json();
                throw new Error(res.error || 'Failed to create role');
            }

            const result = await response.json();
            const newRole = transformApiRole(result.data);
            setRoles(prev => [...prev, newRole]);
            return newRole;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to create role.');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateRole = useCallback(async (id: string, roleData: Partial<Role>) => {
        setLoading(true);
        setError(null);
        try {
            const apiData: any = {};
            if (roleData.name) apiData.roleName = roleData.name;
            if (roleData.description) apiData.description = roleData.description;
            if (roleData.permissions) apiData.permissions = roleData.permissions;

            const response = await fetch(`/api/v1/roles/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiData),
            });

            if (!response.ok) throw new Error('Failed to update role');

            await fetchRoles();
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update role.');
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchRoles]);

    const deleteRole = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/v1/roles/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete role');

            setRoles(prev => prev.filter(r => r._id !== id));
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to delete role.');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    return {
        roles,
        loading,
        error,
        fetchRoles,
        createRole,
        updateRole,
        deleteRole,
    };
}
