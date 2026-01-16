import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Layers, Database, Cpu, Link, Shield, Briefcase, Check, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ArtefactType } from '@/data/mockData';

interface CreateArtefactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const typeIcons: Record<ArtefactType, React.ElementType> = {
  business: Briefcase,
  data: Database,
  application: Layers,
  technology: Cpu,
  integration: Link,
  security: Shield,
};

const typeColors: Record<ArtefactType, string> = {
  business: 'bg-ea-business',
  application: 'bg-ea-application',
  data: 'bg-ea-data',
  technology: 'bg-ea-technology',
  security: 'bg-ea-security',
  integration: 'bg-ea-integration',
};

// Templates for each type
const templates: Record<ArtefactType, { name: string; description: string; fields: Record<string, string> }[]> = {
  business: [
    {
      name: 'กระบวนการทำงาน',
      description: 'เทมเพลตสำหรับกระบวนการทำงานหลัก',
      fields: { name: 'Business Process Name', nameTh: 'ชื่อกระบวนการ', description: 'กระบวนการทำงาน...' }
    },
    {
      name: 'บริการ',
      description: 'เทมเพลตสำหรับบริการที่ให้แก่ลูกค้า',
      fields: { name: 'Service Name', nameTh: 'ชื่อบริการ', description: 'บริการสำหรับ...' }
    }
  ],
  application: [
    {
      name: 'Web Application',
      description: 'เทมเพลตสำหรับระบบเว็บแอปพลิเคชัน',
      fields: { name: 'Web App Name', nameTh: 'ระบบเว็บ', description: 'ระบบเว็บแอปพลิเคชันสำหรับ...' }
    },
    {
      name: 'Mobile Application',
      description: 'เทมเพลตสำหรับแอปพลิเคชันมือถือ',
      fields: { name: 'Mobile App Name', nameTh: 'แอปมือถือ', description: 'แอปพลิเคชันมือถือสำหรับ...' }
    },
    {
      name: 'Backend/API',
      description: 'เทมเพลตสำหรับระบบ Backend หรือ API',
      fields: { name: 'API Service', nameTh: 'ระบบ API', description: 'API สำหรับ...' }
    }
  ],
  data: [
    {
      name: 'ฐานข้อมูล',
      description: 'เทมเพลตสำหรับฐานข้อมูล',
      fields: { name: 'Database Name', nameTh: 'ฐานข้อมูล', description: 'ฐานข้อมูลจัดเก็บ...' }
    },
    {
      name: 'ชุดข้อมูล',
      description: 'เทมเพลตสำหรับชุดข้อมูล',
      fields: { name: 'Dataset Name', nameTh: 'ชุดข้อมูล', description: 'ชุดข้อมูลประกอบด้วย...' }
    }
  ],
  technology: [
    {
      name: 'Server Infrastructure',
      description: 'เทมเพลตสำหรับเซิร์ฟเวอร์',
      fields: { name: 'Server Name', nameTh: 'เซิร์ฟเวอร์', description: 'เซิร์ฟเวอร์สำหรับ...' }
    },
    {
      name: 'Cloud Service',
      description: 'เทมเพลตสำหรับบริการ Cloud',
      fields: { name: 'Cloud Service', nameTh: 'บริการ Cloud', description: 'บริการ Cloud สำหรับ...' }
    }
  ],
  security: [
    {
      name: 'Authentication',
      description: 'เทมเพลตสำหรับระบบ Authentication',
      fields: { name: 'Auth System', nameTh: 'ระบบยืนยันตัวตน', description: 'ระบบยืนยันตัวตนสำหรับ...' }
    },
    {
      name: 'Access Control',
      description: 'เทมเพลตสำหรับระบบ Access Control',
      fields: { name: 'Access Control', nameTh: 'ระบบควบคุมการเข้าถึง', description: 'ระบบควบคุมสิทธิ์...' }
    }
  ],
  integration: [
    {
      name: 'API Gateway',
      description: 'เทมเพลตสำหรับ API Gateway',
      fields: { name: 'API Gateway', nameTh: 'API Gateway', description: 'API Gateway สำหรับ...' }
    },
    {
      name: 'External Integration',
      description: 'เทมเพลตสำหรับการเชื่อมต่อภายนอก',
      fields: { name: 'External API', nameTh: 'API ภายนอก', description: 'การเชื่อมต่อกับ...' }
    }
  ]
};

const togafLabels: Record<ArtefactType, { short: string; full: string }> = {
  business: { short: 'Business', full: 'Business Architecture' },
  application: { short: 'Application', full: 'Application Architecture' },
  data: { short: 'Data', full: 'Data Architecture' },
  technology: { short: 'Technology', full: 'Technology Architecture' },
  security: { short: 'Security', full: 'Security Architecture' },
  integration: { short: 'Integration', full: 'Integration Architecture' },
};

const typeOrder: ArtefactType[] = ['business', 'application', 'data', 'technology', 'security', 'integration'];

export function CreateArtefactModal({ isOpen, onClose, onSubmit }: CreateArtefactModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<ArtefactType>('business');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameTh: '',
    type: 'business' as ArtefactType,
    description: '',
    owner: '',
    department: '',
    version: '1.0',
    status: 'draft'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSubmit({ ...formData, type: selectedType });
    setLoading(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedType('business');
    setSelectedTemplateIndex(null);
    setFormData({
      name: '', nameTh: '', type: 'business', description: '', owner: '', department: '', version: '1.0', status: 'draft'
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectType = (type: ArtefactType) => {
    setSelectedType(type);
    setSelectedTemplateIndex(null);
    setFormData(prev => ({ ...prev, type, name: '', nameTh: '', description: '' }));
  };

  const selectTemplate = (index: number) => {
    setSelectedTemplateIndex(index);
    const template = templates[selectedType][index];
    setFormData(prev => ({
      ...prev,
      name: template.fields.name,
      nameTh: template.fields.nameTh,
      description: template.fields.description
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
                        "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all",
                        selectedTemplateIndex === index
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <FileText className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{template.name}</p>
                      </div>
                      {selectedTemplateIndex === index && <Check className="w-3 h-3 ml-auto flex-shrink-0" />}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedTemplateIndex(null);
                      setFormData(prev => ({ ...prev, name: '', nameTh: '', description: '' }));
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
                      <Input
                        id="owner"
                        placeholder="ชื่อผู้รับผิดชอบ"
                        value={formData.owner}
                        onChange={(e) => handleChange('owner', e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="department" className="text-xs">หน่วยงาน</Label>
                      <Input
                        id="department"
                        placeholder="สังกัดหน่วยงาน"
                        value={formData.department}
                        onChange={(e) => handleChange('department', e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>

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