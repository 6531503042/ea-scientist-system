'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Save, Loader2, FileText, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { Department } from '@/types/department';
import { departmentTemplates } from '@/data/department-templates';

interface EditDepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    department: Department | null;
    onSubmit: (id: string, data: Partial<Department>) => void;
}

export function EditDepartmentModal({
    isOpen,
    onClose,
    department,
    onSubmit,
}: EditDepartmentModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);

    useEffect(() => {
        if (department) {
            setFormData({
                name: department.name,
                code: department.code || '',
                description: department.description || '',
            });
        }
    }, [department]);

    const applyTemplate = (index: number) => {
        setSelectedTemplateIndex(index);
        const t = departmentTemplates[index];
        setFormData({
            name: t.fields.name,
            code: t.fields.code,
            description: t.fields.description || '',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!department) return;
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        onSubmit(department._id, {
            name: formData.name,
            code: formData.code,
            description: formData.description,
        });
        setIsSubmitting(false);
        onClose();
    };

    const handleClose = () => onClose();

    if (!isOpen || !department) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-3xl bg-background rounded-xl border shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">แก้ไขหน่วยงาน</h2>
                                <p className="text-xs text-muted-foreground">แก้ไขข้อมูล: {department.name}</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
                        {/* Left Sidebar: Quick templates */}
                        <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-border bg-muted/30 flex flex-col">
                            <div className="flex-1 overflow-y-auto p-3">
                                <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">ใช้เทมเพลต</h3>
                                <p className="text-[10px] text-muted-foreground mb-2">คลิกเพื่อนำโครงสร้างมาใช้</p>
                                <div className="space-y-1">
                                    {departmentTemplates.map((template, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => applyTemplate(index)}
                                            className={cn(
                                                "w-full flex items-start gap-2 px-2.5 py-2 rounded-lg text-left transition-all",
                                                selectedTemplateIndex === index
                                                    ? "bg-primary/10 text-primary border border-primary/30"
                                                    : "hover:bg-muted/80 text-foreground border border-transparent"
                                            )}
                                        >
                                            <FileText className={cn(
                                                "w-3.5 h-3.5 flex-shrink-0 mt-0.5",
                                                selectedTemplateIndex === index ? "text-primary" : "text-muted-foreground"
                                            )} />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-medium truncate">{template.name}</p>
                                            </div>
                                            {selectedTemplateIndex === index && <Check className="w-3.5 h-3.5 flex-shrink-0 text-primary" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name">ชื่อหน่วยงาน *</Label>
                                        <Input
                                            id="edit-name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="h-10"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-code">รหัสหน่วยงาน *</Label>
                                        <Input
                                            id="edit-code"
                                            value={formData.code}
                                            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                            className="h-10 font-mono"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-description">คำอธิบาย</Label>
                                        <Textarea
                                            id="edit-description"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                                <div className="px-5 py-4 border-t border-border bg-muted/20 flex justify-end gap-3 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-muted"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !formData.name}
                                        className="px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                กำลังบันทึก...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                บันทึก
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
