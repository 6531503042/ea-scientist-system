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
import { mockUsers, mockDepartments } from '@/data/mockUserManagement';

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

// Enhanced Templates for each EA type with detailed defaults
const templates: Record<ArtefactType, { name: string; description: string; fields: Record<string, string> }[]> = {
  business: [
    {
      name: 'กระบวนการหลัก (Core Process)',
      description: 'กระบวนการทำงานหลักที่สร้างมูลค่าให้องค์กร',
      fields: {
        name: 'Core Business Process',
        nameTh: 'กระบวนการหลัก',
        description: 'กระบวนการทำงานหลักที่สนับสนุนพันธกิจขององค์กร ประกอบด้วยขั้นตอน...',
        owner: 'ผู้อำนวยการกอง',
        department: 'กองบริหารงาน'
      }
    },
    {
      name: 'กระบวนการสนับสนุน (Support Process)',
      description: 'กระบวนการที่ช่วยสนับสนุนกระบวนการหลัก',
      fields: {
        name: 'Support Process',
        nameTh: 'กระบวนการสนับสนุน',
        description: 'กระบวนการสนับสนุนการทำงานภายในองค์กร เช่น การจัดการเอกสาร การติดต่อประสานงาน...',
        owner: 'หัวหน้าฝ่าย',
        department: 'ฝ่ายสนับสนุน'
      }
    },
    {
      name: 'บริการภายนอก (External Service)',
      description: 'บริการที่ให้กับหน่วยงานหรือบุคคลภายนอก',
      fields: {
        name: 'External Service',
        nameTh: 'บริการภายนอก',
        description: 'บริการที่เปิดให้หน่วยงานภายนอกหรือประชาชนใช้งาน รวมถึง...',
        owner: 'ผู้จัดการบริการ',
        department: 'กองบริการประชาชน'
      }
    },
    {
      name: 'บริการภายใน (Internal Service)',
      description: 'บริการที่ให้กับหน่วยงานภายในองค์กร',
      fields: {
        name: 'Internal Service',
        nameTh: 'บริการภายใน',
        description: 'บริการสำหรับบุคลากรและหน่วยงานภายในองค์กร...',
        owner: 'หัวหน้าแผนก',
        department: 'แผนกสนับสนุน'
      }
    }
  ],
  application: [
    {
      name: 'Web Application',
      description: 'ระบบเว็บแอปพลิเคชันที่ใช้งานผ่านเบราว์เซอร์',
      fields: {
        name: 'Web Application Name',
        nameTh: 'ระบบเว็บแอปพลิเคชัน',
        description: 'ระบบเว็บแอปพลิเคชันสำหรับ... รองรับการใช้งานผ่าน Browser ทุกประเภท',
        owner: 'นักพัฒนาระบบ',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    },
    {
      name: 'Mobile Application',
      description: 'แอปพลิเคชันมือถือสำหรับ iOS และ Android',
      fields: {
        name: 'Mobile App',
        nameTh: 'แอปพลิเคชันมือถือ',
        description: 'แอปพลิเคชันมือถือสำหรับ... รองรับ iOS และ Android',
        owner: 'นักพัฒนาแอป',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    },
    {
      name: 'Desktop Application',
      description: 'โปรแกรมที่ติดตั้งบนเครื่องคอมพิวเตอร์',
      fields: {
        name: 'Desktop App',
        nameTh: 'โปรแกรม Desktop',
        description: 'โปรแกรมที่ติดตั้งบนเครื่องคอมพิวเตอร์สำหรับ... รองรับ Windows/macOS',
        owner: 'นักพัฒนาระบบ',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    },
    {
      name: 'Microservice',
      description: 'บริการย่อยที่ทำหน้าที่เฉพาะด้าน',
      fields: {
        name: 'Microservice Name',
        nameTh: 'ไมโครเซอร์วิส',
        description: 'Microservice สำหรับจัดการ... ทำงานแบบ Stateless และสื่อสารผ่าน REST API',
        owner: 'DevOps Engineer',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    },
    {
      name: 'Legacy System',
      description: 'ระบบเดิมที่ยังใช้งานอยู่',
      fields: {
        name: 'Legacy System',
        nameTh: 'ระบบเดิม',
        description: 'ระบบเดิมที่พัฒนาตั้งแต่ปี... ยังคงใช้งานสำหรับ... มีแผนปรับปรุง/ทดแทนภายใน...',
        owner: 'ผู้ดูแลระบบ',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    },
    {
      name: 'Backend API',
      description: 'ระบบ Backend ให้บริการ API',
      fields: {
        name: 'Backend API Service',
        nameTh: 'ระบบ API หลังบ้าน',
        description: 'Backend API สำหรับ... ให้บริการข้อมูลแก่ระบบ Frontend และ Mobile',
        owner: 'Backend Developer',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    }
  ],
  data: [
    {
      name: 'Master Data',
      description: 'ข้อมูลหลักที่ใช้อ้างอิงทั่วทั้งองค์กร',
      fields: {
        name: 'Master Data',
        nameTh: 'ข้อมูลหลัก (Master Data)',
        description: 'ข้อมูลหลักที่ใช้อ้างอิงทั่วทั้งองค์กร เช่น รหัสหน่วยงาน รายชื่อบุคลากร...',
        owner: 'เจ้าหน้าที่ข้อมูล',
        department: 'กองข้อมูลและสถิติ'
      }
    },
    {
      name: 'Transaction Data',
      description: 'ข้อมูลธุรกรรมที่เกิดขึ้นจากการทำงาน',
      fields: {
        name: 'Transaction Data',
        nameTh: 'ข้อมูลธุรกรรม',
        description: 'ข้อมูลธุรกรรมที่บันทึกจากกระบวนการ... มีการสร้างข้อมูลใหม่ประมาณ... รายการต่อวัน',
        owner: 'นักวิเคราะห์ข้อมูล',
        department: 'กองข้อมูลและสถิติ'
      }
    },
    {
      name: 'Reference Data',
      description: 'ข้อมูลอ้างอิงที่ใช้ร่วมกัน',
      fields: {
        name: 'Reference Data',
        nameTh: 'ข้อมูลอ้างอิง',
        description: 'ข้อมูลอ้างอิงสำหรับ... เช่น รหัสจังหวัด รหัสประเภท ค่า Lookup ต่างๆ',
        owner: 'ผู้ดูแลข้อมูล',
        department: 'กองข้อมูลและสถิติ'
      }
    },
    {
      name: 'API Data Schema',
      description: 'โครงสร้างข้อมูลที่ใช้แลกเปลี่ยนผ่าน API',
      fields: {
        name: 'API Schema',
        nameTh: 'โครงสร้างข้อมูล API',
        description: 'โครงสร้างข้อมูล (Schema) สำหรับการแลกเปลี่ยนข้อมูลผ่าน API รองรับ JSON/XML',
        owner: 'Solution Architect',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    },
    {
      name: 'Data Warehouse',
      description: 'คลังข้อมูลสำหรับวิเคราะห์และรายงาน',
      fields: {
        name: 'Data Warehouse',
        nameTh: 'คลังข้อมูล (Data Warehouse)',
        description: 'คลังข้อมูลรวมศูนย์สำหรับการวิเคราะห์และจัดทำรายงาน BI Dashboard',
        owner: 'Data Engineer',
        department: 'กองข้อมูลและสถิติ'
      }
    }
  ],
  technology: [
    {
      name: 'Physical Server',
      description: 'เซิร์ฟเวอร์ฮาร์ดแวร์ภายในองค์กร',
      fields: {
        name: 'Physical Server',
        nameTh: 'เซิร์ฟเวอร์กายภาพ',
        description: 'เซิร์ฟเวอร์ฮาร์ดแวร์ติดตั้งที่... สเปค CPU/RAM/Storage...',
        owner: 'System Administrator',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    },
    {
      name: 'Virtual Machine',
      description: 'เครื่องเสมือนที่ทำงานบน Hypervisor',
      fields: {
        name: 'Virtual Machine',
        nameTh: 'เครื่องเสมือน (VM)',
        description: 'Virtual Machine ที่ทำงานบน VMware/Hyper-V สำหรับรัน...',
        owner: 'System Administrator',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    },
    {
      name: 'Cloud Service (IaaS/PaaS/SaaS)',
      description: 'บริการ Cloud Computing',
      fields: {
        name: 'Cloud Service',
        nameTh: 'บริการ Cloud',
        description: 'บริการ Cloud จาก AWS/Azure/GCP ประเภท IaaS/PaaS/SaaS สำหรับ...',
        owner: 'Cloud Engineer',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    },
    {
      name: 'Network Device',
      description: 'อุปกรณ์เครือข่าย เช่น Switch, Router, Firewall',
      fields: {
        name: 'Network Device',
        nameTh: 'อุปกรณ์เครือข่าย',
        description: 'อุปกรณ์เครือข่ายประเภท Switch/Router/Firewall ยี่ห้อ... รุ่น...',
        owner: 'Network Administrator',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    },
    {
      name: 'Storage System',
      description: 'ระบบจัดเก็บข้อมูล SAN/NAS/Object Storage',
      fields: {
        name: 'Storage System',
        nameTh: 'ระบบจัดเก็บข้อมูล',
        description: 'ระบบจัดเก็บข้อมูลประเภท SAN/NAS/Object Storage ความจุ... TB สำหรับ...',
        owner: 'Storage Administrator',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    },
    {
      name: 'Container Platform',
      description: 'แพลตฟอร์ม Container เช่น Docker, Kubernetes',
      fields: {
        name: 'Container Platform',
        nameTh: 'แพลตฟอร์ม Container',
        description: 'Container Platform (Docker/Kubernetes) สำหรับ deploy และจัดการ containerized applications',
        owner: 'DevOps Engineer',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    }
  ],
  security: [
    {
      name: 'Authentication System',
      description: 'ระบบยืนยันตัวตนผู้ใช้งาน',
      fields: {
        name: 'Authentication System',
        nameTh: 'ระบบยืนยันตัวตน',
        description: 'ระบบยืนยันตัวตนผู้ใช้งาน (Authentication) รองรับ Username/Password, MFA, SSO',
        owner: 'Security Engineer',
        department: 'ศูนย์รักษาความปลอดภัย'
      }
    },
    {
      name: 'Authorization/RBAC',
      description: 'ระบบจัดการสิทธิ์และบทบาท',
      fields: {
        name: 'Authorization System',
        nameTh: 'ระบบจัดการสิทธิ์ (RBAC)',
        description: 'ระบบจัดการสิทธิ์ตามบทบาท (Role-Based Access Control) สำหรับควบคุมการเข้าถึง...',
        owner: 'Security Engineer',
        department: 'ศูนย์รักษาความปลอดภัย'
      }
    },
    {
      name: 'Encryption Service',
      description: 'ระบบเข้ารหัสข้อมูล',
      fields: {
        name: 'Encryption Service',
        nameTh: 'ระบบเข้ารหัสข้อมูล',
        description: 'ระบบเข้ารหัสข้อมูล (Encryption) ทั้ง Data at Rest และ Data in Transit ใช้มาตรฐาน AES-256',
        owner: 'Security Engineer',
        department: 'ศูนย์รักษาความปลอดภัย'
      }
    },
    {
      name: 'Firewall/WAF',
      description: 'ระบบ Firewall และ Web Application Firewall',
      fields: {
        name: 'Firewall/WAF',
        nameTh: 'ไฟร์วอลล์',
        description: 'ระบบ Firewall/WAF สำหรับป้องกันการโจมตีจากภายนอก ยี่ห้อ... รุ่น...',
        owner: 'Network Security',
        department: 'ศูนย์รักษาความปลอดภัย'
      }
    },
    {
      name: 'VPN/Remote Access',
      description: 'ระบบเข้าถึงระยะไกลอย่างปลอดภัย',
      fields: {
        name: 'VPN Service',
        nameTh: 'ระบบ VPN',
        description: 'ระบบ VPN สำหรับการเข้าถึงเครือข่ายภายในจากภายนอกอย่างปลอดภัย รองรับผู้ใช้... คน',
        owner: 'Network Security',
        department: 'ศูนย์รักษาความปลอดภัย'
      }
    },
    {
      name: 'SIEM/Log Management',
      description: 'ระบบรวบรวมและวิเคราะห์ Log',
      fields: {
        name: 'SIEM System',
        nameTh: 'ระบบ SIEM',
        description: 'ระบบ Security Information and Event Management สำหรับรวบรวมและวิเคราะห์ Log ความปลอดภัย',
        owner: 'SOC Analyst',
        department: 'ศูนย์รักษาความปลอดภัย'
      }
    }
  ],
  integration: [
    {
      name: 'REST API',
      description: 'การเชื่อมต่อแบบ RESTful API',
      fields: {
        name: 'REST API Integration',
        nameTh: 'การเชื่อมต่อ REST API',
        description: 'การเชื่อมต่อระบบผ่าน RESTful API รองรับ JSON format สำหรับแลกเปลี่ยนข้อมูล...',
        owner: 'Integration Developer',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    },
    {
      name: 'SOAP Web Service',
      description: 'การเชื่อมต่อแบบ SOAP',
      fields: {
        name: 'SOAP Integration',
        nameTh: 'การเชื่อมต่อ SOAP',
        description: 'การเชื่อมต่อระบบผ่าน SOAP Web Service รองรับ XML format ตาม WSDL...',
        owner: 'Integration Developer',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    },
    {
      name: 'Message Queue',
      description: 'การสื่อสารแบบ Asynchronous ผ่าน Queue',
      fields: {
        name: 'Message Queue',
        nameTh: 'คิวข้อความ (Message Queue)',
        description: 'ระบบ Message Queue (RabbitMQ/Kafka) สำหรับการสื่อสารแบบ Async ระหว่างระบบ...',
        owner: 'Integration Developer',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    },
    {
      name: 'File Transfer (SFTP/FTP)',
      description: 'การแลกเปลี่ยนข้อมูลผ่านไฟล์',
      fields: {
        name: 'File Transfer',
        nameTh: 'การแลกเปลี่ยนไฟล์ (SFTP)',
        description: 'การแลกเปลี่ยนข้อมูลผ่านไฟล์ SFTP/FTP รูปแบบไฟล์ CSV/Excel/XML สำหรับ...',
        owner: 'Data Integration',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
    },
    {
      name: 'ETL/Data Pipeline',
      description: 'กระบวนการดึง แปลง โหลดข้อมูล',
      fields: {
        name: 'ETL Pipeline',
        nameTh: 'ETL Pipeline',
        description: 'กระบวนการ Extract-Transform-Load สำหรับนำข้อมูลจาก... ไปยัง... ทำงาน...',
        owner: 'Data Engineer',
        department: 'กองข้อมูลและสถิติ'
      }
    },
    {
      name: 'API Gateway',
      description: 'จุดเข้าถึง API รวมศูนย์',
      fields: {
        name: 'API Gateway',
        nameTh: 'API Gateway',
        description: 'API Gateway สำหรับจัดการ API ทั้งหมดขององค์กร รองรับ Rate Limiting, Authentication, Logging',
        owner: 'API Manager',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      }
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
      description: template.fields.description,
      owner: template.fields.owner || '',
      department: template.fields.department || ''
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
                      <Select
                        value={formData.owner}
                        onValueChange={(val) => handleChange('owner', val)}
                      >
                        <SelectTrigger className="h-9 text-sm" id="owner">
                          <SelectValue placeholder="เลือกผู้รับผิดชอบ" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {mockUsers.map(user => (
                            <SelectItem key={user.id} value={user.name}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="department" className="text-xs">หน่วยงาน</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(val) => handleChange('department', val)}
                      >
                        <SelectTrigger className="h-9 text-sm" id="department">
                          <SelectValue placeholder="เลือกหน่วยงาน" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {mockDepartments.map(dept => (
                            <SelectItem key={dept.id} value={dept.name}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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