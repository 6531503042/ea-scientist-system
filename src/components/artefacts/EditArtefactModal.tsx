import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Layers, Database, Cpu, Link, Shield, Briefcase, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Artefact, ArtefactType } from '@/data/mockData';

interface EditArtefactModalProps {
  artefact: Artefact;
  onClose: () => void;
  onSubmit: (data: Artefact) => void;
}

const togafInfo: Record<ArtefactType, { title: string; description: string; examples: string[] }> = {
  business: {
    title: 'Business Architecture',
    description: 'สถาปัตยกรรมธุรกิจ กำหนดกลยุทธ์ โครงสร้างองค์กร กระบวนการทางธุรกิจหลัก และวิธีการทำงานขององค์กร',
    examples: ['กระบวนการทำงาน', 'บริการที่ให้', 'โครงสร้างองค์กร', 'เป้าหมายธุรกิจ']
  },
  application: {
    title: 'Application Architecture',
    description: 'สถาปัตยกรรมแอปพลิเคชัน แสดงระบบซอฟต์แวร์ที่ใช้งาน การเชื่อมต่อระหว่างระบบ และวิธีที่ระบบสนับสนุนกระบวนการธุรกิจ',
    examples: ['ระบบ ERP', 'ระบบ CRM', 'เว็บแอปพลิเคชัน', 'Mobile App']
  },
  data: {
    title: 'Data Architecture',
    description: 'สถาปัตยกรรมข้อมูล กำหนดโครงสร้างข้อมูลขององค์กร การจัดเก็บ การเข้าถึง และการบริหารจัดการข้อมูล',
    examples: ['ฐานข้อมูลลูกค้า', 'ข้อมูลผลิตภัณฑ์', 'รายงานวิเคราะห์', 'Data Warehouse']
  },
  technology: {
    title: 'Technology Architecture',
    description: 'สถาปัตยกรรมเทคโนโลยี แสดงโครงสร้างพื้นฐาน IT ทั้งฮาร์ดแวร์ ซอฟต์แวร์ระบบ และเครือข่ายที่ใช้งาน',
    examples: ['เซิร์ฟเวอร์', 'ระบบเครือข่าย', 'Cloud Platform', 'Storage']
  },
  security: {
    title: 'Security Architecture',
    description: 'สถาปัตยกรรมความปลอดภัย กำหนดนโยบาย มาตรการ และเทคโนโลยีที่ใช้ปกป้องระบบและข้อมูล',
    examples: ['ระบบ Authentication', 'Firewall', 'Encryption', 'Access Control']
  },
  integration: {
    title: 'Integration Architecture',
    description: 'สถาปัตยกรรมการเชื่อมต่อ แสดงวิธีการเชื่อมต่อระหว่างระบบภายในและภายนอกองค์กร',
    examples: ['API Gateway', 'ESB', 'Message Queue', 'Web Services']
  }
};

export function EditArtefactModal({ artefact, onClose, onSubmit }: EditArtefactModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Artefact>(artefact);

  useEffect(() => {
    setFormData(artefact);
  }, [artefact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSubmit(formData);
    setLoading(false);
  };

  const handleChange = (field: keyof Artefact, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const info = togafInfo[formData.type];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-background rounded-xl border shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-bold">แก้ไข Artefact</h2>
              <p className="text-sm text-muted-foreground">{artefact.name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <Tabs defaultValue="details" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="mx-6 mt-4">
              <TabsTrigger value="details">ข้อมูลทั่วไป</TabsTrigger>
              <TabsTrigger value="togaf">คำอธิบาย TOGAF</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="details" className="mt-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">ชื่อ (English)</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nameTh">ชื่อ (ไทย)</Label>
                        <Input
                          id="nameTh"
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
                        onValueChange={(val) => handleChange('type', val as ArtefactType)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="business">1. Business Architecture - สถาปัตยกรรมธุรกิจ</SelectItem>
                          <SelectItem value="application">2. Application Architecture - สถาปัตยกรรมแอปพลิเคชัน</SelectItem>
                          <SelectItem value="data">3. Data Architecture - สถาปัตยกรรมข้อมูล</SelectItem>
                          <SelectItem value="technology">4. Technology Architecture - สถาปัตยกรรมเทคโนโลยี</SelectItem>
                          <SelectItem value="security">5. Security Architecture - สถาปัตยกรรมความปลอดภัย</SelectItem>
                          <SelectItem value="integration">6. Integration Architecture - สถาปัตยกรรมการเชื่อมต่อ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">รายละเอียด</Label>
                      <Textarea
                        id="description"
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
                          value={formData.owner}
                          onChange={(e) => handleChange('owner', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">หน่วยงาน</Label>
                        <Input
                          id="department"
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
                            <SelectItem value="deprecated">Deprecated - เลิกใช้</SelectItem>
                            <SelectItem value="planned">Planned - วางแผน</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="togaf" className="mt-0">
                <div className="space-y-6">
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{info.description}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">ตัวอย่าง Artefact ประเภทนี้</h4>
                    <div className="flex flex-wrap gap-2">
                      {info.examples.map((example, i) => (
                        <span key={i} className="px-3 py-1.5 bg-muted rounded-lg text-sm">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-4">
                    <h4 className="font-medium mb-2">TOGAF Framework</h4>
                    <p className="text-sm text-muted-foreground">
                      TOGAF (The Open Group Architecture Framework) เป็นมาตรฐานสากลสำหรับการพัฒนาสถาปัตยกรรมองค์กร 
                      แบ่งออกเป็น 4 โดเมนหลัก: Business, Application, Data, Technology และเสริมด้วย Security และ Integration
                    </p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex gap-3 p-6 border-t bg-muted/30">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}