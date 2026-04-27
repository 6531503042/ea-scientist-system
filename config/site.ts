import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Layers,
  Network,
  Users,
  Shield,
  Settings,
  Wifi,
  Building2,
} from "lucide-react";
import { MENU_KEYS, type MenuKey } from "@/lib/navigation/types";

export type NavItem = {
  icon: LucideIcon;
  label: string;
  labelTh: string;
  href: string;
  menuKey?: MenuKey;
  badge?: number | string;
};

export type NavSection = {
  section: string;
  sectionTh: string;
  items: NavItem[];
};

const rawNavMenuItems: NavSection[] = [
  {
    section: "Main",
    sectionTh: "หลัก",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        labelTh: "แดชบอร์ด",
        href: "/dashboard",
        menuKey: MENU_KEYS.DASHBOARD,
      },
      {
        icon: Layers,
        label: "Artefacts",
        labelTh: "รายการ Artefact",
        href: "/artefacts",
        menuKey: MENU_KEYS.ARTEFACTS,
      },
      {
        icon: Network,
        label: "Architecture Map",
        labelTh: "แผนผังสถาปัตยกรรม",
        href: "/graph",
        menuKey: MENU_KEYS.GRAPH,
      },
    ],
  },
  {
    section: "Administration",
    sectionTh: "การจัดการ",
    items: [
      {
        icon: Users,
        label: "Users",
        labelTh: "ผู้ใช้งาน",
        href: "/users",
        menuKey: MENU_KEYS.USERS,
      },
      {
        icon: Shield,
        label: "Audit Log",
        labelTh: "บันทึกการใช้งาน",
        href: "/audit",
        menuKey: MENU_KEYS.AUDIT,
      },
      {
        icon: Settings,
        label: "Settings",
        labelTh: "ตั้งค่า",
        href: "/settings",
        menuKey: MENU_KEYS.SETTINGS,
      },
    ],
  },
];

export const siteConfig = {
  name: "EA Management System",
  shortName: "EA Management",
  description: "ระบบจัดการสถาปัตยกรรมองค์กรของกรมวิทยาศาสตร์บริการ",
  organization: "กรมวิทยาศาสตร์บริการ",
  navMenuItems: rawNavMenuItems,
};

export type SiteConfig = typeof siteConfig;
