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
        // Mock data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    total: 125,
                    byType: [
                        { type: 'Service', count: 45 },
                        { type: 'Application', count: 30 },
                        { type: 'Data', count: 25 },
                        { type: 'Technology', count: 25 }
                    ],
                    byRisk: [
                        { riskLevel: 'High', count: 15 },
                        { riskLevel: 'Medium', count: 45 },
                        { riskLevel: 'Low', count: 65 }
                    ],
                    byStatus: [
                        { status: 'Active', count: 90 },
                        { status: 'Review', count: 20 },
                        { status: 'Archived', count: 15 }
                    ]
                });
            }, 500);
        });
    },

    getArtefacts: async (): Promise<ApiResponse<Artefact[]>> => {
        // Mock data
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockArtefacts: Artefact[] = Array.from({ length: 10 }).map((_, i) => ({
                    _id: `art-${i + 1}`,
                    name: `Artefact ${i + 1}`,
                    nameTh: `สิ่งประดิษฐ์ ${i + 1}`,
                    type: ['Service', 'Application', 'Data', 'Technology'][Math.floor(Math.random() * 4)],
                    description: 'This is a mock artefact description.',
                    owner: 'John Doe',
                    department: 'IT',
                    status: ['Active', 'Review', 'Archived'][Math.floor(Math.random() * 3)],
                    riskLevel: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
                    version: '1.0.0',
                    usageFrequency: 'Daily',
                    dependencies: Math.floor(Math.random() * 5),
                    dependents: Math.floor(Math.random() * 5),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }));

                resolve({
                    data: mockArtefacts,
                    meta: {
                        total: 10,
                        page: 1,
                        limit: 10,
                        totalPages: 1
                    }
                });
            }, 500);
        });
    }
};
