/**
 * Centralized API Client for making requests to our backend APIs.
 * It automatically parses JSON responses, throws standard Errors if the response is not OK,
 * and standardizes headers.
 */
export const apiClient = {
    async get<T = any>(url: string, options?: RequestInit): Promise<T> {
        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.error || 'Failed to fetch data');
        }
        return result.data !== undefined ? result.data : result;
    },

    async post<T = any>(url: string, data: any, options?: RequestInit): Promise<T> {
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.error || 'Failed to create data');
        }
        return result.data !== undefined ? result.data : result;
    },

    async put<T = any>(url: string, data: any, options?: RequestInit): Promise<T> {
        const res = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.error || 'Failed to update data');
        }
        return result.data !== undefined ? result.data : result;
    },

    async delete<T = any>(url: string, options?: RequestInit): Promise<T> {
        const res = await fetch(url, {
            method: 'DELETE',
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.error || 'Failed to delete data');
        }
        return result.data !== undefined ? result.data : result;
    }
};
