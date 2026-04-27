import type { LucideIcon } from "lucide-react";
import { siteConfig, type NavItem, type NavSection } from "./site";
import type { PermissionMap } from "@/features/auth/types/auth.types";
import { MENU_KEYS } from "@/lib/navigation/types";

export type AppRole =
  | "admin"
  | "architect"
  | "manager"
  | "business_owner"
  | "auditor"
  | "viewer"
  | "user"
  | "executive";

export type { NavItem };

interface MenuConfig {
  main: NavItem[];
  admin: NavItem[];
}

// Role-based permission mapping (fallback for testing/legacy)
const rolePermissions: Record<AppRole, string[]> = {
  admin: ["*"], // Full access
  architect: [
    MENU_KEYS.ARTEFACTS,
    MENU_KEYS.GRAPH,
    MENU_KEYS.AUDIT,
    MENU_KEYS.SETTINGS,
  ],
  manager: [
    MENU_KEYS.ARTEFACTS,
    MENU_KEYS.GRAPH,
    MENU_KEYS.USERS,
    MENU_KEYS.AUDIT,
  ],
  business_owner: [MENU_KEYS.ARTEFACTS, MENU_KEYS.GRAPH],
  auditor: [
    MENU_KEYS.ARTEFACTS,
    MENU_KEYS.GRAPH,
    MENU_KEYS.AUDIT,
    MENU_KEYS.USERS,
  ],
  viewer: [MENU_KEYS.ARTEFACTS, MENU_KEYS.GRAPH],
  user: [MENU_KEYS.ARTEFACTS, MENU_KEYS.GRAPH],
  executive: [MENU_KEYS.ARTEFACTS, MENU_KEYS.GRAPH, MENU_KEYS.AUDIT],
};

function hasPermission(role: AppRole, menuKey?: string): boolean {
  if (!menuKey) return true; // Items without menuKey are always visible (e.g., Dashboard)
  const perms = rolePermissions[role] || rolePermissions["viewer"];
  if (perms.includes("*")) return true;
  return perms.includes(menuKey);
}

export function getMenuByRole(role: AppRole): MenuConfig {
  const sections = siteConfig.navMenuItems;

  const mainSection = sections.find((s) => s.section === "Main");
  const adminSection = sections.find((s) => s.section === "Administration");

  const filterByPermission = (items: NavItem[]) =>
    items.filter((item) => hasPermission(role, item.menuKey));

  return {
    main: mainSection ? filterByPermission(mainSection.items) : [],
    admin: adminSection ? filterByPermission(adminSection.items) : [],
  };
}

/**
 * API-driven permission check for nav items.
 * Nav items use canonical menuKey; permission map has normalized keys.
 */
function hasPermissionFromMap(
  permissions: PermissionMap,
  menuKey?: string,
): boolean {
  if (!menuKey) return true; // Items without menuKey are always visible
  if (Object.keys(permissions).length === 0) return false; // Empty permission map blocks everything except unrestricted items

  // Check if user has any action for this menu key
  const grantedActions = permissions[menuKey] ?? [];
  return grantedActions.length > 0;
}

/**
 * Returns the sidebar menu filtered by the user's API-derived permission map.
 * Use this instead of getMenuByRole() when the Zustand store is available.
 *
 * When NEXT_PUBLIC_BYPASS_ACCESS_CONTROL=true, all menu items are shown
 * regardless of the permission map (development / testing only).
 */
export function getMenuByPermissions(permissions: PermissionMap): MenuConfig {
  const bypass = process.env.NEXT_PUBLIC_BYPASS_ACCESS_CONTROL === "true";
  const sections = siteConfig.navMenuItems;

  const mainSection = sections.find((s) => s.section === "Main");
  const adminSection = sections.find((s) => s.section === "Administration");

  if (bypass) {
    return {
      main: mainSection?.items ?? [],
      admin: adminSection?.items ?? [],
    };
  }

  const filterByPermMap = (items: NavItem[]) =>
    items.filter((item) => hasPermissionFromMap(permissions, item.menuKey));

  return {
    main: mainSection ? filterByPermMap(mainSection.items) : [],
    admin: adminSection ? filterByPermMap(adminSection.items) : [],
  };
}
