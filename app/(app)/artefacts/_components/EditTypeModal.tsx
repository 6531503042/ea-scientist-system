'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getLocalizedName } from '@/lib/utils';
import type { ArchitectureLayer, ArtefactCategory } from '@/types/artefact-type';
import type { UpdateArchitectureLayerInput, UpdateArtefactCategoryInput } from '@/lib/validators/artefact-types-validator';

export type EditTypeTarget =
  | { type: 'layer'; item: ArchitectureLayer }
  | { type: 'category'; item: ArtefactCategory };

interface EditTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: EditTypeTarget | null;
  layers: ArchitectureLayer[];
  onUpdateLayer: (id: number, data: UpdateArchitectureLayerInput) => Promise<unknown>;
  onUpdateCategory: (id: number, data: UpdateArtefactCategoryInput) => Promise<unknown>;
}

export function EditTypeModal({
  isOpen,
  onClose,
  target,
  layers,
  onUpdateLayer,
  onUpdateCategory,
}: EditTypeModalProps) {
  const [formData, setFormData] = useState({
    nameEn: '',
    nameTh: '',
    descriptionEn: '',
    descriptionTh: '',
    selectedLayerId: '' as number | '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!target) return;
    if (target.type === 'layer') {
      const l = target.item.layerName;
      const d = target.item.description;
      setFormData({
        nameEn: getLocalizedName(l, 'en'),
        nameTh: getLocalizedName(l, 'th'),
        descriptionEn: getLocalizedName(d, 'en'),
        descriptionTh: getLocalizedName(d, 'th'),
        selectedLayerId: '',
      });
    } else {
      const c = target.item;
      const d = c.description;
      setFormData({
        nameEn: getLocalizedName(c.categoryName, 'en'),
        nameTh: getLocalizedName(c.categoryName, 'th'),
        descriptionEn: getLocalizedName(d, 'en'),
        descriptionTh: getLocalizedName(d, 'th'),
        selectedLayerId: c.architectureLayerId,
      });
    }
  }, [target]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    setIsSubmitting(true);

    try {
      if (target.type === 'layer') {
        const ok = await onUpdateLayer(target.item.id, {
          layerName: { en: formData.nameEn, th: formData.nameTh },
          description:
            formData.descriptionEn || formData.descriptionTh
              ? { en: formData.descriptionEn, th: formData.descriptionTh }
              : undefined,
        });
        if (ok) onClose();
      } else {
        const ok = await onUpdateCategory(target.item.id, {
          architectureLayerId: formData.selectedLayerId ? Number(formData.selectedLayerId) : undefined,
          categoryName: { en: formData.nameEn, th: formData.nameTh },
          description:
            formData.descriptionEn || formData.descriptionTh
              ? { en: formData.descriptionEn, th: formData.descriptionTh }
              : undefined,
        });
        if (ok) onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !target) return null;

  const title = target.type === 'layer' ? 'แก้ไข Architecture Layer' : 'แก้ไข Category';
  const subtitle =
    target.type === 'layer'
      ? getLocalizedName(target.item.layerName, 'th')
      : getLocalizedName(target.item.categoryName, 'th');

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
          className="relative w-full max-w-2xl bg-background rounded-xl border shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="ปิด">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {target.type === 'category' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-layer-select">Layer ที่สังกัด *</Label>
                  <select
                    id="edit-layer-select"
                    value={formData.selectedLayerId}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        selectedLayerId: e.target.value ? Number(e.target.value) : ('' as const),
                      }))
                    }
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  >
                    <option value="">-- เลือก Layer --</option>
                    {layers.map(l => (
                      <option key={l.id} value={l.id}>
                        {getLocalizedName(l.layerName, 'th')} / {getLocalizedName(l.layerName, 'en')}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name-th">ชื่อ (ไทย) *</Label>
                  <Input
                    id="edit-name-th"
                    value={formData.nameTh}
                    onChange={e => setFormData(prev => ({ ...prev, nameTh: e.target.value }))}
                    placeholder="เช่น สถาปัตยกรรมธุรกิจ"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-name-en">ชื่อ (English) *</Label>
                  <Input
                    id="edit-name-en"
                    value={formData.nameEn}
                    onChange={e => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                    placeholder="เช่น Business Architecture"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-desc-th">คำอธิบาย (ไทย)</Label>
                  <Input
                    id="edit-desc-th"
                    value={formData.descriptionTh}
                    onChange={e => setFormData(prev => ({ ...prev, descriptionTh: e.target.value }))}
                    placeholder="คำอธิบายเพิ่มเติม"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-desc-en">คำอธิบาย (English)</Label>
                  <Input
                    id="edit-desc-en"
                    value={formData.descriptionEn}
                    onChange={e => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                    placeholder="Description"
                  />
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-border bg-muted/20 flex justify-end gap-3 shrink-0">
              <Button type="button" variant="outline" onClick={onClose}>
                ยกเลิก
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    กำลังบันทึก...
                  </>
                ) : (
                  'บันทึก'
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
