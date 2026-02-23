'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Building, FileText, Check, EyeOff, Eye } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
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

const CreateUserModalSchema = z.object({
    firstName: z.string().min(1, "กรุณากรอกชื่อ").max(255, "ชื่อยาวเกินไป"),
    lastName: z.string().optional(),
    email: z.string().min(1, "กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    role: z.enum(['admin', 'architect', 'manager', 'business_owner', 'auditor', 'viewer']),
    department: z.string().optional(),
});

type CreateUserModalFormValues = z.infer<typeof CreateUserModalSchema>;

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export function CreateUserModal({ isOpen, onClose, onSubmit }: CreateUserModalProps) {
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors, isValid }
    } = useForm<CreateUserModalFormValues>({
        resolver: zodResolver(CreateUserModalSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: 'password123',
            role: 'viewer',
            department: '',
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
            setSelectedTemplateIndex(null);
            setShowPassword(false);
        }
    }, [isOpen, reset]);

    const selectTemplate = (index: number | null) => {
        setSelectedTemplateIndex(index);
        if (index !== null) {
            const t = userTemplates[index];
            setValue('role', t.role, { shouldValidate: true });
            setValue('department', t.department, { shouldValidate: true });
        } else {
            setValue('role', 'viewer');
            setValue('department', '');
        }
    };

    const onSubmitForm = (data: CreateUserModalFormValues) => {
        onSubmit({
            name: {
                first: data.firstName,
                last: data.lastName,
            },
            email: data.email,
            username: data.email.split('@')[0], // Extract prefix
            password: data.password,
            role: data.role,
            department: data.department,
            status: 'pending',
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={onClose}
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
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
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
                            <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col flex-1 min-h-0 overflow-hidden">
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
                                            <label className="text-sm font-medium text-foreground">ชื่อ <span className="text-destructive">*</span></label>
                                            <div className="relative mt-1.5 focus-within:text-primary text-muted-foreground">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                                                <input
                                                    type="text"
                                                    {...register('firstName')}
                                                    className={cn(
                                                        "w-full h-10 pl-10 pr-4 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground",
                                                        errors.firstName ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
                                                    )}
                                                    placeholder="ชื่อ"
                                                />
                                            </div>
                                            {errors.firstName && <p className="text-xs text-destructive mt-1.5 font-medium">{errors.firstName.message}</p>}
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-foreground">นามสกุล</label>
                                            <div className="relative mt-1.5 focus-within:text-primary text-muted-foreground">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                                                <input
                                                    type="text"
                                                    {...register('lastName')}
                                                    className="w-full h-10 pl-10 pr-4 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-foreground"
                                                    placeholder="นามสกุล"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-foreground">อีเมล <span className="text-destructive">*</span></label>
                                        <div className="relative mt-1.5 focus-within:text-primary text-muted-foreground">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                                            <input
                                                type="email"
                                                {...register('email')}
                                                className={cn(
                                                    "w-full h-10 pl-10 pr-4 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground",
                                                    errors.email ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
                                                )}
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        {errors.email && <p className="text-xs text-destructive mt-1.5 font-medium">{errors.email.message}</p>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-foreground">รหัสผ่าน <span className="text-destructive">*</span></label>
                                        <div className="relative mt-1.5 focus-within:text-primary text-muted-foreground">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                {...register('password')}
                                                className={cn(
                                                    "w-full h-10 pl-10 pr-11 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-foreground",
                                                    errors.password ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
                                                )}
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
                                        {errors.password && <p className="text-xs text-destructive mt-1.5 font-medium">{errors.password.message}</p>}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-foreground">บทบาท</label>
                                        <Controller
                                            name="role"
                                            control={control}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    className="w-full h-10 px-3 mt-1.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                                                >
                                                    {roleOptions.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-foreground">หน่วยงาน</label>
                                        <div className="relative mt-1.5 focus-within:text-primary text-muted-foreground">
                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                                            <input
                                                type="text"
                                                {...register('department')}
                                                className="w-full h-10 pl-10 pr-4 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-foreground"
                                                placeholder="กรุณาระบุหน่วยงาน"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="px-5 py-4 border-t border-border bg-muted/20 flex justify-end gap-3 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-muted text-foreground"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!isValid}
                                        className={cn(
                                            "px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                            isValid ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"
                                        )}
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
