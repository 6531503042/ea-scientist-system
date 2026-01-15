import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto, FindAuditLogsDto } from './dto';

@Controller('audit-logs')
export class AuditLogsController {
    constructor(private readonly auditLogsService: AuditLogsService) { }

    @Get()
    findAll(@Query() query: FindAuditLogsDto) {
        return this.auditLogsService.findAll(query);
    }

    @Post()
    create(@Body() dto: CreateAuditLogDto) {
        return this.auditLogsService.create(dto);
    }
}
