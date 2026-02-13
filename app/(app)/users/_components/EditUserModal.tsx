'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Save, Loader2, Lock, Eye, EyeOff, FileText, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { User as UserType } from '@/types/user';
import { userTemplates } from '@/data/user-templates';

const roleOptions = [
    { value: 'admin', label: 'ผู้ดูแลระบบ' },
    { value: 'architect', label: 'Enterprise Architect' },
    { value: 'manager', label: 'ผู้บริหาร' },
    { value: 'business_owner', label: 'เจ้าของกระบวนการ' },
    { value: 'data_owner', label: 'เจ้าของข้อมูล' },
    { value: 'auditor', label: 'ผู้ตรวจสอบ' },
    { value: 'viewer', label: 'ผู้ดู' },
];

const statusOptions = [
    { value: 'active', label: 'ใช้งาน', color: 'text-emerald-600' },
    { value: 'inactive', label: 'ไม่ใช้งาน', color: 'text-gray-500' },
    { value: 'suspended', label: 'ระงับ', color: 'text-red-600' },
];

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserType | null;
    onSubmit: (data: Partial<UserType>) => void;
}

export function EditUserModal({ isOpen, onClose, user, onSubmit }: EditUserModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        department: '',
        role: 'viewer',
        status: 'active',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.name.first || '',
                lastName: user.name.last || '',
                email: user.email || '',
                password: '',
                department: typeof user.department === 'string' ? user.department : user.department?.name || '',
                role: typeof user.role === 'string' ? user.role : 'viewer',
                status: user.status || 'active',
            });
        }
    }, [user]);

    const applyTemplate = (index: number | null) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        onSubmit({
            _id: user?._id,
            name: {
                first: formData.firstName,
                last: formData.lastName,
            },
            email: formData.email,
            ...(formData.password && { password: formData.password }),
            department: formData.department,
            role: formData.role,
            status: formData.status as UserType['status'],
        });

        setIsSubmitting(false);
        onClose();
    };

    const handleClose = () => onClose();

    if (!isOpen || !user) return null;

    const displayName = user.displayName || `${user.name.first} ${user.name.last || ''}`.trim();

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
                                <h2 className="text-lg font-bold">แก้ไขผู้ใช้งาน</h2>
                                <p className="text-xs text-muted-foreground">แก้ไขข้อมูล: {displayName}</p>
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
                                <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">ใช้เทมเพลตบทบาท</h3>
                                <p className="text-[10px] text-muted-foreground mb-2">คลิกเพื่อนำบทบาทและหน่วยงานมาใช้</p>
                                <div className="space-y-1">
                                    {userTemplates.map((template, index) => (
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
                                                {template.description && (
                                                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{template.description}</p>
                                                )}
                                            </div>
                                            {selectedTemplateIndex === index && <Check className="w-3.5 h-3.5 flex-shrink-0 text-primary" />}
                                        </button>
                                    ))}
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
                                            <span className="text-xs font-medium">เทมเพลต: {userTemplates[selectedTemplateIndex].name}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">ชื่อ *</Label>
                                            <Input
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">นามสกุล</Label>
                                            <Input
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">อีเมล *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">รหัสผ่านใหม่</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder="เว้นว่างไว้หากไม่ต้องการเปลี่ยน"
                                                className="pl-10 pr-11"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                tabIndex={-1}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setShowPassword((v) => !v);
                                                }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                                                aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">กรอกรหัสผ่านใหม่เพื่อเปลี่ยน (เว้นว่างไว้หากไม่ต้องการเปลี่ยน)</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="department">หน่วยงาน</Label>
                                        <Input
                                            id="department"
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role">บทบาท</Label>
                                        <select
                                            id="role"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full h-10 px-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            {roleOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>สถานะ</Label>
                                        <div className="flex gap-4">
                                            {statusOptions.map(option => (
                                                <label
                                                    key={option.value}
                                                    className={cn(
                                                        "flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-all",
                                                        formData.status === option.value
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border hover:border-primary/50"
                                                    )}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value={option.value}
                                                        checked={formData.status === option.value}
                                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                        className="sr-only"
                                                    />
                                                    <span className={cn("text-sm font-medium", option.color)}>{option.label}</span>
                                                </label>
                                            ))}
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
                                        disabled={isSubmitting || !formData.firstName || !formData.email}
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
