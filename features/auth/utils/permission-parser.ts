import { getMenuRegistry } from "@/lib/navigation/types";
import type { PermissionMap } from "@/features/auth/types/auth.types";

function canonicalizeMenuKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function resolveMenuKey(resource: string, knownMenuKeys: Set<string>) {
  const normalized = resource.toLowerCase().trim().replace(/:/g, ".");

  if (knownMenuKeys.has(normalized)) {
    return normalized;
  }

  const canonical = canonicalizeMenuKey(normalized);
  const matches: string[] = [];

  for (const key of knownMenuKeys) {
    if (canonicalizeMenuKey(key) === canonical) {
      matches.push(key);
    }
  }

  return matches.length === 1 ? matches[0] : normalized;
}

export function buildPermissionMapFromTokens(tokens: string[]): PermissionMap {
  const permissionMap: PermissionMap = {};
  const knownMenuKeys = new Set(getMenuRegistry().map((item) => item.key));

  for (const rawToken of tokens) {
    const token = rawToken.trim().toLowerCase();
    if (!token) {
      continue;
    }

    const separatorIndex = token.lastIndexOf(".");
    if (separatorIndex <= 0 || separatorIndex >= token.length - 1) {
      continue;
    }

    const resource = token.slice(0, separatorIndex);
    const action = token.slice(separatorIndex + 1);
    const menuKey = resolveMenuKey(resource, knownMenuKeys);

    if (!permissionMap[menuKey]) {
      permissionMap[menuKey] = [];
    }

    if (!permissionMap[menuKey].includes(action)) {
      permissionMap[menuKey].push(action);
    }
  }

  for (const key of Object.keys(permissionMap)) {
    permissionMap[key].sort();
  }

  return permissionMap;
}
