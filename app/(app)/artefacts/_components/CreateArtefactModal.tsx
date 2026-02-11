'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, FileText, Eye, Star, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import type { ArtefactType } from '@/types/artefact';
import { bestPracticeExamples } from '@/data/bestPractices';

// Import extracted configs and templates
import { typeIcons, typeColors, togafLabels, togafTypeFields, typeOrder } from '@/data/artefact-config';
import { templates } from '@/data/artefact-templates';

/**
 * Map frontend status to Prisma LifecycleStatus.
 * "draft", "active", "planned" are all ACTIVE in Prisma terms.
 * Only explicitly deprecated/archived → RETIRED.
 */
const STATUS_MAP: Record<string, string> = {
    draft: 'ACTIVE',
    active: 'ACTIVE',
    planned: 'ACTIVE',
    deprecated: 'INACTIVE',
    archived: 'RETIRED',
};

/** Localized name helper */
const getLoc = (val: any, lang: 'th' | 'en' = 'en'): string => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[lang] || val['en'] || val['th'] || '';
};

/** Type returned from /api/v1/architecture-layers */
interface ApiLayer {
    id: number;
    layerName: { en: string; th: string } | string;
    artifactCategories: ApiCategory[];
}

/** Type returned from /api/v1/categories */
interface ApiCategory {
    id: number;
    categoryName: { en: string; th: string } | string;
    architectureLayerId?: number;
}

interface CreateArtefactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

// Lightweight types for the dropdown options
interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
interface ApiDepartment {
  id: number;
  shortName: string;
  fullName: string;
}

