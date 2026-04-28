export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    logoutAll: "/auth/logout-all",
  },
  accessControl: {
    me: "/access-control/me",
    roles: "/access-control/roles",
    roleById: (id: number | string) => `/access-control/roles/${id}`,
    roleStatus: (id: number | string) => `/access-control/roles/${id}/status`,
    rolePermissionTokens: (roleId: number | string) =>
      `/access-control/roles/${roleId}/permission-tokens`,
    rolePermissionTokensPreview: (roleId: number | string) =>
      `/access-control/roles/${roleId}/permission-tokens/preview`,
    permissionCatalog: "/access-control/permission-catalog",
  },
  users: {
    me: "/users/me",
    list: "/users",
    byId: (id: number | string) => `/users/${id}`,
    create: "/users",
    update: (id: number | string) => `/users/${id}`,
    delete: (id: number | string) => `/users/${id}`,
  },
  departments: {
    list: "/departments",
    byId: (id: number | string) => `/departments/${id}`,
    create: "/departments",
    update: (id: number | string) => `/departments/${id}`,
    delete: (id: number | string) => `/departments/${id}`,
  },
  artefacts: {
    list: "/artefacts",
    export: "/artefacts/export",
    byId: (id: number | string) => `/artefacts/${id}`,
    create: "/artefacts",
    update: (id: number | string) => `/artefacts/${id}`,
    delete: (id: number | string) => `/artefacts/${id}`,
  },
  architectureLayers: {
    list: "/architecture-layers",
    byId: (id: number | string) => `/architecture-layers/${id}`,
    create: "/architecture-layers",
    update: (id: number | string) => `/architecture-layers/${id}`,
    delete: (id: number | string) => `/architecture-layers/${id}`,
  },
  categories: {
    list: "/categories",
    byId: (id: number | string) => `/categories/${id}`,
    create: "/categories",
    update: (id: number | string) => `/categories/${id}`,
    delete: (id: number | string) => `/categories/${id}`,
  },
  relationshipTypes: {
    list: "/relationship-types",
    byId: (id: number | string) => `/relationship-types/${id}`,
    create: "/relationship-types",
    update: (id: number | string) => `/relationship-types/${id}`,
    delete: (id: number | string) => `/relationship-types/${id}`,
  },
  relationships: {
    list: "/relationships",
    byId: (id: number | string) => `/relationships/${id}`,
    create: "/relationships",
    delete: (id: number | string) => `/relationships/${id}`,
  },
  auditLogs: {
    list: "/audit-logs",
    stats: "/audit-logs/stats",
    create: "/audit-logs",
  },
} as const;
