import { IsOptional, IsEnum, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import {
    ArtefactType,
    ArtefactStatus,
    RiskLevel,
} from './create-artefact.dto';

export class FindArtefactsDto {
    @IsOptional()
    @IsEnum(ArtefactType)
    type?: ArtefactType;

    @IsOptional()
    @IsEnum(ArtefactStatus)
    status?: ArtefactStatus;

    @IsOptional()
    @IsEnum(RiskLevel)
    riskLevel?: RiskLevel;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    department?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 20;
}