export function CreateArtefactModal({ isOpen, onClose, onSubmit }: CreateArtefactModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<ArtefactType>('business');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [departments, setDepartments] = useState<ApiDepartment[]>([]);
  const [layers, setLayers] = useState<ApiLayer[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    nameTh: '',
    type: 'business' as ArtefactType,
    description: '',
    ownerId: '',       // store user ID as string for Select
    departmentId: '',  // store department ID as string for Select
    version: '1.0',
    status: 'draft',
    typeSpecificFields: {} as Record<string, string>,
  });

  const { toast } = useToast();

  // Fetch users, departments, and architecture layers from API when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const fetchOptions = async () => {
      try {
        const [usersRes, deptsRes, layersRes] = await Promise.all([
          fetch('/api/v1/users'),
          fetch('/api/v1/departments'),
          fetch('/api/v1/architecture-layers'),
        ]);
        const [usersJson, deptsJson, layersJson] = await Promise.all([
          usersRes.json(), deptsRes.json(), layersRes.json(),
        ]);
        if (usersJson.success && Array.isArray(usersJson.data)) setUsers(usersJson.data);
        if (deptsJson.success && Array.isArray(deptsJson.data)) setDepartments(deptsJson.data);
        if (layersJson.success && Array.isArray(layersJson.data)) setLayers(layersJson.data);
      } catch {
        // Silently fail – dropdowns will just be empty
      }
    };
    fetchOptions();
  }, [isOpen]);

  /**
   * Resolve layerId and categoryId from the selected TOGAF type.
   * Matches the English layer name to the ArtefactType key.
   */
  const resolveLayerAndCategory = (type: ArtefactType): { layerId?: number; categoryId?: number } => {
    const typeToLayerKeyword: Record<ArtefactType, string> = {
      business: 'business', application: 'application', data: 'data',
      technology: 'technology', security: 'security', integration: 'integration',
    };
    const keyword = typeToLayerKeyword[type];
    const layer = layers.find(l => getLoc(l.layerName, 'en').toLowerCase().includes(keyword));
    if (!layer) return {};
    // Pick the first category under this layer
    const category = layer.artifactCategories?.[0];
    return { layerId: layer.id, categoryId: category?.id };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { layerId, categoryId } = resolveLayerAndCategory(selectedType);
      if (!categoryId) {
        throw new Error(`ไม่พบ category สำหรับ ${selectedType} – กรุณาตรวจสอบ seed data`);
      }

      const apiPayload = {
        artefactName: {
          en: formData.name,
          th: formData.nameTh,
        },
        description: formData.description
          ? { en: formData.description, th: formData.description }
          : undefined,
        categoryId,
        architectureLayerId: layerId,
        lifecycleStatus: STATUS_MAP[formData.status] || 'ACTIVE',
        responsibleById: formData.ownerId ? Number(formData.ownerId) : undefined,
        ownerDepartmentId: formData.departmentId ? Number(formData.departmentId) : undefined,
      };

      const response = await fetch('/api/v1/artefacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create artefact');
      }

      toast({
        title: "สร้าง Artefact สำเร็จ",
        description: `${formData.name} ถูกสร้างเรียบร้อยแล้ว`,
      });

      resetForm();
      onSubmit(result.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "สร้าง Artefact ไม่สำเร็จ",
        description: error instanceof Error ? error.message : "เกิดข้อผิดพลาด กรุณาลองใหม่",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedType('business');
    setSelectedTemplateIndex(null);
    setShowExamples(false);
    setFormData({
      name: '', nameTh: '', type: 'business', description: '', ownerId: '', departmentId: '', version: '1.0', status: 'draft',
      typeSpecificFields: {},
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectType = (type: ArtefactType) => {
    setSelectedType(type);
    setSelectedTemplateIndex(null);
    setFormData(prev => ({ ...prev, type, name: '', nameTh: '', description: '', ownerId: '', departmentId: '', typeSpecificFields: {} }));
  };

  const handleTypeSpecificChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      typeSpecificFields: {
        ...prev.typeSpecificFields,
        [key]: value,
      },
    }));
  };

  const selectTemplate = (index: number) => {
    setSelectedTemplateIndex(index);
    const template = templates[selectedType][index];
    setFormData(prev => ({
      ...prev,
      name: template.fields.name,
      nameTh: template.fields.nameTh,
      description: template.fields.description,
      typeSpecificFields: template.typeSpecificFields || {}
    }));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const currentTemplates = templates[selectedType];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-background rounded-xl border shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div>
              <h2 className="text-lg font-bold">เพิ่ม Artefact ใหม่</h2>
              <p className="text-xs text-muted-foreground">เลือกประเภทและเทมเพลตแล้วกรอกข้อมูล</p>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Column: Type & Template Selection */}
            <div className="w-56 border-r bg-muted/30 flex flex-col overflow-hidden">
              {/* Type Selection */}
              <div className="p-3 border-b">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">ประเภท</h3>
                <div className="space-y-1">
                  {typeOrder.map((type) => {
                    const Icon = typeIcons[type];
                    const isSelected = selectedType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => selectType(type)}
                        className={cn(
                          "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-all",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-md",
                          isSelected ? "bg-primary-foreground/20" : "bg-background"
                        )}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span>{togafLabels[type].short}</span>
                        {isSelected && <Check className="w-3 h-3 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Template Selection */}
              <div className="flex-1 overflow-y-auto p-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">เทมเพลต</h3>
                <div className="space-y-1">
                  {currentTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => selectTemplate(index)}
                      className={cn(
                        "w-full flex items-start gap-2 px-2.5 py-2 rounded-lg text-left transition-all group",
                        selectedTemplateIndex === index
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <FileText className={cn(
                        "w-3.5 h-3.5 flex-shrink-0 mt-0.5",
                        selectedTemplateIndex === index ? "text-accent-foreground" : "text-muted-foreground"
                      )} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{template.name}</p>
                        {template.typeSpecificFields && Object.keys(template.typeSpecificFields).length > 0 && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                              <Layers className="w-2.5 h-2.5 mr-0.5" />
                              Fields
                            </Badge>
                          </div>
                        )}
                      </div>
                      {selectedTemplateIndex === index && <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedTemplateIndex(null);
                      setFormData(prev => ({
                        ...prev,
                        name: '',
                        nameTh: '',
                        description: '',
                        typeSpecificFields: {}
                      }));
                    }}
                    className={cn(
                      "w-full px-2.5 py-2 rounded-lg text-xs text-left border border-dashed transition-all",
                      selectedTemplateIndex === null
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-muted-foreground text-muted-foreground"
                    )}
                  >
                    สร้างจากศูนย์
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {/* Type indicator */}
                  <div className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg border">
                    <div className={cn("w-2 h-2 rounded-full", typeColors[selectedType])} />
                    <span className="text-xs font-medium">{togafLabels[selectedType].full}</span>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs">ชื่อ (English)</Label>
                      <Input
                        id="name"
                        placeholder="e.g. HR System"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="h-9 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="nameTh" className="text-xs">ชื่อ (ไทย)</Label>
                      <Input
                        id="nameTh"
                        placeholder="e.g. ระบบทรัพยากรบุคคล"
                        value={formData.nameTh}
                        onChange={(e) => handleChange('nameTh', e.target.value)}
                        className="h-9 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-xs">รายละเอียด</Label>
                    <Textarea
                      id="description"
                      placeholder="คำอธิบายเกี่ยวกับ Artefact นี้..."
                      className="h-20 resize-none text-sm"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="owner" className="text-xs">ผู้รับผิดชอบ</Label>
                      <Select
                        value={formData.ownerId}
                        onValueChange={(val) => handleChange('ownerId', val)}
                      >
                        <SelectTrigger className="h-9 text-sm" id="owner">
                          <SelectValue placeholder="เลือกผู้รับผิดชอบ" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {users.map(user => (
                            <SelectItem key={user.id} value={String(user.id)}>
                              {user.firstName} {user.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="department" className="text-xs">หน่วยงาน</Label>
                      <Select
                        value={formData.departmentId}
                        onValueChange={(val) => handleChange('departmentId', val)}
                      >
                        <SelectTrigger className="h-9 text-sm" id="department">
                          <SelectValue placeholder="เลือกหน่วยงาน" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {departments.map(dept => (
                            <SelectItem key={dept.id} value={String(dept.id)}>
                              {dept.fullName || dept.shortName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Type-Specific TOGAF Fields Section */}
                  {togafTypeFields[selectedType]?.length > 0 && (
                    <div className="pt-3 mt-2 border-t">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={cn("w-2 h-2 rounded-full", typeColors[selectedType])} />
                        <span className="text-xs font-semibold text-muted-foreground uppercase">
                          {togafLabels[selectedType].short} Fields
                        </span>
                        <Badge variant="outline" className="text-[9px] px-1.5">TOGAF</Badge>
                        {selectedTemplateIndex !== null &&
                          templates[selectedType][selectedTemplateIndex]?.typeSpecificFields &&
                          Object.keys(templates[selectedType][selectedTemplateIndex].typeSpecificFields || {}).length > 0 && (
                            <Badge variant="secondary" className="text-[9px] px-1.5 bg-green-500/10 text-green-600 border-green-500/20">
                              <Check className="w-2.5 h-2.5 mr-0.5" />
                              จาก Template
                            </Badge>
                          )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {togafTypeFields[selectedType].map((field) => (
                          <div key={field.key} className={cn("space-y-1.5", field.type === 'textarea' && "col-span-2")}>
                            <Label htmlFor={field.key} className="text-xs">
                              {field.labelTh} <span className="text-muted-foreground text-[10px]">({field.label})</span>
                            </Label>
                            {field.type === 'select' ? (
                              <Select
                                value={formData.typeSpecificFields[field.key] || ''}
                                onValueChange={(val) => handleTypeSpecificChange(field.key, val)}
                              >
                                <SelectTrigger className="h-9 text-sm" id={field.key}>
                                  <SelectValue placeholder={`เลือก${field.labelTh}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {field.options?.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : field.type === 'textarea' ? (
                              <Textarea
                                id={field.key}
                                placeholder={field.placeholder}
                                className="h-16 resize-none text-sm"
                                value={formData.typeSpecificFields[field.key] || ''}
                                onChange={(e) => handleTypeSpecificChange(field.key, e.target.value)}
                              />
                            ) : (
                              <Input
                                id={field.key}
                                placeholder={field.placeholder}
                                value={formData.typeSpecificFields[field.key] || ''}
                                onChange={(e) => handleTypeSpecificChange(field.key, e.target.value)}
                                className="h-9 text-sm"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="version" className="text-xs">Version</Label>
                      <Input
                        id="version"
                        placeholder="1.0"
                        value={formData.version}
                        onChange={(e) => handleChange('version', e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">สถานะ</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(val) => handleChange('status', val)}
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft - ร่าง</SelectItem>
                          <SelectItem value="active">Active - ใช้งาน</SelectItem>
                          <SelectItem value="planned">Planned - วางแผน</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Best Practice Examples - Expandable */}
                  <div className="pt-3 mt-3 border-t">
                    <button
                      type="button"
                      onClick={() => setShowExamples(!showExamples)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-sm font-medium hover:from-amber-500/20 hover:to-orange-500/20 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span>ดูตัวอย่าง {togafLabels[selectedType].short} ที่ดี</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={cn("text-[9px]", typeColors[selectedType], "text-white")}>
                          {togafLabels[selectedType].short}
                        </Badge>
                        <Eye className={cn("w-4 h-4 transition-transform", showExamples && "rotate-180")} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {showExamples && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 space-y-2 overflow-hidden"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={cn("w-2 h-2 rounded-full", typeColors[selectedType])} />
                            <span className="text-xs font-medium">{togafLabels[selectedType].full}</span>
                          </div>
                          {bestPracticeExamples[selectedType]?.slice(0, 2).map((example) => (
                            <div
                              key={example.id}
                              className="p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="text-xs font-semibold">{example.nameTh}</h4>
                                  <p className="text-[10px] text-muted-foreground">{example.name}</p>
                                </div>
                                <Badge variant="secondary" className="text-[9px]">
                                  v{example.version}
                                </Badge>
                              </div>
                              <p className="text-[10px] text-muted-foreground line-clamp-2 mb-2">
                                {example.description}
                              </p>
                              <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                                <span className="font-medium">Owner:</span> {example.owner}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {example.highlights.slice(0, 2).map((h, i) => (
                                  <Badge key={i} variant="outline" className="text-[9px] px-1.5 py-0">
                                    ✓ {h}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                          <p className="text-[10px] text-muted-foreground text-center py-1">
                            💡 ศึกษาตัวอย่างเหล่านี้เพื่อสร้าง {togafLabels[selectedType].short} Artefact ที่มีคุณภาพ
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-4 border-t bg-muted/30">
                  <Button type="button" variant="outline" className="flex-1 h-9" onClick={handleClose}>
                    ยกเลิก
                  </Button>
                  <Button type="submit" className="flex-1 h-9" disabled={loading || !formData.name}>
                    {loading ? 'กำลังสร้าง...' : 'สร้าง Artefact'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}