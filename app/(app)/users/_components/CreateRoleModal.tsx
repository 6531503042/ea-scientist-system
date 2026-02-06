'use client';

import { useState } from 'react';
import { Shield, Save, Loader2, Check } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

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

    // Group permissions by module
    const permissionsByModule = defaultPermissions.reduce((acc, perm) => {
        if (!acc[perm.module]) {
            acc[perm.module] = [];
        }
        acc[perm.module].push(perm);
        return acc;
    }, {} as Record<string, typeof defaultPermissions>);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        onSubmit({
            ...formData,
            permissions: selectedPermissions,
        });

        setIsSubmitting(false);
        onClose();

        // Reset form
        setFormData({
            code: '',
            name: '',
            nameTh: '',
            description: '',
            isSystemRole: false,
        });
        setSelectedPermissions([]);
    };

    const togglePermission = (permissionId: string) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const toggleModulePermissions = (module: string) => {
        const modulePerms = permissionsByModule[module] || [];
        const allSelected = modulePerms.every(p => selectedPermissions.includes(p.id));

        if (allSelected) {
            setSelectedPermissions(prev =>
                prev.filter(id => !modulePerms.some(p => p.id === id))
            );
        } else {
            setSelectedPermissions(prev => [
                ...prev,
                ...modulePerms.map(p => p.id).filter(id => !prev.includes(id))
            ]);
        }
    };

    const handleClose = () => {
        onClose();
        setFormData({
            code: '',
            name: '',
            nameTh: '',
            description: '',
            isSystemRole: false,
        });
        setSelectedPermissions([]);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 flex flex-col">
                <div className="flex flex-col flex-1 min-h-0">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <Shield className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <DialogTitle className="text-xl font-bold">เพิ่มบทบาทใหม่</DialogTitle>
                                    <DialogDescription className="mt-1">
                                        สร้างบทบาทใหม่พร้อมกำหนดสิทธิ์การใช้งาน
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">ข้อมูลพื้นฐาน</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="code">รหัสบทบาท (Code) *</Label>
                                        <Input
                                            id="code"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            placeholder="เช่น custom_role"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">ชื่อบทบาท (ภาษาอังกฤษ) *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="เช่น Custom Role"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nameTh">ชื่อบทบาท (ภาษาไทย) *</Label>
                                    <Input
                                        id="nameTh"
                                        value={formData.nameTh}
                                        onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
                                        placeholder="เช่น บทบาทกำหนดเอง"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">คำอธิบาย</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="อธิบายบทบาทและหน้าที่..."
                                        rows={2}
                                    />
                                </div>

                                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                                    <input
                                        type="checkbox"
                                        id="isSystemRole"
                                        checked={formData.isSystemRole}
                                        onChange={(e) => setFormData({ ...formData, isSystemRole: e.target.checked })}
                                        className="rounded border-border w-4 h-4"
                                    />
                                    <Label htmlFor="isSystemRole" className="cursor-pointer text-sm">
                                        บทบาทระบบ (System Role) - ไม่สามารถลบได้
                                    </Label>
                                </div>
                            </div>

                            {/* Permissions */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-border pb-2">
                                    <h3 className="text-sm font-semibold text-foreground">สิทธิ์การใช้งาน</h3>
                                    <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                        เลือกแล้ว {selectedPermissions.length} สิทธิ์
                                    </span>
                                </div>

                                {Object.entries(permissionsByModule).map(([module, modulePerms]) => {
                                    const allSelected = modulePerms.every(p => selectedPermissions.includes(p.id));
                                    const someSelected = modulePerms.some(p => selectedPermissions.includes(p.id));

                                    return (
                                        <div key={module} className="border rounded-lg overflow-hidden">
                                            <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleModulePermissions(module)}
                                                        className={cn(
                                                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                                                            allSelected
                                                                ? "bg-primary border-primary text-white"
                                                                : someSelected
                                                                    ? "bg-primary/20 border-primary"
                                                                    : "border-border hover:border-primary/50"
                                                        )}
                                                    >
                                                        {allSelected && <Check className="w-3 h-3" />}
                                                        {someSelected && !allSelected && <div className="w-2 h-2 bg-primary rounded" />}
                                                    </button>
                                                    <span className="font-semibold text-foreground capitalize">{module}</span>
                                                </div>
                                                <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">
                                                    {modulePerms.filter(p => selectedPermissions.includes(p.id)).length} / {modulePerms.length}
                                                </span>
                                            </div>
                                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {modulePerms.map((perm) => {
                                                    const isSelected = selectedPermissions.includes(perm.id);
                                                    return (
                                                        <button
                                                            key={perm.id}
                                                            type="button"
                                                            onClick={() => togglePermission(perm.id)}
                                                            className={cn(
                                                                "p-3 border rounded-lg text-left transition-all",
                                                                isSelected
                                                                    ? "border-primary bg-primary/5"
                                                                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                                                            )}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={cn(
                                                                    "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5",
                                                                    isSelected
                                                                        ? "bg-primary border-primary text-white"
                                                                        : "border-border"
                                                                )}>
                                                                    {isSelected && <Check className="w-3 h-3" />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-sm text-foreground">{perm.name}</p>
                                                                    <p className="text-xs text-muted-foreground mt-1">{perm.description}</p>
                                                                </div>
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

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-3 flex-shrink-0">
                            <Button type="button" variant="outline" onClick={handleClose}>
                                ยกเลิก
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !formData.code || !formData.name || !formData.nameTh}
                                className="gap-2"
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
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
