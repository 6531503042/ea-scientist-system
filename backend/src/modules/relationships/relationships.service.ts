import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Relationship, RelationshipDocument } from '../../schemas/relationship.schema';
import { Artefact, ArtefactDocument } from '../../schemas/artefact.schema';
import { CreateRelationshipDto, UpdateRelationshipDto } from './dto';

@Injectable()
export class RelationshipsService {
    private readonly logger = new Logger(RelationshipsService.name);

    constructor(
        @InjectModel(Relationship.name) private relationshipModel: Model<RelationshipDocument>,
        @InjectModel(Artefact.name) private artefactModel: Model<ArtefactDocument>,
    ) { }

    async findAll() {
        return this.relationshipModel
            .find()
            .populate('sourceId')
            .populate('targetId')
            .sort({ createdAt: -1 })
            .exec();
    }

    async findOne(id: string) {
        const relationship = await this.relationshipModel
            .findById(id)
            .populate('sourceId')
            .populate('targetId')
            .exec();

        if (!relationship) {
            throw new NotFoundException(`Relationship with ID ${id} not found`);
        }

        return relationship;
    }

    async getGraphData() {
        const [artefacts, relationships] = await Promise.all([
            this.artefactModel.find().exec(),
            this.relationshipModel.find().exec(),
        ]);

        return {
            nodes: artefacts.map((a) => ({
                id: a._id.toString(),
                label: a.name,
                labelTh: a.nameTh,
                type: a.type,
                status: a.status,
                riskLevel: a.riskLevel,
            })),
            edges: relationships.map((r) => ({
                id: r._id.toString(),
                source: r.sourceId.toString(),
                target: r.targetId.toString(),
                type: r.type,
                label: r.label,
            })),
        };
    }

    async create(dto: CreateRelationshipDto) {
        const relationship = new this.relationshipModel(dto);
        const saved = await relationship.save();

        this.logger.log(`Created relationship: ${saved._id}`);
        return saved;
    }

    async update(id: string, dto: UpdateRelationshipDto) {
        const relationship = await this.relationshipModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();

        if (!relationship) {
            throw new NotFoundException(`Relationship with ID ${id} not found`);
        }

        this.logger.log(`Updated relationship: ${id}`);
        return relationship;
    }

    async remove(id: string) {
        const result = await this.relationshipModel.findByIdAndDelete(id).exec();

        if (!result) {
            throw new NotFoundException(`Relationship with ID ${id} not found`);
        }

        this.logger.log(`Deleted relationship: ${id}`);
        return { deleted: true, id };
    }
}
