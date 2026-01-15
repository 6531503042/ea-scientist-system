import { IsString, IsOptional } from 'class-validator';

export class CreateAuditLogDto {
    @IsString()
    userId: string;

    @IsString()
    action: string;

    @IsString()
    entityType: string;

    @IsString()
    entityId: string;

    @IsOptional()
    @IsString()
    details?: string;

    @IsOptional()
    @IsString()
    ipAddress?: string;

    @IsOptional()
    @IsString()
    userAgent?: string;
}
