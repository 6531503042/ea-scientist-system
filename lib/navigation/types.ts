/**
 * Frontend-owned canonical menu/system keys
 * These are the source of truth for permission and route authorization
 */

export const MENU_KEYS = {
  DASHBOARD: "dashboard",
  ARTEFACTS: "artefacts",
  GRAPH: "graph",
  USERS: "users",
  AUDIT: "audit",
  SETTINGS: "settings",
} as const;

export type MenuKey = (typeof MENU_KEYS)[keyof typeof MENU_KEYS];

export const MENU_ACTIONS = {
  READ: "read",
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  WRITE: "write",
} as const;

export type MenuAction = (typeof MENU_ACTIONS)[keyof typeof MENU_ACTIONS];

/**
 * Registry item defines metadata for each menu/system resource
 */
export interface MenuRegistryItem {
  key: MenuKey;
  label: string;
  labelTh: string;
  path: string | null;
  availableActions: readonly MenuAction[];
  sidebarVisible: boolean;
}

export const MENU_REGISTRY: Record<MenuKey, MenuRegistryItem> = {
  [MENU_KEYS.DASHBOARD]: {
    key: MENU_KEYS.DASHBOARD,
    label: "Dashboard",
    labelTh: "แดชบอร์ด",
    path: "/dashboard",
    availableActions: [MENU_ACTIONS.READ],
    sidebarVisible: true,
  },
  [MENU_KEYS.ARTEFACTS]: {
    key: MENU_KEYS.ARTEFACTS,
    label: "Artefacts",
    labelTh: "รายการ Artefact",
    path: "/artefacts",
    availableActions: [
      MENU_ACTIONS.READ,
      MENU_ACTIONS.CREATE,
      MENU_ACTIONS.UPDATE,
      MENU_ACTIONS.DELETE,
    ],
    sidebarVisible: true,
  },
  [MENU_KEYS.GRAPH]: {
    key: MENU_KEYS.GRAPH,
    label: "Architecture Map",
    labelTh: "แผนผังสถาปัตยกรรม",
    path: "/graph",
    availableActions: [MENU_ACTIONS.READ],
    sidebarVisible: true,
  },
  [MENU_KEYS.USERS]: {
    key: MENU_KEYS.USERS,
    label: "Users",
    labelTh: "ผู้ใช้งาน",
    path: "/users",
    availableActions: [
      MENU_ACTIONS.READ,
      MENU_ACTIONS.CREATE,
      MENU_ACTIONS.UPDATE,
      MENU_ACTIONS.DELETE,
    ],
    sidebarVisible: true,
  },
  [MENU_KEYS.AUDIT]: {
    key: MENU_KEYS.AUDIT,
    label: "Audit Log",
    labelTh: "บันทึกการใช้งาน",
    path: "/audit",
    availableActions: [MENU_ACTIONS.READ],
    sidebarVisible: true,
  },
  [MENU_KEYS.SETTINGS]: {
    key: MENU_KEYS.SETTINGS,
    label: "Settings",
    labelTh: "ตั้งค่า",
    path: "/settings",
    availableActions: [MENU_ACTIONS.READ, MENU_ACTIONS.UPDATE],
    sidebarVisible: true,
  },
};

export function getMenuRegistry(): MenuRegistryItem[] {
  return Object.values(MENU_REGISTRY);
}

export function getMenuRegistryItem(
  key: MenuKey,
): MenuRegistryItem | undefined {
  return MENU_REGISTRY[key];
}

/**
 * Helper: map various backend resource names to canonical frontend menu keys
 * Handles both dot-separated (resource.action) and underscore-separated (action_resource) formats
 */
export function normalizeResourceToMenuKey(resource: string): MenuKey | null {
  const normalized = resource.toLowerCase().trim();

  // Direct matches
  if (normalized === MENU_KEYS.DASHBOARD) return MENU_KEYS.DASHBOARD;
  if (normalized === MENU_KEYS.ARTEFACTS) return MENU_KEYS.ARTEFACTS;
  if (normalized === MENU_KEYS.GRAPH) return MENU_KEYS.GRAPH;
  if (normalized === MENU_KEYS.USERS) return MENU_KEYS.USERS;
  if (normalized === MENU_KEYS.AUDIT) return MENU_KEYS.AUDIT;
  if (normalized === MENU_KEYS.SETTINGS) return MENU_KEYS.SETTINGS;

  // Handle alternative names
  const alternativeNames: Record<string, MenuKey> = {
    "architecture-map": MENU_KEYS.GRAPH,
    "audit-log": MENU_KEYS.AUDIT,
    "audit-logs": MENU_KEYS.AUDIT,
    audit_log: MENU_KEYS.AUDIT,
    audit_logs: MENU_KEYS.AUDIT,
    "user-management": MENU_KEYS.USERS,
    user_management: MENU_KEYS.USERS,
    iam: MENU_KEYS.USERS,
    "access-control": MENU_KEYS.USERS,
    reports: MENU_KEYS.SETTINGS,
    export: MENU_KEYS.ARTEFACTS,
    export_data: MENU_KEYS.ARTEFACTS,
    data: MENU_KEYS.SETTINGS,
    roles: MENU_KEYS.SETTINGS,
    role: MENU_KEYS.SETTINGS,
  };

  return alternativeNames[normalized] || null;
}
