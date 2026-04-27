export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
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
} as const;
