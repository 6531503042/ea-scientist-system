import type { LucideIcon } from 'lucide-react';
import { siteConfig, type NavItem, type NavSection } from './site';

export type AppRole = 'admin' | 'architect' | 'manager' | 'business_owner' | 'auditor' | 'viewer';

export type { NavItem };

interface MenuConfig {
  main: NavItem[];
  admin: NavItem[];
}

// Role-based permission mapping
const rolePermissions: Record<AppRole, string[]> = {
  admin: ['*'], // Full access
  architect: [
    'artefacts:read', 'artefacts:write',
    'graph:read', 'graph:write',
    'audit:read',
    'settings:read',
  ],
  manager: [
    'artefacts:read',
    'graph:read',
    'users:read',
    'audit:read',
    'organization:read',
  ],
  business_owner: [
    'artefacts:read', 'artefacts:write',
    'graph:read',
  ],
  auditor: [
    'artefacts:read',
    'graph:read',
    'audit:read',
    'users:read',
  ],
  viewer: [
    'artefacts:read',
    'graph:read',
  ],
};

function hasPermission(role: AppRole, permission?: string): boolean {
  if (!permission) return true;
  if (!permission) return true;
  const perms = rolePermissions[role] || rolePermissions['viewer'];
  if (perms.includes('*')) return true;
  return perms.some(p => permission.startsWith(p.split(':')[0]));
}

export function getMenuByRole(role: AppRole): MenuConfig {
  const sections = siteConfig.navMenuItems;

  const mainSection = sections.find(s => s.section === 'Main');
  const adminSection = sections.find(s => s.section === 'Administration');

  const filterByPermission = (items: NavItem[]) =>
    items.filter(item => hasPermission(role, item.permission));

  return {
    main: mainSection ? filterByPermission(mainSection.items) : [],
    admin: adminSection ? filterByPermission(adminSection.items) : [],
  };
}
