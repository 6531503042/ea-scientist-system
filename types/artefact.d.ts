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

export type ArtefactStatus = 'draft' | 'active' | 'deprecated' | 'archived';

export type ArtefactClassification = 'public' | 'internal' | 'confidential' | 'restricted';

export type ArtefactRelation = {
    _id: string;
    targetId: string;
    type: 'uses' | 'depends_on' | 'owns' | 'manages' | 'contains' | 'integrates_with';
    description?: string;
};

export type Artefact = {
    _id: string;
    name: string;
    nameTh?: string;
    type: ArtefactType;
    description?: string;
    status: ArtefactStatus;
    classification: ArtefactClassification;
    owner?: string;
    department?: string;
    version?: string;
    relations: ArtefactRelation[];
    attributes: Record<string, unknown>;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
};

export type CreateArtefactInput = Omit<Artefact, '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;
export type UpdateArtefactInput = Partial<CreateArtefactInput>;

// Type-specific attributes
export type BusinessArtefactAttributes = {
    processOwner?: string;
    businessFunction?: string;
    stakeholders?: string[];
    kpis?: string[];
};

export type ApplicationArtefactAttributes = {
    vendor?: string;
    version?: string;
    platform?: string;
    deploymentType?: 'on-premise' | 'cloud' | 'hybrid';
    maintenanceWindow?: string;
};

export type DataArtefactAttributes = {
    dataOwner?: string;
    dataClassification?: string;
    retentionPeriod?: string;
    storageLocation?: string;
};

export type TechnologyArtefactAttributes = {
    vendor?: string;
    model?: string;
    location?: string;
    capacity?: string;
    expiryDate?: string;
};

export type SecurityArtefactAttributes = {
    securityLevel?: string;
    complianceFramework?: string[];
    lastAuditDate?: string;
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
};

export type IntegrationArtefactAttributes = {
    protocol?: string;
    dataFormat?: string;
    frequency?: string;
    sourceSystem?: string;
    targetSystem?: string;
};
