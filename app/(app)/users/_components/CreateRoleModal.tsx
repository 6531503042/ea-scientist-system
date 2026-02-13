'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Save, Loader2, Check, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { roleTemplates } from '@/data/role-templates';

// Default permissions list
const defaultPermissions = [
    { id: 'view_dashboard', name: 'ดูแดชบอร์ด', module: 'dashboard', description: 'เข้าถึงหน้าแดชบอร์ด' },
    { id: 'view_artefacts', name: 'ดู Artefacts', module: 'artefacts', description: 'ดูรายการ Artefacts' },
    { id: 'create_artefacts', name: 'สร้าง Artefacts', module: 'artefacts', description: 'สร้าง Artefacts ใหม่' },
    { id: 'edit_artefacts', name: 'แก้ไข Artefacts', module: 'artefacts', description: 'แก้ไข Artefacts ที่มีอยู่' },
    { id: 'delete_artefacts', name: 'ลบ Artefacts', module: 'artefacts', description: 'ลบ Artefacts' },
    { id: 'view_users', name: 'ดูผู้ใช้', module: 'users', description: 'ดูรายชื่อผู้ใช้' },
    { id: 'manage_users', name: 'จัดการผู้ใช้', module: 'users', description: 'เพิ่ม/แก้ไข/ลบผู้ใช้' },
    { id: 'manage_roles', name: 'จัดการบทบาท', module: 'users', description: 'จัดการบทบาทและสิทธิ์' },
    { id: 'view_reports', name: 'ดูรายงาน', module: 'reports', description: 'เข้าถึงรายงาน' },
    { id: 'export_data', name: 'ส่งออกข้อมูล', module: 'reports', description: 'ส่งออกข้อมูลเป็น Excel/PDF' },
    { id: 'view_settings', name: 'ดูการตั้งค่า', module: 'settings', description: 'ดูการตั้งค่าระบบ' },
    { id: 'manage_settings', name: 'จัดการการตั้งค่า', module: 'settings', description: 'แก้ไขการตั้งค่าระบบ' },
];

interface CreateRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        code: string;
        name: string;
        nameTh: string;
        description: string;
        permissions: string[];
        isSystemRole: boolean;
    }) => void;
}

