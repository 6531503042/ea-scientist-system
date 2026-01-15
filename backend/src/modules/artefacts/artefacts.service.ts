import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Artefact, ArtefactDocument } from '../../schemas/artefact.schema';
import { CreateArtefactDto, UpdateArtefactDto, FindArtefactsDto } from './dto';

@Injectable()
export class ArtefactsService {
    private readonly logger = new Logger(ArtefactsService.name);

    constructor(
        @InjectModel(Artefact.name) private artefactModel: Model<ArtefactDocument>,
    ) { }

    async findAll(query: FindArtefactsDto) {
        const { type, status, riskLevel, search, department, page = 1, limit = 20 } = query;

        const filter: FilterQuery<ArtefactDocument> = {};

        if (type) filter.type = type;
        if (status) filter.status = status;
        if (riskLevel) filter.riskLevel = riskLevel;
        if (department) filter.department = { $regex: department, $options: 'i' };
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { nameTh: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.artefactModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ updatedAt: -1 })
                .exec(),
            this.artefactModel.countDocuments(filter).exec(),
        ]);

        this.logger.log(`Found ${data.length} artefacts (total: ${total})`);

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

    async findOne(id: string) {
        const artefact = await this.artefactModel.findById(id).exec();

        if (!artefact) {
            throw new NotFoundException(`Artefact with ID ${id} not found`);
        }

        return artefact;
    }

    async create(dto: CreateArtefactDto) {
        const artefact = new this.artefactModel(dto);
        const saved = await artefact.save();

        this.logger.log(`Created artefact: ${saved._id}`);
        return saved;
    }

    async update(id: string, dto: UpdateArtefactDto) {
        const artefact = await this.artefactModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();

        if (!artefact) {
            throw new NotFoundException(`Artefact with ID ${id} not found`);
        }

        this.logger.log(`Updated artefact: ${id}`);
        return artefact;
    }

    async remove(id: string) {
        const result = await this.artefactModel.findByIdAndDelete(id).exec();

        if (!result) {
            throw new NotFoundException(`Artefact with ID ${id} not found`);
        }

        this.logger.log(`Deleted artefact: ${id}`);
        return { deleted: true, id };
    }

    async getStats() {
        const [total, byType, byRisk, byStatus] = await Promise.all([
            this.artefactModel.countDocuments().exec(),
            this.artefactModel.aggregate([
                { $group: { _id: '$type', count: { $sum: 1 } } },
            ]).exec(),
            this.artefactModel.aggregate([
                { $group: { _id: '$riskLevel', count: { $sum: 1 } } },
            ]).exec(),
            this.artefactModel.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]).exec(),
        ]);

        return {
            total,
            byType: byType.map((t) => ({ type: t._id, count: t.count })),
            byRisk: byRisk.map((r) => ({ riskLevel: r._id, count: r.count })),
            byStatus: byStatus.map((s) => ({ status: s._id, count: s.count })),
        };
    }
}
