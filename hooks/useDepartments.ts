'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Department, CreateDepartmentInput, UpdateDepartmentInput } from '@/types/department';

function transformApiDepartment(apiDept: any): Department {
    return {
        _id: apiDept.id.toString(),
        code: apiDept.shortName, // Use shortName as code
        name: apiDept.fullName,
        nameTh: apiDept.fullName,
        // Head needs to be mapped if available, currently API might not return head info directly or needs expansion
        head: '-',
        memberCount: apiDept.userCount || 0,
        userCount: apiDept.userCount || 0,
        status: apiDept.isActive ? 'active' : 'inactive',
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
            const response = await fetch('/api/v1/departments');
            if (!response.ok) throw new Error('Failed to fetch departments');
            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                setDepartments(result.data.map(transformApiDepartment));
            } else {
                setDepartments([]);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch departments.');
            setDepartments([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const createDepartment = useCallback(async (data: CreateDepartmentInput) => {
        setLoading(true);
        setError(null);
        try {
            const parentValue = typeof data.parent === 'string' ? data.parent : undefined;
            const apiData = {
                shortName: data.code,
                fullName: data.name,
                parentId: parentValue ? parseInt(parentValue) : undefined,
            };

            const response = await fetch('/api/v1/departments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiData),
            });

            if (!response.ok) {
                const res = await response.json();
                throw new Error(res.error || 'Failed to create department');
            }

            const result = await response.json();
            const newDept = transformApiDepartment(result.data);
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
            const apiData: any = {};
            if (data.code) apiData.shortName = data.code;
            if (data.name) apiData.fullName = data.name;
            // if (data.head) ...

            const response = await fetch(`/api/v1/departments/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiData),
            });

            if (!response.ok) throw new Error('Failed to update department');

            await fetchDepartments();
            return true;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update department.');
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchDepartments]);

    const deleteDepartment = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/v1/departments/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete department');

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
