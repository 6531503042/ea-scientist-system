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
  return {
    _id: String(apiUser?.id ?? ""),
    name: {
      first: apiUser?.firstName ?? "",
      last: apiUser?.lastName,
    },
    displayName:
      apiUser?.fullName ||
      `${apiUser?.firstName ?? ""} ${apiUser?.lastName ?? ""}`.trim(),
    username:
      apiUser?.username ||
      (apiUser?.email ? String(apiUser.email).split("@")[0] : ""),
    email: apiUser?.email ?? "",
    role:
      apiUser?.roleName ||
      apiUser?.role?.roleName ||
      apiUser?.role?.name ||
      "viewer",
    department:
      apiUser?.departmentName ||
      apiUser?.department?.shortName ||
      apiUser?.department?.fullName ||
      undefined,
    status: mapActiveStatus(apiUser?.status, apiUser?.isActive),
    lastLogin: toIso(apiUser?.lastLoginAt),
    createdAt: toIso(apiUser?.createdAt),
    updatedAt: toIso(apiUser?.updatedAt),
  };
}

export function mapApiRole(apiRole: any): Role {
  const roleName = apiRole?.roleName || apiRole?.name || "";

  return {
    _id: String(apiRole?.id ?? ""),
    name: roleName,
    nameTh: roleName,
    description: apiRole?.description || "",
    permissions: apiRole?.permissions || [],
    isDefault: Boolean(apiRole?.isDefault),
    isSystemRole: Boolean(apiRole?.isSystemRole),
    userCount: apiRole?.userCount || 0,
    color: apiRole?.color || "bg-gray-500/10 text-gray-700 border-gray-200",
    createdAt: toIso(apiRole?.createdAt),
    updatedAt: toIso(apiRole?.updatedAt),
  };
}

export function mapApiDepartment(apiDept: any): Department {
  return {
    _id: String(apiDept?.id ?? ""),
    code: apiDept?.shortName || "",
    name: apiDept?.fullName || "",
    nameTh: apiDept?.fullName || "",
    description: apiDept?.description,
    parent: apiDept?.parentId ? String(apiDept.parentId) : undefined,
    head: "-",
    memberCount: apiDept?.userCount || 0,
    userCount: apiDept?.userCount || 0,
    status: mapActiveStatus(apiDept?.status, apiDept?.isActive),
    createdAt: toIso(apiDept?.createdAt),
    updatedAt: toIso(apiDept?.updatedAt),
  };
}
