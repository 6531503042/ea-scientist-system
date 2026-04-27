'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Save, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export interface CreateRoleFormData {
  name: string;
  role_key: string;
  description: string;
  level: number;
}

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoleFormData) => Promise<void>;
}

function toRoleKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
}

export function CreateRoleModal({ isOpen, onClose, onSubmit }: CreateRoleModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyManuallyEdited, setKeyManuallyEdited] = useState(false);
  const [formData, setFormData] = useState<CreateRoleFormData>({
    name: '',
    role_key: '',
    description: '',
    level: 100,
  });

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      role_key: keyManuallyEdited ? prev.role_key : toRoleKey(value),
    }));
  };

  const handleRoleKeyChange = (value: string) => {
    setKeyManuallyEdited(true);
    setFormData((prev) => ({ ...prev, role_key: value.toLowerCase().replace(/[^\w_]/g, '') }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role_key) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({ name: '', role_key: '', description: '', level: 100 });
    setKeyManuallyEdited(false);
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
          className="relative w-full max-w-lg bg-background rounded-xl border shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold">เพิ่มบทบาทใหม่</h2>
                <p className="text-xs text-muted-foreground">กำหนดชื่อ รหัส ระดับ และคำอธิบาย</p>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">ชื่อบทบาท *</Label>
                <Input
                  id="role-name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="เช่น Department Manager"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-key">
                  Role Key *
                  <span className="ml-1 text-[10px] text-muted-foreground">(snake_case)</span>
                </Label>
                <Input
                  id="role-key"
                  value={formData.role_key}
                  onChange={(e) => handleRoleKeyChange(e.target.value)}
                  placeholder="department_manager"
                  required
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-level">
                ระดับ (Level) *
                <span className="ml-1 text-[10px] text-muted-foreground">น้อย = สิทธิ์สูงกว่า</span>
              </Label>
              <Input
                id="role-level"
                type="number"
                min={1}
                max={999}
                value={formData.level}
                onChange={(e) => setFormData((prev) => ({ ...prev, level: Number(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-desc">คำอธิบาย</Label>
              <Textarea
                id="role-desc"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="อธิบายหน้าที่ของบทบาทนี้..."
                rows={3}
              />
            </div>

            <p className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
              หลังสร้างบทบาทแล้ว ให้กดปุ่ม <strong>กำหนดสิทธิ์</strong> ในตารางบทบาทเพื่อกำหนด permission
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.role_key}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />กำลังบันทึก...</>
                ) : (
                  <><Save className="w-4 h-4" />บันทึก</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
