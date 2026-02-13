'use client';

import { useState, useCallback, useEffect } from 'react';
import type { User, CreateUserInput, UpdateUserInput } from '@/types/user';

// Helper to transform API user to Frontend User type
function transformApiUser(apiUser: any): User {
    return {
        _id: apiUser.id.toString(),
        name: {
            first: apiUser.firstName,
            last: apiUser.lastName,
        },
        displayName: `${apiUser.firstName} ${apiUser.lastName}`,
        username: apiUser.username || apiUser.email.split('@')[0],
        email: apiUser.email,
        role: apiUser.roleName || apiUser.role?.name || 'viewer',
        department: apiUser.departmentName || apiUser.department?.shortName || undefined,
        status: apiUser.isActive ? 'active' : 'inactive',
        lastLogin: apiUser.lastLoginAt ? (typeof apiUser.lastLoginAt === 'string' ? apiUser.lastLoginAt : new Date(apiUser.lastLoginAt).toISOString()) : undefined,
    };
}

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/v1/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                setUsers(result.data.map(transformApiUser));
            } else {
                setUsers([]);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createUser = useCallback(async (userData: CreateUserInput) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/v1/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const res = await response.json();
                throw new Error(res.error || 'Failed to create user');
            }

            const result = await response.json();
            const newUser = transformApiUser(result.data);
            setUsers(prev => [...prev, newUser]);
            return newUser;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to create user.');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateUser = useCallback(async (id: string, userData: UpdateUserInput) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/v1/users/${id}`, {
                method: 'PATCH', // or PUT
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) throw new Error('Failed to update user');

            await fetchUsers();
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update user.');
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const deleteUser = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/v1/users/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete user');

            setUsers(prev => prev.filter(u => u._id !== id));
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to delete user.');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteMultiple = useCallback(async (ids: string[]) => {
        setLoading(true);
        try {
            await Promise.all(ids.map(id =>
                fetch(`/api/v1/users/${id}`, { method: 'DELETE' })
            ));
            setUsers(prev => prev.filter(u => !ids.includes(u._id)));
            return true;
        } catch (err) {
            setError('Failed to delete some users');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        loading,
        error,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        deleteMultiple,
    };
}
