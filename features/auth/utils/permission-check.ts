import { getMenuRegistry } from "@/lib/navigation/types";
import type { PermissionMap } from "@/features/auth/types/auth.types";

const DEFAULT_REQUIRED_ACTION = "read";

export function canAccessMenuByPermissions(
  permissions: PermissionMap,
  menuKey: string,
  requiredAction: string = DEFAULT_REQUIRED_ACTION,
): boolean {
  const menu = getMenuRegistry().find((item) => item.key === menuKey);
  if (!menu) {
    return false;
  }

  const grantedActions = permissions[menuKey] ?? [];
  return grantedActions.includes(requiredAction);
}
