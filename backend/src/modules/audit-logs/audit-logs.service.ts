import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { AuditLog, AuditLogDocument } from '../../schemas/audit-log.schema';
import { CreateAuditLogDto, FindAuditLogsDto } from './dto';

@Injectable()
export class AuditLogsService {
    private readonly logger = new Logger(AuditLogsService.name);

    constructor(
        @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    ) { }

    async findAll(query: FindAuditLogsDto) {
        const { userId, action, entityType, startDate, endDate, page = 1, limit = 50 } = query;

        const filter: FilterQuery<AuditLogDocument> = {};

        if (userId) filter.userId = userId;
        if (action) filter.action = { $regex: action, $options: 'i' };
        if (entityType) filter.entityType = entityType;

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.auditLogModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate('userId', 'name email')
                .exec(),
            this.auditLogModel.countDocuments(filter).exec(),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async create(dto: CreateAuditLogDto) {
        const log = new this.auditLogModel(dto);
        const saved = await log.save();

        this.logger.log(`Audit log created: ${dto.action} on ${dto.entityType}:${dto.entityId}`);
        return saved;
    }

    async log(
        userId: string,
        action: string,
        entityType: string,
        entityId: string,
        details?: string,
        ipAddress?: string,
        userAgent?: string,
    ) {
        return this.create({
            userId,
            action,
            entityType,
            entityId,
            details,
            ipAddress,
            userAgent,
        });
    }
}
