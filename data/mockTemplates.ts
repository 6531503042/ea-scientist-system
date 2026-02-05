// Mock Templates & Best Practice Library - TOR Requirement #13
import { ArtefactType } from './mockData';

export interface ArtefactTemplate {
    id: string;
    name: string;
    nameTh: string;
    type: ArtefactType;
    description: string;
    descriptionTh: string;
    fields: TemplateField[];
    bestPractices: string[];
    category: 'standard' | 'custom';
}

export interface TemplateField {
    name: string;
    label: string;
    labelTh: string;
    type: 'text' | 'textarea' | 'select' | 'multiselect' | 'date';
    required: boolean;
    placeholder?: string;
    options?: string[];
}

// Common base fields that every artefact should have
export const commonBaseFields: TemplateField[] = [
    { name: 'department', label: 'Department', labelTh: 'หน่วยงาน', type: 'select', required: true, options: ['กองนโยบายและแผน', 'กองเทคโนโลยีสารสนเทศ', 'กองบริหารงานบุคคล', 'กองคลัง', 'สำนักงานเลขานุการกรม', 'กองวิชาการ'] },
    { name: 'owner', label: 'Owner', labelTh: 'ผู้รับผิดชอบ', type: 'text', required: true, placeholder: 'ชื่อผู้รับผิดชอบหลัก' },
    { name: 'createdDate', label: 'Created Date', labelTh: 'วันที่สร้าง', type: 'date', required: false },
    { name: 'updatedDate', label: 'Last Updated', labelTh: 'อัปเดตล่าสุด', type: 'date', required: false },
    { name: 'status', label: 'Status', labelTh: 'สถานะ', type: 'select', required: true, options: ['Draft', 'Active', 'Under Review', 'Deprecated', 'Planned'] },
    { name: 'tags', label: 'Tags', labelTh: 'แท็ก', type: 'text', required: false, placeholder: 'คั่นด้วย comma เช่น: core, critical' },
    { name: 'notes', label: 'Notes', labelTh: 'หมายเหตุ', type: 'textarea', required: false },
];

