import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

/**
 * Same-origin base URL — Next.js rewrites /api/v1/:path* → NestJS backend.
 * If NEXT_PUBLIC_API_URL is explicitly set (e.g. in Docker / production), use that.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/* ── Request: inject JWT Bearer token from Zustand persisted state ── */
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("auth-storage");
      if (raw) {
        const parsed = JSON.parse(raw);
        const token: string | undefined = parsed?.state?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      /* ignore malformed storage */
    }
  }
  return config;
});

/* ── Response: auto-refresh on 401 with queuing ── */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };
    const requestUrl: string = originalRequest?.url ?? "";
    const isAuthFlowRequest =
      requestUrl.includes(API_ENDPOINTS.auth.login) ||
      requestUrl.includes(API_ENDPOINTS.auth.refresh) ||
      requestUrl.includes(API_ENDPOINTS.auth.logout);

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isAuthFlowRequest
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.auth.refresh}`,
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      const newAccessToken: string = data.data.access_token;

      // Persist the refreshed token so future requests use it
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("auth-storage");
          const parsed = raw ? JSON.parse(raw) : null;
          if (parsed?.state) {
            parsed.state.accessToken = newAccessToken;
            localStorage.setItem("auth-storage", JSON.stringify(parsed));
          }
        } catch {
          /* ignore */
        }
      }

      processQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      // Clear persisted auth and send user to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-storage");
        document.cookie = "session=; Path=/; Max-Age=0; SameSite=Lax";
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
