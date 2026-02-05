import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Layers,
  Network,
  Users,
  Shield,
  Settings,
  Wifi,
  Building2,
} from 'lucide-react';

export type NavItem = {
  icon: LucideIcon;
  label: string;
  labelTh: string;
  href: string;
  permission?: string;
  badge?: number | string;
};

export type NavSection = {
  section: string;
  sectionTh: string;
  items: NavItem[];
};

const rawNavMenuItems: NavSection[] = [
  {
    section: 'Main',
    sectionTh: 'หลัก',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', labelTh: 'แดชบอร์ด', href: '/' },
      { icon: Layers, label: 'Artefacts', labelTh: 'รายการ Artefact', href: '/artefacts', permission: 'artefacts:read' },
      { icon: Network, label: 'Architecture Map', labelTh: 'แผนผังสถาปัตยกรรม', href: '/graph', permission: 'graph:read' },
    ],
  },
  {
    section: 'Administration',
    sectionTh: 'การจัดการ',
    items: [
      { icon: Users, label: 'Users', labelTh: 'ผู้ใช้งาน', href: '/users', permission: 'users:read' },
      { icon: Shield, label: 'Audit Log', labelTh: 'บันทึกการใช้งาน', href: '/audit', permission: 'audit:read' },
      { icon: Settings, label: 'Settings', labelTh: 'ตั้งค่า', href: '/settings', permission: 'settings:read' },
    ],
  },
];

export const siteConfig = {
  name: 'EA Management System',
  shortName: 'EA Management',
  description: 'ระบบจัดการสถาปัตยกรรมองค์กรของกรมวิทยาศาสตร์บริการ',
  organization: 'กรมวิทยาศาสตร์บริการ',
  navMenuItems: rawNavMenuItems,
};

export type SiteConfig = typeof siteConfig;
