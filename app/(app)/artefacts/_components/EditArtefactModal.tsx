'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Check, FileText, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import type { Artefact, ArtefactType } from '@/types/artefact';

import { typeIcons, typeColors, togafLabels, togafTypeFields, typeOrder } from '@/data/artefact-config';
import { templates } from '@/data/artefact-templates';

/** Localized name helper */
const getLoc = (v: any, lang: 'en' | 'th' = 'en'): string => {
    if (!v) return '';
    if (typeof v === 'string') return v;
    return v[lang] || v['en'] || v['th'] || '';
};

/** Status mapping: frontend → backend */
const STATUS_MAP: Record<string, string> = {
    draft: 'ACTIVE', active: 'ACTIVE', planned: 'ACTIVE',
    deprecated: 'INACTIVE', archived: 'RETIRED',
};

interface ApiUser { id: number; firstName: string; lastName: string }
interface ApiDepartment { id: number; shortName: string; fullName: string }
interface ApiLayer {
    id: number;
    layerName: { en: string; th: string } | string;
    artifactCategories: { id: number; categoryName: { en: string; th: string } | string }[];
}

interface EditArtefactModalProps {
    artefact: Artefact;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export function EditArtefactModal({ artefact, onClose, onSubmit }: EditArtefactModalProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<ArtefactType>(artefact.type);
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);

    // Dropdown data from API
    const [users, setUsers] = useState<ApiUser[]>([]);
    const [departments, setDepartments] = useState<ApiDepartment[]>([]);
    const [layers, setLayers] = useState<ApiLayer[]>([]);

    // Form data
    const [formData, setFormData] = useState({
        name: artefact.name,
        nameTh: artefact.nameTh || '',
        description: artefact.description || '',
        ownerId: '',
        departmentId: '',
        version: artefact.version || '1',
        status: artefact.status || 'active',
        typeSpecificFields: {} as Record<string, string>,
    });

