'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Save, Loader2, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Role } from '@/types/role';

interface PermissionCatalog {
  permission_keys: string[];
  action_keys: string[];
  permissions: string[];
}

interface RolePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: (Role & { role_key?: string }) | null;
}

const ACTION_LABELS: Record<string, string> = {
  read: 'อ่าน',
  create: 'สร้าง',
  update: 'แก้ไข',
  delete: 'ลบ',
  submit: 'ส่ง',
  approve: 'อนุมัติ',
  reject: 'ปฏิเสธ',
  comment: 'แสดงความเห็น',
};

export function RolePermissionModal({ isOpen, onClose, role }: RolePermissionModalProps) {
  const [catalog, setCatalog] = useState<PermissionCatalog | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !role) return;

    async function load() {
      setLoadingCatalog(true);
      try {
        const [catalogResp, tokenResp] = await Promise.all([
          axiosInstance.get(API_ENDPOINTS.accessControl.permissionCatalog),
          axiosInstance.get(API_ENDPOINTS.accessControl.rolePermissionTokens(role!._id)),
        ]);
        setCatalog(catalogResp.data?.data ?? null);
        const currentPerms: string[] = tokenResp.data?.data?.permissions ?? [];
        setSelected(new Set(currentPerms));
      } catch {
        toast.error('โหลดข้อมูลสิทธิ์ไม่สำเร็จ');
      } finally {
        setLoadingCatalog(false);
      }
    }

    load();
  }, [isOpen, role]);

  // Build grouped structure: { permissionKey: availableActions[] }
  const grouped = useMemo(() => {
    if (!catalog) return {};
    const map: Record<string, string[]> = {};
    for (const token of catalog.permissions) {
      const idx = token.lastIndexOf('.');
      if (idx <= 0) continue;
      const key = token.slice(0, idx);
      const action = token.slice(idx + 1);
      if (!map[key]) map[key] = [];
      map[key].push(action);
    }
    return map;
  }, [catalog]);

  const toggle = (token: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(token) ? next.delete(token) : next.add(token);
      return next;
    });
  };

  const toggleGroup = (permKey: string) => {
    const actions = grouped[permKey] ?? [];
    const tokens = actions.map((a) => `${permKey}.${a}`);
    const allSelected = tokens.every((t) => selected.has(t));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        tokens.forEach((t) => next.delete(t));
      } else {
        tokens.forEach((t) => next.add(t));
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!role) return;
    setSaving(true);
    try {
      await axiosInstance.put(API_ENDPOINTS.accessControl.rolePermissionTokens(role._id), {
        mode: 'replace',
        permissions: Array.from(selected),
      });
      toast.success(`บันทึกสิทธิ์ของ "${role.name}" สำเร็จ`);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'บันทึกสิทธิ์ไม่สำเร็จ';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !role) return null;

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
          className="relative w-full max-w-2xl bg-background rounded-xl border shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-bold">กำหนดสิทธิ์การเข้าถึง</h2>
                <p className="text-xs text-muted-foreground">
                  บทบาท: <span className="font-semibold text-foreground">{role.name}</span>
                  {(role as any).role_key && (
                    <span className="ml-1 font-mono text-muted-foreground">({(role as any).role_key})</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                เลือกแล้ว {selected.size} สิทธิ์
              </span>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {loadingCatalog ? (
              <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="text-sm">กำลังโหลดสิทธิ์...</span>
              </div>
            ) : Object.keys(grouped).length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-12">
                ไม่พบ Permission Catalog กรุณาตรวจสอบ API
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(grouped).map(([permKey, actions]) => {
                  const tokens = actions.map((a) => `${permKey}.${a}`);
                  const selectedCount = tokens.filter((t) => selected.has(t)).length;
                  const allSelected = selectedCount === tokens.length;
                  const someSelected = selectedCount > 0 && !allSelected;

                  return (
                    <div key={permKey} className="border border-border rounded-lg overflow-hidden">
                      {/* Group header */}
                      <button
                        type="button"
                        onClick={() => toggleGroup(permKey)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              allSelected
                                ? 'bg-primary border-primary text-primary-foreground'
                                : someSelected
                                ? 'bg-primary/30 border-primary'
                                : 'border-border'
                            }`}
                          >
                            {allSelected && <Check className="w-2.5 h-2.5" />}
                            {someSelected && <div className="w-1.5 h-1.5 bg-primary rounded-sm" />}
                          </div>
                          <span className="text-sm font-semibold font-mono">{permKey}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {selectedCount}/{tokens.length}
                        </span>
                      </button>

                      {/* Actions */}
                      <div className="px-4 py-3 flex flex-wrap gap-2">
                        {actions.map((action) => {
                          const token = `${permKey}.${action}`;
                          const isSelected = selected.has(token);
                          return (
                            <button
                              key={action}
                              type="button"
                              onClick={() => toggle(token)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                isSelected
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                              {ACTION_LABELS[action] ?? action}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-border bg-muted/20 flex justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loadingCatalog}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" />กำลังบันทึก...</>
              ) : (
                <><Save className="w-4 h-4" />บันทึกสิทธิ์</>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
