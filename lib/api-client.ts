/**
 * Centralized API Client for making requests to our backend APIs.
 * It automatically parses JSON responses, throws standard Errors if the response is not OK,
 * and standardizes headers.
 */
export const apiClient = {
    async request<T = any>(url: string, init?: RequestInit): Promise<T> {
        const res = await fetch(url, {
            credentials: 'include',
            ...init,
            headers: {
                'Content-Type': 'application/json',
                ...init?.headers,
            },
        });

        const contentType = res.headers.get('content-type') || '';
        const canParseJson = contentType.includes('application/json');
        const result = canParseJson ? await res.json() : null;

        if (!res.ok) {
            const message = result?.message || result?.error || `Request failed with status ${res.status}`;
            throw new Error(message);
        }

        if (!result) {
            return undefined as T;
        }

        return result.data !== undefined ? result.data : result;
    },

    async get<T = any>(url: string, options?: RequestInit): Promise<T> {
        return this.request<T>(url, {
            method: 'GET',
            ...options,
        });
    },

    async post<T = any>(url: string, data: any, options?: RequestInit): Promise<T> {
        return this.request<T>(url, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options,
        });
    },

    async put<T = any>(url: string, data: any, options?: RequestInit): Promise<T> {
        return this.request<T>(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options,
        });
    },

    async delete<T = any>(url: string, options?: RequestInit): Promise<T> {
        return this.request<T>(url, {
            method: 'DELETE',
            ...options,
        });
    }
};
