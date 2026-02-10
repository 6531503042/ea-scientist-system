'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Plus,
    Search,
    Edit2,
    Trash2,
    Users,
    CheckCircle2,
    XCircle,
    Save,
    Loader2,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Department } from '@/types/department';
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

interface DepartmentsTableProps {
    departments: Department[];
    searchQuery?: string;
    onCreate?: (data: Partial<Department>) => void;
    onUpdate?: (id: string, data: Partial<Department>) => void;
    onDelete?: (id: string) => void;
}

const ITEMS_PER_PAGE = 10;

export function DepartmentsTable({
    departments,
    searchQuery: externalSearchQuery,
    onCreate,
    onUpdate,
    onDelete,
}: DepartmentsTableProps) {
    const [internalSearchQuery, setInternalSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        status: 'active' as 'active' | 'inactive',
    });

    const searchQuery = externalSearchQuery ?? internalSearchQuery;

    // Filter departments
    const filteredDepartments = useMemo(() => {
        return departments.filter(dept =>
            dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (dept.code?.toLowerCase() || '').includes(searchQuery.toLowerCase())
        );
    }, [departments, searchQuery]);

    // Pagination
    const totalPages = Math.ceil(filteredDepartments.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedDepartments = filteredDepartments.slice(startIndex, endIndex);

    // Generate page numbers
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    const handleCreate = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        onCreate?.(formData);
        setIsSubmitting(false);
        setIsCreateModalOpen(false);
        resetForm();
    };

    const handleUpdate = async () => {
        if (!editingDepartment) return;
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        onUpdate?.(editingDepartment._id, formData);
        setIsSubmitting(false);
        setIsEditModalOpen(false);
        setEditingDepartment(null);
        resetForm();
    };

    const handleEdit = (dept: Department) => {
        setEditingDepartment(dept);
        setFormData({
            name: dept.name,
            code: dept.code || '',
            description: dept.description || '',
            status: dept.status || 'active',
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหน่วยงานนี้?')) {
            onDelete?.(id);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', code: '', description: '', status: 'active' });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm text-muted-foreground">จัดการหน่วยงานและโครงสร้างองค์กร</p>
                <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4" />
                    เพิ่มหน่วยงาน
                </Button>
            </div>

            {/* Search */}
            {externalSearchQuery === undefined && (
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="ค้นหาหน่วยงาน..."
                        value={internalSearchQuery}
                        onChange={(e) => {
                            setInternalSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-11"
                    />
                    {internalSearchQuery && (
                        <button
                            onClick={() => setInternalSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                        <colgroup>
                            <col className="w-[300px]" />
                            <col className="w-[120px]" />
                            <col className="w-[100px]" />
                            <col className="w-[120px]" />
                            <col className="w-[120px]" />
                        </colgroup>
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ชื่อหน่วยงาน</th>
                                <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">รหัส</th>
                                <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">จำนวนผู้ใช้</th>
                                <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">สถานะ</th>
                                <th className="text-right px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">การดำเนินการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedDepartments.map((dept, index) => (
                                <motion.tr
                                    key={dept._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{dept.name}</p>
                                                {dept.description && (
                                                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">{dept.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="px-2.5 py-1 text-xs font-mono bg-muted rounded-lg border border-border">
                                            {dept.code || '-'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">{dept.userCount || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        {dept.status === 'active' || !dept.status ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-600 rounded-lg border border-emerald-500/20">
                                                <CheckCircle2 className="w-3 h-3" />
                                                ใช้งาน
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-gray-500/10 text-gray-600 rounded-lg border border-gray-500/20">
                                                <XCircle className="w-3 h-3" />
                                                ไม่ใช้งาน
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                                                title="แก้ไข"
                                                onClick={() => handleEdit(dept)}
                                            >
                                                <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                            </button>
                                            <button
                                                className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
                                                title="ลบ"
                                                onClick={() => handleDelete(dept._id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="px-5 py-3 border-t border-border bg-muted/20">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-sm text-muted-foreground">
                                แสดง <span className="font-semibold text-foreground">
                                    {filteredDepartments.length > 0 ? startIndex + 1 : 0}
                                </span> - <span className="font-semibold text-foreground">
                                    {Math.min(endIndex, filteredDepartments.length)}
                                </span> จาก <span className="font-semibold text-foreground">{filteredDepartments.length}</span> รายการ
                            </p>

                            {totalPages > 1 && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={cn(
                                            "flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium transition-all",
                                            currentPage === 1
                                                ? "opacity-50 cursor-not-allowed bg-muted"
                                                : "bg-background hover:bg-muted border border-border"
                                        )}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {getPageNumbers().map((page, index) => (
                                            typeof page === 'string' ? (
                                                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">...</span>
                                            ) : (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={cn(
                                                        "h-9 w-9 rounded-lg text-sm font-medium transition-all",
                                                        currentPage === page
                                                            ? "bg-primary text-primary-foreground shadow-md"
                                                            : "bg-background hover:bg-muted border border-border"
                                                    )}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={cn(
                                            "flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium transition-all",
                                            currentPage === totalPages
                                                ? "opacity-50 cursor-not-allowed bg-muted"
                                                : "bg-background hover:bg-muted border border-border"
                                        )}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold">เพิ่มหน่วยงาน</DialogTitle>
                                <DialogDescription className="mt-1">เพิ่มหน่วยงานใหม่ในระบบ</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">ชื่อหน่วยงาน *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="เช่น กองบริการห้องปฏิบัติการ"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code">รหัสหน่วยงาน *</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                placeholder="เช่น LAB"
                                className="font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">คำอธิบาย</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="อธิบายหน่วยงาน..."
                                rows={2}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>
                            ยกเลิก
                        </Button>
                        <Button onClick={handleCreate} disabled={isSubmitting || !formData.name || !formData.code} className="gap-2">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    กำลังบันทึก...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    เพิ่มหน่วยงาน
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold">แก้ไขหน่วยงาน</DialogTitle>
                                <DialogDescription className="mt-1">แก้ไขข้อมูล: {editingDepartment?.name}</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">ชื่อหน่วยงาน *</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-code">รหัสหน่วยงาน *</Label>
                            <Input
                                id="edit-code"
                                value={formData.code}
                                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                className="font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">คำอธิบาย</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={2}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setEditingDepartment(null); resetForm(); }}>
                            ยกเลิก
                        </Button>
                        <Button onClick={handleUpdate} disabled={isSubmitting || !formData.name} className="gap-2">
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
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
