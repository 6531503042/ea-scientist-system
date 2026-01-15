import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    action: string;

    @Prop({ required: true })
    entityType: string;

    @Prop({ required: true })
    entityId: string;

    @Prop()
    details?: string;

    @Prop()
    ipAddress?: string;

    @Prop()
    userAgent?: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
