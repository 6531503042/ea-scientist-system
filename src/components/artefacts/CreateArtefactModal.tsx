import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Layers, Database, Cpu, Link, Shield, Briefcase, Check, FileText, Eye, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ArtefactType } from '@/data/mockData';
import { mockUsers, mockDepartments } from '@/data/mockUserManagement';
import { bestPracticeExamples } from '@/data/bestPractices';

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

// Enhanced Templates for each EA type with detailed defaults and type-specific fields
const templates: Record<ArtefactType, Array<{ 
  name: string; 
  description: string; 
  fields: Record<string, string>;
  typeSpecificFields?: Record<string, string>; // Field template values
}>> = {
  business: [
    {
      name: 'กระบวนการหลัก (Core Process)',
      description: 'กระบวนการทำงานหลักที่สร้างมูลค่าให้องค์กร',
      fields: {
        name: 'Water Quality Testing Process',
        nameTh: 'กระบวนการตรวจคุณภาพน้ำ',
        description: 'กระบวนการตรวจสอบและวิเคราะห์คุณภาพน้ำตามมาตรฐานสากล ครอบคลุมการเก็บตัวอย่าง การทดสอบในห้องปฏิบัติการ และการออกใบรับรองผลการตรวจ',
        owner: 'ดร.สมชาย วิทยาการ',
        department: 'กองตรวจวิเคราะห์'
      },
      typeSpecificFields: {
        businessCapability: 'การตรวจสอบและรับรองคุณภาพน้ำเพื่อความปลอดภัยของประชาชน',
        kpis: 'จำนวนตัวอย่างที่ตรวจต่อเดือน (≥500 ตัวอย่าง), เวลาเฉลี่ยในการตรวจ (≤7 วัน), ความถูกต้องของผลการตรวจ (≥99%), ความพึงพอใจของลูกค้า (≥4.5/5)',
        actors: 'นักวิทยาศาสตร์, นักเทคนิคการแพทย์, เจ้าหน้าที่เก็บตัวอย่าง, ผู้รับบริการ (หน่วยงานรัฐ/เอกชน)'
      }
    },
    {
      name: 'กระบวนการสนับสนุน (Support Process)',
      description: 'กระบวนการที่ช่วยสนับสนุนกระบวนการหลัก',
      fields: {
        name: 'Lab Sample Management Process',
        nameTh: 'กระบวนการจัดการตัวอย่างห้องปฏิบัติการ',
        description: 'กระบวนการจัดการตัวอย่างตั้งแต่การรับตัวอย่าง การติดตามสถานะ การจัดเก็บ และการทำลายตัวอย่าง ครอบคลุมการบันทึกข้อมูล การแจ้งเตือน และการรายงานผล',
        owner: 'คุณวิภา สุขใจ',
        department: 'ศูนย์วิทยาศาสตร์การแพทย์'
      },
      typeSpecificFields: {
        businessCapability: 'การจัดการตัวอย่างห้องปฏิบัติการแบบครบวงจรเพื่อเพิ่มประสิทธิภาพและลดข้อผิดพลาด',
        kpis: 'เวลาเฉลี่ยในการรับตัวอย่าง (≤30 นาที), อัตราความผิดพลาดในการติดตาม (≤0.1%), จำนวนตัวอย่างที่จัดการต่อวัน (≥200 ตัวอย่าง), ความพึงพอใจของเจ้าหน้าที่ (≥4.0/5)',
        actors: 'เจ้าหน้าที่รับตัวอย่าง, เจ้าหน้าที่ห้องปฏิบัติการ, ผู้ส่งตัวอย่าง, ผู้จัดการระบบ'
      }
    },
    {
      name: 'บริการภายนอก (External Service)',
      description: 'บริการที่ให้กับหน่วยงานหรือบุคคลภายนอก',
      fields: {
        name: 'Public Water Testing Service',
        nameTh: 'บริการตรวจคุณภาพน้ำสำหรับประชาชน',
        description: 'บริการตรวจสอบคุณภาพน้ำดื่มและน้ำใช้สำหรับประชาชนทั่วไป รับตัวอย่างน้ำจากประชาชน ตรวจวิเคราะห์ตามมาตรฐาน และออกใบรับรองผลการตรวจ พร้อมคำแนะนำการปรับปรุงคุณภาพน้ำ',
        owner: 'คุณสมเกียรติ บริการดี',
        department: 'กองบริการประชาชน'
      },
      typeSpecificFields: {
        businessCapability: 'การให้บริการตรวจสอบคุณภาพน้ำแก่ประชาชนเพื่อส่งเสริมสุขภาพและความปลอดภัย',
        kpis: 'จำนวนผู้ใช้บริการต่อเดือน (≥300 ราย), เวลาเฉลี่ยในการให้บริการ (≤5 วันทำการ), ความพึงพอใจของลูกค้า (≥4.5/5), อัตราการกลับมาใช้บริการ (≥60%)',
        actors: 'ประชาชนทั่วไป, ผู้ประกอบการ, หน่วยงานราชการ, เจ้าหน้าที่ให้บริการ, นักวิทยาศาสตร์ผู้ตรวจสอบ'
      }
    },
    {
      name: 'บริการภายใน (Internal Service)',
      description: 'บริการที่ให้กับหน่วยงานภายในองค์กร',
      fields: {
        name: 'Internal IT Support Service',
        nameTh: 'บริการสนับสนุนเทคโนโลยีสารสนเทศภายใน',
        description: 'บริการสนับสนุนด้าน IT สำหรับบุคลากรภายในองค์กร ครอบคลุมการแก้ไขปัญหาเครื่องคอมพิวเตอร์ การติดตั้งซอฟต์แวร์ การจัดการบัญชีผู้ใช้ และการให้คำปรึกษาด้านเทคโนโลยี',
        owner: 'คุณกิตติพงษ์ เทคโนโลยี',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        businessCapability: 'การให้บริการสนับสนุนเทคโนโลยีสารสนเทศภายในองค์กรเพื่อเพิ่มประสิทธิภาพการทำงาน',
        kpis: 'เวลาเฉลี่ยในการตอบสนอง (≤2 ชั่วโมง), อัตราการแก้ไขปัญหาได้ในครั้งแรก (≥85%), ความพึงพอใจของบุคลากร (≥4.2/5), จำนวน Ticket ที่จัดการต่อวัน (≥50 tickets)',
        actors: 'บุคลากรภายในองค์กร, เจ้าหน้าที่ IT Support, ผู้จัดการระบบ, หัวหน้าแผนก'
      }
    }
  ],
  application: [
    {
      name: 'Web Application',
      description: 'ระบบเว็บแอปพลิเคชันที่ใช้งานผ่านเบราว์เซอร์',
      fields: {
        name: 'EA Management System',
        nameTh: 'ระบบจัดการสถาปัตยกรรมองค์กร',
        description: 'ระบบเว็บแอปพลิเคชันสำหรับจัดการและจัดทำสถาปัตยกรรมองค์กร (Enterprise Architecture) ตามมาตรฐาน TOGAF รองรับการจัดการ Artefacts, Relationships, และการสร้างรายงาน',
        owner: 'คุณประเสริฐ พัฒนาระบบ',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        appType: 'web',
        techStack: 'React 18, TypeScript, Vite, Node.js, Express, PostgreSQL, Tailwind CSS',
        deployment: 'cloud',
        sla: '99.9% uptime (8:00-18:00 น.), 99.5% uptime (24/7)'
      }
    },
    {
      name: 'Mobile Application',
      description: 'แอปพลิเคชันมือถือสำหรับ iOS และ Android',
      fields: {
        name: 'DSS Mobile Lab',
        nameTh: 'แอปพลิเคชันห้องปฏิบัติการเคลื่อนที่',
        description: 'แอปพลิเคชันมือถือสำหรับเจ้าหน้าที่ห้องปฏิบัติการในการบันทึกข้อมูลตัวอย่าง ตรวจสอบสถานะการตรวจ และรายงานผลการตรวจสอบ รองรับการทำงานแบบ Offline และ Sync เมื่อมีอินเทอร์เน็ต',
        owner: 'คุณสุรชัย พัฒนาแอป',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        appType: 'mobile',
        techStack: 'React Native, TypeScript, Redux Toolkit, SQLite (Local DB), Firebase (Backend)',
        deployment: 'cloud',
        sla: '99.5% uptime, รองรับการทำงาน Offline ได้ 100%'
      }
    },
    {
      name: 'Desktop Application',
      description: 'โปรแกรมที่ติดตั้งบนเครื่องคอมพิวเตอร์',
      fields: {
        name: 'Lab Data Analyzer',
        nameTh: 'โปรแกรมวิเคราะห์ข้อมูลห้องปฏิบัติการ',
        description: 'โปรแกรม Desktop สำหรับวิเคราะห์และสร้างรายงานข้อมูลห้องปฏิบัติการ รองรับการ Import ข้อมูลจาก Excel, การสร้างกราฟและสถิติ, และการ Export รายงานเป็น PDF/Excel',
        owner: 'คุณนพดล พัฒนาโปรแกรม',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        appType: 'desktop',
        techStack: 'Electron, React, Python (Data Analysis), Pandas, Matplotlib',
        deployment: 'onprem',
        sla: '99.0% uptime (เฉพาะเวลาทำการ), รองรับ Windows 10/11 และ macOS 12+'
      }
    },
    {
      name: 'Microservice',
      description: 'บริการย่อยที่ทำหน้าที่เฉพาะด้าน',
      fields: {
        name: 'Sample Tracking Service',
        nameTh: 'บริการติดตามตัวอย่าง',
        description: 'Microservice สำหรับจัดการและติดตามสถานะตัวอย่างห้องปฏิบัติการ ทำงานแบบ Stateless สื่อสารผ่าน REST API และ GraphQL รองรับการแจ้งเตือนแบบ Real-time',
        owner: 'คุณอรรถพล DevOps',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        appType: 'api',
        techStack: 'Node.js, Express, TypeScript, Docker, Kubernetes, Redis (Cache), PostgreSQL',
        deployment: 'cloud',
        sla: '99.95% uptime, Response Time < 200ms (P95)'
      }
    },
    {
      name: 'Legacy System',
      description: 'ระบบเดิมที่ยังใช้งานอยู่',
      fields: {
        name: 'Legacy Lab Management System',
        nameTh: 'ระบบจัดการห้องปฏิบัติการเดิม',
        description: 'ระบบเดิมที่พัฒนาด้วย ASP.NET Web Forms เมื่อปี 2010 ยังคงใช้งานสำหรับการจัดการข้อมูลห้องปฏิบัติการบางส่วน มีแผนปรับปรุงเป็นระบบใหม่ภายในปี 2025',
        owner: 'คุณสมศักดิ์ ดูแลระบบ',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        appType: 'web',
        techStack: 'ASP.NET Web Forms, SQL Server 2008, IIS, Windows Server 2012',
        deployment: 'onprem',
        sla: '95.0% uptime (เวลาทำการ), มีแผน Migration ไปยังระบบใหม่ Q2 2025'
      }
    },
    {
      name: 'Backend API',
      description: 'ระบบ Backend ให้บริการ API',
      fields: {
        name: 'DSS Core API',
        nameTh: 'API หลักของกรมวิทยาศาสตร์บริการ',
        description: 'Backend API หลักที่ให้บริการข้อมูลแก่ระบบ Frontend และ Mobile Applications ครอบคลุม API สำหรับจัดการ Artefacts, Users, Reports, และ Authentication',
        owner: 'คุณธนพล Backend Lead',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        appType: 'api',
        techStack: 'Node.js, Express, TypeScript, GraphQL, PostgreSQL, Redis, JWT Authentication',
        deployment: 'cloud',
        sla: '99.9% uptime, API Response Time < 300ms (P95), Rate Limiting: 1000 requests/minute'
      }
    }
  ],
  data: [
    {
      name: 'Master Data',
      description: 'ข้อมูลหลักที่ใช้อ้างอิงทั่วทั้งองค์กร',
      fields: {
        name: 'Organization Master Data',
        nameTh: 'ข้อมูลหลักขององค์กร',
        description: 'ข้อมูลหลักที่ใช้อ้างอิงทั่วทั้งองค์กร ประกอบด้วย รหัสหน่วยงาน, รายชื่อบุคลากร, โครงสร้างองค์กร, ตำแหน่งงาน, และข้อมูลอ้างอิงอื่นๆ ที่ใช้ร่วมกัน',
        owner: 'คุณกัญญา ข้อมูลหลัก',
        department: 'กองข้อมูลและสถิติ'
      },
      typeSpecificFields: {
        dataClassification: 'internal',
        dataFormat: 'PostgreSQL (Relational Database), JSON Schema',
        retentionPolicy: 'ตลอดชีพ (Permanent Retention), Backup ทุกวัน, Archive ทุกปี',
        isMasterData: 'yes'
      }
    },
    {
      name: 'Transaction Data',
      description: 'ข้อมูลธุรกรรมที่เกิดขึ้นจากการทำงาน',
      fields: {
        name: 'Lab Test Transaction Data',
        nameTh: 'ข้อมูลธุรกรรมการตรวจสอบห้องปฏิบัติการ',
        description: 'ข้อมูลธุรกรรมที่บันทึกจากการตรวจสอบตัวอย่างในห้องปฏิบัติการ ประกอบด้วย ข้อมูลตัวอย่าง, ผลการตรวจ, วันที่และเวลา, ผู้ตรวจสอบ มีการสร้างข้อมูลใหม่ประมาณ 500-800 รายการต่อวัน',
        owner: 'คุณปิยะ นักวิเคราะห์',
        department: 'กองข้อมูลและสถิติ'
      },
      typeSpecificFields: {
        dataClassification: 'internal',
        dataFormat: 'PostgreSQL (Transaction Table), JSON (Metadata), CSV (Export Format)',
        retentionPolicy: '5 ปี (Active), Archive หลัง 5 ปี, Delete หลัง 10 ปี (ตาม PDPA)',
        isMasterData: 'no'
      }
    },
    {
      name: 'Reference Data',
      description: 'ข้อมูลอ้างอิงที่ใช้ร่วมกัน',
      fields: {
        name: 'Standard Reference Data',
        nameTh: 'ข้อมูลอ้างอิงมาตรฐาน',
        description: 'ข้อมูลอ้างอิงที่ใช้ร่วมกันทั่วทั้งองค์กร เช่น รหัสจังหวัด, รหัสอำเภอ, รหัสประเภทตัวอย่าง, มาตรฐานการตรวจสอบ, ค่า Lookup ต่างๆ ที่ใช้ในระบบ',
        owner: 'คุณสุรีย์ ผู้ดูแลข้อมูล',
        department: 'กองข้อมูลและสถิติ'
      },
      typeSpecificFields: {
        dataClassification: 'public',
        dataFormat: 'JSON (API Response), XML (Legacy Systems), PostgreSQL (Source)',
        retentionPolicy: 'ตลอดชีพ (Permanent), Version Control สำหรับการเปลี่ยนแปลง, Backup ทุกสัปดาห์',
        isMasterData: 'yes'
      }
    },
    {
      name: 'API Data Schema',
      description: 'โครงสร้างข้อมูลที่ใช้แลกเปลี่ยนผ่าน API',
      fields: {
        name: 'EA API Schema',
        nameTh: 'โครงสร้างข้อมูล API สำหรับ EA',
        description: 'โครงสร้างข้อมูล (Schema) สำหรับการแลกเปลี่ยนข้อมูล Artefact, Relationship, และ Metadata ผ่าน REST API และ GraphQL รองรับ JSON และ XML format',
        owner: 'คุณอรรถพล Solution Architect',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        dataClassification: 'internal',
        dataFormat: 'JSON Schema (Primary), XML Schema (Legacy), GraphQL Schema, OpenAPI 3.0 Specification',
        retentionPolicy: 'ตามความจำเป็น (Versioned), เก็บ Schema ทุกเวอร์ชัน, Deprecate หลัง 2 ปี',
        isMasterData: 'no'
      }
    },
    {
      name: 'Data Warehouse',
      description: 'คลังข้อมูลสำหรับวิเคราะห์และรายงาน',
      fields: {
        name: 'DSS Analytics Data Warehouse',
        nameTh: 'คลังข้อมูลวิเคราะห์ของกรมวิทยาศาสตร์บริการ',
        description: 'คลังข้อมูลรวมศูนย์สำหรับการวิเคราะห์และจัดทำรายงาน BI Dashboard ประกอบด้วยข้อมูลจากระบบต่างๆ ที่ผ่านกระบวนการ ETL และจัดเก็บในรูปแบบ Columnar Storage',
        owner: 'คุณกิตติพงษ์ Data Engineer',
        department: 'กองข้อมูลและสถิติ'
      },
      typeSpecificFields: {
        dataClassification: 'confidential',
        dataFormat: 'Parquet (Columnar Storage), ORC (Hive), PostgreSQL (Staging), CSV (Export)',
        retentionPolicy: '10 ปี (Active Data), Archive หลัง 10 ปี, Delete หลัง 15 ปี (ตามกฎหมาย)',
        isMasterData: 'no'
      }
    }
  ],
  technology: [
    {
      name: 'Physical Server',
      description: 'เซิร์ฟเวอร์ฮาร์ดแวร์ภายในองค์กร',
      fields: {
        name: 'DSS Production Server Cluster',
        nameTh: 'คลัสเตอร์เซิร์ฟเวอร์ผลิตภัณฑ์',
        description: 'เซิร์ฟเวอร์ฮาร์ดแวร์สำหรับรันระบบผลิตภัณฑ์หลัก ติดตั้งที่ Data Center กรมวิทยาศาสตร์บริการ ประกอบด้วย 3 nodes สำหรับ High Availability',
        owner: 'คุณสมชาย System Admin',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        componentType: 'server',
        vendor: 'Dell PowerEdge R740, HP ProLiant DL380',
        location: 'Data Center 1, ชั้น 3 อาคารสำนักงาน, กรมวิทยาศาสตร์บริการ',
        capacity: 'CPU: Intel Xeon Gold 6248R (48 cores), RAM: 256GB DDR4, Storage: 4TB NVMe SSD (RAID 10)'
      }
    },
    {
      name: 'Virtual Machine',
      description: 'เครื่องเสมือนที่ทำงานบน Hypervisor',
      fields: {
        name: 'EA System VM Cluster',
        nameTh: 'คลัสเตอร์ VM สำหรับระบบ EA',
        description: 'Virtual Machine ที่ทำงานบน VMware vSphere สำหรับรันระบบ EA Management System และ Backend Services ประกอบด้วย 4 VMs สำหรับ Load Balancing',
        owner: 'คุณประเสริฐ System Admin',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        componentType: 'server',
        vendor: 'VMware vSphere 7.0, ESXi Hosts',
        location: 'Virtual Infrastructure, Data Center 1, Hosted on Dell PowerEdge R740',
        capacity: 'CPU: 8 vCPUs per VM, RAM: 32GB per VM, Storage: 500GB SSD per VM (Thin Provisioning)'
      }
    },
    {
      name: 'Cloud Service (IaaS/PaaS/SaaS)',
      description: 'บริการ Cloud Computing',
      fields: {
        name: 'DSS Cloud Infrastructure',
        nameTh: 'โครงสร้างพื้นฐาน Cloud ของกรมวิทยาศาสตร์บริการ',
        description: 'บริการ Cloud จาก AWS สำหรับ Hosting ระบบ Web Applications และ APIs ใช้บริการ EC2, RDS, S3, CloudFront และ Route 53',
        owner: 'คุณกิตติพงษ์ Cloud Engineer',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        componentType: 'cloud',
        vendor: 'Amazon Web Services (AWS)',
        location: 'AWS ap-southeast-1 (Singapore), Multi-AZ Deployment',
        capacity: 'Auto-scaling: 2-10 instances, RDS: db.t3.large (2 vCPU, 8GB RAM), S3: Unlimited Storage'
      }
    },
    {
      name: 'Network Device',
      description: 'อุปกรณ์เครือข่าย เช่น Switch, Router, Firewall',
      fields: {
        name: 'Core Network Switch',
        nameTh: 'สวิตช์เครือข่ายหลัก',
        description: 'สวิตช์เครือข่ายหลักสำหรับเชื่อมต่อเซิร์ฟเวอร์และอุปกรณ์ภายใน Data Center รองรับ VLAN, Link Aggregation, และ QoS',
        owner: 'คุณสมเกียรติ Network Admin',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        componentType: 'network',
        vendor: 'Cisco Catalyst 9300 Series',
        location: 'Network Rack 1, Data Center 1, ชั้น 3',
        capacity: '48 Ports Gigabit Ethernet, 4 Ports 10Gbps SFP+, Stacking Support, PoE+'
      }
    },
    {
      name: 'Storage System',
      description: 'ระบบจัดเก็บข้อมูล SAN/NAS/Object Storage',
      fields: {
        name: 'DSS SAN Storage System',
        nameTh: 'ระบบจัดเก็บข้อมูล SAN',
        description: 'ระบบจัดเก็บข้อมูล SAN สำหรับ Database และ Application Data ใช้สำหรับเก็บข้อมูลสำคัญขององค์กร รองรับการ Backup และ Replication',
        owner: 'คุณวิภา Storage Admin',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        componentType: 'storage',
        vendor: 'Dell EMC Unity XT 480',
        location: 'Storage Area, Data Center 1, ชั้น 3',
        capacity: 'Raw Capacity: 200TB, Usable: 150TB (RAID 6), SSD Cache: 2TB, Backup Capacity: 300TB'
      }
    },
    {
      name: 'Container Platform',
      description: 'แพลตฟอร์ม Container เช่น Docker, Kubernetes',
      fields: {
        name: 'DSS Kubernetes Cluster',
        nameTh: 'คลัสเตอร์ Kubernetes',
        description: 'Container Platform สำหรับ deploy และจัดการ Microservices และ Containerized Applications ใช้ Kubernetes สำหรับ Orchestration และ Docker สำหรับ Container Runtime',
        owner: 'คุณอรรถพล DevOps Lead',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        componentType: 'cloud',
        vendor: 'Kubernetes 1.28, Docker 24.x, Rancher (Management)',
        location: 'Container Cluster, Data Center 1, On-Premise + Cloud Hybrid',
        capacity: '3 Master Nodes, 5 Worker Nodes, Auto-scaling: 2-20 Pods per Service, Resource Limits: CPU 4 cores, RAM 8GB per Pod'
      }
    }
  ],
  security: [
    {
      name: 'Authentication System',
      description: 'ระบบยืนยันตัวตนผู้ใช้งาน',
      fields: {
        name: 'DSS Identity Provider',
        nameTh: 'ระบบยืนยันตัวตนของกรมวิทยาศาสตร์บริการ',
        description: 'ระบบยืนยันตัวตนผู้ใช้งาน (Identity Provider) รองรับ Username/Password, Multi-Factor Authentication (MFA), Single Sign-On (SSO), และการเชื่อมต่อกับ Active Directory',
        owner: 'คุณสมชาย Security Engineer',
        department: 'ศูนย์รักษาความปลอดภัย'
      },
      typeSpecificFields: {
        securityDomain: 'auth',
        compliance: 'ISO 27001:2022, PDPA, NIST Cybersecurity Framework, OAuth 2.0, SAML 2.0',
        riskLevel: 'medium'
      }
    },
    {
      name: 'Authorization/RBAC',
      description: 'ระบบจัดการสิทธิ์และบทบาท',
      fields: {
        name: 'DSS RBAC System',
        nameTh: 'ระบบจัดการสิทธิ์ตามบทบาท',
        description: 'ระบบจัดการสิทธิ์ตามบทบาท (Role-Based Access Control) สำหรับควบคุมการเข้าถึงระบบและข้อมูล ประกอบด้วย Roles: Admin, Architect, Executive, Viewer และการกำหนด Permissions แบบละเอียด',
        owner: 'คุณกัญญา Security Engineer',
        department: 'ศูนย์รักษาความปลอดภัย'
      },
      typeSpecificFields: {
        securityDomain: 'authz',
        compliance: 'ISO 27001:2022, RBAC Standards (NIST), Principle of Least Privilege, Audit Logging',
        riskLevel: 'high'
      }
    },
    {
      name: 'Encryption Service',
      description: 'ระบบเข้ารหัสข้อมูล',
      fields: {
        name: 'DSS Encryption Service',
        nameTh: 'บริการเข้ารหัสข้อมูล',
        description: 'ระบบเข้ารหัสข้อมูล (Encryption Service) สำหรับเข้ารหัสข้อมูลทั้ง Data at Rest (Database, Files) และ Data in Transit (HTTPS, VPN) ใช้มาตรฐาน AES-256 และ TLS 1.3',
        owner: 'คุณปิยะ Security Engineer',
        department: 'ศูนย์รักษาความปลอดภัย'
      },
      typeSpecificFields: {
        securityDomain: 'encryption',
        compliance: 'AES-256-GCM (Data at Rest), TLS 1.3 (Data in Transit), FIPS 140-2 Level 2, Key Management: AWS KMS',
        riskLevel: 'low'
      }
    },
    {
      name: 'Firewall/WAF',
      description: 'ระบบ Firewall และ Web Application Firewall',
      fields: {
        name: 'DSS Network Firewall & WAF',
        nameTh: 'ไฟร์วอลล์และ WAF',
        description: 'ระบบ Firewall และ Web Application Firewall สำหรับป้องกันการโจมตีจากภายนอก ครอบคลุม Network Firewall สำหรับป้องกัน Layer 3-4 และ WAF สำหรับป้องกัน Layer 7 (SQL Injection, XSS, etc.)',
        owner: 'คุณสุรีย์ Network Security',
        department: 'ศูนย์รักษาความปลอดภัย'
      },
      typeSpecificFields: {
        securityDomain: 'network',
        compliance: 'ISO 27001:2022, NIST Cybersecurity Framework, PCI-DSS (ถ้ามี), OWASP Top 10 Protection',
        riskLevel: 'high'
      }
    },
    {
      name: 'VPN/Remote Access',
      description: 'ระบบเข้าถึงระยะไกลอย่างปลอดภัย',
      fields: {
        name: 'DSS Remote Access VPN',
        nameTh: 'ระบบ VPN สำหรับการเข้าถึงระยะไกล',
        description: 'ระบบ VPN สำหรับการเข้าถึงเครือข่ายภายในจากภายนอกอย่างปลอดภัย รองรับทั้ง IPSec VPN และ SSL VPN สำหรับผู้ใช้ที่ทำงานจากบ้านหรือนอกสถานที่',
        owner: 'คุณสุรชัย Network Security',
        department: 'ศูนย์รักษาความปลอดภัย'
      },
      typeSpecificFields: {
        securityDomain: 'network',
        compliance: 'IPSec VPN (Site-to-Site), SSL VPN (Remote Access), MFA Required, Certificate-based Authentication',
        riskLevel: 'medium'
      }
    },
    {
      name: 'SIEM/Log Management',
      description: 'ระบบรวบรวมและวิเคราะห์ Log',
      fields: {
        name: 'DSS SIEM Platform',
        nameTh: 'แพลตฟอร์ม SIEM',
        description: 'ระบบ Security Information and Event Management สำหรับรวบรวมและวิเคราะห์ Log ความปลอดภัยจากระบบต่างๆ ครอบคลุมการตรวจจับภัยคุกคาม, การแจ้งเตือน, และการรายงานความปลอดภัย',
        owner: 'คุณนพดล SOC Analyst',
        department: 'ศูนย์รักษาความปลอดภัย'
      },
      typeSpecificFields: {
        securityDomain: 'network',
        compliance: 'ISO 27001:2022, SOC 2 Type II, Log Retention: 1 ปี (Active), 7 ปี (Archive), Real-time Threat Detection',
        riskLevel: 'medium'
      }
    }
  ],
  integration: [
    {
      name: 'REST API',
      description: 'การเชื่อมต่อแบบ RESTful API',
      fields: {
        name: 'EA System REST API Integration',
        nameTh: 'การเชื่อมต่อ REST API ของระบบ EA',
        description: 'การเชื่อมต่อระบบ EA Management System กับระบบภายนอกผ่าน RESTful API รองรับ JSON format สำหรับแลกเปลี่ยนข้อมูล Artefacts, Relationships, และ Metadata',
        owner: 'คุณกิตติพงษ์ Integration Developer',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        integrationPattern: 'rest',
        protocol: 'HTTPS (TLS 1.3), OAuth 2.0 Bearer Token Authentication',
        sourceSystem: 'EA Management System',
        targetSystem: 'External Systems (HR System, Lab Management System, Reporting System)'
      }
    },
    {
      name: 'SOAP Web Service',
      description: 'การเชื่อมต่อแบบ SOAP',
      fields: {
        name: 'Legacy System SOAP Integration',
        nameTh: 'การเชื่อมต่อ SOAP กับระบบเดิม',
        description: 'การเชื่อมต่อระบบ EA กับระบบเดิม (Legacy Systems) ผ่าน SOAP Web Service รองรับ XML format ตาม WSDL specification สำหรับการแลกเปลี่ยนข้อมูลกับระบบที่ยังใช้ SOAP',
        owner: 'คุณประเสริฐ Integration Developer',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        integrationPattern: 'soap',
        protocol: 'HTTPS/SOAP 1.2, WS-Security (UsernameToken), WSDL 2.0',
        sourceSystem: 'EA Management System',
        targetSystem: 'Legacy Lab Management System, Legacy HR System'
      }
    },
    {
      name: 'Message Queue',
      description: 'การสื่อสารแบบ Asynchronous ผ่าน Queue',
      fields: {
        name: 'DSS Event Queue',
        nameTh: 'คิวเหตุการณ์ของกรมวิทยาศาสตร์บริการ',
        description: 'ระบบ Message Queue สำหรับการสื่อสารแบบ Asynchronous ระหว่างระบบ ใช้สำหรับ Event-driven Architecture เช่น การแจ้งเตือนเมื่อมีการอัพเดท Artefact, การ Sync ข้อมูลระหว่างระบบ',
        owner: 'คุณอรรถพล Integration Developer',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        integrationPattern: 'mq',
        protocol: 'AMQP 0.9.1 (RabbitMQ), Apache Kafka Protocol, Message Format: JSON',
        sourceSystem: 'EA Management System (Producer), Notification Service (Producer)',
        targetSystem: 'Reporting System (Consumer), Audit Log System (Consumer), Email Service (Consumer)'
      }
    },
    {
      name: 'File Transfer (SFTP/FTP)',
      description: 'การแลกเปลี่ยนข้อมูลผ่านไฟล์',
      fields: {
        name: 'DSS Data Exchange Service',
        nameTh: 'บริการแลกเปลี่ยนข้อมูลผ่านไฟล์',
        description: 'การแลกเปลี่ยนข้อมูลระหว่างระบบผ่านไฟล์ SFTP/FTP รูปแบบไฟล์ CSV/Excel/XML สำหรับการ Import/Export ข้อมูล Artefacts, Reports, และ Master Data',
        owner: 'คุณกัญญา Data Integration',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        integrationPattern: 'file',
        protocol: 'SFTP (SSH File Transfer Protocol), FTPS (FTP over SSL), Key-based Authentication',
        sourceSystem: 'EA Management System, External Partner Systems',
        targetSystem: 'Data Warehouse, Reporting System, External Systems'
      }
    },
    {
      name: 'ETL/Data Pipeline',
      description: 'กระบวนการดึง แปลง โหลดข้อมูล',
      fields: {
        name: 'DSS ETL Data Pipeline',
        nameTh: 'Pipeline ETL ของกรมวิทยาศาสตร์บริการ',
        description: 'กระบวนการ Extract-Transform-Load สำหรับนำข้อมูลจากระบบต่างๆ (EA System, Lab System, HR System) ไปยัง Data Warehouse สำหรับการวิเคราะห์และรายงาน ทำงานแบบ Scheduled (Daily)',
        owner: 'คุณปิยะ Data Engineer',
        department: 'กองข้อมูลและสถิติ'
      },
      typeSpecificFields: {
        integrationPattern: 'file',
        protocol: 'ETL Process (Apache Airflow), Database Connection (JDBC), File Transfer (SFTP)',
        sourceSystem: 'PostgreSQL (EA Database), MySQL (Lab System), SQL Server (HR System)',
        targetSystem: 'Data Warehouse (PostgreSQL), Analytics Database, BI Tools'
      }
    },
    {
      name: 'API Gateway',
      description: 'จุดเข้าถึง API รวมศูนย์',
      fields: {
        name: 'DSS API Gateway',
        nameTh: 'API Gateway ของกรมวิทยาศาสตร์บริการ',
        description: 'API Gateway สำหรับจัดการ API ทั้งหมดขององค์กรเป็นจุดรวมศูนย์ รองรับ Rate Limiting, Authentication, Request/Response Transformation, Logging, และ Monitoring',
        owner: 'คุณสุรีย์ API Manager',
        department: 'ศูนย์เทคโนโลยีสารสนเทศ'
      },
      typeSpecificFields: {
        integrationPattern: 'rest',
        protocol: 'HTTPS (TLS 1.3), OAuth 2.0, API Key Authentication, JWT Token Validation',
        sourceSystem: 'Multiple Systems (EA System, Lab System, HR System, External Partners)',
        targetSystem: 'API Gateway (Kong/AWS API Gateway) → Backend Services'
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

// TOGAF Type-Specific Fields Configuration
const togafTypeFields: Record<ArtefactType, { key: string; label: string; labelTh: string; type: 'text' | 'select' | 'textarea'; options?: { value: string; label: string }[]; placeholder?: string }[]> = {
  business: [
    { key: 'businessCapability', label: 'Business Capability', labelTh: 'ความสามารถทางธุรกิจ', type: 'text', placeholder: 'เช่น การบริหารทรัพยากรบุคคล' },
    { key: 'kpis', label: 'KPIs', labelTh: 'ตัวชี้วัด', type: 'textarea', placeholder: 'ตัวชี้วัดความสำเร็จ แยกด้วย comma' },
    { key: 'actors', label: 'Actors/Roles', labelTh: 'ผู้เกี่ยวข้อง', type: 'text', placeholder: 'ผู้ใช้งาน/บทบาทที่เกี่ยวข้อง' },
  ],
  application: [
    {
      key: 'appType', label: 'Application Type', labelTh: 'ประเภทแอป', type: 'select', options: [
        { value: 'web', label: 'Web Application' },
        { value: 'mobile', label: 'Mobile Application' },
        { value: 'desktop', label: 'Desktop Application' },
        { value: 'api', label: 'API/Service' },
      ]
    },
    { key: 'techStack', label: 'Technology Stack', labelTh: 'เทคโนโลยีที่ใช้', type: 'text', placeholder: 'เช่น React, Node.js, PostgreSQL' },
    {
      key: 'deployment', label: 'Deployment', labelTh: 'การ Deploy', type: 'select', options: [
        { value: 'cloud', label: 'Cloud' },
        { value: 'onprem', label: 'On-Premise' },
        { value: 'hybrid', label: 'Hybrid' },
      ]
    },
    { key: 'sla', label: 'SLA', labelTh: 'SLA', type: 'text', placeholder: 'เช่น 99.9% uptime' },
  ],
  data: [
    {
      key: 'dataClassification', label: 'Data Classification', labelTh: 'ชั้นความลับข้อมูล', type: 'select', options: [
        { value: 'public', label: 'Public - เปิดเผย' },
        { value: 'internal', label: 'Internal - ภายใน' },
        { value: 'confidential', label: 'Confidential - ลับ' },
        { value: 'restricted', label: 'Restricted - สูงสุด' },
      ]
    },
    { key: 'dataFormat', label: 'Data Format', labelTh: 'รูปแบบข้อมูล', type: 'text', placeholder: 'เช่น JSON, XML, CSV' },
    { key: 'retentionPolicy', label: 'Retention Policy', labelTh: 'นโยบายเก็บรักษา', type: 'text', placeholder: 'เช่น 5 ปี, ตลอดชีพ' },
    {
      key: 'isMasterData', label: 'Master Data', labelTh: 'Master Data', type: 'select', options: [
        { value: 'yes', label: 'ใช่' },
        { value: 'no', label: 'ไม่ใช่' },
      ]
    },
  ],
  technology: [
    {
      key: 'componentType', label: 'Component Type', labelTh: 'ประเภท', type: 'select', options: [
        { value: 'server', label: 'Server' },
        { value: 'network', label: 'Network Device' },
        { value: 'storage', label: 'Storage' },
        { value: 'cloud', label: 'Cloud Service' },
      ]
    },
    { key: 'vendor', label: 'Vendor', labelTh: 'ผู้ผลิต', type: 'text', placeholder: 'เช่น Dell, HP, AWS' },
    { key: 'location', label: 'Location', labelTh: 'ที่ตั้ง', type: 'text', placeholder: 'เช่น DC1, Cloud - ap-southeast-1' },
    { key: 'capacity', label: 'Capacity', labelTh: 'ความจุ', type: 'text', placeholder: 'เช่น 32GB RAM, 1TB SSD' },
  ],
  security: [
    {
      key: 'securityDomain', label: 'Security Domain', labelTh: 'โดเมน', type: 'select', options: [
        { value: 'auth', label: 'Authentication' },
        { value: 'authz', label: 'Authorization' },
        { value: 'encryption', label: 'Encryption' },
        { value: 'network', label: 'Network Security' },
      ]
    },
    { key: 'compliance', label: 'Compliance', labelTh: 'มาตรฐานที่ปฏิบัติ', type: 'text', placeholder: 'เช่น ISO 27001, PDPA' },
    {
      key: 'riskLevel', label: 'Risk Level', labelTh: 'ระดับความเสี่ยง', type: 'select', options: [
        { value: 'low', label: 'Low - ต่ำ' },
        { value: 'medium', label: 'Medium - ปานกลาง' },
        { value: 'high', label: 'High - สูง' },
      ]
    },
  ],
  integration: [
    {
      key: 'integrationPattern', label: 'Integration Pattern', labelTh: 'รูปแบบการเชื่อมต่อ', type: 'select', options: [
        { value: 'rest', label: 'REST API' },
        { value: 'soap', label: 'SOAP' },
        { value: 'mq', label: 'Message Queue' },
        { value: 'file', label: 'File Transfer' },
      ]
    },
    { key: 'protocol', label: 'Protocol', labelTh: 'โปรโตคอล', type: 'text', placeholder: 'เช่น HTTPS, SFTP, AMQP' },
    { key: 'sourceSystem', label: 'Source System', labelTh: 'ระบบต้นทาง', type: 'text', placeholder: 'ชื่อระบบต้นทาง' },
    { key: 'targetSystem', label: 'Target System', labelTh: 'ระบบปลายทาง', type: 'text', placeholder: 'ชื่อระบบปลายทาง' },
  ],
};

const typeOrder: ArtefactType[] = ['business', 'application', 'data', 'technology', 'security', 'integration'];

export function CreateArtefactModal({ isOpen, onClose, onSubmit }: CreateArtefactModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<ArtefactType>('business');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nameTh: '',
    type: 'business' as ArtefactType,
    description: '',
    owner: '',
    department: '',
    version: '1.0',
    status: 'draft',
    // TOGAF type-specific fields
    typeSpecificFields: {} as Record<string, string>,
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
    setShowExamples(false);
    setFormData({
      name: '', nameTh: '', type: 'business', description: '', owner: '', department: '', version: '1.0', status: 'draft',
      typeSpecificFields: {},
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectType = (type: ArtefactType) => {
    setSelectedType(type);
    setSelectedTemplateIndex(null);
    setFormData(prev => ({ ...prev, type, name: '', nameTh: '', description: '', typeSpecificFields: {} }));
  };

  // Handler for type-specific TOGAF fields
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
      owner: template.fields.owner || '',
      department: template.fields.department || '',
      // Populate type-specific fields from template
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
                        typeSpecificFields: {} // Clear type-specific fields when creating from scratch
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