import type { Department } from "@/types/department";
import type { Role } from "@/types/role";
import type { User } from "@/types/user";

function toIso(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function mapActiveStatus(
  status: unknown,
  fallbackIsActive?: boolean,
): "active" | "inactive" {
  const normalized =
    typeof status === "string" ? status.toUpperCase() : undefined;
  if (normalized === "ACTIVE") return "active";
  if (
    normalized === "INACTIVE" ||
    normalized === "LOCKED" ||
    normalized === "RETIRED"
  )
    return "inactive";
  return fallbackIsActive ? "active" : "inactive";
}

export function mapApiUser(apiUser: any): User {
  const firstName = apiUser?.firstName ?? apiUser?.first_name ?? "";
  const lastName = apiUser?.lastName ?? apiUser?.last_name ?? "";
  const isActive = apiUser?.isActive ?? apiUser?.is_active;
  const lastLoginAt = apiUser?.lastLoginAt ?? apiUser?.last_login_at;
  const createdAt = apiUser?.createdAt ?? apiUser?.created_at;
  const updatedAt = apiUser?.updatedAt ?? apiUser?.updated_at;

  // Department: supports both camelCase (fullName) and snake_case (full_name)
  const dept = apiUser?.department;
  const deptName =
    dept?.fullName ??
    dept?.full_name ??
    dept?.name ??
    apiUser?.departmentName ??
    undefined;

  return {
    _id: String(apiUser?.id ?? ""),
    name: { first: firstName, last: lastName },
    displayName: `${firstName} ${lastName}`.trim(),
    username:
      apiUser?.username ||
      (apiUser?.email ? String(apiUser.email).split("@")[0] : ""),
    email: apiUser?.email ?? "",
    role:
      apiUser?.role?.roleKey ??
      apiUser?.role?.role_key ??
      apiUser?.role?.name ??
      apiUser?.roleName ??
      "viewer",
    department: deptName,
    status: mapActiveStatus(apiUser?.status, isActive),
    lastLogin: toIso(lastLoginAt),
    createdAt: toIso(createdAt),
    updatedAt: toIso(updatedAt),
  };
}

export function mapApiRole(apiRole: any): Role {
  const roleName = apiRole?.name ?? apiRole?.roleName ?? "";
  const roleKey: string = apiRole?.roleKey ?? apiRole?.role_key ?? "";

  return {
    _id: String(apiRole?.id ?? ""),
    name: roleName,
    nameTh: roleName,
    description: apiRole?.description || "",
    permissions: apiRole?.permissions || [],
    isDefault: Boolean(apiRole?.isDefault),
    // Treat level-0 or admin/administrator keys as system roles
    isSystemRole:
      Boolean(apiRole?.isSystemRole) ||
      apiRole?.level === 0 ||
      ["admin", "administrator"].includes(roleKey),
    userCount: apiRole?._count?.users ?? apiRole?.userCount ?? 0,
    color: apiRole?.color || "bg-gray-500/10 text-gray-700 border-gray-200",
    createdAt: toIso(apiRole?.createdAt ?? apiRole?.created_at),
    updatedAt: toIso(apiRole?.updatedAt ?? apiRole?.updated_at),
    // Extra fields for API operations
    ...(roleKey && { roleKey }),
    ...(apiRole?.level !== undefined && { level: apiRole.level }),
    ...(apiRole?.isActive !== undefined && { isActive: apiRole.isActive }),
  } as Role & { roleKey?: string; level?: number; isActive?: boolean };
}

export function mapApiDepartment(apiDept: any): Department {
  // Departments endpoint returns camelCase (shortName, fullName, isActive)
  const shortName = apiDept?.shortName ?? apiDept?.short_name ?? "";
  const fullName = apiDept?.fullName ?? apiDept?.full_name ?? "";
  const isActive = apiDept?.isActive ?? apiDept?.is_active ?? true;

  return {
    _id: String(apiDept?.id ?? ""),
    code: shortName,
    name: fullName,
    nameTh: fullName,
    description: apiDept?.description,
    parent:
      (apiDept?.parentId ?? apiDept?.parent_id)
        ? String(apiDept.parentId ?? apiDept.parent_id)
        : undefined,
    head: "-",
    memberCount: apiDept?.userCount ?? apiDept?.user_count ?? 0,
    userCount: apiDept?.userCount ?? apiDept?.user_count ?? 0,
    status: isActive ? "active" : "inactive",
    createdAt: toIso(apiDept?.createdAt ?? apiDept?.created_at),
    updatedAt: toIso(apiDept?.updatedAt ?? apiDept?.updated_at),
  };
}
