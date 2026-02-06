'use client';

import { useState, useEffect } from 'react';
import { User, Save, Loader2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import type { User as UserType } from '@/types';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserType | null;
    onSubmit: (data: Partial<UserType>) => void;
}

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

export function EditUserModal({ isOpen, onClose, user, onSubmit }: EditUserModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        role: 'viewer',
        status: 'active',
    });

    // Update form when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.name.first || '',
                lastName: user.name.last || '',
                email: user.email || '',
                department: typeof user.department === 'string' ? user.department : user.department?.name || '',
                role: typeof user.role === 'string' ? user.role : 'viewer',
                status: user.status || 'active',
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        onSubmit({
            _id: user?._id,
            name: {
                first: formData.firstName,
                last: formData.lastName,
            },
            email: formData.email,
            department: formData.department,
            role: formData.role,
            status: formData.status as UserType['status'],
        });

        setIsSubmitting(false);
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    if (!user) return null;

    const displayName = user.displayName || `${user.name.first} ${user.name.last || ''}`.trim();

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg">
                {/* Header */}
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-xl font-bold">แก้ไขผู้ใช้งาน</DialogTitle>
                            <DialogDescription className="mt-1">
                                แก้ไขข้อมูล: {displayName}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Name */}
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

                    {/* Email */}
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

                    {/* Department */}
                    <div className="space-y-2">
                        <Label htmlFor="department">หน่วยงาน</Label>
                        <Input
                            id="department"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <Label htmlFor="role">บทบาท</Label>
                        <select
                            id="role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full h-10 px-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {roleOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
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
                                    <span className={cn("text-sm font-medium", option.color)}>
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            ยกเลิก
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !formData.firstName || !formData.email}
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
            </DialogContent>
        </Dialog>
    );
}
