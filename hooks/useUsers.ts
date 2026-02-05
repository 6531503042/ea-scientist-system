'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User, CreateUserInput, UpdateUserInput } from '@/types';
import { mockUsers, mockRoles, mockDepartments } from '@/data/mockUserManagement';

type UserFromMock = typeof mockUsers[number];

// Transform mock data to match User type
function transformUser(mockUser: UserFromMock): User {
    return {
        _id: mockUser.id,
        name: {
            first: mockUser.name.split(' ')[0],
            last: mockUser.name.split(' ').slice(1).join(' ') || undefined,
        },
        displayName: mockUser.name,
        username: mockUser.email.split('@')[0],
        email: mockUser.email,
        role: mockUser.role,
        department: mockUser.department,
        status: mockUser.status as User['status'],
        lastLogin: mockUser.lastLogin,
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
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));
            setUsers(mockUsers.map(transformUser));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    }, []);

    const createUser = useCallback(async (userData: CreateUserInput) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            const newUser: User = {
                ...userData,
                _id: `user_${Date.now()}`,
                createdAt: new Date().toISOString(),
            };
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
            await new Promise(resolve => setTimeout(resolve, 300));
            setUsers(prev => prev.map(u =>
                u._id === id ? { ...u, ...userData, updatedAt: new Date().toISOString() } : u
            ));
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update user.');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteUser = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
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
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            setUsers(prev => prev.filter(u => !ids.includes(u._id)));
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to delete users.');
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
