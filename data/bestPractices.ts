import type { ArtefactType } from './mockData';

export interface BestPracticeExample {
    id: string;
    name: string;
    nameTh: string;
    description: string;
    owner: string;
    department: string;
    version: string;
    status: 'active' | 'planned' | 'draft';
    tips: string[];
    highlights: string[];
}

export interface TypeGuideline {
    title: string;
    description: string;
    doList: string[];
    dontList: string[];
    keyFields: string[];
    tips: string;
}

// Best Practice Examples for each EA type
export const bestPracticeExamples: Record<ArtefactType, BestPracticeExample[]> = {
    business: [
        {
            id: 'bp-bus-1',
            name: 'Service Request Management Process',
            nameTh: 'กระบวนการจัดการคำร้องขอบริการ',
            description: 'กระบวนการรับคำร้องขอบริการจากประชาชนผ่านช่องทางออนไลน์ ตรวจสอบความถูกต้อง ดำเนินการตามขั้นตอน และแจ้งผลลัพธ์กลับไปยังผู้ร้อง รวมถึงการติดตามสถานะและการประเมินความพึงพอใจ',
            owner: 'ผู้อำนวยการกองบริการประชาชน',
            department: 'กองบริการประชาชน',
            version: '2.1',
            status: 'active',
            tips: [
                'ระบุ stakeholders ทุกฝ่ายที่เกี่ยวข้อง',
                'อธิบาย workflow แบบ step-by-step',
                'กำหนด SLA ที่ชัดเจน'
            ],
            highlights: [
                'มีการระบุ Owner และ Department ชัดเจน',
                'คำอธิบายครอบคลุมทั้งกระบวนการ',
                'มี Version control'
            ]
        },
        {
            id: 'bp-bus-2',
            name: 'Annual Budget Planning',
            nameTh: 'กระบวนการวางแผนงบประมาณประจำปี',
            description: 'กระบวนการจัดทำคำของบประมาณประจำปี เริ่มจากการรวบรวมความต้องการจากหน่วยงาน วิเคราะห์ความสอดคล้องกับยุทธศาสตร์ จัดลำดับความสำคัญ และจัดทำเอกสารเสนอขอตามรูปแบบที่กำหนด',
            owner: 'ผู้อำนวยการกองแผนงาน',
            department: 'กองแผนงานและงบประมาณ',
            version: '1.5',
            status: 'active',
            tips: [
                'เชื่อมโยงกับยุทธศาสตร์องค์กร',
                'ระบุ Timeline ที่ชัดเจน',
                'กำหนด criteria การตัดสินใจ'
            ],
            highlights: [
                'สอดคล้องกับนโยบายระดับสูง',
                'มี Timeline และ Milestones',
                'ระบุผู้รับผิดชอบแต่ละขั้นตอน'
            ]
        }
    ],
    application: [
        {
            id: 'bp-app-1',
            name: 'E-Service Portal',
            nameTh: 'ระบบบริการอิเล็กทรอนิกส์ (e-Service)',
            description: 'ระบบเว็บแอปพลิเคชันสำหรับให้บริการประชาชนผ่านช่องทางออนไลน์ รองรับการยื่นคำร้อง ตรวจสอบสถานะ ชำระค่าธรรมเนียม และรับผลการบริการ พัฒนาด้วย React + Node.js รองรับ 10,000+ concurrent users',
            owner: 'นักพัฒนาระบบอาวุโส',
            department: 'ศูนย์เทคโนโลยีสารสนเทศ',
            version: '3.2.1',
            status: 'active',
            tips: [
                'ระบุ Technology Stack ที่ใช้',
                'กำหนด Performance Requirements',
                'ระบุ Security Measures'
            ],
            highlights: [
                'ระบุ Tech Stack ชัดเจน',
                'มี Performance Metrics',
                'Version ใช้ Semantic Versioning'
            ]
        },
        {
            id: 'bp-app-2',
            name: 'Document Management System',
            nameTh: 'ระบบจัดการเอกสารอิเล็กทรอนิกส์',
            description: 'ระบบจัดเก็บและค้นหาเอกสารอิเล็กทรอนิกส์ รองรับ OCR, Full-text search, Version control, Access control ตาม RBAC รองรับไฟล์ PDF, Word, Excel, รูปภาพ ความจุ 10TB',
            owner: 'ผู้ดูแลระบบเอกสาร',
            department: 'สำนักงานเลขานุการกรม',
            version: '2.0.0',
            status: 'active',
            tips: [
                'ระบุ File formats ที่รองรับ',
                'กำหนด Storage capacity',
                'ระบุ Integration points'
            ],
            highlights: [
                'Features ครบถ้วน',
                'ระบุ Capacity ชัดเจน',
                'มี Security model'
            ]
        }
    ],
    data: [
        {
            id: 'bp-data-1',
            name: 'Organization Master Data',
            nameTh: 'ข้อมูลหลักหน่วยงาน',
            description: 'ข้อมูลหลักของหน่วยงานภายในองค์กร ประกอบด้วยรหัสหน่วยงาน ชื่อหน่วยงาน โครงสร้างลำดับขั้น ผู้บังคับบัญชา ที่อยู่ติดต่อ เป็น Single Source of Truth สำหรับทุกระบบ อัพเดตโดยฝ่ายบุคคล',
            owner: 'หัวหน้าฝ่ายบุคคล',
            department: 'กองบริหารทรัพยากรบุคคล',
            version: '1.2',
            status: 'active',
            tips: [
                'ระบุ Data Owner ชัดเจน',
                'กำหนด Update frequency',
                'ระบุ Data Quality rules'
            ],
            highlights: [
                'เป็น Single Source of Truth',
                'มี Data Owner ที่ชัดเจน',
                'ระบุ Update process'
            ]
        },
        {
            id: 'bp-data-2',
            name: 'Service Statistics Dataset',
            nameTh: 'ชุดข้อมูลสถิติการให้บริการ',
            description: 'ชุดข้อมูลสถิติการให้บริการประชาชน รวบรวมจากทุกช่องทาง (Counter, Online, Mobile) ประกอบด้วยจำนวนผู้รับบริการ ประเภทบริการ ระยะเวลาดำเนินการ ความพึงพอใจ สำหรับ BI Dashboard',
            owner: 'นักวิเคราะห์ข้อมูล',
            department: 'กองข้อมูลและสถิติ',
            version: '3.0',
            status: 'active',
            tips: [
                'ระบุ Data Sources ทั้งหมด',
                'กำหนด Aggregation rules',
                'ระบุ Retention period'
            ],
            highlights: [
                'ระบุ Sources ครบถ้วน',
                'มี Use case ชัดเจน',
                'เหมาะสำหรับ Analytics'
            ]
        }
    ],
    technology: [
        {
            id: 'bp-tech-1',
            name: 'Production Database Server',
            nameTh: 'เซิร์ฟเวอร์ฐานข้อมูลระบบ Production',
            description: 'เครื่องเซิร์ฟเวอร์สำหรับติดตั้ง PostgreSQL Database รองรับระบบ Production ทั้งหมด Spec: 32 vCPU, 128GB RAM, 2TB SSD (RAID-10) ติดตั้งที่ Data Center ตึก A ชั้น 3',
            owner: 'Database Administrator',
            department: 'ศูนย์เทคโนโลยีสารสนเทศ',
            version: '1.0',
            status: 'active',
            tips: [
                'ระบุ Hardware Spec ครบถ้วน',
                'กำหนด Location ที่ตั้ง',
                'ระบุ Maintenance schedule'
            ],
            highlights: [
                'มี Full Hardware Spec',
                'ระบุ Physical Location',
                'มี RAID configuration'
            ]
        },
        {
            id: 'bp-tech-2',
            name: 'Kubernetes Cluster',
            nameTh: 'คลัสเตอร์ Kubernetes',
            description: 'Kubernetes Cluster สำหรับ Container Orchestration รองรับ Microservices ทั้งหมด ประกอบด้วย 3 Master Nodes, 10 Worker Nodes รัน Rancher RKE2 บน VMware vSphere',
            owner: 'DevOps Engineer',
            department: 'ศูนย์เทคโนโลยีสารสนเทศ',
            version: '1.28',
            status: 'active',
            tips: [
                'ระบุ Cluster topology',
                'กำหนด Resource allocation',
                'ระบุ Platform version'
            ],
            highlights: [
                'ระบุ Architecture ชัดเจน',
                'มี Node configuration',
                'Version ที่ใช้ชัดเจน'
            ]
        }
    ],
    security: [
        {
            id: 'bp-sec-1',
            name: 'Central Authentication Service',
            nameTh: 'ระบบยืนยันตัวตนส่วนกลาง (SSO)',
            description: 'ระบบ Single Sign-On ส่วนกลางสำหรับทุกแอปพลิเคชัน รองรับ LDAP, SAML 2.0, OAuth 2.0 / OIDC มี MFA ผ่าน OTP และ FIDO2 เชื่อมต่อกับ Active Directory รองรับผู้ใช้ 5,000+ คน',
            owner: 'Security Engineer',
            department: 'ศูนย์รักษาความปลอดภัย',
            version: '2.5',
            status: 'active',
            tips: [
                'ระบุ Protocols ที่รองรับ',
                'กำหนด MFA methods',
                'ระบุ Integration points'
            ],
            highlights: [
                'รองรับมาตรฐานสากล',
                'มี MFA',
                'เป็น Central Service'
            ]
        },
        {
            id: 'bp-sec-2',
            name: 'Data Encryption Standard',
            nameTh: 'มาตรฐานการเข้ารหัสข้อมูล',
            description: 'มาตรฐานการเข้ารหัสข้อมูลองค์กร ใช้ AES-256 สำหรับ Data at Rest, TLS 1.3 สำหรับ Data in Transit, HSM สำหรับ Key Management ครอบคลุมข้อมูล PII และ Sensitive Data ทั้งหมด',
            owner: 'Chief Information Security Officer',
            department: 'ศูนย์รักษาความปลอดภัย',
            version: '1.0',
            status: 'active',
            tips: [
                'ระบุ Encryption algorithms',
                'กำหนด Key management',
                'ระบุ Data classification'
            ],
            highlights: [
                'ใช้มาตรฐานที่แข็งแกร่ง',
                'มี Key Management',
                'ครอบคลุม Data types'
            ]
        }
    ],
    integration: [
        {
            id: 'bp-int-1',
            name: 'Government Data Exchange API',
            nameTh: 'API แลกเปลี่ยนข้อมูลภาครัฐ',
            description: 'RESTful API สำหรับแลกเปลี่ยนข้อมูลกับหน่วยงานภาครัฐอื่น รองรับ JSON format, OAuth 2.0 authentication, Rate limiting 1000 req/min ตาม มาตรฐาน TH e-GIF',
            owner: 'Integration Architect',
            department: 'ศูนย์เทคโนโลยีสารสนเทศ',
            version: '2.0',
            status: 'active',
            tips: [
                'ระบุ API Specification',
                'กำหนด Authentication method',
                'ระบุ Rate limits'
            ],
            highlights: [
                'ตาม มาตรฐาน TH e-GIF',
                'มี Security measures',
                'มี Rate limiting'
            ]
        },
        {
            id: 'bp-int-2',
            name: 'Real-time Data Streaming',
            nameTh: 'ระบบส่งข้อมูลแบบ Real-time',
            description: 'Apache Kafka cluster สำหรับ Real-time data streaming ระหว่างระบบ รองรับ 100,000 messages/sec, Retention 7 days, 3-way replication เชื่อมต่อกับระบบ IoT sensors และ Monitoring',
            owner: 'Data Engineer',
            department: 'กองข้อมูลและสถิติ',
            version: '3.5',
            status: 'active',
            tips: [
                'ระบุ Throughput capacity',
                'กำหนด Retention policy',
                'ระบุ Connected systems'
            ],
            highlights: [
                'มี Capacity planning',
                'มี Replication',
                'ระบุ Use cases'
            ]
        }
    ]
};

