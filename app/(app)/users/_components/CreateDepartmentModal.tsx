'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Department } from '@/types/department';

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
    };

    const handleClose = () => {
        onClose();
        setFormData({ name: '', code: '', description: '' });
    };

    if (!isOpen) return null;

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
                                <h2 className="text-lg font-semibold">เพิ่มหน่วยงาน</h2>
                                <p className="text-sm text-muted-foreground">เพิ่มหน่วยงานใหม่ในระบบ</p>
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
                            <Label htmlFor="name">ชื่อหน่วยงาน *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="เช่น กองบริการห้องปฏิบัติการ"
                                className="mt-1.5 h-10"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="code">รหัสหน่วยงาน *</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                placeholder="เช่น LAB"
                                className="mt-1.5 h-10 font-mono"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">คำอธิบาย</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="อธิบายหน่วยงาน..."
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
                                disabled={isSubmitting || !formData.name || !formData.code}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
