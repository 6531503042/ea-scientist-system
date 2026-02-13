'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Save, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Department } from '@/types/department';

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

    useEffect(() => {
        if (department) {
            setFormData({
                name: department.name,
                code: department.code || '',
                description: department.description || '',
            });
        }
    }, [department]);

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

    const handleClose = () => {
        onClose();
    };

    if (!isOpen || !department) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">แก้ไขหน่วยงาน</h2>
                                <p className="text-sm text-muted-foreground">แก้ไขข้อมูล: {department.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-1 hover:bg-muted rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <Label htmlFor="edit-name">ชื่อหน่วยงาน *</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="mt-1.5 h-10"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-code">รหัสหน่วยงาน *</Label>
                            <Input
                                id="edit-code"
                                value={formData.code}
                                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                className="mt-1.5 h-10 font-mono"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-description">คำอธิบาย</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={2}
                                className="mt-1.5"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-muted-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.name}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        กำลังบันทึก...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        บันทึกการเปลี่ยนแปลง
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
