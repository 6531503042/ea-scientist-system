'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Loader2, FileText, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { Department } from '@/types/department';
import { departmentTemplates } from '@/data/department-templates';

interface CreateDepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Department> & { code?: string; name?: string }) => void;
}

export function CreateDepartmentModal({ isOpen, onClose, onSubmit }: CreateDepartmentModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);

    const selectTemplate = (index: number | null) => {
        setSelectedTemplateIndex(index);
        if (index !== null) {
            const t = departmentTemplates[index];
            setFormData({
                name: t.fields.name,
                code: t.fields.code,
                description: t.fields.description || '',
            });
        } else {
            setFormData({ name: '', code: '', description: '' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        onSubmit({
            name: formData.name,
            code: formData.code,
            description: formData.description,
        });
        setIsSubmitting(false);
        onClose();
        setFormData({ name: '', code: '', description: '' });
        setSelectedTemplateIndex(null);
    };

    const handleClose = () => {
        onClose();
        setFormData({ name: '', code: '', description: '' });
        setSelectedTemplateIndex(null);
    };

    if (!isOpen) return null;

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
                                <h2 className="text-lg font-bold">เพิ่มหน่วยงานใหม่</h2>
                                <p className="text-xs text-muted-foreground">เลือกเทมเพลตหรือสร้างจากศูนย์ แล้วกรอกข้อมูล</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Two-column: Sidebar + Form */}
                    <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
                        {/* Left Sidebar: Template Selection */}
                        <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-border bg-muted/30 flex flex-col md:overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-3">
                                <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">เทมเพลต</h3>
                                <div className="space-y-1">
                                    {departmentTemplates.map((template, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => selectTemplate(index)}
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
                                                {template.description && (
                                                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                                                        {template.description}
                                                    </p>
                                                )}
                                            </div>
                                            {selectedTemplateIndex === index && <Check className="w-3.5 h-3.5 flex-shrink-0 text-primary" />}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => selectTemplate(null)}
                                        className={cn(
                                            "w-full px-2.5 py-2 rounded-lg text-xs text-left border border-dashed transition-all",
                                            selectedTemplateIndex === null
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-border hover:border-muted-foreground text-muted-foreground"
                                        )}
                                    >
                                        สร้างจากศูนย์
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                    {selectedTemplateIndex !== null && (
                                        <div className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg border border-border">
                                            <Building2 className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-medium">
                                                เทมเพลต: {departmentTemplates[selectedTemplateIndex].name}
                                            </span>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="name">ชื่อหน่วยงาน *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="เช่น กองบริการห้องปฏิบัติการ"
                                            className="h-10"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="code">รหัสหน่วยงาน *</Label>
                                        <Input
                                            id="code"
                                            value={formData.code}
                                            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                            placeholder="เช่น LAB"
                                            className="h-10 font-mono"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">คำอธิบาย</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="อธิบายหน่วยงาน..."
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <div className="px-5 py-4 border-t border-border bg-muted/20 flex justify-end gap-3 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-4 py-2.5 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !formData.name || !formData.code}
                                        className="px-4 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                กำลังบันทึก...
                                            </>
                                        ) : (
                                            <>
                                                <Building2 className="w-4 h-4" />
                                                เพิ่มหน่วยงาน
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