    // Fetch real data from API
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [uRes, dRes, lRes] = await Promise.all([
                    fetch('/api/v1/users'),
                    fetch('/api/v1/departments'),
                    fetch('/api/v1/architecture-layers'),
                ]);
                const [uJson, dJson, lJson] = await Promise.all([uRes.json(), dRes.json(), lRes.json()]);
                if (uJson.success) setUsers(uJson.data);
                if (dJson.success) setDepartments(dJson.data);
                if (lJson.success) setLayers(lJson.data);
            } catch { /* silent */ }
        };
        fetchOptions();
    }, []);

    // Resolve layerId + categoryId from type
    const resolveIds = (type: ArtefactType) => {
        const keyword = type.toLowerCase();
        const layer = layers.find(l => getLoc(l.layerName).toLowerCase().includes(keyword));
        if (!layer) return {};
        const cat = layer.artifactCategories?.[0];
        return { layerId: layer.id, categoryId: cat?.id };
    };

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { layerId, categoryId } = resolveIds(selectedType);

            const payload: Record<string, unknown> = {
                artefactName: { en: formData.name, th: formData.nameTh },
                description: formData.description
                    ? { en: formData.description, th: formData.description }
                    : undefined,
                lifecycleStatus: STATUS_MAP[formData.status] || 'ACTIVE',
            };
            if (categoryId) payload.categoryId = categoryId;
            if (layerId) payload.architectureLayerId = layerId;
            if (formData.ownerId) payload.responsibleById = Number(formData.ownerId);
            if (formData.departmentId) payload.ownerDepartmentId = Number(formData.departmentId);

            const res = await fetch(`/api/v1/artefacts/${artefact.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Failed to update');

            toast({ title: 'บันทึกสำเร็จ', description: `${formData.name} ถูกอัปเดตแล้ว` });
            onSubmit(json.data);
        } catch (error) {
            toast({ variant: 'destructive', title: 'บันทึกไม่สำเร็จ', description: error instanceof Error ? error.message : '' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleTypeSpecificChange = (key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            typeSpecificFields: { ...prev.typeSpecificFields, [key]: value },
        }));
    };

    const selectType = (type: ArtefactType) => {
        setSelectedType(type);
        setSelectedTemplateIndex(null);
    };

    const selectTemplate = (index: number) => {
        setSelectedTemplateIndex(index);
        const template = templates[selectedType][index];
        // Only fill type-specific fields from template, keep user's edits for main fields
        setFormData(prev => ({
            ...prev,
            typeSpecificFields: template.typeSpecificFields || {},
        }));
    };

    const currentTemplates = templates[selectedType] || [];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl bg-background rounded-xl border shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b">
                        <div>
                            <h2 className="text-lg font-bold">แก้ไข Artefact</h2>
                            <p className="text-xs text-muted-foreground">{artefact.name}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Two-column layout matching Create modal */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Left Column: Type & Template Selection */}
                        <div className="w-56 border-r bg-muted/30 flex flex-col overflow-hidden">
                            {/* Type Selection */}
                            <div className="p-3 border-b">
                                <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">ประเภท</h3>
                                <div className="space-y-1">
                                    {typeOrder.map((type) => {
                                        const Icon = typeIcons[type];
                                        const isSelected = selectedType === type;
                                        return (
                                            <button
                                                key={type}
                                                onClick={() => selectType(type)}
                                                className={cn(
                                                    "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-all",
                                                    isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                                                )}
                                            >
                                                <div className={cn(
                                                    "flex items-center justify-center w-6 h-6 rounded-md",
                                                    isSelected ? "bg-primary-foreground/20" : "bg-background"
                                                )}>
                                                    <Icon className="w-3.5 h-3.5" />
                                                </div>
                                                <span>{togafLabels[type].short}</span>
                                                {isSelected && <Check className="w-3 h-3 ml-auto" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Template Selection */}
                            <div className="flex-1 overflow-y-auto p-3">
                                <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">เทมเพลต</h3>
                                <div className="space-y-1">
                                    {currentTemplates.map((template, index) => (
                                        <button
                                            key={index}
                                            onClick={() => selectTemplate(index)}
                                            className={cn(
                                                "w-full flex items-start gap-2 px-2.5 py-2 rounded-lg text-left transition-all group",
                                                selectedTemplateIndex === index
                                                    ? "bg-accent text-accent-foreground"
                                                    : "hover:bg-muted text-foreground"
                                            )}
                                        >
                                            <FileText className={cn(
                                                "w-3.5 h-3.5 flex-shrink-0 mt-0.5",
                                                selectedTemplateIndex === index ? "text-accent-foreground" : "text-muted-foreground"
                                            )} />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-medium truncate">{template.name}</p>
                                                {template.typeSpecificFields && Object.keys(template.typeSpecificFields).length > 0 && (
                                                    <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 mt-0.5">
                                                        <Layers className="w-2.5 h-2.5 mr-0.5" /> Fields
                                                    </Badge>
                                                )}
                                            </div>
                                            {selectedTemplateIndex === index && <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                    {/* Type indicator */}
                                    <div className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg border">
                                        <div className={cn("w-2 h-2 rounded-full", typeColors[selectedType])} />
                                        <span className="text-xs font-medium">{togafLabels[selectedType].full}</span>
                                    </div>

                                    {/* Name fields */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="edit-name" className="text-xs">ชื่อ (English)</Label>
                                            <Input id="edit-name" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="h-9 text-sm" required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="edit-nameTh" className="text-xs">ชื่อ (ไทย)</Label>
                                            <Input id="edit-nameTh" value={formData.nameTh} onChange={e => handleChange('nameTh', e.target.value)} className="h-9 text-sm" required />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="edit-desc" className="text-xs">รายละเอียด</Label>
                                        <Textarea id="edit-desc" className="h-20 resize-none text-sm" value={formData.description} onChange={e => handleChange('description', e.target.value)} />
                                    </div>

                                    {/* Owner & Department */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">ผู้รับผิดชอบ</Label>
                                            <Select value={formData.ownerId} onValueChange={v => handleChange('ownerId', v)}>
                                                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="เลือกผู้รับผิดชอบ" /></SelectTrigger>
                                                <SelectContent className="max-h-[200px]">
                                                    {users.map(u => (
                                                        <SelectItem key={u.id} value={String(u.id)}>{u.firstName} {u.lastName}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">หน่วยงาน</Label>
                                            <Select value={formData.departmentId} onValueChange={v => handleChange('departmentId', v)}>
                                                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="เลือกหน่วยงาน" /></SelectTrigger>
                                                <SelectContent className="max-h-[200px]">
                                                    {departments.map(d => (
                                                        <SelectItem key={d.id} value={String(d.id)}>{d.fullName || d.shortName}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* TOGAF Type-Specific Fields */}
                                    {togafTypeFields[selectedType]?.length > 0 && (
                                        <div className="pt-3 mt-2 border-t">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className={cn("w-2 h-2 rounded-full", typeColors[selectedType])} />
                                                <span className="text-xs font-semibold text-muted-foreground uppercase">{togafLabels[selectedType].short} Fields</span>
                                                <Badge variant="outline" className="text-[9px] px-1.5">TOGAF</Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {togafTypeFields[selectedType].map(field => (
                                                    <div key={field.key} className={cn("space-y-1.5", field.type === 'textarea' && "col-span-2")}>
                                                        <Label htmlFor={`edit-${field.key}`} className="text-xs">
                                                            {field.labelTh} <span className="text-muted-foreground text-[10px]">({field.label})</span>
                                                        </Label>
                                                        {field.type === 'select' ? (
                                                            <Select value={formData.typeSpecificFields[field.key] || ''} onValueChange={v => handleTypeSpecificChange(field.key, v)}>
                                                                <SelectTrigger className="h-9 text-sm" id={`edit-${field.key}`}><SelectValue placeholder={`เลือก${field.labelTh}`} /></SelectTrigger>
                                                                <SelectContent>
                                                                    {field.options?.map(opt => (
                                                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        ) : field.type === 'textarea' ? (
                                                            <Textarea id={`edit-${field.key}`} placeholder={field.placeholder} className="h-16 resize-none text-sm" value={formData.typeSpecificFields[field.key] || ''} onChange={e => handleTypeSpecificChange(field.key, e.target.value)} />
                                                        ) : (
                                                            <Input id={`edit-${field.key}`} placeholder={field.placeholder} value={formData.typeSpecificFields[field.key] || ''} onChange={e => handleTypeSpecificChange(field.key, e.target.value)} className="h-9 text-sm" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Version & Status */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Version</Label>
                                            <Input value={formData.version} onChange={e => handleChange('version', e.target.value)} className="h-9 text-sm" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">สถานะ</Label>
                                            <Select value={formData.status} onValueChange={v => handleChange('status', v)}>
                                                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="draft">Draft - ร่าง</SelectItem>
                                                    <SelectItem value="active">Active - ใช้งาน</SelectItem>
                                                    <SelectItem value="planned">Planned - วางแผน</SelectItem>
                                                    <SelectItem value="deprecated">Deprecated - เลิกใช้</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex gap-3 p-4 border-t bg-muted/30">
                                    <Button type="button" variant="outline" className="flex-1 h-9" onClick={onClose}>ยกเลิก</Button>
                                    <Button type="submit" className="flex-1 h-9" disabled={loading || !formData.name}>
                                        <Save className="w-4 h-4 mr-2" />
                                        {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
