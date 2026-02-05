'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Department, CreateDepartmentInput, UpdateDepartmentInput } from '@/types';
import { mockDepartments } from '@/data/mockUserManagement';

type MockDept = typeof mockDepartments[number];

// Transform mock departments to proper Department type
function transformDepartment(mockDept: MockDept): Department {
    return {
        _id: mockDept.id,
        code: mockDept.code,
        name: mockDept.name,
        nameTh: mockDept.name,
        head: mockDept.head,
        memberCount: mockDept.memberCount,
    };
}

export function useDepartments() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDepartments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            setDepartments(mockDepartments.map(transformDepartment));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch departments.');
        } finally {
            setLoading(false);
        }
    }, []);

    const createDepartment = useCallback(async (data: CreateDepartmentInput) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            const newDept: Department = {
                ...data,
                _id: `dept_${Date.now()}`,
                createdAt: new Date().toISOString(),
            };
            setDepartments(prev => [...prev, newDept]);
            return newDept;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to create department.');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateDepartment = useCallback(async (id: string, data: UpdateDepartmentInput) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            setDepartments(prev => prev.map(d =>
                d._id === id ? { ...d, ...data, updatedAt: new Date().toISOString() } : d
            ));
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update department.');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteDepartment = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            setDepartments(prev => prev.filter(d => d._id !== id));
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to delete department.');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    return {
        departments,
        loading,
        error,
        fetchDepartments,
        createDepartment,
        updateDepartment,
        deleteDepartment,
    };
}
