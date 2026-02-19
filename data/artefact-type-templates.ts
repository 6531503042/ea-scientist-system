/**
 * Artefact Type Templates
 * TOGAF-based templates for Architecture Layers and Artefact Categories.
 * Used by CreateTypeModal for quick setup.
 */

import type { LocalizedName } from '@/types/artefact-type';

export interface LayerTemplate {
  name: string;
  description?: string;
  fields: {
    layerName: LocalizedName;
    description?: LocalizedName;
  };
}

export interface CategoryTemplate {
  name: string;
  description?: string;
  /** Suggested layer name (en) for matching - user selects actual layer from dropdown */
  suggestedLayerKey: string;
  fields: {
    categoryName: LocalizedName;
    description?: LocalizedName;
  };
}

export const layerTemplates: LayerTemplate[] = [
  {
    name: 'สถาปัตยกรรมธุรกิจ',
    description: 'TOGAF Business Architecture',
    fields: {
      layerName: { en: 'Business Architecture', th: 'สถาปัตยกรรมธุรกิจ' },
      description: { en: 'Business layer for capabilities and processes', th: 'ชั้นธุรกิจสำหรับความสามารถและกระบวนการ' },
    },
  },
  {
    name: 'สถาปัตยกรรมแอปพลิเคชัน',
    description: 'TOGAF Application Architecture',
    fields: {
      layerName: { en: 'Application Architecture', th: 'สถาปัตยกรรมแอปพลิเคชัน' },
      description: { en: 'Application layer for systems and services', th: 'ชั้นแอปพลิเคชันสำหรับระบบและบริการ' },
    },
  },
  {
    name: 'สถาปัตยกรรมข้อมูล',
    description: 'TOGAF Data Architecture',
    fields: {
      layerName: { en: 'Data Architecture', th: 'สถาปัตยกรรมข้อมูล' },
      description: { en: 'Data layer for entities and stores', th: 'ชั้นข้อมูลสำหรับเอนทิตีและที่เก็บข้อมูล' },
    },
  },
  {
    name: 'สถาปัตยกรรมเทคโนโลยี',
    description: 'TOGAF Technology Architecture',
    fields: {
      layerName: { en: 'Technology Architecture', th: 'สถาปัตยกรรมเทคโนโลยี' },
      description: { en: 'Technology layer for infrastructure', th: 'ชั้นเทคโนโลยีสำหรับโครงสร้างพื้นฐาน' },
    },
  },
  {
    name: 'สถาปัตยกรรมความมั่นคงปลอดภัย',
    description: 'TOGAF Security Architecture',
    fields: {
      layerName: { en: 'Security Architecture', th: 'สถาปัตยกรรมความมั่นคงปลอดภัย' },
      description: { en: 'Security layer for controls and compliance', th: 'ชั้นความมั่นคงปลอดภัย' },
    },
  },
  {
    name: 'สถาปัตยกรรมการเชื่อมโยง',
    description: 'TOGAF Integration Architecture',
    fields: {
      layerName: { en: 'Integration Architecture', th: 'สถาปัตยกรรมการเชื่อมโยง' },
      description: { en: 'Integration layer for interfaces', th: 'ชั้นการเชื่อมโยงและอินเตอร์เฟส' },
    },
  },
];

export const categoryTemplates: CategoryTemplate[] = [
  {
    name: 'กระบวนการธุรกิจ',
    description: 'Business Process',
    suggestedLayerKey: 'Business',
    fields: {
      categoryName: { en: 'Business Process', th: 'กระบวนการธุรกิจ' },
      description: { en: 'Business process artefact', th: 'Artefact กระบวนการธุรกิจ' },
    },
  },
  {
    name: 'ความสามารถทางธุรกิจ',
    description: 'Business Capability',
    suggestedLayerKey: 'Business',
    fields: {
      categoryName: { en: 'Business Capability', th: 'ความสามารถทางธุรกิจ' },
      description: { en: 'Business capability artefact', th: 'Artefact ความสามารถทางธุรกิจ' },
    },
  },
  {
    name: 'แอปพลิเคชัน',
    description: 'Application',
    suggestedLayerKey: 'Application',
    fields: {
      categoryName: { en: 'Application', th: 'แอปพลิเคชัน' },
      description: { en: 'Application system artefact', th: 'Artefact ระบบแอปพลิเคชัน' },
    },
  },
  {
    name: 'บริการแอปพลิเคชัน',
    description: 'Application Service',
    suggestedLayerKey: 'Application',
    fields: {
      categoryName: { en: 'Application Service', th: 'บริการแอปพลิเคชัน' },
      description: { en: 'Application service artefact', th: 'Artefact บริการแอปพลิเคชัน' },
    },
  },
  {
    name: 'เอนทิตีข้อมูล',
    description: 'Data Entity',
    suggestedLayerKey: 'Data',
    fields: {
      categoryName: { en: 'Data Entity', th: 'เอนทิตีข้อมูล' },
      description: { en: 'Data entity artefact', th: 'Artefact เอนทิตีข้อมูล' },
    },
  },
  {
    name: 'ที่เก็บข้อมูล',
    description: 'Data Store',
    suggestedLayerKey: 'Data',
    fields: {
      categoryName: { en: 'Data Store', th: 'ที่เก็บข้อมูล' },
      description: { en: 'Data store artefact', th: 'Artefact ที่เก็บข้อมูล' },
    },
  },
  {
    name: 'โครงสร้างพื้นฐาน',
    description: 'Infrastructure',
    suggestedLayerKey: 'Technology',
    fields: {
      categoryName: { en: 'Infrastructure', th: 'โครงสร้างพื้นฐาน' },
      description: { en: 'Infrastructure component', th: 'องค์ประกอบโครงสร้างพื้นฐาน' },
    },
  },
  {
    name: 'API / อินเตอร์เฟส',
    description: 'API Interface',
    suggestedLayerKey: 'Integration',
    fields: {
      categoryName: { en: 'API / Interface', th: 'API / อินเตอร์เฟส' },
      description: { en: 'API or interface artefact', th: 'Artefact API หรืออินเตอร์เฟส' },
    },
  },
];
