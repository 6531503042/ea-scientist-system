'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, FolderTree, Loader2, FileText, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getLocalizedName } from '@/lib/utils';
import type { ArchitectureLayer } from '@/types/artefact-type';
import type { CreateArchitectureLayerInput, CreateArtefactCategoryInput } from '@/lib/validators/artefact-types-validator';
import { layerTemplates, categoryTemplates } from '@/data/artefact-type-templates';

type CreateMode = 'layer' | 'category';

interface CreateTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  layers: ArchitectureLayer[];
  onSubmitLayer: (data: CreateArchitectureLayerInput) => Promise<unknown>;
  onSubmitCategory: (data: CreateArtefactCategoryInput) => Promise<unknown>;
}

const INITIAL_FORM = {
  nameEn: '',
  nameTh: '',
  descriptionEn: '',
  descriptionTh: '',
  selectedLayerId: '' as number | '',
};

export function CreateTypeModal({
  isOpen,
  onClose,
  layers,
  onSubmitLayer,
  onSubmitCategory,
}: CreateTypeModalProps) {
  const [mode, setMode] = useState<CreateMode>('layer');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const findLayerByKey = useCallback(
    (key: string): number | null => {
      const lower = key.toLowerCase();
      const found = layers.find(l => {
        const name = getLocalizedName(l.layerName, 'en').toLowerCase();
        return name.includes(lower);
      });
      return found?.id ?? null;
    },
    [layers]
  );

  const selectLayerTemplate = (index: number | null) => {
    setSelectedTemplateIndex(index);
    if (index !== null) {
      const t = layerTemplates[index];
      setFormData({
        ...INITIAL_FORM,
        nameEn: t.fields.layerName.en,
        nameTh: t.fields.layerName.th,
        descriptionEn: t.fields.description?.en ?? '',
        descriptionTh: t.fields.description?.th ?? '',
      });
    } else {
      setFormData(INITIAL_FORM);
    }
  };

  const selectCategoryTemplate = (index: number | null) => {
    setSelectedTemplateIndex(index);
    if (index !== null) {
      const t = categoryTemplates[index];
      const layerId = findLayerByKey(t.suggestedLayerKey);
      setFormData({
        ...INITIAL_FORM,
        nameEn: t.fields.categoryName.en,
        nameTh: t.fields.categoryName.th,
        descriptionEn: t.fields.description?.en ?? '',
        descriptionTh: t.fields.description?.th ?? '',
        selectedLayerId: layerId ?? '',
      });
    } else {
      setFormData(INITIAL_FORM);
    }
  };

  const selectTemplate = (index: number | null) => {
    if (mode === 'layer') selectLayerTemplate(index);
    else selectCategoryTemplate(index);
  };

  const handleModeChange = (newMode: CreateMode) => {
    setMode(newMode);
    setSelectedTemplateIndex(null);
    setFormData({ ...INITIAL_FORM, selectedLayerId: '' });
  };

  const resetAndClose = () => {
    setMode('layer');
    setFormData(INITIAL_FORM);
    setSelectedTemplateIndex(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'layer') {
        const ok = await onSubmitLayer({
          layerName: { en: formData.nameEn, th: formData.nameTh },
          description:
            formData.descriptionEn || formData.descriptionTh
              ? { en: formData.descriptionEn, th: formData.descriptionTh }
              : undefined,
        });
        if (ok) resetAndClose();
      } else {
        if (!formData.selectedLayerId) {
          setIsSubmitting(false);
          return;
        }
        const ok = await onSubmitCategory({
          architectureLayerId: formData.selectedLayerId,
          categoryName: { en: formData.nameEn, th: formData.nameTh },
          description:
            formData.descriptionEn || formData.descriptionTh
              ? { en: formData.descriptionEn, th: formData.descriptionTh }
              : undefined,
        });
        if (ok) resetAndClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const templates = mode === 'layer' ? layerTemplates : categoryTemplates;
  const selectedTemplate = selectedTemplateIndex !== null ? templates[selectedTemplateIndex] : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={resetAndClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-background rounded-xl border shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold">เพิ่มประเภท Artefact</h2>
                <p className="text-xs text-muted-foreground">เลือกเทมเพลต TOGAF หรือสร้างจากศูนย์</p>
              </div>
            </div>
            <button
              onClick={resetAndClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="ปิด"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-0.5 px-5 py-2 border-b border-border bg-muted/30 shrink-0">
            <button
              type="button"
              onClick={() => handleModeChange('layer')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                mode === 'layer' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <FolderTree className="w-4 h-4" />
              Architecture Layer
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('category')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                mode === 'category' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Layers className="w-4 h-4" />
              Category
            </button>
          </div>

          <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
            {/* Left Sidebar: Template Selection */}
            <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-border bg-muted/30 flex flex-col shrink-0">
              <div className="flex-1 overflow-y-auto p-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                  เทมเพลต {mode === 'layer' ? 'Layer' : 'Category'}
                </h3>
                <div className="space-y-1">
                  {templates.map((template, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectTemplate(index)}
                      className={cn(
                        'w-full flex items-start gap-2 px-2.5 py-2 rounded-lg text-left transition-all border',
                        selectedTemplateIndex === index
                          ? 'bg-primary/10 text-primary border-primary/30'
                          : 'hover:bg-muted/80 text-foreground border-transparent'
                      )}
                    >
                      <FileText
                        className={cn(
                          'w-3.5 h-3.5 flex-shrink-0 mt-0.5',
                          selectedTemplateIndex === index ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{template.name}</p>
                        {template.description && (
                          <p className="text-[10px] text-muted-foreground truncate mt-0.5">{template.description}</p>
                        )}
                      </div>
                      {selectedTemplateIndex === index && <Check className="w-3.5 h-3.5 flex-shrink-0 text-primary" />}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => selectTemplate(null)}
                    className={cn(
                      'w-full px-2.5 py-2 rounded-lg text-xs text-left border border-dashed transition-all mt-1',
                      selectedTemplateIndex === null
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-muted-foreground text-muted-foreground'
                    )}
                  >
                    สร้างจากศูนย์
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {selectedTemplate && (
                    <div className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg border border-border">
                      <Layers className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium">เทมเพลต: {selectedTemplate.name}</span>
                    </div>
                  )}

                  {mode === 'category' && (
                    <div className="space-y-2">
                      <Label htmlFor="layer-select">Layer ที่สังกัด *</Label>
                      <select
                        id="layer-select"
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
                      <Label htmlFor="name-th">ชื่อ (ไทย) *</Label>
                      <Input
                        id="name-th"
                        value={formData.nameTh}
                        onChange={e => setFormData(prev => ({ ...prev, nameTh: e.target.value }))}
                        placeholder="เช่น สถาปัตยกรรมธุรกิจ"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name-en">ชื่อ (English) *</Label>
                      <Input
                        id="name-en"
                        value={formData.nameEn}
                        onChange={e => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                        placeholder="เช่น Business Architecture"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="desc-th">คำอธิบาย (ไทย)</Label>
                      <Input
                        id="desc-th"
                        value={formData.descriptionTh}
                        onChange={e => setFormData(prev => ({ ...prev, descriptionTh: e.target.value }))}
                        placeholder="คำอธิบายเพิ่มเติม"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desc-en">คำอธิบาย (English)</Label>
                      <Input
                        id="desc-en"
                        value={formData.descriptionEn}
                        onChange={e => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                        placeholder="Description"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-border bg-muted/20 flex justify-end gap-3 shrink-0">
                  <Button type="button" variant="outline" onClick={resetAndClose}>
                    ยกเลิก
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        กำลังบันทึก...
                      </>
                    ) : (
                      <>
                        <Layers className="w-4 h-4 mr-2" />
                        เพิ่มประเภท
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
