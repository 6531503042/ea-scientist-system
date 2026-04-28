const COOKIE_NAMES = [
  "access_token",
  "refresh_token",
  "accessToken",
  "refreshToken",
  "session",
] as const;

export function clearClientAuthState(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem("auth-storage");
  } catch {
    // ignore storage failures in private/restricted modes
  }

  for (const name of COOKIE_NAMES) {
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
  }
}
