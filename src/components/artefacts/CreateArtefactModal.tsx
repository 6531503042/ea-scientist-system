import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Layers, Database, Cpu, Link, Shield, Briefcase, ChevronRight, Info, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Templates for each type
const templates: Record<ArtefactType, { name: string; description: string; fields: Record<string, string> }[]> = {
  business: [
    { 
      name: 'กระบวนการทำงาน (Business Process)',
      description: 'เทมเพลตสำหรับกระบวนการทำงานหลัก',
      fields: { name: 'Business Process Name', nameTh: 'ชื่อกระบวนการ', description: 'กระบวนการทำงาน...' }
    },
    {
      name: 'บริการ (Service)',
      description: 'เทมเพลตสำหรับบริการที่ให้แก่ลูกค้า',
      fields: { name: 'Service Name', nameTh: 'ชื่อบริการ', description: 'บริการสำหรับ...' }
    }
  ],
  application: [
    {
      name: 'ระบบ Web Application',
      description: 'เทมเพลตสำหรับระบบเว็บแอปพลิเคชัน',
      fields: { name: 'Web App Name', nameTh: 'ระบบเว็บ', description: 'ระบบเว็บแอปพลิเคชันสำหรับ...' }
    },
    {
      name: 'ระบบ Mobile Application',
      description: 'เทมเพลตสำหรับแอปพลิเคชันมือถือ',
      fields: { name: 'Mobile App Name', nameTh: 'แอปมือถือ', description: 'แอปพลิเคชันมือถือสำหรับ...' }
    },
    {
      name: 'ระบบ Backend/API',
      description: 'เทมเพลตสำหรับระบบ Backend หรือ API',
      fields: { name: 'API Service', nameTh: 'ระบบ API', description: 'API สำหรับ...' }
    }
  ],
  data: [
    {
      name: 'ฐานข้อมูล (Database)',
      description: 'เทมเพลตสำหรับฐานข้อมูล',
      fields: { name: 'Database Name', nameTh: 'ฐานข้อมูล', description: 'ฐานข้อมูลจัดเก็บ...' }
    },
    {
      name: 'ชุดข้อมูล (Dataset)',
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
      name: 'ระบบยืนยันตัวตน (Authentication)',
      description: 'เทมเพลตสำหรับระบบ Authentication',
      fields: { name: 'Auth System', nameTh: 'ระบบยืนยันตัวตน', description: 'ระบบยืนยันตัวตนสำหรับ...' }
    },
    {
      name: 'ระบบควบคุมการเข้าถึง (Access Control)',
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

const togafLabels: Record<ArtefactType, string> = {
  business: '1. Business Architecture - สถาปัตยกรรมธุรกิจ',
  application: '2. Application Architecture - สถาปัตยกรรมแอปพลิเคชัน',
  data: '3. Data Architecture - สถาปัตยกรรมข้อมูล',
  technology: '4. Technology Architecture - สถาปัตยกรรมเทคโนโลยี',
  security: '5. Security Architecture - สถาปัตยกรรมความปลอดภัย',
  integration: '6. Integration Architecture - สถาปัตยกรรมการเชื่อมต่อ',
};

export function CreateArtefactModal({ isOpen, onClose, onSubmit }: CreateArtefactModalProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'type' | 'template' | 'form'>('type');
  const [formData, setFormData] = useState({
    name: '',
    nameTh: '',
    type: 'application' as ArtefactType,
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
    onSubmit(formData);
    setLoading(false);
    setStep('type');
    setFormData({
      name: '', nameTh: '', type: 'application', description: '', owner: '', department: '', version: '1.0', status: 'draft'
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectType = (type: ArtefactType) => {
    setFormData(prev => ({ ...prev, type }));
    setStep('template');
  };

  const selectTemplate = (template: typeof templates.business[0] | null) => {
    if (template) {
      setFormData(prev => ({
        ...prev,
        name: template.fields.name,
        nameTh: template.fields.nameTh,
        description: template.fields.description
      }));
    }
    setStep('form');
  };

  const handleClose = () => {
    setStep('type');
    onClose();
  };

  if (!isOpen) return null;

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
          className="relative w-full max-w-2xl bg-background rounded-xl border shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-bold">เพิ่ม Artefact ใหม่</h2>
              <p className="text-sm text-muted-foreground">
                {step === 'type' && 'เลือกประเภท Artefact ตามมาตรฐาน TOGAF'}
                {step === 'template' && 'เลือกเทมเพลตหรือสร้างใหม่'}
                {step === 'form' && 'กรอกข้อมูล Artefact'}
              </p>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {step === 'type' && (
              <div className="space-y-3">
                {(['business', 'application', 'data', 'technology', 'security', 'integration'] as const).map((type, index) => {
                  const Icon = typeIcons[type];
                  return (
                    <button
                      key={type}
                      onClick={() => selectType(type)}
                      className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:bg-muted hover:border-primary/50 transition-all group"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{togafLabels[type]}</p>
                        <p className="text-sm text-muted-foreground">
                          {templates[type].length} เทมเพลตพร้อมใช้
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  );
                })}
              </div>
            )}

            {step === 'template' && (
              <div className="space-y-4">
                <button
                  onClick={() => setStep('type')}
                  className="text-sm text-primary hover:underline mb-2"
                >
                  ← กลับเลือกประเภท
                </button>

                <div className="bg-info/10 border border-info/20 rounded-xl p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-info mt-0.5" />
                  <div>
                    <p className="font-medium text-info">เลือกเทมเพลต</p>
                    <p className="text-sm text-muted-foreground">
                      เทมเพลตช่วยให้การสร้าง Artefact เป็นมาตรฐานและง่ายขึ้น
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {templates[formData.type].map((template, index) => (
                    <button
                      key={index}
                      onClick={() => selectTemplate(template)}
                      className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:bg-muted transition-all group"
                    >
                      <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">{template.name}</p>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => selectTemplate(null)}
                  className="w-full p-4 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors text-center"
                >
                  <p className="font-medium">สร้างจากศูนย์</p>
                  <p className="text-sm text-muted-foreground">ไม่ใช้เทมเพลต</p>
                </button>
              </div>
            )}

            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <button
                  type="button"
                  onClick={() => setStep('template')}
                  className="text-sm text-primary hover:underline mb-2"
                >
                  ← กลับเลือกเทมเพลต
                </button>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">ชื่อ (English)</Label>
                      <Input
                        id="name"
                        placeholder="e.g. HR System"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nameTh">ชื่อ (ไทย)</Label>
                      <Input
                        id="nameTh"
                        placeholder="e.g. ระบบทรัพยากรบุคคล"
                        value={formData.nameTh}
                        onChange={(e) => handleChange('nameTh', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>ประเภท (TOGAF Layer)</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(val) => handleChange('type', val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(togafLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">รายละเอียด</Label>
                    <Textarea
                      id="description"
                      placeholder="คำอธิบายเกี่ยวกับ Artefact นี้..."
                      className="h-24 resize-none"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="owner">ผู้รับผิดชอบ (Owner)</Label>
                      <Input
                        id="owner"
                        placeholder="ชื่อผู้รับผิดชอบ"
                        value={formData.owner}
                        onChange={(e) => handleChange('owner', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">หน่วยงาน</Label>
                      <Input
                        id="department"
                        placeholder="สังกัดหน่วยงาน"
                        value={formData.department}
                        onChange={(e) => handleChange('department', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="version">Version</Label>
                      <Input
                        id="version"
                        placeholder="1.0"
                        value={formData.version}
                        onChange={(e) => handleChange('version', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>สถานะ</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(val) => handleChange('status', val)}
                      >
                        <SelectTrigger>
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
              </form>
            )}
          </div>

          {step === 'form' && (
            <div className="flex gap-3 p-6 border-t bg-muted/30">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                ยกเลิก
              </Button>
              <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
                {loading ? 'กำลังสร้าง...' : 'สร้าง Artefact'}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}