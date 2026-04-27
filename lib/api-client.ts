/**
 * Centralized API Client for making requests to our backend APIs.
 * It automatically parses JSON responses, throws standard Errors if the response is not OK,
 * and standardizes headers.
 */
import { API_ENDPOINTS } from "@/lib/api/endpoints";

const EXTERNAL_API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || "/api/v1";
const RETRY_HEADER = "x-auth-retried";

let refreshPromise: Promise<string> | null = null;

function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed?.state?.accessToken || null;
  } catch {
    return null;
  }
}

export function resolveApiUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  // Prefer same-origin API paths so Next.js rewrites can proxy requests
  // and avoid browser CORS issues when frontend/backend run on different ports.
  if (url.startsWith("/api/")) {
    return url;
  }

  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${EXTERNAL_API_PREFIX}${normalizedPath}`;
}

function isAuthFlowRequest(url: string): boolean {
  const resolved = resolveApiUrl(url);
  return (
    resolved.includes(API_ENDPOINTS.auth.login) ||
    resolved.includes(API_ENDPOINTS.auth.refresh) ||
    resolved.includes(API_ENDPOINTS.auth.logout)
  );
}

function persistAccessToken(token: string) {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem("auth-storage");
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed?.state) {
      parsed.state.accessToken = token;
      localStorage.setItem("auth-storage", JSON.stringify(parsed));
    }
  } catch {
    // noop
  }
}

function clearAuthAndRedirectToLogin() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("auth-storage");
  document.cookie = "session=; Path=/; Max-Age=0; SameSite=Lax";
  window.location.href = "/login";
}

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const res = await fetch(resolveApiUrl(API_ENDPOINTS.auth.refresh), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      throw new Error("Unable to refresh session");
    }

    const payload = await res.json().catch(() => null);
    const token = payload?.data?.access_token || payload?.access_token;

    if (!token || typeof token !== "string") {
      throw new Error("Refresh response missing access token");
    }

    persistAccessToken(token);
    return token;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export const apiClient = {
  async request<T = any>(url: string, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers || {});
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const accessToken = getStoredAccessToken();
    if (accessToken && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const res = await fetch(resolveApiUrl(url), {
      credentials: "include",
      ...init,
      headers,
    });

    const contentType = res.headers.get("content-type") || "";
    const canParseJson = contentType.includes("application/json");
    const result = canParseJson ? await res.json() : null;

    if (!res.ok) {
      if (
        res.status === 401 &&
        !headers.has(RETRY_HEADER) &&
        !isAuthFlowRequest(url)
      ) {
        try {
          const newToken = await refreshAccessToken();
          const retryHeaders = new Headers(init?.headers || {});
          retryHeaders.set("Authorization", `Bearer ${newToken}`);
          retryHeaders.set(RETRY_HEADER, "1");

          return this.request(url, {
            ...init,
            headers: retryHeaders,
          }) as Promise<T>;
        } catch {
          clearAuthAndRedirectToLogin();
          throw new Error("Session expired. Please login again.");
        }
      }

      const message =
        result?.message ||
        result?.error ||
        `Request failed with status ${res.status}`;
      throw new Error(message);
    }

    if (!result) {
      return undefined as T;
    }

    return result.data !== undefined ? result.data : result;
  },

  async get<T = any>(url: string, options?: RequestInit): Promise<T> {
    return this.request(url, {
      method: "GET",
      ...options,
    }) as Promise<T>;
  },

  async post<T = any>(
    url: string,
    data: any,
    options?: RequestInit,
  ): Promise<T> {
    return this.request(url, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    }) as Promise<T>;
  },

  async put<T = any>(
    url: string,
    data: any,
    options?: RequestInit,
  ): Promise<T> {
    return this.request(url, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    }) as Promise<T>;
  },

  async delete<T = any>(url: string, options?: RequestInit): Promise<T> {
    return this.request(url, {
      method: "DELETE",
      ...options,
    }) as Promise<T>;
  },
};
