'use client';

import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Save, X, ArrowRight, GitBranch, ChevronDown, ChevronUp, Settings2, Link2, SlidersHorizontal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useRelationshipRules } from '@/hooks/useRelationshipRules';
import type { AllowedPair, ApiCategory, RelType } from '@/types/relationship-rule';
import { getLoc } from '@/types/relationship-rule';

// ── Props ───────────────────────────────────────────────────────
interface RelationshipRulePairSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// ── Component ───────────────────────────────────────────────────
export function RelationshipRulePairSheet({ open, onOpenChange }: RelationshipRulePairSheetProps) {
    const { types, categories, loading, refresh } = useRelationshipRules(open);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Form state
    const [formKey, setFormKey] = useState('');
    const [formNameEn, setFormNameEn] = useState('');
    const [formNameTh, setFormNameTh] = useState('');
    const [formPairs, setFormPairs] = useState<AllowedPair[]>([]);
    const [saving, setSaving] = useState(false);
    const [showAdvancedSource, setShowAdvancedSource] = useState<Record<number, boolean>>({});

    // Group categories by layer for better UX
    const groupedCategories = useMemo(() => {
        const groups: Record<string, { layerName: string; cats: ApiCategory[] }> = {};
        for (const cat of categories) {
            const layerName = cat.architectureLayer ? getLoc(cat.architectureLayer.layerName) : 'Other';
            if (!groups[layerName]) groups[layerName] = { layerName, cats: [] };
            groups[layerName].cats.push(cat);
        }
        return Object.values(groups);
    }, [categories]);

    // Reset local form/editor state wheneverเปิด sheetใหม่
    // (การโหลดข้อมูลจริง ๆ อยู่ใน useRelationshipRules)
    // หมายเหตุ: ทำแบบนี้ให้ logic data กับ UI แยกจากกันชัดเจน
    if (!open && (editingId !== null || isCreating || expandedId !== null)) {
        // simple reset เมื่อ sheet ถูกปิด
        // (ไม่มี side-effect network)
        setEditingId(null);
        setIsCreating(false);
        setExpandedId(null);
        setShowAdvancedSource({});
    }

    // ── Handlers ────────────────────────────────────────────────
    const startEdit = (rt: RelType) => {
        setEditingId(rt.id);
        setExpandedId(rt.id);
        setIsCreating(false);
        setFormKey(rt.relationshipKey);
        setFormNameEn(getLoc(rt.relationshipName, 'en'));
        setFormNameTh(getLoc(rt.relationshipName, 'th'));
        const pairs = Array.isArray(rt.allowedPairs) ? [...rt.allowedPairs] : [];
        setFormPairs(pairs);
        // Auto-show advanced source for pairs that have source_category_id set
        const advancedMap: Record<number, boolean> = {};
        pairs.forEach((p, i) => {
            if (p.source_category_id !== null) advancedMap[i] = true;
        });
        setShowAdvancedSource(advancedMap);
    };

    const startCreate = () => {
        setEditingId(null);
        setExpandedId(null);
        setIsCreating(true);
        setFormKey('');
        setFormNameEn('');
        setFormNameTh('');
        setFormPairs([]);
        setShowAdvancedSource({});
    };

    const cancel = () => {
        setEditingId(null);
        setIsCreating(false);
        setShowAdvancedSource({});
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
        // Re-index advanced source map
        setShowAdvancedSource(prev => {
            const next: Record<number, boolean> = {};
            Object.entries(prev).forEach(([k, v]) => {
                const key = Number(k);
                if (key < idx) next[key] = v;
                else if (key > idx) next[key - 1] = v;
            });
            return next;
        });
    };

    const toggleAdvancedSource = (idx: number) => {
        setShowAdvancedSource(prev => {
            const next = { ...prev };
            if (next[idx]) {
                delete next[idx];
                // Reset source to null when hiding
                setFormPairs(pairs => pairs.map((p, i) => i === idx ? { ...p, source_category_id: null } : p));
            } else {
                next[idx] = true;
            }
            return next;
        });
    };

    const handleSave = async () => {
        if (!formKey || !formNameEn) {
            alert('กรุณากรอก Key และชื่อ (EN)');
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

            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);

            // บันทึกสำเร็จ → refresh list จาก backend ผ่าน feature hook
            alert(isCreating ? 'สร้าง Relationship Type สำเร็จ' : 'บันทึก Relationship Type สำเร็จ');
            cancel();
            refresh();
        } catch (e) {
            console.error(e);
            alert(e instanceof Error ? `บันทึกไม่สำเร็จ: ${e.message}` : 'บันทึกไม่สำเร็จ');
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
            alert('ลบ Relationship Type สำเร็จ');
            refresh();
        } catch (e) {
            console.error(e);
            alert(e instanceof Error ? `ลบไม่สำเร็จ: ${e.message}` : 'ลบไม่สำเร็จ');
        }
    };

    const getCategoryShortLabel = (id: number | null): string => {
        if (id === null) return 'ทุกประเภท';
        const cat = categories.find(c => c.id === id);
        if (!cat) return `#${id}`;
        return getLoc(cat.categoryName);
    };

    const getCategoryLayerLabel = (id: number | null): string => {
        if (id === null) return '';
        const cat = categories.find(c => c.id === id);
        if (!cat?.architectureLayer) return '';
        return getLoc(cat.architectureLayer.layerName);
    };

    const toggleExpand = (id: number) => {
        if (editingId === id) return;
        setExpandedId(prev => prev === id ? null : id);
    };

    // ── Category Select with Grouped Options ────────────────────
    function CategorySelect({ value, onChange, label }: { value: number | null; onChange: (val: string) => void; label: string }) {
        return (
            <div className="flex-1 min-w-0">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">{label}</Label>
                <Select value={value === null ? 'any' : String(value)} onValueChange={onChange}>
                    <SelectTrigger className="h-9 text-xs bg-background w-full">
                        <SelectValue placeholder={label} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                        <SelectItem value="any" className="text-xs">
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                                ทุกประเภท (Any)
                            </span>
                        </SelectItem>
                        <Separator className="my-1" />
                        {groupedCategories.map(group => (
                            <SelectGroup key={group.layerName}>
                                <SelectLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70 px-2 py-1">
                                    {group.layerName}
                                </SelectLabel>
                                {group.cats.map(c => (
                                    <SelectItem key={c.id} value={String(c.id)} className="text-xs">
                                        {getLoc(c.categoryName)}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    }

    // ── Render ──────────────────────────────────────────────────
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col" hideCloseButton>
                {/* Fixed Header */}
                <div className="px-4 sm:px-6 pt-5 pb-3">
                    <SheetHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                                <GitBranch className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <SheetTitle className="text-base">Relationship Types & Rules</SheetTitle>
                                <SheetDescription className="text-xs mt-0.5">
                                    กำหนดประเภทความสัมพันธ์และ Target Category ที่อนุญาต
                                </SheetDescription>
                            </div>
                            <Button size="sm" onClick={startCreate} disabled={isCreating} className="gap-1.5 h-8 shrink-0">
                                <Plus className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">เพิ่มใหม่</span>
                                <span className="sm:hidden">เพิ่ม</span>
                            </Button>
                        </div>
                    </SheetHeader>
                </div>

                <Separator />

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="rounded-xl border border-border overflow-hidden p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Skeleton className="w-10 h-10 rounded-lg" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {[...Array(3)].map((_, j) => (
                                            <Skeleton key={j} className="h-8 w-20 rounded-lg" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Create Form */}
                            {isCreating && (
                                <div className="rounded-xl border-2 border-primary/30 bg-primary/5 overflow-hidden">
                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 border-b border-primary/20">
                                        <Settings2 className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-sm font-semibold text-primary">สร้าง Relationship Type ใหม่</span>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        {renderForm()}
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            {!isCreating && types.length > 0 && (
                                <div className="flex items-center gap-4 text-xs text-muted-foreground pb-1">
                                    <span>{types.length} ประเภท</span>
                                    <span>{types.reduce((sum, rt) => sum + (rt._count?.relationships ?? 0), 0)} ความสัมพันธ์ทั้งหมด</span>
                                </div>
                            )}

                            {/* List */}
                            <div className="space-y-2">
                                {types.map(rt => {
                                    const isExpanded = expandedId === rt.id;
                                    const isEditing = editingId === rt.id;
                                    const pairs = Array.isArray(rt.allowedPairs) ? rt.allowedPairs as AllowedPair[] : [];
                                    const useCount = rt._count?.relationships ?? 0;

                                    return (
                                        <div key={rt.id} className={cn(
                                            "rounded-xl border transition-all overflow-hidden",
                                            isEditing ? "border-primary/40 shadow-md ring-1 ring-primary/10" : "border-border hover:border-border/80"
                                        )}>
                                            {/* Header row */}
                                            <div
                                                onClick={() => toggleExpand(rt.id)}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 sm:px-4 py-3 cursor-pointer transition-colors",
                                                    isExpanded ? "bg-muted/50" : "hover:bg-muted/30"
                                                )}
                                            >
                                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/5 shrink-0">
                                                    <Link2 className="w-4 h-4 text-primary/70" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-sm font-semibold text-foreground">
                                                            {getLoc(rt.relationshipName, 'en')}
                                                        </span>
                                                        <Badge variant="outline" className="text-[9px] font-mono px-1.5 py-0 h-4 shrink-0 uppercase">
                                                            {rt.relationshipKey}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                                                        <span>{getLoc(rt.relationshipName, 'th')}</span>
                                                        <span className="text-muted-foreground/40">|</span>
                                                        <span>{pairs.length > 0 ? `${pairs.length} targets` : 'ไม่จำกัด'}</span>
                                                        {useCount > 0 && (
                                                            <>
                                                                <span className="text-muted-foreground/40">|</span>
                                                                <span>{useCount} ใช้งาน</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(rt)} title="แก้ไข">
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/60 hover:text-destructive" onClick={() => handleDelete(rt.id, getLoc(rt.relationshipName))} title="ลบ">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                    {isExpanded
                                                        ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                                        : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                                    }
                                                </div>
                                            </div>

                                            {/* Expanded content */}
                                            {isExpanded && (
                                                <div className="border-t">
                                                    {isEditing ? (
                                                        <div className="p-4 space-y-3 bg-primary/[0.02]">
                                                            {renderForm()}
                                                        </div>
                                                    ) : (
                                                        <div className="p-3 sm:p-4">
                                                            {pairs.length > 0 ? (
                                                                <div className="space-y-2">
                                                                    <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider mb-2">
                                                                        Target Categories ที่อนุญาต ({pairs.length})
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {pairs.map((pair, i) => (
                                                                            <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted/40 rounded-lg">
                                                                                {pair.source_category_id !== null && (
                                                                                    <>
                                                                                        <Badge variant="outline" className="text-[10px] h-5 font-normal bg-background">
                                                                                            {getCategoryShortLabel(pair.source_category_id)}
                                                                                        </Badge>
                                                                                        <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                                                                                    </>
                                                                                )}
                                                                                <Badge variant="secondary" className="text-[10px] h-5 font-medium">
                                                                                    {getCategoryShortLabel(pair.target_category_id)}
                                                                                </Badge>
                                                                                {getCategoryLayerLabel(pair.target_category_id) && (
                                                                                    <span className="text-[9px] text-muted-foreground/60">
                                                                                        {getCategoryLayerLabel(pair.target_category_id)}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-center py-4 bg-muted/30 rounded-lg border border-dashed border-border">
                                                                    <Link2 className="w-5 h-5 text-muted-foreground/40 mx-auto mb-1" />
                                                                    <p className="text-xs text-muted-foreground">ไม่จำกัด Target</p>
                                                                    <p className="text-[10px] text-muted-foreground/60">เชื่อมต่อได้กับทุก category</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {types.length === 0 && !isCreating && (
                                <div className="text-center py-12">
                                    <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                                        <GitBranch className="w-7 h-7 text-muted-foreground/30" />
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground">ยังไม่มี Relationship Type</p>
                                    <p className="text-xs text-muted-foreground/60 mt-1 mb-4">กดปุ่ม &quot;เพิ่มใหม่&quot; ด้านบนเพื่อเริ่มต้น</p>
                                    <Button size="sm" variant="outline" onClick={startCreate} className="gap-1.5">
                                        <Plus className="w-3.5 h-3.5" />
                                        สร้าง Relationship Type แรก
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Fixed Footer with Close button */}
                <div className="shrink-0 px-4 sm:px-6 py-4 border-t border-border bg-background">
                    <SheetClose asChild>
                        <Button variant="outline" className="w-full sm:w-auto min-w-[140px]">
                            ปิด
                        </Button>
                    </SheetClose>
                </div>
            </SheetContent>
        </Sheet>
    );

    // ── Shared Form ─────────────────────────────────────────────
    function renderForm() {
        return (
            <>
                {/* Basic Info */}
                <div className="space-y-3">
                    <div>
                        <Label className="text-xs font-medium">Key <span className="text-muted-foreground font-normal">(ภาษาอังกฤษ ไม่มีเว้นวรรค)</span></Label>
                        <Input
                            value={formKey}
                            onChange={e => setFormKey(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))}
                            placeholder="เช่น USES, DEPENDS_ON"
                            className="h-9 text-sm font-mono mt-1.5"
                            disabled={editingId !== null}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <Label className="text-xs font-medium">ชื่อ (EN)</Label>
                            <Input value={formNameEn} onChange={e => setFormNameEn(e.target.value)} placeholder="Uses" className="h-9 text-sm mt-1.5" />
                        </div>
                        <div>
                            <Label className="text-xs font-medium">ชื่อ (TH)</Label>
                            <Input value={formNameTh} onChange={e => setFormNameTh(e.target.value)} placeholder="ใช้งาน" className="h-9 text-sm mt-1.5" />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Rule Pairs Section — Target-focused */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <Label className="text-xs font-semibold">Target Categories ที่อนุญาต</Label>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                Artefact สามารถเชื่อมความสัมพันธ์นี้ไปหา category ใดได้บ้าง
                            </p>
                        </div>
                        <Button type="button" variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={addPair}>
                            <Plus className="w-3 h-3" /> เพิ่ม
                        </Button>
                    </div>

                    {formPairs.length === 0 && (
                        <div className="text-center py-6 bg-muted/20 rounded-lg border border-dashed border-border">
                            <Link2 className="w-5 h-5 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">ไม่จำกัด — เชื่อมต่อได้กับทุก category</p>
                            <p className="text-[10px] text-muted-foreground/60 mt-0.5">เพิ่ม rule เพื่อจำกัดเฉพาะ category ที่ต้องการ</p>
                            <Button type="button" variant="ghost" size="sm" className="mt-2 h-7 text-xs text-primary" onClick={addPair}>
                                <Plus className="w-3 h-3 mr-1" /> เพิ่ม Rule แรก
                            </Button>
                        </div>
                    )}

                    <div className="space-y-2">
                        {formPairs.map((pair, idx) => {
                            const hasAdvancedSource = showAdvancedSource[idx] === true;

                            return (
                                <div key={idx} className="rounded-lg border border-border bg-card overflow-hidden">
                                    {/* Main: Target selector */}
                                    <div className="p-3">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                                                Rule #{idx + 1}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                                                onClick={() => removePair(idx)}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>

                                        <CategorySelect
                                            value={pair.target_category_id}
                                            onChange={v => updatePair(idx, 'target_category_id', v)}
                                            label="เชื่อมต่อไปหา (Target Category)"
                                        />
                                    </div>

                                    {/* Advanced: Source filter toggle */}
                                    <div className="border-t border-dashed border-border">
                                        <button
                                            type="button"
                                            onClick={() => toggleAdvancedSource(idx)}
                                            className={cn(
                                                "w-full flex items-center gap-1.5 px-3 py-1.5 text-[10px] transition-colors",
                                                hasAdvancedSource
                                                    ? "text-primary bg-primary/5"
                                                    : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/30"
                                            )}
                                        >
                                            <SlidersHorizontal className="w-3 h-3" />
                                            {hasAdvancedSource ? 'ซ่อนเงื่อนไข Source' : 'จำกัด Source Category (ขั้นสูง)'}
                                        </button>

                                        {hasAdvancedSource && (
                                            <div className="px-3 pb-3 pt-2 bg-muted/20">
                                                <p className="text-[10px] text-muted-foreground mb-1.5">
                                                    จำกัดว่า Artefact ต้นทางต้องเป็น category ใด จึงจะใช้ rule นี้ได้
                                                </p>
                                                <CategorySelect
                                                    value={pair.source_category_id}
                                                    onChange={v => updatePair(idx, 'source_category_id', v)}
                                                    label="Source Category (ต้นทาง)"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                    <Button size="sm" className="h-9 text-sm flex-1 gap-1.5" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                    </Button>
                    <Button size="sm" variant="outline" className="h-9 text-sm" onClick={cancel}>
                        ยกเลิก
                    </Button>
                </div>
            </>
        );
    }
}
