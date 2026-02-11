'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import type { ApiCategory, RelType } from '@/types/relationship-rule';

/**
 * Feature hook for Relationship Types + Rule Pairs.
 * - ดูแลเรื่องโหลดค่า relationship-types / categories
 * - คืน refresh() ให้ component เรียกหลังจาก save / delete
 */
export function useRelationshipRules(open: boolean) {
    const { toast } = useToast();
    const [types, setTypes] = useState<RelType[]>([]);
    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [rtRes, catRes] = await Promise.all([
                fetch('/api/v1/relationship-types'),
                fetch('/api/v1/categories'),
            ]);

            const [rtJson, catJson] = await Promise.all([rtRes.json(), catRes.json()]);

            if (rtJson.success) setTypes(rtJson.data);
            if (catJson.success) setCategories(catJson.data);
        } catch {
            toast({ variant: 'destructive', title: 'โหลด Relationship Rules ไม่สำเร็จ' });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        if (!open) return;
        fetchData();
    }, [open, fetchData]);

    return {
        types,
        categories,
        loading,
        refresh: fetchData,
    };
}

