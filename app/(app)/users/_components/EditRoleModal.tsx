"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Save, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Role } from "@/types/role";

export interface EditRoleFormData {
  name: string;
  roleKey: string;
  description: string;
  level: number;
}

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role:
    | (Role & { roleKey?: string; level?: number; isActive?: boolean })
    | null;
  onSubmit: (data: EditRoleFormData) => Promise<void>;
}

export function EditRoleModal({
  isOpen,
  onClose,
  role,
  onSubmit,
}: EditRoleModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EditRoleFormData>({
    name: "",
    roleKey: "",
    description: "",
    level: 100,
  });

  useEffect(() => {
    if (role && isOpen) {
      setFormData({
        name: role.name ?? "",
        roleKey: (role as any).roleKey ?? "",
        description: role.description ?? "",
        level: (role as any).level ?? 100,
      });
    }
  }, [role, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.roleKey) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
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
          className="relative w-full max-w-lg bg-background rounded-xl border shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-amber-500/10 to-amber-500/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-base font-bold">แก้ไขบทบาท</h2>
                <p className="text-xs text-muted-foreground font-mono">
                  {(role as any).roleKey}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role-name">ชื่อบทบาท *</Label>
                <Input
                  id="edit-role-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role-key">
                  Role Key *
                  <span className="ml-1 text-[10px] text-muted-foreground">
                    (snake_case)
                  </span>
                </Label>
                <Input
                  id="edit-role-key"
                  value={formData.roleKey}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleKey: e.target.value
                        .toLowerCase()
                        .replace(/[^\w_]/g, ""),
                    }))
                  }
                  required
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role-level">
                ระดับ (Level) *
                <span className="ml-1 text-[10px] text-muted-foreground">
                  น้อย = สิทธิ์สูงกว่า
                </span>
              </Label>
              <Input
                id="edit-role-level"
                type="number"
                min={1}
                max={999}
                value={formData.level}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    level: Number(e.target.value),
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role-desc">คำอธิบาย</Label>
              <Textarea
                id="edit-role-desc"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.roleKey}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