// Guidelines for each EA type
export const guidelines: Record<ArtefactType, TypeGuideline> = {
    business: {
        title: 'แนวทางการสร้าง Business Architecture Artefact',
        description: 'Business Architecture อธิบายกระบวนการทางธุรกิจ บริการ และความสามารถขององค์กร',
        doList: [
            'ระบุ Owner และ Stakeholders ให้ชัดเจน',
            'อธิบาย Workflow แบบ Step-by-step',
            'เชื่อมโยงกับยุทธศาสตร์และเป้าหมายองค์กร',
            'กำหนด KPIs และตัวชี้วัดความสำเร็จ',
            'ระบุ Input/Output ของแต่ละกระบวนการ'
        ],
        dontList: [
            'ใช้ชื่อที่คลุมเครือหรือกว้างเกินไป',
            'ละเลยการระบุผู้รับผิดชอบ',
            'ไม่เชื่อมโยงกับระบบและข้อมูลที่เกี่ยวข้อง',
            'ข้ามขั้นตอนสำคัญในกระบวนการ'
        ],
        keyFields: ['Owner', 'Department', 'Process Steps', 'KPIs', 'Related Systems'],
        tips: 'เริ่มจากการเข้าใจ Business Capability แล้วจึงลงรายละเอียดกระบวนการ'
    },
    application: {
        title: 'แนวทางการสร้าง Application Architecture Artefact',
        description: 'Application Architecture อธิบายระบบซอฟต์แวร์และแอปพลิเคชันที่ใช้ในองค์กร',
        doList: [
            'ระบุ Technology Stack ที่ใช้พัฒนา',
            'กำหนด Performance Requirements (Users, Response time)',
            'ระบุ Security Measures ที่ใช้',
            'ใช้ Semantic Versioning (Major.Minor.Patch)',
            'ระบุ Integration Points กับระบบอื่น'
        ],
        dontList: [
            'ละเลยข้อมูล Technical Specification',
            'ไม่ระบุ Dependencies กับระบบอื่น',
            'ใช้ Version numbering ที่ไม่เป็นมาตรฐาน',
            'ไม่อัพเดตสถานะให้ทันสมัย'
        ],
        keyFields: ['Tech Stack', 'Version', 'Performance Spec', 'Security', 'Integrations'],
        tips: 'ควรมี Architecture Diagram ประกอบและอัพเดต Version ทุกครั้งที่มีการเปลี่ยนแปลง'
    },
    data: {
        title: 'แนวทางการสร้าง Data Architecture Artefact',
        description: 'Data Architecture อธิบายโครงสร้างข้อมูล แหล่งข้อมูล และการไหลของข้อมูลในองค์กร',
        doList: [
            'ระบุ Data Owner และ Data Steward ชัดเจน',
            'กำหนด Data Quality Rules',
            'ระบุ Update Frequency และ Retention Period',
            'อธิบาย Data Lineage และ Dependencies',
            'ระบุ Data Classification (Public/Internal/Confidential)'
        ],
        dontList: [
            'ไม่ระบุเจ้าของข้อมูล',
            'ละเลย Data Quality standards',
            'ไม่อธิบายความสัมพันธ์กับข้อมูลอื่น',
            'ข้ามการกำหนด Security classification'
        ],
        keyFields: ['Data Owner', 'Data Source', 'Update Frequency', 'Data Quality', 'Classification'],
        tips: 'ข้อมูลหลัก (Master Data) ควรเป็น Single Source of Truth และมีกระบวนการ Governance ชัดเจน'
    },
    technology: {
        title: 'แนวทางการสร้าง Technology Architecture Artefact',
        description: 'Technology Architecture อธิบายโครงสร้างพื้นฐานด้าน IT เช่น เซิร์ฟเวอร์ เครือข่าย และ Cloud',
        doList: [
            'ระบุ Hardware/Software Specifications ครบถ้วน',
            'กำหนด Physical/Virtual Location',
            'ระบุ Capacity และ Scalability',
            'กำหนด Maintenance Schedule',
            'ระบุ Disaster Recovery Plan'
        ],
        dontList: [
            'ไม่ระบุ Specification ที่ชัดเจน',
            'ละเลยข้อมูล Location และ Environment',
            'ไม่มีแผน Maintenance และ Support',
            'ข้ามการระบุ Dependencies'
        ],
        keyFields: ['Specifications', 'Location', 'Capacity', 'Maintenance', 'DR Plan'],
        tips: 'ควรมี Asset Tag หรือ Serial Number สำหรับ Physical devices และระบุ EOL (End of Life) dates'
    },
    security: {
        title: 'แนวทางการสร้าง Security Architecture Artefact',
        description: 'Security Architecture อธิบายมาตรการรักษาความปลอดภัยและการควบคุมการเข้าถึง',
        doList: [
            'ระบุ Security Protocols และ Standards ที่ใช้',
            'กำหนด Access Control Policies',
            'ระบุ Compliance Requirements (PDPA, ISO 27001)',
            'อธิบาย Monitoring และ Alerting mechanisms',
            'กำหนด Incident Response procedures'
        ],
        dontList: [
            'ใช้ Deprecated security protocols',
            'ไม่ระบุ Compliance requirements',
            'ละเลยการ Logging และ Monitoring',
            'ไม่มีแผน Incident Response'
        ],
        keyFields: ['Security Protocols', 'Access Control', 'Compliance', 'Monitoring', 'Incident Response'],
        tips: 'ควรอ้างอิงมาตรฐานสากล เช่น NIST, ISO 27001 และกฎหมาย PDPA'
    },
    integration: {
        title: 'แนวทางการสร้าง Integration Architecture Artefact',
        description: 'Integration Architecture อธิบายการเชื่อมต่อและแลกเปลี่ยนข้อมูลระหว่างระบบ',
        doList: [
            'ระบุ API Specification (OpenAPI/Swagger)',
            'กำหนด Authentication และ Authorization methods',
            'ระบุ Rate Limits และ Quotas',
            'อธิบาย Error Handling และ Retry logic',
            'ระบุ Connected Systems ทั้งสองฝั่ง'
        ],
        dontList: [
            'ไม่ระบุ API Documentation',
            'ละเลย Security ในการเชื่อมต่อ',
            'ไม่กำหนด SLA และ Availability',
            'ไม่มี Versioning strategy'
        ],
        keyFields: ['API Spec', 'Authentication', 'Rate Limits', 'Error Handling', 'Connected Systems'],
        tips: 'ควรมี API Documentation ที่เป็นมาตรฐาน (OpenAPI) และใช้ API Gateway สำหรับ centralized management'
    }
};

