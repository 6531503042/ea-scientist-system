import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RelationshipDocument = Relationship & Document;

@Schema({ timestamps: true })
export class Relationship {
    @Prop({ type: Types.ObjectId, ref: 'Artefact', required: true })
    sourceId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Artefact', required: true })
    targetId: Types.ObjectId;

    @Prop({ required: true, enum: ['supports', 'uses', 'depends_on', 'manages', 'integrates_with'] })
    type: string;

    @Prop({ required: true })
    label: string;
}

export const RelationshipSchema = SchemaFactory.createForClass(Relationship);
