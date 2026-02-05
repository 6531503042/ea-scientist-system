/**
 * Navigation Type Definitions
 */

import { LucideIcon } from 'lucide-react';

export type NavItem = {
    label: string;
    labelTh?: string;
    href: string;
    icon: LucideIcon;
    permission?: string;
    badge?: string | number;
};

export type NavSection = {
    section: string;
    sectionTh?: string;
    items: NavItem[];
};

export type SiteConfig = {
    name: string;
    shortName: string;
    description: string;
    organization: string;
    navMenuItems: NavSection[];
};
