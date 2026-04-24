/**
 * Centralized API Client for making requests to our backend APIs.
 * It automatically parses JSON responses, throws standard Errors if the response is not OK,
 * and standardizes headers.
 */
const EXTERNAL_API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || "/api/v1";

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

export const apiClient = {
  async request<T = any>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(resolveApiUrl(url), {
      credentials: "include",
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    const contentType = res.headers.get("content-type") || "";
    const canParseJson = contentType.includes("application/json");
    const result = canParseJson ? await res.json() : null;

    if (!res.ok) {
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
    return this.request<T>(url, {
      method: "GET",
      ...options,
    });
  },

  async post<T = any>(
    url: string,
    data: any,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  },

  async put<T = any>(
    url: string,
    data: any,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  },

  async delete<T = any>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      method: "DELETE",
      ...options,
    });
  },
};
