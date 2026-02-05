'use client';

import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
import type { Department } from '@/types';

interface DepartmentsTableProps {
    departments: Department[];
    searchQuery: string;
    onEditDepartment?: (dept: Department) => void;
    onDeleteDepartment?: (deptId: string) => void;
}

export function DepartmentsTable({
    departments,
    searchQuery,
    onEditDepartment,
    onDeleteDepartment,
}: DepartmentsTableProps) {
    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">รหัสหน่วยงาน</th>
                            <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ชื่อหน่วยงาน</th>
                            <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">หัวหน้าหน่วยงาน</th>
                            <th className="text-right px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">บุคลากร</th>
                            <th className="text-right px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDepartments.map((dept, index) => (
                            <motion.tr
                                key={dept._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                            >
                                <td className="px-5 py-4">
                                    <span className="px-2.5 py-1 text-xs font-medium bg-muted rounded-md text-muted-foreground">
                                        {dept.code}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="font-medium text-foreground">{dept.name}</span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="text-sm text-foreground">{dept.head || '-'}</span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <span className="text-sm text-muted-foreground">{dept.memberCount || 0} คน</span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => onEditDepartment?.(dept)}
                                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                                            title="แก้ไข"
                                        >
                                            <Edit className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                        <button
                                            onClick={() => onDeleteDepartment?.(dept._id)}
                                            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                            title="ลบ"
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
        </div>
    );
}