export function CreateRoleModal({ isOpen, onClose, onSubmit }: CreateRoleModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        nameTh: '',
        description: '',
        isSystemRole: false,
    });
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);

    const permissionsByModule = defaultPermissions.reduce((acc, perm) => {
        if (!acc[perm.module]) acc[perm.module] = [];
        acc[perm.module].push(perm);
        return acc;
    }, {} as Record<string, typeof defaultPermissions>);

    const selectTemplate = (index: number | null) => {
        setSelectedTemplateIndex(index);
        if (index !== null) {
            const t = roleTemplates[index];
            setFormData({
                code: t.name,
                name: t.name,
                nameTh: t.nameTh,
                description: t.description || '',
                isSystemRole: t.isSystemRole ?? false,
            });
            setSelectedPermissions(t.permissions);
        } else {
            setFormData({ code: '', name: '', nameTh: '', description: '', isSystemRole: false });
            setSelectedPermissions([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        onSubmit({ ...formData, permissions: selectedPermissions });
        setIsSubmitting(false);
        onClose();
        setFormData({ code: '', name: '', nameTh: '', description: '', isSystemRole: false });
        setSelectedPermissions([]);
        setSelectedTemplateIndex(null);
    };

    const handleClose = () => {
        onClose();
        setFormData({ code: '', name: '', nameTh: '', description: '', isSystemRole: false });
        setSelectedPermissions([]);
        setSelectedTemplateIndex(null);
    };

    const togglePermission = (id: string) => {
        setSelectedPermissions(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleModulePermissions = (module: string) => {
        const modulePerms = permissionsByModule[module] || [];
        const allSelected = modulePerms.every(p => selectedPermissions.includes(p.id));
        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(id => !modulePerms.some(p => p.id === id)));
        } else {
            setSelectedPermissions(prev => [
                ...prev,
                ...modulePerms.map(p => p.id).filter(id => !prev.includes(id)),
            ]);
        }
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
                    className="relative w-full max-w-4xl bg-background rounded-xl border shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">เพิ่มบทบาทใหม่</h2>
                                <p className="text-xs text-muted-foreground">เลือกเทมเพลตหรือสร้างจากศูนย์ แล้วกำหนดสิทธิ์</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Two-column: Sidebar + Form */}
                    <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
                        {/* Left Sidebar: Template Selection */}
                        <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-border bg-muted/30 flex flex-col">
                            <div className="flex-1 overflow-y-auto p-3">
                                <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">เทมเพลตบทบาท</h3>
                                <div className="space-y-1">
                                    {roleTemplates.map((template, index) => (
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
                                                <p className="text-xs font-medium truncate">{template.nameTh}</p>
                                                <p className="text-[10px] text-muted-foreground truncate">
                                                    {template.permissions.length} สิทธิ์
                                                </p>
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
                        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                                    {selectedTemplateIndex !== null && (
                                        <div className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg border border-border">
                                            <Shield className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-medium">
                                                เทมเพลต: {roleTemplates[selectedTemplateIndex].nameTh}
                                            </span>
                                        </div>
                                    )}

                                    {/* Basic Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">ข้อมูลพื้นฐาน</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="code">รหัสบทบาท *</Label>
                                                <Input
                                                    id="code"
                                                    value={formData.code}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                                    placeholder="เช่น custom_role"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="name">ชื่อ (ภาษาอังกฤษ) *</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                    placeholder="เช่น Custom Role"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nameTh">ชื่อ (ภาษาไทย) *</Label>
                                            <Input
                                                id="nameTh"
                                                value={formData.nameTh}
                                                onChange={(e) => setFormData(prev => ({ ...prev, nameTh: e.target.value }))}
                                                placeholder="เช่น บทบาทกำหนดเอง"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description">คำอธิบาย</Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                placeholder="อธิบายบทบาท..."
                                                rows={2}
                                            />
                                        </div>
                                        <label className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.isSystemRole}
                                                onChange={(e) => setFormData(prev => ({ ...prev, isSystemRole: e.target.checked }))}
                                                className="rounded border-border w-4 h-4"
                                            />
                                            <span className="text-sm">บทบาทระบบ - ไม่สามารถลบได้</span>
                                        </label>
                                    </div>

                                    {/* Permissions */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-border pb-2">
                                            <h3 className="text-sm font-semibold text-foreground">สิทธิ์การใช้งาน</h3>
                                            <span className="text-xs px-2 py-1 bg-muted rounded-full">
                                                เลือกแล้ว {selectedPermissions.length} สิทธิ์
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            {Object.entries(permissionsByModule).map(([module, modulePerms]) => {
                                                const allSelected = modulePerms.every(p => selectedPermissions.includes(p.id));
                                                const someSelected = modulePerms.some(p => selectedPermissions.includes(p.id));
                                                return (
                                                    <div key={module} className="border rounded-lg overflow-hidden">
                                                        <div
                                                            className="bg-muted/50 px-3 py-2.5 border-b border-border flex items-center justify-between cursor-pointer"
                                                            onClick={() => toggleModulePermissions(module)}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className={cn(
                                                                    "w-4 h-4 rounded border-2 flex items-center justify-center",
                                                                    allSelected ? "bg-primary border-primary text-primary-foreground" : someSelected ? "bg-primary/20 border-primary" : "border-border"
                                                                )}>
                                                                    {allSelected && <Check className="w-2.5 h-2.5" />}
                                                                </div>
                                                                <span className="text-xs font-semibold capitalize">{module}</span>
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground">
                                                                {modulePerms.filter(p => selectedPermissions.includes(p.id)).length}/{modulePerms.length}
                                                            </span>
                                                        </div>
                                                        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {modulePerms.map((perm) => {
                                                                const isSelected = selectedPermissions.includes(perm.id);
                                                                return (
                                                                    <button
                                                                        key={perm.id}
                                                                        type="button"
                                                                        onClick={() => togglePermission(perm.id)}
                                                                        className={cn(
                                                                            "p-2.5 border rounded-lg text-left transition-all flex items-start gap-2",
                                                                            isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                                                                        )}
                                                                    >
                                                                        <div className={cn(
                                                                            "w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center",
                                                                            isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border"
                                                                        )}>
                                                                            {isSelected && <Check className="w-2.5 h-2.5" />}
                                                                        </div>
                                                                        <div className="min-w-0 flex-1">
                                                                            <p className="text-xs font-medium truncate">{perm.name}</p>
                                                                            <p className="text-[10px] text-muted-foreground line-clamp-1">{perm.description}</p>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
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
                                        disabled={isSubmitting || !formData.code || !formData.name || !formData.nameTh}
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