// Type labels
export const typeLabels: Record<ArtefactType, { name: string; nameTh: string; description: string }> = {
    business: {
        name: 'Business Architecture',
        nameTh: 'สถาปัตยกรรมธุรกิจ',
        description: 'กระบวนการ บริการ และความสามารถทางธุรกิจ'
    },
    application: {
        name: 'Application Architecture',
        nameTh: 'สถาปัตยกรรมแอปพลิเคชัน',
        description: 'ระบบซอฟต์แวร์และแอปพลิเคชัน'
    },
    data: {
        name: 'Data Architecture',
        nameTh: 'สถาปัตยกรรมข้อมูล',
        description: 'โครงสร้างและการไหลของข้อมูล'
    },
    technology: {
        name: 'Technology Architecture',
        nameTh: 'สถาปัตยกรรมเทคโนโลยี',
        description: 'โครงสร้างพื้นฐานด้าน IT'
    },
    security: {
        name: 'Security Architecture',
        nameTh: 'สถาปัตยกรรมความปลอดภัย',
        description: 'มาตรการรักษาความปลอดภัย'
    },
    integration: {
        name: 'Integration Architecture',
        nameTh: 'สถาปัตยกรรมบูรณาการ',
        description: 'การเชื่อมต่อระหว่างระบบ'
    }
};
