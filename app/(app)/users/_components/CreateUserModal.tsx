'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Building, FileText, Check, EyeOff, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CreateUserInput } from '@/types/user';
import type { RoleKey } from '@/types/role';
import { userTemplates } from '@/data/user-templates';

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
        password: 'password123',
        role: 'viewer' as RoleKey,
        department: '',
    });
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const selectTemplate = (index: number | null) => {
        setSelectedTemplateIndex(index);
        if (index !== null) {
            const t = userTemplates[index];
            setFormData(prev => ({
                ...prev,
                role: t.role,
                department: t.department,
            }));
        }
    };

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
            password: 'password123',
            role: 'viewer',
            department: '',
        });
        setSelectedTemplateIndex(null);
    };

    const handleClose = () => {
        onClose();
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
                    className="relative w-full max-w-3xl bg-background rounded-xl border shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">เพิ่มผู้ใช้งานใหม่</h2>
                                <p className="text-xs text-muted-foreground">เลือกเทมเพลตบทบาทหรือสร้างจากศูนย์</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
                        {/* Left Sidebar: Template Selection */}
                        <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-border bg-muted/30 flex flex-col">
                            <div className="flex-1 overflow-y-auto p-3">
                                <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">เทมเพลตบทบาท</h3>
                                <div className="space-y-1">
                                    {userTemplates.map((template, index) => (
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
                            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                    {selectedTemplateIndex !== null && (
                                        <div className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg border border-border">
                                            <User className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-medium">
                                                เทมเพลต: {userTemplates[selectedTemplateIndex].name}
                                            </span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">ชื่อ *</label>
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
                                        <label className="text-sm font-medium text-muted-foreground">อีเมล *</label>
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
                                        <label className="text-sm font-medium text-muted-foreground">รหัสผ่าน *</label>
                                        <div className="relative mt-1.5">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={formData.password}
                                                onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                                className="w-full h-10 pl-10 pr-11 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                placeholder="••••••••"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                tabIndex={-1}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setShowPassword(v => !v);
                                                }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
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
                                        className="px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                                    >
                                        เพิ่มผู้ใช้งาน
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
