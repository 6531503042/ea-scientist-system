'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Save, X, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

// ── Types ───────────────────────────────────────────────────────
interface AllowedPair {
    source_category_id: number | null;
    target_category_id: number | null;
}

interface RelType {
    id: number;
    relationshipKey: string;
    relationshipName: { en: string; th: string };
    description?: { en?: string; th?: string } | null;
    allowedPairs: AllowedPair[];
    isActive: boolean;
    _count?: { relationships: number };
}

interface ApiCategory {
    id: number;
    categoryName: { en: string; th: string } | string;
    architectureLayer?: { id: number; layerName: { en: string; th: string } | string };
}

const getLoc = (v: any, lang: 'en' | 'th' = 'en'): string => {
    if (!v) return '';
    if (typeof v === 'string') return v;
    return v[lang] || v['en'] || v['th'] || '';
};

// ── Main Component ──────────────────────────────────────────────
export function RelationshipTypeManager() {
    const { toast } = useToast();
    const [types, setTypes] = useState<RelType[]>([]);
    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form state
    const [formKey, setFormKey] = useState('');
    const [formNameEn, setFormNameEn] = useState('');
    const [formNameTh, setFormNameTh] = useState('');
    const [formPairs, setFormPairs] = useState<AllowedPair[]>([]);
    const [saving, setSaving] = useState(false);

    // ── Fetch ───────────────────────────────────────────────────
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
            toast({ variant: 'destructive', title: 'โหลดข้อมูลไม่สำเร็จ' });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ── Handlers ────────────────────────────────────────────────
    const startEdit = (rt: RelType) => {
        setEditingId(rt.id);
        setIsCreating(false);
        setFormKey(rt.relationshipKey);
        setFormNameEn(getLoc(rt.relationshipName, 'en'));
        setFormNameTh(getLoc(rt.relationshipName, 'th'));
        setFormPairs(Array.isArray(rt.allowedPairs) ? rt.allowedPairs : []);
    };

    const startCreate = () => {
        setEditingId(null);
        setIsCreating(true);
        setFormKey('');
        setFormNameEn('');
        setFormNameTh('');
        setFormPairs([]);
    };

    const cancel = () => {
        setEditingId(null);
        setIsCreating(false);
    };

    const addPair = () => {
        setFormPairs(prev => [...prev, { source_category_id: null, target_category_id: null }]);
    };

    const updatePair = (idx: number, field: 'source_category_id' | 'target_category_id', val: string) => {
        setFormPairs(prev => prev.map((p, i) =>
            i === idx ? { ...p, [field]: val === 'any' ? null : Number(val) } : p,
        ));
    };

    const removePair = (idx: number) => {
        setFormPairs(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSave = async () => {
        if (!formKey || !formNameEn) {
            toast({ variant: 'destructive', title: 'กรุณากรอก Key และชื่อ (EN)' });
            return;
        }
        setSaving(true);
        try {
            const payload = {
                relationshipKey: formKey,
                relationshipName: { en: formNameEn, th: formNameTh || formNameEn },
                allowedPairs: formPairs,
            };

            const url = isCreating
                ? '/api/v1/relationship-types'
                : `/api/v1/relationship-types/${editingId}`;
            const method = isCreating ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);

            toast({ title: isCreating ? 'สร้างสำเร็จ' : 'บันทึกสำเร็จ' });
            cancel();
            fetchData();
        } catch (e) {
            toast({ variant: 'destructive', title: 'บันทึกไม่สำเร็จ', description: e instanceof Error ? e.message : '' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`ต้องการลบ "${name}" หรือไม่?`)) return;
        try {
            const res = await fetch(`/api/v1/relationship-types/${id}`, { method: 'DELETE' });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            toast({ title: 'ลบสำเร็จ' });
            fetchData();
        } catch {
            toast({ variant: 'destructive', title: 'ลบไม่สำเร็จ' });
        }
    };

    const getCategoryLabel = (id: number | null): string => {
        if (id === null) return 'Any (ทุกประเภท)';
        const cat = categories.find(c => c.id === id);
        if (!cat) return `#${id}`;
        const layerName = cat.architectureLayer ? getLoc(cat.architectureLayer.layerName) : '';
        return `${getLoc(cat.categoryName)}${layerName ? ` (${layerName})` : ''}`;
    };

    // ── Render ──────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Relationship Types</h3>
                    <p className="text-sm text-muted-foreground">จัดการประเภทความสัมพันธ์และ Rule Pairs</p>
                </div>
                <Button size="sm" onClick={startCreate} disabled={isCreating}>
                    <Plus className="w-4 h-4 mr-1" /> เพิ่มประเภท
                </Button>
            </div>

            {/* Create Form */}
            {isCreating && (
                <div className="p-4 border border-primary/30 rounded-lg bg-primary/5 space-y-3">
                    <h4 className="font-medium text-sm">สร้าง Relationship Type ใหม่</h4>
                    {renderForm()}
                </div>
            )}

            {/* List */}
            <div className="space-y-2">
                {types.map(rt => (
                    <div key={rt.id} className="border rounded-lg overflow-hidden">
                        {/* Row header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                            <div className="flex items-center gap-3 min-w-0">
                                <Badge variant="outline" className="text-xs font-mono shrink-0">{rt.relationshipKey}</Badge>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {getLoc(rt.relationshipName, 'en')}
                                        <span className="text-muted-foreground ml-1">({getLoc(rt.relationshipName, 'th')})</span>
                                    </p>
                                </div>
                                <Badge variant="secondary" className="text-[10px] shrink-0">
                                    {rt._count?.relationships ?? 0} uses
                                </Badge>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(rt)}>
                                    <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(rt.id, getLoc(rt.relationshipName))}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>

                        {/* Edit form */}
                        {editingId === rt.id && (
                            <div className="p-4 border-t space-y-3">
                                {renderForm()}
                            </div>
                        )}

                        {/* Allowed pairs preview (when not editing) */}
                        {editingId !== rt.id && Array.isArray(rt.allowedPairs) && rt.allowedPairs.length > 0 && (
                            <div className="px-4 py-2 border-t bg-background">
                                <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Allowed Pairs</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {(rt.allowedPairs as AllowedPair[]).map((pair, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-md">
                                            {getCategoryLabel(pair.source_category_id)}
                                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                            {getCategoryLabel(pair.target_category_id)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty pairs message */}
                        {editingId !== rt.id && (!rt.allowedPairs || (rt.allowedPairs as AllowedPair[]).length === 0) && (
                            <div className="px-4 py-2 border-t bg-background">
                                <p className="text-xs text-muted-foreground italic">ไม่มี rule pair — อนุญาตทุกคู่</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    // ── Shared Form Render ──────────────────────────────────────
    function renderForm() {
        return (
            <>
                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs">Key</Label>
                        <Input
                            value={formKey}
                            onChange={e => setFormKey(e.target.value)}
                            placeholder="e.g. uses"
                            className="h-8 text-sm font-mono"
                            disabled={editingId !== null}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">ชื่อ (EN)</Label>
                        <Input value={formNameEn} onChange={e => setFormNameEn(e.target.value)} placeholder="Uses" className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">ชื่อ (TH)</Label>
                        <Input value={formNameTh} onChange={e => setFormNameTh(e.target.value)} placeholder="ใช้งาน" className="h-8 text-sm" />
                    </div>
                </div>

                {/* Rule Pairs */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs font-semibold">Rule Pairs (Allowed Category Pairs)</Label>
                        <Button type="button" variant="outline" size="sm" className="h-6 text-xs" onClick={addPair}>
                            <Plus className="w-3 h-3 mr-1" /> เพิ่ม Pair
                        </Button>
                    </div>

                    {formPairs.length === 0 && (
                        <p className="text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
                            ยังไม่มี rule pair — หมายความว่าอนุญาตทุกคู่ category
                        </p>
                    )}

                    <div className="space-y-1.5">
                        {formPairs.map((pair, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-muted/30 rounded-md px-2 py-1.5">
                                <Select
                                    value={pair.source_category_id === null ? 'any' : String(pair.source_category_id)}
                                    onValueChange={v => updatePair(idx, 'source_category_id', v)}
                                >
                                    <SelectTrigger className="h-7 text-xs flex-1">
                                        <SelectValue placeholder="Source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any (ทุกประเภท)</SelectItem>
                                        {categories.map(c => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {getLoc(c.categoryName)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />

                                <Select
                                    value={pair.target_category_id === null ? 'any' : String(pair.target_category_id)}
                                    onValueChange={v => updatePair(idx, 'target_category_id', v)}
                                >
                                    <SelectTrigger className="h-7 text-xs flex-1">
                                        <SelectValue placeholder="Target" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any (ทุกประเภท)</SelectItem>
                                        {categories.map(c => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {getLoc(c.categoryName)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-destructive" onClick={() => removePair(idx)}>
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Button size="sm" className="h-7 text-xs" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
                        {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={cancel}>
                        ยกเลิก
                    </Button>
                </div>
            </>
        );
    }
}