export const artefactTemplates: ArtefactTemplate[] = [
    // Business Templates
    {
        id: 'tmpl-ba-001',
        name: 'Business Process',
        nameTh: 'กระบวนการธุรกิจ',
        type: 'business',
        description: 'Standard template for documenting business processes',
        descriptionTh: 'เทมเพลตมาตรฐานสำหรับจัดทำเอกสารกระบวนการธุรกิจ',
        category: 'standard',
        fields: [
            // Common fields
            ...commonBaseFields,
            // Type-specific fields
            { name: 'processOwner', label: 'Process Owner', labelTh: 'เจ้าของกระบวนการ', type: 'text', required: true },
            { name: 'inputs', label: 'Inputs', labelTh: 'ข้อมูลนำเข้า', type: 'textarea', required: true },
            { name: 'outputs', label: 'Outputs', labelTh: 'ผลลัพธ์', type: 'textarea', required: true },
            { name: 'frequency', label: 'Frequency', labelTh: 'ความถี่', type: 'select', required: false, options: ['Daily', 'Weekly', 'Monthly', 'Yearly'] },
            { name: 'kpi', label: 'KPI', labelTh: 'ตัวชี้วัด', type: 'textarea', required: false, placeholder: 'ระบุตัวชี้วัดที่สำคัญ' },
            { name: 'risks', label: 'Risks', labelTh: 'ความเสี่ยง', type: 'textarea', required: false, placeholder: 'ระบุความเสี่ยงที่เกี่ยวข้อง' },
            { name: 'stakeholders', label: 'Stakeholders', labelTh: 'ผู้มีส่วนได้ส่วนเสีย', type: 'textarea', required: false },
            { name: 'relatedProcesses', label: 'Related Processes', labelTh: 'กระบวนการที่เกี่ยวข้อง', type: 'textarea', required: false },
            { name: 'documents', label: 'Documents', labelTh: 'เอกสารอ้างอิง', type: 'textarea', required: false },
        ],
        bestPractices: [
            'ระบุเจ้าของกระบวนการให้ชัดเจน',
            'กำหนด KPI ที่วัดผลได้',
            'เชื่อมโยงกับระบบแอปพลิเคชันที่รองรับ',
            'ระบุความเสี่ยงและแนวทางจัดการ',
        ],
    },
    {
        id: 'tmpl-ba-002',
        name: 'Service Description',
        nameTh: 'คำอธิบายบริการ',
        type: 'business',
        description: 'Template for service documentation',
        descriptionTh: 'เทมเพลตสำหรับจัดทำเอกสารบริการ',
        category: 'standard',
        fields: [
            ...commonBaseFields,
            { name: 'serviceLevel', label: 'Service Level', labelTh: 'ระดับบริการ', type: 'select', required: true, options: ['Gold', 'Silver', 'Bronze'] },
            { name: 'targetAudience', label: 'Target Audience', labelTh: 'กลุ่มเป้าหมาย', type: 'text', required: true },
            { name: 'sla', label: 'SLA', labelTh: 'ข้อตกลงระดับบริการ', type: 'textarea', required: false },
        ],
        bestPractices: [
            'กำหนด SLA ที่ชัดเจน',
            'ระบุช่องทางการให้บริการ',
            'กำหนดผู้รับผิดชอบ',
        ],
    },

    // Application Templates
    {
        id: 'tmpl-app-001',
        name: 'Application System',
        nameTh: 'ระบบแอปพลิเคชัน',
        type: 'application',
        description: 'Standard template for application documentation',
        descriptionTh: 'เทมเพลตมาตรฐานสำหรับจัดทำเอกสารระบบแอปพลิเคชัน',
        category: 'standard',
        fields: [
            ...commonBaseFields,
            { name: 'vendor', label: 'Vendor', labelTh: 'ผู้พัฒนา/ผู้จำหน่าย', type: 'text', required: false },
            { name: 'technology', label: 'Technology Stack', labelTh: 'เทคโนโลยีที่ใช้', type: 'textarea', required: true },
            { name: 'deploymentType', label: 'Deployment', labelTh: 'รูปแบบการติดตั้ง', type: 'select', required: true, options: ['On-premise', 'Cloud', 'Hybrid'] },
            { name: 'users', label: 'Estimated Users', labelTh: 'จำนวนผู้ใช้โดยประมาณ', type: 'text', required: false },
            { name: 'licenseType', label: 'License Type', labelTh: 'ประเภทสัญญาอนุญาต', type: 'select', required: false, options: ['Open Source', 'Commercial', 'Subscription', 'Perpetual'] },
            { name: 'supportContact', label: 'Support Contact', labelTh: 'ช่องทางติดต่อฝ่ายสนับสนุน', type: 'text', required: false },
            { name: 'endOfLife', label: 'End of Life', labelTh: 'วันหมดอายุการสนับสนุน', type: 'date', required: false },
            { name: 'backupPolicy', label: 'Backup Policy', labelTh: 'นโยบายสำรองข้อมูล', type: 'textarea', required: false },
            { name: 'integrations', label: 'Integrations', labelTh: 'ระบบที่เชื่อมต่อ', type: 'textarea', required: false },
        ],
        bestPractices: [
            'ระบุ Technology Stack ให้ครบถ้วน',
            'เชื่อมโยงกับ Infrastructure ที่รองรับ',
            'กำหนดแผนสำรองข้อมูล',
            'ตรวจสอบวันหมดอายุ License',
        ],
    },

    // Data Templates
    {
        id: 'tmpl-data-001',
        name: 'Data Entity',
        nameTh: 'ชุดข้อมูล',
        type: 'data',
        description: 'Template for data entity documentation',
        descriptionTh: 'เทมเพลตสำหรับจัดทำเอกสารชุดข้อมูล',
        category: 'standard',
        fields: [
            ...commonBaseFields,
            { name: 'dataClassification', label: 'Classification', labelTh: 'ระดับความลับ', type: 'select', required: true, options: ['Public', 'Internal', 'Confidential', 'Restricted'] },
            { name: 'retentionPeriod', label: 'Retention Period', labelTh: 'ระยะเวลาจัดเก็บ', type: 'text', required: true },
            { name: 'dataSource', label: 'Data Source', labelTh: 'แหล่งข้อมูล', type: 'text', required: true },
            { name: 'updateFrequency', label: 'Update Frequency', labelTh: 'ความถี่การอัปเดต', type: 'select', required: false, options: ['Real-time', 'Daily', 'Weekly', 'Monthly'] },
            { name: 'qualityRules', label: 'Quality Rules', labelTh: 'กฎคุณภาพข้อมูล', type: 'textarea', required: false },
            { name: 'lineage', label: 'Data Lineage', labelTh: 'ที่มาของข้อมูล', type: 'textarea', required: false },
            { name: 'sensitivity', label: 'Sensitivity Level', labelTh: 'ระดับความอ่อนไหว', type: 'select', required: false, options: ['Low', 'Medium', 'High', 'Critical'] },
            { name: 'pdpaRelevant', label: 'PDPA Relevant', labelTh: 'เกี่ยวข้องกับ PDPA', type: 'select', required: false, options: ['Yes', 'No', 'Partial'] },
            { name: 'accessControl', label: 'Access Control', labelTh: 'การควบคุมการเข้าถึง', type: 'textarea', required: false },
        ],
        bestPractices: [
            'กำหนดระดับความลับให้เหมาะสม',
            'ระบุ Data Owner อย่างชัดเจน',
            'กำหนดนโยบายการเข้าถึงข้อมูล',
            'ตรวจสอบความสอดคล้องกับ PDPA',
        ],
    },

    // Technology Templates
    {
        id: 'tmpl-tech-001',
        name: 'Infrastructure Component',
        nameTh: 'ส่วนประกอบโครงสร้างพื้นฐาน',
        type: 'technology',
        description: 'Template for infrastructure documentation',
        descriptionTh: 'เทมเพลตสำหรับจัดทำเอกสารโครงสร้างพื้นฐาน',
        category: 'standard',
        fields: [
            ...commonBaseFields,
            { name: 'location', label: 'Location', labelTh: 'ที่ตั้ง', type: 'select', required: true, options: ['Data Center', 'Cloud', 'Edge'] },
            { name: 'specs', label: 'Specifications', labelTh: 'สเปค', type: 'textarea', required: true },
            { name: 'maintenanceWindow', label: 'Maintenance Window', labelTh: 'ช่วงเวลาบำรุงรักษา', type: 'text', required: false },
            { name: 'redundancy', label: 'Redundancy', labelTh: 'ความซ้ำซ้อน', type: 'select', required: false, options: ['None', 'Active-Passive', 'Active-Active'] },
            { name: 'vendor', label: 'Vendor', labelTh: 'ผู้จำหน่าย', type: 'text', required: false },
            { name: 'supportContract', label: 'Support Contract', labelTh: 'สัญญาบำรุงรักษา', type: 'text', required: false },
            { name: 'capacityMetrics', label: 'Capacity Metrics', labelTh: 'ตัวชี้วัดความจุ', type: 'textarea', required: false },
            { name: 'disasterRecovery', label: 'DR Plan', labelTh: 'แผน DR', type: 'textarea', required: false },
        ],
        bestPractices: [
            'กำหนดแผนสำรอง (DR Plan)',
            'ระบุ SLA ของอุปกรณ์',
            'กำหนดผู้รับผิดชอบดูแลรักษา',
            'ตรวจสอบความจุเป็นประจำ',
        ],
    },

    // Security Templates
    {
        id: 'tmpl-sec-001',
        name: 'Security Control',
        nameTh: 'มาตรการความปลอดภัย',
        type: 'security',
        description: 'Template for security control documentation',
        descriptionTh: 'เทมเพลตสำหรับจัดทำเอกสารมาตรการความปลอดภัย',
        category: 'standard',
        fields: [
            ...commonBaseFields,
            { name: 'controlType', label: 'Control Type', labelTh: 'ประเภทมาตรการ', type: 'select', required: true, options: ['Preventive', 'Detective', 'Corrective'] },
            { name: 'framework', label: 'Framework', labelTh: 'มาตรฐานอ้างอิง', type: 'multiselect', required: false, options: ['ISO 27001', 'NIST', 'CIS Controls', 'PDPA'] },
            { name: 'scope', label: 'Scope', labelTh: 'ขอบเขต', type: 'textarea', required: true },
            { name: 'lastAuditDate', label: 'Last Audit Date', labelTh: 'วันตรวจสอบล่าสุด', type: 'date', required: false },
            { name: 'auditResult', label: 'Audit Result', labelTh: 'ผลการตรวจสอบ', type: 'select', required: false, options: ['Pass', 'Fail', 'Partial', 'Pending'] },
            { name: 'exceptions', label: 'Exceptions', labelTh: 'ข้อยกเว้น', type: 'textarea', required: false },
            { name: 'responsiblePerson', label: 'Responsible Person', labelTh: 'ผู้รับผิดชอบ', type: 'text', required: false },
            { name: 'reviewFrequency', label: 'Review Frequency', labelTh: 'ความถี่การทบทวน', type: 'select', required: false, options: ['Monthly', 'Quarterly', 'Annually'] },
        ],
        bestPractices: [
            'อ้างอิงตามมาตรฐานสากล',
            'ทบทวนมาตรการเป็นประจำ',
            'ทดสอบประสิทธิภาพของมาตรการ',
            'บันทึกข้อยกเว้นและเหตุผล',
        ],
    },

    // Integration Templates
    {
        id: 'tmpl-int-001',
        name: 'API Integration',
        nameTh: 'การเชื่อมต่อ API',
        type: 'integration',
        description: 'Template for API integration documentation',
        descriptionTh: 'เทมเพลตสำหรับจัดทำเอกสารการเชื่อมต่อ API',
        category: 'standard',
        fields: [
            ...commonBaseFields,
            { name: 'protocol', label: 'Protocol', labelTh: 'โปรโตคอล', type: 'select', required: true, options: ['REST', 'SOAP', 'GraphQL', 'gRPC'] },
            { name: 'authMethod', label: 'Auth Method', labelTh: 'วิธียืนยันตัวตน', type: 'select', required: true, options: ['API Key', 'OAuth2', 'JWT', 'Basic Auth'] },
            { name: 'endpoints', label: 'Endpoints', labelTh: 'จุดเชื่อมต่อ', type: 'textarea', required: true },
            { name: 'rateLimit', label: 'Rate Limit', labelTh: 'ขีดจำกัดการเรียกใช้', type: 'text', required: false },
            { name: 'dataFormat', label: 'Data Format', labelTh: 'รูปแบบข้อมูล', type: 'select', required: false, options: ['JSON', 'XML', 'CSV', 'Binary'] },
            { name: 'errorHandling', label: 'Error Handling', labelTh: 'การจัดการ Error', type: 'textarea', required: false },
            { name: 'monitoring', label: 'Monitoring', labelTh: 'การตรวจสอบ', type: 'textarea', required: false },
            { name: 'sla', label: 'SLA', labelTh: 'ข้อตกลงระดับบริการ', type: 'text', required: false },
            { name: 'documentation', label: 'Documentation URL', labelTh: 'ลิงก์เอกสาร', type: 'text', required: false },
        ],
        bestPractices: [
            'จัดทำ API Documentation',
            'กำหนด Rate Limiting',
            'ใช้ HTTPS สำหรับการเชื่อมต่อ',
            'ตั้งค่า Monitoring และ Alerting',
        ],
    },
];

// Helper function to get templates by type
export function getTemplatesByType(type: ArtefactType): ArtefactTemplate[] {
    return artefactTemplates.filter(t => t.type === type);
}

// Helper function to get template by ID
export function getTemplateById(id: string): ArtefactTemplate | undefined {
    return artefactTemplates.find(t => t.id === id);
}
