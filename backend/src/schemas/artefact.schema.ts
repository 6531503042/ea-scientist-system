import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ArtefactDocument = Artefact & Document;

@Schema({ timestamps: true })
export class Artefact {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    nameTh: string;

    @Prop({ required: true, enum: ['business', 'data', 'application', 'technology', 'security', 'integration'] })
    type: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    owner: string;

    @Prop({ required: true })
    department: string;

    @Prop({ required: true, enum: ['active', 'draft', 'deprecated', 'planned'] })
    status: string;

    @Prop({ required: true, enum: ['high', 'medium', 'low', 'none'] })
    riskLevel: string;

    @Prop({ required: true })
    version: string;

    @Prop({ required: true, enum: ['high', 'medium', 'low'] })
    usageFrequency: string;

    @Prop({ default: 0 })
    dependencies: number;

    @Prop({ default: 0 })
    dependents: number;
}

export const ArtefactSchema = SchemaFactory.createForClass(Artefact);
