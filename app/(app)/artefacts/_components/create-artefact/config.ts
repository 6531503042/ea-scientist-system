/**
 * Templates and Configuration for CreateArtefactModal
 * Extracted to reduce main component file size
 */

import type { ArtefactType } from '@/types/artefact';
import { Briefcase, Database, Layers, Cpu, Link, Shield } from 'lucide-react';

// Icon mapping for each artefact type
export const typeIcons: Record<ArtefactType, React.ElementType> = {
    business: Briefcase,
    data: Database,
    application: Layers,
    technology: Cpu,
    integration: Link,
    security: Shield,
};

// Color classes for each artefact type
export const typeColors: Record<ArtefactType, string> = {
    business: 'bg-ea-business',
    application: 'bg-ea-application',
    data: 'bg-ea-data',
    technology: 'bg-ea-technology',
    security: 'bg-ea-security',
    integration: 'bg-ea-integration',
};

// TOGAF labels
export const togafLabels: Record<ArtefactType, { short: string; full: string }> = {
    business: { short: 'Business', full: 'Business Architecture' },
    application: { short: 'Application', full: 'Application Architecture' },
    data: { short: 'Data', full: 'Data Architecture' },
    technology: { short: 'Technology', full: 'Technology Architecture' },
    security: { short: 'Security', full: 'Security Architecture' },
    integration: { short: 'Integration', full: 'Integration Architecture' },
};

// Type display order
export const typeOrder: ArtefactType[] = ['business', 'application', 'data', 'technology', 'security', 'integration'];

// Template type definition
export interface ArtefactTemplate {
    name: string;
    description: string;
    fields: Record<string, string>;
    typeSpecificFields?: Record<string, string>;
}

// TOGAF Type-Specific Fields Configuration
export interface TypeFieldConfig {
    key: string;
    label: string;
    labelTh: string;
    type: 'text' | 'select' | 'textarea';
    options?: { value: string; label: string }[];
    placeholder?: string;
}

export const togafTypeFields: Record<ArtefactType, TypeFieldConfig[]> = {
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
