/**
 * EA Artefact Type Definitions
 * Based on TOGAF Framework
 */

export type ArtefactType =
    | 'business'
    | 'application'
    | 'data'
    | 'technology'
    | 'security'
    | 'integration';

export type ArtefactStatus = 'active' | 'draft' | 'deprecated' | 'planned' | 'archived';

export type RiskLevel = 'high' | 'medium' | 'low' | 'none';

export type UsageFrequency = 'high' | 'medium' | 'low';

export type Artefact = {
    id: string;
    name: string;
    nameTh: string; // Required in mockData
    type: ArtefactType;
    description: string;
    owner: string;
    department: string;
    /** ID of responsible user - for Edit form prefill */
    ownerId?: number;
    /** ID of owner department - for Edit form prefill */
    departmentId?: number;
    status: ArtefactStatus;
    riskLevel: RiskLevel;
    lastUpdated: string; // ISO Date string
    version: string;
    usageFrequency: UsageFrequency;
    dependencies: number;
    dependents: number;

    // Optional attributes for detail view
    classification?: 'public' | 'internal' | 'confidential' | 'restricted';
    attributes?: Record<string, unknown>;
    tags?: string[];
};

export type RelationshipType = 'supports' | 'uses' | 'depends_on' | 'manages' | 'integrates_with';

export interface Relationship {
    id: string;
    source: string;
    target: string;
    type: RelationshipType;
    label: string;
}

export interface DashboardMetric {
    label: string;
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
    icon: string;
}

export interface ArtefactVersion {
    id: string;
    artefactId: string;
    version: string;
    changes: string;
    changedBy: string;
    changedAt: string;
    previousVersion: string | null;
}
