'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CreateUserInput } from '@/types/user';
import type { RoleKey } from '@/types/role';

const roleOptions: { value: RoleKey; label: string }[] = [
    { value: 'admin', label: 'ผู้ดูแลระบบ' },
    { value: 'architect', label: 'Enterprise Architect' },
    { value: 'manager', label: 'ผู้บริหาร' },
    { value: 'business_owner', label: 'เจ้าของกระบวนการ' },
    { value: 'auditor', label: 'ผู้ตรวจสอบ' },
    { value: 'viewer', label: 'ผู้ดู' },
];

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<CreateUserInput>) => void;
}

export function CreateUserModal({ isOpen, onClose, onSubmit }: CreateUserModalProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'viewer' as RoleKey,
        department: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name: {
                first: formData.firstName,
                last: formData.lastName,
            },
            email: formData.email,
            username: formData.email.split('@')[0],
            password: formData.password,
            role: formData.role,
            department: formData.department,
            status: 'pending',
        } as any);
        onClose();
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: 'viewer',
            department: '',
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <h2 className="text-lg font-semibold">เพิ่มผู้ใช้งานใหม่</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-muted rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">ชื่อ</label>
                                <div className="relative mt-1.5">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                        className="w-full h-10 pl-10 pr-4 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="ชื่อ"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">นามสกุล</label>
                                <div className="relative mt-1.5">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                        className="w-full h-10 pl-10 pr-4 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="นามสกุล"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-muted-foreground">อีเมล</label>
                            <div className="relative mt-1.5">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full h-10 pl-10 pr-4 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-muted-foreground">รหัสผ่าน</label>
                            <div className="relative mt-1.5">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full h-10 pl-10 pr-4 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-muted-foreground">บทบาท</label>
                            <select
                                value={formData.role}
                                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value as RoleKey }))}
                                className="w-full h-10 px-3 mt-1.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                                {roleOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-muted-foreground">หน่วยงาน</label>
                            <div className="relative mt-1.5">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                    className="w-full h-10 pl-10 pr-4 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    placeholder="กรุณาระบุหน่วยงาน"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-muted-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                เพิ่มผู้ใช้งาน
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
