'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Role, Permission } from '@/types';
import { mockRoles } from '@/data/mockUserManagement';

type MockRole = typeof mockRoles[number];

// Transform mock roles to proper Role type
function transformRole(mockRole: MockRole): Role {
    return {
        _id: mockRole.id,
        name: mockRole.name,
        nameTh: mockRole.name, // Can be localized later
        description: mockRole.description,
        permissions: mockRole.permissions,
        isDefault: false,
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
            await new Promise(resolve => setTimeout(resolve, 200));
            setRoles(mockRoles.map(transformRole));
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
            await new Promise(resolve => setTimeout(resolve, 200));
            const newRole: Role = {
                _id: `role_${Date.now()}`,
                name: roleData.name || 'New Role',
                permissions: roleData.permissions || [],
                ...roleData,
            };
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
            await new Promise(resolve => setTimeout(resolve, 200));
            setRoles(prev => prev.map(r =>
                r._id === id ? { ...r, ...roleData, updatedAt: new Date().toISOString() } : r
            ));
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update role.');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteRole = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
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
