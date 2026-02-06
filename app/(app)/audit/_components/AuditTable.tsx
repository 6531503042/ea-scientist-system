'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuditTopContent } from './AuditTopContent';
import { AuditBottomContent } from './AuditBottomContent';
import type { AuditLog } from '@/types/audit';
import { AUDIT_ACTION_CONFIG } from '@/config/ui-constants';

interface AuditTableProps {
    initialData: AuditLog[];
}

export function AuditTable({ initialData }: AuditTableProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'login' | 'export' | 'audit'>('login');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Filter Data
    const filteredData = initialData.filter(log => {
        const matchesSearch =
            log.target?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.ipAddress?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTab =
            (activeTab === 'login' && log.action === 'login') ||
            (activeTab === 'export' && (log.action === 'export' || log.action === 'import')) ||
            (activeTab === 'audit' && !['login', 'export', 'import'].includes(log.action));

        return matchesSearch && matchesTab;
    });

    // Pagination
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="space-y-4">
            <AuditTopContent
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeTab={activeTab}
                onTabChange={(tab) => { setActiveTab(tab); setCurrentPage(1); }}
                onFilterClick={() => console.log("Filter clicked")}
            />

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ชื่อ</th>
                                {activeTab === 'login' && (
                                    <>
                                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">E-mail</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">การกระทำ</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ที่อยู่ IP</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">เบราว์เซอร์/อุปกรณ์</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Session ID</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">วันที่และเวลา</th>
                                    </>
                                )}
                                {activeTab === 'export' && (
                                    <>
                                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">รายการ</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ประเภท</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">รายละเอียด</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">สถานะ</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">วันที่และเวลา</th>
                                    </>
                                )}
                                {activeTab === 'audit' && (
                                    <>
                                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">รายการที่เกี่ยวข้อง</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">การกระทำ</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">รายละเอียด</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">วันที่และเวลา</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ระบบ</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {paginatedData.map((log, index) => {
                                    const config = AUDIT_ACTION_CONFIG[log.action] || AUDIT_ACTION_CONFIG['view'];
                                    return (
                                        <motion.tr
                                            key={log.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground">{log.user}</span>
                                                    <span className="text-xs text-muted-foreground">{log.userRole}</span>
                                                </div>
                                            </td>

                                            {activeTab === 'login' && (
                                                <>
                                                    <td className="px-4 py-4 text-sm text-muted-foreground">user@example.com</td>
                                                    <td className="px-4 py-4">
                                                        <span className={cn(
                                                            "inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap",
                                                            log.userRole === 'Admin'
                                                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                                : "bg-blue-100 text-blue-700 border border-blue-200"
                                                        )}>
                                                            <config.icon className="w-3 h-3" /> {config.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-muted-foreground">{log.ipAddress}</td>
                                                    <td className="px-4 py-4 text-sm text-muted-foreground max-w-xs truncate">
                                                        {log.userAgent || 'Unknown'}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-muted-foreground font-mono text-xs">
                                                        {log.sessionId?.slice(0, 8)}...
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-muted-foreground">{log.timestamp}</td>
                                                </>
                                            )}

                                            {activeTab === 'export' && (
                                                <>
                                                    <td className="px-4 py-4 text-sm text-foreground">{log.target}</td>
                                                    <td className="px-4 py-4 text-sm text-muted-foreground capitalize">{log.targetType}</td>
                                                    <td className="px-4 py-4 text-sm text-muted-foreground">{log.details || '-'}</td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-sm text-success font-medium">สำเร็จ</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-muted-foreground">{log.timestamp}</td>
                                                </>
                                            )}

                                            {activeTab === 'audit' && (
                                                <>
                                                    <td className="px-4 py-4 text-sm text-foreground">{log.target} ({log.targetType})</td>
                                                    <td className="px-4 py-4">
                                                        <span className={cn("px-2 py-1 text-xs font-medium rounded-lg inline-flex items-center gap-1", config.color)}>
                                                            <config.icon className="w-3 h-3" />
                                                            {config.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-muted-foreground max-w-xs truncate">{log.details || '-'}</td>
                                                    <td className="px-4 py-4 text-sm text-muted-foreground">{log.timestamp}</td>
                                                    <td className="px-4 py-4 text-sm text-muted-foreground">System</td>
                                                </>
                                            )}
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredData.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <History className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-foreground">ไม่พบข้อมูล</p>
                        <p className="text-sm text-muted-foreground">ลองเปลี่ยนตัวกรองหรือคำค้นหา</p>
                    </div>
                )}
            </div>

            <AuditBottomContent
                totalItems={filteredData.length}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemLabel="log records"
            />
        </div>
    );
}
