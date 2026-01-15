import {
    IsString,
    IsOptional,
    IsEnum,
    IsInt,
    Min,
} from 'class-validator';

export enum ArtefactType {
    BUSINESS = 'business',
    DATA = 'data',
    APPLICATION = 'application',
    TECHNOLOGY = 'technology',
    SECURITY = 'security',
    INTEGRATION = 'integration',
}

export enum ArtefactStatus {
    ACTIVE = 'active',
    DRAFT = 'draft',
    DEPRECATED = 'deprecated',
    PLANNED = 'planned',
}

export enum RiskLevel {
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low',
    NONE = 'none',
}

export enum UsageFrequency {
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low',
}

export class CreateArtefactDto {
    @IsString()
    name: string;

    @IsString()
    nameTh: string;

    @IsEnum(ArtefactType)
    type: ArtefactType;

    @IsString()
    description: string;

    @IsString()
    owner: string;

    @IsString()
    department: string;

    @IsEnum(ArtefactStatus)
    status: ArtefactStatus;

    @IsEnum(RiskLevel)
    riskLevel: RiskLevel;

    @IsString()
    version: string;

    @IsEnum(UsageFrequency)
    usageFrequency: UsageFrequency;

    @IsOptional()
    @IsInt()
    @Min(0)
    dependencies?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    dependents?: number;
}
