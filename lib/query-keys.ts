/**
 * A central query key factory for React Query to ensure consistency
 * and prevent typos across the application.
 */
export const queryKeys = {
  departments: {
    all: ["departments"] as const,
  },
  roles: {
    all: ["roles"] as const,
    list: (params?: Record<string, unknown>) =>
      ["roles", "list", params] as const,
    detail: (id: number | string) => ["roles", "detail", id] as const,
  },
  accessControl: {
    me: ["access-control", "me"] as const,
    permissionCatalog: ["access-control", "permission-catalog"] as const,
  },
  users: {
    all: ["users"] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  artefacts: {
    all: ["artefacts"] as const,
    detail: (id: string) => ["artefacts", id] as const,
  },
  audit: {
    all: (filters: Record<string, any>) => ["auditLogs", filters] as const,
    stats: ["auditStats"] as const,
  },
  architectureLayers: {
    all: ["architecture-layers"] as const,
  },
  relationshipTypes: {
    all: ["relationship-types"] as const,
  },
  relationships: {
    all: ["relationships"] as const,
    byArtefact: (artefactId?: string) => ["relationships", artefactId] as const,
  },
  artefactVersions: {
    all: (artefactId?: string) => ["artefact-versions", artefactId] as const,
  },
} as const;
