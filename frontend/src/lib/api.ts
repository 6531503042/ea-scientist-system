export const API_BASE = '/api/v1';

export interface ApiResponse<T> {
    data: T;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ArtefactStats {
    total: number;
    byType: { type: string; count: number }[];
    byRisk: { riskLevel: string; count: number }[];
    byStatus: { status: string; count: number }[];
}

export interface Artefact {
    _id: string;
    name: string;
    nameTh: string;
    type: string;
    description: string;
    owner: string;
    department: string;
    status: string;
    riskLevel: string;
    version: string;
    usageFrequency: string;
    dependencies: number;
    dependents: number;
    createdAt?: string;
    updatedAt?: string;
}

export const api = {
    getStats: async (): Promise<ArtefactStats> => {
        const res = await fetch(`${API_BASE}/artefacts/stats`);
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
    },

    getArtefacts: async (): Promise<ApiResponse<Artefact[]>> => {
        const res = await fetch(`${API_BASE}/artefacts`);
        if (!res.ok) throw new Error('Failed to fetch artefacts');
        return res.json();
    }
};
